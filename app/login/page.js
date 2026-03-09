"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
        setError("Credenciales inválidas. Por favor, inténtalo de nuevo.");
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
      setError("Ocurrió un error inesperado.");
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
          <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 1.5rem' }}>
             <Image 
               src="/images/logo.png" 
               alt="QuickTrace" 
               fill 
               style={{ objectFit: 'contain' }}
               priority
             />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--corp-green)', marginBottom: '0.25rem' }}>
            Bienvenido
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Inicia sesión en tu plataforma</p>
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
            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>Email Corporativo</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input 
                type="email" 
                className="input-field" 
                style={{ paddingLeft: '2.75rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@quicktrace.com"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input 
                type="password" 
                className="input-field" 
                style={{ paddingLeft: '2.75rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.75rem' }}>
            <Link href="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--corp-green)', fontWeight: '600', textDecoration: 'none' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', fontSize: '1rem', padding: '0.9rem' }}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Acceder ahora"}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            ¿No tienes cuenta? <Link href="/register" style={{ color: 'var(--corp-green)', fontWeight: '700', textDecoration: 'none' }}>Registrarme gratis</Link>
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
