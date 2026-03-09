export default function Home() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        QuickTrace
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '600px' }}>
        La plataforma inteligente para el seguimiento y gestión de tus clientes.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <a href="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
          Acceder al Panel
        </a>
      </div>
    </main>
  );
}
