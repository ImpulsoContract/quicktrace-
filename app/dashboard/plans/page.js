"use client";

import { useState, useEffect } from "react";
import { 
  Check, X, Crown, Star, 
  Zap, Shield, Plus, ArrowLeft,
  ChefHat, Thermometer, Brush, Package, History, Loader2
} from "lucide-react";
import Link from "next/link";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <ArrowLeft size={18} /> Volver al Dashboard
          </Link>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>Planes de Precios</h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Elige el plan que mejor se adapte a tu negocio</p>
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
                {!isDemo && (
                  <div style={{ 
                    position: 'absolute', top: '-12px', right: '2rem',
                    background: 'var(--corp-green)', color: 'white',
                    padding: '0.25rem 1rem', borderRadius: '1rem',
                    fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase'
                  }}>
                    Popular
                  </div>
                )}
                
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '0.5rem' }}>{plan.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: '900', color: isDemo ? 'var(--text-main)' : 'var(--corp-green)' }}>
                      {plan.priceYearly === 0 ? "Gratis" : `${plan.priceYearly}€`}
                    </span>
                    {plan.priceYearly > 0 && <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>/ año</span>}
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                  <FeatureItem icon={<ChefHat size={18}/>} label="Recetas" val={plan.recipesLimit} />
                  <FeatureItem icon={<History size={18}/>} label="Elaboraciones" val={plan.elaborationsLimit} />
                  <FeatureToggle icon={<Brush size={18}/>} label="Módulo Limpieza" active={plan.hasCleaning} limit={plan.cleaningLimit} />
                  <FeatureToggle icon={<Package size={18}/>} label="Entradas Mercancías" active={plan.hasGoods} limit={plan.goodsLimit} />
                  <FeatureToggle icon={<Thermometer size={18}/>} label="Control Temperatura" active={plan.hasTemperatures} limit={plan.temperaturesLimit} />
                </div>

                <button className={isDemo ? "btn-secondary" : "btn-primary"} style={{ 
                  width: '100%', padding: '1rem', borderRadius: '1rem', 
                  fontSize: '1rem', fontWeight: '800', textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {isDemo ? "Plan Actual" : "Contratar Plan"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Contact info */}
        <div style={{ marginTop: '4rem', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '2rem', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem' }}>¿Necesitas un plan personalizado?</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Si tu negocio tiene necesidades específicas o requieres un volumen mayor de registros, contacta con nosotros para diseñar un plan a tu medida.
          </p>
          <a href="mailto:soporte@quicktrace.es" className="btn-secondary" style={{ display: 'inline-block', padding: '0.75rem 2rem', textDecoration: 'none' }}> Contactar con Ventas </a>
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

function FeatureItem({ icon, label, val }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ color: 'var(--corp-green)' }}>{icon}</div>
      <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-main)' }}>{label}</div>
      <div style={{ fontWeight: '800', color: 'var(--corp-green)', fontSize: '0.9rem' }}>{val || "Ilimitadas"}</div>
    </div>
  );
}

function FeatureToggle({ icon, label, active, limit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: active ? 1 : 0.4 }}>
      <div style={{ color: active ? 'var(--corp-green)' : 'var(--text-muted)' }}>{icon}</div>
      <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: '500', color: active ? 'var(--text-main)' : 'var(--text-muted)' }}>{label}</div>
      {active ? (
        <div style={{ fontWeight: '800', color: 'var(--corp-green)', fontSize: '0.9rem' }}>{limit || "Ilimitado"}</div>
      ) : (
        <X size={18} color="#ef4444" />
      )}
    </div>
  );
}
