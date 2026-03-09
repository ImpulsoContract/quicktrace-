"use client";

import { useState } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Error al procesar la solicitud");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', padding: '1.5rem'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '3rem', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
             <Image src="/images/logo.jpg" alt="QuickTrace" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Recuperar Contraseña</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Te enviaremos un enlace para restablecer tu acceso</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle2 size={32} color="#166534" />
            </div>
            <p style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '1rem' }}>¡Correo enviado!</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Si el email existe en nuestro sistema, recibirás instrucciones en breve.</p>
            <Link href="/login" style={{ color: 'var(--corp-green)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={18} /> Volver al Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.85rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="label">Tu Email Corporativo</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                  <input 
                    type="email" className="input-field" style={{ paddingLeft: '2.75rem' }} value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@negocio.com"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', fontSize: '1rem', padding: '1rem' }}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Enviar enlace de recuperación"}
              </button>

              <Link href="/login" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none', marginTop: '1rem' }}>
                Cancelar y volver
              </Link>
            </form>
          </>
        )}
      </div>
      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
