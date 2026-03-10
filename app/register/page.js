"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Building2, Phone, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function RegisterPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    razonSocial: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || t('register.error_processing'));
      }
    } catch (err) {
      setError(t('register.error_connection'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ 
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f8fafc', padding: '1.5rem'
      }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '3rem', background: 'white', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <CheckCircle2 size={40} color="#166534" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem' }}>{t('register.success_title')}</h2>
          <p 
            style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}
            dangerouslySetInnerHTML={{ __html: t('register.success_desc').replace('{email}', formData.email) }}
          />
          <button onClick={() => router.push("/login")} className="btn-primary" style={{ width: '100%' }}>
            {t('register.back_to_login')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', padding: '1.5rem'
    }}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <LanguageSwitcher />
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '3rem', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
             <Image src="/images/logo.jpg" alt="QuickTrace" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--corp-green)', marginBottom: '0.25rem' }}>{t('register.title')}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('register.subtitle')}</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.85rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="label">{t('register.person_name')}</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input 
                type="text" className="input-field" style={{ paddingLeft: '2.75rem' }} required
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder={t('register.person_placeholder')}
              />
            </div>
          </div>

          <div>
            <label className="label">{t('register.email_label')}</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input 
                type="email" className="input-field" style={{ paddingLeft: '2.75rem' }} required
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder={t('register.email_placeholder')}
              />
            </div>
          </div>

          <div>
            <label className="label">{t('register.business_name')}</label>
            <div style={{ position: 'relative' }}>
              <Building2 style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input 
                type="text" className="input-field" style={{ paddingLeft: '2.75rem' }} required
                value={formData.razonSocial} onChange={(e) => setFormData({...formData, razonSocial: e.target.value})}
                placeholder={t('register.business_placeholder')}
              />
            </div>
          </div>

          <div>
            <label className="label">{t('register.phone')}</label>
            <div style={{ position: 'relative' }}>
              <Phone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input 
                type="tel" className="input-field" style={{ paddingLeft: '2.75rem' }} required
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder={t('register.phone_placeholder')}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', fontSize: '1rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>{t('register.submit')} <ArrowRight size={20} /></>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            {t('register.have_account')} <Link href="/login" style={{ color: 'var(--corp-green)', fontWeight: '700', textDecoration: 'none' }}>{t('register.login_link')}</Link>
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
