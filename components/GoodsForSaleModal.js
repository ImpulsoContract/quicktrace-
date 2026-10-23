import React, { useState, useEffect, useMemo } from "react";
import { 
  X, Plus, Edit, Trash2, Tag, Loader2, Search, CheckCircle, 
  AlertCircle, DollarSign, Package, ShoppingBag, Layers
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function GoodsForSaleModal({
  isOpen,
  onClose,
  profile
}) {
  const { t, locale } = useI18n();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    salePrice: ""
  });

  const currencySymbol = useMemo(() => {
    const cur = profile?.currency || "EUR";
    const map = { EUR: "€", USD: "$", GBP: "£" };
    return map[cur] || cur;
  }, [profile?.currency]);

  const commonUnits = ["kg", "g", "l", "ml", "ud", "caja", "paquete", "botella", "bandeja", "bolsa"];

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/client/goods-for-sale?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setItems(data.data);
      }
    } catch (err) {
      console.error("Error fetching goods for sale:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchItems();
      setEditingId(null);
      setFormData({ name: "", unit: "", salePrice: "" });
      setSearchTerm("");
    }
  }, [isOpen]);

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      unit: item.unit,
      salePrice: item.salePrice != null ? item.salePrice.toString() : ""
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", unit: "", salePrice: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedUnit = formData.unit.trim();
    const parsedPrice = parseFloat(formData.salePrice.toString().replace(',', '.'));

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

    setSubmitting(true);
    try {
      const url = editingId 
        ? `/api/client/goods-for-sale/${editingId}`
        : `/api/client/goods-for-sale`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          unit: trimmedUnit,
          salePrice: parsedPrice
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(editingId 
          ? (t('goods_for_sale.success_updated') || "Mercancía en venta actualizada correctamente.")
          : (t('goods_for_sale.success_created') || "Mercancía en venta añadida correctamente.")
        );
        handleCancelEdit();
        await fetchItems();
      } else {
        alert(data.error || t('alerts.request_error'));
      }
    } catch (err) {
      console.error("Error saving good for sale:", err);
      alert(t('alerts.connection_error') || "Error de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmMsg = (t('goods_for_sale.delete_confirm') || "¿Estás seguro de que deseas eliminar la mercancía en venta '{name}'?")
      .replace('{name}', item.name);
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/client/goods-for-sale/${item.id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (editingId === item.id) {
          handleCancelEdit();
        }
        await fetchItems();
      } else {
        alert(data.error || t('alerts.delete_error'));
      }
    } catch (err) {
      console.error("Error deleting good for sale:", err);
      alert(t('alerts.connection_error'));
    }
  };

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const q = searchTerm.toLowerCase();
    return items.filter(it => 
      it.name.toLowerCase().includes(q) || 
      it.unit.toLowerCase().includes(q)
    );
  }, [items, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '850px', 
          width: '95%',
          maxHeight: '90vh', 
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
              <Tag size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
                {t('goods_for_sale.modal_title') || "Mercancías en venta"}
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {t('goods_for_sale.modal_subtitle') || "Gestiona el catálogo de mercancías destinadas a la venta con su precio unitario"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem' }}
          >
            <X size={24} />
          </button>
        </header>

        {/* Content body */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Add / Edit Form Box */}
          <div style={{ 
            background: editingId ? '#eff6ff' : '#f8fafc', 
            border: `1px solid ${editingId ? '#bfdbfe' : 'var(--border)'}`, 
            borderRadius: '0.85rem', 
            padding: '1.25rem' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: editingId ? '#1e40af' : 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {editingId ? <Edit size={16} /> : <Plus size={16} color="var(--corp-green)" />}
                {editingId 
                  ? (t('goods_for_sale.edit_title') || "Editar mercancía en venta")
                  : (t('goods_for_sale.add_title') || "Nueva mercancía en venta")}
              </h3>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    background: 'white',
                    border: '1px solid #93c5fd',
                    color: '#1e40af',
                    borderRadius: '0.35rem',
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {t('goods_for_sale.cancel_edit') || "Cancelar edición"}
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem', alignItems: 'flex-start' }}>
                {/* Nombre */}
                <div>
                  <label className="label" style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', display: 'block' }}>
                    {t('goods_for_sale.col_name') || "Nombre de la mercancía"} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('goods_for_sale.name_placeholder') || "Ej: Aceite de Oliva 5L"}
                    required
                    style={{ margin: 0, fontSize: '0.88rem' }}
                  />
                </div>

                {/* Unidad de medida */}
                <div>
                  <label className="label" style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', display: 'block' }}>
                    {t('goods_for_sale.col_unit') || "Unidad de medida"} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    list="goods-unit-suggestions"
                    className="input-field"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder={t('goods_for_sale.unit_placeholder') || "Ej: kg, ud, caja..."}
                    required
                    style={{ margin: 0, fontSize: '0.88rem' }}
                  />
                  <datalist id="goods-unit-suggestions">
                    {commonUnits.map((u, idx) => (
                      <option key={idx} value={u} />
                    ))}
                  </datalist>
                </div>

                {/* Precio de venta por unidad */}
                <div>
                  <label className="label" style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', display: 'block' }}>
                    {t('goods_for_sale.col_sale_price') || "Precio de venta por unidad"} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="input-field"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      placeholder="0.00"
                      required
                      style={{ margin: 0, fontSize: '0.88rem', flex: 1 }}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                      {currencySymbol}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="btn-secondary"
                    style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    {t('goods_for_sale.cancel_edit') || "Cancelar"}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ padding: '0.55rem 1.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {t('common.saving') || "Guardando..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      {editingId 
                        ? (t('goods_for_sale.update_btn') || "Guardar cambios")
                        : (t('goods_for_sale.save_btn') || "Añadir a la venta")}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* List Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  {t('goods_for_sale.list_title') || "Listado de mercancías en venta"}
                </h3>
                <span style={{ background: '#e2e8f0', color: '#334155', padding: '0.15rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '700' }}>
                  {filteredItems.length}
                </span>
              </div>

              {/* Search */}
              {items.length > 3 && (
                <div style={{ position: 'relative', width: '250px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('common.search') || "Buscar mercancía..."}
                    className="input-field"
                    style={{ margin: 0, paddingLeft: '2rem', paddingRight: '0.65rem', paddingTop: '0.4rem', paddingBottom: '0.4rem', fontSize: '0.82rem' }}
                  />
                </div>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: 'var(--corp-green)' }} />
              </div>
            ) : filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', background: '#f8fafc', borderRadius: '0.85rem', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
                <ShoppingBag size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.35 }} />
                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                  {searchTerm.trim() 
                    ? (t('goods_for_sale.no_results') || "No se encontraron mercancías con ese criterio.")
                    : (t('goods_for_sale.empty_msg') || "No tienes mercancías en venta registradas todavía.")}
                </p>
                {!searchTerm.trim() && (
                  <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {t('goods_for_sale.empty_hint') || "Utiliza el formulario superior para añadir tu primera mercancía con su precio por unidad."}
                  </p>
                )}
              </div>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '0.65rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: '800', color: '#64748b' }}>
                        {t('goods_for_sale.col_name') || "Nombre de la mercancía"}
                      </th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: '800', color: '#64748b', width: '120px' }}>
                        {t('goods_for_sale.col_unit') || "Unidad"}
                      </th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: '800', color: '#64748b', textAlign: 'right', width: '130px' }}>
                        {t('goods_for_sale.col_stock') || "Stock"}
                      </th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: '800', color: '#64748b', textAlign: 'right', width: '150px' }}>
                        {t('goods_for_sale.col_cost_price') || "Precio coste / ud"}
                      </th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: '800', color: '#64748b', textAlign: 'right', width: '160px' }}>
                        {t('goods_for_sale.col_sale_price') || "Precio venta / ud"}
                      </th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: '800', color: '#64748b', textAlign: 'center', width: '110px' }}>
                        {t('common.actions') || "Acciones"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map(item => {
                      const isBeingEdited = editingId === item.id;
                      return (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', background: isBeingEdited ? '#eff6ff' : 'transparent' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Package size={16} color="var(--corp-green)" />
                              <span>{item.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span style={{ 
                              padding: '0.2rem 0.55rem', 
                              background: '#f1f5f9', 
                              color: '#475569', 
                              borderRadius: '0.35rem', 
                              fontSize: '0.78rem', 
                              fontWeight: '700' 
                            }}>
                              {item.unit}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '700', color: 'var(--text-main)' }}>
                            {(item.stock || 0).toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.unit}</span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)' }}>
                            {item.costPrice != null ? `${Number(item.costPrice).toFixed(2)} ${currencySymbol}` : "-"}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '800', color: 'var(--corp-green)', fontSize: '0.95rem' }}>
                            {Number(item.salePrice).toFixed(2)} {currencySymbol}
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', marginLeft: '0.2rem' }}>
                              / {item.unit}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                              <button
                                type="button"
                                onClick={() => handleStartEdit(item)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#3b82f6',
                                  cursor: 'pointer',
                                  padding: '0.3rem',
                                  borderRadius: '0.3rem'
                                }}
                                title={t('common.edit') || "Editar"}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  padding: '0.3rem',
                                  borderRadius: '0.3rem'
                                }}
                                title={t('common.delete') || "Eliminar"}
                              >
                                <Trash2 size={16} />
                              </button>
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
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.55rem 1.5rem', fontSize: '0.85rem' }}
          >
            {t('common.close') || "Cerrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
