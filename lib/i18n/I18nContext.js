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
    if (!path || typeof path !== "string") return null;
    const keys = path.split(".");
    let result = translations[locale];

    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        result = null;
        break;
      }
    }

    // Fallback to Spanish if key is missing in active locale
    if (result === null && locale !== "es") {
      let esResult = translations["es"];
      for (const key of keys) {
        if (esResult && esResult[key] !== undefined) {
          esResult = esResult[key];
        } else {
          esResult = null;
          break;
        }
      }
      result = esResult;
    }

    // If completely missing, return null so JS fallback `|| "Texto"` works
    if (result === null || result === undefined) {
      return null;
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
