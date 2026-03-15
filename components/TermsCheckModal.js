"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

export default function TermsCheckModal() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.role === 'CLIENT') {
      fetch('/api/client/terms-status')
        .then(res => res.json())
        .then(data => {
          if (data.pendingTermsUpdate) {
            setShowModal(true);
            document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
          }
        })
        .catch(err => console.error("Error checking terms status", err));
    }
  }, [session]);

  const handleAccept = async () => {
    if (!accepted) return;
    setLoading(true);
    try {
      const res = await fetch('/api/client/accept-terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termsAccepted: true })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        document.body.style.overflow = ''; // Restaurar scroll
      } else {
        alert(data.error || "Ocurrió un error. Inténtalo de nuevo.");
      }
    } catch (e) {
      alert("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 999999, // Garantizar que esté por encima de todo
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1.25rem',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '550px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={28} color="#ea580c" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Actualización Legal</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0.25rem 0 0 0' }}>Es necesaria tu revisión</p>
          </div>
        </div>

        <div style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            Hemos actualizado nuestras Condiciones Generales de Uso y la Política de Privacidad de QuickTrace. 
          </p>
          <p>
            Para continuar usando la plataforma y acceder a todos tus datos y registros, es requisito informático y legal que leas y aceptes las nuevas condiciones.
          </p>
        </div>

        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              style={{ width: '22px', height: '22px', accentColor: 'var(--corp-green)', marginTop: '0.15rem', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
              He leído y acepto las nuevas <a href="https://quicktrace.es/condiciones-de-uso/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--corp-green)', fontWeight: '700', textDecoration: 'none' }}>Condiciones de Uso</a> y la <a href="https://quicktrace.es/politica-privacidad/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--corp-green)', fontWeight: '700', textDecoration: 'none' }}>Política de Privacidad</a> de QuickTrace.
            </span>
          </label>
        </div>

        <button 
          onClick={handleAccept}
          disabled={!accepted || loading}
          className="btn-primary" 
          style={{ 
            width: '100%', 
            padding: '1.15rem', 
            fontSize: '1.1rem', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '0.75rem',
            opacity: (!accepted || loading) ? 0.6 : 1
          }}
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : (
            <>Continuar a mi panel de control <ArrowRight size={20} /></>
          )}
        </button>
      </div>
    </div>
  );
}
