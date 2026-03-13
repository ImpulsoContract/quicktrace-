"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  ChefHat, History, LogOut, 
  Search, ClipboardList, Clock,
  ArrowLeft, Save, Beaker,
  ChevronRight, Loader2, AlertCircle, Trash2,
  Plus, Brush, User, Calendar, Edit, Thermometer,
  Package, Truck, FileCheck, Camera, X, Crown, Zap, Settings,
  CreditCard, ArrowUpCircle, PlayCircle, Printer
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { signOut } from "next-auth/react";
import Link from "next/link";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const DEFAULT_LABEL_CONFIG = {
  showFields: {
    lote: true,
    person: false,
    date: true,
    expiration: true
  },
  ingredientOptions: {
    showLote: false,
    showAmount: false
  },
  layout: 'vertical',
  fontSize: 14
};

const mergeLabelConfig = (config) => {
  if (!config || Object.keys(config).length === 0) return DEFAULT_LABEL_CONFIG;
  return {
    ...DEFAULT_LABEL_CONFIG,
    ...config,
    showFields: { ...DEFAULT_LABEL_CONFIG.showFields, ...(config.showFields || {}) },
    ingredientOptions: { ...DEFAULT_LABEL_CONFIG.ingredientOptions, ...(config.ingredientOptions || {}) }
  };
};

export default function ClientDashboard() {
  const { t } = useI18n();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("trazabilidad");
  const [recipes, setRecipes] = useState([]);
  const [elaborations, setElaborations] = useState([]);
  const [cleaningLogs, setCleaningLogs] = useState([]);
  const [cleaningZones, setCleaningZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingElaboration, setEditingElaboration] = useState(null);
  const [proportionMasterId, setProportionMasterId] = useState(null);
  const [isCleaningModalOpen, setIsCleaningModalOpen] = useState(false);
  const [editingCleaningLog, setEditingCleaningLog] = useState(null);
  const [tempRecords, setTempRecords] = useState([]);
  const [chambers, setChambers] = useState([]);
  const [isTempModalOpen, setIsTempModalOpen] = useState(false);
  const [editingTempRecord, setEditingTempRecord] = useState(null);
  const [goodsReceipts, setGoodsReceipts] = useState([]);
  const [isGoodsModalOpen, setIsGoodsModalOpen] = useState(false);
  const [editingGoodsReceipt, setEditingGoodsReceipt] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [profile, setProfile] = useState(null);
  const [videoModal, setVideoModal] = useState({ isOpen: false, videoId: "" });
  const [elabFilters, setElabFilters] = useState({
    lote: "",
    startDate: "",
    endDate: "",
    recipeId: "all"
  });
  const [cleaningFilters, setCleaningFilters] = useState({ startDate: "", endDate: "" });
  const [tempFilters, setTempFilters] = useState({ startDate: "", endDate: "" });
  const [goodsFilters, setGoodsFilters] = useState({ startDate: "", endDate: "" });
  const [totalElabs, setTotalElabs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);


  // Management State
  const [isRecipeManageModalOpen, setIsRecipeManageModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipeForm, setRecipeForm] = useState({ name: "", ingredients: [], expiryDays: 0 });
  
  const [isManageChambersModalOpen, setIsManageChambersModalOpen] = useState(false);
  const [isManageZonesModalOpen, setIsManageZonesModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  
  // Trazabilidad Form State
  const [elaboracionForm, setElaboracionForm] = useState({
    titulo: "",
    personName: "",
    date: "",
    expirationDate: "",
    ingredientes: {} // { ingredientId: { lote: "", cantidad: "" } }
  });

  // Cleaning Form State
  const [cleaningForm, setCleaningForm] = useState({
    personName: "",
    date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
    selectedZones: [] // Array of cleaningZoneId
  });

  // Temperature Form State
  const [tempForm, setTempForm] = useState({
    date: new Date().toISOString().slice(0, 16),
    values: {} // { chamberId: value }
  });

  // Goods Receipt Form State
  const [goodsForm, setGoodsForm] = useState({
    providerName: "",
    productName: "",
    lote: "",
    invoiceNumber: "",
    quantity: "",
    date: new Date().toISOString().slice(0, 16),
    deliveryNoteImage: ""
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetchRecipes();
      fetchCleaningZones();
      fetchCleaningLogs();
      fetchChambers();
      fetchTempRecords();
      fetchGoodsReceipts();
      fetchProfile();
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchElaborations();
    }
  }, [status, currentPage, itemsPerPage, elabFilters]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/client/profile");
      const data = await res.json();
      if (!data.error) setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const res = await fetch("/api/client/recipes");
      const data = await res.json();
      if (!data.error) setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("¿Seguro que quieres cancelar la renovación automática? Mantendrás el plan hasta el final del periodo.")) return;
    
    try {
      const res = await fetch("/api/stripe/cancel", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert("Suscripción cancelada correctamente.");
        fetchProfile();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert("Error al procesar la cancelación.");
    }
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setRecipeForm({
      name: recipe.name,
      ingredients: recipe.ingredients.map(ing => ({
        id: ing.id,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        loteMandatory: !!ing.loteMandatory,
        quantityMandatory: !!ing.quantityMandatory
      })),
      expiryDays: recipe.expiryDays || 0,
      expiryType: recipe.expiryType || "EXPIRATION"
    });
    setIsRecipeManageModalOpen(true);
  };

  const handleDeleteRecipe = async (id) => {
    if (!confirm(t('alerts.delete_confirm_recipe'))) return;
    
    try {
      const res = await fetch(`/api/client/recipes/manage/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchRecipes();
      } else {
        alert(data.error || t('alerts.delete_error'));
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert(t('alerts.connection_error'));
    }
  };

  const handleSubmitRecipe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingRecipe 
        ? `/api/client/recipes/manage/${editingRecipe.id}` 
        : `/api/client/recipes/manage`;
      
      const res = await fetch(url, {
        method: editingRecipe ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeForm)
      });
      
      const data = await res.json();
      if (data.success) {
        alert(editingRecipe ? t('alerts.recipe_updated') : t('alerts.recipe_saved'));
        setIsRecipeManageModalOpen(false);
        fetchRecipes();
      } else {
        alert(data.error || t('alerts.request_error'));
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = () => {
    setRecipeForm({
      ...recipeForm,
      ingredients: [...recipeForm.ingredients, { name: "", amount: "", unit: "", loteMandatory: false, quantityMandatory: false }]
    });
  };

  const removeIngredient = (index) => {
    const newIngs = [...recipeForm.ingredients];
    newIngs.splice(index, 1);
    setRecipeForm({ ...recipeForm, ingredients: newIngs });
  };

  const handleRecipeIngredientChange = (index, field, value) => {
    const newIngs = [...recipeForm.ingredients];
    newIngs[index][field] = value;
    setRecipeForm({ ...recipeForm, ingredients: newIngs });
  };

  const fetchElaborations = async () => {
    try {
      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        lote: elabFilters.lote,
        recipeId: elabFilters.recipeId,
        startDate: elabFilters.startDate,
        endDate: elabFilters.endDate
      });
      const res = await fetch(`/api/elaborations?${query}`);
      const data = await res.json();
      if (!data.error) {
        setElaborations(data.data);
        setTotalElabs(data.total);
      } else {
        console.error("Error fetching elaborations:", data.error);
      }
    } catch (error) {
      console.error("Error fetching elaborations:", error);
    }
  };

  const fetchCleaningZones = async () => {
    try {
      const res = await fetch("/api/client/cleaning-zones");
      const data = await res.json();
      if (!data.error) setCleaningZones(data);
    } catch (error) {
      console.error("Error fetching cleaning zones:", error);
    }
  };

  const fetchCleaningLogs = async () => {
    try {
      const res = await fetch("/api/cleaning-logs");
      const data = await res.json();
      if (!data.error) setCleaningLogs(data);
    } catch (error) {
      console.error("Error fetching cleaning logs:", error);
    }
  };

  const fetchChambers = async () => {
    try {
      const res = await fetch("/api/client/chambers");
      const data = await res.json();
      if (!data.error) setChambers(data);
    } catch (error) {
      console.error("Error fetching chambers:", error);
    }
  };

  const fetchTempRecords = async () => {
    try {
      const res = await fetch("/api/temperature-records");
      const data = await res.json();
      if (!data.error) setTempRecords(data);
    } catch (error) {
      console.error("Error fetching temperature records:", error);
    }
  };

  const fetchGoodsReceipts = async () => {
    try {
      const res = await fetch("/api/goods-receipts");
      const data = await res.json();
      if (!data.error) setGoodsReceipts(data);
    } catch (error) {
      console.error("Error fetching goods receipts:", error);
    }
  };

  const handleCreateChamber = async (name) => {
    try {
      const res = await fetch("/api/client/chambers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (data.success) {
        alert(t('alerts.chamber_created'));
        fetchChambers();
        return true;
      } else {
        alert(data.error || t('alerts.request_error'));
        return false;
      }
    } catch (error) {
      console.error("Error creating chamber:", error);
      alert(t('alerts.connection_error'));
      return false;
    }
  };

  const handleEditChamber = async (id, name) => {
    try {
      const res = await fetch("/api/client/chambers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name })
      });
      const data = await res.json();
      if (data.success) {
        alert(t('alerts.chamber_updated'));
        fetchChambers();
        fetchTempRecords(); // Refresh to show new name in records if needed
        return true;
      } else {
        alert(data.error || t('alerts.request_error'));
        return false;
      }
    } catch (error) {
      console.error("Error editing chamber:", error);
      alert(t('alerts.connection_error'));
      return false;
    }
  };

  const handleDeleteChamber = async (id) => {
    if (!confirm(t('alerts.delete_confirm_chamber'))) return;
    try {
      const res = await fetch(`/api/client/chambers?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchChambers();
      } else {
        alert(data.error || t('alerts.delete_error'));
      }
    } catch (error) {
      console.error("Error deleting chamber:", error);
      alert(t('alerts.connection_error'));
    }
  };

  const handleCreateZone = async (name) => {
    try {
      const res = await fetch("/api/client/cleaning-zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (data.success) {
        alert(t('alerts.zone_created'));
        fetchCleaningZones();
        return true;
      } else {
        alert(data.error || t('alerts.request_error'));
        return false;
      }
    } catch (error) {
      console.error("Error creating zone:", error);
      alert(t('alerts.connection_error'));
      return false;
    }
  };

  const handleEditZone = async (id, name) => {
    try {
      const res = await fetch("/api/client/cleaning-zones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name })
      });
      const data = await res.json();
      if (data.success) {
        alert(t('alerts.zone_updated'));
        fetchCleaningZones();
        fetchCleaningLogs(); // Refresh to show new name in logs if needed
        return true;
      } else {
        alert(data.error || t('alerts.request_error'));
        return false;
      }
    } catch (error) {
      console.error("Error editing zone:", error);
      alert(t('alerts.connection_error'));
      return false;
    }
  };

  const handleDeleteZone = async (id) => {
    if (!confirm(t('alerts.delete_confirm_zone'))) return;
    try {
      const res = await fetch(`/api/client/cleaning-zones?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchCleaningZones();
      } else {
        alert(data.error || t('alerts.delete_error'));
      }
    } catch (error) {
      console.error("Error deleting zone:", error);
      alert(t('alerts.connection_error'));
    }
  };

  const handleSubmitGoods = async (e) => {
    e.preventDefault();
    if (!goodsForm.productName || !goodsForm.date) {
      alert("Producto y fecha son obligatorios");
      return;
    }

    setLoading(true);
    try {
      const url = "/api/goods-receipts";
      const method = editingGoodsReceipt ? "PATCH" : "POST";
      const body = editingGoodsReceipt ? { ...goodsForm, id: editingGoodsReceipt.id } : goodsForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        alert(editingGoodsReceipt ? t('alerts.goods_updated') : t('alerts.goods_saved'));
        setIsGoodsModalOpen(false);
        setEditingGoodsReceipt(null);
        setGoodsForm({
          providerName: "",
          productName: "",
          lote: "",
          invoiceNumber: "",
          quantity: "",
          date: new Date().toISOString().slice(0, 16),
          deliveryNoteImage: ""
        });
        fetchGoodsReceipts();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || t('alerts.request_error'));
      }
    } catch (error) {
      console.error("Error saving goods receipt:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEditGoods = (receipt) => {
    setEditingGoodsReceipt(receipt);
    setGoodsForm({
      providerName: receipt.providerName || "",
      productName: receipt.productName,
      lote: receipt.lote || "",
      invoiceNumber: receipt.invoiceNumber || "",
      quantity: receipt.quantity || "",
      date: new Date(receipt.date).toISOString().slice(0, 16),
      deliveryNoteImage: receipt.deliveryNoteImage || ""
    });
    setIsGoodsModalOpen(true);
  };

  const handleDeleteGoods = async (id) => {
    if (!confirm(t('alerts.delete_confirm_goods'))) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/goods-receipts?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchGoodsReceipts();
      } else {
        alert(data.error || t('alerts.delete_error'));
      }
    } catch (error) {
      console.error("Error deleting goods receipt:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGoodsForm({ ...goodsForm, deliveryNoteImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenRecipe = (recipe) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateStr = `${year}${month}${day}${hours}${minutes}`;
    
    // YYYY-MM-DDTHH:mm for datetime-local input
    const currentDateTime = now.toISOString().slice(0, 16);
    
    // Calculate expiration date
    let expirationDate = "";
    if (recipe.expiryDays && recipe.expiryDays > 0) {
      const expDate = new Date(now);
      expDate.setDate(expDate.getDate() + recipe.expiryDays);
      expirationDate = expDate.toISOString().slice(0, 10); // YYYY-MM-DD
    }
    
    // Get last person name from history
    const lastPerson = elaborations.length > 0 ? (elaborations[0].personName || "") : "";
    
    const initials = recipe.name
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => word[0].toUpperCase())
      .join('');
    
    setSelectedRecipe(recipe);
    setEditingElaboration(null);
    setProportionMasterId(null);
    
    // Inicializar formulario con valores por defecto
    const initialIngredientes = {};
    recipe.ingredients.forEach(ing => {
      initialIngredientes[ing.id] = { lote: "", cantidad: ing.amount };
    });

    setElaboracionForm({
      titulo: `${dateStr}${initials}`,
      personName: lastPerson,
      date: currentDateTime,
      expirationDate: expirationDate,
      ingredientes: initialIngredientes
    });
  };

  const handleEditElaboration = (elab) => {
    setEditingElaboration(elab);
    setSelectedRecipe(elab.recipe);
    setProportionMasterId(null);
    
    const initialIngredientes = {};
    // Map existing ingredients by name to match recipe ingredients
    elab.recipe.ingredients.forEach(recipeIng => {
      const matchingElabIng = elab.ingredients.find(ei => ei.name === recipeIng.name);
      initialIngredientes[recipeIng.id] = { 
        lote: matchingElabIng?.lote || "", 
        cantidad: matchingElabIng?.realAmount || "" 
      };
    });

    setElaboracionForm({
      titulo: elab.name,
      personName: elab.personName || "",
      date: elab.date ? new Date(elab.date).toISOString().slice(0, 16) : "",
      expirationDate: elab.expirationDate ? new Date(elab.expirationDate).toISOString().slice(0, 10) : "",
      ingredientes: initialIngredientes
    });
  };

  const handleDeleteElaboration = async (id) => {
    if (!confirm(t('alerts.delete_confirm_elaboration') || '¿Seguro que quieres eliminar esta elaboración?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/elaborations/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchElaborations();
      } else {
        alert(data.error || t('alerts.delete_error'));
      }
    } catch (error) {
      console.error("Error deleting elaboration:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLabelConfig = async (newConfig) => {
    try {
      const res = await fetch("/api/client/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labelConfig: newConfig })
      });
      const data = await res.json();
      if (!data.error) {
        setProfile(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating label config:", error);
      return false;
    }
  };

  const generateLabelPDF = (elaboration) => {
    const config = mergeLabelConfig(profile?.labelConfig);
    const doc = new jsPDF({
      orientation: config.layout === 'vertical' ? 'p' : 'l',
      unit: 'mm',
      format: [80, 60]
    });

    const fontSize = config.fontSize || 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(0, 0, 0);

    let y = 10;
    const x = 5;
    const columnWidth = config.layout === 'vertical' ? 70 : 35;

    const drawElabData = (startX, startY) => {
      let currentY = startY;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20); // Fixed larger size for recipe name
      doc.text(elaboration.recipe.name, startX, currentY);
      currentY += 10;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize); // Configurable font size for metadata

      if (config.showFields?.lote) {
        doc.text(`${t('dashboard.lote')}: ${elaboration.name}`, startX, currentY);
        currentY += fontSize * 0.6;
      }
      if (config.showFields?.person && elaboration.personName) {
        doc.text(`${t('traceability_form.label_made_by')} ${elaboration.personName}`, startX, currentY);
        currentY += fontSize * 0.6;
      }
      if (config.showFields?.date) {
        const dateStr = new Date(elaboration.date).toLocaleString(t('common.locale_code'));
        doc.text(`${t('traceability_form.label_date')}: ${dateStr}`, startX, currentY);
        currentY += fontSize * 0.6;
      }
      if (config.showFields?.expiration && elaboration.expirationDate) {
        const expStr = new Date(elaboration.expirationDate).toLocaleDateString(t('common.locale_code'));
        const expLabel = elaboration.recipe.expiryType === "BEST_BEFORE" 
          ? t('traceability_form.label_best_before') 
          : t('traceability_form.label_expiration');
        doc.text(`${expLabel}: ${expStr}`, startX, currentY);
        currentY += fontSize * 0.6;
      }
      return currentY;
    };

    const drawIngredients = (startX, startY) => {
      let currentY = startY;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(fontSize * 0.7);
      doc.text(t('modals.ingredients'), startX, currentY);
      currentY += fontSize * 0.3;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize * 0.6);
      
      elaboration.ingredients.forEach(ing => {
        let ingText = `- ${ing.name}`;
        if (config.ingredientOptions?.showLote && ing.lote) ingText += ` (${ing.lote})`;
        if (config.ingredientOptions?.showAmount) ingText += `: ${ing.realAmount} ${ing.unit}`;
        
        const splitText = doc.splitTextToSize(ingText, columnWidth);
        doc.text(splitText, startX, currentY);
        currentY += (splitText.length * fontSize * 0.3);
      });
    };

    if (config.layout === 'vertical') {
      y = drawElabData(x, y);
      y += 5;
      drawIngredients(x, y);
    } else if (config.layout === 'horizontal_left') {
      drawElabData(x, y);
      drawIngredients(x + 40, y);
    } else {
      drawIngredients(x, y);
      drawElabData(x + 40, y);
    }

    doc.save(`Etiqueta_${elaboration.name}.pdf`);
  };

  const handleIngredientChange = (ingId, field, value) => {
    if (field === 'cantidad' && ingId === proportionMasterId) {
      const oldValue = parseFloat(elaboracionForm.ingredientes[ingId].cantidad);
      const newValue = parseFloat(value);
      
      if (!isNaN(oldValue) && !isNaN(newValue) && oldValue !== 0) {
        const ratio = newValue / oldValue;
        
        setElaboracionForm(prev => {
          const newIngredientes = { ...prev.ingredientes };
          Object.keys(newIngredientes).forEach(id => {
            if (id === ingId) {
              newIngredientes[id] = { ...newIngredientes[id], cantidad: value };
            } else {
              const currentQty = parseFloat(newIngredientes[id].cantidad);
              if (!isNaN(currentQty)) {
                // Round to 2 decimal places to avoid float issues
                newIngredientes[id] = { 
                  ...newIngredientes[id], 
                  cantidad: (currentQty * ratio).toFixed(2) 
                };
              }
            }
          });
          return { ...prev, ingredientes: newIngredientes };
        });
        return;
      }
    }

    setElaboracionForm(prev => ({
      ...prev,
      ingredientes: {
        ...prev.ingredientes,
        [ingId]: {
          ...prev.ingredientes[ingId],
          [field]: value
        }
      }
    }));
  };

  const handleSubmitElaboracion = async (e) => {
    e.preventDefault();
    
    // Validación de campos obligatorios
    const missingLotes = [];
    const missingCantidades = [];

    selectedRecipe.ingredients.forEach(ing => {
      const isAgua = ing.name.toLowerCase().trim() === 'agua';
      if (isAgua) return;

      const currentData = elaboracionForm.ingredientes[ing.id];
      
      // Las validaciones ahora se rigen estrictamente por lo configurado en cada ingrediente
      const isLoteRequired = !!ing.loteMandatory;
      const isQtyRequired = !!ing.quantityMandatory;

      if (isLoteRequired && (!currentData.lote || currentData.lote.trim() === '')) {
        missingLotes.push(ing.name);
      }
      
      if (isQtyRequired && (!currentData.cantidad || currentData.cantidad.trim() === '' || currentData.cantidad === '0')) {
        missingCantidades.push(ing.name);
      }
    });

    if (missingLotes.length > 0 || missingCantidades.length > 0) {
      let errorMsg = t('alerts.missing_data') + "\n";
      if (missingLotes.length > 0) errorMsg += t('alerts.missing_lotes') + missingLotes.join(', ') + "\n";
      if (missingCantidades.length > 0) errorMsg += t('alerts.missing_amounts') + missingCantidades.join(', ') + "\n";
      alert(errorMsg);
      return;
    }

    setLoading(true);
    try {
      const ingredientsData = selectedRecipe.ingredients.map(ing => ({
        name: ing.name,
        lote: elaboracionForm.ingredientes[ing.id].lote,
        realAmount: elaboracionForm.ingredientes[ing.id].cantidad,
        unit: ing.unit
      }));

      const url = editingElaboration 
        ? `/api/elaborations/${editingElaboration.id}`
        : "/api/elaborations";
      
      const method = editingElaboration ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: elaboracionForm.titulo,
          recipeId: selectedRecipe.id,
          personName: elaboracionForm.personName,
          date: elaboracionForm.date,
          expirationDate: elaboracionForm.expirationDate,
          ingredients: ingredientsData
        })
      });

      if (res.ok) {
        alert(editingElaboration ? t('alerts.elaboration_updated') : t('alerts.elaboration_saved'));
        fetchElaborations();
        setSelectedRecipe(null);
        setEditingElaboration(null);
        setActiveTab("historial");
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || t('alerts.request_error'));
      }
    } catch (error) {
      console.error("Error saving elaboration:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFillLotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/client/last-lotes");
      const lastLotesMap = await res.json();
      
      if (res.ok) {
        const updatedIngredientes = { ...elaboracionForm.ingredientes };
        let count = 0;
        
        selectedRecipe.ingredients.forEach(ing => {
          if (lastLotesMap[ing.name]) {
            updatedIngredientes[ing.id] = {
              ...updatedIngredientes[ing.id],
              lote: lastLotesMap[ing.name]
            };
            count++;
          }
        });
        
        setElaboracionForm(prev => ({
          ...prev,
          ingredientes: updatedIngredientes
        }));
        
        if (count === 0) {
          alert(t('alerts.no_last_lotes'));
        } else {
          alert(t('alerts.auto_filled_lotes').replace('{count}', count));
        }
      } else {
        alert(t('alerts.last_lotes_error'));
      }
    } catch (error) {
      console.error("Error auto-filling lotes:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleClearLotes = () => {
    const updatedIngredientes = { ...elaboracionForm.ingredientes };
    selectedRecipe.ingredients.forEach(ing => {
      updatedIngredientes[ing.id] = {
        ...updatedIngredientes[ing.id],
        lote: ""
      };
    });
    setElaboracionForm(prev => ({
      ...prev,
      ingredientes: updatedIngredientes
    }));
  };

  const handleSubmitCleaning = async (e) => {
    e.preventDefault();
    if (cleaningForm.selectedZones.length === 0) {
      alert(t('alerts.select_at_least_one_zone'));
      return;
    }

    setLoading(true);
    try {
      const url = editingCleaningLog ? "/api/cleaning-logs" : "/api/cleaning-logs";
      const method = editingCleaningLog ? "PATCH" : "POST";
      const body = editingCleaningLog ? { ...cleaningForm, id: editingCleaningLog.id } : cleaningForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        alert(editingCleaningLog ? t('alerts.cleaning_updated') : t('alerts.cleaning_saved'));
        setIsCleaningModalOpen(false);
        setEditingCleaningLog(null);
        setCleaningForm({
          personName: "",
          date: new Date().toISOString().slice(0, 16),
          selectedZones: []
        });
        fetchCleaningLogs();
      } else {
        alert(data.error || t('alerts.request_error'));
      }
    } catch (error) {
      console.error("Error saving cleaning log:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEditCleaning = (log) => {
    setEditingCleaningLog(log);
    setCleaningForm({
      personName: log.personName,
      date: new Date(log.date).toISOString().slice(0, 16),
      selectedZones: log.zones.map(z => z.cleaningZone.id)
    });
    setIsCleaningModalOpen(true);
  };

  const handleDeleteCleaning = async (id) => {
    if (!confirm(t('alerts.delete_confirm_cleaning'))) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cleaning-logs?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchCleaningLogs();
      } else {
        alert(data.error || t('alerts.delete_error'));
      }
    } catch (error) {
      console.error("Error deleting cleaning log:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTemperature = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = "/api/temperature-records";
      const method = editingTempRecord ? "PATCH" : "POST";
      const body = editingTempRecord ? { ...tempForm, id: editingTempRecord.id } : tempForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        alert(editingTempRecord ? t('alerts.temp_updated') : t('alerts.temp_saved'));
        setIsTempModalOpen(false);
        setEditingTempRecord(null);
        setTempForm({
          date: new Date().toISOString().slice(0, 16),
          values: {}
        });
        fetchTempRecords();
      } else {
        alert(data.error || t('alerts.request_error'));
      }
    } catch (error) {
      console.error("Error saving temperature record:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEditTemp = (record) => {
    setEditingTempRecord(record);
    const values = {};
    record.values.forEach(v => {
      values[v.chamberId] = v.value;
    });
    setTempForm({
      date: new Date(record.date).toISOString().slice(0, 16),
      values
    });
    setIsTempModalOpen(true);
  };

  const handleDeleteTemp = async (id) => {
    if (!confirm(t('alerts.delete_confirm_temp'))) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/temperature-records?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchTempRecords();
      } else {
        alert(data.error || t('alerts.delete_error'));
      }
    } catch (error) {
      console.error("Error deleting temperature record:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredElaborations = elaborations;
  const sortedElaborations = elaborations;

  if (loading && recipes.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="var(--corp-green)" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      {/* Sidebar / Topbar combined for responsive */}
      <div style={{ display: 'flex', minHeight: '100vh' }} className="flex-responsive">
        <aside style={{ 
          width: '280px', borderRight: '1px solid var(--border)', background: 'white', 
          display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh'
        }} className="sidebar-responsive">
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative', width: '32px', height: '32px' }}>
              <Image src="/images/logo.jpg"
 alt="Logo" fill style={{ objectFit: 'contain' }} />
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--corp-green)' }}>
              QuickTrace
            </h1>
          </div>

          <nav style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <SidebarBtn 
              icon={<ClipboardList size={20} />} 
              label={t('sidebar.traceability')} 
              active={activeTab === 'trazabilidad'} 
              onClick={() => { setActiveTab('trazabilidad'); setSelectedRecipe(null); }} 
            />
            <SidebarBtn 
              icon={<History size={20} />} 
              label={t('sidebar.history')} 
              active={activeTab === "historial"} 
              onClick={() => { setActiveTab("historial"); setSelectedRecipe(null); }} 
            />
            {profile?.plan?.hasCleaning && (
              <SidebarBtn 
                icon={<Brush size={20} />} 
                label={t('sidebar.cleaning')} 
                active={activeTab === "limpieza"} 
                onClick={() => { setActiveTab("limpieza"); setSelectedRecipe(null); }} 
              />
            )}
            {profile?.plan?.hasTemperatures && (
              <SidebarBtn 
                icon={<Thermometer size={20} />} 
                label={t('sidebar.temperatures')} 
                active={activeTab === "temperaturas"} 
                onClick={() => { setActiveTab("temperaturas"); setSelectedRecipe(null); }} 
              />
            )}
            {profile?.plan?.hasGoods && (
              <SidebarBtn 
                icon={<Truck size={20} />} 
                label={t('sidebar.goods')} 
                active={activeTab === "entradas"} 
                onClick={() => { setActiveTab("entradas"); setSelectedRecipe(null); }} 
              />
            )}
            {session?.user?.role === "CLIENT" && (
              <SidebarBtn 
                icon={<ChefHat size={20} />} 
                label={t('sidebar.manage_recipes')} 
                active={activeTab === "gestionar-recetas"} 
                onClick={() => { setActiveTab("gestionar-recetas"); setSelectedRecipe(null); }} 
              />
            )}
          </nav>

          <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
            <LanguageSwitcher />
          </div>

          <div 
            onClick={() => setIsProfileOpen(true)}
            style={{ 
              padding: '1.5rem', borderTop: '1px solid var(--border)', 
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(66, 98, 22, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--corp-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>
                {profile?.personName?.[0] || session?.user?.name?.[0] || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.personName || session?.user?.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--corp-green)', fontWeight: '800' }}>{t('sidebar.plan')} {profile?.plan?.name || '...'}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); signOut({ callbackUrl: '/login' }); }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', borderRadius: '0.5rem', background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
              >
                <LogOut size={14} /> {t('auth.logout')}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
          {selectedRecipe ? (
            <div style={{ maxWidth: '850px', margin: '0 auto' }}>
              {/* VISTA FORMULARIO */}
              <button 
                onClick={() => setSelectedRecipe(null)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500' }}
              >
                <ArrowLeft size={18} /> {t('traceability_form.back_to_list')}
              </button>

              <section className="glass-card" style={{ padding: '2.5rem', background: 'white' }}>
                <header style={{ marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--corp-green)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    {editingElaboration ? t('traceability_form.modify_record') : t('traceability_form.new_record')}
                  </div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{selectedRecipe.name}</h2>
                </header>

                <form onSubmit={handleSubmitElaboracion} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '700' }}>{t('traceability_form.elaboration_title')}</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={elaboracionForm.titulo} 
                      onChange={(e) => setElaboracionForm({...elaboracionForm, titulo: e.target.value})}
                      placeholder={t('traceability_form.elaboration_title_placeholder')}
                      required
                      style={{ fontSize: '1.1rem', fontWeight: '500', padding: '1rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '700' }}>{t('traceability_form.made_by')}</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={elaboracionForm.personName} 
                        onChange={(e) => setElaboracionForm({...elaboracionForm, personName: e.target.value})} 
                        placeholder={t('modals.person_name')}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '700' }}>{t('traceability_form.elaboration_date')}</label>
                      <input 
                        type="datetime-local" 
                        className="input-field" 
                        value={elaboracionForm.date} 
                        onChange={(e) => setElaboracionForm({...elaboracionForm, date: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '700' }}>{t('traceability_form.expiration_date')}</label>
                      <input 
                        type="date" 
                        className="input-field" 
                        value={elaboracionForm.expirationDate} 
                        onChange={(e) => setElaboracionForm({...elaboracionForm, expirationDate: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--corp-green)', margin: 0 }}>
                        <Beaker size={20} /> {t('traceability_form.ingredients_batches')}
                      </h3>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button 
                          type="button" 
                          onClick={handleAutoFillLotes}
                          style={{ 
                            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', 
                            borderRadius: '0.5rem', border: '1px solid var(--corp-green)', background: 'rgba(66, 98, 22, 0.05)', 
                            color: 'var(--corp-green)', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' 
                          }}
                        >
                          <History size={16} /> {t('traceability_form.autofill_lotes')}
                        </button>
                        <button 
                          type="button" 
                          onClick={handleClearLotes}
                          style={{ 
                            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', 
                            borderRadius: '0.5rem', border: '1px solid #dc2626', background: 'rgba(220, 38, 38, 0.05)', 
                            color: '#dc2626', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' 
                          }}
                        >
                          <Trash2 size={16} /> {t('traceability_form.clear_lotes')}
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {selectedRecipe.ingredients?.map(ing => (
                        <div key={ing.id} style={{ 
                          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'flex-end',
                          padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid var(--border)'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '1rem', fontWeight: '700' }}>{ing.name}</div>
                             <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('traceability_form.theoretical_amount')}: {ing.amount} {ing.unit}</div>
                          </div>
                          <div>
                            <label className="label" style={{ fontSize: '0.75rem' }}>
                              {t('traceability_form.lot')} {ing.loteMandatory && <span style={{ color: '#ef4444' }}>*</span>}
                            </label>
                            <input 
                              type="text" 
                              className="input-field" 
                              style={{ padding: '0.75rem' }}
                              placeholder={ing.loteMandatory ? t('traceability_form.lot_mandatory_placeholder') : t('traceability_form.lot_optional_placeholder')}
                              value={elaboracionForm.ingredientes[ing.id]?.lote}
                              onChange={(e) => handleIngredientChange(ing.id, 'lote', e.target.value)}
                              required={!!ing.loteMandatory} 
                            />
                          </div>
                          <div>
                            <label className="label" style={{ fontSize: '0.75rem' }}>
                              {t('traceability_form.real_amount')} ({ing.unit}) {ing.quantityMandatory && <span style={{ color: '#ef4444' }}>*</span>}
                            </label>
                            <input 
                              type="text" 
                              className="input-field" 
                              style={{ padding: '0.75rem' }}
                              placeholder={ing.quantityMandatory ? "0.00 *" : "0.00"}
                              value={elaboracionForm.ingredientes[ing.id]?.cantidad}
                              onChange={(e) => handleIngredientChange(ing.id, 'cantidad', e.target.value)}
                              required={!!ing.quantityMandatory} 
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <input 
                                type="checkbox" 
                                id={`prop-${ing.id}`}
                                checked={proportionMasterId === ing.id}
                                onChange={(e) => setProportionMasterId(e.target.checked ? ing.id : null)}
                                style={{ cursor: 'pointer' }}
                              />
                              <label htmlFor={`prop-${ing.id}`} style={{ fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                {t('dashboard.maintain_proportions')}
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn-primary" style={{ minWidth: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> {t('dashboard.save_record')}</>}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          ) : activeTab === 'trazabilidad' ? (
            <div>
              <header style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>{t('sidebar.traceability')}</h2>
                  <PlanUsageIndicator 
                    label={t('dashboard.elaborations')} 
                    current={totalElabs} 
                    limit={profile?.plan?.elaborationsLimit} 
                  />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.25rem' }}>{t('dashboard.traceability_desc')}</p>
              </header>

              {recipes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', border: '2px dashed var(--border)', borderRadius: '1.5rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <ChefHat size={40} color="var(--border)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>{t('dashboard.no_recipes')}</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    {t('dashboard.no_recipes_desc')}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button 
                      onClick={() => setVideoModal({ isOpen: true, videoId: "eHdC-SSK5dA" })}
                      className="btn-secondary" 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <PlayCircle size={18} /> {t('dashboard.video_tutorial')}
                    </button>
                    <button 
                      onClick={() => setActiveTab('gestionar-recetas')}
                      className="btn-primary"
                    >
                      {t('dashboard.go_to_recipes')}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                  {recipes.map(recipe => (
                    <div 
                      key={recipe.id} 
                      className="glass-card" 
                      onClick={() => handleOpenRecipe(recipe)}
                      style={{ 
                        padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                        background: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--corp-green)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>{recipe.name}</h3>
                      
                      <div 
                        className="btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', fontSize: '0.85rem', fontWeight: '800' }}
                      >
                        <Plus size={18} /> {t('dashboard.register_elaboration')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'historial' ? (
            <div>
              <header style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>{t('sidebar.history')}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('dashboard.history_info')}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      onClick={() => setIsLabelModalOpen(true)}
                      className="btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      <Settings size={18} /> {t('dashboard.configure_labels')}
                    </button>
                    <button 
                      onClick={() => setVideoModal({ isOpen: true, videoId: "eHdC-SSK5dA" })}
                      className="btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      <PlayCircle size={18} /> {t('dashboard.video_help')}
                    </button>
                  </div>
                </div>
              </header>

              <div 
                className="glass-card" 
                style={{ 
                  background: 'white', padding: '1.5rem', marginBottom: '3rem', 
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end'
                }}
              >
                <div>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('dashboard.batch_search')}</label>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder={t('dashboard.batch_placeholder')}
                      className="input-field"
                      style={{ paddingLeft: '2.5rem', margin: 0 }}
                      value={elabFilters.lote}
                      onChange={(e) => {
                        setElabFilters({...elabFilters, lote: e.target.value});
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('dashboard.recipe_filter')}</label>
                  <select 
                    className="input-field" 
                    value={elabFilters.recipeId}
                    onChange={(e) => {
                      setElabFilters({...elabFilters, recipeId: e.target.value});
                      setCurrentPage(1);
                    }}
                    style={{ margin: 0 }}
                  >
                    <option value="all">{t('dashboard.all_recipes')}</option>
                    {recipes.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('common.from')}</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={elabFilters.startDate}
                    onChange={(e) => {
                      setElabFilters({...elabFilters, startDate: e.target.value});
                      setCurrentPage(1);
                    }}
                    style={{ margin: 0 }}
                  />
                </div>

                <div>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('common.to')}</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={elabFilters.endDate}
                    onChange={(e) => {
                      setElabFilters({...elabFilters, endDate: e.target.value});
                      setCurrentPage(1);
                    }}
                    style={{ margin: 0 }}
                  />
                </div>

                <div>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('dashboard.show')}</label>
                  <select 
                    className="input-field" 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{ margin: 0 }}
                  >
                    <option value={20}>{t('dashboard.per_page').replace('{count}', '20')}</option>
                    <option value={50}>{t('dashboard.per_page').replace('{count}', '50')}</option>
                    <option value={100}>{t('dashboard.per_page').replace('{count}', '100')}</option>
                  </select>
                </div>

                <button 
                  onClick={() => {
                    setElabFilters({ lote: "", startDate: "", endDate: "", recipeId: "all" });
                    setCurrentPage(1);
                  }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: '0.5rem' }}
                >
                  {t('dashboard.clear_filters')}
                </button>
              </div>

              {elaborations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: '1.5rem', border: '1px solid var(--border)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>{t('dashboard.no_records')}</p>
                </div>
              ) : (
                <div className="glass-card" style={{ background: 'white', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                      <tr>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('dashboard.date')}</th>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('dashboard.recipe_name')}</th>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>{t('dashboard.actions')}</th>
                      </tr>
                    </thead>
                    <tbody style={{ divide: 'y', divideColor: 'var(--border)' }}>
                      {elaborations.map(el => (
                        <tr key={el.id} style={{ borderBottom: '1px solid var(--border)', background: 'white', transition: 'background 0.2s' }} className="hover-row">
                          <td style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)' }}>{new Date(el.createdAt).toLocaleDateString()}</td>
                          <td style={{ padding: '1.5rem 2rem', fontWeight: '700', color: 'var(--text-main)' }}>{el.recipe?.name}</td>
                          <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => generateLabelPDF(el)}
                                style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                              >
                                <Printer size={16} /> {t('traceability_form.label_btn')}
                              </button>
                              <button 
                                onClick={() => handleEditElaboration(el)}
                                style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--corp-green)', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteElaboration(el.id)}
                                style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {t('dashboard.showing_info')
                        .replace('{start}', ((currentPage - 1) * itemsPerPage + 1).toString())
                        .replace('{end}', Math.min(currentPage * itemsPerPage, totalElabs).toString())
                        .replace('{total}', totalElabs.toString())}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="btn-secondary"
                        style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: currentPage === 1 ? 0.5 : 1 }}
                      >
                        <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /> {t('common.previous')}
                      </button>
                      <button 
                        disabled={currentPage * itemsPerPage >= totalElabs}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="btn-secondary"
                        style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: currentPage * itemsPerPage >= totalElabs ? 0.5 : 1 }}
                      >
                        {t('common.next')} <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'entradas' ? (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <header style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>{t('sidebar.goods')}</h2>
                  <PlanUsageIndicator 
                    label={t('dashboard.goods')} 
                    current={goodsReceipts.length} 
                    limit={profile?.plan?.goodsLimit} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.25rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{t('dashboard.goods_info')}</p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={() => setVideoModal({ isOpen: true, videoId: "rzrGj1OouVo" })}
                      className="btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                    >
                      <PlayCircle size={18} /> {t('dashboard.video_help')}
                    </button>
                    <button 
                      onClick={() => {
                        setEditingGoodsReceipt(null);
                        setGoodsForm({
                          providerName: "",
                        productName: "",
                        lote: "",
                        invoiceNumber: "",
                        quantity: "",
                        date: new Date().toISOString().slice(0, 16),
                        deliveryNoteImage: ""
                      });
                      setIsGoodsModalOpen(true);
                    }}
                    className="btn-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                  >
                    <Package size={18} /> {t('dashboard.new_goods_entry')}
                  </button>
                </div>
              </div>
            </header>

              <div 
                className="glass-card" 
                style={{ 
                  background: 'white', padding: '1.5rem', marginBottom: '2rem', 
                  display: 'flex', gap: '1.5rem', alignItems: 'end', flexWrap: 'wrap'
                }}
              >
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('common.from')}</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={goodsFilters.startDate}
                    onChange={(e) => setGoodsFilters({...goodsFilters, startDate: e.target.value})}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('common.to')}</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={goodsFilters.endDate}
                    onChange={(e) => setGoodsFilters({...goodsFilters, endDate: e.target.value})}
                  />
                </div>
                <button 
                  onClick={() => setGoodsFilters({ startDate: "", endDate: "" })}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: '0.5rem' }}
                >
                  {t('dashboard.cancel')}
                </button>
              </div>

              {(!goodsFilters.startDate || !goodsFilters.endDate) ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', border: '1px solid var(--border)', borderRadius: '1.5rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Calendar size={40} color="var(--border)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('sidebar.goods')}</h3>
                  <p>{t('dashboard.history_info')}</p>
                </div>
              ) : goodsReceipts.filter(r => {
                const date = new Date(r.date);
                const start = new Date(goodsFilters.startDate);
                const end = new Date(goodsFilters.endDate);
                end.setHours(23, 59, 59, 999);
                return date >= start && date <= end;
              }).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: '1.5rem', border: '2px dashed var(--border)' }}>
                  <div style={{ width: '80px', height: '80px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Truck size={40} color="var(--border)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>{t('dashboard.no_records')}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>{t('dashboard.no_records')}</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                  {goodsReceipts
                    .filter(r => {
                      const date = new Date(r.date);
                      const start = new Date(goodsFilters.startDate);
                      const end = new Date(goodsFilters.endDate);
                      end.setHours(23, 59, 59, 999);
                      return date >= start && date <= end;
                    })
                    .map(receipt => (
                    <div key={receipt.id} className="glass-card" style={{ background: 'white', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--corp-green)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            {new Date(receipt.date).toLocaleDateString()}
                          </div>
                          <h4 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>{receipt.productName}</h4>
                          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Truck size={16} /> {receipt.providerName || 'Sin proveedor'}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button 
                            onClick={() => handleEditGoods(receipt)}
                            style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--corp-green)', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteGoods(receipt.id)}
                            style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', fontSize: '0.9rem', border: '1px solid var(--border)' }}>
                        <div>
                          <span style={{ display: 'block', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t('dashboard.lote')}</span>
                          <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>{receipt.lote || '-'}</span>
                        </div>
                        <div>
                          <span style={{ display: 'block', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>CANTIDAD</span>
                          <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>{receipt.quantity || '-'}</span>
                        </div>
                        <div>
                          <span style={{ display: 'block', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>FACTURA</span>
                          <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>{receipt.invoiceNumber || '-'}</span>
                        </div>
                        {receipt.deliveryNoteImage && (
                          <div 
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--corp-green)', fontWeight: '800', marginTop: '0.5rem' }}
                            onClick={() => setViewingImage(receipt.deliveryNoteImage)}
                          >
                            <Camera size={16} /> {t('dashboard.view_note')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'limpieza' ? (
            <div>
              <header style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>{t('sidebar.cleaning')}</h2>
                  <PlanUsageIndicator 
                    label={t('dashboard.cleaning')}
                    current={cleaningLogs.length} 
                    limit={profile?.plan?.cleaningLimit} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.25rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{t('dashboard.cleaning_info')}</p>
                </div>
              </header>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => setVideoModal({ isOpen: true, videoId: "62WLwGwTvew" })}
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                  >
                    <PlayCircle size={18} /> {t('dashboard.video_help')}
                  </button>
                  <button 
                    onClick={() => setIsManageZonesModalOpen(true)}
                    className="btn-secondary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                  >
                    <Settings size={18} /> {t('dashboard.manage_zones')}
                  </button>
                  <button 
                    onClick={() => {
                      setEditingCleaningLog(null);
                      setCleaningForm({
                        personName: "",
                        date: new Date().toISOString().slice(0, 16),
                        selectedZones: []
                      });
                      setIsCleaningModalOpen(true);
                    }}
                    className="btn-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                  >
                    <Plus size={18} /> {t('dashboard.new_record')}
                  </button>
              </div>

              <div 
                className="glass-card" 
                style={{ 
                  background: 'white', padding: '1.5rem', marginBottom: '2rem', 
                  display: 'flex', gap: '1.5rem', alignItems: 'end', flexWrap: 'wrap'
                }}
              >
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('common.from')}</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={cleaningFilters.startDate}
                    onChange={(e) => setCleaningFilters({...cleaningFilters, startDate: e.target.value})}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('common.to')}</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={cleaningFilters.endDate}
                    onChange={(e) => setCleaningFilters({...cleaningFilters, endDate: e.target.value})}
                  />
                </div>
                <button 
                  onClick={() => setCleaningFilters({ startDate: "", endDate: "" })}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: '0.5rem' }}
                >
                  {t('dashboard.cancel')}
                </button>
              </div>

              {(!cleaningFilters.startDate || !cleaningFilters.endDate) ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', border: '1px solid var(--border)', borderRadius: '1.5rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Calendar size={40} color="var(--border)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Consulta de limpieza</h3>
                  <p>Por favor, selecciona un rango de fechas para visualizar los registros.</p>
                </div>
              ) : cleaningLogs.filter(log => {
                const date = new Date(log.date);
                const start = new Date(cleaningFilters.startDate);
                const end = new Date(cleaningFilters.endDate);
                end.setHours(23, 59, 59, 999);
                return date >= start && date <= end;
              }).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', border: '1px solid var(--border)', borderRadius: '1.5rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Brush size={40} color="var(--border)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>No hay registros en este rango</h3>
                  <p style={{ color: 'var(--text-muted)' }}>No se encontraron registros de limpieza para las fechas seleccionadas.</p>
                </div>
              ) : (
                <div className="glass-card" style={{ background: 'white', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                      <tr>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> Persona</div>
                        </th>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> Fecha y Hora</div>
                        </th>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Zonas Limpiadas
                        </th>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ divide: 'y', divideColor: 'var(--border)' }}>
                      {cleaningLogs
                        .filter(log => {
                          const date = new Date(log.date);
                          const start = new Date(cleaningFilters.startDate);
                          const end = new Date(cleaningFilters.endDate);
                          end.setHours(23, 59, 59, 999);
                          return date >= start && date <= end;
                        })
                        .map(log => (
                        <tr key={log.id} style={{ borderBottom: '1px solid var(--border)', background: 'white' }}>
                          <td style={{ padding: '1.5rem 2rem', fontWeight: '700', color: 'var(--text-main)' }}>{log.personName}</td>
                          <td style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)' }}>
                            {new Date(log.date).toLocaleString('es-ES', { 
                              day: '2-digit', month: '2-digit', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </td>
                          <td style={{ padding: '1.5rem 2rem' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {log.zones.map(z => (
                                <span key={z.cleaningZone?.id || Math.random()} style={{ padding: '0.25rem 0.75rem', background: 'rgba(66, 98, 22, 0.1)', color: 'var(--corp-green)', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: '600', border: '1px solid rgba(66, 98, 22, 0.2)' }}>
                                  {z.cleaningZone?.name || 'Zona eliminada'}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleEditCleaning(log)}
                                style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--corp-green)', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteCleaning(log.id)}
                                style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeTab === 'temperaturas' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <header style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>{t('sidebar.temperatures')}</h2>
                  <PlanUsageIndicator 
                    label={t('sidebar.temperatures')} 
                    current={tempRecords.length} 
                    limit={profile?.plan?.temperaturesLimit} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.25rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{t('dashboard.temperature_info')}</p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={() => setVideoModal({ isOpen: true, videoId: "TKl-sUpuDGg" })}
                      className="btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                    >
                      <PlayCircle size={18} /> {t('dashboard.video_help')}
                    </button>
                    <button 
                      onClick={() => setIsManageChambersModalOpen(true)}
                      className="btn-secondary" 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                    >
                      <Settings size={18} /> {t('dashboard.manage_chambers')}
                    </button>
                    <button 
                      onClick={() => {
                        setEditingTempRecord(null);
                        setTempForm({
                          date: new Date().toISOString().slice(0, 16),
                          values: {}
                        });
                        setIsTempModalOpen(true);
                      }}
                      className="btn-primary" 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                    >
                      <Plus size={18} /> {t('dashboard.new_temp_record')}
                    </button>
                  </div>
                </div>
              </header>

              <div 
                className="glass-card" 
                style={{ 
                  background: 'white', padding: '1.5rem', marginBottom: '2rem', 
                  display: 'flex', gap: '1.5rem', alignItems: 'end', flexWrap: 'wrap'
                }}
              >
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('common.from')}</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={tempFilters.startDate}
                    onChange={(e) => setTempFilters({...tempFilters, startDate: e.target.value})}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('common.to')}</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={tempFilters.endDate}
                    onChange={(e) => setTempFilters({...tempFilters, endDate: e.target.value})}
                  />
                </div>
                <button 
                  onClick={() => setTempFilters({ startDate: "", endDate: "" })}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: '0.5rem' }}
                >
                  {t('dashboard.cancel')}
                </button>
              </div>

              {(!tempFilters.startDate || !tempFilters.endDate) ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', border: '1px solid var(--border)', borderRadius: '1.5rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Calendar size={40} color="var(--border)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('dashboard.temp_consultation')}</h3>
                  <p>{t('dashboard.temp_range_desc')}</p>
                </div>
              ) : tempRecords.filter(record => {
                const date = new Date(record.date);
                const start = new Date(tempFilters.startDate);
                const end = new Date(tempFilters.endDate);
                end.setHours(23, 59, 59, 999);
                return date >= start && date <= end;
              }).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', border: '1px solid var(--border)', borderRadius: '1.5rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Thermometer size={40} color="var(--border)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>{t('dashboard.no_records_range')}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>{t('dashboard.no_temp_found')}</p>
                </div>
              ) : (
                <div className="glass-card" style={{ background: 'white', border: '1px solid var(--border)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                      <tr>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fecha y Hora</th>
                        {chambers.map(chamber => (
                          <th key={chamber.id} style={{ padding: '1.25rem 2rem', textAlign: 'center', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{chamber.name}</th>
                        ))}
                        <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody style={{ divideY: '1px', divideColor: 'var(--border)' }}>
                      {tempRecords
                        .filter(record => {
                          const date = new Date(record.date);
                          const start = new Date(tempFilters.startDate);
                          const end = new Date(tempFilters.endDate);
                          end.setHours(23, 59, 59, 999);
                          return date >= start && date <= end;
                        })
                        .map(record => (
                        <tr key={record.id} style={{ borderBottom: '1px solid var(--border)', background: 'white' }}>
                          <td style={{ padding: '1.5rem 2rem', fontWeight: '600', color: 'var(--text-main)' }}>
                            {new Date(record.date).toLocaleString('es-ES', { 
                              day: '2-digit', month: '2-digit', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </td>
                          {chambers.map(chamber => {
                            const val = record.values.find(v => v.chamberId === chamber.id);
                            return (
                              <td key={chamber.id} style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
                                <span style={{ 
                                  padding: '0.4rem 0.85rem', 
                                  background: val ? 'rgba(66, 98, 22, 0.05)' : '#f1f5f9', 
                                  color: val ? 'var(--corp-green)' : '#94a3b8',
                                  borderRadius: '0.75rem', 
                                  fontWeight: '800',
                                  fontSize: '1rem',
                                  border: val ? '1px solid rgba(66, 98, 22, 0.15)' : '1px solid #e2e8f0'
                                }}>
                                  {val ? `${val.value} ºC` : 'N/A'}
                                </span>
                              </td>
                            );
                          })}
                          <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleEditTemp(record)}
                                style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--corp-green)', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteTemp(record.id)}
                                style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeTab === 'gestionar-recetas' ? (
            <div>
              <header style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>{t('sidebar.manage_recipes')}</h2>
                  <PlanUsageIndicator 
                    label={t('dashboard.manage_recipes')} 
                    current={recipes.length} 
                    limit={profile?.plan?.recipesLimit} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.25rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{t('dashboard.recipe_manage_desc')}</p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={() => setVideoModal({ isOpen: true, videoId: "eHdC-SSK5dA" })}
                      className="btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                    >
                      <PlayCircle size={18} /> {t('dashboard.video_help')}
                    </button>
                    <button 
                      onClick={() => {
                        setEditingRecipe(null);
                        setRecipeForm({ name: "", ingredients: [{ name: "", amount: "", unit: "", loteMandatory: false, quantityMandatory: false }] });
                        setIsRecipeManageModalOpen(true);
                      }}
                      className="btn-primary" 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                    >
                      <Plus size={18} /> {t('modals.new_recipe_btn')}
                    </button>
                  </div>
                </div>
              </header>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {recipes.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '6rem 2rem', background: 'white', border: '2px dashed var(--border)', borderRadius: '1.5rem' }}>
                    <ChefHat size={48} color="var(--border)" style={{ marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>{t('dashboard.no_own_recipes')}</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                      {t('dashboard.recipe_limit_info')
                        .replace('{plan}', profile?.plan?.name || "")
                        .replace('{limit}', profile?.plan?.recipesLimit === null ? t('dashboard.unlimited') : profile?.plan?.recipesLimit)}
                    </p>
                    <button 
                      onClick={() => {
                        setEditingRecipe(null);
                        setRecipeForm({ name: "", ingredients: [{ name: "", amount: "", unit: "", loteMandatory: false, quantityMandatory: false }] });
                        setIsRecipeManageModalOpen(true);
                      }}
                      className="btn-primary"
                    >
                      {t('dashboard.create_first_recipe')}
                    </button>
                  </div>
                ) : (
                  recipes.map(recipe => (
                    <div key={recipe.id} className="glass-card" style={{ padding: '2rem', background: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(66, 98, 22, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ChefHat size={20} color="var(--corp-green)" />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0 }}>{recipe.name}</h3>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{recipe.ingredients.length} Ingredientes</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleEditRecipe(recipe)}
                            style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--corp-green)', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteRecipe(recipe.id)}
                            style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleOpenRecipe(recipe)}
                        className="btn-primary"
                        style={{ width: '100%', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', fontSize: '0.85rem', fontWeight: '800' }}
                      >
                        <Plus size={18} /> {t('dashboard.register_elaboration')}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div>
              <header style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>{t('dashboard.my_elaborations')}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('dashboard.elaborations_list_desc')}</p>
              </header>

              <div 
                className="glass-card" 
                style={{ 
                  background: 'white', padding: '1.5rem', marginBottom: '2rem', 
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' 
                }}
              >
                <div>
                  <label className="label" style={{ fontSize: '0.7rem' }}>{t('dashboard.batch_search')}</label>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      className="input-field" 
                      style={{ paddingLeft: '2.5rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }} 
                      placeholder={t('dashboard.batch_placeholder')}
                      value={elabFilters.lote}
                      onChange={(e) => setElabFilters({...elabFilters, lote: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="label" style={{ fontSize: '0.7rem' }}>{t('common.from')}</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                    value={elabFilters.startDate}
                    onChange={(e) => setElabFilters({...elabFilters, startDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="label" style={{ fontSize: '0.7rem' }}>{t('common.to')}</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                    value={elabFilters.endDate}
                    onChange={(e) => setElabFilters({...elabFilters, endDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="label" style={{ fontSize: '0.7rem' }}>{t('dashboard.show')}</label>
                  <select 
                    className="input-field" 
                    style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', appearance: 'auto' }}
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={20}>{t('dashboard.per_page').replace('{count}', '20')}</option>
                    <option value={50}>{t('dashboard.per_page').replace('{count}', '50')}</option>
                    <option value={100}>{t('dashboard.per_page').replace('{count}', '100')}</option>
                    <option value={200}>{t('dashboard.per_page').replace('{count}', '200')}</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => {
                      setElabFilters({ lote: "", startDate: "", endDate: "", recipeId: "all" });
                      setCurrentPage(1);
                    }}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem' }}
                  >
                    <Trash2 size={14} /> {t('dashboard.clear_filters')}
                  </button>
                </div>
              </div>
              
              <div className="glass-card" style={{ background: 'white', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th onClick={() => handleSort('name')} style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {t('dashboard.elaboration_name_header')} {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('date')} style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {t('dashboard.elaboration_date_header')} {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('recipe')} style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {t('dashboard.elaboration_recipe_header')} {sortConfig.key === 'recipe' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('dashboard.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedElaborations.map(elab => (
                      <tr key={elab.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>{elab.name}</td>
                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>
                          {new Date(elab.date).toLocaleDateString(t('common.locale_code') || 'es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(66, 98, 22, 0.08)', color: 'var(--corp-green)', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: '700' }}>
                            {elab.recipe.name}
                          </span>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <button 
                            onClick={() => handleEditElaboration(elab)}
                            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'white', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                          >
                            {t('dashboard.modify')}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {sortedElaborations.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          {t('dashboard.no_elaborations_recorded')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {totalElabs > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderTop: '1px solid var(--border)', background: '#f8fafc' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {t('dashboard.showing_info')
                        .replace('{start}', ((currentPage - 1) * itemsPerPage) + 1)
                        .replace('{end}', Math.min(currentPage * itemsPerPage, totalElabs))
                        .replace('{total}', totalElabs)}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, fontSize: '0.85rem', fontWeight: '700' }}
                      >
                        {t('common.previous')}
                      </button>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {[...Array(Math.ceil(totalElabs / itemsPerPage))].map((_, i) => {
                          const pageNum = i + 1;
                          const totalPages = Math.ceil(totalElabs / itemsPerPage);
                          if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                            return (
                              <button 
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                style={{ 
                                  width: '32px', height: '32px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  border: '1px solid var(--border)', background: currentPage === pageNum ? 'var(--corp-green)' : 'white',
                                  color: currentPage === pageNum ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: '800', fontSize: '0.85rem'
                                }}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                          if (pageNum === currentPage - 2 || pageNum === currentPage + 2) return <span key={pageNum} style={{ color: 'var(--text-muted)' }}>...</span>;
                          return null;
                        })}
                      </div>
                      <button 
                        disabled={currentPage >= Math.ceil(totalElabs / itemsPerPage)}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'white', cursor: currentPage >= Math.ceil(totalElabs / itemsPerPage) ? 'not-allowed' : 'pointer', opacity: currentPage >= Math.ceil(totalElabs / itemsPerPage) ? 0.5 : 1, fontSize: '0.85rem', fontWeight: '700' }}
                      >
                        {t('common.next')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {isCleaningModalOpen && (
        <CleaningRegistrationModal 
          zones={cleaningZones} 
          onClose={() => {
            setIsCleaningModalOpen(false);
            setEditingCleaningLog(null);
          }} 
          onSubmit={handleSubmitCleaning}
          formData={cleaningForm}
          setFormData={setCleaningForm}
          loading={loading}
          isEditing={!!editingCleaningLog}
        />
      )}

      {isTempModalOpen && (
        <TemperatureRegistrationModal 
          chambers={chambers} 
          onClose={() => {
            setIsTempModalOpen(false);
            setEditingTempRecord(null);
          }} 
          onSubmit={handleSubmitTemperature}
          formData={tempForm}
          setFormData={setTempForm}
          loading={loading}
          isEditing={!!editingTempRecord}
        />
      )}

      {isGoodsModalOpen && (
        <GoodsReceiptModal 
          onClose={() => setIsGoodsModalOpen(false)}
          onSubmit={handleSubmitGoods}
          formData={goodsForm}
          setFormData={setGoodsForm}
          loading={loading}
          isEditing={!!editingGoodsReceipt}
          onImageChange={handleImageChange}
        />
      )}

      {viewingImage && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '2rem' }}
          onClick={() => setViewingImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={e => e.stopPropagation()}>
            <img src={viewingImage} alt="Albarán" style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} />
            <button 
              onClick={() => setViewingImage(null)}
              style={{ position: 'absolute', top: '-1rem', right: '-1rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {isRecipeManageModalOpen && (
        <RecipeManageModal 
          onClose={() => setIsRecipeManageModalOpen(false)}
          onSubmit={handleSubmitRecipe}
          formData={recipeForm}
          setFormData={setRecipeForm}
          loading={loading}
          isEditing={!!editingRecipe}
          onAddIngredient={addIngredient}
          onRemoveIngredient={removeIngredient}
          onIngredientChange={handleRecipeIngredientChange}
        />
      )}

      {isManageChambersModalOpen && (
        <ManageChambersModal 
          chambers={chambers}
          onClose={() => setIsManageChambersModalOpen(false)}
          onCreate={handleCreateChamber}
          onEdit={handleEditChamber}
          onDelete={handleDeleteChamber}
        />
      )}

      {isManageZonesModalOpen && (
        <ManageCleaningZonesModal 
          zones={cleaningZones}
          onClose={() => setIsManageZonesModalOpen(false)}
          onCreate={handleCreateZone}
          onEdit={handleEditZone}
          onDelete={handleDeleteZone}
        />
      )}
      {isProfileOpen && (
        <ProfileModal 
          onClose={() => setIsProfileOpen(false)} 
          profile={profile}
          onUpdate={fetchProfile}
          onCancelSubscription={handleCancelSubscription}
        />
      )}

      {isLabelModalOpen && (
        <LabelConfigModal 
          config={profile?.labelConfig}
          onClose={() => setIsLabelModalOpen(false)}
          onSave={handleUpdateLabelConfig}
        />
      )}

      <style jsx global>{`
        :root {
          --corp-green: #3f6212;
          --bg-main: #f8fafc;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --border: #e2e8f0;
        }
        
        body {
          background-color: var(--bg-main);
          color: var(--text-main);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 1.25rem;
          transition: all 0.3s ease;
        }

        .input-field {
          width: 100%;
          padding: 0.875rem 1.25rem;
          border-radius: 0.75rem;
          border: 1.5px solid var(--border);
          background: white;
          transition: all 0.2s ease;
          font-size: 0.95rem;
          font-weight: 500;
          outline: none;
        }

        .input-field:focus {
          border-color: var(--corp-green);
          box-shadow: 0 0 0 4px rgba(63, 98, 18, 0.1);
        }

        .label {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .btn-primary {
          background: var(--corp-green);
          color: white;
          padding: 0.875rem 1.5rem;
          border-radius: 0.875rem;
          border: none;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: -0.01em;
        }

        .btn-primary:hover {
          background: #365314;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(63, 98, 18, 0.2);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          background: white;
          color: var(--text-main);
          padding: 0.875rem 1.5rem;
          border-radius: 0.875rem;
          border: 1.5px solid var(--border);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #f1f5f9;
        }

        .animate-spin { animation: spin 1.5s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          .flex-responsive { flex-direction: column !important; }
          .sidebar-responsive { 
            width: 100% !important; 
            height: auto !important; 
            position: relative !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border) !important;
          }
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-content {
          background: white;
          width: 100%;
          padding: 2.5rem;
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border);
          overflow-y: auto;
          max-height: 90vh;
        }
      `}</style>
      {videoModal.isOpen && (
        <div 
          style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            zIndex: 10000, padding: '2rem', backdropFilter: 'blur(8px)'
          }}
          onClick={() => setVideoModal({ isOpen: false, videoId: "" })}
        >
          <div 
            style={{ width: '100%', maxWidth: '1000px', position: 'relative', background: 'black', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setVideoModal({ isOpen: false, videoId: "" })}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={24} />
            </button>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={`https://www.youtube.com/embed/${videoModal.videoId}?autoplay=1`}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CleaningRegistrationModal({ zones, onClose, onSubmit, formData, setFormData, loading, isEditing }) {
  const { t } = useI18n();
  const toggleZone = (zoneId) => {
    setFormData(prev => ({
      ...prev,
      selectedZones: prev.selectedZones.includes(zoneId)
        ? prev.selectedZones.filter(id => id !== zoneId)
        : [...prev.selectedZones, zoneId]
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {isEditing ? t('common.edit') : t('modals.cleaning_header')}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              {t('modals.date_time')}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><X size={24} /></button>
        </header>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="label">{t('modals.person_name')}</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.personName} 
                onChange={(e) => setFormData({...formData, personName: e.target.value})} 
                required 
                placeholder={t('dashboard.person')}
              />
            </div>
            <div>
              <label className="label">{t('modals.date_time')}</label>
              <input 
                type="datetime-local" 
                className="input-field" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div>
            <label className="label" style={{ marginBottom: '1rem', display: 'block' }}>{t('modals.select_zones')}</label>
            {zones.length === 0 ? (
              <p style={{ padding: '2rem', background: '#f8fafc', borderRadius: '1rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                {t('modals.no_zones_config')}
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                {zones.map(zone => (
                  <label key={zone.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'white'}>
                    <input 
                      type="checkbox" 
                      checked={formData.selectedZones.includes(zone.id)} 
                      onChange={() => toggleZone(zone.id)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--corp-green)' }}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{zone.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, padding: '1rem', background: '#f1f5f9', border: 'none', color: '#64748b', fontWeight: '800' }}>{t('common.cancel')}</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2, padding: '1rem' }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GoodsReceiptModal({ onClose, onSubmit, formData, setFormData, loading, isEditing, onImageChange }) {
  const { t } = useI18n();
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '750px' }}>
        <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {isEditing ? t('common.edit') : t('modals.goods_header')}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>{t('common.save')}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><X size={24} /></button>
        </header>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="label">{t('goods_receipt_form.product')} <span style={{color:'#ef4444'}}>*</span></label>
              <div style={{ position: 'relative' }}>
                <Package size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--corp-green)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.productName} 
                  onChange={(e) => setFormData({...formData, productName: e.target.value})} 
                  required 
                  placeholder=""
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="label">{t('goods_receipt_form.provider')}</label>
              <div style={{ position: 'relative' }}>
                <Truck size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--corp-green)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.providerName} 
                  onChange={(e) => setFormData({...formData, providerName: e.target.value})} 
                  placeholder=""
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="label">{t('dashboard.lote')}</label>
              <div style={{ position: 'relative' }}>
                <FileCheck size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--corp-green)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.lote} 
                  onChange={(e) => setFormData({...formData, lote: e.target.value})} 
                  placeholder={t('dashboard.lote')}
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="label">{t('modals.ing_amount')}</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.quantity} 
                onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
                placeholder={t('modals.ing_amount')}
              />
            </div>
            <div className="form-group">
              <label className="label">{t('goods_receipt_form.invoice_number')}</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.invoiceNumber} 
                onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})} 
                placeholder={t('dashboard.invoice')}
              />
            </div>
            <div className="form-group">
              <label className="label">{t('dashboard.datetime')} <span style={{color:'#ef4444'}}>*</span></label>
              <input 
                type="datetime-local" 
                className="input-field" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">{t('dashboard.delivery_note_photo')}</label>
            <div style={{ 
              border: '2px dashed var(--border)', 
              borderRadius: '1rem', 
              padding: '2rem', 
              textAlign: 'center', 
              background: '#f8fafc',
              position: 'relative',
              cursor: 'pointer',
              overflow: 'hidden'
            }}>
              {formData.deliveryNoteImage ? (
                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                  <img src={formData.deliveryNoteImage} alt="Albarán" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, deliveryNoteImage: ""})}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div onClick={() => document.getElementById('imageInput').click()}>
                  <Camera size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                  <p style={{ fontWeight: '700', color: 'var(--text-main)' }}>{t('dashboard.upload_photo')}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('dashboard.photo_format')}</p>
                </div>
              )}
              <input 
                id="imageInput"
                type="file" 
                accept="image/*" 
                onChange={onImageChange} 
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, padding: '1rem', background: '#f1f5f9', border: 'none', color: '#64748b', fontWeight: '800' }}>{t('dashboard.cancel')}</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2, padding: '1rem' }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : t('dashboard.save_entry')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProfileModal({ onClose, profile, onUpdate, onCancelSubscription }) {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    personName: profile?.personName || "",
    razonSocial: profile?.razonSocial || "",
    nif: profile?.nif || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    postalCode: profile?.postalCode || "",
    city: profile?.city || "",
    province: profile?.province || "",
    country: profile?.country || "España"
  });
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/client/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const isDemo = !profile?.planId || profile?.plan?.name?.toUpperCase() === "DEMO";

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px' }}>
        <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {t('profile.title')}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>{t('profile.manage_info')}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}><X size={24} /></button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <section>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--corp-green)' }}>
              <User size={20} /> {t('profile.business_data')}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="label">{t('profile.person_name')}</label>
                <input type="text" className="input-field" value={formData.personName} onChange={e => setFormData({...formData, personName: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="label">{t('profile.business_name')}</label>
                <input type="text" className="input-field" value={formData.razonSocial} onChange={e => setFormData({...formData, razonSocial: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="label">{t('profile.vat_nif')}</label>
                <input type="text" className="input-field" value={formData.nif} onChange={e => setFormData({...formData, nif: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="label">{t('profile.phone')}</label>
                <input type="text" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="label">{t('profile.address')}</label>
                <input type="text" className="input-field" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="label">{t('profile.postal_code')}</label>
                  <input type="text" className="input-field" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="label">{t('profile.city')}</label>
                  <input type="text" className="input-field" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="label">{t('profile.province')}</label>
                  <input type="text" className="input-field" value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="label">{t('profile.country')}</label>
                  <input type="text" className="input-field" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : t('common.save')}
              </button>
            </form>
          </section>

          <section>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--corp-green)' }}>
              <CreditCard size={20} /> {t('profile.current_subscription')}
            </h3>
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--corp-green)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{t('profile.current_plan_label')}</div>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '1.5rem' }}>{profile?.plan?.name || "DEMO"}</div>
              
              {!isDemo && (
                <div style={{ 
                  background: 'white', borderRadius: '1rem', padding: '1rem', border: '1px solid var(--border)',
                  marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)'
                }}>
                  <div style={{ marginBottom: '0.5rem' }}>{t('profile.next_renewal')}:</div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                    {profile?.stripeCurrentPeriodEnd ? new Date(profile.stripeCurrentPeriodEnd).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link href="/dashboard/plans" className="btn-primary" style={{ textDecoration: 'none', width: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Crown size={20} /> {isDemo ? t('profile.more_info_plans') : t('profile.change_plan')}
                </Link>
                
                {!isDemo && profile?.stripeSubscriptionId && (
                  <>
                    <button 
                      onClick={onCancelSubscription} 
                      disabled={cancelLoading}
                      className="btn-secondary"
                      style={{ 
                        width: '100%',
                        padding: '0.75rem', 
                        borderRadius: '0.75rem', 
                        background: '#fef2f2', 
                        border: '1px solid #fee2e2', 
                        color: '#dc2626', 
                        fontSize: '0.85rem', 
                        fontWeight: '700', 
                        cursor: 'pointer',
                        marginTop: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <X size={16} /> {cancelLoading ? t('profile.canceling') : t('profile.cancel_subscription_btn')}
                    </button>

                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '1rem', border: '1px dashed #3b82f6', textAlign: 'left' }}>
                      <p style={{ fontSize: '0.85rem', color: '#1e40af', margin: 0, lineHeight: '1.5' }}>
                        <strong>{t('profile.notice_label')}:</strong> {t('profile.cancellation_notice')}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function PlanUsageIndicator({ label, current, limit }) {
  const { t } = useI18n();
  const isCapped = limit !== null && current >= limit;
  const percentage = limit ? Math.min((current / limit) * 100, 100) : 0;

  return (
    <div style={{ 
      display: 'inline-flex', alignItems: 'center', gap: '1.5rem', 
      background: 'white', padding: '0.75rem 1.5rem', borderRadius: '1rem', 
      border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: '900', color: isCapped ? '#ef4444' : 'var(--corp-green)' }}>
            {current} / {limit === null ? '∞' : limit}
          </span>
          {limit && (
            <div style={{ width: '60px', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${percentage}%`, height: '100%', background: isCapped ? '#ef4444' : 'var(--corp-green)', transition: 'width 0.5s ease' }} />
            </div>
          )}
        </div>
      </div>
      
      <Link href="/dashboard/plans" style={{ 
        display: 'flex', alignItems: 'center', gap: '0.5rem', 
        padding: '0.5rem 1rem', background: 'rgba(66, 98, 22, 0.1)', 
        color: 'var(--corp-green)', borderRadius: '0.75rem', 
        fontSize: '0.85rem', fontWeight: '800', textDecoration: 'none',
        transition: 'all 0.2s'
      }}>
        <Crown size={14} /> {t('modals.upgrade_plan')}
      </Link>
    </div>
  );
}

function SidebarBtn({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem',
        background: active ? 'rgba(66, 98, 22, 0.08)' : 'transparent',
        border: 'none', 
        color: active ? 'var(--corp-green)' : 'var(--text-muted)', 
        fontSize: '0.95rem', fontWeight: active ? '800' : '500',
        cursor: 'pointer', borderRadius: '0.75rem', textAlign: 'left', transition: 'all 0.2s'
      }}
    >
      {icon} {label}
    </button>
  );
}

function TemperatureRegistrationModal({ chambers, onClose, onSubmit, formData, setFormData, loading, isEditing }) {
  const { t } = useI18n();
  const handleValueChange = (chamberId, value) => {
    setFormData(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [chamberId]: value
      }
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {isEditing ? t('common.edit') : t('modals.temp_header')}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              {t('modals.obs_temp')}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><X size={24} /></button>
        </header>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              <Calendar size={16} color="var(--corp-green)" /> {t('modals.date_time')}
            </label>
            <input 
              type="datetime-local" 
              className="input-field" 
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              style={{ margin: 0 }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('modals.chambers')}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {chambers.map(chamber => (
                <div key={chamber.id} className="form-group" style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{chamber.name}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="number" 
                      step="0.1"
                      className="input-field" 
                      placeholder="0.0"
                      value={formData.values[chamber.id] || ""}
                      onChange={(e) => handleValueChange(chamber.id, e.target.value)}
                      required
                      style={{ margin: 0, padding: '0.5rem' }}
                    />
                    <span style={{ fontWeight: '800', color: 'var(--text-muted)' }}>ºC</span>
                  </div>
                </div>
              ))}
            </div>
            {chambers.length === 0 && (
              <p style={{ padding: '1rem', background: '#fff7ed', color: '#c2410c', borderRadius: '0.5rem', fontSize: '0.85rem', border: '1px solid #ffedd5' }}>
                {t('modals.no_chambers_config')}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>{t('common.cancel')}</button>
            <button type="submit" disabled={loading || chambers.length === 0} className="btn-primary" style={{ flex: 2 }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isEditing ? t('common.save') : t('dashboard.save_record'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RecipeManageModal({ onClose, onSubmit, formData, setFormData, loading, isEditing, onAddIngredient, onRemoveIngredient, onIngredientChange }) {
  const { t } = useI18n();

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '850px' }}>
        <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {isEditing ? t('modals.edit_recipe') : t('modals.recipe_header')}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>{t('modals.recipe_manage_desc')}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}><X size={24} /></button>
        </header>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <label className="label">{t('modals.recipe_name')}</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
              placeholder={t('modals.recipe_name')}
              style={{ fontSize: '1.1rem', padding: '1rem' }}
            />
          </div>

          <div>
            <label className="label">{t('modals.expiry_days')}</label>
            <input 
              type="number" 
              className="input-field" 
              value={formData.expiryDays} 
              onChange={(e) => setFormData({...formData, expiryDays: parseInt(e.target.value) || 0})} 
              placeholder="7"
              style={{ fontSize: '1.1rem', padding: '1rem' }}
            />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              {t('modals.expiry_days_help')}
            </p>
          </div>

          <div>
            <label className="label">{t('modals.expiry_type')}</label>
            <select 
              className="input-field" 
              value={formData.expiryType || "EXPIRATION"} 
              onChange={(e) => setFormData({...formData, expiryType: e.target.value})}
              style={{ fontSize: '1.1rem', padding: '1rem' }}
            >
              <option value="EXPIRATION">{t('modals.expiry_type_expiration')}</option>
              <option value="BEST_BEFORE">{t('modals.expiry_type_best_before')}</option>
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--corp-green)', margin: 0 }}>{t('modals.ingredients')}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formData.ingredients.map((ing, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr auto', gap: '1rem', alignItems: 'center', padding: '1.25rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>{t('modals.ing_name')}</label>
                    <input type="text" className="input-field" value={ing.name} onChange={(e) => onIngredientChange(idx, 'name', e.target.value)} required placeholder={t('modals.ing_name')} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>{t('modals.ing_amount')}</label>
                    <input type="text" className="input-field" value={ing.amount} onChange={(e) => onIngredientChange(idx, 'amount', e.target.value)} required placeholder="500" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>{t('modals.ing_unit')}</label>
                    <input type="text" className="input-field" value={ing.unit} onChange={(e) => onIngredientChange(idx, 'unit', e.target.value)} required placeholder="g, kg, L..." />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>
                      <input type="checkbox" checked={ing.loteMandatory} onChange={(e) => onIngredientChange(idx, 'loteMandatory', e.target.checked)} style={{ accentColor: 'var(--corp-green)' }} />
                      {t('modals.lote_obligatory')}
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>
                      <input type="checkbox" checked={ing.quantityMandatory} onChange={(e) => onIngredientChange(idx, 'quantityMandatory', e.target.checked)} style={{ accentColor: 'var(--corp-green)' }} />
                      {t('modals.real_qty_obligatory')}
                    </label>
                  </div>
                  {formData.ingredients.length > 1 && (
                    <button type="button" onClick={() => onRemoveIngredient(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}>
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}

              <button 
                type="button" 
                onClick={onAddIngredient}
                style={{ alignSelf: 'center', background: 'rgba(66, 98, 22, 0.1)', color: 'var(--corp-green)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
              >
                <Plus size={16} /> {t('modals.add_ingredient')}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, padding: '1rem' }}>{t('common.cancel')}</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2, padding: '1rem' }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isEditing ? t('common.save') : t('modals.create_recipe'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ManageChambersModal({ chambers, onClose, onCreate, onEdit, onDelete }) {
  const { t } = useI18n();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const success = await onCreate(newName);
    if (success) setNewName("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    const success = await onEdit(editingId, editName);
    if (success) setEditingId(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{t('modals.chambers_header')}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('modals.manage_chambers_desc')}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>{t('modals.new_chamber')}</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder={t('modals.chamber_placeholder')} 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>{t('modals.add_btn')}</button>
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {chambers.map(chamber => (
            <div key={chamber.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '1rem' }}>
              {editingId === chamber.id ? (
                <form onSubmit={handleUpdate} style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}><Save size={16} /></button>
                  <button type="button" className="btn-secondary" onClick={() => setEditingId(null)} style={{ padding: '0.5rem 1rem' }}><X size={16} /></button>
                </form>
              ) : (
                <>
                  <span style={{ fontWeight: '700', fontSize: '1rem' }}>{chamber.name}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => { setEditingId(chamber.id); setEditName(chamber.name); }}
                      style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'white', color: 'var(--corp-green)', cursor: 'pointer' }}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(chamber.id)}
                      style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {chambers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
              {t('modals.no_chambers_config')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ManageCleaningZonesModal({ zones, onClose, onCreate, onEdit, onDelete }) {
  const { t } = useI18n();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const success = await onCreate(newName);
    if (success) setNewName("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    const success = await onEdit(editingId, editName);
    if (success) setEditingId(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{t('modals.zones_header')}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('modals.manage_zones_desc')}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>{t('modals.new_zone')}</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder={t('modals.zone_placeholder')}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>{t('modals.add_btn')}</button>
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {zones.map(zone => (
            <div key={zone.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '1rem' }}>
              {editingId === zone.id ? (
                <form onSubmit={handleUpdate} style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}><Save size={16} /></button>
                  <button type="button" className="btn-secondary" onClick={() => setEditingId(null)} style={{ padding: '0.5rem 1rem' }}><X size={16} /></button>
                </form>
              ) : (
                <>
                  <span style={{ fontWeight: '700', fontSize: '1rem' }}>{zone.name}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => { setEditingId(zone.id); setEditName(zone.name); }}
                      style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'white', color: 'var(--corp-green)', cursor: 'pointer' }}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(zone.id)}
                      style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {zones.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
              {t('modals.no_zones_config')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LabelConfigModal({ config, onClose, onSave }) {
  const { t } = useI18n();
  const [localConfig, setLocalConfig] = useState(mergeLabelConfig(config));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localConfig);
    onClose();
  };

  const updateField = (section, field, value) => {
    setLocalConfig({
      ...localConfig,
      [section]: {
        ...localConfig[section],
        [field]: value
      }
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{t('modals.labels_header')}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Show/Hide Fields */}
          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--corp-green)' }}>{t('modals.labels_show_fields')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { id: 'lote', label: t('modals.labels_batch_num') },
                { id: 'person', label: t('modals.labels_made_by') },
                { id: 'date', label: t('modals.labels_date') },
                { id: 'expiration', label: t('modals.labels_expiration') }
              ].map(field => (
                <div key={field.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{field.label}</span>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name={`show-${field.id}`} 
                        checked={localConfig.showFields[field.id] === true} 
                        onChange={() => updateField('showFields', field.id, true)}
                      /> {t('dashboard.show')}
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name={`show-${field.id}`} 
                        checked={localConfig.showFields[field.id] === false} 
                        onChange={() => updateField('showFields', field.id, false)}
                      /> {t('common.no')}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ingredient Options */}
          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--corp-green)' }}>{t('modals.labels_ingredients_options')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.75rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={localConfig.ingredientOptions.showLote} 
                  onChange={(e) => updateField('ingredientOptions', 'showLote', e.target.checked)}
                />
                <span style={{ fontSize: '0.9rem' }}>{t('modals.labels_show_ing_batch')}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.75rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={localConfig.ingredientOptions.showAmount} 
                  onChange={(e) => updateField('ingredientOptions', 'showAmount', e.target.checked)}
                />
                <span style={{ fontSize: '0.9rem' }}>{t('modals.labels_show_ing_amount')}</span>
              </label>
            </div>
          </section>

          {/* Layout Options */}
          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--corp-green)' }}>{t('modals.labels_layout_options')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { id: 'vertical', label: t('modals.labels_layout_vertical') },
                { id: 'horizontal_left', label: t('modals.labels_layout_horizontal_left') },
                { id: 'horizontal_right', label: t('modals.labels_layout_horizontal_right') }
              ].map(opt => (
                <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: localConfig.layout === opt.id ? '#f0fdf4' : '#f8fafc', border: `1px solid ${localConfig.layout === opt.id ? 'var(--corp-green)' : 'transparent'}`, borderRadius: '0.75rem', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="layout" 
                    checked={localConfig.layout === opt.id} 
                    onChange={() => setLocalConfig({...localConfig, layout: opt.id})}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: localConfig.layout === opt.id ? '700' : '500' }}>{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Font Size */}
          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--corp-green)' }}>{t('modals.labels_font_size')}</h3>
            <select 
              className="input-field" 
              value={localConfig.fontSize} 
              onChange={(e) => setLocalConfig({...localConfig, fontSize: parseInt(e.target.value)})}
              style={{ padding: '0.75rem' }}
            >
              {[12, 14, 16, 18, 20].map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </section>

          <footer style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">{t('common.cancel')}</button>
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>{t('common.save')}</button>
          </footer>
        </form>
      </div>
    </div>
  );
}

