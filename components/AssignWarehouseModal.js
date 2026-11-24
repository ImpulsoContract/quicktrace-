"use client";

import React, { useState } from "react";
import { 
  X, Warehouse as WarehouseIcon, Settings, Check, Loader2, AlertCircle, CheckCircle, Ban
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function AssignWarehouseModal({ 
  elaboration, 
  warehouses = [], 
  onClose, 
  onOpenManageWarehouses, 
  onAssigned 
}) {
  const { t } = useI18n();

  const [selectedWarehouseId, setSelectedWarehouseId] = useState(
    elaboration?.warehouseId ? elaboration.warehouseId.toString() : "none"
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const hasWarehouses = Array.isArray(warehouses) && warehouses.length > 0;

  const handleSave = async () => {
    if (!elaboration?.id) return;
    setErrorMsg("");
    setSubmitting(true);

    try {
      const targetId = selectedWarehouseId === "none" ? null : parseInt(selectedWarehouseId);
      const res = await fetch(`/api/client/elaborations/${elaboration.id}/warehouse`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ warehouseId: targetId })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al asignar el almacén");
      }

      if (onAssigned) {
        onAssigned(data.data);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Error al asignar el almacén.");
      setSubmitting(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1060,
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
          maxWidth: '520px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ 
              padding: '0.45rem', 
              borderRadius: '0.6rem', 
              background: 'rgba(37, 99, 235, 0.1)', 
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <WarehouseIcon size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                {t('dashboard.assign_warehouse_title') || "Asignar almacén"}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                <strong>{t('traceability_form.elaboration_title') || "Lote"}:</strong> {elaboration?.name} {elaboration?.recipe?.name ? `• ${elaboration.recipe.name}` : ''}
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
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
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

          {!hasWarehouses ? (
            /* AVISO CUANDO NO HAY ALMACENES CREADOS */
            <div style={{
              padding: '2rem 1.5rem',
              textAlign: 'center',
              background: '#f8fafc',
              borderRadius: '1rem',
              border: '1px dashed #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <WarehouseIcon size={28} />
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.4rem 0' }}>
                  {t('dashboard.no_warehouses_notice_title') || "No tienes almacenes creados"}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5', maxWidth: '380px' }}>
                  {t('dashboard.no_warehouses_notice_desc') || "Para poder asignar una elaboración a un almacén, primero debes crear al menos uno."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenManageWarehouses) onOpenManageWarehouses();
                }}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.65rem',
                  border: 'none',
                  background: 'var(--corp-green)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(66, 98, 22, 0.2)'
                }}
              >
                <Settings size={18} />
                <span>{t('dashboard.btn_create_manage_warehouses') || "Crear / gestionar almacenes"}</span>
              </button>
            </div>
          ) : (
            /* LISTADO DE ALMACENES PARA ASIGNAR */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t('dashboard.select_warehouse_label') || "Selecciona el almacén de destino"}:
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Opción Sin almacén */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      borderRadius: '0.75rem',
                      border: '1px solid',
                      borderColor: selectedWarehouseId === "none" ? '#22c55e' : '#e2e8f0',
                      background: selectedWarehouseId === "none" ? '#f0fdf4' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <input
                        type="radio"
                        name="warehouseOption"
                        value="none"
                        checked={selectedWarehouseId === "none"}
                        onChange={() => setSelectedWarehouseId("none")}
                        style={{ accentColor: 'var(--corp-green)', width: '16px', height: '16px' }}
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: selectedWarehouseId === "none" ? '#166534' : '#475569' }}>
                        {t('dashboard.warehouse_option_none') || "Sin almacén asignado"}
                      </span>
                    </div>
                    {selectedWarehouseId === "none" && <Check size={16} color="#166534" />}
                  </label>

                  {/* Cada almacén creado */}
                  {warehouses.map((w) => {
                    const isSelected = selectedWarehouseId === w.id.toString();
                    return (
                      <label
                        key={w.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.85rem 1rem',
                          borderRadius: '0.75rem',
                          border: '1px solid',
                          borderColor: isSelected ? '#22c55e' : '#e2e8f0',
                          background: isSelected ? '#f0fdf4' : 'white',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <input
                            type="radio"
                            name="warehouseOption"
                            value={w.id.toString()}
                            checked={isSelected}
                            onChange={() => setSelectedWarehouseId(w.id.toString())}
                            style={{ accentColor: 'var(--corp-green)', width: '16px', height: '16px' }}
                          />
                          <WarehouseIcon size={16} color={isSelected ? '#166534' : '#64748b'} />
                          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: isSelected ? '#166534' : 'var(--text-main)' }}>
                            {w.name}
                          </span>
                        </div>
                        {isSelected && <Check size={16} color="#166534" />}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Botón para gestionar almacenes por si no encuentra el deseado */}
              <div style={{
                padding: '0.85rem 1rem',
                background: '#f8fafc',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {t('dashboard.not_found_warehouse_hint') || "¿No encuentras el almacén deseado?"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenManageWarehouses) onOpenManageWarehouses();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '0.8rem',
                    color: '#2563eb',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Settings size={14} />
                  <span>{t('dashboard.btn_manage_warehouses') || "Gestionar almacenes"}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        {hasWarehouses && (
          <div style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            background: '#f8fafc'
          }}>
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
              type="button"
              onClick={handleSave}
              disabled={submitting}
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: '0.6rem',
                border: 'none',
                background: 'var(--corp-green)',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: '800',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1,
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
                <span>{t('dashboard.btn_assign_warehouse_save') || "Asignar almacén"}</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
