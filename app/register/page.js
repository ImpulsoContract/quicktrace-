"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, Building2, Phone, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// Robust parameter extraction helper
function getManualQueryParam(key) {
  if (typeof window === "undefined") return "";
  
  try {
    const params = new URLSearchParams(window.location.search);
    const val = params.get(key);
    if (val) return val;
  } catch (e) {}

  try {
    const url = window.location.href;
    const name = key.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (results && results[2]) return decodeURIComponent(results[2].replace(/\+/g, ' '));
  } catch (e) {}

  return "";
}

// Cookie helpers
function setCookie(name, value, days) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  return "";
}

function RegisterForm() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({ name: "", email: "", razonSocial: "", phone: "", termsAccepted: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [utmData, setUtmData] = useState({
    utmSource: "", utmMedium: "", utmCampaign: "", utmContent: "", utmTerm: "",
    gclid: "", fbclid: "", msclkid: "", ttclid: ""
  });
  const [referralCode, setReferralCode] = useState("");

  const captureAll = () => {
    if (typeof window === "undefined") return;

    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "msclkid", "ttclid", "ref"];
    const results = {};

    keys.forEach(key => {
      const val = getManualQueryParam(key) || searchParams.get(key) || getCookie(`qt_${key}`) || "";
      results[key] = val;
      if (getManualQueryParam(key)) setCookie(`qt_${key}`, val, 30);
    });

    setUtmData({
      utmSource: results.utm_source,
      utmMedium: results.utm_medium,
      utmCampaign: results.utm_campaign,
      utmContent: results.utm_content,
      utmTerm: results.utm_term,
      gclid: results.gclid,
      fbclid: results.fbclid,
      msclkid: results.msclkid,
      ttclid: results.ttclid
    });
    setReferralCode(results.ref);
  };

  useEffect(() => {
    captureAll();
    const t1 = setTimeout(captureAll, 500);
    return () => clearTimeout(t1);
  }, [searchParams]);

  useEffect(() => {
    if (success && typeof window !== 'undefined' && window.gtag) {
      const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-18129247983';
      const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_REGISTRATION_LABEL;
      
      if (adsId && label) {
        // Enhanced Conversions (Google will hash the data if configured or we send it as is if gtag handles it)
        window.gtag('set', 'user_data', {
          'email': formData.email,
          'phone_number': formData.phone
        });

        window.gtag('event', 'conversion', {
          'send_to': `${adsId}/${label}`,
          'value': 1.0,
          'currency': 'EUR'
        });
      }
    }
  }, [success, formData.email, formData.phone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const getP = (k) => getManualQueryParam(k) || searchParams.get(k) || getCookie(`qt_${k}`) || "";

      const payload = {
        ...formData,
        locale,
        referralCode: getP("ref") || referralCode,
        utmSource: getP("utm_source"),
        utmMedium: getP("utm_medium"),
        utmCampaign: getP("utm_campaign"),
        utmContent: getP("utm_content"),
        utmTerm: getP("utm_term"),
        gclid: getP("gclid"),
        fbclid: getP("fbclid"),
        msclkid: getP("msclkid"),
        ttclid: getP("ttclid")
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1.5rem' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '3rem', background: 'white', textAlign: 'center' }}>
          <CheckCircle2 size={60} color="#166534" style={{ margin: '0 auto 2rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>¡Registro Completado!</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>Hemos enviado un email a su cuenta para activar el acceso.</p>
          <button onClick={() => router.push("/login")} className="btn-primary" style={{ width: '100%' }}>Volver al Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1.5rem' }}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}><LanguageSwitcher /></div>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '3rem', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 1.5rem' }}>
             <Image src="/images/logo.jpg" alt="Logo" fill style={{ objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--corp-green)' }}>Registro</h1>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input type="text" className="input-field" style={{ paddingLeft: '2.75rem' }} placeholder="Nombre" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div style={{ position: 'relative' }}>
            <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input type="email" className="input-field" style={{ paddingLeft: '2.75rem' }} placeholder="Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div style={{ position: 'relative' }}>
            <Building2 style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input type="text" className="input-field" style={{ paddingLeft: '2.75rem' }} placeholder="Empresa" required value={formData.razonSocial} onChange={e => setFormData({...formData, razonSocial: e.target.value})} />
          </div>
          <div style={{ position: 'relative' }}>
            <Phone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input type="tel" className="input-field" style={{ paddingLeft: '2.75rem' }} placeholder="Teléfono" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>

          <label style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" required checked={formData.termsAccepted} onChange={e => setFormData({...formData, termsAccepted: e.target.checked})} style={{ width: '18px', height: '18px' }} />
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Acepto las <Link href="https://quicktrace.es/condiciones-de-uso/" target="_blank" style={{ color: 'var(--corp-green)' }}>Condiciones de Uso</Link>
            </span>
          </label>

          <button type="submit" className="btn-primary" disabled={loading} style={{ height: '3.5rem', marginTop: '1rem' }}>
            {loading ? <Loader2 className="animate-spin" /> : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
