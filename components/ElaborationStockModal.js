"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  X, Loader2, CheckCircle, AlertCircle, History, Package, ArrowRight, User, Calendar
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function ElaborationStockModal({ 
  elaboration, 
  onClose, 
  onStockUpdated 
}) {
  const { t, locale } = useI18n();

  const unit = elaboration?.quantityUnit || "";
  const totalProduced = parseFloat(elaboration?.quantityProduced?.toString().replace(",", ".")) || 0;

  // Initial list of adjustments from elaboration
  const [adjustments, setAdjustments] = useState(elaboration?.stockAdjustments || []);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Form states
  const [newStockInput, setNewStockInput] = useState("");
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Calculate current stock dynamically
  const currentStock = useMemo(() => {
    const totalSold = (elaboration?.sales || []).filter(s => !s.isDraft).reduce((sum, s) => {
      if (s.quantity != null) return sum + s.quantity;
      if (totalProduced > 0 && s.percentage != null) return sum + (totalProduced * s.percentage / 100);
      return sum;
    }, 0);

    const totalAdjustments = (adjustments || []).reduce((sum, a) => sum + (Number(a.difference) || 0), 0);
    return Math.max(0, Math.round((totalProduced - totalSold + totalAdjustments) * 1000) / 1000);
  }, [elaboration, totalProduced, adjustments]);

  // Fetch latest adjustments on mount
  useEffect(() => {
    let isMounted = true;
    async function loadAdjustments() {
      if (!elaboration?.id) return;
      try {
        setLoadingHistory(true);
        const res = await fetch(`/api/client/elaborations/${elaboration.id}/stock-adjustment`);
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.data)) {
          setAdjustments(data.data);
        }
      } catch (err) {
        console.error("Error fetching stock adjustments:", err);
      } finally {
        if (isMounted) setLoadingHistory(false);
      }
    }
    loadAdjustments();
    return () => { isMounted = false; };
  }, [elaboration?.id]);

  // Calculate difference preview
  const parsedNewStock = parseFloat(newStockInput.replace(",", "."));
  const isValidNewStock = !isNaN(parsedNewStock) && parsedNewStock >= 0 && newStockInput.trim() !== "";
  const difference = isValidNewStock ? Math.round((parsedNewStock - currentStock) * 1000) / 1000 : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!isValidNewStock) {
      setErrorMsg(t('dashboard.stock_mod_err_invalid_stock') || "Introduce un valor válido para el nuevo stock (mayor o igual a 0).");
      return;
    }

    if (Math.abs(difference) < 0.0001) {
      setErrorMsg(t('dashboard.stock_mod_err_same_stock') || "El nuevo stock debe ser diferente al stock actual.");
      return;
    }

    if (!reason) {
      setErrorMsg(t('dashboard.stock_mod_err_no_reason') || "Selecciona una razón para la modificación.");
      return;
    }

    if (reason === "Otra razón" && !customReason.trim()) {
      setErrorMsg(t('dashboard.stock_mod_err_no_custom_reason') || "Especifica la razón de la modificación.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/client/elaborations/${elaboration.id}/stock-adjustment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newStock: parsedNewStock,
          reason,
          customReason: reason === "Otra razón" ? customReason.trim() : null
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al modificar el stock");
      }

      setSuccessMsg(t('dashboard.stock_mod_success') || "Stock modificado correctamente.");
      setNewStockInput("");
      setReason("");
      setCustomReason("");

      // Add the new adjustment to history list
      if (data.data) {
        setAdjustments(prev => [data.data, ...prev]);
      }

      if (onStockUpdated) {
        onStockUpdated(data.currentStock);
      }
    } catch (err) {
      setErrorMsg(err.message || "Error al modificar el stock.");
    } finally {
      setSubmitting(false);
    }
  };

  const getReasonLabel = (reasonKey, customText) => {
    if (reasonKey === "Caducado" || reasonKey === "EXPIRED") {
      return t('dashboard.stock_mod_reason_expired') || "Caducado";
    }
    if (reasonKey === "Deteriorado" || reasonKey === "DAMAGED") {
      return t('dashboard.stock_mod_reason_damaged') || "Deteriorado";
    }
    if (reasonKey === "Devolución" || reasonKey === "RETURN") {
      return t('dashboard.stock_mod_reason_return') || "Devolución";
    }
    if (reasonKey === "Otra razón" || reasonKey === "OTHER") {
      const otherLabel = t('dashboard.stock_mod_reason_other') || "Otra razón";
      return customText ? `${otherLabel}: ${customText}` : otherLabel;
    }
    return reasonKey;
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(locale || "es", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '1.25rem',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '92vh',
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ 
                padding: '0.4rem', 
                borderRadius: '0.6rem', 
                background: 'rgba(66, 98, 22, 0.1)', 
                color: 'var(--corp-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Package size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                {t('dashboard.stock_mod_modal_title') || "Modificar stock de elaboración"}
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.35rem 0 0 0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span><strong>{t('traceability_form.elaboration_title') || "Lote"}:</strong> {elaboration?.name}</span>
              {elaboration?.recipe?.name && (
                <>
                  <span>•</span>
                  <span><strong>{t('dashboard.recipe') || "Receta"}:</strong> {elaboration.recipe.name}</span>
                </>
              )}
            </p>
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
              color: '#64748b',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Alerts */}
          {errorMsg && (
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: '0.75rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: '0.75rem',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <CheckCircle size={18} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Card */}
          <form onSubmit={handleSubmit} style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem'
          }}>
            {/* Stock actual display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              background: 'white',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>
                {t('dashboard.stock_mod_current_stock_label') || "Stock actual disponible"}:
              </span>
              <span style={{ 
                fontSize: '1.15rem', 
                fontWeight: '900', 
                color: currentStock > 0 ? 'var(--corp-green)' : '#991b1b',
                background: currentStock > 0 ? '#ecfdf5' : '#fef2f2',
                padding: '0.2rem 0.75rem',
                borderRadius: '1rem'
              }}>
                {currentStock} {unit}
              </span>
            </div>

            {/* Nuevo stock & Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-start' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  {t('dashboard.stock_mod_new_stock_label') || "Nuevo stock"} ({unit || 'unidades'}): <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder={`0 ${unit}`.trim()}
                    value={newStockInput}
                    onChange={(e) => {
                      setNewStockInput(e.target.value);
                      setErrorMsg("");
                    }}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '0.6rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      outline: 'none',
                      background: 'white',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                  {unit && (
                    <span style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      fontWeight: '600',
                      pointerEvents: 'none'
                    }}>
                      {unit}
                    </span>
                  )}
                </div>
              </div>

              {/* Difference preview */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '0.4rem' }}>
                  {t('dashboard.stock_mod_difference_label') || "Variación de stock"}:
                </label>
                <div style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.6rem',
                  background: isValidNewStock 
                    ? (difference > 0 ? '#ecfdf5' : difference < 0 ? '#fef2f2' : '#f1f5f9')
                    : '#f1f5f9',
                  border: '1px solid',
                  borderColor: isValidNewStock 
                    ? (difference > 0 ? '#a7f3d0' : difference < 0 ? '#fecaca' : '#e2e8f0')
                    : '#e2e8f0',
                  color: isValidNewStock 
                    ? (difference > 0 ? '#065f46' : difference < 0 ? '#991b1b' : '#64748b')
                    : '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minHeight: '40px',
                  boxSizing: 'border-box'
                }}>
                  {isValidNewStock ? (
                    difference > 0 ? (
                      <span>+{difference} {unit} ({t('dashboard.stock_mod_diff_add') || "se sumarán al stock"})</span>
                    ) : difference < 0 ? (
                      <span>{difference} {unit} ({t('dashboard.stock_mod_diff_sub') || "se restarán del stock"})</span>
                    ) : (
                      <span>0 {unit} ({t('dashboard.stock_mod_diff_none') || "sin cambios"})</span>
                    )
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </div>
            </div>

            {/* Razón de modificación */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                {t('dashboard.stock_mod_reason_label') || "Razón de modificación"}: <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setErrorMsg("");
                }}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.6rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  outline: 'none',
                  background: 'white',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
                required
              >
                <option value="">-- {t('dashboard.stock_mod_reason_placeholder') || "Seleccionar razón..."} --</option>
                <option value="Caducado">{t('dashboard.stock_mod_reason_expired') || "Caducado"}</option>
                <option value="Deteriorado">{t('dashboard.stock_mod_reason_damaged') || "Deteriorado"}</option>
                <option value="Devolución">{t('dashboard.stock_mod_reason_return') || "Devolución"}</option>
                <option value="Otra razón">{t('dashboard.stock_mod_reason_other') || "Otra razón"}</option>
              </select>
            </div>

            {/* Campo condicional para Otra razón */}
            {reason === "Otra razón" && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  {t('dashboard.stock_mod_custom_reason_label') || "Especifique la razón"}: <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder={t('dashboard.stock_mod_custom_reason_placeholder') || "Ej: Ajuste por recuento de inventario, merma por rotura..."}
                  value={customReason}
                  onChange={(e) => {
                    setCustomReason(e.target.value);
                    setErrorMsg("");
                  }}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.6rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    background: 'white',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '0.6rem',
                  border: '1px solid #cbd5e1',
                  background: 'white',
                  color: '#475569',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {t('common.cancel') || "Cancelar"}
              </button>
              <button
                type="submit"
                disabled={submitting || !isValidNewStock || !reason || (reason === "Otra razón" && !customReason.trim()) || (difference !== null && Math.abs(difference) < 0.0001)}
                style={{
                  padding: '0.65rem 1.5rem',
                  borderRadius: '0.6rem',
                  border: 'none',
                  background: 'var(--corp-green)',
                  color: 'white',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  cursor: (submitting || !isValidNewStock || !reason || (difference !== null && Math.abs(difference) < 0.0001)) ? 'not-allowed' : 'pointer',
                  opacity: (submitting || !isValidNewStock || !reason || (difference !== null && Math.abs(difference) < 0.0001)) ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(66, 98, 22, 0.2)'
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{t('common.saving') || "Guardando..."}</span>
                  </>
                ) : (
                  <span>{t('dashboard.stock_mod_save_btn') || "Guardar modificación"}</span>
                )}
              </button>
            </div>
          </form>

          {/* History Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={16} color="#64748b" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  {t('dashboard.stock_mod_history_title') || "Historial de modificaciones de stock"}
                </h4>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700' }}>
                ({adjustments.length})
              </span>
            </div>

            {loadingHistory ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: '0.8rem', margin: 0 }}>{t('common.loading') || "Cargando..."}</p>
              </div>
            ) : adjustments.length === 0 ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                background: '#f8fafc',
                borderRadius: '0.75rem',
                border: '1px dashed #cbd5e1',
                color: '#94a3b8'
              }}>
                <History size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>
                  {t('dashboard.stock_mod_no_history') || "No hay modificaciones de stock registradas para esta elaboración."}
                </p>
              </div>
            ) : (
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                background: 'white'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                      <tr>
                        <th style={{ padding: '0.65rem 0.85rem', fontWeight: '800' }}>{t('common.date') || "Fecha"}</th>
                        <th style={{ padding: '0.65rem 0.85rem', fontWeight: '800' }}>{t('dashboard.stock_mod_prev_stock') || "Stock anterior"}</th>
                        <th style={{ padding: '0.65rem 0.85rem', fontWeight: '800' }}>{t('dashboard.stock_mod_new_stock') || "Nuevo stock"}</th>
                        <th style={{ padding: '0.65rem 0.85rem', fontWeight: '800' }}>{t('dashboard.stock_mod_diff') || "Variación"}</th>
                        <th style={{ padding: '0.65rem 0.85rem', fontWeight: '800' }}>{t('dashboard.stock_mod_reason') || "Motivo"}</th>
                        <th style={{ padding: '0.65rem 0.85rem', fontWeight: '800' }}>{t('dashboard.stock_mod_user') || "Usuario"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adjustments.map((adj) => {
                        const isPositive = (adj.difference || 0) > 0;
                        const isNegative = (adj.difference || 0) < 0;
                        return (
                          <tr key={adj.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '0.65rem 0.85rem', whiteSpace: 'nowrap', color: '#475569' }}>
                              {formatDateTime(adj.createdAt)}
                            </td>
                            <td style={{ padding: '0.65rem 0.85rem', fontWeight: '600', color: '#64748b' }}>
                              {adj.previousStock} {unit}
                            </td>
                            <td style={{ padding: '0.65rem 0.85rem', fontWeight: '800', color: 'var(--text-main)' }}>
                              {adj.newStock} {unit}
                            </td>
                            <td style={{ padding: '0.65rem 0.85rem', fontWeight: '800' }}>
                              <span style={{
                                padding: '0.15rem 0.45rem',
                                borderRadius: '0.35rem',
                                background: isPositive ? '#ecfdf5' : isNegative ? '#fef2f2' : '#f1f5f9',
                                color: isPositive ? '#065f46' : isNegative ? '#991b1b' : '#64748b',
                                fontSize: '0.75rem'
                              }}>
                                {isPositive ? `+${adj.difference}` : adj.difference} {unit}
                              </span>
                            </td>
                            <td style={{ padding: '0.65rem 0.85rem', fontWeight: '600', color: '#334155' }}>
                              {getReasonLabel(adj.reason, adj.customReason)}
                            </td>
                            <td style={{ padding: '0.65rem 0.85rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                              {adj.userName || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
