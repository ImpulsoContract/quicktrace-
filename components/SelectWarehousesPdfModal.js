"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Warehouse as WarehouseIcon, FileText, Check, Loader2, AlertCircle
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function SelectWarehousesPdfModal({ 
  warehouses = [], 
  isOpen, 
  onClose, 
  onGenerate, 
  loading = false 
}) {
  const { t } = useI18n();

  // All warehouse IDs + "none" by default
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Default: all created warehouses selected + without warehouse
      setSelectedIds([...warehouses.map(w => w.id), "none"]);
    }
  }, [isOpen, warehouses]);

  if (!isOpen) return null;

  const toggleWarehouse = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds([...warehouses.map(w => w.id), "none"]);
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;
    onGenerate(selectedIds);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1070,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
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
              background: 'rgba(66, 98, 22, 0.1)', 
              color: 'var(--corp-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                {t('inventory_report.select_warehouses_title') || "Seleccionar almacenes para el inventario"}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                {t('inventory_report.select_warehouses_desc') || "Elige los almacenes que deseas incluir en el informe PDF:"}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.6rem',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: '#64748b',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => { if (!loading) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; } }}
            onMouseOut={(e) => { if (!loading) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; } }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Quick select buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t('inventory_report.warehouses_list') || "Almacenes disponibles"} ({selectedIds.length}/{warehouses.length + 1})
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleSelectAll}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '0.75rem',
                  color: 'var(--corp-green)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {t('inventory_report.btn_select_all') || "Seleccionar todos"}
              </button>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <button
                type="button"
                onClick={handleDeselectAll}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '0.75rem',
                  color: '#ef4444',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {t('inventory_report.btn_deselect_all') || "Deseleccionar todos"}
              </button>
            </div>
          </div>

          {/* List of checkboxes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {warehouses.map(w => {
              const isChecked = selectedIds.includes(w.id);
              return (
                <label
                  key={w.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid',
                    borderColor: isChecked ? '#86efac' : '#e2e8f0',
                    background: isChecked ? '#f0fdf4' : 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleWarehouse(w.id)}
                      disabled={loading}
                      style={{
                        accentColor: 'var(--corp-green)',
                        width: '18px',
                        height: '18px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    />
                    <WarehouseIcon size={16} color={isChecked ? 'var(--corp-green)' : '#64748b'} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: isChecked ? '#166534' : 'var(--text-main)' }}>
                      {w.name}
                    </span>
                  </div>
                  {isChecked && <Check size={16} color="#166534" />}
                </label>
              );
            })}

            {/* Option: Elaborations without warehouse */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid',
                borderColor: selectedIds.includes("none") ? '#86efac' : '#e2e8f0',
                background: selectedIds.includes("none") ? '#f0fdf4' : 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes("none")}
                  onChange={() => toggleWarehouse("none")}
                  disabled={loading}
                  style={{
                    accentColor: 'var(--corp-green)',
                    width: '18px',
                    height: '18px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: selectedIds.includes("none") ? '#166534' : '#64748b' }}>
                  {t('dashboard.without_warehouse') || "Sin almacén asignado"}
                </span>
              </div>
              {selectedIds.includes("none") && <Check size={16} color="#166534" />}
            </label>
          </div>

          {selectedIds.length === 0 && (
            <p style={{ fontSize: '0.8rem', color: '#ef4444', margin: 0, fontWeight: '600' }}>
              {t('inventory_report.err_select_at_least_one') || "Selecciona al menos un almacén para generar el inventario."}
            </p>
          )}

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '0.75rem',
            paddingTop: '1rem',
            borderTop: '1px solid #f1f5f9'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '0.6rem',
                border: '1px solid #cbd5e1',
                background: 'white',
                color: '#475569',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {t('common.cancel') || "Cancelar"}
            </button>
            <button
              type="submit"
              disabled={loading || selectedIds.length === 0}
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: '0.6rem',
                border: 'none',
                background: 'var(--corp-green)',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: '800',
                cursor: (loading || selectedIds.length === 0) ? 'not-allowed' : 'pointer',
                opacity: (loading || selectedIds.length === 0) ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(66, 98, 22, 0.2)'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{t('inventory_report.generating') || "Generando..."}</span>
                </>
              ) : (
                <>
                  <FileText size={16} />
                  <span>{t('inventory_report.btn_generate_pdf') || "Generar PDF"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
