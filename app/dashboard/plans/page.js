"use client";

import { useState, useEffect } from "react";
import { 
  Check, X, Crown, Star, 
  Zap, Shield, Plus, ArrowLeft,
  ChefHat, Thermometer, Brush, Package, History, Loader2, Droplets, Truck, Send, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function PlansPage() {
  const { t } = useI18n();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [billingCycle, setBillingCycle] = useState("yearly"); // "monthly" or "yearly"
  const [profile, setProfile] = useState(null);

  // Popup for Simple mode users requesting ERP info
  const [showErpInfoModal, setShowErpInfoModal] = useState(false);
  const [sendingErpInfo, setSendingErpInfo] = useState(false);
  const [erpInfoSent, setErpInfoSent] = useState(false);

  // Onboarding mode selection modal if Demo client hasn't chosen mode yet
  const [selectingMode, setSelectingMode] = useState(null);

  const fetchPlans = async () => {
    try {
      const res = await fetch(`/api/plans?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      if (!data.error) setPlans(data);
    } catch (e) {
      console.error("Error loading plans:", e);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/client/profile?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      if (!data.error) setProfile(data);
    } catch (e) {
      console.error("Error loading profile:", e);
    }
  };

  useEffect(() => {
    Promise.all([fetchPlans(), fetchProfile()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleSelectMode = async (isSimple) => {
    setSelectingMode(isSimple ? "simple" : "erp");
    try {
      const res = await fetch("/api/client/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ isSimpleVersion: isSimple, hasSelectedMode: true })
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile({ ...updated, isSimpleVersion: isSimple, hasSelectedMode: true });
        await fetchPlans();
      } else {
        setProfile(prev => prev ? { ...prev, isSimpleVersion: isSimple, hasSelectedMode: true } : prev);
      }
    } catch (e) {
      console.error("Error selecting mode:", e);
      setProfile(prev => prev ? { ...prev, isSimpleVersion: isSimple, hasSelectedMode: true } : prev);
    } finally {
      setSelectingMode(null);
    }
  };

  const handleSendErpRequest = async () => {
    setSendingErpInfo(true);
    try {
      const res = await fetch("/api/client/request-erp-info", {
        method: "POST"
      });
      if (res.ok) {
        setErpInfoSent(true);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || t('alerts.request_error') || "Error al enviar la solicitud");
      }
    } catch (e) {
      console.error("Error requesting ERP info:", e);
      alert(t('plans.error_connection'));
    } finally {
      setSendingErpInfo(false);
    }
  };

  const handleSubscribe = async (planId) => {
    setSubmitting(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingCycle }),
      });
      
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || t('plans.error_payment'));
      }
    } catch (e) {
      console.error("Fetch error:", e);
      alert(t('plans.error_connection'));
    } finally {
      setSubmitting(null);
    }
  };

  const getPlanBadge = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes('erp')) return t('plans.badge_erp_unlimited') || "Todo Ilimitado · Gestión ERP Completa";
    if (name.includes('básico') || name.includes('basic')) return t('plans.badges.starting');
    if (name.includes('premium')) return t('plans.badges.popular');
    if (name.includes('gold')) return t('plans.badges.producers');
    return null;
  };

  const formatPlanPrice = (amount) => {
    const num = Number(amount) || 0;
    return Number.isInteger(num) ? `${num}` : num.toFixed(2);
  };

  const userCurrentBillingCycle = (() => {
    if (profile?.billingCycle) return profile.billingCycle;
    if (!profile?.planId || !profile?.stripePriceId) return null;
    const currentPlan = plans.find(p => p.id === profile.planId) || profile?.plan;
    if (!currentPlan) return null;
    if (profile.stripePriceId === currentPlan.stripePriceIdMonthly) return "monthly";
    if (
      profile.stripePriceId === currentPlan.stripePriceIdYearly ||
      profile.stripePriceId === currentPlan.stripePriceId
    ) return "yearly";
    return null;
  })();

  const isUserOnDemo = !profile?.planId || (profile?.plan?.name && profile.plan.name.toLowerCase().includes('demo'));
  const isLegacyPaidClient = profile?.plan?.planGroup === "LEGACY" || ["2", "3", "4"].includes(String(profile?.planId));
  const needsModeSelection = profile && isUserOnDemo && !profile.hasSelectedMode;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <Loader2 className="animate-spin" size={48} color="var(--corp-green)" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/dashboard" style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              color: 'var(--text-muted)', textDecoration: 'none', 
              fontWeight: '600', fontSize: '0.9rem',
              padding: '0.5rem 1rem', background: 'white', 
              borderRadius: '0.75rem', border: '1px solid var(--border)',
              transition: 'all 0.2s'
            }}>
              <ArrowLeft size={18} /> {t('plans.back_to_dashboard')}
            </Link>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>{t('plans.title')}</h1>
              <p style={{ color: 'var(--text-muted)', fontWeight: '500', margin: 0 }}>{t('plans.subtitle')}</p>
            </div>
          </div>

          {profile?.isSimpleVersion && !isLegacyPaidClient && (
            <button
              type="button"
              onClick={() => {
                setErpInfoSent(false);
                setShowErpInfoModal(true);
              }}
              style={{
                padding: '0.85rem 1.35rem',
                borderRadius: '0.9rem',
                border: '2px solid var(--corp-green)',
                background: 'linear-gradient(135deg, #426216 0%, #2d450c 100%)',
                color: 'white',
                fontWeight: '800',
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 8px 18px -4px rgba(66, 98, 22, 0.35)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <Crown size={18} />
              <span>{t('plans.need_more_complete_btn') || "Si necesitas un software más completo, haz clic aquí"}</span>
            </button>
          )}
        </div>

        {/* Referral Discount Banner */}
        {profile?.referredById && (
          <div className="glass-card" style={{ 
            background: 'rgba(66, 98, 22, 0.05)', 
            border: '2px dashed var(--corp-green)', 
            padding: '1.5rem', 
            borderRadius: '1.5rem', 
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            animation: 'fadeIn 0.5s ease'
          }}>
            <div style={{ background: 'var(--corp-green)', color: 'white', padding: '0.75rem', borderRadius: '50%', display: 'flex' }}>
              <Zap size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: 'var(--corp-green)' }}>
                {t('plans.referral_discount_banner')}
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                {t('plans.referral_discount_applied_desc')}
              </p>
            </div>
          </div>
        )}

        {/* Billing Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            background: 'white', padding: '0.4rem', borderRadius: '1rem', 
            border: '1px solid var(--border)', display: 'flex', gap: '0.25rem' 
          }}>
            <button 
              onClick={() => setBillingCycle("monthly")}
              style={{
                padding: '0.6rem 1.5rem', borderRadius: '0.75rem', border: 'none',
                fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer',
                background: billingCycle === "monthly" ? 'var(--corp-green)' : 'transparent',
                color: billingCycle === "monthly" ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              {t('plans.monthly_label').toUpperCase()}
            </button>
            <button 
              onClick={() => setBillingCycle("yearly")}
              style={{
                padding: '0.6rem 1.5rem', borderRadius: '0.75rem', border: 'none',
                fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer',
                background: billingCycle === "yearly" ? 'var(--corp-green)' : 'transparent',
                color: billingCycle === "yearly" ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              {t('plans.yearly_label').toUpperCase()}
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem',
          alignItems: 'stretch',
          maxWidth: plans.length <= 2 ? '820px' : '1200px',
          margin: '0 auto'
        }}>
          {plans.map((plan) => {
            const isDemo = plan.name.toLowerCase().includes('demo');
            const isSamePlan = profile?.planId === plan.id;

            const isCurrentPlan = isUserOnDemo 
              ? isDemo 
              : (isSamePlan && (userCurrentBillingCycle ? userCurrentBillingCycle === billingCycle : true));

            const isSamePlanDifferentCycle = isSamePlan && !isCurrentPlan && !!userCurrentBillingCycle;
            const badge = getPlanBadge(plan.name);
            const discountFactor = profile?.referredById ? 0.95 : 1;
            const monthlyDisplay = formatPlanPrice(plan.priceMonthly * discountFactor);
            const yearlyDisplay = formatPlanPrice(plan.priceYearly * discountFactor);
            
            return (
              <div key={plan.id} className="glass-card plan-card" style={{ 
                padding: '2.5rem', 
                background: 'white', 
                border: isCurrentPlan ? '2px solid var(--corp-green)' : (isSamePlanDifferentCycle ? '2px dashed var(--corp-green)' : '1px solid var(--border)'),
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: isCurrentPlan ? '0 20px 25px -5px rgba(66, 98, 22, 0.1)' : '0 10px 15px -3px rgba(0,0,0,0.1)'
              }}>
                {!isDemo && badge && (
                  <div style={{ 
                    position: 'absolute', top: '-12px', right: '1rem', left: '1rem',
                    background: 'var(--corp-green)', color: 'white',
                    padding: '0.25rem 1rem', borderRadius: '1rem',
                    fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase',
                    textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    {badge}
                  </div>
                )}
                
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>{plan.name}</h2>
                    {isSamePlanDifferentCycle && (
                      <span style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: '800', 
                        background: 'rgba(66, 98, 22, 0.1)', 
                        color: 'var(--corp-green)', 
                        padding: '0.25rem 0.6rem', 
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(66, 98, 22, 0.2)'
                      }}>
                        {billingCycle === "yearly" 
                          ? (t('plans.currently_monthly') || "Tu plan actual (modalidad mensual)") 
                          : (t('plans.currently_yearly') || "Tu plan actual (modalidad anual)")
                        }
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {profile?.referredById && (plan.priceMonthly > 0 || plan.priceYearly > 0) && (
                        <span style={{ fontSize: '1rem', textDecoration: 'line-through', color: 'var(--text-muted)', fontWeight: '600' }}>
                          {billingCycle === "monthly" ? `${plan.priceMonthly}€` : `${plan.priceYearly}€`}
                        </span>
                      )}
                      <span style={{ fontSize: '2.5rem', fontWeight: '900', color: isCurrentPlan ? 'var(--corp-green)' : 'var(--text-main)' }}>
                        {billingCycle === "monthly" 
                          ? (plan.priceMonthly === 0 ? t('plans.free') : `${monthlyDisplay}€`)
                          : (plan.priceYearly === 0 ? t('plans.free') : `${yearlyDisplay}€`)
                        }
                      </span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>
                      {billingCycle === "monthly" ? t('plans.monthly') : t('plans.yearly')}
                    </span>
                  </div>

                  {/* Annual savings clickable message when viewing monthly */}
                  {billingCycle === "monthly" && plan.priceYearly > 0 && (
                    <button
                      type="button"
                      onClick={() => setBillingCycle("yearly")}
                      style={{
                        marginTop: '0.85rem',
                        padding: '0.55rem 0.8rem',
                        background: 'rgba(66, 98, 22, 0.08)',
                        border: '1.5px dashed var(--corp-green)',
                        borderRadius: '0.65rem',
                        color: 'var(--corp-green)',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        textAlign: 'left',
                        cursor: 'pointer',
                        lineHeight: '1.35',
                        width: '100%',
                        display: 'block',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      💡 {(t('plans.annual_savings_hint') || "Opción anual por {yearlyPrice}€ / año — ¡Ahorra 2 meses seleccionando aquí la opción anual!")
                        .replace('{yearlyPrice}', yearlyDisplay)}
                    </button>
                  )}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                  <FeatureItem icon={<ChefHat size={18}/>} label={t('plans.recipes')} val={plan.recipesLimit} t={t} />
                  <FeatureItem icon={<History size={18}/>} label={t('plans.elaborations')} val={null} t={t} />
                  <FeatureToggle icon={<Brush size={18}/>} label={t('plans.cleaning')} active={plan.hasCleaning} limit={null} t={t} />
                  <FeatureToggle icon={<Package size={18}/>} label={t('plans.goods')} active={plan.hasGoods} limit={isDemo ? (plan.goodsLimit || 10) : null} t={t} />
                  <FeatureToggle icon={<Thermometer size={18}/>} label={t('plans.temperatures')} active={plan.hasTemperatures} limit={null} t={t} />
                  <FeatureToggle icon={<Droplets size={18}/>} label={t('plans.water')} active={plan.hasWater} limit={null} t={t} />
                  <FeatureToggle icon={<Truck size={18}/>} label={t('plans.providers')} active={plan.hasProviders} t={t} />
                </div>

                {!isCurrentPlan && isDemo && profile?.planId && (
                  <div style={{ height: '3.5rem' }}></div>
                )}

                {!(isDemo && profile?.planId && !isCurrentPlan) && (
                  <button 
                    onClick={() => !isCurrentPlan && handleSubscribe(plan.id)}
                    disabled={submitting === plan.id || isCurrentPlan}
                    className={isCurrentPlan ? "btn-secondary" : "btn-primary"} 
                    style={{ 
                      width: '100%', padding: '1rem', borderRadius: '1rem', 
                      fontSize: '1rem', fontWeight: '800', textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      cursor: (isCurrentPlan || submitting === plan.id) ? 'not-allowed' : 'pointer',
                      opacity: (isCurrentPlan || submitting === plan.id) ? 0.7 : 1
                    }}
                  >
                    {submitting === plan.id ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : isCurrentPlan ? (
                      t('plans.current_plan')
                    ) : isSamePlanDifferentCycle && billingCycle === "yearly" ? (
                      t('plans.switch_to_yearly') || "Pasar a Pago Anual"
                    ) : isSamePlanDifferentCycle && billingCycle === "monthly" ? (
                      t('plans.switch_to_monthly') || "Pasar a Pago Mensual"
                    ) : (
                      t('plans.subscribe')
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA for Simple Mode users */}
        {profile?.isSimpleVersion && !isLegacyPaidClient && (
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setErpInfoSent(false);
                setShowErpInfoModal(true);
              }}
              style={{
                padding: '1rem 2rem',
                borderRadius: '1rem',
                border: '2px solid var(--corp-green)',
                background: 'white',
                color: 'var(--corp-green)',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 4px 12px rgba(66, 98, 22, 0.1)',
                transition: 'all 0.2s ease'
              }}
            >
              <Crown size={20} />
              <span>{t('plans.need_more_complete_btn') || "Si necesitas un software más completo, haz clic aquí"}</span>
            </button>
          </div>
        )}

        {/* Contact info */}
        <div style={{ marginTop: '4rem', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '2rem', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem' }}>{t('plans.custom_plan_title')}</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
            {t('plans.custom_plan_desc')}
          </p>
          <a href="mailto:soporte@quicktrace.es" className="btn-secondary" style={{ display: 'inline-block', padding: '0.75rem 2rem', textDecoration: 'none' }}> {t('plans.contact_sales')} </a>
        </div>
      </div>

      {/* Popup: Request Complete ERP Software Info */}
      {showErpInfoModal && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="modal-content glass-card" style={{ maxWidth: '520px', width: '92%', padding: '2.25rem', background: 'white', textAlign: 'center', position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowErpInfoModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>

            {erpInfoSent ? (
              <div style={{ padding: '1rem 0' }}>
                <CheckCircle2 size={56} color="var(--corp-green)" style={{ margin: '0 auto 1.25rem' }} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                  {t('plans.erp_upgrade_sent_success') || "¡Mensaje enviado! Nuestro equipo de ventas se pondrá en contacto contigo muy pronto."}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowErpInfoModal(false)}
                  className="btn-primary"
                  style={{ marginTop: '1.25rem', padding: '0.75rem 2rem', borderRadius: '0.75rem', fontWeight: '800' }}
                >
                  {t('common.close') || "Cerrar"}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(66, 98, 22, 0.1)', color: 'var(--corp-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <Crown size={28} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem' }}>
                  {t('plans.erp_upgrade_modal_title') || "¿Quieres probar nuestra solución ERP completa?"}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
                  {t('plans.erp_upgrade_modal_desc') || "Vamos a enviar un email a nuestro equipo de ventas para que te llamen y te informen sin compromiso para probar el software ERP más completo. ¿Quieres enviar el mensaje?"}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setShowErpInfoModal(false)}
                    disabled={sendingErpInfo}
                    className="btn-secondary"
                    style={{ flex: 1, minWidth: '140px', padding: '0.85rem 1.25rem', borderRadius: '0.75rem', fontWeight: '700' }}
                  >
                    {t('common.cancel') || "Cancelar"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSendErpRequest}
                    disabled={sendingErpInfo}
                    className="btn-primary"
                    style={{ flex: 1, minWidth: '160px', padding: '0.85rem 1.25rem', borderRadius: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    {sendingErpInfo ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    <span>{t('plans.erp_upgrade_modal_confirm') || "Sí, enviar mensaje"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Onboarding Video Modal if Demo user hasn't chosen mode yet */}
      {needsModeSelection && (
        <div className="modal-overlay" style={{ zIndex: 11000 }}>
          <div className="modal-content glass-card" style={{ width: '95%', maxWidth: '720px', padding: '2.25rem', background: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--corp-green)', marginBottom: '1.25rem' }}>
              {t('auth.onboarding_title') || "¡Bienvenido a QuickTrace! Elige cómo quieres empezar"}
            </h2>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', background: '#0f172a' }}>
              <iframe
                src="https://www.youtube.com/embed/75XEViseAA4?rel=0"
                title="QuickTrace Onboarding Video"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <button
                type="button"
                onClick={() => handleSelectMode(false)}
                disabled={selectingMode !== null}
                className="btn-primary"
                style={{ width: '100%', padding: '1rem 1.5rem', fontSize: '1rem', fontWeight: '800', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
              >
                {selectingMode === "erp" && <Loader2 size={18} className="animate-spin" />}
                <span>{t('auth.btn_erp_full') || "Quiero una solución ERP completa"}</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectMode(true)}
                disabled={selectingMode !== null}
                style={{ width: '100%', padding: '1rem 1.5rem', fontSize: '1rem', fontWeight: '800', borderRadius: '0.75rem', border: '2px solid var(--corp-green)', background: 'white', color: 'var(--corp-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', cursor: 'pointer' }}
              >
                {selectingMode === "simple" && <Loader2 size={18} className="animate-spin" />}
                <span>{t('auth.btn_simple_version') || "Quiero la versión sencilla para llevar mis registros"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .plan-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .plan-card:hover {
          transform: translateY(-5px);
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function FeatureItem({ icon, label, val, t }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ color: 'var(--corp-green)' }}>{icon}</div>
      <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-main)' }}>{label}</div>
      <div style={{ fontWeight: '800', color: 'var(--corp-green)', fontSize: '0.9rem' }}>
        {val || t('plans.unlimited')}
      </div>
    </div>
  );
}

function FeatureToggle({ icon, label, active, limit, t }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: active ? 1 : 0.4 }}>
      <div style={{ color: active ? 'var(--corp-green)' : 'var(--text-muted)' }}>{icon}</div>
      <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: '500', color: active ? 'var(--text-main)' : 'var(--text-muted)' }}>{label}</div>
      {active ? (
        <div style={{ fontWeight: '800', color: 'var(--corp-green)', fontSize: '0.9rem' }}>
          {limit || t('plans.unlimited_feature')}
        </div>
      ) : (
        <X size={18} color="#ef4444" />
      )}
    </div>
  );
}
