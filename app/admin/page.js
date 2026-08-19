"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { 
  Users, UserPlus, Mail, Lock, 
  Building2, Globe, FileText, 
  CheckSquare, Square, ChefHat, 
  Search, ShieldCheck, ChevronRight,
  MoreVertical, Edit, Plus, Trash2,
  X, AlertCircle, Loader2, LogOut,
  Thermometer, Brush, Save, ArrowLeft, RefreshCw, Tag, Filter, ChevronUp, ChevronDown, Menu
} from "lucide-react";
import { signIn, signOut } from "next-auth/react";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function AdminDashboard() {
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState("create"); // "create", "list", or "plans"
  const [clients, setClients] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Modals state
  const [editClientModal, setEditClientModal] = useState(null);
  const [changePasswordModal, setChangePasswordModal] = useState(null);
  const [addRecipeModal, setAddRecipeModal] = useState(null);
  const [manageRecipesModal, setManageRecipesModal] = useState(null);
  const [manageCleaningZonesModal, setManageCleaningZonesModal] = useState(null);
  const [manageChambersModal, setManageChambersModal] = useState(null);
  const [termsModal, setTermsModal] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [sortConfig, setSortConfig] = useState({ key: 'created', direction: 'desc' });
  const [planFilter, setPlanFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');

  const [affiliates, setAffiliates] = useState([]);
  const [affiliatesLoading, setAffiliatesLoading] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [affiliateDetails, setAffiliateDetails] = useState(null);
  const [affiliateDetailsLoading, setAffiliateDetailsLoading] = useState(false);
  const [settleAffiliate, setSettleAffiliate] = useState(null); // { id, email, pending }

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const processedClients = useMemo(() => {
    let result = [...clients];
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.email.toLowerCase().includes(lowerSearch) || 
        (c.clientProfile?.razonSocial || '').toLowerCase().includes(lowerSearch) ||
        (c.clientProfile?.nif || '').toLowerCase().includes(lowerSearch)
      );
    }
    
    if (planFilter) {
      result = result.filter(c => c.clientProfile?.plan?.name === planFilter || (planFilter === 'SIN PLAN' && !c.clientProfile?.plan));
    }
    
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue, bValue;
        switch(sortConfig.key) {
          case 'name':
            aValue = a.clientProfile?.razonSocial || a.email;
            bValue = b.clientProfile?.razonSocial || b.email;
            break;
          case 'plan':
            aValue = a.clientProfile?.plan?.name || '';
            bValue = b.clientProfile?.plan?.name || '';
            break;
          case 'recipes':
            aValue = a.clientProfile?._count?.recipes || 0;
            bValue = b.clientProfile?._count?.recipes || 0;
            break;
          case 'renewal':
            aValue = new Date(a.clientProfile?.stripeCurrentPeriodEnd || 0).getTime();
            bValue = new Date(b.clientProfile?.stripeCurrentPeriodEnd || 0).getTime();
            break;
          case 'created':
            aValue = new Date(a.createdAt || 0).getTime();
            bValue = new Date(b.createdAt || 0).getTime();
            break;
          case 'login':
            aValue = new Date(a.lastLogin || 0).getTime();
            bValue = new Date(b.lastLogin || 0).getTime();
            break;
          default:
            aValue = ''; bValue = '';
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [clients, sortConfig, planFilter, searchTerm]);

  const totalPages = Math.ceil(processedClients.length / itemsPerPage);
  const currentClients = processedClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => setCurrentPage(1), [planFilter, searchTerm, itemsPerPage]);

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
      if (data.error) {
        alert("Error al cargar clientes: " + data.error);
      } else {
        setClients(data);
      }
    } catch (error) {
      console.error("Error loading clients:", error);
      alert("Error de red al cargar clientes");
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

  const fetchAffiliates = async () => {
    setAffiliatesLoading(true);
    try {
      const res = await fetch("/api/admin/affiliates");
      const data = await res.json();
      if (!data.error) setAffiliates(data);
    } catch (error) {
      console.error("Error loading affiliates:", error);
    } finally {
      setAffiliatesLoading(false);
    }
  };

  const fetchAffiliateDetails = async (id) => {
    setAffiliateDetailsLoading(true);
    try {
      const res = await fetch(`/api/admin/affiliates/${id}`);
      const data = await res.json();
      if (!data.error) setAffiliateDetails(data);
      else alert(data.error);
    } catch (error) {
      console.error("Error loading affiliate details:", error);
      alert("Error al cargar detalles del afiliado");
    } finally {
      setAffiliateDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "list") fetchClients();
    if (activeTab === "plans" || activeTab === "create") fetchPlans();
    if (activeTab === "affiliates") fetchAffiliates();
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
        setMessage({ type: 'success', text: t('admin.create.success') });
        setFormData({
          email: "", password: "", name: "", razonSocial: "", nif: "", phone: "",
          urlClientify: "",
          planId: "",
          personName: "", address: "", postalCode: "", city: "", province: "", country: "España"
        });
        if (activeTab === "list") fetchClients();
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('auth.error_generic') });
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
  
  const handleResyncStripe = async (clientId) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients/resync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Sincronización: Plan ${data.data.planName}, Renovación: ${data.data.renewalDate}` });
        fetchClients();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Error al sincronizar con Stripe");
    } finally {
      setLoading(false);
      setActiveMenu(null);
    }
  };

  const handleSyncClientify = async (clientId) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients/sync-clientify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Error al sincronizar con Clientify");
    } finally {
      setLoading(false);
      setActiveMenu(null);
    }
  };

  const handleSendPasswordReset = async (email) => {
    if (!confirm(`¿Seguro que deseas enviar el email de recuperación de contraseña a ${email}?`)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Email de recuperación enviado con éxito a ${email}`);
      } else {
        alert(data.error || "Error al enviar el email de recuperación");
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
      setActiveMenu(null);
    }
  };

  const handleImpersonate = async (targetUserId) => {
    if (!confirm("¿Seguro que quieres entrar como este cliente? Se cerrará tu sesión de administrador.")) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId })
      });
      const data = await res.json();
      
      if (data.success) {
        // Realizar el login con el token de suplantación
        const result = await signIn("credentials", {
          redirect: false,
          impersonationToken: data.impersonationToken
        });
        
        if (result.ok) {
          window.location.href = "/dashboard";
        } else {
          alert("Error al iniciar sesión como cliente");
        }
      } else {
        alert(data.error || "Error al obtener token de suplantación");
      }
    } catch (error) {
      console.error("Error en impersonate:", error);
      alert("Error de conexión");
    } finally {
      setLoading(false);
      setActiveMenu(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Mobile Top Header */}
      <div className="mobile-header" style={{ padding: '1rem 1.5rem', background: 'white', borderBottom: '1px solid var(--border)', display: 'none', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '28px', height: '28px' }}>
            <Image src="/images/logo.jpg" alt="Logo" fill style={{ objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--corp-green)', margin: 0 }}>
            {t('admin.header.title')}
          </h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ background: 'transparent', border: 'none', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-main)' }}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div style={{ display: 'flex', minHeight: '100vh', overflowX: 'hidden' }} className="flex-responsive">
        <aside style={{ 
          width: isSidebarOpen ? '280px' : '0px',
          opacity: isSidebarOpen ? 1 : 0,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
          borderRight: isSidebarOpen ? '1px solid var(--border)' : 'none', 
          background: 'white', 
          display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh',
          overflow: 'hidden', whiteSpace: 'nowrap'
        }} className={`sidebar-responsive ${isSidebarOpen ? 'open' : ''}`}>
          <div className="desktop-logo" style={{ padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative', width: '32px', height: '32px' }}>
              <Image src="/images/logo.jpg" alt="Logo" fill style={{ objectFit: 'contain' }} />
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--corp-green)' }}>
              {t('admin.sidebar.title') || "QT Admin"}
            </h1>
          </div>

          <nav style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
            <SidebarBtn 
              icon={<UserPlus size={20} />} label={t('admin.sidebar.create_client')} 
              active={activeTab === 'create'} onClick={() => { setActiveTab('create'); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
            />
            <SidebarBtn 
              icon={<Users size={20} />} label={t('admin.sidebar.view_clients')} 
              active={activeTab === 'list'} onClick={() => { setActiveTab('list'); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
            />
            <SidebarBtn 
              icon={<FileText size={20} />} label={t('admin.sidebar.pricing_plans')} 
              active={activeTab === 'plans'} onClick={() => { setActiveTab('plans'); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
            />
            <SidebarBtn 
              icon={<CheckSquare size={20} />} label={t('admin.sidebar.terms_change')} 
              active={activeTab === 'terms'} onClick={() => { setActiveTab('terms'); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
            />
            <SidebarBtn 
              icon={<Tag size={20} />} label={t('admin.sidebar.coupons')} 
              active={activeTab === 'coupons'} onClick={() => { setActiveTab('coupons'); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
            />
            <SidebarBtn 
              icon={<Globe size={20} />} label={t('admin.sidebar.affiliates')} 
              active={activeTab === 'affiliates'} onClick={() => { setActiveTab('affiliates'); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
            />
          </nav>

          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--corp-sand)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>F</div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{t('admin.sidebar.admin_name') || "Fernando Admin"}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('admin.sidebar.admin_role') || "Administrador"}</div>
              </div>
            </div>
            
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              style={{ width: '100%', background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '700' }}
            >
              <LogOut size={16} /> {t('admin.sidebar.logout')}
            </button>
          </div>
        </aside>

        <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', minWidth: 0, transition: 'padding 0.3s ease' }}>
          
          <div className="desktop-only" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ background: 'white', border: '1px solid var(--border)', padding: '0.6rem', borderRadius: '0.5rem', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              <Menu size={20} />
            </button>
            {!isSidebarOpen && <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>{t('admin.header.subtitle')}</h2>}
          </div>

          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {activeTab === "create" ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <section className="glass-card" style={{ padding: '2.5rem', background: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                    <UserPlus size={24} color="var(--corp-green)" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{t('admin.create.title')}</h2>
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
                      <div style={{ gridColumn: '1 / -1' }}><h3 className="section-title">{t('admin.create.access_data')}</h3></div>
                      <div><label className="label">{t('auth.email')}</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required /></div>
                      <div><label className="label">{t('auth.password')}</label><input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" required /></div>
                      <div style={{ gridColumn: '1 / -1' }}><label className="label">{t('profile.person_name')}</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required /></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                      <div style={{ gridColumn: '1 / -1' }}><h3 className="section-title">{t('admin.create.fiscal_data')}</h3></div>
                      <div><label className="label">{t('profile.business_name')}</label><input type="text" name="razonSocial" value={formData.razonSocial} onChange={handleChange} className="input-field" required /></div>
                      <div><label className="label">{t('profile.vat_nif')}</label><input type="text" name="nif" value={formData.nif} onChange={handleChange} className="input-field" required /></div>
                      <div><label className="label">{t('profile.phone')}</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" /></div>
                      <div><label className="label">URL Clientify</label><input type="url" name="urlClientify" value={formData.urlClientify} onChange={handleChange} className="input-field" /></div>
                      <div><label className="label">{t('admin.create.person_name') || t('profile.person_name')}</label><input type="text" name="personName" value={formData.personName} onChange={handleChange} className="input-field" /></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                      <div style={{ gridColumn: '1 / -1' }}><h3 className="section-title">{t('admin.create.address_data')}</h3></div>
                      <div style={{ gridColumn: '1 / -1' }}><label className="label">{t('profile.address')}</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="input-field" /></div>
                      <div><label className="label">{t('profile.postal_code')}</label><input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="input-field" /></div>
                      <div><label className="label">{t('profile.city')}</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="input-field" /></div>
                      <div><label className="label">{t('profile.province')}</label><input type="text" name="province" value={formData.province} onChange={handleChange} className="input-field" /></div>
                      <div><label className="label">{t('profile.country')}</label><input type="text" name="country" value={formData.country} onChange={handleChange} className="input-field" /></div>
                    </div>

                    <div>
                      <h3 className="section-title">{t('admin.create.pricing_plan')}</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div>
                          <label className="label">{t('admin.create.select_plan')}</label>
                          <select name="planId" value={formData.planId} onChange={handleChange} className="input-field" required>
                            <option value="">{t('admin.create.select_plan_placeholder') || "Selecciona un plan..."}</option>
                            {plans.map(plan => (
                              <option key={plan.id} value={plan.id}>{plan.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: '200px' }}>
                        {loading ? t('common.loading') : t('admin.create.submit')}
                      </button>
                    </div>
                  </form>
                </section>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <SummaryCard title={t('admin.create.active_accounts')} icons={<Users size={20} />} stats={[
                    { label: t('admin.create.clients'), val: clients.filter(c => c.clientProfile?.accountType === 'cliente').length },
                    { label: t('admin.create.demos'), val: clients.filter(c => c.clientProfile?.accountType === 'demo').length || 0 }
                  ]} />
                  <InstructionsCard />
                </div>
              </div>
            </div>
          ) : activeTab === "list" ? (
            <section className="glass-card" style={{ padding: '2.5rem', background: 'white' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Users size={24} color="var(--corp-green)" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{t('admin.list.title')}</h2>
                  </div>
                  <button 
                    onClick={fetchClients}
                    disabled={listLoading}
                    style={{ 
                      padding: '0.4rem 0.8rem', background: 'white', border: '1px solid var(--border)', 
                      borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', 
                      gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)',
                      opacity: listLoading ? 0.7 : 1
                    }}
                  >
                    <RefreshCw size={16} style={{ animation: listLoading ? 'spin 1s linear infinite' : 'none' }} />
                    {t('admin.list.refresh')}
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={16} color="var(--text-muted)" />
                    <select 
                      className="input-field" 
                      style={{ padding: '0.5rem', minWidth: '150px' }}
                      value={planFilter}
                      onChange={(e) => setPlanFilter(e.target.value)}
                    >
                      <option value="">{t('admin.list.all_plans')}</option>
                      {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                      <option value="SIN PLAN">{t('admin.list.no_plan')}</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <select 
                      className="input-field" 
                      style={{ padding: '0.5rem' }}
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      <option value={20}>{t('admin.list.per_page', { count: 20 })}</option>
                      <option value={50}>{t('admin.list.per_page', { count: 50 })}</option>
                      <option value={100}>{t('admin.list.per_page', { count: 100 })}</option>
                    </select>
                  </div>
                  <div style={{ position: 'relative', width: '250px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type="text" 
                      placeholder={t('admin.list.search_placeholder')} 
                      className="input-field" 
                      style={{ paddingLeft: '2.75rem' }} 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {listLoading ? (
                 <div style={{ padding: '5rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={32} color="var(--corp-green)" /></div>
              ) : (
                <>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                      <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                          <th onClick={() => handleSort('name')} style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>
                            {t('admin.list.col_client')} {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} style={{display:'inline'}}/> : <ChevronDown size={14} style={{display:'inline'}}/>)}
                          </th>
                          <th onClick={() => handleSort('plan')} style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>
                            {t('admin.list.col_plan')} {sortConfig.key === 'plan' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} style={{display:'inline'}}/> : <ChevronDown size={14} style={{display:'inline'}}/>)}
                          </th>
                          <th onClick={() => handleSort('recipes')} style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>
                            {t('admin.list.col_recipes')} {sortConfig.key === 'recipes' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} style={{display:'inline'}}/> : <ChevronDown size={14} style={{display:'inline'}}/>)}
                          </th>
                          <th onClick={() => handleSort('created')} style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>
                            {t('admin.list.col_registered')} {sortConfig.key === 'created' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} style={{display:'inline'}}/> : <ChevronDown size={14} style={{display:'inline'}}/>)}
                          </th>
                          <th onClick={() => handleSort('login')} style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>
                            {t('admin.list.col_last_login')} {sortConfig.key === 'login' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} style={{display:'inline'}}/> : <ChevronDown size={14} style={{display:'inline'}}/>)}
                          </th>
                          <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Origen
                          </th>
                          <th onClick={() => handleSort('renewal')} style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>
                            {t('admin.list.col_renewal')} {sortConfig.key === 'renewal' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} style={{display:'inline'}}/> : <ChevronDown size={14} style={{display:'inline'}}/>)}
                          </th>
                          <th style={{ padding: '1rem', textAlign: 'right' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentClients.map((client) => (
                          <tr key={client.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                            <td style={{ padding: '1.25rem 1rem' }}>
                              <div style={{ fontWeight: '700', color: '#1e293b' }}>{client.clientProfile?.razonSocial || t('admin.list.no_razon_social')}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{client.email}</div>
                            </td>
                            <td style={{ padding: '1.25rem 1rem' }}>
                              <span style={{
                                padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '700',
                                background: '#dcfce7',
                                color: '#15803d',
                                textTransform: 'uppercase'
                              }}>
                                {client.clientProfile?.plan?.name || t('admin.list.sin_plan_badge')}
                              </span>
                            </td>
                            <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', fontWeight: '600' }}>
                              {client.clientProfile?._count?.recipes || 0} / {client.clientProfile?.plan?.recipesLimit || "∞"}
                            </td>
                            <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', color: '#475569' }}>
                              {client.createdAt ? new Date(client.createdAt).toLocaleString(locale === 'en' ? 'en-US' : locale === 'it' ? 'it-IT' : locale === 'fr' ? 'fr-FR' : 'es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                            </td>
                            <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', color: '#475569' }}>
                              {client.lastLogin ? (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span>{new Date(client.lastLogin).toLocaleString(locale === 'en' ? 'en-US' : locale === 'it' ? 'it-IT' : locale === 'fr' ? 'fr-FR' : 'es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                  {client.lastLoginLanguage && (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--corp-green)', fontWeight: '700', textTransform: 'uppercase' }}>
                                      {client.lastLoginLanguage}
                                    </span>
                                  )}
                                </div>
                              ) : <span style={{ color: '#94a3b8' }}>-</span>}
                            </td>
                            <td style={{ padding: '1.25rem 1rem', fontSize: '0.8rem' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <span style={{
                                  padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.7rem', fontWeight: '800', width: 'fit-content',
                                  background: client.clientProfile?.origin === 'META' ? '#dbeafe' : client.clientProfile?.origin === 'GOOGLE' ? '#fef2f2' : client.clientProfile?.origin === 'AFFILIATE' ? '#fde68a' : client.clientProfile?.origin === 'BING' ? '#ecfeff' : client.clientProfile?.origin === 'TIKTOK' ? '#f5f3ff' : '#f1f5f9',
                                  color: client.clientProfile?.origin === 'META' ? '#1e40af' : client.clientProfile?.origin === 'GOOGLE' ? '#991b1b' : client.clientProfile?.origin === 'AFFILIATE' ? '#92400e' : client.clientProfile?.origin === 'BING' ? '#083344' : client.clientProfile?.origin === 'TIKTOK' ? '#4c1d95' : '#64748b',
                                  textTransform: 'uppercase'
                                }}>
                                  {client.clientProfile?.origin || 'DIRECT'}
                                </span>
                                {(client.clientProfile?.origin === 'META' || client.clientProfile?.origin === 'GOOGLE') && (
                                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', lineHeight: '1.2' }}>
                                    <div style={{ fontWeight: '600' }}>C: {client.clientProfile.utmCampaign || '-'}</div>
                                    <div>{client.clientProfile.origin === 'META' ? 'A: ' : 'S: '}{client.clientProfile.origin === 'META' ? (client.clientProfile.utmContent || '-') : (client.clientProfile.utmSource || '-')}</div>
                                  </div>
                                )}
                                {client.clientProfile?.origin === 'OTHER' && (
                                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', lineHeight: '1.2' }}>
                                    <div>S: {client.clientProfile.utmSource || '-'}</div>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', color: '#475569' }}>
                              {client.clientProfile?.stripeCurrentPeriodEnd ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <Globe size={14} color="var(--corp-green)" />
                                  {(() => {
                                    const raw = client.clientProfile.stripeCurrentPeriodEnd;
                                    try {
                                      const d = new Date(raw);
                                      return isNaN(d.getTime()) ? raw : d.toLocaleDateString();
                                    } catch (e) {
                                      return raw;
                                    }
                                  })()}
                                </div>
                              ) : (
                                <span style={{ color: '#94a3b8' }}>-</span>
                              )}
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
                  
                  {/* Paginator */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {t('admin.list.showing_info', { 
                          start: (currentPage - 1) * itemsPerPage + 1, 
                          end: Math.min(currentPage * itemsPerPage, processedClients.length), 
                          total: processedClients.length 
                        })}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', background: 'white', borderRadius: '0.5rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                        >
                          {t('common.previous')}
                        </button>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', background: 'white', borderRadius: '0.5rem', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                        >
                          {t('common.next')}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          ) : activeTab === "terms" ? (
            <AdminTermsTab onUpdateSuccess={() => setMessage({ type: 'success', text: t('admin.terms.force_success') || 'Se ha forzado la aceptación de condiciones para todos los clientes.' })} />
          ) : activeTab === "affiliates" ? (
            <AffiliatesTab 
              affiliates={affiliates} 
              loading={affiliatesLoading} 
              onViewDetails={(id) => { setSelectedAffiliate(id); fetchAffiliateDetails(id); }} 
              onSettle={(aff) => setSettleAffiliate(aff)}
            />
          ) : (
            <PlansTab plans={plans} loading={plansLoading} onRefresh={fetchPlans} />
          )}
        </div>
      </main>

      {/* AFFILIATE DETAILS MODAL */}
      {selectedAffiliate && (
        <AffiliateDetailsModal 
          details={affiliateDetails} 
          loading={affiliateDetailsLoading} 
          onClose={() => { setSelectedAffiliate(null); setAffiliateDetails(null); }} 
        />
      )}

      {/* SETTLE COMMISSION MODAL */}
      {settleAffiliate && (
        <SettleCommissionsModal 
          affiliate={settleAffiliate} 
          onClose={() => setSettleAffiliate(null)} 
          onSuccess={() => { setSettleAffiliate(null); fetchAffiliates(); }} 
        />
      )}

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
              {t('admin.actions.title')}: {activeMenu.clientProfile?.razonSocial}
            </div>
            <MenuBtn icon={<ShieldCheck size={16} />} text="Entrar como cliente" onClick={() => handleImpersonate(activeMenu.id)} />
            <MenuBtn icon={<Edit size={16} />} text={t('admin.actions.edit')} onClick={() => { setEditClientModal({ id: activeMenu.id, form: { ...activeMenu, ...activeMenu.clientProfile, personName: activeMenu.clientProfile?.personName || activeMenu.name || "" } }); setActiveMenu(null); }} />
            <MenuBtn
              icon={<Plus size={16} />}
              text={t('admin.actions.add_recipe')}
              disabled={(activeMenu.clientProfile?._count?.recipes || 0) >= (activeMenu.clientProfile?.accountType === 'demo' ? 3 : activeMenu.clientProfile?.recetasContratadas)}
              onClick={() => { setAddRecipeModal(activeMenu.clientProfile); setActiveMenu(null); }}
            />
            <MenuBtn icon={<ChefHat size={16} />} text={t('admin.actions.manage_recipes')} onClick={() => { setManageRecipesModal(activeMenu.clientProfile); setActiveMenu(null); }} />
            <MenuBtn icon={<CheckSquare size={16} />} text={t('admin.actions.cleaning_zones')} onClick={() => { setManageCleaningZonesModal(activeMenu.clientProfile); setActiveMenu(null); }} />
            <MenuBtn icon={<Thermometer size={16} />} text={t('admin.actions.chambers')} onClick={() => { setManageChambersModal(activeMenu.clientProfile); setActiveMenu(null); }} />
            <MenuBtn icon={<RefreshCw size={16} />} text={t('admin.actions.sync_stripe')} onClick={() => handleResyncStripe(activeMenu.id)} />
            <MenuBtn icon={<UserPlus size={16} />} text={t('admin.actions.sync_clientify')} onClick={() => handleSyncClientify(activeMenu.id)} />
            <MenuBtn icon={<Mail size={16} />} text="Enviar email de recuperación de contraseña" onClick={() => handleSendPasswordReset(activeMenu.email)} />
            <MenuBtn icon={<Lock size={16} />} text="Cambiar contraseña" onClick={() => { setChangePasswordModal(activeMenu); setActiveMenu(null); }} />
            <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.25rem', paddingTop: '0.25rem' }}>
               <MenuBtn 
                icon={<FileText size={16} />} 
                text={t('admin.actions.view_terms')} 
                onClick={() => { setTermsModal(activeMenu); setActiveMenu(null); }} 
              />
            </div>
            <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.25rem', paddingTop: '0.25rem' }}>
              <MenuBtn 
                icon={<Trash2 size={16} />} 
                text={t('admin.actions.delete_client')} 
                danger 
                onClick={() => handleDeleteClient(activeMenu)} 
              />
            </div>
          </div>
        </>
      )}

      {/* MODALS */}
      {editClientModal && (
        <Modal title={t('admin.actions.edit')} onClose={() => setEditClientModal(null)}>
          <form onSubmit={handleUpdateClient} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ gridColumn: '1 / -1' }}><h3 className="section-title">{t('admin.create.access_data')}</h3></div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="label">{t('auth.email')}</label>
                <input type="email" className="input-field" value={editClientModal.form.email} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, email: e.target.value}})} required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="label">{t('profile.person_name')}</label>
                <input type="text" className="input-field" value={editClientModal.form.name} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, name: e.target.value}})} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ gridColumn: '1 / -1' }}><h3 className="section-title">{t('admin.create.fiscal_data')}</h3></div>
              <div>
                <label className="label">{t('profile.business_name')}</label>
                <input type="text" className="input-field" value={editClientModal.form.razonSocial} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, razonSocial: e.target.value}})} required />
              </div>
              <div>
                <label className="label">{t('profile.vat_nif')}</label>
                <input type="text" className="input-field" value={editClientModal.form.nif} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, nif: e.target.value}})} required />
              </div>
              <div>
                <label className="label">{t('profile.phone')}</label>
                <input type="tel" className="input-field" value={editClientModal.form.phone || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, phone: e.target.value}})} />
              </div>
              <div>
                <label className="label">URL Clientify</label>
                <input type="url" className="input-field" value={editClientModal.form.urlClientify || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, urlClientify: e.target.value}})} />
              </div>
              <div>
                <label className="label">{t('admin.create.person_name') || t('profile.person_name')}</label>
                <input type="text" className="input-field" value={editClientModal.form.personName || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, personName: e.target.value}})} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ gridColumn: '1 / -1' }}><h3 className="section-title">{t('admin.create.address_data')}</h3></div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="label">{t('profile.address')}</label>
                <input type="text" className="input-field" value={editClientModal.form.address || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, address: e.target.value}})} />
              </div>
              <div>
                <label className="label">{t('profile.postal_code')}</label>
                <input type="text" className="input-field" value={editClientModal.form.postalCode || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, postalCode: e.target.value}})} />
              </div>
              <div>
                <label className="label">{t('profile.city')}</label>
                <input type="text" className="input-field" value={editClientModal.form.city || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, city: e.target.value}})} />
              </div>
              <div>
                <label className="label">{t('profile.province')}</label>
                <input type="text" className="input-field" value={editClientModal.form.province || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, province: e.target.value}})} />
              </div>
              <div>
                <label className="label">{t('profile.country')}</label>
                <input type="text" className="input-field" value={editClientModal.form.country || ""} onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, country: e.target.value}})} />
              </div>
            </div>

            <div>
              <h3 className="section-title">{t('admin.edit.stripe_config') || "Stripe Config"}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label className="label">{t('admin.edit.assigned_plan') || "Plan"}</label>
                  <select 
                    className="input-field" 
                    value={editClientModal.form.planId || ""} 
                    onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, planId: e.target.value}})}
                  >
                    <option value="">{t('admin.create.select_plan_placeholder') || "Selecciona un plan..."}</option>
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">{t('admin.list.col_renewal')}</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={editClientModal.form.stripeCurrentPeriodEnd || ""} 
                    onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, stripeCurrentPeriodEnd: e.target.value}})} 
                    placeholder="YYYY-MM-DD..."
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="section-title">{t('admin.edit.ia_config') || "Configuración IA"}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                  <input 
                    type="checkbox" 
                    style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer', accentColor: 'var(--corp-green)' }}
                    checked={!!editClientModal.form.hasIaGoods} 
                    onChange={(e) => setEditClientModal({...editClientModal, form: {...editClientModal.form, hasIaGoods: e.target.checked}})} 
                  />
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                    {t('admin.edit.ia_goods') || "Activar sistema IA para entrada de mercancías"}
                  </span>
                </label>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={() => setEditClientModal(null)}>{t('common.cancel')}</button>
              <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: '200px' }}>{loading ? t('common.loading') : t('common.save')}</button>
            </div>
          </form>
        </Modal>
      )}

      {addRecipeModal && <AddRecipeModal profile={addRecipeModal} onRefresh={fetchClients} onClose={() => setAddRecipeModal(null)} />}
      {manageRecipesModal && <ManageRecipesModal profile={manageRecipesModal} onRefresh={fetchClients} onClose={() => setManageRecipesModal(null)} />}
      {changePasswordModal && (
        <ChangePasswordModal 
          user={changePasswordModal} 
          onClose={() => setChangePasswordModal(null)} 
        />
      )}
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

      {termsModal && (
        <Modal title={t('admin.terms.title')} onClose={() => setTermsModal(null)}>
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={24} color="var(--corp-green)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                  {termsModal.clientProfile?.razonSocial || termsModal.name || t('admin.create.clients')}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{termsModal.email}</p>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '700' }}>
                {t('admin.terms.status')}
              </h4>
              
              {termsModal.termsAcceptedAt || termsModal.clientProfile?.acceptedTermsAt ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    <CheckSquare size={18} /> {t('admin.terms.accepted')}
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                    {t('admin.terms.accepted_desc') || "El usuario ha leído y aceptado las Condiciones de Uso y la Política de Privacidad de QuickTrace."}
                  </p>
                  <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>{t('admin.terms.accepted_date_label')}:</span>
                    <strong style={{ color: 'var(--text-main)' }}>
                      {new Date(termsModal.termsAcceptedAt || termsModal.clientProfile?.acceptedTermsAt).toLocaleString(locale === 'en' ? 'en-US' : locale === 'it' ? 'it-IT' : locale === 'fr' ? 'fr-FR' : 'es-ES', { 
                        weekday: 'long', year: 'numeric', month: 'long', 
                        day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' 
                      })}
                    </strong>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ca8a04', fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} /> {t('admin.terms.legacy')}
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                    {t('admin.terms.legacy_desc')}
                  </p>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
              <button onClick={() => setTermsModal(null)} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                {t('admin.terms.close')}
              </button>
            </div>
          </div>
        </Modal>
      )}



      {activeTab === "coupons" && <CouponsTab plans={plans} />}

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

        @media (max-width: 1024px) {
          .flex-responsive { flex-direction: column !important; }
          .mobile-header { display: flex !important; }
          .desktop-logo { display: none !important; }
          .sidebar-responsive { 
            display: none !important; 
            width: 100% !important; 
            height: auto !important; 
            position: relative !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border) !important;
          }
          .sidebar-responsive.open {
            display: flex !important;
            position: fixed !important;
            top: 61px !important;
            left: 0 !important;
            z-index: 90 !important;
            background: white !important;
            height: calc(100vh - 61px) !important;
            overflow-y: auto !important;
          }
          main { padding: 1.5rem !important; }
          .desktop-only { display: none !important; }
        }
      `}</style>
      </div> {/* Close flex-responsive */}
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
  const { t } = useI18n();
  return (
    <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(66, 98, 22, 0.05), white)', borderLeft: '4px solid var(--corp-green)' }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--corp-green)' }}>{t('admin.create.instructions_title')}</h3>
      <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <li>• {t('admin.create.instruction_1')}</li>
        <li>• {t('admin.create.instruction_2')}</li>
        <li>• {t('admin.create.instruction_3')}</li>
      </ul>
    </div>
  );
}

function PlansTab({ plans, loading, onRefresh }) {
  const { t } = useI18n();
  const [showPlanModal, setShowPlanModal] = useState(null); // { mode: 'create' | 'edit', plan?: any }

  const handleDeletePlan = async (id) => {
    if (!confirm(t('admin.plans.delete_confirm'))) return;
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{t('admin.plans.title')}</h2>
        </div>
        <button 
          onClick={() => setShowPlanModal({ mode: 'create' })}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> {t('admin.plans.new_plan')}
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
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>/ {t('common.year') || 'año'}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('common.recipes') || 'Recetas'}:</span>
                  <span style={{ fontWeight: '700' }}>{plan.recipesLimit || t('admin.plans.unlimited') || "∞"}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('common.elaborations') || 'Elaboraciones'}:</span>
                  <span style={{ fontWeight: '700' }}>{plan.elaborationsLimit || t('admin.plans.unlimited') || "∞"}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: plan.hasCleaning ? 1 : 0.5 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('admin.plans.cleaning') || "Limpieza"}:</span>
                  <span style={{ fontWeight: '700' }}>{plan.hasCleaning ? (plan.cleaningLimit || t('admin.plans.unlimited') || "∞") : (t('admin.plans.not_available') || "No disponible")}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: plan.hasGoods ? 1 : 0.5 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('admin.plans.goods') || "Mercancías"}:</span>
                  <span style={{ fontWeight: '700' }}>{plan.hasGoods ? (plan.goodsLimit || t('admin.plans.unlimited') || "∞") : (t('admin.plans.not_available') || "No disponible")}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: plan.hasTemperatures ? 1 : 0.5 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('admin.plans.temperatures') || "Temperaturas"}:</span>
                  <span style={{ fontWeight: '700' }}>{plan.hasTemperatures ? (plan.temperaturesLimit || t('admin.plans.unlimited') || "∞") : (t('admin.plans.not_available') || "No disponible")}</span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed #e2e8f0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {t('admin.plans.active_clients', { count: plan._count?.clients || 0 })}
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
    priceMonthly: plan?.priceMonthly || 0,
    priceYearly: plan?.priceYearly || 0,
    stripePriceIdMonthly: plan?.stripePriceIdMonthly || "",
    stripePriceIdYearly: plan?.stripePriceIdYearly || plan?.stripePriceId || "",
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
    } catch (e) { alert(t('admin.plans.save_error') || "Error al guardar plan"); }
    finally { setLoading(false); }
  };

  return (
    <Modal title={mode === 'create' ? "Nuevo Plan de Precios" : `Editar Plan: ${plan.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div>
            <label className="label">Nombre del Plan</label>
            <input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="Ej: Premium, Básico..." />
          </div>
          <div>
            <label className="label">Precio Mensual (€)</label>
            <input type="number" step="0.01" className="input-field" value={formData.priceMonthly} onChange={(e) => setFormData({...formData, priceMonthly: e.target.value})} required />
          </div>
          <div>
            <label className="label">Precio Anual (€)</label>
            <input type="number" step="0.01" className="input-field" value={formData.priceYearly} onChange={(e) => setFormData({...formData, priceYearly: e.target.value})} required />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="label">Stripe Price ID Mensual</label>
            <input type="text" className="input-field" value={formData.stripePriceIdMonthly} onChange={(e) => setFormData({...formData, stripePriceIdMonthly: e.target.value})} placeholder="price_..." />
          </div>
          <div>
            <label className="label">Stripe Price ID Anual</label>
            <input type="text" className="input-field" value={formData.stripePriceIdYearly} onChange={(e) => setFormData({...formData, stripePriceIdYearly: e.target.value})} placeholder="price_..." />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="label">{t('admin.plans.recipes_limit')}</label>
            <input type="number" className="input-field" value={formData.recipesLimit} onChange={(e) => setFormData({...formData, recipesLimit: e.target.value})} />
          </div>
          <div>
            <label className="label">{t('admin.plans.elaborations_limit')}</label>
            <input type="number" className="input-field" value={formData.elaborationsLimit} onChange={(e) => setFormData({...formData, elaborationsLimit: e.target.value})} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)' }}>{t('admin.plans.hygiene_modules')}</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <Checkbox label={t('admin.plans.cleaning')} checked={formData.hasCleaning} onChange={(e) => setFormData({...formData, hasCleaning: e.target.checked})} heavy />
            {formData.hasCleaning && (
              <input type="number" className="input-field" value={formData.cleaningLimit} onChange={(e) => setFormData({...formData, cleaningLimit: e.target.value})} placeholder={t('admin.plans.cleaning_limit')} />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <Checkbox label={t('admin.plans.goods')} checked={formData.hasGoods} onChange={(e) => setFormData({...formData, hasGoods: e.target.checked})} heavy />
            {formData.hasGoods && (
              <input type="number" className="input-field" value={formData.goodsLimit} onChange={(e) => setFormData({...formData, goodsLimit: e.target.value})} placeholder={t('admin.plans.cleaning_limit')} />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <Checkbox label={t('admin.plans.temperatures')} checked={formData.hasTemperatures} onChange={(e) => setFormData({...formData, hasTemperatures: e.target.checked})} heavy />
            {formData.hasTemperatures && (
              <input type="number" className="input-field" value={formData.temperaturesLimit} onChange={(e) => setFormData({...formData, temperaturesLimit: e.target.value})} placeholder={t('admin.plans.cleaning_limit')} />
            )}
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? t('common.loading') : t('admin.plans.save_btn')}
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

function ChangePasswordModal({ user, onClose }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError("La contraseña no puede estar vacía");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/clients/change-password/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Contraseña actualizada con éxito");
        onClose();
      } else {
        setError(data.error || "Error al actualizar la contraseña");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Cambiar contraseña de: ${user.clientProfile?.razonSocial || user.email}`} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {error && (
          <div style={{ color: '#ef4444', background: '#fef2f2', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        <div>
          <label className="label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Nueva contraseña</label>
          <input 
            type="password" 
            className="input-field" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <div>
          <label className="label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Confirmar nueva contraseña</label>
          <input 
            type="password" 
            className="input-field" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            placeholder="Repite la contraseña"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Guardar contraseña"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Complex Recipe Modals
function AddRecipeModal({ profile, onClose, onRefresh, recipeToEdit = null }) {
  const [loading, setLoading] = useState(false);
  const [recipeForm, setRecipeForm] = useState({
    name: recipeToEdit?.name || "", 
    ingredients: recipeToEdit?.ingredients.map(i => ({
      id: i.id,
      name: i.name,
      amount: i.amount,
      unit: i.unit,
      loteMandatory: i.loteMandatory || false,
      quantityMandatory: i.quantityMandatory || false,
      expandItem: i.expandItem || false,
      expandedText: i.expandedText || ""
    })) || [{ name: "", amount: "", unit: "", loteMandatory: false, quantityMandatory: false, expandItem: false, expandedText: "" }],
    expiryDays: recipeToEdit?.expiryDays || 0,
    expiryType: recipeToEdit?.expiryType || "EXPIRATION",
    elaborationInstructions: recipeToEdit?.elaborationInstructions || "",
    conservationInstructions: recipeToEdit?.conservationInstructions || "",
    energyValue: recipeToEdit?.energyValue || "",
    fats: recipeToEdit?.fats || "",
    saturatedFats: recipeToEdit?.saturatedFats || "",
    carbohydrates: recipeToEdit?.carbohydrates || "",
    sugars: recipeToEdit?.sugars || "",
    proteins: recipeToEdit?.proteins || "",
    salt: recipeToEdit?.salt || "",
    allergens: recipeToEdit?.allergens || []
  });

  const handleAddIngredient = () => {
    setRecipeForm({
      ...recipeForm,
      ingredients: [...recipeForm.ingredients, { name: "", amount: "", unit: "", loteMandatory: false, quantityMandatory: false, expandItem: false, expandedText: "" }]
    });
  };

  const handleRemoveIngredient = (index) => {
    if (recipeForm.ingredients.length === 1) return;
    const newIngs = [...recipeForm.ingredients];
    newIngs.splice(index, 1);
    setRecipeForm({ ...recipeForm, ingredients: newIngs });
  };

  const handleIngredientChange = (index, field, value) => {
    setRecipeForm(prev => {
      const newIngs = prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      );
      return { ...prev, ingredients: newIngs };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (recipeForm.ingredients.some(ing => !ing.name.trim())) {
      alert(t('admin.recipes.all_ingredients_required'));
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
       alert(t('admin.recipes.save_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={recipeToEdit ? t('admin.recipes.edit_title', { name: recipeToEdit.name }) : t('admin.recipes.add_title', { name: profile.razonSocial })} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label className="label">{t('admin.recipes.name_label')}</label>
          <input type="text" className="input-field" value={recipeForm.name} onChange={(e) => setRecipeForm({...recipeForm, name: e.target.value})} placeholder="Pavo con arroz..." required />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="label" style={{ margin: 0 }}>{t('admin.recipes.ingredients_label')}</label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recipeForm.ingredients.map((ing, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)' }}>{t('admin.recipes.ingredient_name')}</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={ing.name} 
                        onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                        placeholder="Ej. Pollo"
                        required
                        style={{ margin: 0, padding: '0.5rem' }}
                      />
                      
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-main)' }}>
                            <input 
                              type="checkbox" 
                              checked={ing.expandItem || false} 
                              onChange={(e) => handleIngredientChange(idx, 'expandItem', e.target.checked)} 
                              style={{ accentColor: 'var(--corp-green)' }} 
                            />
                            Desglosar este ingrediente
                          </label>
                          <button 
                            type="button" 
                            onClick={() => alert(t('admin.recipes.expand_info'))}
                            style={{ background: '#e2e8f0', border: 'none', color: '#475569', cursor: 'pointer', width: '16px', height: '16px', borderRadius: '50%', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                            title="Información"
                          >
                            ?
                          </button>
                        </div>
                        {ing.expandItem && (
                          <input 
                            type="text" 
                            className="input-field" 
                            value={ing.expandedText || ''} 
                            onChange={(e) => handleIngredientChange(idx, 'expandedText', e.target.value)} 
                            placeholder="Escribe el texto de la etiqueta aquí" 
                            style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.5rem' }} 
                          />
                        )}
                      </div>
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
                      <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{t('admin.recipes.lote_mandatory')}</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={ing.quantityMandatory} 
                        onChange={(e) => handleIngredientChange(idx, 'quantityMandatory', e.target.checked)} 
                        style={{ width: '16px', height: '16px', accentColor: 'var(--corp-green)' }}
                      />
                      <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{t('admin.recipes.quantity_mandatory')}</span>
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
              <Plus size={14} /> {t('admin.recipes.add_another')}
            </button>
          </div>
        </div>

        <div style={{ 
          padding: '0.75rem', 
          background: (profile._count.recipes >= (profile.accountType === 'demo' ? 3 : profile.recetasContratadas)) && !recipeToEdit ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.05)', 
          borderRadius: '0.5rem', fontSize: '0.8rem', color: (profile._count.recipes >= (profile.accountType === 'demo' ? 3 : profile.recetasContratadas)) && !recipeToEdit ? '#ef4444' : 'var(--text-muted)' 
        }}>
          {recipeToEdit ? t('admin.recipes.editing_existing') : t('admin.recipes.quota_usage', { used: profile._count.recipes, limit: profile.accountType === 'demo' ? 3 : profile.recetasContratadas })}
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading || ((profile._count.recipes >= (profile.accountType === 'demo' ? 3 : profile.recetasContratadas)) && !recipeToEdit)}
        >
          {loading ? t('common.loading') : recipeToEdit ? t('admin.recipes.update_btn') : t('admin.recipes.create_btn')}
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
    if (!confirm(t('common.confirm_delete'))) return;
    try {
      await fetch(`/api/admin/recipes/delete/${id}`, { method: 'DELETE' });
      if (onRefresh) onRefresh();
      fetchRecipes();
    } catch (e) { alert(t('common.error_generic')); }
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
    <Modal title={t('admin.recipes.manage_title', { name: profile.razonSocial })} onClose={onClose}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="animate-spin" /></div>
      ) : recipes.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t('common.no_data')}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recipes.map(recipe => (
            <div key={recipe.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontWeight: '800', color: 'var(--text-main)' }}>{recipe.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{recipe.ingredients.length} {t('common.ingredients' || 'Ingredientes')}</div>
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
  const { t } = useI18n();
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
    if (!confirm(t('common.confirm_delete'))) return;
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
    <Modal title={t('admin.cleaning.manage_title', { name: profile.razonSocial })} onClose={onClose}>
      {initialLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="animate-spin" color="var(--corp-green)" size={32} /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Formulario Añadir */}
          <form onSubmit={handleAddZone} style={{ display: 'flex', gap: '0.75rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder={t('admin.cleaning.placeholder')} 
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              disabled={loading}
              style={{ margin: 0 }}
            />
            <button type="submit" className="btn-primary" disabled={loading || !newZoneName.trim()} style={{ whiteSpace: 'nowrap', padding: '0 1.5rem' }}>
              {t('admin.cleaning.new_zone')}
            </button>
          </form>

          {/* Listado de Zonas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('admin.cleaning.current_zones', { count: zones.length })}</h4>
            {zones.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '0.75rem', border: '1px dashed var(--border)' }}>{t('common.no_data')}</p>
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
  const { t } = useI18n();
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
    if (!confirm(t('common.confirm_delete'))) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/chambers?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchChambers();
      } else {
        alert(data.error || t('common.error_generic'));
      }
    } catch (error) {
      alert(t('auth.error_generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={t('admin.chambers.manage_title', { name: profile.razonSocial })} onClose={onClose}>
      {initialLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="animate-spin" color="var(--corp-green)" size={32} /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <form onSubmit={handleAddChamber} style={{ display: 'flex', gap: '0.75rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder={t('admin.chambers.placeholder')} 
              value={newChamberName}
              onChange={(e) => setNewChamberName(e.target.value)}
              disabled={loading}
              style={{ margin: 0 }}
            />
            <button type="submit" className="btn-primary" disabled={loading || !newChamberName.trim()} style={{ whiteSpace: 'nowrap', padding: '0 1.5rem' }}>
              {t('admin.chambers.new_chamber')}
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('admin.chambers.current_chambers', { count: chambers.length })}</h4>
            {chambers.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '0.75rem', border: '1px dashed var(--border)' }}>{t('common.no_data')}</p>
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

function AdminTermsTab({ onUpdateSuccess }) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleForceUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/terms/update-all', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        onUpdateSuccess();
        alert(t('admin.terms.force_success'));
        setShowConfirm(false);
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert(t('common.error_generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="glass-card" style={{ padding: '2.5rem', background: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
        <FileText size={24} color="var(--corp-green)" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{t('admin.terms.force_title')}</h2>
      </div>

      <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '1rem' }}>
          {t('admin.terms.force_subtitle')}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', maxWidth: '800px' }}>
          {t('admin.terms.force_desc')}
        </p>
        
        {!showConfirm ? (
          <button 
            onClick={() => setShowConfirm(true)}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ea580c' }}
          >
            <AlertCircle size={18} /> {t('admin.terms.force_btn')}
          </button>
        ) : (
          <div style={{ background: '#fff7ed', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #fdba74', animation: 'fadeIn 0.3s ease' }}>
            <h4 style={{ color: '#c2410c', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} /> {t('admin.terms.force_confirm_title')}
            </h4>
            <p style={{ color: '#9a3412', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '800px' }}>
              {t('admin.terms.force_confirm_desc')}
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setShowConfirm(false)}
                className="btn-secondary" 
                style={{ background: 'white', color: '#64748b' }}
                disabled={loading}
              >
                {t('common.cancel')}
              </button>
              <button 
                onClick={handleForceUpdate}
                className="btn-primary" 
                style={{ background: '#ea580c' }}
                disabled={loading}
              >
                {loading ? t('admin.terms.force_processing') : t('admin.terms.force_btn_confirm')}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}



function AffiliatesTab({ affiliates, loading, onViewDetails, onSettle }) {
  const { t } = useI18n();
  return (
    <section className="glass-card" style={{ padding: '2.5rem', background: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
        <Globe size={24} color="var(--corp-green)" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{t('admin.affiliates.title')}</h2>
      </div>

      {loading ? (
        <div style={{ padding: '5rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={32} color="var(--corp-green)" /></div>
      ) : affiliates.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>{t('affiliate.no_referrals_desc')}</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{t('admin.affiliates.col_email')}</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{t('admin.affiliates.col_link')}</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>{t('admin.affiliates.col_referrals')}</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>{t('admin.affiliates.col_balance')}</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>{t('dashboard.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((aff) => (
                <tr key={aff.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{aff.clientProfile?.razonSocial || t('admin.list.no_razon_social')}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{aff.email}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <code style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.85rem' }}>
                      {aff.clientProfile?.referralCode}
                    </code>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                    <span style={{ 
                      background: 'rgba(59, 130, 246, 0.1)', 
                      color: '#2563eb', 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '0.5rem', 
                      fontWeight: '800', 
                      fontSize: '0.85rem' 
                    }}>
                      {aff.referralCount || 0}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', textAlign: 'right', fontWeight: '700', color: aff.pendingCommission > 0 ? 'var(--corp-green)' : 'var(--text-muted)' }}>
                    {aff.pendingCommission.toFixed(2)} €
                  </td>
                  <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => onSettle({ id: aff.id, email: aff.email, pending: aff.pendingCommission })}
                        disabled={aff.pendingCommission <= 0}
                        className="btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', opacity: aff.pendingCommission <= 0 ? 0.5 : 1 }}
                      >
                        {t('admin.affiliates.register_settlement')}
                      </button>
                      <button 
                        onClick={() => onViewDetails(aff.id)}
                        className="btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'white' }}
                      >
                        <Search size={14} /> {t('admin.affiliates.details')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function AffiliateDetailsModal({ details, loading, onClose }) {
  const { t } = useI18n();
  return (
    <Modal title={t('admin.affiliates.details')} onClose={onClose} width="950px">
      {loading || !details ? (
        <div style={{ padding: '5rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={32} color="var(--corp-green)" /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', background: '#f1f5f9' }}>
              <h4 style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '800' }}>{t('admin.affiliates.col_total')}</h4>
              <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)' }}>{details.totalGenerated.toFixed(2)} €</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', background: '#fef2f2' }}>
              <h4 style={{ fontSize: '0.7rem', color: '#991b1b', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '800' }}>{t('admin.affiliates.settled_total')}</h4>
              <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#dc2626' }}>{details.totalSettled.toFixed(2)} €</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(66, 98, 22, 0.05)', border: '1px solid var(--corp-green)' }}>
              <h4 style={{ fontSize: '0.7rem', color: 'var(--corp-green)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '800' }}>{t('admin.affiliates.col_balance')}</h4>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--corp-green)' }}>{details.pendingCommission.toFixed(2)} €</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Referrals List */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} /> {t('admin.affiliates.referrals', { count: details.referrals.length })}
              </h3>
              {details.referrals.length === 0 ? (
                <p style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('admin.affiliates.no_referrals')}</p>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <tr>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>{t('admin.create.clients')}</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>{t('affiliate.commission_column')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.referrals.map(ref => (
                        <tr key={ref.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ fontWeight: '700' }}>{ref.razonSocial}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ref.email}</div>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '700' }}>{ref.commission.toFixed(2)}€</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Settlements History */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={18} /> {t('admin.affiliates.payment_history', { count: details.settlements.length })}
              </h3>
              {details.settlements.length === 0 ? (
                <p style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('admin.affiliates.no_settlements')}</p>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <tr>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>{t('common.date')}</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>{t('common.amount')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.settlements.map(s => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ fontWeight: '600' }}>{new Date(s.date).toLocaleDateString()}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.notes || t('affiliate.settlements_header')}</div>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '700', color: '#dc2626' }}>-{s.amount.toFixed(2)}€</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

function SettleCommissionsModal({ affiliate, onClose, onSuccess }) {
  const { t } = useI18n();
  const [amount, setAmount] = useState(affiliate.pending);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/affiliates/settle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: affiliate.id,
          amount: parseFloat(amount),
          notes
        })
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        alert(data.error);
        setShowConfirm(false);
      }
    } catch (e) {
      alert(t('common.error_generic'));
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={t('admin.affiliates.settle_title', { email: affiliate.email })} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: 'rgba(66, 98, 22, 0.05)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--corp-green)', textAlign: 'center' }}>
          <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t('admin.affiliates.pending_commissions')}</h4>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--corp-green)' }}>{affiliate.pending.toFixed(2)} €</div>
        </div>

        <div>
          <label className="label">{t('admin.affiliates.amount_to_settle')}</label>
          <input 
            type="number" 
            step="0.01" 
            max={affiliate.pending} 
            min="0.01"
            className="input-field" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required
            style={{ fontSize: '1.25rem', fontWeight: '700', textAlign: 'center' }}
          />
          {parseFloat(amount) > parseFloat(affiliate.pending) && (
            <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: '600' }}>
              {t('admin.affiliates.limit_error')}
            </div>
          )}
        </div>

        <div>
           <label className="label">{t('admin.affiliates.notes_label')}</label>
           <textarea 
             className="input-field" 
             value={notes} 
             onChange={(e) => setNotes(e.target.value)}
             placeholder={t('affiliate.settlements_header')}
             style={{ minHeight: '80px', paddingTop: '0.75rem' }}
           />
        </div>

        {showConfirm && (
          <div style={{ background: '#fff7ed', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #fdba74', animation: 'fadeIn 0.2s ease' }}>
            <p style={{ color: '#9a3412', fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {t('admin.affiliates.confirm_settlement', { amount: parseFloat(amount).toFixed(2) })}
            </p>
            <p style={{ color: '#9a3412', fontSize: '0.8rem' }}>{t('admin.affiliates.confirm_settlement_desc')}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>{t('common.cancel')}</button>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || amount <= 0 || parseFloat(amount) > parseFloat(affiliate.pending)}
            style={{ flex: 2, background: showConfirm ? '#ea580c' : 'var(--corp-green)' }}
          >
            {loading ? t('common.loading') : showConfirm ? t('admin.affiliates.settle_btn_confirm') : t('admin.affiliates.settle_btn_now')}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function SidebarBtn({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
        padding: '0.875rem 1rem', border: 'none', background: active ? 'var(--corp-green)' : 'transparent',
        color: active ? 'white' : 'var(--text-main)', borderRadius: '0.5rem',
        cursor: 'pointer', transition: 'background 0.2s, color 0.2s', fontWeight: active ? '700' : '600',
        textAlign: 'left', fontSize: '0.9rem'
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = 'var(--corp-green)'; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-main)'; } }}
    >
      <div style={{ opacity: active ? 1 : 0.7 }}>{icon}</div>
      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{label}</span>
    </button>
  );
}

function CouponsTab({ plans }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.success) setCoupons(data.coupons);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const toggleCouponStatus = async (id, currentStatus) => {
    if (!confirm(`¿Seguro que quieres ${currentStatus ? 'desactivar' : 'activar'} este cupón en Stripe?`)) return;
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentStatus })
      });
      const data = await res.json();
      if (data.success) fetchCoupons();
      else alert(data.error);
    } catch (e) { alert("Error de conexión"); }
  };

  return (
    <section className="glass-card" style={{ padding: '2.5rem', background: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Tag size={24} color="var(--corp-green)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Cupones de Descuento</h2>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Crear Cupón
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}><Loader2 className="animate-spin" size={32} color="var(--corp-green)" /></div>
      ) : coupons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '1rem', border: '1px dashed #cbd5e1' }}>
          <Tag size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>No hay cupones creados</h3>
          <p style={{ color: 'var(--text-muted)' }}>Crea un cupón para ofrecer descuentos a tus clientes durante la contratación en Stripe.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {coupons.map(coupon => (
            <div key={coupon.id} className="glass-card" style={{ padding: '1.5rem', background: '#f8fafc', border: '1px solid var(--border)', opacity: coupon.active ? 1 : 0.6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--corp-green)', letterSpacing: '1px' }}>{coupon.code}</span>
                <span style={{ 
                  fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.5rem', borderRadius: '1rem',
                  background: coupon.active ? '#dcfce3' : '#fee2e2', 
                  color: coupon.active ? '#166534' : '#991b1b' 
                }}>
                  {coupon.active ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '1rem' }}>
                -{coupon.percentage}%
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <strong>Duración:</strong> {coupon.duration === 'ONCE' ? 'Primer cobro' : coupon.duration === 'FOREVER' ? 'Para siempre' : `Repetido (${coupon.durationInMonths} meses)`}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                <strong>Planes:</strong> {coupon.plans.length > 0 ? coupon.plans.map(p => p.name).join(', ') : 'Todos válidos'}
              </div>
              
              <button 
                onClick={() => toggleCouponStatus(coupon.id, coupon.active)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', border: '1px solid',
                  background: coupon.active ? '#fef2f2' : '#f0fdf4',
                  borderColor: coupon.active ? '#fee2e2' : '#bbf7d0',
                  color: coupon.active ? '#ef4444' : '#16a34a'
                }}
              >
                {coupon.active ? 'Desactivar Cupón' : 'Reactivar Cupón'}
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddModal && <AddCouponModal plans={plans} onClose={() => setShowAddModal(false)} onRefresh={fetchCoupons} />}
    </section>
  );
}

function AddCouponModal({ plans, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    percentage: 10,
    duration: "ONCE",
    durationInMonths: 12,
    planIds: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
        onClose();
      } else {
        alert(data.error);
      }
    } catch (e) { alert("Error al crear cupón. Verifica la consola."); console.error(e); }
    finally { setLoading(false); }
  };

  const handlePlanToggle = (planId) => {
    setFormData(prev => {
      const isSelected = prev.planIds.includes(planId);
      return {
        ...prev,
        planIds: isSelected ? prev.planIds.filter(id => id !== planId) : [...prev.planIds, planId]
      };
    });
  };

  return (
    <Modal title="Crear Cupón de Descuento (Stripe Promo)" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="label">Código (Mayúsculas, ej: VERANO50)</label>
            <input type="text" className="input-field" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase().trim()})} required placeholder="Ej: VERANO50" minLength="3" />
          </div>
          <div>
            <label className="label">Porcentaje de Descuento (%)</label>
            <input type="number" min="1" max="100" className="input-field" value={formData.percentage} onChange={(e) => setFormData({...formData, percentage: parseInt(e.target.value)})} required />
          </div>
        </div>

        <div>
          <label className="label">Duración del código</label>
          <select className="input-field" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})}>
            <option value="ONCE">Un solo uso (Solamente el primer cobro del plan)</option>
            <option value="REPEATING">Múltiples meses (Específicamente el primer año / X meses)</option>
            <option value="FOREVER">Para siempre (Mientras dure la suscripción)</option>
          </select>
        </div>

        {formData.duration === "REPEATING" && (
          <div>
            <label className="label">Número de meses en los que aplica</label>
            <input type="number" min="1" max="120" className="input-field" value={formData.durationInMonths} onChange={(e) => setFormData({...formData, durationInMonths: parseInt(e.target.value)})} required />
          </div>
        )}

        <div>
           <label className="label" style={{ marginBottom: '1rem' }}>Planes Aplicables (Si no marcas ninguno, aplicará a todos)</label>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
             {plans.map(plan => (
               <Checkbox 
                 key={plan.id}
                 label={plan.name}
                 checked={formData.planIds.includes(plan.id)}
                 onChange={() => handlePlanToggle(plan.id)}
               />
             ))}
           </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Sincronizando con Stripe..." : "Crear y Activar Cupón"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
