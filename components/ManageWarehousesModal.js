"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Plus, Edit2, Trash2, Check, Loader2, AlertCircle, CheckCircle, Warehouse as WarehouseIcon
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function ManageWarehousesModal({ 
  warehouses = [], 
  onClose, 
  onWarehousesUpdated 
}) {
  const { t } = useI18n();

  const [warehouseList, setWarehouseList] = useState(warehouses);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Load latest warehouses on mount
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/client/warehouses");
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.data)) {
          setWarehouseList(data.data);
          if (onWarehousesUpdated) onWarehousesUpdated(data.data);
        }
      } catch (err) {
        console.error("Error loading warehouses:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const trimmed = newName.trim();
    if (!trimmed) {
      setErrorMsg(t('dashboard.warehouse_err_name_required') || "Introduce un nombre para el almacén.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/client/warehouses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al crear el almacén");
      }

      const updated = [...warehouseList, data.data].sort((a, b) => a.name.localeCompare(b.name));
      setWarehouseList(updated);
      setNewName("");
      setSuccessMsg(t('dashboard.warehouse_created_success') || "Almacén creado correctamente.");
      if (onWarehousesUpdated) onWarehousesUpdated(updated);
    } catch (err) {
      setErrorMsg(err.message || "Error al crear el almacén.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartEdit = (w) => {
    setEditingId(w.id);
    setEditingName(w.name);
    setErrorMsg("");
  };

  const handleSaveEdit = async (wId) => {
    setErrorMsg("");
    setSuccessMsg("");

    const trimmed = editingName.trim();
    if (!trimmed) {
      setErrorMsg(t('dashboard.warehouse_err_name_required') || "Introduce un nombre para el almacén.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/client/warehouses/${wId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al actualizar el almacén");
      }

      const updated = warehouseList.map(item => item.id === wId ? { ...item, name: trimmed } : item)
        .sort((a, b) => a.name.localeCompare(b.name));
      setWarehouseList(updated);
      setEditingId(null);
      setEditingName("");
      setSuccessMsg(t('dashboard.warehouse_updated_success') || "Almacén actualizado correctamente.");
      if (onWarehousesUpdated) onWarehousesUpdated(updated);
    } catch (err) {
      setErrorMsg(err.message || "Error al actualizar el almacén.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (w) => {
    setErrorMsg("");
    setSuccessMsg("");

    const confirmMsg = t('dashboard.warehouse_confirm_delete') || 
      `¿Seguro que deseas eliminar el almacén "${w.name}"? Las elaboraciones que estuvieran asignadas a este almacén quedarán sin almacén asignado.`;
    
    if (!window.confirm(confirmMsg)) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/client/warehouses/${w.id}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al eliminar el almacén");
      }

      const updated = warehouseList.filter(item => item.id !== w.id);
      setWarehouseList(updated);
      setSuccessMsg(t('dashboard.warehouse_deleted_success') || "Almacén eliminado correctamente.");
      if (onWarehousesUpdated) onWarehousesUpdated(updated);
    } catch (err) {
      setErrorMsg(err.message || "Error al eliminar el almacén.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
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
          maxWidth: '560px',
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
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                {t('dashboard.manage_warehouses_title') || "Gestión de almacenes"}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                {t('dashboard.manage_warehouses_desc') || "Crea, modifica y organiza los almacenes de tus elaboraciones."}
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

          {/* Create Warehouse Form */}
          <form onSubmit={handleCreate} style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            padding: '1rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder={t('dashboard.warehouse_name_placeholder') || "Nombre del almacén (ej: Almacén Principal, Cámara 1...)"}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                borderRadius: '0.6rem',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                background: 'white',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              disabled={actionLoading}
            />
            <button
              type="submit"
              disabled={actionLoading || !newName.trim()}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '0.6rem',
                border: 'none',
                background: 'var(--corp-green)',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: '800',
                cursor: (actionLoading || !newName.trim()) ? 'not-allowed' : 'pointer',
                opacity: (actionLoading || !newName.trim()) ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(66, 98, 22, 0.15)'
              }}
            >
              {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              <span>{t('dashboard.add_warehouse_btn') || "Añadir almacén"}</span>
            </button>
          </form>

          {/* Warehouses List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('dashboard.existing_warehouses') || "Almacenes creados"} ({warehouseList.length})
              </span>
            </div>

            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: '0.85rem', margin: 0 }}>{t('common.loading') || "Cargando almacenes..."}</p>
              </div>
            ) : warehouseList.length === 0 ? (
              <div style={{
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                background: '#f8fafc',
                borderRadius: '0.75rem',
                border: '1px dashed #cbd5e1',
                color: '#94a3b8'
              }}>
                <WarehouseIcon size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.9rem', margin: 0, fontWeight: '700', color: '#64748b' }}>
                  {t('dashboard.no_warehouses_yet') || "No tienes ningún almacén creado todavía."}
                </p>
                <p style={{ fontSize: '0.8rem', margin: '0.3rem 0 0 0', color: '#94a3b8' }}>
                  {t('dashboard.create_warehouse_hint') || "Añade tu primer almacén arriba para empezar a organizar tus elaboraciones."}
                </p>
              </div>
            ) : (
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                background: 'white'
              }}>
                {warehouseList.map((w, index) => {
                  const isEditing = editingId === w.id;
                  const elabCount = w._count?.elaborations || 0;
                  return (
                    <div 
                      key={w.id}
                      style={{
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        borderBottom: index < warehouseList.length - 1 ? '1px solid #f1f5f9' : 'none',
                        background: isEditing ? '#f0fdf4' : 'white',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      {isEditing ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            style={{
                              flex: 1,
                              padding: '0.45rem 0.65rem',
                              borderRadius: '0.4rem',
                              border: '1px solid #22c55e',
                              fontSize: '0.9rem',
                              outline: 'none',
                              background: 'white'
                            }}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit(w.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(w.id)}
                            disabled={actionLoading || !editingName.trim()}
                            title={t('common.save') || "Guardar"}
                            style={{
                              background: 'var(--corp-green)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.4rem',
                              padding: '0.45rem 0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            disabled={actionLoading}
                            title={t('common.cancel') || "Cancelar"}
                            style={{
                              background: '#f1f5f9',
                              color: '#64748b',
                              border: '1px solid #cbd5e1',
                              borderRadius: '0.4rem',
                              padding: '0.45rem 0.65rem',
                              cursor: 'pointer'
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <WarehouseIcon size={16} color="#64748b" />
                            <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>
                              {w.name}
                            </span>
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: '600',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '1rem',
                              background: elabCount > 0 ? '#eff6ff' : '#f1f5f9',
                              color: elabCount > 0 ? '#1d4ed8' : '#64748b'
                            }}>
                              {elabCount} {t('dashboard.warehouse_elabs_count') || "elaboraciones"}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(w)}
                              title={t('common.edit') || "Modificar"}
                              style={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                color: '#475569',
                                borderRadius: '0.4rem',
                                padding: '0.4rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(w)}
                              title={t('common.delete') || "Eliminar"}
                              style={{
                                background: '#fef2f2',
                                border: '1px solid #fee2e2',
                                color: '#ef4444',
                                borderRadius: '0.4rem',
                                padding: '0.4rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'flex-end',
          background: '#f8fafc'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.65rem 1.5rem',
              borderRadius: '0.6rem',
              border: '1px solid #cbd5e1',
              background: 'white',
              color: '#334155',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {t('common.close') || "Cerrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
