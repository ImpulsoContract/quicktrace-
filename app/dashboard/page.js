"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { 
  ChefHat, History, LogOut, 
  Search, ClipboardList, Clock,
  ArrowLeft, Save, Beaker, Menu,
  ChevronRight, Loader2, AlertCircle, Trash2,
  Plus, Brush, User, Users, UserPlus, Calendar, Edit, Thermometer,
  Package, Truck, FileCheck, Camera, X, Crown, Zap, Settings,
  CreditCard, ArrowUpCircle, PlayCircle, Printer, FileText, AlertTriangle,
  Droplets, Waves, DollarSign, Recycle, PlusCircle, Sparkles, Cpu, UploadCloud, Check, Info,
  Eye, ExternalLink
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import JsBarcode from "jsbarcode";
import { signOut } from "next-auth/react";
import Link from "next/link";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ALL_CURRENCIES = [
  { code: "EUR", symbol: "€" },
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
  { code: "AED", symbol: "د.إ" },
  { code: "AFN", symbol: "؋" },
  { code: "ALL", symbol: "L" },
  { code: "AMD", symbol: "֏" },
  { code: "ANG", symbol: "ƒ" },
  { code: "AOA", symbol: "Kz" },
  { code: "ARS", symbol: "$" },
  { code: "AUD", symbol: "$" },
  { code: "AWG", symbol: "ƒ" },
  { code: "AZN", symbol: "₼" },
  { code: "BAM", symbol: "KM" },
  { code: "BBD", symbol: "$" },
  { code: "BDT", symbol: "৳" },
  { code: "BGN", symbol: "лв" },
  { code: "BHD", symbol: ".د.ب" },
  { code: "BIF", symbol: "FBu" },
  { code: "BMD", symbol: "$" },
  { code: "BND", symbol: "$" },
  { code: "BOB", symbol: "$b" },
  { code: "BRL", symbol: "R$" },
  { code: "BSD", symbol: "$" },
  { code: "BTN", symbol: "Nu." },
  { code: "BWP", symbol: "P" },
  { code: "BYN", symbol: "Br" },
  { code: "BZD", symbol: "BZ$" },
  { code: "CAD", symbol: "$" },
  { code: "CDF", symbol: "FC" },
  { code: "CHF", symbol: "CHF" },
  { code: "CLP", symbol: "$" },
  { code: "CNY", symbol: "¥" },
  { code: "COP", symbol: "$" },
  { code: "CRC", symbol: "₡" },
  { code: "CUC", symbol: "$" },
  { code: "CUP", symbol: "₱" },
  { code: "CVE", symbol: "$" },
  { code: "CZK", symbol: "Kč" },
  { code: "DJF", symbol: "Fdj" },
  { code: "DKK", symbol: "kr" },
  { code: "DOP", symbol: "RD$" },
  { code: "DZD", symbol: "دج" },
  { code: "EGP", symbol: "£" },
  { code: "ERN", symbol: "Nfk" },
  { code: "ETB", symbol: "Br" },
  { code: "FJD", symbol: "$" },
  { code: "FKP", symbol: "£" },
  { code: "GEL", symbol: "₾" },
  { code: "GGP", symbol: "£" },
  { code: "GHS", symbol: "GH₵" },
  { code: "GIP", symbol: "£" },
  { code: "GMD", symbol: "D" },
  { code: "GNF", symbol: "FG" },
  { code: "GTQ", symbol: "Q" },
  { code: "GYD", symbol: "$" },
  { code: "HKD", symbol: "$" },
  { code: "HNL", symbol: "L" },
  { code: "HRK", symbol: "kn" },
  { code: "HTG", symbol: "G" },
  { code: "HUF", symbol: "Ft" },
  { code: "IDR", symbol: "Rp" },
  { code: "ILS", symbol: "₪" },
  { code: "IMP", symbol: "£" },
  { code: "INR", symbol: "₹" },
  { code: "IQD", symbol: "ع.د" },
  { code: "IRR", symbol: "﷼" },
  { code: "ISK", symbol: "kr" },
  { code: "JEP", symbol: "£" },
  { code: "JMD", symbol: "J$" },
  { code: "JOD", symbol: "JD" },
  { code: "JPY", symbol: "¥" },
  { code: "KES", symbol: "KSh" },
  { code: "KGS", symbol: "лв" },
  { code: "KHR", symbol: "៛" },
  { code: "KMF", symbol: "CF" },
  { code: "KPW", symbol: "₩" },
  { code: "KRW", symbol: "₩" },
  { code: "KWD", symbol: "KD" },
  { code: "KYD", symbol: "$" },
  { code: "KZT", symbol: "лв" },
  { code: "LAK", symbol: "₭" },
  { code: "LBP", symbol: "£" },
  { code: "LKR", symbol: "₨" },
  { code: "LRD", symbol: "$" },
  { code: "LSL", symbol: "L" },
  { code: "LYD", symbol: "LD" },
  { code: "MAD", symbol: "MAD" },
  { code: "MDL", symbol: "lei" },
  { code: "MGA", symbol: "Ar" },
  { code: "MKD", symbol: "den" },
  { code: "MMK", symbol: "K" },
  { code: "MNT", symbol: "₮" },
  { code: "MOP", symbol: "MOP$" },
  { code: "MRU", symbol: "UM" },
  { code: "MUR", symbol: "₨" },
  { code: "MVR", symbol: "Rf" },
  { code: "MWK", symbol: "MK" },
  { code: "MXN", symbol: "$" },
  { code: "MYR", symbol: "RM" },
  { code: "MZN", symbol: "MT" },
  { code: "NAD", symbol: "$" },
  { code: "NGN", symbol: "₦" },
  { code: "NIO", symbol: "C$" },
  { code: "NOK", symbol: "kr" },
  { code: "NPR", symbol: "₨" },
  { code: "NZD", symbol: "$" },
  { code: "OMR", symbol: "﷼" },
  { code: "PAB", symbol: "B/." },
  { code: "PEN", symbol: "S/." },
  { code: "PGK", symbol: "K" },
  { code: "PHP", symbol: "₱" },
  { code: "PKR", symbol: "₨" },
  { code: "PLN", symbol: "zł" },
  { code: "PYG", symbol: "Gs" },
  { code: "QAR", symbol: "﷼" },
  { code: "RON", symbol: "lei" },
  { code: "RSD", symbol: "Дин." },
  { code: "RUB", symbol: "₽" },
  { code: "RWF", symbol: "R₣" },
  { code: "SAR", symbol: "﷼" },
  { code: "SBD", symbol: "$" },
  { code: "SCR", symbol: "₨" },
  { code: "SDG", symbol: "ج.س." },
  { code: "SEK", symbol: "kr" },
  { code: "SGD", symbol: "$" },
  { code: "SHP", symbol: "£" },
  { code: "SLL", symbol: "Le" },
  { code: "SOS", symbol: "S" },
  { code: "SRD", symbol: "$" },
  { code: "SSP", symbol: "£" },
  { code: "STN", symbol: "Db" },
  { code: "SVC", symbol: "$" },
  { code: "SYP", symbol: "£" },
  { code: "SZL", symbol: "E" },
  { code: "THB", symbol: "฿" },
  { code: "TJS", symbol: "SM" },
  { code: "TMT", symbol: "T" },
  { code: "TND", symbol: "DT" },
  { code: "TOP", symbol: "T$" },
  { code: "TRY", symbol: "₺" },
  { code: "TTD", symbol: "TT$" },
  { code: "TWD", symbol: "NT$" },
  { code: "TZS", symbol: "TSh" },
  { code: "UAH", symbol: "₴" },
  { code: "UGX", symbol: "USh" },
  { code: "UYU", symbol: "$U" },
  { code: "UZS", symbol: "лв" },
  { code: "VES", symbol: "Bs." },
  { code: "VND", symbol: "₫" },
  { code: "VUV", symbol: "VT" },
  { code: "WST", symbol: "WS$" },
  { code: "XAF", symbol: "FCFA" },
  { code: "XCD", symbol: "$" },
  { code: "XOF", symbol: "CFA" },
  { code: "XPF", symbol: "₣" },
  { code: "YER", symbol: "﷼" },
  { code: "ZAR", symbol: "R" },
  { code: "ZMW", symbol: "ZK" },
  { code: "ZWL", symbol: "$" }
];

const formatPrice = (amount, currencyCode = "EUR", locale = "es-ES") => {
  if (amount === undefined || amount === null) return "-";
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (e) {
    // Fallback if currency code is invalid or not supported
    return `${parseFloat(amount).toFixed(2)} ${currencyCode}`;
  }
};

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

const formatDateTimeDDMMYYYY = (dateInput) => {
  if (!dateInput) return "-";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "-";
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (e) {
    return "-";
  }
};

const DEFAULT_LABEL_CONFIG = {
  headerImage: null,
  healthRegistry: "",
  showFields: {
    lote: true,
    person: false,
    date: true,
    expiration: true,
    netWeight: false
  },
  ingredientOptions: {
    showLote: false,
    showAmount: false,
    format: 'list'
  },
  fontSize: 14,
  columnsCount: 1,
  columns: {
    col1: ["recipeName", "lote", "elaborationDate", "expirationDate", "ingredientsList"],
    col2: []
  }
};

const mergeLabelConfig = (rawConfig) => {
  let config = rawConfig;
  if (typeof rawConfig === "string") {
    try {
      config = JSON.parse(rawConfig);
    } catch (e) {
      console.error("Failed to parse labelConfig string", e);
      config = {};
    }
  }

  if (!config || Object.keys(config).length === 0) return DEFAULT_LABEL_CONFIG;
  
  const mergedCols = {
    col1: config.columns?.col1 || DEFAULT_LABEL_CONFIG.columns.col1,
    col2: config.columns?.col2 || DEFAULT_LABEL_CONFIG.columns.col2
  };

  return {
    ...DEFAULT_LABEL_CONFIG,
    ...config,
    columns: mergedCols,
    ingredientOptions: { ...DEFAULT_LABEL_CONFIG.ingredientOptions, ...(config.ingredientOptions || {}) },
    dimensions: { 
      width: parseInt(config.dimensions?.width) || 100, 
      height: parseInt(config.dimensions?.height) || 50 
    },
    columnsCount: parseInt(config.columnsCount) || 1,
    fontSize: parseInt(config.fontSize) || 14
  };
};

export default function ClientDashboard() {
  const { t, locale } = useI18n();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("trazabilidad");
  const [wasteCollections, setWasteCollections] = useState([]);
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);
  const [wasteForm, setWasteForm] = useState({ date: new Date().toISOString().slice(0, 10), personName: "", kilos: "" });
  const [editingWasteRecord, setEditingWasteRecord] = useState(null);


  const [recipes, setRecipes] = useState([]);
  const [elaborations, setElaborations] = useState([]);
  const [cleaningLogs, setCleaningLogs] = useState([]);
  const [waterMeasurements, setWaterMeasurements] = useState([]);
  const [cleaningZones, setCleaningZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingElaboration, setEditingElaboration] = useState(null);
  const [isReadOnlyElab, setIsReadOnlyElab] = useState(false);
  const [proportionMasterId, setProportionMasterId] = useState(null);
  const [isCleaningModalOpen, setIsCleaningModalOpen] = useState(false);
  const [editingCleaningLog, setEditingCleaningLog] = useState(null);
  const [tempRecords, setTempRecords] = useState([]);
  const [chambers, setChambers] = useState([]);
  const [isTempModalOpen, setIsTempModalOpen] = useState(false);
  const [editingTempRecord, setEditingTempRecord] = useState(null);
  const [goodsReceipts, setGoodsReceipts] = useState([]);
  const [isGoodsModalOpen, setIsGoodsModalOpen] = useState(false);
  const [isIaScanModalOpen, setIsIaScanModalOpen] = useState(false);
  const [isScannedInvoicesModalOpen, setIsScannedInvoicesModalOpen] = useState(false);
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);
  const [editingGoodsReceipt, setEditingGoodsReceipt] = useState(null);
  const [editingWaterMeasurement, setEditingWaterMeasurement] = useState(null);
  
  const [providers, setProviders] = useState([]);
  const [isProvidersModalOpen, setIsProvidersModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [providersForm, setProvidersForm] = useState({
    name: "", nif: "", rgs: "", phone: "", address: "", products: "", merchantTypes: []
  });

  const [isCleaningExportModalOpen, setIsCleaningExportModalOpen] = useState(false);
  const [cleaningExportDates, setCleaningExportDates] = useState({ from: "", to: "" });
  const [isTempExportModalOpen, setIsTempExportModalOpen] = useState(false);
  const [tempExportDates, setTempExportDates] = useState({ from: "", to: "" });
  const [viewingImage, setViewingImage] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [profile, setProfile] = useState(null);
  const [isRecipeOverlimitModalOpen, setIsRecipeOverlimitModalOpen] = useState(false);
  const isRecipeLimitExceeded = () => {
    if (!profile) return false;
    const limit = profile.plan ? profile.plan.recipesLimit : 3;
    if (limit === null) return false;
    return recipes.length > limit;
  };
  const [videoModal, setVideoModal] = useState({ isOpen: false, videoId: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [elabFilters, setElabFilters] = useState({
    lote: "",
    loteElab: "",
    startDate: "",
    endDate: "",
    recipeId: "all"
  });
  const [cleaningFilters, setCleaningFilters] = useState({ startDate: "", endDate: "" });
  const [tempFilters, setTempFilters] = useState({ startDate: "", endDate: "" });
  const [goodsFilters, setGoodsFilters] = useState({ startDate: "", endDate: "", merchantType: "", productName: "", providerName: "", lote: "", limit: "40" });
  const filteredGoodsReceipts = useMemo(() => {
    return goodsReceipts.filter(r => {
      if (goodsFilters.startDate && goodsFilters.endDate) {
        const date = new Date(r.date);
        const start = new Date(goodsFilters.startDate);
        const end = new Date(goodsFilters.endDate);
        end.setHours(23, 59, 59, 999);
        if (date < start || date > end) return false;
      }
      if (goodsFilters.merchantType && (!r.merchantTypes || !r.merchantTypes.includes(goodsFilters.merchantType))) return false;
      if (goodsFilters.productName && !r.productName.toLowerCase().includes(goodsFilters.productName.toLowerCase())) return false;
      if (goodsFilters.providerName && !(r.providerName || "").toLowerCase().includes(goodsFilters.providerName.toLowerCase())) return false;
      if (goodsFilters.lote && !(r.lote || "").toLowerCase().includes(goodsFilters.lote.toLowerCase())) return false;
      return true;
    });
  }, [goodsReceipts, goodsFilters]);
  const [providerMerchantTypeFilter, setProviderMerchantTypeFilter] = useState("");
  const [totalElabs, setTotalElabs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [recipeSearchTerm, setRecipeSearchTerm] = useState("");

  // Affiliate State
  const [affiliateData, setAffiliateData] = useState({
    isAffiliate: false,
    referralCode: "",
    referrals: [],
    payments: [],
    loading: true
  });
  const [isJoiningAffiliate, setIsJoiningAffiliate] = useState(false);
  const [acceptAffiliateTerms, setAcceptAffiliateTerms] = useState(false);


  // Management State
  const [isRecipeManageModalOpen, setIsRecipeManageModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipeForm, setRecipeForm] = useState({ 
    name: "", 
    ingredients: [{ name: "", amount: "", unit: "", loteMandatory: false, quantityMandatory: false }],
    expiryDays: 0,
    expiryType: "EXPIRATION",
    hasDryingRoom: false,
    elaborationInstructions: "",
    conservationInstructions: "",
    energyValue: "",
    fats: "",
    saturatedFats: "",
    carbohydrates: "",
    sugars: "",
    proteins: "",
    salt: "",
    allergens: []
  });
  
  const [isManageChambersModalOpen, setIsManageChambersModalOpen] = useState(false);
  const [isManageZonesModalOpen, setIsManageZonesModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [isTraceabilityReportModalOpen, setIsTraceabilityReportModalOpen] = useState(false);
  const [isGoodsReportModalOpen, setIsGoodsReportModalOpen] = useState(false);
  const [reportDates, setReportDates] = useState({ 
    from: new Date().toISOString().slice(0, 10), 
    to: new Date().toISOString().slice(0, 10) 
  });
  const [goodsReportDates, setGoodsReportDates] = useState({ 
    from: new Date().toISOString().slice(0, 10), 
    to: new Date().toISOString().slice(0, 10) 
  });
  
  // Trazabilidad Form State
  const [elaboracionForm, setElaboracionForm] = useState({
    titulo: "",
    personName: "",
    date: "",
    expirationDate: "",
    dryingRoomIn: "",
    dryingRoomOut: "",
    workshopTemp: "",
    preparationTime: "",
    quantityProduced: "",
    netWeight: "",
    unitPrice: "",
    extraInfo: "",
    ingredientes: {} // { ingredientId: { lote: "", cantidad: "" } }
  });

  // Cleaning Form State
  const [cleaningForm, setCleaningForm] = useState({
    personName: "",
    date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
    selectedZones: [], // Array of cleaningZoneId
    notes: ""
  });

  // Temperature Form State
  const [tempForm, setTempForm] = useState({
    date: new Date().toISOString().slice(0, 16),
    values: {}, // { chamberId: value }
    notes: ""
  });

  // Provider Receipts View State
  const [isProviderReceiptsModalOpen, setIsProviderReceiptsModalOpen] = useState(false);
  const [selectedProviderForReceipts, setSelectedProviderForReceipts] = useState(null);

  // Goods Receipt Form State
  const [goodsForm, setGoodsForm] = useState({
    providerName: "",
    providerId: null,
    productName: "",
    lote: "",
    invoiceNumber: "",
    quantity: "",
    date: new Date().toISOString().slice(0, 16),
    deliveryNoteImage: "",
    manufacturingTemp: "",
    endDate: "",
    typeAndOrigin: "",
    merchantTypes: [],
    relatedIngredients: [],
    relatedQuantities: {}
  });
  const [waterForm, setWaterForm] = useState({
    date: new Date().toISOString().slice(0, 16),
    samplingPoint: "",
    chlorine: "",
    ph: "",
    turbidity: false,
    odor: false,
    flavor: false,
    color: false,
    responsible: "",
    receiptImage: "",
    notes: ""
  });

  // Bulk Selection State
  const [selectedRecords, setSelectedRecords] = useState([]); // Array of IDs
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeletePhase, setBulkDeletePhase] = useState(1); // 1 or 2 (double confirm)

  // Report Modals State
  const [isWaterExportModalOpen, setIsWaterExportModalOpen] = useState(false);
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false);
  const [isIngredientCostsModalOpen, setIsIngredientCostsModalOpen] = useState(false);
  const [selectedElaborationForCosts, setSelectedElaborationForCosts] = useState(null);
  const [isManageMerchantTypesModalOpen, setIsManageMerchantTypesModalOpen] = useState(false);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [editingWorker, setEditingWorker] = useState(null);
  const [workerForm, setWorkerForm] = useState({
    name: '',
    email: '',
    password: '',
    permissions: {
      hasTraceability: false,
      hasCleaning: false,
      hasTemperatures: false,
      hasWater: false,
      hasGoods: false
    }
  });
  const [ingredientPrices, setIngredientPrices] = useState([]);
  const [waterReportDates, setWaterReportDates] = useState({ 
    from: new Date().toISOString().slice(0, 10), 
    to: new Date().toISOString().slice(0, 10) 
  });

  useEffect(() => {
    if (isIngredientCostsModalOpen) {
      fetchIngredientPrices();
      fetchWasteCollections();
    }
  }, [isIngredientCostsModalOpen]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchRecipes();
      fetchCleaningZones();
      fetchCleaningLogs();
      fetchChambers();
      fetchTempRecords();
      fetchWaterMeasurements();
      fetchProviders();
      fetchProfile();
    }
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const handler = setTimeout(() => {
      fetchGoodsReceipts(goodsFilters);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [status, goodsFilters]);

  useEffect(() => {
    // Clear selection when changing tabs
    setSelectedRecords([]);
    setBulkDeletePhase(1);
  }, [activeTab]);
  
  useEffect(() => {
    if (activeTab === "afiliados" && profile?.isAffiliate) {
      fetchAffiliateStats();
    }
  }, [activeTab, profile]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchElaborations();
    }
  }, [status, currentPage, itemsPerPage, elabFilters]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/client/profile");
      const data = await res.json();
      if (!data.error) {
        setProfile(data);
        if (data.isAffiliate) {
          setAffiliateData(prev => ({ 
            ...prev, 
            isAffiliate: true, 
            referralCode: data.referralCode || prev.referralCode 
          }));
          fetchAffiliateStats();
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchAffiliateStats = async () => {
    try {
      setAffiliateData(prev => ({ ...prev, loading: true }));
      const res = await fetch(`/api/client/affiliate/stats?t=${Date.now()}`);
      const data = await res.json();
      console.log("[AffiliateData]", data);
      if (!data.error) {
        setAffiliateData({
          isAffiliate: true,
          referralCode: data.referralCode,
          referrals: data.referrals || [],
          payments: data.payments || [],
          settlements: data.settlements || [],
          pendingCommission: data.pendingCommission || 0,
          totalGenerated: data.totalGenerated || 0,
          totalSettled: data.totalSettled || 0,
          loading: false
        });
      }
    } catch (error) {
      console.error("Error fetching affiliate stats:", error);
    } finally {
      setAffiliateData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleJoinAffiliate = async () => {
    if (!acceptAffiliateTerms) {
      alert(t('affiliate.accept_terms_error') || "Debes aceptar las condiciones");
      return;
    }

    setIsJoiningAffiliate(true);
    try {
      const res = await fetch("/api/client/affiliate/join", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(t('affiliate.welcome_alert') || "¡Bienvenido al programa de recomendación!");
        fetchProfile();
      } else {
        alert(data.error || t('alerts.request_error'));
      }
    } catch (error) {
      console.error("Error joining affiliate:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setIsJoiningAffiliate(false);
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
    if (!confirm(t('profile.cancel_confirm'))) return;
    
    try {
      const res = await fetch("/api/stripe/cancel", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(t('profile.cancel_success'));
        fetchProfile();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert(t('profile.cancel_error'));
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
        quantityMandatory: !!ing.quantityMandatory,
        expandItem: !!ing.expandItem,
        expandedText: ing.expandedText || ""
      })),
      expiryDays: recipe.expiryDays || 0,
      expiryType: recipe.expiryType || "EXPIRATION",
      hasDryingRoom: !!recipe.hasDryingRoom,
      elaborationInstructions: recipe.elaborationInstructions || "",
      conservationInstructions: recipe.conservationInstructions || "",
      hasBarcode: !!recipe.hasBarcode,
      barcode: recipe.barcode || "",
      energyValue: recipe.energyValue || "",
      fats: recipe.fats || "",
      saturatedFats: recipe.saturatedFats || "",
      carbohydrates: recipe.carbohydrates || "",
      sugars: recipe.sugars || "",
      proteins: recipe.proteins || "",
      salt: recipe.salt || "",
      allergens: recipe.allergens || []
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

  const handleDuplicateRecipe = async (recipe) => {
    if (!confirm(t('alerts.duplicate_confirm_recipe') || '¿Seguro que quieres duplicar esta receta?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/client/recipes/manage/${recipe.id}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok) {
        alert(t('alerts.recipe_duplicated') || 'Receta duplicada correctamente');
        fetchRecipes();
      } else {
        alert(data.error || t('alerts.duplicate_error') || 'Error al duplicar la receta');
      }
    } catch (error) {
      console.error("Error duplicating recipe:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
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
      ingredients: [...recipeForm.ingredients, { name: "", amount: "", unit: "", loteMandatory: false, quantityMandatory: false, expandItem: false, expandedText: "" }]
    });
  };

  const removeIngredient = (index) => {
    const newIngs = [...recipeForm.ingredients];
    newIngs.splice(index, 1);
    setRecipeForm({ ...recipeForm, ingredients: newIngs });
  };

  const handleRecipeIngredientChange = (index, field, value) => {
    setRecipeForm(prev => {
      const newIngs = prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      );
      return { ...prev, ingredients: newIngs };
    });
  };

  const fetchElaborations = async () => {
    try {
      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        lote: elabFilters.lote,
        loteElab: elabFilters.loteElab,
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

    const fetchWasteCollections = async () => {
    try {
      const res = await fetch("/api/waste-collections");
      const data = await res.json();
      if (data.success) {
        setWasteCollections(data.collections);
      }
    } catch (error) {
      console.error("Error fetching waste collections:", error);
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

  const fetchIngredientPrices = async () => {
    try {
      const res = await fetch("/api/ingredient-prices");
      const data = await res.json();
      if (!data.error) setIngredientPrices(data);
    } catch (error) {
      console.error("Error fetching ingredient prices:", error);
    }
  };

  const handleOpenRecipeCostModal = (elaboration) => {
    if (!elaboration) return;
    setSelectedElaborationForCosts(elaboration);
    setIsIngredientCostsModalOpen(true);
    fetchIngredientPrices();
  };

  const handleSaveIngredientPrices = async (pricesToSave) => {
    try {
      setLoading(true);
      const res = await fetch("/api/ingredient-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: pricesToSave,
          recipeId: selectedElaborationForCosts?.recipeId || selectedElaborationForCosts?.recipe?.id || null,
          elaborationId: selectedElaborationForCosts?.id || null
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(t('alerts.prices_saved') || "Precios guardados correctamente");
        setIsIngredientCostsModalOpen(false);
        setSelectedElaborationForCosts(null);
        fetchIngredientPrices();
        fetchElaborations();
      } else {
        alert(data.error || t('alerts.request_error'));
      }
    } catch (error) {
      console.error("Error saving ingredient prices:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'trabajadores' && session?.user?.role === "CLIENT") {
      fetchWorkers();
    }
  }, [activeTab, session]);

  const fetchWorkers = async () => {
    try {
      const res = await fetch('/api/workers');
      const data = await res.json();
      setWorkers(data);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/workers', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workerForm)
      });
      const data = await res.json();
      if (res.ok) {
        setIsWorkerModalOpen(false);
        fetchWorkers();
        setWorkerForm({
          name: '', email: '', password: '', 
          permissions: { hasTraceability: false, hasCleaning: false, hasTemperatures: false, hasWater: false, hasGoods: false }
        });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error creating worker:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWorker = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/workers/${editingWorker.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workerForm.name,
          password: workerForm.password || undefined,
          permissions: workerForm.permissions
        })
      });
      const data = await res.json();
      if (res.ok) {
        setIsWorkerModalOpen(false);
        setEditingWorker(null);
        fetchWorkers();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error updating worker:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorker = async (id) => {
    if (!confirm(t('alerts.delete_confirm_worker') || "¿Seguro que quieres eliminar este trabajador?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/workers/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchWorkers();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Error deleting worker:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoodsReceipts = async (filters = null) => {
    try {
      let url = "/api/goods-receipts";
      if (filters) {
        const cleanFilters = {};
        Object.keys(filters).forEach(key => {
          if (filters[key]) {
            cleanFilters[key] = filters[key];
          }
        });
        if (Object.keys(cleanFilters).length > 0) {
          const query = new URLSearchParams(cleanFilters).toString();
          url += `?${query}`;
        }
      }
      const res = await fetch(url);
      const data = await res.json();
      if (!data.error) setGoodsReceipts(data);
    } catch (error) {
      console.error("Error fetching goods receipts:", error);
    }
  };

  const fetchWaterMeasurements = async () => {
    try {
      const res = await fetch("/api/water-measurements");
      const data = await res.json();
      if (!data.error) setWaterMeasurements(data);
    } catch (error) {
      console.error("Error fetching water:", error);
    }
  };

  const fetchProviders = async () => {
    try {
      const res = await fetch("/api/client/providers");
      const data = await res.json();
      if (!data.error) setProviders(data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  const handleSubmitProvider = async (e) => {
    e.preventDefault();
    if (!providersForm.name) {
      alert(t('alerts.name_required') || "El nombre es obligatorio");
      return;
    }

    setLoading(true);
    try {
      const url = editingProvider ? `/api/client/providers/${editingProvider.id}` : "/api/client/providers";
      const method = editingProvider ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(providersForm)
      });
      const data = await res.json();
      if (data.success) {
        alert(editingProvider ? t('alerts.provider_updated') : t('alerts.provider_saved'));
        setIsProvidersModalOpen(false);
        setEditingProvider(null);
        setProvidersForm({ name: "", nif: "", rgs: "", phone: "", address: "", products: "", merchantTypes: [] });
        fetchProviders();
      } else {
        alert(data.error || t('alerts.request_error'));
      }
    } catch (error) {
      console.error("Error saving provider:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEditProvider = (provider) => {
    setEditingProvider(provider);
    setProvidersForm({
      name: provider.name,
      nif: provider.nif || "",
      rgs: provider.rgs || "",
      phone: provider.phone || "",
      address: provider.address || "",
      products: provider.products || "",
      merchantTypes: provider.merchantTypes || []
    });
    setIsProvidersModalOpen(true);
  };

  const handleDeleteProvider = async (id) => {
    if (!confirm(t('alerts.delete_confirm_provider') || "¿Estás seguro de eliminar este proveedor?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/client/providers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchProviders();
      } else {
        alert(data.error || t('alerts.delete_error'));
      }
    } catch (error) {
      console.error("Error deleting provider:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewProviderReceipts = (provider) => {
    setSelectedProviderForReceipts(provider);
    setIsProviderReceiptsModalOpen(true);
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
    if (isRecipeLimitExceeded()) {
      setIsRecipeOverlimitModalOpen(true);
      return;
    }
    if (!goodsForm.productName || !goodsForm.date) {
      alert(t('alerts.product_date_required'));
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
          providerId: null,
          productName: "",
          lote: "",
          invoiceNumber: "",
          quantity: "",
          date: new Date().toISOString().slice(0, 16),
          deliveryNoteImage: "",
          manufacturingTemp: "",
          endDate: "",
          typeAndOrigin: "",
          merchantTypes: [],
          relatedIngredients: [],
          relatedQuantities: {}
        });
        fetchGoodsReceipts(goodsFilters);
      } else {
        const errorData = await res.json().catch(() => ({}));
        let errorMsg = errorData.error || t('alerts.request_error');
        
        if (res.status === 413) {
          errorMsg = t('alerts.file_too_large');
        } else if (errorData.details) {
          errorMsg += `\n${t('common.technical_details')}${errorData.details}`;
        }
        
        alert(errorMsg);
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
      deliveryNoteImage: receipt.deliveryNoteImage || "",
      manufacturingTemp: receipt.manufacturingTemp || "",
      endDate: receipt.endDate || "",
      typeAndOrigin: receipt.typeAndOrigin || "",
      merchantTypes: receipt.merchantTypes || [],
      relatedIngredients: receipt.relatedIngredients || [],
      relatedQuantities: receipt.relatedQuantities || {}
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
        fetchGoodsReceipts(goodsFilters);
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

  const handleWaterImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWaterForm({ ...waterForm, receiptImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitWater = async (e) => {
    e.preventDefault();
    if (isRecipeLimitExceeded()) {
      setIsRecipeOverlimitModalOpen(true);
      return;
    }
    if (!waterForm.date || waterForm.chlorine === "") {
      alert(t('alerts.required_fields') || "Fecha y Cloro son obligatorios");
      return;
    }

    setLoading(true);
    try {
      const url = "/api/water-measurements";
      const method = editingWaterMeasurement ? "PATCH" : "POST";
      const body = editingWaterMeasurement ? { ...waterForm, id: editingWaterMeasurement.id } : waterForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        alert(editingWaterMeasurement ? t('alerts.water_updated') : t('alerts.water_saved'));
        setIsWaterModalOpen(false);
        setEditingWaterMeasurement(null);
        setWaterForm({
          date: new Date().toISOString().slice(0, 16),
          samplingPoint: "",
          chlorine: "",
          ph: "",
          turbidity: false,
          odor: false,
          flavor: false,
          color: false,
          responsible: "",
          receiptImage: "",
          notes: ""
        });
        fetchWaterMeasurements();
      } else {
        const data = await res.json();
        alert(data.error || t('alerts.request_error'));
      }
    } catch (error) {
      console.error("Error saving water measurement:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEditWater = (measurement) => {
    setEditingWaterMeasurement(measurement);
    setWaterForm({
      date: new Date(measurement.date).toISOString().slice(0, 16),
      samplingPoint: measurement.samplingPoint || "",
      chlorine: measurement.chlorine || "",
      ph: measurement.ph || "",
      turbidity: !!measurement.turbidity,
      odor: !!measurement.odor,
      flavor: !!measurement.flavor,
      color: !!measurement.color,
      responsible: measurement.responsible || "",
      receiptImage: measurement.receiptImage || "",
      notes: measurement.notes || ""
    });
    setIsWaterModalOpen(true);
  };

  const handleDeleteWater = async (id) => {
    if (!confirm(t('alerts.delete_confirm') || '¿Seguro que quieres eliminar este registro?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/water-measurements?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchWaterMeasurements();
      } else {
        alert(data.error || t('alerts.delete_error'));
      }
    } catch (error) {
      console.error("Error deleting water measurement:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRecipe = async (recipe) => {
    if (isRecipeLimitExceeded()) {
      setIsRecipeOverlimitModalOpen(true);
      return;
    }
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
    setIsReadOnlyElab(false);
    
    // Inicializar formulario con valores por defecto buscando en la lista local cargada
    const initialIngredientes = {};
    recipe.ingredients.forEach(ing => {
      const matchingReceipt = goodsReceipts.find(receipt => 
        receipt.lote && 
        receipt.relatedIngredients && 
        receipt.relatedIngredients.some(ri => ri.trim().toLowerCase() === ing.name.trim().toLowerCase())
      );
      const defaultLote = matchingReceipt ? matchingReceipt.lote : "";
      initialIngredientes[ing.id] = { lote: defaultLote, cantidad: ing.amount };
    });

    setElaboracionForm({
      recipeId: recipe.id,
      titulo: `${dateStr}${initials}`,
      personName: lastPerson,
      date: currentDateTime,
      expirationDate: expirationDate,
      quantityProduced: "",
      netWeight: "",
      unitPrice: "",
      workshopTemp: "",
      preparationTime: "",
      dryingRoomIn: "",
      dryingRoomOut: "",
      extraInfo: "",
      ingredientes: initialIngredientes
    });

    // Fetch all last lotes from goods receipts asynchronously to catch older records from DB
    try {
      const res = await fetch("/api/client/last-lotes-goods");
      if (res.ok) {
        const lastLotesMap = await res.json();
        setElaboracionForm(prev => {
          if (prev.recipeId !== recipe.id) return prev;
          const updatedIngredientes = { ...prev.ingredientes };
          let changed = false;
          recipe.ingredients.forEach(ing => {
            const normalizedName = ing.name.trim().toLowerCase();
            const fetchedLote = lastLotesMap[normalizedName];
            if (fetchedLote && updatedIngredientes[ing.id] && updatedIngredientes[ing.id].lote !== fetchedLote) {
              updatedIngredientes[ing.id] = {
                ...updatedIngredientes[ing.id],
                lote: fetchedLote
              };
              changed = true;
            }
          });
          if (changed) {
            return {
              ...prev,
              ingredientes: updatedIngredientes
            };
          }
          return prev;
        });
      }
    } catch (e) {
      console.error("Error fetching last lotes from goods receipts:", e);
    }
  };

  const handleEditElaboration = (elab) => {
    setEditingElaboration(elab);
    setSelectedRecipe(elab.recipe);
    setProportionMasterId(null);
    setIsReadOnlyElab(false);
    
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
      recipeId: elab.recipe.id,
      titulo: elab.name,
      personName: elab.personName || "",
      date: elab.date ? new Date(elab.date).toISOString().slice(0, 16) : "",
      expirationDate: elab.expirationDate ? new Date(elab.expirationDate).toISOString().slice(0, 10) : "",
      dryingRoomIn: elab.dryingRoomIn || "",
      dryingRoomOut: elab.dryingRoomOut || "",
      workshopTemp: elab.workshopTemp || "",
      preparationTime: elab.preparationTime || "",
      quantityProduced: elab.quantityProduced || "",
      netWeight: elab.netWeight || "",
      unitPrice: elab.unitPrice || "",
      extraInfo: elab.extraInfo || "",
      ingredientes: initialIngredientes
    });
  };

  const handleViewElaborationOnly = (elab) => {
    handleEditElaboration(elab);
    setIsReadOnlyElab(true);
  };

  const handleExportElaborationPDF = (elab) => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(t('dashboard.traceability_report') || "INFORME DE TRAZABILIDAD", 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`${t('dashboard.lote') || "Lote"}: ${elab.name || "N/A"}`, 105, 30, { align: 'center' });
      
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);

      // Datos de la elaboración
      let currentY = 50;
      doc.setFont("helvetica", "bold");
      doc.text((t('dashboard.elaboration_recipe_header') || "Receta") + ":", 20, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(elab.recipe?.name || "N/A", 90, currentY);
      currentY += 7;

      doc.setFont("helvetica", "bold");
      doc.text((t('dashboard.lote') || "Lote") + ":", 20, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(elab.name || "N/A", 90, currentY);
      currentY += 7;

      doc.setFont("helvetica", "bold");
      doc.text((t('traceability_form.label_made_by') || "Realizado por:") + ":", 20, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(elab.personName || "N/A", 90, currentY);
      currentY += 7;

      doc.setFont("helvetica", "bold");
      doc.text((t('traceability_form.label_date') || "Fecha") + ":", 20, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(formatDateTimeDDMMYYYY(elab.date), 90, currentY);
      currentY += 7;

      const expLabel = elab.recipe?.expiryType === "BEST_BEFORE" 
        ? t('traceability_form.label_best_before') 
        : t('traceability_form.label_expiration');
      doc.setFont("helvetica", "bold");
      doc.text(expLabel + ":", 20, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(formatDateDDMMYYYY(elab.expirationDate), 90, currentY);
      currentY += 7;

      // Alérgenos
      const allergensList = (elab.recipe?.allergens || [])
        .map(a => t(`allergens.list.${a}`))
        .join(", ");
      
      doc.setFont("helvetica", "bold");
      doc.text((t('allergens.title') || "Alérgenos") + ":", 20, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(allergensList || t('modals.none') || "Ninguno", 90, currentY);
      currentY += 7;

      if (elab.workshopTemp) {
        doc.setFont("helvetica", "bold");
        doc.text((t('traceability_form.workshop_temp') || "Temperatura del obrador") + ":", 20, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(elab.workshopTemp, 90, currentY);
        currentY += 7;
      }

      if (elab.dryingRoomIn) {
        doc.setFont("helvetica", "bold");
        doc.text((t('traceability_form.label_drying_in') || "Entrada secadero") + ":", 20, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(elab.dryingRoomIn, 90, currentY);
        currentY += 7;
      }

      if (elab.dryingRoomOut) {
        doc.setFont("helvetica", "bold");
        doc.text((t('traceability_form.label_drying_out') || "Salida secadero") + ":", 20, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(elab.dryingRoomOut, 90, currentY);
        currentY += 7;
      }

      currentY += 10; // Extra spacing

      // Tabla de ingredientes
      doc.setFont("helvetica", "bold");
      doc.text((t('modals.ingredients') || "Ingredientes") + ":", 20, currentY);
      
      const tableBody = elab.ingredients.map(ing => [
        ing.name,
        ing.lote || "N/A",
        `${ing.realAmount} ${ing.unit}`
      ]);

      autoTable(doc, {
        startY: currentY + 5,
        head: [[t('modals.ing_name') || "Nombre del ingrediente", t('traceability_form.lot') || "Lote", t('traceability_form.real_amount') || "Cantidad real"]],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillStyle: '#3f6212', textColor: [255, 255, 255] },
        margin: { left: 20, right: 20 },
        didDrawPage: (data) => {
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text("Informe generado por Quicktrace. Más información en https://quicktrace.es", 20, doc.internal.pageSize.height - 12);
        }
      });

      // Pie de página
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("Informe generado por Quicktrace. Más información en https://quicktrace.es", 20, doc.internal.pageSize.height - 12);

      doc.save(`Elaboracion_${elab.name || elab.id}.pdf`);
    } catch (error) {
      console.error("Error generating single elaboration PDF:", error);
      alert(t('alerts.request_error') || "Error al generar el PDF");
    }
  };

  const handleAutoFillLotesFromGoods = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/client/last-lotes-goods");
      if (res.ok) {
        const lastLotesMap = await res.json();
        const updatedIngredientes = { ...elaboracionForm.ingredientes };
        let count = 0;
        
        selectedRecipe.ingredients.forEach(ing => {
          const normalized = ing.name.trim().toLowerCase();
          const fetchedLote = lastLotesMap[normalized];
          if (fetchedLote) {
            updatedIngredientes[ing.id] = {
              ...updatedIngredientes[ing.id],
              lote: fetchedLote
            };
            count++;
          }
        });
        
        setElaboracionForm(prev => ({
          ...prev,
          ingredientes: updatedIngredientes
        }));
        
        if (count === 0) {
          alert(t('alerts.no_linked_goods_receipts'));
        } else {
          alert(t('alerts.auto_filled_lotes_from_goods').replace('{count}', count));
        }
      } else {
        alert(t('alerts.last_lotes_error'));
      }
    } catch (error) {
      console.error("Error auto-filling lotes from goods receipts:", error);
      alert(t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
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

  const handleUpdateProfile = async (updates) => {
    setLoading(true);
    try {
      const res = await fetch("/api/client/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!data.error) {
        setProfile(data);
        if (updates.currency) {
          alert(t('business_config.save_success'));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const generateCleaningReportPDF = async (dates) => {
    try {
      const { from, to } = dates;
      const res = await fetch(`/api/cleaning-logs?startDate=${from}&endDate=${to}`);
      const logs = await res.json();
      
      if (logs.length === 0) {
        alert(t('dashboard.no_records_range') || "No hay registros en este rango");
        return;
      }

      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(66, 98, 22); // corp-green
      doc.text(t('dashboard.cleaning').toUpperCase(), 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`${t('common.from')}: ${formatDateDDMMYYYY(from)}  ${t('common.to')}: ${formatDateDDMMYYYY(to)}`, 14, 30);
      doc.text(`${profile?.razonSocial || ''} - ${profile?.nif || ''}`, 14, 35);
      
      // Table
      const tableColumn = [
        t('dashboard.datetime') || "Fecha y Hora",
        t('dashboard.person') || "Persona",
        t('dashboard.zones_cleaned') || "Zonas Limpiadas",
        t('common.notes_corrective') || "Notas / Medidas correctivas"
      ];
      
      const tableRows = logs.map(log => [
        formatDateTimeDDMMYYYY(log.date),
        log.personName,
        log.zones.map(z => z.cleaningZone.name).join(', '),
        log.notes || "-"
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'striped',
        headStyles: { fillColor: [66, 98, 22], textColor: [255, 255, 255] },
        styles: { fontSize: 9, cellPadding: 3 },
        alternateRowStyles: { fillColor: [245, 247, 240] },
        didDrawPage: (data) => {
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text("Informe generado por Quicktrace. Más información en https://quicktrace.es", 14, doc.internal.pageSize.height - 10);
        }
      });

      doc.save(`Informe_Limpieza_${from}_${to}.pdf`);
      setIsCleaningExportModalOpen(false);
    } catch (error) {
      console.error("Error generating cleaning report:", error);
      alert(t('alerts.request_error'));
    }
  };

  const generateTemperatureReportPDF = async (dates) => {
    try {
      const { from, to } = dates;
      const res = await fetch(`/api/temperature-records?startDate=${from}&endDate=${to}`);
      const records = await res.json();
      
      if (records.length === 0) {
        alert(t('dashboard.no_records_range') || "No hay registros en este rango");
        return;
      }

      // Get all unique chambers present in these records for table columns
      const chamberMap = new Map();
      records.forEach(record => {
        record.values.forEach(val => {
          if (!chamberMap.has(val.chamberId)) {
            chamberMap.set(val.chamberId, val.chamber.name);
          }
        });
      });
      const sortedChamberIds = Array.from(chamberMap.keys()).sort((a, b) => a - b);

      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(66, 98, 22);
      doc.text(t('dashboard.temp_consultation').toUpperCase(), 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`${t('common.from')}: ${formatDateDDMMYYYY(from)}  ${t('common.to')}: ${formatDateDDMMYYYY(to)}`, 14, 30);
      doc.text(`${profile?.razonSocial || ''} - ${profile?.nif || ''}`, 14, 35);
      
      // Table Columns
      const tableColumn = [t('dashboard.datetime'), ...sortedChamberIds.map(id => chamberMap.get(id))];
      
      // Table Rows
      const tableRows = records.map(record => {
        const row = [formatDateTimeDDMMYYYY(record.date)];
        sortedChamberIds.forEach(chamberId => {
          const val = record.values.find(v => v.chamberId === chamberId);
          row.push(val ? `${val.value} ºC` : '-');
        });
        return row;
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'striped',
        headStyles: { fillColor: [66, 98, 22], textColor: [255, 255, 255] },
        styles: { fontSize: 8, cellPadding: 2 },
        alternateRowStyles: { fillColor: [245, 247, 240] },
        didDrawPage: (data) => {
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text("Informe generado por Quicktrace. Más información en https://quicktrace.es", 14, doc.internal.pageSize.height - 10);
        }
      });

      doc.save(`Informe_Temperaturas_${from}_${to}.pdf`);
      setIsTempExportModalOpen(false);
    } catch (error) {
      console.error("Error generating temperature report:", error);
      alert(t('alerts.request_error'));
    }
  };

  const generateWaterReportPDF = async (dates) => {
    try {
      const { from, to } = dates;
      const res = await fetch(`/api/water-measurements?startDate=${from}&endDate=${to}`);
      const measurements = await res.json();
      
      if (measurements.length === 0) {
        alert(t('dashboard.no_records_range') || "No hay registros en este rango");
        return;
      }

      const doc = new jsPDF();
      
      for (let i = 0; i < measurements.length; i++) {
        const m = measurements[i];
        if (i > 0) doc.addPage();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(66, 98, 22);
        doc.text(t('dashboard.water_report') || "REGISTRO DE CONTROL DE AGUAS", 14, 22);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`${profile?.razonSocial || ''} - ${profile?.nif || ''}`, 14, 30);
        doc.text(`${t('common.date')}: ${formatDateTimeDDMMYYYY(m.date)}`, 14, 38);
        
        // Content
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont(undefined, 'bold');
        doc.text(`${t('water.sampling_point')}:`, 14, 48);
        doc.setFont(undefined, 'normal');
        doc.text(m.samplingPoint || '-', 60, 48);

        doc.setFont(undefined, 'bold');
        doc.text(`${t('water.chlorine')}:`, 14, 56);
        doc.setFont(undefined, 'normal');
        doc.text(`${m.chlorine} mg/l`, 60, 56);

        doc.setFont(undefined, 'bold');
        doc.text(`${t('water.ph') || "pH"}:`, 14, 64);
        doc.setFont(undefined, 'normal');
        doc.text(m.ph || '-', 60, 64);

        // Checks
        doc.setFont(undefined, 'bold');
        doc.text(`${t('water.table_checks')}:`, 14, 72);
        doc.setFont(undefined, 'normal');
        
        // Format checks for the document
        const checkO = `${t('water.odor')}: ${m.odor ? t('water.yes') : t('water.no')}`;
        const checkT = `${t('water.turbidity')}: ${m.turbidity ? t('water.yes') : t('water.no')}`;
        const checkF = `${t('water.flavor')}: ${m.flavor ? t('water.yes') : t('water.no')}`;
        const checkC = `${t('water.color')}: ${m.color ? t('water.yes') : t('water.no')}`;
        
        doc.text(`${checkT}  |  ${checkO}`, 60, 72);
        doc.text(`${checkF}  |  ${checkC}`, 60, 78);

        doc.setFont(undefined, 'bold');
        doc.text(`${t('water.responsible')}:`, 14, 88);
        doc.setFont(undefined, 'normal');
        doc.text(m.responsible || '-', 60, 88);

        // Image
        if (m.receiptImage) {
          doc.setFont(undefined, 'bold');
          doc.text(`${t('water.receipt')}:`, 14, 100);
          try {
            // We assume receiptImage is a base64 or a valid URL accessible to jsPDF
            doc.addImage(m.receiptImage, 'JPEG', 14, 106, 180, 135);
          } catch (e) {
            console.error("Error adding image to PDF:", e);
          }
        }

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Informe generado por Quicktrace. Más información en https://quicktrace.es", 14, doc.internal.pageSize.height - 10);
        doc.text(`Página ${i + 1} de ${measurements.length}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }

      doc.save(`Informe_Control_Agua_${from}_${to}.pdf`);
      setIsWaterExportModalOpen(false);
    } catch (error) {
      console.error("Error generating water report:", error);
      alert(t('alerts.request_error'));
    }
  };

  const generateProvidersPDF = () => {
    try {
      if (providers.length === 0) {
        alert(t('dashboard.no_data') || "No hay datos disponibles");
        return;
      }

      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(66, 98, 22);
      doc.text(t('dashboard.provider_list_report') || "LISTADO DE PROVEEDORES", 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`${profile?.razonSocial || ''} - ${profile?.nif || ''}`, 14, 30);
      doc.text(`${t('common.date')}: ${new Date().toLocaleDateString()}`, 14, 35);
      
      // Table
      const tableColumn = [
        t('modals.provider_name'),
        t('modals.provider_nif'),
        t('modals.provider_rgs'),
        t('modals.provider_phone'),
        t('modals.provider_address'),
        t('modals.provider_products')
      ];
      
      const tableRows = providers.map(p => [
        p.name,
        p.nif || '-',
        p.rgs || '-',
        p.phone || '-',
        p.address || '-',
        p.products || '-'
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'striped',
        headStyles: { fillColor: [66, 98, 22], textColor: [255, 255, 255] },
        styles: { fontSize: 8, cellPadding: 2 },
        alternateRowStyles: { fillColor: [245, 247, 240] },
        didDrawPage: (data) => {
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text("Informe generado por Quicktrace. Más información en https://quicktrace.es", 14, doc.internal.pageSize.height - 10);
        }
      });

      doc.save(`Listado_Proveedores_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Error generating providers report:", error);
      alert(t('alerts.request_error'));
    }
  };

  const generateLabelPDF = (elaboration) => {
    const config = mergeLabelConfig(profile?.labelConfig);
    
    let storedWidth = parseInt(config.dimensions?.width);
    let storedHeight = parseInt(config.dimensions?.height);
    
    // Legacy conversion (if users had 10cm saved instead of 100mm)
    if (storedWidth && storedWidth < 30) storedWidth *= 10; 
    if (storedHeight && storedHeight < 30) storedHeight *= 10;

    const docWidthMM = storedWidth || 100;
    const docHeightMM = storedHeight || 50;

    console.log('--- GENERATING PDF ---');
    console.log('Configured Dimensions (mm):', docWidthMM, 'x', docHeightMM);
    console.log('Orientation:', (docWidthMM > docHeightMM ? 'landscape' : 'portrait'));

    const doc = new jsPDF({
      orientation: docWidthMM > docHeightMM ? 'l' : 'p',
      unit: 'mm',
      format: [docWidthMM, docHeightMM]
    });

    const fontSize = config.fontSize || 14;
    const mmFactor = 0.3528; // Constant to convert points to mm
    const lineHeightMM = (fontSize + 2) * mmFactor;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(0, 0, 0);

    let y = 10;
    const margin = 5; // mm
    const colGap = 5; // mm gap between columns
    
    if (config.headerImage) {
      try {
        const imgProps = doc.getImageProperties(config.headerImage);
        const imgHeightMM = (imgProps.height * docWidthMM) / imgProps.width;
        let fileType = 'PNG';
        if (config.headerImage.startsWith('data:image/jpeg') || config.headerImage.startsWith('data:image/jpg')) {
          fileType = 'JPEG';
        }
        doc.addImage(config.headerImage, fileType, 0, 0, docWidthMM, imgHeightMM);
        y = imgHeightMM + 5;
      } catch (e) {
        console.error("Error drawing header image", e);
      }
    }
    
    // Precise column calculation
    const isTwoCols = config.columnsCount === 2;
    const availableWidth = docWidthMM - (margin * 2);
    const columnWidth = isTwoCols 
      ? (availableWidth - colGap) / 2 
      : availableWidth;
    // Calculate midpoint for horizontal layouts
    const horizontalMidpoint = docWidthMM / 2;

    const renderElement = (elKey, startX, currentY) => {
      let initialY = currentY;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(0, 0, 0);

      switch (elKey) {
        case 'recipeName':
          doc.setFont("helvetica", "bold");
          doc.setFontSize(fontSize + 2); 
          const nameLines = doc.splitTextToSize(elaboration.recipe.name, columnWidth);
          doc.text(nameLines, startX, currentY);
          currentY += (nameLines.length * lineHeightMM);
          break;
        case 'lote':
          doc.setFont("helvetica", "bold");
          doc.text(`${t('dashboard.lote')}:`, startX, currentY);
          currentY += lineHeightMM;
          doc.setFont("helvetica", "normal");
          doc.text(elaboration.name, startX, currentY);
          currentY += lineHeightMM;
          break;
        case 'madeBy':
          if (elaboration.personName) {
            let personLabel = t('traceability_form.label_made_by');
            if (!personLabel.endsWith(':')) personLabel += ':';
            doc.setFont("helvetica", "bold");
            doc.text(personLabel, startX, currentY);
            currentY += lineHeightMM;
            doc.setFont("helvetica", "normal");
            doc.text(elaboration.personName, startX, currentY);
            currentY += lineHeightMM;
          }
          break;
        case 'elaborationDate':
          doc.setFont("helvetica", "bold");
          doc.text(`${t('traceability_form.label_date')}:`, startX, currentY);
          currentY += lineHeightMM;
          doc.setFont("helvetica", "normal");
          const dateStr = formatDateTimeDDMMYYYY(elaboration.date);
          doc.text(dateStr, startX, currentY);
          currentY += lineHeightMM;
          break;
        case 'expirationDate':
          if (elaboration.expirationDate) {
            const expLabel = elaboration.recipe.expiryType === "BEST_BEFORE" 
              ? t('traceability_form.label_best_before') 
              : t('traceability_form.label_expiration');
            doc.setFont("helvetica", "bold");
            doc.text(`${expLabel}:`, startX, currentY);
            currentY += lineHeightMM;
            doc.setFont("helvetica", "normal");
            const expStr = formatDateDDMMYYYY(elaboration.expirationDate);
            doc.text(expStr, startX, currentY);
            currentY += lineHeightMM;
          }
          break;
        case 'netWeight':
          if (elaboration.netWeight) {
            doc.setFont("helvetica", "bold");
            doc.text(`${t('traceability_form.label_net_weight') || "Peso neto"}:`, startX, currentY);
            currentY += lineHeightMM;
            doc.setFont("helvetica", "normal");
            doc.text(elaboration.netWeight, startX, currentY);
            currentY += lineHeightMM;
          }
          break;
        case 'unitPrice':
          if (elaboration.unitPrice) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(fontSize + 4);
            const unitPriceLabel = t('modals.labels_elements.unitPrice');
            const priceStr = formatPrice(elaboration.unitPrice, profile?.currency || "EUR", locale);
            doc.text(`${priceStr}`, startX, currentY);
            currentY += ((fontSize + 4 + 2) * mmFactor);
            doc.setFontSize(fontSize);
            doc.setFont("helvetica", "normal");
          }
          break;
        case 'elaborationInstructions':
          if (elaboration.recipe.elaborationInstructions) {
            doc.setFont("helvetica", "bold");
            doc.text("Elaboración:", startX, currentY);
            currentY += lineHeightMM;
            doc.setFont("helvetica", "normal");
            const splitText = doc.splitTextToSize(elaboration.recipe.elaborationInstructions, columnWidth);
            doc.text(splitText, startX, currentY);
            currentY += (splitText.length * lineHeightMM);
          }
          break;
        case 'conservationInstructions':
          if (elaboration.recipe.conservationInstructions) {
            doc.setFont("helvetica", "bold");
            doc.text("Conservación:", startX, currentY);
            currentY += lineHeightMM;
            doc.setFont("helvetica", "normal");
            const splitText = doc.splitTextToSize(elaboration.recipe.conservationInstructions, columnWidth);
            doc.text(splitText, startX, currentY);
            currentY += (splitText.length * lineHeightMM);
          }
          break;
        case 'allergens':
          if (elaboration.recipe.allergens && elaboration.recipe.allergens.length > 0) {
            const allergensList = elaboration.recipe.allergens.map(a => t(`allergens.list.${a}`) || a).join(', ');
            const titleTxt = `${t('allergens.prefix_label') || "Alérgenos: "}${allergensList}`;
            doc.setFont("helvetica", "bold");
            const lines = doc.splitTextToSize(titleTxt, columnWidth);
            doc.text(lines, startX, currentY);
            currentY += (lines.length * lineHeightMM);
          }
          break;
        case 'nutritionalTable':
          const nInfo = elaboration.recipe;
          if (nInfo.energyValue || nInfo.fats || nInfo.carbohydrates || nInfo.proteins || nInfo.salt) {
            currentY += 2;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(Math.max(2, fontSize - 2));
            const titleTxt = doc.splitTextToSize(t('traceability_form.label_nutritional_title') || "Información nutricional\n(Valores medios por 100g)", columnWidth - 2);
            doc.setDrawColor(0);
            doc.setLineWidth(0.3);
            const titleHeight = (titleTxt.length * lineHeightMM) + 2;
            doc.rect(startX, currentY, columnWidth, titleHeight);
            doc.text(titleTxt, startX + 1, currentY + lineHeightMM);
            currentY += titleHeight;
            doc.setFont("helvetica", "normal");
            const drawRow = (left, right) => {
              const linesLeft = doc.splitTextToSize(left, (columnWidth * 0.55) - 2);
              const linesRight = doc.splitTextToSize(right, (columnWidth * 0.45) - 2);
              const mh = Math.max(linesLeft.length, linesRight.length);
              const rowHeight = (mh * lineHeightMM) + 2;
              doc.setDrawColor(0);
              doc.setLineWidth(0.3);
              doc.rect(startX, currentY, columnWidth * 0.55, rowHeight);
              doc.rect(startX + (columnWidth * 0.55), currentY, columnWidth * 0.45, rowHeight);
              doc.text(linesLeft, startX + 1, currentY + lineHeightMM);
              doc.text(linesRight, startX + (columnWidth * 0.55) + 1, currentY + lineHeightMM);
              currentY += rowHeight;
            };
            drawRow(t('traceability_form.label_energy') || "Valor\nenergético", nInfo.energyValue || "");
            drawRow(t('traceability_form.label_fats') || "Grasas\nde las cuales saturadas", (nInfo.fats || "") + "\n" + (nInfo.saturatedFats || ""));
            drawRow(t('traceability_form.label_carbs') || "Hidratos de carbono\nde los cuales azúcares", (nInfo.carbohydrates || "") + "\n" + (nInfo.sugars || ""));
            drawRow(t('traceability_form.label_proteins') || "Proteínas", nInfo.proteins || "");
            drawRow(t('traceability_form.label_salt') || "Sal", nInfo.salt || "");
            doc.setFontSize(fontSize);
          }
          break;
        case 'ingredientsList':
          if (elaboration.ingredients && elaboration.ingredients.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.text(t('modals.ingredients'), startX, currentY);
            currentY += lineHeightMM;
            doc.setFont("helvetica", "normal");
            
            const isParagraph = config.ingredientOptions?.format === 'paragraph';

            let paragraphParts = [];

            elaboration.ingredients.forEach(ing => {
              let displayName = ing.name;
              if (elaboration.recipe && elaboration.recipe.ingredients) {
                const recipeIng = elaboration.recipe.ingredients.find(ri => 
                  ri.name.trim().toLowerCase() === ing.name.trim().toLowerCase()
                );
                if (recipeIng && recipeIng.expandItem && recipeIng.expandedText) {
                  displayName = recipeIng.expandedText;
                }
              }
              
              let ingText = isParagraph ? displayName : `- ${displayName}`;
              if (config.ingredientOptions?.showLote && ing.lote) ingText += ` (${ing.lote})`;
              if (config.ingredientOptions?.showAmount) {
                ingText += isParagraph ? ` (${ing.realAmount}${ing.unit})` : `: ${ing.realAmount} ${ing.unit}`;
              }
              
              if (isParagraph) {
                paragraphParts.push(ingText);
              } else {
                const splitText = doc.splitTextToSize(ingText, columnWidth);
                doc.text(splitText, startX, currentY, { align: 'left' });
                currentY += (splitText.length * lineHeightMM);
              }
            });

            if (isParagraph && paragraphParts.length > 0) {
              const fullParagraph = paragraphParts.join(', ') + '.';
              
              // We use exactly the same columnWidth for the paragraph block
              const pWidth = columnWidth;
              
              doc.text(fullParagraph, startX, currentY, { maxWidth: pWidth, align: 'justify' });
              
              const splitTextForHeight = doc.splitTextToSize(fullParagraph, pWidth);
              currentY += (splitTextForHeight.length * lineHeightMM);
            }
          }
          break;
        case 'barcode':
          if (elaboration.recipe.hasBarcode && elaboration.recipe.barcode) {
            try {
              const canvas = document.createElement('canvas');
              JsBarcode(canvas, elaboration.recipe.barcode, {
                format: "EAN13",
                displayValue: true,
                fontSize: 14,
                margin: 0,
                height: 40
              });
              const barcodeDataUrl = canvas.toDataURL("image/jpeg");
              const barcodeWidthMM = 35;
              const barcodeHeightMM = 15;
              const bcrX = startX + (columnWidth - barcodeWidthMM) / 2;
              doc.addImage(barcodeDataUrl, 'JPEG', bcrX, currentY, barcodeWidthMM, barcodeHeightMM);
              currentY += barcodeHeightMM + 5;
            } catch (err) {
              console.error("Failed to generate label barcode:", err);
            }
          }
          break;
        case 'healthRegistry':
          const hrText = config.healthRegistry || profile?.labelConfig?.healthRegistry;
          if (hrText) {
            doc.setFont("helvetica", "bold");
            doc.text(`${t('modals.labels_health_registry') || "Registro sanitario"}:`, startX, currentY);
            currentY += lineHeightMM;
            doc.setFont("helvetica", "normal");
            const splitHR = doc.splitTextToSize(hrText, columnWidth);
            doc.text(splitHR, startX, currentY);
            currentY += (splitHR.length * lineHeightMM);
          }
          break;
        case 'dryingRoomDates':
          if (elaboration.dryingRoomIn || elaboration.dryingRoomOut) {
            if (elaboration.dryingRoomIn) {
              doc.setFont("helvetica", "bold");
              doc.text(`${t('traceability_form.label_drying_in') || "Entrada secadero"}:`, startX, currentY);
              currentY += lineHeightMM;
              doc.setFont("helvetica", "normal");
              doc.text(elaboration.dryingRoomIn, startX, currentY);
              currentY += lineHeightMM;
            }
            if (elaboration.dryingRoomOut) {
              doc.setFont("helvetica", "bold");
              doc.text(`${t('traceability_form.label_drying_out') || "Salida secadero"}:`, startX, currentY);
              currentY += lineHeightMM;
              doc.setFont("helvetica", "normal");
              doc.text(elaboration.dryingRoomOut, startX, currentY);
              currentY += lineHeightMM;
            }
          }
          break;
      }
      
      if (currentY > initialY) {
        currentY += 2;
      }
      return currentY;
    };

    const col2X = margin + columnWidth + colGap;

    const renderColumnArray = (arr, startColX, startColY) => {
      let currentY = startColY;
      (arr || []).forEach(itemKey => {
        currentY = renderElement(itemKey, startColX, currentY);
      });
      return currentY;
    };

    if (isTwoCols) {
      renderColumnArray(config.columns?.col1, margin, y);
      renderColumnArray(config.columns?.col2, col2X, y);
    } else {
      renderColumnArray(config.columns?.col1, margin, y);
    }

    doc.save(`Etiqueta_${elaboration.name}.pdf`);
  };

  const generateGoodsReportPDF = async (startDate, endDate) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ startDate, endDate });
      const res = await fetch(`/api/goods-receipts?${query}`);
      
      if (!res.ok) {
        throw new Error(`Error API: ${res.status}`);
      }
      
      const data = await res.json();

      if (!data || data.length === 0) {
        alert(t('dashboard.no_records'));
        return;
      }

      const doc = new jsPDF();
      
      for (let i = 0; i < data.length; i++) {
        const receipt = data[i];
        if (i > 0) doc.addPage();

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(t('dashboard.goods_report'), 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`${t('common.from')}: ${formatDateDDMMYYYY(startDate)} ${t('common.to')}: ${formatDateDDMMYYYY(endDate)}`, 105, 30, { align: 'center' });
        
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // Datos del recibo
        const details = [
          [t('goods_receipt_form.product') + ":", receipt.productName || "N/A"],
          [t('goods_receipt_form.provider') + ":", receipt.providerName || "N/A"],
          [t('dashboard.lote') + ":", receipt.lote || "N/A"],
          [t('goods_receipt_form.quantity') + ":", receipt.quantity || "N/A"],
          [t('goods_receipt_form.invoice_number') + ":", receipt.invoiceNumber || "N/A"],
          [t('goods_receipt_form.temp') + " (°C):", receipt.manufacturingTemp || "N/A"],
          [t('goods_receipt_form.end_date') + ":", formatDateDDMMYYYY(receipt.endDate)],
          [t('goods_receipt_form.type_and_origin') + ":", receipt.typeAndOrigin || "N/A"],
          [t('dashboard.datetime') + ":", formatDateTimeDDMMYYYY(receipt.date)]
        ];

        let currentY = 50;
        details.forEach(([label, value]) => {
          doc.setFont("helvetica", "bold");
          doc.text(label, 20, currentY);
          doc.setFont("helvetica", "normal");
          doc.text(String(value), 90, currentY);
          currentY += 7;
        });

        // Imagen del albarán
        if (receipt.deliveryNoteImage) {
          try {
            // we assume its base64 as seen in handleSubmitGoods
            doc.addImage(receipt.deliveryNoteImage, 'JPEG', 20, currentY + 10, 170, 120, undefined, 'FAST');
          } catch (e) {
            console.error("Error adding image to PDF:", e);
            doc.setFontSize(10);
            doc.setTextColor(255, 0, 0);
            doc.text("Error al cargar la imagen del albarán", 20, currentY + 15);
            doc.setTextColor(0, 0, 0);
          }
        }

        // Pie de página
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Informe generado por Quicktrace. Más información en https://quicktrace.es", 20, 285);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`${i + 1} / ${data.length}`, 190, 285, { align: 'right' });
      }

      doc.save(`Informe_Mercancias_${startDate}_${endDate}.pdf`);
      setIsGoodsReportModalOpen(false);
    } catch (error) {
      console.error("Error generating goods report:", error);
      alert(`${t('alerts.connection_error')} (${error.message})`);
    } finally {
      setLoading(false);
    }
  };

  const generateTraceabilityReportPDF = async (startDate, endDate) => {
    setLoading(true);
    try {
      // Fetch all elaborations in the date range (limit 1000 to cover most cases)
      const query = new URLSearchParams({
        page: "1",
        limit: "1000",
        startDate,
        endDate
      });
      const res = await fetch(`/api/elaborations?${query}`);
      
      if (!res.ok) {
        throw new Error(`Error API: ${res.status}`);
      }
      
      const data = await res.json();

      if (!data.data || data.data.length === 0) {
        alert(t('dashboard.no_records'));
        return;
      }

      const filtered = data.data;
      const doc = new jsPDF();
      
      filtered.forEach((el, index) => {
        if (index > 0) doc.addPage();

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(t('dashboard.traceability_report'), 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`${t('common.from')}: ${formatDateDDMMYYYY(startDate)} ${t('common.to')}: ${formatDateDDMMYYYY(endDate)}`, 105, 30, { align: 'center' });
        
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // Datos de la elaboración
        let currentY = 50;
        doc.setFont("helvetica", "bold");
        doc.text(t('dashboard.elaboration_recipe_header') + ":", 20, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(el.recipe?.name || "N/A", 90, currentY);
        currentY += 7;

        doc.setFont("helvetica", "bold");
        doc.text(t('dashboard.lote') + ":", 20, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(el.name || "N/A", 90, currentY);
        currentY += 7;

        doc.setFont("helvetica", "bold");
        doc.text(t('traceability_form.label_made_by'), 20, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(el.personName || "N/A", 90, currentY);
        currentY += 7;

        doc.setFont("helvetica", "bold");
        doc.text(t('traceability_form.label_date') + ":", 20, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(formatDateTimeDDMMYYYY(el.date), 90, currentY);
        currentY += 7;

        const expLabel = el.recipe?.expiryType === "BEST_BEFORE" 
          ? t('traceability_form.label_best_before') 
          : t('traceability_form.label_expiration');
        doc.setFont("helvetica", "bold");
        doc.text(expLabel + ":", 20, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(formatDateDDMMYYYY(el.expirationDate), 90, currentY);
        currentY += 7;

        // Alérgenos
        const allergensList = (el.recipe?.allergens || [])
          .map(a => t(`allergens.list.${a}`))
          .join(", ");
        
        doc.setFont("helvetica", "bold");
        doc.text(t('allergens.title') + ":", 20, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(allergensList || t('modals.none'), 90, currentY);
        currentY += 7;

        if (el.workshopTemp) {
          doc.setFont("helvetica", "bold");
          doc.text((t('traceability_form.workshop_temp') || "Temperatura del obrador") + ":", 20, currentY);
          doc.setFont("helvetica", "normal");
          doc.text(el.workshopTemp, 90, currentY);
          currentY += 7;
        }

        if (el.dryingRoomIn) {
          doc.setFont("helvetica", "bold");
          doc.text((t('traceability_form.label_drying_in') || "Entrada secadero") + ":", 20, currentY);
          doc.setFont("helvetica", "normal");
          doc.text(el.dryingRoomIn, 90, currentY);
          currentY += 7;
        }

        if (el.dryingRoomOut) {
          doc.setFont("helvetica", "bold");
          doc.text((t('traceability_form.label_drying_out') || "Salida secadero") + ":", 20, currentY);
          doc.setFont("helvetica", "normal");
          doc.text(el.dryingRoomOut, 90, currentY);
          currentY += 7;
        }

        currentY += 10; // Extra spacing

        // Tabla de ingredientes
        doc.setFont("helvetica", "bold");
        doc.text(t('modals.ingredients') + ":", 20, currentY);
        
        const tableBody = el.ingredients.map(ing => [
          ing.name,
          ing.lote || "N/A",
          `${ing.realAmount} ${ing.unit}`
        ]);

        autoTable(doc, {
          startY: currentY + 5,
          head: [[t('modals.ing_name'), t('traceability_form.lot'), t('traceability_form.real_amount')]],
          body: tableBody,
          theme: 'grid',
          headStyles: { fillStyle: '#3f6212', textColor: [255, 255, 255] },
          margin: { left: 20, right: 20 },
          didDrawPage: (data) => {
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text("Informe generado por Quicktrace. Más información en https://quicktrace.es", 20, doc.internal.pageSize.height - 12);
          }
        });

        // Pie de página
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Informe generado por Quicktrace. Más información en https://quicktrace.es", 20, 285);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`${index + 1} / ${filtered.length}`, 190, 285, { align: 'right' });
      });

      doc.save(`Informe_Trazabilidad_${startDate}_${endDate}.pdf`);
      setIsTraceabilityReportModalOpen(false);
    } catch (error) {
      console.error("Error generating traceability report:", error);
      alert(`${t('alerts.connection_error')} (${error.message})`);
    } finally {
      setLoading(false);
    }
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

      if (profile?.isPreparationTimeMandatory && !elaboracionForm.preparationTime) {
        alert(t('business_config.mandatory_prep_time_error'));
        return;
      }

      if (!elaboracionForm.titulo) {
        alert(t('alerts.missing_title'));
        return;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: elaboracionForm.titulo,
          recipeId: selectedRecipe.id,
          personName: elaboracionForm.personName,
          date: elaboracionForm.date,
          expirationDate: elaboracionForm.expirationDate,
          dryingRoomIn: elaboracionForm.dryingRoomIn,
          dryingRoomOut: elaboracionForm.dryingRoomOut,
          workshopTemp: elaboracionForm.workshopTemp,
          preparationTime: elaboracionForm.preparationTime,
          quantityProduced: elaboracionForm.quantityProduced,
          netWeight: elaboracionForm.netWeight,
          unitPrice: elaboracionForm.unitPrice,
          extraInfo: elaboracionForm.extraInfo,
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

  const handleBulkDelete = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      if (activeTab === "historial") endpoint = "/api/elaborations";
      else if (activeTab === "limpieza") endpoint = "/api/cleaning-logs";
      else if (activeTab === "temperaturas") endpoint = "/api/temperature-records";
      else if (activeTab === "entradas") endpoint = "/api/goods-receipts";
      else if (activeTab === "agua") endpoint = "/api/water-measurements";

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedRecords })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Delete failed");
      }

      // Refresh data
      if (activeTab === "historial") fetchElaborations();
      else if (activeTab === "limpieza") fetchCleaningLogs();
      else if (activeTab === "temperaturas") fetchTempRecords();
      else if (activeTab === "entradas") fetchGoodsReceipts(goodsFilters);
      else if (activeTab === "agua") fetchWaterMeasurements();
      
      fetchProfile(); // Update usage limits
      setSelectedRecords([]);
      setIsBulkDeleteModalOpen(false);
      setBulkDeletePhase(1);
      alert(t('alerts.deleted_successfully') || "Registros eliminados correctamente");
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert(error.message || t('alerts.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = (currentRecords) => {
    const recordIds = currentRecords.map(r => r.id);
    const allSelected = recordIds.every(id => selectedRecords.includes(id));

    if (allSelected) {
      setSelectedRecords(prev => prev.filter(id => !recordIds.includes(id)));
    } else {
      setSelectedRecords(prev => [...new Set([...prev, ...recordIds])]);
    }
  };

  const toggleSelectRecord = (id) => {
    setSelectedRecords(prev => 
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

      const handleSubmitWaste = async (e) => {
    e.preventDefault();
    if (isRecipeLimitExceeded()) {
      setIsRecipeOverlimitModalOpen(true);
      return;
    }
    setLoading(true);
    try {
      const url = "/api/waste-collections";
      const method = editingWasteRecord ? "PATCH" : "POST";
      const body = editingWasteRecord ? { ...wasteForm, id: editingWasteRecord.id } : wasteForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        setIsWasteModalOpen(false);
        setEditingWasteRecord(null);
        fetchWasteCollections();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert(t("alerts.connection_error") || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWasteModal = () => {
    if (isRecipeLimitExceeded()) {
      setIsRecipeOverlimitModalOpen(true);
      return;
    }
    const lastPerson = wasteCollections.length > 0 ? wasteCollections[0].personName : (profile?.personName || session?.user?.name || "");
    setEditingWasteRecord(null);
    setWasteForm({ date: new Date().toISOString().slice(0, 10), personName: lastPerson, kilos: "" });
    setIsWasteModalOpen(true);
  };

  const handleEditWaste = (record) => {
    setEditingWasteRecord(record);
    setWasteForm({
      date: new Date(record.date).toISOString().slice(0, 10),
      personName: record.personName,
      kilos: record.kilos
    });
    setIsWasteModalOpen(true);
  };
  
  const handleDeleteWaste = async (id) => {
    if (!confirm(t('waste.delete_confirm') || "¿Seguro que quieres eliminar este registro?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/waste-collections?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchWasteCollections();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCleaning = async (e) => {
    e.preventDefault();
    if (isRecipeLimitExceeded()) {
      setIsRecipeOverlimitModalOpen(true);
      return;
    }
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
          selectedZones: [],
          notes: ""
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
      selectedZones: log.zones.map(z => z.cleaningZone.id),
      notes: log.notes || ""
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
    if (isRecipeLimitExceeded()) {
      setIsRecipeOverlimitModalOpen(true);
      return;
    }
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
          values: {},
          notes: ""
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
      values,
      notes: record.notes || ""
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

  const filteredElaborations = elaborations.filter(elab => {
    const matchesLote = !elabFilters.lote || (elab.ingredients && elab.ingredients.some(ing => ing.lote && ing.lote.toLowerCase().includes(elabFilters.lote.toLowerCase())));
    const matchesLoteElab = !elabFilters.loteElab || (elab.name && elab.name.toLowerCase().includes(elabFilters.loteElab.toLowerCase()));
    const matchesRecipe = elabFilters.recipeId === 'all' || elab.recipeId.toString() === elabFilters.recipeId.toString();
    
    let matchesDate = true;
    if (elabFilters.startDate) {
      const start = new Date(elabFilters.startDate);
      matchesDate = matchesDate && new Date(elab.date) >= start;
    }
    if (elabFilters.endDate) {
      const end = new Date(elabFilters.endDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && new Date(elab.date) <= end;
    }
    
    return matchesLote && matchesLoteElab && matchesRecipe && matchesDate;
  });

  const sortedElaborations = [...filteredElaborations].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    
    if (sortConfig.key === 'recipe') {
      aVal = a.recipe?.name || "";
      bVal = b.recipe?.name || "";
    }
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading && recipes.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="var(--corp-green)" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      {/* Mobile Top Header */}
      <div className="mobile-header" style={{ padding: '1rem 1.5rem', background: 'white', borderBottom: '1px solid var(--border)', display: 'none', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '28px', height: '28px' }}>
            <img src="/images/logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--corp-green)', margin: 0 }}>
            QuickTrace
          </h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ background: 'transparent', border: 'none', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-main)' }}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar / Topbar combined for responsive */}
      <div style={{ display: 'flex', minHeight: '100vh', overflowX: 'hidden' }} className="flex-responsive">
        <aside style={{ 
          width: isSidebarOpen ? '280px' : '0px',
          opacity: isSidebarOpen ? 1 : 0,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
          borderRight: isSidebarOpen ? '1px solid var(--border)' : 'none', 
          background: 'white', 
          display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh',
          overflow: 'hidden', whiteSpace: 'nowrap'
        }} className={`sidebar-responsive ${isSidebarOpen ? 'open' : ''}`}>
          <div className="desktop-logo" style={{ padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative', width: '32px', height: '32px' }}>
              <Image src="/images/logo.jpg"
 alt="Logo" fill style={{ objectFit: 'contain' }} />
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--corp-green)' }}>
              QuickTrace
            </h1>
          </div>

          <nav style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
            {session?.user?.role === "CLIENT" && (
              <>
                <SidebarBtn 
                  icon={<ChefHat size={20} />} 
                  label={t('sidebar.manage_recipes')} 
                  active={activeTab === "gestionar-recetas"} 
                  onClick={() => { setActiveTab("gestionar-recetas"); setSelectedRecipe(null); setSelectedRecords([]); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
                />
                <SidebarBtn 
                  icon={<Users size={20} />} 
                  label={t('sidebar.workers') || "Trabajadores"} 
                  active={activeTab === "trabajadores"} 
                  onClick={() => { setActiveTab("trabajadores"); setSelectedRecipe(null); setSelectedRecords([]); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
                />
              </>
            )}

            {(session?.user?.role === "CLIENT" || session?.user?.role === "ADMIN" || session?.user?.permissions?.hasTraceability) && (
              <>
                <SidebarBtn 
                  icon={<ClipboardList size={20} />} 
                  label={t('sidebar.traceability')} 
                  active={activeTab === 'trazabilidad'} 
                  onClick={() => { setActiveTab('trazabilidad'); setSelectedRecipe(null); setSelectedRecords([]); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
                />
                <SidebarBtn 
                  icon={<History size={20} />} 
                  label={t('sidebar.history')} 
                  active={activeTab === "historial"} 
                  onClick={() => { setActiveTab("historial"); setSelectedRecipe(null); setSelectedRecords([]); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
                />
              </>
            )}

            {(profile?.plan?.hasCleaning || session?.user?.role === "ADMIN") && (session?.user?.role !== "WORKER" || session?.user?.permissions?.hasCleaning) && (
              <SidebarBtn 
                icon={<Brush size={20} />} 
                label={t('sidebar.cleaning')} 
                active={activeTab === "limpieza"} 
                onClick={() => { setActiveTab("limpieza"); setSelectedRecipe(null); setSelectedRecords([]); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
              />
            )}

            {(profile?.plan?.hasTemperatures || session?.user?.role === "ADMIN") && (session?.user?.role !== "WORKER" || session?.user?.permissions?.hasTemperatures) && (
              <SidebarBtn 
                icon={<Thermometer size={20} />} 
                label={t('sidebar.temperatures')} 
                active={activeTab === "temperaturas"} 
                onClick={() => { setActiveTab("temperaturas"); setSelectedRecipe(null); setSelectedRecords([]); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
              />
            )}

            {(profile?.plan?.hasWater || session?.user?.role === "ADMIN") && (session?.user?.role !== "WORKER" || session?.user?.permissions?.hasWater) && (
              <SidebarBtn 
                icon={<Waves size={20} />} 
                label={t('sidebar.water') || "Agua"} 
                active={activeTab === "agua"} 
                onClick={() => { setActiveTab("agua"); setSelectedRecipe(null); setSelectedRecords([]); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
              />
            )}

            {(profile?.plan?.hasGoods || session?.user?.role === "ADMIN") && (session?.user?.role !== "WORKER" || session?.user?.permissions?.hasGoods) && (
              <SidebarBtn 
                icon={<Truck size={20} />} 
                label={t('sidebar.goods')} 
                active={activeTab === "entradas"} 
                onClick={() => { setActiveTab("entradas"); setSelectedRecipe(null); setSelectedRecords([]); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
              />
            )}

            {(session?.user?.role !== "WORKER") && (
              <>
                <SidebarBtn 
                  icon={<Truck size={20} />} 
                  label={t('sidebar.providers') || "Proveedores"} 
                  active={activeTab === "proveedores"} 
                  onClick={() => { setActiveTab("proveedores"); setSelectedRecipe(null); setSelectedRecords([]); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
                />
                <SidebarBtn 
                  icon={<Recycle size={20} />} 
                  label={t('sidebar.waste') || "Residuos"} 
                  active={activeTab === "residuos"} 
                  onClick={() => { setActiveTab("residuos"); setSelectedRecipe(null); setSelectedRecords([]); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
                />

                <SidebarBtn 
                  icon={<Settings size={20} />} 
                  label={t('sidebar.business_config') || "Configuración del negocio"}
                  active={activeTab === "configuracion"} 
                  onClick={() => { setActiveTab("configuracion"); setSelectedRecipe(null); setSelectedRecords([]); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} 
                />
              </>
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
            
            <div style={{ padding: '0 1.5rem 1rem' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveTab('afiliados'); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }}
                className="btn-secondary"
                style={{ 
                  width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', 
                  padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.85rem',
                  fontWeight: '700', color: 'var(--corp-green)', background: 'rgba(66, 98, 22, 0.05)',
                  border: '1px solid rgba(66, 98, 22, 0.15)', cursor: 'pointer',
                  textAlign: 'left', lineHeight: '1.2', whiteSpace: 'normal'
                }}
              >
                <ArrowUpCircle size={18} style={{ flexShrink: 0 }} /> 
                <span>{t('affiliate.sidebar_link')}</span>
              </button>
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
        <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', minWidth: 0, transition: 'padding 0.3s ease' }}>
          
          {/* Desktop Toggle Button */}
          <div className="desktop-only" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ background: 'white', border: '1px solid var(--border)', padding: '0.6rem', borderRadius: '0.5rem', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              <Menu size={20} />
            </button>
            {!isSidebarOpen && <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--corp-green)' }}>QuickTrace</h2>}
          </div>

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
                    {isReadOnlyElab ? (t('traceability_form.view_record') || "VER REGISTRO") : editingElaboration ? t('traceability_form.modify_record') : t('traceability_form.new_record')}
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
                      style={{ fontSize: '1.1rem', fontWeight: '500', padding: '1rem', border: '2px solid var(--corp-green)' }}
                      disabled={isReadOnlyElab}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>

                    <div>
                      <label className="input-label" style={{ fontWeight: '700', color: 'var(--text-main)' }}>{t('traceability_form.quantity_produced')}</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={elaboracionForm.quantityProduced} 
                        onChange={(e) => setElaboracionForm({...elaboracionForm, quantityProduced: e.target.value})}
                        placeholder="Ej: 50 kg, 100 unidades..."
                        disabled={isReadOnlyElab}
                      />
                    </div>

                    <div>
                      <label className="input-label" style={{ fontWeight: '700', color: 'var(--text-main)' }}>{t('traceability_form.net_weight_label')}</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={elaboracionForm.netWeight} 
                        onChange={(e) => setElaboracionForm({...elaboracionForm, netWeight: e.target.value})}
                        placeholder="Ej: 250g, 1kg..."
                        disabled={isReadOnlyElab}
                      />
                    </div>

                    <div>
                      <label className="input-label" style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                        {t('traceability_form.unit_price')} 
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal', marginLeft: '0.5rem' }}>
                          ({profile?.currency || 'EUR'})
                        </span>
                      </label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={elaboracionForm.unitPrice} 
                        onChange={(e) => setElaboracionForm({...elaboracionForm, unitPrice: e.target.value})}
                        placeholder="Ej: 15.50"
                        disabled={isReadOnlyElab}
                      />
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: '1.2' }}>
                        {t('traceability_form.unit_price_help')}
                      </p>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '700' }}>{t('traceability_form.made_by')}</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={elaboracionForm.personName} 
                        onChange={(e) => setElaboracionForm({...elaboracionForm, personName: e.target.value})} 
                        placeholder={t('modals.person_name')}
                        disabled={isReadOnlyElab}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '700' }}>{t('traceability_form.elaboration_date')}</label>
                      <input 
                        type="datetime-local" 
                        className="input-field" 
                        value={elaboracionForm.date} 
                        onChange={(e) => setElaboracionForm({...elaboracionForm, date: e.target.value})} 
                        disabled={isReadOnlyElab}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '700' }}>{t('traceability_form.expiration_date')}</label>
                      <input 
                        type="date" 
                        className="input-field" 
                        value={elaboracionForm.expirationDate} 
                        onChange={(e) => setElaboracionForm({...elaboracionForm, expirationDate: e.target.value})} 
                        disabled={isReadOnlyElab}
                      />
                    </div>
                    {selectedRecipe?.hasDryingRoom && (
                      <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '700' }}>{t('traceability_form.label_drying_in') || "ENTRADA SECADERO"}</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            value={elaboracionForm.dryingRoomIn} 
                            onChange={(e) => setElaboracionForm({...elaboracionForm, dryingRoomIn: e.target.value})} 
                            disabled={isReadOnlyElab}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '700' }}>{t('traceability_form.label_drying_out') || "SALIDA SECADERO"}</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            value={elaboracionForm.dryingRoomOut} 
                            onChange={(e) => setElaboracionForm({...elaboracionForm, dryingRoomOut: e.target.value})} 
                            disabled={isReadOnlyElab}
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '700' }}>{t('traceability_form.workshop_temp') || "Temperatura del obrador"}</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={elaboracionForm.workshopTemp} 
                        onChange={(e) => setElaboracionForm({...elaboracionForm, workshopTemp: e.target.value})} 
                        disabled={isReadOnlyElab}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '700' }}>{t('traceability_form.preparation_time') || "Tiempo que se ha tardado en hacer esta elaboración"}</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={elaboracionForm.preparationTime} 
                        onChange={(e) => setElaboracionForm({...elaboracionForm, preparationTime: e.target.value})} 
                        disabled={isReadOnlyElab}
                      />
                      <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        {t('traceability_form.preparation_time_help')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--corp-green)', margin: 0 }}>
                        <Beaker size={20} /> {t('traceability_form.ingredients_batches')}
                      </h3>
                      {!isReadOnlyElab && (
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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
                            onClick={handleAutoFillLotesFromGoods}
                            style={{ 
                              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', 
                              borderRadius: '0.5rem', border: '1px solid var(--corp-green)', background: 'rgba(66, 98, 22, 0.05)', 
                              color: 'var(--corp-green)', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' 
                            }}
                            title={t('traceability_form.autofill_lotes_from_goods_help')}
                          >
                            <History size={16} /> {t('traceability_form.autofill_lotes_from_goods')}
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
                      )}
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
                              required={!isReadOnlyElab && !!ing.loteMandatory} 
                              disabled={isReadOnlyElab}
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
                              required={!isReadOnlyElab && !!ing.quantityMandatory} 
                              disabled={isReadOnlyElab}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <input 
                                type="checkbox" 
                                id={`prop-${ing.id}`}
                                checked={proportionMasterId === ing.id}
                                onChange={(e) => setProportionMasterId(e.target.checked ? ing.id : null)}
                                style={{ cursor: 'pointer' }}
                                disabled={isReadOnlyElab}
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

                  <div style={{ marginTop: '2rem' }}>
                    <label className="label" style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'block' }}>
                      {t('traceability_form.elaboration_notes')}
                    </label>
                    <textarea 
                      className="input-field" 
                      value={elaboracionForm.extraInfo || ""} 
                      onChange={(e) => setElaboracionForm({...elaboracionForm, extraInfo: e.target.value})} 
                      placeholder={t('traceability_form.elaboration_notes')}
                      rows={4}
                      style={{ resize: 'vertical', minHeight: '100px' }}
                      disabled={isReadOnlyElab}
                    />
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    {isReadOnlyElab ? (
                      <button 
                        type="button" 
                        onClick={() => { setSelectedRecipe(null); setIsReadOnlyElab(false); }} 
                        className="btn-primary" 
                        style={{ minWidth: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                      >
                        <ArrowLeft size={20} /> {t('traceability_form.back_to_list') || "Volver"}
                      </button>
                    ) : (
                      <button type="submit" className="btn-primary" style={{ minWidth: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> {t('dashboard.save_record')}</>}
                      </button>
                    )}
                  </div>
                </form>
              </section>
            </div>
          ) : activeTab === 'trazabilidad' ? (
            <div>
              <header style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <div className="header-content-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>{t('sidebar.traceability')}</h2>
                  <div className="action-buttons-mobile" style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      onClick={() => setVideoModal({ isOpen: true, videoId: locale === 'en' ? 'Pmj3w3GaLKM' : "yKJbPZQUTNM" })}
                      className="btn-help-video"
                    >
                      <PlayCircle size={18} /> {t('dashboard.video_help')}
                    </button>
                    <button 
                      onClick={() => setActiveTab('historial')}
                      className="btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      <History size={18} /> {t('dashboard.view_registered_elabs')}
                    </button>
                  </div>
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
                      onClick={() => setVideoModal({ isOpen: true, videoId: locale === 'en' ? 'Pmj3w3GaLKM' : "yKJbPZQUTNM" })}
                      className="btn-help-video"
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
                <>
                  <div style={{ marginBottom: '2.5rem', maxWidth: '600px' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Search size={22} style={{ position: 'absolute', left: '1.25rem', color: 'var(--text-muted)', zIndex: 1 }} />
                      <input 
                        type="text" 
                        placeholder={t('common.search')} 
                        value={recipeSearchTerm}
                        onChange={(e) => setRecipeSearchTerm(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '3.5rem', height: '3.75rem', fontSize: '1.05rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderRadius: '1rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {recipes
                      .filter(recipe => recipe.name.toLowerCase().includes(recipeSearchTerm.toLowerCase()))
                      .map(recipe => (
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
                </>
              )}
            </div>
          ) : activeTab === 'historial' ? (
            <div>
              <header style={{ marginBottom: '3rem' }}>
                <div className="header-content-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>{t('sidebar.history')}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('dashboard.history_info')}</p>
                  </div>
                  <div className="action-buttons-mobile" style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      onClick={() => setIsTraceabilityReportModalOpen(true)}
                      className="btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      <FileText size={18} /> {t('dashboard.traceability_report')}
                    </button>
                    <button 
                      onClick={() => setIsLabelModalOpen(true)}
                      className="btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      <Settings size={18} /> {t('dashboard.configure_labels')}
                    </button>
                    <button 
                      onClick={() => setVideoModal({ isOpen: true, videoId: locale === 'en' ? 'Pmj3w3GaLKM' : "yKJbPZQUTNM" })}
                      className="btn-help-video"
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
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('dashboard.elaboration_batch_search')}</label>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder={t('dashboard.elaboration_batch_placeholder')}
                      className="input-field"
                      style={{ paddingLeft: '2.5rem', margin: 0 }}
                      value={elabFilters.loteElab}
                      onChange={(e) => {
                        setElabFilters({...elabFilters, loteElab: e.target.value});
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>

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
                    setElabFilters({ lote: "", loteElab: "", startDate: "", endDate: "", recipeId: "all" });
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
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                      <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                          <th style={{ padding: '0.75rem 1rem', width: '60px', textAlign: 'center', borderRight: '1px solid var(--border)', background: '#f1f5f9' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '800' }}>SEL.</span>
                              <input 
                                type="checkbox" 
                                style={{ cursor: 'pointer', accentColor: 'var(--corp-green)', width: '1.25rem', height: '1.25rem', border: '2px solid #cbd5e1', borderRadius: '0.25rem' }}
                                checked={elaborations.length > 0 && elaborations.every(el => selectedRecords.includes(el.id))}
                                onChange={() => toggleSelectAll(elaborations)}
                              />
                            </div>
                          </th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('dashboard.date')}</th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('traceability_form.elaboration_title')}</th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('dashboard.recipe_name')}</th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('dashboard.elaboration_prep_time_header')}</th>
                          {session?.user?.role !== "WORKER" && (
                            <>
                              <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  <span>{t('dashboard.cost_header')}</span>
                                  <span 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      setSelectedElaborationForCosts(null);
                                      setIsIngredientCostsModalOpen(true); 
                                    }} 
                                    style={{ fontSize: '0.65rem', textTransform: 'none', color: 'var(--corp-green)', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}
                                  >
                                    {t('dashboard.assign_costs_link')}
                                  </span>
                                </div>
                              </th>
                              <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('dashboard.labor_cost_header')}</th>
                            </>
                          )}
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('traceability_form.elaboration_notes')}</th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>{t('dashboard.actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {elaborations.map(el => (
                          <tr key={el.id} style={{ borderBottom: '1px solid var(--border)', background: selectedRecords.includes(el.id) ? '#f0fdf4' : 'white', transition: 'background 0.2s' }} className="hover-row">
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', borderRight: '1px solid var(--border)', background: selectedRecords.includes(el.id) ? '#f0fdf4' : '#f8fafc' }}>
                              <input 
                                type="checkbox" 
                                style={{ cursor: 'pointer', accentColor: 'var(--corp-green)', width: '1.25rem', height: '1.25rem', border: '2px solid #cbd5e1', borderRadius: '0.25rem', display: 'block', margin: '0 auto' }}
                                checked={selectedRecords.includes(el.id)}
                                onChange={() => toggleSelectRecord(el.id)}
                              />
                            </td>
                          <td style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)' }}>{formatDateDDMMYYYY(el.date || el.createdAt)}</td>
                          <td style={{ padding: '1.5rem 2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                              <span style={{ fontWeight: '700', color: 'var(--corp-green)' }}>{el.name}</span>
                              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem', flexWrap: 'wrap' }}>
                                <span 
                                  onClick={() => handleViewElaborationOnly(el)} 
                                  style={{ color: 'var(--corp-green)', cursor: 'pointer', textDecoration: 'underline', fontWeight: '700' }}
                                >
                                  {t('dashboard.view_elaboration') || "Ver elaboración"}
                                </span>
                                <span 
                                  onClick={() => handleExportElaborationPDF(el)} 
                                  style={{ color: '#0ea5e9', cursor: 'pointer', textDecoration: 'underline', fontWeight: '700' }}
                                >
                                  {t('dashboard.export_pdf_short') || "Exportar PDF"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1.5rem 2rem', fontWeight: '700', color: 'var(--text-main)' }}>{el.recipe?.name}</td>
                          <td style={{ padding: '1.5rem 2rem', fontWeight: '600', color: 'var(--text-main)' }}>{el.preparationTime ? `${el.preparationTime} min` : '-'}</td>
                          {session?.user?.role !== "WORKER" && (
                            <>
                              <td style={{ padding: '1.5rem 2rem', fontWeight: '600', color: 'var(--text-main)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                  <span>{el.costPrice ? formatPrice(el.costPrice, profile?.currency, locale) : '-'}</span>
                                  {el.recipe && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenRecipeCostModal(el);
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        fontSize: '0.7rem',
                                        color: 'var(--corp-green)',
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        fontWeight: '600',
                                        textAlign: 'left'
                                      }}
                                    >
                                      {t('dashboard.assign_recipe_costs_btn') || "Asigna coste a cada ingrediente de esta receta"}
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td style={{ padding: '1.5rem 2rem', fontWeight: '800', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
                                {el.preparationTime && (el.laborCostHourlyRate || 0) > 0
                                  ? formatPrice((parseFloat(el.preparationTime.replace(',', '.')) / 60) * el.laborCostHourlyRate, profile?.currency, locale)
                                  : formatPrice(0, profile?.currency, locale)}
                              </td>
                            </>
                          )}
                          <td style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={el.extraInfo || ""}>
                            {el.extraInfo || "-"}
                          </td>
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
                </div>

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
          ) : activeTab === 'residuos' ? (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>{t('sidebar.waste') || "Residuos"}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{t('waste.description') || "Gestiona y registra la retirada de residuos."}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => setVideoModal({ isOpen: true, videoId: "N6wejn-GRHM" })}
                    className="btn-help-video"
                  >
                    <PlayCircle size={18} /> {t('dashboard.video_help') || "Video ayuda"}
                  </button>
                  <button 
                    onClick={handleOpenWasteModal}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <PlusCircle size={18} /> {t('waste.new_collection') || "Nueva retirada de residuos"}
                  </button>
                </div>
              </header>

              {wasteCollections.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '1.5rem', border: '1px solid var(--border)' }}>
                  <Recycle size={48} color="var(--border)" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>{t('waste.no_records') || "No hay registros de retiradas de residuos."}</h3>
                </div>
              ) : (
                <div style={{ background: 'white', borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                          <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('waste.table_date') || "Fecha"}</th>
                          <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('waste.table_person') || "Responsable"}</th>
                          <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('waste.table_kilos') || "Kilos (kg)"}</th>
                          <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>{t('dashboard.actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wasteCollections.map(record => (
                          <tr key={record.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                            <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>
                              {new Date(record.date).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{record.personName}</td>
                            <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{record.kilos} kg</td>
                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button onClick={() => handleEditWaste(record)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
                                  <Edit size={18} />
                                </button>
                                <button onClick={() => handleDeleteWaste(record.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}>
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'proveedores' ? (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              {!profile?.plan?.hasProviders ? (
                <div style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                  minHeight: '60vh', textAlign: 'center', padding: '2rem', background: 'white', 
                  borderRadius: '2rem', border: '1px solid var(--border)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ 
                    width: '100px', height: '100px', background: 'rgba(66, 98, 22, 0.05)', 
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    marginBottom: '2rem', border: '1px solid rgba(66, 98, 22, 0.1)'
                  }}>
                    <Truck size={48} color="var(--corp-green)" />
                  </div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '1rem', maxWidth: '600px', lineHeight: '1.2' }}>
                    {t('providers.restricted_title')}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '650px', marginBottom: '2.5rem', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: t('providers.restricted_desc') }} />
                  <Link 
                    href="/dashboard/plans" 
                    className="btn-primary" 
                    style={{ 
                      padding: '1rem 2rem', fontSize: '1rem', fontWeight: '800', 
                      display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none'
                    }}
                  >
                    <Crown size={20} /> {t('providers.view_plans')}
                  </Link>
                </div>
              ) : (
                <>
                  <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>{t('sidebar.providers') || "Proveedores"}</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{t('dashboard.providers_info') || "Gestiona tu lista de proveedores habituales"}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        onClick={generateProvidersPDF}
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                      >
                        <FileText size={18} /> {t('dashboard.generate_provider_list') || "Sacar un listado"}
                      </button>
                      <button 
                        onClick={() => {
                          setEditingProvider(null);
                          setProvidersForm({ name: "", nif: "", rgs: "", phone: "", address: "", products: "" });
                          setIsProvidersModalOpen(true);
                        }}
                        className="btn-primary" 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                      >
                        <Plus size={18} /> {t('dashboard.add_provider') || "Añadir proveedor"}
                      </button>
                    </div>
                  </header>

                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center', background: 'white', padding: '1rem 1.5rem', borderRadius: '1.25rem', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.5rem' }}>
                      {t('dashboard.filter_by_type')}:
                    </div>
                    <button 
                      onClick={() => setProviderMerchantTypeFilter("")}
                      style={{
                        padding: '0.5rem 1.25rem',
                        borderRadius: '2rem',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '1px solid',
                        background: !providerMerchantTypeFilter ? 'var(--corp-green)' : 'white',
                        color: !providerMerchantTypeFilter ? 'white' : 'var(--text-main)',
                        borderColor: !providerMerchantTypeFilter ? 'var(--corp-green)' : 'var(--border)'
                      }}
                    >
                      {t('common.all')}
                    </button>
                    {(profile?.merchantTypes || []).map((type, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setProviderMerchantTypeFilter(type)}
                        style={{
                          padding: '0.5rem 1.25rem',
                          borderRadius: '2rem',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: '1px solid',
                          background: providerMerchantTypeFilter === type ? 'var(--corp-green)' : 'white',
                          color: providerMerchantTypeFilter === type ? 'white' : 'var(--text-main)',
                          borderColor: providerMerchantTypeFilter === type ? 'var(--corp-green)' : 'var(--border)'
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {providers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: '1.5rem', border: '1px solid var(--border)' }}>
                      <div style={{ width: '80px', height: '80px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Truck size={40} color="var(--border)" />
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>{t('dashboard.no_providers') || "No tienes proveedores"}</h3>
                      <p style={{ color: 'var(--text-muted)' }}>{t('dashboard.no_providers_info') || "Añade tu primer proveedor para tenerlo disponible al recibir mercancías."}</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                      {providers
                        .filter(p => !providerMerchantTypeFilter || (p.merchantTypes && p.merchantTypes.includes(providerMerchantTypeFilter)))
                        .map(provider => (
                        <div key={provider.id} className="glass-card" style={{ padding: '1.5rem', background: 'white', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                              <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>{provider.name}</h4>
                              {provider.nif && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{t('providers.list_nif')}: {provider.nif}</div>}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => handleViewProviderReceipts(provider)} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--corp-green)', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                <FileText size={16} /> {t('dashboard.view_delivery_notes')}
                              </button>
                              <button onClick={() => handleEditProvider(provider)} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--corp-green)', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}><Edit size={16} /></button>
                              <button onClick={() => handleDeleteProvider(provider.id)} style={{ background: 'none', border: '1px solid var(--border)', color: '#ef4444', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          </div>
                          
                          <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-main)' }}>
                            {provider.rgs && (
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{ fontWeight: '700', color: 'var(--text-muted)', minWidth: '40px' }}>{t('providers.list_rgs')}:</span>
                                <span>{provider.rgs}</span>
                              </div>
                            )}
                            {provider.phone && (
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{ fontWeight: '700', color: 'var(--text-muted)', minWidth: '40px' }}>{t('providers.list_phone')}:</span>
                                <span>{provider.phone}</span>
                              </div>
                            )}
                            {provider.address && (
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{ fontWeight: '700', color: 'var(--text-muted)', minWidth: '40px' }}>{t('providers.list_address')}:</span>
                                <span style={{ whiteSpace: 'pre-wrap' }}>{provider.address}</span>
                              </div>
                            )}
                            {provider.products && (
                              <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--corp-green)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t('providers.products')}</div>
                                <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>{provider.products}</div>
                              </div>
                            )}

                            {provider.merchantTypes && provider.merchantTypes.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                                {provider.merchantTypes.map((type, tIdx) => (
                                  <span key={tIdx} style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', background: 'rgba(66, 98, 22, 0.08)', color: 'var(--corp-green)', padding: '0.2rem 0.6rem', borderRadius: '0.5rem', border: '1px solid rgba(66, 98, 22, 0.1)' }}>
                                    {type}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : activeTab === 'entradas' ? (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <header style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <div className="header-content-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>{t('sidebar.goods')}</h2>
                  <PlanUsageIndicator 
                    label={t('dashboard.goods')} 
                    current={goodsReceipts.length} 
                    limit={profile?.plan?.goodsLimit} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.25rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{t('dashboard.goods_info')}</p>
                  <div className="action-buttons-mobile" style={{ display: 'flex', gap: '1rem', width: '100%', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => setIsGoodsReportModalOpen(true)}
                      className="btn-secondary"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
                    >
                      <FileText size={18} /> {t('dashboard.generate_goods_report')}
                    </button>
                    <button 
                      onClick={() => setVideoModal({ isOpen: true, videoId: locale === 'en' ? 'raxn-Z7o3No' : "8_qOTe6RrHk" })}
                      className="btn-help-video"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
                    >
                      <PlayCircle size={18} /> {t('dashboard.video_help')}
                    </button>
                    <button 
                      onClick={() => setIsManageMerchantTypesModalOpen(true)}
                      className="btn-secondary"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
                    >
                      <Settings size={18} /> {t('modals.manage_merchant_types') || "Gestionar tipos de mercancía"}
                    </button>
                    <button
                      onClick={() => setIsIngredientCostsModalOpen(true)}
                      className="btn-secondary"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
                    >
                      <DollarSign size={18} /> {t('dashboard.ingredient_costs_btn') || "Precios de coste"}
                    </button>
                    {profile?.hasIaGoods && (
                    <button 
                      onClick={() => {
                        if (isRecipeLimitExceeded()) {
                          setIsRecipeOverlimitModalOpen(true);
                          return;
                        }
                        setIsIaScanModalOpen(true);
                      }}
                      className="btn-primary"
                      style={{ 
                        flex: 1,
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '0.75rem', 
                        padding: '0.75rem 1.5rem', 
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                        boxShadow: '0 4px 10px rgba(124, 58, 237, 0.15)'
                      }}
                    >
                      <Sparkles size={18} /> {t('dashboard.scan_invoice_ia') || "Escanear albarán con IA"}
                    </button>
                    )}
                    {profile?.hasIaGoods && (
                    <button 
                      onClick={() => setIsScannedInvoicesModalOpen(true)}
                      className="btn-secondary"
                      style={{ 
                        flex: 1,
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '0.75rem', 
                        padding: '0.75rem 1.5rem', 
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <FileText size={18} /> {t('dashboard.view_scanned_invoices') || "Ver albaranes escaneados"}
                    </button>
                    )}
                    <button 
                      onClick={() => {
                        if (isRecipeLimitExceeded()) {
                          setIsRecipeOverlimitModalOpen(true);
                          return;
                        }
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
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
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
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('dashboard.filter_by_type')}</label>
                  <select 
                    className="input-field"
                    value={goodsFilters.merchantType}
                    onChange={(e) => setGoodsFilters({...goodsFilters, merchantType: e.target.value})}
                  >
                    <option value="">{t('common.all')}</option>
                    {(profile?.merchantTypes || []).map((type, idx) => (
                      <option key={idx} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('goods_receipt_form.product')}</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder={t('goods_receipt_form.product') + "..."}
                    value={goodsFilters.productName || ""}
                    onChange={(e) => setGoodsFilters({...goodsFilters, productName: e.target.value})}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('goods_receipt_form.provider')}</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder={t('goods_receipt_form.provider') + "..."}
                    value={goodsFilters.providerName || ""}
                    onChange={(e) => setGoodsFilters({...goodsFilters, providerName: e.target.value})}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('traceability_form.lot')}</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder={t('traceability_form.lot') + "..."}
                    value={goodsFilters.lote || ""}
                    onChange={(e) => setGoodsFilters({...goodsFilters, lote: e.target.value})}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label className="label" style={{ fontSize: '0.75rem' }}>{t('dashboard.items_limit') || "Límite de registros"}</label>
                  <select 
                    className="input-field"
                    value={goodsFilters.limit || "40"}
                    onChange={(e) => setGoodsFilters({...goodsFilters, limit: e.target.value})}
                  >
                    <option value="40">40</option>
                    <option value="80">80</option>
                    <option value="120">120</option>
                    <option value="150">150</option>
                  </select>
                </div>
                  <button 
                    onClick={() => setGoodsFilters({ startDate: "", endDate: "", merchantType: "", productName: "", providerName: "", lote: "", limit: "40" })}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: '0.5rem' }}
                  >
                    {t('dashboard.cancel')}
                  </button>
                  {goodsReceipts.length > 0 && (
                    <button 
                      onClick={() => {
                        toggleSelectAll(filteredGoodsReceipts);
                      }}
                      className="btn-secondary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                    >
                      {filteredGoodsReceipts.every(r => selectedRecords.includes(r.id)) ? t('bulk_actions.deselect_all') || "Deseleccionar todos" : t('bulk_actions.select_all') || "Seleccionar todos"}
                    </button>
                  )}
                </div>

              {(!goodsFilters.startDate || !goodsFilters.endDate) && goodsReceipts.length > 0 && (
                <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(66, 98, 22, 0.05)', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(66, 98, 22, 0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Zap size={18} color="var(--corp-green)" />
                  <span style={{ fontSize: '0.95rem', color: 'var(--corp-green)', fontWeight: '800' }}>
                    {t('dashboard.showing_last_count', { count: goodsFilters.limit || "40" })}
                  </span>
                </div>
              )}

              {filteredGoodsReceipts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: '1.5rem', border: '2px dashed var(--border)' }}>
                  <div style={{ width: '80px', height: '80px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Truck size={40} color="var(--border)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>{t('dashboard.no_records')}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>{t('dashboard.no_records')}</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                  {filteredGoodsReceipts.map(receipt => (
                    <div key={receipt.id} className="glass-card" style={{ 
                      background: selectedRecords.includes(receipt.id) ? '#f0fdf4' : 'white', 
                      padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
                      border: selectedRecords.includes(receipt.id) ? '2px solid var(--corp-green)' : '1px solid var(--border)',
                      position: 'relative'
                    }}>
                      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '800' }}>SEL.</span>
                        <input 
                          type="checkbox" 
                          style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer', accentColor: 'var(--corp-green)', border: '2px solid #cbd5e1', borderRadius: '0.25rem' }}
                          checked={selectedRecords.includes(receipt.id)}
                          onChange={() => toggleSelectRecord(receipt.id)}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--corp-green)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            {new Date(receipt.date).toLocaleDateString()}
                          </div>
                          <h4 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>{receipt.productName}</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                              <Truck size={16} /> {receipt.providerName || 'Sin proveedor'}
                            </p>
                            {(() => {
                              const matchingProvider = providers.find(p => p.id === receipt.providerId || (receipt.providerName && p.name === receipt.providerName));
                              if (matchingProvider) {
                                return (
                                  <button 
                                    onClick={() => handleViewProviderReceipts(matchingProvider)}
                                    style={{ 
                                      background: 'none', border: 'none', padding: 0, 
                                      color: 'var(--corp-green)', fontSize: '0.75rem', fontWeight: '800',
                                      textDecoration: 'underline', cursor: 'pointer', textAlign: 'left',
                                      display: 'flex', alignItems: 'center', gap: '0.25rem'
                                    }}
                                  >
                                    <FileText size={12} /> {t('dashboard.view_delivery_notes')}
                                  </button>
                                );
                              }
                              return null;
                            })()}
                          </div>
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

                      {receipt.merchantTypes && receipt.merchantTypes.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '-0.25rem', marginBottom: '0.5rem' }}>
                          {receipt.merchantTypes.map((type, tIdx) => (
                            <span key={tIdx} style={{ fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase', background: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6', padding: '0.15rem 0.5rem', borderRadius: '0.4rem', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                              {type}
                            </span>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', fontSize: '0.9rem', border: '1px solid var(--border)' }}>
                        <div>
                          <span style={{ display: 'block', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t('dashboard.lote')}</span>
                          <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>{receipt.lote || '-'}</span>
                        </div>
                        <div>
                          <span style={{ display: 'block', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>CANTIDAD</span>
                          <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>{receipt.quantity || '-'}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span className="info-label">{t('goods_receipt_form.invoice_number')}</span>
                          <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>{receipt.invoiceNumber || '-'}</span>
                        </div>
                        {(receipt.manufacturingTemp || receipt.endDate || receipt.typeAndOrigin) && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', gridColumn: 'span 2' }}>
                            {receipt.manufacturingTemp && <div><span className="info-label" style={{display:'inline-block', marginRight:'0.5rem'}}>{t('goods_receipt_form.temp')}:</span> <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>{receipt.manufacturingTemp}</span></div>}
                            {receipt.endDate && <div><span className="info-label" style={{display:'inline-block', marginRight:'0.5rem'}}>{t('goods_receipt_form.end_date') || "Fecha finalización"}:</span> <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>{receipt.endDate}</span></div>}
                            {receipt.typeAndOrigin && <div><span className="info-label" style={{display:'inline-block', marginRight:'0.5rem'}}>{t('goods_receipt_form.type_and_origin') || "Tipo y procedencia"}:</span> <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>{receipt.typeAndOrigin}</span></div>}
                          </div>
                        )}
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
                    ))}
                </div>
              )}
            </div>
          ) : activeTab === 'limpieza' ? (
            <div>
              <header style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <div className="header-content-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>{t('sidebar.cleaning')}</h2>
                  <PlanUsageIndicator 
                    label={t('dashboard.cleaning')}
                    current={cleaningLogs.length} 
                    limit={profile?.plan?.cleaningLimit} 
                    hideLimit={true}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.25rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{t('dashboard.cleaning_info')}</p>
                </div>
              </header>

              <div className="action-buttons-mobile" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => setVideoModal({ isOpen: true, videoId: locale === 'en' ? 'WwEylvzD3rc' : "62WLwGwTvew" })}
                    className="btn-help-video"
                  >
                    <PlayCircle size={18} /> {t('dashboard.video_help')}
                  </button>
                  <button 
                    onClick={() => setIsCleaningExportModalOpen(true)}
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                  >
                    <FileText size={18} /> {t('dashboard.generate_cleaning_report')}
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
                      if (isRecipeLimitExceeded()) {
                        setIsRecipeOverlimitModalOpen(true);
                        return;
                      }
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
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                      <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                          <th style={{ padding: '0.75rem 1rem', width: '60px', textAlign: 'center', borderRight: '1px solid var(--border)', background: '#f1f5f9' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '800' }}>SEL.</span>
                              <input 
                                type="checkbox" 
                                style={{ cursor: 'pointer', accentColor: 'var(--corp-green)', width: '1.25rem', height: '1.25rem', border: '2px solid #cbd5e1', borderRadius: '0.25rem' }}
                                checked={cleaningLogs.length > 0 && cleaningLogs.filter(log => {
                                  const date = new Date(log.date);
                                  const start = new Date(cleaningFilters.startDate);
                                  const end = new Date(cleaningFilters.endDate);
                                  end.setHours(23, 59, 59, 999);
                                  return date >= start && date <= end;
                                }).every(log => selectedRecords.includes(log.id))}
                                onChange={() => toggleSelectAll(cleaningLogs.filter(log => {
                                  const date = new Date(log.date);
                                  const start = new Date(cleaningFilters.startDate);
                                  const end = new Date(cleaningFilters.endDate);
                                  end.setHours(23, 59, 59, 999);
                                  return date >= start && date <= end;
                                }))}
                              />
                            </div>
                          </th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> Persona</div>
                          </th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> Fecha y Hora</div>
                          </th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Zonas Limpiadas
                          </th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {t('common.notes_corrective')}
                          </th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cleaningLogs
                          .filter(log => {
                            const date = new Date(log.date);
                            const start = new Date(cleaningFilters.startDate);
                            const end = new Date(cleaningFilters.endDate);
                            end.setHours(23, 59, 59, 999);
                            return date >= start && date <= end;
                          })
                          .map(log => (
                          <tr key={log.id} style={{ borderBottom: '1px solid var(--border)', background: selectedRecords.includes(log.id) ? '#f0fdf4' : 'white' }}>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', borderRight: '1px solid var(--border)', background: selectedRecords.includes(log.id) ? '#f0fdf4' : '#f8fafc' }}>
                              <input 
                                type="checkbox" 
                                style={{ cursor: 'pointer', accentColor: 'var(--corp-green)', width: '1.25rem', height: '1.25rem', border: '2px solid #cbd5e1', borderRadius: '0.25rem', display: 'block', margin: '0 auto' }}
                                checked={selectedRecords.includes(log.id)}
                                onChange={() => toggleSelectRecord(log.id)}
                              />
                            </td>
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
                            <td style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)', fontSize: '0.9rem', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                              {log.notes || "-"}
                            </td>
                            <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button 
                                  onClick={() => handleEditCleaning(log)}
                                  style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--corp-green)', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                                >
                                  <Edit size={16} />
                                </button>
                                {session?.user?.role !== "WORKER" && (
                                  <button 
                                    onClick={() => handleDeleteCleaning(log.id)}
                                    style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'temperaturas' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <header style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <div className="header-content-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>{t('sidebar.temperatures')}</h2>
                  <PlanUsageIndicator 
                    label={t('sidebar.temperatures')} 
                    current={tempRecords.length} 
                    limit={profile?.plan?.temperaturesLimit} 
                    hideLimit={true}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.25rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{t('dashboard.temperature_info')}</p>
                  <div className="action-buttons-mobile" style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={() => setVideoModal({ isOpen: true, videoId: locale === 'en' ? 'BLOFFbJGTdw' : "TKl-sUpuDGg" })}
                      className="btn-help-video"
                    >
                      <PlayCircle size={18} /> {t('dashboard.video_help')}
                    </button>
                    <button 
                      onClick={() => setIsTempExportModalOpen(true)}
                      className="btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                    >
                      <FileText size={18} /> {t('dashboard.generate_temp_report')}
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
                        if (isRecipeLimitExceeded()) {
                          setIsRecipeOverlimitModalOpen(true);
                          return;
                        }
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
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                      <tr>
                        <th style={{ padding: '0.75rem 1rem', width: '60px', textAlign: 'center', borderRight: '1px solid var(--border)', background: '#f1f5f9' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '800' }}>SEL.</span>
                            <input 
                              type="checkbox" 
                              style={{ cursor: 'pointer', accentColor: 'var(--corp-green)', width: '1.25rem', height: '1.25rem', border: '2px solid #cbd5e1', borderRadius: '0.25rem' }}
                              checked={tempRecords.length > 0 && tempRecords.filter(r => {
                                const date = new Date(r.date);
                                const start = new Date(tempFilters.startDate);
                                const end = new Date(tempFilters.endDate);
                                end.setHours(23, 59, 59, 999);
                                return date >= start && date <= end;
                              }).every(r => selectedRecords.includes(r.id))}
                              onChange={() => toggleSelectAll(tempRecords.filter(r => {
                                const date = new Date(r.date);
                                const start = new Date(tempFilters.startDate);
                                const end = new Date(tempFilters.endDate);
                                end.setHours(23, 59, 59, 999);
                                return date >= start && date <= end;
                              }))}
                            />
                          </div>
                        </th>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fecha y Hora</th>
                        {chambers.map(chamber => (
                          <th key={chamber.id} style={{ padding: '1.25rem 2rem', textAlign: 'center', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{chamber.name}</th>
                        ))}
                        <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('common.notes_corrective')}</th>
                        <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tempRecords
                        .filter(record => {
                          const date = new Date(record.date);
                          const start = new Date(tempFilters.startDate);
                          const end = new Date(tempFilters.endDate);
                          end.setHours(23, 59, 59, 999);
                          return date >= start && date <= end;
                        })
                        .map(record => (
                        <tr key={record.id} style={{ borderBottom: '1px solid var(--border)', background: selectedRecords.includes(record.id) ? '#f0fdf4' : 'white' }}>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', borderRight: '1px solid var(--border)', background: selectedRecords.includes(record.id) ? '#f0fdf4' : '#f8fafc' }}>
                            <input 
                              type="checkbox" 
                              style={{ cursor: 'pointer', accentColor: 'var(--corp-green)', width: '1.25rem', height: '1.25rem', border: '2px solid #cbd5e1', borderRadius: '0.25rem', display: 'block', margin: '0 auto' }}
                              checked={selectedRecords.includes(record.id)}
                              onChange={() => toggleSelectRecord(record.id)}
                            />
                          </td>
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
                          <td style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={record.notes || ""}>
                            {record.notes || "-"}
                          </td>
                          <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleEditTemp(record)}
                                style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--corp-green)', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                              >
                                <Edit size={16} />
                              </button>
                              {session?.user?.role !== "WORKER" && (
                                <button 
                                  onClick={() => handleDeleteTemp(record.id)}
                                  style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeTab === 'agua' ? (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <header style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <div className="header-content-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>{t('sidebar.water') || "Agua"}</h2>
                  <PlanUsageIndicator 
                    label={t('sidebar.water') || "Agua"} 
                    current={waterMeasurements.length} 
                    limit={profile?.plan?.waterLimit} 
                    hideLimit={true}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.25rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{t('water.description') || "Registra y gestiona las mediciones de calidad del agua."}</p>
                  <div className="action-buttons-mobile" style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={() => setIsWaterExportModalOpen(true)}
                      className="btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                    >
                      <FileText size={18} /> {t('water.generate_report') || "Sacar un informe"}
                    </button>
                    <button 
                      onClick={() => {
                        if (isRecipeLimitExceeded()) {
                          setIsRecipeOverlimitModalOpen(true);
                          return;
                        }
                        setEditingWaterMeasurement(null);
                        setWaterForm({
                          date: new Date().toISOString().slice(0, 16),
                          samplingPoint: "",
                          chlorine: "",
                          ph: "",
                          turbidity: false,
                          odor: false,
                          flavor: false,
                          color: false,
                          responsible: "",
                          receiptImage: "",
                          notes: ""
                        });
                        setIsWaterModalOpen(true);
                      }}
                      className="btn-primary" 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                    >
                      <Plus size={18} /> {t('water.new_measurement') || "Nueva medición"}
                    </button>
                  </div>
                </div>
              </header>

              {waterMeasurements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', border: '1px solid var(--border)', borderRadius: '1.5rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Droplets size={40} color="var(--border)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('sidebar.water') || "Agua"}</h3>
                  <p>{t('dashboard.no_records')}</p>
                </div>
              ) : (
                <div className="glass-card" style={{ background: 'white', overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                      <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('dashboard.date')}</th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('water.sampling_point') || "Punto de muestreo"}</th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('water.chlorine') || "Cloro"}</th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('water.ph') || "pH"}</th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'center' }}>{t('water.table_checks')}</th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('water.responsible') || "Responsable"}</th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'center' }}>{t('water.receipt') || "Recibo"}</th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('common.notes_corrective')}</th>
                          <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>{t('dashboard.actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {waterMeasurements.map(m => (
                          <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover-row">
                            <td style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)' }}>{new Date(m.date).toLocaleString()}</td>
                            <td style={{ padding: '1.5rem 2rem', fontWeight: '700', color: 'var(--text-main)' }}>{m.samplingPoint || '-'}</td>
                            <td style={{ padding: '1.5rem 2rem', color: 'var(--text-main)', fontWeight: '800' }}>{m.chlorine} mg/l</td>
                            <td style={{ padding: '1.5rem 2rem', color: 'var(--text-main)', fontWeight: '800' }}>{m.ph || '-'}</td>
                            <td style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                <span title={t('water.turbidity')} style={{ color: m.turbidity ? '#ef4444' : '#10b981', fontWeight: '900' }}>{t('water.check_t')}</span>
                                <span title={t('water.odor')} style={{ color: m.odor ? '#ef4444' : '#10b981', fontWeight: '900' }}>{t('water.check_o')}</span>
                                <span title={t('water.flavor')} style={{ color: m.flavor ? '#ef4444' : '#10b981', fontWeight: '900' }}>{t('water.check_s')}</span>
                                <span title={t('water.color')} style={{ color: m.color ? '#ef4444' : '#10b981', fontWeight: '900' }}>{t('water.check_c')}</span>
                              </div>
                            </td>
                            <td style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)' }}>{m.responsible || '-'}</td>
                            <td style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
                              {m.receiptImage && (
                                <button 
                                  onClick={() => setViewingImage(m.receiptImage)}
                                  style={{ background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0ea5e9', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                                  title={t('common.view_image') || "Ver imagen"}
                                >
                                  <Camera size={16} />
                                </button>
                              )}
                            </td>
                            <td style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={m.notes || ""}>
                              {m.notes || "-"}
                            </td>
                            <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button 
                                  onClick={() => handleEditWater(m)}
                                  style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--corp-green)', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                                >
                                  <Edit size={16} />
                                </button>
                                {session?.user?.role !== "WORKER" && (
                                  <button 
                                    onClick={() => handleDeleteWater(m.id)}
                                    style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'trabajadores' ? (
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '0.5rem' }}>{t('workers.title') || "Gestión de Trabajadores"}</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('workers.subtitle') || "Crea y gestiona los accesos de tu personal."}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => setVideoModal({ isOpen: true, videoId: "5dVfgYOSx_U" })}
                    className="btn-help-video"
                  >
                    <PlayCircle size={18} /> {t('workers.video_help_btn') || "Para qué sirve esta sección"}
                  </button>
                  <button 
                    onClick={() => {
                      setEditingWorker(null);
                      setWorkerForm({
                        name: '', email: '', password: '', 
                        permissions: { hasTraceability: false, hasCleaning: false, hasTemperatures: false, hasWater: false, hasGoods: false }
                      });
                      setIsWorkerModalOpen(true);
                    }}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1.5rem' }}
                  >
                    <UserPlus size={20} /> {t('workers.add_btn') || "Añadir Trabajador"}
                  </button>
                </div>
              </div>

              <div className="glass-card" style={{ background: 'white', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                      <tr>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('workers.name') || "Nombre"}</th>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('workers.user') || "Usuario/Email"}</th>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('workers.permissions') || "Permisos"}</th>
                        <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>{t('dashboard.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workers.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            {t('workers.no_workers') || "No has añadido ningún trabajador todavía."}
                          </td>
                        </tr>
                      ) : (
                        workers.map(worker => (
                        <tr key={worker.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover-row">
                          <td style={{ padding: '1.5rem 2rem', fontWeight: '700', color: 'var(--text-main)' }}>{worker.name}</td>
                          <td style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)' }}>{worker.user?.email}</td>
                          <td style={{ padding: '1.5rem 2rem' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {worker.hasTraceability && <span style={{ padding: '0.2rem 0.6rem', borderRadius: '1rem', background: '#ecfdf5', color: '#059669', fontSize: '0.7rem', fontWeight: '700' }}>Trazabilidad</span>}
                              {worker.hasCleaning && <span style={{ padding: '0.2rem 0.6rem', borderRadius: '1rem', background: '#eff6ff', color: '#2563eb', fontSize: '0.7rem', fontWeight: '700' }}>Limpieza</span>}
                              {worker.hasTemperatures && <span style={{ padding: '0.2rem 0.6rem', borderRadius: '1rem', background: '#fef2f2', color: '#dc2626', fontSize: '0.7rem', fontWeight: '700' }}>Temperaturas</span>}
                              {worker.hasWater && <span style={{ padding: '0.2rem 0.6rem', borderRadius: '1rem', background: '#f0f9ff', color: '#0ea5e9', fontSize: '0.7rem', fontWeight: '700' }}>Agua</span>}
                              {worker.hasGoods && <span style={{ padding: '0.2rem 0.6rem', borderRadius: '1rem', background: '#fefce8', color: '#ca8a04', fontSize: '0.7rem', fontWeight: '700' }}>Mercancías</span>}
                            </div>
                          </td>
                          <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => {
                                  setEditingWorker(worker);
                                  setWorkerForm({
                                    name: worker.name,
                                    email: worker.user?.email,
                                    password: '',
                                    permissions: {
                                      hasTraceability: worker.hasTraceability,
                                      hasCleaning: worker.hasCleaning,
                                      hasTemperatures: worker.hasTemperatures,
                                      hasWater: worker.hasWater,
                                      hasGoods: worker.hasGoods
                                    }
                                  });
                                  setIsWorkerModalOpen(true);
                                }}
                                style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--corp-green)', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteWorker(worker.id)}
                                style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          ) : activeTab === 'gestionar-recetas' ? (
            <div>
              <header style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <div className="header-content-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>{t('sidebar.manage_recipes')}</h2>
                  <PlanUsageIndicator 
                    label={t('dashboard.manage_recipes')} 
                    current={recipes.length} 
                    limit={profile?.plan?.recipesLimit} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.25rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{t('dashboard.recipe_manage_desc')}</p>
                  <div className="action-buttons-mobile" style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={() => setVideoModal({ isOpen: true, videoId: locale === 'en' ? 'Pmj3w3GaLKM' : "yKJbPZQUTNM" })}
                      className="btn-help-video"
                    >
                      <PlayCircle size={18} /> {t('dashboard.video_help')}
                    </button>
                    <button 
                      onClick={() => {
                        setEditingRecipe(null);
                        setRecipeForm({ 
                          name: "", 
                          ingredients: [{ name: "", amount: "", unit: "", loteMandatory: false, quantityMandatory: false, expandItem: false, expandedText: "" }], 
                          hasBarcode: false, 
                          barcode: "",
                          expiryDays: 0,
                          expiryType: "EXPIRATION",
                          elaborationInstructions: "",
                          conservationInstructions: "",
                          energyValue: "",
                          fats: "",
                          saturatedFats: "",
                          carbohydrates: "",
                          sugars: "",
                          proteins: "",
                          salt: "",
                          allergens: []
                        });
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

              <div style={{ marginBottom: '2.5rem', maxWidth: '600px' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Search size={22} style={{ position: 'absolute', left: '1.25rem', color: 'var(--text-muted)', zIndex: 1 }} />
                  <input 
                    type="text" 
                    placeholder={t('common.search')} 
                    value={recipeSearchTerm}
                    onChange={(e) => setRecipeSearchTerm(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '3.5rem', height: '3.75rem', fontSize: '1.05rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderRadius: '1rem' }}
                  />
                </div>
              </div>

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
                        setRecipeForm({ 
                          name: "", 
                          ingredients: [{ name: "", amount: "", unit: "", loteMandatory: false, quantityMandatory: false, expandItem: false, expandedText: "" }], 
                          hasBarcode: false, 
                          barcode: "",
                          expiryDays: 0,
                          expiryType: "EXPIRATION",
                          elaborationInstructions: "",
                          conservationInstructions: "",
                          energyValue: "",
                          fats: "",
                          saturatedFats: "",
                          carbohydrates: "",
                          sugars: "",
                          proteins: "",
                          salt: "",
                          allergens: []
                        });
                        setIsRecipeManageModalOpen(true);
                      }}
                      className="btn-primary"
                    >
                      {t('dashboard.create_first_recipe')}
                    </button>
                  </div>
                ) : (
                  recipes
                    .filter(recipe => recipe.name.toLowerCase().includes(recipeSearchTerm.toLowerCase()))
                    .map(recipe => (
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
                        
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button 
                            onClick={() => handleDuplicateRecipe(recipe)}
                            className="btn-secondary"
                            style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                          >
                            <Plus size={14} /> {t('common.duplicate') || "Duplicar"}
                          </button>
                          <button 
                            onClick={() => handleOpenRecipe(recipe)}
                            className="btn-primary"
                            style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                          >
                            <PlayCircle size={14} /> {t('dashboard.elaborar') || "Elaborar"}
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          ) : activeTab === 'configuracion' ? (
            <BusinessConfigView 
              profile={profile}
              onUpdate={handleUpdateProfile}
              loading={loading}
            />
          ) : activeTab === 'afiliados' ? (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
                  {t('affiliate.dashboard_title')}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                  {t('affiliate.dashboard_desc')}
                </p>
              </header>

              {!profile?.isAffiliate ? (
                <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto', background: 'white', padding: '3rem', textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(66, 98, 22, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                    <ArrowUpCircle size={40} color="var(--corp-green)" />
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem' }}>{t('affiliate.welcome_header')}</h3>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                    {t('affiliate.explanation')}
                  </p>
                  
                  <div style={{ textAlign: 'left', background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', marginBottom: '2.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={acceptAffiliateTerms}
                        onChange={(e) => setAcceptAffiliateTerms(e.target.checked)}
                        style={{ width: '1.25rem', height: '1.25rem', marginTop: '0.2rem', accentColor: 'var(--corp-green)' }}
                      />
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                        {t('affiliate.i_accept')}{' '}
                        <a href="https://quicktrace.es/programa-de-recomendacion" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--corp-green)', fontWeight: '700', textDecoration: 'underline' }}>
                          {t('affiliate.conditions_link')}
                        </a>
                      </span>
                    </label>
                  </div>

                  <button 
                    onClick={handleJoinAffiliate}
                    disabled={!acceptAffiliateTerms || isJoiningAffiliate}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                  >
                    {isJoiningAffiliate ? <Loader2 className="animate-spin" size={24} /> : t('affiliate.btn_start')}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  {/* Referral Link Card */}
                  <div className="glass-card" style={{ background: 'white', padding: '2rem', border: '2px solid var(--corp-green)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--corp-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Zap size={20} /> {t('affiliate.your_referral_link')}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input 
                        readOnly 
                        className="input-field" 
                        value={`${typeof window !== 'undefined' ? window.location.protocol : 'https:'}//${typeof window !== 'undefined' ? window.location.host : 'quicktrace.es'}/register?ref=${profile?.referralCode || affiliateData.referralCode}`}
                        style={{ flex: 1, background: '#f8fafc', fontWeight: '600', color: 'var(--text-muted)' }}
                      />
                      <button 
                        onClick={() => {
                          const link = `${window.location.protocol}//${window.location.host}/register?ref=${profile?.referralCode || affiliateData.referralCode}`;
                          navigator.clipboard.writeText(link);
                          alert(t('affiliate.copied_alert') || "Enlace copiado al portapapeles");
                        }}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
                      >
                        {t('affiliate.btn_copy')}
                      </button>
                    </div>
                  </div>

                  {/* Stats Table */}
                  <div className="glass-card" style={{ background: 'white', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', background: '#f8fafc' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>{t('affiliate.stats_header')}</h3>
                    </div>
                    {affiliateData.loading ? (
                      <div style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={32} color="var(--corp-green)" /></div>
                    ) : affiliateData.referrals.length === 0 ? (
                      <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <User size={48} color="var(--border)" style={{ marginBottom: '1.5rem' }} />
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('affiliate.no_referrals_title')}</h4>
                        <p>{t('affiliate.no_referrals_desc')}</p>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                          <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                            <tr>
                              <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('common.date')}</th>
                              <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('affiliate.table_user')}</th>
                              <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>{t('affiliate.table_paid') || 'Total Pagado'}</th>
                              <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>{t('affiliate.commission_column')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {affiliateData.referrals.map(ref => (
                              <tr key={ref.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)' }}>{new Date(ref.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '1.5rem 2rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                  {ref.user?.email}
                                  <div style={{ fontSize: '0.8rem', fontWeight: '400', color: 'var(--text-muted)' }}>{ref.razonSocial || 'Empresa pendiente'}</div>
                                </td>
                                <td style={{ padding: '1.5rem 2rem', textAlign: 'right', fontWeight: '600' }}>
                                  {(ref.totalPaidFromStripe || 0).toFixed(2)} €
                                </td>
                                <td style={{ padding: '1.5rem 2rem', textAlign: 'right', fontWeight: '800', color: 'var(--corp-green)' }}>
                                  {(ref.commission || 0).toFixed(2)} €
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Referral Payments Table */}
                  <div className="glass-card" style={{ background: 'white', overflow: 'hidden', marginTop: '2.5rem' }}>
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', background: '#f8fafc' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>{t('affiliate.payments_header')}</h3>
                    </div>
                    {affiliateData.loading ? (
                      <div style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={32} color="var(--corp-green)" /></div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                          <tr>
                            <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('common.date')}</th>
                            <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('affiliate.table_user')}</th>
                            <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'center' }}>{t('common.amount')}</th>
                            <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'center' }}>{t('affiliate.commission_column')}</th>
                            <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>{t('common.status')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {affiliateData.payments?.length === 0 ? (
                            <tr>
                              <td colSpan={5} style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <Zap size={32} color="var(--border)" style={{ marginBottom: '1rem' }} />
                                <p>{t('affiliate.no_payments_desc')}</p>
                              </td>
                            </tr>
                          ) : (
                            affiliateData.payments?.map(pay => (
                              <tr key={pay.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)' }}>{new Date(pay.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '1.5rem 2rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                  {pay.clientProfile?.user?.email}
                                  <div style={{ fontSize: '0.8rem', fontWeight: '400', color: 'var(--text-muted)' }}>{pay.clientProfile?.razonSocial}</div>
                                </td>
                                <td style={{ padding: '1.5rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                  {pay.amount.toFixed(2)} {pay.currency?.toUpperCase()}
                                </td>
                                <td style={{ padding: '1.5rem 2rem', textAlign: 'center', fontWeight: '700', color: 'var(--corp-green)' }}>
                                  {(pay.amount * 0.05).toFixed(2)} {pay.currency?.toUpperCase()}
                                </td>
                                <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                  <span style={{ color: '#10b981', fontWeight: '800', fontSize: '0.85rem' }}>{t('common.success')}</span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  </div>

                  {/* Settlements Table */}
                  <div className="glass-card" style={{ background: 'white', overflow: 'hidden', marginTop: '2.5rem' }}>
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', background: '#f8fafc' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>{t('affiliate.settlements_header')}</h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                          <tr>
                            <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('common.date')}</th>
                            <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('affiliate.date_collected')}</th>
                            <th style={{ padding: '1.25rem 2rem', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>{t('common.status')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {affiliateData.settlements?.length === 0 ? (
                            <tr>
                              <td colSpan={3} style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <p>{t('affiliate.no_settlements_desc')}</p>
                              </td>
                            </tr>
                          ) : (
                            affiliateData.settlements?.map(s => (
                              <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1.25rem 2rem', color: 'var(--text-muted)' }}>
                                  {new Date(s.date).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '1.25rem 2rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                  {s.amount.toFixed(2)} €
                                  <div style={{ fontSize: '0.8rem', fontWeight: '400', color: 'var(--text-muted)' }}>
                                    {s.notes || 'Liquidación de comisiones'}
                                  </div>
                                </td>
                                <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                  <span style={{ color: '#10b981', fontWeight: '800', fontSize: '0.85rem' }}>
                                    {t('common.success') || 'Completado'}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary and Request Button */}
                  <div style={{ marginTop: '3rem', padding: '2rem', background: '#f8fafc', borderRadius: '1.5rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <h4 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '800' }}>
                      {t('affiliate.pending_commissions')}
                    </h4>
                    <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--corp-green)', marginBottom: '0.5rem' }}>
                      {(affiliateData.pendingCommission || 0).toFixed(2)} €
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '2rem', lineHeight: '1.4' }}>
                      Las liquidaciones incluyen un 21% de impuestos.<br />
                      La cantidad neta es: <strong>{((affiliateData.pendingCommission || 0) / 1.21).toFixed(2)} €</strong>
                    </p>
                    <button 
                      onClick={() => alert(t('affiliate.payout_request_info'))}
                      style={{
                        padding: '1rem 2.5rem', borderRadius: '1rem', border: 'none',
                        background: 'var(--corp-green)', color: 'white', fontWeight: '800',
                        fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(66, 98, 22, 0.2)',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.filter = 'brightness(1.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.filter = 'brightness(1)';
                      }}
                    >
                      {t('affiliate.btn_request_payout')}
                    </button>
                  </div>
                </div>
              )}
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
                  <label className="label" style={{ fontSize: '0.7rem' }}>{t('dashboard.elaboration_batch_search')}</label>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      className="input-field" 
                      style={{ paddingLeft: '2.5rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }} 
                      placeholder={t('dashboard.elaboration_batch_placeholder')}
                      value={elabFilters.loteElab}
                      onChange={(e) => setElabFilters({...elabFilters, loteElab: e.target.value})}
                    />
                  </div>
                </div>

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
                      setElabFilters({ lote: "", loteElab: "", startDate: "", endDate: "", recipeId: "all" });
                      setCurrentPage(1);
                    }}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem' }}
                  >
                    <Trash2 size={14} /> {t('dashboard.clear_filters')}
                  </button>
                </div>
              </div>
              
              <div className="glass-card" style={{ background: 'white', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                      <tr>
                        <th onClick={() => handleSort('date')} style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {t('dashboard.elaboration_date_header')} {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('name')} style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {t('traceability_form.elaboration_title')} {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('recipe')} style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {t('dashboard.elaboration_recipe_header')} {sortConfig.key === 'recipe' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('costPrice')} style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span>{t('dashboard.cost_header')} {sortConfig.key === 'costPrice' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</span>
                            <span 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setSelectedElaborationForCosts(null);
                                setIsIngredientCostsModalOpen(true); 
                              }} 
                              style={{ fontSize: '0.65rem', textTransform: 'none', color: 'var(--corp-green)', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}
                            >
                              {t('dashboard.assign_costs_link')}
                            </span>
                          </div>
                        </th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {t('dashboard.elaboration_prep_time_header')}
                        </th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {t('dashboard.labor_cost_header')}
                        </th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('dashboard.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedElaborations.map(elab => (
                        <tr key={elab.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>
                            {formatDateTimeDDMMYYYY(elab.date)}
                          </td>
                          <td style={{ padding: '1.25rem 1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                              <span style={{ fontWeight: '700', color: 'var(--corp-green)' }}>{elab.name}</span>
                              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem', flexWrap: 'wrap' }}>
                                <span 
                                  onClick={() => handleViewElaborationOnly(elab)} 
                                  style={{ color: 'var(--corp-green)', cursor: 'pointer', textDecoration: 'underline', fontWeight: '700' }}
                                >
                                  {t('dashboard.view_elaboration') || "Ver elaboración"}
                                </span>
                                <span 
                                  onClick={() => handleExportElaborationPDF(elab)} 
                                  style={{ color: '#0ea5e9', cursor: 'pointer', textDecoration: 'underline', fontWeight: '700' }}
                                >
                                  {t('dashboard.export_pdf_short') || "Exportar PDF"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1.25rem 1.5rem' }}>
                            <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(66, 98, 22, 0.08)', color: 'var(--corp-green)', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: '700' }}>
                              {elab.recipe.name}
                            </span>
                          </td>
                          <td style={{ padding: '1.25rem 1.5rem', fontVariantNumeric: 'tabular-nums', fontWeight: '600' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              <span>{elab.costPrice ? formatPrice(elab.costPrice, profile?.currency, locale) : '-'}</span>
                              {elab.recipe && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenRecipeCostModal(elab);
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    fontSize: '0.7rem',
                                    color: 'var(--corp-green)',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontWeight: '600',
                                    textAlign: 'left'
                                  }}
                                >
                                  {t('dashboard.assign_recipe_costs_btn') || "Asigna coste a cada ingrediente de esta receta"}
                                </button>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-main)' }}>
                            {elab.preparationTime ? `${elab.preparationTime} min` : '-'}
                          </td>
                          <td style={{ padding: '1.25rem 1.5rem', fontVariantNumeric: 'tabular-nums', fontWeight: '600', color: 'var(--text-main)' }}>
                            {elab.preparationTime && (elab.laborCostHourlyRate || 0) > 0
                              ? formatPrice((parseFloat(elab.preparationTime.replace(',', '.')) / 60) * elab.laborCostHourlyRate, profile?.currency, locale)
                              : formatPrice(0, profile?.currency, locale)}
                          </td>
                          <td style={{ padding: '1.25rem 1.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                onClick={() => handleEditElaboration(elab)}
                                style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'white', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                              >
                                {t('dashboard.modify')}
                              </button>
                              {session?.user?.role !== "WORKER" && (
                                <button 
                                  onClick={() => handleDeleteElaboration(elab.id)}
                                  className="btn-secondary"
                                  style={{ color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'white', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                                  title={t('common.delete')}
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {sortedElaborations.length === 0 && (
                        <tr>
                          <td colSpan="7" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            {t('dashboard.no_elaborations_recorded')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

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
          lastRecord={tempRecords.length > 0 ? tempRecords[0] : null}
        />
      )}

      {isCleaningExportModalOpen && (
        <CleaningExportModal 
          onClose={() => setIsCleaningExportModalOpen(false)}
          onGenerate={generateCleaningReportPDF}
          dates={cleaningExportDates}
          setDates={setCleaningExportDates}
        />
      )}

      {isTempExportModalOpen && (
        <TemperatureExportModal 
          onClose={() => setIsTempExportModalOpen(false)}
          onGenerate={generateTemperatureReportPDF}
          dates={tempExportDates}
          setDates={setTempExportDates}
        />
      )}

      {isWaterModalOpen && (
        <WaterMeasurementRegistrationModal 
          onClose={() => {
            setIsWaterModalOpen(false);
            setEditingWaterMeasurement(null);
          }}
          onSubmit={handleSubmitWater}
          formData={waterForm}
          setFormData={setWaterForm}
          loading={loading}
          isEditing={!!editingWaterMeasurement}
          onImageChange={handleWaterImageChange}
        />
      )}
      
      {isWaterExportModalOpen && (
        <WaterExportModal 
          onClose={() => setIsWaterExportModalOpen(false)}
          onGenerate={generateWaterReportPDF}
          dates={waterReportDates}
          setDates={setWaterReportDates}
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
          providers={providers}
          allMerchantTypes={profile?.merchantTypes || []}
          recipes={recipes}
          onGoToConfig={() => {
            setActiveTab("configuracion");
            setIsGoodsModalOpen(false);
            setEditingGoodsReceipt(null);
          }}
        />
      )}

      {isIaScanModalOpen && (
        <GoodsReceiptIaScanModal
          isOpen={isIaScanModalOpen}
          onClose={() => setIsIaScanModalOpen(false)}
          recipes={recipes}
          providers={providers}
          fetchGoodsReceipts={() => fetchGoodsReceipts(goodsFilters)}
          profile={profile}
          onHelpVideoClick={(videoId) => setVideoModal({ isOpen: true, videoId })}
        />
      )}

      {isScannedInvoicesModalOpen && (
        <ScannedDeliveryNotesModal
          isOpen={isScannedInvoicesModalOpen}
          onClose={() => setIsScannedInvoicesModalOpen(false)}
          recipes={recipes}
          providers={providers}
          goodsReceipts={goodsReceipts}
          onEditGoodsReceipt={handleEditGoods}
          fetchGoodsReceipts={() => fetchGoodsReceipts(goodsFilters)}
          profile={profile}
        />
      )}

      {isIngredientCostsModalOpen && (
        <IngredientCostModal 
          onClose={() => {
            setIsIngredientCostsModalOpen(false);
            setSelectedElaborationForCosts(null);
          }}
          onSave={handleSaveIngredientPrices}
          ingredientPrices={ingredientPrices}
          selectedElaboration={selectedElaborationForCosts}
          loading={loading}
          currency={profile?.currency}
        />
      )}

      {isManageMerchantTypesModalOpen && (
        <ManageMerchantTypesModal 
          merchantTypes={profile?.merchantTypes || []}
          onClose={() => setIsManageMerchantTypesModalOpen(false)}
          onUpdate={(newTypes) => handleUpdateProfile({ merchantTypes: newTypes })}
        />
      )}


      {isProvidersModalOpen && (
        <ProviderModal 
          onClose={() => {
            setIsProvidersModalOpen(false);
            setEditingProvider(null);
          }}
          onSubmit={handleSubmitProvider}
          formData={providersForm}
          setFormData={setProvidersForm}
          loading={loading}
          isEditing={!!editingProvider}
          allMerchantTypes={profile?.merchantTypes || []}
          onGoToConfig={() => {
            setActiveTab("configuracion");
            setIsProvidersModalOpen(false);
            setEditingProvider(null);
          }}
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
          config={mergeLabelConfig(profile?.labelConfig)}
          onClose={() => setIsLabelModalOpen(false)}
          onSave={(newConfig) => handleUpdateProfile({ labelConfig: newConfig })}
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

        @keyframes slideUp { from { transform: translate(-50%, 100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        .selected-row { background-color: #f0fdf4 !important; }

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
          .mobile-header { display: flex !important; }
          .desktop-logo { display: none !important; }
          .sidebar-responsive { 
            display: none !important; 
            width: 100% !important; 
            height: auto !important; 
            position: relative !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border) !important;
          }
          .sidebar-responsive.open {
            display: flex !important;
            position: fixed !important;
            top: 61px !important;
            left: 0 !important;
            z-index: 90 !important;
            background: white !important;
            height: calc(100vh - 61px) !important;
            overflow-y: auto !important;
          }
          main { padding: 1.5rem !important; }
          .content-wrapper { margin: 0 !important; }

          .header-content-mobile {
            flex-direction: column !important;
            gap: 1rem !important;
            align-items: flex-start !important;
          }

          .action-buttons-mobile {
            flex-direction: column !important;
            width: 100% !important;
          }
          
          .action-buttons-mobile > * {
            width: 100% !important;
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

        .modal-content > header {
          position: sticky;
          top: -2.5rem; /* Counteract padding */
          background: white;
          z-index: 50;
          padding: 2.5rem 2.5rem 1.5rem 2.5rem;
          margin: -2.5rem -2.5rem 2rem -2.5rem;
          border-bottom: 1px solid var(--border);
        }
      `}</style>
      {isWasteModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'slideUp 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Recycle size={24} color="var(--corp-green)" /> {t('waste.new_collection') || "Nueva retirada de residuos"}
              </h3>
              <button onClick={() => setIsWasteModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitWaste} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '700' }}>
                  {t('waste.date') || "Fecha"} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={wasteForm.date} 
                  onChange={(e) => setWasteForm({...wasteForm, date: e.target.value})} 
                  required 
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '700' }}>
                  {t('waste.person') || "Persona que hace la retirada"} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={wasteForm.personName} 
                  onChange={(e) => setWasteForm({...wasteForm, personName: e.target.value})} 
                  required 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '700' }}>
                  {t('waste.kilos') || "Kilos de basura"} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number" 
                    step="0.01"
                    className="input-field" 
                    style={{ paddingRight: '3rem' }}
                    value={wasteForm.kilos} 
                    onChange={(e) => setWasteForm({...wasteForm, kilos: e.target.value})} 
                    required 
                  />
                  <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: '600' }}>kg</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsWasteModalOpen(false)} className="btn-secondary" style={{ flex: 1, padding: '0.75rem' }}>
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> {t('waste.save') || "Guardar"}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isRecipeOverlimitModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content glass-card" style={{ maxWidth: '500px', width: '90%', padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: '#fef2f2', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <AlertTriangle size={32} color="#dc2626" />
            </div>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              {t('plan_limit_block.title')}
            </h2>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
              {t('plan_limit_block.description')}
            </p>
            
            <div style={{ width: '100%', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={() => {
                  window.location.href = '/dashboard/plans';
                }} 
                style={{ width: '100%', padding: '0.85rem', background: 'var(--corp-green)', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '0.75rem', cursor: 'pointer' }}
              >
                {t('plan_limit_block.view_plans')}
              </button>
            </div>
          </div>
        </div>
      )}
      {isBulkDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{ maxWidth: '500px', width: '90%', padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ background: '#fef2f2', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Trash2 size={32} color="#ef4444" />
            </div>
            
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '1rem' }}>
              {bulkDeletePhase === 1 ? t('bulk_actions.confirm_delete_title') : t('bulk_actions.confirm_delete_title_final')}
            </h2>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              {bulkDeletePhase === 1 
                ? t('bulk_actions.confirm_delete_text').replace('{count}', selectedRecords.length.toString())
                : t('bulk_actions.confirm_delete_warning_final')}
            </p>

            {bulkDeletePhase === 1 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button 
                  onClick={() => setBulkDeletePhase(2)}
                  className="btn-primary"
                  style={{ background: '#ef4444', border: 'none', padding: '1rem', fontSize: '1rem' }}
                >
                  {t('bulk_actions.continue_delete')}
                </button>
                <button 
                  onClick={() => setIsBulkDeleteModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '1rem' }}
                >
                  {t('dashboard.cancel')}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                  <p style={{ color: '#9a3412', fontWeight: '700', fontSize: '0.9rem' }}>
                    <AlertTriangle size={16} inline="true" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    {t('bulk_actions.permanent_warning')}
                  </p>
                </div>
                <button 
                  onClick={handleBulkDelete}
                  disabled={loading}
                  className="btn-primary"
                  style={{ background: '#ef4444', border: 'none', padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Trash2 size={20} />}
                  {t('bulk_actions.confirm_permanent')}
                </button>
                <button 
                  onClick={() => {
                    setIsBulkDeleteModalOpen(false);
                    setBulkDeletePhase(1);
                  }}
                  className="btn-secondary"
                  disabled={loading}
                  style={{ padding: '1rem' }}
                >
                  {t('dashboard.cancel')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Bulk Actions Bar */}
      {selectedRecords.length > 0 && (
        <div style={{ 
          position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          padding: '1rem 2rem', background: 'var(--text-main)', color: 'white',
          borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem',
          zIndex: 2000, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', border: 'none',
          animation: 'slideUp 0.3s ease-out'
        }}>
          <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
            {t('bulk_actions.selected').replace('{count}', selectedRecords.length.toString())}
          </div>
          <div style={{ height: '1.5rem', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <button 
            onClick={() => setIsBulkDeleteModalOpen(true)}
            className="btn-primary" 
            style={{ background: '#ef4444', height: 'auto', padding: '0.6rem 1.2rem', fontSize: '0.9rem', border: 'none' }}
          >
            <Trash2 size={18} /> {t('bulk_actions.delete_selected')}
          </button>
          <button 
            onClick={() => setSelectedRecords([])}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            {t('dashboard.cancel')}
          </button>
        </div>
      )}

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
      
      {isTraceabilityReportModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{ maxWidth: '450px', width: '90%', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(66, 98, 22, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                  <FileText color="var(--corp-green)" />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{t('dashboard.traceability_report')}</h2>
              </div>
              <button 
                onClick={() => setIsTraceabilityReportModalOpen(false)}
                className="btn-icon"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="label">{t('common.from')}</label>
                <input 
                  type="date" 
                  className="input-field"
                  value={reportDates.from}
                  onChange={(e) => setReportDates({...reportDates, from: e.target.value})}
                />
              </div>
              <div>
                <label className="label">{t('common.to')}</label>
                <input 
                  type="date" 
                  className="input-field"
                  value={reportDates.to}
                  onChange={(e) => setReportDates({...reportDates, to: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  className="btn-secondary" 
                  onClick={() => setIsTraceabilityReportModalOpen(false)}
                  style={{ flex: 1 }}
                >
                  {t('dashboard.cancel')}
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => generateTraceabilityReportPDF(reportDates.from, reportDates.to)}
                  disabled={loading}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><FileText size={18} /> {t('dashboard.generate_report')}</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isWorkerModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{ maxWidth: '600px', width: '95%', padding: '2.5rem', position: 'relative' }}>
            <button 
              onClick={() => setIsWorkerModalOpen(false)}
              className="btn-icon"
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(66, 98, 22, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                <Users color="var(--corp-green)" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>
                {editingWorker ? t('workers.edit_title') : t('workers.add_title')}
              </h2>
            </div>

            <form onSubmit={editingWorker ? handleUpdateWorker : handleCreateWorker} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="label">{t('workers.name_lbl')}</label>
                <input 
                  type="text" 
                  className="input-field"
                  required
                  value={workerForm.name}
                  onChange={(e) => setWorkerForm({...workerForm, name: e.target.value})}
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div>
                <label className="label">{t('workers.user_lbl')}</label>
                <input 
                  type="email" 
                  className="input-field"
                  required
                  disabled={editingWorker}
                  value={workerForm.email}
                  onChange={(e) => setWorkerForm({...workerForm, email: e.target.value})}
                  placeholder="usuario@empresa.com"
                />
              </div>
              <div>
                <label className="label">
                  {editingWorker ? t('workers.password_edit_lbl') : t('workers.password_lbl')}
                </label>
                <input 
                  type="password" 
                  className="input-field"
                  required={!editingWorker}
                  value={workerForm.password}
                  onChange={(e) => setWorkerForm({...workerForm, password: e.target.value})}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="label" style={{ marginBottom: '1rem', display: 'block' }}>{t('workers.permissions_lbl')}</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                  {[
                    { id: 'hasTraceability', label: t('sidebar.traceability') },
                    { id: 'hasCleaning', label: t('sidebar.cleaning') },
                    { id: 'hasTemperatures', label: t('sidebar.temperatures') },
                    { id: 'hasWater', label: t('sidebar.water') },
                    { id: 'hasGoods', label: t('sidebar.goods') },
                  ].map(perm => (
                    <label key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={workerForm.permissions[perm.id]}
                        onChange={(e) => setWorkerForm({
                          ...workerForm, 
                          permissions: { ...workerForm.permissions, [perm.id]: e.target.checked }
                        })}
                        style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--corp-green)', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button"
                  className="btn-secondary" 
                  onClick={() => setIsWorkerModalOpen(false)}
                  style={{ flex: 1 }}
                >
                  {t('dashboard.cancel')}
                </button>
                <button 
                  type="submit"
                  className="btn-primary" 
                  disabled={loading}
                  style={{ flex: 2 }}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (editingWorker ? t('common.save') : t('workers.create_btn'))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isGoodsReportModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{ maxWidth: '450px', width: '90%', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(66, 98, 22, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                  <FileText color="var(--corp-green)" />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{t('dashboard.goods_report')}</h2>
              </div>
              <button 
                onClick={() => setIsGoodsReportModalOpen(false)}
                className="btn-icon"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="label">{t('common.from')}</label>
                <input 
                  type="date" 
                  className="input-field"
                  value={goodsReportDates.from}
                  onChange={(e) => setGoodsReportDates({...goodsReportDates, from: e.target.value})}
                />
              </div>
              <div>
                <label className="label">{t('common.to')}</label>
                <input 
                  type="date" 
                  className="input-field"
                  value={goodsReportDates.to}
                  onChange={(e) => setGoodsReportDates({...goodsReportDates, to: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  className="btn-secondary" 
                  onClick={() => setIsGoodsReportModalOpen(false)}
                  style={{ flex: 1 }}
                >
                  {t('dashboard.cancel')}
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => generateGoodsReportPDF(goodsReportDates.from, goodsReportDates.to)}
                  disabled={loading}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><FileText size={18} /> {t('dashboard.generate_report')}</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isProviderReceiptsModalOpen && selectedProviderForReceipts && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{ maxWidth: '800px', width: '95%', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(66, 98, 22, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                  <Truck color="var(--corp-green)" />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                  {t('dashboard.provider_receipts_header').replace('{name}', selectedProviderForReceipts.name)}
                </h2>
              </div>
              <button 
                onClick={() => {
                  setIsProviderReceiptsModalOpen(false);
                  setSelectedProviderForReceipts(null);
                }}
                className="btn-icon"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {(() => {
                const filteredReceipts = goodsReceipts.filter(r => 
                  r.providerId === selectedProviderForReceipts.id || 
                  (!r.providerId && r.providerName === selectedProviderForReceipts.name)
                );

                if (filteredReceipts.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                      <p style={{ color: 'var(--text-muted)' }}>{t('dashboard.no_receipts_for_provider')}</p>
                    </div>
                  );
                }

                return (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('dashboard.date')}</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('goods_receipt_form.product')}</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('dashboard.lote')}</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('goods_receipt_form.quantity')}</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('dashboard.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReceipts.map(receipt => (
                        <tr key={receipt.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '1rem' }}>{new Date(receipt.date).toLocaleDateString()}</td>
                          <td style={{ padding: '1rem', fontWeight: '700' }}>{receipt.productName}</td>
                          <td style={{ padding: '1rem' }}>{receipt.lote}</td>
                          <td style={{ padding: '1rem' }}>{receipt.quantity}</td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              {receipt.deliveryNoteImage && (
                                <button 
                                  onClick={() => window.open(receipt.deliveryNoteImage, '_blank')}
                                  className="btn-secondary"
                                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                  title={t('dashboard.view_note')}
                                >
                                  <FileText size={14} />
                                </button>
                              )}
                              <button 
                                onClick={() => {
                                  setIsProviderReceiptsModalOpen(false);
                                  handleEditGoods(receipt);
                                }}
                                className="btn-secondary"
                                style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem', color: 'var(--corp-green)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                title={t('common.edit')}
                              >
                                <Edit size={14} />
                              </button>
                              {session?.user?.role !== "WORKER" && (
                                <button 
                                  onClick={() => handleDeleteGoods(receipt.id)}
                                  className="btn-secondary"
                                  style={{ color: '#ef4444', fontSize: '0.75rem', padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                  title={t('common.delete')}
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                );
              })()}
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

          <div>
            <label className="label">{t('common.notes_corrective')}</label>
            <textarea 
              className="input-field" 
              value={formData.notes || ""} 
              onChange={(e) => setFormData({...formData, notes: e.target.value})} 
              placeholder={t('common.notes_corrective')}
              rows={3}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
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

function BusinessConfigView({ profile, onUpdate, loading }) {
  const { t } = useI18n();
  const [selectedCurrency, setSelectedCurrency] = useState(profile?.currency || "EUR");
  const [laborCostHourlyRate, setLaborCostHourlyRate] = useState(profile?.laborCostHourlyRate || 0);
  const [isPreparationTimeMandatory, setIsPreparationTimeMandatory] = useState(profile?.isPreparationTimeMandatory || false);
  const [merchantTypes, setMerchantTypes] = useState(profile?.merchantTypes || []);
  const [newMerchantType, setNewMerchantType] = useState("");

  const popular = ["EUR", "USD", "GBP"];
  const otherCurrencies = ALL_CURRENCIES.filter(c => !popular.includes(c.code))
    .sort((a, b) => a.code.localeCompare(b.code));
  
  useEffect(() => {
    if (profile) {
      setSelectedCurrency(profile.currency || "EUR");
      setLaborCostHourlyRate(profile.laborCostHourlyRate || 0);
      setIsPreparationTimeMandatory(profile.isPreparationTimeMandatory || false);
      setMerchantTypes(profile.merchantTypes || []);
    }
  }, [profile]);

  const handleSave = () => {
    onUpdate({ 
      currency: selectedCurrency,
      merchantTypes: merchantTypes,
      laborCostHourlyRate,
      isPreparationTimeMandatory
    });
  };

  const handleAddMerchantType = () => {
    if (!newMerchantType.trim()) return;
    if (merchantTypes.includes(newMerchantType.trim())) {
      setNewMerchantType("");
      return;
    }
    setMerchantTypes([...merchantTypes, newMerchantType.trim()]);
    setNewMerchantType("");
  };

  const handleDeleteMerchantType = (typeToRemove) => {
    setMerchantTypes(merchantTypes.filter(t => t !== typeToRemove));
  };

  // Check if anything changed to enable save button
  const hasChanges = selectedCurrency !== profile?.currency || 
                    JSON.stringify(merchantTypes) !== JSON.stringify(profile?.merchantTypes || []) ||
                    laborCostHourlyRate !== (profile?.laborCostHourlyRate || 0) ||
                    isPreparationTimeMandatory !== (profile?.isPreparationTimeMandatory || false);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease', maxWidth: '800px', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
          {t('business_config.title')}
        </h2>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Currency Section */}
        <section className="glass-card" style={{ padding: '2.5rem', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--corp-green)', marginBottom: '1.5rem' }}>
            <DollarSign size={24} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>{t('business_config.currency_section')}</h3>
          </div>

          <div className="form-group">
            <label className="label" style={{ marginBottom: '1rem', display: 'block' }}>{t('business_config.select_currency')}</label>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                {t('business_config.quick_access')}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {popular.map(code => (
                  <button
                    key={code}
                    onClick={() => setSelectedCurrency(code)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.75rem',
                      border: '2px solid',
                      borderColor: selectedCurrency === code ? 'var(--corp-green)' : 'var(--border)',
                      background: selectedCurrency === code ? 'rgba(66, 98, 22, 0.05)' : 'white',
                      color: selectedCurrency === code ? 'var(--corp-green)' : 'var(--text-main)',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{ALL_CURRENCIES.find(c => c.code === code)?.symbol}</span>
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ width: '100%' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                {t('business_config.others')}
              </div>
              <select 
                className="input-field"
                value={popular.includes(selectedCurrency) ? "" : selectedCurrency}
                onChange={(e) => {
                  if (e.target.value) setSelectedCurrency(e.target.value);
                }}
                style={{ padding: '1rem', fontSize: '1rem', fontWeight: '500' }}
              >
                <option value="" disabled>{t('common.select_currency') || "Selecciona..."}</option>
                {otherCurrencies.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#3b82f6', 
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(59, 130, 246, 0.05)',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(59, 130, 246, 0.1)'
            }}>
              <AlertCircle size={16} />
              {t('business_config.save_reminder')}
            </div>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button 
              onClick={handleSave}
              className="btn-primary" 
              disabled={loading || !hasChanges}
              style={{ minWidth: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem' }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> {t('common.save')}</>}
            </button>
          </div>
        </section>

        {/* Labor Cost & Preparation Time Configuration */}
        <section className="glass-card" style={{ padding: '2.5rem', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--corp-green)', marginBottom: '1.5rem' }}>
            <Clock size={24} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>{t('business_config.labor_cost_section')}</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                {t('business_config.labor_cost_per_hour')}
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {ALL_CURRENCIES.find(c => c.code === selectedCurrency)?.symbol || selectedCurrency}
                </span>
                <input 
                  type="number" 
                  step="0.01"
                  className="input-field" 
                  style={{ paddingLeft: '2.5rem' }}
                  value={laborCostHourlyRate} 
                  onChange={(e) => setLaborCostHourlyRate(parseFloat(e.target.value) || 0)} 
                />
              </div>
              <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {t('business_config.labor_cost_help')}
              </p>
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(245, 158, 11, 0.1)', display: 'flex', gap: '0.75rem' }}>
                <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.8rem', color: '#92400e', margin: 0, fontWeight: '500' }}>
                  {t('business_config.labor_cost_warning')}
                </p>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                {t('business_config.mandatory_prep_time')}
              </label>
              <label className="switch-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                <div style={{ position: 'relative', width: '48px', height: '24px', background: isPreparationTimeMandatory ? 'var(--corp-green)' : '#cbd5e1', borderRadius: '12px', transition: 'background 0.3s' }}>
                  <div style={{ position: 'absolute', left: isPreparationTimeMandatory ? '26px' : '2px', top: '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: 'left 0.3s' }} />
                </div>
                <input 
                  type="checkbox" 
                  style={{ display: 'none' }}
                  checked={isPreparationTimeMandatory} 
                  onChange={(e) => setIsPreparationTimeMandatory(e.target.checked)} 
                />
                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>{t('business_config.mandatory_prep_time')}</span>
              </label>
              <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {t('business_config.mandatory_prep_time_help')}
              </p>
            </div>
          </div>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: '#3b82f6', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.05)', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
              <AlertCircle size={16} /> {t('business_config.save_reminder')}
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button 
              onClick={handleSave}
              className="btn-primary" 
              disabled={loading || !hasChanges}
              style={{ minWidth: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem' }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> {t('common.save')}</>}
            </button>
          </div>
        </section>

        {/* Merchant Types Section */}
        <section className="glass-card" style={{ padding: '2.5rem', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--corp-green)', marginBottom: '1.5rem' }}>
            <Package size={24} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>{t('business_config.merchant_types_section')}</h3>
          </div>
          
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            {t('business_config.merchant_types_desc')}
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder={t('business_config.add_type_placeholder')}
              value={newMerchantType}
              onChange={(e) => setNewMerchantType(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMerchantType()}
            />
            <button 
              onClick={handleAddMerchantType}
              className="btn-primary"
              style={{ whiteSpace: 'nowrap', padding: '0 1.5rem' }}
            >
              {t('business_config.add_type_btn')}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {merchantTypes.map((type, idx) => (
              <div 
                key={idx} 
                className="merchant-type-item"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '1rem', 
                  background: '#f8fafc', 
                  borderRadius: '0.75rem', 
                  border: '1px solid var(--border)',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{type}</span>
                <button 
                  onClick={() => handleDeleteMerchantType(type)}
                  style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {merchantTypes.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
                {t('modals.no_merchant_types') || "No hay tipos de mercancía configurados"}
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#3b82f6', 
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(59, 130, 246, 0.05)',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(59, 130, 246, 0.1)'
            }}>
              <AlertCircle size={16} />
              {t('business_config.save_reminder')}
            </div>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button 
              onClick={handleSave}
              className="btn-primary" 
              disabled={loading || !hasChanges}
              style={{ minWidth: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem' }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> {t('common.save')}</>}
            </button>
          </div>
        </section>

        {/* Global Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button 
            onClick={handleSave}
            className="btn-primary" 
            disabled={loading || !hasChanges}
            style={{ minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem 2rem', fontSize: '1.1rem' }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> {t('common.save')}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function IngredientCostModal({ onClose, onSave, ingredientPrices, selectedElaboration, loading, currency }) {
  const { t, locale } = useI18n();
  const [localPrices, setLocalPrices] = useState([]);

  useEffect(() => {
    if (!ingredientPrices) return;

    if (selectedElaboration) {
      const recipe = selectedElaboration.recipe;
      const recipeName = recipe?.name || "";

      // Collect target ingredients for this recipe/elaboration
      const targetMap = new Map();

      // 1. From recipe.ingredients
      if (recipe?.ingredients) {
        recipe.ingredients.forEach(ing => {
          if (!ing.name || !ing.name.trim()) return;
          const key = `${ing.name.trim().toLowerCase()}_${(ing.unit || '').trim().toLowerCase()}`;
          targetMap.set(key, { name: ing.name.trim(), unit: (ing.unit || '').trim() });
        });
      }

      // 2. From elaboration.ingredients
      if (selectedElaboration.ingredients) {
        selectedElaboration.ingredients.forEach(ing => {
          if (!ing.name || !ing.name.trim()) return;
          const key = `${ing.name.trim().toLowerCase()}_${(ing.unit || '').trim().toLowerCase()}`;
          if (!targetMap.has(key)) {
            targetMap.set(key, { name: ing.name.trim(), unit: (ing.unit || '').trim() });
          }
        });
      }

      // 3. Also check ingredientPrices items that list this recipe
      if (recipeName) {
        ingredientPrices.forEach(item => {
          if (item.recipes && item.recipes.includes(recipeName)) {
            const key = `${(item.name || '').trim().toLowerCase()}_${(item.unit || '').trim().toLowerCase()}`;
            if (!targetMap.has(key)) {
              targetMap.set(key, { name: item.name.trim(), unit: (item.unit || '').trim() });
            }
          }
        });
      }

      // Create array with current prices
      const filteredPrices = Array.from(targetMap.entries()).map(([key, ing]) => {
        const found = ingredientPrices.find(
          p => `${(p.name || '').trim().toLowerCase()}_${(p.unit || '').trim().toLowerCase()}` === key
        );
        return {
          name: ing.name,
          unit: ing.unit,
          recipes: found?.recipes || (recipeName ? [recipeName] : []),
          price: found !== undefined && found.price !== undefined ? found.price : 0
        };
      }).sort((a, b) => a.name.localeCompare(b.name));

      setLocalPrices(filteredPrices);
    } else {
      setLocalPrices(ingredientPrices.map(item => ({ ...item })));
    }
  }, [ingredientPrices, selectedElaboration]);

  const handlePriceChange = (index, value) => {
    const updated = [...localPrices];
    updated[index].price = value;
    setLocalPrices(updated);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px', width: '95%', padding: '2rem', position: 'relative' }}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={24} />
        </button>

        <div className="modal-header" style={{ display: 'block' }}>
          <h2 className="modal-title" style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--corp-green)', marginBottom: '0.75rem' }}>
            {selectedElaboration 
              ? `${t('modals.recipe_ingredient_costs_header') || "Coste de materias primas de la receta"}: ${selectedElaboration.recipe?.name || selectedElaboration.name}`
              : t('modals.ingredient_costs_header')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
            {selectedElaboration
              ? (t('modals.recipe_ingredient_costs_desc') || "Asigna o modifica el precio de coste de los ingredientes de esta receta para calcular el coste de la elaboración.")
              : t('modals.ingredient_costs_desc')}
          </p>
        </div>
        
        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto', marginTop: '1.5rem' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0 0.5rem', minWidth: '500px' }}>
            <thead className="table-header">
              <tr>
                <th className="table-header-cell" style={{ background: 'var(--bg-light)', borderRadius: '8px 0 0 8px' }}>
                  {t('modals.ingredient_column') || "Ingrediente"}
                </th>
                <th className="table-header-cell" style={{ background: 'var(--bg-light)' }}>
                  {t('modals.recipes_column') || "Recetas"}
                </th>
                <th className="table-header-cell" style={{ background: 'var(--bg-light)', borderRadius: '0 8px 8px 0', textAlign: 'right' }}>
                  {t('modals.cost_price_column') || "Precio"}
                </th>
              </tr>
            </thead>
            <tbody>
              {localPrices.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    {t('dashboard.no_records') || "No hay ingredientes configurados en tus recetas."}
                  </td>
                </tr>
              ) : (
                localPrices.map((item, index) => (
                  <tr key={index} className="table-row" style={{ background: 'white', border: '1px solid var(--border-color)' }}>
                    <td className="table-cell" style={{ borderLeft: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{item.name}</span>
                        <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>{item.unit}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.recipes.join(', ')}
                      </div>
                    </td>
                    <td className="table-cell" style={{ textAlign: 'right', borderRight: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <input 
                          type="text"
                          className="input"
                          style={{ width: '120px', textAlign: 'right', padding: '0.5rem' }}
                          value={item.price}
                          onChange={(e) => handlePriceChange(index, e.target.value)}
                          placeholder="0.00"
                        />
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{ALL_CURRENCIES.find(c => c.code === (currency || "EUR"))?.symbol || "€"}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

        <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', marginTop: '2rem', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button 
            onClick={onClose} 
            className="btn-secondary" 
            style={{ padding: '0.75rem 2rem' }}
          >
            {t('common.cancel') || "Cancelar"}
          </button>
          <button 
            onClick={() => onSave(localPrices)} 
            className="btn-primary" 
            disabled={loading}
            style={{ padding: '0.75rem 2rem', background: 'var(--primary)' }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (t('common.save') || "Guardar")}
          </button>
        </div>
      </div>
    </div>
  );
}

function GoodsReceiptModal({ onClose, onSubmit, formData, setFormData, loading, isEditing, onImageChange, providers, allMerchantTypes = [], onGoToConfig, recipes = [] }) {
  const { t } = useI18n();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [ingSearchTerm, setIngSearchTerm] = useState("");
  const [rowIngredients, setRowIngredients] = useState([]);
  const [rowQuantities, setRowQuantities] = useState({});

  const allIngredients = Array.from(new Set(recipes.flatMap(r => r.ingredients.map(i => i.name))));
  
  const getIngredientsWithUnits = (ingList) => {
    const list = [];
    ingList.forEach(ing => {
      let unit = "Kg";
      for (const r of recipes) {
        const match = r.ingredients.find(i => i.name === ing);
        if (match) {
          unit = match.unit || "Kg";
          break;
        }
      }
      list.push({ name: ing, unit });
    });
    return list;
  };

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
                  list="providers-list"
                  className="input-field" 
                  value={formData.providerName} 
                  onChange={(e) => {
                    const val = e.target.value;
                    const foundProvider = providers.find(p => p.name === val);
                    setFormData({
                      ...formData, 
                      providerName: val,
                      providerId: foundProvider ? foundProvider.id : null,
                      merchantTypes: foundProvider ? (foundProvider.merchantTypes || []) : formData.merchantTypes
                    });
                  }} 
                  placeholder={t('goods_receipt_form.provider_placeholder')}
                  style={{ paddingLeft: '3rem' }}
                />
                <datalist id="providers-list">
                  {providers.map(p => (
                    <option key={p.id} value={p.name} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="form-group">
              <label className="label">{t('dashboard.lote')}</label>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', width: '100%' }}>
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
                <button 
                  type="button"
                  onClick={() => {
                    setRowIngredients(formData.relatedIngredients || []);
                    setRowQuantities(formData.relatedQuantities || {});
                    setIsLinkModalOpen(true);
                  }}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--corp-green)', 
                    fontSize: '0.8rem', 
                    fontWeight: '700', 
                    textDecoration: 'underline', 
                    cursor: 'pointer',
                    padding: 0,
                    marginTop: '0.4rem',
                    alignSelf: 'start',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <PlusCircle size={12} />
                  {formData.relatedIngredients?.length > 0 
                    ? `Relacionado con ${formData.relatedIngredients.length} ingredientes` 
                    : "Relaciona este lote con los ingredientes"
                  }
                </button>
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
              <label className="label">{t('goods_receipt_form.temp')} (°C)</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.manufacturingTemp} 
                onChange={(e) => setFormData({...formData, manufacturingTemp: e.target.value})} 
              />
            </div>

            <div className="form-group">
              <label className="label">{t('goods_receipt_form.end_date') || "Fecha de finalización"}</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.endDate} 
                onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="label">{t('goods_receipt_form.type_and_origin') || "Tipo y procedencia"}</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.typeAndOrigin} 
                onChange={(e) => setFormData({...formData, typeAndOrigin: e.target.value})} 
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

          {allMerchantTypes.length > 0 && (
            <div className="form-group">
              <label className="label" style={{ marginBottom: '0.75rem', display: 'block' }}>{t('modals.merchant_types')}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                {allMerchantTypes.map((type, idx) => (
                  <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      style={{ cursor: 'pointer' }}
                      checked={formData.merchantTypes?.includes(type)}
                      onChange={(e) => {
                        const current = formData.merchantTypes || [];
                        const next = e.target.checked 
                          ? [...current, type]
                          : current.filter(t => t !== type);
                        setFormData({ ...formData, merchantTypes: next });
                      }}
                    />
                    <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
            <p style={{ margin: 0, lineHeight: '1.5' }}>
              {t('modals.merchant_types_config_reminder')}
            </p>
            <button 
              type="button" 
              onClick={onGoToConfig}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--corp-green)', 
                fontWeight: '700', 
                textDecoration: 'underline', 
                padding: 0, 
                marginTop: '0.5rem', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <Settings size={14} />
              {t('modals.go_to_config')}
            </button>
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

      {isLinkModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1150 }}>
          <div className="modal-content glass-card" style={{ maxWidth: '600px', width: '90%', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '85vh', overflow: 'hidden' }}>
            <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
                  {t('goods_receipt_form.link_popup_title') || "Selecciona ingredientes"}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: '1.4' }}>
                  {t('goods_receipt_form.link_popup_desc') || "Relaciona este albarán con ingredientes."}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setIngSearchTerm("");
                }} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <X size={20} />
              </button>
            </header>

            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder={t('common.search')}
                className="input-field"
                value={ingSearchTerm}
                onChange={(e) => setIngSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.75rem', paddingRight: '1rem' }}
              />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem', minHeight: '150px' }}>
              {allIngredients.filter(ing => ing.toLowerCase().includes(ingSearchTerm.toLowerCase())).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                  {t('common.no_results')}
                </div>
              ) : (
                allIngredients
                  .filter(ing => ing.toLowerCase().includes(ingSearchTerm.toLowerCase()))
                  .map((ingName, idx) => {
                    const isChecked = rowIngredients.includes(ingName);
                    return (
                      <label 
                        key={idx} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.75rem', 
                          cursor: 'pointer', 
                          padding: '0.75rem 1rem', 
                          background: isChecked ? 'rgba(66, 98, 22, 0.05)' : '#f8fafc',
                          borderRadius: '0.75rem',
                          border: isChecked ? '1px solid var(--corp-green)' : '1px solid var(--border)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input 
                          type="checkbox"
                          style={{ cursor: 'pointer', width: '1.1rem', height: '1.1rem', accentColor: 'var(--corp-green)' }}
                          checked={isChecked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...rowIngredients, ingName]
                              : rowIngredients.filter(n => n !== ingName);
                            setRowIngredients(next);
                          }}
                        />
                        <span style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '0.95rem' }}>{ingName}</span>
                      </label>
                    );
                  })
              )}
            </div>

            {getIngredientsWithUnits(rowIngredients).length > 0 && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', color: 'var(--corp-green)' }}>
                  {t('goods_receipt_form.stock_control_title') || "Control de stock:"}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {getIngredientsWithUnits(rowIngredients).map((item, idx) => {
                    const key = `${item.name}:${item.unit}`;
                    const val = rowQuantities[key] || "";
                    return (
                      <div className="form-group" key={idx}>
                        <label className="label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                          {t('goods_receipt_form.related_quantity_label')
                            ? t('goods_receipt_form.related_quantity_label').replace('{name}', item.name).replace('{unit}', item.unit)
                            : `Cantidad de ${item.name} (${item.unit})`}
                        </label>
                        <input 
                          type="number"
                          step="any"
                          className="input-field"
                          value={val}
                          onChange={(e) => {
                            setRowQuantities({
                              ...rowQuantities,
                              [key]: e.target.value
                            });
                          }}
                          placeholder={formData.quantity || ""}
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', gap: '1rem' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setIngSearchTerm("");
                }} 
                style={{ flex: 1, padding: '0.85rem' }}
              >
                {t('common.cancel')}
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={() => {
                  setFormData({
                    ...formData,
                    relatedIngredients: rowIngredients,
                    relatedQuantities: rowQuantities
                  });
                  setIsLinkModalOpen(false);
                  setIngSearchTerm("");
                }} 
                style={{ flex: 2, padding: '0.85rem' }}
              >
                {t('goods_receipt_form.link_popup_save') || "Guardar relación"}
              </button>
            </div>
          </div>
        </div>
      )}
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
              
              <a 
                href="https://quicktrace.es/condiciones-de-uso/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  marginTop: '1.5rem', 
                  fontSize: '0.85rem', 
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--corp-green)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                {t('profile.terms_link')}
              </a>
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
                  profile?.stripeCancelAtPeriodEnd ? (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff7ed', borderRadius: '1rem', border: '1px solid #fdba74', textAlign: 'left' }}>
                      <p style={{ fontSize: '0.9rem', color: '#c2410c', margin: 0, lineHeight: '1.5', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                        <X size={18} /> Suscripción Cancelada
                      </p>
                      <p style={{ fontSize: '0.85rem', color: '#9a3412', margin: 0, lineHeight: '1.5' }}>
                        Tienes pagado tu plan hasta la fecha <strong>{profile?.stripeCurrentPeriodEnd ? new Date(profile.stripeCurrentPeriodEnd).toLocaleDateString() : 'N/A'}</strong>. Después pasarás al plan demo y podrás volver a suscribirte a un plan de pago cuando lo desees.
                      </p>
                    </div>
                  ) : (
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
                  )
                )}
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
}

function PlanUsageIndicator({ label, current, limit, hideLimit = false }) {
  const { t } = useI18n();
  const isCapped = !hideLimit && limit !== null && current >= limit;
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
            {current} {!hideLimit && <> / {limit === null ? '∞' : limit}</>}
          </span>
          {!hideLimit && limit && (
            <div style={{ width: '60px', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${percentage}%`, height: '100%', background: isCapped ? '#ef4444' : 'var(--corp-green)', transition: 'width 0.5s ease' }} />
            </div>
          )}
        </div>
      </div>
      
      {!hideLimit && (
        <Link href="/dashboard/plans" style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          padding: '0.5rem 1rem', background: 'rgba(66, 98, 22, 0.1)', 
          color: 'var(--corp-green)', borderRadius: '0.75rem', 
          fontSize: '0.85rem', fontWeight: '800', textDecoration: 'none',
          transition: 'all 0.2s'
        }}>
          <Crown size={14} /> {t('modals.upgrade_plan')}
        </Link>
      )}
    </div>
  );
}

function SidebarBtn({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        padding: '0.75rem 1rem',
        background: active ? 'rgba(66, 98, 22, 0.08)' : 'transparent',
        border: 'none', 
        color: active ? 'var(--corp-green)' : 'var(--text-muted)', 
        fontSize: '0.9rem', 
        fontWeight: active ? '800' : '500',
        cursor: 'pointer', 
        borderRadius: '0.75rem', 
        textAlign: 'left', 
        transition: 'all 0.2s',
        lineHeight: '1.2'
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </span>
      <span style={{ flex: 1, whiteSpace: 'normal', wordBreak: 'break-word', display: 'block' }}>
        {label}
      </span>
    </button>
  );
}

function TemperatureRegistrationModal({ chambers, onClose, onSubmit, formData, setFormData, loading, isEditing, lastRecord }) {
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

  const handleAutoFill = () => {
    if (!lastRecord || !lastRecord.values) return;
    
    const newValues = { ...formData.values };
    lastRecord.values.forEach(v => {
      newValues[v.chamberId] = v.value;
    });
    
    setFormData(prev => ({
      ...prev,
      values: newValues
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{t('modals.chambers')}</label>
              {!isEditing && lastRecord && (
                <button
                  type="button"
                  onClick={handleAutoFill}
                  style={{ background: 'rgba(66, 98, 22, 0.1)', color: 'var(--corp-green)', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  Autocompletar con los datos del último registro
                </button>
              )}
            </div>
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

          <div>
            <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              {t('common.notes_corrective')}
            </label>
            <textarea 
              className="input-field" 
              value={formData.notes || ""} 
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })} 
              placeholder={t('common.notes_corrective')}
              rows={3}
              style={{ resize: 'vertical', minHeight: '80px', margin: 0 }}
            />
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
                    
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-main)' }}>
                          <input 
                            type="checkbox" 
                            checked={ing.expandItem || false} 
                            onChange={(e) => onIngredientChange(idx, 'expandItem', e.target.checked)} 
                            style={{ accentColor: 'var(--corp-green)' }} 
                          />
                          {t('modals.expand_ingredient')}
                        </label>
                        <button 
                          type="button" 
                          onClick={() => alert(t('modals.expand_ingredient_info'))}
                          style={{ background: '#e2e8f0', border: 'none', color: '#475569', cursor: 'pointer', width: '16px', height: '16px', borderRadius: '50%', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                          title="Información"
                        >
                          ?
                        </button>
                      </div>
                      {ing.expandItem && (
                        <input 
                          type="text" 
                          className="input-field" 
                          value={ing.expandedText || ''} 
                          onChange={(e) => onIngredientChange(idx, 'expandedText', e.target.value)} 
                          placeholder={t('modals.expand_ingredient_placeholder')} 
                          style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.5rem' }} 
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>{t('modals.ing_amount')}</label>
                    <input type="text" className="input-field" value={ing.amount} onChange={(e) => onIngredientChange(idx, 'amount', e.target.value)} placeholder="500" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>{t('modals.ing_unit')}</label>
                    <input type="text" className="input-field" value={ing.unit} onChange={(e) => onIngredientChange(idx, 'unit', e.target.value)} placeholder="g, kg, L..." />
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
            
            <div style={{ marginTop: '1.5rem', background: 'rgba(66, 98, 22, 0.05)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(66, 98, 22, 0.15)' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={formData.hasDryingRoom}
                  onChange={(e) => setFormData({...formData, hasDryingRoom: e.target.checked})}
                  style={{ accentColor: 'var(--corp-green)', width: '1.1rem', height: '1.1rem', marginTop: '0.1rem' }} 
                />
                <div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '0.1rem' }}>
                    Secadero
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Marca esta casilla si quieres poder registrar la fecha de entrada y fecha de salida del secadero en las elaboraciones de esta receta
                  </span>
                </div>
              </label>
            </div>

            <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="label">Elaboración</label>
                <textarea 
                  className="input-field" 
                  rows="3"
                  placeholder="Describe la elaboración..."
                  value={formData.elaborationInstructions} 
                  onChange={(e) => setFormData({...formData, elaborationInstructions: e.target.value})}
                  style={{ fontSize: '1rem', padding: '1rem', resize: 'vertical' }}
                />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  El contenido de este campo podrá aparecer en la etiqueta
                </p>
              </div>
              
              <div>
                <label className="label">Conservación</label>
                <textarea 
                  className="input-field" 
                  rows="2"
                  placeholder="Conservar entre 0 y 4 grados..."
                  value={formData.conservationInstructions} 
                  onChange={(e) => setFormData({...formData, conservationInstructions: e.target.value})}
                  style={{ fontSize: '1rem', padding: '1rem', resize: 'vertical' }}
                />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  El contenido de este campo podrá aparecer en la etiqueta
                </p>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--corp-green)', margin: 0 }}>{t('modals.nutritional_info') || "Información Nutricional (por 100g)"}</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="label" style={{ fontSize: '0.85rem' }}>{t('modals.energy_value') || "Valor energético"}</label>
                  <input type="text" className="input-field" value={formData.energyValue || ""} onChange={e => setFormData({...formData, energyValue: e.target.value})} />
                </div>
                <div>
                  <label className="label" style={{ fontSize: '0.85rem' }}>{t('modals.fats') || "Grasas"}</label>
                  <input type="text" className="input-field" value={formData.fats || ""} onChange={e => setFormData({...formData, fats: e.target.value})} />
                </div>
                <div>
                  <label className="label" style={{ fontSize: '0.85rem' }}>{t('modals.saturated_fats') || "de las cuales saturadas"}</label>
                  <input type="text" className="input-field" value={formData.saturatedFats || ""} onChange={e => setFormData({...formData, saturatedFats: e.target.value})} />
                </div>
                <div>
                  <label className="label" style={{ fontSize: '0.85rem' }}>{t('modals.carbohydrates') || "Hidratos de carbono"}</label>
                  <input type="text" className="input-field" value={formData.carbohydrates || ""} onChange={e => setFormData({...formData, carbohydrates: e.target.value})} />
                </div>
                <div>
                  <label className="label" style={{ fontSize: '0.85rem' }}>{t('modals.sugars') || "de los cuales azúcares"}</label>
                  <input type="text" className="input-field" value={formData.sugars || ""} onChange={e => setFormData({...formData, sugars: e.target.value})} />
                </div>
                <div>
                  <label className="label" style={{ fontSize: '0.85rem' }}>{t('modals.proteins') || "Proteínas"}</label>
                  <input type="text" className="input-field" value={formData.proteins || ""} onChange={e => setFormData({...formData, proteins: e.target.value})} />
                </div>
                <div>
                  <label className="label" style={{ fontSize: '0.85rem' }}>{t('modals.salt') || "Sal"}</label>
                  <input type="text" className="input-field" value={formData.salt || ""} onChange={e => setFormData({...formData, salt: e.target.value})} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--corp-green)', margin: 0 }}>{t('allergens.title') || "Alérgenos"}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  {t('allergens.help_text') || "Selecciona los alérgenos que quieras que aparezcan en las etiquetas de las elaboraciones con esta receta"}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {['gluten', 'crustaceans', 'eggs', 'fish', 'peanuts', 'soy', 'milk', 'nuts', 'celery', 'mustard', 'sesame', 'sulphites', 'lupins', 'molluscs'].map(allergenKey => (
                  <label key={allergenKey} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <input 
                      type="checkbox" 
                      style={{ accentColor: 'var(--corp-green)' }}
                      checked={formData.allergens?.includes(allergenKey)}
                      onChange={(e) => {
                        const newAllergens = e.target.checked 
                          ? [...(formData.allergens || []), allergenKey]
                          : (formData.allergens || []).filter(a => a !== allergenKey);
                        setFormData({...formData, allergens: newAllergens});
                      }}
                    />
                    {t(`allergens.list.${allergenKey}`) || allergenKey}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', background: 'rgba(66, 98, 22, 0.05)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(66, 98, 22, 0.15)' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={formData.hasBarcode}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let newBarcode = formData.barcode;
                    if (checked && !newBarcode) {
                      // Generate random EAN-13
                      let data = '20';
                      for (let i = 0; i < 10; i++) data += Math.floor(Math.random() * 10).toString();
                      let sum = 0;
                      for (let i = 0; i < 12; i++) sum += parseInt(data[i]) * (i % 2 === 0 ? 1 : 3);
                      const expectedCheck = (10 - (sum % 10)) % 10;
                      newBarcode = data + expectedCheck.toString();
                    }
                    setFormData({...formData, hasBarcode: checked, barcode: newBarcode});
                  }}
                  style={{ accentColor: 'var(--corp-green)', width: '1.1rem', height: '1.1rem', marginTop: '0.1rem' }} 
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '0.1rem' }}>
                    Usar código de barras en la etiqueta de las elaboraciones de esta receta
                  </span>
                  {formData.hasBarcode && (
                    <div style={{ marginTop: '1rem' }} onClick={e => e.preventDefault()}>
                      <label className="label" style={{ fontSize: '0.8rem' }}>Código EAN-13</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        maxLength={13}
                        value={formData.barcode || ""} 
                        onChange={(e) => setFormData({...formData, barcode: e.target.value.replace(/\D/g, '')})}
                        placeholder="Ej: 2012345678901"
                        style={{ padding: '0.75rem', fontSize: '1rem', letterSpacing: '2px', fontFamily: 'monospace' }}
                      />
                    </div>
                  )}
                </div>
              </label>
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
  const [showHelpVideo, setShowHelpVideo] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localConfig);
    onClose();
  };

  const ALL_ELEMENTS = [
    'recipeName', 'lote', 'elaborationDate', 'expirationDate', 'netWeight',
    'elaborationInstructions', 'conservationInstructions', 
    'allergens', 'nutritionalTable', 'ingredientsList', 
    'madeBy', 'barcode', 'healthRegistry', 'unitPrice', 'dryingRoomDates'
  ];

  const getAvailableElements = () => {
    const used = [...(localConfig.columns?.col1 || []), ...(localConfig.columns?.col2 || [])];
    return ALL_ELEMENTS.filter(el => !used.includes(el));
  };

  const handleDrop = (e, targetCol) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    if (!item) return;

    let newCol1 = [...(localConfig.columns?.col1 || [])].filter(i => i !== item);
    let newCol2 = [...(localConfig.columns?.col2 || [])].filter(i => i !== item);

    if (targetCol === 'col1') newCol1.push(item);
    if (targetCol === 'col2') newCol2.push(item);

    setLocalConfig({
      ...localConfig,
      columns: { col1: newCol1, col2: newCol2 }
    });
  };

  const moveItem = (col, index, direction) => {
    const newCol = [...(localConfig.columns[col] || [])];
    if (direction === -1 && index > 0) {
      const temp = newCol[index - 1];
      newCol[index - 1] = newCol[index];
      newCol[index] = temp;
    } else if (direction === 1 && index < newCol.length - 1) {
      const temp = newCol[index + 1];
      newCol[index + 1] = newCol[index];
      newCol[index] = temp;
    }
    setLocalConfig({ ...localConfig, columns: { ...localConfig.columns, [col]: newCol } });
  };

  const removeItem = (col, item) => {
    const newCol = [...(localConfig.columns[col] || [])].filter(i => i !== item);
    setLocalConfig({ ...localConfig, columns: { ...localConfig.columns, [col]: newCol } });
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

  const getElementLabel = (el) => {
    const translated = t(`modals.labels_elements.${el}`);
    return (translated && translated !== `modals.labels_elements.${el}`) ? translated : el;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '850px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{t('modals.labels_header')}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Help Video */}
          <div style={{ marginBottom: '1rem' }}>
            {!showHelpVideo ? (
              <button 
                type="button"
                onClick={() => setShowHelpVideo(true)}
                className="btn-help-video"
                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
              >
                <PlayCircle size={20} />
                {t('modals.labels_help_video_btn')}
              </button>
            ) : (
              <div style={{ width: '100%', position: 'relative', paddingTop: '56.25%', background: '#000', borderRadius: '0.75rem', overflow: 'hidden' }}>
                <iframe 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  src="https://www.youtube.com/embed/_Pu_-QYqA_I?autoplay=1"
                  title="Help Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          {/* Header Image */}
          <section style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--corp-green)' }}>{t('modals.labels_header_image') || "Imagen encabezado"}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {t('modals.labels_header_image_desc') || "Introduce una imagen que aparecerá en la parte superior..."}
            </p>
            
            {localConfig.headerImage ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ maxWidth: '100%', maxHeight: '150px', overflow: 'hidden', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'white' }}>
                  <img src={localConfig.headerImage} alt="Header" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label className="btn-secondary" style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
                    {t('modals.labels_header_image_change') || "Cambiar imagen"}
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setLocalConfig({...localConfig, headerImage: reader.result});
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <button type="button" onClick={() => setLocalConfig({...localConfig, headerImage: null})} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    {t('modals.labels_header_image_remove') || "Eliminar imagen"}
                  </button>
                </div>
              </div>
            ) : (
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', border: '2px dashed var(--corp-green)', borderRadius: '0.75rem', cursor: 'pointer', background: 'rgba(66, 98, 22, 0.05)', color: 'var(--corp-green)' }}>
                <Camera size={32} style={{ marginBottom: '0.5rem' }} />
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{t('goods_receipt_form.upload_file') || "Subir imagen..."}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setLocalConfig({...localConfig, headerImage: reader.result});
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            )}
          </section>
          
          {/* Health Registry Input */}
          <section style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', marginTop: '-1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--corp-green)' }}>
              {t('modals.labels_health_registry')}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {t('modals.labels_health_registry_desc')}
            </p>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ej: RGSEAA 12.34567/XX"
              value={localConfig.healthRegistry || ""}
              onChange={(e) => setLocalConfig({...localConfig, healthRegistry: e.target.value})}
            />
          </section>

          {/* Label Dimensions UI */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--corp-green)' }}>
              {t('modals.labels_dimensions') || "Dimensiones de la etiqueta"}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="input-label">{t('modals.label_width') || "Ancho de la etiqueta (mm)"}</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={localConfig.dimensions?.width || 100}
                  onChange={(e) => setLocalConfig({...localConfig, dimensions: {...(localConfig.dimensions || {}), width: parseInt(e.target.value) || 100}})}
                />
              </div>
              <div>
                <label className="input-label">{t('modals.label_height') || "Alto de la etiqueta (mm)"}</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={localConfig.dimensions?.height || 50}
                  onChange={(e) => setLocalConfig({...localConfig, dimensions: {...(localConfig.dimensions || {}), height: parseInt(e.target.value) || 50}})}
                />
              </div>
            </div>
          </section>

          {/* Configuración de Ingredientes */}
          <section style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--corp-green)' }}>
              {t('modals.ingredients_config')}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={localConfig.ingredientOptions?.showLote || false} 
                  onChange={(e) => updateField('ingredientOptions', 'showLote', e.target.checked)}
                  style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--corp-green)' }}
                />
                <div>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', display: 'block' }}>{t('modals.show_lote')}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('modals.show_lote_desc')}</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={localConfig.ingredientOptions?.showAmount || false} 
                  onChange={(e) => updateField('ingredientOptions', 'showAmount', e.target.checked)}
                  style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--corp-green)' }}
                />
                <div>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', display: 'block' }}>{t('modals.show_real_amount')}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('modals.show_real_amount_desc')}</span>
                </div>
              </label>

              <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--border)' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>{t('modals.visual_format')}</span>
                <select 
                  className="input-field" 
                  value={localConfig.ingredientOptions?.format || 'list'} 
                  onChange={(e) => updateField('ingredientOptions', 'format', e.target.value)}
                  style={{ padding: '0.75rem' }}
                >
                  <option value="list">{t('modals.format_list')}</option>
                  <option value="paragraph">{t('modals.format_paragraph')}</option>
                </select>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  {t('modals.format_desc')}
                </div>
              </div>
            </div>
          </section>

          {/* Label Columns UI */}
          <section>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--corp-green)' }}>
              {t('modals.labels_columns_count') || "Número de columnas disponibles"}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {t('modals.labels_columns_count_desc') || "Selecciona si quieres mostrar la información de tu etiqueta en una o dos columnas."}
            </p>
            <select 
              className="input-field" 
              value={localConfig.columnsCount || 1} 
              onChange={(e) => {
                const count = parseInt(e.target.value);
                let newLocalConfig = { ...localConfig, columnsCount: count };
                if (count === 1) {
                  // Merge col2 back to available if switching to 1
                  newLocalConfig.columns = { ...newLocalConfig.columns, col2: [] };
                }
                setLocalConfig(newLocalConfig);
              }}
              style={{ padding: '0.75rem', marginBottom: '2rem' }}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: '1rem' }}>
              
              {/* Available Elements */}
              <div 
                onDragOver={(e) => e.preventDefault()} 
                onDrop={(e) => handleDrop(e, 'available')}
                style={{ flex: 1, minWidth: '200px', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)', minHeight: '300px' }}
              >
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {t('modals.labels_col_available') || "Elementos disponibles"}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {getAvailableElements().map(el => (
                    <div 
                      key={el}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', el)}
                      style={{ padding: '0.75rem', background: 'white', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.85rem', cursor: 'grab', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                    >
                      {getElementLabel(el)}
                    </div>
                  ))}
                  {getAvailableElements().length === 0 && (
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>{t('modals.none')}</div>
                  )}
                </div>
              </div>

              {/* Columna 1 */}
              <div 
                onDragOver={(e) => e.preventDefault()} 
                onDrop={(e) => handleDrop(e, 'col1')}
                style={{ flex: 1, minWidth: '220px', background: 'rgba(66, 98, 22, 0.05)', padding: '1rem', borderRadius: '0.75rem', border: '2px dashed var(--corp-green)', minHeight: '300px' }}
              >
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem', textAlign: 'center', color: 'var(--corp-green)' }}>
                  {t('modals.labels_col_1') || "Columna 1"}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(localConfig.columns?.col1 || []).map((el, idx, arr) => (
                    <div 
                      key={el}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', el)}
                      style={{ padding: '0.5rem', background: 'white', border: '1px solid var(--corp-green)', borderRadius: '0.5rem', fontSize: '0.85rem', cursor: 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <span>{getElementLabel(el)}</span>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button type="button" onClick={() => moveItem('col1', idx, -1)} disabled={idx === 0} style={{ border: 'none', background: 'none', cursor: idx === 0 ? 'default' : 'pointer', color: idx === 0 ? '#cbd5e1' : 'var(--text-main)' }}>↑</button>
                        <button type="button" onClick={() => moveItem('col1', idx, 1)} disabled={idx === arr.length - 1} style={{ border: 'none', background: 'none', cursor: idx === arr.length - 1 ? 'default' : 'pointer', color: idx === arr.length - 1 ? '#cbd5e1' : 'var(--text-main)' }}>↓</button>
                        <button type="button" onClick={() => removeItem('col1', el)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', marginLeft: '0.25rem' }}>×</button>
                      </div>
                    </div>
                  ))}
                  {(localConfig.columns?.col1 || []).length === 0 && (
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>{t('modals.drag_elements')}</div>
                  )}
                </div>
              </div>

              {/* Columna 2 */}
              {(localConfig.columnsCount === 2) && (
                <div 
                  onDragOver={(e) => e.preventDefault()} 
                  onDrop={(e) => handleDrop(e, 'col2')}
                  style={{ flex: 1, minWidth: '220px', background: 'rgba(66, 98, 22, 0.05)', padding: '1rem', borderRadius: '0.75rem', border: '2px dashed var(--corp-green)', minHeight: '300px' }}
                >
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem', textAlign: 'center', color: 'var(--corp-green)' }}>
                    {t('modals.labels_col_2') || "Columna 2"}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {(localConfig.columns?.col2 || []).map((el, idx, arr) => (
                      <div 
                        key={el}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', el)}
                        style={{ padding: '0.5rem', background: 'white', border: '1px solid var(--corp-green)', borderRadius: '0.5rem', fontSize: '0.85rem', cursor: 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <span>{getElementLabel(el)}</span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button type="button" onClick={() => moveItem('col2', idx, -1)} disabled={idx === 0} style={{ border: 'none', background: 'none', cursor: idx === 0 ? 'default' : 'pointer', color: idx === 0 ? '#cbd5e1' : 'var(--text-main)' }}>↑</button>
                          <button type="button" onClick={() => moveItem('col2', idx, 1)} disabled={idx === arr.length - 1} style={{ border: 'none', background: 'none', cursor: idx === arr.length - 1 ? 'default' : 'pointer', color: idx === arr.length - 1 ? '#cbd5e1' : 'var(--text-main)' }}>↓</button>
                          <button type="button" onClick={() => removeItem('col2', el)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', marginLeft: '0.25rem' }}>×</button>
                        </div>
                      </div>
                    ))}
                    {(localConfig.columns?.col2 || []).length === 0 && (
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>{t('modals.drag_elements')}</div>
                    )}
                  </div>
                </div>
              )}
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
              {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map(size => (
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

function CleaningExportModal({ onClose, onGenerate, dates, setDates }) {
  const { t } = useI18n();

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{t('dashboard.cleaning_report')}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="input-label">{t('common.from')}</label>
            <input 
              type="date" 
              className="input-field"
              value={dates.from}
              onChange={(e) => setDates({ ...dates, from: e.target.value })}
            />
          </div>
          <div>
            <label className="input-label">{t('common.to')}</label>
            <input 
              type="date" 
              className="input-field"
              value={dates.to}
              onChange={(e) => setDates({ ...dates, to: e.target.value })}
            />
          </div>
        </div>

        <footer style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onClose} className="btn-secondary">{t('common.cancel')}</button>
          <button 
            onClick={() => onGenerate(dates)} 
            className="btn-primary"
            disabled={!dates.from || !dates.to}
          >
            {t('dashboard.generate_report')}
          </button>
        </footer>
      </div>
    </div>
  );
}

function TemperatureExportModal({ onClose, onGenerate, dates, setDates }) {
  const { t } = useI18n();

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{t('dashboard.temp_consultation')}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="input-label">{t('common.from')}</label>
            <input 
              type="date" 
              className="input-field"
              value={dates.from}
              onChange={(e) => setDates({ ...dates, from: e.target.value })}
            />
          </div>
          <div>
            <label className="input-label">{t('common.to')}</label>
            <input 
              type="date" 
              className="input-field"
              value={dates.to}
              onChange={(e) => setDates({ ...dates, to: e.target.value })}
            />
          </div>
        </div>

        <footer style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onClose} className="btn-secondary">{t('common.cancel')}</button>
          <button 
            onClick={() => onGenerate(dates)} 
            className="btn-primary"
            disabled={!dates.from || !dates.to}
          >
            {t('dashboard.generate_report')}
          </button>
        </footer>
      </div>
    </div>
  );
}

function ProviderModal({ onClose, onSubmit, formData, setFormData, loading, isEditing, allMerchantTypes = [], onGoToConfig }) {
  const { t } = useI18n();
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px' }}>
        <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {isEditing ? t('dashboard.edit_provider') : t('dashboard.add_provider')}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}><X size={24} /></button>
        </header>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="label">{t('providers.name')} <span style={{color:'#ef4444'}}>*</span></label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="label">{t('providers.nif')}</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.nif} 
                onChange={(e) => setFormData({...formData, nif: e.target.value})} 
              />
            </div>
            <div>
              <label className="label">{t('providers.rgs')}</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.rgs} 
                onChange={(e) => setFormData({...formData, rgs: e.target.value})} 
              />
            </div>
            <div>
              <label className="label">{t('providers.phone')}</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
          </div>

          <div>
            <label className="label">{t('providers.address')}</label>
            <textarea 
              className="input-field" 
              rows="3"
              value={formData.address} 
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label className="label">{t('providers.products')}</label>
            <textarea 
              className="input-field" 
              rows="2"
              value={formData.products} 
              onChange={(e) => setFormData({...formData, products: e.target.value})}
              style={{ resize: 'vertical' }}
            />
          </div>

          {allMerchantTypes.length > 0 && (
            <div>
              <label className="label" style={{ marginBottom: '0.75rem', display: 'block' }}>{t('modals.merchant_types')}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                {allMerchantTypes.map((type, idx) => (
                  <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      style={{ cursor: 'pointer' }}
                      checked={formData.merchantTypes?.includes(type)}
                      onChange={(e) => {
                        const current = formData.merchantTypes || [];
                        const next = e.target.checked 
                          ? [...current, type]
                          : current.filter(t => t !== type);
                        setFormData({ ...formData, merchantTypes: next });
                      }}
                    />
                    <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
            <p style={{ margin: 0, lineHeight: '1.5' }}>
              {t('modals.merchant_types_config_reminder')}
            </p>
            <button 
              type="button" 
              onClick={onGoToConfig}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--corp-green)', 
                fontWeight: '700', 
                textDecoration: 'underline', 
                padding: 0, 
                marginTop: '0.5rem', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <Settings size={14} />
              {t('modals.go_to_config')}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>{t('common.cancel')}</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2 }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function WaterMeasurementRegistrationModal({ onClose, onSubmit, formData, setFormData, loading, isEditing, onImageChange }) {
  const { t } = useI18n();
  
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {isEditing ? t('water.edit_measurement') : t('water.new_measurement')}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>{t('water.description')}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}><X size={24} /></button>
        </header>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="label">{t('water.date')} <span style={{color:'#ef4444'}}>*</span></label>
              <input 
                type="datetime-local" 
                className="input-field" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="label">{t('water.sampling_point')}</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.samplingPoint} 
                onChange={(e) => setFormData({...formData, samplingPoint: e.target.value})} 
                placeholder="Grifo cocina, depósito..."
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="label">{t('water.chlorine')} <span style={{color:'#ef4444'}}>*</span></label>
              <input 
                type="number" 
                step="0.01"
                className="input-field" 
                value={formData.chlorine} 
                onChange={(e) => setFormData({...formData, chlorine: e.target.value})} 
                required 
                placeholder="0.5"
              />
            </div>
            <div>
              <label className="label">{t('water.ph') || "pH"}</label>
              <input 
                type="number" 
                step="0.1"
                className="input-field" 
                value={formData.ph || ""} 
                onChange={(e) => setFormData({...formData, ph: e.target.value})} 
                placeholder="7.2"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="label">{t('water.responsible')}</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.responsible} 
                onChange={(e) => setFormData({...formData, responsible: e.target.value})} 
                placeholder="Nombre del operario"
              />
            </div>
            <div></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)' }}>
            {[
              { id: 'turbidity', label: t('water.turbidity') },
              { id: 'odor', label: t('water.odor') },
              { id: 'flavor', label: t('water.flavor') },
              { id: 'color', label: t('water.color') }
            ].map(field => (
              <div key={field.id}>
                <label className="label" style={{ fontSize: '0.75rem', marginBottom: '0.75rem' }}>{field.label} <span style={{color:'#ef4444'}}>*</span></label>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                    <input 
                      type="radio" 
                      name={field.id} 
                      checked={formData[field.id] === true} 
                      onChange={() => setFormData({...formData, [field.id]: true})}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--corp-green)' }}
                    /> {t('water.yes')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                    <input 
                      type="radio" 
                      name={field.id} 
                      checked={formData[field.id] === false} 
                      onChange={() => setFormData({...formData, [field.id]: false})}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--corp-green)' }}
                    /> {t('water.no')}
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="label">{t('water.receipt_photo') || "Foto del recibo (opcional)"}</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div 
                onClick={() => document.getElementById('water-receipt-upload').click()}
                style={{ 
                  flex: 1, 
                  height: '100px', 
                  border: '2px dashed var(--border)', 
                  borderRadius: '1rem', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  background: 'white',
                  transition: 'all 0.2s',
                  color: 'var(--text-muted)'
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--corp-green)'; e.currentTarget.style.color = 'var(--corp-green)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                {formData.receiptImage ? (
                  <img src={formData.receiptImage} alt="Recibo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <>
                    <Camera size={24} />
                    <span style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{t('common.upload_image')}</span>
                  </>
                )}
              </div>
              {formData.receiptImage && (
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, receiptImage: ""})}
                  style={{ padding: '0.5rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
            <input 
              id="water-receipt-upload"
              type="file" 
              accept="image/*" 
              onChange={onImageChange} 
              style={{ display: 'none' }} 
            />
          </div>

          <div>
            <label className="label">{t('common.notes_corrective')}</label>
            <textarea 
              className="input-field" 
              value={formData.notes || ""} 
              onChange={(e) => setFormData({...formData, notes: e.target.value})} 
              placeholder={t('common.notes_corrective')}
              rows={3}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>{t('common.cancel')}</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2 }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function WaterExportModal({ onClose, onGenerate, dates, setDates }) {
  const { t } = useI18n();

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{t('dashboard.water_report') || "Informe de Control de Aguas"}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="input-label">{t('common.from')}</label>
            <input 
              type="date" 
              className="input-field"
              value={dates.from}
              onChange={(e) => setDates({ ...dates, from: e.target.value })}
            />
          </div>
          <div>
            <label className="input-label">{t('common.to')}</label>
            <input 
              type="date" 
              className="input-field"
              value={dates.to}
              onChange={(e) => setDates({ ...dates, to: e.target.value })}
            />
          </div>
        </div>

        <footer style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onClose} className="btn-secondary">{t('common.cancel')}</button>
          <button 
            onClick={() => onGenerate(dates)} 
            className="btn-primary"
            disabled={!dates.from || !dates.to}
          >
            {t('dashboard.generate_report')}
          </button>
        </footer>
      </div>
    </div>
  );
}

function GoodsReceiptIaScanModal({ isOpen, onClose, recipes, providers, fetchGoodsReceipts, profile, onHelpVideoClick }) {
  const { t, locale } = useI18n();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [extractedData, setExtractedData] = useState(null); 
  const [aiRows, setAiRows] = useState([]); 
  
  const [linkRowIndex, setLinkRowIndex] = useState(null);
  const [ingSearchTerm, setIngSearchTerm] = useState("");
  const [rowIngredients, setRowIngredients] = useState([]); 
  const [rowQuantities, setRowQuantities] = useState({}); 

  const allIngredients = (() => {
    if (!recipes) return [];
    const names = new Set();
    recipes.forEach(r => {
      r.ingredients?.forEach(ing => {
        if (ing.name && ing.name.trim()) {
          names.add(ing.name.trim());
        }
      });
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  })();

  const getIngredientsWithUnits = (selectedIngs) => {
    const list = [];
    if (!selectedIngs || !recipes) return list;
    selectedIngs.forEach(ingName => {
      const units = new Set();
      recipes.forEach(recipe => {
        recipe.ingredients?.forEach(ing => {
          if (ing.name === ingName && ing.unit) {
            units.add(ing.unit.trim());
          }
        });
      });
      const sortedUnits = Array.from(units).sort();
      sortedUnits.forEach(unit => {
        list.push({ name: ingName, unit });
      });
    });
    return list;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/client/goods-receipts/analyze-invoice", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al analizar el albarán");
      }
      
      setExtractedData(data);
      const rows = (data.items || []).map((item, idx) => ({
        id: idx,
        productName: item.product || "",
        providerName: data.provider || "",
        providerId: providers.find(p => p.name === data.provider)?.id || null,
        lote: item.lote || "",
        quantity: item.quantity || "",
        invoiceNumber: "",
        manufacturingTemp: "",
        endDate: "",
        typeAndOrigin: "",
        relatedIngredients: [],
        relatedQuantities: {},
        saving: false,
        saved: false
      }));
      setAiRows(rows);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al procesar el archivo con la IA");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRowChange = (index, field, value) => {
    setAiRows(prev => prev.map((row, idx) => {
      if (idx === index) {
        if (field === "providerName") {
          const found = providers.find(p => p.name === value);
          return {
            ...row,
            providerName: value,
            providerId: found ? found.id : null
          };
        }
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const openLinkModal = (index) => {
    const row = aiRows[index];
    setLinkRowIndex(index);
    setRowIngredients(row.relatedIngredients || []);
    setRowQuantities(row.relatedQuantities || {});
  };

  const saveLinkDetails = () => {
    setAiRows(prev => prev.map((row, idx) => {
      if (idx === linkRowIndex) {
        return {
          ...row,
          relatedIngredients: rowIngredients,
          relatedQuantities: rowQuantities
        };
      }
      return row;
    }));
    setLinkRowIndex(null);
    setIngSearchTerm("");
  };

  const handleSaveRow = async (index) => {
    const row = aiRows[index];
    if (row.saved || row.saving) return;
    
    if (!row.productName.trim()) {
      alert("El nombre del producto es obligatorio");
      return;
    }

    setAiRows(prev => prev.map((r, idx) => idx === index ? { ...r, saving: true } : r));

    try {
      const payload = {
        providerName: row.providerName,
        productName: row.productName,
        lote: row.lote,
        invoiceNumber: row.invoiceNumber,
        quantity: row.quantity,
        date: new Date().toISOString(),
        deliveryNoteImage: extractedData.imageUrl, 
        manufacturingTemp: row.manufacturingTemp,
        endDate: row.endDate,
        typeAndOrigin: row.typeAndOrigin,
        providerId: row.providerId,
        merchantTypes: [],
        relatedIngredients: row.relatedIngredients,
        relatedQuantities: row.relatedQuantities,
        scannedDeliveryNoteId: extractedData?.scannedDeliveryNoteId || null,
        scannedItemId: row.id
      };

      const res = await fetch("/api/goods-receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al guardar el registro");
      }

      setAiRows(prev => prev.map((r, idx) => idx === index ? { ...r, saving: false, saved: true } : r));
      alert(t('goods_receipt_form.goods_saved') || t('goods_receipt_form.ia_saved') || "Entrada guardada correctamente");
      fetchGoodsReceipts(); 
    } catch (err) {
      console.error(err);
      alert((t('goods_receipt_form.ia_error_saving') || "Error al guardar: ") + err.message);
      setAiRows(prev => prev.map((r, idx) => idx === index ? { ...r, saving: false } : r));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1050 }}>
      <div className="modal-content glass-card" style={{ maxWidth: extractedData ? '95%' : '600px', width: '90%', padding: '2.5rem', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'all 0.3s ease' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Cpu size={24} style={{ color: 'var(--corp-green)' }} />
              {t('goods_receipt_form.ia_modal_title') || "Escanear albarán con IA"}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {t('goods_receipt_form.ia_modal_desc') || "Sube una foto o PDF de un albarán para extraer automáticamente los productos, lotes y cantidades."}
            </p>
            <button
              type="button"
              onClick={() => onHelpVideoClick(locale === 'en' ? 'raxn-Z7o3No' : "8_qOTe6RrHk")}
              className="btn-help-video"
              style={{ marginTop: '0.75rem' }}
            >
              <PlayCircle size={16} /> {t('dashboard.video_help') || "Vídeo de ayuda"}
            </button>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <X size={24} />
          </button>
        </header>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '0.75rem', color: '#dc2626', fontSize: '0.9rem', fontWeight: '500' }}>
            {error}
          </div>
        )}

        {!extractedData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById("ia-file-upload").click()}
              style={{
                border: dragActive ? '2.5px dashed var(--corp-green)' : '2px dashed var(--border)',
                borderRadius: '1rem',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                background: dragActive ? 'rgba(66, 98, 22, 0.02)' : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <UploadCloud size={48} color={dragActive ? "var(--corp-green)" : "var(--text-muted)"} style={{ transition: 'all 0.2s' }} />
              {file ? (
                <div>
                  <p style={{ fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>{file.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {t('goods_receipt_form.ia_select_image') || "Selecciona o arrastra una imagen o PDF del albarán"}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Soporta imágenes (PNG, JPG) y archivos PDF
                  </p>
                </div>
              )}
              <input 
                id="ia-file-upload"
                type="file"
                accept="image/*, application/pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={analyzing}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={onClose} 
                style={{ flex: 1, padding: '1rem' }}
                disabled={analyzing}
              >
                {t('common.cancel')}
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleAnalyze} 
                style={{ flex: 2, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, var(--corp-green) 0%, #15803d 100%)' }}
                disabled={!file || analyzing}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {t('goods_receipt_form.ia_processing') || "Procesando albarán con IA..."}
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    {"Analizar albarán con IA"}
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ background: 'rgba(66, 98, 22, 0.05)', border: '1px solid rgba(66, 98, 22, 0.2)', padding: '1rem', borderRadius: '0.75rem', color: 'var(--corp-green)', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={18} />
              {t('goods_receipt_form.ia_success') || "Albarán procesado con éxito. Revisa y guarda las entradas."}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {aiRows.map((row, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    background: row.saved ? '#f8fafc' : 'white', 
                    border: '1px solid var(--border)', 
                    borderRadius: '1rem', 
                    padding: '1.5rem', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    opacity: row.saved ? 0.65 : 1, 
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  {/* Row 1: Product, Provider, Lote, Quantity */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('goods_receipt_form.product') || "Producto"}
                      </label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={row.productName} 
                        onChange={(e) => handleRowChange(idx, "productName", e.target.value)}
                        disabled={row.saved || row.saving}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                    
                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('goods_receipt_form.provider') || "Proveedor"}
                      </label>
                      <input 
                        type="text" 
                        list={`providers-list-ai-${idx}`}
                        className="input-field" 
                        value={row.providerName} 
                        onChange={(e) => handleRowChange(idx, "providerName", e.target.value)}
                        disabled={row.saved || row.saving}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                      <datalist id={`providers-list-ai-${idx}`}>
                        {providers.map(p => (
                          <option key={p.id} value={p.name} />
                        ))}
                      </datalist>
                    </div>

                    <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('traceability_form.lot') || "Lote"}
                      </label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={row.lote} 
                        onChange={(e) => handleRowChange(idx, "lote", e.target.value)}
                        disabled={row.saved || row.saving}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: '100px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('goods_receipt_form.quantity') || "Cantidad"}
                      </label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={row.quantity} 
                        onChange={(e) => handleRowChange(idx, "quantity", e.target.value)}
                        disabled={row.saved || row.saving}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  {/* Row 2: Relate with ingredients link + Info icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => openLinkModal(idx)}
                      disabled={row.saved || row.saving}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: row.relatedIngredients?.length > 0 ? 'var(--corp-green)' : '#64748b',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        textDecoration: 'underline',
                        cursor: row.saved ? 'default' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: 0
                      }}
                    >
                      <PlusCircle size={16} />
                      {row.relatedIngredients?.length > 0 
                        ? `${t('goods_receipt_form.relate_entry_with_ingredients') || "Relacionar esta entrada con ingredientes"} (${row.relatedIngredients.length})` 
                        : (t('goods_receipt_form.relate_entry_with_ingredients') || "Relacionar esta entrada con ingredientes")}
                    </button>
                    <Info 
                      size={16} 
                      style={{ cursor: 'pointer', color: 'var(--corp-green)' }} 
                      onClick={() => alert(t('goods_receipt_form.ia_ingredients_info_alert') || "Si relacionas esta entrada de mercancía con uno o varios ingredientes, cuando crees una elaboración y su trazabilidad, te aparecerá este lote en esos ingredientes.")}
                    />
                  </div>

                  {/* Row 3: Factura Nº, Temp. Transp/Fab, Fecha Fin, Tipo/Procedencia */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('goods_receipt_form.invoice_number') || "Número de factura"}
                      </label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={row.invoiceNumber} 
                        onChange={(e) => handleRowChange(idx, "invoiceNumber", e.target.value)}
                        disabled={row.saved || row.saving}
                        placeholder={t('goods_receipt_form.invoice_number') || "Nº factura"}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('goods_receipt_form.temp') || "Temperatura Transporte / Fab."}
                      </label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={row.manufacturingTemp} 
                        onChange={(e) => handleRowChange(idx, "manufacturingTemp", e.target.value)}
                        disabled={row.saved || row.saving}
                        placeholder="Temp. ºC"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('goods_receipt_form.end_date') || "Fecha de finalización"}
                      </label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={row.endDate} 
                        onChange={(e) => handleRowChange(idx, "endDate", e.target.value)}
                        disabled={row.saved || row.saving}
                        placeholder="Fin de consumo"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('goods_receipt_form.type_and_origin') || "Tipo y procedencia"}
                      </label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={row.typeAndOrigin} 
                        onChange={(e) => handleRowChange(idx, "typeAndOrigin", e.target.value)}
                        disabled={row.saved || row.saving}
                        placeholder="Tipo/Origen"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  {/* Row 4: Save button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleSaveRow(idx)}
                      className={row.saved ? "btn-secondary" : "btn-primary"}
                      disabled={row.saved || row.saving}
                      style={{ 
                        padding: '0.6rem 1.5rem', 
                        fontSize: '0.85rem', 
                        borderRadius: '0.5rem', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        backgroundColor: row.saved ? '#e2e8f0' : (row.saving ? 'var(--text-muted)' : 'var(--corp-green)'),
                        color: row.saved ? '#64748b' : 'white',
                        border: 'none',
                        cursor: row.saved ? 'default' : 'pointer',
                        fontWeight: '700'
                      }}
                    >
                      {row.saving ? (
                        <>
                          <Loader2 className="animate-spin" size={14} />
                          {t('common.saving') || "Guardando..."}
                        </>
                      ) : (
                        row.saved ? (
                          <>
                            <Check size={14} />
                            {t('goods_receipt_form.ia_already_saved') || "Guardado"}
                          </>
                        ) : (
                          t('common.save') || "Guardar"
                        )
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => {
                  setExtractedData(null);
                  setFile(null);
                  setAiRows([]);
                }} 
                style={{ padding: '0.75rem 1.5rem' }}
              >
                {"Escanear otro albarán"}
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={onClose} 
                style={{ padding: '0.75rem 2rem' }}
              >
                {t('common.back') || "Cerrar"}
              </button>
            </div>
          </div>
        )}
      </div>

      {linkRowIndex !== null && (
        <div className="modal-overlay" style={{ zIndex: 1150 }}>
          <div className="modal-content glass-card" style={{ maxWidth: '600px', width: '90%', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '85vh', overflow: 'hidden' }}>
            <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
                  {t('goods_receipt_form.link_popup_title') || "Selecciona ingredientes"}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: '1.4' }}>
                  {t('goods_receipt_form.link_popup_desc') || "Relaciona este albarán con ingredientes."}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setLinkRowIndex(null);
                  setIngSearchTerm("");
                }} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <X size={20} />
              </button>
            </header>

            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder={t('common.search')}
                className="input-field"
                value={ingSearchTerm}
                onChange={(e) => setIngSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.75rem', paddingRight: '1rem' }}
              />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem', minHeight: '150px' }}>
              {allIngredients.filter(ing => ing.toLowerCase().includes(ingSearchTerm.toLowerCase())).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                  {t('common.no_results')}
                </div>
              ) : (
                allIngredients
                  .filter(ing => ing.toLowerCase().includes(ingSearchTerm.toLowerCase()))
                  .map((ingName, idx) => {
                    const isChecked = rowIngredients.includes(ingName);
                    return (
                      <label 
                        key={idx} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.75rem', 
                          cursor: 'pointer', 
                          padding: '0.75rem 1rem', 
                          background: isChecked ? 'rgba(66, 98, 22, 0.05)' : '#f8fafc',
                          borderRadius: '0.75rem',
                          border: isChecked ? '1px solid var(--corp-green)' : '1px solid var(--border)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input 
                          type="checkbox"
                          style={{ cursor: 'pointer', width: '1.1rem', height: '1.1rem', accentColor: 'var(--corp-green)' }}
                          checked={isChecked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...rowIngredients, ingName]
                              : rowIngredients.filter(n => n !== ingName);
                            setRowIngredients(next);
                          }}
                        />
                        <span style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '0.95rem' }}>{ingName}</span>
                      </label>
                    );
                  })
              )}
            </div>

            {getIngredientsWithUnits(rowIngredients).length > 0 && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', color: 'var(--corp-green)' }}>
                  {t('goods_receipt_form.stock_control_title') || "Control de stock:"}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {getIngredientsWithUnits(rowIngredients).map((item, idx) => {
                    const key = `${item.name}:${item.unit}`;
                    const val = rowQuantities[key] || "";
                    return (
                      <div className="form-group" key={idx}>
                        <label className="label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                          {t('goods_receipt_form.related_quantity_label')
                            ? t('goods_receipt_form.related_quantity_label').replace('{name}', item.name).replace('{unit}', item.unit)
                            : `Cantidad de ${item.name} (${item.unit})`}
                        </label>
                        <input 
                          type="number"
                          step="any"
                          className="input-field"
                          value={val}
                          onChange={(e) => {
                            setRowQuantities({
                              ...rowQuantities,
                              [key]: e.target.value
                            });
                          }}
                          placeholder={aiRows[linkRowIndex]?.quantity || ""}
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', gap: '1rem' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => {
                  setLinkRowIndex(null);
                  setIngSearchTerm("");
                }} 
                style={{ flex: 1, padding: '0.85rem' }}
              >
                {t('common.cancel')}
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={saveLinkDetails} 
                style={{ flex: 2, padding: '0.85rem' }}
              >
                {t('goods_receipt_form.link_popup_save') || "Guardar relación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ManageMerchantTypesModal({ merchantTypes, onClose, onUpdate }) {
  const { t } = useI18n();
  const [newType, setNewType] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newType.trim()) return;
    if (merchantTypes.includes(newType.trim())) {
      setNewType("");
      return;
    }
    const updated = [...merchantTypes, newType.trim()];
    onUpdate(updated);
    setNewType("");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editValue.trim() || editingIndex === null) return;
    
    const updated = [...merchantTypes];
    updated[editingIndex] = editValue.trim();
    onUpdate(updated);
    setEditingIndex(null);
  };

  const handleDelete = (typeToDelete) => {
    if (!confirm(t('common.confirm_delete') || "¿Estás seguro de que quieres eliminar este elemento?")) return;
    const updated = merchantTypes.filter(t => t !== typeToDelete);
    onUpdate(updated);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 10000 }}>
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{t('modals.manage_merchant_types') || "Gestionar tipos de mercancía"}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('modals.merchant_types_desc') || "Crea, edita o elimina los tipos de mercancía."}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>{t('modals.new_merchant_type') || "Nuevo tipo de mercancía"}</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder={t('modals.new_merchant_type_placeholder') || "Ej: Carne, Pescado, Verduras..."}
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>{t('modals.add_type') || "Añadir"}</button>
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {merchantTypes.map((type, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '1rem' }}>
              {editingIndex === idx ? (
                <form onSubmit={handleUpdate} style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}><Save size={16} /></button>
                  <button type="button" className="btn-secondary" onClick={() => setEditingIndex(null)} style={{ padding: '0.5rem 1rem' }}><X size={16} /></button>
                </form>
              ) : (
                <>
                  <span style={{ fontWeight: '700', fontSize: '1rem' }}>{type}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => { setEditingIndex(idx); setEditValue(type); }}
                      style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'white', color: 'var(--corp-green)', cursor: 'pointer' }}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(type)}
                      style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {merchantTypes.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
              {t('modals.no_merchant_types')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScannedDeliveryNotesModal({ isOpen, onClose, recipes, providers, goodsReceipts, onEditGoodsReceipt, fetchGoodsReceipts, profile }) {
  const { t, locale } = useI18n();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // States for editable rows in details view
  const [editableRows, setEditableRows] = useState([]);

  // State for raw ingredient linking modal
  const [linkRowIndex, setLinkRowIndex] = useState(null);
  const [ingSearchTerm, setIngSearchTerm] = useState("");
  const [rowIngredients, setRowIngredients] = useState([]);
  const [rowQuantities, setRowQuantities] = useState({});

  const allIngredients = (() => {
    if (!recipes) return [];
    const names = new Set();
    recipes.forEach(r => {
      r.ingredients?.forEach(ing => {
        if (ing.name && ing.name.trim()) {
          names.add(ing.name.trim());
        }
      });
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  })();

  const getIngredientsWithUnits = (selectedIngs) => {
    const list = [];
    if (!selectedIngs || !recipes) return list;
    selectedIngs.forEach(ingName => {
      const units = new Set();
      recipes.forEach(recipe => {
        recipe.ingredients?.forEach(ing => {
          if (ing.name === ingName && ing.unit) {
            units.add(ing.unit.trim());
          }
        });
      });
      const sortedUnits = Array.from(units).sort();
      sortedUnits.forEach(unit => {
        list.push({ name: ingName, unit });
      });
    });
    return list;
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/client/scanned-delivery-notes");
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotes(data);
        if (selectedNote) {
          const fresh = data.find(n => n.id === selectedNote.id);
          if (fresh) {
            setSelectedNote(fresh);
            initEditableRows(fresh);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching scanned delivery notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotes();
      setSelectedNote(null);
      setPreviewImage(null);
    }
  }, [isOpen]);

  const initEditableRows = (note) => {
    const items = Array.isArray(note.items) ? note.items : [];
    setEditableRows(items.map((it, idx) => {
      const matchingReceipt = (goodsReceipts || []).find(g => 
        (it.goodsReceiptId && g.id === it.goodsReceiptId) ||
        (g.scannedDeliveryNoteId === note.id && g.productName?.trim().toLowerCase() === it.productName?.trim().toLowerCase())
      );

      if (matchingReceipt) {
        return {
          id: it.id !== undefined ? it.id : idx,
          goodsReceiptId: matchingReceipt.id,
          productName: matchingReceipt.productName || it.productName || "",
          providerName: matchingReceipt.providerName || note.providerName || "",
          providerId: matchingReceipt.providerId || providers.find(p => p.name === (matchingReceipt.providerName || note.providerName))?.id || null,
          lote: matchingReceipt.lote || it.lote || "",
          quantity: matchingReceipt.quantity || it.quantity || "",
          invoiceNumber: matchingReceipt.invoiceNumber || "",
          manufacturingTemp: matchingReceipt.manufacturingTemp || "",
          endDate: matchingReceipt.endDate || "",
          typeAndOrigin: matchingReceipt.typeAndOrigin || "",
          merchantTypes: matchingReceipt.merchantTypes || [],
          relatedIngredients: matchingReceipt.relatedIngredients || [],
          relatedQuantities: matchingReceipt.relatedQuantities || {},
          saved: true,
          saving: false
        };
      }

      return {
        id: it.id !== undefined ? it.id : idx,
        goodsReceiptId: it.goodsReceiptId || null,
        productName: it.productName || "",
        providerName: note.providerName || "",
        providerId: providers.find(p => p.name === note.providerName)?.id || null,
        lote: it.lote || "",
        quantity: it.quantity || "",
        invoiceNumber: "",
        manufacturingTemp: "",
        endDate: "",
        typeAndOrigin: "",
        merchantTypes: [],
        relatedIngredients: [],
        relatedQuantities: {},
        saved: !!it.saved,
        saving: false
      };
    }));
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    initEditableRows(note);
  };

  const handleRowChange = (index, field, value) => {
    setEditableRows(prev => prev.map((row, idx) => {
      if (idx === index) {
        if (field === "providerName") {
          const found = providers.find(p => p.name === value);
          return {
            ...row,
            providerName: value,
            providerId: found ? found.id : null
          };
        }
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const openLinkModal = (index) => {
    const row = editableRows[index];
    setLinkRowIndex(index);
    setRowIngredients(row.relatedIngredients || []);
    setRowQuantities(row.relatedQuantities || {});
  };

  const saveLinkDetails = () => {
    setEditableRows(prev => prev.map((row, idx) => {
      if (idx === linkRowIndex) {
        return {
          ...row,
          relatedIngredients: rowIngredients,
          relatedQuantities: rowQuantities
        };
      }
      return row;
    }));
    setLinkRowIndex(null);
    setIngSearchTerm("");
  };

  const handleSaveRow = async (index) => {
    const row = editableRows[index];
    if (row.saved || row.saving) return;

    if (!row.productName.trim()) {
      alert("El nombre del producto es obligatorio");
      return;
    }

    setEditableRows(prev => prev.map((r, idx) => idx === index ? { ...r, saving: true } : r));

    try {
      const payload = {
        providerName: row.providerName,
        productName: row.productName,
        lote: row.lote,
        invoiceNumber: row.invoiceNumber,
        quantity: row.quantity,
        date: new Date().toISOString(),
        deliveryNoteImage: selectedNote.imageUrl,
        manufacturingTemp: row.manufacturingTemp,
        endDate: row.endDate,
        typeAndOrigin: row.typeAndOrigin,
        providerId: row.providerId,
        merchantTypes: row.merchantTypes || [],
        relatedIngredients: row.relatedIngredients,
        relatedQuantities: row.relatedQuantities,
        scannedDeliveryNoteId: selectedNote.id,
        scannedItemId: row.id
      };

      const res = await fetch("/api/goods-receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al guardar el registro");
      }

      setEditableRows(prev => prev.map((r, idx) => idx === index ? { 
        ...r, 
        saved: true, 
        saving: false, 
        goodsReceiptId: data.receipt?.id 
      } : r));

      const updatedItems = (selectedNote.items || []).map((it, idx) => 
        idx === index ? { ...it, saved: true, goodsReceiptId: data.receipt?.id } : it
      );
      const updatedNote = { ...selectedNote, items: updatedItems };
      setSelectedNote(updatedNote);
      setNotes(prev => prev.map(n => n.id === selectedNote.id ? updatedNote : n));

      alert(t('goods_receipt_form.goods_saved') || "Entrada guardada correctamente");
      fetchGoodsReceipts();
    } catch (err) {
      console.error(err);
      alert((t('goods_receipt_form.ia_error_saving') || "Error al guardar: ") + err.message);
      setEditableRows(prev => prev.map((r, idx) => idx === index ? { ...r, saving: false } : r));
    }
  };

  const handleOpenReceiptEdit = (row) => {
    const matchingReceipt = (goodsReceipts || []).find(g => 
      (row.goodsReceiptId && g.id === row.goodsReceiptId) ||
      (g.scannedDeliveryNoteId === selectedNote.id && g.productName?.trim().toLowerCase() === row.productName?.trim().toLowerCase())
    );

    if (matchingReceipt) {
      if (onEditGoodsReceipt) {
        onClose();
        onEditGoodsReceipt(matchingReceipt);
      }
    } else {
      if (onEditGoodsReceipt) {
        onClose();
        onEditGoodsReceipt({
          id: row.goodsReceiptId,
          providerName: row.providerName || selectedNote.providerName || "",
          productName: row.productName,
          lote: row.lote || "",
          invoiceNumber: row.invoiceNumber || "",
          quantity: row.quantity || "",
          date: selectedNote.date || new Date().toISOString(),
          deliveryNoteImage: selectedNote.imageUrl,
          manufacturingTemp: row.manufacturingTemp || "",
          endDate: row.endDate || "",
          typeAndOrigin: row.typeAndOrigin || "",
          merchantTypes: row.merchantTypes || [],
          relatedIngredients: row.relatedIngredients || [],
          relatedQuantities: row.relatedQuantities || {}
        });
      }
    }
  };

  const handleDeleteNote = async (noteId, e) => {
    if (e) e.stopPropagation();
    if (!confirm(t('dashboard.delete_scanned_confirm') || "¿Estás seguro de que deseas eliminar este albarán escaneado?")) return;
    try {
      const res = await fetch(`/api/client/scanned-delivery-notes?id=${noteId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setNotes(prev => prev.filter(n => n.id !== noteId));
        if (selectedNote?.id === noteId) {
          setSelectedNote(null);
        }
      } else {
        alert(data.error || "Error al eliminar");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1050 }}>
      <div className="modal-content glass-card" style={{ maxWidth: selectedNote ? '1100px' : '900px', width: '95%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'all 0.3s ease' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
          <div>
            {selectedNote ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={() => setSelectedNote(null)} 
                  className="btn-secondary" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                >
                  <ArrowLeft size={16} /> {t('dashboard.back_to_scanned_list') || "Volver a la lista"}
                </button>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--corp-green)', margin: 0 }}>
                  {selectedNote.providerName || "Albarán escaneado"} - {formatDateTimeDDMMYYYY(selectedNote.date || selectedNote.createdAt)}
                </h2>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--corp-green)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={24} /> {t('dashboard.scanned_invoices_title') || "Albaranes Escaneados con IA"}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem', marginBottom: 0 }}>
                  {t('dashboard.scanned_invoices_desc') || "Consulta los albaranes analizados, revisa las entradas guardadas y registra productos pendientes."}
                </p>
              </div>
            )}
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={24} />
          </button>
        </header>

        {/* View 1: List of scanned delivery notes */}
        {!selectedNote && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem', color: 'var(--corp-green)' }}>
                <Loader2 size={36} className="animate-spin" />
              </div>
            ) : notes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#f8fafc', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
                <FileText size={48} style={{ color: 'var(--text-muted)', opacity: 0.5, marginBottom: '0.75rem' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '600', margin: 0 }}>
                  {t('dashboard.no_scanned_invoices') || "No hay albaranes escaneados todavía."}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {notes.map((note) => {
                  const items = Array.isArray(note.items) ? note.items : [];
                  const total = items.length;
                  const saved = items.filter(i => i.saved).length;
                  const pending = total - saved;
                  const isAllSaved = total > 0 && saved === total;

                  return (
                    <div 
                      key={note.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 1.25rem',
                        background: 'white',
                        border: '1px solid var(--border)',
                        borderRadius: '1rem',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        gap: '1rem',
                        flexWrap: 'wrap'
                      }}
                    >
                      {/* Left: Thumbnail & Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 300px' }}>
                        {note.imageUrl ? (
                          <div 
                            onClick={() => setPreviewImage(note.imageUrl)}
                            style={{ 
                              width: '64px', 
                              height: '64px', 
                              borderRadius: '0.65rem', 
                              overflow: 'hidden', 
                              cursor: 'pointer',
                              border: '1px solid var(--border)',
                              flexShrink: 0,
                              position: 'relative'
                            }}
                            title="Click para ver imagen"
                          >
                            <img 
                              src={note.imageUrl} 
                              alt="Albarán" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                            >
                              <Eye size={18} color="white" />
                            </div>
                          </div>
                        ) : (
                          <div style={{ width: '64px', height: '64px', borderRadius: '0.65rem', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileText size={24} color="var(--text-muted)" />
                          </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--corp-green)' }}>
                            {note.providerName || "Proveedor no detectado"}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {formatDateTimeDDMMYYYY(note.date || note.createdAt)}
                          </span>
                          <div>
                            {isAllSaved ? (
                              <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.15rem 0.55rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Check size={12} /> {t('dashboard.scanned_items_count')?.replace('{saved}', saved).replace('{total}', total) || `${saved} de ${total} guardados`}
                              </span>
                            ) : (
                              <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.15rem 0.55rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '700' }}>
                                {t('dashboard.scanned_items_count')?.replace('{saved}', saved).replace('{total}', total) || `${saved} de ${total} guardados`}
                                {pending > 0 && ` (${pending} pendiente${pending > 1 ? 's' : ''})`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                          type="button"
                          onClick={() => handleSelectNote(note)}
                          className="btn-primary"
                          style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                          <FileText size={16} /> {t('dashboard.view_details') || "Ver detalles"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteNote(note.id, e)}
                          title="Eliminar albarán escaneado"
                          style={{
                            padding: '0.55rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #fee2e2',
                            background: '#fef2f2',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* View 2: Detail view of selected scanned delivery note */}
        {selectedNote && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Top Bar with Info & Image Action */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-light)', padding: '1rem 1.25rem', borderRadius: '0.85rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>Proveedor</span>
                  <span style={{ fontWeight: '700', color: 'var(--corp-green)', fontSize: '1rem' }}>{selectedNote.providerName || "Sin proveedor"}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>Fecha de escaneo</span>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{formatDateTimeDDMMYYYY(selectedNote.date || selectedNote.createdAt)}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>Progreso</span>
                  {(() => {
                    const total = editableRows.length;
                    const saved = editableRows.filter(r => r.saved).length;
                    return (
                      <span style={{ fontWeight: '700', fontSize: '0.9rem', color: saved === total && total > 0 ? '#15803d' : '#b45309' }}>
                        {saved} de {total} guardados
                      </span>
                    );
                  })()}
                </div>
              </div>

              {selectedNote.imageUrl && (
                <button
                  type="button"
                  onClick={() => setPreviewImage(selectedNote.imageUrl)}
                  className="btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                >
                  <Eye size={16} /> {t('dashboard.view_original_image') || "Ver albarán original"}
                </button>
              )}
            </div>

            {/* Entry Cards List matching GoodsReceiptIaScanModal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {editableRows.map((row, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    background: row.saved ? '#f8fafc' : 'white', 
                    border: '1px solid var(--border)', 
                    borderRadius: '1rem', 
                    padding: '1.5rem', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    opacity: row.saved ? 0.95 : 1, 
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  {/* Row 1: Product, Provider, Lote, Quantity */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('goods_receipt_form.product') || "Producto"}
                      </label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={row.productName} 
                        onChange={(e) => handleRowChange(idx, "productName", e.target.value)}
                        disabled={row.saved || row.saving}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                    
                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('goods_receipt_form.provider') || "Proveedor"}
                      </label>
                      <input 
                        type="text" 
                        list={`scanned-providers-list-${idx}`}
                        className="input-field" 
                        value={row.providerName} 
                        onChange={(e) => handleRowChange(idx, "providerName", e.target.value)}
                        disabled={row.saved || row.saving}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                      <datalist id={`scanned-providers-list-${idx}`}>
                        {providers.map(p => (
                          <option key={p.id} value={p.name} />
                        ))}
                      </datalist>
                    </div>

                    <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('traceability_form.lot') || "Lote"}
                      </label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={row.lote} 
                        onChange={(e) => handleRowChange(idx, "lote", e.target.value)}
                        disabled={row.saved || row.saving}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: '100px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('goods_receipt_form.quantity') || "Cantidad"}
                      </label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={row.quantity} 
                        onChange={(e) => handleRowChange(idx, "quantity", e.target.value)}
                        disabled={row.saved || row.saving}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  {/* Row 2: Relate with ingredients link + Info icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => openLinkModal(idx)}
                      disabled={row.saved || row.saving}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: row.relatedIngredients?.length > 0 ? 'var(--corp-green)' : '#64748b',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        textDecoration: 'underline',
                        cursor: row.saved ? 'default' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: 0
                      }}
                    >
                      <PlusCircle size={16} />
                      {row.relatedIngredients?.length > 0 
                        ? `${t('goods_receipt_form.relate_entry_with_ingredients') || "Relacionar esta entrada con ingredientes"} (${row.relatedIngredients.length})` 
                        : (t('goods_receipt_form.relate_entry_with_ingredients') || "Relacionar esta entrada con ingredientes")}
                    </button>
                    <Info 
                      size={16} 
                      style={{ cursor: 'pointer', color: 'var(--corp-green)' }} 
                      onClick={() => alert(t('goods_receipt_form.ia_ingredients_info_alert') || "Si relacionas esta entrada de mercancía con uno o varios ingredientes, cuando crees una elaboración y su trazabilidad, te aparecerá este lote en esos ingredientes.")}
                    />
                  </div>

                  {/* Row 3: Factura Nº, Temp. Transp/Fab, Fecha Fin, Tipo/Procedencia */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('goods_receipt_form.invoice_number') || "Número de factura"}
                      </label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={row.invoiceNumber} 
                        onChange={(e) => handleRowChange(idx, "invoiceNumber", e.target.value)}
                        disabled={row.saved || row.saving}
                        placeholder={t('goods_receipt_form.invoice_number') || "Nº factura"}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('goods_receipt_form.temp') || "Temperatura Transporte / Fab."}
                      </label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={row.manufacturingTemp} 
                        onChange={(e) => handleRowChange(idx, "manufacturingTemp", e.target.value)}
                        disabled={row.saved || row.saving}
                        placeholder="Temp. ºC"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('goods_receipt_form.end_date') || "Fecha de finalización"}
                      </label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={row.endDate} 
                        onChange={(e) => handleRowChange(idx, "endDate", e.target.value)}
                        disabled={row.saved || row.saving}
                        placeholder="Fin de consumo"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label className="label" style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>
                        {t('goods_receipt_form.type_and_origin') || "Tipo y procedencia"}
                      </label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={row.typeAndOrigin} 
                        onChange={(e) => handleRowChange(idx, "typeAndOrigin", e.target.value)}
                        disabled={row.saved || row.saving}
                        placeholder="Tipo/Origen"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  {/* Row 4: Status & Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      {row.saved ? (
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '0.35rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Check size={14} /> {t('dashboard.scanned_saved_badge') || "Guardado en mercancías"}
                        </span>
                      ) : (
                        <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.35rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: '700' }}>
                          {t('dashboard.scanned_pending_badge') || "Pendiente de guardar"}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {row.saved ? (
                        <button
                          type="button"
                          onClick={() => handleOpenReceiptEdit(row)}
                          className="btn-primary"
                          style={{
                            padding: '0.6rem 1.5rem',
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'var(--corp-green)',
                            color: 'white'
                          }}
                        >
                          <Edit size={16} /> {t('dashboard.view_details') || "Ver detalles"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSaveRow(idx)}
                          disabled={row.saving}
                          className="btn-primary"
                          style={{
                            padding: '0.6rem 1.5rem',
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'linear-gradient(135deg, var(--corp-green) 0%, #15803d 100%)'
                          }}
                        >
                          {row.saving ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              {"Guardando..."}
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              {t('goods_receipt_form.save_this_entry') || "Guardar esta entrada"}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Modal for Original Delivery Note Image */}
      {previewImage && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 1200, background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setPreviewImage(null)}
        >
          <div 
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              style={{
                position: 'absolute',
                top: '-2.5rem',
                right: 0,
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <X size={28} />
            </button>
            <img 
              src={previewImage} 
              alt="Albarán original" 
              style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }} 
            />
            <a 
              href={previewImage} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'white', marginTop: '0.75rem', fontSize: '0.85rem', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <ExternalLink size={14} /> Abrir imagen en pestaña nueva
            </a>
          </div>
        </div>
      )}

      {/* Raw Ingredients Link Submodal */}
      {linkRowIndex !== null && (
        <div className="modal-overlay" style={{ zIndex: 1150 }}>
          <div className="modal-content glass-card" style={{ maxWidth: '600px', width: '90%', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '85vh', overflow: 'hidden' }}>
            <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--corp-green)', margin: 0 }}>
                  {t('goods_receipt_form.link_ingredients_title') || "Vincular a materias primas"}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', marginBottom: 0 }}>
                  {editableRows[linkRowIndex]?.productName}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setLinkRowIndex(null);
                  setIngSearchTerm("");
                }} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
              <div className="form-group">
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder={t('goods_receipt_form.search_ingredients_placeholder') || "Buscar ingrediente..."}
                  value={ingSearchTerm}
                  onChange={(e) => setIngSearchTerm(e.target.value)}
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                {allIngredients
                  .filter(ing => ing.toLowerCase().includes(ingSearchTerm.toLowerCase()))
                  .map((ing, idx) => {
                    const isSelected = rowIngredients.includes(ing);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          if (isSelected) {
                            setRowIngredients(rowIngredients.filter(i => i !== ing));
                          } else {
                            setRowIngredients([...rowIngredients, ing]);
                          }
                        }}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          border: isSelected ? '1px solid var(--corp-green)' : '1px solid var(--border)',
                          background: isSelected ? 'var(--corp-green)' : 'white',
                          color: isSelected ? 'white' : 'var(--text-main)',
                          cursor: 'pointer'
                        }}
                      >
                        {ing}
                      </button>
                    );
                  })}
              </div>

              {rowIngredients.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                    {t('goods_receipt_form.stock_control_title') || "Control de stock:"}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {getIngredientsWithUnits(rowIngredients).map((item, idx) => {
                      const key = `${item.name}:${item.unit}`;
                      const val = rowQuantities[key] || "";
                      return (
                        <div className="form-group" key={idx}>
                          <label className="label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                            {`Cantidad de ${item.name} (${item.unit})`}
                          </label>
                          <input 
                            type="number"
                            step="any"
                            className="input-field"
                            value={val}
                            onChange={(e) => {
                              setRowQuantities({
                                ...rowQuantities,
                                [key]: e.target.value
                              });
                            }}
                            placeholder={editableRows[linkRowIndex]?.quantity || ""}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', gap: '1rem' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => {
                  setLinkRowIndex(null);
                  setIngSearchTerm("");
                }} 
                style={{ flex: 1, padding: '0.85rem' }}
              >
                {t('common.cancel')}
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={saveLinkDetails} 
                style={{ flex: 2, padding: '0.85rem' }}
              >
                {t('goods_receipt_form.link_popup_save') || "Guardar relación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
