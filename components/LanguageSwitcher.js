"use client";

import { useI18n } from "@/lib/i18n/I18nContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useI18n();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.8)', padding: '0.4rem 0.75rem', borderRadius: '2rem', border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <Globe size={16} color="var(--corp-green)" />
      <select 
        value={locale} 
        onChange={(e) => changeLanguage(e.target.value)}
        style={{ 
          background: 'none', 
          border: 'none', 
          fontSize: '0.85rem', 
          fontWeight: '700', 
          color: 'var(--text-main)', 
          cursor: 'pointer',
          outline: 'none',
          padding: '0 0.25rem'
        }}
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    </div>
  );
}
