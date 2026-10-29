"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Search, PlusCircle, Check, Loader2, Info, Package, Plus, Trash2, ScanBarcode } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function RelateGoodsReceiptModal({
  isOpen,
  onClose,
  productName = "",
  defaultQuantity = "",
  initialIngredients = [],
  initialQuantities = {},
  initialGoodsForSaleId = null,
  initialGoodsForSaleQuantity = "",
  initialGoodsForSaleCostPrice = "",
  initialBarcode = "",
  recipes = [],
  profile,
  onSave
}) {
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState(
    initialGoodsForSaleId && (!initialIngredients || initialIngredients.length === 0)
      ? "goodsForSale"
      : "ingredients"
  );

  // Ingredients Tab State
  const [ingSearchTerm, setIngSearchTerm] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [quantities, setQuantities] = useState({});

  // Goods For Sale Tab State
  const [goodsSearchTerm, setGoodsSearchTerm] = useState("");
  const [goodsForSaleList, setGoodsForSaleList] = useState([]);
  const [loadingGoods, setLoadingGoods] = useState(false);
  const [selectedGfsId, setSelectedGfsId] = useState(null);
  const [gfsQuantity, setGfsQuantity] = useState("");
  const [gfsCostPrice, setGfsCostPrice] = useState("");
  const [gfsBarcode, setGfsBarcode] = useState("");

  // Sub-modal for creating a new GoodsForSale
  const [isAddGfsOpen, setIsAddGfsOpen] = useState(false);
  const [newGfsForm, setNewGfsForm] = useState({ name: "", unit: "ud", salePrice: "", barcode: "" });
  const [savingNewGfs, setSavingNewGfs] = useState(false);

  const currencySymbol = useMemo(() => {
    const cur = profile?.currency || "EUR";
    const map = { EUR: "€", USD: "$", GBP: "£", MXN: "$", COP: "$", ARS: "$" };
    return map[cur] || cur;
  }, [profile?.currency]);

  const commonUnits = ["kg", "g", "l", "ml", "ud", "caja", "paquete", "botella", "bandeja", "bolsa"];

  // Initialize data when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIngredients(Array.isArray(initialIngredients) ? [...initialIngredients] : []);
      setQuantities(
        initialQuantities && typeof initialQuantities === "object"
          ? { ...initialQuantities }
          : {}
      );
      setSelectedGfsId(initialGoodsForSaleId ? parseInt(initialGoodsForSaleId, 10) : null);
      setGfsQuantity(
        initialGoodsForSaleQuantity !== null && initialGoodsForSaleQuantity !== undefined
          ? initialGoodsForSaleQuantity.toString()
          : ""
      );
      setGfsCostPrice(
        initialGoodsForSaleCostPrice !== null && initialGoodsForSaleCostPrice !== undefined
          ? initialGoodsForSaleCostPrice.toString()
          : ""
      );
      setGfsBarcode(initialBarcode || "");
      setIngSearchTerm("");
      setGoodsSearchTerm("");
      fetchGoodsForSale();
    }
  }, [
    isOpen,
    initialIngredients,
    initialQuantities,
    initialGoodsForSaleId,
    initialGoodsForSaleQuantity,
    initialGoodsForSaleCostPrice,
    initialBarcode
  ]);

  const fetchGoodsForSale = async () => {
    setLoadingGoods(true);
    try {
      const res = await fetch("/api/client/goods-for-sale");
      const data = await res.json();
      if (res.ok && data.success) {
        const list = data.data || [];
        setGoodsForSaleList(list);

        // Auto-link if initial selections were provided:
        if (initialGoodsForSaleId) {
          const gId = parseInt(initialGoodsForSaleId, 10);
          const foundGood = list.find(g => g.id === gId);
          if (foundGood) {
            const linkedIng = findIngredientForGoods(foundGood);
            if (linkedIng) {
              setSelectedIngredients(prev => {
                const exists = prev.some(i => i.toLowerCase() === linkedIng.toLowerCase());
                return exists ? prev : [...prev, linkedIng];
              });
            }
          }
        } else if (Array.isArray(initialIngredients) && initialIngredients.length > 0) {
          for (const ingName of initialIngredients) {
            const matchedGood = findGoodsForIngredient(ingName, list);
            if (matchedGood) {
              setSelectedGfsId(matchedGood.id);
              if (!initialGoodsForSaleCostPrice && matchedGood.costPrice != null) {
                setGfsCostPrice(matchedGood.costPrice.toString());
              }
              if (!initialGoodsForSaleQuantity && defaultQuantity) {
                setGfsQuantity(defaultQuantity.toString());
              }
              break;
            }
          }
        }
      }
    } catch (err) {
      console.error("Error fetching goods for sale:", err);
    } finally {
      setLoadingGoods(false);
    }
  };

  // Recipe ingredients helpers
  const allIngredients = useMemo(() => {
    const set = new Set();
    (recipes || []).forEach(r => {
      (r.ingredients || []).forEach(i => {
        if (i.name && i.name.trim()) set.add(i.name.trim());
      });
    });
    return Array.from(set).sort();
  }, [recipes]);

  const findGoodsForIngredient = (ingName, list = goodsForSaleList) => {
    if (!ingName || !list.length) return null;
    const clean = ingName.trim().toLowerCase();
    const explicit = list.find(
      g => g.linkedIngredientName && g.linkedIngredientName.trim().toLowerCase() === clean
    );
    if (explicit) return explicit;
    return list.find(
      g => g.name && g.name.trim().toLowerCase() === clean
    ) || null;
  };

  const findIngredientForGoods = (good, ings = allIngredients) => {
    if (!good || !ings.length) return null;
    if (good.linkedIngredientName) {
      const cleanLinked = good.linkedIngredientName.trim().toLowerCase();
      const match = ings.find(i => i.trim().toLowerCase() === cleanLinked);
      if (match) return match;
    }
    const cleanName = (good.name || "").trim().toLowerCase();
    return ings.find(i => i.trim().toLowerCase() === cleanName) || null;
  };

  const isLinked = (good, ingName) => {
    if (!good || !ingName) return false;
    const clean = ingName.trim().toLowerCase();
    return (
      (good.linkedIngredientName && good.linkedIngredientName.trim().toLowerCase() === clean) ||
      (good.name && good.name.trim().toLowerCase() === clean)
    );
  };

  const getIngredientsWithUnits = (ingNames) => {
    const results = [];
    const seen = new Set();
    (recipes || []).forEach(r => {
      (r.ingredients || []).forEach(i => {
        if (i.name && ingNames.includes(i.name.trim())) {
          const name = i.name.trim();
          const unit = i.unit ? i.unit.trim() : "kg";
          const key = `${name}:${unit}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({ name, unit });
          }
        }
      });
    });
    return results;
  };

  // Filtered lists
  const filteredIngredients = useMemo(() => {
    const term = ingSearchTerm.trim().toLowerCase();
    if (!term) return allIngredients;
    return allIngredients.filter(ing => ing.toLowerCase().includes(term));
  }, [allIngredients, ingSearchTerm]);

  const filteredGoodsForSale = useMemo(() => {
    const term = goodsSearchTerm.trim().toLowerCase();
    if (!term) return goodsForSaleList;
    return goodsForSaleList.filter(g =>
      (g.name && g.name.toLowerCase().includes(term)) ||
      (g.unit && g.unit.toLowerCase().includes(term))
    );
  }, [goodsForSaleList, goodsSearchTerm]);

  const selectedGood = useMemo(() => {
    if (!selectedGfsId) return null;
    return goodsForSaleList.find(g => g.id === selectedGfsId) || null;
  }, [goodsForSaleList, selectedGfsId]);

  // Two-way toggle handlers
  const handleToggleIngredient = (ing) => {
    const isSelected = selectedIngredients.includes(ing);
    let nextSelected;
    if (isSelected) {
      nextSelected = selectedIngredients.filter(i => i !== ing);
    } else {
      nextSelected = [...selectedIngredients, ing];
    }
    setSelectedIngredients(nextSelected);

    const relatedGfs = findGoodsForIngredient(ing);
    if (relatedGfs) {
      if (!isSelected) {
        // Selecting ingredient -> auto-select related Goods for sale
        setSelectedGfsId(relatedGfs.id);
        if (!gfsQuantity && defaultQuantity) {
          setGfsQuantity(defaultQuantity.toString());
        }
        if (!gfsCostPrice && relatedGfs.costPrice != null) {
          setGfsCostPrice(relatedGfs.costPrice.toString());
        }
      } else {
        // Deselecting ingredient -> if this was the one that selected selectedGfsId, check if any remaining ingredient still relates
        if (selectedGfsId === relatedGfs.id) {
          const stillRelated = nextSelected.some(otherIng => {
            const g = findGoodsForIngredient(otherIng);
            return g && g.id === relatedGfs.id;
          });
          if (!stillRelated) {
            setSelectedGfsId(null);
            setGfsQuantity("");
            setGfsCostPrice("");
          }
        }
      }
    }
  };

  const handleToggleGoodsForSale = (good) => {
    const isSelected = selectedGfsId === good.id;
    if (isSelected) {
      // Deselecting goods for sale
      setSelectedGfsId(null);
      setGfsQuantity("");
      setGfsCostPrice("");

      const linkedIng = findIngredientForGoods(good);
      if (linkedIng) {
        setSelectedIngredients(prev => prev.filter(i => i.toLowerCase() !== linkedIng.toLowerCase()));
      }
    } else {
      // Selecting goods for sale
      setSelectedGfsId(good.id);
      if (!gfsQuantity && defaultQuantity) {
        setGfsQuantity(defaultQuantity.toString());
      }
      if (!gfsCostPrice && good.costPrice != null) {
        setGfsCostPrice(good.costPrice.toString());
      }

      const linkedIng = findIngredientForGoods(good);
      if (linkedIng) {
        setSelectedIngredients(prev => {
          const already = prev.some(i => i.toLowerCase() === linkedIng.toLowerCase());
          return already ? prev : [...prev, linkedIng];
        });
        const units = getIngredientsWithUnits([linkedIng]);
        if (units.length > 0) {
          setQuantities(prev => {
            const updated = { ...prev };
            units.forEach(u => {
              const k = `${u.name}:${u.unit}`;
              if (!updated[k] && (gfsQuantity || defaultQuantity)) {
                updated[k] = (gfsQuantity || defaultQuantity).toString();
              }
            });
            return updated;
          });
        }
      }
    }
  };

  const handleGfsQuantityChange = (val) => {
    setGfsQuantity(val);
    if (selectedGood) {
      const linkedIng = findIngredientForGoods(selectedGood);
      if (linkedIng) {
        const units = getIngredientsWithUnits([linkedIng]);
        if (units.length > 0) {
          setQuantities(prev => {
            const next = { ...prev };
            units.forEach(u => {
              next[`${u.name}:${u.unit}`] = val;
            });
            return next;
          });
        }
      }
    }
  };

  const handleIngredientQuantityChange = (key, val, ingName) => {
    setQuantities(prev => ({ ...prev, [key]: val }));
    if (selectedGood && isLinked(selectedGood, ingName)) {
      setGfsQuantity(val);
    }
  };

  // Handle Create New Goods For Sale
  const handleCreateNewGfs = async (e) => {
    e.preventDefault();
    const trimmedName = newGfsForm.name.trim();
    const trimmedUnit = newGfsForm.unit.trim();
    const parsedPrice = parseFloat(newGfsForm.salePrice.toString().replace(',', '.'));

    if (!trimmedName) {
      alert(t('goods_for_sale.name_required') || "Por favor, introduce el nombre de la mercancía.");
      return;
    }
    if (!trimmedUnit) {
      alert(t('goods_for_sale.unit_required') || "Por favor, introduce la unidad de medida.");
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      alert(t('goods_for_sale.price_invalid') || "Por favor, introduce un precio de venta válido mayor o igual a 0.");
      return;
    }

    setSavingNewGfs(true);
    try {
      const res = await fetch("/api/client/goods-for-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          unit: trimmedUnit,
          salePrice: parsedPrice,
          barcode: newGfsForm.barcode ? newGfsForm.barcode.trim() : null
        })
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const newItem = data.data;
        setGoodsForSaleList(prev => [newItem, ...prev]);
        setSelectedGfsId(newItem.id);
        if (!gfsQuantity && defaultQuantity) {
          setGfsQuantity(defaultQuantity.toString());
        }
        const linkedIng = findIngredientForGoods(newItem);
        if (linkedIng) {
          setSelectedIngredients(prev => {
            const already = prev.some(i => i.toLowerCase() === linkedIng.toLowerCase());
            return already ? prev : [...prev, linkedIng];
          });
        }
        setIsAddGfsOpen(false);
        setNewGfsForm({ name: "", unit: "ud", salePrice: "", barcode: "" });
      } else {
        alert(data.error || t('alerts.request_error'));
      }
    } catch (err) {
      console.error("Error creating new good for sale:", err);
      alert(t('alerts.request_error'));
    } finally {
      setSavingNewGfs(false);
    }
  };

  // Handle Save Link Modal
  const handleSave = () => {
    // Clean up ingredients quantities
    const activeWithUnits = getIngredientsWithUnits(selectedIngredients);
    const validKeys = new Set(activeWithUnits.map(item => `${item.name}:${item.unit}`));
    const cleanedQuantities = {};
    for (const key of validKeys) {
      if (quantities[key] !== undefined && quantities[key] !== "") {
        cleanedQuantities[key] = quantities[key];
      }
    }

    let parsedGfsQty = null;
    let parsedGfsCost = null;

    if (selectedGfsId) {
      let effectiveGfsQty = gfsQuantity;
      if ((effectiveGfsQty === "" || effectiveGfsQty === null || effectiveGfsQty === undefined) && selectedGood) {
        const linkedIng = findIngredientForGoods(selectedGood);
        if (linkedIng) {
          const units = getIngredientsWithUnits([linkedIng]);
          for (const u of units) {
            const k = `${u.name}:${u.unit}`;
            if (cleanedQuantities[k]) {
              effectiveGfsQty = cleanedQuantities[k];
              break;
            }
          }
        }
      }

      if (effectiveGfsQty !== "" && effectiveGfsQty !== null && effectiveGfsQty !== undefined) {
        const parsed = parseFloat(effectiveGfsQty.toString().replace(',', '.'));
        if (isNaN(parsed) || parsed < 0) {
          alert(t('goods_receipt_form.stock_quantity_invalid') || "La cantidad añadida al stock debe ser un número válido mayor o igual a 0.");
          return;
        }
        parsedGfsQty = parsed;
      }

      if (gfsCostPrice !== "" && gfsCostPrice !== null && gfsCostPrice !== undefined) {
        const parsedCost = parseFloat(gfsCostPrice.toString().replace(',', '.'));
        if (isNaN(parsedCost) || parsedCost < 0) {
          alert(t('goods_receipt_form.cost_price_invalid') || "El precio de coste debe ser un número válido mayor o igual a 0.");
          return;
        }
        parsedGfsCost = parsedCost;
      }

      // Ensure that if parsedGfsQty is set, the linked ingredient in cleanedQuantities has it
      if (selectedGood && parsedGfsQty !== null) {
        const linkedIng = findIngredientForGoods(selectedGood);
        if (linkedIng) {
          const units = getIngredientsWithUnits([linkedIng]);
          units.forEach(u => {
            const k = `${u.name}:${u.unit}`;
            if (!cleanedQuantities[k]) {
              cleanedQuantities[k] = parsedGfsQty.toString();
            }
          });
        }
      }
    }

    onSave({
      relatedIngredients: selectedIngredients,
      relatedQuantities: cleanedQuantities,
      goodsForSaleId: selectedGfsId,
      goodsForSaleQuantity: parsedGfsQty,
      goodsForSaleCostPrice: parsedGfsCost,
      goodsForSale: selectedGood,
      barcode: gfsBarcode ? gfsBarcode.trim() : null
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1150 }}>
      <div
        className="modal-content glass-card"
        style={{
          maxWidth: '720px',
          width: '94%',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          maxHeight: '90vh',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <header
          style={{
            borderBottom: '1px solid var(--border)',
            paddingBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            flexShrink: 0
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--corp-green)', margin: 0 }}>
              {t('goods_receipt_form.relate_entry_with_ingredients') || "Relacionar esta entrada con un ingrediente o una mercancía en venta"}
            </h3>
            {productName && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', marginBottom: 0 }}>
                {productName}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </header>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', gap: '0.5rem', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setActiveTab("ingredients")}
            style={{
              padding: '0.65rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === "ingredients" ? '3px solid var(--corp-green)' : '3px solid transparent',
              color: activeTab === "ingredients" ? 'var(--corp-green)' : 'var(--text-muted)',
              fontWeight: activeTab === "ingredients" ? '800' : '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{t('goods_receipt_form.tab_ingredients') || "Ingredientes"}</span>
            {selectedIngredients.length > 0 && (
              <span style={{
                background: activeTab === "ingredients" ? 'var(--corp-green)' : '#cbd5e1',
                color: 'white',
                fontSize: '0.72rem',
                padding: '0.1rem 0.45rem',
                borderRadius: '1rem',
                fontWeight: '700'
              }}>
                {selectedIngredients.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("goodsForSale")}
            style={{
              padding: '0.65rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === "goodsForSale" ? '3px solid var(--corp-green)' : '3px solid transparent',
              color: activeTab === "goodsForSale" ? 'var(--corp-green)' : 'var(--text-muted)',
              fontWeight: activeTab === "goodsForSale" ? '800' : '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{t('goods_receipt_form.tab_goods_for_sale') || "Mercancías en venta"}</span>
            {selectedGfsId && (
              <span style={{
                background: 'var(--corp-green)',
                color: 'white',
                fontSize: '0.72rem',
                padding: '0.1rem 0.45rem',
                borderRadius: '1rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}>
                <Check size={11} /> 1
              </span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingRight: '0.5rem', minHeight: 0 }}>
          {/* TAB 1: INGREDIENTES */}
          {activeTab === "ingredients" && (
            <>
              <div className="form-group" style={{ margin: 0, flexShrink: 0 }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder={t('goods_receipt_form.search_ingredients_placeholder') || "Buscar ingrediente..."}
                  value={ingSearchTerm}
                  onChange={(e) => setIngSearchTerm(e.target.value)}
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  maxHeight: '180px',
                  minHeight: '100px',
                  flexShrink: 0,
                  overflowY: 'auto',
                  padding: '0.75rem',
                  background: '#f8fafc',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--border)',
                  alignContent: 'flex-start'
                }}
              >
                {filteredIngredients.length === 0 ? (
                  <p style={{ margin: 'auto', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {t('goods_receipt_form.no_ingredients_found') || "No se encontraron ingredientes."}
                  </p>
                ) : (
                  filteredIngredients.map((ing, idx) => {
                    const isSelected = selectedIngredients.includes(ing);
                    const isLinkedToGood = Boolean(findGoodsForIngredient(ing));
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleToggleIngredient(ing)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          border: isSelected ? '1px solid var(--corp-green)' : '1px solid var(--border)',
                          background: isSelected ? 'var(--corp-green)' : 'white',
                          color: isSelected ? 'white' : 'var(--text-main)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                        title={isLinkedToGood ? "Relacionado con una mercancía en venta" : undefined}
                      >
                        {isSelected && <Check size={12} />}
                        {isLinkedToGood && <Package size={12} color={isSelected ? 'white' : 'var(--corp-green)'} />}
                        <span>{ing}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* TAB 2: MERCANCÍAS EN VENTA */}
          {activeTab === "goodsForSale" && (
            <>
              {/* Search & Add New Goods Button */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="input-field"
                    placeholder={t('goods_receipt_form.search_goods_for_sale_placeholder') || "Buscar mercancía en venta..."}
                    value={goodsSearchTerm}
                    onChange={(e) => setGoodsSearchTerm(e.target.value)}
                    style={{ padding: '0.5rem 0.75rem 0.5rem 2.2rem', fontSize: '0.85rem', margin: 0 }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNewGfsForm({ name: "", unit: "ud", salePrice: "" });
                    setIsAddGfsOpen(true);
                  }}
                  className="btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    color: 'var(--corp-green)',
                    borderColor: 'var(--corp-green)'
                  }}
                >
                  <Plus size={15} />
                  <span>{t('goods_receipt_form.btn_add_goods_for_sale') || "+ Añadir mercancía en venta"}</span>
                </button>
              </div>

              {/* List of Goods for Sale */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  maxHeight: '180px',
                  minHeight: '100px',
                  flexShrink: 0,
                  overflowY: 'auto',
                  padding: '0.75rem',
                  background: '#f8fafc',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--border)',
                  alignContent: 'flex-start'
                }}
              >
                {loadingGoods ? (
                  <div style={{ margin: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Loader2 className="animate-spin" size={16} />
                    <span>{t('common.loading') || "Cargando mercancías..."}</span>
                  </div>
                ) : goodsForSaleList.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <p style={{ margin: 0, fontWeight: '600' }}>
                      {t('goods_receipt_form.empty_goods_for_sale') || "No tienes mercancías en venta creadas todavía."}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddGfsOpen(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--corp-green)',
                        fontWeight: '700',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        marginTop: '0.35rem',
                        fontSize: '0.82rem'
                      }}
                    >
                      {t('goods_receipt_form.btn_add_goods_for_sale') || "+ Añadir mercancía en venta"}
                    </button>
                  </div>
                ) : filteredGoodsForSale.length === 0 ? (
                  <p style={{ margin: 'auto', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {t('goods_receipt_form.no_goods_for_sale_match') || "No se encontraron mercancías con ese nombre."}
                  </p>
                ) : (
                  filteredGoodsForSale.map(good => {
                    const isSelected = selectedGfsId === good.id;
                    return (
                      <button
                        type="button"
                        key={good.id}
                        onClick={() => handleToggleGoodsForSale(good)}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '0.75rem',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          border: isSelected ? '2px solid var(--corp-green)' : '1px solid var(--border)',
                          background: isSelected ? '#ecfdf5' : 'white',
                          color: isSelected ? '#065f46' : 'var(--text-main)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          boxShadow: isSelected ? '0 2px 6px rgba(16, 185, 129, 0.15)' : 'none'
                        }}
                      >
                        <Package size={14} color={isSelected ? 'var(--corp-green)' : '#94a3b8'} />
                        <span style={{ fontWeight: '700' }}>{good.name}</span>
                        <span style={{
                          background: isSelected ? '#d1fae5' : '#f1f5f9',
                          color: isSelected ? '#047857' : '#64748b',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '0.35rem',
                          fontSize: '0.72rem',
                          fontWeight: '700'
                        }}>
                          {good.unit}
                        </span>
                        {isSelected && <Check size={14} color="var(--corp-green)" style={{ strokeWidth: 3 }} />}
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* PERSISTENT CONFIGURATION FORM - ALWAYS VISIBLE REGARDLESS OF TAB */}
          {(selectedGood || selectedIngredients.length > 0) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              {/* Goods for Sale section (shows stock quantity AND cost price!) */}
              {selectedGood && (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  flexShrink: 0
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Package size={18} color="var(--corp-green)" />
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)' }}>
                        {selectedGood.name}
                      </h4>
                      <span style={{ background: '#ecfdf5', color: '#047857', padding: '0.15rem 0.5rem', borderRadius: '0.35rem', fontSize: '0.75rem', fontWeight: '700' }}>
                        {selectedGood.unit}
                      </span>
                      {selectedGood.linkedIngredientName && (
                        <span style={{
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #bfdbfe',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '0.35rem',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {t('goods_ingredient_link.badge_linked_with', { name: selectedGood.linkedIngredientName }) || (`Enlazado con: ${selectedGood.linkedIngredientName}`)}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleGoodsForSale(selectedGood)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: 0
                      }}
                    >
                      <Trash2 size={13} />
                      <span>{t('goods_receipt_form.clear_selection') || "Quitar selección"}</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="label" style={{ fontSize: '0.75rem', marginBottom: '0.35rem', fontWeight: '700' }}>
                        {t('goods_receipt_form.stock_quantity_added') || "Cantidad añadida al stock"} ({selectedGood.unit}) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        className="input-field"
                        value={gfsQuantity}
                        onChange={(e) => handleGfsQuantityChange(e.target.value)}
                        placeholder={defaultQuantity || "0"}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="label" style={{ fontSize: '0.75rem', marginBottom: '0.35rem', fontWeight: '700' }}>
                        {t('goods_receipt_form.cost_price_per_unit') || "Precio de coste por unidad"} ({currencySymbol}/{selectedGood.unit})
                      </label>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        className="input-field"
                        value={gfsCostPrice}
                        onChange={(e) => setGfsCostPrice(e.target.value)}
                        placeholder="0.00"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="label" style={{ fontSize: '0.75rem', marginBottom: '0.35rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <ScanBarcode size={13} style={{ color: 'var(--corp-green)' }} />
                        <span>{t('goods_receipt_form.barcode') || "Código de barras del lote"}</span>
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={gfsBarcode}
                        onChange={(e) => setGfsBarcode(e.target.value)}
                        placeholder={selectedGood.barcode ? `${selectedGood.barcode} (${t('goods_receipt_form.general_barcode_inherited') || 'heredado'})` : (t('goods_receipt_form.barcode_placeholder') || "Ej: 8412345678901")}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                        {t('goods_receipt_form.lot_barcode_help') || "Opcional. Código específico de este lote o entrada."}
                      </span>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    margin: '0.75rem 0 0 0',
                    lineHeight: '1.4',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <Info size={14} style={{ color: 'var(--corp-green)', flexShrink: 0 }} />
                    <span>
                      {t('goods_receipt_form.selected_good_help') || "Al guardar esta entrada de mercancía, se incrementará el stock de esta mercancía en venta y se le asignará este precio de coste."}
                    </span>
                  </p>
                </div>
              )}

              {/* Ingredients section */}
              {selectedIngredients.length > 0 && (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  flexShrink: 0
                }}>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', color: 'var(--corp-green)' }}>
                    {t('goods_receipt_form.stock_control_title') || "Escribe las cantidades de stock que hay que añadir en cada ingrediente."}
                  </h4>
                  <p style={{ margin: '0.35rem 0 0.75rem 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {t('goods_receipt_form.stock_control_important') || "IMPORTANTE. Si ves que sale varios campos de un mismo ingrediente es porque lo has puesto en diferentes recetas con diferentes unidades de medida y por eso aparece en varias unidades de medida."}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {getIngredientsWithUnits(selectedIngredients).map((item, idx) => {
                      const key = `${item.name}:${item.unit}`;
                      const val = quantities[key] !== undefined ? quantities[key] : (selectedGood && isLinked(selectedGood, item.name) ? gfsQuantity : "");
                      return (
                        <div className="form-group" key={`${item.name}_${item.unit}_${idx}`} style={{ margin: 0 }}>
                          <label className="label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem', fontWeight: '700' }}>
                            {`Cantidad de ${item.name} (${item.unit})`}
                          </label>
                          <input
                            type="number"
                            step="any"
                            className="input-field"
                            value={val}
                            onChange={(e) => handleIngredientQuantityChange(key, e.target.value, item.name)}
                            placeholder={defaultQuantity || "0"}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', gap: '1rem', flexShrink: 0 }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{ flex: 1, padding: '0.85rem' }}
          >
            {t('common.cancel') || "Cancelar"}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
            style={{ flex: 2, padding: '0.85rem', fontSize: '0.85rem', lineHeight: '1.3', textAlign: 'center' }}
          >
            {t('goods_receipt_form.link_popup_save') || "Guardar cambios"}
          </button>
        </div>
      </div>

      {/* SUB-MODAL: AÑADIR NUEVA MERCANCÍA EN VENTA */}
      {isAddGfsOpen && (
        <div className="modal-overlay" style={{ zIndex: 1250, background: 'rgba(0, 0, 0, 0.65)' }}>
          <div
            className="modal-content glass-card"
            style={{
              maxWidth: '480px',
              width: '92%',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              borderRadius: '1rem'
            }}
          >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={20} color="var(--corp-green)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  {t('goods_receipt_form.modal_add_gfs_title') || "Nueva mercancía en venta"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddGfsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={18} />
              </button>
            </header>

            <form onSubmit={handleCreateNewGfs} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="label" style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  {t('goods_for_sale.col_name') || "Nombre de la mercancía"} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={newGfsForm.name}
                  onChange={(e) => setNewGfsForm({ ...newGfsForm, name: e.target.value })}
                  placeholder={t('goods_for_sale.name_placeholder') || "Ej: Aceite de Oliva 5L"}
                  required
                  autoFocus
                  style={{ margin: 0, fontSize: '0.88rem' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="label" style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  {t('goods_for_sale.col_unit') || "Unidad de medida"} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={newGfsForm.unit}
                  onChange={(e) => setNewGfsForm({ ...newGfsForm, unit: e.target.value })}
                  placeholder={t('goods_for_sale.unit_placeholder') || "Ej: kg, ud, caja..."}
                  required
                  style={{ margin: 0, fontSize: '0.88rem' }}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
                  {commonUnits.map((u) => (
                    <button
                      type="button"
                      key={u}
                      onClick={() => setNewGfsForm({ ...newGfsForm, unit: u })}
                      style={{
                        padding: '0.15rem 0.5rem',
                        fontSize: '0.72rem',
                        borderRadius: '0.35rem',
                        border: newGfsForm.unit === u ? '1px solid var(--corp-green)' : '1px solid var(--border)',
                        background: newGfsForm.unit === u ? '#ecfdf5' : '#f8fafc',
                        color: newGfsForm.unit === u ? '#047857' : '#64748b',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="label" style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  {t('goods_for_sale.col_sale_price') || "Precio de venta por unidad"} ({currencySymbol}) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="input-field"
                  value={newGfsForm.salePrice}
                  onChange={(e) => setNewGfsForm({ ...newGfsForm, salePrice: e.target.value })}
                  placeholder="0.00"
                  required
                  style={{ margin: 0, fontSize: '0.88rem' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="label" style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ScanBarcode size={14} style={{ color: 'var(--corp-green)' }} />
                  <span>{t('goods_for_sale.col_barcode') || "Código de barras general"}</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={newGfsForm.barcode}
                  onChange={(e) => setNewGfsForm({ ...newGfsForm, barcode: e.target.value })}
                  placeholder={t('goods_for_sale.barcode_placeholder') || "Ej: 8412345678901 (opcional)"}
                  style={{ margin: 0, fontSize: '0.88rem' }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                  {t('goods_for_sale.barcode_hint') || "Código de barras general para identificar este producto al vender o escanear."}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAddGfsOpen(false)}
                  disabled={savingNewGfs}
                  style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem' }}
                >
                  {t('common.cancel') || "Cancelar"}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={savingNewGfs}
                  style={{ flex: 1.5, padding: '0.65rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  {savingNewGfs ? (
                    <>
                      <Loader2 className="animate-spin" size={15} />
                      <span>{t('common.saving') || "Guardando..."}</span>
                    </>
                  ) : (
                    <span>{t('goods_for_sale.save_btn') || "Añadir a la venta"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
