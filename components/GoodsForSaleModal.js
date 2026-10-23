import React, { useState, useEffect, useMemo } from "react";
import { 
  X, Plus, Edit, Trash2, Tag, Loader2, Search, CheckCircle, 
  AlertCircle, DollarSign, Package, ShoppingBag, Layers,
  Archive, ArchiveRestore, ChevronDown, ChevronUp, Save, Check
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function GoodsForSaleModal({
  isOpen,
  onClose,
  profile
}) {
  const { t, locale } = useI18n();

  const [activeTab, setActiveTab] = useState("active"); // 'active' | 'archived'
  const [items, setItems] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    salePrice: ""
  });

  // Receipts detail state
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [receiptsByItem, setReceiptsByItem] = useState({});
  const [loadingReceipts, setLoadingReceipts] = useState({});
  const [receiptEdits, setReceiptEdits] = useState({});
  const [savingReceiptId, setSavingReceiptId] = useState(null);
  const [savedReceiptId, setSavedReceiptId] = useState(null);

  const currencySymbol = useMemo(() => {
    const cur = profile?.currency || "EUR";
    const map = { EUR: "€", USD: "$", GBP: "£" };
    return map[cur] || cur;
  }, [profile?.currency]);

  const commonUnits = ["kg", "g", "l", "ml", "ud", "caja", "paquete", "botella", "bandeja", "bolsa"];

  const fetchItems = async (tab = activeTab) => {
    try {
      setLoading(true);
      const param = tab === 'archived' ? '?archived=true' : '';
      const res = await fetch(`/api/client/goods-for-sale${param}${param ? '&' : '?'}t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setItems(data.data);
        if (typeof data.activeCount === 'number') setActiveCount(data.activeCount);
        if (typeof data.archivedCount === 'number') setArchivedCount(data.archivedCount);
      }
    } catch (err) {
      console.error("Error fetching goods for sale:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab("active");
      fetchItems("active");
      setEditingId(null);
      setExpandedItemId(null);
      setFormData({ name: "", unit: "", salePrice: "" });
      setSearchTerm("");
    }
  }, [isOpen]);

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setActiveTab(newTab);
    setEditingId(null);
    setExpandedItemId(null);
    setSearchTerm("");
    fetchItems(newTab);
  };

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
        await fetchItems(activeTab);
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

  const handleArchive = async (item) => {
    const confirmMsg = (t('goods_for_sale.archive_confirm') || "¿Deseas archivar la mercancía '{name}'? Dejará de aparecer en los listados de stock y precios de coste.")
      .replace('{name}', item.name);
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/client/goods-for-sale/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: true })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(t('goods_for_sale.success_archived') || "Mercancía archivada correctamente.");
        if (expandedItemId === item.id) setExpandedItemId(null);
        if (editingId === item.id) handleCancelEdit();
        await fetchItems(activeTab);
      } else {
        alert(data.error || t('alerts.request_error'));
      }
    } catch (err) {
      console.error("Error archiving good for sale:", err);
      alert(t('alerts.connection_error'));
    }
  };

  const handleUnarchive = async (item) => {
    const confirmMsg = (t('goods_for_sale.unarchive_confirm') || "¿Deseas desarchivar la mercancía '{name}'? Volverá a aparecer en los listados de stock y precios de coste.")
      .replace('{name}', item.name);
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/client/goods-for-sale/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: false })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(t('goods_for_sale.success_unarchived') || "Mercancía desarchivada correctamente.");
        if (expandedItemId === item.id) setExpandedItemId(null);
        await fetchItems(activeTab);
      } else {
        alert(data.error || t('alerts.request_error'));
      }
    } catch (err) {
      console.error("Error unarchiving good for sale:", err);
      alert(t('alerts.connection_error'));
    }
  };

  const handleDelete = async (item) => {
    if ((item._count?.goodsReceipts || 0) > 0) {
      alert(t('goods_for_sale.cannot_delete_has_receipts') || "No se puede eliminar esta mercancía porque tiene entradas asociadas. Puedes archivarla en su lugar.");
      return;
    }

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
        if (expandedItemId === item.id) {
          setExpandedItemId(null);
        }
        await fetchItems(activeTab);
      } else {
        alert(data.error || t('alerts.delete_error'));
      }
    } catch (err) {
      console.error("Error deleting good for sale:", err);
      alert(t('alerts.connection_error'));
    }
  };

  const handleToggleReceipts = async (itemId) => {
    if (expandedItemId === itemId) {
      setExpandedItemId(null);
      return;
    }
    setExpandedItemId(itemId);
    try {
      setLoadingReceipts(prev => ({ ...prev, [itemId]: true }));
      const res = await fetch(`/api/client/goods-for-sale/${itemId}/lots?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.lots)) {
        setReceiptsByItem(prev => ({ ...prev, [itemId]: data.lots }));
        const edits = {};
        data.lots.forEach(lot => {
          edits[lot.id] = {
            quantity: lot.goodsForSaleQuantity != null ? lot.goodsForSaleQuantity.toString() : "",
            costPrice: lot.goodsForSaleCostPrice != null ? lot.goodsForSaleCostPrice.toString() : ""
          };
        });
        setReceiptEdits(prev => ({ ...prev, ...edits }));
      }
    } catch (err) {
      console.error("Error fetching lots for goods for sale:", err);
    } finally {
      setLoadingReceipts(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleReceiptInputChange = (receiptId, field, value) => {
    setReceiptEdits(prev => ({
      ...prev,
      [receiptId]: {
        ...(prev[receiptId] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveReceipt = async (itemId, receiptId) => {
    const edits = receiptEdits[receiptId];
    if (!edits) return;

    setSavingReceiptId(receiptId);
    try {
      const res = await fetch(`/api/client/goods-for-sale/${itemId}/lots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiptId: receiptId,
          newQuantity: edits.quantity,
          newCostPrice: edits.costPrice
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Update item in list with new stock and new costPrice
        setItems(prev => prev.map(it => it.id === itemId ? {
          ...it,
          stock: data.newStock,
          costPrice: data.newCostPrice
        } : it));

        // Update receipt in state
        setReceiptsByItem(prev => ({
          ...prev,
          [itemId]: (prev[itemId] || []).map(r => r.id === receiptId ? {
            ...r,
            goodsForSaleQuantity: edits.quantity === "" ? 0 : parseFloat(edits.quantity),
            goodsForSaleCostPrice: edits.costPrice === "" ? null : parseFloat(edits.costPrice)
          } : r)
        }));

        setSavedReceiptId(receiptId);
        setTimeout(() => setSavedReceiptId(null), 2500);
      } else {
        alert(data.error || t('alerts.request_error'));
      }
    } catch (err) {
      console.error("Error saving receipt:", err);
      alert(t('alerts.connection_error'));
    } finally {
      setSavingReceiptId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'fr' ? 'fr-FR' : locale === 'it' ? 'it-IT' : locale === 'pt' ? 'pt-PT' : 'es-ES');
    } catch {
      return dateStr;
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
          maxWidth: '960px', 
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
          
          {/* Add / Edit Form Box (Only shown in Active tab or when editing) */}
          {(activeTab === 'active' || editingId) && (
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
          )}

          {/* List Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            
            {/* Tabs for Activas vs Archivadas & Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Tab Activas */}
                <button
                  type="button"
                  onClick={() => handleTabChange('active')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: activeTab === 'active' ? 'var(--corp-green)' : '#f1f5f9',
                    color: activeTab === 'active' ? '#ffffff' : '#475569',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <Package size={15} />
                  <span>{t('goods_for_sale.tab_active') || "Activas"}</span>
                  <span style={{
                    background: activeTab === 'active' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                    color: activeTab === 'active' ? '#ffffff' : '#334155',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '1rem',
                    fontSize: '0.72rem'
                  }}>
                    {activeCount}
                  </span>
                </button>

                {/* Tab Archivadas */}
                <button
                  type="button"
                  onClick={() => handleTabChange('archived')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: activeTab === 'archived' ? '#475569' : '#f1f5f9',
                    color: activeTab === 'archived' ? '#ffffff' : '#475569',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <Archive size={15} />
                  <span>{t('goods_for_sale.tab_archived') || "Archivadas"}</span>
                  <span style={{
                    background: activeTab === 'archived' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                    color: activeTab === 'archived' ? '#ffffff' : '#334155',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '1rem',
                    fontSize: '0.72rem'
                  }}>
                    {archivedCount}
                  </span>
                </button>
              </div>

              {/* Search */}
              {items.length > 2 && (
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
                {activeTab === 'archived' ? (
                  <>
                    <Archive size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.35 }} />
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                      {searchTerm.trim() 
                        ? (t('goods_for_sale.no_results') || "No se encontraron mercancías con ese criterio.")
                        : (t('goods_for_sale.no_archived_goods') || "No tienes mercancías en venta archivadas.")}
                    </p>
                  </>
                ) : (
                  <>
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
                  </>
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
                      <th style={{ padding: '0.75rem 1rem', fontWeight: '800', color: '#64748b', width: '100px' }}>
                        {t('goods_for_sale.col_unit') || "Unidad"}
                      </th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: '800', color: '#64748b', textAlign: 'right', width: '120px' }}>
                        {t('goods_for_sale.col_stock') || "Stock"}
                      </th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: '800', color: '#64748b', textAlign: 'right', width: '140px' }}>
                        {t('goods_for_sale.col_cost_price') || "Precio coste / ud"}
                      </th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: '800', color: '#64748b', textAlign: 'right', width: '150px' }}>
                        {t('goods_for_sale.col_sale_price') || "Precio venta / ud"}
                      </th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: '800', color: '#64748b', textAlign: 'center', width: '150px' }}>
                        {t('common.actions') || "Acciones"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map(item => {
                      const isBeingEdited = editingId === item.id;
                      const isExpanded = expandedItemId === item.id;
                      const hasReceipts = (item._count?.goodsReceipts || 0) > 0;
                      const lots = receiptsByItem[item.id] || [];
                      const isLoadingLots = loadingReceipts[item.id];

                      return (
                        <React.Fragment key={item.id}>
                          <tr style={{ borderBottom: isExpanded ? 'none' : '1px solid #f1f5f9', background: isBeingEdited ? '#eff6ff' : (isExpanded ? '#f8fafc' : 'transparent') }}>
                            <td style={{ padding: '0.75rem 1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Package size={16} color="var(--corp-green)" />
                                <span>{item.name}</span>
                                {item.isArchived && (
                                  <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '0.25rem', background: '#f1f5f9', color: '#64748b', fontWeight: '700' }}>
                                    {t('goods_for_sale.tab_archived') || "Archivada"}
                                  </span>
                                )}
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
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem' }}>
                                
                                {/* Toggle Receipts Detail */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleReceipts(item.id)}
                                  style={{
                                    background: isExpanded ? '#e0f2fe' : 'none',
                                    border: 'none',
                                    color: isExpanded ? '#0284c7' : '#64748b',
                                    cursor: 'pointer',
                                    padding: '0.3rem',
                                    borderRadius: '0.3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.2rem'
                                  }}
                                  title={isExpanded 
                                    ? (t('goods_for_sale.btn_hide_receipts') || "Ocultar entradas") 
                                    : (t('goods_for_sale.btn_view_receipts') || "Ver entradas asociadas")}
                                >
                                  <Layers size={16} />
                                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>

                                {/* Edit Button (Only in active tab) */}
                                {activeTab === 'active' && (
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
                                )}

                                {/* Archive Button (in active tab) / Unarchive Button (in archived tab) */}
                                {activeTab === 'active' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleArchive(item)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#d97706',
                                      cursor: 'pointer',
                                      padding: '0.3rem',
                                      borderRadius: '0.3rem'
                                    }}
                                    title={t('goods_for_sale.btn_archive') || "Archivar"}
                                  >
                                    <Archive size={16} />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleUnarchive(item)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#16a34a',
                                      cursor: 'pointer',
                                      padding: '0.3rem',
                                      borderRadius: '0.3rem'
                                    }}
                                    title={t('goods_for_sale.btn_unarchive') || "Desarchivar"}
                                  >
                                    <ArchiveRestore size={16} />
                                  </button>
                                )}

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: hasReceipts ? '#cbd5e1' : '#ef4444',
                                    cursor: hasReceipts ? 'help' : 'pointer',
                                    padding: '0.3rem',
                                    borderRadius: '0.3rem'
                                  }}
                                  title={hasReceipts 
                                    ? (t('goods_for_sale.cannot_delete_has_receipts') || "No se puede eliminar esta mercancía porque tiene entradas asociadas. Puedes archivarla en su lugar.")
                                    : (t('common.delete') || "Eliminar")}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Receipts Detail Section */}
                          {isExpanded && (
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                              <td colSpan={6} style={{ padding: '0.85rem 1.25rem 1.25rem 1.25rem' }}>
                                <div style={{ 
                                  background: '#ffffff', 
                                  border: '1px solid #cbd5e1', 
                                  borderRadius: '0.65rem', 
                                  padding: '1rem',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <Layers size={17} color="var(--corp-green)" />
                                      <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                        {(t('goods_for_sale.receipts_detail_title') || "Entradas de mercancía de '{name}'").replace('{name}', item.name)}
                                      </span>
                                      <span style={{ fontSize: '0.75rem', background: '#e2e8f0', color: '#475569', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontWeight: '700' }}>
                                        {lots.length}
                                      </span>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                      {t('goods_for_sale.col_unit') || "Unidad"}: <strong>{item.unit}</strong>
                                    </span>
                                  </div>

                                  {isLoadingLots ? (
                                    <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                                      <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto', color: 'var(--corp-green)' }} />
                                    </div>
                                  ) : lots.length === 0 ? (
                                    <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                      {t('goods_for_sale.no_receipts_for_item') || "No hay entradas de mercancía asociadas a esta mercancía todavía."}
                                    </div>
                                  ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                                        <thead>
                                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                                            <th style={{ padding: '0.5rem 0.6rem', fontWeight: '700' }}>{t('goods_for_sale.col_receipt_date') || "Fecha"}</th>
                                            <th style={{ padding: '0.5rem 0.6rem', fontWeight: '700' }}>{t('goods_for_sale.col_receipt_provider') || "Proveedor"}</th>
                                            <th style={{ padding: '0.5rem 0.6rem', fontWeight: '700' }}>{t('goods_for_sale.col_receipt_invoice') || "Nº Albarán / Factura"}</th>
                                            <th style={{ padding: '0.5rem 0.6rem', fontWeight: '700' }}>{t('goods_for_sale.col_receipt_lot') || "Lote"}</th>
                                            <th style={{ padding: '0.5rem 0.6rem', fontWeight: '700', width: '150px' }}>
                                              {t('goods_for_sale.col_receipt_stock') || "Stock disponible"} ({item.unit})
                                            </th>
                                            <th style={{ padding: '0.5rem 0.6rem', fontWeight: '700', width: '150px' }}>
                                              {t('goods_for_sale.col_receipt_cost_price') || "Precio coste / ud"} ({currencySymbol})
                                            </th>
                                            <th style={{ padding: '0.5rem 0.6rem', fontWeight: '700', textAlign: 'center', width: '90px' }}>
                                              {t('common.actions') || "Acciones"}
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {lots.map(lot => {
                                            const edit = receiptEdits[lot.id] || { quantity: "", costPrice: "" };
                                            const isSavingThis = savingReceiptId === lot.id;
                                            const isSavedThis = savedReceiptId === lot.id;

                                            return (
                                              <tr key={lot.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '0.5rem 0.6rem', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                                                  {formatDate(lot.date)}
                                                </td>
                                                <td style={{ padding: '0.5rem 0.6rem', color: 'var(--text-main)', fontWeight: '600' }}>
                                                  {lot.providerName || "-"}
                                                </td>
                                                <td style={{ padding: '0.5rem 0.6rem', color: 'var(--text-muted)' }}>
                                                  {lot.invoiceNumber || "-"}
                                                </td>
                                                <td style={{ padding: '0.5rem 0.6rem', color: 'var(--text-main)', fontWeight: '700' }}>
                                                  {lot.lote || "-"}
                                                </td>
                                                <td style={{ padding: '0.5rem 0.6rem' }}>
                                                  <input
                                                    type="number"
                                                    step="any"
                                                    min="0"
                                                    className="input-field"
                                                    value={edit.quantity}
                                                    onChange={(e) => handleReceiptInputChange(lot.id, 'quantity', e.target.value)}
                                                    style={{ margin: 0, padding: '0.3rem 0.5rem', fontSize: '0.82rem', width: '100%' }}
                                                    placeholder="0"
                                                  />
                                                </td>
                                                <td style={{ padding: '0.5rem 0.6rem' }}>
                                                  <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    className="input-field"
                                                    value={edit.costPrice}
                                                    onChange={(e) => handleReceiptInputChange(lot.id, 'costPrice', e.target.value)}
                                                    style={{ margin: 0, padding: '0.3rem 0.5rem', fontSize: '0.82rem', width: '100%' }}
                                                    placeholder="0.00"
                                                  />
                                                </td>
                                                <td style={{ padding: '0.5rem 0.6rem', textAlign: 'center' }}>
                                                  {isSavedThis ? (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#16a34a', fontSize: '0.75rem', fontWeight: '700' }}>
                                                      <Check size={14} /> OK
                                                    </span>
                                                  ) : (
                                                    <button
                                                      type="button"
                                                      disabled={isSavingThis}
                                                      onClick={() => handleSaveReceipt(item.id, lot.id)}
                                                      className="btn-primary"
                                                      style={{
                                                        padding: '0.3rem 0.65rem',
                                                        fontSize: '0.75rem',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem',
                                                        borderRadius: '0.35rem'
                                                      }}
                                                      title={t('goods_for_sale.save_receipt_changes') || "Guardar"}
                                                    >
                                                      {isSavingThis ? (
                                                        <Loader2 size={12} className="animate-spin" />
                                                      ) : (
                                                        <Save size={13} />
                                                      )}
                                                      <span>{t('goods_for_sale.save_receipt_changes') || "Guardar"}</span>
                                                    </button>
                                                  )}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
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
