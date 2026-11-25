"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";
import {
  TrendingUp,
  ChefHat,
  Sparkles,
  Thermometer,
  Droplets,
  Package,
  Layers,
  Trash2,
  Flame,
  Salad,
  X,
  Calendar,
  Loader2,
  CheckCircle,
  Info
} from "lucide-react";

export default function WorkerPerformanceModal({ worker, onClose }) {
  const { t, locale } = useI18n();

  const [range, setRange] = useState("7days");
  const [customStartDate, setCustomStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [customEndDate, setCustomEndDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const rangeOptions = [
    { key: "today", label: t("workers.range_today") || "Hoy" },
    { key: "yesterday", label: t("workers.range_yesterday") || "Ayer" },
    { key: "7days", label: t("workers.range_last_7_days") || "Últimos 7 días" },
    { key: "14days", label: t("workers.range_last_14_days") || "Últimos 14 días" },
    { key: "30days", label: t("workers.range_last_30_days") || "Últimos 30 días" },
    { key: "3months", label: t("workers.range_last_3_months") || "Últimos 3 meses" },
    { key: "custom", label: t("workers.range_custom") || "Personalizado" }
  ];

  const fetchPerformance = useCallback(async () => {
    if (!worker?.id) return;
    setLoading(true);
    setError(null);

    try {
      let url = `/api/workers/${worker.id}/performance?range=${range}`;
      if (range === "custom") {
        url += `&startDate=${customStartDate}&endDate=${customEndDate}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Error al cargar rendimiento");
      }

      setData(json);
    } catch (err) {
      console.error("Error fetching worker performance:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [worker?.id, range, customStartDate, customEndDate]);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(locale === "es" ? "es-ES" : locale || "es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return isoString;
    }
  };

  const modules = [
    {
      key: "elaborations",
      title: t("workers.type_elaborations") || "Elaboraciones",
      icon: ChefHat,
      color: "#059669",
      bg: "#ecfdf5",
      border: "#a7f3d0",
      hasPermission: worker?.hasTraceability
    },
    {
      key: "cleaning",
      title: t("workers.type_cleaning") || "Limpieza",
      icon: Sparkles,
      color: "#2563eb",
      bg: "#eff6ff",
      border: "#bfdbfe",
      hasPermission: worker?.hasCleaning
    },
    {
      key: "temperatures",
      title: t("workers.type_temperatures") || "Temperaturas",
      icon: Thermometer,
      color: "#dc2626",
      bg: "#fef2f2",
      border: "#fecaca",
      hasPermission: worker?.hasTemperatures
    },
    {
      key: "water",
      title: t("workers.type_water") || "Control de aguas",
      icon: Droplets,
      color: "#0ea5e9",
      bg: "#f0f9ff",
      border: "#bae6fd",
      hasPermission: worker?.hasWater
    },
    {
      key: "goods",
      title: t("workers.type_goods") || "Entradas de mercancía",
      icon: Package,
      color: "#ca8a04",
      bg: "#fefce8",
      border: "#fef08a",
      hasPermission: worker?.hasGoods
    },
    {
      key: "cutting",
      title: t("workers.type_cutting") || "Despiece",
      icon: Layers,
      color: "#db2777",
      bg: "#fdf2f8",
      border: "#fbcfe8",
      hasPermission: worker?.hasCutting
    },
    {
      key: "waste",
      title: t("workers.type_waste") || "Retirada de residuos",
      icon: Trash2,
      color: "#d97706",
      bg: "#fef3c7",
      border: "#fde68a",
      hasPermission: worker?.hasWaste
    },
    {
      key: "oil",
      title: t("workers.type_oil") || "Retirada de aceites",
      icon: Flame,
      color: "#b45309",
      bg: "#fffbeb",
      border: "#fef3c7",
      hasPermission: worker?.hasOil
    },
    {
      key: "vegetables",
      title: t("workers.type_vegetables") || "Desinfección de vegetales",
      icon: Salad,
      color: "#16a34a",
      bg: "#f0fdf4",
      border: "#bbf7d0",
      hasPermission: worker?.hasVegetables
    }
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-card"
        style={{
          background: "white",
          borderRadius: "1.25rem",
          maxWidth: "880px",
          width: "100%",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem 2rem",
            borderBottom: "1px solid var(--border, #e2e8f0)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            background: "#f8fafc"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
              <div
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  color: "#2563eb",
                  width: "40px",
                  height: "40px",
                  borderRadius: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <TrendingUp size={22} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: "800", color: "var(--text-main, #0f172a)" }}>
                  {t("workers.performance_modal_title") || "Rendimiento del trabajador"}:{" "}
                  <span style={{ color: "var(--corp-green, #059669)" }}>{worker?.name}</span>
                </h2>
                <p style={{ margin: 0, color: "var(--text-muted, #64748b)", fontSize: "0.875rem" }}>
                  {worker?.user?.email || worker?.email || t("workers.performance_modal_subtitle") || "Actividad y registros en el período seleccionado"}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted, #64748b)",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Filters / Time Range Selector */}
        <div
          style={{
            padding: "1.25rem 2rem",
            borderBottom: "1px solid var(--border, #e2e8f0)",
            background: "white"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {t("workers.range_label") || "Período de tiempo"}:
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {rangeOptions.map((opt) => {
                const isActive = range === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setRange(opt.key)}
                    style={{
                      padding: "0.45rem 0.85rem",
                      fontSize: "0.85rem",
                      fontWeight: isActive ? "700" : "500",
                      borderRadius: "0.6rem",
                      border: isActive ? "1px solid #059669" : "1px solid #e2e8f0",
                      background: isActive ? "#ecfdf5" : "#ffffff",
                      color: isActive ? "#059669" : "#475569",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Date Inputs */}
          {range === "custom" && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.85rem 1rem",
                background: "#f8fafc",
                borderRadius: "0.75rem",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                border: "1px solid #e2e8f0"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Calendar size={16} color="#64748b" />
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>
                  {t("workers.from_date") || "Desde"}:
                </span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  style={{
                    padding: "0.4rem 0.6rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.85rem"
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>
                  {t("workers.to_date") || "Hasta"}:
                </span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  style={{
                    padding: "0.4rem 0.6rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.85rem"
                  }}
                />
              </div>

              <button
                type="button"
                onClick={fetchPerformance}
                className="btn-primary"
                style={{
                  padding: "0.4rem 1rem",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                {t("workers.apply") || "Aplicar"}
              </button>
            </div>
          )}
        </div>

        {/* Body Content */}
        <div style={{ padding: "1.75rem 2rem", overflowY: "auto", flex: 1 }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 0" }}>
              <Loader2 size={36} className="animate-spin" color="var(--corp-green, #059669)" />
              <p style={{ marginTop: "1rem", color: "var(--text-muted, #64748b)", fontSize: "0.95rem" }}>
                {t("common.loading") || "Cargando rendimiento..."}
              </p>
            </div>
          ) : error ? (
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "0.75rem",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}
            >
              <Info size={20} />
              <span>{error}</span>
            </div>
          ) : (
            <>
              {/* Summary Banner */}
              <div
                style={{
                  padding: "1.25rem 1.75rem",
                  background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)",
                  borderRadius: "1rem",
                  border: "1px solid #a7f3d0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginBottom: "1.75rem"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#065f46", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("workers.total_records") || "Total de registros realizados"}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#047857", marginTop: "0.2rem" }}>
                    {data?.startDate && data?.endDate
                      ? `${formatDate(data.startDate)} — ${formatDate(data.endDate)}`
                      : ""}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: "900", color: "#065f46", lineHeight: 1 }}>
                    {data?.total || 0}
                  </span>
                  <span style={{ fontSize: "0.95rem", fontWeight: "600", color: "#047857" }}>
                    {t("workers.records_count") || "registros"}
                  </span>
                </div>
              </div>

              {/* Cards Grid for all 9 record types */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "1rem"
                }}
              >
                {modules.map((m) => {
                  const Icon = m.icon;
                  const count = data?.counts?.[m.key] || 0;
                  const hasRecords = count > 0;

                  return (
                    <div
                      key={m.key}
                      style={{
                        padding: "1.25rem",
                        borderRadius: "0.9rem",
                        border: `1px solid ${hasRecords ? m.border : "#e2e8f0"}`,
                        background: hasRecords ? m.bg : "#ffffff",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: "120px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "0.5rem",
                              background: hasRecords ? "white" : "#f1f5f9",
                              color: hasRecords ? m.color : "#94a3b8",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: hasRecords ? "0 2px 4px rgba(0,0,0,0.04)" : "none"
                            }}
                          >
                            <Icon size={18} />
                          </div>
                          <span
                            style={{
                              fontWeight: "700",
                              fontSize: "0.92rem",
                              color: hasRecords ? "#0f172a" : "#64748b"
                            }}
                          >
                            {m.title}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                          <div
                            style={{
                              fontSize: "1.85rem",
                              fontWeight: "900",
                              color: hasRecords ? m.color : "#94a3b8",
                              lineHeight: 1
                            }}
                          >
                            {count}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.2rem" }}>
                            {t("workers.records_count") || "registros"}
                          </div>
                        </div>

                        {/* Permission badge */}
                        <div
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: "600",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "1rem",
                            background: m.hasPermission ? "#dcfce7" : "#f1f5f9",
                            color: m.hasPermission ? "#15803d" : "#94a3b8",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem"
                          }}
                          title={
                            m.hasPermission
                              ? t("workers.permission_active") || "Permiso activo"
                              : t("workers.no_permission") || "Sin permiso asignado"
                          }
                        >
                          {m.hasPermission ? <CheckCircle size={10} /> : null}
                          <span>
                            {m.hasPermission
                              ? t("workers.permission_active") || "Activo"
                              : t("workers.no_permission") || "Sin permiso"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {data?.total === 0 && (
                <div
                  style={{
                    marginTop: "1.5rem",
                    padding: "1rem",
                    borderRadius: "0.75rem",
                    background: "#f8fafc",
                    border: "1px dashed #cbd5e1",
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: "0.875rem"
                  }}
                >
                  {t("workers.no_records_period") || "No se encontraron registros de este trabajador en el período seleccionado."}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1rem 2rem",
            borderTop: "1px solid var(--border, #e2e8f0)",
            display: "flex",
            justifyContent: "flex-end",
            background: "#f8fafc"
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: "0.6rem 1.5rem", fontSize: "0.9rem" }}
          >
            {t("common.close") || "Cerrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
