"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Eye, Camera, PlayCircle, Store, Sparkles, MoveVertical, ArrowUp, ArrowDown, Plus, Trash2, CheckSquare
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export const DEFAULT_VITRINA_LABEL_CONFIG = {
  headerImage: null,
  freeText: "",
  healthRegistry: "",
  dimensions: {
    width: 100,
    height: 70
  },
  ingredientOptions: {
    showLote: false,
    showAmount: false,
    format: "list"
  },
  elements: ["recipeName", "unitPrice", "ingredientsList", "allergens"],
  recipeNameFontSize: 18,
  priceFontSize: 24,
  generalFontSize: 11,
  showAllergenIcons: true
};

export const mergeVitrinaLabelConfig = (rawConfig, profile = null) => {
  let config = rawConfig;
  if (typeof rawConfig === "string") {
    try {
      config = JSON.parse(rawConfig);
    } catch (e) {
      config = {};
    }
  }

  const defaultHealthRegistry = profile?.rgs || profile?.labelConfig?.healthRegistry || "";

  if (!config || Object.keys(config).length === 0) {
    return { 
      ...DEFAULT_VITRINA_LABEL_CONFIG,
      healthRegistry: defaultHealthRegistry
    };
  }

  return {
    ...DEFAULT_VITRINA_LABEL_CONFIG,
    ...config,
    healthRegistry: config.healthRegistry !== undefined 
      ? config.healthRegistry 
      : (config.sanitaryRegister !== undefined ? config.sanitaryRegister : defaultHealthRegistry),
    dimensions: {
      width: parseInt(config.dimensions?.width, 10) || 100,
      height: parseInt(config.dimensions?.height, 10) || 70
    },
    ingredientOptions: {
      ...DEFAULT_VITRINA_LABEL_CONFIG.ingredientOptions,
      ...(config.ingredientOptions || {})
    },
    elements: Array.isArray(config.elements) && config.elements.length > 0
      ? config.elements
      : [...DEFAULT_VITRINA_LABEL_CONFIG.elements],
    recipeNameFontSize: parseInt(config.recipeNameFontSize, 10) || 18,
    priceFontSize: parseInt(config.priceFontSize, 10) || 24,
    generalFontSize: parseInt(config.generalFontSize, 10) || 11,
    showAllergenIcons: config.showAllergenIcons !== undefined ? Boolean(config.showAllergenIcons) : true
  };
};

export default function VitrinaLabelConfigModal({ config, onClose, onSave, latestElaboration, onGeneratePreview }) {
  const { t } = useI18n();
  const [localConfig, setLocalConfig] = useState(mergeVitrinaLabelConfig(config));
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
      }
    };
  }, [previewBlobUrl]);

  const handleShowPreview = () => {
    try {
      if (!onGeneratePreview) return;
      const blob = onGeneratePreview(localConfig);
      if (blob) {
        if (previewBlobUrl) {
          URL.revokeObjectURL(previewBlobUrl);
        }
        const url = URL.createObjectURL(blob);
        setPreviewBlobUrl(url);
        setIsPreviewOpen(true);
      }
    } catch (err) {
      console.error("Error generating vitrina label preview:", err);
      alert(t("modals.preview_error") || "Error al generar la vista previa de la etiqueta");
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localConfig);
    onClose();
  };

  // All possible vitrina elements
  const ALL_VITRINA_ELEMENTS = [
    "recipeName",
    "unitPrice",
    "ingredientsList",
    "allergens",
    "elaborationDate",
    "expirationDate",
    "lote",
    "elaborationInstructions",
    "conservationInstructions",
    "elaborationNotes",
    "healthRegistry"
  ];

  const getAvailableElements = () => {
    const current = localConfig.elements || [];
    return ALL_VITRINA_ELEMENTS.filter((el) => !current.includes(el));
  };

  const addElement = (el) => {
    if (!localConfig.elements.includes(el)) {
      setLocalConfig({
        ...localConfig,
        elements: [...localConfig.elements, el]
      });
    }
  };

  const removeElement = (el) => {
    setLocalConfig({
      ...localConfig,
      elements: (localConfig.elements || []).filter((item) => item !== el)
    });
  };

  const moveElement = (index, direction) => {
    const arr = [...(localConfig.elements || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= arr.length) return;
    const temp = arr[index];
    arr[index] = arr[targetIndex];
    arr[targetIndex] = temp;
    setLocalConfig({ ...localConfig, elements: arr });
  };

  const handleDropToSelected = (e) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("text/plain");
    if (!item || !ALL_VITRINA_ELEMENTS.includes(item)) return;
    addElement(item);
  };

  const handleDropToAvailable = (e) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("text/plain");
    if (!item) return;
    removeElement(item);
  };

  const updateIngredientField = (field, value) => {
    setLocalConfig({
      ...localConfig,
      ingredientOptions: {
        ...(localConfig.ingredientOptions || {}),
        [field]: value
      }
    });
  };

  const getElementLabel = (el) => {
    switch (el) {
      case "recipeName": return t("vitrina_labels.element_recipe_name") || "Nombre de la receta";
      case "unitPrice": return t("vitrina_labels.element_unit_price") || "Precio";
      case "ingredientsList": return t("vitrina_labels.element_ingredients") || "Ingredientes";
      case "allergens": return t("vitrina_labels.element_allergens") || "Alérgenos";
      case "elaborationDate": return t("vitrina_labels.element_elaboration_date") || "Fecha de elaboración";
      case "expirationDate": return t("vitrina_labels.element_expiration_date") || t("traceability_form.label_expiration") || "Fecha de caducidad";
      case "lote": return t("vitrina_labels.element_lote") || "Número de lote";
      case "elaborationInstructions": return t("vitrina_labels.element_elaboration_mode") || "Elaboración";
      case "conservationInstructions": return t("vitrina_labels.element_conservation") || "Conservación";
      case "elaborationNotes": return t("vitrina_labels.element_notes") || "Notas de elaboración";
      case "healthRegistry": return t("vitrina_labels.element_health_registry") || t("modals.labels_health_registry") || "Registro sanitario";
      default: return el;
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: "880px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header style={{ marginBottom: "1.25rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.25rem", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "0.6rem", background: "rgba(66, 98, 22, 0.1)", color: "var(--corp-green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Store size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "800", margin: 0, color: "var(--text-main)", letterSpacing: "-0.01em" }}>
                  {t("vitrina_labels.modal_title") || "Configurar etiquetas de vitrina"}
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", margin: "0.2rem 0 0 0" }}>
                  {t("vitrina_labels.modal_subtitle") || "Personaliza el diseño para tus etiquetas de expositor, mostrador o vitrina de venta al público."}
                </p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.35rem", borderRadius: "0.5rem" }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Botón de Vista Previa en cabecera */}
          <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
            <button 
              type="button"
              onClick={handleShowPreview}
              className="btn-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.55rem 1.25rem",
                fontSize: "0.88rem",
                fontWeight: "700",
                background: "white",
                border: "1.5px solid var(--corp-green)",
                color: "var(--corp-green)",
                borderRadius: "0.65rem",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(66, 98, 22, 0.08)"
              }}
            >
              <Eye size={18} />
              <span>{t("modals.preview_label_btn") || "Vista previa de la etiqueta"}</span>
            </button>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              {latestElaboration 
                ? (latestElaboration.recipe?.name || latestElaboration.name ? `Con datos de: ${latestElaboration.recipe?.name || latestElaboration.name}` : "Con última elaboración registrada")
                : (t("modals.preview_with_sample_data") || "Mostrando datos de ejemplo")}
            </span>
          </div>
        </header>

        {/* Form Body Scrollable */}
        <form onSubmit={handleSubmit} style={{ overflowY: "auto", paddingRight: "0.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", flex: 1 }}>
          
          {/* 1. Header Image (Logo) */}
          <section style={{ background: "#f8fafc", padding: "1.25rem 1.5rem", borderRadius: "1rem", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <div>
                <h3 style={{ fontSize: "0.98rem", fontWeight: "800", margin: 0, color: "var(--corp-green)" }}>
                  1. {t("vitrina_labels.header_image_title") || "Imagen de encabezado (Logo)"}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", margin: "0.25rem 0 0 0" }}>
                  {t("vitrina_labels.header_image_desc") || "El logo se colocará centrado en la parte superior con un 20% de margen a izquierda y derecha."}
                </p>
              </div>
            </div>

            {localConfig.headerImage ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", alignItems: "flex-start" }}>
                <div style={{ width: "60%", margin: "0 auto", maxHeight: "120px", overflow: "hidden", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "white", padding: "0.5rem", display: "flex", justifyContent: "center" }}>
                  <img src={localConfig.headerImage} alt="Header" style={{ maxHeight: "100px", maxWidth: "100%", height: "auto", objectFit: "contain" }} />
                </div>
                <div style={{ display: "flex", gap: "0.75rem", alignSelf: "center" }}>
                  <label className="btn-secondary" style={{ cursor: "pointer", padding: "0.45rem 0.85rem", fontSize: "0.82rem", display: "flex", alignItems: "center" }}>
                    {t("modals.labels_header_image_change") || "Cambiar imagen"}
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: "none" }} 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setLocalConfig({ ...localConfig, headerImage: reader.result });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setLocalConfig({ ...localConfig, headerImage: null })} 
                    style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2", padding: "0.45rem 0.85rem", borderRadius: "0.5rem", fontSize: "0.82rem", cursor: "pointer" }}
                  >
                    {t("modals.labels_header_image_remove") || "Eliminar imagen"}
                  </button>
                </div>
              </div>
            ) : (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", border: "2px dashed var(--corp-green)", borderRadius: "0.75rem", cursor: "pointer", background: "rgba(66, 98, 22, 0.04)", color: "var(--corp-green)" }}>
                <Camera size={28} style={{ marginBottom: "0.35rem" }} />
                <span style={{ fontWeight: "700", fontSize: "0.88rem" }}>{t("goods_receipt_form.upload_file") || "Subir imagen de encabezado..."}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>PNG o JPG recomendado</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: "none" }} 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setLocalConfig({ ...localConfig, headerImage: reader.result });
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            )}
          </section>

          {/* 2. Free Text Area */}
          <section style={{ background: "#f8fafc", padding: "1.25rem 1.5rem", borderRadius: "1rem", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "0.98rem", fontWeight: "800", marginBottom: "0.35rem", color: "var(--corp-green)" }}>
              2. {t("vitrina_labels.free_text_title") || "Texto libre para la etiqueta"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "0.75rem" }}>
              {t("vitrina_labels.free_text_desc") || "Escribe cualquier información o mensaje que desees mostrar (ej: descripción artesanal, origen, recomendación de consumo...)."}
            </p>
            <textarea 
              className="input-field" 
              rows={3}
              placeholder={t("vitrina_labels.free_text_placeholder") || "Escribe aquí cualquier texto libre para la etiqueta..."}
              value={localConfig.freeText || ""}
              onChange={(e) => setLocalConfig({ ...localConfig, freeText: e.target.value })}
              style={{ resize: "vertical", fontSize: "0.88rem" }}
            />
          </section>

          {/* 3. Sanitary Register / Health Registry */}
          <section style={{ background: "#f8fafc", padding: "1.25rem 1.5rem", borderRadius: "1rem", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "0.98rem", fontWeight: "800", marginBottom: "0.35rem", color: "var(--corp-green)" }}>
              3. {t("vitrina_labels.health_registry_title") || "Registro sanitario"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "0.75rem" }}>
              {t("vitrina_labels.health_registry_desc") || "Indica el número de registro sanitario de tu empresa para poder incluirlo en la etiqueta de vitrina."}
            </p>
            <input 
              type="text" 
              className="input-field" 
              placeholder={t("vitrina_labels.health_registry_placeholder") || "ej: ES 10.01234/B o RGSEAA..."}
              value={localConfig.healthRegistry || ""}
              onChange={(e) => setLocalConfig({ ...localConfig, healthRegistry: e.target.value })}
              style={{ fontSize: "0.88rem" }}
            />
          </section>

          {/* 4. Dimensions */}
          <section style={{ background: "#f8fafc", padding: "1.25rem 1.5rem", borderRadius: "1rem", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "0.98rem", fontWeight: "800", marginBottom: "0.35rem", color: "var(--corp-green)" }}>
              4. {t("modals.labels_dimensions") || "Dimensiones de la etiqueta"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "0.75rem" }}>
              {t("vitrina_labels.dimensions_desc") || "Indica el tamaño en milímetros de tu etiqueta de vitrina o expositor."}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="input-label" style={{ fontWeight: "700" }}>{t("modals.label_width") || "Ancho de la etiqueta (mm)"}</label>
                <input 
                  type="number" 
                  min="30"
                  max="300"
                  className="input-field" 
                  value={localConfig.dimensions?.width || 100}
                  onChange={(e) => setLocalConfig({
                    ...localConfig, 
                    dimensions: { ...(localConfig.dimensions || {}), width: parseInt(e.target.value, 10) || 100 }
                  })}
                />
              </div>
              <div>
                <label className="input-label" style={{ fontWeight: "700" }}>{t("modals.label_height") || "Alto de la etiqueta (mm)"}</label>
                <input 
                  type="number" 
                  min="30"
                  max="300"
                  className="input-field" 
                  value={localConfig.dimensions?.height || 70}
                  onChange={(e) => setLocalConfig({
                    ...localConfig, 
                    dimensions: { ...(localConfig.dimensions || {}), height: parseInt(e.target.value, 10) || 70 }
                  })}
                />
              </div>
            </div>
          </section>

          {/* 5. Ingredients Configurator */}
          <section style={{ background: "#f8fafc", padding: "1.25rem 1.5rem", borderRadius: "1rem", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "0.98rem", fontWeight: "800", marginBottom: "0.35rem", color: "var(--corp-green)" }}>
              5. {t("modals.ingredients_config") || "Configuración de ingredientes"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "0.85rem" }}>
              {t("vitrina_labels.ingredients_config_desc") || "Define cómo se mostrará la lista de ingredientes en la etiqueta."}
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={localConfig.ingredientOptions?.showLote || false} 
                  onChange={(e) => updateIngredientField("showLote", e.target.checked)}
                  style={{ width: "1.2rem", height: "1.2rem", accentColor: "var(--corp-green)" }}
                />
                <div>
                  <span style={{ fontWeight: "700", fontSize: "0.88rem", display: "block" }}>{t("modals.show_lote") || "Mostrar lote de los ingredientes"}</span>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{t("modals.show_lote_desc") || "Muestra el lote asignado a cada ingrediente"}</span>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={localConfig.ingredientOptions?.showAmount || false} 
                  onChange={(e) => updateIngredientField("showAmount", e.target.checked)}
                  style={{ width: "1.2rem", height: "1.2rem", accentColor: "var(--corp-green)" }}
                />
                <div>
                  <span style={{ fontWeight: "700", fontSize: "0.88rem", display: "block" }}>{t("modals.show_real_amount") || "Mostrar cantidad real"}</span>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{t("modals.show_real_amount_desc") || "Incluye las cantidades exactas utilizadas"}</span>
                </div>
              </label>

              <div style={{ marginTop: "0.35rem", paddingTop: "0.85rem", borderTop: "1px dashed var(--border)" }}>
                <label className="input-label" style={{ fontWeight: "700", marginBottom: "0.35rem" }}>{t("modals.visual_format") || "Formato visual"}</label>
                <select 
                  className="input-field" 
                  value={localConfig.ingredientOptions?.format || "list"} 
                  onChange={(e) => updateIngredientField("format", e.target.value)}
                  style={{ padding: "0.65rem", fontSize: "0.88rem" }}
                >
                  <option value="list">{t("modals.format_list") || "Lista línea a línea"}</option>
                  <option value="paragraph">{t("modals.format_paragraph") || "Párrafo continuo separado por comas"}</option>
                </select>
              </div>
            </div>
          </section>

          {/* 6. Drag and Drop Elements Selector */}
          <section style={{ background: "#f8fafc", padding: "1.25rem 1.5rem", borderRadius: "1rem", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "0.98rem", fontWeight: "800", marginBottom: "0.35rem", color: "var(--corp-green)" }}>
              6. {t("vitrina_labels.elements_selection_title") || "Elementos de la etiqueta (Drag & Drop)"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "1rem" }}>
              {t("vitrina_labels.elements_selection_desc") || "Arrastra o añade los elementos que deben aparecer en tu etiqueta y ordénalos según tu preferencia."}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* Disponibles */}
              <div 
                onDragOver={(e) => e.preventDefault()} 
                onDrop={handleDropToAvailable}
                style={{ 
                  background: "#ffffff", 
                  padding: "1rem", 
                  borderRadius: "0.75rem", 
                  border: "1px solid var(--border)", 
                  minHeight: "260px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.75rem", textAlign: "center", color: "var(--text-muted)" }}>
                  {t("modals.labels_col_available") || "Elementos disponibles"} ({getAvailableElements().length})
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", flex: 1 }}>
                  {getAvailableElements().map((el) => (
                    <div 
                      key={el}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", el)}
                      style={{ 
                        padding: "0.6rem 0.85rem", 
                        background: "#f8fafc", 
                        border: "1px solid #e2e8f0", 
                        borderRadius: "0.5rem", 
                        fontSize: "0.82rem", 
                        cursor: "grab", 
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
                      }}
                    >
                      <span style={{ fontWeight: "600" }}>{getElementLabel(el)}</span>
                      <button 
                        type="button" 
                        onClick={() => addElement(el)}
                        title="Añadir a la etiqueta"
                        style={{ border: "none", background: "rgba(66, 98, 22, 0.1)", color: "var(--corp-green)", borderRadius: "0.35rem", padding: "0.25rem 0.5rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.2rem" }}
                      >
                        <Plus size={14} /> Añadir
                      </button>
                    </div>
                  ))}
                  {getAvailableElements().length === 0 && (
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", textAlign: "center", padding: "2rem" }}>
                      {t("vitrina_labels.all_elements_added") || "Todos los elementos están añadidos a la etiqueta."}
                    </div>
                  )}
                </div>
              </div>

              {/* Añadidos a la etiqueta */}
              <div 
                onDragOver={(e) => e.preventDefault()} 
                onDrop={handleDropToSelected}
                style={{ 
                  background: "rgba(66, 98, 22, 0.04)", 
                  padding: "1rem", 
                  borderRadius: "0.75rem", 
                  border: "2px dashed var(--corp-green)", 
                  minHeight: "260px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.75rem", textAlign: "center", color: "var(--corp-green)" }}>
                  {t("vitrina_labels.label_elements_heading") || "Elementos en la etiqueta (Ordenados)"} ({localConfig.elements.length})
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", flex: 1 }}>
                  {localConfig.elements.map((el, idx, arr) => (
                    <div 
                      key={el}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", el)}
                      style={{ 
                        padding: "0.55rem 0.85rem", 
                        background: "#ffffff", 
                        border: "1px solid var(--corp-green)", 
                        borderRadius: "0.5rem", 
                        fontSize: "0.82rem", 
                        cursor: "grab", 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        boxShadow: "0 1px 3px rgba(66, 98, 22, 0.08)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                        <span style={{ fontSize: "0.72rem", color: "#94a3b8", width: "16px", fontWeight: "700" }}>{idx + 1}.</span>
                        <span style={{ fontWeight: "700", color: "var(--text-main)" }}>{getElementLabel(el)}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <button 
                          type="button" 
                          onClick={() => moveElement(idx, -1)} 
                          disabled={idx === 0} 
                          title="Subir"
                          style={{ border: "none", background: "#f1f5f9", borderRadius: "0.3rem", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", cursor: idx === 0 ? "default" : "pointer", color: idx === 0 ? "#cbd5e1" : "var(--text-main)" }}
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => moveElement(idx, 1)} 
                          disabled={idx === arr.length - 1} 
                          title="Bajar"
                          style={{ border: "none", background: "#f1f5f9", borderRadius: "0.3rem", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", cursor: idx === arr.length - 1 ? "default" : "pointer", color: idx === arr.length - 1 ? "#cbd5e1" : "var(--text-main)" }}
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => removeElement(el)} 
                          title="Quitar"
                          style={{ border: "none", background: "#fef2f2", color: "#ef4444", borderRadius: "0.3rem", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginLeft: "0.2rem" }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  {localConfig.elements.length === 0 && (
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", textAlign: "center", padding: "2rem" }}>
                      {t("modals.drag_elements") || "Arrastra elementos aquí o pulsa Añadir"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 7. Special Settings for Specific Elements: Recipe Name, Price & Allergens */}
          <section style={{ background: "#f8fafc", padding: "1.25rem 1.5rem", borderRadius: "1rem", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "0.98rem", fontWeight: "800", marginBottom: "0.35rem", color: "var(--corp-green)" }}>
              7. {t("vitrina_labels.special_settings_title") || "Configuración especial (Nombre, Precio y Alérgenos)"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "1rem" }}>
              {t("vitrina_labels.special_settings_desc") || "Personaliza el tamaño destacado del título y precio, y activa los iconos gráficos para los alérgenos."}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              {/* Tamaño nombre receta */}
              <div>
                <label className="input-label" style={{ fontWeight: "700" }}>
                  {t("vitrina_labels.recipe_name_font_size") || "Tamaño de letra del nombre de la receta"}
                </label>
                <select 
                  className="input-field" 
                  value={localConfig.recipeNameFontSize || 18} 
                  onChange={(e) => setLocalConfig({ ...localConfig, recipeNameFontSize: parseInt(e.target.value, 10) || 18 })}
                  style={{ padding: "0.65rem", fontSize: "0.88rem" }}
                >
                  {[12, 14, 16, 18, 20, 22, 24, 28, 32].map((sz) => (
                    <option key={sz} value={sz}>{sz}px {sz === 18 ? "(Por defecto)" : ""}</option>
                  ))}
                </select>
              </div>

              {/* Tamaño precio */}
              <div>
                <label className="input-label" style={{ fontWeight: "700" }}>
                  {t("vitrina_labels.price_font_size") || "Tamaño de letra del precio"}
                </label>
                <select 
                  className="input-field" 
                  value={localConfig.priceFontSize || 24} 
                  onChange={(e) => setLocalConfig({ ...localConfig, priceFontSize: parseInt(e.target.value, 10) || 24 })}
                  style={{ padding: "0.65rem", fontSize: "0.88rem" }}
                >
                  {[14, 16, 18, 20, 22, 24, 28, 32, 36, 40].map((sz) => (
                    <option key={sz} value={sz}>{sz}px {sz === 24 ? "(Destacado - Por defecto)" : ""}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Checkbox Mostrar iconos para alérgenos */}
            <div style={{ padding: "0.85rem 1rem", background: "white", borderRadius: "0.65rem", border: "1px solid #e2e8f0" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={localConfig.showAllergenIcons} 
                  onChange={(e) => setLocalConfig({ ...localConfig, showAllergenIcons: e.target.checked })}
                  style={{ width: "1.25rem", height: "1.25rem", accentColor: "var(--corp-green)" }}
                />
                <div>
                  <span style={{ fontWeight: "700", fontSize: "0.9rem", display: "block" }}>
                    {t("vitrina_labels.show_allergen_icons_label") || "Mostrar iconos"}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {t("vitrina_labels.show_allergen_icons_desc") || "Si está marcado, los alérgenos aparecerán como iconos circulares gráficos en lugar de texto."}
                  </span>
                </div>
              </label>
            </div>
          </section>

          {/* 8. General Font Size */}
          <section style={{ background: "#f8fafc", padding: "1.25rem 1.5rem", borderRadius: "1rem", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "0.98rem", fontWeight: "800", marginBottom: "0.35rem", color: "var(--corp-green)" }}>
              8. {t("vitrina_labels.general_font_size_title") || "Tamaño de letra general"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "0.75rem" }}>
              {t("vitrina_labels.general_font_size_desc") || "Este tamaño afectará a todos los elementos excepto al precio y al nombre de la receta (ingredientes, lote, fechas, notas...)"}
            </p>
            <select 
              className="input-field" 
              value={localConfig.generalFontSize || 11} 
              onChange={(e) => setLocalConfig({ ...localConfig, generalFontSize: parseInt(e.target.value, 10) || 11 })}
              style={{ padding: "0.65rem", maxWidth: "240px", fontSize: "0.88rem" }}
            >
              {[6, 7, 8, 9, 10, 11, 12, 14, 16].map((sz) => (
                <option key={sz} value={sz}>{sz}px {sz === 11 ? "(Por defecto)" : ""}</option>
              ))}
            </select>
          </section>

          {/* Footer Action Buttons */}
          <footer style={{ marginTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "1.25rem", flexShrink: 0 }}>
            <button 
              type="button" 
              onClick={handleShowPreview} 
              className="btn-secondary"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.88rem" }}
            >
              <Eye size={16} /> {t("modals.preview_label_btn") || "Vista previa"}
            </button>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: "0.65rem 1.5rem" }}>
                {t("common.cancel") || "Cancelar"}
              </button>
              <button type="submit" className="btn-primary" style={{ padding: "0.65rem 2rem", fontWeight: "800" }}>
                {t("common.save") || "Guardar configuración"}
              </button>
            </div>
          </footer>
        </form>

        {/* Modal de Vista Previa superpuesto */}
        {isPreviewOpen && previewBlobUrl && (
          <div 
            className="modal-overlay" 
            style={{ 
              zIndex: 1200, 
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem"
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClosePreview();
            }}
          >
            <div 
              className="modal-content"
              style={{
                width: "90%",
                maxWidth: "760px",
                height: "85vh",
                background: "#ffffff",
                borderRadius: "1rem",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
            >
              <div style={{
                padding: "1rem 1.5rem",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Store size={18} color="var(--corp-green)" />
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)" }}>
                    {t("vitrina_labels.preview_modal_title") || "Vista previa de la etiqueta de vitrina"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleClosePreview}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    padding: "0.25rem",
                    borderRadius: "0.375rem"
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <div style={{ flex: 1, padding: "1rem", background: "#334155" }}>
                <iframe 
                  src={previewBlobUrl} 
                  style={{ width: "100%", height: "100%", border: "none", borderRadius: "0.5rem", background: "white" }}
                  title="Vista previa de etiqueta de vitrina"
                />
              </div>
              <div style={{
                padding: "0.75rem 1.5rem",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc"
              }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {localConfig.dimensions?.width || 100} mm × {localConfig.dimensions?.height || 70} mm
                </span>
                <button 
                  type="button"
                  onClick={handleClosePreview}
                  className="btn-primary"
                  style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}
                >
                  {t("common.close") || "Cerrar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
