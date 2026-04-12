"use client";

import { useI18n } from "@/lib/i18n/I18nContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useI18n();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '1.5rem', 
      right: '1.5rem', 
      zIndex: 10000, 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5rem', 
      background: 'rgba(255,255,255,0.7)', 
      backdropFilter: 'blur(10px)', 
      WebkitBackdropFilter: 'blur(10px)', 
      padding: '0.4rem 0.75rem', 
      borderRadius: '2rem', 
      border: '1px solid var(--border)', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
    }}>
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
        <option value="it">IT</option>
        <option value="fr">FR</option>
        <option value="pt">PT</option>
      </select>
    </div>
  );
}
