"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  X, Check, AlertCircle, Package, Layers, ChevronDown, 
  Calendar, User, FileText, Loader2, Plus, Minus, Eye, EyeOff
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function SelectGoodsLotsModal({
  isOpen,
  goods,
  initialQuantity = null,
  initialAllocations = null,
  currency = "EUR",
  isPos = false,
  onConfirm,
  onSelectWithoutLot,
  onClose
}) {
  const { t } = useI18n();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allReceipts, setAllReceipts] = useState([]);
  
  // Tab: 'in_stock' | 'out_of_stock'
  const [activeTab, setActiveTab] = useState("in_stock");
  const [visibleInStockCount, setVisibleInStockCount] = useState(10);
  const [visibleOutOfStockCount, setVisibleOutOfStockCount] = useState(10);

  // Allocations state (for Sales modal multi-allocation): { [receiptId]: quantityNumber }
  const [allocations, setAllocations] = useState({});

  // Single lot selection (for TPV mode where quantity is entered in TPV)
  const [selectedPosLotId, setSelectedPosLotId] = useState(null);

  // Fallback target quantity if pre-specified (only used in non-TPV mode)
  const [targetQuantity, setTargetQuantity] = useState(
    initialQuantity != null && !isNaN(parseFloat(initialQuantity)) ? parseFloat(initialQuantity) : null
  );

  // Fetch receipts when opening modal
  useEffect(() => {
    if (!isOpen || !goods?.id) return;

    setLoading(true);
    setError("");
    setVisibleInStockCount(10);
    setVisibleOutOfStockCount(10);

    fetch(`/api/client/goods-for-sale/${goods.id}/lots?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.lots)) {
          setAllReceipts(data.lots);

          // Check if there are in-stock lots
          const inStock = data.lots.filter(r => (parseFloat(r.goodsForSaleQuantity) || 0) > 0);
          if (inStock.length === 0) {
            // Automatically show out-of-stock lots if there are none with stock
            setActiveTab("out_of_stock");
          } else {
            setActiveTab("in_stock");
          }

          // Pre-populate initial allocations / selected lot if provided
          if (Array.isArray(initialAllocations) && initialAllocations.length > 0) {
            if (isPos) {
              const firstAlloc = initialAllocations[0];
              setSelectedPosLotId(firstAlloc?.receiptId || null);
            } else {
              const initialMap = {};
              initialAllocations.forEach(alloc => {
                if (alloc.receiptId && alloc.quantity) {
                  initialMap[alloc.receiptId] = parseFloat(alloc.quantity) || 0;
                }
              });
              setAllocations(initialMap);
            }
          } else {
            setAllocations({});
            setSelectedPosLotId(null);
          }
        } else {
          setError(data.error || t('alerts.connection_error') || "Error al cargar los lotes.");
        }
      })
      .catch(err => {
        console.error("Error fetching lots for goods:", err);
        setError(t('alerts.connection_error') || "Error al cargar los lotes.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, goods?.id, isPos]);

  // Separate receipts into in-stock and out-of-stock
  const inStockLots = useMemo(() => {
    return allReceipts.filter(r => (parseFloat(r.goodsForSaleQuantity) || 0) > 0);
  }, [allReceipts]);

  const outOfStockLots = useMemo(() => {
    return allReceipts.filter(r => (parseFloat(r.goodsForSaleQuantity) || 0) <= 0);
  }, [allReceipts]);

  const currentList = activeTab === "in_stock" ? inStockLots : outOfStockLots;
  const visibleLimit = activeTab === "in_stock" ? visibleInStockCount : visibleOutOfStockCount;
  const visibleLots = currentList.slice(0, visibleLimit);
  const hasMore = currentList.length > visibleLimit;

  // Handle quantity allocation for a specific lot
  const handleSetLotQuantity = (receiptId, qty) => {
    const val = parseFloat(qty);
    setAllocations(prev => {
      const updated = { ...prev };
      if (isNaN(val) || val <= 0) {
        delete updated[receiptId];
      } else {
        updated[receiptId] = val;
      }
      return updated;
    });
  };

  const handleToggleLot = (receipt) => {
    setAllocations(prev => {
      const updated = { ...prev };
      if (updated[receipt.id]) {
        delete updated[receipt.id];
      } else {
        const avail = Math.max(0, parseFloat(receipt.goodsForSaleQuantity) || 0);
        // If there is a target quantity, allocate the remaining needed, else available stock or 1
        const currentSum = Object.values(updated).reduce((a, b) => a + b, 0);
        let qtyToAssign = 1;
        if (targetQuantity != null && targetQuantity > currentSum) {
          const remaining = Math.round((targetQuantity - currentSum) * 1000) / 1000;
          qtyToAssign = avail > 0 ? Math.min(avail, remaining) : remaining;
        } else if (avail > 0) {
          qtyToAssign = avail;
        }
        updated[receipt.id] = qtyToAssign > 0 ? qtyToAssign : 1;
      }
      return updated;
    });
  };

  // Total allocated (for sales modal)
  const totalAllocated = useMemo(() => {
    const sum = Object.values(allocations).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
    return Math.round(sum * 10000) / 10000;
  }, [allocations]);

  const selectedPosLotReceipt = useMemo(() => {
    if (!selectedPosLotId) return null;
    return allReceipts.find(r => r.id === selectedPosLotId) || null;
  }, [allReceipts, selectedPosLotId]);

  const unitPrice = goods?.salePrice || 0;
  const totalPrice = Math.round(totalAllocated * unitPrice * 100) / 100;

  // Confirm selection with lots
  const handleConfirm = () => {
    if (isPos) {
      if (!selectedPosLotId) {
        alert(t('lots_modal.alert_select_lot') || "Por favor selecciona un lote o utiliza la opción 'No registrar lote'.");
        return;
      }
      const receipt = allReceipts.find(r => r.id === selectedPosLotId);
      if (onConfirm) {
        onConfirm([{
          receiptId: receipt ? receipt.id : selectedPosLotId,
          lote: receipt?.lote || null,
          quantity: 0
        }], 0);
      }
      return;
    }

    const allocArray = [];
    for (const [rIdStr, qty] of Object.entries(allocations)) {
      const rId = parseInt(rIdStr);
      const receipt = allReceipts.find(r => r.id === rId);
      if (receipt && qty > 0) {
        allocArray.push({
          receiptId: rId,
          lote: receipt.lote || null,
          quantity: Math.round(qty * 10000) / 10000
        });
      }
    }

    if (allocArray.length === 0) {
      alert(t('lots_modal.alert_select_lot') || "Por favor selecciona al menos un lote con cantidad o utiliza la opción 'No registrar lote'.");
      return;
    }

    if (onConfirm) {
      onConfirm(allocArray, totalAllocated);
    }
  };

  // Option: sell without lot
  const handleWithoutLot = () => {
    if (isPos) {
      if (onSelectWithoutLot) {
        onSelectWithoutLot(0);
      }
      return;
    }
    let finalQty = totalAllocated > 0 ? totalAllocated : (targetQuantity != null && targetQuantity > 0 ? targetQuantity : 1);
    if (onSelectWithoutLot) {
      onSelectWithoutLot(finalQty);
    }
  };

  if (!isOpen || !goods) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '1.5rem',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          animation: 'slideUp 0.25s ease',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem 1.75rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '0.85rem',
              background: 'rgba(66, 98, 22, 0.1)',
              color: 'var(--corp-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Package size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                {t('lots_modal.title') || "Seleccionar lote(s) de venta"}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, marginTop: '0.2rem' }}>
                <strong style={{ color: 'var(--text-main)' }}>{goods.name}</strong> · {t('lots_modal.available_stock')}: <span style={{ color: goods.stock > 0 ? 'var(--corp-green)' : '#dc2626', fontWeight: '700' }}>{goods.stock} {goods.unit || 'ud'}</span>
              </p>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                {isPos 
                  ? (t('lots_modal.pos_subtitle') || "Selecciona el lote que vas a vender (la cantidad se establece en el TPV)") 
                  : (t('lots_modal.subtitle') || "Selecciona el lote o distribuye la cantidad a vender entre varios lotes")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <X size={22} />
          </button>
        </div>

        {/* Tab / Filter Bar */}
        <div style={{
          padding: '0.85rem 1.75rem',
          borderBottom: '1px solid var(--border)',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          {/* Status summary */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {inStockLots.length > 0 ? (
              <button
                type="button"
                onClick={() => setActiveTab("in_stock")}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '0.6rem',
                  border: '1.5px solid',
                  borderColor: activeTab === "in_stock" ? 'var(--corp-green)' : 'var(--border)',
                  background: activeTab === "in_stock" ? 'rgba(66, 98, 22, 0.08)' : 'white',
                  color: activeTab === "in_stock" ? 'var(--corp-green)' : 'var(--text-muted)',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>{t('lots_modal.show_in_stock_only') || "Lotes con stock"}</span>
                <span style={{
                  padding: '0.1rem 0.4rem',
                  borderRadius: '1rem',
                  background: 'var(--corp-green)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '800'
                }}>
                  {inStockLots.length}
                </span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "out_of_stock" && inStockLots.length > 0 ? "in_stock" : "out_of_stock")}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '0.6rem',
                border: '1.5px solid',
                borderColor: activeTab === "out_of_stock" ? '#dc2626' : 'var(--border)',
                background: activeTab === "out_of_stock" ? 'rgba(239, 68, 68, 0.08)' : 'white',
                color: activeTab === "out_of_stock" ? '#dc2626' : 'var(--text-muted)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>{t('lots_modal.show_out_of_stock') || "Lotes sin stock"}</span>
              <span style={{
                padding: '0.1rem 0.4rem',
                borderRadius: '1rem',
                background: '#64748b',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '800'
              }}>
                {outOfStockLots.length}
              </span>
            </button>
          </div>

          {/* Quick Option to sell without lot */}
          <button
            type="button"
            onClick={handleWithoutLot}
            className="btn-secondary"
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#f1f5f9'
            }}
          >
            <Layers size={15} color="var(--corp-green)" />
            <span>{t('lots_modal.no_lot_option') || "No registrar lote"}</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <Loader2 className="animate-spin" size={32} color="var(--corp-green)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Cargando lotes disponibles...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
              <AlertCircle size={32} style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ margin: 0, fontWeight: 600 }}>{error}</p>
            </div>
          ) : inStockLots.length === 0 && activeTab === "out_of_stock" && outOfStockLots.length > 0 ? (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.06)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              color: '#991b1b',
              fontWeight: '500'
            }}>
              <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
              <span>{t('lots_modal.no_stock_showing_past') || "No hay ningún lote con stock disponible. Mostrando los lotes más recientes sin stock:"}</span>
            </div>
          ) : null}

          {!loading && currentList.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Package size={42} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              <p style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
                {activeTab === "in_stock" 
                  ? "No hay lotes con stock para esta mercancía." 
                  : (t('lots_modal.no_lots_found') || "No hay entradas registradas para este producto.")}
              </p>
              <p style={{ fontSize: '0.88rem', margin: '0 0 1.5rem 0' }}>
                Puedes vender esta mercancía seleccionando la opción de no registrar lote.
              </p>
              <button
                type="button"
                onClick={handleWithoutLot}
                className="btn-primary"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
              >
                {t('lots_modal.no_lot_option') || "No registrar lote"}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {visibleLots.map(receipt => {
                const isSelected = isPos ? (selectedPosLotId === receipt.id) : !!allocations[receipt.id];
                const currentQty = allocations[receipt.id] || "";
                const stockQty = Math.max(0, parseFloat(receipt.goodsForSaleQuantity) || 0);
                const hasStock = stockQty > 0;

                return (
                  <div
                    key={receipt.id}
                    onClick={() => isPos && setSelectedPosLotId(receipt.id)}
                    style={{
                      border: isSelected ? '2px solid var(--corp-green)' : '1px solid var(--border)',
                      background: isSelected ? 'rgba(66, 98, 22, 0.03)' : (hasStock ? 'white' : '#f8fafc'),
                      borderRadius: '1rem',
                      padding: '1rem 1.25rem',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(66, 98, 22, 0.08)' : 'none',
                      cursor: isPos ? 'pointer' : 'default'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {/* Checkbox / Radio & Lot information */}
                      <label 
                        onClick={(e) => {
                          if (isPos) {
                            e.preventDefault();
                            setSelectedPosLotId(receipt.id);
                          }
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer', flex: 1, minWidth: '220px' }}
                      >
                        {isPos ? (
                          <input
                            type="radio"
                            name="posLotSelection"
                            checked={isSelected}
                            onChange={() => setSelectedPosLotId(receipt.id)}
                            style={{
                              width: '20px',
                              height: '20px',
                              accentColor: 'var(--corp-green)',
                              cursor: 'pointer'
                            }}
                          />
                        ) : (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleLot(receipt)}
                            style={{
                              width: '20px',
                              height: '20px',
                              accentColor: 'var(--corp-green)',
                              cursor: 'pointer'
                            }}
                          />
                        )}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{
                              fontWeight: '800',
                              fontSize: '1rem',
                              fontFamily: 'monospace',
                              color: 'var(--text-main)',
                              background: '#f1f5f9',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '0.35rem'
                            }}>
                              {receipt.lote || <span style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--text-muted)' }}>Sin código</span>}
                            </span>
                            {hasStock ? (
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: '#16a34a',
                                background: 'rgba(34, 197, 94, 0.12)',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '1rem'
                              }}>
                                {stockQty} {goods.unit || 'ud'} disponibles
                              </span>
                            ) : (
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: '#64748b',
                                background: '#e2e8f0',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '1rem'
                              }}>
                                {t('lots_modal.out_of_stock') || "Agotado"} (0)
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Calendar size={13} />
                              {receipt.date ? new Date(receipt.date).toLocaleDateString() : '—'}
                            </span>
                            {receipt.providerName && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <User size={13} />
                                {receipt.providerName}
                              </span>
                            )}
                            {receipt.invoiceNumber && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <FileText size={13} />
                                #{receipt.invoiceNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </label>

                      {/* Right side: In POS mode show Select button, in Sales mode show quantity allocation input */}
                      {isPos ? (
                        <div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPosLotId(receipt.id);
                            }}
                            style={{
                              padding: '0.45rem 0.9rem',
                              borderRadius: '0.5rem',
                              fontSize: '0.82rem',
                              fontWeight: '700',
                              border: isSelected ? '1.5px solid var(--corp-green)' : '1px solid var(--border)',
                              background: isSelected ? 'var(--corp-green)' : 'white',
                              color: isSelected ? 'white' : 'var(--text-main)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {isSelected ? (
                              <>
                                <Check size={14} />
                                <span>{t('lots_modal.selected_lot') || "Seleccionado"}</span>
                              </>
                            ) : (
                              <span>{t('lots_modal.select_this_lot') || "Seleccionar"}</span>
                            )}
                          </button>
                        </div>
                      ) : (
                        isSelected && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'fadeIn 0.2s ease' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                              {t('lots_modal.qty_to_sell_lot') || "Cantidad:"}
                            </span>
                            <div style={{ position: 'relative', width: '110px' }}>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={currentQty}
                                onChange={(e) => handleSetLotQuantity(receipt.id, e.target.value)}
                                placeholder="0"
                                className="input-field"
                                style={{
                                  padding: '0.45rem 0.6rem',
                                  fontSize: '0.95rem',
                                  fontWeight: '800',
                                  textAlign: 'right',
                                  paddingRight: '2rem'
                                }}
                                autoFocus
                              />
                              <span style={{
                                position: 'absolute',
                                right: '0.6rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '0.78rem',
                                color: 'var(--text-muted)',
                                fontWeight: '600'
                              }}>
                                {goods.unit || 'ud'}
                              </span>
                            </div>

                            {hasStock && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetLotQuantity(receipt.id, stockQty);
                                }}
                                className="btn-secondary"
                                title="Asignar todo el stock de este lote"
                                style={{
                                  padding: '0.45rem 0.65rem',
                                  fontSize: '0.75rem',
                                  fontWeight: '700',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {t('lots_modal.assign_all') || "Todo"}
                              </button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Load more button */}
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === "in_stock") {
                        setVisibleInStockCount(prev => prev + 10);
                      } else {
                        setVisibleOutOfStockCount(prev => prev + 10);
                      }
                    }}
                    className="btn-secondary"
                    style={{
                      padding: '0.55rem 1.5rem',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <ChevronDown size={16} />
                    <span>{t('lots_modal.load_more') || "Cargar más lotes (+10)"}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderTop: '1px solid var(--border)',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Summary */}
          {isPos ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Package size={20} color={selectedPosLotId ? "var(--corp-green)" : "#94a3b8"} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {selectedPosLotReceipt ? (
                    <>
                      <span>{t('lots_modal.selected_lot') || "Lote seleccionado"}: </span>
                      <span style={{ fontFamily: 'monospace', fontWeight: '800', color: 'var(--corp-green)' }}>
                        {selectedPosLotReceipt.lote || "Sin ref"}
                      </span>
                    </>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>
                      {t('lots_modal.no_lot_selected') || "No has seleccionado ningún lote"}
                    </span>
                  )}
                </div>
                {selectedPosLotReceipt && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {parseFloat(selectedPosLotReceipt.goodsForSaleQuantity) > 0 ? (
                      <span style={{ color: '#16a34a', fontWeight: '600' }}>
                        {selectedPosLotReceipt.goodsForSaleQuantity} {goods.unit || 'ud'} disponibles
                      </span>
                    ) : (
                      <span style={{ color: '#64748b' }}>
                        {t('lots_modal.out_of_stock') || "Agotado"} (0 {goods.unit || 'ud'})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {t('lots_modal.total_allocated') || "Total a vender:"}
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: totalAllocated > 0 ? 'var(--corp-green)' : 'var(--text-main)' }}>
                  {totalAllocated} {goods.unit || 'ud'}
                </span>
                {unitPrice > 0 && (
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    · {totalPrice.toFixed(2)} {currency === 'EUR' ? '€' : currency}
                  </span>
                )}
              </div>

              {targetQuantity != null && targetQuantity > 0 && (
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: totalAllocated === targetQuantity ? '#16a34a' : (totalAllocated < targetQuantity ? '#d97706' : '#2563eb'),
                  marginTop: '0.2rem'
                }}>
                  {totalAllocated === targetQuantity ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Check size={14} /> Cantidad exacta alcanzada ({targetQuantity} {goods.unit})
                    </span>
                  ) : totalAllocated < targetQuantity ? (
                    `Faltan ${(Math.round((targetQuantity - totalAllocated) * 1000) / 1000)} ${goods.unit} para llegar a ${targetQuantity}`
                  ) : (
                    `Supera la cantidad inicial (${totalAllocated} / ${targetQuantity} ${goods.unit})`
                  )}
                </span>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: '700' }}
            >
              {t('common.cancel') || "Cancelar"}
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="btn-primary"
              disabled={isPos ? !selectedPosLotId : totalAllocated <= 0}
              style={{
                padding: '0.65rem 1.75rem',
                fontSize: '0.95rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: (isPos ? !selectedPosLotId : totalAllocated <= 0) ? 0.6 : 1,
                cursor: (isPos ? !selectedPosLotId : totalAllocated <= 0) ? 'not-allowed' : 'pointer'
              }}
            >
              <Check size={18} />
              <span>{t('lots_modal.confirm_btn') || "Aceptar"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
