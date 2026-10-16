"use client";

import React, { useState, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import { 
  X, UploadCloud, FileSpreadsheet, ArrowLeft, ArrowRight, 
  Check, AlertCircle, Loader2, Table, Eye, CheckCircle2 
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function CustomerImportModal({ onClose, onSuccess }) {
  const { t } = useI18n();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1); // 1: Archivo y fila inicial, 2: Mapeo de columnas
  const [fileName, setFileName] = useState("");
  const [sheetData, setSheetData] = useState([]); // 2D array
  const [startRow, setStartRow] = useState(2); // 1-indexed
  const [columnMappings, setColumnMappings] = useState({}); // { [colIndex]: fieldKey }
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const customerFields = useMemo(() => [
    { key: "commercialName", label: t('customers.commercial_name') || "Nombre comercial", required: true },
    { key: "fiscalName", label: t('customers.fiscal_name') || "Nombre fiscal" },
    { key: "nif", label: t('customers.nif') || "NIF / CIF" },
    { key: "address", label: t('customers.address') || "Dirección" },
    { key: "postalCode", label: t('customers.postal_code') || "Código postal" },
    { key: "city", label: t('customers.city') || "Ciudad" },
    { key: "province", label: t('customers.province') || "Provincia" },
    { key: "phone", label: t('customers.phone') || "Teléfono" },
    { key: "phone2", label: t('customers.phone2') || "Teléfono 2" },
    { key: "email", label: t('customers.email') || "Email" },
    { key: "email2", label: t('customers.email2') || "Email 2" }
  ], [t]);

  const processFile = (file) => {
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary", cellDates: true });
        const firstSheet = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheet];
        const rawData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

        // Limpiar filas vacías finales
        const clean = [];
        let lastFilled = -1;
        for (let i = 0; i < rawData.length; i++) {
          const row = rawData[i];
          if (Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== "")) {
            lastFilled = i;
          }
        }
        for (let i = 0; i <= lastFilled; i++) {
          clean.push(rawData[i] || []);
        }

        if (clean.length === 0) {
          alert(t('customers.import_error') || "El archivo está vacío o no contiene filas con datos.");
          return;
        }

        setSheetData(clean);
        // Por defecto, si hay más de 1 fila, la fila 1 suele ser el encabezado y los datos empiezan en la 2
        const defaultStart = clean.length > 1 ? 2 : 1;
        setStartRow(defaultStart);
      } catch (err) {
        console.error("Error reading file:", err);
        alert(t('customers.import_error') || "Error al leer el archivo. Asegúrate de que es un archivo Excel o CSV válido.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // Número máximo de columnas
  const maxColumns = useMemo(() => {
    if (!sheetData || sheetData.length === 0) return 0;
    return Math.max(...sheetData.slice(0, 100).map(r => r.length), 0);
  }, [sheetData]);

  // Fila de encabezados sugerida (la fila previa a startRow si startRow > 1)
  const headerRowIndex = startRow > 1 ? startRow - 2 : null;

  // Auto-detección de columnas para el paso 2
  const handleProceedToMapping = () => {
    const mappings = {};
    const usedFields = new Set();

    const normalize = (text) => {
      if (!text) return "";
      return String(text).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    };

    for (let c = 0; c < maxColumns; c++) {
      const headerText = headerRowIndex !== null && sheetData[headerRowIndex] ? sheetData[headerRowIndex][c] : "";
      const h = normalize(headerText);
      let matchedField = "";

      if (h) {
        if ((h.includes("comercial") || h.includes("cliente") || h.includes("empresa") || h.includes("nombre")) && !h.includes("fiscal") && !h.includes("social")) {
          matchedField = "commercialName";
        } else if (h.includes("fiscal") || h.includes("razon") || h.includes("social")) {
          matchedField = "fiscalName";
        } else if (h.includes("cif") || h.includes("nif") || h.includes("dni") || h.includes("vat")) {
          matchedField = "nif";
        } else if (h.includes("direccion") || h.includes("calle") || h.includes("domicilio") || h.includes("address")) {
          matchedField = "address";
        } else if (h.includes("postal") || h.includes("cp") || h.includes("zip")) {
          matchedField = "postalCode";
        } else if (h.includes("ciudad") || h.includes("poblacion") || h.includes("municipio") || h.includes("localidad") || h.includes("city")) {
          matchedField = "city";
        } else if (h.includes("provincia") || h.includes("state") || h.includes("region")) {
          matchedField = "province";
        } else if (h.includes("tel") || h.includes("movil") || h.includes("phone")) {
          matchedField = usedFields.has("phone") ? "phone2" : "phone";
        } else if (h.includes("mail") || h.includes("correo")) {
          matchedField = usedFields.has("email") ? "email2" : "email";
        }
      }

      if (matchedField && !usedFields.has(matchedField)) {
        mappings[c] = matchedField;
        usedFields.add(matchedField);
      } else {
        mappings[c] = "";
      }
    }

    setColumnMappings(mappings);
    setStep(2);
  };

  const isCommercialNameMapped = useMemo(() => {
    return Object.values(columnMappings).includes("commercialName");
  }, [columnMappings]);

  // Total de filas de datos que se importarán
  const totalDataRows = useMemo(() => {
    if (!sheetData || sheetData.length === 0) return 0;
    return Math.max(0, sheetData.length - (startRow - 1));
  }, [sheetData, startRow]);

  const handleExecuteImport = async () => {
    if (!isCommercialNameMapped) {
      alert(t('customers.import_required_warning') || "Debes asignar obligatoriamente el campo 'Nombre comercial' para realizar la importación.");
      return;
    }

    const customersToImport = [];
    for (let r = startRow - 1; r < sheetData.length; r++) {
      const row = sheetData[r];
      if (!row || !row.some(c => c !== null && c !== undefined && String(c).trim() !== "")) continue;

      const customer = {};
      Object.entries(columnMappings).forEach(([colIdxStr, fieldKey]) => {
        if (fieldKey) {
          const colIdx = parseInt(colIdxStr);
          const cellVal = row[colIdx];
          customer[fieldKey] = (cellVal !== null && cellVal !== undefined) ? String(cellVal).trim() : "";
        }
      });

      if (customer.commercialName && customer.commercialName.trim().length > 0) {
        customersToImport.push(customer);
      }
    }

    if (customersToImport.length === 0) {
      alert(t('customers.import_required_warning') || "No se han encontrado filas con un nombre comercial válido.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/client/customers/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customers: customersToImport })
      });
      const data = await res.json();

      if (data.success) {
        const msg = data.skipped > 0 
          ? (t('customers.import_success_with_skipped') || "Se han importado {count} clientes correctamente ({skipped} filas sin nombre comercial fueron ignoradas).")
              .replace('{count}', data.count).replace('{skipped}', data.skipped)
          : (t('customers.import_success') || "Se han importado con éxito {count} clientes.").replace('{count}', data.count);
        alert(msg);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert(data.error || t('customers.import_error') || "Error al importar clientes");
      }
    } catch (err) {
      console.error(err);
      alert(t('alerts.connection_error') || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div 
        className="modal-content glass-card" 
        style={{ 
          maxWidth: step === 1 ? '850px' : '900px', 
          width: '95%', 
          maxHeight: '92vh', 
          overflowY: 'auto',
          background: 'white',
          padding: '2rem'
        }}
      >
        {/* Cabecera del Modal */}
        <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', pb: '1rem', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'rgba(66, 98, 22, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileSpreadsheet size={26} color="var(--corp-green)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
                {t('customers.import_modal_title') || "Importar clientes desde archivo"}
              </h2>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {t('customers.import_modal_subtitle') || "Sube un archivo Excel (.xlsx, .xls) o CSV para importar clientes de forma masiva"}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
            <X size={24} />
          </button>
        </header>

        {/* Indicador de pasos */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ 
            flex: 1, 
            padding: '0.75rem 1rem', 
            borderRadius: '0.75rem', 
            background: step === 1 ? 'rgba(66, 98, 22, 0.1)' : '#f8fafc',
            border: step === 1 ? '1.5px solid var(--corp-green)' : '1px solid var(--border)',
            color: step === 1 ? 'var(--corp-green)' : 'var(--text-muted)',
            fontWeight: '700',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: step === 1 ? 'var(--corp-green)' : '#cbd5e1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
              1
            </div>
            {t('customers.import_step1_title') || "1. Seleccionar archivo y fila de datos"}
          </div>

          <div style={{ 
            flex: 1, 
            padding: '0.75rem 1rem', 
            borderRadius: '0.75rem', 
            background: step === 2 ? 'rgba(66, 98, 22, 0.1)' : '#f8fafc',
            border: step === 2 ? '1.5px solid var(--corp-green)' : '1px solid var(--border)',
            color: step === 2 ? 'var(--corp-green)' : 'var(--text-muted)',
            fontWeight: '700',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: step === 2 ? 'var(--corp-green)' : '#cbd5e1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
              2
            </div>
            {t('customers.import_step2_title') || "2. Asignar columnas del cliente"}
          </div>
        </div>

        {/* PASO 1: Subida de archivo y selección de fila */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {sheetData.length === 0 ? (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragging ? '2px dashed var(--corp-green)' : '2px dashed #cbd5e1',
                  background: isDragging ? 'rgba(66, 98, 22, 0.05)' : '#f8fafc',
                  borderRadius: '1.25rem',
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <UploadCloud size={32} color="var(--corp-green)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                    {t('customers.import_drop_file') || "Haz clic aquí o arrastra tu archivo Excel o CSV"}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    {t('customers.import_file_formats') || "Formatos compatibles: .xlsx, .xls, .csv"}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Archivo cargado info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileSpreadsheet size={24} color="var(--corp-green)" />
                    <div>
                      <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.95rem' }}>{fileName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {sheetData.length} {t('customers.import_total_rows') || "filas detectadas"}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSheetData([]);
                      setFileName("");
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                  >
                    {t('customers.import_change_file') || "Cambiar archivo"}
                  </button>
                </div>

                {/* Configuración de Fila Inicial */}
                <div style={{ background: 'rgba(66, 98, 22, 0.04)', padding: '1.25rem', borderRadius: '1rem', border: '1.5px solid rgba(66, 98, 22, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '800', fontSize: '0.95rem', color: 'var(--corp-green)', marginBottom: '0.25rem' }}>
                        {t('customers.import_start_row_label') || "Fila a partir de la cual coger los datos:"}
                      </label>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {t('customers.import_start_row_help') || "Indica a partir de qué fila comienzan los clientes para omitir encabezados o títulos previos."}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>Fila:</span>
                      <input 
                        type="number"
                        min="1"
                        max={sheetData.length}
                        value={startRow}
                        onChange={(e) => setStartRow(Math.max(1, Math.min(sheetData.length, parseInt(e.target.value) || 1)))}
                        style={{
                          width: '80px',
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: '2px solid var(--corp-green)',
                          fontWeight: '800',
                          fontSize: '1rem',
                          textAlign: 'center'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Vista previa de las primeras filas */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Eye size={18} color="var(--corp-green)" /> {t('customers.import_preview_title') || "Vista previa de las primeras filas del documento"}
                  </h4>
                  <div style={{ maxHeight: '280px', overflowX: 'auto', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '0.75rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ background: '#f1f5f9', position: 'sticky', top: 0, zIndex: 10 }}>
                          <th style={{ padding: '0.6rem 0.85rem', borderRight: '1px solid var(--border)', width: '120px', textAlign: 'center', fontWeight: '800' }}>
                            {t('customers.import_preview_row') || "Fila"}
                          </th>
                          {Array.from({ length: maxColumns }).map((_, c) => (
                            <th key={c} style={{ padding: '0.6rem 0.85rem', borderRight: '1px solid var(--border)', minWidth: '130px', textAlign: 'left', color: 'var(--text-muted)' }}>
                              Col. {c + 1}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sheetData.slice(0, 10).map((row, rIdx) => {
                          const rowNum = rIdx + 1;
                          const isDataRow = rowNum >= startRow;
                          return (
                            <tr 
                              key={rIdx}
                              onClick={() => setStartRow(rowNum)}
                              style={{ 
                                background: isDataRow ? '#f0fdf4' : '#ffffff',
                                borderBottom: '1px solid var(--border)',
                                cursor: 'pointer',
                                transition: 'background 0.15s'
                              }}
                              title="Haz clic para seleccionar esta fila como inicio de datos"
                            >
                              <td style={{ padding: '0.6rem 0.85rem', borderRight: '1px solid var(--border)', textAlign: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                                  <span style={{ fontWeight: '800' }}>{rowNum}</span>
                                  <span style={{ 
                                    fontSize: '0.7rem', 
                                    padding: '0.15rem 0.4rem', 
                                    borderRadius: '0.35rem',
                                    fontWeight: '700',
                                    background: isDataRow ? 'var(--corp-green)' : '#94a3b8',
                                    color: 'white'
                                  }}>
                                    {isDataRow ? (t('customers.import_preview_data_badge') || "Dato a importar") : (t('customers.import_preview_header_badge') || "Ignorada / Encabezado")}
                                  </span>
                                </div>
                              </td>
                              {Array.from({ length: maxColumns }).map((_, cIdx) => (
                                <td key={cIdx} style={{ padding: '0.6rem 0.85rem', borderRight: '1px solid var(--border)', color: isDataRow ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: isDataRow ? '500' : '400' }}>
                                  {row[cIdx] !== undefined && row[cIdx] !== null ? String(row[cIdx]) : ""}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Botones de acción Paso 1 */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="btn-secondary" 
                    style={{ padding: '0.75rem 1.5rem' }}
                  >
                    {t('common.cancel') || "Cancelar"}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleProceedToMapping}
                    className="btn-primary" 
                    style={{ padding: '0.75rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800' }}
                  >
                    {t('customers.import_next_btn') || "Siguiente: Asignar columnas"} <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* PASO 2: Mapeo de columnas */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {t('customers.import_mapping_desc') || "Selecciona qué campo de cliente corresponde a cada una de las columnas de tu documento:"}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {totalDataRows} filas preparadas para importar a partir de la fila {startRow}.
              </div>
            </div>

            {/* Aviso si falta Nombre Comercial */}
            {!isCommercialNameMapped && (
              <div style={{ background: '#fef2f2', border: '1.5px solid #f87171', color: '#991b1b', padding: '0.85rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700' }}>
                <AlertCircle size={20} />
                {t('customers.import_required_warning') || "Debes asignar obligatoriamente el campo 'Nombre comercial' para realizar la importación."}
              </div>
            )}

            {isCommercialNameMapped && (
              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', color: '#166534', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700' }}>
                <CheckCircle2 size={18} />
                Campo obligatorio 'Nombre comercial' asignado correctamente.
              </div>
            )}

            {/* Lista de columnas para mapear */}
            <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.25rem' }}>
              {Array.from({ length: maxColumns }).map((_, cIdx) => {
                const headerText = headerRowIndex !== null && sheetData[headerRowIndex] ? sheetData[headerRowIndex][cIdx] : "";
                
                // Muestra de datos (primeros 3 valores no vacíos a partir de startRow)
                const samples = [];
                for (let r = startRow - 1; r < sheetData.length && samples.length < 3; r++) {
                  const val = sheetData[r]?.[cIdx];
                  if (val !== undefined && val !== null && String(val).trim() !== "") {
                    samples.push(String(val).trim());
                  }
                }

                const currentField = columnMappings[cIdx] || "";
                const isRequiredField = currentField === "commercialName";

                return (
                  <div 
                    key={cIdx} 
                    style={{ 
                      padding: '1rem 1.25rem', 
                      background: currentField ? (isRequiredField ? 'rgba(66, 98, 22, 0.05)' : '#ffffff') : '#f8fafc',
                      borderRadius: '0.85rem', 
                      border: currentField ? (isRequiredField ? '1.5px solid var(--corp-green)' : '1px solid var(--corp-green)') : '1px solid var(--border)',
                      display: 'grid',
                      gridTemplateColumns: 'minmax(220px, 1fr) minmax(200px, 1.2fr) minmax(220px, 1fr)',
                      alignItems: 'center',
                      gap: '1.25rem'
                    }}
                  >
                    {/* Columna del archivo */}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        Columna {cIdx + 1}
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', wordBreak: 'break-word' }}>
                        {headerText ? headerText : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Sin encabezado</span>}
                      </div>
                    </div>

                    {/* Muestra de datos */}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        {t('customers.import_sample_values') || "Ejemplos en tu archivo"}:
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {samples.length > 0 ? (
                          samples.map((s, sIdx) => (
                            <span key={sIdx} style={{ background: '#e2e8f0', padding: '0.15rem 0.45rem', borderRadius: '0.35rem', fontSize: '0.75rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={s}>
                              {s}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Vacío</span>
                        )}
                      </div>
                    </div>

                    {/* Selector de campo */}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        {t('customers.import_map_to') || "Campo de cliente"}:
                      </div>
                      <select 
                        className="input-field"
                        value={currentField}
                        onChange={(e) => {
                          const newField = e.target.value;
                          setColumnMappings(prev => ({
                            ...prev,
                            [cIdx]: newField
                          }));
                        }}
                        style={{
                          padding: '0.6rem 0.75rem',
                          fontSize: '0.9rem',
                          fontWeight: currentField ? '700' : '400',
                          borderColor: currentField ? 'var(--corp-green)' : 'var(--border)',
                          background: currentField ? '#ffffff' : '#f8fafc'
                        }}
                      >
                        <option value="">{t('customers.import_ignore_col') || "-- Ignorar esta columna --"}</option>
                        {customerFields.map(f => (
                          <option key={f.key} value={f.key}>
                            {f.label} {f.required ? " * (Obligatorio)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Botones de acción Paso 2 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="btn-secondary" 
                style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                disabled={loading}
              >
                <ArrowLeft size={18} /> {t('customers.import_back_btn') || "Atrás"}
              </button>

              <button 
                type="button" 
                onClick={handleExecuteImport}
                className="btn-primary" 
                disabled={!isCommercialNameMapped || loading}
                style={{ 
                  padding: '0.75rem 2rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  fontWeight: '800',
                  opacity: (!isCommercialNameMapped || loading) ? 0.6 : 1,
                  cursor: (!isCommercialNameMapped || loading) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={18} /> {t('customers.import_importing') || "Importando clientes..."}</>
                ) : (
                  <><Check size={18} /> {t('customers.import_execute_btn') || "Importar clientes"}</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
