import sys
import os

path = 'app/dashboard/page.js'
if not os.path.exists(path):
    print(f"File not found: {path}")
    sys.exit(1)

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Section 1: State Initialization
for i, line in enumerate(lines):
    if 'workshopTemp: "",' in line and i < 400:
        if 'preparationTime' not in lines[i+1]:
            lines[i] = line + '    preparationTime: "",\n'
            print("Updated state initialization")
        break

# Section 2: Edit Population
for i, line in enumerate(lines):
    if 'workshopTemp: elab.workshopTemp || "",' in line and i < 1500:
        if 'preparationTime' not in lines[i+1]:
            lines[i] = line + '      preparationTime: elab.preparationTime || "",\n'
            print("Updated edit population")
        break

# Section 3: Form Submission
for i, line in enumerate(lines):
    if 'workshopTemp: elaboracionForm.workshopTemp,' in line and i < 2500:
        if 'preparationTime' not in lines[i+1]:
            lines[i] = line + '          preparationTime: elaboracionForm.preparationTime,\n'
            print("Updated form submission")
        break

# Section 4: UI Rendering
for i, line in enumerate(lines):
    if "{t('traceability_form.workshop_temp') || \"Temperatura del obrador\"}" in line and i < 3100:
        # Check if already added
        already_added = False
        for k in range(i+1, i+30):
            if 'preparation_time' in lines[k]:
                already_added = True
                break
        
        if not already_added:
            # Find the next closing </div> of the current input's container
            for j in range(i+1, i+20):
                if '</div>' in lines[j]:
                    # Insert the new field after this div
                    new_field = [
                        '                    <div>\n',
                        '                      <label style={{ display: \'block\', marginBottom: \'0.75rem\', fontSize: \'0.9rem\', fontWeight: \'700\' }}>{t(\'traceability_form.preparation_time\') || "Tiempo que se ha tardado en hacer esta elaboración"}</label>\n',
                        '                      <input \n',
                        '                        type=\"text\" \n',
                        '                        className=\"input-field\" \n',
                        '                        value={elaboracionForm.preparationTime} \n',
                        '                        onChange={(e) => setElaboracionForm({...elaboracionForm, preparationTime: e.target.value})} \n',
                        '                      />\n',
                        '                      <p style={{ marginTop: \'0.5rem\', fontSize: \'0.8rem\', color: \'var(--text-muted)\', lineHeight: \'1.4\' }}>\n',
                        '                        {t(\'traceability_form.preparation_time_help\')}\n',
                        '                      </p>\n',
                        '                    </div>\n'
                    ]
                    lines[j] = lines[j] + ''.join(new_field)
                    print("Updated UI rendering")
                    break
        break

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
