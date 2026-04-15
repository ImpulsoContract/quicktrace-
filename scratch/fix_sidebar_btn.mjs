import fs from 'fs';

const filePath = 'C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Optimize SidebarBtn for multiline text
const newSidebarBtn = `function SidebarBtn({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        padding: '0.75rem 1rem',
        background: active ? 'rgba(66, 98, 22, 0.08)' : 'transparent',
        border: 'none', 
        color: active ? 'var(--corp-green)' : 'var(--text-muted)', 
        fontSize: '0.9rem', 
        fontWeight: active ? '800' : '500',
        cursor: 'pointer', 
        borderRadius: '0.75rem', 
        textAlign: 'left', 
        transition: 'all 0.2s',
        lineHeight: '1.2'
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </span>
      <span style={{ flex: 1, whiteSpace: 'normal', wordBreak: 'break-word', display: 'block' }}>
        {label}
      </span>
    </button>
  );
}`;

content = content.replace(/function SidebarBtn\(\{ icon, label, active, onClick \}\)\s+\{([\s\S]+?)\n\}/, newSidebarBtn);

// 2. Ensure the label is correctly translated and the icon is explicitly Settings
// We search for the sidebar.business_config button
content = content.replace(
    /label=\{t\('sidebar\.business_config'\) \|\| "Configuraci.n del negocio"\}\s+active=\{activeTab === "configuracion"\}/,
    `label={t('sidebar.business_config') || "Configuración del negocio"}\n                  active={activeTab === "configuracion"}`
);

// We double check the icon - it was already <Settings size={20} /> but we'll ensure it's there
// Note: Some versions might have a typo or be missing it.
if (!content.includes('icon={<Settings size={20} />}')) {
    // If somehow it's missing, we would add it. But let's check one more regex for any SidebarBtn without icon that has business_config
    content = content.replace(
        /<SidebarBtn\s+label=\{t\('sidebar\.business_config'\)/,
        '<SidebarBtn\n                  icon={<Settings size={20} />}\n                  label={t(\'sidebar.business_config\')'
    );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully fixed SidebarBtn and Business Config menu item');
