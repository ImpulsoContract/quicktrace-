import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  X, Plus, Trash2, ShoppingCart, Loader2, FileText, CheckCircle,
  AlertCircle, DollarSign, Calendar, User, Layers, ChevronRight, Eye, Edit,
  Search, Tag, Package, ChevronDown, Clock, Users, Truck
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";
import ManageSellersModal from "@/components/ManageSellersModal";
import DeliveryNoteModal from "@/components/DeliveryNoteModal";
import SelectGoodsLotsModal from "@/components/SelectGoodsLotsModal";
import { generateDeliveryNotePDF } from "@/lib/deliveryNoteGenerator";

export default function CombinedSalesModal({
  isOpen,
  onClose,
  customers = [],
  profile,
  onSaleCreated,
  onNavigateToCustomers,
  initialSaleIdToEdit = null,
  isPage = false
}) {
  const { t, locale } = useI18n();

  const [activeTab, setActiveTab] = useState("list"); // "list" | "new"

  // List view state
  const [combinedSales, setCombinedSales] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [invoicingId, setInvoicingId] = useState(null);
  const [expandedSaleId, setExpandedSaleId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "confirmed" | "drafts"
  const [searchTerm, setSearchTerm] = useState("");

  // New & Edit sale state
  const [editingSaleId, setEditingSaleId] = useState(null);
  const [editingIsDraft, setEditingIsDraft] = useState(false);
  const [submittingDraft, setSubmittingDraft] = useState(false);
  const [isSellersModalOpen, setIsSellersModalOpen] = useState(false);
  const [availableElaborations, setAvailableElaborations] = useState([]);
  const [availableGoods, setAvailableGoods] = useState([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  
  const [formCustomer, setFormCustomer] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formNotes, setFormNotes] = useState("");
  const [saleItems, setSaleItems] = useState([]); 
  const [activeSearchIdx, setActiveSearchIdx] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Goods lot selection modal state
  const [goodsLotModal, setGoodsLotModal] = useState({
    isOpen: false,
    rowIndex: null,
    goods: null,
    initialQuantity: null,
    initialAllocations: null
  });

  // Holded Contact prompt state
  const [contactConfirm, setContactConfirm] = useState({
    isOpen: false,
    combinedSale: null,
    customerName: "",
    customerNif: ""
  });

  const currencySymbol = useMemo(() => {
    const cur = profile?.currency || "EUR";
    const map = { EUR: "€", USD: "$", GBP: "£" };
    return map[cur] || cur;
  }, [profile?.currency]);

  // Fetch combined sales
  const fetchCombinedSales = async () => {
    try {
      setLoadingList(true);
      const res = await fetch(`/api/client/combined-sales?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCombinedSales(data.data);
      }
    } catch (err) {
      console.error("Error fetching combined sales:", err);
    } finally {
      setLoadingList(false);
    }
  };

  // Fetch available elaborations with stock
  const fetchAvailableElaborations = async () => {
    try {
      setLoadingAvailable(true);
      const res = await fetch(`/api/client/elaborations/available?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAvailableElaborations(data.data);
        return data.data;
      }
      return [];
    } catch (err) {
      console.error("Error fetching available elaborations:", err);
      return [];
    } finally {
      setLoadingAvailable(false);
    }
  };

  // Fetch available goods for sale with stock
  const fetchAvailableGoods = async () => {
    try {
      const res = await fetch(`/api/client/goods-for-sale?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        // Only active (non-archived) goods
        setAvailableGoods(data.data);
        return data.data;
      }
      return [];
    } catch (err) {
      console.error("Error fetching available goods for sale:", err);
      return [];
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCombinedSales();
      fetchAvailableElaborations();
      fetchAvailableGoods();
      if (!initialSaleIdToEdit) {
        setSaleItems([]);
        setEditingSaleId(null);
        setFormCustomer("");
        setFormDate(new Date().toISOString().slice(0, 10));
        setFormNotes("");
        setActiveSearchIdx(null);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeTab === "new") {
      fetchAvailableElaborations();
      fetchAvailableGoods();
    }
  }, [activeTab]);

  // Start editing a combined sale
  const handleStartEdit = async (cs) => {
    setEditingSaleId(cs.id);
    setEditingIsDraft(Boolean(cs.isDraft));
    setFormCustomer(cs.customerId ? cs.customerId.toString() : "");
    setFormDate(cs.date ? new Date(cs.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
    setFormNotes(cs.notes || "");
    setActiveSearchIdx(null);

    // Refresh available lists to calculate accurate effective stock
    const [currentAvailableElabs, currentAvailableGoods] = await Promise.all([
      fetchAvailableElaborations(),
      fetchAvailableGoods()
    ]);

    const elabItems = (cs.sales || []).map(s => {
      const elab = s.elaboration;
      const foundInAvailable = (currentAvailableElabs || []).find(ae => ae.id === s.elaborationId);
      const currentAvailable = foundInAvailable ? foundInAvailable.availableStock : 0;
      const totalProduced = parseFloat(elab?.quantityProduced?.toString().replace(',', '.')) || 0;
      const saleQty = s.quantity != null 
        ? s.quantity 
        : (totalProduced > 0 && s.percentage != null ? (totalProduced * s.percentage / 100) : 0);
      const effectiveStock = cs.isDraft ? currentAvailable : Math.max(0, Math.round((currentAvailable + saleQty) * 1000) / 1000);
      const uPrice = (foundInAvailable && foundInAvailable.unitPrice) || elab?.unitPrice || 0;

      return {
        id: `elab-${s.id}-${Math.random()}`,
        type: 'elaboration',
        elaborationId: s.elaborationId,
        goodsForSaleId: null,
        name: elab?.name || "Lote",
        recipeName: elab?.recipe?.name || "Receta",
        availableStock: effectiveStock,
        unit: elab?.quantityUnit || "unidades",
        unitPrice: uPrice,
        quantity: s.quantity != null ? s.quantity.toString() : "",
        price: s.price != null ? s.price.toString() : "",
        searchQuery: ''
      };
    });

    const goodsItems = (cs.goodsSales || []).map(gs => {
      const gfs = gs.goodsForSale;
      const foundInAvailable = (currentAvailableGoods || []).find(g => g.id === gs.goodsForSaleId);
      const currentAvailable = foundInAvailable ? foundInAvailable.stock : (gfs?.stock || 0);
      const saleQty = gs.quantity || 0;
      const effectiveStock = Math.max(0, Math.round((currentAvailable + saleQty) * 1000) / 1000);
      const uPrice = (foundInAvailable && foundInAvailable.salePrice) || gfs?.salePrice || 0;

      return {
        id: `gfs-${gs.id}-${Math.random()}`,
        type: 'goods_for_sale',
        elaborationId: null,
        goodsForSaleId: gs.goodsForSaleId,
        name: gfs?.name || "Mercancía",
        recipeName: '',
        availableStock: effectiveStock,
        unit: gfs?.unit || "unidades",
        unitPrice: uPrice,
        quantity: gs.quantity != null ? gs.quantity.toString() : "",
        price: gs.price != null ? gs.price.toString() : "",
        searchQuery: '',
        lotAllocations: Array.isArray(gs.lotAllocations) ? gs.lotAllocations : []
      };
    });

    setSaleItems([...elabItems, ...goodsItems]);
    setActiveTab("new");
  };

  // Handle initial sale to edit from prop
  useEffect(() => {
    if (isOpen && initialSaleIdToEdit) {
      fetch(`/api/client/combined-sales/${initialSaleIdToEdit}?t=${Date.now()}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            handleStartEdit(data.data);
          }
        })
        .catch(err => console.error("Error loading combined sale to edit:", err));
    }
  }, [isOpen, initialSaleIdToEdit]);

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingSaleId(null);
    setEditingIsDraft(false);
    setSaleItems([]);
    setFormCustomer("");
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormNotes("");
    setActiveSearchIdx(null);
    setActiveTab("list");
  };

  // Add Elaboration row
  const handleAddElaborationRow = () => {
    setSaleItems(prev => {
      const newItems = [
        ...prev,
        {
          id: `new-${Date.now()}-${Math.random()}`,
          type: 'elaboration',
          elaborationId: null,
          goodsForSaleId: null,
          name: '',
          recipeName: '',
          availableStock: 0,
          unit: '',
          unitPrice: 0,
          quantity: '',
          price: '',
          searchQuery: ''
        }
      ];
      setActiveSearchIdx(newItems.length - 1);
      return newItems;
    });
  };

  // Add Goods for Sale row
  const handleAddGoodsRow = () => {
    setSaleItems(prev => {
      const newItems = [
        ...prev,
        {
          id: `new-${Date.now()}-${Math.random()}`,
          type: 'goods_for_sale',
          elaborationId: null,
          goodsForSaleId: null,
          name: '',
          recipeName: '',
          availableStock: 0,
          unit: '',
          unitPrice: 0,
          quantity: '',
          price: '',
          searchQuery: '',
          lotAllocations: []
        }
      ];
      setActiveSearchIdx(newItems.length - 1);
      return newItems;
    });
  };

  // Select an elaboration for a row
  const handleSelectElaboration = (index, elab) => {
    setSaleItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };
      item.elaborationId = elab.id;
      item.name = elab.name;
      item.recipeName = elab.recipeName;
      item.availableStock = elab.availableStock;
      item.unit = elab.quantityUnit || "unidades";
      item.unitPrice = elab.unitPrice || 0;
      item.searchQuery = '';
      if (item.quantity) {
        const qtyNum = parseFloat(item.quantity.toString().replace(',', '.'));
        if (!isNaN(qtyNum) && qtyNum > 0 && item.unitPrice > 0) {
          item.price = (Math.round(qtyNum * item.unitPrice * 100) / 100).toFixed(2);
        }
      }
      updated[index] = item;
      return updated;
    });
    setActiveSearchIdx(null);
  };

  // Select a goods for sale for a row (optional preselectedLot when matched by lot barcode)
  const handleSelectGoods = (index, gfs, preselectedLot = null) => {
    const existingQty = saleItems[index]?.quantity ? parseFloat(saleItems[index].quantity.toString().replace(',', '.')) : null;
    const initialQty = existingQty || 1;
    setSaleItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };
      item.goodsForSaleId = gfs.id;
      item.name = gfs.name;
      item.recipeName = '';
      item.availableStock = gfs.stock || 0;
      item.unit = gfs.unit || "unidades";
      item.unitPrice = gfs.salePrice || 0;
      item.searchQuery = '';
      item.barcode = gfs.barcode || null;

      if (preselectedLot) {
        item.lotAllocations = [{
          receiptId: preselectedLot.id,
          lote: preselectedLot.lote || "",
          quantity: initialQty
        }];
        if (!item.quantity) {
          item.quantity = initialQty.toString();
        }
      } else {
        item.lotAllocations = [];
      }

      if (item.quantity) {
        const qtyNum = parseFloat(item.quantity.toString().replace(',', '.'));
        if (!isNaN(qtyNum) && qtyNum > 0 && item.unitPrice > 0) {
          item.price = (Math.round(qtyNum * item.unitPrice * 100) / 100).toFixed(2);
        }
      }
      updated[index] = item;
      return updated;
    });
    setActiveSearchIdx(null);

    // If no preselectedLot was scanned, open lot selection modal automatically
    if (!preselectedLot) {
      setGoodsLotModal({
        isOpen: true,
        rowIndex: index,
        goods: gfs,
        initialQuantity: existingQty,
        initialAllocations: null
      });
    }
  };

  const handleOpenLotModal = (index) => {
    const item = saleItems[index];
    if (!item || item.type !== 'goods_for_sale' || !item.goodsForSaleId) return;
    const gfs = (availableGoods || []).find(g => g.id === item.goodsForSaleId) || {
      id: item.goodsForSaleId,
      name: item.name,
      stock: item.availableStock,
      unit: item.unit,
      salePrice: item.unitPrice
    };
    setGoodsLotModal({
      isOpen: true,
      rowIndex: index,
      goods: gfs,
      initialQuantity: item.quantity ? parseFloat(item.quantity.toString().replace(',', '.')) : null,
      initialAllocations: item.lotAllocations || []
    });
  };

  const handleConfirmGoodsLots = (allocations, totalQty) => {
    const idx = goodsLotModal.rowIndex;
    if (idx != null && saleItems[idx]) {
      setSaleItems(prev => {
        const updated = [...prev];
        const item = { ...updated[idx] };
        item.lotAllocations = allocations;
        item.quantity = totalQty.toString();
        const unitP = parseFloat(item.unitPrice) || 0;
        item.price = (Math.round(totalQty * unitP * 100) / 100).toFixed(2);
        updated[idx] = item;
        return updated;
      });
    }
    setGoodsLotModal({ isOpen: false, rowIndex: null, goods: null, initialQuantity: null, initialAllocations: null });
  };

  const handleSelectGoodsWithoutLot = (qty) => {
    const idx = goodsLotModal.rowIndex;
    if (idx != null && saleItems[idx]) {
      setSaleItems(prev => {
        const updated = [...prev];
        const item = { ...updated[idx] };
        item.lotAllocations = [];
        if (qty != null && qty > 0) {
          item.quantity = qty.toString();
          const unitP = parseFloat(item.unitPrice) || 0;
          item.price = (Math.round(qty * unitP * 100) / 100).toFixed(2);
        }
        updated[idx] = item;
        return updated;
      });
    }
    setGoodsLotModal({ isOpen: false, rowIndex: null, goods: null, initialQuantity: null, initialAllocations: null });
  };

  // Update item field (quantity or price or searchQuery)
  const handleUpdateItem = (index, field, value) => {
    setSaleItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };

      if (field === "quantity") {
        const qtyNum = parseFloat(value.toString().replace(',', '.'));
        const unitP = parseFloat(item.unitPrice);
        if (!isNaN(qtyNum) && qtyNum > 0 && !isNaN(unitP) && unitP > 0) {
          item.price = (Math.round(qtyNum * unitP * 100) / 100).toFixed(2);
        }
      }

      updated[index] = item;
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setSaleItems(prev => prev.filter((_, i) => i !== index));
    if (activeSearchIdx === index) setActiveSearchIdx(null);
  };

  // Compute total price
  const totalPrice = useMemo(() => {
    return saleItems.reduce((sum, item) => {
      const p = parseFloat(item.price?.toString().replace(',', '.')) || 0;
      return sum + p;
    }, 0);
  }, [saleItems]);

  // Validate form items
  const formErrors = useMemo(() => {
    const errors = {};
    saleItems.forEach((item, idx) => {
      if (item.type === 'elaboration' && !item.elaborationId) {
        errors[idx] = t('combined_sales.select_product_first') || "Debes seleccionar un lote de elaboración.";
        return;
      }
      if (item.type === 'goods_for_sale' && !item.goodsForSaleId) {
        errors[idx] = t('combined_sales.select_product_first') || "Debes seleccionar una mercancía en venta.";
        return;
      }
      const qty = parseFloat(item.quantity?.toString().replace(',', '.'));
      if (item.quantity !== "" && (isNaN(qty) || qty <= 0)) {
        errors[idx] = t('elaboration_sales.quantity_invalid') || "La cantidad debe ser mayor que 0.";
      } else if (item.type === 'elaboration' && qty > item.availableStock + 0.0001) {
        errors[idx] = `La cantidad supera el stock disponible (${item.availableStock} ${item.unit}).`;
      } else if (item.type === 'goods_for_sale' && profile?.blockOutOfStockGoodsSales && qty > item.availableStock + 0.0001) {
        errors[idx] = `No hay suficiente stock disponible (${item.availableStock} ${item.unit}). Venta sin stock bloqueada por configuración.`;
      }
    });
    return errors;
  }, [saleItems, profile?.blockOutOfStockGoodsSales, t]);

  const isDraftValid = useMemo(() => {
    if (saleItems.length === 0) return false;
    for (const item of saleItems) {
      if (item.type === 'elaboration' && !item.elaborationId) return false;
      if (item.type === 'goods_for_sale' && !item.goodsForSaleId) return false;
      const qty = parseFloat(item.quantity?.toString().replace(',', '.'));
      const prc = parseFloat(item.price?.toString().replace(',', '.'));
      if (isNaN(qty) || qty <= 0) return false;
      if (isNaN(prc) || prc < 0) return false;
    }
    return true;
  }, [saleItems]);

  const isConfirmedValid = useMemo(() => {
    if (!isDraftValid) return false;
    if (Object.keys(formErrors).length > 0) return false;
    return true;
  }, [isDraftValid, formErrors]);

  // Submit combined sale (create or edit, confirmed or draft)
  const handleSubmitCombinedSale = async (e, forceDraft = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const saveAsDraft = forceDraft !== null ? forceDraft : false;

    if (saveAsDraft && !isDraftValid) return;
    if (!saveAsDraft && !isConfirmedValid) return;

    if (saveAsDraft) {
      setSubmittingDraft(true);
    } else {
      setSubmitting(true);
    }

    try {
      const payload = {
        customerId: formCustomer ? parseInt(formCustomer) : null,
        sellerId: null,
        sellerName: "Gestión",
        date: formDate,
        notes: formNotes,
        isDraft: saveAsDraft,
        items: saleItems.map(it => ({
          type: it.type,
          elaborationId: it.type === 'elaboration' ? it.elaborationId : null,
          goodsForSaleId: it.type === 'goods_for_sale' ? it.goodsForSaleId : null,
          quantity: parseFloat(it.quantity.toString().replace(',', '.')),
          price: parseFloat(it.price.toString().replace(',', '.')),
          lotAllocations: it.lotAllocations || []
        }))
      };

      const url = editingSaleId 
        ? `/api/client/combined-sales/${editingSaleId}`
        : `/api/client/combined-sales`;
      const method = editingSaleId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (saveAsDraft) {
          alert(editingSaleId 
            ? (t('combined_sales.success_draft_updated') || "Borrador actualizado correctamente.")
            : (t('combined_sales.success_draft_created') || "Borrador guardado correctamente.")
          );
        } else {
          alert(editingSaleId 
            ? (editingIsDraft 
                ? (t('combined_sales.success_confirmed') || "Venta confirmada y registrada correctamente.")
                : (t('combined_sales.success_updated') || "Venta combinada actualizada correctamente."))
            : (t('combined_sales.success_created') || "Venta combinada registrada correctamente.")
          );
        }
        handleCancelEdit();
        
        await fetchCombinedSales();
        await fetchAvailableElaborations();
        await fetchAvailableGoods();
        if (onSaleCreated) onSaleCreated();

        setActiveTab("list");
      } else {
        alert(data.error || (editingSaleId ? "Error al actualizar la venta" : "Error al registrar la venta"));
      }
    } catch (err) {
      console.error("Error saving combined sale:", err);
      alert(t('alerts.connection_error') || "Error de conexión");
    } finally {
      setSubmitting(false);
      setSubmittingDraft(false);
    }
  };

  // Quick confirm a draft sale from list
  const handleQuickConfirmDraft = async (cs) => {
    if (!confirm(t('combined_sales.confirm_quick_prompt') || "¿Deseas confirmar y registrar esta venta? Se descontará el stock correspondiente del inventario.")) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerId: cs.customerId || null,
        date: cs.date,
        notes: cs.notes,
        isDraft: false,
        items: [
          ...(cs.sales || []).map(s => ({
            type: 'elaboration',
            elaborationId: s.elaborationId,
            quantity: s.quantity,
            price: s.price
          })),
          ...(cs.goodsSales || []).map(gs => ({
            type: 'goods_for_sale',
            goodsForSaleId: gs.goodsForSaleId,
            quantity: gs.quantity,
            price: gs.price,
            lotAllocations: gs.lotAllocations || []
          }))
        ]
      };

      const res = await fetch(`/api/client/combined-sales/${cs.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert(t('combined_sales.success_confirmed') || "Venta confirmada y registrada correctamente.");
        await fetchCombinedSales();
        await fetchAvailableElaborations();
        await fetchAvailableGoods();
        if (onSaleCreated) onSaleCreated();
      } else {
        alert(data.error || "Error al confirmar la venta");
      }
    } catch (err) {
      console.error("Error confirming draft:", err);
      alert(t('alerts.connection_error') || "Error de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete combined sale
  const handleDeleteCombinedSale = async (id) => {
    if (!confirm(t('combined_sales.delete_confirm') || "¿Estás seguro de que deseas eliminar esta venta combinada? Se restaurará el stock de todas las elaboraciones incluidas.")) {
      return;
    }

    try {
      const res = await fetch(`/api/client/combined-sales/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(t('combined_sales.delete_success') || "Venta combinada eliminada correctamente.");
        await fetchCombinedSales();
        await fetchAvailableElaborations();
        await fetchAvailableGoods();
        if (onSaleCreated) onSaleCreated();
      } else {
        alert(data.error || "Error al eliminar la venta combinada");
      }
    } catch (err) {
      console.error("Error deleting combined sale:", err);
      alert(t('alerts.connection_error') || "Error de conexión");
    }
  };

  // Generate invoice for combined sale
  const handleInvoiceCombined = async (cs, autoCreate = false) => {
    if (!profile?.holdedApiKey?.trim()) {
      alert(t('combined_sales.holded_api_required') || "Debes configurar tu API Key de Holded en la sección de 'Configuración del negocio' para poder emitir facturas.");
      return;
    }

    if (!cs.customerId && !cs.customer) {
      alert(t('combined_sales.customer_required') || "Debes asignar un cliente registrado a la venta combinada para poder generar la factura.");
      return;
    }

    setInvoicingId(cs.id);
    try {
      const res = await fetch(`/api/client/combined-sales/${cs.id}/invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoCreateContact: autoCreate })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert(data.message || (t('combined_sales.invoice_success') || "Factura {num} generada con éxito.").replace('{num}', data.invoiceNum || ""));
        setContactConfirm({ isOpen: false, combinedSale: null, customerName: "", customerNif: "" });
        await fetchCombinedSales();
        if (onSaleCreated) onSaleCreated();
      } else if (data.contactNotFound) {
        setContactConfirm({
          isOpen: true,
          combinedSale: cs,
          customerName: data.customerName || cs.customer?.commercialName || "",
          customerNif: data.customerNif || cs.customer?.nif || ""
        });
      } else {
        alert(data.error || "Error al generar factura en Holded");
      }
    } catch (err) {
      console.error("Error invoicing combined sale:", err);
      alert(t('alerts.connection_error') || "Error de conexión");
    } finally {
      setInvoicingId(null);
    }
  };

  const handleDownloadInvoice = (cs) => {
    window.open(`/api/client/combined-sales/${cs.id}/invoice/pdf`, '_blank');
  };

  // Delivery Note (Albarán) state
  const [deliveryNoteSale, setDeliveryNoteSale] = useState(null);
  const [generatingDeliveryNote, setGeneratingDeliveryNote] = useState(false);

  const handleConfirmDeliveryNote = async (withPrices) => {
    if (!deliveryNoteSale) return;
    setGeneratingDeliveryNote(true);
    try {
      await generateDeliveryNotePDF({
        sale: deliveryNoteSale,
        customer: deliveryNoteSale.customer,
        profile,
        withPrices,
        locale,
        t
      });
      setDeliveryNoteSale(null);
    } catch (err) {
      console.error("Error generating delivery note:", err);
      alert(t('alerts.connection_error') || "Error al generar el albarán");
    } finally {
      setGeneratingDeliveryNote(false);
    }
  };

  if (!isOpen) return null;

  const confirmedCount = combinedSales.filter(cs => !cs.isDraft).length;
  const draftCount = combinedSales.filter(cs => cs.isDraft).length;

  const filteredCombinedSales = combinedSales.filter(cs => {
    if (statusFilter === "confirmed" && cs.isDraft) return false;
    if (statusFilter === "drafts" && !cs.isDraft) return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const custName = (cs.customer?.commercialName || cs.customer?.fiscalName || "").toLowerCase();
      const nif = (cs.customer?.nif || "").toLowerCase();
      const notes = (cs.notes || "").toLowerCase();
      const idStr = `#${cs.id}`;
      if (!custName.includes(term) && !nif.includes(term) && !notes.includes(term) && !idStr.includes(term)) {
        return false;
      }
    }
    return true;
  });

  const mainViewContent = (
    <div 
      className={isPage ? "combined-sales-page-container" : "modal-content"} 
      style={isPage ? { 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        background: 'white',
        borderRadius: '1.25rem',
        border: '1px solid var(--border)',
        padding: '2rem',
        boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)'
      } : { 
        maxWidth: '980px', 
        width: '95%',
        maxHeight: '92vh', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '1.75rem',
        animation: 'scaleUp 0.2s ease'
      }}
    >
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.25rem', 
        borderBottom: '1px solid var(--border)', 
        paddingBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(66, 98, 22, 0.1)', color: 'var(--corp-green)', padding: '0.6rem', borderRadius: '0.6rem' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: isPage ? '1.85rem' : '1.5rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              {isPage ? (t('sidebar.sales') || "Ventas") : (t('combined_sales.modal_title') || "Ventas combinadas")}
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {t('combined_sales.page_subtitle') || "Registra, edita y consulta ventas compuestas por múltiples elaboraciones y mercancías"}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            type="button"
            onClick={() => setIsSellersModalOpen(true)}
            className="btn-secondary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.5rem 1rem', 
              fontSize: '0.85rem', 
              fontWeight: '700',
              borderRadius: '0.6rem'
            }}
          >
            <Users size={16} />
            {t('sellers.manage_btn') || "Gestionar vendedores"}
          </button>
          {!isPage && onClose && (
            <button 
              onClick={onClose} 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem' }}
            >
              <X size={24} />
            </button>
          )}
        </div>
      </header>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => {
              if (editingSaleId) handleCancelEdit();
              setActiveTab("list");
            }}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: activeTab === "list" ? 'var(--corp-green)' : '#f1f5f9',
              color: activeTab === "list" ? 'white' : '#64748b',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <Layers size={16} />
            {t('combined_sales.tab_list') || "Consultar ventas combinadas"}
            <span style={{ 
              background: activeTab === "list" ? 'rgba(255,255,255,0.25)' : '#cbd5e1', 
              color: activeTab === "list" ? 'white' : '#334155',
              padding: '0.1rem 0.45rem', 
              borderRadius: '1rem', 
              fontSize: '0.72rem' 
            }}>
              {combinedSales.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!editingSaleId) {
                setSaleItems([]);
                setFormCustomer("");
                setFormDate(new Date().toISOString().slice(0, 10));
                setFormNotes("");
                setActiveSearchIdx(null);
              }
              setActiveTab("new");
            }}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: activeTab === "new" ? 'var(--corp-green)' : '#f1f5f9',
              color: activeTab === "new" ? 'white' : '#64748b',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={16} />
            {editingSaleId ? (t('combined_sales.tab_edit') || "Editar venta combinada") : (t('combined_sales.tab_new') || "Nueva venta combinada")}
          </button>
        </div>

        {/* Tab 1: Consultar ventas */}
        {activeTab === "list" && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
              {/* Status pills */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '2rem',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    border: '1px solid',
                    borderColor: statusFilter === "all" ? 'var(--corp-green)' : '#cbd5e1',
                    background: statusFilter === "all" ? 'var(--corp-green)' : 'white',
                    color: statusFilter === "all" ? 'white' : '#475569',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  {t('combined_sales.filter_all') || "Todas"}
                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '1rem', background: statusFilter === "all" ? 'rgba(255,255,255,0.25)' : '#f1f5f9' }}>
                    {combinedSales.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter("confirmed")}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '2rem',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    border: '1px solid',
                    borderColor: statusFilter === "confirmed" ? '#15803d' : '#cbd5e1',
                    background: statusFilter === "confirmed" ? '#15803d' : 'white',
                    color: statusFilter === "confirmed" ? 'white' : '#15803d',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <CheckCircle size={13} />
                  {t('combined_sales.filter_confirmed') || "Confirmadas"}
                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '1rem', background: statusFilter === "confirmed" ? 'rgba(255,255,255,0.25)' : '#dcfce7' }}>
                    {confirmedCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter("drafts")}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '2rem',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    border: '1px solid',
                    borderColor: statusFilter === "drafts" ? '#b45309' : '#cbd5e1',
                    background: statusFilter === "drafts" ? '#b45309' : 'white',
                    color: statusFilter === "drafts" ? 'white' : '#b45309',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Clock size={13} />
                  {t('combined_sales.filter_drafts') || "Borradores"}
                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '1rem', background: statusFilter === "drafts" ? 'rgba(255,255,255,0.25)' : '#fef3c7', color: statusFilter === "drafts" ? 'white' : '#b45309' }}>
                    {draftCount}
                  </span>
                </button>
              </div>

              {/* Search input */}
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder={t('common.search') || "Buscar por cliente o nº..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.4rem 0.6rem 0.4rem 2rem',
                    fontSize: '0.82rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border)',
                    outline: 'none',
                    background: 'white'
                  }}
                />
              </div>
            </div>
            {loadingList ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: 'var(--corp-green)' }} />
              </div>
            ) : filteredCombinedSales.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
                <ShoppingCart size={40} style={{ margin: '0 auto 0.75rem', color: '#94a3b8' }} />
                <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-muted)' }}>
                  {t('combined_sales.no_sales_yet') || "No hay ventas combinadas registradas todavía."}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("new")}
                  className="btn-primary"
                  style={{ marginTop: '1rem', padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> {t('combined_sales.tab_new') || "Crear primera venta combinada"}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {filteredCombinedSales.map(cs => {
                  const isExpanded = expandedSaleId === cs.id;
                  const isInvoicing = invoicingId === cs.id;
                  const totalLines = (cs.sales?.length || 0) + (cs.goodsSales?.length || 0);

                  return (
                    <div 
                      key={cs.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--border)',
                        borderRadius: '0.85rem',
                        overflow: 'hidden',
                        transition: 'box-shadow 0.2s'
                      }}
                    >
                      {/* Main card header */}
                      <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: isExpanded ? '#f8fafc' : '#ffffff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ 
                              padding: '0.3rem 0.65rem', 
                              background: 'rgba(66, 98, 22, 0.1)', 
                              color: 'var(--corp-green)', 
                              borderRadius: '0.4rem', 
                              fontWeight: '800', 
                              fontSize: '0.85rem' 
                            }}>
                              #{cs.id}
                            </span>
                            {cs.isDraft ? (
                              <span style={{ 
                                padding: '0.2rem 0.55rem', 
                                background: '#fef3c7', 
                                color: '#b45309', 
                                border: '1px solid #fde68a', 
                                borderRadius: '1rem', 
                                fontSize: '0.72rem', 
                                fontWeight: '800', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.25rem' 
                              }}>
                                <Clock size={11} />
                                {t('combined_sales.badge_draft') || "Borrador"}
                              </span>
                            ) : (
                              <span style={{ 
                                padding: '0.2rem 0.55rem', 
                                background: '#dcfce7', 
                                color: '#15803d', 
                                border: '1px solid #bbf7d0', 
                                borderRadius: '1rem', 
                                fontSize: '0.72rem', 
                                fontWeight: '800', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.25rem' 
                              }}>
                                <CheckCircle size={11} />
                                {t('combined_sales.badge_confirmed') || "Confirmada"}
                              </span>
                            )}
                            <span style={{ 
                              padding: '0.2rem 0.55rem', 
                              background: '#f1f5f9', 
                              color: '#475569', 
                              border: '1px solid #e2e8f0', 
                              borderRadius: '1rem', 
                              fontSize: '0.72rem', 
                              fontWeight: '700', 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '0.25rem' 
                            }}>
                              <Users size={11} />
                              {cs.sellerName || cs.seller?.name || "Gestión"}
                            </span>
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                              <User size={15} color="var(--text-muted)" />
                              <span>{cs.customer?.commercialName || cs.customer?.fiscalName || (t('combined_sales.no_customer') || "Venta directa / Sin cliente")}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={13} />
                                {new Date(cs.date).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'fr' ? 'fr-FR' : locale === 'it' ? 'it-IT' : locale === 'pt' ? 'pt-PT' : 'es-ES')}
                              </span>
                              <span>•</span>
                              <span>{totalLines} {t('combined_sales.col_items') || "líneas"}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.15rem', fontWeight: '900', color: 'var(--corp-green)' }}>
                            {cs.totalPrice.toFixed(2)} {currencySymbol}
                          </span>

                          {/* Quick confirm button for drafts */}
                          {cs.isDraft && (
                            <button
                              type="button"
                              disabled={submitting}
                              onClick={() => handleQuickConfirmDraft(cs)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.4rem 0.75rem',
                                background: 'var(--corp-green)',
                                border: 'none',
                                color: 'white',
                                borderRadius: '0.4rem',
                                fontSize: '0.78rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                              title={t('combined_sales.confirm_and_register') || "Confirmar y registrar venta"}
                            >
                              <CheckCircle size={14} />
                              {t('combined_sales.confirm_sale') || "Confirmar"}
                            </button>
                          )}

                          {/* Invoice status / buttons */}
                          {cs.holdedInvoiceId ? (
                            <button
                              type="button"
                              onClick={() => handleDownloadInvoice(cs)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.4rem 0.75rem',
                                background: '#ecfdf5',
                                border: '1px solid #a7f3d0',
                                color: '#047857',
                                borderRadius: '0.4rem',
                                fontSize: '0.78rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                              title="Descargar PDF de la factura"
                            >
                              <FileText size={14} />
                              {(t('combined_sales.invoice_badge') || "Factura: {num}").replace('{num}', cs.holdedInvoiceNum || cs.holdedInvoiceId)}
                            </button>
                          ) : cs.isDraft ? (
                            <button
                              type="button"
                              disabled={true}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.4rem 0.75rem',
                                background: '#f1f5f9',
                                border: '1px solid var(--border)',
                                color: '#94a3b8',
                                borderRadius: '0.4rem',
                                fontSize: '0.78rem',
                                fontWeight: '700',
                                cursor: 'not-allowed'
                              }}
                              title={t('combined_sales.draft_invoice_blocked') || "No se puede facturar una venta en borrador. Confírmala primero."}
                            >
                              <FileText size={14} />
                              {t('combined_sales.generate_invoice') || "Facturar"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isInvoicing}
                              onClick={() => handleInvoiceCombined(cs)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.4rem 0.75rem',
                                background: '#f8fafc',
                                border: '1px solid var(--border)',
                                color: '#475569',
                                borderRadius: '0.4rem',
                                fontSize: '0.78rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                              title="Facturar en Holded"
                            >
                              {isInvoicing ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                              {t('combined_sales.generate_invoice') || "Facturar"}
                            </button>
                          )}

                          {/* Delivery note button */}
                          <button
                            type="button"
                            onClick={() => setDeliveryNoteSale(cs)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.4rem 0.75rem',
                              background: '#f0fdf4',
                              border: '1px solid #bbf7d0',
                              color: '#166534',
                              borderRadius: '0.4rem',
                              fontSize: '0.78rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                            title={t('delivery_note.btn_generate_full') || "Generar albarán (PDF)"}
                          >
                            <Truck size={14} />
                            <span>{t('delivery_note.btn_generate') || "Albarán"}</span>
                          </button>

                          {/* Toggle Details button */}
                          <button
                            type="button"
                            onClick={() => setExpandedSaleId(isExpanded ? null : cs.id)}
                            style={{
                              padding: '0.4rem',
                              background: isExpanded ? '#e2e8f0' : '#f1f5f9',
                              border: 'none',
                              borderRadius: '0.4rem',
                              cursor: 'pointer',
                              color: '#475569'
                            }}
                            title={isExpanded ? "Ocultar detalle" : "Ver detalle"}
                          >
                            <Eye size={16} />
                          </button>

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(cs)}
                            style={{
                              padding: '0.4rem',
                              background: '#eff6ff',
                              border: '1px solid #bfdbfe',
                              color: '#1d4ed8',
                              borderRadius: '0.4rem',
                              cursor: 'pointer'
                            }}
                            title={t('combined_sales.edit_btn') || "Editar"}
                          >
                            <Edit size={15} />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteCombinedSale(cs.id)}
                            style={{
                              padding: '0.4rem',
                              background: '#fef2f2',
                              border: '1px solid #fee2e2',
                              color: '#ef4444',
                              borderRadius: '0.4rem',
                              cursor: 'pointer'
                            }}
                            title={t('common.delete') || "Eliminar"}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div style={{ padding: '1rem 1.25rem', background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
                              {t('combined_sales.details_title') || "Líneas incluidas en esta venta:"}
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(cs)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#1d4ed8',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                              }}
                            >
                              <Edit size={14} /> {t('combined_sales.edit_btn') || "Editar venta combinada"}
                            </button>
                          </div>
                          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '0.5rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                              <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                                <tr>
                                  <th style={{ padding: '0.6rem 0.85rem', fontWeight: '800', color: '#64748b' }}>{t('combined_sales.col_product') || "Elaboración / Mercancía"}</th>
                                  <th style={{ padding: '0.6rem 0.85rem', fontWeight: '800', color: '#64748b' }}>Lote / Tipo</th>
                                  <th style={{ padding: '0.6rem 0.85rem', fontWeight: '800', color: '#64748b', textAlign: 'right' }}>Cantidad</th>
                                  <th style={{ padding: '0.6rem 0.85rem', fontWeight: '800', color: '#64748b', textAlign: 'right' }}>Precio</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(cs.sales || []).map((s) => (
                                  <tr key={`elab-${s.id}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '0.6rem 0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                      <span style={{ background: '#dcfce7', color: '#166534', padding: '0.1rem 0.35rem', borderRadius: '0.25rem', fontSize: '0.68rem', fontWeight: '800', marginRight: '0.35rem' }}>
                                        {t('combined_sales.badge_elaboration') || "Elaborado"}
                                      </span>
                                      {s.elaboration?.recipe?.name || s.elaboration?.name || "Elaboración"}
                                    </td>
                                    <td style={{ padding: '0.6rem 0.85rem', color: 'var(--text-muted)' }}>
                                      Lote: {s.elaboration?.name || "-"}
                                    </td>
                                    <td style={{ padding: '0.6rem 0.85rem', textAlign: 'right', fontWeight: '700', color: 'var(--corp-green)' }}>
                                      {s.quantity != null ? `${s.quantity} ${s.elaboration?.quantityUnit || 'ud'}` : `${s.percentage}%`}
                                    </td>
                                    <td style={{ padding: '0.6rem 0.85rem', textAlign: 'right', fontWeight: '800', color: 'var(--text-main)' }}>
                                      {s.price.toFixed(2)} {currencySymbol}
                                    </td>
                                  </tr>
                                ))}
                                {(cs.goodsSales || []).map((gs) => (
                                  <tr key={`gfs-${gs.id}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '0.6rem 0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                      <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.1rem 0.35rem', borderRadius: '0.25rem', fontSize: '0.68rem', fontWeight: '800', marginRight: '0.35rem' }}>
                                        {t('combined_sales.badge_goods') || "Mercancía"}
                                      </span>
                                      {gs.goodsForSale?.name || "Mercancía en venta"}
                                      {Array.isArray(gs.lotAllocations) && gs.lotAllocations.length > 0 && (
                                        <div style={{ fontSize: '0.72rem', color: '#0369a1', marginTop: '0.15rem' }}>
                                          Lotes: {gs.lotAllocations.map(a => `${a.lote || 'Sin ref'} (${a.quantity} ${gs.goodsForSale?.unit || 'ud'})`).join(', ')}
                                        </div>
                                      )}
                                    </td>
                                    <td style={{ padding: '0.6rem 0.85rem', color: 'var(--text-muted)' }}>
                                      {Array.isArray(gs.lotAllocations) && gs.lotAllocations.length > 0
                                        ? gs.lotAllocations.map(a => a.lote || 'Sin ref').join(', ')
                                        : '-'}
                                    </td>
                                    <td style={{ padding: '0.6rem 0.85rem', textAlign: 'right', fontWeight: '700', color: '#0284c7' }}>
                                      {gs.quantity} {gs.goodsForSale?.unit || 'ud'}
                                    </td>
                                    <td style={{ padding: '0.6rem 0.85rem', textAlign: 'right', fontWeight: '800', color: 'var(--text-main)' }}>
                                      {gs.price.toFixed(2)} {currencySymbol}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Nueva / Editar venta combinada */}
        {activeTab === "new" && (
          <form onSubmit={handleSubmitCombinedSale} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Edit Banner if in edit mode */}
            {editingSaleId && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e40af', fontWeight: '800', fontSize: '0.9rem' }}>
                  <Edit size={18} />
                  <span>{(t('combined_sales.edit_combined_sale_title') || "Editando Venta Combinada #{id}").replace('{id}', editingSaleId)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    background: 'white',
                    border: '1px solid #93c5fd',
                    color: '#1e40af',
                    borderRadius: '0.4rem',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {t('combined_sales.cancel_edit') || "Cancelar edición"}
                </button>
              </div>
            )}

            {/* Customer, Date, Notes Box */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '1rem', 
              background: '#f8fafc', 
              padding: '1.25rem', 
              borderRadius: '0.85rem',
              border: '1px solid var(--border)'
            }}>
              <div>
                <label className="label" style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.4rem', display: 'block' }}>
                  {t('combined_sales.customer_label') || "Cliente"}
                </label>
                <select
                  className="input-field"
                  value={formCustomer}
                  onChange={(e) => setFormCustomer(e.target.value)}
                  style={{ margin: 0 }}
                >
                  <option value="">{t('combined_sales.no_customer') || "Venta directa / Sin cliente"}</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.commercialName || c.fiscalName} {c.nif ? `(${c.nif})` : ''}
                    </option>
                  ))}
                </select>
                {onNavigateToCustomers && (
                  <button
                    type="button"
                    onClick={() => onNavigateToCustomers()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--corp-green)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      marginTop: '0.35rem',
                      padding: 0
                    }}
                  >
                    + {t('elaboration_sales.manage_customers_link') || "Añadir o gestionar clientes"}
                  </button>
                )}
              </div>

              <div>
                <label className="label" style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.4rem', display: 'block' }}>
                  {t('combined_sales.date_label') || "Fecha de la venta"} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                  style={{ margin: 0 }}
                />
              </div>

              <div>
                <label className="label" style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.4rem', display: 'block' }}>
                  {t('combined_sales.notes_label') || "Notas / Observaciones"}
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder={t('combined_sales.notes_placeholder') || "Notas opcionales sobre la venta..."}
                  style={{ margin: 0 }}
                />
              </div>
            </div>

            {/* Selected Items Table & Add Buttons */}
            <div style={{ padding: '1.25rem', background: '#ffffff', borderRadius: '0.85rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  {t('combined_sales.selected_elaborations') || "Lotes y mercancías incluidos en la venta"} ({saleItems.length})
                </h3>
              </div>

              {saleItems.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '0.65rem', border: '1px dashed var(--border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {t('combined_sales.no_elaborations_selected') || "No has añadido ninguna línea todavía. Utiliza los botones inferiores para añadir elaboraciones o mercancías en venta."}
                </div>
              ) : (
                <div style={{ overflowX: 'auto', minHeight: activeSearchIdx !== null ? '240px' : 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: '#64748b' }}>
                        <th style={{ padding: '0.6rem 0.85rem', fontWeight: '800', minWidth: '260px' }}>
                          {t('combined_sales.col_product') || "Elaboración / Mercancía"}
                        </th>
                        <th style={{ padding: '0.6rem 0.85rem', fontWeight: '800', width: '130px' }}>
                          {t('combined_sales.col_available_stock') || "Stock disponible"}
                        </th>
                        <th style={{ padding: '0.6rem 0.85rem', fontWeight: '800', width: '170px' }}>
                          {t('combined_sales.col_quantity') || "Cantidad a vender"}
                        </th>
                        <th style={{ padding: '0.6rem 0.85rem', fontWeight: '800', width: '160px' }}>
                          {t('combined_sales.col_price') || "Precio de venta"}
                        </th>
                        <th style={{ padding: '0.6rem 0.85rem', width: '45px', textAlign: 'center' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {saleItems.map((item, idx) => {
                        const hasError = formErrors[idx];
                        const isSearchOpen = activeSearchIdx === idx;
                        const isElab = item.type === 'elaboration';
                        const isGoods = item.type === 'goods_for_sale';
                        const isSelected = isElab ? !!item.elaborationId : !!item.goodsForSaleId;

                        // Filter matches for combobox
                        const query = (item.searchQuery || "").toLowerCase().trim();
                        const elabMatches = isElab ? availableElaborations.filter(e => {
                          const alreadySelectedInAnotherRow = saleItems.some((it, i) => i !== idx && it.type === 'elaboration' && it.elaborationId === e.id);
                          if (alreadySelectedInAnotherRow) return false;
                          if (!query) return true;
                          return e.recipeName.toLowerCase().includes(query) || e.name.toLowerCase().includes(query);
                        }) : [];

                        const goodsMatches = isGoods ? availableGoods.filter(g => {
                          const alreadySelectedInAnotherRow = saleItems.some((it, i) => i !== idx && it.type === 'goods_for_sale' && it.goodsForSaleId === g.id);
                          if (alreadySelectedInAnotherRow) return false;
                          if (!query) return true;
                          const matchesName = (g.name || "").toLowerCase().includes(query);
                          const matchesUnit = (g.unit || "").toLowerCase().includes(query);
                          const matchesBarcode = g.barcode && g.barcode.toLowerCase().includes(query);
                          const matchesLot = g.goodsReceipts && g.goodsReceipts.some(r => 
                            (r.barcode && r.barcode.toLowerCase().includes(query)) ||
                            (r.lote && r.lote.toLowerCase().includes(query))
                          );
                          return matchesName || matchesUnit || matchesBarcode || matchesLot;
                        }) : [];

                        return (
                          <tr key={item.id || idx} style={{ borderBottom: '1px solid var(--border)' }}>
                            
                            {/* Column 1: Searchable Combobox / Selected Product */}
                            <td style={{ padding: '0.75rem 0.85rem', position: 'relative' }}>
                              {!isSelected || isSearchOpen ? (
                                <div style={{ position: 'relative' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ 
                                      background: isElab ? '#dcfce7' : '#e0f2fe', 
                                      color: isElab ? '#166534' : '#0369a1', 
                                      padding: '0.15rem 0.45rem', 
                                      borderRadius: '0.3rem', 
                                      fontSize: '0.7rem', 
                                      fontWeight: '800',
                                      whiteSpace: 'nowrap'
                                    }}>
                                      {isElab ? (t('combined_sales.badge_elaboration') || "Elaborado") : (t('combined_sales.badge_goods') || "Mercancía")}
                                    </span>
                                    
                                    <div style={{ position: 'relative', flex: 1 }}>
                                      <Search size={14} style={{ position: 'absolute', left: '0.55rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                      <input
                                        type="text"
                                        autoFocus={isSearchOpen}
                                        value={item.searchQuery || ""}
                                        onFocus={() => setActiveSearchIdx(idx)}
                                        onChange={(e) => handleUpdateItem(idx, "searchQuery", e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (isGoods && goodsMatches.length > 0) {
                                              const g = goodsMatches[0];
                                              const matchedLot = query ? g.goodsReceipts?.find(r => r.barcode && r.barcode.toLowerCase() === query) : null;
                                              handleSelectGoods(idx, g, matchedLot || null);
                                            } else if (isElab && elabMatches.length > 0) {
                                              handleSelectElaboration(idx, elabMatches[0]);
                                            }
                                          }
                                        }}
                                        placeholder={isElab 
                                          ? (t('combined_sales.search_elaboration_placeholder') || "Buscar lote de elaboración...") 
                                          : (t('combined_sales.search_goods_placeholder') || "Buscar mercancía en venta...")}
                                        className="input-field"
                                        style={{
                                          margin: 0,
                                          padding: '0.4rem 0.6rem 0.4rem 1.85rem',
                                          fontSize: '0.82rem',
                                          borderColor: hasError && !isSelected ? '#ef4444' : undefined
                                        }}
                                      />
                                    </div>

                                    {isSelected && (
                                      <button
                                        type="button"
                                        onClick={() => setActiveSearchIdx(null)}
                                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.2rem' }}
                                        title={t('common.cancel') || "Cancelar"}
                                      >
                                        <X size={15} />
                                      </button>
                                    )}
                                  </div>

                                  {/* Floating Dropdown Results */}
                                  {isSearchOpen && (
                                    <div style={{
                                      position: 'absolute',
                                      top: 'calc(100% + 4px)',
                                      left: 0,
                                      right: 0,
                                      background: '#ffffff',
                                      border: '1px solid #cbd5e1',
                                      borderRadius: '0.5rem',
                                      boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
                                      maxHeight: '220px',
                                      overflowY: 'auto',
                                      zIndex: 100
                                    }}>
                                      {isElab ? (
                                        elabMatches.length === 0 ? (
                                          <div style={{ padding: '0.75rem', color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center' }}>
                                            {t('combined_sales.no_elabs_match') || "No se encontraron elaboraciones con stock disponible"}
                                          </div>
                                        ) : (
                                          elabMatches.map(e => (
                                            <div
                                              key={e.id}
                                              onClick={() => handleSelectElaboration(idx, e)}
                                              style={{
                                                padding: '0.55rem 0.75rem',
                                                borderBottom: '1px solid #f1f5f9',
                                                cursor: 'pointer',
                                                transition: 'background 0.15s'
                                              }}
                                              onMouseEnter={(ev) => ev.currentTarget.style.background = '#f8fafc'}
                                              onMouseLeave={(ev) => ev.currentTarget.style.background = 'transparent'}
                                            >
                                              <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.84rem' }}>
                                                {e.recipeName}
                                              </div>
                                              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '0.5rem', marginTop: '0.15rem' }}>
                                                <span>Lote: <strong>{e.name}</strong></span>
                                                <span>•</span>
                                                <span>Disp: <strong>{e.availableStock} {e.quantityUnit}</strong></span>
                                                {Number(e.unitPrice) > 0 && (
                                                  <>
                                                    <span>•</span>
                                                    <span style={{ color: 'var(--corp-green)', fontWeight: '700' }}>
                                                      PVP: {Number(e.unitPrice).toFixed(2)} {currencySymbol}/{e.quantityUnit}
                                                    </span>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          ))
                                        )
                                      ) : (
                                        goodsMatches.length === 0 ? (
                                          <div style={{ padding: '0.75rem', color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center' }}>
                                            {t('combined_sales.no_goods_match') || "No se encontraron mercancías con stock disponible"}
                                          </div>
                                        ) : (
                                          goodsMatches.map(g => {
                                            const matchedLot = query ? g.goodsReceipts?.find(r => r.barcode && r.barcode.toLowerCase() === query) : null;
                                            return (
                                            <div
                                              key={g.id}
                                              onClick={() => handleSelectGoods(idx, g, matchedLot || null)}
                                              style={{
                                                padding: '0.55rem 0.75rem',
                                                borderBottom: '1px solid #f1f5f9',
                                                cursor: 'pointer',
                                                transition: 'background 0.15s'
                                              }}
                                              onMouseEnter={(ev) => ev.currentTarget.style.background = '#f8fafc'}
                                              onMouseLeave={(ev) => ev.currentTarget.style.background = 'transparent'}
                                            >
                                              <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.84rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span>{g.name}</span>
                                                {g.barcode && (
                                                  <span style={{ fontSize: '0.68rem', color: '#0369a1', background: '#e0f2fe', padding: '0.1rem 0.35rem', borderRadius: '0.25rem', fontFamily: 'monospace' }}>
                                                    🏷️ {g.barcode}
                                                  </span>
                                                )}
                                              </div>
                                              {matchedLot && (
                                                <div style={{ fontSize: '0.72rem', color: '#047857', marginTop: '0.15rem', fontWeight: 600 }}>
                                                  {t('combined_sales.lot_barcode_matched') || "Lote coincidente"}: {matchedLot.lote || matchedLot.barcode}
                                                </div>
                                              )}
                                              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '0.5rem', marginTop: '0.15rem' }}>
                                                <span>Disp: <strong>{g.stock} {g.unit}</strong></span>
                                                {Number(g.salePrice) > 0 && (
                                                  <>
                                                    <span>•</span>
                                                    <span style={{ color: '#0369a1', fontWeight: '700' }}>
                                                      PVP: {Number(g.salePrice).toFixed(2)} {currencySymbol}/{g.unit}
                                                    </span>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          );
                                          })
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                      <span style={{ 
                                        background: isElab ? '#dcfce7' : '#e0f2fe', 
                                        color: isElab ? '#166534' : '#0369a1', 
                                        padding: '0.1rem 0.4rem', 
                                        borderRadius: '0.25rem', 
                                        fontSize: '0.7rem', 
                                        fontWeight: '800' 
                                      }}>
                                        {isElab ? (t('combined_sales.badge_elaboration') || "Elaborado") : (t('combined_sales.badge_goods') || "Mercancía")}
                                      </span>
                                      <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                                        {isElab ? item.recipeName : item.name}
                                      </span>
                                      {isGoods && (item.barcode || availableGoods.find(g => g.id === item.goodsForSaleId)?.barcode) && (
                                        <span style={{ fontSize: '0.68rem', color: '#0369a1', background: '#e0f2fe', padding: '0.1rem 0.35rem', borderRadius: '0.25rem', fontFamily: 'monospace' }}>
                                          🏷️ {item.barcode || availableGoods.find(g => g.id === item.goodsForSaleId)?.barcode}
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                                      {isElab && (
                                        <span>Lote: <strong>{item.name}</strong> • </span>
                                      )}
                                      {Number(item.unitPrice) > 0 ? (
                                        <span style={{ color: isElab ? 'var(--corp-green)' : '#0284c7', fontWeight: '700' }}>
                                          PVP: {Number(item.unitPrice).toFixed(2)} {currencySymbol}/{item.unit}
                                        </span>
                                      ) : (
                                        <span>Sin PVP unitario</span>
                                      )}
                                    </div>

                                    {isGoods && (
                                      <div style={{ marginTop: '0.35rem' }}>
                                        <button
                                          type="button"
                                          onClick={() => handleOpenLotModal(idx)}
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            padding: '0.2rem 0.55rem',
                                            borderRadius: '0.4rem',
                                            fontSize: '0.73rem',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            background: (item.lotAllocations && item.lotAllocations.length > 0) ? '#ecfdf5' : '#f1f5f9',
                                            color: (item.lotAllocations && item.lotAllocations.length > 0) ? '#065f46' : '#475569',
                                            border: (item.lotAllocations && item.lotAllocations.length > 0) ? '1px solid #a7f3d0' : '1px solid #cbd5e1'
                                          }}
                                        >
                                          <Layers size={13} />
                                          {item.lotAllocations && item.lotAllocations.length > 0 ? (
                                            <span>
                                              Lotes: {item.lotAllocations.map(a => `${a.lote || 'Sin ref'} (${a.quantity} ${item.unit})`).join(', ')}
                                            </span>
                                          ) : (
                                            <span>Sin lote asignado (clic para asignar)</span>
                                          )}
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setActiveSearchIdx(idx)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#3b82f6',
                                      fontSize: '0.75rem',
                                      fontWeight: '700',
                                      cursor: 'pointer',
                                      textDecoration: 'underline',
                                      padding: '0.2rem 0.4rem'
                                    }}
                                  >
                                    {t('common.change') || "Cambiar"}
                                  </button>
                                </div>
                              )}

                              {hasError && (
                                <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: '600', marginTop: '0.25rem', display: 'block' }}>
                                  {hasError}
                                </span>
                              )}
                            </td>

                            {/* Column 2: Available Stock */}
                            <td style={{ padding: '0.75rem 0.85rem' }}>
                              {isSelected ? (
                                <span style={{ 
                                  padding: '0.2rem 0.55rem', 
                                  background: isElab ? 'rgba(66, 98, 22, 0.08)' : 'rgba(2, 132, 199, 0.08)', 
                                  color: isElab ? 'var(--corp-green)' : '#0284c7', 
                                  borderRadius: '0.35rem', 
                                  fontSize: '0.78rem', 
                                  fontWeight: '700' 
                                }}>
                                  {item.availableStock} {item.unit}
                                </span>
                              ) : (
                                <span style={{ color: '#cbd5e1' }}>-</span>
                              )}
                            </td>

                            {/* Column 3: Quantity */}
                            <td style={{ padding: '0.75rem 0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <input
                                  type="number"
                                  step="any"
                                  min="0.001"
                                  max={isSelected && (item.type === 'elaboration' || profile?.blockOutOfStockGoodsSales) ? item.availableStock : undefined}
                                  disabled={!isSelected}
                                  className="input-field"
                                  value={item.quantity}
                                  onChange={(e) => handleUpdateItem(idx, "quantity", e.target.value)}
                                  placeholder={isSelected ? "0" : (t('combined_sales.select_product_first') || "Selecciona")}
                                  required
                                  style={{
                                    margin: 0,
                                    padding: '0.4rem 0.6rem',
                                    fontSize: '0.85rem',
                                    borderColor: hasError ? '#ef4444' : undefined,
                                    background: !isSelected ? '#f8fafc' : '#ffffff'
                                  }}
                                />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', minWidth: '35px' }}>
                                  {item.unit || ""}
                                </span>
                              </div>
                            </td>

                            {/* Column 4: Price */}
                            <td style={{ padding: '0.75rem 0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  disabled={!isSelected}
                                  className="input-field"
                                  value={item.price}
                                  onChange={(e) => handleUpdateItem(idx, "price", e.target.value)}
                                  placeholder="0.00"
                                  required
                                  style={{
                                    margin: 0,
                                    padding: '0.4rem 0.6rem',
                                    fontSize: '0.85rem',
                                    background: !isSelected ? '#f8fafc' : '#ffffff'
                                  }}
                                />
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                                  {currencySymbol}
                                </span>
                              </div>
                            </td>

                            {/* Column 5: Remove */}
                            <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  padding: '0.35rem',
                                  borderRadius: '0.35rem'
                                }}
                                title={t('common.delete') || "Quitar"}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Action Buttons Below the Table */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleAddElaborationRow}
                  style={{
                    padding: '0.55rem 1.15rem',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    color: '#166534',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#dcfce7'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f0fdf4'}
                >
                  <Plus size={16} />
                  {t('combined_sales.btn_add_elaboration') || "Añadir elaborado"}
                </button>

                <button
                  type="button"
                  onClick={handleAddGoodsRow}
                  style={{
                    padding: '0.55rem 1.15rem',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: '#eff6ff',
                    border: '1px solid #93c5fd',
                    color: '#1e40af',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#dbeafe'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#eff6ff'}
                >
                  <Plus size={16} />
                  {t('combined_sales.btn_add_goods') || "Añadir mercancía en venta"}
                </button>
              </div>
            </div>

            {/* Total and Actions */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '1.25rem', 
              background: '#f8fafc', 
              borderRadius: '0.85rem', 
              border: '1px solid var(--border)',
              marginTop: 'auto',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block' }}>
                  {t('combined_sales.total_price') || "Total de la venta combinada"}
                </span>
                <span style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--corp-green)' }}>
                  {totalPrice.toFixed(2)} {currencySymbol}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn-secondary"
                  style={{ padding: '0.75rem 1.25rem', fontSize: '0.88rem' }}
                >
                  {t('common.cancel') || "Cancelar"}
                </button>

                {/* Guardar como borrador button (when creating or editing a draft) */}
                {(!editingSaleId || editingIsDraft) && (
                  <button
                    type="button"
                    disabled={!isDraftValid || submitting || submittingDraft}
                    onClick={(e) => handleSubmitCombinedSale(e, true)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: '#f8fafc',
                      color: '#475569',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      fontWeight: '700',
                      cursor: !isDraftValid || submitting || submittingDraft ? 'not-allowed' : 'pointer',
                      opacity: !isDraftValid || submitting || submittingDraft ? 0.6 : 1
                    }}
                  >
                    {submittingDraft ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {t('combined_sales.saving') || "Guardando..."}
                      </>
                    ) : (
                      <>
                        <FileText size={16} />
                        {editingSaleId 
                          ? (t('combined_sales.save_draft_changes') || "Guardar borrador")
                          : (t('combined_sales.save_draft') || "Guardar como borrador")}
                      </>
                    )}
                  </button>
                )}

                {/* Confirmar / Registrar venta button */}
                <button
                  type="button"
                  disabled={!isConfirmedValid || submitting || submittingDraft}
                  onClick={(e) => handleSubmitCombinedSale(e, false)}
                  className="btn-primary"
                  style={{ 
                    padding: '0.75rem 1.75rem', 
                    fontSize: '0.88rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    opacity: !isConfirmedValid ? 0.6 : 1,
                    cursor: !isConfirmedValid ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {t('combined_sales.saving') || "Guardando..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      {editingSaleId 
                        ? (editingIsDraft 
                            ? (t('combined_sales.confirm_and_register') || "Confirmar y registrar venta")
                            : (t('combined_sales.save_changes') || "Guardar cambios"))
                        : (t('combined_sales.submit_btn') || "Registrar venta")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        <ManageSellersModal
          isOpen={isSellersModalOpen}
          onClose={() => setIsSellersModalOpen(false)}
        />

        <DeliveryNoteModal
          isOpen={Boolean(deliveryNoteSale)}
          onClose={() => setDeliveryNoteSale(null)}
          onConfirm={handleConfirmDeliveryNote}
          saleSummary={deliveryNoteSale ? `${deliveryNoteSale.customer?.commercialName || t('delivery_note.direct_sale') || 'Venta directa'} • #${deliveryNoteSale.id} • ${new Date(deliveryNoteSale.date).toLocaleDateString()}` : null}
          isGenerating={generatingDeliveryNote}
        />

        <SelectGoodsLotsModal
          isOpen={goodsLotModal.isOpen}
          goods={goodsLotModal.goods}
          initialQuantity={goodsLotModal.initialQuantity}
          initialAllocations={goodsLotModal.initialAllocations}
          currency={profile?.currency || "EUR"}
          onConfirm={handleConfirmGoodsLots}
          onSelectWithoutLot={handleSelectGoodsWithoutLot}
          onClose={() => setGoodsLotModal({ isOpen: false, rowIndex: null, goods: null, initialQuantity: null, initialAllocations: null })}
        />
      </div>
    );

  if (isPage) {
    return mainViewContent;
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      {mainViewContent}
    </div>
  );
}
