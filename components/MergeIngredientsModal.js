"use client";

import React, { useState, useEffect } from "react";
import { 
  GitMerge, Search, AlertTriangle, Check, X, ArrowLeft, Loader2, Sparkles, ChefHat, Boxes
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function MergeIngredientsModal({ isOpen, onClose, recipes = [], onSuccess }) {
  const { t } = useI18n();

  const [step, setStep] = useState(1); // 1 = Selection, 2 = Choose Primary & Confirm
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNames, setSelectedNames] = useState([]);
  const [primaryName, setPrimaryName] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [ingredientsList, setIngredientsList] = useState([]);
  const [loadingIngredients, setLoadingIngredients] = useState(true);

  // Reset or load when modal opens
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSearchTerm("");
      setSelectedNames([]);
      setPrimaryName("");
      setIsConfirmed(false);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadIngredients = async () => {
      setLoadingIngredients(true);
      try {
        const res = await fetch("/api/client/recipes/ingredients");
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.ingredients)) {
          setIngredientsList(data.ingredients);
        } else if (isMounted) {
          fallbackFromRecipes();
        }
      } catch (err) {
        console.error("Error fetching ingredients:", err);
        if (isMounted) fallbackFromRecipes();
      } finally {
        if (isMounted) setLoadingIngredients(false);
      }
    };

    const fallbackFromRecipes = () => {
      const map = new Map();
      (recipes || []).forEach(r => {
        (r.ingredients || []).forEach(ing => {
          const raw = (ing.name || "").trim();
          if (!raw) return;
          const key = raw.toLowerCase();
          if (!map.has(key)) {
            map.set(key, {
              name: raw,
              recipes: [],
              recipeCount: 0,
              units: [],
              lotesCount: 0
            });
          }
          const item = map.get(key);
          if (!item.recipes.includes(r.name)) {
            item.recipes.push(r.name);
            item.recipeCount = item.recipes.length;
          }
        });
      });
      const list = Array.from(map.values()).sort((a, b) => 
        a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
      );
      setIngredientsList(list);
    };

    loadIngredients();

    return () => {
      isMounted = false;
    };
  }, [isOpen, recipes]);

  if (!isOpen) return null;

  // Filter ingredients for Step 1
  const cleanSearch = searchTerm.trim().toLowerCase();
  const filteredIngredients = ingredientsList.filter(item => {
    if (!cleanSearch) return true;
    if (item.name.toLowerCase().includes(cleanSearch)) return true;
    return (item.recipes || []).some(r => r.toLowerCase().includes(cleanSearch));
  });

  const toggleSelect = (name) => {
    setSelectedNames(prev => {
      if (prev.includes(name)) {
        return prev.filter(n => n !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  const handleProceedToStep2 = () => {
    if (selectedNames.length < 2) return;
    if (!primaryName || !selectedNames.includes(primaryName)) {
      setPrimaryName(selectedNames[0]);
    }
    setStep(2);
  };

  const handleExecuteMerge = async () => {
    if (!primaryName) {
      alert(t('recipes.select_primary_title') || "Por favor selecciona el ingrediente principal.");
      return;
    }
    if (!isConfirmed) {
      alert(t('recipes.irreversible_confirm_check') || "Debes confirmar que has leído las advertencias.");
      return;
    }

    const sources = selectedNames.filter(n => n !== primaryName);
    if (sources.length === 0) {
      alert("Selecciona al menos un ingrediente para fusionar en el principal.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/client/recipes/ingredients/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetName: primaryName,
          sourceNames: sources
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(t('recipes.merge_success') || "Ingredientes fusionados correctamente.");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert(data.error || "Error al fusionar los ingredientes.");
      }
    } catch (err) {
      console.error("Error executing merge:", err);
      alert(t('alerts.connection_error') || "Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1200 }} onClick={onClose}>
      <div 
        className="modal-content glass-card"
        style={{ 
          maxWidth: step === 1 ? '680px' : '620px', 
          width: '92%', 
          padding: '2rem', 
          borderRadius: '1.25rem',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'scaleUp 0.2s ease',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '12px', 
              background: 'rgba(66, 98, 22, 0.1)', 
              color: 'var(--corp-green)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <GitMerge size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '900', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {step === 1 
                  ? (t('recipes.merge_ingredients_title') || "Fusionar ingredientes")
                  : (t('recipes.select_primary_title') || "Seleccionar ingrediente principal")
                }
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {step === 1 
                  ? (t('recipes.merge_ingredients_subtitle') || "Unifica ingredientes duplicados o mal escritos en todas tus recetas y elaboraciones.")
                  : (t('recipes.select_primary_desc') || "Elige el ingrediente que se mantendrá. Los demás adoptarán su nombre y se integrarán en él.")
                }
              </div>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            disabled={loading}
            style={{ 
              background: '#f1f5f9', 
              border: 'none', 
              color: '#64748b', 
              cursor: 'pointer', 
              padding: '0.45rem', 
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </header>

        {/* STEP 1: SELECT INGREDIENTS */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
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
                placeholder={t('recipes.search_ingredient') || "Buscar ingrediente..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  paddingLeft: '2.75rem', 
                  height: '2.85rem', 
                  borderRadius: '0.75rem',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Ingredients List */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              maxHeight: '380px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem',
              paddingRight: '0.35rem',
              marginBottom: '1.25rem'
            }}>
              {loadingIngredients ? (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Loader2 className="animate-spin" size={28} style={{ margin: '0 auto 0.75rem auto', color: 'var(--corp-green)' }} />
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>Cargando ingredientes...</p>
                </div>
              ) : filteredIngredients.length === 0 ? (
                <div style={{ 
                  padding: '3rem 1.5rem', 
                  textAlign: 'center', 
                  background: '#f8fafc', 
                  borderRadius: '1rem',
                  border: '1.5px dashed #e2e8f0',
                  color: 'var(--text-muted)' 
                }}>
                  <ChefHat size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>
                    {t('recipes.no_ingredients_found') || "No se encontraron ingredientes."}
                  </p>
                </div>
              ) : (
                filteredIngredients.map(item => {
                  const isChecked = selectedNames.includes(item.name);
                  return (
                    <div 
                      key={item.name}
                      onClick={() => toggleSelect(item.name)}
                      style={{ 
                        padding: '0.85rem 1rem', 
                        borderRadius: '0.85rem', 
                        border: isChecked ? '2px solid var(--corp-green)' : '1px solid #e2e8f0', 
                        background: isChecked ? 'rgba(66, 98, 22, 0.04)' : '#ffffff',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Controlled by container onClick
                        style={{ 
                          width: '1.25rem', 
                          height: '1.25rem', 
                          cursor: 'pointer', 
                          accentColor: 'var(--corp-green)',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: '800', fontSize: '0.98rem', color: isChecked ? 'var(--corp-green)' : 'var(--text-main)' }}>
                            {item.name}
                          </span>
                          {item.lotesCount > 0 && (
                            <span style={{ 
                              padding: '0.15rem 0.5rem', 
                              borderRadius: '0.5rem', 
                              background: '#f1f5f9', 
                              color: '#475569', 
                              fontSize: '0.72rem', 
                              fontWeight: '700' 
                            }}>
                              {(t('recipes.lotes_count_badge') || "{count} lotes registrados").replace('{count}', item.lotesCount)}
                            </span>
                          )}
                        </div>
                        {item.recipes && item.recipes.length > 0 && (
                          <div style={{ 
                            fontSize: '0.78rem', 
                            color: 'var(--text-muted)', 
                            marginTop: '0.2rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {(t('recipes.used_in_recipes') || "En {count} recetas: {recipes}")
                              .replace('{count}', item.recipes.length)
                              .replace('{recipes}', item.recipes.join(', '))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* STEP 1 FOOTER */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              paddingTop: '1rem', 
              borderTop: '1px solid #e2e8f0',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <span style={{ 
                  padding: '0.35rem 0.75rem', 
                  borderRadius: '1rem', 
                  background: selectedNames.length >= 2 ? 'rgba(66, 98, 22, 0.1)' : '#f1f5f9',
                  color: selectedNames.length >= 2 ? 'var(--corp-green)' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: '800'
                }}>
                  {(t('recipes.selected_count') || "{count} ingredientes seleccionados").replace('{count}', selectedNames.length)}
                </span>
                {selectedNames.length < 2 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    ({t('recipes.select_min_ingredients_hint') || "Selecciona al menos 2 ingredientes"})
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="btn-secondary"
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '0.65rem', fontSize: '0.9rem', fontWeight: '700' }}
                >
                  {t('common.cancel') || "Cancelar"}
                </button>
                <button 
                  type="button" 
                  onClick={handleProceedToStep2}
                  disabled={selectedNames.length < 2}
                  className="btn-primary"
                  style={{ 
                    padding: '0.65rem 1.4rem', 
                    borderRadius: '0.65rem', 
                    fontSize: '0.9rem', 
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: selectedNames.length < 2 ? 0.5 : 1,
                    cursor: selectedNames.length < 2 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <GitMerge size={16} />
                  {t('recipes.continue_merge_btn') || "Continuar fusión"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE PRIMARY & CONFIRM */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: '1.25rem' }}>
            {/* List of selected ingredients as Radio Cards */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'block' }}>
                {t('recipes.select_primary_title') || "Selecciona el ingrediente principal:"}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                {selectedNames.map(name => {
                  const isPrimary = primaryName === name;
                  const itemData = ingredientsList.find(i => i.name === name);
                  return (
                    <div 
                      key={name}
                      onClick={() => !loading && setPrimaryName(name)}
                      style={{ 
                        padding: '0.75rem 1rem', 
                        borderRadius: '0.75rem', 
                        border: isPrimary ? '2px solid var(--corp-green)' : '1px solid #e2e8f0', 
                        background: isPrimary ? 'rgba(66, 98, 22, 0.05)' : '#ffffff',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input 
                          type="radio" 
                          name="primaryIngredient"
                          checked={isPrimary}
                          onChange={() => setPrimaryName(name)}
                          disabled={loading}
                          style={{ cursor: 'pointer', accentColor: 'var(--corp-green)', width: '1.2rem', height: '1.2rem' }}
                        />
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.95rem', color: isPrimary ? 'var(--corp-green)' : 'var(--text-main)' }}>
                            {name}
                          </div>
                          {itemData?.recipes && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {itemData.recipes.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>

                      {isPrimary ? (
                        <span style={{ 
                          padding: '0.2rem 0.65rem', 
                          borderRadius: '1rem', 
                          background: 'var(--corp-green)', 
                          color: '#ffffff', 
                          fontSize: '0.75rem', 
                          fontWeight: '800' 
                        }}>
                          {t('recipes.primary_badge') || "Ingrediente Principal"}
                        </span>
                      ) : (
                        <span style={{ 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '1rem', 
                          background: '#fef3c7', 
                          color: '#92400e', 
                          fontSize: '0.72rem', 
                          fontWeight: '700' 
                        }}>
                          Se fusionará
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* IRREVERSIBLE WARNING BOX */}
            <div style={{ 
              background: '#fef2f2', 
              border: '1.5px solid #fecaca', 
              borderRadius: '0.9rem', 
              padding: '1.15rem 1.25rem',
              display: 'flex',
              gap: '0.85rem'
            }}>
              <AlertTriangle size={24} color="#dc2626" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900', color: '#991b1b' }}>
                  {t('recipes.irreversible_warning_title') || "¡Atención! Este cambio es totalmente irreversible"}
                </h4>
                <p style={{ margin: '0.35rem 0 0.5rem 0', fontSize: '0.82rem', color: '#7f1d1d', lineHeight: '1.4' }}>
                  {t('recipes.irreversible_warning_desc') || "Al confirmar la fusión, se aplicarán los siguientes cambios de forma permanente:"}
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#7f1d1d', lineHeight: '1.45' }}>
                  <li>{t('recipes.irreversible_point1') || "Todos los ingredientes seleccionados se renombrarán al ingrediente principal en todas las recetas."}</li>
                  <li>{t('recipes.irreversible_point2') || "Todos los lotes históricos de elaboraciones y albaranes se asociarán al ingrediente principal."}</li>
                  <li>{t('recipes.irreversible_point3') || "El stock y el precio de coste que prevalecerán serán únicamente los que ya tenía el ingrediente principal."}</li>
                </ul>
              </div>
            </div>

            {/* CONFIRMATION CHECKBOX */}
            <label style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '0.75rem', 
              cursor: loading ? 'not-allowed' : 'pointer',
              userSelect: 'none',
              padding: '0.5rem 0.25rem'
            }}>
              <input 
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                disabled={loading}
                style={{ 
                  width: '1.25rem', 
                  height: '1.25rem', 
                  cursor: loading ? 'not-allowed' : 'pointer', 
                  accentColor: '#dc2626',
                  marginTop: '0.1rem',
                  flexShrink: 0
                }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1.4' }}>
                {t('recipes.irreversible_confirm_check') || "He leído las advertencias y confirmo que deseo fusionar estos ingredientes de forma definitiva."}
              </span>
            </label>

            {/* STEP 2 FOOTER */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              paddingTop: '1rem', 
              borderTop: '1px solid #e2e8f0',
              gap: '0.75rem'
            }}>
              <button 
                type="button" 
                onClick={() => setStep(1)}
                disabled={loading}
                className="btn-secondary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  padding: '0.65rem 1.25rem', 
                  borderRadius: '0.65rem', 
                  fontSize: '0.9rem', 
                  fontWeight: '700' 
                }}
              >
                <ArrowLeft size={16} />
                {t('common.back') || "Atrás"}
              </button>

              <button 
                type="button" 
                onClick={handleExecuteMerge}
                disabled={!isConfirmed || loading}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '0.65rem', 
                  fontSize: '0.9rem', 
                  fontWeight: '900',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: !isConfirmed || loading ? '#cbd5e1' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: !isConfirmed || loading ? 'not-allowed' : 'pointer',
                  boxShadow: !isConfirmed || loading ? 'none' : '0 4px 12px rgba(220, 38, 38, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    {t('recipes.merging_in_progress') || "Fusionando ingredientes..."}
                  </>
                ) : (
                  <>
                    <GitMerge size={18} />
                    {t('recipes.confirm_merge_action') || "Confirmar y Fusionar"}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
