"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result.error) {
        setError(t('auth.error_invalid'));
      } else {
        // Obtener la sesión para conocer el rol
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        
        if (session?.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (err) {
      setError(t('auth.error_generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', padding: '1.5rem'
    }}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <LanguageSwitcher />
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '3rem', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 1.5rem' }}>
             <Image 
               src="/images/logo.jpg" 
               alt="QuickTrace" 
               fill 
               style={{ objectFit: 'contain' }}
               priority
             />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--corp-green)', marginBottom: '0.25rem' }}>
            {t('auth.welcome')}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('auth.login_platform')}</p>
        </div>

        {error && (
          <div style={{ 
            background: '#fef2f2', border: '1px solid #fee2e2',
            color: '#dc2626', padding: '0.85rem', borderRadius: '0.5rem', marginBottom: '1.5rem',
            fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500'
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{t('auth.email')}</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input 
                type="email" 
                className="input-field" 
                style={{ paddingLeft: '2.75rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('auth.email_placeholder')}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{t('auth.password')}</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field" 
                style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t('auth.password_placeholder')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--corp-green)'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.75rem' }}>
            <Link href="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--corp-green)', fontWeight: '600', textDecoration: 'none' }}>
              {t('auth.forgot_password')}
            </Link>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', fontSize: '1rem', padding: '0.9rem' }}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : t('auth.login_submit')}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            {t('auth.no_account')} <Link href="/register" style={{ color: 'var(--corp-green)', fontWeight: '700', textDecoration: 'none' }}>{t('auth.register_free')}</Link>
          </p>
        </form>
      </div>
      
      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
