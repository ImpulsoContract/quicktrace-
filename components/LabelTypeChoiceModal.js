"use client";

import React from "react";
import { X, Tag, Store, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function LabelTypeChoiceModal({ isOpen, onClose, onSelectProduct, onSelectVitrina }) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      style={{
        zIndex: 1100,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="modal-content"
        style={{
          maxWidth: "560px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "1.25rem",
          padding: "2rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          position: "relative"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--text-main)", margin: 0, letterSpacing: "-0.01em" }}>
              {t("modals.choose_label_type_title") || "Configurar etiquetas"}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "0.35rem", marginBottom: 0 }}>
              {t("modals.choose_label_type_subtitle") || "Selecciona qué tipo de etiqueta deseas personalizar:"}
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ 
              background: "none", 
              border: "none", 
              color: "var(--text-muted)", 
              cursor: "pointer", 
              padding: "0.35rem", 
              borderRadius: "0.5rem" 
            }}
          >
            <X size={22} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Opción 1: Etiquetas de producto */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectProduct();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.25rem 1.5rem",
              background: "#ffffff",
              border: "2px solid #e2e8f0",
              borderRadius: "1rem",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s ease",
              gap: "1rem"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--corp-green)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(66, 98, 22, 0.12)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div 
                style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "0.85rem", 
                  background: "rgba(66, 98, 22, 0.1)", 
                  color: "var(--corp-green)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <Tag size={24} />
              </div>
              <div>
                <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-main)" }}>
                  {t("modals.product_labels_title") || "Etiquetas de producto"}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.25rem", lineHeight: 1.35 }}>
                  {t("modals.product_labels_desc") || "Etiquetas completas de trazabilidad, lote, fechas y lista de ingredientes para envases."}
                </div>
              </div>
            </div>
            <ChevronRight size={20} color="var(--corp-green)" style={{ flexShrink: 0 }} />
          </button>

          {/* Opción 2: Etiquetas de vitrina */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectVitrina();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.25rem 1.5rem",
              background: "#ffffff",
              border: "2px solid #e2e8f0",
              borderRadius: "1rem",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s ease",
              gap: "1rem"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--corp-green)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(66, 98, 22, 0.12)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div 
                style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "0.85rem", 
                  background: "rgba(66, 98, 22, 0.1)", 
                  color: "var(--corp-green)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <Store size={24} />
              </div>
              <div>
                <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-main)" }}>
                  {t("modals.vitrina_labels_title") || "Etiquetas de vitrina"}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.25rem", lineHeight: 1.35 }}>
                  {t("modals.vitrina_labels_desc") || "Etiquetas de mostrador y expositor con precio destacado, logo centrado e iconos de alérgenos."}
                </div>
              </div>
            </div>
            <ChevronRight size={20} color="var(--corp-green)" style={{ flexShrink: 0 }} />
          </button>
        </div>

        <div style={{ marginTop: "1.75rem", display: "flex", justifyContent: "flex-end" }}>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-secondary"
            style={{ padding: "0.6rem 1.25rem", fontSize: "0.88rem" }}
          >
            {t("common.cancel") || "Cancelar"}
          </button>
        </div>
      </div>
    </div>
  );
}
