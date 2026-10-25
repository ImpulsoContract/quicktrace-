import React, { useState, useEffect, useMemo } from "react";
import { 
  X, Link2, Unlink, Search, Loader2, CheckCircle2, 
  AlertCircle, Package, Tag, ArrowRight, DollarSign, Layers
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function LinkGoodsIngredientModal({
  isOpen,
  onClose,
  sourceType, // 'goods' | 'ingredient'
  targetItem, // { id, name, unit, stock, costPrice, linkedIngredientName, linkedGoods }
  currency = "EUR",
  onSuccess
}) {
  const { t } = useI18n();

  const [counterparts, setCounterparts] = useState([]);
  const [loadingCounterparts, setLoadingCounterparts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCounterpart, setSelectedCounterpart] = useState(null);

  // Unify unit options: 'ingredient' | 'goods' | 'manual'
  const [unifyUnitOption, setUnifyUnitOption] = useState("ingredient");
  const [manualUnit, setManualUnit] = useState("");

  // Unify values options: 'ingredient' | 'goods' | 'manual'
  const [unifyValuesOption, setUnifyValuesOption] = useState("ingredient");
  const [manualStock, setManualStock] = useState("");
  const [manualCostPrice, setManualCostPrice] = useState("");

  const [saving, setSaving] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const [error, setError] = useState("");

  const currencySymbol = useMemo(() => {
    const map = { EUR: "€", USD: "$", GBP: "£", MXN: "$", COP: "$" };
    return map[currency] || "€";
  }, [currency]);

  // Load counterparts when modal opens
  useEffect(() => {
    if (!isOpen || !targetItem) return;

    setError("");
    setSearchTerm("");
    setSelectedCounterpart(null);

    const loadData = async () => {
      setLoadingCounterparts(true);
      try {
        if (sourceType === "goods") {
          // Fetch ingredients catalog with stock and prices
          const [invRes, priceRes] = await Promise.all([
            fetch("/api/client/inventory"),
            fetch("/api/ingredient-prices")
          ]);

          const invData = invRes.ok ? await invRes.json() : [];
          const priceData = priceRes.ok ? await priceRes.json() : [];

          const priceMap = {};
          if (Array.isArray(priceData)) {
            priceData.forEach(p => {
              const k = `${p.name.trim().toLowerCase()}_${(p.unit || '').trim().toLowerCase()}`;
              priceMap[k] = p.price;
            });
          }

          const ingList = (Array.isArray(invData) ? invData : []).map(item => {
            const k = `${item.name.trim().toLowerCase()}_${(item.unit || '').trim().toLowerCase()}`;
            const cost = priceMap[k] !== undefined ? priceMap[k] : null;
            return {
              name: item.name,
              unit: item.unit || "",
              stock: item.stock || 0,
              costPrice: cost,
              linkedGoods: item.linkedGoods || null
            };
          });

          setCounterparts(ingList);

          // If current goods item is already linked, preselect that ingredient
          if (targetItem.linkedIngredientName) {
            const existing = ingList.find(
              i => i.name.trim().toLowerCase() === targetItem.linkedIngredientName.trim().toLowerCase()
            );
            if (existing) {
              setSelectedCounterpart(existing);
              setManualUnit(existing.unit || targetItem.unit || "");
              setManualStock(existing.stock !== undefined ? String(existing.stock) : "0");
              setManualCostPrice(existing.costPrice !== null && existing.costPrice !== undefined ? String(existing.costPrice) : "");
            }
          }
        } else {
          // sourceType === 'ingredient' -> Fetch goods for sale catalog
          const res = await fetch("/api/client/goods-for-sale?all=true");
          const data = res.ok ? await res.json() : {};
          const items = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);

          const gfsList = items.map(g => ({
            id: g.id,
            name: g.name,
            unit: g.unit || "",
            stock: g.stock || 0,
            costPrice: g.costPrice,
            salePrice: g.salePrice,
            linkedIngredientName: g.linkedIngredientName || null
          }));

          setCounterparts(gfsList);

          // If current ingredient is already linked, preselect that goods
          const currentLinkedName = targetItem.name.trim().toLowerCase();
          const existing = gfsList.find(
            g => (g.linkedIngredientName && g.linkedIngredientName.trim().toLowerCase() === currentLinkedName) ||
                 (targetItem.linkedGoods && targetItem.linkedGoods.id === g.id)
          );

          if (existing) {
            setSelectedCounterpart(existing);
            setManualUnit(existing.unit || targetItem.unit || "");
            setManualStock(existing.stock !== undefined ? String(existing.stock) : "0");
            setManualCostPrice(existing.costPrice !== null && existing.costPrice !== undefined ? String(existing.costPrice) : "");
          }
        }
      } catch (err) {
        console.error("Error loading counterparts:", err);
        setError(t('alerts.connection_error') || "Error al cargar la información");
      } finally {
        setLoadingCounterparts(false);
      }
    };

    loadData();
  }, [isOpen, sourceType, targetItem]);

  // When a counterpart is picked, initialize manual defaults
  const handleSelectCounterpart = (item) => {
    setSelectedCounterpart(item);
    setError("");

    // Setup sensible defaults for manual fields
    const defUnit = sourceType === "goods" ? (item.unit || targetItem.unit) : (targetItem.unit || item.unit);
    const defStock = item.stock !== undefined ? item.stock : 0;
    const defCost = item.costPrice !== null && item.costPrice !== undefined ? item.costPrice : "";

    setManualUnit(defUnit || "");
    setManualStock(String(defStock));
    setManualCostPrice(defCost !== "" ? String(defCost) : "");
  };

  const filteredCounterparts = useMemo(() => {
    if (!searchTerm.trim()) return counterparts;
    const term = searchTerm.toLowerCase().trim();
    return counterparts.filter(item => 
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.unit && item.unit.toLowerCase().includes(term))
    );
  }, [counterparts, searchTerm]);

  // Source item info display
  const sourceName = targetItem?.name || "";
  const sourceUnit = targetItem?.unit || "";
  const sourceStock = targetItem?.stock !== undefined && targetItem?.stock !== null ? targetItem.stock : 0;
  const sourceCost = targetItem?.costPrice !== undefined && targetItem?.costPrice !== null 
    ? `${targetItem.costPrice} ${currencySymbol}` 
    : "-";

  // Counterpart item info
  const counterpartName = selectedCounterpart?.name || "";
  const counterpartUnit = selectedCounterpart?.unit || "";
  const counterpartStock = selectedCounterpart?.stock !== undefined && selectedCounterpart?.stock !== null ? selectedCounterpart.stock : 0;
  const counterpartCost = selectedCounterpart?.costPrice !== undefined && selectedCounterpart?.costPrice !== null 
    ? `${selectedCounterpart.costPrice} ${currencySymbol}` 
    : "-";

  const isCurrentlyLinked = sourceType === "goods" 
    ? Boolean(targetItem?.linkedIngredientName)
    : Boolean(targetItem?.linkedGoods || (selectedCounterpart && selectedCounterpart.linkedIngredientName?.toLowerCase() === targetItem?.name?.toLowerCase()));

  // Unlink handler
  const handleUnlink = async () => {
    const confirmMsg = t('goods_ingredient_link.unlink_confirm') || 
      "¿Estás seguro de que deseas desvincular este elemento? A partir de ahora su stock y precio de coste se gestionarán por separado.";
    if (!window.confirm(confirmMsg)) return;

    setUnlinking(true);
    setError("");

    try {
      const payload = {
        action: "unlink",
        ...(sourceType === "goods" 
          ? { goodsForSaleId: targetItem.id } 
          : { ingredientName: targetItem.name })
      };

      const res = await fetch("/api/client/goods-for-sale/link-ingredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al desvincular");
      }

      if (onSuccess) onSuccess({ action: "unlink" });
      onClose();
    } catch (err) {
      console.error("Error unlinking:", err);
      setError(err.message || "Error al desvincular");
    } finally {
      setUnlinking(false);
    }
  };

  // Submit link handler
  const handleSaveLink = async (e) => {
    e.preventDefault();

    if (!selectedCounterpart) {
      setError(t('goods_ingredient_link.err_select_counterpart') || "Por favor, selecciona un elemento para enlazar.");
      return;
    }

    if (unifyUnitOption === "manual" && !manualUnit.trim()) {
      setError(t('goods_ingredient_link.err_manual_unit') || "Por favor, introduce la unidad de medida.");
      return;
    }

    if (unifyValuesOption === "manual") {
      const parsedStock = parseFloat(manualStock.toString().replace(',', '.'));
      if (isNaN(parsedStock) || parsedStock < 0) {
        setError(t('goods_ingredient_link.err_manual_stock') || "Por favor, introduce un stock válido mayor o igual a 0.");
        return;
      }
    }

    setSaving(true);
    setError("");

    try {
      const goodsId = sourceType === "goods" ? targetItem.id : selectedCounterpart.id;
      const ingName = sourceType === "goods" ? selectedCounterpart.name : targetItem.name;

      const payload = {
        action: "link",
        goodsForSaleId: goodsId,
        ingredientName: ingName,
        unifyUnitOption,
        manualUnit: manualUnit.trim(),
        unifyValuesOption,
        manualStock: manualStock !== "" ? manualStock : 0,
        manualCostPrice: manualCostPrice !== "" ? manualCostPrice : null
      };

      const res = await fetch("/api/client/goods-for-sale/link-ingredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al enlazar");
      }

      if (onSuccess) onSuccess({ action: "link", data: data.data });
      onClose();
    } catch (err) {
      console.error("Error saving link:", err);
      setError(err.message || "Error al enlazar");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 11000 }}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '780px', 
          width: '95%', 
          maxHeight: '92vh', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '2rem', 
          position: 'relative' 
        }}
      >
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute', 
            top: '1.5rem', 
            right: '1.5rem', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: 'var(--text-muted)' 
          }}
          title={t('common.cancel') || "Cerrar"}
        >
          <X size={24} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.25rem', paddingRight: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '10px', 
              background: '#ecfdf5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--corp-green)' 
            }}>
              <Link2 size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>
                {sourceType === "goods"
                  ? (t('goods_ingredient_link.modal_title_goods') || "Enlazar mercancía con ingrediente")
                  : (t('goods_ingredient_link.modal_title_ingredient') || "Enlazar ingrediente con mercancía en venta")}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                {t('goods_ingredient_link.modal_subtitle') || 
                  "Al enlazar una mercancía con un ingrediente, compartirán stock, precio de coste y unidad de medida."}
              </p>
            </div>
          </div>

          {/* Current Source Item Card */}
          <div style={{ 
            background: '#f8fafc', 
            border: '1px solid var(--border)', 
            borderRadius: '8px', 
            padding: '0.75rem 1rem', 
            marginTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {sourceType === "goods" ? <Tag size={18} style={{ color: 'var(--corp-green)' }} /> : <Package size={18} style={{ color: 'var(--corp-green)' }} />}
              <div>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {sourceType === "goods" ? "Mercancía seleccionada" : "Ingrediente seleccionado"}:
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginLeft: '0.4rem' }}>
                  {sourceName}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.83rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Unidad: </span>
                <span style={{ fontWeight: 700, color: '#334155' }}>{sourceUnit || "-"}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Stock: </span>
                <span style={{ fontWeight: 800, color: 'var(--corp-green)' }}>{sourceStock}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Coste: </span>
                <span style={{ fontWeight: 700, color: '#334155' }}>{sourceCost}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{ 
            padding: '0.75rem 1rem', 
            background: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: '6px', 
            color: '#dc2626', 
            fontSize: '0.88rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginBottom: '1rem' 
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
          
          {/* SECTION 1: Select counterpart */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.65rem' }}>
              {sourceType === "goods"
                ? (t('goods_ingredient_link.section_select_ingredient') || "1. Seleccionar ingrediente")
                : (t('goods_ingredient_link.section_select_goods') || "1. Seleccionar mercancía en venta")}
            </h3>

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '2.25rem', fontSize: '0.88rem' }}
                placeholder={sourceType === "goods"
                  ? (t('goods_ingredient_link.search_ingredient') || "Buscar ingrediente...")
                  : (t('goods_ingredient_link.search_goods') || "Buscar mercancía en venta...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Counterparts list */}
            {loadingCounterparts ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.75rem', color: 'var(--text-muted)' }}>
                <Loader2 className="animate-spin" size={22} style={{ color: 'var(--corp-green)' }} />
                <span>{t('common.loading') || "Cargando catálogo..."}</span>
              </div>
            ) : filteredCounterparts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '8px' }}>
                <p style={{ margin: 0, fontSize: '0.88rem' }}>
                  {sourceType === "goods"
                    ? (t('goods_ingredient_link.no_ingredients_found') || "No se encontraron ingredientes.")
                    : (t('goods_ingredient_link.no_goods_found') || "No se encontraron mercancías en venta.")}
                </p>
              </div>
            ) : (
              <div style={{ 
                maxHeight: '190px', 
                overflowY: 'auto', 
                border: '1px solid var(--border)', 
                borderRadius: '8px', 
                background: '#ffffff' 
              }}>
                {filteredCounterparts.map((item, idx) => {
                  const isSelected = selectedCounterpart && selectedCounterpart.name.toLowerCase() === item.name.toLowerCase();
                  const isLinkedToAnother = sourceType === "goods"
                    ? (item.linkedGoods && item.linkedGoods.id !== targetItem.id)
                    : (item.linkedIngredientName && item.linkedIngredientName.toLowerCase() !== targetItem.name.toLowerCase());

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectCounterpart(item)}
                      style={{
                        padding: '0.65rem 1rem',
                        borderBottom: idx === filteredCounterparts.length - 1 ? 'none' : '1px solid var(--border)',
                        background: isSelected ? '#ecfdf5' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input
                          type="radio"
                          name="counterpart_selection"
                          checked={isSelected}
                          onChange={() => handleSelectCounterpart(item)}
                          style={{ cursor: 'pointer', accentColor: 'var(--corp-green)' }}
                        />
                        <div>
                          <span style={{ fontWeight: isSelected ? 800 : 600, color: isSelected ? 'var(--corp-green)' : 'var(--text-main)', fontSize: '0.9rem' }}>
                            {item.name}
                          </span>
                          <span style={{ marginLeft: '0.5rem', background: '#f1f5f9', color: '#475569', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {item.unit || "-"}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
                        {isLinkedToAnother && (
                          <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            {sourceType === "goods" 
                              ? (t('goods_ingredient_link.already_linked_to_other') || "Ya enlazado")
                              : (t('goods_ingredient_link.already_linked_to_other_ing') || "Ya enlazada")}
                          </span>
                        )}

                        <span style={{ color: 'var(--text-muted)' }}>
                          Stock: <strong style={{ color: item.stock > 0 ? 'var(--corp-green)' : '#64748b' }}>{item.stock}</strong>
                        </span>

                        <span style={{ color: 'var(--text-muted)' }}>
                          Coste: <strong style={{ color: '#334155' }}>
                            {item.costPrice !== null && item.costPrice !== undefined ? `${item.costPrice} ${currencySymbol}` : "-"}
                          </strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* If counterpart is selected, show unification sections */}
          {selectedCounterpart && (
            <>
              {/* SECTION 2: Unify Unit of Measure */}
              <div style={{ 
                background: '#f8fafc', 
                border: '1px solid var(--border)', 
                borderRadius: '8px', 
                padding: '1rem', 
                marginBottom: '1.25rem' 
              }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.75rem 0' }}>
                  {t('goods_ingredient_link.section_unify_unit') || "2. Unificar unidad de medida"}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Option A: Ingredient unit */}
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.6rem', 
                    cursor: 'pointer', 
                    padding: '0.45rem 0.65rem', 
                    borderRadius: '6px',
                    background: unifyUnitOption === "ingredient" ? '#ffffff' : 'transparent',
                    border: unifyUnitOption === "ingredient" ? '1px solid var(--corp-green)' : '1px solid transparent'
                  }}>
                    <input
                      type="radio"
                      name="unify_unit"
                      value="ingredient"
                      checked={unifyUnitOption === "ingredient"}
                      onChange={() => setUnifyUnitOption("ingredient")}
                      style={{ accentColor: 'var(--corp-green)' }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: unifyUnitOption === "ingredient" ? 700 : 500 }}>
                      {t('goods_ingredient_link.unit_opt_ingredient', { unit: sourceType === "goods" ? counterpartUnit : sourceUnit }) || 
                        `Unidad del ingrediente: ${sourceType === "goods" ? counterpartUnit : sourceUnit}`}
                    </span>
                  </label>

                  {/* Option B: Goods unit */}
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.6rem', 
                    cursor: 'pointer', 
                    padding: '0.45rem 0.65rem', 
                    borderRadius: '6px',
                    background: unifyUnitOption === "goods" ? '#ffffff' : 'transparent',
                    border: unifyUnitOption === "goods" ? '1px solid var(--corp-green)' : '1px solid transparent'
                  }}>
                    <input
                      type="radio"
                      name="unify_unit"
                      value="goods"
                      checked={unifyUnitOption === "goods"}
                      onChange={() => setUnifyUnitOption("goods")}
                      style={{ accentColor: 'var(--corp-green)' }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: unifyUnitOption === "goods" ? 700 : 500 }}>
                      {t('goods_ingredient_link.unit_opt_goods', { unit: sourceType === "goods" ? sourceUnit : counterpartUnit }) || 
                        `Unidad de la mercancía: ${sourceType === "goods" ? sourceUnit : counterpartUnit}`}
                    </span>
                  </label>

                  {/* Option C: Manual unit */}
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.6rem', 
                    cursor: 'pointer', 
                    padding: '0.45rem 0.65rem', 
                    borderRadius: '6px',
                    background: unifyUnitOption === "manual" ? '#ffffff' : 'transparent',
                    border: unifyUnitOption === "manual" ? '1px solid var(--corp-green)' : '1px solid transparent'
                  }}>
                    <input
                      type="radio"
                      name="unify_unit"
                      value="manual"
                      checked={unifyUnitOption === "manual"}
                      onChange={() => setUnifyUnitOption("manual")}
                      style={{ accentColor: 'var(--corp-green)' }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: unifyUnitOption === "manual" ? 700 : 500 }}>
                      {t('goods_ingredient_link.unit_opt_manual') || "Introducir a mano:"}
                    </span>
                    {unifyUnitOption === "manual" && (
                      <input
                        type="text"
                        className="input-field"
                        style={{ width: '130px', padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                        placeholder={t('goods_ingredient_link.unit_manual_placeholder') || "Ej: kg, L, ud..."}
                        value={manualUnit}
                        onChange={(e) => setManualUnit(e.target.value)}
                        autoFocus
                      />
                    )}
                  </label>
                </div>
              </div>

              {/* SECTION 3: Unify Stock and Cost Price */}
              <div style={{ 
                background: '#f8fafc', 
                border: '1px solid var(--border)', 
                borderRadius: '8px', 
                padding: '1rem', 
                marginBottom: '1rem' 
              }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.75rem 0' }}>
                  {t('goods_ingredient_link.section_unify_values') || "3. Unificar stock y precio de coste"}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Option A: Ingredient values */}
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.6rem', 
                    cursor: 'pointer', 
                    padding: '0.45rem 0.65rem', 
                    borderRadius: '6px',
                    background: unifyValuesOption === "ingredient" ? '#ffffff' : 'transparent',
                    border: unifyValuesOption === "ingredient" ? '1px solid var(--corp-green)' : '1px solid transparent'
                  }}>
                    <input
                      type="radio"
                      name="unify_values"
                      value="ingredient"
                      checked={unifyValuesOption === "ingredient"}
                      onChange={() => setUnifyValuesOption("ingredient")}
                      style={{ accentColor: 'var(--corp-green)' }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: unifyValuesOption === "ingredient" ? 700 : 500 }}>
                      {t('goods_ingredient_link.values_opt_ingredient', { 
                        stock: sourceType === "goods" ? counterpartStock : sourceStock, 
                        cost: sourceType === "goods" ? counterpartCost : sourceCost 
                      }) || `Valores del ingrediente (Stock: ${sourceType === "goods" ? counterpartStock : sourceStock}, Coste: ${sourceType === "goods" ? counterpartCost : sourceCost})`}
                    </span>
                  </label>

                  {/* Option B: Goods values */}
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.6rem', 
                    cursor: 'pointer', 
                    padding: '0.45rem 0.65rem', 
                    borderRadius: '6px',
                    background: unifyValuesOption === "goods" ? '#ffffff' : 'transparent',
                    border: unifyValuesOption === "goods" ? '1px solid var(--corp-green)' : '1px solid transparent'
                  }}>
                    <input
                      type="radio"
                      name="unify_values"
                      value="goods"
                      checked={unifyValuesOption === "goods"}
                      onChange={() => setUnifyValuesOption("goods")}
                      style={{ accentColor: 'var(--corp-green)' }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: unifyValuesOption === "goods" ? 700 : 500 }}>
                      {t('goods_ingredient_link.values_opt_goods', { 
                        stock: sourceType === "goods" ? sourceStock : counterpartStock, 
                        cost: sourceType === "goods" ? sourceCost : counterpartCost 
                      }) || `Valores de la mercancía en venta (Stock: ${sourceType === "goods" ? sourceStock : counterpartStock}, Coste: ${sourceType === "goods" ? sourceCost : counterpartCost})`}
                    </span>
                  </label>

                  {/* Option C: Manual values */}
                  <div style={{ 
                    padding: '0.45rem 0.65rem', 
                    borderRadius: '6px',
                    background: unifyValuesOption === "manual" ? '#ffffff' : 'transparent',
                    border: unifyValuesOption === "manual" ? '1px solid var(--corp-green)' : '1px solid transparent'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="unify_values"
                        value="manual"
                        checked={unifyValuesOption === "manual"}
                        onChange={() => setUnifyValuesOption("manual")}
                        style={{ accentColor: 'var(--corp-green)' }}
                      />
                      <span style={{ fontSize: '0.88rem', fontWeight: unifyValuesOption === "manual" ? 700 : 500 }}>
                        {t('goods_ingredient_link.values_opt_manual') || "Introducir a mano:"}
                      </span>
                    </label>

                    {unifyValuesOption === "manual" && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.6rem', paddingLeft: '1.6rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            {t('goods_ingredient_link.manual_stock_label') || "Stock:"}
                          </span>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            className="input-field"
                            style={{ width: '100px', padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                            value={manualStock}
                            onChange={(e) => setManualStock(e.target.value)}
                            placeholder="0"
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            {t('goods_ingredient_link.manual_cost_label') || "Precio coste:"}
                          </span>
                          <input
                            type="text"
                            className="input-field"
                            style={{ width: '100px', padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                            value={manualCostPrice}
                            onChange={(e) => setManualCostPrice(e.target.value)}
                            placeholder="0.00"
                          />
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currencySymbol}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{ 
          marginTop: '1rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid var(--border)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          {/* Left: Unlink button if already linked */}
          {isCurrentlyLinked ? (
            <button
              type="button"
              onClick={handleUnlink}
              disabled={unlinking || saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 0.95rem',
                borderRadius: '6px',
                border: '1px solid #fecaca',
                background: '#fef2f2',
                color: '#dc2626',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: (unlinking || saving) ? 'not-allowed' : 'pointer'
              }}
            >
              {unlinking ? <Loader2 size={16} className="animate-spin" /> : <Unlink size={16} />}
              <span>{t('goods_ingredient_link.btn_unlink') || "Desvincular"}</span>
            </button>
          ) : <div />}

          {/* Right: Cancel & Save buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '0.55rem 1.15rem', fontSize: '0.88rem' }}
              disabled={saving || unlinking}
            >
              {t('common.cancel') || "Cancelar"}
            </button>

            <button
              type="button"
              onClick={handleSaveLink}
              className="btn-primary"
              style={{ 
                padding: '0.55rem 1.35rem', 
                fontSize: '0.88rem', 
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
              disabled={saving || unlinking || !selectedCounterpart}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Link2 size={16} />}
              <span>{t('goods_ingredient_link.btn_save_link') || "Guardar enlace y unificar"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
