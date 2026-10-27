"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, AlertTriangle, CheckCircle2, X, Package, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function NotificationsBell({ profile, onOpenGoodsModal }) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({ enabled: false, count: 0, items: [], threshold: 2 });
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const isEnabled = Boolean(
    profile?.goodsLowStockAlertEnabled && profile?.goodsLowStockInApp
  );

  const fetchNotifications = async () => {
    if (!isEnabled) return;
    try {
      setLoading(true);
      const res = await fetch("/api/client/notifications/goods-low-stock");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Error fetching goods low stock notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEnabled) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 45000);
      return () => clearInterval(interval);
    }
  }, [isEnabled, profile?.goodsLowStockThreshold]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isEnabled) return null;

  const count = data.count || 0;

  return (
    <div 
      ref={dropdownRef}
      style={{ 
        position: 'fixed', 
        top: '1.5rem', 
        right: '7.2rem', 
        zIndex: 10000 
      }}
    >
      {/* Floating Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('notifications.tooltip') || "Notificaciones de stock"}
        title={t('notifications.tooltip') || "Notificaciones de stock"}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          padding: '0.4rem 0.65rem',
          borderRadius: '2rem',
          border: count > 0 ? '1px solid #fca5a5' : '1px solid var(--border)',
          boxShadow: count > 0 ? '0 4px 14px rgba(239, 68, 68, 0.15)' : '0 4px 12px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          outline: 'none',
          transition: 'all 0.2s ease',
          height: '34px',
          boxSizing: 'border-box'
        }}
      >
        <Bell 
          size={16} 
          style={{ 
            color: count > 0 ? '#ef4444' : 'var(--corp-green)',
            transition: 'color 0.2s ease'
          }} 
        />
        {count > 0 && (
          <span style={{
            background: '#ef4444',
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: '0.72rem',
            fontWeight: '800',
            padding: '0.05rem 0.45rem',
            lineHeight: '1.2'
          }}>
            {count}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.6rem)',
          right: 0,
          width: '350px',
          maxWidth: '90vw',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.15s ease'
        }}>
          {/* Header */}
          <div style={{
            padding: '0.85rem 1.15rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={16} style={{ color: count > 0 ? '#ef4444' : 'var(--corp-green)' }} />
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                {t('notifications.title') || "Notificaciones"}
              </span>
              {count > 0 && (
                <span style={{
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  padding: '0.1rem 0.5rem',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  {count}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '0.5rem' }}>
            {count === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1.5rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={32} style={{ color: 'var(--corp-green)', margin: '0 auto 0.6rem', opacity: 0.8 }} />
                <p style={{ margin: '0 0 0.35rem 0', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {t('notifications.empty_title') || "Todo al día"}
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: '1.4' }}>
                  {t('notifications.empty_desc') || "No tienes notificaciones pendientes. El stock de tus mercancías está en orden."}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {data.items.map(item => {
                  const isZero = (item.stock || 0) <= 0;
                  return (
                    <div 
                      key={item.id}
                      style={{
                        padding: '0.75rem 0.9rem',
                        borderRadius: '8px',
                        background: isZero ? '#fef2f2' : '#fffbeb',
                        border: isZero ? '1px solid #fee2e2' : '1px solid #fef3c7',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem'
                      }}
                    >
                      <AlertTriangle 
                        size={18} 
                        style={{ 
                          color: isZero ? '#dc2626' : '#d97706',
                          flexShrink: 0,
                          marginTop: '2px'
                        }} 
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {item.name}
                          </span>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background: isZero ? '#fca5a5' : '#fde68a',
                            color: isZero ? '#7f1d1d' : '#78350f',
                            textTransform: 'uppercase'
                          }}>
                            {isZero
                              ? (t('notifications.out_of_stock_alert') || "Agotada")
                              : (t('notifications.low_stock_alert') || "Stock bajo")}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {t('notifications.current_stock_info', {
                            stock: item.stock,
                            unit: item.unit,
                            threshold: data.threshold
                          }) || `Stock actual: ${item.stock} ${item.unit} (Umbral: ${data.threshold} ${item.unit})`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with action */}
          {count > 0 && onOpenGoodsModal && (
            <div style={{
              padding: '0.65rem 1rem',
              borderTop: '1px solid var(--border)',
              background: '#f8fafc',
              textAlign: 'center'
            }}>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenGoodsModal();
                }}
                className="btn-secondary"
                style={{
                  width: '100%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                <Package size={14} style={{ color: 'var(--corp-green)' }} />
                <span>{t('notifications.btn_view_goods') || "Ver mercancías en venta"}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
