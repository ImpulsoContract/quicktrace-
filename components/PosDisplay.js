import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  X, Plus, Trash2, ShoppingCart, Loader2, FileText, CheckCircle,
  AlertCircle, DollarSign, Calendar, User, Layers, ChevronRight, Eye, Edit,
  Search, Tag, Package, ChevronDown, Clock, Users, Store, LayoutDashboard,
  Check, ArrowLeft, RefreshCw, CloudCheck
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function PosDisplay({
  customers = [],
  profile,
  onExitPos,
  onSaleCreated
}) {
  const { t, locale } = useI18n();

  // POS Sellers state
  const [sellers, setSellers] = useState([]);
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState({ id: "anonymous", name: t('pos.seller_anonymous') || "Anónimo" });

  // Navigation tab in POS: "ticket" (venta actual) or "history" (consultar ventas)
  const [posTab, setPosTab] = useState("ticket");

  // Available stock data
  const [availableElaborations, setAvailableElaborations] = useState([]);
  const [availableGoods, setAvailableGoods] = useState([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);

  // Current Ticket Form State
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [formCustomer, setFormCustomer] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formNotes, setFormNotes] = useState("");
  const [saleItems, setSaleItems] = useState([]);
  const [activeSearchIdx, setActiveSearchIdx] = useState(null);

  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState("idle"); // "idle" | "saving" | "saved" | "error"
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const isInitialLoadRef = useRef(true);
  const autoSaveTimerRef = useRef(null);

  // Finalizing / submitting state
  const [finalizing, setFinalizing] = useState(false);
  const [successSaleMsg, setSuccessSaleMsg] = useState("");

  // History tab state
  const [combinedSales, setCombinedSales] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedSaleId, setExpandedSaleId] = useState(null);
  const [invoicingId, setInvoicingId] = useState(null);
  const [historySearch, setHistorySearch] = useState("");

  const currencySymbol = useMemo(() => {
    const cur = profile?.currency || "EUR";
    const map = { EUR: "€", USD: "$", GBP: "£" };
    return map[cur] || cur;
  }, [profile?.currency]);

  // Fetch sellers
  const fetchSellers = async () => {
    try {
      setLoadingSellers(true);
      const res = await fetch(`/api/client/sellers?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSellers(data.data);
      }
    } catch (err) {
      console.error("Error fetching sellers in POS:", err);
    } finally {
      setLoadingSellers(false);
    }
  };

  // Fetch available elaborations
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

  // Fetch available goods
  const fetchAvailableGoods = async () => {
    try {
      const res = await fetch(`/api/client/goods-for-sale?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAvailableGoods(data.data);
        return data.data;
      }
      return [];
    } catch (err) {
      console.error("Error fetching available goods:", err);
      return [];
    }
  };

  // Fetch sales history
  const fetchSalesHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch(`/api/client/combined-sales?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCombinedSales(data.data);
      }
    } catch (err) {
      console.error("Error fetching sales history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Fetch draft sale for a seller
  const loadDraftForSeller = async (seller, currentElabs = availableElaborations, currentGfs = availableGoods) => {
    try {
      setAutoSaveStatus("saving");
      let url = `/api/client/combined-sales?isDraft=true&t=${Date.now()}`;
      if (seller.id === "anonymous") {
        url += `&sellerName=Anónimo`;
      } else {
        url += `&sellerId=${seller.id}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        // Load the most recent draft for this seller
        const draft = data.data[0];
        setCurrentDraftId(draft.id);
        setFormCustomer(draft.customerId ? draft.customerId.toString() : "");
        setFormDate(draft.date ? new Date(draft.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
        setFormNotes(draft.notes || "");

        // Map draft items with available stock
        const elabItems = (draft.sales || []).map(s => {
          const elab = s.elaboration;
          const found = (currentElabs || []).find(ae => ae.id === s.elaborationId);
          return {
            id: `elab-${s.id}-${Math.random()}`,
            type: 'elaboration',
            elaborationId: s.elaborationId,
            goodsForSaleId: null,
            name: elab?.name || "Lote",
            recipeName: elab?.recipe?.name || "Receta",
            availableStock: found ? found.availableStock : 0,
            unit: elab?.quantityUnit || "unidades",
            unitPrice: found?.unitPrice || elab?.unitPrice || 0,
            quantity: s.quantity != null ? s.quantity.toString() : "",
            price: s.price != null ? s.price.toString() : "",
            searchQuery: ''
          };
        });

        const goodsItems = (draft.goodsSales || []).map(gs => {
          const gfs = gs.goodsForSale;
          const found = (currentGfs || []).find(g => g.id === gs.goodsForSaleId);
          return {
            id: `gfs-${gs.id}-${Math.random()}`,
            type: 'goods_for_sale',
            elaborationId: null,
            goodsForSaleId: gs.goodsForSaleId,
            name: gfs?.name || "Mercancía",
            recipeName: '',
            availableStock: found ? found.stock : (gfs?.stock || 0),
            unit: gfs?.unit || "unidades",
            unitPrice: found?.salePrice || gfs?.salePrice || 0,
            quantity: gs.quantity != null ? gs.quantity.toString() : "",
            price: gs.price != null ? gs.price.toString() : "",
            searchQuery: ''
          };
        });

        setSaleItems([...elabItems, ...goodsItems]);
        setAutoSaveStatus("saved");
        setLastSavedAt(new Date().toLocaleTimeString());
      } else {
        // No draft for this seller: start empty ticket
        setCurrentDraftId(null);
        setFormCustomer("");
        setFormDate(new Date().toISOString().slice(0, 10));
        setFormNotes("");
        setSaleItems([]);
        setAutoSaveStatus("idle");
      }
    } catch (err) {
      console.error("Error loading draft for seller:", err);
      setAutoSaveStatus("error");
    }
  };

  // Initialize POS
  useEffect(() => {
    const init = async () => {
      fetchSellers();
      const [elabs, gfs] = await Promise.all([
        fetchAvailableElaborations(),
        fetchAvailableGoods()
      ]);
      await loadDraftForSeller({ id: "anonymous", name: t('pos.seller_anonymous') || "Anónimo" }, elabs, gfs);
      isInitialLoadRef.current = false;
    };
    init();
  }, []);

  // Close search suggestions on outside click
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (activeSearchIdx !== null && !e.target.closest?.('.pos-combobox-container')) {
        setActiveSearchIdx(null);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [activeSearchIdx]);

  // When switching seller: save current draft if needed and load target seller's draft
  const handleSelectSeller = async (seller) => {
    if (selectedSeller.id === seller.id) return;
    setSelectedSeller(seller);
    setActiveSearchIdx(null);
    await loadDraftForSeller(seller);
  };

  // Add items
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
          searchQuery: ''
        }
      ];
      setActiveSearchIdx(newItems.length - 1);
      return newItems;
    });
  };

  const handleSelectElaboration = (index, elab) => {
    setSaleItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };
      item.type = 'elaboration';
      item.elaborationId = elab.id;
      item.name = elab.name;
      item.recipeName = elab.recipeName;
      item.availableStock = elab.availableStock;
      item.unit = elab.quantityUnit;
      item.unitPrice = elab.unitPrice || 0;
      item.searchQuery = `${elab.recipeName} - ${elab.name}`;

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

  const handleSelectGoods = (index, gfs) => {
    setSaleItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };
      item.type = 'goods_for_sale';
      item.goodsForSaleId = gfs.id;
      item.name = gfs.name;
      item.recipeName = '';
      item.availableStock = gfs.stock || 0;
      item.unit = gfs.unit;
      item.unitPrice = gfs.salePrice || 0;
      item.searchQuery = gfs.name;

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

  // Compute total
  const totalPrice = useMemo(() => {
    return saleItems.reduce((sum, item) => {
      const p = parseFloat(item.price?.toString().replace(',', '.')) || 0;
      return sum + p;
    }, 0);
  }, [saleItems]);

  // Validation
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

  const formErrors = useMemo(() => {
    const errors = {};
    saleItems.forEach((item, idx) => {
      if (item.type === 'elaboration' && !item.elaborationId) return;
      if (item.type === 'goods_for_sale' && !item.goodsForSaleId) return;
      const qty = parseFloat(item.quantity?.toString().replace(',', '.'));
      if (qty > (item.availableStock || 0) + 0.0001) {
        errors[idx] = `La cantidad supera el stock disponible (${item.availableStock} ${item.unit}).`;
      }
    });
    return errors;
  }, [saleItems]);

  const isConfirmedValid = useMemo(() => {
    if (!isDraftValid) return false;
    if (Object.keys(formErrors).length > 0) return false;
    return true;
  }, [isDraftValid, formErrors]);

  // AUTO-SAVE EFFECT
  useEffect(() => {
    if (isInitialLoadRef.current) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    if (!isDraftValid) {
      return;
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        setAutoSaveStatus("saving");
        const payload = {
          customerId: formCustomer ? parseInt(formCustomer) : null,
          date: formDate,
          notes: formNotes,
          isDraft: true,
          sellerId: selectedSeller.id !== "anonymous" ? selectedSeller.id : null,
          sellerName: selectedSeller.name,
          items: saleItems.map(it => ({
            type: it.type,
            elaborationId: it.type === 'elaboration' ? it.elaborationId : null,
            goodsForSaleId: it.type === 'goods_for_sale' ? it.goodsForSaleId : null,
            quantity: parseFloat(it.quantity.toString().replace(',', '.')),
            price: parseFloat(it.price.toString().replace(',', '.'))
          }))
        };

        const url = currentDraftId 
          ? `/api/client/combined-sales/${currentDraftId}`
          : `/api/client/combined-sales`;
        const method = currentDraftId ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok && data.success) {
          if (!currentDraftId && data.data?.id) {
            setCurrentDraftId(data.data.id);
          }
          setAutoSaveStatus("saved");
          setLastSavedAt(new Date().toLocaleTimeString());
        } else {
          setAutoSaveStatus("error");
        }
      } catch (err) {
        console.error("Auto-save error in POS:", err);
        setAutoSaveStatus("error");
      }
    }, 700);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [saleItems, formCustomer, formDate, formNotes, isDraftValid]);

  // Discard current ticket
  const handleDiscardTicket = async () => {
    if (saleItems.length === 0 && !currentDraftId) return;

    if (!confirm(t('pos.discard_confirm') || "¿Estás seguro de que deseas descartar la venta actual? Se eliminará el borrador en curso.")) {
      return;
    }

    if (currentDraftId) {
      try {
        await fetch(`/api/client/combined-sales/${currentDraftId}`, { method: "DELETE" });
      } catch (err) {
        console.error("Error deleting draft ticket:", err);
      }
    }

    setCurrentDraftId(null);
    setFormCustomer("");
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormNotes("");
    setSaleItems([]);
    setActiveSearchIdx(null);
    setAutoSaveStatus("idle");
    setLastSavedAt(null);
  };

  // Finalize / Charge sale
  const handleFinalizeSale = async () => {
    if (!isConfirmedValid) {
      if (Object.keys(formErrors).length > 0) {
        alert("No se puede finalizar la venta: hay productos que superan el stock disponible.");
      } else {
        alert("Completa todos los productos y cantidades antes de finalizar la venta.");
      }
      return;
    }

    setFinalizing(true);
    try {
      const payload = {
        customerId: formCustomer ? parseInt(formCustomer) : null,
        date: formDate,
        notes: formNotes,
        isDraft: false,
        sellerId: selectedSeller.id !== "anonymous" ? selectedSeller.id : null,
        sellerName: selectedSeller.name,
        items: saleItems.map(it => ({
          type: it.type,
          elaborationId: it.type === 'elaboration' ? it.elaborationId : null,
          goodsForSaleId: it.type === 'goods_for_sale' ? it.goodsForSaleId : null,
          quantity: parseFloat(it.quantity.toString().replace(',', '.')),
          price: parseFloat(it.price.toString().replace(',', '.'))
        }))
      };

      const url = currentDraftId 
        ? `/api/client/combined-sales/${currentDraftId}`
        : `/api/client/combined-sales`;
      const method = currentDraftId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessSaleMsg(`${t('pos.sale_completed') || "¡Venta completada con éxito!"} (${totalPrice.toFixed(2)} ${currencySymbol})`);
        
        // Reset current ticket for this seller
        setCurrentDraftId(null);
        setFormCustomer("");
        setFormDate(new Date().toISOString().slice(0, 10));
        setFormNotes("");
        setSaleItems([]);
        setActiveSearchIdx(null);
        setAutoSaveStatus("idle");
        setLastSavedAt(null);

        // Refresh available stock
        await fetchAvailableElaborations();
        await fetchAvailableGoods();
        if (onSaleCreated) onSaleCreated();

        setTimeout(() => setSuccessSaleMsg(""), 4000);
      } else {
        alert(data.error || "Error al finalizar la venta");
      }
    } catch (err) {
      console.error("Error finalizing POS sale:", err);
      alert(t('alerts.connection_error') || "Error de conexión");
    } finally {
      setFinalizing(false);
    }
  };

  // Invoicing for history tab
  const handleDownloadInvoice = (cs) => {
    window.open(`/api/client/combined-sales/${cs.id}/invoice/pdf`, '_blank');
  };

  // All sellers list including Anónimo as first
  const allSellersList = useMemo(() => {
    return [
      { id: "anonymous", name: t('pos.seller_anonymous') || "Anónimo" },
      ...sellers
    ];
  }, [sellers, t]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: 'var(--text-main)' }}>
      {/* Top POS Navigation Bar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1.5px solid var(--border)',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        {/* Left: TPV Brand badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
            color: 'white',
            padding: '0.55rem',
            borderRadius: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(22, 101, 52, 0.25)'
          }}>
            <Store size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: '900', color: 'var(--corp-green)', letterSpacing: '-0.02em' }}>QuickTrace</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '900', background: 'rgba(66, 98, 22, 0.1)', color: 'var(--corp-green)', padding: '0.15rem 0.5rem', borderRadius: '1rem' }}>TPV</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              {profile?.razonSocial || profile?.personName || "Terminal Punto de Venta"}
            </div>
          </div>
        </div>

        {/* Center: Sellers Pills (Always visible at top, including Anónimo first) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', maxWidth: '600px', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.25rem' }}>
            {t('pos.seller_label') || "Vendedor"}:
          </span>
          {allSellersList.map(s => {
            const isSelected = selectedSeller.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectSeller(s)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '2rem',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  border: isSelected ? '1.5px solid var(--corp-green)' : '1px solid var(--border)',
                  background: isSelected ? 'var(--corp-green)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(66, 98, 22, 0.25)' : 'none'
                }}
              >
                <User size={13} />
                <span>{s.name}</span>
                {isSelected && currentDraftId && (
                  <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#fef08a'
                  }} title="Tiene borrador activo" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Auto-save status and Exit to Management Mode button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Auto-save indicator */}
          <div style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {autoSaveStatus === "saving" && (
              <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '700' }}>
                <Loader2 size={13} className="animate-spin" />
                {t('pos.auto_saving') || "Guardando..."}
              </span>
            )}
            {autoSaveStatus === "saved" && (
              <span style={{ color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '700' }}>
                <CheckCircle size={13} />
                {t('pos.auto_saved') || "Autoguardado"} {lastSavedAt && `(${lastSavedAt})`}
              </span>
            )}
            {autoSaveStatus === "error" && (
              <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '700' }}>
                <AlertCircle size={13} />
                Error al guardar
              </span>
            )}
          </div>

          {/* Switch to Management Mode Button */}
          <button
            type="button"
            onClick={onExitPos}
            className="btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.15rem',
              fontSize: '0.85rem',
              fontWeight: '800',
              borderRadius: '0.65rem',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <LayoutDashboard size={16} />
            <span>{t('pos.exit_btn') || "Modo gestión"}</span>
          </button>
        </div>
      </header>

      {/* Success sale banner */}
      {successSaleMsg && (
        <div style={{
          background: '#dcfce7',
          color: '#15803d',
          borderBottom: '1px solid #bbf7d0',
          padding: '0.75rem 1.5rem',
          fontSize: '0.95rem',
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle size={18} />
          <span>{successSaleMsg}</span>
        </div>
      )}

      {/* POS Navigation Tabs: Ticket vs History */}
      <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '1rem 1.5rem 0', display: 'flex', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setPosTab("ticket")}
          style={{
            padding: '0.65rem 1.4rem',
            borderRadius: '0.65rem 0.65rem 0 0',
            border: 'none',
            background: posTab === "ticket" ? '#ffffff' : '#e2e8f0',
            color: posTab === "ticket" ? 'var(--corp-green)' : '#64748b',
            fontWeight: '800',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderTop: posTab === "ticket" ? '3px solid var(--corp-green)' : '3px solid transparent'
          }}
        >
          <ShoppingCart size={16} />
          <span>{t('pos.tab_ticket') || "Venta actual"}</span>
          {saleItems.length > 0 && (
            <span style={{
              background: posTab === "ticket" ? 'var(--corp-green)' : '#94a3b8',
              color: 'white',
              fontSize: '0.72rem',
              padding: '0.1rem 0.45rem',
              borderRadius: '1rem',
              fontWeight: '800'
            }}>
              {saleItems.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setPosTab("history");
            fetchSalesHistory();
          }}
          style={{
            padding: '0.65rem 1.4rem',
            borderRadius: '0.65rem 0.65rem 0 0',
            border: 'none',
            background: posTab === "history" ? '#ffffff' : '#e2e8f0',
            color: posTab === "history" ? 'var(--corp-green)' : '#64748b',
            fontWeight: '800',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderTop: posTab === "history" ? '3px solid var(--corp-green)' : '3px solid transparent'
          }}
        >
          <Layers size={16} />
          <span>{t('pos.tab_history') || "Historial de ventas"}</span>
        </button>
      </div>

      {/* Main POS Container */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 1.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
        {posTab === "ticket" ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '0 1rem 1rem 1rem',
            border: '1px solid var(--border)',
            padding: '1.75rem',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            flex: 1
          }}>
            {/* Ticket Header Inputs: Customer, Date, Notes with inline labels */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
              background: '#f8fafc',
              padding: '1rem 1.25rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--border)'
            }}>
              {/* Cliente */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', minWidth: 'fit-content' }}>
                  {t('combined_sales.col_customer') || "Cliente"}:
                </label>
                <select
                  value={formCustomer}
                  onChange={(e) => setFormCustomer(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border)',
                    fontSize: '0.88rem',
                    background: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="">{t('combined_sales.select_customer') || "Seleccionar cliente"}</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.commercialName || c.fiscalName} {c.nif ? `(${c.nif})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', minWidth: 'fit-content' }}>
                  {t('common.date') || "Fecha"}:
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border)',
                    fontSize: '0.88rem',
                    background: 'white',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Notas */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', minWidth: 'fit-content' }}>
                  {t('combined_sales.notes_label') || "Notas"}:
                </label>
                <input
                  type="text"
                  placeholder={t('combined_sales.notes_placeholder') || "Observaciones..."}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border)',
                    fontSize: '0.88rem',
                    background: 'white',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Items Table / Section */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.85rem',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{t('combined_sales.included_lots') || "Lotes incluidos en la venta"}</span>
                  <span style={{
                    padding: '0.15rem 0.55rem',
                    background: 'rgba(66, 98, 22, 0.1)',
                    color: 'var(--corp-green)',
                    borderRadius: '1rem',
                    fontSize: '0.8rem',
                    fontWeight: '800'
                  }}>
                    {saleItems.length}
                  </span>
                </div>

                {/* Add item buttons placed ABOVE items */}
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleAddElaborationRow}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.55rem 0.95rem',
                      fontSize: '0.82rem',
                      fontWeight: '800',
                      color: '#1d4ed8',
                      background: '#eff6ff',
                      border: '1.5px solid #bfdbfe',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Plus size={15} />
                    <span>{t('combined_sales.btn_add_elaboration') || "Añadir elaborado"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddGoodsRow}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.55rem 0.95rem',
                      fontSize: '0.82rem',
                      fontWeight: '800',
                      color: '#15803d',
                      background: '#f0fdf4',
                      border: '1.5px solid #bbf7d0',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Plus size={15} />
                    <span>{t('combined_sales.btn_add_goods') || "Añadir mercancía en venta"}</span>
                  </button>
                </div>
              </div>

              {saleItems.length === 0 ? (
                <div style={{
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  background: '#f8fafc',
                  borderRadius: '0.75rem',
                  border: '1px dashed var(--border)',
                  color: 'var(--text-muted)'
                }}>
                  <ShoppingCart size={40} style={{ margin: '0 auto 0.75rem', color: '#94a3b8' }} />
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem' }}>
                    El ticket actual está vacío.
                  </p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem' }}>
                    Pulsa en los botones superiores para añadir elaborados o mercancías en venta.
                  </p>
                </div>
              ) : (
                <div style={{
                  position: 'relative',
                  border: '1px solid var(--border)',
                  borderRadius: '0.75rem',
                  minHeight: activeSearchIdx !== null ? '300px' : 'auto',
                  background: '#ffffff'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '700' }}>
                        <th style={{ padding: '0.75rem 1rem' }}>{t('combined_sales.col_product') || "Producto / Lote"}</th>
                        <th style={{ padding: '0.75rem 1rem', width: '150px' }}>{t('combined_sales.col_quantity') || "Cantidad"}</th>
                        <th style={{ padding: '0.75rem 1rem', width: '160px' }}>{t('combined_sales.col_price') || "Precio"} ({currencySymbol})</th>
                        <th style={{ padding: '0.75rem 1rem', width: '50px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {saleItems.map((item, idx) => {
                        const hasProduct = (item.type === 'elaboration' && item.elaborationId) ||
                                           (item.type === 'goods_for_sale' && item.goodsForSaleId);
                        const isSearchOpen = activeSearchIdx === idx;
                        const error = formErrors[idx];

                        return (
                          <tr key={item.id} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                            {/* Product column */}
                            <td style={{ padding: '0.75rem 1rem', position: 'relative', zIndex: isSearchOpen ? 60 : 1 }}>
                              {!hasProduct || isSearchOpen ? (
                                <div className="pos-combobox-container" style={{ position: 'relative' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{
                                      fontSize: '0.7rem',
                                      fontWeight: '800',
                                      padding: '0.15rem 0.45rem',
                                      borderRadius: '0.35rem',
                                      background: item.type === 'elaboration' ? '#eff6ff' : '#f0fdf4',
                                      color: item.type === 'elaboration' ? '#1d4ed8' : '#15803d',
                                      border: item.type === 'elaboration' ? '1px solid #bfdbfe' : '1px solid #bbf7d0',
                                      whiteSpace: 'nowrap'
                                    }}>
                                      {item.type === 'elaboration' ? (t('combined_sales.badge_elaboration') || "[Elaborado]") : (t('combined_sales.badge_goods') || "[Mercancía]")}
                                    </span>
                                    <input
                                      type="text"
                                      autoFocus
                                      placeholder={item.type === 'elaboration' ? (t('combined_sales.search_elaboration_placeholder') || "Buscar lote elaborado...") : (t('combined_sales.search_goods_placeholder') || "Buscar mercancía...")}
                                      value={item.searchQuery || ""}
                                      onChange={(e) => handleUpdateItem(idx, "searchQuery", e.target.value)}
                                      onFocus={() => setActiveSearchIdx(idx)}
                                      style={{
                                        width: '100%',
                                        padding: '0.5rem 0.75rem',
                                        fontSize: '0.85rem',
                                        borderRadius: '0.4rem',
                                        border: '1.5px solid var(--corp-green)',
                                        outline: 'none',
                                        background: 'white'
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (!hasProduct) {
                                          handleRemoveItem(idx);
                                        } else {
                                          setActiveSearchIdx(null);
                                        }
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#64748b',
                                        cursor: 'pointer',
                                        padding: '0.25rem',
                                        display: 'flex',
                                        alignItems: 'center'
                                      }}
                                      title={t('common.cancel') || "Cancelar"}
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>

                                  {/* Dropdown suggestions */}
                                  {isSearchOpen && (
                                    <div style={{
                                      position: 'absolute',
                                      top: 'calc(100% + 4px)',
                                      left: 0,
                                      minWidth: '340px',
                                      width: '100%',
                                      maxWidth: '520px',
                                      background: '#ffffff',
                                      border: '1.5px solid var(--corp-green)',
                                      borderRadius: '0.6rem',
                                      boxShadow: '0 12px 30px -4px rgba(0,0,0,0.2), 0 4px 8px -2px rgba(0,0,0,0.08)',
                                      maxHeight: '260px',
                                      overflowY: 'auto',
                                      zIndex: 9999,
                                      marginTop: '0.25rem'
                                    }}>
                                      {item.type === 'elaboration' ? (
                                        (() => {
                                          const q = (item.searchQuery || "").toLowerCase();
                                          const matches = availableElaborations.filter(e => !q || e.name.toLowerCase().includes(q) || (e.recipeName || "").toLowerCase().includes(q));
                                          if (matches.length === 0) {
                                            return (
                                              <div style={{ padding: '0.85rem', color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center' }}>
                                                {t('combined_sales.no_elabs_match') || "No se encontraron elaboraciones con stock disponible"}
                                              </div>
                                            );
                                          }
                                          return matches.map(elab => (
                                            <div
                                              key={elab.id}
                                              onClick={() => handleSelectElaboration(idx, elab)}
                                              style={{
                                                padding: '0.65rem 0.85rem',
                                                borderBottom: '1px solid #f1f5f9',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                              }}
                                              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                            >
                                              <div>
                                                <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.86rem' }}>{elab.recipeName}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lote: {elab.name}</div>
                                              </div>
                                              <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: '800', background: 'rgba(66, 98, 22, 0.1)', color: 'var(--corp-green)', padding: '0.15rem 0.45rem', borderRadius: '1rem' }}>
                                                  {elab.availableStock} {elab.quantityUnit}
                                                </span>
                                                {elab.unitPrice > 0 && (
                                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{elab.unitPrice.toFixed(2)} {currencySymbol}/ud</div>
                                                )}
                                              </div>
                                            </div>
                                          ));
                                        })()
                                      ) : (
                                        (() => {
                                          const q = (item.searchQuery || "").toLowerCase();
                                          const matches = availableGoods.filter(g => !q || g.name.toLowerCase().includes(q));
                                          if (matches.length === 0) {
                                            return (
                                              <div style={{ padding: '0.85rem', color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center' }}>
                                                {t('combined_sales.no_goods_match') || "No se encontraron mercancías con stock disponible"}
                                              </div>
                                            );
                                          }
                                          return matches.map(gfs => (
                                            <div
                                              key={gfs.id}
                                              onClick={() => handleSelectGoods(idx, gfs)}
                                              style={{
                                                padding: '0.65rem 0.85rem',
                                                borderBottom: '1px solid #f1f5f9',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                              }}
                                              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                            >
                                              <div>
                                                <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.86rem' }}>{gfs.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{gfs.unit}</div>
                                              </div>
                                              <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: '800', background: 'rgba(66, 98, 22, 0.1)', color: 'var(--corp-green)', padding: '0.15rem 0.45rem', borderRadius: '1rem' }}>
                                                  {gfs.stock} {gfs.unit}
                                                </span>
                                                {gfs.salePrice > 0 && (
                                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{gfs.salePrice.toFixed(2)} {currencySymbol}/{gfs.unit}</div>
                                                )}
                                              </div>
                                            </div>
                                          ));
                                        })()
                                      )}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{
                                      fontSize: '0.7rem',
                                      fontWeight: '800',
                                      padding: '0.15rem 0.45rem',
                                      borderRadius: '0.35rem',
                                      background: item.type === 'elaboration' ? '#eff6ff' : '#f0fdf4',
                                      color: item.type === 'elaboration' ? '#1d4ed8' : '#15803d',
                                      border: item.type === 'elaboration' ? '1px solid #bfdbfe' : '1px solid #bbf7d0',
                                      whiteSpace: 'nowrap'
                                    }}>
                                      {item.type === 'elaboration' ? (t('combined_sales.badge_elaboration') || "[Elaborado]") : (t('combined_sales.badge_goods') || "[Mercancía]")}
                                    </span>
                                    <div>
                                      <div style={{ fontWeight: '800', color: 'var(--text-main)' }}>
                                        {item.type === 'elaboration' ? item.recipeName : item.name}
                                      </div>
                                      {item.type === 'elaboration' && (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lote: {item.name}</div>
                                      )}
                                      <div style={{ fontSize: '0.72rem', color: 'var(--corp-green)', fontWeight: '700' }}>
                                        Stock: {item.availableStock} {item.unit}
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setActiveSearchIdx(idx)}
                                    style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '700' }}
                                  >
                                    {t('common.edit') || "Cambiar"}
                                  </button>
                                </div>
                              )}
                              {error && (
                                <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: '700' }}>
                                  {error}
                                </div>
                              )}
                            </td>

                            {/* Quantity column */}
                            <td style={{ padding: '0.75rem 1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <input
                                  type="number"
                                  step="any"
                                  min="0"
                                  placeholder="0"
                                  disabled={!hasProduct}
                                  value={item.quantity}
                                  onChange={(e) => handleUpdateItem(idx, "quantity", e.target.value)}
                                  style={{
                                    width: '80px',
                                    padding: '0.5rem',
                                    borderRadius: '0.4rem',
                                    border: error ? '1.5px solid #ef4444' : '1px solid var(--border)',
                                    fontSize: '0.88rem',
                                    fontWeight: '700',
                                    textAlign: 'right',
                                    outline: 'none',
                                    background: hasProduct ? 'white' : '#f1f5f9'
                                  }}
                                />
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.unit}</span>
                              </div>
                            </td>

                            {/* Price column */}
                            <td style={{ padding: '0.75rem 1rem' }}>
                              <input
                                type="number"
                                step="any"
                                min="0"
                                placeholder="0.00"
                                disabled={!hasProduct}
                                value={item.price}
                                onChange={(e) => handleUpdateItem(idx, "price", e.target.value)}
                                style={{
                                  width: '100px',
                                  padding: '0.5rem',
                                  borderRadius: '0.4rem',
                                  border: '1px solid var(--border)',
                                  fontSize: '0.88rem',
                                  fontWeight: '800',
                                  color: 'var(--corp-green)',
                                  textAlign: 'right',
                                  outline: 'none',
                                  background: hasProduct ? 'white' : '#f1f5f9'
                                }}
                              />
                            </td>

                            {/* Remove action */}
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.35rem', borderRadius: '0.35rem', cursor: 'pointer' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Bottom Checkout & Action Area */}
            <div style={{
              marginTop: 'auto',
              padding: '1.5rem',
              background: '#f8fafc',
              borderRadius: '0.85rem',
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.25rem'
            }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block' }}>
                  {t('combined_sales.total_price') || "Total de la venta"}
                </span>
                <span style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--corp-green)', letterSpacing: '-0.02em' }}>
                  {totalPrice.toFixed(2)} {currencySymbol}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {saleItems.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDiscardTicket}
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fee2e2',
                      color: '#ef4444',
                      fontSize: '0.88rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.85rem 1.25rem',
                      borderRadius: '0.75rem'
                    }}
                  >
                    <Trash2 size={16} />
                    <span>{t('pos.discard_btn') || "Descartar venta"}</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={!isConfirmedValid || finalizing}
                  onClick={handleFinalizeSale}
                  className="btn-primary"
                  style={{
                    padding: '0.9rem 2.5rem',
                    fontSize: '1.05rem',
                    fontWeight: '900',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 14px rgba(66, 98, 22, 0.3)',
                    cursor: !isConfirmedValid || finalizing ? 'not-allowed' : 'pointer',
                    opacity: !isConfirmedValid || finalizing ? 0.6 : 1
                  }}
                >
                  {finalizing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <span>{t('pos.finalize_btn') || "Cobrar / Finalizar venta"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* History Tab in POS */
          <div style={{
            background: '#ffffff',
            borderRadius: '0 1rem 1rem 1rem',
            border: '1px solid var(--border)',
            padding: '1.75rem',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            flex: 1
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>
                {t('pos.tab_history') || "Historial de ventas"}
              </h3>
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder={t('common.search') || "Buscar por cliente o nº..."}
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem 0.45rem 2rem',
                    fontSize: '0.85rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border)',
                    outline: 'none',
                    background: 'white'
                  }}
                />
              </div>
            </div>

            {loadingHistory ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: 'var(--corp-green)' }} />
              </div>
            ) : combinedSales.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No hay ventas registradas.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {combinedSales
                  .filter(cs => {
                    if (!historySearch.trim()) return true;
                    const term = historySearch.toLowerCase();
                    const cust = (cs.customer?.commercialName || cs.customer?.fiscalName || "").toLowerCase();
                    const sName = (cs.sellerName || "").toLowerCase();
                    return cust.includes(term) || sName.includes(term) || `#${cs.id}`.includes(term);
                  })
                  .map(cs => {
                    const isExpanded = expandedSaleId === cs.id;
                    const totalLines = (cs.sales?.length || 0) + (cs.goodsSales?.length || 0);

                    return (
                      <div key={cs.id} style={{ border: '1px solid var(--border)', borderRadius: '0.75rem', overflow: 'hidden' }}>
                        <div style={{ padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isExpanded ? '#f8fafc' : '#ffffff', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: '800', color: 'var(--corp-green)', fontSize: '0.85rem' }}>
                              #{cs.id}
                            </span>
                            {/* Seller Badge */}
                            <span style={{
                              padding: '0.15rem 0.55rem',
                              borderRadius: '1rem',
                              fontSize: '0.72rem',
                              fontWeight: '800',
                              background: '#f1f5f9',
                              color: '#334155',
                              border: '1px solid #cbd5e1',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              <User size={11} />
                              {cs.sellerName || "Gestión"}
                            </span>
                            {/* Draft or confirmed badge */}
                            {cs.isDraft ? (
                              <span style={{ padding: '0.15rem 0.55rem', borderRadius: '1rem', fontSize: '0.72rem', fontWeight: '800', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
                                Borrador
                              </span>
                            ) : (
                              <span style={{ padding: '0.15rem 0.55rem', borderRadius: '1rem', fontSize: '0.72rem', fontWeight: '800', background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }}>
                                Confirmada
                              </span>
                            )}
                            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                              {cs.customer?.commercialName || cs.customer?.fiscalName || "Venta directa"}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {new Date(cs.date).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES')} ({totalLines} líneas)
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '1.15rem', fontWeight: '900', color: 'var(--corp-green)' }}>
                              {cs.totalPrice.toFixed(2)} {currencySymbol}
                            </span>

                            {cs.holdedInvoiceId && (
                              <button
                                type="button"
                                onClick={() => handleDownloadInvoice(cs)}
                                style={{ padding: '0.35rem 0.65rem', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', borderRadius: '0.4rem', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                              >
                                <FileText size={13} /> PDF
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setExpandedSaleId(isExpanded ? null : cs.id)}
                              style={{ padding: '0.35rem', background: '#f1f5f9', border: 'none', borderRadius: '0.4rem', cursor: 'pointer' }}
                            >
                              <Eye size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Details row */}
                        {isExpanded && (
                          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', background: '#fafafa', fontSize: '0.82rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {(cs.sales || []).map(s => (
                                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                                  <span>[Elaborado] {s.elaboration?.recipe?.name || 'Receta'} (Lote: {s.elaboration?.name}) × {s.quantity} {s.elaboration?.quantityUnit}</span>
                                  <span style={{ fontWeight: '700' }}>{s.price.toFixed(2)} {currencySymbol}</span>
                                </div>
                              ))}
                              {(cs.goodsSales || []).map(gs => (
                                <div key={gs.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                                  <span>[Mercancía] {gs.goodsForSale?.name} × {gs.quantity} {gs.goodsForSale?.unit}</span>
                                  <span style={{ fontWeight: '700' }}>{gs.price.toFixed(2)} {currencySymbol}</span>
                                </div>
                              ))}
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
      </main>
    </div>
  );
}
