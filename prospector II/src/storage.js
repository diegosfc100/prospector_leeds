export const STORAGE_KEYS = {
  LEADS: "prospector:leads",
  SETTINGS: "prospector:settings",
  CHECKLIST: "prospector:checklist",
};

export async function loadLeads() {
  try {
    const r = await window.storage.get(STORAGE_KEYS.LEADS);
    return r ? JSON.parse(r.value) : [];
  } catch { return []; }
}
export async function saveLeads(leads) {
  try { await window.storage.set(STORAGE_KEYS.LEADS, JSON.stringify(leads)); } catch (e) { console.error(e); }
}
export async function loadSettings() {
  try {
    const r = await window.storage.get(STORAGE_KEYS.SETTINGS);
    return r ? JSON.parse(r.value) : {};
  } catch { return {}; }
}
export async function saveSettings(settings) {
  try { await window.storage.set(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); } catch (e) { console.error(e); }
}
export async function loadChecklist() {
  try {
    const r = await window.storage.get(STORAGE_KEYS.CHECKLIST);
    return r ? JSON.parse(r.value) : {};
  } catch { return {}; }
}
export async function saveChecklist(c) {
  try { await window.storage.set(STORAGE_KEYS.CHECKLIST, JSON.stringify(c)); } catch (e) { console.error(e); }
}
