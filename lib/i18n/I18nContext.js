"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import es from "./locales/es.json";
import en from "./locales/en.json";
import it from "./locales/it.json";
import fr from "./locales/fr.json";
import pt from "./locales/pt.json";

const translations = { es, en, it, fr, pt };

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState("es");

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale");
    const validLocales = ["es", "en", "it", "fr", "pt"];
    
    if (savedLocale && validLocales.includes(savedLocale)) {
      setLocale(savedLocale);
    } else {
      const browserLanguage = navigator.language.split("-")[0];
      if (validLocales.includes(browserLanguage)) {
        setLocale(browserLanguage);
      }
    }
  }, []);

  const changeLanguage = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (path, values = {}) => {
    const keys = path.split(".");
    let result = translations[locale];

    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path; // Fallback to key name if not found
      }
    }

    if (typeof result === "string" && values) {
      Object.keys(values).forEach(key => {
        result = result.replace(new RegExp(`{${key}}`, "g"), values[key]);
      });
    }

    return result;
  };

  return (
    <I18nContext.Provider value={{ locale, t, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
