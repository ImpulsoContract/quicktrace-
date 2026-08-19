'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to our logging API
    fetch('/api/client/log-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        errorName: error?.name || 'Error',
        errorMessage: error?.message || 'Unknown client-side exception',
        errorStack: error?.stack || '',
        url: typeof window !== 'undefined' ? window.location.href : '',
      }),
    }).catch((err) => {
      console.error('Failed to log error to server:', err);
    });
  }, [error]);

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(circle at center, #fafafa 0%, #f4f4f5 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '550px',
        width: '100%',
        padding: '3rem',
        borderRadius: '1.5rem',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(228, 228, 231, 0.8)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <div style={{
          background: '#fef2f2',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #fee2e2',
          boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.1)'
        }}>
          <AlertTriangle size={36} color="#dc2626" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: '900',
            color: '#18181b',
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: '1.3'
          }}>
            Se ha producido un error.
          </h2>
          
          <p style={{
            color: '#71717a',
            fontSize: '1rem',
            lineHeight: '1.6',
            margin: 0,
            fontWeight: '500'
          }}>
            Nuestro sistema ha enviado una alerta a los técnicos para que lo resuelvan lo antes posible.
          </p>

          <p style={{
            color: '#71717a',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            margin: '0.5rem 0 0 0',
            fontWeight: '400'
          }}>
            Si esto es urgente y quieres hablar con un técnico, puedes hacerlo ahora mismo por whatsapp.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
          <a
            href="https://wa.link/dk21p5"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '1rem',
              background: '#25d366',
              color: 'white',
              fontWeight: '800',
              fontSize: '1.05rem',
              borderRadius: '0.85rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#22c35e';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#25d366';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 211, 102, 0.3)';
            }}
          >
            {/* Custom premium WhatsApp SVG icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ fill: 'currentColor' }}>
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            Hablar por whatsapp
          </a>

          <button
            onClick={() => reset()}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: 'transparent',
              color: '#52525b',
              border: '1px solid #e4e4e7',
              fontWeight: '600',
              fontSize: '0.95rem',
              borderRadius: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxSizing: 'border-box'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#f4f4f5';
              e.currentTarget.style.color = '#18181b';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#52525b';
            }}
          >
            Recargar la página
          </button>
        </div>
      </div>
    </div>
  );
}
