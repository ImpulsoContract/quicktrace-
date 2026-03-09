"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Building2, Phone, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
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
        setError(data.error || "Error al procesar el registro");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem' }}>¡Registro Iniciado!</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
            Hemos enviado un enlace de verificación a <strong>{formData.email}</strong>. Por favor, revisa tu correo para establecer tu contraseña y activar tu cuenta.
          </p>
          <button onClick={() => router.push("/login")} className="btn-primary" style={{ width: '100%' }}>
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', padding: '1.5rem'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '3rem', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
             <Image src="/images/logo.png" alt="QuickTrace" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--corp-green)', marginBottom: '0.25rem' }}>Empieza Hoy</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Registra tu negocio en QuickTrace</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.85rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="label">Nombre de la Persona</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input 
                type="text" className="input-field" style={{ paddingLeft: '2.75rem' }} required
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nombre completo"
              />
            </div>
          </div>

          <div>
            <label className="label">Email Corporativo</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input 
                type="email" className="input-field" style={{ paddingLeft: '2.75rem' }} required
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="ejemplo@negocio.com"
              />
            </div>
          </div>

          <div>
            <label className="label">Nombre del Negocio (Razón Social)</label>
            <div style={{ position: 'relative' }}>
              <Building2 style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input 
                type="text" className="input-field" style={{ paddingLeft: '2.75rem' }} required
                value={formData.razonSocial} onChange={(e) => setFormData({...formData, razonSocial: e.target.value})}
                placeholder="Razón Social S.L."
              />
            </div>
          </div>

          <div>
            <label className="label">Teléfono de Contacto</label>
            <div style={{ position: 'relative' }}>
              <Phone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input 
                type="tel" className="input-field" style={{ paddingLeft: '2.75rem' }} required
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+34 600 000 000"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', fontSize: '1rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Solicitar Acceso <ArrowRight size={20} /></>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            ¿Ya tienes cuenta? <Link href="/login" style={{ color: 'var(--corp-green)', fontWeight: '700', textDecoration: 'none' }}>Inicia sesión</Link>
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
