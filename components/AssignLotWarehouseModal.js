"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Warehouse as WarehouseIcon, Loader2, Check, AlertCircle, Plus, Boxes, Tag
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function AssignLotWarehouseModal({
  isOpen,
  onClose,
  target, // { item, type: "ingredient" | "goods" }
  warehouses = [],
  onOpenManageWarehouses,
  onWarehouseAssigned
}) {
  const { t } = useI18n();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);

  const fetchLots = async () => {
    if (!target?.item) return;
    try {
      setLoading(true);
      setError("");

      if (target.type === "ingredient") {
        const params = new URLSearchParams({
          name: target.item.name,
          unit: target.item.unit || ""
        });
        const res = await fetch(`/api/client/inventory/lots?${params.toString()}`);
        if (!res.ok) throw new Error("Error loading ingredient lots");
        const data = await res.json();
        
        // Use receiptLots if available, otherwise flatMap receipts or lots
        let formattedLots = [];
        if (Array.isArray(data.receiptLots) && data.receiptLots.length > 0) {
          formattedLots = data.receiptLots.map(r => ({
            id: r.id,
            lote: r.lote ? r.lote.trim() : (t('inventory.no_lot_assigned') || "Sin lote"),
            date: r.date,
            providerName: r.providerName || "-",
            stock: r.quantity !== undefined ? r.quantity : 0,
            warehouseId: r.warehouseId || null
          }));
        } else if (Array.isArray(data.lots)) {
          data.lots.forEach(l => {
            if (Array.isArray(l.receipts) && l.receipts.length > 0) {
              l.receipts.forEach(r => {
                formattedLots.push({
                  id: r.id,
                  lote: l.lote ? l.lote.trim() : (t('inventory.no_lot_assigned') || "Sin lote"),
                  date: r.date,
                  providerName: r.providerName || l.providerName || "-",
                  stock: r.quantityAdded !== undefined ? r.quantityAdded : l.remainingStock,
                  warehouseId: r.warehouseId || l.warehouseId || null
                });
              });
            } else {
              formattedLots.push({
                id: l.id || Math.random(),
                lote: l.lote ? l.lote.trim() : (t('inventory.no_lot_assigned') || "Sin lote"),
                date: l.lastReceiptDate,
                providerName: l.providerName || "-",
                stock: l.remainingStock,
                warehouseId: l.warehouseId || null
              });
            }
          });
        }
        setLots(formattedLots);
      } else {
        // Goods for sale
        const res = await fetch(`/api/client/goods-for-sale/${target.item.id}/lots?inStockOnly=false`);
        if (!res.ok) throw new Error("Error loading goods for sale lots");
        const data = await res.json();
        const rawLots = Array.isArray(data.lots) ? data.lots : [];
        const formattedLots = rawLots.map(l => ({
          id: l.id,
          lote: l.lote ? l.lote.trim() : (t('inventory.no_lot_assigned') || "Sin lote"),
          date: l.date,
          providerName: l.providerName || "-",
          stock: l.goodsForSaleQuantity !== undefined && l.goodsForSaleQuantity !== null ? l.goodsForSaleQuantity : 0,
          warehouseId: l.warehouseId || null
        }));
        setLots(formattedLots);
      }
    } catch (err) {
      console.error("Error fetching lots for warehouse assignment:", err);
      setError(t('alerts.connection_error') || "Error al cargar los lotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && target?.item) {
      fetchLots();
    }
  }, [isOpen, target]);

  if (!isOpen || !target?.item) return null;

  const handleWarehouseChange = async (lotId, newWarehouseId) => {
    try {
      setSavingId(lotId);
      const parsedWarehouseId = newWarehouseId && newWarehouseId !== "" && newWarehouseId !== "none"
        ? parseInt(newWarehouseId, 10)
        : null;

      const res = await fetch(`/api/client/goods-receipts/${lotId}/warehouse`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ warehouseId: parsedWarehouseId })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al actualizar almacén");
      }

      // Update only this specific lot cell in local state
      setLots(prev => prev.map(l => l.id === lotId ? { ...l, warehouseId: parsedWarehouseId } : l));

      setSavedId(lotId);
      setTimeout(() => {
        setSavedId(prev => prev === lotId ? null : prev);
      }, 2000);

      if (onWarehouseAssigned) {
        onWarehouseAssigned();
      }
    } catch (err) {
      console.error("Error saving lot warehouse:", err);
      alert(err.message || t('alerts.request_error') || "Error al guardar el almacén");
    } finally {
      setSavingId(null);
    }
  };

  const isIngredient = target.type === "ingredient";
  const title = isIngredient
    ? (t('inventory.assign_warehouse_title_ingredient', { name: target.item.name }) || `Asignar almacén a lotes: ${target.item.name}`)
    : (t('inventory.assign_warehouse_title_goods', { name: target.item.name }) || `Asignar almacén a lotes: ${target.item.name}`);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 10050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !savingId) onClose();
      }}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '1.25rem',
          maxWidth: '850px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              padding: '0.5rem', 
              borderRadius: '0.65rem', 
              background: 'rgba(66, 98, 22, 0.1)', 
              color: 'var(--corp-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <WarehouseIcon size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  {title}
                </h3>
                <span style={{ 
                  background: '#f1f5f9', 
                  color: '#475569', 
                  padding: '0.15rem 0.5rem', 
                  borderRadius: '4px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700 
                }}>
                  {target.item.unit || "-"}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                {t('inventory.assign_warehouse_desc') || "Ubica cada lote en su almacén correspondiente. Los cambios se guardan automáticamente."}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.6rem',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          {warehouses.length === 0 ? (
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              <WarehouseIcon size={32} style={{ color: '#d97706', margin: '0 auto 0.5rem auto' }} />
              <p style={{ margin: '0 0 0.75rem 0', fontWeight: 700, color: '#92400e', fontSize: '0.95rem' }}>
                {t('inventory.no_warehouses_created') || "No hay almacenes creados"}
              </p>
              <p style={{ margin: '0 0 1rem 0', color: '#b45309', fontSize: '0.85rem' }}>
                {t('inventory.no_warehouses_create_prompt') || "Para poder asignar ubicaciones a tus lotes, primero debes crear al menos un almacén."}
              </p>
              {onOpenManageWarehouses && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenManageWarehouses();
                  }}
                  className="btn-primary"
                  style={{
                    padding: '0.45rem 1rem',
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    borderRadius: '6px'
                  }}
                >
                  <Plus size={14} />
                  <span>{t('inventory.btn_create_warehouse') || "Crear almacén"}</span>
                </button>
              )}
            </div>
          ) : null}

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', gap: '0.75rem' }}>
              <Loader2 className="animate-spin" size={32} style={{ color: 'var(--corp-green)' }} />
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{t('common.loading') || "Cargando lotes..."}</p>
            </div>
          ) : error ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '160px', color: '#ef4444', gap: '0.5rem' }}>
              <AlertCircle size={28} />
              <p style={{ fontSize: '0.88rem' }}>{error}</p>
              <button onClick={fetchLots} className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                {t('common.retry') || "Reintentar"}
              </button>
            </div>
          ) : lots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#64748b' }}>
              <WarehouseIcon size={42} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>
                {t('inventory.no_lots_for_item') || "No hay registros de lotes para este elemento."}
              </p>
            </div>
          ) : (
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      {t('inventory.col_lot_number') || "Lote"}
                    </th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      {t('inventory.col_receipt_date') || "Fecha de entrada"}
                    </th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      {t('inventory.col_provider') || "Proveedor"}
                    </th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>
                      {t('inventory.col_stock') || "Cantidad de stock"}
                    </th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', minWidth: '220px' }}>
                      {t('inventory.col_warehouse') || "Almacén"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lots.map((lot) => {
                    const isSavingThis = savingId === lot.id;
                    const isSavedThis = savedId === lot.id;
                    const dateFormatted = lot.date ? new Date(lot.date).toLocaleDateString() : "-";

                    return (
                      <tr 
                        key={lot.id} 
                        style={{ 
                          borderBottom: '1px solid #f1f5f9',
                          background: isSavedThis ? '#f0fdf4' : 'transparent',
                          transition: 'background 0.3s ease'
                        }}
                      >
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {lot.lote}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.82rem' }}>
                          {dateFormatted}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.82rem' }}>
                          {lot.providerName}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--text-main)' }}>
                          <span>{lot.stock}</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.3rem', fontWeight: 600 }}>
                            {target.item.unit}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <select
                              value={lot.warehouseId || ""}
                              onChange={(e) => handleWarehouseChange(lot.id, e.target.value)}
                              disabled={isSavingThis || warehouses.length === 0}
                              className="input-field"
                              style={{
                                width: '100%',
                                padding: '0.4rem 0.65rem',
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                borderColor: isSavedThis ? '#86efac' : (lot.warehouseId ? 'var(--corp-green)' : '#cbd5e1'),
                                background: isSavedThis ? '#f0fdf4' : 'white',
                                cursor: isSavingThis ? 'wait' : 'pointer'
                              }}
                            >
                              <option value="">{t('dashboard.without_warehouse') || "Sin almacén asignado"}</option>
                              {warehouses.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                              ))}
                            </select>

                            <div style={{ width: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {isSavingThis ? (
                                <Loader2 className="animate-spin" size={15} style={{ color: 'var(--corp-green)' }} />
                              ) : isSavedThis ? (
                                <Check size={16} style={{ color: '#16a34a' }} />
                              ) : null}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc'
        }}>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            {!loading && `${lots.length} ${lots.length === 1 ? 'lote' : 'lotes'}`}
          </span>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {onOpenManageWarehouses && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenManageWarehouses();
                }}
                className="btn-secondary"
                style={{
                  padding: '0.55rem 1rem',
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontWeight: 600
                }}
              >
                <WarehouseIcon size={14} />
                <span>{t('dashboard.warehouses_btn') || "Gestionar almacenes"}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="btn-primary"
              style={{
                padding: '0.55rem 1.25rem',
                fontSize: '0.82rem',
                fontWeight: 700
              }}
            >
              {t('common.close') || "Cerrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
