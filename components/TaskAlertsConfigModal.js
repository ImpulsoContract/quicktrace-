"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Calendar, Plus, Trash2, Edit3, Check, AlertCircle, 
  ChefHat, Sparkles, Thermometer, Droplet, Truck, Trash, Flame, Apple,
  Loader2, Info, ArrowLeft, CalendarCheck
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export const ALERT_TYPE_ICONS = {
  ELABORATIONS: ChefHat,
  CLEANING: Sparkles,
  TEMPERATURES: Thermometer,
  WATER: Droplet,
  GOODS_RECEIPTS: Truck,
  WASTE: Trash,
  OIL: Flame,
  VEGETABLE_DISINFECTION: Apple
};

export function getAlertSentence(type, days, weeks, count, t) {
  // Days text
  const sortedDays = [...(days || [])].sort((a, b) => a - b);
  const isAllDays = sortedDays.length === 7;
  const isMonFri = sortedDays.length === 5 && sortedDays.every((d, i) => d === i + 1);
  const isWeekend = sortedDays.length === 2 && sortedDays.includes(6) && sortedDays.includes(7);

  const dayNames = {
    1: t('task_alerts.day_mon') || "lunes",
    2: t('task_alerts.day_tue') || "martes",
    3: t('task_alerts.day_wed') || "miércoles",
    4: t('task_alerts.day_thu') || "jueves",
    5: t('task_alerts.day_fri') || "viernes",
    6: t('task_alerts.day_sat') || "sábado",
    7: t('task_alerts.day_sun') || "domingo"
  };

  let daysText = "";
  if (isAllDays) {
    daysText = t('task_alerts.phrase_all_days') || "Todos los días";
  } else if (isMonFri) {
    daysText = t('task_alerts.phrase_mon_fri') || "De lunes a viernes";
  } else if (isWeekend) {
    daysText = t('task_alerts.phrase_weekends') || "Los fines de semana";
  } else if (sortedDays.length > 0) {
    const names = sortedDays.map(d => dayNames[d]);
    if (names.length === 1) {
      daysText = `${t('task_alerts.phrase_the_prefix') || "Los"} ${names[0]}`;
    } else {
      const last = names.pop();
      daysText = `${t('task_alerts.phrase_the_prefix') || "Los"} ${names.join(", ")} ${t('task_alerts.phrase_and') || "y"} ${last}`;
    }
  } else {
    daysText = t('task_alerts.phrase_no_days') || "Ningún día seleccionado";
  }

  // Weeks text
  const sortedWeeks = [...(weeks || [])].sort((a, b) => a - b);
  const isAllWeeks = sortedWeeks.length === 4;

  const weekNames = {
    1: t('task_alerts.week_first') || "primera",
    2: t('task_alerts.week_second') || "segunda",
    3: t('task_alerts.week_third') || "tercera",
    4: t('task_alerts.week_fourth') || "cuarta"
  };

  let weeksText = "";
  if (isAllWeeks) {
    weeksText = t('task_alerts.phrase_all_weeks') || "todas las semanas del mes";
  } else if (sortedWeeks.length > 0) {
    const names = sortedWeeks.map(w => weekNames[w]);
    if (names.length === 1) {
      weeksText = `${t('task_alerts.phrase_the_week') || "la"} ${names[0]} ${t('task_alerts.phrase_week_of_month') || "semana del mes"}`;
    } else {
      const last = names.pop();
      weeksText = `${t('task_alerts.phrase_the_weeks') || "la"} ${names.join(", ")} ${t('task_alerts.phrase_and') || "y"} ${last} ${t('task_alerts.phrase_week_of_month') || "semana del mes"}`;
    }
  } else {
    weeksText = t('task_alerts.phrase_no_weeks') || "ninguna semana seleccionada";
  }

  // Target label per type
  const targetNum = parseInt(count, 10) || 1;
  const isSingle = targetNum === 1;

  const typeMap = {
    ELABORATIONS: isSingle 
      ? (t('task_alerts.target_elaboration_single') || "1 elaboración") 
      : `${targetNum} ${t('task_alerts.target_elaboration_plural') || "elaboraciones"}`,
    CLEANING: isSingle 
      ? (t('task_alerts.target_cleaning_single') || "1 registro de limpieza") 
      : `${targetNum} ${t('task_alerts.target_cleaning_plural') || "registros de limpieza"}`,
    TEMPERATURES: isSingle 
      ? (t('task_alerts.target_temperature_single') || "1 registro de temperaturas") 
      : `${targetNum} ${t('task_alerts.target_temperature_plural') || "registros de temperaturas"}`,
    WATER: isSingle 
      ? (t('task_alerts.target_water_single') || "1 medición de agua") 
      : `${targetNum} ${t('task_alerts.target_water_plural') || "mediciones de agua"}`,
    GOODS_RECEIPTS: isSingle 
      ? (t('task_alerts.target_goods_single') || "1 entrada de mercancía") 
      : `${targetNum} ${t('task_alerts.target_goods_plural') || "entradas de mercancía"}`,
    WASTE: isSingle 
      ? (t('task_alerts.target_waste_single') || "1 retirada de residuos") 
      : `${targetNum} ${t('task_alerts.target_waste_plural') || "retiradas de residuos"}`,
    OIL: isSingle 
      ? (t('task_alerts.target_oil_single') || "1 retirada de aceites de fritura") 
      : `${targetNum} ${t('task_alerts.target_oil_plural') || "retiradas de aceites de fritura"}`,
    VEGETABLE_DISINFECTION: isSingle 
      ? (t('task_alerts.target_veg_single') || "1 desinfección de vegetales") 
      : `${targetNum} ${t('task_alerts.target_veg_plural') || "desinfecciones de vegetales"}`
  };

  const targetText = typeMap[type] || `${targetNum} registros`;

  return `${daysText}, en ${weeksText}, debes registrar al menos ${targetText}.`;
}

export default function TaskAlertsConfigModal({
  isOpen,
  onClose,
  profile,
  onAlertsUpdated
}) {
  const { t } = useI18n();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("list"); // "list" | "form"
  const [editingAlertId, setEditingAlertId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    alertType: "ELABORATIONS",
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    weeksOfMonth: [1, 2, 3, 4],
    targetCount: 1
  });

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/client/task-alerts");
      if (!res.ok) throw new Error("Error fetching alerts");
      const data = await res.json();
      setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
    } catch (err) {
      console.error("Error fetching task alerts:", err);
      setError(t('alerts.connection_error') || "Error al cargar las alertas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
      setView("list");
      setEditingAlertId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Available alert types based on profile optional sections
  const availableTypes = [
    { id: "ELABORATIONS", label: t('task_alerts.type_elaborations') || "Elaboraciones" },
    { id: "CLEANING", label: t('task_alerts.type_cleaning') || "Limpieza" },
    { id: "TEMPERATURES", label: t('task_alerts.type_temperatures') || "Temperaturas" },
    { id: "GOODS_RECEIPTS", label: t('task_alerts.type_goods_receipts') || "Entradas de mercancía" },
    ...(profile?.hasWaterSection ? [{ id: "WATER", label: t('task_alerts.type_water') || "Agua" }] : []),
    ...(profile?.hasWasteSection ? [{ id: "WASTE", label: t('task_alerts.type_waste') || "Retirada de residuos" }] : []),
    ...(profile?.hasOilCollection ? [{ id: "OIL", label: t('task_alerts.type_oil') || "Retirada de aceites de fritura" }] : []),
    ...(profile?.hasVegetableDisinfection ? [{ id: "VEGETABLE_DISINFECTION", label: t('task_alerts.type_veg') || "Desinfección de vegetales" }] : [])
  ];

  const handleOpenCreate = () => {
    setFormData({
      alertType: availableTypes[0]?.id || "ELABORATIONS",
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      weeksOfMonth: [1, 2, 3, 4],
      targetCount: 1
    });
    setEditingAlertId(null);
    setView("form");
  };

  const handleOpenEdit = (alert) => {
    setFormData({
      alertType: alert.alertType,
      daysOfWeek: Array.isArray(alert.daysOfWeek) ? alert.daysOfWeek : [1, 2, 3, 4, 5, 6, 7],
      weeksOfMonth: Array.isArray(alert.weeksOfMonth) ? alert.weeksOfMonth : [1, 2, 3, 4],
      targetCount: alert.targetCount || 1
    });
    setEditingAlertId(alert.id);
    setView("form");
  };

  const toggleDay = (dayNum) => {
    setFormData(prev => {
      const exists = prev.daysOfWeek.includes(dayNum);
      const updated = exists 
        ? prev.daysOfWeek.filter(d => d !== dayNum) 
        : [...prev.daysOfWeek, dayNum];
      return { ...prev, daysOfWeek: updated.sort((a, b) => a - b) };
    });
  };

  const toggleWeek = (weekNum) => {
    setFormData(prev => {
      const exists = prev.weeksOfMonth.includes(weekNum);
      const updated = exists 
        ? prev.weeksOfMonth.filter(w => w !== weekNum) 
        : [...prev.weeksOfMonth, weekNum];
      return { ...prev, weeksOfMonth: updated.sort((a, b) => a - b) };
    });
  };

  const handleSelectAllDays = () => {
    setFormData(prev => ({ ...prev, daysOfWeek: [1, 2, 3, 4, 5, 6, 7] }));
  };

  const handleSelectMonFri = () => {
    setFormData(prev => ({ ...prev, daysOfWeek: [1, 2, 3, 4, 5] }));
  };

  const handleSelectAllWeeks = () => {
    setFormData(prev => ({ ...prev, weeksOfMonth: [1, 2, 3, 4] }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (formData.daysOfWeek.length === 0) {
      alert(t('task_alerts.err_select_day') || "Selecciona al menos un día de la semana.");
      return;
    }
    if (formData.weeksOfMonth.length === 0) {
      alert(t('task_alerts.err_select_week') || "Selecciona al menos una semana del mes.");
      return;
    }
    if (!formData.targetCount || formData.targetCount < 1) {
      alert(t('task_alerts.err_target_count') || "El número de registros debe ser al menos 1.");
      return;
    }

    try {
      setSaving(true);
      const url = editingAlertId ? `/api/client/task-alerts/${editingAlertId}` : "/api/client/task-alerts";
      const method = editingAlertId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al guardar la alerta");
      }

      await fetchAlerts();
      setView("list");
      setEditingAlertId(null);
      if (onAlertsUpdated) onAlertsUpdated();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("refresh-notifications"));
      }
    } catch (err) {
      console.error("Error saving task alert:", err);
      alert(err.message || t('alerts.request_error') || "Error al guardar la alerta");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (alertId) => {
    if (!confirm(t('task_alerts.delete_confirm') || "¿Estás seguro de que deseas eliminar esta alerta?")) {
      return;
    }
    try {
      setDeletingId(alertId);
      const res = await fetch(`/api/client/task-alerts/${alertId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al eliminar la alerta");
      }
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      if (onAlertsUpdated) onAlertsUpdated();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("refresh-notifications"));
      }
    } catch (err) {
      console.error("Error deleting task alert:", err);
      alert(err.message || t('alerts.delete_error') || "Error al eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  const naturalSentence = getAlertSentence(
    formData.alertType,
    formData.daysOfWeek,
    formData.weeksOfMonth,
    formData.targetCount,
    t
  );

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 10050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '1.25rem',
          maxWidth: '820px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              padding: '0.5rem', 
              borderRadius: '0.65rem', 
              background: 'rgba(66, 98, 22, 0.1)', 
              color: 'var(--corp-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CalendarCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                {t('business_config.task_alerts_title') || "Configurar alertas y calendario de tareas"}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                {t('business_config.task_alerts_desc') || "Define recordatorios periódicos para el registro de tareas y controles sanitarios."}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.6rem',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          {view === "list" ? (
            /* LIST VIEW */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {t('task_alerts.configured_alerts_title') || "Alertas configuradas"} ({alerts.length})
                  </h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                    {t('task_alerts.configured_alerts_subtitle') || "Estas alertas recordarán en el panel superior el trabajo que corresponde a cada día."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="btn-primary"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.84rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    borderRadius: '8px'
                  }}
                >
                  <Plus size={16} />
                  <span>{t('task_alerts.btn_new_alert') || "Nueva alerta"}</span>
                </button>
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', gap: '0.75rem' }}>
                  <Loader2 className="animate-spin" size={32} style={{ color: 'var(--corp-green)' }} />
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{t('common.loading') || "Cargando alertas..."}</p>
                </div>
              ) : alerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px dashed #cbd5e1' }}>
                  <CalendarCheck size={44} style={{ color: '#94a3b8', margin: '0 auto 0.75rem auto' }} />
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.35rem 0' }}>
                    {t('task_alerts.empty_title') || "No tienes alertas de tareas configuradas"}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '440px', margin: '0 auto 1.25rem auto', lineHeight: '1.5' }}>
                    {t('task_alerts.empty_desc') || "Crea una alerta periódica para que el sistema te recuerde el número de elaboraciones, limpiezas, temperaturas o mercancías que debes registrar."}
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="btn-primary"
                    style={{
                      padding: '0.5rem 1.25rem',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      borderRadius: '8px'
                    }}
                  >
                    <Plus size={16} />
                    <span>{t('task_alerts.btn_create_first_alert') || "Crear mi primera alerta"}</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {alerts.map((item) => {
                    const IconComponent = ALERT_TYPE_ICONS[item.alertType] || Calendar;
                    const sentence = getAlertSentence(item.alertType, item.daysOfWeek, item.weeksOfMonth, item.targetCount, t);

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.85rem',
                          padding: '1rem 1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                          <div style={{
                            padding: '0.5rem',
                            borderRadius: '0.65rem',
                            background: '#f0fdf4',
                            color: 'var(--corp-green)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px'
                          }}>
                            <IconComponent size={20} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1.4' }}>
                              {sentence}
                            </p>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{
                                background: '#f1f5f9',
                                color: '#475569',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.74rem',
                                fontWeight: 700
                              }}>
                                {availableTypes.find(at => at.id === item.alertType)?.label || item.alertType}
                              </span>
                              <span style={{
                                background: 'rgba(66, 98, 22, 0.08)',
                                color: 'var(--corp-green)',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.74rem',
                                fontWeight: 700
                              }}>
                                {item.targetCount} {item.targetCount === 1 ? 'registro' : 'registros'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="btn-secondary"
                            style={{
                              padding: '0.4rem 0.65rem',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.78rem',
                              fontWeight: 600
                            }}
                            title={t('common.edit') || "Editar"}
                          >
                            <Edit3 size={14} />
                            <span>{t('common.edit') || "Editar"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            style={{
                              padding: '0.4rem 0.65rem',
                              borderRadius: '6px',
                              background: '#fef2f2',
                              color: '#dc2626',
                              border: '1px solid #fecaca',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: deletingId === item.id ? 'not-allowed' : 'pointer'
                            }}
                            title={t('common.delete') || "Eliminar"}
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="animate-spin" size={14} />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            <span>{t('common.delete') || "Eliminar"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* CREATE / EDIT FORM */
            <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    padding: 0
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>{t('task_alerts.btn_back_to_list') || "Volver al listado"}</span>
                </button>
              </div>

              {/* 1. Tipo de alerta */}
              <div>
                <label className="label" style={{ fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.5rem', display: 'block' }}>
                  1. {t('task_alerts.field_type') || "Tipo de alerta"}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                  {availableTypes.map((at) => {
                    const IconComp = ALERT_TYPE_ICONS[at.id] || Calendar;
                    const isSelected = formData.alertType === at.id;
                    return (
                      <button
                        key={at.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, alertType: at.id }))}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--corp-green)' : '1px solid #cbd5e1',
                          background: isSelected ? 'rgba(66, 98, 22, 0.06)' : 'white',
                          color: isSelected ? 'var(--corp-green)' : 'var(--text-main)',
                          fontWeight: isSelected ? 800 : 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <IconComp size={18} />
                        <span>{at.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Día de la semana */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="label" style={{ fontWeight: 800, fontSize: '0.88rem', margin: 0 }}>
                    2. {t('task_alerts.field_days') || "Días de la semana"}
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={handleSelectAllDays}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '0.78rem',
                        color: 'var(--corp-green)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      {t('task_alerts.quick_all_days') || "Todos los días"}
                    </button>
                    <span style={{ color: '#cbd5e1' }}>•</span>
                    <button
                      type="button"
                      onClick={handleSelectMonFri}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '0.78rem',
                        color: 'var(--corp-green)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      {t('task_alerts.quick_mon_fri') || "De lunes a viernes"}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
                  {[
                    { num: 1, label: t('task_alerts.day_short_mon') || "L" },
                    { num: 2, label: t('task_alerts.day_short_tue') || "M" },
                    { num: 3, label: t('task_alerts.day_short_wed') || "X" },
                    { num: 4, label: t('task_alerts.day_short_thu') || "J" },
                    { num: 5, label: t('task_alerts.day_short_fri') || "V" },
                    { num: 6, label: t('task_alerts.day_short_sat') || "S" },
                    { num: 7, label: t('task_alerts.day_short_sun') || "D" }
                  ].map(d => {
                    const isChecked = formData.daysOfWeek.includes(d.num);
                    return (
                      <button
                        key={d.num}
                        type="button"
                        onClick={() => toggleDay(d.num)}
                        style={{
                          padding: '0.65rem 0',
                          borderRadius: '8px',
                          border: isChecked ? '2px solid var(--corp-green)' : '1px solid #cbd5e1',
                          background: isChecked ? 'var(--corp-green)' : 'white',
                          color: isChecked ? 'white' : 'var(--text-main)',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Semanas del mes */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="label" style={{ fontWeight: 800, fontSize: '0.88rem', margin: 0 }}>
                    3. {t('task_alerts.field_weeks') || "Semanas del mes"}
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllWeeks}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.78rem',
                      color: 'var(--corp-green)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    {t('task_alerts.quick_all_weeks') || "Todas las semanas"}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem' }}>
                  {[
                    { num: 1, label: t('task_alerts.week_first_label') || "1ª semana del mes" },
                    { num: 2, label: t('task_alerts.week_second_label') || "2ª semana del mes" },
                    { num: 3, label: t('task_alerts.week_third_label') || "3ª semana del mes" },
                    { num: 4, label: t('task_alerts.week_fourth_label') || "4ª semana del mes" }
                  ].map(w => {
                    const isChecked = formData.weeksOfMonth.includes(w.num);
                    return (
                      <button
                        key={w.num}
                        type="button"
                        onClick={() => toggleWeek(w.num)}
                        style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: isChecked ? '2px solid var(--corp-green)' : '1px solid #cbd5e1',
                          background: isChecked ? 'rgba(66, 98, 22, 0.06)' : 'white',
                          color: isChecked ? 'var(--corp-green)' : 'var(--text-main)',
                          fontWeight: isChecked ? 800 : 600,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{w.label}</span>
                        {isChecked && <Check size={16} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Número de registros requeridos */}
              <div>
                <label className="label" style={{ fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.5rem', display: 'block' }}>
                  4. {t('task_alerts.field_target_count') || "Número de registros requeridos"}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    className="input-field"
                    value={formData.targetCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetCount: Math.max(1, parseInt(e.target.value, 10) || 1) }))}
                    style={{ width: '120px', fontSize: '1rem', fontWeight: 800, textAlign: 'center', padding: '0.5rem' }}
                    required
                  />
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {t('task_alerts.records_required_hint') || "número de registros que se deben completar en cada día programado"}
                  </span>
                </div>
              </div>

              {/* Natural Language Preview Box */}
              <div style={{
                background: '#f0fdf4',
                border: '1.5px solid #86efac',
                borderRadius: '0.85rem',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                marginTop: '0.5rem'
              }}>
                <div style={{ color: 'var(--corp-green)', flexShrink: 0, marginTop: '2px' }}>
                  <Info size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.2rem' }}>
                    {t('task_alerts.preview_title') || "Resumen de la alerta (Lenguaje natural)"}:
                  </span>
                  <p style={{ margin: 0, fontSize: '0.94rem', fontWeight: 700, color: '#14532d', lineHeight: '1.45' }}>
                    &ldquo;{naturalSentence}&rdquo;
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  disabled={saving}
                  className="btn-secondary"
                  style={{ padding: '0.6rem 1.25rem', fontSize: '0.88rem', fontWeight: 700 }}
                >
                  {t('common.cancel') || "Cancelar"}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                  style={{
                    padding: '0.6rem 1.5rem',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  {saving && <Loader2 className="animate-spin" size={16} />}
                  <span>{editingAlertId ? (t('task_alerts.btn_update') || "Actualizar alerta") : (t('task_alerts.btn_save') || "Guardar alerta")}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {view === "list" && (
          <div style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            background: '#f8fafc'
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '0.55rem 1.35rem', fontSize: '0.85rem', fontWeight: 700 }}
            >
              {t('common.close') || "Cerrar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
