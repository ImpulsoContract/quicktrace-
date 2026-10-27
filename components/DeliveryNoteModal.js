"use client";

import React from "react";
import { Truck, Package, Receipt, X, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function DeliveryNoteModal({
  isOpen,
  onClose,
  onConfirm,
  saleSummary = null,
  isGenerating = false
}) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        zIndex: 12500,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="modal-content"
        style={{
          background: '#ffffff',
          borderRadius: '1rem',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          animation: 'fadeInScale 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem 1.75rem 1rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '0.75rem',
            background: 'rgba(66, 98, 22, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--corp-green)',
            flexShrink: 0
          }}>
            <Truck size={24} />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: '900',
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: 1.3
            }}>
              {t('delivery_note.modal_title') || "¿Deseas incluir los precios en el albarán?"}
            </h3>
            <p style={{
              margin: '0.35rem 0 0',
              fontSize: '0.85rem',
              color: '#64748b',
              lineHeight: 1.4
            }}>
              {t('delivery_note.modal_subtitle') || "Selecciona el formato de albarán que deseas generar para esta venta:"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              padding: '0.35rem',
              borderRadius: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Optional sale summary pill */}
        {saleSummary && (
          <div style={{
            padding: '0.65rem 1.75rem',
            background: '#f8fafc',
            borderBottom: '1px solid #f1f5f9',
            fontSize: '0.82rem',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--corp-green)'
            }} />
            <span>{saleSummary}</span>
          </div>
        )}

        {/* Content / Options */}
        <div style={{
          padding: '1.5rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {isGenerating ? (
            <div style={{
              padding: '3rem 1rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              color: 'var(--corp-green)'
            }}>
              <Loader2 size={36} className="animate-spin" />
              <span style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                {t('delivery_note.generating') || "Generando albarán en PDF..."}
              </span>
            </div>
          ) : (
            <>
              {/* Option 1: WITHOUT PRICES */}
              <button
                type="button"
                onClick={() => onConfirm(false)}
                style={{
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.85rem',
                  padding: '1.15rem 1.25rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--corp-green)';
                  e.currentTarget.style.background = '#f0fdf4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#f8fafc';
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '0.65rem',
                  background: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  flexShrink: 0
                }}>
                  <Package size={20} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.98rem',
                    fontWeight: '900',
                    color: '#0f172a',
                    marginBottom: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>{t('delivery_note.option_without_prices_title') || "Albarán estándar (sin precios)"}</span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '0.35rem',
                      background: '#e2e8f0',
                      color: '#475569',
                      textTransform: 'uppercase'
                    }}>
                      Estándar
                    </span>
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: '0.82rem',
                    color: '#64748b',
                    lineHeight: 1.4
                  }}>
                    {t('delivery_note.option_without_prices_desc') || "Solo incluye productos, lotes de trazabilidad y cantidades, sin mostrar importes económicos."}
                  </p>
                </div>
              </button>

              {/* Option 2: WITH PRICES */}
              <button
                type="button"
                onClick={() => onConfirm(true)}
                style={{
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.85rem',
                  padding: '1.15rem 1.25rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--corp-green)';
                  e.currentTarget.style.background = '#f0fdf4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#f8fafc';
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '0.65rem',
                  background: 'rgba(66, 98, 22, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--corp-green)',
                  flexShrink: 0
                }}>
                  <Receipt size={20} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.98rem',
                    fontWeight: '900',
                    color: '#0f172a',
                    marginBottom: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>{t('delivery_note.option_with_prices_title') || "Albarán valorado (con precios)"}</span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '0.35rem',
                      background: 'rgba(66, 98, 22, 0.15)',
                      color: 'var(--corp-green)',
                      textTransform: 'uppercase'
                    }}>
                      Valorado
                    </span>
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: '0.82rem',
                    color: '#64748b',
                    lineHeight: 1.4
                  }}>
                    {t('delivery_note.option_with_prices_desc') || "Incluye precios unitarios, subtotales y el importe total de la venta."}
                  </p>
                </div>
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.9rem 1.75rem',
          background: '#f8fafc',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: isGenerating ? 'not-allowed' : 'pointer'
            }}
          >
            {t('delivery_note.btn_cancel') || "Cancelar"}
          </button>
        </div>
      </div>
    </div>
  );
}
