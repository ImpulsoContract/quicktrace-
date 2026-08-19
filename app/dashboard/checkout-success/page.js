"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [status, setStatus] = useState('syncing'); // 'syncing', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setErrorMessage("No se encontró el identificador de la sesión de pago.");
      return;
    }

    const syncSubscription = async () => {
      try {
        const response = await fetch('/api/client/sync-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          // Meta Pixel Purchase Tracking
          if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Purchase', {
              value: data.value,
              currency: data.currency || 'EUR'
            });
          }

          // Google Ads Purchase Tracking
          if (typeof window !== 'undefined' && window.gtag) {
            const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-18129247983';
            const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL;
            if (adsId && label) {
              window.gtag('event', 'conversion', {
                'send_to': `${adsId}/${label}`,
                'value': data.value,
                'currency': data.currency || 'EUR',
                'transaction_id': sessionId
              });
            }
          }
        }
      } catch (error) {
        console.error("Sync Error:", error);
        setStatus('error');
        setErrorMessage(error.message);
      }
    };

    // Pequeño retraso para asegurar que los webhooks de Stripe hayan llegado si son más rápidos, y si no, forzamos nosotros
    const timer = setTimeout(() => {
      syncSubscription();
    }, 1500);

    return () => clearTimeout(timer);
  }, [sessionId]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: 'var(--bg-main)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div className="glass-card" style={{
        maxWidth: '500px',
        width: '100%',
        padding: '3rem 2rem',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
      }}>
        
        {status === 'syncing' && (
          <div style={{ animation: 'fadeIn 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', 
              background: '#f0fdf4', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 1.5rem' 
            }}>
              <Loader2 size={40} color="var(--corp-green)" className="animate-spin" />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem' }}>
              Finalizando tu compra...
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.5' }}>
              Estamos sincronizando tu nuevo plan con tu cuenta. Por favor, no cierres esta ventana.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ animation: 'slideUp 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', 
              background: '#f0fdf4', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 1.5rem' 
            }}>
              <CheckCircle size={40} color="var(--corp-green)" />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem' }}>
              ¡Gracias por tu confianza!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '2rem' }}>
              Tu plan ya está disponible. Disfruta de todos los beneficios desbloqueados.
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
            >
              Ir a mi Panel Principal
            </button>
          </div>
        )}

        {status === 'error' && (
          <div style={{ animation: 'slideUp 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', 
              background: '#fef2f2', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 1.5rem' 
            }}>
              <AlertCircle size={40} color="#ef4444" />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem' }}>
              Aviso sobre tu suscripción
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              Hemos registrado el pago, pero hubo un pequeño retraso al sincronizar tu perfil: <span style={{ fontWeight: 'bold' }}>{errorMessage}</span>
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
              No te preocupes. Nuestro equipo de soporte o el administrador puede forzar la sincronización en menos de 1 minuto desde el panel de administración.
            </p>
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <button 
                onClick={() => window.location.reload()}
                className="btn-secondary"
                style={{ flex: 1, padding: '1rem' }}
              >
                Reintentar
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="btn-primary"
                style={{ flex: 1, padding: '1rem' }}
              >
                Ir al Panel
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        :root {
          --corp-green: #3f6212;
          --bg-main: #f8fafc;
          --text-main: #0f172a;
          --text-muted: #64748b;
        }
        
        body {
          margin: 0;
          background-color: var(--bg-main);
        }

        .glass-card {
          border-radius: 1.5rem;
          border: 1px solid #e2e8f0;
        }

        .btn-primary {
          background: var(--corp-green);
          color: white;
          border-radius: 0.875rem;
          border: none;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-primary:hover {
          background: #365314;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(63, 98, 18, 0.2);
        }

        .btn-secondary {
          background: white;
          color: var(--text-main);
          border-radius: 0.875rem;
          border: 1.5px solid #e2e8f0;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #f1f5f9;
        }

        .animate-spin { animation: spin 1.5s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
       <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
          <Loader2 size={40} color="#3f6212" className="animate-spin" />
       </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
