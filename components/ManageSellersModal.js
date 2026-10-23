import React, { useState, useEffect, useRef } from "react";
import { 
  X, Plus, Edit2, Trash2, Users, Loader2, Check, AlertCircle, Search, UserCheck
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function ManageSellersModal({ isOpen, onClose }) {
  const { t } = useI18n();

  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [nameInput, setNameInput] = useState("");
  const [editingSellerId, setEditingSellerId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const inputRef = useRef(null);

  // Fetch sellers
  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/client/sellers?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSellers(data.data);
      }
    } catch (err) {
      console.error("Error fetching sellers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSellers();
      setNameInput("");
      setEditingSellerId(null);
      setErrorMsg("");
      setSearchTerm("");
    }
  }, [isOpen]);

  const handleStartEdit = (seller) => {
    setEditingSellerId(seller.id);
    setNameInput(seller.name);
    setErrorMsg("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCancelEdit = () => {
    setEditingSellerId(null);
    setNameInput("");
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setErrorMsg(t('sellers.name_required') || "El nombre del vendedor es obligatorio.");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      if (editingSellerId) {
        // Update seller
        const res = await fetch(`/api/client/sellers/${editingSellerId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmed })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setNameInput("");
          setEditingSellerId(null);
          await fetchSellers();
        } else {
          setErrorMsg(data.error || "Error al actualizar el vendedor.");
        }
      } else {
        // Create seller
        const res = await fetch(`/api/client/sellers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmed })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setNameInput("");
          await fetchSellers();
        } else {
          setErrorMsg(data.error || "Error al crear el vendedor.");
        }
      }
    } catch (err) {
      console.error("Error saving seller:", err);
      setErrorMsg(t('alerts.connection_error') || "Error de conexión.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (seller) => {
    if (!confirm((t('sellers.delete_confirm') || "¿Estás seguro de que deseas eliminar a este vendedor?").replace('{name}', seller.name))) {
      return;
    }

    try {
      const res = await fetch(`/api/client/sellers/${seller.id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (editingSellerId === seller.id) {
          handleCancelEdit();
        }
        await fetchSellers();
      } else {
        alert(data.error || "Error al eliminar el vendedor.");
      }
    } catch (err) {
      console.error("Error deleting seller:", err);
      alert(t('alerts.connection_error') || "Error de conexión.");
    }
  };

  if (!isOpen) return null;

  const filteredSellers = sellers.filter(s => 
    !searchTerm.trim() || s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay" style={{ zIndex: 1200 }} onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '560px', 
          width: '95%',
          maxHeight: '88vh', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '1.75rem',
          animation: 'scaleUp 0.2s ease'
        }}
      >
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(66, 98, 22, 0.1)', color: 'var(--corp-green)', padding: '0.6rem', borderRadius: '0.6rem' }}>
              <Users size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
                {t('sellers.modal_title') || "Gestionar vendedores"}
              </h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {t('sellers.modal_desc') || "Crea, modifica y elimina los vendedores de tu empresa"}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem' }}
          >
            <X size={22} />
          </button>
        </header>

        {/* Create / Edit Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.25rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '800', color: editingSellerId ? '#1d4ed8' : 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {editingSellerId ? (
              <>
                <Edit2 size={14} />
                {t('sellers.edit_seller') || "Modificar vendedor"}
              </>
            ) : (
              <>
                <Plus size={14} />
                {t('sellers.new_seller') || "Nuevo vendedor"}
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              ref={inputRef}
              type="text"
              placeholder={t('sellers.name_placeholder') || "Nombre del vendedor..."}
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              style={{
                flex: 1,
                padding: '0.55rem 0.85rem',
                fontSize: '0.88rem',
                borderRadius: '0.5rem',
                border: errorMsg ? '1.5px solid #ef4444' : '1px solid var(--border)',
                outline: 'none',
                background: 'white'
              }}
            />

            <button
              type="submit"
              disabled={saving || !nameInput.trim()}
              className="btn-primary"
              style={{
                padding: '0.55rem 1.1rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                opacity: saving || !nameInput.trim() ? 0.6 : 1,
                cursor: saving || !nameInput.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : editingSellerId ? (
                <>
                  <Check size={15} />
                  {t('sellers.save_btn') || "Guardar"}
                </>
              ) : (
                <>
                  <Plus size={15} />
                  {t('sellers.add_btn') || "Añadir"}
                </>
              )}
            </button>

            {editingSellerId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-secondary"
                style={{
                  padding: '0.55rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: '700'
                }}
              >
                {t('common.cancel') || "Cancelar"}
              </button>
            )}
          </div>

          {errorMsg && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>

        {/* Search bar if multiple sellers */}
        {sellers.length > 5 && (
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder={t('common.search') || "Buscar..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.4rem 0.6rem 0.4rem 2rem',
                fontSize: '0.82rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border)',
                outline: 'none',
                background: 'white'
              }}
            />
          </div>
        )}

        {/* Sellers List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: '150px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2.5rem' }}>
              <Loader2 className="animate-spin" size={28} style={{ margin: '0 auto', color: 'var(--corp-green)' }} />
            </div>
          ) : sellers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px dashed var(--border)' }}>
              <UserCheck size={36} style={{ margin: '0 auto 0.5rem', color: '#94a3b8' }} />
              <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {t('sellers.empty') || "No hay vendedores registrados todavía."}
              </p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                {t('sellers.empty_hint') || "Añade el primer vendedor con el campo superior."}
              </p>
            </div>
          ) : filteredSellers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              {t('common.no_results') || "No se encontraron resultados"}
            </div>
          ) : (
            filteredSellers.map((s) => {
              const isCurrentEditing = editingSellerId === s.id;
              return (
                <div 
                  key={s.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    background: isCurrentEditing ? '#eff6ff' : '#ffffff',
                    border: isCurrentEditing ? '1px solid #bfdbfe' : '1px solid var(--border)',
                    borderRadius: '0.65rem',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: isCurrentEditing ? '#dbeafe' : 'rgba(66, 98, 22, 0.08)', 
                      color: isCurrentEditing ? '#1d4ed8' : 'var(--corp-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.85rem'
                    }}>
                      {s.name[0]?.toUpperCase() || "V"}
                    </div>
                    <span style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.92rem' }}>
                      {s.name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(s)}
                      style={{
                        padding: '0.4rem',
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#1d4ed8',
                        borderRadius: '0.4rem',
                        cursor: 'pointer'
                      }}
                      title={t('common.edit') || "Editar"}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s)}
                      style={{
                        padding: '0.4rem',
                        background: '#fef2f2',
                        border: '1px solid #fee2e2',
                        color: '#ef4444',
                        borderRadius: '0.4rem',
                        cursor: 'pointer'
                      }}
                      title={t('common.delete') || "Eliminar"}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
          >
            {t('common.close') || "Cerrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
