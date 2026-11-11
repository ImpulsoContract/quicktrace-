"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  ChefHat,
  ClipboardList,
  ShieldCheck,
  Truck,
  Thermometer,
  Brush,
  Waves,
  Recycle,
  Scissors,
  Droplets,
  Salad,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Loader2,
  Calendar
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

const CATEGORY_CONFIG = [
  {
    key: "elaborations",
    labelKey: "summary.cat_elaborations",
    fallback: "Elaboraciones",
    color: "#426216",
    bgLight: "#f0fdf4",
    icon: ClipboardList
  },
  {
    key: "goods",
    labelKey: "summary.cat_goods",
    fallback: "Entradas de mercancías",
    color: "#0284c7",
    bgLight: "#e0f2fe",
    icon: Truck
  },
  {
    key: "temperatures",
    labelKey: "summary.cat_temperatures",
    fallback: "Temperaturas",
    color: "#ea580c",
    bgLight: "#ffedd5",
    icon: Thermometer
  },
  {
    key: "cleaning",
    labelKey: "summary.cat_cleaning",
    fallback: "Limpieza",
    color: "#7c3aed",
    bgLight: "#f3e8ff",
    icon: Brush
  },
  {
    key: "water",
    labelKey: "summary.cat_water",
    fallback: "Agua",
    color: "#0891b2",
    bgLight: "#cffafe",
    icon: Waves
  },
  {
    key: "waste",
    labelKey: "summary.cat_waste",
    fallback: "Residuos",
    color: "#475569",
    bgLight: "#f1f5f9",
    icon: Recycle
  },
  {
    key: "cutting",
    labelKey: "summary.cat_cutting",
    fallback: "Trazabilidad de despiece",
    color: "#dc2626",
    bgLight: "#fee2e2",
    icon: Scissors
  },
  {
    key: "oil",
    labelKey: "summary.cat_oil",
    fallback: "Aceites de fritura",
    color: "#d97706",
    bgLight: "#fef3c7",
    icon: Droplets
  },
  {
    key: "vegetables",
    labelKey: "summary.cat_vegetables",
    fallback: "Desinfección de vegetales",
    color: "#16a34a",
    bgLight: "#dcfce7",
    icon: Salad
  }
];

export default function SummaryView() {
  const { t, locale } = useI18n();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState(["elaborations"]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({
    activeRecipesCount: 0,
    todayElaborations: 0,
    todayControlsTotal: 0,
    todayControlsBreakdown: {
      goods: 0,
      temperatures: 0,
      cleaning: 0,
      water: 0,
      waste: 0,
      cutting: 0,
      oil: 0,
      vegetables: 0
    },
    weekDates: {
      elaborations: [],
      goods: [],
      temperatures: [],
      cleaning: [],
      water: [],
      waste: [],
      cutting: [],
      oil: [],
      vegetables: []
    }
  });

  // Compute Monday..Sunday of the selected week in local time
  const weekDays = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sun) .. 6 (Sat)
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + diffToMonday + weekOffset * 7,
      0,
      0,
      0,
      0
    );

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate() + i,
        0,
        0,
        0,
        0
      );
      const end = new Date(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate() + i,
        23,
        59,
        59,
        999
      );
      days.push({ start: d, end });
    }
    return days;
  }, [weekOffset]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();
      const weekStart = weekDays[0].start.toISOString();
      const weekEnd = weekDays[6].end.toISOString();

      const params = new URLSearchParams({
        todayStart,
        todayEnd,
        weekStart,
        weekEnd,
        t: Date.now().toString()
      });

      const res = await fetch(`/api/client/summary?${params.toString()}`, {
        cache: "no-store"
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        setSummaryData(data);
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [weekOffset]);

  const toggleCategory = (key) => {
    setSelectedCategories((prev) => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
    });
  };

  const localeTag =
    locale === "en"
      ? "en-US"
      : locale === "fr"
      ? "fr-FR"
      : locale === "it"
      ? "it-IT"
      : locale === "pt"
      ? "pt-PT"
      : "es-ES";

  // Bucket weekly dates per day (0..6) and per category
  const dailyCounts = useMemo(() => {
    return weekDays.map((dayObj) => {
      const startMs = dayObj.start.getTime();
      const endMs = dayObj.end.getTime();
      const counts = {};
      CATEGORY_CONFIG.forEach((cat) => {
        const rawDates = summaryData.weekDates?.[cat.key] || [];
        counts[cat.key] = rawDates.filter((iso) => {
          if (!iso) return false;
          const ms = new Date(iso).getTime();
          return ms >= startMs && ms <= endMs;
        }).length;
      });
      return {
        date: dayObj.start,
        counts
      };
    });
  }, [weekDays, summaryData.weekDates]);

  const maxBarValue = useMemo(() => {
    let max = 0;
    dailyCounts.forEach((day) => {
      selectedCategories.forEach((catKey) => {
        const val = day.counts[catKey] || 0;
        if (val > max) max = val;
      });
    });
    return Math.max(max, 4);
  }, [dailyCounts, selectedCategories]);

  const weekRangeLabel = useMemo(() => {
    const first = weekDays[0].start;
    const last = weekDays[6].start;
    const fmt = new Intl.DateTimeFormat(localeTag, {
      day: "2-digit",
      month: "short"
    });
    const yearFmt = new Intl.DateTimeFormat(localeTag, { year: "numeric" });
    return `${fmt.format(first)} - ${fmt.format(last)} ${yearFmt.format(last)}`;
  }, [weekDays, localeTag]);

  const controlCategories = CATEGORY_CONFIG.filter((c) => c.key !== "elaborations");

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "2.25rem",
            fontWeight: "900",
            color: "var(--text-main)",
            margin: 0,
            letterSpacing: "-0.03em"
          }}
        >
          {t("summary.title") || "Resumen"}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", margin: "0.25rem 0 0 0" }}>
          {t("summary.subtitle") || "Vista general de las elaboraciones, recetas y controles registrados en tu negocio."}
        </p>
      </header>

      {/* Top Row: 3 Square/Card Blocks */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}
      >
        {/* Card 1: Elaboraciones registradas hoy */}
        <div
          className="glass-card"
          style={{
            background: "white",
            padding: "1.75rem",
            borderRadius: "1.5rem",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "190px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
            <span
              style={{
                fontSize: "0.95rem",
                fontWeight: "800",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.03em"
              }}
            >
              {t("summary.today_elaborations") || "Elaboraciones registradas hoy"}
            </span>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "1rem",
                background: "#f0fdf4",
                color: "var(--corp-green)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <ClipboardList size={24} />
            </div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <div style={{ fontSize: "2.85rem", fontWeight: "900", color: "var(--corp-green)", lineHeight: 1 }}>
              {loading ? <Loader2 size={32} className="animate-spin" /> : summaryData.todayElaborations}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem", fontWeight: "600" }}>
              {t("summary.today_elaborations_sub") || "Elaboraciones realizadas en el día de hoy"}
            </div>
          </div>
        </div>

        {/* Card 2: Recetas activas */}
        <div
          className="glass-card"
          style={{
            background: "white",
            padding: "1.75rem",
            borderRadius: "1.5rem",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "190px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
            <span
              style={{
                fontSize: "0.95rem",
                fontWeight: "800",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.03em"
              }}
            >
              {t("summary.active_recipes") || "Recetas activas"}
            </span>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "1rem",
                background: "#fef3c7",
                color: "#d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <ChefHat size={24} />
            </div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <div style={{ fontSize: "2.85rem", fontWeight: "900", color: "#1e293b", lineHeight: 1 }}>
              {loading ? <Loader2 size={32} className="animate-spin" /> : summaryData.activeRecipesCount}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem", fontWeight: "600" }}>
              {t("summary.active_recipes_sub") || "Recetas configuradas actualmente"}
            </div>
          </div>
        </div>

        {/* Card 3: Controles registrados hoy */}
        <div
          className="glass-card"
          style={{
            background: "white",
            padding: "1.75rem",
            borderRadius: "1.5rem",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "190px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
            <span
              style={{
                fontSize: "0.95rem",
                fontWeight: "800",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.03em"
              }}
            >
              {t("summary.today_controls") || "Controles registrados hoy"}
            </span>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "1rem",
                background: "#e0f2fe",
                color: "#0284c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <ShieldCheck size={24} />
            </div>
          </div>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap"
            }}
          >
            <div>
              <div style={{ fontSize: "2.85rem", fontWeight: "900", color: "#0284c7", lineHeight: 1 }}>
                {loading ? <Loader2 size={32} className="animate-spin" /> : summaryData.todayControlsTotal}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem", fontWeight: "600" }}>
                {t("summary.today_controls_sub") || "Registros de control hoy"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowDetailsModal(true)}
              className="btn-primary"
              style={{
                padding: "0.55rem 1rem",
                fontSize: "0.82rem",
                fontWeight: "800",
                borderRadius: "0.65rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                cursor: "pointer"
              }}
            >
              <Eye size={16} />
              <span>{t("summary.view_details") || "Ver detalles"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Activity Bar Chart Card */}
      <div
        className="glass-card"
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "1.5rem",
          border: "1px solid var(--border)",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)"
        }}
      >
        {/* Header + Week Selector */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "0.75rem",
                background: "#f0fdf4",
                color: "var(--corp-green)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <BarChart3 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800", margin: 0, color: "var(--text-main)" }}>
                {t("summary.weekly_activity_title") || "Actividad de la semana"}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
                {t("summary.weekly_activity_sub") || "Selecciona los registros que deseas visualizar en el gráfico diario"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            {weekOffset !== 0 && (
              <button
                type="button"
                onClick={() => setWeekOffset(0)}
                className="btn-secondary"
                style={{
                  padding: "0.45rem 0.85rem",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  borderRadius: "0.6rem",
                  cursor: "pointer"
                }}
              >
                {t("summary.current_week") || "Esta semana"}
              </button>
            )}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#f8fafc",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                padding: "0.25rem"
              }}
            >
              <button
                type="button"
                onClick={() => setWeekOffset((prev) => prev - 1)}
                title={t("summary.prev_week") || "Semana anterior"}
                style={{
                  background: "white",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  width: "34px",
                  height: "34px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--text-main)"
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <div
                style={{
                  padding: "0 1rem",
                  fontSize: "0.88rem",
                  fontWeight: "800",
                  color: "var(--text-main)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  whiteSpace: "nowrap"
                }}
              >
                <Calendar size={15} color="var(--corp-green)" />
                <span>{weekRangeLabel}</span>
              </div>
              <button
                type="button"
                onClick={() => setWeekOffset((prev) => prev + 1)}
                title={t("summary.next_week") || "Semana siguiente"}
                style={{
                  background: "white",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  width: "34px",
                  height: "34px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--text-main)"
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.55rem",
            marginBottom: "2rem",
            paddingBottom: "1.25rem",
            borderBottom: "1px solid #f1f5f9"
          }}
        >
          {CATEGORY_CONFIG.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategories.includes(cat.key);
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => toggleCategory(cat.key)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.45rem 0.85rem",
                  borderRadius: "2rem",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  border: isSelected ? `2px solid ${cat.color}` : "1.5px solid #e2e8f0",
                  background: isSelected ? cat.bgLight : "white",
                  color: isSelected ? cat.color : "#64748b",
                  transition: "all 0.15s ease"
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: isSelected ? cat.color : "#cbd5e1",
                    display: "inline-block"
                  }}
                />
                <Icon size={14} />
                <span>{t(cat.labelKey) || cat.fallback}</span>
              </button>
            );
          })}
        </div>

        {/* Bar Chart Area */}
        <div style={{ position: "relative", paddingTop: "1rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(75px, 1fr))",
              gap: "0.75rem",
              alignItems: "end",
              height: "270px",
              padding: "1.5rem 0.5rem 0 0.5rem",
              borderBottom: "2px solid #e2e8f0",
              overflowX: "auto"
            }}
          >
            {dailyCounts.map((dayItem, idx) => {
              const isToday =
                new Date().toDateString() === dayItem.date.toDateString();
              const weekdayShort = new Intl.DateTimeFormat(localeTag, {
                weekday: "short"
              }).format(dayItem.date);
              const dayMonth = new Intl.DateTimeFormat(localeTag, {
                day: "2-digit",
                month: "2-digit"
              }).format(dayItem.date);

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    justifyContent: "flex-end"
                  }}
                >
                  {/* Bars container for the day */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      gap: "4px",
                      width: "100%",
                      height: "210px",
                      padding: "0 4px"
                    }}
                  >
                    {selectedCategories.map((catKey) => {
                      const cat = CATEGORY_CONFIG.find((c) => c.key === catKey);
                      const count = dayItem.counts[catKey] || 0;
                      const heightPct = count === 0 ? 3 : Math.max(8, Math.round((count / maxBarValue) * 100));
                      return (
                        <div
                          key={catKey}
                          title={`${t(cat.labelKey) || cat.fallback}: ${count}`}
                          style={{
                            flex: 1,
                            maxWidth: "28px",
                            minWidth: "8px",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            alignItems: "center"
                          }}
                        >
                          {count > 0 && (
                            <span
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: "800",
                                color: cat.color,
                                marginBottom: "3px",
                                lineHeight: 1
                              }}
                            >
                              {count}
                            </span>
                          )}
                          <div
                            style={{
                              width: "100%",
                              height: `${heightPct}%`,
                              background: count > 0 ? cat.color : "#e2e8f0",
                              borderRadius: "6px 6px 0 0",
                              transition: "height 0.3s ease, background 0.2s ease",
                              opacity: count > 0 ? 1 : 0.45
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-axis Day Labels */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(75px, 1fr))",
              gap: "0.75rem",
              padding: "0.75rem 0.5rem 0 0.5rem"
            }}
          >
            {dailyCounts.map((dayItem, idx) => {
              const isToday =
                new Date().toDateString() === dayItem.date.toDateString();
              const weekdayShort = new Intl.DateTimeFormat(localeTag, {
                weekday: "short"
              }).format(dayItem.date);
              const dayMonth = new Intl.DateTimeFormat(localeTag, {
                day: "2-digit",
                month: "2-digit"
              }).format(dayItem.date);

              return (
                <div
                  key={idx}
                  style={{
                    textAlign: "center",
                    padding: "0.35rem 0.25rem",
                    borderRadius: "0.5rem",
                    background: isToday ? "#f0fdf4" : "transparent",
                    border: isToday ? "1px solid #bbf7d0" : "1px solid transparent"
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "800",
                      textTransform: "capitalize",
                      color: isToday ? "var(--corp-green)" : "var(--text-main)"
                    }}
                  >
                    {weekdayShort}
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: isToday ? "var(--corp-green)" : "var(--text-muted)",
                      fontWeight: "600"
                    }}
                  >
                    {dayMonth}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Popup: Today's Controls Breakdown */}
      {showDetailsModal && (
        <div
          onClick={() => setShowDetailsModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 10005,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.25rem"
          }}
        >
          <div
            className="glass-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              width: "100%",
              maxWidth: "520px",
              borderRadius: "1.5rem",
              padding: "2rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "0.75rem",
                    background: "#e0f2fe",
                    color: "#0284c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "800", margin: 0, color: "var(--text-main)" }}>
                    {t("summary.details_modal_title") || "Detalle de controles registrados hoy"}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#475569"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.5rem" }}>
              {controlCategories.map((cat) => {
                const Icon = cat.icon;
                const count = summaryData.todayControlsBreakdown?.[cat.key] || 0;
                return (
                  <div
                    key={cat.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.85rem 1rem",
                      borderRadius: "0.85rem",
                      background: count > 0 ? cat.bgLight : "#f8fafc",
                      border: `1px solid ${count > 0 ? cat.color + "33" : "#e2e8f0"}`
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "0.6rem",
                          background: "white",
                          color: cat.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <span style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "0.92rem" }}>
                        {t(cat.labelKey) || cat.fallback}
                      </span>
                    </div>
                    <span
                      style={{
                        fontWeight: "900",
                        fontSize: "1.05rem",
                        color: count > 0 ? cat.color : "#94a3b8",
                        background: "white",
                        padding: "0.2rem 0.7rem",
                        borderRadius: "2rem",
                        minWidth: "36px",
                        textAlign: "center",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                      }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.15rem",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "0.85rem",
                marginBottom: "1.25rem"
              }}
            >
              <span style={{ fontWeight: "800", color: "var(--corp-green)", fontSize: "0.95rem" }}>
                {t("summary.total_controls_today") || "Total controles hoy"}
              </span>
              <span style={{ fontWeight: "900", color: "var(--corp-green)", fontSize: "1.25rem" }}>
                {summaryData.todayControlsTotal}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowDetailsModal(false)}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "0.75rem",
                fontWeight: "800",
                fontSize: "0.95rem",
                cursor: "pointer"
              }}
            >
              {t("common.close") || "Cerrar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
