"use client";

import React, { useState, useMemo } from "react";
import { 
  ChefHat, Search, X, FileText, Copy, Edit, Trash2, 
  PlayCircle, ArrowUpDown, ChevronUp, ChevronDown, 
  Plus, Calendar, Hash, Boxes, ScanBarcode
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

const formatDateDDMMYYYY = (dateInput) => {
  if (!dateInput) return "-";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "-";
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return "-";
  }
};

export default function RecipeListModal({
  isOpen,
  onClose,
  recipes = [],
  onEdit,
  onDuplicate,
  onDelete,
  onTechnicalSheet,
  onElaborate,
  onNewRecipe
}) {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name"); // 'name' | 'ingredients' | 'createdAt' | 'elaborations'
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' | 'desc'

  if (!isOpen) return null;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection(field === "name" ? "asc" : "desc");
    }
  };

  const filteredAndSortedRecipes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let result = (recipes || []).filter(r => {
      if (!term) return true;
      const nameMatch = (r.name || "").toLowerCase().includes(term);
      const barcodeMatch = (r.barcode || "").toLowerCase().includes(term);
      return nameMatch || barcodeMatch;
    });

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" });
      } else if (sortField === "ingredients") {
        const countA = a.ingredients?.length || 0;
        const countB = b.ingredients?.length || 0;
        comparison = countA - countB;
      } else if (sortField === "createdAt") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        comparison = dateA - dateB;
      } else if (sortField === "elaborations") {
        const countA = a._count?.elaborations ?? 0;
        const countB = b._count?.elaborations ?? 0;
        comparison = countA - countB;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [recipes, searchTerm, sortField, sortDirection]);

  const totalElaborations = useMemo(() => {
    return (recipes || []).reduce((acc, r) => acc + (r._count?.elaborations || 0), 0);
  }, [recipes]);

  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} style={{ opacity: 0.35, marginLeft: '0.35rem' }} />;
    }
    return sortDirection === "asc" 
      ? <ChevronUp size={15} style={{ color: 'var(--corp-green)', marginLeft: '0.35rem' }} />
      : <ChevronDown size={15} style={{ color: 'var(--corp-green)', marginLeft: '0.35rem' }} />;
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1200 }} onClick={onClose}>
      <div 
        className="modal-content glass-card"
        style={{ 
          maxWidth: '1050px', 
          width: '95%', 
          padding: '2rem', 
          borderRadius: '1.25rem',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'scaleUp 0.2s ease',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          background: 'white'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ 
              width: '46px', 
              height: '46px', 
              borderRadius: '12px', 
              background: 'rgba(66, 98, 22, 0.1)', 
              color: 'var(--corp-green)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ChefHat size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {t('recipes.recipe_list_title') || "Listado de Recetas"}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {t('recipes.recipe_list_subtitle') || "Consulta todas tus recetas, número de ingredientes, fecha de creación y elaboraciones registradas."}
              </div>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ 
              background: '#f1f5f9', 
              border: 'none', 
              color: '#64748b', 
              cursor: 'pointer', 
              padding: '0.5rem', 
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            title={t('common.close') || "Cerrar"}
          >
            <X size={20} />
          </button>
        </header>

        {/* CONTROLS BAR: SEARCH & SUMMARY STATS */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          marginBottom: '1.25rem' 
        }}>
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '450px' }}>
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }} 
            />
            <input 
              type="text"
              className="input-field"
              placeholder={t('common.search') || "Buscar receta..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                paddingLeft: '2.75rem', 
                height: '2.85rem', 
                borderRadius: '0.75rem',
                fontSize: '0.95rem',
                width: '100%'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              padding: '0.45rem 0.85rem', 
              background: '#f8fafc', 
              border: '1px solid var(--border)', 
              borderRadius: '0.75rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: 'var(--text-main)'
            }}>
              <Boxes size={15} color="var(--corp-green)" />
              <span>{recipes.length} {t('recipes.total_recipes') || "recetas"}</span>
            </div>

            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              padding: '0.45rem 0.85rem', 
              background: '#f0fdf4', 
              border: '1px solid #bbf7d0', 
              borderRadius: '0.75rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: '#15803d'
            }}>
              <PlayCircle size={15} />
              <span>{totalElaborations} {t('recipes.total_elaborations') || "elaboraciones"}</span>
            </div>

            {onNewRecipe && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNewRecipe();
                }}
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1rem',
                  fontSize: '0.85rem',
                  borderRadius: '0.75rem'
                }}
              >
                <Plus size={16} />
                <span>{t('modals.new_recipe_btn') || "Nueva receta"}</span>
              </button>
            )}
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div style={{ 
          flex: 1, 
          overflow: 'hidden', 
          border: '1px solid var(--border)', 
          borderRadius: '1rem',
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          minHeight: 0
        }}>
          <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '760px', fontSize: '0.9rem' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1, borderBottom: '2px solid var(--border)' }}>
                <tr>
                  <th 
                    onClick={() => handleSort("name")}
                    style={{ 
                      padding: '1rem 1.25rem', 
                      fontWeight: '800', 
                      color: '#475569', 
                      fontSize: '0.8rem', 
                      textTransform: 'uppercase', 
                      cursor: 'pointer',
                      userSelect: 'none',
                      letterSpacing: '0.03em'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>{t('recipes.col_recipe_name') || "Nombre de la receta"}</span>
                      {renderSortIndicator("name")}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort("ingredients")}
                    style={{ 
                      padding: '1rem 1.25rem', 
                      fontWeight: '800', 
                      color: '#475569', 
                      fontSize: '0.8rem', 
                      textTransform: 'uppercase', 
                      cursor: 'pointer',
                      userSelect: 'none',
                      textAlign: 'center',
                      width: '160px',
                      letterSpacing: '0.03em'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span>{t('recipes.col_ingredients_count') || "Nº Ingredientes"}</span>
                      {renderSortIndicator("ingredients")}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort("createdAt")}
                    style={{ 
                      padding: '1rem 1.25rem', 
                      fontWeight: '800', 
                      color: '#475569', 
                      fontSize: '0.8rem', 
                      textTransform: 'uppercase', 
                      cursor: 'pointer',
                      userSelect: 'none',
                      textAlign: 'center',
                      width: '180px',
                      letterSpacing: '0.03em'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span>{t('recipes.col_created_at') || "Fecha de creación"}</span>
                      {renderSortIndicator("createdAt")}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort("elaborations")}
                    style={{ 
                      padding: '1rem 1.25rem', 
                      fontWeight: '800', 
                      color: '#475569', 
                      fontSize: '0.8rem', 
                      textTransform: 'uppercase', 
                      cursor: 'pointer',
                      userSelect: 'none',
                      textAlign: 'center',
                      width: '190px',
                      letterSpacing: '0.03em'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span>{t('recipes.col_elaborations_count') || "Elaboraciones creadas"}</span>
                      {renderSortIndicator("elaborations")}
                    </div>
                  </th>
                  <th 
                    style={{ 
                      padding: '1rem 1.25rem', 
                      fontWeight: '800', 
                      color: '#475569', 
                      fontSize: '0.8rem', 
                      textTransform: 'uppercase', 
                      textAlign: 'right',
                      width: '210px',
                      letterSpacing: '0.03em'
                    }}
                  >
                    {t('common.actions') || "Acciones"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedRecipes.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <ChefHat size={38} color="var(--border)" style={{ marginBottom: '0.75rem' }} />
                      <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                        {searchTerm ? (t('recipes.no_recipes_found') || "No se encontraron recetas con ese término") : (t('dashboard.no_own_recipes') || "No hay recetas disponibles")}
                      </div>
                      <div style={{ fontSize: '0.85rem' }}>
                        {searchTerm ? "Prueba a buscar con otra palabra clave." : "Comienza creando tu primera receta."}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedRecipes.map(recipe => {
                    const ingCount = recipe.ingredients ? recipe.ingredients.length : 0;
                    const elabCount = recipe._count?.elaborations ?? 0;
                    const dateFormatted = formatDateDDMMYYYY(recipe.createdAt);

                    return (
                      <tr 
                        key={recipe.id} 
                        style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                        className="hover-row"
                      >
                        {/* 1. NOMBRE DE LA RECETA */}
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ 
                              width: '34px', 
                              height: '34px', 
                              borderRadius: '8px', 
                              background: 'rgba(66, 98, 22, 0.08)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <ChefHat size={17} color="var(--corp-green)" />
                            </div>
                            <div>
                              <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                                {recipe.name}
                              </div>
                              {recipe.barcode && (
                                <div style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '0.25rem', 
                                  background: '#f8fafc', 
                                  border: '1px solid #e2e8f0', 
                                  padding: '0.1rem 0.4rem', 
                                  borderRadius: '4px', 
                                  fontSize: '0.72rem', 
                                  color: '#64748b',
                                  marginTop: '0.15rem',
                                  fontFamily: 'monospace'
                                }}>
                                  <ScanBarcode size={11} />
                                  <span>{recipe.barcode}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. NUMERO DE INGREDIENTES */}
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                          <span style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '2.5rem',
                            padding: '0.25rem 0.65rem', 
                            borderRadius: '1rem', 
                            background: '#f1f5f9', 
                            color: '#334155', 
                            fontSize: '0.85rem', 
                            fontWeight: '800' 
                          }}>
                            {ingCount}
                          </span>
                        </td>

                        {/* 3. FECHA DE CREACION */}
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                          <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.35rem', 
                            color: 'var(--text-main)', 
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}>
                            <Calendar size={14} color="#64748b" />
                            <span>{dateFormatted}</span>
                          </div>
                        </td>

                        {/* 4. NUMERO DE ELABORACIONES CREADAS */}
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                          <span style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '2.5rem',
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '1rem', 
                            background: elabCount > 0 ? '#ecfdf5' : '#f8fafc', 
                            color: elabCount > 0 ? '#059669' : '#94a3b8', 
                            fontSize: '0.85rem', 
                            fontWeight: '800',
                            border: elabCount > 0 ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
                          }}>
                            {elabCount}
                          </span>
                        </td>

                        {/* ACCIONES */}
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {onElaborate && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onElaborate(recipe);
                                }}
                                title={t('dashboard.elaborar') || "Elaborar"}
                                style={{
                                  background: 'var(--corp-green)',
                                  border: 'none',
                                  color: 'white',
                                  padding: '0.45rem 0.65rem',
                                  borderRadius: '0.55rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  fontSize: '0.78rem',
                                  fontWeight: '700',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <PlayCircle size={14} />
                                <span>{t('dashboard.elaborar') || "Elaborar"}</span>
                              </button>
                            )}
                            {onTechnicalSheet && (
                              <button 
                                type="button"
                                onClick={() => onTechnicalSheet(recipe)}
                                title={t('recipes.download_technical_sheet') || "Descargar ficha técnica en PDF"}
                                style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--corp-green)', padding: '0.45rem', borderRadius: '0.55rem', cursor: 'pointer', transition: 'all 0.2s' }}
                              >
                                <FileText size={15} />
                              </button>
                            )}
                            {onDuplicate && (
                              <button 
                                type="button"
                                onClick={() => onDuplicate(recipe)}
                                title={t('common.duplicate') || "Duplicar"}
                                style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--corp-green)', padding: '0.45rem', borderRadius: '0.55rem', cursor: 'pointer', transition: 'all 0.2s' }}
                              >
                                <Copy size={15} />
                              </button>
                            )}
                            {onEdit && (
                              <button 
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onEdit(recipe);
                                }}
                                title={t('common.edit') || "Editar"}
                                style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--corp-green)', padding: '0.45rem', borderRadius: '0.55rem', cursor: 'pointer', transition: 'all 0.2s' }}
                              >
                                <Edit size={15} />
                              </button>
                            )}
                            {onDelete && (
                              <button 
                                type="button"
                                onClick={() => onDelete(recipe.id)}
                                title={t('common.delete') || "Eliminar"}
                                style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.45rem', borderRadius: '0.55rem', cursor: 'pointer', transition: 'all 0.2s' }}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <footer style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Mostrando {filteredAndSortedRecipes.length} de {recipes.length} recetas
          </span>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-secondary"
            style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem', borderRadius: '0.75rem' }}
          >
            {t('common.close') || "Cerrar"}
          </button>
        </footer>
      </div>
    </div>
  );
}
