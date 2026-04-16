import React from 'react';
import { Key } from 'lucide-react';
import { STORAGE_KEYS } from '../../storage';

export function SettingsTab({ settings, setSettings }) {
  return (
    <div className="max-w-2xl">
      <h2 className="serif text-4xl mb-2">Configuração.</h2>
      <p className="text-stone-500 mb-8">Seu painel, seus dados. Tudo fica salvo só pra você.</p>

      <div className="bg-stone-950 border border-stone-800 rounded-xl p-6 space-y-5">
        <div>
          <label className="mono text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block flex items-center gap-2">
            <Key className="w-3 h-3" /> Google Places API Key
          </label>
          <input
            type="password"
            value={settings.googleApiKey}
            onChange={e => setSettings({ ...settings, googleApiKey: e.target.value })}
            placeholder="AIza..."
            className="w-full bg-stone-900 border border-stone-700 rounded-md px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none mono"
          />
          <div className="text-xs text-stone-500 mt-2 space-y-1.5">
            <p><strong className="text-stone-300">Como pegar (5 min):</strong></p>
            <p>1. Vá em <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">console.cloud.google.com</a> e crie um projeto.</p>
            <p>2. Em "APIs & Services" → "Library" → busque <strong>"Places API (New)"</strong> → Enable.</p>
            <p>3. Em "Credentials" → "Create credentials" → "API key". Copie.</p>
            <p>4. O Google dá ~$200 de crédito grátis por mês. Text Search custa ~$0.032 por chamada → ~6000 buscas grátis/mês.</p>
            <p className="text-amber-400 mt-2">⚠️ Restrinja a key a "Places API (New)" apenas, e guarde bem. Ela fica salva só aqui na sua sessão.</p>
          </div>
        </div>

        <div>
          <label className="mono text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block">Seu nome (usado nos emails)</label>
          <input
            value={settings.yourName}
            onChange={e => setSettings({ ...settings, yourName: e.target.value })}
            placeholder="João Silva"
            className="w-full bg-stone-900 border border-stone-700 rounded-md px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mono text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block">Preço padrão (USD)</label>
          <input
            value={settings.defaultPrice}
            onChange={e => setSettings({ ...settings, defaultPrice: e.target.value })}
            placeholder="800"
            className="w-full bg-stone-900 border border-stone-700 rounded-md px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
          />
          <p className="text-xs text-stone-500 mt-1">Usado como padrão para novos leads. Dá pra ajustar por lead.</p>
        </div>
      </div>

      <div className="mt-6 p-5 bg-red-950/20 border border-red-900/40 rounded-xl">
        <h4 className="font-semibold text-red-200 mb-2">Zona perigo</h4>
        <p className="text-xs text-stone-400 mb-3">Isso apaga TUDO (leads, configs, checklist). Não tem volta.</p>
        <button
          onClick={async () => {
            if (!confirm("Apagar TODOS os leads, configs e checklist?")) return;
            try {
              await window.storage.delete(STORAGE_KEYS.LEADS);
              await window.storage.delete(STORAGE_KEYS.SETTINGS);
              await window.storage.delete(STORAGE_KEYS.CHECKLIST);
              window.location.reload();
            } catch (e) { alert("erro: " + e.message); }
          }}
          className="text-xs mono px-3 py-2 border border-red-800 text-red-400 rounded-md hover:bg-red-950/40"
        >
          apagar tudo
        </button>
      </div>
    </div>
  );
}
