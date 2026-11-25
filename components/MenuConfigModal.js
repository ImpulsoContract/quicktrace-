"use client";

import React, { useState, useEffect } from "react";
import { 
  X, BookOpen, Eye, Save, Plus, Trash2, ArrowUp, ArrowDown, 
  GripVertical, Check, RefreshCw, FileText, Sparkles, ChevronRight,
  ArrowRight, ArrowLeft
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { 
  DEFAULT_MENU_COLUMNS, 
  MENU_ELEMENT_LABELS,
  generateMenuCatalogPDF 
} from "@/lib/menuCatalogPdfGenerator";

export default function MenuConfigModal({
  isOpen,
  onClose,
  recipes = [],
  initialConfig = {},
  onSave,
  profile = {}
}) {
  const { t, locale } = useI18n();

  // Merge initial config with defaults
  const parsedInitial = typeof initialConfig === "string" ? JSON.parse(initialConfig || "{}") : (initialConfig || {});

  const [columns, setColumns] = useState(() => {
    return {
      col1: parsedInitial.columns?.col1 || [...DEFAULT_MENU_COLUMNS.col1],
      col2: parsedInitial.columns?.col2 || [...DEFAULT_MENU_COLUMNS.col2],
      col3: parsedInitial.columns?.col3 || [...DEFAULT_MENU_COLUMNS.col3],
      col4: parsedInitial.columns?.col4 || [...DEFAULT_MENU_COLUMNS.col4]
    };
  });

  // Candidate selection for adding to each column
  const [selectedToAdd, setSelectedToAdd] = useState({
    col1: "recipeImage",
    col2: "recipeName",
    col3: "allergensIcons",
    col4: "price"
  });

  // Selected recipe IDs in order
  const [selectedRecipeIds, setSelectedRecipeIds] = useState(() => {
    if (Array.isArray(parsedInitial.recipeIds) && parsedInitial.recipeIds.length > 0) {
      // Filter only existing recipes
      const valid = parsedInitial.recipeIds.filter(id => recipes.some(r => r.id === id));
      return valid.length > 0 ? valid : recipes.map(r => r.id);
    }
    return recipes.map(r => r.id);
  });

  // Optional custom prices for dishes in menu
  const [recipePrices, setRecipePrices] = useState(() => {
    return parsedInitial.recipePrices || {};
  });

  const [menuTitle, setMenuTitle] = useState(() => {
    return parsedInitial.title !== undefined ? parsedInitial.title : (t("recipes.menu_default_title") || "CARTA DE PLATOS");
  });

  const [menuSubtitle, setMenuSubtitle] = useState(() => {
    return parsedInitial.subtitle || "";
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Drag state for recipes
  const [draggedRecipeId, setDraggedRecipeId] = useState(null);
  const [dragSource, setDragSource] = useState(null); // 'available' | 'selected'

  useEffect(() => {
    return () => {
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
      }
    };
  }, [previewBlobUrl]);

  if (!isOpen) return null;

  // Available element options
  const AVAILABLE_ELEMENTS = [
    { key: "recipeImage", label: t("recipes.elem_recipe_image") || "Imagen de la receta" },
    { key: "ingredientsList", label: t("recipes.elem_ingredients_list") || "Listado de ingredientes" },
    { key: "recipeName", label: t("recipes.elem_recipe_name") || "Nombre de la receta" },
    { key: "allergensIcons", label: t("recipes.elem_allergens_icons") || "Alérgenos con iconos" },
    { key: "allergensText", label: t("recipes.elem_allergens_text") || "Alérgenos con palabras" },
    { key: "price", label: t("recipes.elem_price") || "Precio" },
    { key: "elaborationInstructions", label: t("recipes.elem_elaboration") || "Elaboración" },
    { key: "conservationInstructions", label: t("recipes.elem_conservation") || "Conservación" }
  ];

  const getElementLabel = (key) => {
    const found = AVAILABLE_ELEMENTS.find(e => e.key === key);
    return found ? found.label : (MENU_ELEMENT_LABELS[key] || key);
  };

  // Add element to a column
  const handleAddElement = (colKey) => {
    const elemToAdd = selectedToAdd[colKey];
    if (!elemToAdd) return;
    setColumns(prev => ({
      ...prev,
      [colKey]: [...(prev[colKey] || []), elemToAdd]
    }));
  };

  // Remove element from a column
  const handleRemoveElement = (colKey, indexToRemove) => {
    setColumns(prev => ({
      ...prev,
      [colKey]: prev[colKey].filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Move element up/down inside a column
  const handleMoveElement = (colKey, index, direction) => {
    setColumns(prev => {
      const list = [...prev[colKey]];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return {
        ...prev,
        [colKey]: list
      };
    });
  };

  // Recipe selection calculations
  const availableRecipes = recipes.filter(r => !selectedRecipeIds.includes(r.id));
  const selectedRecipes = selectedRecipeIds.map(id => recipes.find(r => r.id === id)).filter(Boolean);

  const handleIncludeRecipe = (recipeId) => {
    if (!selectedRecipeIds.includes(recipeId)) {
      setSelectedRecipeIds(prev => [...prev, recipeId]);
    }
  };

  const handleExcludeRecipe = (recipeId) => {
    setSelectedRecipeIds(prev => prev.filter(id => id !== recipeId));
  };

  const handleIncludeAll = () => {
    setSelectedRecipeIds(recipes.map(r => r.id));
  };

  const handleExcludeAll = () => {
    setSelectedRecipeIds([]);
  };

  const handleMoveRecipe = (index, direction) => {
    setSelectedRecipeIds(prev => {
      const list = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return list;
    });
  };

  // Drag and drop handlers for recipes
  const handleDragStart = (e, recipeId, source) => {
    setDraggedRecipeId(recipeId);
    setDragSource(source);
    e.dataTransfer.setData("text/plain", String(recipeId));
  };

  const handleDropOnSelected = (e, targetIndex = null) => {
    e.preventDefault();
    if (!draggedRecipeId) return;

    if (dragSource === "available") {
      // Adding from available to selected
      setSelectedRecipeIds(prev => {
        const without = prev.filter(id => id !== draggedRecipeId);
        if (targetIndex !== null) {
          without.splice(targetIndex, 0, draggedRecipeId);
          return without;
        }
        return [...without, draggedRecipeId];
      });
    } else if (dragSource === "selected") {
      // Reordering within selected
      setSelectedRecipeIds(prev => {
        const list = [...prev];
        const fromIdx = list.indexOf(draggedRecipeId);
        if (fromIdx !== -1 && targetIndex !== null) {
          list.splice(fromIdx, 1);
          list.splice(targetIndex, 0, draggedRecipeId);
        }
        return list;
      });
    }
    setDraggedRecipeId(null);
    setDragSource(null);
  };

  const handleDropOnAvailable = (e) => {
    e.preventDefault();
    if (!draggedRecipeId) return;
    if (dragSource === "selected") {
      handleExcludeRecipe(draggedRecipeId);
    }
    setDraggedRecipeId(null);
    setDragSource(null);
  };

  // Save config
  const handleSaveConfig = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    const newConfig = {
      title: menuTitle,
      subtitle: menuSubtitle,
      columns,
      recipeIds: selectedRecipeIds,
      recipePrices
    };

    try {
      if (onSave) {
        await onSave(newConfig);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving menu config:", err);
      alert(t("recipes.save_menu_error") || "Error al guardar la configuración de la carta");
    } finally {
      setIsSaving(false);
    }
  };

  // Generate PDF preview
  const handleGeneratePDF = async (preview = false) => {
    const currentConfig = {
      title: menuTitle,
      subtitle: menuSubtitle,
      columns,
      recipeIds: selectedRecipeIds,
      recipePrices
    };

    const orderedRecipes = selectedRecipeIds
      .map(id => recipes.find(r => r.id === id))
      .filter(Boolean);

    if (orderedRecipes.length === 0) {
      alert(t("recipes.no_recipes_selected_for_menu") || "Debes incluir al menos una receta en la carta.");
      return;
    }

    try {
      if (preview) {
        const blob = await generateMenuCatalogPDF({
          recipes: orderedRecipes,
          menuConfig: currentConfig,
          profile,
          t,
          locale,
          isPreview: true
        });
        if (blob) {
          if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
          const url = URL.createObjectURL(blob);
          setPreviewBlobUrl(url);
          setIsPreviewOpen(true);
        }
      } else {
        await generateMenuCatalogPDF({
          recipes: orderedRecipes,
          menuConfig: currentConfig,
          profile,
          t,
          locale,
          isPreview: false
        });
      }
    } catch (err) {
      console.error("Error generating menu catalog PDF:", err);
      alert(t("recipes.pdf_generation_error") || "Error al generar el PDF de la carta.");
    }
  };

  return (
    <>
      <div 
        className="modal-overlay" 
        style={{
          zIndex: 1250,
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}
        onClick={onClose}
      >
        <div 
          className="modal-content glass-card"
          style={{
            maxWidth: "1150px",
            width: "98%",
            background: "#ffffff",
            borderRadius: "1.25rem",
            padding: "2rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            maxHeight: "94vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background: "rgba(66, 98, 22, 0.1)",
                color: "var(--corp-green)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <BookOpen size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: "1.35rem", fontWeight: "900", color: "var(--text-main)", margin: 0, letterSpacing: "-0.01em" }}>
                  {t("recipes.menu_designer_title") || "Diseñar y Generar Carta de Platos"}
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "0.2rem", marginBottom: 0 }}>
                  {t("recipes.menu_designer_subtitle") || "Configura el contenido de las 4 columnas de tu carta, selecciona las recetas a mostrar y genera tu carta en PDF para imprimir."}
                </p>
              </div>
            </div>

            <button 
              type="button" 
              onClick={onClose}
              style={{
                background: "#f1f5f9",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                padding: "0.45rem",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* SCROLLABLE CONTENT BODY */}
          <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem" }}>
            {/* TITLE & SUBTITLE INPUTS */}
            <div style={{ marginBottom: "1.5rem", background: "#f8fafc", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0" }}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "0.4rem" }}>
                  {t("recipes.menu_title_label") || "Título de la carta"}
                </label>
                <input 
                  type="text"
                  value={menuTitle}
                  onChange={(e) => setMenuTitle(e.target.value)}
                  placeholder={t("recipes.menu_title_placeholder") || "Ej: NUESTRA CARTA, MENÚ DEGUSTACIÓN..."}
                  className="input-field"
                  style={{ width: "100%", maxWidth: "600px", height: "2.75rem", fontSize: "0.95rem", fontWeight: "700" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "0.4rem" }}>
                  {t("recipes.menu_subtitle_label") || "Subtítulo de la carta"}
                </label>
                <textarea 
                  value={menuSubtitle}
                  onChange={(e) => setMenuSubtitle(e.target.value)}
                  placeholder={t("recipes.menu_subtitle_placeholder") || "Escribe aquí el texto que aparecerá debajo del título..."}
                  rows={3}
                  className="input-field"
                  style={{ width: "100%", maxWidth: "600px", fontSize: "0.88rem", padding: "0.6rem 0.8rem", resize: "vertical", minHeight: "70px" }}
                />
              </div>
            </div>

            {/* SECTION 1: 4 COLUMNS CONFIGURATOR */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "900", color: "var(--text-main)", margin: 0 }}>
                    {t("recipes.menu_columns_title") || "1. Configuración de las 4 Columnas de la Carta"}
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "0.2rem 0 0" }}>
                    {t("recipes.menu_columns_desc") || "Define qué elementos aparecerán en cada una de las 4 columnas de la tabla. Puedes añadir múltiples elementos en cada celda y eliminarlos cuando quieras."}
                  </p>
                </div>
              </div>

              {/* 4 COLUMNS TABLE GRID */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1rem",
                background: "#f8fafc",
                padding: "1.25rem",
                borderRadius: "1rem",
                border: "1px solid #e2e8f0"
              }}>
                {["col1", "col2", "col3", "col4"].map((colKey, colIdx) => {
                  const colElements = columns[colKey] || [];
                  const colNumber = colIdx + 1;

                  return (
                    <div 
                      key={colKey}
                      style={{
                        background: "#ffffff",
                        borderRadius: "0.85rem",
                        padding: "1rem",
                        border: "1px solid #cbd5e1",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
                      }}
                    >
                      {/* Column Header */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingBottom: "0.5rem",
                        borderBottom: "2px solid var(--corp-green)"
                      }}>
                        <span style={{ fontWeight: "800", fontSize: "0.9rem", color: "var(--corp-green)" }}>
                          {t(`recipes.col_${colNumber}_header`) || `Columna ${colNumber}`}
                        </span>
                        <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b" }}>
                          {colElements.length} {colElements.length === 1 ? "elemento" : "elementos"}
                        </span>
                      </div>

                      {/* Added Elements List */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", minHeight: "100px" }}>
                        {colElements.length === 0 ? (
                          <div style={{
                            padding: "1.25rem 0.5rem",
                            textAlign: "center",
                            fontSize: "0.78rem",
                            color: "#94a3b8",
                            border: "1px dashed #cbd5e1",
                            borderRadius: "0.5rem"
                          }}>
                            {t("recipes.col_empty") || "(Columna vacía)"}
                          </div>
                        ) : (
                          colElements.map((elemKey, elemIdx) => (
                            <div 
                              key={`${elemKey}-${elemIdx}`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0.5rem 0.65rem",
                                background: "#f0fdf4",
                                border: "1px solid #bbf7d0",
                                borderRadius: "0.5rem",
                                fontSize: "0.82rem",
                                fontWeight: "700",
                                color: "#166534"
                              }}
                            >
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {getElementLabel(elemKey)}
                              </span>

                              <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                                {elemIdx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveElement(colKey, elemIdx, -1)}
                                    title="Subir"
                                    style={{ background: "none", border: "none", padding: "0.15rem", cursor: "pointer", color: "#166534" }}
                                  >
                                    <ArrowUp size={13} />
                                  </button>
                                )}
                                {elemIdx < colElements.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveElement(colKey, elemIdx, 1)}
                                    title="Bajar"
                                    style={{ background: "none", border: "none", padding: "0.15rem", cursor: "pointer", color: "#166534" }}
                                  >
                                    <ArrowDown size={13} />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveElement(colKey, elemIdx)}
                                  title={t("common.delete") || "Quitar elemento"}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: "#ef4444",
                                    cursor: "pointer",
                                    padding: "0.2rem",
                                    display: "flex",
                                    alignItems: "center"
                                  }}
                                >
                                  <X size={15} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Select & Add Button Controls */}
                      <div style={{ marginTop: "auto", paddingTop: "0.5rem", borderTop: "1px dashed #e2e8f0" }}>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <select
                            value={selectedToAdd[colKey]}
                            onChange={(e) => setSelectedToAdd(prev => ({ ...prev, [colKey]: e.target.value }))}
                            className="input-field"
                            style={{
                              flex: 1,
                              height: "2.4rem",
                              fontSize: "0.78rem",
                              padding: "0 0.5rem",
                              borderRadius: "0.5rem"
                            }}
                          >
                            {AVAILABLE_ELEMENTS.map(item => (
                              <option key={item.key} value={item.key}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleAddElement(colKey)}
                            className="btn-primary"
                            style={{
                              padding: "0 0.65rem",
                              height: "2.4rem",
                              fontSize: "0.8rem",
                              borderRadius: "0.5rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              flexShrink: 0
                            }}
                            title="Añadir elemento a esta columna"
                          >
                            <Plus size={14} />
                            <span>{t("common.add") || "Añadir"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: RECIPE SELECTION & ORDERING (DRAG & DROP) */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "900", color: "var(--text-main)", margin: 0 }}>
                    {t("recipes.menu_recipes_title") || "2. Selección y Ordenación de Recetas en la Carta"}
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "0.2rem 0 0" }}>
                    {t("recipes.menu_recipes_desc") || "Arrastra o mueve las recetas que deseas incluir en la carta y ordénalas según cómo quieras que se muestren en el PDF."}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={handleIncludeAll}
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0.5rem",
                      padding: "0.35rem 0.65rem",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      color: "#334155",
                      cursor: "pointer"
                    }}
                  >
                    {t("recipes.include_all_btn") || "Añadir todas"}
                  </button>
                  <button
                    type="button"
                    onClick={handleExcludeAll}
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "0.5rem",
                      padding: "0.35rem 0.65rem",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      color: "#b91c1c",
                      cursor: "pointer"
                    }}
                  >
                    {t("recipes.exclude_all_btn") || "Quitar todas"}
                  </button>
                </div>
              </div>

              {/* PRICE CLARIFICATION NOTICE */}
              <div style={{
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                borderRadius: "0.75rem",
                padding: "0.7rem 1rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                fontSize: "0.82rem",
                color: "#065f46"
              }}>
                <Sparkles size={16} color="#059669" style={{ flexShrink: 0 }} />
                <span>
                  <strong>{t("recipes.elem_price") || "Precio"}:</strong> {t("recipes.price_clarification_text") || "Este precio solo es para la carta de productos que puedes generar en PDF."}
                </span>
              </div>

              {/* TWO-COLUMN DRAG AND DROP CONTAINER */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {/* LEFT: AVAILABLE RECIPES (NOT VISIBLE) */}
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDropOnAvailable}
                  style={{
                    background: "#f8fafc",
                    border: "2px dashed #cbd5e1",
                    borderRadius: "1rem",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "360px",
                    overflowY: "auto"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.88rem", color: "#475569" }}>
                      {t("recipes.available_recipes_heading") || "Recetas no visibles"} ({availableRecipes.length})
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      Arrastra hacia la derecha para incluir
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {availableRecipes.length === 0 ? (
                      <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
                        Todas las recetas están incluidas en la carta.
                      </div>
                    ) : (
                      availableRecipes.map(recipe => (
                        <div 
                          key={recipe.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, recipe.id, "available")}
                          style={{
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "0.6rem",
                            padding: "0.55rem 0.75rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "0.85rem",
                            cursor: "grab",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <GripVertical size={14} color="#94a3b8" />
                            {recipe.imageUrl ? (
                              <img src={recipe.imageUrl} alt="" style={{ width: "22px", height: "22px", borderRadius: "4px", objectFit: "cover" }} />
                            ) : null}
                            <span style={{ fontWeight: "700", color: "#334155" }}>{recipe.name}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleIncludeRecipe(recipe.id)}
                            title="Incluir en la carta"
                            style={{
                              background: "#f0fdf4",
                              border: "1px solid #bbf7d0",
                              borderRadius: "0.4rem",
                              color: "var(--corp-green)",
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.75rem",
                              fontWeight: "700",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem"
                            }}
                          >
                            <span>Añadir</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* RIGHT: SELECTED RECIPES IN ORDER */}
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropOnSelected(e, null)}
                  style={{
                    background: "#f0fdf4",
                    border: "2px solid #bbf7d0",
                    borderRadius: "1rem",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "360px",
                    overflowY: "auto"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{ fontWeight: "800", fontSize: "0.88rem", color: "#166534" }}>
                      {t("recipes.menu_recipes_heading") || "Recetas en la carta (en orden)"} ({selectedRecipes.length})
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#15803d" }}>
                      Orden de arriba a abajo
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {selectedRecipes.length === 0 ? (
                      <div style={{ padding: "2rem", textAlign: "center", color: "#15803d", fontSize: "0.85rem" }}>
                        Arrastra recetas aquí para incluirlas en la carta.
                      </div>
                    ) : (
                      selectedRecipes.map((recipe, idx) => (
                        <div 
                          key={recipe.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, recipe.id, "selected")}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.stopPropagation();
                            handleDropOnSelected(e, idx);
                          }}
                          style={{
                            background: "#ffffff",
                            border: "1px solid #86efac",
                            borderRadius: "0.6rem",
                            padding: "0.5rem 0.75rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "0.85rem",
                            cursor: "grab",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <GripVertical size={14} color="#86efac" />
                            <span style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              background: "#dcfce7",
                              color: "#166534",
                              fontSize: "0.72rem",
                              fontWeight: "800",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}>
                              {idx + 1}
                            </span>
                            {recipe.imageUrl ? (
                              <img src={recipe.imageUrl} alt="" style={{ width: "24px", height: "24px", borderRadius: "4px", objectFit: "cover" }} />
                            ) : null}
                            <span style={{ fontWeight: "800", color: "var(--text-main)" }}>{recipe.name}</span>
                          </div>

                          {/* INLINE PRICE INPUT */}
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            style={{ display: "flex", alignItems: "center", gap: "0.35rem", margin: "0 0.5rem" }}
                          >
                            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#166534" }}>
                              {t("recipes.elem_price") || "Precio"}:
                            </span>
                            <input 
                              type="number"
                              step="0.01"
                              min="0"
                              value={recipePrices[recipe.id] !== undefined ? recipePrices[recipe.id] : (recipe.price !== null && recipe.price !== undefined && recipe.price !== 0 ? recipe.price : "")}
                              onChange={(e) => {
                                const val = e.target.value === "" ? "" : parseFloat(e.target.value) || 0;
                                setRecipePrices(prev => ({ ...prev, [recipe.id]: val }));
                              }}
                              placeholder="0.00"
                              style={{
                                width: "70px",
                                height: "1.85rem",
                                fontSize: "0.82rem",
                                fontWeight: "700",
                                padding: "0.2rem 0.4rem",
                                borderRadius: "0.35rem",
                                border: "1px solid #86efac",
                                background: "#ffffff",
                                textAlign: "right"
                              }}
                            />
                            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b" }}>
                              {profile?.currency === "USD" ? "$" : profile?.currency === "GBP" ? "£" : "€"}
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveRecipe(idx, -1)}
                                title="Mover arriba"
                                style={{ background: "none", border: "none", color: "#15803d", cursor: "pointer", padding: "0.2rem" }}
                              >
                                <ArrowUp size={14} />
                              </button>
                            )}
                            {idx < selectedRecipes.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveRecipe(idx, 1)}
                                title="Mover abajo"
                                style={{ background: "none", border: "none", color: "#15803d", cursor: "pointer", padding: "0.2rem" }}
                              >
                                <ArrowDown size={14} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleExcludeRecipe(recipe.id)}
                              title="Quitar de la carta"
                              style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.2rem" }}
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "1.25rem",
            borderTop: "1px solid #e2e8f0",
            marginTop: "0.5rem",
            flexWrap: "wrap",
            gap: "0.75rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>
                {selectedRecipes.length} recetas seleccionadas para la carta
              </span>
              {saveSuccess && (
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  color: "#15803d",
                  fontSize: "0.85rem",
                  fontWeight: "700"
                }}>
                  <Check size={16} /> Configuración guardada
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ padding: "0.65rem 1.25rem", fontSize: "0.9rem", borderRadius: "0.75rem" }}
              >
                {t("common.close") || "Cerrar"}
              </button>

              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="btn-secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.65rem 1.4rem",
                  fontSize: "0.9rem",
                  borderRadius: "0.75rem",
                  fontWeight: "700",
                  background: "#ffffff",
                  border: "1px solid #cbd5e1"
                }}
              >
                <Save size={16} />
                <span>{isSaving ? (t("common.saving") || "Guardando...") : (t("common.save") || "Guardar")}</span>
              </button>

              <button
                type="button"
                onClick={() => handleGeneratePDF(true)}
                className="btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.65rem 1.5rem",
                  fontSize: "0.9rem",
                  borderRadius: "0.75rem",
                  fontWeight: "800",
                  boxShadow: "0 4px 6px -1px rgba(66, 98, 22, 0.2)"
                }}
              >
                <Eye size={17} />
                <span>{t("recipes.view_menu_pdf_btn") || "Ver la carta en PDF"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EMBEDDED PDF PREVIEW MODAL */}
      {isPreviewOpen && previewBlobUrl && (
        <div 
          className="modal-overlay" 
          style={{
            zIndex: 1400,
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}
          onClick={() => setIsPreviewOpen(false)}
        >
          <div 
            className="modal-content glass-card"
            style={{
              maxWidth: "960px",
              width: "95%",
              height: "92vh",
              background: "#ffffff",
              borderRadius: "1.25rem",
              padding: "1.5rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
              display: "flex",
              flexDirection: "column"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BookOpen size={20} color="var(--corp-green)" />
                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", margin: 0, color: "var(--text-main)" }}>
                  {t("recipes.preview_menu_title") || "Vista Previa de la Carta en PDF"}
                </h3>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => handleGeneratePDF(false)}
                  className="btn-primary"
                  style={{
                    padding: "0.45rem 1rem",
                    fontSize: "0.85rem",
                    borderRadius: "0.6rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem"
                  }}
                >
                  <FileText size={15} />
                  <span>{t("recipes.download_pdf_btn") || "Descargar PDF"}</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsPreviewOpen(false)}
                  style={{
                    background: "#f1f5f9",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    padding: "0.45rem",
                    borderRadius: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: "0.75rem", overflow: "hidden", background: "#f8fafc" }}>
              <iframe
                src={previewBlobUrl}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Carta PDF Preview"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
