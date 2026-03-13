"use client";

import { useState, useEffect } from "react";
import { 
  Check, X, Crown, Star, 
  Zap, Shield, Plus, ArrowLeft,
  ChefHat, Thermometer, Brush, Package, History, Loader2
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function PlansPage() {
  const { t } = useI18n();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [billingCycle, setBillingCycle] = useState("yearly"); // "monthly" or "yearly"

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/plans");
        const data = await res.json();
        if (!data.error) {
          setPlans(data);
        }
      } catch (e) {
        console.error("Error loading plans:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

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
    if (name.includes('básico') || name.includes('basic')) return t('plans.badges.starting');
    if (name.includes('premium')) return t('plans.badges.popular');
    if (name.includes('gold')) return t('plans.badges.producers');
    return null;
  };

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
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{t('plans.subtitle')}</p>
          </div>
        </div>

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
          alignItems: 'stretch'
        }}>
          {plans.map((plan) => {
            const isDemo = plan.name.toLowerCase().includes('demo');
            const badge = getPlanBadge(plan.name);
            
            return (
              <div key={plan.id} className="glass-card plan-card" style={{ 
                padding: '2.5rem', 
                background: 'white', 
                border: isDemo ? '1px solid var(--border)' : '2px solid var(--corp-green)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: isDemo ? '0 10px 15px -3px rgba(0,0,0,0.1)' : '0 20px 25px -5px rgba(66, 98, 22, 0.1)'
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
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '0.5rem' }}>{plan.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: '900', color: isDemo ? 'var(--text-main)' : 'var(--corp-green)' }}>
                      {billingCycle === "monthly" 
                        ? (plan.priceMonthly === 0 ? t('plans.free') : `${plan.priceMonthly}€`)
                        : (plan.priceYearly === 0 ? t('plans.free') : `${plan.priceYearly}€`)
                      }
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>
                      {billingCycle === "monthly" ? t('plans.monthly') : t('plans.yearly')}
                    </span>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                  <FeatureItem icon={<ChefHat size={18}/>} label={t('plans.recipes')} val={plan.recipesLimit} t={t} />
                  <FeatureItem icon={<History size={18}/>} label={t('plans.elaborations')} val={plan.elaborationsLimit} t={t} showAsterisk={true} />
                  <FeatureToggle icon={<Brush size={18}/>} label={t('plans.cleaning')} active={plan.hasCleaning} limit={plan.cleaningLimit} t={t} showAsterisk={true} />
                  <FeatureToggle icon={<Package size={18}/>} label={t('plans.goods')} active={plan.hasGoods} limit={plan.goodsLimit} t={t} showAsterisk={true} />
                  <FeatureToggle icon={<Thermometer size={18}/>} label={t('plans.temperatures')} active={plan.hasTemperatures} limit={plan.temperaturesLimit} t={t} showAsterisk={true} />
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                  * Podrás exportar tu registros y eliminarlos cuando llegues al límite para ponerlo a cero cuando quieras. Así no tendrás ninguna limitación.
                </div>

                <button 
                  onClick={() => !isDemo && handleSubscribe(plan.id)}
                  disabled={submitting === plan.id}
                  className={isDemo ? "btn-secondary" : "btn-primary"} 
                  style={{ 
                    width: '100%', padding: '1rem', borderRadius: '1rem', 
                    fontSize: '1rem', fontWeight: '800', textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    cursor: (isDemo || submitting === plan.id) ? 'not-allowed' : 'pointer',
                    opacity: (isDemo || submitting === plan.id) ? 0.7 : 1
                  }}
                >
                  {submitting === plan.id ? <Loader2 className="animate-spin" size={20} /> : (isDemo ? t('plans.current_plan') : t('plans.subscribe'))}
                </button>
              </div>
            );
          })}
        </div>

        {/* Contact info */}
        <div style={{ marginTop: '4rem', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '2rem', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem' }}>{t('plans.custom_plan_title')}</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
            {t('plans.custom_plan_desc')}
          </p>
          <a href="mailto:soporte@quicktrace.es" className="btn-secondary" style={{ display: 'inline-block', padding: '0.75rem 2rem', textDecoration: 'none' }}> {t('plans.contact_sales')} </a>
        </div>
      </div>

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

function FeatureItem({ icon, label, val, t, showAsterisk }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ color: 'var(--corp-green)' }}>{icon}</div>
      <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-main)' }}>{label}</div>
      <div style={{ fontWeight: '800', color: 'var(--corp-green)', fontSize: '0.9rem' }}>
        {val || t('plans.unlimited')}
        {showAsterisk && val && "*"}
      </div>
    </div>
  );
}

function FeatureToggle({ icon, label, active, limit, t, showAsterisk }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: active ? 1 : 0.4 }}>
      <div style={{ color: active ? 'var(--corp-green)' : 'var(--text-muted)' }}>{icon}</div>
      <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: '500', color: active ? 'var(--text-main)' : 'var(--text-muted)' }}>{label}</div>
      {active ? (
        <div style={{ fontWeight: '800', color: 'var(--corp-green)', fontSize: '0.9rem' }}>
          {limit || t('plans.unlimited_feature')}
          {showAsterisk && limit && "*"}
        </div>
      ) : (
        <X size={18} color="#ef4444" />
      )}
    </div>
  );
}
