import fs from 'fs';
import path from 'path';

const filePath = 'C:/Users/usuario/.gemini/antigravity/scratch/quicktrace/app/dashboard/page.js';
let content = fs.readFileSync(filePath, 'utf8');

const saveBtnHtml = `          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button 
              onClick={handleSave}
              className="btn-primary" 
              disabled={loading || !hasChanges}
              style={{ minWidth: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem' }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> {t('common.save')}</>}
            </button>
          </div>`;

// Replace after the currency section
content = content.replace(
  /\{t\('business_config\.save_reminder'\)\}\r?\n\s+<\/div>\r?\n\s+<\/div>\r?\n\s+<\/section>/,
  `{t('business_config.save_reminder')}\n            </div>\n          </div>\n${saveBtnHtml}\n        </section>`
);

// Replace after the merchant types section (it's the second occurrence)
const parts = content.split(/\{t\('business_config\.save_reminder'\)\}\r?\n\s+<\/div>\r?\n\s+<\/div>\r?\n\s+<\/section>/);
if (parts.length === 2) {
    content = parts[0] + `{t('business_config.save_reminder')}\n            </div>\n          </div>\n${saveBtnHtml}\n        </section>` + parts[1];
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully added Save buttons');
