"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, CheckCircle2, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import Image from "next/image";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("Token de verificación no encontrado.");
      setVerifying(false);
      return;
    }
    setVerifying(false);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Error al verificar la cuenta");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return <div style={{ textAlign: 'center' }}><Loader2 className="animate-spin" size={40} color="var(--corp-green)" /></div>;
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <CheckCircle2 size={40} color="#166534" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem' }}>¡Email Verificado!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión.</p>
        <button onClick={() => router.push("/login")} className="btn-primary" style={{ width: '100%' }}>
          Ir al Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ width: '60px', height: '60px', background: 'rgba(66, 98, 22, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <ShieldCheck size={32} color="var(--corp-green)" />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Configura tu Contraseña</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Verifica tu email y establece una contraseña para tu cuenta</p>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.85rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label className="label">Nueva Contraseña</label>
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              type="password" className="input-field" style={{ paddingLeft: '2.75rem' }} required minLength={6}
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <label className="label">Confirmar Contraseña</label>
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              type="password" className="input-field" style={{ paddingLeft: '2.75rem' }} required minLength={6}
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', fontSize: '1rem', padding: '1rem' }}>
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Activar mi cuenta"}
        </button>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', padding: '1.5rem'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '3rem', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
           <div style={{ position: 'relative', width: '100px', height: '40px', margin: '0 auto' }}>
              <Image src="/images/logo.png" alt="QuickTrace" fill style={{ objectFit: 'contain' }} priority />
           </div>
        </div>
        <Suspense fallback={<div style={{ textAlign: 'center' }}><Loader2 className="animate-spin" size={40} color="var(--corp-green)" /></div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
