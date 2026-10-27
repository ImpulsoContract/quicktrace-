"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Boxes, Plus, Search, Trash2, Edit, X, Layers, 
  ChefHat, Package, GripVertical, Check, AlertCircle, 
  Loader2, Eye, ArrowRight, FolderPlus, Tag, RefreshCw, XCircle
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function ProductFamiliesView({ profile, onUpdate }) {
  const { t } = useI18n();

  // Data state
  const [families, setFamilies] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  // Left panel state
  const [sourceTab, setSourceTab] = useState("recipes"); // "recipes" | "goods"
  const [searchItem, setSearchItem] = useState("");
  const [filterAssignment, setFilterAssignment] = useState("all"); // "all" | "unassigned" | "assigned"

  // Right panel state
  const [searchFamily, setSearchFamily] = useState("");
  const [draggedItem, setDraggedItem] = useState(null); // { type: 'recipe' | 'goods', id, name }
  const [dragOverFamilyId, setDragOverFamilyId] = useState(null);
  const [isDragOverUnassign, setIsDragOverUnassign] = useState(false);

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState("");
  const [creatingFamily, setCreatingFamily] = useState(false);

  const [editingFamily, setEditingFamily] = useState(null); // { id, name }
  const [editFamilyName, setEditFamilyName] = useState("");
  const [updatingFamily, setUpdatingFamily] = useState(false);

  const [selectedFamilyForDetails, setSelectedFamilyForDetails] = useState(null);

  // Toast / Status feedback
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }

  const showFeedback = (text, type = "success") => {
    setFeedback({ type, text });
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/client/product-families?t=${Date.now()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setFamilies(data.families || []);
        setRecipes(data.recipes || []);
        setGoods(data.goods || []);
      } else {
        showFeedback(data.error || "Error al cargar datos", "error");
      }
    } catch (err) {
      console.error("Error loading product families:", err);
      showFeedback("Error de conexión al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update selectedFamilyForDetails when families change
  useEffect(() => {
    if (selectedFamilyForDetails) {
      const updated = families.find(f => f.id === selectedFamilyForDetails.id);
      setSelectedFamilyForDetails(updated || null);
    }
  }, [families]);

  // Create Family
  const handleCreateFamily = async (e) => {
    e.preventDefault();
    const name = newFamilyName.trim();
    if (!name) return;

    setCreatingFamily(true);
    try {
      const res = await fetch("/api/client/product-families", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewFamilyName("");
        setIsNewModalOpen(false);
        showFeedback(t('product_families.assigned_success')?.replace('{family}', name) || `Familia "${name}" creada con éxito.`);
        await fetchData();
        if (onUpdate) onUpdate();
      } else {
        alert(data.error || "Error al crear la familia");
      }
    } catch (err) {
      console.error("Error creating family:", err);
      alert("Error de conexión al crear la familia");
    } finally {
      setCreatingFamily(false);
    }
  };

  // Rename Family
  const handleUpdateFamilyName = async (e) => {
    e.preventDefault();
    if (!editingFamily) return;
    const name = editFamilyName.trim();
    if (!name) return;

    setUpdatingFamily(true);
    try {
      const res = await fetch(`/api/client/product-families/${editingFamily.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEditingFamily(null);
        setEditFamilyName("");
        showFeedback(t('product_families.assigned_success')?.replace('{family}', name) || `Familia actualizada.`);
        await fetchData();
        if (onUpdate) onUpdate();
      } else {
        alert(data.error || "Error al actualizar la familia");
      }
    } catch (err) {
      console.error("Error updating family:", err);
      alert("Error de conexión al actualizar la familia");
    } finally {
      setUpdatingFamily(false);
    }
  };

  // Delete Family
  const handleDeleteFamily = async (family) => {
    const confirmMsg = (t('product_families.delete_confirm') || '¿Estás seguro de que deseas eliminar la familia "{name}"? Las recetas y mercancías asignadas pasarán a no tener familia.').replace('{name}', family.name);
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/client/product-families/${family.id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (selectedFamilyForDetails?.id === family.id) {
          setSelectedFamilyForDetails(null);
        }
        showFeedback(t('product_families.delete_success') || "Familia eliminada correctamente.");
        await fetchData();
        if (onUpdate) onUpdate();
      } else {
        alert(data.error || "Error al eliminar la familia");
      }
    } catch (err) {
      console.error("Error deleting family:", err);
      alert("Error de conexión al eliminar la familia");
    }
  };

  // Drag and Drop Logic
  const handleDragStart = (e, item, type) => {
    const payload = { type, id: item.id, name: item.name };
    setDraggedItem(payload);
    e.dataTransfer.setData("text/plain", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverFamilyId(null);
    setIsDragOverUnassign(false);
  };

  // Assign or unassign an item to a family
  const handleAssignItem = async (itemType, itemId, targetFamilyId) => {
    setAssigning(true);
    const targetFamily = families.find(f => f.id === targetFamilyId);

    // Optimistic UI update
    if (itemType === "recipe") {
      setRecipes(prev => prev.map(r => r.id === itemId ? {
        ...r,
        productFamilyId: targetFamilyId,
        productFamily: targetFamily ? { id: targetFamily.id, name: targetFamily.name } : null
      } : r));
    } else {
      setGoods(prev => prev.map(g => g.id === itemId ? {
        ...g,
        productFamilyId: targetFamilyId,
        productFamily: targetFamily ? { id: targetFamily.id, name: targetFamily.name } : null
      } : g));
    }

    try {
      const res = await fetch("/api/client/product-families/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: itemType,
          itemId,
          productFamilyId: targetFamilyId
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (targetFamily) {
          const msg = (t('product_families.assigned_success') || 'Asignado correctamente a la familia "{family}"').replace('{family}', targetFamily.name);
          showFeedback(msg);
        } else {
          showFeedback(t('product_families.unassign_success') || "Elemento desasignado correctamente");
        }
        await fetchData();
        if (onUpdate) onUpdate();
      } else {
        showFeedback(data.error || "Error al asignar elemento", "error");
        await fetchData();
      }
    } catch (err) {
      console.error("Error assigning item:", err);
      showFeedback("Error de conexión al asignar elemento", "error");
      await fetchData();
    } finally {
      setAssigning(false);
    }
  };

  const handleDropOnFamily = (e, familyId) => {
    e.preventDefault();
    setDragOverFamilyId(null);
    let item = draggedItem;
    if (!item) {
      try {
        const raw = e.dataTransfer.getData("text/plain");
        if (raw) item = JSON.parse(raw);
      } catch (err) {}
    }
    if (!item) return;

    handleAssignItem(item.type, item.id, familyId);
  };

  const handleDropOnUnassign = (e) => {
    e.preventDefault();
    setIsDragOverUnassign(false);
    let item = draggedItem;
    if (!item) {
      try {
        const raw = e.dataTransfer.getData("text/plain");
        if (raw) item = JSON.parse(raw);
      } catch (err) {}
    }
    if (!item) return;

    handleAssignItem(item.type, item.id, null);
  };

  // Filtered lists for left pool
  const currentItems = sourceTab === "recipes" ? recipes : goods;

  const filteredPoolItems = useMemo(() => {
    return currentItems.filter(item => {
      // Search filter
      if (searchItem.trim()) {
        const query = searchItem.toLowerCase().trim();
        const nameMatches = item.name.toLowerCase().includes(query);
        const familyMatches = item.productFamily?.name?.toLowerCase().includes(query);
        if (!nameMatches && !familyMatches) return false;
      }

      // Assignment status filter
      if (filterAssignment === "unassigned" && item.productFamilyId) return false;
      if (filterAssignment === "assigned" && !item.productFamilyId) return false;

      return true;
    });
  }, [currentItems, searchItem, filterAssignment]);

  // Filtered families for right panel
  const filteredFamilies = useMemo(() => {
    if (!searchFamily.trim()) return families;
    const query = searchFamily.toLowerCase().trim();
    return families.filter(f => f.name.toLowerCase().includes(query));
  }, [families, searchFamily]);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      
      {/* Toast Feedback */}
      {feedback && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 14000,
          background: feedback.type === 'error' ? '#ef4444' : '#15803d',
          color: 'white',
          padding: '0.85rem 1.4rem',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontWeight: '700',
          fontSize: '0.9rem',
          animation: 'slideUp 0.25s ease-out'
        }}>
          {feedback.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Header */}
      <header style={{
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #426216 0%, #2d450e 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(66, 98, 22, 0.25)'
            }}>
              <Boxes size={22} />
            </div>
            <h1 style={{
              fontSize: '1.85rem',
              fontWeight: '900',
              color: 'var(--text-main)',
              margin: 0,
              letterSpacing: '-0.02em'
            }}>
              {t('product_families.title') || "Familias de productos"}
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '750px', lineHeight: 1.4 }}>
            {t('product_families.subtitle') || "Organiza tus elaboraciones y mercancías en venta por familias para agruparlas y gestionarlas en el TPV."}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={fetchData}
            title="Refrescar datos"
            disabled={loading}
            style={{
              padding: '0.75rem',
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: '0.75rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            type="button"
            onClick={() => {
              setNewFamilyName("");
              setIsNewModalOpen(true);
            }}
            className="btn-primary"
            style={{
              padding: '0.75rem 1.4rem',
              fontWeight: '800',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 3px 10px rgba(66, 98, 22, 0.2)'
            }}
          >
            <FolderPlus size={18} />
            <span>{t('product_families.btn_new') || "Nueva familia"}</span>
          </button>
        </div>
      </header>

      {/* Drag & Drop Two Column Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 440px) 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>

        {/* ========================================================= */}
        {/* LEFT COLUMN: ITEMS POOL (Elaboraciones / Mercancías)       */}
        {/* ========================================================= */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          border: '1px solid var(--border)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 240px)',
          position: 'sticky',
          top: '1rem'
        }}>
          {/* Tabs: Elaboraciones (Recetas) / Mercancías en venta */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: '#f8fafc',
            borderBottom: '1px solid var(--border)'
          }}>
            <button
              type="button"
              onClick={() => { setSourceTab("recipes"); setSearchItem(""); }}
              style={{
                padding: '0.9rem 1rem',
                border: 'none',
                background: sourceTab === "recipes" ? 'white' : 'transparent',
                borderBottom: sourceTab === "recipes" ? '2px solid var(--corp-green)' : '2px solid transparent',
                fontWeight: sourceTab === "recipes" ? '800' : '600',
                color: sourceTab === "recipes" ? 'var(--corp-green)' : '#64748b',
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease'
              }}
            >
              <ChefHat size={16} />
              <span>{t('product_families.tab_elaborations') || "Elaboraciones"}</span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: '800',
                padding: '0.1rem 0.45rem',
                borderRadius: '0.75rem',
                background: sourceTab === "recipes" ? 'rgba(66, 98, 22, 0.12)' : '#e2e8f0',
                color: sourceTab === "recipes" ? 'var(--corp-green)' : '#64748b'
              }}>
                {recipes.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setSourceTab("goods"); setSearchItem(""); }}
              style={{
                padding: '0.9rem 1rem',
                border: 'none',
                background: sourceTab === "goods" ? 'white' : 'transparent',
                borderBottom: sourceTab === "goods" ? '2px solid var(--corp-green)' : '2px solid transparent',
                fontWeight: sourceTab === "goods" ? '800' : '600',
                color: sourceTab === "goods" ? 'var(--corp-green)' : '#64748b',
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Package size={16} />
              <span>{t('product_families.tab_goods') || "Mercancías en venta"}</span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: '800',
                padding: '0.1rem 0.45rem',
                borderRadius: '0.75rem',
                background: sourceTab === "goods" ? 'rgba(66, 98, 22, 0.12)' : '#e2e8f0',
                color: sourceTab === "goods" ? 'var(--corp-green)' : '#64748b'
              }}>
                {goods.length}
              </span>
            </button>
          </div>

          {/* Search & Filters */}
          <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #f1f5f9', background: 'white' }}>
            <div style={{ position: 'relative', marginBottom: '0.65rem' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                className="input-field"
                placeholder={t('product_families.search_placeholder') || "Buscar por nombre o familia..."}
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                style={{
                  paddingLeft: '2.1rem',
                  fontSize: '0.82rem',
                  paddingTop: '0.45rem',
                  paddingBottom: '0.45rem'
                }}
              />
              {searchItem && (
                <button
                  type="button"
                  onClick={() => setSearchItem("")}
                  style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Chips */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { id: "all", label: t('product_families.filter_all') || "Todos", count: currentItems.length },
                { id: "unassigned", label: t('product_families.filter_unassigned') || "Sin familia", count: currentItems.filter(i => !i.productFamilyId).length },
                { id: "assigned", label: t('product_families.filter_assigned') || "Con familia", count: currentItems.filter(i => !!i.productFamilyId).length }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterAssignment(f.id)}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '1rem',
                    border: '1px solid',
                    borderColor: filterAssignment === f.id ? 'var(--corp-green)' : '#e2e8f0',
                    background: filterAssignment === f.id ? 'rgba(66, 98, 22, 0.08)' : 'white',
                    color: filterAssignment === f.id ? 'var(--corp-green)' : '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: filterAssignment === f.id ? '800' : '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>{f.label}</span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>({f.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hint */}
          <div style={{
            padding: '0.5rem 1rem',
            background: '#f8fafc',
            borderBottom: '1px solid #f1f5f9',
            fontSize: '0.72rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <GripVertical size={13} color="var(--corp-green)" />
            <span>{t('product_families.drag_hint') || "Arrastra cualquier receta o mercancía sobre una familia para asignarla."}</span>
          </div>

          {/* Draggable Items List */}
          <div style={{
            padding: '0.75rem',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {loading ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
                <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem', color: 'var(--corp-green)' }} />
                <span style={{ fontSize: '0.85rem' }}>Cargando productos...</span>
              </div>
            ) : filteredPoolItems.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  {t('product_families.no_items_found') || "No se encontraron productos con estos filtros"}
                </p>
              </div>
            ) : (
              filteredPoolItems.map(item => {
                const isItemDragging = draggedItem && draggedItem.id === item.id && draggedItem.type === (sourceTab === "recipes" ? "recipe" : "goods");
                const assignedFamily = item.productFamily;

                return (
                  <div
                    key={`${sourceTab}-${item.id}`}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, item, sourceTab === "recipes" ? "recipe" : "goods")}
                    onDragEnd={handleDragEnd}
                    style={{
                      background: isItemDragging ? '#f0fdf4' : 'white',
                      border: isItemDragging ? '2px dashed var(--corp-green)' : '1px solid #e2e8f0',
                      borderRadius: '0.65rem',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      cursor: 'grab',
                      transition: 'all 0.15s ease',
                      boxShadow: isItemDragging ? '0 4px 12px rgba(66, 98, 22, 0.15)' : 'none',
                      opacity: isItemDragging ? 0.6 : 1,
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isItemDragging) {
                        e.currentTarget.style.borderColor = 'var(--corp-green)';
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isItemDragging) {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                      <GripVertical size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontWeight: '800',
                          fontSize: '0.86rem',
                          color: '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.name}
                        </div>
                        {sourceTab === "goods" && (
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Unidad: {item.unit} • Stock: {item.stock}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ flexShrink: 0 }}>
                      {assignedFamily ? (
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '0.4rem',
                          background: '#ecfdf5',
                          color: '#065f46',
                          border: '1px solid #a7f3d0',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          maxWidth: '130px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={`Familia: ${assignedFamily.name}`}
                        >
                          <Tag size={11} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{assignedFamily.name}</span>
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '0.4rem',
                          background: '#f1f5f9',
                          color: '#94a3b8'
                        }}>
                          {t('product_families.unassigned_badge') || "Sin familia"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: FAMILIES DROP TARGETS GRID                  */}
        {/* ========================================================= */}
        <div>
          {/* Families Controls Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>
                {t('product_families.title') || "Familias"}
              </h2>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: '800',
                padding: '0.15rem 0.55rem',
                borderRadius: '0.75rem',
                background: 'rgba(66, 98, 22, 0.1)',
                color: 'var(--corp-green)'
              }}>
                {families.length}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder={t('product_families.search_families') || "Buscar familias..."}
                  value={searchFamily}
                  onChange={(e) => setSearchFamily(e.target.value)}
                  style={{
                    paddingLeft: '2.1rem',
                    fontSize: '0.82rem',
                    paddingTop: '0.4rem',
                    paddingBottom: '0.4rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Unassign Drop Target Zone (Only visible when dragging an item that has a family) */}
          {draggedItem && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOverUnassign(true);
              }}
              onDragLeave={() => setIsDragOverUnassign(false)}
              onDrop={handleDropOnUnassign}
              style={{
                marginBottom: '1.25rem',
                padding: '1rem',
                borderRadius: '0.85rem',
                border: isDragOverUnassign ? '2px dashed #ef4444' : '2px dashed #cbd5e1',
                background: isDragOverUnassign ? '#fef2f2' : '#f8fafc',
                color: isDragOverUnassign ? '#b91c1c' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                fontWeight: '800',
                fontSize: '0.88rem',
                transition: 'all 0.15s ease',
                cursor: 'pointer'
              }}
            >
              <XCircle size={18} />
              <span>{t('product_families.unassign_drop_zone') || "Arrastra aquí para quitar de cualquier familia"}</span>
            </div>
          )}

          {/* Empty Families state */}
          {!loading && families.length === 0 ? (
            <div style={{
              background: 'white',
              border: '2px dashed #cbd5e1',
              borderRadius: '1rem',
              padding: '3.5rem 2rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(66, 98, 22, 0.1)',
                color: 'var(--corp-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <Boxes size={28} />
              </div>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.2rem', fontWeight: '900', color: '#0f172a' }}>
                {t('product_families.empty_families_title') || "No tienes familias creadas"}
              </h3>
              <p style={{ margin: '0 0 1.25rem', color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
                {t('product_families.empty_families_desc') || "Crea tu primera familia de productos para organizar el catálogo de tu TPV."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setNewFamilyName("");
                  setIsNewModalOpen(true);
                }}
                className="btn-primary"
                style={{
                  padding: '0.75rem 1.5rem',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '0.75rem'
                }}
              >
                <Plus size={18} />
                <span>{t('product_families.btn_new') || "Nueva familia"}</span>
              </button>
            </div>
          ) : (
            /* Families Grid */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              {filteredFamilies.map(family => {
                const isDragOver = dragOverFamilyId === family.id;
                const recipeCount = family.recipes?.length || 0;
                const goodsCount = family.goodsForSale?.length || 0;
                const totalCount = recipeCount + goodsCount;

                return (
                  <div
                    key={family.id}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverFamilyId(family.id);
                    }}
                    onDragLeave={() => {
                      if (dragOverFamilyId === family.id) {
                        setDragOverFamilyId(null);
                      }
                    }}
                    onDrop={(e) => handleDropOnFamily(e, family.id)}
                    style={{
                      background: isDragOver ? '#f0fdf4' : 'white',
                      border: isDragOver ? '2px dashed var(--corp-green)' : '1px solid #e2e8f0',
                      borderRadius: '0.85rem',
                      padding: '1.15rem',
                      boxShadow: isDragOver ? '0 10px 25px -5px rgba(66, 98, 22, 0.25)' : '0 1px 3px rgba(0,0,0,0.04)',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transform: isDragOver ? 'scale(1.02)' : 'none'
                    }}
                    onClick={() => setSelectedFamilyForDetails(family)}
                  >
                    {/* Top Row: Name and Actions */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.65rem',
                      gap: '0.5rem'
                    }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h3 style={{
                          margin: 0,
                          fontSize: '1.1rem',
                          fontWeight: '900',
                          color: '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {family.name}
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {(t('product_families.total_items') || "{count} productos en total").replace('{count}', totalCount.toString())}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFamily(family);
                            setEditFamilyName(family.name);
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            padding: '0.35rem',
                            borderRadius: '0.35rem'
                          }}
                          title={t('product_families.modal_edit_title') || "Editar nombre"}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFamily(family)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '0.35rem',
                            borderRadius: '0.35rem'
                          }}
                          title="Eliminar familia"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Stats pills */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: 'auto',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #f1f5f9'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: recipeCount > 0 ? 'var(--corp-green)' : '#94a3b8',
                        background: recipeCount > 0 ? 'rgba(66, 98, 22, 0.08)' : '#f8fafc',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.4rem'
                      }}>
                        <ChefHat size={13} />
                        <span>{(t('product_families.recipes_count') || "{count} recetas").replace('{count}', recipeCount.toString())}</span>
                      </span>

                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: goodsCount > 0 ? '#0284c7' : '#94a3b8',
                        background: goodsCount > 0 ? '#e0f2fe' : '#f8fafc',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.4rem'
                      }}>
                        <Package size={13} />
                        <span>{(t('product_families.goods_count') || "{count} mercancías").replace('{count}', goodsCount.toString())}</span>
                      </span>
                    </div>

                    {/* Bottom Drop Zone Indicator when Dragging */}
                    {draggedItem && (
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '0.45rem',
                        borderRadius: '0.45rem',
                        background: isDragOver ? 'var(--corp-green)' : 'rgba(66, 98, 22, 0.08)',
                        color: isDragOver ? 'white' : 'var(--corp-green)',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        transition: 'all 0.15s ease'
                      }}>
                        {isDragOver ? "¡Suelta aquí para asignar!" : "Soltar aquí"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: FAMILY CONTENT DETAILS POPUP                     */}
      {/* ========================================================= */}
      {selectedFamilyForDetails && (
        <div
          className="modal-overlay"
          style={{ zIndex: 12000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setSelectedFamilyForDetails(null)}
        >
          <div
            className="modal-content"
            style={{
              maxWidth: '680px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.75rem',
              borderRadius: '1rem',
              background: 'white',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1.25rem',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '0.65rem',
                  background: 'rgba(66, 98, 22, 0.1)',
                  color: 'var(--corp-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Boxes size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '900', color: '#0f172a' }}>
                    {(t('product_families.modal_details_title') || "Familia: {name}").replace('{name}', selectedFamilyForDetails.name)}
                  </h3>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                    {t('product_families.modal_details_subtitle') || "Productos y elaboraciones asignados a esta familia"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFamilyForDetails(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.35rem' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Section 1: Recipes */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  marginBottom: '0.75rem',
                  color: 'var(--corp-green)',
                  fontWeight: '800',
                  fontSize: '0.95rem'
                }}>
                  <ChefHat size={18} />
                  <span>
                    {(t('product_families.section_recipes') || "Recetas / Elaboraciones ({count})").replace('{count}', (selectedFamilyForDetails.recipes?.length || 0).toString())}
                  </span>
                </div>

                {(selectedFamilyForDetails.recipes || []).length === 0 ? (
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.65rem', color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center' }}>
                    No hay recetas asignadas a esta familia.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {selectedFamilyForDetails.recipes.map(r => (
                      <div
                        key={`modal-recipe-${r.id}`}
                        style={{
                          background: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.55rem',
                          padding: '0.65rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#0f172a' }}>
                          {r.name}
                        </div>
                        <button
                          type="button"
                          disabled={assigning}
                          onClick={() => handleAssignItem("recipe", r.id, null)}
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fee2e2',
                            color: '#ef4444',
                            borderRadius: '0.4rem',
                            padding: '0.3rem 0.6rem',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                          title={t('product_families.btn_unassign') || "Quitar de la familia"}
                        >
                          <X size={13} />
                          <span>{t('product_families.btn_unassign') || "Quitar"}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Goods for sale */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  marginBottom: '0.75rem',
                  color: '#0284c7',
                  fontWeight: '800',
                  fontSize: '0.95rem'
                }}>
                  <Package size={18} />
                  <span>
                    {(t('product_families.section_goods') || "Mercancías en venta ({count})").replace('{count}', (selectedFamilyForDetails.goodsForSale?.length || 0).toString())}
                  </span>
                </div>

                {(selectedFamilyForDetails.goodsForSale || []).length === 0 ? (
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.65rem', color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center' }}>
                    No hay mercancías asignadas a esta familia.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {selectedFamilyForDetails.goodsForSale.map(g => (
                      <div
                        key={`modal-goods-${g.id}`}
                        style={{
                          background: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.55rem',
                          padding: '0.65rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#0f172a' }}>
                            {g.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Unidad: {g.unit} • Stock: {g.stock}
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={assigning}
                          onClick={() => handleAssignItem("goods", g.id, null)}
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fee2e2',
                            color: '#ef4444',
                            borderRadius: '0.4rem',
                            padding: '0.3rem 0.6rem',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                          title={t('product_families.btn_unassign') || "Quitar de la familia"}
                        >
                          <X size={13} />
                          <span>{t('product_families.btn_unassign') || "Quitar"}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={() => setSelectedFamilyForDetails(null)}
                className="btn-secondary"
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.88rem' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CREATE NEW FAMILY                                */}
      {/* ========================================================= */}
      {isNewModalOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 12000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => !creatingFamily && setIsNewModalOpen(false)}
        >
          <div
            className="modal-content"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '1.75rem',
              borderRadius: '1rem',
              background: 'white'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', color: '#0f172a' }}>
                  {t('product_families.modal_new_title') || "Crear nueva familia"}
                </h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  {t('product_families.modal_new_desc') || "Introduce el nombre de la nueva familia para agrupar productos."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                disabled={creatingFamily}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateFamily}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="label" style={{ fontSize: '0.78rem', fontWeight: '800' }}>
                  {t('product_families.family_name_label') || "Nombre de la familia"} *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder={t('product_families.family_name_placeholder') || "Ej: Carnes, Bebidas, Postres..."}
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  disabled={creatingFamily}
                  className="btn-secondary"
                  style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingFamily || !newFamilyName.trim()}
                  className="btn-primary"
                  style={{
                    padding: '0.6rem 1.4rem',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  {creatingFamily ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  <span>{creatingFamily ? (t('product_families.creating') || "Creando...") : (t('product_families.btn_create') || "Crear familia")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: EDIT FAMILY NAME                                 */}
      {/* ========================================================= */}
      {editingFamily && (
        <div
          className="modal-overlay"
          style={{ zIndex: 12000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => !updatingFamily && setEditingFamily(null)}
        >
          <div
            className="modal-content"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '1.75rem',
              borderRadius: '1rem',
              background: 'white'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', color: '#0f172a' }}>
                  {t('product_families.modal_edit_title') || "Editar familia"}
                </h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  {t('product_families.modal_edit_desc') || "Modifica el nombre de la familia de productos."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingFamily(null)}
                disabled={updatingFamily}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateFamilyName}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="label" style={{ fontSize: '0.78rem', fontWeight: '800' }}>
                  {t('product_families.family_name_label') || "Nombre de la familia"} *
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={editFamilyName}
                  onChange={(e) => setEditFamilyName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingFamily(null)}
                  disabled={updatingFamily}
                  className="btn-secondary"
                  style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updatingFamily || !editFamilyName.trim()}
                  className="btn-primary"
                  style={{
                    padding: '0.6rem 1.4rem',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  {updatingFamily ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  <span>{updatingFamily ? (t('product_families.saving') || "Guardando...") : (t('product_families.btn_save') || "Guardar cambios")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
