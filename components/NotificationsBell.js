"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, AlertTriangle, CheckCircle2, X, Package, Boxes, ExternalLink,
  CalendarCheck, ChefHat, Sparkles, Thermometer, Droplet, Truck, Trash, Flame, Apple, Check
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

const TASK_ICONS = {
  ELABORATIONS: ChefHat,
  CLEANING: Sparkles,
  TEMPERATURES: Thermometer,
  WATER: Droplet,
  GOODS_RECEIPTS: Truck,
  WASTE: Trash,
  OIL: Flame,
  VEGETABLE_DISINFECTION: Apple
};

export default function NotificationsBell({ profile, onOpenGoodsModal, onOpenInventory, onVisibilityChange }) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [stockData, setStockData] = useState({ enabled: false, count: 0, items: [], threshold: 2 });
  const [taskData, setTaskData] = useState({ totalAlertsConfigured: 0, todayTasks: [], totalPendingToday: 0 });
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const stockAlertsEnabled = Boolean(
    !profile?.isSimpleVersion && profile?.goodsLowStockAlertEnabled && profile?.goodsLowStockInApp
  );

  const fetchAllNotifications = async () => {
    try {
      setLoading(true);

      // 1. Fetch Today's Tasks
      const now = new Date();
      const jsDay = now.getDay();
      const dayOfWeek = jsDay === 0 ? 7 : jsDay;
      const weekOfMonth = Math.min(4, Math.ceil(now.getDate() / 7));
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      const taskParams = new URLSearchParams({
        start: startOfDay.toISOString(),
        end: endOfDay.toISOString(),
        dayOfWeek: dayOfWeek.toString(),
        weekOfMonth: weekOfMonth.toString()
      });

      const tasksRes = await fetch(`/api/client/notifications/today-tasks?${taskParams.toString()}`);
      if (tasksRes.ok) {
        const tasksJson = await tasksRes.json();
        setTaskData(tasksJson);
      }

      // 2. Fetch Low Stock if enabled
      if (stockAlertsEnabled) {
        const stockRes = await fetch("/api/client/notifications/goods-low-stock");
        if (stockRes.ok) {
          const stockJson = await stockRes.json();
          setStockData(stockJson);
        }
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotifications();
    const interval = setInterval(fetchAllNotifications, 45000);
    const handleRefresh = () => fetchAllNotifications();
    window.addEventListener("refresh-notifications", handleRefresh);
    return () => {
      clearInterval(interval);
      window.removeEventListener("refresh-notifications", handleRefresh);
    };
  }, [stockAlertsEnabled, profile?.goodsLowStockThreshold]);

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

  const hasConfiguredAlerts = (taskData.totalAlertsConfigured || 0) > 0;
  const isBellVisible = Boolean(stockAlertsEnabled || hasConfiguredAlerts);

  useEffect(() => {
    onVisibilityChange?.(isBellVisible);
  }, [isBellVisible, onVisibilityChange]);

  if (!isBellVisible) return null;

  const pendingTasksCount = (taskData.todayTasks || []).filter(t => !t.isCompleted).length;
  const lowStockCount = stockAlertsEnabled ? (stockData.count || 0) : 0;
  const totalCount = pendingTasksCount + lowStockCount;

  const getTaskLabel = (type) => {
    switch (type) {
      case "ELABORATIONS": return t('task_alerts.type_elaborations') || "Elaboraciones";
      case "CLEANING": return t('task_alerts.type_cleaning') || "Limpieza";
      case "TEMPERATURES": return t('task_alerts.type_temperatures') || "Temperaturas";
      case "WATER": return t('task_alerts.type_water') || "Agua";
      case "GOODS_RECEIPTS": return t('task_alerts.type_goods_receipts') || "Entradas de mercancía";
      case "WASTE": return t('task_alerts.type_waste') || "Retirada de residuos";
      case "OIL": return t('task_alerts.type_oil') || "Retirada de aceites de fritura";
      case "VEGETABLE_DISINFECTION": return t('task_alerts.type_veg') || "Desinfección de vegetales";
      default: return type;
    }
  };

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
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchAllNotifications();
        }}
        aria-label={t('notifications.tooltip') || "Alertas y notificaciones"}
        title={t('notifications.tooltip') || "Alertas y notificaciones"}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          padding: '0.4rem 0.65rem',
          borderRadius: '2rem',
          border: totalCount > 0 ? '1px solid #fca5a5' : '1px solid var(--border)',
          boxShadow: totalCount > 0 ? '0 4px 14px rgba(239, 68, 68, 0.15)' : '0 4px 12px rgba(0,0,0,0.1)',
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
            color: totalCount > 0 ? '#ef4444' : 'var(--corp-green)',
            transition: 'color 0.2s ease'
          }} 
        />
        {totalCount > 0 && (
          <span style={{
            background: '#ef4444',
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: '0.72rem',
            fontWeight: '800',
            padding: '0.05rem 0.45rem',
            lineHeight: '1.2'
          }}>
            {totalCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.6rem)',
          right: 0,
          width: '380px',
          maxWidth: '92vw',
          background: '#ffffff',
          borderRadius: '14px',
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
              <Bell size={16} style={{ color: totalCount > 0 ? '#ef4444' : 'var(--corp-green)' }} />
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                {t('notifications.title') || "Notificaciones y Tareas"}
              </span>
              {totalCount > 0 && (
                <span style={{
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  padding: '0.1rem 0.5rem',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  {totalCount}
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
          <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.75rem' }}>
            
            {/* 1. SECCIÓN DE TAREAS PROGRAMADAS PARA HOY */}
            {taskData.todayTasks && taskData.todayTasks.length > 0 && (
              <div style={{ marginBottom: stockAlertsEnabled && stockData.items?.length > 0 ? '1rem' : 0 }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '0.2rem 0.25rem 0.5rem 0.25rem',
                  borderBottom: '1px solid #f1f5f9',
                  marginBottom: '0.6rem'
                }}>
                  <span style={{ 
                    fontSize: '0.76rem', 
                    fontWeight: 800, 
                    color: '#475569', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <CalendarCheck size={14} style={{ color: 'var(--corp-green)' }} />
                    {t('task_alerts.today_tasks_header') || "Trabajo para hoy"}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                    {taskData.todayTasks.filter(t => t.isCompleted).length}/{taskData.todayTasks.length} {t('task_alerts.completed_badge') || "completadas"}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {taskData.todayTasks.map((task) => {
                    const IconComponent = TASK_ICONS[task.alertType] || CalendarCheck;
                    const pct = Math.min(100, Math.round((task.currentCount / task.targetCount) * 100));

                    return (
                      <div
                        key={task.id}
                        style={{
                          padding: '0.75rem 0.85rem',
                          borderRadius: '8px',
                          background: task.isCompleted ? '#f0fdf4' : '#fffbeb',
                          border: task.isCompleted ? '1px solid #bbf7d0' : '1px solid #fef3c7',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <IconComponent size={15} style={{ color: task.isCompleted ? '#16a34a' : '#d97706' }} />
                            <span style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                              {getTaskLabel(task.alertType)}
                            </span>
                          </div>
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '0.1rem 0.45rem',
                            borderRadius: '4px',
                            background: task.isCompleted ? '#dcfce7' : '#fef3c7',
                            color: task.isCompleted ? '#166534' : '#b45309',
                            textTransform: 'uppercase'
                          }}>
                            {task.isCompleted ? (t('task_alerts.status_completed') || "Completado") : (t('task_alerts.status_pending') || "Pendiente")}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>
                            {task.isCompleted
                              ? `${task.currentCount} de ${task.targetCount} registradas`
                              : `${task.currentCount} de ${task.targetCount} registradas (quedan ${task.pendingCount})`}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '0.74rem', color: task.isCompleted ? '#166534' : '#b45309' }}>
                            {pct}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: task.isCompleted ? '#22c55e' : '#f59e0b',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. SECCIÓN DE AVISOS DE STOCK ESCASO */}
            {stockAlertsEnabled && stockData.items && stockData.items.length > 0 && (
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '0.2rem 0.25rem 0.5rem 0.25rem',
                  borderBottom: '1px solid #f1f5f9',
                  marginBottom: '0.6rem'
                }}>
                  <span style={{ 
                    fontSize: '0.76rem', 
                    fontWeight: 800, 
                    color: '#475569', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <Package size={14} style={{ color: 'var(--corp-green)' }} />
                    {t('notifications.stock_alerts_header') || "Avisos de stock escaso"}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 700 }}>
                    {stockData.count} {t('notifications.low_stock_badge') || "con stock bajo"}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {stockData.items.map(item => {
                    const isZero = (item.stock || 0) <= 0;
                    return (
                      <div 
                        key={item.id}
                        style={{
                          padding: '0.65rem 0.8rem',
                          borderRadius: '8px',
                          background: isZero ? '#fef2f2' : '#fffbeb',
                          border: isZero ? '1px solid #fee2e2' : '1px solid #fef3c7',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.65rem'
                        }}
                      >
                        <AlertTriangle 
                          size={16} 
                          style={{ 
                            color: isZero ? '#dc2626' : '#d97706',
                            flexShrink: 0,
                            marginTop: '2px'
                          }} 
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                              <span style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {item.name}
                              </span>
                              <span style={{
                                fontSize: '0.6rem',
                                fontWeight: 800,
                                padding: '0.05rem 0.35rem',
                                borderRadius: '4px',
                                background: item.type === 'ingredient' ? '#e0f2fe' : '#ecfdf5',
                                color: item.type === 'ingredient' ? '#0369a1' : '#15803d',
                                textTransform: 'uppercase',
                                flexShrink: 0
                              }}>
                                {item.type === 'ingredient'
                                  ? (t('notifications.tag_ingredient') || "Ingrediente")
                                  : (t('notifications.tag_goods') || "Mercancía")}
                              </span>
                            </div>
                            <span style={{
                              fontSize: '0.64rem',
                              fontWeight: 700,
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                              background: isZero ? '#fca5a5' : '#fde68a',
                              color: isZero ? '#7f1d1d' : '#78350f',
                              textTransform: 'uppercase',
                              flexShrink: 0
                            }}>
                              {isZero
                                ? (item.type === 'ingredient'
                                    ? (t('notifications.out_of_stock_alert_ingredient') || "Agotado")
                                    : (t('notifications.out_of_stock_alert') || "Agotada"))
                                : (item.type === 'ingredient'
                                    ? (t('notifications.low_stock_alert_ingredient') || "Stock bajo")
                                    : (t('notifications.low_stock_alert') || "Stock bajo"))}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                            {t('notifications.current_stock_info', {
                              stock: item.stock,
                              unit: item.unit,
                              threshold: stockData.threshold
                            }) || `Stock actual: ${item.stock} ${item.unit} (Umbral: ${stockData.threshold} ${item.unit})`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. ESTADO VACÍO (TODO AL DÍA) */}
            {(!taskData.todayTasks || taskData.todayTasks.length === 0) && (!stockAlertsEnabled || !stockData.items || stockData.items.length === 0) && (
              <div style={{ textAlign: 'center', padding: '2rem 1.5rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={32} style={{ color: 'var(--corp-green)', margin: '0 auto 0.6rem', opacity: 0.8 }} />
                <p style={{ margin: '0 0 0.35rem 0', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {t('notifications.empty_title') || "Todo al día"}
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: '1.4' }}>
                  {hasConfiguredAlerts 
                    ? (t('task_alerts.no_tasks_today_desc') || "No tienes tareas programadas para hoy según tu calendario.") 
                    : (t('notifications.empty_desc') || "No tienes notificaciones pendientes.")}
                </p>
              </div>
            )}
          </div>

          {/* Footer with actions for stock if items present */}
          {stockAlertsEnabled && stockData.items && stockData.items.length > 0 && (
            <div style={{
              padding: '0.65rem 1rem',
              borderTop: '1px solid var(--border)',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem'
            }}>
              {Boolean(stockData.goodsCount > 0 || !stockData.ingredientsCount) && onOpenGoodsModal && (
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
              )}
              {Boolean(stockData.ingredientsCount > 0) && onOpenInventory && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenInventory();
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
                  <Boxes size={14} style={{ color: 'var(--corp-green)' }} />
                  <span>{t('notifications.btn_view_inventory') || "Ver inventario de ingredientes"}</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
