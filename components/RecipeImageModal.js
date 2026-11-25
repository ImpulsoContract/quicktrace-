"use client";

import React, { useState, useRef } from "react";
import { 
  X, UploadCloud, Sparkles, RefreshCw, Check, Trash2, 
  Camera, Image as ImageIcon, Loader2, AlertCircle, ArrowLeft
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

/**
 * Compresses an image file in the browser using HTML5 Canvas
 */
async function compressImage(file, maxWidth = 1000, maxHeight = 1000, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export default function RecipeImageModal({
  isOpen,
  onClose,
  recipe,
  onImageSaved
}) {
  const { t } = useI18n();
  const fileInputRef = useRef(null);

  const [activeMode, setActiveMode] = useState("choice"); // 'choice' | 'upload' | 'ai'
  const [selectedFileImage, setSelectedFileImage] = useState(null);
  const [aiGeneratedImage, setAiGeneratedImage] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen || !recipe) return null;

  const currentImage = recipe.imageUrl || null;

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage(t("recipes.invalid_image_type") || "Por favor selecciona un archivo de imagen válido (JPG, PNG o WEBP).");
      return;
    }

    try {
      setErrorMessage("");
      const compressedDataUrl = await compressImage(file);
      setSelectedFileImage(compressedDataUrl);
    } catch (err) {
      console.error("Error processing file image:", err);
      setErrorMessage(t("recipes.image_process_error") || "Error al procesar la imagen seleccionada.");
    }
  };

  const handleGenerateAi = async () => {
    setIsGeneratingAi(true);
    setErrorMessage("");
    try {
      const res = await fetch(`/api/client/recipes/${recipe.id}/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al generar la imagen");
      }
      setAiGeneratedImage(data.imageUrl);
    } catch (err) {
      console.error("Error generating AI image:", err);
      setErrorMessage(err.message || t("recipes.ai_generate_error") || "Error al generar la imagen con IA.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSaveImage = async (imageUrlToSave) => {
    setIsSaving(true);
    setErrorMessage("");
    try {
      const res = await fetch(`/api/client/recipes/${recipe.id}/image`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: imageUrlToSave })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al guardar la imagen");
      }

      if (onImageSaved) {
        onImageSaved(recipe.id, imageUrlToSave);
      }
      onClose();
    } catch (err) {
      console.error("Error saving recipe image:", err);
      setErrorMessage(err.message || t("recipes.save_image_error") || "Error al guardar la imagen en la receta.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!confirm(t("recipes.remove_image_confirm") || "¿Estás seguro de que deseas eliminar la imagen de esta receta?")) {
      return;
    }
    await handleSaveImage(null);
  };

  return (
    <div 
      className="modal-overlay" 
      style={{
        zIndex: 1300,
        backgroundColor: "rgba(15, 23, 42, 0.7)",
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
          maxWidth: "600px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "1.25rem",
          padding: "2rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          position: "relative",
          maxHeight: "92vh",
          overflowY: "auto"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "rgba(66, 98, 22, 0.1)",
              color: "var(--corp-green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <Camera size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--text-main)", margin: 0, letterSpacing: "-0.01em" }}>
                {t("recipes.modal_image_title") || "Imagen de la receta"}
              </h2>
              <p style={{ color: "var(--corp-green)", fontSize: "0.95rem", fontWeight: "700", marginTop: "0.2rem", marginBottom: 0 }}>
                {recipe.name}
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

        {/* ERROR BANNER */}
        {errorMessage && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "#fef2f2",
            border: "1px solid #fee2e2",
            color: "#b91c1c",
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            fontSize: "0.85rem",
            fontWeight: "600",
            marginBottom: "1.25rem"
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* CURRENT IMAGE PREVIEW (IF ANY) */}
        {currentImage && activeMode === "choice" && (
          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "1rem",
            padding: "1rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <img 
                src={currentImage} 
                alt={recipe.name}
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "10px",
                  objectFit: "cover",
                  border: "1px solid #cbd5e1"
                }}
              />
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                  {t("recipes.current_image_badge") || "Imagen actual"}
                </span>
                <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#1e293b" }}>
                  {t("recipes.recipe_has_image") || "Esta receta ya tiene una imagen asociada"}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isSaving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.45rem 0.85rem",
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#dc2626",
                background: "#ffffff",
                border: "1px solid #fecaca",
                borderRadius: "0.5rem",
                cursor: isSaving ? "not-allowed" : "pointer"
              }}
            >
              <Trash2 size={14} />
              <span>{t("recipes.remove_image_btn") || "Eliminar imagen"}</span>
            </button>
          </div>
        )}

        {/* MODE 1: CHOICE (INITIAL VIEW) */}
        {activeMode === "choice" && (
          <div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: 0, marginBottom: "1.25rem" }}>
              {t("recipes.choose_image_source") || "¿Cómo deseas adjuntar la imagen para esta receta?"}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              {/* OPTION 1: SUBIR DE SU ORDENADOR */}
              <button
                type="button"
                onClick={() => {
                  setActiveMode("upload");
                  setSelectedFileImage(null);
                  setTimeout(() => fileInputRef.current?.click(), 100);
                }}
                className="btn-choice-card"
                style={{
                  background: "#ffffff",
                  border: "2px solid #e2e8f0",
                  borderRadius: "1rem",
                  padding: "1.5rem 1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "var(--corp-green)";
                  e.currentTarget.style.boxShadow = "0 8px 16px -4px rgba(66, 98, 22, 0.12)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: "#f0fdf4",
                  color: "var(--corp-green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <UploadCloud size={26} />
                </div>
                <div>
                  <div style={{ fontWeight: "800", color: "var(--text-main)", fontSize: "0.98rem", marginBottom: "0.25rem" }}>
                    {t("recipes.upload_from_computer") || "Subir desde mi ordenador"}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", lineHeight: 1.35 }}>
                    {t("recipes.upload_computer_desc") || "Selecciona un archivo JPG, PNG o WEBP de tu galería"}
                  </div>
                </div>
              </button>

              {/* OPTION 2: GENERAR CON IA */}
              <button
                type="button"
                onClick={() => {
                  setActiveMode("ai");
                  setAiGeneratedImage(null);
                  handleGenerateAi();
                }}
                className="btn-choice-card"
                style={{
                  background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
                  border: "2px solid #d8b4fe",
                  borderRadius: "1rem",
                  padding: "1.5rem 1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#9333ea";
                  e.currentTarget.style.boxShadow = "0 8px 16px -4px rgba(147, 51, 234, 0.2)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#d8b4fe";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: "#9333ea",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Sparkles size={26} />
                </div>
                <div>
                  <div style={{ fontWeight: "800", color: "#6b21a8", fontSize: "0.98rem", marginBottom: "0.25rem" }}>
                    {t("recipes.generate_with_ai") || "Generar imagen única con IA"}
                  </div>
                  <div style={{ color: "#7e22ce", fontSize: "0.8rem", lineHeight: 1.35 }}>
                    {t("recipes.generate_ai_desc") || "Creación fotográfica automática y exclusiva para tu receta"}
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: UPLOAD FROM COMPUTER */}
        {activeMode === "upload" && (
          <div>
            <button
              type="button"
              onClick={() => {
                setActiveMode("choice");
                setSelectedFileImage(null);
                setErrorMessage("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                fontWeight: "700",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                cursor: "pointer",
                padding: 0,
                marginBottom: "1rem"
              }}
            >
              <ArrowLeft size={16} />
              <span>{t("common.back") || "Volver"}</span>
            </button>

            <input 
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />

            {!selectedFileImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: "1rem",
                  padding: "3rem 1.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "#f8fafc",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "var(--corp-green)";
                  e.currentTarget.style.background = "#f0fdf4";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.background = "#f8fafc";
                }}
              >
                <UploadCloud size={40} color="var(--corp-green)" style={{ margin: "0 auto 1rem" }} />
                <div style={{ fontWeight: "700", fontSize: "1rem", color: "var(--text-main)", marginBottom: "0.35rem" }}>
                  {t("recipes.click_to_upload") || "Haz clic para seleccionar una foto de tu ordenador"}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  {t("recipes.supported_formats") || "Formatos admitidos: JPG, PNG o WEBP"}
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  position: "relative",
                  width: "100%",
                  height: "280px",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  border: "2px solid #e2e8f0",
                  marginBottom: "1.25rem",
                  background: "#0f172a"
                }}>
                  <img 
                    src={selectedFileImage} 
                    alt="Preview" 
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      position: "absolute",
                      bottom: "1rem",
                      right: "1rem",
                      background: "rgba(0, 0, 0, 0.75)",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      padding: "0.45rem 0.85rem",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      backdropFilter: "blur(4px)"
                    }}
                  >
                    <Camera size={14} />
                    <span>{t("recipes.change_file") || "Cambiar foto"}</span>
                  </button>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFileImage(null);
                      setActiveMode("choice");
                    }}
                    className="btn-secondary"
                    style={{ padding: "0.65rem 1.25rem", fontSize: "0.9rem", borderRadius: "0.75rem" }}
                  >
                    {t("common.cancel") || "Cancelar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveImage(selectedFileImage)}
                    disabled={isSaving}
                    className="btn-primary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      padding: "0.65rem 1.5rem",
                      fontSize: "0.9rem",
                      borderRadius: "0.75rem"
                    }}
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    <span>{isSaving ? (t("common.saving") || "Guardando...") : (t("recipes.apply_image_btn") || "Guardar imagen")}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 3: GENERATE WITH AI */}
        {activeMode === "ai" && (
          <div>
            <button
              type="button"
              onClick={() => {
                setActiveMode("choice");
                setAiGeneratedImage(null);
                setErrorMessage("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                fontWeight: "700",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                cursor: "pointer",
                padding: 0,
                marginBottom: "1rem"
              }}
            >
              <ArrowLeft size={16} />
              <span>{t("common.back") || "Volver"}</span>
            </button>

            {isGeneratingAi ? (
              <div style={{
                background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
                border: "2px solid #d8b4fe",
                borderRadius: "1.25rem",
                padding: "3.5rem 1.5rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#9333ea",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Loader2 size={28} className="animate-spin" />
                </div>
                <div>
                  <div style={{ fontWeight: "800", color: "#6b21a8", fontSize: "1.1rem", marginBottom: "0.35rem" }}>
                    {t("recipes.generating_ai_title") || "Creando imagen única con IA..."}
                  </div>
                  <div style={{ color: "#7e22ce", fontSize: "0.85rem", maxWidth: "380px", margin: "0 auto" }}>
                    {t("recipes.generating_ai_desc") || "La Inteligencia Artificial está fotografiando un plato realista basado en tu receta."}
                  </div>
                </div>
              </div>
            ) : aiGeneratedImage ? (
              <div>
                <div style={{
                  position: "relative",
                  width: "100%",
                  height: "300px",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  border: "2px solid #a855f7",
                  boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.25)",
                  marginBottom: "1.25rem",
                  background: "#0f172a"
                }}>
                  <img 
                    src={aiGeneratedImage} 
                    alt="AI Generated Recipe" 
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    top: "0.75rem",
                    left: "0.75rem",
                    background: "rgba(147, 51, 234, 0.85)",
                    color: "white",
                    padding: "0.3rem 0.65rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                    fontWeight: "800",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    backdropFilter: "blur(4px)"
                  }}>
                    <Sparkles size={13} />
                    <span>{t("recipes.ai_generated_badge") || "Generada con IA"}</span>
                  </div>
                </div>

                {/* BOTONES: ACEPTAR O GENERAR OTRA */}
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  gap: "0.75rem",
                  flexWrap: "wrap"
                }}>
                  <button
                    type="button"
                    onClick={handleGenerateAi}
                    disabled={isGeneratingAi || isSaving}
                    className="btn-secondary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      padding: "0.7rem 1.25rem",
                      fontSize: "0.9rem",
                      borderRadius: "0.75rem",
                      fontWeight: "700",
                      color: "#7e22ce",
                      border: "1px solid #d8b4fe",
                      background: "#faf5ff"
                    }}
                    title={t("recipes.generate_another_tooltip") || "Generar otra variante de imagen con IA"}
                  >
                    <RefreshCw size={16} />
                    <span>{t("recipes.generate_another_btn") || "Generar otra"}</span>
                  </button>

                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setAiGeneratedImage(null);
                        setActiveMode("choice");
                      }}
                      className="btn-secondary"
                      style={{ padding: "0.7rem 1.25rem", fontSize: "0.9rem", borderRadius: "0.75rem" }}
                    >
                      {t("common.cancel") || "Cancelar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveImage(aiGeneratedImage)}
                      disabled={isSaving}
                      className="btn-primary"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        padding: "0.7rem 1.5rem",
                        fontSize: "0.9rem",
                        borderRadius: "0.75rem",
                        fontWeight: "800"
                      }}
                    >
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      <span>{isSaving ? (t("common.saving") || "Guardando...") : (t("recipes.accept_image_btn") || "Aceptar imagen")}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
