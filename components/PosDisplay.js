"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Store, MonitorX, ArrowLeft, Search, Plus, Minus, Trash2, Check,
  CheckCircle2, AlertCircle, ShoppingCart, User, Users, FileText,
  Loader2, RefreshCw, X, Tag, Package, CreditCard, Banknote, 
  Layers, ChevronRight, Hash, Delete, ScanBarcode
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";
import SelectGoodsLotsModal from "@/components/SelectGoodsLotsModal";

export default function PosDisplay({
  customers = [],
  profile,
  onExitPos,
  onSaleCreated
}) {
  const { t } = useI18n();

  // 1. SCREEN SIZE CONSTRAINT (< 768px shows error)
  const [isScreenTooSmall, setIsScreenTooSmall] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsScreenTooSmall(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. SELLERS & ACTIVE SELLER
  const [sellers, setSellers] = useState([]);
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [activeSellerId, setActiveSellerId] = useState("anonymous");

  // All sellers list with Anonymous always first
  const allSellers = useMemo(() => {
    return [
      { id: "anonymous", name: t('pos.seller_anonymous') || "Anónimo" },
      ...sellers
    ];
  }, [sellers, t]);

  const activeSeller = useMemo(() => {
    return allSellers.find(s => s.id?.toString() === activeSellerId?.toString()) || allSellers[0];
  }, [allSellers, activeSellerId]);

  // 3. PRODUCTS DATA (Elaborations & Goods for sale)
  const [availableElaborations, setAvailableElaborations] = useState([]);
  const [availableGoods, setAvailableGoods] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("all"); // "all" | "elaborations" | "goods"
  const [families, setFamilies] = useState([]);
  const [selectedFamilyId, setSelectedFamilyId] = useState(null); // null means all families

  // 4. TOP BAR SCALE INDICATOR & SELECTION STATE
  const [weightInput, setWeightInput] = useState(""); // User editable kg input (or scale)
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product from Column 2
  const [quantityUnits, setQuantityUnits] = useState(1); // Quantity multiplier from Column 3
  const [quantityString, setQuantityString] = useState("1"); // Keypad display string
  const [isQtyFresh, setIsQtyFresh] = useState(true); // Flag to overwrite "1" on initial number tap

  // Lots modal for goods
  const [goodsLotModal, setGoodsLotModal] = useState({
    isOpen: false,
    goods: null,
    product: null,
    editingItemId: null,
    initialQuantity: null,
    initialAllocations: null
  });

  // Sync quantityUnits whenever quantityString changes
  useEffect(() => {
    const val = parseFloat(quantityString);
    setQuantityUnits(isNaN(val) || val <= 0 ? 1 : val);
  }, [quantityString]);

  const handleKeypadDigit = (digit) => {
    setQuantityString(prev => {
      if (isQtyFresh || prev === "1" || prev === "0" || !prev) {
        setIsQtyFresh(false);
        return digit.toString();
      }
      if (prev.length >= 4) return prev;
      return prev + digit.toString();
    });
  };

  const handleKeypadClear = () => {
    setQuantityString("1");
    setIsQtyFresh(true);
  };

  const handleKeypadBackspace = () => {
    setQuantityString(prev => {
      if (isQtyFresh || prev.length <= 1) {
        setIsQtyFresh(true);
        return "1";
      }
      const next = prev.slice(0, -1);
      return next || "1";
    });
  };

  // 5. BARCODE / PRODUCT CODE SEARCH
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodeError, setBarcodeError] = useState("");
  const barcodeInputRef = useRef(null);

  const handleBarcodeSearch = (rawCode) => {
    const code = (rawCode || "").trim();
    if (!code) return;

    // Search exclusively in availableElaborations as requested ("De momento solo con las elaboraciones")
    const foundElab = availableElaborations.find(e => {
      const eBarcode = (e.barcode || "").toString().trim();
      const eName = (e.name || "").toString().trim().toLowerCase();
      const eId = (e.id || "").toString();
      const cleanCode = code.toLowerCase();

      return (eBarcode && eBarcode === code) ||
             (eId === code) ||
             (eName === cleanCode);
    });

    if (foundElab) {
      const productObj = {
        id: `elab_${foundElab.id}`,
        rawId: foundElab.id,
        type: 'elaboration',
        elaborationId: foundElab.id,
        goodsForSaleId: null,
        name: foundElab.name,
        recipeName: foundElab.recipeName,
        displayName: foundElab.recipeName ? `${foundElab.recipeName} (${foundElab.name})` : foundElab.name,
        unitPrice: foundElab.unitPrice || 0,
        unit: foundElab.quantityUnit || "kg",
        availableStock: foundElab.availableStock || 0,
        productFamilyId: foundElab.productFamilyId || null,
        barcode: foundElab.barcode || null
      };

      setSelectedProduct(productObj);
      setBarcodeInput("");
      setBarcodeError("");
      setSuccessToast(`✓ ${productObj.displayName}`);
      setTimeout(() => setSuccessToast(""), 3000);
    } else {
      const notFoundMsg = t('pos.barcode_not_found', { code }) || `No se encontró elaboración con código: ${code}`;
      setBarcodeError(notFoundMsg);
      setTimeout(() => setBarcodeError(""), 3500);
    }
  };

  // 6. DRAFTS MAP BY SELLER: { [sellerId]: { draftId, customerId, date, notes, items: [] } }
  const [draftsBySeller, setDraftsBySeller] = useState({
    anonymous: {
      draftId: null,
      sellerId: null,
      sellerName: t('pos.seller_anonymous') || "Anónimo",
      customerId: null,
      date: new Date().toISOString().slice(0, 10),
      notes: "",
      items: []
    }
  });

  // Autosave status indicator
  const [autoSaveStatus, setAutoSaveStatus] = useState("idle"); // "idle" | "saving" | "saved" | "error"
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const autoSaveTimerRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  // 6. MODALS
  const [checkoutSeller, setCheckoutSeller] = useState(null); // When reviewing a seller's sale to finalize
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState("cash");
  const [checkoutAmountPaid, setCheckoutAmountPaid] = useState("");
  const [checkoutCustomer, setCheckoutCustomer] = useState("");
  const [checkoutNotes, setCheckoutNotes] = useState("");
  const [finalizing, setFinalizing] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  const currencySymbol = useMemo(() => {
    const cur = profile?.currency || "EUR";
    const map = { EUR: "€", USD: "$", GBP: "£" };
    return map[cur] || cur;
  }, [profile?.currency]);

  // Fetch Sellers
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

  // Fetch Available Elaborations
  const fetchAvailableElaborations = async () => {
    try {
      setLoadingProducts(true);
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
      setLoadingProducts(false);
    }
  };

  // Fetch Available Goods
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

  // Fetch Product Families
  const fetchProductFamilies = async () => {
    try {
      const res = await fetch(`/api/client/product-families?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.families)) {
        setFamilies(data.families);
        return data.families;
      }
      return [];
    } catch (err) {
      console.error("Error fetching product families in POS:", err);
      return [];
    }
  };

  // Fetch all existing drafts from server
  const fetchAllDrafts = async (currentElabs, currentGoods) => {
    try {
      const res = await fetch(`/api/client/combined-sales?isDraft=true&t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const initialMap = {
          anonymous: {
            draftId: null,
            sellerId: null,
            sellerName: t('pos.seller_anonymous') || "Anónimo",
            customerId: null,
            date: new Date().toISOString().slice(0, 10),
            notes: "",
            items: []
          }
        };

        data.data.forEach(draft => {
          const sKey = draft.sellerId ? draft.sellerId.toString() : "anonymous";
          const elabItems = (draft.sales || []).map(s => {
            const found = (currentElabs || []).find(ae => ae.id === s.elaborationId);
            return {
              id: `elab-${s.id}-${Math.random()}`,
              type: 'elaboration',
              elaborationId: s.elaborationId,
              goodsForSaleId: null,
              name: s.elaboration?.name || "Lote",
              recipeName: s.elaboration?.recipe?.name || "",
              unit: s.elaboration?.quantityUnit || "kg",
              unitPrice: s.price && s.quantity ? Math.round((s.price / s.quantity) * 100) / 100 : (found?.unitPrice || 0),
              quantity: s.quantity || 1,
              price: s.price || 0
            };
          });

          const goodsItems = (draft.goodsSales || []).map(gs => {
            const gfs = gs.goodsForSale;
            const found = (currentGoods || []).find(g => g.id === gs.goodsForSaleId);
            return {
              id: `gfs-${gs.id}-${Math.random()}`,
              type: 'goods_for_sale',
              elaborationId: null,
              goodsForSaleId: gs.goodsForSaleId,
              name: gfs?.name || "Mercancía",
              recipeName: "",
              unit: gfs?.unit || "ud",
              unitPrice: gs.price && gs.quantity ? Math.round((gs.price / gs.quantity) * 100) / 100 : (found?.salePrice || 0),
              quantity: gs.quantity || 1,
              price: gs.price || 0,
              lotAllocations: Array.isArray(gs.lotAllocations) ? gs.lotAllocations : []
            };
          });

          initialMap[sKey] = {
            draftId: draft.id,
            sellerId: draft.sellerId || null,
            sellerName: draft.seller?.name || draft.sellerName || "Anónimo",
            customerId: draft.customerId || null,
            date: draft.date ? new Date(draft.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            notes: draft.notes || "",
            items: [...elabItems, ...goodsItems]
          };
        });

        setDraftsBySeller(prev => ({ ...prev, ...initialMap }));
      }
    } catch (err) {
      console.error("Error loading drafts:", err);
    }
  };

  // Initialize POS
  useEffect(() => {
    const init = async () => {
      fetchSellers();
      fetchProductFamilies();
      const [elabs, gfs] = await Promise.all([
        fetchAvailableElaborations(),
        fetchAvailableGoods()
      ]);
      await fetchAllDrafts(elabs, gfs);
      isInitialLoadRef.current = false;
    };
    init();
  }, []);

  // Filtered Products for Column 2
  const filteredProducts = useMemo(() => {
    const searchClean = productSearch.trim().toLowerCase();
    let result = [];

    // Elaborations
    if (productCategory === "all" || productCategory === "elaborations") {
      availableElaborations.forEach(e => {
        const fullTxt = `${e.recipeName || ''} ${e.name || ''} ${e.barcode || ''}`.toLowerCase();
        if (!searchClean || fullTxt.includes(searchClean)) {
          result.push({
            id: `elab_${e.id}`,
            rawId: e.id,
            type: 'elaboration',
            elaborationId: e.id,
            goodsForSaleId: null,
            name: e.name,
            recipeName: e.recipeName,
            displayName: e.recipeName ? `${e.recipeName} (${e.name})` : e.name,
            unitPrice: e.unitPrice || 0,
            unit: e.quantityUnit || "kg",
            availableStock: e.availableStock || 0,
            productFamilyId: e.productFamilyId || null,
            barcode: e.barcode || null
          });
        }
      });
    }

    // Goods for sale
    if (productCategory === "all" || productCategory === "goods") {
      availableGoods.forEach(g => {
        const fullTxt = (g.name || '').toLowerCase();
        if (!searchClean || fullTxt.includes(searchClean)) {
          result.push({
            id: `gfs_${g.id}`,
            rawId: g.id,
            type: 'goods_for_sale',
            elaborationId: null,
            goodsForSaleId: g.id,
            name: g.name,
            recipeName: '',
            displayName: g.name,
            unitPrice: g.salePrice || 0,
            unit: g.unit || "ud",
            availableStock: g.stock || 0,
            productFamilyId: g.productFamilyId || null
          });
        }
      });
    }

    // Filter by selected family if one is selected
    if (selectedFamilyId !== null && selectedFamilyId !== 'all') {
      result = result.filter(p => p.productFamilyId === selectedFamilyId);
    }

    return result;
  }, [availableElaborations, availableGoods, productSearch, productCategory, selectedFamilyId]);

  // TOP BAR CALCULATIONS
  const parsedWeight = useMemo(() => {
    if (!weightInput) return 0;
    const p = parseFloat(weightInput.toString().replace(',', '.'));
    return isNaN(p) || p < 0 ? 0 : p;
  }, [weightInput]);

  const parsedQtyMultiplier = useMemo(() => {
    const q = parseFloat(quantityUnits?.toString().replace(',', '.'));
    return isNaN(q) || q <= 0 ? 1 : q;
  }, [quantityUnits]);

  // Price per kg (or unit) display
  const pricePerKgDisplay = useMemo(() => {
    if (!selectedProduct) return 0;
    return selectedProduct.unitPrice || 0;
  }, [selectedProduct]);

  // Total price calculated
  const totalPriceCalculated = useMemo(() => {
    if (!selectedProduct) return 0;
    const unitPrice = selectedProduct.unitPrice || 0;
    if (unitPrice <= 0) return 0;

    // If weight was specified (> 0), use weight * (qty if > 1)
    if (parsedWeight > 0) {
      const effectiveWeight = parsedWeight * parsedQtyMultiplier;
      return Math.round(effectiveWeight * unitPrice * 100) / 100;
    }
    // Otherwise use units quantity * unit price
    return Math.round(parsedQtyMultiplier * unitPrice * 100) / 100;
  }, [selectedProduct, parsedWeight, parsedQtyMultiplier]);

  // Effective quantity that will be added
  const effectiveQuantityToAdd = useMemo(() => {
    if (parsedWeight > 0) {
      return Math.round(parsedWeight * parsedQtyMultiplier * 1000) / 1000;
    }
    return Math.round(parsedQtyMultiplier * 1000) / 1000;
  }, [parsedWeight, parsedQtyMultiplier]);

  // Auto-save a draft for a specific seller
  const autoSaveDraftForSeller = async (sId, sellerDraft) => {
    try {
      setAutoSaveStatus("saving");
      const itemsToSave = (sellerDraft.items || []).filter(it => it.quantity > 0 && it.price >= 0);

      const payload = {
        customerId: sellerDraft.customerId || null,
        date: sellerDraft.date || new Date().toISOString().slice(0, 10),
        notes: sellerDraft.notes || "",
        isDraft: true,
        sellerId: sId !== "anonymous" ? parseInt(sId) : null,
        sellerName: sellerDraft.sellerName || "Anónimo",
        items: itemsToSave.map(it => ({
          type: it.type,
          elaborationId: it.type === 'elaboration' ? it.elaborationId : null,
          goodsForSaleId: it.type === 'goods_for_sale' ? it.goodsForSaleId : null,
          quantity: parseFloat(it.quantity.toString().replace(',', '.')),
          price: parseFloat(it.price.toString().replace(',', '.')),
          lotAllocations: it.lotAllocations || []
        }))
      };

      const url = sellerDraft.draftId
        ? `/api/client/combined-sales/${sellerDraft.draftId}`
        : `/api/client/combined-sales`;
      const method = sellerDraft.draftId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (!sellerDraft.draftId && data.data?.id) {
          setDraftsBySeller(prev => ({
            ...prev,
            [sId]: {
              ...prev[sId],
              draftId: data.data.id
            }
          }));
        }
        setAutoSaveStatus("saved");
        setLastSavedAt(new Date().toLocaleTimeString());
      } else {
        setAutoSaveStatus("error");
      }
    } catch (err) {
      console.error("Error auto-saving seller draft:", err);
      setAutoSaveStatus("error");
    }
  };

  // ACTION: Click on Seller button in Column 3
  const handleSellerClick = (seller) => {
    const sId = seller.id.toString();

    // IF A PRODUCT IS SELECTED: add it to this seller's draft sale!
    if (selectedProduct) {
      const lineTotal = totalPriceCalculated;
      const lineQty = effectiveQuantityToAdd;

      const newItem = {
        id: `line-${Date.now()}-${Math.random()}`,
        type: selectedProduct.type,
        elaborationId: selectedProduct.elaborationId,
        goodsForSaleId: selectedProduct.goodsForSaleId,
        name: selectedProduct.displayName || selectedProduct.name,
        recipeName: selectedProduct.recipeName || '',
        unit: selectedProduct.unit || (parsedWeight > 0 ? 'kg' : 'ud'),
        unitPrice: selectedProduct.unitPrice,
        quantity: lineQty,
        price: lineTotal,
        lotAllocations: Array.isArray(selectedProduct.lotAllocations) ? selectedProduct.lotAllocations : []
      };

      const currentSellerDraft = draftsBySeller[sId] || {
        draftId: null,
        sellerId: seller.id !== "anonymous" ? seller.id : null,
        sellerName: seller.name,
        customerId: null,
        date: new Date().toISOString().slice(0, 10),
        notes: "",
        items: []
      };

      const updatedDraft = {
        ...currentSellerDraft,
        sellerName: seller.name,
        items: [...currentSellerDraft.items, newItem]
      };

      setDraftsBySeller(prev => ({
        ...prev,
        [sId]: updatedDraft
      }));

      // Switch active view in Column 1 to this seller
      setActiveSellerId(sId);

      // Auto-save this seller's draft
      autoSaveDraftForSeller(sId, updatedDraft);

      // Feedback toast
      setSuccessToast(
        (t('pos.added_to_seller', { seller: seller.name }) || `Añadido a ${seller.name}`) +
        `: ${newItem.name} (${lineQty} ${newItem.unit} · ${lineTotal.toFixed(2)} ${currencySymbol})`
      );
      setTimeout(() => setSuccessToast(""), 3000);

      // Reset selection and inputs
      setSelectedProduct(null);
      setWeightInput("");
      setQuantityString("1");
      setIsQtyFresh(true);
      setQuantityUnits(1);
    } 
    // IF NO PRODUCT IS SELECTED: simply switch Column 1 to inspect this seller's ticket
    else {
      setActiveSellerId(sId);
    }
  };

  // Click product in Column 2
  const handleProductClick = (p) => {
    if (selectedProduct?.id === p.id) {
      setSelectedProduct(null);
      return;
    }

    if (p.type === 'goods_for_sale') {
      if (profile?.blockOutOfStockGoodsSales && (p.availableStock || 0) <= 0) {
        alert(t('lots_modal.blocked_out_of_stock_alert') || "No hay stock disponible para esta mercancía y no está permitida la venta sin stock en la configuración.");
        return;
      }

      const currentQty = effectiveQuantityToAdd > 0 ? effectiveQuantityToAdd : 1;
      setGoodsLotModal({
        isOpen: true,
        goods: {
          id: p.rawId || p.goodsForSaleId,
          name: p.name,
          stock: p.availableStock,
          unit: p.unit,
          salePrice: p.unitPrice
        },
        product: p,
        editingItemId: null,
        initialQuantity: currentQty,
        initialAllocations: null
      });
      return;
    }

    // Elaborations
    setSelectedProduct(p);
  };

  const handleConfirmGoodsLots = (allocations, totalQty) => {
    if (goodsLotModal.editingItemId) {
      const sId = activeSellerId?.toString();
      const currentDraft = draftsBySeller[sId];
      if (currentDraft) {
        const updatedItems = currentDraft.items.map(it => {
          if (it.id === goodsLotModal.editingItemId) {
            const unitP = parseFloat(it.unitPrice) || 0;
            const newTotal = Math.round(totalQty * unitP * 100) / 100;
            return {
              ...it,
              lotAllocations: allocations,
              quantity: totalQty,
              price: newTotal
            };
          }
          return it;
        });
        const updatedDraft = { ...currentDraft, items: updatedItems };
        setDraftsBySeller(prev => ({ ...prev, [sId]: updatedDraft }));
        autoSaveDraftForSeller(sId, updatedDraft);
      }
    } else if (goodsLotModal.product) {
      const p = goodsLotModal.product;
      const productWithLots = {
        ...p,
        lotAllocations: allocations
      };
      setSelectedProduct(productWithLots);
      setQuantityUnits(totalQty);
      setQuantityString(totalQty.toString());
      setIsQtyFresh(true);
      if (p.unit === 'kg') {
        setWeightInput(totalQty.toString());
      }
    }
    setGoodsLotModal({ isOpen: false, goods: null, product: null, editingItemId: null, initialQuantity: null, initialAllocations: null });
  };

  const handleSelectGoodsWithoutLot = (qty) => {
    if (goodsLotModal.editingItemId) {
      const sId = activeSellerId?.toString();
      const currentDraft = draftsBySeller[sId];
      if (currentDraft) {
        const updatedItems = currentDraft.items.map(it => {
          if (it.id === goodsLotModal.editingItemId) {
            const finalQty = qty != null && qty > 0 ? qty : it.quantity;
            const unitP = parseFloat(it.unitPrice) || 0;
            const newTotal = Math.round(finalQty * unitP * 100) / 100;
            return {
              ...it,
              lotAllocations: [],
              quantity: finalQty,
              price: newTotal
            };
          }
          return it;
        });
        const updatedDraft = { ...currentDraft, items: updatedItems };
        setDraftsBySeller(prev => ({ ...prev, [sId]: updatedDraft }));
        autoSaveDraftForSeller(sId, updatedDraft);
      }
    } else if (goodsLotModal.product) {
      const p = goodsLotModal.product;
      const finalQty = qty != null && qty > 0 ? qty : 1;
      const productWithLots = {
        ...p,
        lotAllocations: []
      };
      setSelectedProduct(productWithLots);
      setQuantityUnits(finalQty);
      setQuantityString(finalQty.toString());
      setIsQtyFresh(true);
      if (p.unit === 'kg') {
        setWeightInput(finalQty.toString());
      }
    }
    setGoodsLotModal({ isOpen: false, goods: null, product: null, editingItemId: null, initialQuantity: null, initialAllocations: null });
  };

  // Remove an item from the active seller's ticket
  const handleRemoveActiveItem = (itemId) => {
    const sId = activeSellerId?.toString();
    const currentDraft = draftsBySeller[sId];
    if (!currentDraft) return;

    const updatedItems = currentDraft.items.filter(it => it.id !== itemId);
    const updatedDraft = { ...currentDraft, items: updatedItems };

    setDraftsBySeller(prev => ({
      ...prev,
      [sId]: updatedDraft
    }));

    autoSaveDraftForSeller(sId, updatedDraft);
  };

  // Clear all items from the active seller's ticket
  const handleClearActiveTicket = async () => {
    const sId = activeSellerId?.toString();
    const currentDraft = draftsBySeller[sId];
    if (!currentDraft || currentDraft.items.length === 0) return;

    if (!confirm(t('pos.discard_confirm') || "¿Estás seguro de que deseas vaciar este ticket?")) return;

    if (currentDraft.draftId) {
      try {
        await fetch(`/api/client/combined-sales/${currentDraft.draftId}`, { method: "DELETE" });
      } catch (e) {
        console.error("Error deleting draft:", e);
      }
    }

    setDraftsBySeller(prev => ({
      ...prev,
      [sId]: {
        ...currentDraft,
        draftId: null,
        items: []
      }
    }));
    setAutoSaveStatus("idle");
  };

  // Open checkout dialog for a specific seller
  const handleOpenCheckout = (seller) => {
    const sId = seller.id.toString();
    const draft = draftsBySeller[sId];
    if (!draft || draft.items.length === 0) {
      alert("Este vendedor no tiene ningún producto en su venta.");
      return;
    }
    setCheckoutSeller(seller);
    setCheckoutCustomer(draft.customerId ? draft.customerId.toString() : "");
    setCheckoutNotes(draft.notes || "");
    setCheckoutPaymentMethod("cash");
    setCheckoutAmountPaid("");
  };

  // Finalize / Close the sale
  const handleFinalizeSale = async () => {
    if (!checkoutSeller) return;
    const sId = checkoutSeller.id.toString();
    const draft = draftsBySeller[sId];
    if (!draft || draft.items.length === 0) return;

    setFinalizing(true);
    try {
      const payload = {
        customerId: checkoutCustomer ? parseInt(checkoutCustomer) : null,
        date: draft.date || new Date().toISOString().slice(0, 10),
        notes: checkoutNotes || "",
        isDraft: false,
        sellerId: checkoutSeller.id !== "anonymous" ? checkoutSeller.id : null,
        sellerName: checkoutSeller.name,
        paymentMethod: checkoutPaymentMethod,
        items: draft.items.map(it => ({
          type: it.type,
          elaborationId: it.type === 'elaboration' ? it.elaborationId : null,
          goodsForSaleId: it.type === 'goods_for_sale' ? it.goodsForSaleId : null,
          quantity: parseFloat(it.quantity.toString().replace(',', '.')),
          price: parseFloat(it.price.toString().replace(',', '.')),
          lotAllocations: it.lotAllocations || []
        }))
      };

      const url = draft.draftId
        ? `/api/client/combined-sales/${draft.draftId}`
        : `/api/client/combined-sales`;
      const method = draft.draftId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessToast(`¡Venta cerrada con éxito para ${checkoutSeller.name}!`);
        setTimeout(() => setSuccessToast(""), 4000);

        // Clear seller's draft locally
        setDraftsBySeller(prev => ({
          ...prev,
          [sId]: {
            draftId: null,
            sellerId: checkoutSeller.id !== "anonymous" ? checkoutSeller.id : null,
            sellerName: checkoutSeller.name,
            customerId: null,
            date: new Date().toISOString().slice(0, 10),
            notes: "",
            items: []
          }
        }));

        setCheckoutSeller(null);

        // Refresh available stock
        await fetchAvailableElaborations();
        await fetchAvailableGoods();
        if (onSaleCreated) onSaleCreated();
      } else {
        alert(data.error || "Error al cerrar la venta");
      }
    } catch (err) {
      console.error("Error finalizing POS sale:", err);
      alert(t('alerts.connection_error') || "Error de conexión");
    } finally {
      setFinalizing(false);
    }
  };

  // Active Seller Ticket Data
  const currentActiveDraft = draftsBySeller[activeSellerId?.toString()] || { items: [] };
  const currentActiveItems = currentActiveDraft.items || [];
  const currentActiveTotal = currentActiveItems.reduce((acc, it) => acc + (parseFloat(it.price) || 0), 0);

  // SCREEN TOO SMALL ERROR SCREEN (< 768px)
  if (isScreenTooSmall) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#090d16',
        color: '#f8fafc',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1.5px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '50%',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          color: '#ef4444'
        }}>
          <MonitorX size={52} />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          {t('pos.screen_too_small_title') || "Pantalla no compatible"}
        </h2>
        <p style={{ maxWidth: '440px', color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.5', marginBottom: '2rem' }}>
          {t('pos.screen_too_small_desc') || "El modo TPV requiere una resolución de pantalla más grande (ancho mínimo de 768px) para operar correctamente."}
        </p>
        <button
          type="button"
          onClick={onExitPos}
          className="btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1.85rem',
            fontSize: '1rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
            border: 'none',
            borderRadius: '0.75rem',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
          <span>{t('pos.exit_btn') || "Volver al modo gestión"}</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: '#090d16',
      color: '#f8fafc',
      userSelect: 'none',
      zIndex: 99999
    }}>

      {/* ============================================================== */}
      {/* 1. TOP SCALE DISPLAY BAND (FRANJA SUPERIOR BÁSCULA)           */}
      {/* ============================================================== */}
      <header style={{
        height: '92px',
        minHeight: '92px',
        maxHeight: '92px',
        background: '#020617',
        borderBottom: '2px solid #1e293b',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1.2fr auto',
        gap: '1rem',
        alignItems: 'center',
        padding: '0 1.25rem',
        boxSizing: 'border-box'
      }}>
        {/* BOX 1: PESO (KG) - Editable by keyboard */}
        <div style={{
          background: '#0a0f1d',
          border: '1.5px solid #1e293b',
          borderRadius: '8px',
          padding: '0.4rem 0.85rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          height: '74px',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em' }}>
              {t('pos.scale_weight') || "PESO (KG)"}
            </span>
            {weightInput && (
              <button
                type="button"
                onClick={() => setWeightInput("")}
                title="Borrar peso"
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.1rem 0.4rem',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                C
              </button>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <input
              type="text"
              inputMode="decimal"
              value={weightInput}
              onChange={(e) => {
                // allow only numbers and decimal dots/commas
                const val = e.target.value.replace(/[^0-9.,]/g, '');
                setWeightInput(val);
              }}
              placeholder="0.000"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#38bdf8',
                fontSize: '2.1rem',
                fontFamily: 'monospace, monospace',
                fontWeight: 900,
                outline: 'none',
                padding: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1
              }}
            />
            <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 800 }}>kg</span>
          </div>
        </div>

        {/* BOX 2: PRECIO (€/KG) - Read-only calculated on product selection */}
        <div style={{
          background: '#0a0f1d',
          border: '1.5px solid #1e293b',
          borderRadius: '8px',
          padding: '0.4rem 0.85rem',
          display: 'flex',
          flexDirection: 'column',
          height: '74px',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.08em' }}>
            {t('pos.scale_price_kg') || "PRECIO (€/KG)"}
          </span>
          <div style={{
            color: pricePerKgDisplay > 0 ? '#f59e0b' : '#475569',
            fontSize: '2.1rem',
            fontFamily: 'monospace, monospace',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {pricePerKgDisplay.toFixed(2)}
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, marginLeft: '0.3rem' }}>
              {currencySymbol}/{selectedProduct?.unit || 'kg'}
            </span>
          </div>
        </div>

        {/* BOX 3: IMPORTE TOTAL (€) - Calculated automatically */}
        <div style={{
          background: '#0a0f1d',
          border: '1.5px solid #10b981',
          borderRadius: '8px',
          padding: '0.4rem 0.85rem',
          display: 'flex',
          flexDirection: 'column',
          height: '74px',
          justifyContent: 'center',
          boxShadow: totalPriceCalculated > 0 ? '0 0 15px rgba(16, 185, 129, 0.15)' : 'none'
        }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.08em' }}>
            {t('pos.scale_total') || "IMPORTE TOTAL (€)"}
          </span>
          <div style={{
            color: totalPriceCalculated > 0 ? '#10b981' : '#475569',
            fontSize: '2.3rem',
            fontFamily: 'monospace, monospace',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            whiteSpace: 'nowrap'
          }}>
            {totalPriceCalculated.toFixed(2)}
            <span style={{ fontSize: '1.1rem', color: '#10b981', fontWeight: 800, marginLeft: '0.35rem' }}>
              {currencySymbol}
            </span>
          </div>
        </div>

        {/* SELECTED PRODUCT BADGE / QUICK INFO */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-end',
          minWidth: '170px'
        }}>
          {selectedProduct ? (
            <div style={{
              background: 'rgba(66, 98, 22, 0.25)',
              border: '1px solid #16a34a',
              borderRadius: '8px',
              padding: '0.4rem 0.75rem',
              textAlign: 'right',
              maxWidth: '220px'
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#86efac', textTransform: 'uppercase' }}>
                ✓ {selectedProduct.type === 'elaboration' ? 'Elaborado' : 'Mercancía'}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedProduct.displayName}
              </div>
              {selectedProduct.type === 'goods_for_sale' && (
                <div style={{ fontSize: '0.68rem', color: '#38bdf8', marginTop: '0.15rem' }}>
                  {Array.isArray(selectedProduct.lotAllocations) && selectedProduct.lotAllocations.length > 0 ? (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setGoodsLotModal({
                          isOpen: true,
                          goods: {
                            id: selectedProduct.rawId || selectedProduct.goodsForSaleId,
                            name: selectedProduct.name,
                            stock: selectedProduct.availableStock,
                            unit: selectedProduct.unit,
                            salePrice: selectedProduct.unitPrice
                          },
                          product: selectedProduct,
                          editingItemId: null,
                          initialQuantity: effectiveQuantityToAdd,
                          initialAllocations: selectedProduct.lotAllocations
                        });
                      }}
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      title="Clic para cambiar lotes"
                    >
                      Lotes: {selectedProduct.lotAllocations.map(a => `${a.lote || 'Sin ref'} (${a.quantity})`).join(', ')}
                    </span>
                  ) : (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setGoodsLotModal({
                          isOpen: true,
                          goods: {
                            id: selectedProduct.rawId || selectedProduct.goodsForSaleId,
                            name: selectedProduct.name,
                            stock: selectedProduct.availableStock,
                            unit: selectedProduct.unit,
                            salePrice: selectedProduct.unitPrice
                          },
                          product: selectedProduct,
                          editingItemId: null,
                          initialQuantity: effectiveQuantityToAdd,
                          initialAllocations: []
                        });
                      }}
                      style={{ cursor: 'pointer', textDecoration: 'underline', color: '#94a3b8' }}
                      title="Clic para asignar lotes"
                    >
                      Sin lote asignado
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{
              fontSize: '0.78rem',
              color: '#64748b',
              textAlign: 'right',
              fontStyle: 'italic'
            }}>
              Selecciona un producto...
            </div>
          )}
        </div>
      </header>

      {/* TOAST NOTIFICATION */}
      {successToast && (
        <div style={{
          position: 'fixed',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#15803d',
          color: 'white',
          padding: '0.55rem 1.25rem',
          borderRadius: '2rem',
          fontSize: '0.85rem',
          fontWeight: 800,
          zIndex: 100000,
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle2 size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. MAIN 3-COLUMN BAND (FRANJA PRINCIPAL 3 COLUMNAS)           */}
      {/* ============================================================== */}
      <main style={{
        flex: 1,
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: '330px 1fr 280px',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>

        {/* ------------------------------------------------------------ */}
        {/* COLUMNA 1 (IZQUIERDA): LISTADO DE ITEMS AÑADIDOS A LA VENTA  */}
        {/* ------------------------------------------------------------ */}
        <section style={{
          background: '#0f172a',
          borderRadius: '10px',
          border: '1.5px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%'
        }}>
          {/* Header */}
          <div style={{
            padding: '0.75rem 0.9rem',
            background: '#1e293b',
            borderBottom: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
              <ShoppingCart size={17} style={{ color: '#10b981', flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  {t('pos.col_ticket_title') || "Ticket actual"}
                </span>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t('pos.seller_label') || "Vendedor"}: <strong style={{ color: '#38bdf8' }}>{activeSeller.name}</strong>
                </div>
              </div>
            </div>

            {currentActiveItems.length > 0 && (
              <button
                type="button"
                onClick={handleClearActiveTicket}
                title={t('pos.clear_ticket') || "Vaciar ticket"}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>

          {/* Items List (Scrollable internally) */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem'
          }}>
            {currentActiveItems.length === 0 ? (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                textAlign: 'center',
                padding: '1.5rem'
              }}>
                <ShoppingCart size={36} style={{ marginBottom: '0.65rem', opacity: 0.4 }} />
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                  {t('pos.col_ticket_empty') || "Ticket vacío"}
                </div>
                <div style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                  {t('pos.col_ticket_hint') || "Selecciona un producto y pulsa en un vendedor para añadirlo a su venta."}
                </div>
              </div>
            ) : (
              currentActiveItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '0.55rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </span>
                      <span style={{
                        fontSize: '0.58rem',
                        fontWeight: 800,
                        padding: '0.05rem 0.3rem',
                        borderRadius: '3px',
                        background: item.type === 'elaboration' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                        color: item.type === 'elaboration' ? '#4ade80' : '#38bdf8',
                        textTransform: 'uppercase',
                        flexShrink: 0
                      }}>
                        {item.type === 'elaboration' ? 'Elab' : 'Merc'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      <strong style={{ color: '#cbd5e1' }}>{item.quantity} {item.unit}</strong> × {item.unitPrice ? item.unitPrice.toFixed(2) : "0.00"} {currencySymbol}
                    </div>
                    {item.type === 'goods_for_sale' && (
                      <div style={{ marginTop: '0.2rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setGoodsLotModal({
                              isOpen: true,
                              goods: {
                                id: item.goodsForSaleId,
                                name: item.name,
                                unit: item.unit,
                                salePrice: item.unitPrice
                              },
                              product: null,
                              editingItemId: item.id,
                              initialQuantity: item.quantity,
                              initialAllocations: item.lotAllocations || []
                            });
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            color: '#38bdf8',
                            fontSize: '0.67rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            textAlign: 'left',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                          title="Clic para cambiar asignación de lotes"
                        >
                          <Layers size={10} />
                          {Array.isArray(item.lotAllocations) && item.lotAllocations.length > 0 ? (
                            <span>Lotes: {item.lotAllocations.map(a => `${a.lote || 'Sin ref'} (${a.quantity})`).join(', ')}</span>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>Sin lote asignado</span>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{
                      fontFamily: 'monospace, monospace',
                      fontSize: '0.98rem',
                      fontWeight: 900,
                      color: '#10b981'
                    }}>
                      {parseFloat(item.price).toFixed(2)} {currencySymbol}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveActiveItem(item.id)}
                      title="Eliminar línea"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '0.2rem'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer of Column 1: Total */}
          <div style={{
            padding: '0.75rem 0.9rem',
            background: '#020617',
            borderTop: '1.5px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                TOTAL {activeSeller.name} ({currentActiveItems.length} líneas)
              </div>
              <div style={{
                fontSize: '1.8rem',
                fontFamily: 'monospace, monospace',
                fontWeight: 900,
                color: '#10b981',
                lineHeight: 1
              }}>
                {currentActiveTotal.toFixed(2)} {currencySymbol}
              </div>
            </div>

            {currentActiveItems.length > 0 && (
              <button
                type="button"
                onClick={() => handleOpenCheckout(activeSeller)}
                className="btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.55rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>Cobrar</span>
                <ChevronRight size={15} />
              </button>
            )}
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* COLUMNA 2 (CENTRO): ELABORACIONES Y MERCANCÍAS EN VENTA      */}
        {/* ------------------------------------------------------------ */}
        <section style={{
          background: '#0f172a',
          borderRadius: '10px',
          border: '1.5px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%'
        }}>
          {/* Header with Search and Category filters */}
          <div style={{
            padding: '0.65rem 0.85rem',
            background: '#1e293b',
            borderBottom: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            {/* Search Input */}
            <div style={{
              flex: 1,
              minWidth: '180px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={15} style={{ position: 'absolute', left: '0.65rem', color: '#64748b' }} />
              <input
                type="text"
                placeholder={t('pos.col_products_search') || "Buscar elaboración o mercancía..."}
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                style={{
                  width: '100%',
                  background: '#090d16',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '0.45rem 0.65rem 0.45rem 2.1rem',
                  color: 'white',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
              {productSearch && (
                <button
                  type="button"
                  onClick={() => setProductSearch("")}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setProductCategory("all")}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: productCategory === "all" ? '1.5px solid #10b981' : '1px solid #334155',
                  background: productCategory === "all" ? 'rgba(16, 185, 129, 0.2)' : '#090d16',
                  color: productCategory === "all" ? '#34d399' : '#94a3b8'
                }}
              >
                {t('pos.filter_all') || "Todos"}
              </button>
              <button
                type="button"
                onClick={() => setProductCategory("elaborations")}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: productCategory === "elaborations" ? '1.5px solid #10b981' : '1px solid #334155',
                  background: productCategory === "elaborations" ? 'rgba(16, 185, 129, 0.2)' : '#090d16',
                  color: productCategory === "elaborations" ? '#34d399' : '#94a3b8'
                }}
              >
                {t('pos.filter_elaborations') || "Elaboraciones"}
              </button>
              <button
                type="button"
                onClick={() => setProductCategory("goods")}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: productCategory === "goods" ? '1.5px solid #10b981' : '1px solid #334155',
                  background: productCategory === "goods" ? 'rgba(16, 185, 129, 0.2)' : '#090d16',
                  color: productCategory === "goods" ? '#34d399' : '#94a3b8'
                }}
              >
                {t('pos.filter_goods') || "Mercancías"}
              </button>
            </div>
          </div>

          {/* Products Grid (Scrollable internally) */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gridAutoRows: 'max-content',
            gap: '0.65rem'
          }}>
            {loadingProducts ? (
              <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
                <span>Cargando productos...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                <Package size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p style={{ margin: 0, fontWeight: 700 }}>No se encontraron productos disponibles con stock.</p>
              </div>
            ) : (
              filteredProducts.map(p => {
                const isSelected = selectedProduct?.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleProductClick(p)}
                    style={{
                      background: isSelected ? 'rgba(21, 128, 61, 0.35)' : '#1e293b',
                      border: isSelected ? '2px solid #22c55e' : '1px solid #334155',
                      borderRadius: '8px',
                      padding: '0.65rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: (p.type === 'goods_for_sale' && profile?.blockOutOfStockGoodsSales && (p.availableStock || 0) <= 0) ? 'not-allowed' : 'pointer',
                      opacity: (p.type === 'goods_for_sale' && profile?.blockOutOfStockGoodsSales && (p.availableStock || 0) <= 0) ? 0.5 : 1,
                      height: '92px',
                      transition: 'all 0.12s ease',
                      boxShadow: isSelected ? '0 0 12px rgba(34, 197, 94, 0.35)' : 'none',
                      position: 'relative'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{
                          fontSize: '0.6rem',
                          fontWeight: 800,
                          padding: '0.05rem 0.35rem',
                          borderRadius: '3px',
                          background: p.type === 'elaboration' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                          color: p.type === 'elaboration' ? '#4ade80' : '#38bdf8',
                          textTransform: 'uppercase'
                        }}>
                          {p.type === 'elaboration' ? 'Elab' : 'Merc'}
                        </span>
                        {isSelected && (
                          <span style={{
                            background: '#22c55e',
                            color: 'white',
                            borderRadius: '50%',
                            width: '16px',
                            height: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                            fontWeight: 900
                          }}>
                            ✓
                          </span>
                        )}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        color: isSelected ? '#ffffff' : '#f1f5f9',
                        lineHeight: '1.2',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {p.displayName}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                      <span style={{
                        fontSize: '0.92rem',
                        fontFamily: 'monospace, monospace',
                        fontWeight: 900,
                        color: isSelected ? '#4ade80' : '#fbbf24'
                      }}>
                        {p.unitPrice ? p.unitPrice.toFixed(2) : "0.00"} {currencySymbol}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>
                        {p.availableStock} {p.unit}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* BOTTOM BLOCK: PRODUCT FAMILIES */}
          <div style={{
            background: '#131d31',
            borderTop: '1.5px solid #334155',
            padding: '0.55rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={14} style={{ color: '#38bdf8' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t('pos.families_title') || "Familias de productos"}
                </span>
              </div>
              {selectedFamilyId !== null && (
                <span style={{ fontSize: '0.68rem', color: '#4ade80', fontWeight: 800 }}>
                  {filteredProducts.length} {t('pos.products_count') || "productos"}
                </span>
              )}
            </div>

            {/* Families horizontal scroll list */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              overflowX: 'auto',
              paddingBottom: '0.2rem'
            }}>
              <button
                type="button"
                onClick={() => setSelectedFamilyId(null)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  flexShrink: 0,
                  border: selectedFamilyId === null ? '1.5px solid #38bdf8' : '1px solid #334155',
                  background: selectedFamilyId === null ? 'rgba(56, 189, 248, 0.2)' : '#090d16',
                  color: selectedFamilyId === null ? '#38bdf8' : '#cbd5e1',
                  transition: 'all 0.1s ease'
                }}
              >
                {t('pos.filter_all_families') || "Todas las familias"}
              </button>

              {families.map(f => {
                const isSelected = selectedFamilyId === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFamilyId(isSelected ? null : f.id)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      flexShrink: 0,
                      border: isSelected ? '1.5px solid #22c55e' : '1px solid #334155',
                      background: isSelected ? 'rgba(34, 197, 94, 0.25)' : '#090d16',
                      color: isSelected ? '#4ade80' : '#cbd5e1',
                      transition: 'all 0.1s ease',
                      boxShadow: isSelected ? '0 0 10px rgba(34, 197, 94, 0.25)' : 'none'
                    }}
                  >
                    <span>{f.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* COLUMNA 3 (DERECHA): LISTADO VENDEDORES Y TECLADO CANTIDAD   */}
        {/* ------------------------------------------------------------ */}
        <section style={{
          background: '#0f172a',
          borderRadius: '10px',
          border: '1.5px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%'
        }}>
          {/* TOP BLOCK: LISTADO DE VENDEDORES */}
          <div style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Sellers Header */}
            <div style={{
              padding: '0.65rem 0.85rem',
              background: '#131d31',
              borderBottom: '1px solid #1e293b'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t('pos.col_sellers_title') || "VENDEDORES"}
              </div>
              <div style={{ fontSize: '0.68rem', color: selectedProduct ? '#86efac' : '#94a3b8', fontWeight: 700, marginTop: '0.15rem' }}>
                {selectedProduct 
                  ? (t('pos.col_sellers_hint') || "👉 Pulsa en un vendedor para añadir el producto a su venta:")
                  : (t('pos.col_sellers_view_hint') || "Pulsa para consultar o gestionar su ticket:")}
              </div>
            </div>

            {/* Sellers Buttons List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0.55rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem'
            }}>
              {allSellers.map((s, index) => {
                const sId = s.id.toString();
                const sDraft = draftsBySeller[sId];
                const sItemsCount = sDraft?.items?.length || 0;
                const sTotal = (sDraft?.items || []).reduce((acc, it) => acc + (parseFloat(it.price) || 0), 0);
                const isActive = activeSellerId?.toString() === sId;

                // Color accents per seller
                const colorPalettes = [
                  { bg: 'rgba(56, 189, 248, 0.1)', border: '#0284c7', text: '#38bdf8', badge: '#0369a1' },
                  { bg: 'rgba(16, 185, 129, 0.1)', border: '#059669', text: '#34d399', badge: '#047857' },
                  { bg: 'rgba(245, 158, 11, 0.1)', border: '#d97706', text: '#fbbf24', badge: '#b45309' },
                  { bg: 'rgba(168, 85, 247, 0.1)', border: '#9333ea', text: '#c084fc', badge: '#7e22ce' },
                  { bg: 'rgba(236, 72, 153, 0.1)', border: '#db2777', text: '#f472b6', badge: '#be185d' }
                ];
                const pal = colorPalettes[index % colorPalettes.length];

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSellerClick(s)}
                    style={{
                      background: isActive ? pal.bg : '#1e293b',
                      border: selectedProduct 
                        ? `2px solid ${pal.border}` 
                        : (isActive ? `2px solid ${pal.border}` : '1px solid #334155'),
                      borderRadius: '8px',
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                      boxShadow: (selectedProduct || isActive) ? `0 2px 8px ${pal.bg}` : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0 }}>
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: pal.badge,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '0.8rem',
                        flexShrink: 0
                      }}>
                        {s.name[0]?.toUpperCase() || 'V'}
                      </div>

                      <div style={{ textAlign: 'left', minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.84rem', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: sItemsCount > 0 ? '#34d399' : '#64748b', fontWeight: 700 }}>
                          {sItemsCount > 0 ? `${sItemsCount} líneas · ${sTotal.toFixed(2)} ${currencySymbol}` : "Sin líneas"}
                        </div>
                      </div>
                    </div>

                    {selectedProduct ? (
                      <div style={{
                        background: pal.badge,
                        color: 'white',
                        borderRadius: '4px',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        flexShrink: 0
                      }}>
                        <Plus size={12} />
                        <span>Añadir</span>
                      </div>
                    ) : (
                      isActive ? (
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          color: pal.text,
                          background: pal.bg,
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px',
                          border: `1px solid ${pal.border}`
                        }}>
                          Activo
                        </span>
                      ) : (
                        <ChevronRight size={15} style={{ color: '#64748b' }} />
                      )
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MIDDLE BLOCK: CÓDIGO DE PRODUCTO / CÓDIGO DE BARRAS */}
          <div style={{
            background: '#131d31',
            borderTop: '1.5px solid #334155',
            padding: '0.55rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ScanBarcode size={14} style={{ color: '#38bdf8' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t('pos.barcode_input_title') || "CÓDIGO DE PRODUCTO"}
                </span>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                Código / Barras
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                <input
                  ref={barcodeInputRef}
                  type="text"
                  placeholder={t('pos.barcode_placeholder') || "Escanear o escribir código..."}
                  value={barcodeInput}
                  onChange={(e) => {
                    setBarcodeInput(e.target.value);
                    if (barcodeError) setBarcodeError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleBarcodeSearch(barcodeInput);
                    }
                  }}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: barcodeError ? '1.5px solid #ef4444' : '1.5px solid #334155',
                    borderRadius: '6px',
                    padding: '0.45rem 2rem 0.45rem 0.65rem',
                    color: 'white',
                    fontSize: '0.82rem',
                    fontFamily: 'monospace, monospace',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                />
                {barcodeInput ? (
                  <button
                    type="button"
                    onClick={() => {
                      setBarcodeInput("");
                      setBarcodeError("");
                      barcodeInputRef.current?.focus();
                    }}
                    style={{
                      position: 'absolute',
                      right: '0.45rem',
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <ScanBarcode size={15} style={{ position: 'absolute', right: '0.55rem', color: '#64748b', pointerEvents: 'none' }} />
                )}
              </div>

              <button
                type="button"
                onClick={() => handleBarcodeSearch(barcodeInput)}
                title="Buscar producto por código"
                style={{
                  background: '#0ea5e9',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  padding: '0.5rem 0.65rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  transition: 'background 0.1s ease'
                }}
              >
                <Search size={14} />
              </button>
            </div>

            {barcodeError && (
              <div style={{ fontSize: '0.68rem', color: '#f87171', fontWeight: 700, lineHeight: '1.2' }}>
                {barcodeError}
              </div>
            )}
          </div>

          {/* BOTTOM BLOCK: SELECTOR CANTIDAD / TECLADO NUMÉRICO */}
          <div style={{
            background: '#131d31',
            borderTop: '1.5px solid #334155',
            padding: '0.65rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>
                {t('pos.qty_selector_title') || "CANTIDAD (UDS)"}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                {parsedWeight > 0 ? (t('pos.qty_weight_mult') || "Multiplicador peso") : (t('pos.qty_direct_units') || "Unidades directas")}
              </span>
            </div>

            {/* Display de Cantidad (Sin botones + y -) */}
            <div style={{
              background: '#090d16',
              border: '1.5px solid #38bdf8',
              borderRadius: '6px',
              padding: '0.35rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Cant.
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={quantityString}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  if (!cleaned || cleaned === "0") {
                    setQuantityString("1");
                    setIsQtyFresh(true);
                  } else {
                    setQuantityString(cleaned.slice(0, 4));
                    setIsQtyFresh(false);
                  }
                }}
                style={{
                  width: '100px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#38bdf8',
                  fontFamily: 'monospace, monospace',
                  fontSize: '1.45rem',
                  fontWeight: 900,
                  textAlign: 'right',
                  padding: 0
                }}
              />
            </div>

            {/* Teclado Numérico (0-9, C, ⌫) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.35rem'
            }}>
              {[
                { label: '1', action: () => handleKeypadDigit(1) },
                { label: '2', action: () => handleKeypadDigit(2) },
                { label: '3', action: () => handleKeypadDigit(3) },
                { label: '4', action: () => handleKeypadDigit(4) },
                { label: '5', action: () => handleKeypadDigit(5) },
                { label: '6', action: () => handleKeypadDigit(6) },
                { label: '7', action: () => handleKeypadDigit(7) },
                { label: '8', action: () => handleKeypadDigit(8) },
                { label: '9', action: () => handleKeypadDigit(9) },
                { label: 'C', action: handleKeypadClear, isClear: true },
                { label: '0', action: () => handleKeypadDigit(0) },
                { label: '⌫', action: handleKeypadBackspace, isBackspace: true }
              ].map((btn, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={btn.action}
                  style={{
                    height: '35px',
                    borderRadius: '6px',
                    fontSize: btn.isBackspace ? '1.1rem' : (btn.isClear ? '0.95rem' : '1.15rem'),
                    fontWeight: 900,
                    fontFamily: btn.isBackspace || btn.isClear ? 'inherit' : 'monospace, monospace',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.1s ease',
                    border: btn.isClear 
                      ? '1px solid rgba(239, 68, 68, 0.4)' 
                      : (btn.isBackspace ? '1px solid #475569' : '1px solid #334155'),
                    background: btn.isClear 
                      ? 'rgba(239, 68, 68, 0.15)' 
                      : (btn.isBackspace ? '#1e293b' : '#090d16'),
                    color: btn.isClear ? '#f87171' : (btn.isBackspace ? '#cbd5e1' : '#f8fafc')
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {btn.isBackspace ? <Delete size={17} /> : btn.label}
                </button>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ============================================================== */}
      {/* 3. BOTTOM BAR (FRANJA DE ABAJO)                               */}
      {/* ============================================================== */}
      <footer style={{
        height: '64px',
        minHeight: '64px',
        maxHeight: '64px',
        background: '#020617',
        borderTop: '1.5px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        boxSizing: 'border-box'
      }}>
        {/* Left: Volver a Modo Gestión */}
        <button
          type="button"
          onClick={onExitPos}
          className="btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 1.15rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 800,
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#f8fafc',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
          <span>{t('pos.exit_btn') || "Modo gestión"}</span>
        </button>

        {/* Center: Autosave status info */}
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {autoSaveStatus === "saving" && (
            <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Loader2 size={13} className="animate-spin" />
              {t('pos.auto_saving') || "Guardando..."}
            </span>
          )}
          {autoSaveStatus === "saved" && (
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={13} />
              {t('pos.auto_saved') || "Autoguardado"} {lastSavedAt && `(${lastSavedAt})`}
            </span>
          )}
          {autoSaveStatus === "error" && (
            <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertCircle size={13} />
              Error en autoguardado
            </span>
          )}
        </div>

        {/* Right: Empty spacer to balance layout */}
        <div style={{ width: '130px' }} />
      </footer>

      {/* ============================================================== */}
      {/* 5. CHECKOUT / CERRAR VENTA DIALOG                              */}
      {/* ============================================================== */}
      {checkoutSeller && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100001,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#0f172a',
            border: '2px solid #16a34a',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '620px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            animation: 'fadeIn 0.15s ease'
          }}>
            {/* Checkout Header */}
            <div style={{
              padding: '1rem 1.25rem',
              background: '#1e293b',
              borderBottom: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'white' }}>
                  {t('pos.checkout_title') || "Cobrar y Cerrar Venta"}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
                  Vendedor: {checkoutSeller.name}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutSeller(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.3rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Checkout Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {/* Items Summary Table */}
              <div style={{
                background: '#090d16',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '0.75rem',
                maxHeight: '180px',
                overflowY: 'auto'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Líneas de la venta:
                </div>
                {(draftsBySeller[checkoutSeller.id.toString()]?.items || []).map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.35rem 0',
                      borderBottom: '1px solid #1e293b',
                      fontSize: '0.82rem'
                    }}
                  >
                    <span style={{ color: '#f8fafc', fontWeight: 700 }}>
                      {it.quantity} {it.unit} × {it.name}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 900, color: '#10b981' }}>
                      {parseFloat(it.price).toFixed(2)} {currencySymbol}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Display */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1.5px solid #10b981',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>
                  TOTAL A COBRAR:
                </span>
                <span style={{
                  fontSize: '2rem',
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  color: '#10b981'
                }}>
                  {(draftsBySeller[checkoutSeller.id.toString()]?.items || []).reduce((acc, it) => acc + (parseFloat(it.price) || 0), 0).toFixed(2)} {currencySymbol}
                </span>
              </div>

              {/* Customer Selector (Optional) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                  Cliente (opcional)
                </label>
                <select
                  value={checkoutCustomer}
                  onChange={(e) => setCheckoutCustomer(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    padding: '0.6rem 0.75rem',
                    color: 'white',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="">Cliente genérico / Mostrador</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.nif ? `(${c.nif})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                  {t('pos.payment_method') || "Forma de pago"}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: 'cash', label: t('pos.payment_cash') || "Efectivo", icon: Banknote },
                    { id: 'card', label: t('pos.payment_card') || "Tarjeta", icon: CreditCard },
                    { id: 'bizum', label: t('pos.payment_bizum') || "Bizum", icon: Hash },
                    { id: 'transfer', label: t('pos.payment_transfer') || "Transferencia", icon: FileText }
                  ].map(pm => {
                    const isSelected = checkoutPaymentMethod === pm.id;
                    const IconComp = pm.icon;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setCheckoutPaymentMethod(pm.id)}
                        style={{
                          background: isSelected ? 'rgba(34, 197, 94, 0.2)' : '#090d16',
                          border: isSelected ? '1.5px solid #16a34a' : '1px solid #334155',
                          borderRadius: '6px',
                          padding: '0.65rem 0.4rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: isSelected ? '#4ade80' : '#cbd5e1',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        <IconComp size={18} />
                        <span>{pm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cash change calculator */}
              {checkoutPaymentMethod === 'cash' && (
                <div style={{
                  background: '#090d16',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  alignItems: 'center'
                }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      {t('pos.amount_paid') || "Importe entregado"}
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={checkoutAmountPaid}
                      onChange={(e) => setCheckoutAmountPaid(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        padding: '0.45rem',
                        color: 'white',
                        fontFamily: 'monospace',
                        fontSize: '1.1rem',
                        fontWeight: 900,
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      {t('pos.change') || "Cambio a devolver"}
                    </span>
                    <div style={{
                      fontFamily: 'monospace',
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: '#f59e0b'
                    }}>
                      {(() => {
                        const paid = parseFloat(checkoutAmountPaid) || 0;
                        const total = (draftsBySeller[checkoutSeller.id.toString()]?.items || []).reduce((acc, it) => acc + (parseFloat(it.price) || 0), 0);
                        const change = paid > total ? paid - total : 0;
                        return `${change.toFixed(2)} ${currencySymbol}`;
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Checkout Footer */}
            <div style={{
              padding: '1rem 1.25rem',
              background: '#1e293b',
              borderTop: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <button
                type="button"
                onClick={() => setCheckoutSeller(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  padding: '0.6rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                Volver
              </button>

              <button
                type="button"
                onClick={handleFinalizeSale}
                disabled={finalizing}
                style={{
                  background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.75rem 1.75rem',
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(22, 101, 52, 0.4)'
                }}
              >
                {finalizing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                <span>{t('pos.btn_finalize_close') || "Cobrar y Finalizar Venta"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GOODS LOT SELECTION MODAL */}
      <SelectGoodsLotsModal
        isOpen={goodsLotModal.isOpen}
        goods={goodsLotModal.goods}
        initialQuantity={goodsLotModal.initialQuantity}
        initialAllocations={goodsLotModal.initialAllocations}
        currency={profile?.currency || "EUR"}
        onConfirm={handleConfirmGoodsLots}
        onSelectWithoutLot={handleSelectGoodsWithoutLot}
        onClose={() => setGoodsLotModal({ isOpen: false, goods: null, product: null, editingItemId: null, initialQuantity: null, initialAllocations: null })}
      />

    </div>
  );
}
