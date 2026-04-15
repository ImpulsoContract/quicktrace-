import fs from 'fs';

const filePath = 'C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update GoodsReceiptModal definition
content = content.replace(
    'function GoodsReceiptModal({ onClose, onSubmit, formData, setFormData, loading, isEditing, onImageChange, providers, allMerchantTypes = [] }) {',
    'function GoodsReceiptModal({ onClose, onSubmit, formData, setFormData, loading, isEditing, onImageChange, providers, allMerchantTypes = [], onGoToConfig }) {'
);

// 2. Add reminder UI to GoodsReceiptModal
const reminderUI = `          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
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
          </div>`;

// We find the closing of the merchant types loop in GoodsReceiptModal
// Note: It's the first occurrence of this pattern AFTER the GoodsReceiptModal definition
const searchPattern = /input\s+type="checkbox"[\s\S]+?<\/label>\s+\)\)\}\s+<\/div>\s+<\/div>\s+\)\}/;
content = content.replace(searchPattern, (match) => match + '\n\n' + reminderUI);

// 3. Update GoodsReceiptModal call in Dashboard
content = content.replace(
    /allMerchantTypes=\{profile\?\.merchantTypes \|\| \[\]\}\s+\/>/,
    'allMerchantTypes={profile?.merchantTypes || []}\n          onGoToConfig={() => {\n            setActiveTab("configuracion");\n            setIsGoodsModalOpen(false);\n            setEditingGoodsReceipt(null);\n          }}\n        />'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated GoodsReceiptModal');
