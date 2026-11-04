"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function VerifyEmailContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError(t('verify_email.error_no_token') || "No se ha proporcionado un token de verificación.");
      setLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setSuccess(true);
        } else {
          setError(data.error || t('verify_email.error_verifying') || "Token inválido o cuenta ya verificada");
        }
      } catch (err) {
        setError(t('common.error_connection') || "Error de conexión al verificar el email.");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, t]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <Loader2 className="animate-spin" size={48} color="var(--corp-green)" style={{ margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Verificando tu cuenta...
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Un momento por favor, estamos activando tu acceso.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle2 size={44} color="#166534" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          ¡Cuenta y email verificados con éxito!
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: '2rem' }}>
          Tu dirección de correo electrónico ha sido confirmada. Ya tienes acceso completo a todas las herramientas de QuickTrace, incluyendo las funciones de Inteligencia Artificial.
        </p>
        <button onClick={() => router.push("/dashboard")} className="btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: '800' }}>
          Ir al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <AlertCircle size={44} color="#dc2626" />
      </div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
        Enlace no válido o cuenta ya verificada
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: '2rem' }}>
        {error || "Este enlace de verificación ya ha sido utilizado o ha expirado. Si tu cuenta ya está verificada, puedes acceder directamente."}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button onClick={() => router.push("/dashboard")} className="btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: '800' }}>
          Ir al Dashboard
        </button>
        <button onClick={() => router.push("/login")} style={{ width: '100%', padding: '0.75rem', background: 'none', border: 'none', color: '#64748b', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>
          Volver al Login
        </button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', padding: '1.5rem'
    }}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <LanguageSwitcher />
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '460px', padding: '3rem', background: 'white', borderRadius: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
           <div style={{ position: 'relative', width: '100px', height: '40px', margin: '0 auto' }}>
              <Image src="/images/logo.jpg" alt="QuickTrace" fill style={{ objectFit: 'contain' }} priority />
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
