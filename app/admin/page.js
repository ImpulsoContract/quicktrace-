"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Users, UserPlus, Mail, Lock, 
  Building2, Globe, FileText, 
  CheckSquare, Square, ChefHat, 
  Search, ShieldCheck, ChevronRight,
  MoreVertical, Edit, Plus, Trash2,
  X, AlertCircle, Loader2, LogOut,
  Thermometer, Brush, Save, ArrowLeft
} from "lucide-react";
import { signOut } from "next-auth/react";

import Image from "next/image";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("create"); // "create", "list", or "plans"
  const [clients, setClients] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Modals state
  const [editClientModal, setEditClientModal] = useState(null);
  const [addRecipeModal, setAddRecipeModal] = useState(null);
  const [manageRecipesModal, setManageRecipesModal] = useState(null);
  const [manageCleaningZonesModal, setManageCleaningZonesModal] = useState(null);
  const [manageChambersModal, setManageChambersModal] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMasterPass, setShowMasterPass] = useState(false);

  const [formData, setFormData] = useState({
    email: "", password: "", name: "", razonSocial: "", nif: "", phone: "",
    urlClientify: "",
    planId: "",
    personName: "", address: "", postalCode: "", city: "", province: "", country: "España"
  });

  const fetchClients = async () => {
    setListLoading(true);
    try {
      const res = await fetch("/api/admin/clients/list");
      const data = await res.json();
      if (!data.error) setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setListLoading(false);
    }
  };

  const fetchPlans = async () => {
    setPlansLoading(true);
    try {
      const res = await fetch("/api/admin/plans");
      const data = await res.json();
      if (!data.error) setPlans(data);
    } catch (error) {
      console.error("Error loading plans:", error);
    } finally {
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "list") fetchClients();
    if (activeTab === "plans" || activeTab === "create") fetchPlans();
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.error) {
        setMessage({ type: 'error', text: data.error });
      } else {
        setMessage({ type: 'success', text: "Cliente creado correctamente" });
        setFormData({
          email: "", password: "", name: "", razonSocial: "", nif: "", phone: "",
          urlClientify: "",
          planId: "",
          personName: "", address: "", postalCode: "", city: "", province: "", country: "España"
        });
        if (activeTab === "list") fetchClients();
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Error de conexión con el servidor" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clients/update/${editClientModal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editClientModal.form)
      });
      const data = await res.json();
      if (data.success) {
        setEditClientModal(null);
        fetchClients();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Error al actualizar cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (client) => {
    if (!confirm(`¿Confirmar eliminación total de datos para ${client.clientProfile?.razonSocial}? Se borrarán permanentemente sus recetas, elaboraciones, registros y cuenta.`)) return;
    if (!confirm(`ADVERTENCIA FINAL: Esta acción es irreversible y eliminará TODOS los datos acumulados por este cliente. ¿Seguro que desea proceder?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clients/delete/${client.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: "Cliente eliminado correctamente." });
        fetchClients();
      } else {
        alert(data.error || "Error al eliminar cliente");
      }
    } catch (error) {
       alert("Error de conexión al eliminar cliente");
    } finally {
      setLoading(false);
      setActiveMenu(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: 'var(--text-main)' }}>
      <nav style={{
        borderBottom: '1px solid var(--border)', padding: '1rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'white', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '40px', height: '40px' }}>
            <Image src="/images/logo.jpg" alt="Logo" fill style={{ objectFit: 'contain' }} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--corp-green)' }}>QuickTrace</span>
        </div>

        <div className="desktop-only" style={{ display: 'flex', gap: '2rem' }}>
          <button
            onClick={() => setActiveTab("create")}
            style={{
              background: 'none', border: 'none', color: activeTab === 'create' ? 'var(--corp-green)' : 'var(--text-muted)',
              fontWeight: activeTab === 'create' ? '700' : '500', cursor: 'pointer', position: 'relative', padding: '0.5rem 0'
            }}
          >
            Crear Cliente
            {activeTab === 'create' && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--corp-green)' }} />}
          </button>
          <button
            onClick={() => setActiveTab("list")}
            style={{
              background: 'none', border: 'none', color: activeTab === 'list' ? 'var(--corp-green)' : 'var(--text-muted)',
              fontWeight: activeTab === 'list' ? '700' : '500', cursor: 'pointer', position: 'relative', padding: '0.5rem 0'
            }}
          >
            Ver Clientes
            {activeTab === 'list' && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--corp-green)' }} />}
          </button>
          <button
            onClick={() => setActiveTab("plans")}
            style={{
              background: 'none', border: 'none', color: activeTab === 'plans' ? 'var(--corp-green)' : 'var(--text-muted)',
              fontWeight: activeTab === 'plans' ? '700' : '500', cursor: 'pointer', position: 'relative', padding: '0.5rem 0'
            }}
          >
            Planes de Precios
            {activeTab === 'plans' && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--corp-green)' }} />}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="desktop-only" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>Fernando Admin</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrador</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--corp-sand)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>F</div>
          
          <button 
            onClick={() => setShowMasterPass(true)}
            style={{ 
              background: 'rgba(66, 98, 22, 0.1)', border: '1px solid var(--corp-green)', color: 'var(--corp-green)', 
              padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.85rem', fontWeight: '700'
            }}
          >
            <ShieldCheck size={18} /> Contraseña Maestra
          </button>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ 
              background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', 
              padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
            title="Cerrar sesión"
          >
            <LogOut size={18} />
            <span className="desktop-only" style={{ fontSize: '0.85rem', fontWeight: '600' }}>Salir</span>
          </button>
        </div>
      </nav>

      {/* Mobile nav indicator */}
      <div style={{ display: 'none' }} className="mobile-nav">
         {/* Could add a mobile tab switcher here if needed */}
      </div>

      <main style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {activeTab === "create" ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <section className="glass-card" style={{ padding: '2.5rem', background: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                    <UserPlus size={24} color="var(--corp-green)" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Nueva Cuenta de Cliente</h2>
                  </div>

                  {message.text && (
                    <div style={{
                      background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                      border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fee2e2'}`,
                      color: message.type === 'success' ? '#166534' : '#dc2626',
                      padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '500'
                    }}>
                      {message.text}
                    </div>
                  )}

                  <form onSubmit={handleCreateClient} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                      <div style={{ gridColumn: '1 / -1' }}><h3 className="section-title">Datos de Acceso</h3></div>
                      <div><label className="label">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required /></div>
                      <div><label className="label">Contraseña</label><input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" required /></div>
                      <div style={{ gridColumn: '1 / -1' }}><label className="label">Nombre Responsable</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required /></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                      <div style={{ gridColumn: '1 / -1' }}><h3 className="section-title">Datos Fiscales</h3></div>
                      <div><label className="label">Razón Social</label><input type="text" name="razonSocial" value={formData.razonSocial} onChange={handleChange} className="input-field" required /></div>
                      <div><label className="label">NIF / CIF</label><input type="text" name="nif" value={formData.nif} onChange={handleChange} className="input-field" required /></div>
                      <div><label className="label">Teléfono</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" /></div>
                      <div><label className="label">URL Clientify</label><input type="url" name="urlClientify" value={formData.urlClientify} onChange={handleChange} className="input-field" /></div>
                      <div><label className="label">Nombre Persona</label><input type="text" name="personName" value={formData.personName} onChange={handleChange} className="input-field" /></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                      <div style={{ gridColumn: '1 / -1' }}><h3 className="section-title">Dirección y Localización</h3></div>
                      <div style={{ gridColumn: '1 / -1' }}><label className="label">Dirección</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="input-field" /></div>
                      <div><label className="label">Código Postal</label><input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="input-field" /></div>
                      <div><label className="label">Ciudad</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="input-field" /></div>
                      <div><label className="label">Provincia</label><input type="text" name="province" value={formData.province} onChange={handleChange} className="input-field" /></div>
                      <div><label className="label">País</label><input type="text" name="country" value={formData.country} onChange={handleChange} className="input-field" /></div>
                    </div>

                    <div>
                      <h3 className="section-title">Plan de Precios</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div>
                          <label className="label">Seleccionar Plan</label>
                          <select name="planId" value={formData.planId} onChange={handleChange} className="input-field" required>
                            <option value="">Selecciona un plan...</option>
                            {plans.map(plan => (
                              <option key={plan.id} value={plan.id}>{plan.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: '200px' }}>
                        {loading ? "Procesando..." : "Crear Cliente Ahora"}
                      </button>
                    </div>
                  </form>
                </section>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <SummaryCard title="Cuentas Activas" icons={<Users size={20} />} stats={[
                    { label: "Clientes", val: clients.filter(c => c.clientProfile?.accountType === 'cliente').length },
                    { label: "Demos", val: clients.filter(c => c.clientProfile?.accountType === 'demo').length || 0 }
                  ]} />
                  <InstructionsCard />
                </div>
              </div>
            </div>
          ) : activeTab === "list" ? (
            <section className="glass-card" style={{ padding: '2.5rem', background: 'white' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Users size={24} color="var(--corp-green)" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Gestión de Clientes</h2>
                </div>
                <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="text" placeholder="Buscar por nombre o NIF..." className="input-field" style={{ paddingLeft: '2.75rem' }} />
                </div>
              </div>

              {listLoading ? (
                 <div style={{ padding: '5rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={32} color="var(--corp-green)" /></div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cliente / Responsable</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NIF / CIF</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recetas (Uso)</th>
                        <th style={{ padding: '1rem', textAlign: 'right' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client) => (
                        <tr key={client.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                          <td style={{ padding: '1.25rem 1rem' }}>
                            <div style={{ fontWeight: '700', color: '#1e293b' }}>{client.clientProfile?.razonSocial || 'Sin Razón Social'}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{client.email}</div>
                          </td>
                          <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', color: '#475569' }}>{client.clientProfile?.nif}</td>
                          <td style={{ padding: '1.25rem 1rem' }}>
                            <span style={{
                              padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '700',
                              background: '#dcfce7',
                              color: '#15803d',
                              textTransform: 'uppercase'
                            }}>
                              {client.clientProfile?.plan?.name || "SIN PLAN"}
                            </span>
                          </td>
                          <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', fontWeight: '600' }}>
                            {client.clientProfile?._count?.recipes || 0} / {client.clientProfile?.plan?.recipesLimit || "∞"}
                          </td>
                          <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                            <button
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setMenuPosition({ x: rect.left - 180, y: rect.bottom + 10 });
                                setActiveMenu(activeMenu && activeMenu.id === client.id ? null : client);
                              }}
                              style={{ background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem' }}
                            >
                              <MoreVertical size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ) : (
            <PlansTab plans={plans} loading={plansLoading} onRefresh={fetchPlans} />
          )}
        </div>
      </main>

      {/* FIXED CONTEXT MENU */}
      {activeMenu && typeof activeMenu === 'object' && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, zIndex: 9998 }} 
            onClick={() => setActiveMenu(null)} 
          />
          <div 
            style={{
              position: 'fixed', 
              left: `${menuPosition.x}px`, 
              top: `${menuPosition.y}px`,
              background: 'white', border: '1px solid var(--border)',
              borderRadius: '0.75rem', width: '220px', zIndex: 9999, 
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)', overflow: 'hidden',
              animation: 'menuFadeIn 0.15s ease-out'
            }}
          >
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', fontSize: '0.7rem', fontWeight: '800', color: 'var(--corp-green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Acciones: {activeMenu.clientProfile?.razonSocial}
            </div>
            <MenuBtn icon={<Edit size={16} />} text="Editar Cliente" onClick={() => { setEditClientModal({ id: activeMenu.id, form: { ...activeMenu, ...activeMenu.clientProfile } }); setActiveMenu(null); }} />
            <MenuBtn
              icon={<Plus size={16} />}
              text="Añadir Receta"
              disabled={(activeMenu.clientProfile?._count?.recipes || 0) >= (activeMenu.clientProfile?.accountType === 'demo' ? 3 : activeMenu.clientProfile?.recetasContratadas)}
              onClick={() => { setAddRecipeModal(activeMenu.clientProfile); setActiveMenu(null); }}
            />
            <MenuBtn icon={<ChefHat size={16} />} text="Gestionar Recetas" onClick={() => { setManageRecipesModal(activeMenu.clientProfile); setActiveMenu(null); }} />
            <MenuBtn icon={<CheckSquare size={16} />} text="Zonas de limpieza" onClick={() => { setManageCleaningZonesModal(activeMenu.clientProfile); setActiveMenu(null); }} />
            <MenuBtn icon={<Thermometer size={16} />} text="Temperatura de cámaras" onClick={() => { setManageChambersModal(activeMenu.clientProfile); setActiveMenu(null); }} />
            <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.25rem', paddingTop: '0.25rem' }}>
              <MenuBtn 
                icon={<Trash2 size={16} />} 
                text="ELIMINAR CLIENTE" 
                danger 
                onClick={() => handleDeleteClient(activeMenu)} 
              />
            </div>
          </div>
        </>
      )}

      {/* MODALS */}
      {editClientModal && (
        <Modal title="Editar Cliente" onClose={() => setEditClientModal(null)}>
          <form onSubmit={handleUpdateClient} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ gridColumn: '1 / -1' }}><h3 className="section-title">Datos de Acceso</h3></div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="label">Email</label>
                <input type="email" className="input-field" value={editClientModal.form.email} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, email: e.target.value}})} required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="label">Nombre Responsable</label>
                <input type="text" className="input-field" value={editClientModal.form.name} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, name: e.target.value}})} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ gridColumn: '1 / -1' }}><h3 className="section-title">Datos Fiscales</h3></div>
              <div>
                <label className="label">Razón Social</label>
                <input type="text" className="input-field" value={editClientModal.form.razonSocial} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, razonSocial: e.target.value}})} required />
              </div>
              <div>
                <label className="label">NIF / CIF</label>
                <input type="text" className="input-field" value={editClientModal.form.nif} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, nif: e.target.value}})} required />
              </div>
              <div>
                <label className="label">Teléfono</label>
                <input type="tel" className="input-field" value={editClientModal.form.phone || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, phone: e.target.value}})} />
              </div>
              <div>
                <label className="label">URL Clientify</label>
                <input type="url" className="input-field" value={editClientModal.form.urlClientify || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, urlClientify: e.target.value}})} />
              </div>
              <div>
                <label className="label">Nombre Persona</label>
                <input type="text" className="input-field" value={editClientModal.form.personName || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, personName: e.target.value}})} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ gridColumn: '1 / -1' }}><h3 className="section-title">Dirección y Localización</h3></div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="label">Dirección</label>
                <input type="text" className="input-field" value={editClientModal.form.address || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, address: e.target.value}})} />
              </div>
              <div>
                <label className="label">Código Postal</label>
                <input type="text" className="input-field" value={editClientModal.form.postalCode || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, postalCode: e.target.value}})} />
              </div>
              <div>
                <label className="label">Ciudad</label>
                <input type="text" className="input-field" value={editClientModal.form.city || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, city: e.target.value}})} />
              </div>
              <div>
                <label className="label">Provincia</label>
                <input type="text" className="input-field" value={editClientModal.form.province || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, province: e.target.value}})} />
              </div>
              <div>
                <label className="label">País</label>
                <input type="text" className="input-field" value={editClientModal.form.country || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, country: e.target.value}})} />
              </div>
            </div>

            <div>
              <h3 className="section-title">Configuración de Plan</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label className="label">Plan asignado</label>
                  <select 
                    className="input-field" 
                    value={editClientModal.form.planId || ""} 
                    onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, planId: e.target.value}})}
                  >
                    <option value="">Selecciona un plan...</option>
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={() => setEditClientModal(null)} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' }}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: '200px' }}>{loading ? "Guardando..." : "Guardar Cambios"}</button>
            </div>
          </form>
        </Modal>
      )}

      {addRecipeModal && <AddRecipeModal profile={addRecipeModal} onRefresh={fetchClients} onClose={() => setAddRecipeModal(null)} />}
      {manageRecipesModal && <ManageRecipesModal profile={manageRecipesModal} onRefresh={fetchClients} onClose={() => setManageRecipesModal(null)} />}
      {manageCleaningZonesModal && (
        <ManageCleaningZonesModal 
          profile={manageCleaningZonesModal} 
          onClose={() => setManageCleaningZonesModal(null)} 
        />
      )}

      {manageChambersModal && (
        <ManageChambersModal 
          profile={manageChambersModal} 
          onClose={() => setManageChambersModal(null)} 
        />
      )}

      {showMasterPass && (
        <Modal title="Llave Maestra del Sistema" onClose={() => setShowMasterPass(false)}>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(66, 98, 22, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <ShieldCheck size={32} color="var(--corp-green)" />
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Esta contraseña permite el acceso total a cualquier cuenta de correo del sistema. Úsala con extrema precaución.
            </p>
            <div style={{ 
              background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '2px dashed var(--corp-green)',
              fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '0.1em',
              userSelect: 'all'
            }}>
              Vicente@Fernando.123
            </div>
            <button 
              onClick={() => setShowMasterPass(false)}
              className="btn-primary"
              style={{ marginTop: '2rem', width: '100%' }}
            >
              ENTENDIDO
            </button>
          </div>
        </Modal>
      )}

      <style jsx global>{`
        :root {
          --foreground-rgb: 15, 23, 42;
          --primary: var(--corp-green);
          --primary-hover: var(--corp-green-light);
          --bg-card: #ffffff;
          --border: #e2e8f0;
          --text-main: #0f172a;
          --text-muted: #64748b;
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .section-title { font-size: 0.9rem; color: var(--corp-green); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
        .label { display: block; margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }
        .input-field { 
          width: 100%; 
          background: #ffffff; 
          border: 1px solid var(--border); 
          border-radius: 0.5rem; 
          padding: 0.75rem; 
          color: var(--text-main); 
          box-sizing: border-box; 
          transition: all 0.2s;
        }
        .input-field:focus { outline: none; border-color: var(--corp-green); box-shadow: 0 0 0 2px rgba(66, 98, 22, 0.1); }
        
        @keyframes menuFadeIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// Helper Components
function Checkbox({ label, name, checked, onChange, heavy = false }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: heavy ? '0' : '0.85rem', background: heavy ? 'none' : '#f8fafc', borderRadius: '0.5rem', border: heavy ? 'none' : '1px solid #e2e8f0' }}>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} style={{ width: '18px', height: '18px', accentColor: 'var(--corp-green)' }} />
      <span style={{ fontSize: '0.9rem', fontWeight: heavy ? '700' : '500', color: 'var(--text-main)' }}>{label}</span>
    </label>
  );
}

function SummaryCard({ title, icons, stats }) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', background: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--corp-green)' }}>
        {icons} <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>{title}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{s.label}</span>
            <span style={{ fontWeight: '800', color: 'var(--text-main)' }}>{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InstructionsCard() {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(66, 98, 22, 0.05), white)', borderLeft: '4px solid var(--corp-green)' }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--corp-green)' }}>Instrucciones Pro</h3>
      <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <li>• La contraseña debe ser segura pero fácil de recordar para el cliente.</li>
        <li>• El NIF se utilizará para la facturación automática.</li>
        <li>• Los planes definen los límites y módulos activos.</li>
      </ul>
    </div>
  );
}

function PlansTab({ plans, loading, onRefresh }) {
  const [showPlanModal, setShowPlanModal] = useState(null); // { mode: 'create' | 'edit', plan?: any }

  const handleDeletePlan = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este plan? Solo podrás hacerlo si no hay clientes usándolo.")) return;
    try {
      const res = await fetch(`/api/admin/plans/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.error);
      }
    } catch (e) { alert("Error al eliminar plan"); }
  };

  return (
    <section className="glass-card" style={{ padding: '2.5rem', background: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FileText size={24} color="var(--corp-green)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Planes de Precios</h2>
        </div>
        <button 
          onClick={() => setShowPlanModal({ mode: 'create' })}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Nuevo Plan
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}><Loader2 className="animate-spin" size={32} color="var(--corp-green)" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {plans.map(plan => (
            <div key={plan.id} className="glass-card" style={{ padding: '1.5rem', background: '#f8fafc', border: '1px solid var(--border)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>{plan.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setShowPlanModal({ mode: 'edit', plan })} style={{ padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #e2e8f0', background: 'white', color: 'var(--corp-green)', cursor: 'pointer' }}><Edit size={14}/></button>
                  {plan.name !== 'DEMO' && (
                    <button onClick={() => handleDeletePlan(plan.id)} style={{ padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14}/></button>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--corp-green)' }}>{plan.priceYearly}€</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>/ año</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Recetas:</span>
                  <span style={{ fontWeight: '700' }}>{plan.recipesLimit || "Ilimitadas"}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Elaboraciones:</span>
                  <span style={{ fontWeight: '700' }}>{plan.elaborationsLimit || "Ilimitadas"}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: plan.hasCleaning ? 1 : 0.5 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Limpieza:</span>
                  <span style={{ fontWeight: '700' }}>{plan.hasCleaning ? (plan.cleaningLimit || "Ilimitado") : "No disponible"}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: plan.hasGoods ? 1 : 0.5 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Mercancías:</span>
                  <span style={{ fontWeight: '700' }}>{plan.hasGoods ? (plan.goodsLimit || "Ilimitado") : "No disponible"}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: plan.hasTemperatures ? 1 : 0.5 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Temperaturas:</span>
                  <span style={{ fontWeight: '700' }}>{plan.hasTemperatures ? (plan.temperaturesLimit || "Ilimitado") : "No disponible"}</span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed #e2e8f0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {plan._count?.clients || 0} clientes activos
              </div>
            </div>
          ))}
        </div>
      )}

      {showPlanModal && (
        <PlanModal 
          mode={showPlanModal.mode} 
          plan={showPlanModal.plan} 
          onClose={() => setShowPlanModal(null)} 
          onRefresh={onRefresh} 
        />
      )}
    </section>
  );
}

function PlanModal({ mode, plan, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    priceYearly: plan?.priceYearly || 0,
    stripePriceId: plan?.stripePriceId || "",
    recipesLimit: plan?.recipesLimit === null ? "" : (plan?.recipesLimit || ""),
    elaborationsLimit: plan?.elaborationsLimit === null ? "" : (plan?.elaborationsLimit || ""),
    hasCleaning: plan?.hasCleaning || false,
    cleaningLimit: plan?.cleaningLimit === null ? "" : (plan?.cleaningLimit || ""),
    hasGoods: plan?.hasGoods || false,
    goodsLimit: plan?.goodsLimit === null ? "" : (plan?.goodsLimit || ""),
    hasTemperatures: plan?.hasTemperatures || false,
    temperaturesLimit: plan?.temperaturesLimit === null ? "" : (plan?.temperaturesLimit || "")
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = mode === 'create' ? '/api/admin/plans' : `/api/admin/plans/${plan.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!data.error) {
        onRefresh();
        onClose();
      } else {
        alert(data.error);
      }
    } catch (e) { alert("Error al guardar plan"); }
    finally { setLoading(false); }
  };

  return (
    <Modal title={mode === 'create' ? "Nuevo Plan de Precios" : `Editar Plan: ${plan.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <div>
            <label className="label">Nombre del Plan</label>
            <input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="Ej: Premium, Básico..." />
          </div>
          <div>
            <label className="label">Precio Anual (€)</label>
            <input type="number" step="0.01" className="input-field" value={formData.priceYearly} onChange={(e) => setFormData({...formData, priceYearly: e.target.value})} required />
          </div>
        </div>

        <div>
          <label className="label">Stripe Price ID (price_...)</label>
          <input type="text" className="input-field" value={formData.stripePriceId} onChange={(e) => setFormData({...formData, stripePriceId: e.target.value})} placeholder="Ej: price_1P..." />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Indispensable para habilitar la suscripción automática.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="label">Límite Recetas (vacío = ∞)</label>
            <input type="number" className="input-field" value={formData.recipesLimit} onChange={(e) => setFormData({...formData, recipesLimit: e.target.value})} />
          </div>
          <div>
            <label className="label">Límite Elaboraciones (vacío = ∞)</label>
            <input type="number" className="input-field" value={formData.elaborationsLimit} onChange={(e) => setFormData({...formData, elaborationsLimit: e.target.value})} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)' }}>MÓDULOS DE HIGIENE</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <Checkbox label="Registros de Limpieza" checked={formData.hasCleaning} onChange={(e) => setFormData({...formData, hasCleaning: e.target.checked})} heavy />
            {formData.hasCleaning && (
              <input type="number" className="input-field" value={formData.cleaningLimit} onChange={(e) => setFormData({...formData, cleaningLimit: e.target.value})} placeholder="Límite registros..." />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <Checkbox label="Entradas de Mercancías" checked={formData.hasGoods} onChange={(e) => setFormData({...formData, hasGoods: e.target.checked})} heavy />
            {formData.hasGoods && (
              <input type="number" className="input-field" value={formData.goodsLimit} onChange={(e) => setFormData({...formData, goodsLimit: e.target.value})} placeholder="Límite registros..." />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <Checkbox label="Control de Temperatura" checked={formData.hasTemperatures} onChange={(e) => setFormData({...formData, hasTemperatures: e.target.checked})} heavy />
            {formData.hasTemperatures && (
              <input type="number" className="input-field" value={formData.temperaturesLimit} onChange={(e) => setFormData({...formData, temperaturesLimit: e.target.value})} placeholder="Límite registros..." />
            )}
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Plan"}
        </button>
      </form>
    </Modal>
  );
}

function MenuBtn({ icon, text, onClick, danger = false, disabled = false }) {
  return (
    <button 
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{ 
        width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
        background: 'none', border: 'none', 
        color: disabled ? 'var(--text-muted)' : (danger ? '#ef4444' : 'var(--text-main)'), 
        fontSize: '0.85rem', cursor: disabled ? 'not-allowed' : 'pointer', textAlign: 'left', transition: 'background 0.2s',
        opacity: disabled ? 0.4 : 1
      }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = '#f8fafc')}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.background = 'none')}
    >
      {icon} {text}
    </button>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
      <div className="glass-card" style={{ background: '#ffffff', width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18}/></button>
        </div>
        <div style={{ padding: '2rem', maxHeight: '80vh', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Complex Recipe Modals
function AddRecipeModal({ profile, onClose, onRefresh, recipeToEdit = null }) {
  const [loading, setLoading] = useState(false);
  const [recipeForm, setRecipeForm] = useState({
    name: recipeToEdit?.name || "", 
    ingredients: recipeToEdit?.ingredients.map(i => ({
      id: i.id, // Keep ID for updates if necessary, or just treat as new for simplicity
      name: i.name,
      amount: i.amount,
      unit: i.unit,
      loteMandatory: i.loteMandatory || false,
      quantityMandatory: i.quantityMandatory || false
    })) || [{ name: "", amount: "", unit: "", loteMandatory: false, quantityMandatory: false }]
  });

  const handleAddIngredient = () => {
    setRecipeForm({
      ...recipeForm,
      ingredients: [...recipeForm.ingredients, { name: "", amount: "", unit: "", loteMandatory: false, quantityMandatory: false }]
    });
  };

  const handleRemoveIngredient = (index) => {
    if (recipeForm.ingredients.length === 1) return;
    const newIngs = [...recipeForm.ingredients];
    newIngs.splice(index, 1);
    setRecipeForm({ ...recipeForm, ingredients: newIngs });
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngs = [...recipeForm.ingredients];
    newIngs[index] = { ...newIngs[index], [field]: value };
    setRecipeForm({ ...recipeForm, ingredients: newIngs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (recipeForm.ingredients.some(ing => !ing.name.trim())) {
      alert("Todos los ingredientes deben tener nombre.");
      return;
    }

    setLoading(true);
    const url = recipeToEdit 
      ? `/api/admin/recipes/update/${recipeToEdit.id}` 
      : "/api/admin/recipes";
    const method = recipeToEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...recipeForm, clientProfileId: profile.id })
      });
      const data = await res.json();
      if (data.success) {
        if (onRefresh) onRefresh();
        onClose();
      } else {
        alert(data.error);
      }
    } catch (error) {
       alert("Error al guardar receta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={recipeToEdit ? `Editar Receta: ${recipeToEdit.name}` : `Añadir Receta a ${profile.razonSocial}`} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label className="label">Nombre de la Receta</label>
          <input type="text" className="input-field" value={recipeForm.name} onChange={(e) => setRecipeForm({...recipeForm, name: e.target.value})} placeholder="Pavo con arroz..." required />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="label" style={{ margin: 0 }}>Ingredientes</label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recipeForm.ingredients.map((ing, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)' }}>NOMBRE</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={ing.name} 
                        onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                        placeholder="Ej. Pollo"
                        required
                        style={{ margin: 0, padding: '0.5rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)' }}>CANT. DEFECTO</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={ing.amount} 
                        onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                        placeholder="100"
                        style={{ margin: 0, padding: '0.5rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)' }}>UNIDAD</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={ing.unit} 
                        onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
                        placeholder="gr"
                        style={{ margin: 0, padding: '0.5rem' }}
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveIngredient(idx)}
                      style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', height: '38px' }}
                      disabled={recipeForm.ingredients.length === 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={ing.loteMandatory} 
                        onChange={(e) => handleIngredientChange(idx, 'loteMandatory', e.target.checked)} 
                        style={{ width: '16px', height: '16px', accentColor: 'var(--corp-green)' }}
                      />
                      <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Lote obligatorio</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={ing.quantityMandatory} 
                        onChange={(e) => handleIngredientChange(idx, 'quantityMandatory', e.target.checked)} 
                        style={{ width: '16px', height: '16px', accentColor: 'var(--corp-green)' }}
                      />
                      <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Cantidad obligatoria</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button" 
              onClick={handleAddIngredient}
              className="btn-secondary"
              style={{ alignSelf: 'center', padding: '0.5rem 1.25rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}
            >
              <Plus size={14} /> AÑADIR OTRO
            </button>
          </div>
        </div>

        <div style={{ 
          padding: '0.75rem', 
          background: (profile._count.recipes >= (profile.accountType === 'demo' ? 3 : profile.recetasContratadas)) && !recipeToEdit ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.05)', 
          borderRadius: '0.5rem', fontSize: '0.8rem', color: (profile._count.recipes >= (profile.accountType === 'demo' ? 3 : profile.recetasContratadas)) && !recipeToEdit ? '#ef4444' : 'var(--text-muted)' 
        }}>
          {recipeToEdit ? "Editando receta existente." : `Uso de quota: ${profile._count.recipes} / ${profile.accountType === 'demo' ? 3 : profile.recetasContratadas} recetas.`}
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading || ((profile._count.recipes >= (profile.accountType === 'demo' ? 3 : profile.recetasContratadas)) && !recipeToEdit)}
        >
          {loading ? "Guardando..." : recipeToEdit ? "Actualizar Receta" : "Crear Receta"}
        </button>
      </form>
    </Modal>
  );
}

function ManageRecipesModal({ profile, onClose, onRefresh }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRecipe, setEditRecipe] = useState(null);

  const fetchRecipes = async () => {
    try {
      const res = await fetch(`/api/admin/recipes?clientId=${profile.id}`);
      const data = await res.json();
      setRecipes(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRecipes(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres borrar esta receta?")) return;
    try {
      await fetch(`/api/admin/recipes/delete/${id}`, { method: 'DELETE' });
      if (onRefresh) onRefresh();
      fetchRecipes();
    } catch (e) { alert("Error al borrar"); }
  };

  if (editRecipe) {
    return (
      <AddRecipeModal 
        profile={profile} 
        recipeToEdit={editRecipe} 
        onClose={() => { setEditRecipe(null); fetchRecipes(); }} 
      />
    );
  }

  return (
    <Modal title={`Recetas de ${profile.razonSocial}`} onClose={onClose}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="animate-spin" /></div>
      ) : recipes.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay recetas creadas.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recipes.map(recipe => (
            <div key={recipe.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontWeight: '800', color: 'var(--text-main)' }}>{recipe.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{recipe.ingredients.length} Ingredientes detectados</div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                   onClick={() => setEditRecipe(recipe)}
                   style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--corp-green)', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                >
                   <Edit size={16} />
                </button>
                <button 
                   onClick={() => handleDelete(recipe.id)}
                   style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                >
                   <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

function ManageCleaningZonesModal({ profile, onClose }) {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [zones, setZones] = useState([]);
  const [newZoneName, setNewZoneName] = useState("");
  const [editingZone, setEditingZone] = useState(null); // { id, name }

  const fetchZones = async () => {
    try {
      const res = await fetch(`/api/admin/cleaning-zones?clientId=${profile.id}`);
      const data = await res.json();
      if (!data.error) setZones(data);
    } catch (error) {
      console.error("Error fetching zones:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, [profile.id]);

  const handleAddZone = async (e) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cleaning-zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: profile.id, name: newZoneName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setNewZoneName("");
        fetchZones();
      } else {
        alert(data.error || "Error al añadir zona");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateZone = async (e) => {
    e.preventDefault();
    if (!editingZone || !editingZone.name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cleaning-zones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingZone.id, name: editingZone.name.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setEditingZone(null);
        fetchZones();
      } else {
        alert(data.error || "Error al actualizar zona");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZone = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar esta zona de limpieza?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cleaning-zones?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchZones();
      } else {
        alert(data.error || "Error al eliminar zona");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Gestionar Zonas de Limpieza: ${profile.razonSocial}`} onClose={onClose}>
      {initialLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="animate-spin" color="var(--corp-green)" size={32} /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Formulario Añadir */}
          <form onSubmit={handleAddZone} style={{ display: 'flex', gap: '0.75rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Nueva zona (ej. Planta 1, Baños...)" 
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              disabled={loading}
              style={{ margin: 0 }}
            />
            <button type="submit" className="btn-primary" disabled={loading || !newZoneName.trim()} style={{ whiteSpace: 'nowrap', padding: '0 1.5rem' }}>
              AÑADIR ZONA
            </button>
          </form>

          {/* Listado de Zonas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zonas Actuales ({zones.length})</h4>
            {zones.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '0.75rem', border: '1px dashed var(--border)' }}>No hay zonas configuradas.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {zones.map(zone => (
                  <div key={zone.id} className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: '1px solid var(--border)' }}>
                    {editingZone?.id === zone.id ? (
                      <form onSubmit={handleUpdateZone} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={editingZone.name}
                          onChange={(e) => setEditingZone({ ...editingZone, name: e.target.value })}
                          autoFocus
                          style={{ margin: 0, padding: '0.5rem' }}
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '0 1rem' }}><Save size={16} /></button>
                        <button type="button" className="btn-secondary" onClick={() => setEditingZone(null)} style={{ padding: '0 1rem' }}><ArrowLeft size={16} /></button>
                      </form>
                    ) : (
                      <>
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{zone.name}</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => setEditingZone({ id: zone.id, name: zone.name })}
                            disabled={loading}
                            style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--corp-green)', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteZone(zone.id)}
                            disabled={loading}
                            style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
function ManageChambersModal({ profile, onClose }) {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [chambers, setChambers] = useState([]);
  const [newChamberName, setNewChamberName] = useState("");
  const [editingChamber, setEditingChamber] = useState(null);

  const fetchChambers = async () => {
    try {
      const res = await fetch(`/api/admin/chambers?clientId=${profile.id}`);
      const data = await res.json();
      if (!data.error) setChambers(data);
    } catch (error) {
      console.error("Error fetching chambers:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchChambers();
  }, [profile.id]);

  const handleAddChamber = async (e) => {
    e.preventDefault();
    if (!newChamberName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/chambers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: profile.id, name: newChamberName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setNewChamberName("");
        fetchChambers();
      } else {
        alert(data.error || "Error al añadir cámara");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateChamber = async (e) => {
    e.preventDefault();
    if (!editingChamber || !editingChamber.name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/chambers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingChamber.id, name: editingChamber.name.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setEditingChamber(null);
        fetchChambers();
      } else {
        alert(data.error || "Error al actualizar cámara");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChamber = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar esta cámara?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/chambers?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchChambers();
      } else {
        alert(data.error || "Error al eliminar cámara");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Gestionar Cámaras: ${profile.razonSocial}`} onClose={onClose}>
      {initialLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="animate-spin" color="var(--corp-green)" size={32} /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <form onSubmit={handleAddChamber} style={{ display: 'flex', gap: '0.75rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Nueva cámara (ej. Cámara Frío 1, Congelador...)" 
              value={newChamberName}
              onChange={(e) => setNewChamberName(e.target.value)}
              disabled={loading}
              style={{ margin: 0 }}
            />
            <button type="submit" className="btn-primary" disabled={loading || !newChamberName.trim()} style={{ whiteSpace: 'nowrap', padding: '0 1.5rem' }}>
              AÑADIR CÁMARA
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cámaras Actuales ({chambers.length})</h4>
            {chambers.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '0.75rem', border: '1px dashed var(--border)' }}>No hay cámaras configuradas.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {chambers.map(chamber => (
                  <div key={chamber.id} className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: '1px solid var(--border)' }}>
                    {editingChamber?.id === chamber.id ? (
                      <form onSubmit={handleUpdateChamber} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={editingChamber.name}
                          onChange={(e) => setEditingChamber({ ...editingChamber, name: e.target.value })}
                          autoFocus
                          style={{ margin: 0, padding: '0.5rem' }}
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '0 1rem' }}><Save size={16} /></button>
                        <button type="button" className="btn-secondary" onClick={() => setEditingChamber(null)} style={{ padding: '0 1rem' }}><ArrowLeft size={16} /></button>
                      </form>
                    ) : (
                      <>
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{chamber.name}</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => setEditingChamber({ id: chamber.id, name: chamber.name })}
                            disabled={loading}
                            style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--corp-green)', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteChamber(chamber.id)}
                            disabled={loading}
                            style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
