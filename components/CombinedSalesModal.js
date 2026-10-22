import React, { useState, useEffect, useMemo } from "react";
import { 
  X, Plus, Trash2, ShoppingCart, Loader2, FileText, CheckCircle,
  AlertCircle, DollarSign, Calendar, User, Layers, ChevronRight, Eye
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function CombinedSalesModal({
  isOpen,
  onClose,
  customers = [],
  profile,
  onSaleCreated,
  onNavigateToCustomers
}) {
  const { t, locale } = useI18n();

  const [activeTab, setActiveTab] = useState("list"); // "list" | "new"

  // List view state
  const [combinedSales, setCombinedSales] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [invoicingId, setInvoicingId] = useState(null);
  const [expandedSaleId, setExpandedSaleId] = useState(null);

  // New sale state
  const [availableElaborations, setAvailableElaborations] = useState([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [selectedElabId, setSelectedElabId] = useState("");
  
  const [formCustomer, setFormCustomer] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formNotes, setFormNotes] = useState("");
  const [saleItems, setSaleItems] = useState([]); // [{ elaborationId, name, recipeName, availableStock, unit, quantity, price }]
  const [submitting, setSubmitting] = useState(false);

  // Holded Contact prompt state
  const [contactConfirm, setContactConfirm] = useState({
    isOpen: false,
    combinedSale: null,
    customerName: "",
    customerNif: ""
  });

  const currencySymbol = useMemo(() => {
    const cur = profile?.currency || "EUR";
    const map = { EUR: "€", USD: "$", GBP: "£" };
    return map[cur] || cur;
  }, [profile?.currency]);

  // Fetch combined sales
  const fetchCombinedSales = async () => {
    try {
      setLoadingList(true);
      const res = await fetch("/api/client/combined-sales");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCombinedSales(data.data);
      }
    } catch (err) {
      console.error("Error fetching combined sales:", err);
    } finally {
      setLoadingList(false);
    }
  };

  // Fetch available elaborations with stock
  const fetchAvailableElaborations = async () => {
    try {
      setLoadingAvailable(true);
      const res = await fetch(`/api/client/elaborations/available?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAvailableElaborations(data.data);
      } else {
        console.warn("Failed fetching available elaborations:", data);
      }
    } catch (err) {
      console.error("Error fetching available elaborations:", err);
    } finally {
      setLoadingAvailable(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCombinedSales();
      fetchAvailableElaborations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === "new") {
      fetchAvailableElaborations();
    }
  }, [activeTab, isOpen]);

  // Handle adding an elaboration to the combined sale form
  const handleAddElaboration = () => {
    if (!selectedElabId) return;
    const elab = availableElaborations.find(e => e.id === parseInt(selectedElabId));
    if (!elab) return;

    // Check if already added
    if (saleItems.some(it => it.elaborationId === elab.id)) {
      alert(t('combined_sales.already_added') || "Esta elaboración ya está incluida en la lista.");
      return;
    }

    setSaleItems(prev => [
      ...prev,
      {
        elaborationId: elab.id,
        name: elab.name,
        recipeName: elab.recipeName,
        availableStock: elab.availableStock,
        unit: elab.quantityUnit,
        quantity: "",
        price: ""
      }
    ]);
    setSelectedElabId("");
  };

  const handleUpdateItem = (index, field, value) => {
    setSaleItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setSaleItems(prev => prev.filter((_, i) => i !== index));
  };

  // Compute total price
  const totalPrice = useMemo(() => {
    return saleItems.reduce((sum, item) => {
      const p = parseFloat(item.price?.toString().replace(',', '.')) || 0;
      return sum + p;
    }, 0);
  }, [saleItems]);

  // Validate form items
  const formErrors = useMemo(() => {
    const errors = {};
    saleItems.forEach((item, idx) => {
      const qty = parseFloat(item.quantity?.toString().replace(',', '.'));
      if (item.quantity !== "" && (isNaN(qty) || qty <= 0)) {
        errors[idx] = "La cantidad debe ser mayor que 0.";
      } else if (qty > item.availableStock + 0.0001) {
        errors[idx] = `La cantidad supera el stock disponible (${item.availableStock} ${item.unit}).`;
      }
    });
    return errors;
  }, [saleItems]);

  const isFormValid = useMemo(() => {
    if (saleItems.length === 0) return false;
    if (Object.keys(formErrors).length > 0) return false;
    for (const item of saleItems) {
      const qty = parseFloat(item.quantity?.toString().replace(',', '.'));
      const prc = parseFloat(item.price?.toString().replace(',', '.'));
      if (isNaN(qty) || qty <= 0) return false;
      if (isNaN(prc) || prc < 0) return false;
    }
    return true;
  }, [saleItems, formErrors]);

  // Submit new combined sale
  const handleSubmitCombinedSale = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setSubmitting(true);
    try {
      const payload = {
        customerId: formCustomer ? parseInt(formCustomer) : null,
        date: formDate,
        notes: formNotes,
        items: saleItems.map(it => ({
          elaborationId: it.elaborationId,
          quantity: parseFloat(it.quantity.toString().replace(',', '.')),
          price: parseFloat(it.price.toString().replace(',', '.'))
        }))
      };

      const res = await fetch("/api/client/combined-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert(t('combined_sales.success_created') || "Venta combinada registrada correctamente.");
        setSaleItems([]);
        setFormNotes("");
        setFormCustomer("");
        setFormDate(new Date().toISOString().slice(0, 10));
        
        // Refresh data
        await fetchCombinedSales();
        await fetchAvailableElaborations();
        if (onSaleCreated) onSaleCreated();

        setActiveTab("list");
      } else {
        alert(data.error || "Error al registrar la venta combinada");
      }
    } catch (err) {
      console.error("Error creating combined sale:", err);
      alert(t('alerts.connection_error') || "Error de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete combined sale
  const handleDeleteCombinedSale = async (id) => {
    if (!confirm(t('combined_sales.delete_confirm') || "¿Estás seguro de que deseas eliminar esta venta combinada? Se restaurará el stock de todas las elaboraciones incluidas.")) {
      return;
    }

    try {
      const res = await fetch(`/api/client/combined-sales/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(t('combined_sales.delete_success') || "Venta combinada eliminada correctamente.");
        await fetchCombinedSales();
        await fetchAvailableElaborations();
        if (onSaleCreated) onSaleCreated();
      } else {
        alert(data.error || "Error al eliminar la venta combinada");
      }
    } catch (err) {
      console.error("Error deleting combined sale:", err);
      alert(t('alerts.connection_error') || "Error de conexión");
    }
  };

  // Generate invoice for combined sale
  const handleInvoiceCombined = async (cs, autoCreate = false) => {
    if (!profile?.holdedApiKey?.trim()) {
      alert(t('combined_sales.holded_api_required') || "Debes configurar tu API Key de Holded en la sección de 'Configuración del negocio' para poder emitir facturas.");
      return;
    }

    if (!cs.customerId && !cs.customer) {
      alert(t('combined_sales.customer_required') || "Debes asignar un cliente registrado a la venta combinada para poder generar la factura.");
      return;
    }

    setInvoicingId(cs.id);
    try {
      const res = await fetch(`/api/client/combined-sales/${cs.id}/invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoCreateContact: autoCreate })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert(data.message || (t('combined_sales.invoice_success') || "Factura {num} generada con éxito.").replace('{num}', data.invoiceNum || ""));
        setContactConfirm({ isOpen: false, combinedSale: null, customerName: "", customerNif: "" });
        await fetchCombinedSales();
        if (onSaleCreated) onSaleCreated();
      } else if (data.contactNotFound) {
        setContactConfirm({
          isOpen: true,
          combinedSale: cs,
          customerName: data.customerName || cs.customer?.commercialName || "",
          customerNif: data.customerNif || cs.customer?.nif || ""
        });
      } else {
        alert(data.error || "Error al generar factura en Holded");
      }
    } catch (err) {
      console.error("Error invoicing combined sale:", err);
      alert(t('alerts.connection_error') || "Error de conexión");
    } finally {
      setInvoicingId(null);
    }
  };

  const handleDownloadInvoice = (cs) => {
    window.open(`/api/client/combined-sales/${cs.id}/invoice/pdf`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '850px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(66, 98, 22, 0.1)', color: 'var(--corp-green)', borderRadius: '0.6rem' }}>
              <ShoppingCart size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>
                {t('combined_sales.modal_title') || "Ventas combinadas"}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Registra y consulta ventas compuestas por múltiples elaboraciones y lotes
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

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab("list")}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: activeTab === "list" ? 'var(--corp-green)' : '#f1f5f9',
              color: activeTab === "list" ? 'white' : '#64748b',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <Layers size={16} />
            {t('combined_sales.tab_list') || "Consultar ventas combinadas"}
            <span style={{ 
              background: activeTab === "list" ? 'rgba(255,255,255,0.25)' : '#cbd5e1', 
              color: activeTab === "list" ? 'white' : '#334155',
              padding: '0.1rem 0.45rem', 
              borderRadius: '1rem', 
              fontSize: '0.75rem' 
            }}>
              {combinedSales.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("new")}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: activeTab === "new" ? 'var(--corp-green)' : '#f1f5f9',
              color: activeTab === "new" ? 'white' : '#64748b',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={16} />
            {t('combined_sales.tab_new') || "Nueva venta combinada"}
          </button>
        </div>

        {/* Tab 1: Listado de ventas combinadas */}
        {activeTab === "list" && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loadingList ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: 'var(--corp-green)' }} />
              </div>
            ) : combinedSales.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '1rem', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
                <ShoppingCart size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                <p style={{ margin: 0, fontWeight: '600' }}>
                  {t('combined_sales.no_sales_yet') || "No hay ventas combinadas registradas todavía."}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("new")}
                  className="btn-primary"
                  style={{ marginTop: '1rem', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> {t('combined_sales.tab_new') || "Crear primera venta combinada"}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {combinedSales.map((cs) => {
                  const isExpanded = expandedSaleId === cs.id;
                  const totalUnits = (cs.sales || []).reduce((sum, s) => sum + (s.quantity || 0), 0);

                  return (
                    <div 
                      key={cs.id}
                      style={{
                        background: 'white',
                        border: '1px solid var(--border)',
                        borderRadius: '0.85rem',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}
                    >
                      {/* Card Summary Header */}
                      <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: isExpanded ? '#f8fafc' : 'white', borderBottom: isExpanded ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ padding: '0.25rem 0.6rem', background: '#e0e7ff', color: '#4338ca', borderRadius: '0.4rem', fontSize: '0.8rem', fontWeight: '800' }}>
                            #{cs.id}
                          </span>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1rem' }}>
                                {cs.customer ? cs.customer.commercialName : (t('combined_sales.no_customer') || "Venta directa / Sin cliente")}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', marginTop: '0.15rem' }}>
                              <span>{new Date(cs.date).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES')}</span>
                              <span>•</span>
                              <span>{(cs.sales || []).length} elaboraciones</span>
                              {cs.notes && (
                                <>
                                  <span>•</span>
                                  <span style={{ fontStyle: 'italic' }}>{cs.notes}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '1.15rem', fontWeight: '900', color: 'var(--corp-green)' }}>
                            {cs.totalPrice.toFixed(2)} {currencySymbol}
                          </span>

                          {/* Invoice Button or Badge */}
                          {cs.holdedInvoiceNum ? (
                            <button
                              type="button"
                              onClick={() => handleDownloadInvoice(cs)}
                              title={t('combined_sales.download_invoice') || "Descargar factura"}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                background: 'rgba(66, 98, 22, 0.1)',
                                color: 'var(--corp-green)',
                                border: '1px solid rgba(66, 98, 22, 0.3)',
                                borderRadius: '0.4rem',
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.78rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              <FileText size={14} />
                              {(t('combined_sales.invoice_badge') || "Factura: {num}").replace('{num}', cs.holdedInvoiceNum)}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleInvoiceCombined(cs)}
                              disabled={invoicingId === cs.id}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                background: '#f8fafc',
                                color: 'var(--text-main)',
                                border: '1px solid var(--border)',
                                borderRadius: '0.4rem',
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.78rem',
                                fontWeight: '700',
                                cursor: invoicingId === cs.id ? 'wait' : 'pointer'
                              }}
                            >
                              {invoicingId === cs.id ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} color="var(--corp-green)" />}
                              {invoicingId === cs.id ? (t('combined_sales.invoicing') || "Facturando...") : (t('combined_sales.generate_invoice') || "Facturar")}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setExpandedSaleId(isExpanded ? null : cs.id)}
                            style={{
                              padding: '0.4rem 0.75rem',
                              background: '#f1f5f9',
                              border: '1px solid #e2e8f0',
                              borderRadius: '0.4rem',
                              fontSize: '0.78rem',
                              fontWeight: '700',
                              color: '#475569',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <Eye size={14} />
                            {isExpanded ? "Ocultar" : "Ver detalle"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCombinedSale(cs.id)}
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
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div style={{ padding: '1rem 1.25rem', background: '#ffffff' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                            {t('combined_sales.details_title') || "Elaboraciones incluidas en esta venta:"}
                          </h4>
                          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '0.5rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                              <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                                <tr>
                                  <th style={{ padding: '0.6rem 0.85rem', fontWeight: '800', color: '#64748b' }}>Elaboración</th>
                                  <th style={{ padding: '0.6rem 0.85rem', fontWeight: '800', color: '#64748b' }}>Lote</th>
                                  <th style={{ padding: '0.6rem 0.85rem', fontWeight: '800', color: '#64748b', textAlign: 'right' }}>Cantidad</th>
                                  <th style={{ padding: '0.6rem 0.85rem', fontWeight: '800', color: '#64748b', textAlign: 'right' }}>Precio</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(cs.sales || []).map((s) => (
                                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '0.6rem 0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                      {s.elaboration?.recipe?.name || s.elaboration?.name || "Elaboración"}
                                    </td>
                                    <td style={{ padding: '0.6rem 0.85rem', color: 'var(--text-muted)' }}>
                                      {s.elaboration?.name || "-"}
                                    </td>
                                    <td style={{ padding: '0.6rem 0.85rem', textAlign: 'right', fontWeight: '700', color: 'var(--corp-green)' }}>
                                      {s.quantity != null ? `${s.quantity} ${s.elaboration?.quantityUnit || 'ud'}` : `${s.percentage}%`}
                                    </td>
                                    <td style={{ padding: '0.6rem 0.85rem', textAlign: 'right', fontWeight: '800', color: 'var(--text-main)' }}>
                                      {s.price.toFixed(2)} {currencySymbol}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Nueva venta combinada */}
        {activeTab === "new" && (
          <form onSubmit={handleSubmitCombinedSale} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Top Config: Customer, Date, Notes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '0.85rem', border: '1px solid var(--border)' }}>
              <div>
                <label className="label" style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.35rem', display: 'block' }}>
                  {t('combined_sales.customer_label') || "Cliente"}
                </label>
                <select
                  className="input-field"
                  value={formCustomer}
                  onChange={(e) => setFormCustomer(e.target.value)}
                  style={{ margin: 0 }}
                >
                  <option value="">{t('combined_sales.no_customer') || "Venta directa / Sin cliente"}</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.commercialName} {c.nif ? `(${c.nif})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.35rem', display: 'block' }}>
                  {t('combined_sales.date_label') || "Fecha de la venta"}
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                  style={{ margin: 0 }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label className="label" style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.35rem', display: 'block' }}>
                  {t('combined_sales.notes_label') || "Notas / Observaciones"}
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder={t('combined_sales.notes_placeholder') || "Notas opcionales sobre la venta..."}
                  style={{ margin: 0 }}
                />
              </div>
            </div>

            {/* Select Elaboration to Add */}
            <div style={{ padding: '1.25rem', background: '#ffffff', borderRadius: '0.85rem', border: '1px solid var(--border)' }}>
              <label className="label" style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.5rem', display: 'block' }}>
                {t('combined_sales.select_elaboration') || "Seleccionar elaboración con stock"}
              </label>

              {loadingAvailable ? (
                <div style={{ padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <Loader2 className="animate-spin inline" size={16} /> Cargando elaboraciones con stock disponible...
                </div>
              ) : availableElaborations.length === 0 ? (
                <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '0.5rem', color: '#dc2626', fontSize: '0.85rem' }}>
                  {t('combined_sales.no_available_stock') || "No hay elaboraciones con stock disponible en este momento."}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <select
                    className="input-field"
                    value={selectedElabId}
                    onChange={(e) => setSelectedElabId(e.target.value)}
                    style={{ flex: 1, margin: 0 }}
                  >
                    <option value="">{t('combined_sales.select_placeholder') || "-- Selecciona una elaboración con stock --"}</option>
                    {availableElaborations.map(elab => (
                      <option key={elab.id} value={elab.id}>
                        {elab.recipeName} — Lote: {elab.name} (Disp: {elab.availableStock} {elab.quantityUnit})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleAddElaboration}
                    disabled={!selectedElabId}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.25rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Plus size={16} />
                    {t('combined_sales.add_elaboration_btn') || "Añadir a la venta"}
                  </button>
                </div>
              )}
            </div>

            {/* Selected Elaborations Table */}
            <div style={{ padding: '1.25rem', background: '#ffffff', borderRadius: '0.85rem', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.85rem 0' }}>
                {t('combined_sales.selected_elaborations') || "Lotes incluidos en la venta"} ({saleItems.length})
              </h3>

              {saleItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px dashed var(--border)', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  {t('combined_sales.no_elaborations_selected') || "No has añadido ninguna elaboración todavía. Selecciona una arriba para añadirla a la venta."}
                </div>
              ) : (
                <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '0.5rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                      <tr>
                        <th style={{ padding: '0.65rem 0.85rem', fontWeight: '800', color: '#64748b' }}>
                          {t('combined_sales.col_elaboration') || "Elaboración / Lote"}
                        </th>
                        <th style={{ padding: '0.65rem 0.85rem', fontWeight: '800', color: '#64748b', textAlign: 'center' }}>
                          {t('combined_sales.col_available_stock') || "Stock disponible"}
                        </th>
                        <th style={{ padding: '0.65rem 0.85rem', fontWeight: '800', color: '#64748b', width: '160px' }}>
                          {t('combined_sales.col_quantity') || "Cantidad a vender"}
                        </th>
                        <th style={{ padding: '0.65rem 0.85rem', fontWeight: '800', color: '#64748b', width: '160px' }}>
                          {t('combined_sales.col_price') || "Precio (€)"}
                        </th>
                        <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center', width: '50px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {saleItems.map((item, idx) => {
                        const hasError = formErrors[idx];
                        return (
                          <tr key={item.elaborationId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '0.75rem 0.85rem' }}>
                              <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{item.recipeName}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Lote: {item.name}</div>
                            </td>
                            <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>
                              <span style={{ padding: '0.2rem 0.6rem', background: '#f0fdf4', color: 'var(--corp-green)', border: '1px solid #bbf7d0', borderRadius: '1rem', fontWeight: '700', fontSize: '0.78rem' }}>
                                {item.availableStock} {item.unit}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem 0.85rem' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={item.availableStock}
                                    className="input-field"
                                    value={item.quantity}
                                    onChange={(e) => handleUpdateItem(idx, "quantity", e.target.value)}
                                    placeholder={`Máx ${item.availableStock}`}
                                    required
                                    style={{
                                      margin: 0,
                                      padding: '0.4rem 0.6rem',
                                      fontSize: '0.85rem',
                                      borderColor: hasError ? '#ef4444' : undefined
                                    }}
                                  />
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                    {item.unit}
                                  </span>
                                </div>
                                {hasError && (
                                  <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: '600' }}>
                                    {hasError}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: '0.75rem 0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="input-field"
                                  value={item.price}
                                  onChange={(e) => handleUpdateItem(idx, "price", e.target.value)}
                                  placeholder="0.00"
                                  required
                                  style={{
                                    margin: 0,
                                    padding: '0.4rem 0.6rem',
                                    fontSize: '0.85rem'
                                  }}
                                />
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                                  {currencySymbol}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  padding: '0.35rem',
                                  borderRadius: '0.35rem'
                                }}
                                title="Quitar de la lista"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Total and Actions */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '1.25rem', 
              background: '#f8fafc', 
              borderRadius: '0.85rem', 
              border: '1px solid var(--border)',
              marginTop: 'auto'
            }}>
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {t('combined_sales.total_price') || "Total de la venta combinada"}
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--corp-green)', lineHeight: 1.2 }}>
                  {totalPrice.toFixed(2)} {currencySymbol}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setActiveTab("list")}
                  style={{ padding: '0.75rem 1.25rem' }}
                >
                  {t('common.cancel') || "Cancelar"}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!isFormValid || submitting}
                  style={{ padding: '0.75rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {t('combined_sales.saving') || "Guardando..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      {t('combined_sales.submit_btn') || "Registrar venta combinada"}
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}

        {/* Holded contact confirmation modal */}
        {contactConfirm.isOpen && (
          <div className="modal-overlay" style={{ zIndex: 9999 }}>
            <div className="modal-content" style={{ maxWidth: '480px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#f59e0b' }}>
                <AlertCircle size={28} />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  Cliente no encontrado en Holded
                </h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                El cliente <strong>{contactConfirm.customerName}</strong> ({contactConfirm.customerNif}) no existe en tu cuenta de Holded. ¿Deseas darlo de alta automáticamente para emitir la factura?
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setContactConfirm({ isOpen: false, combinedSale: null, customerName: "", customerNif: "" })}
                >
                  {t('common.cancel') || "Cancelar"}
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => handleInvoiceCombined(contactConfirm.combinedSale, true)}
                >
                  Sí, dar de alta y facturar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
