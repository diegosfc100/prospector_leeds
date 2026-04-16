import React, { useState, useEffect, useMemo } from "react";
import { Search, Target, Sparkles, CheckSquare, DollarSign, Key } from "lucide-react";
import { loadLeads, saveLeads, loadSettings, saveSettings, loadChecklist, saveChecklist } from "./storage";
import { Stat } from "./components/ui/Stat";
import { HuntTab } from "./components/tabs/HuntTab";
import { PipelineTab } from "./components/tabs/PipelineTab";
import { ToolsTab } from "./components/tabs/ToolsTab";
import { ChecklistTab } from "./components/tabs/ChecklistTab";
import { PricingTab } from "./components/tabs/PricingTab";
import { SettingsTab } from "./components/tabs/SettingsTab";

export default function App() {
  const [tab, setTab] = useState("hunt");
  const [leads, setLeads] = useState([]);
  const [settings, setSettings] = useState({ googleApiKey: "", defaultPrice: "800", yourName: "" });
  const [checklistState, setChecklistState] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [l, s, c] = await Promise.all([loadLeads(), loadSettings(), loadChecklist()]);
      setLeads(l);
      setSettings({ googleApiKey: "", defaultPrice: "800", yourName: "", ...s });
      setChecklistState(c);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => { if (loaded) saveLeads(leads); }, [leads, loaded]);
  useEffect(() => { if (loaded) saveSettings(settings); }, [settings, loaded]);
  useEffect(() => { if (loaded) saveChecklist(checklistState); }, [checklistState, loaded]);

  const stats = useMemo(() => {
    const s = { total: leads.length, red: 0, yellow: 0, green: 0, sent: 0, won: 0 };
    leads.forEach(l => {
      if (l.priority) s[l.priority]++;
      if (["email_sent", "followup_1", "followup_2", "replied"].includes(l.status)) s.sent++;
      if (l.status === "closed_won") s.won++;
    });
    return s;
  }, [leads]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-100" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header className="border-b border-stone-800/80 bg-[#0a0a0a] sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-amber-500 flex items-center justify-center glow-amber">
              <Target className="w-5 h-5 text-stone-950" strokeWidth={2.5} />
            </div>
            <div>
              <div className="serif text-2xl leading-none">Prospector<span className="text-amber-500">.</span></div>
              <div className="mono text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">
                Gringa leads HQ · método Harlley
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 mono text-xs">
            <Stat label="LEADS" value={stats.total} />
            <Stat label="🔴" value={stats.red} color="text-red-400" />
            <Stat label="🟡" value={stats.yellow} color="text-amber-400" />
            <Stat label="ENVIADOS" value={stats.sent} />
            <Stat label="FECHADOS" value={stats.won} color="text-emerald-400" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {[
            { id: "hunt", label: "Caça de Leads", icon: Search },
            { id: "pipeline", label: "Pipeline", icon: Target },
            { id: "tools", label: "Gerar Prompt + Email", icon: Sparkles },
            { id: "checklist", label: "Checklist Semanal", icon: CheckSquare },
            { id: "pricing", label: "Preços + Invoice", icon: DollarSign },
            { id: "settings", label: "Configuração", icon: Key },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 rounded-t-md ${tab === t.id ? "tab-active" : "tab-inactive"}`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {tab === "hunt" && <HuntTab leads={leads} setLeads={setLeads} settings={settings} />}
        {tab === "pipeline" && <PipelineTab leads={leads} setLeads={setLeads} settings={settings} />}
        {tab === "tools" && <ToolsTab leads={leads} settings={settings} />}
        {tab === "checklist" && <ChecklistTab state={checklistState} setState={setChecklistState} />}
        {tab === "pricing" && <PricingTab />}
        {tab === "settings" && <SettingsTab settings={settings} setSettings={setSettings} />}
      </main>

      <footer className="border-t border-stone-800/60 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-stone-500 mono">
          <span>clone inspirado no método de <span className="text-amber-500">@harlleybastos</span></span>
          <span>dados salvos localmente · 100% seus</span>
        </div>
      </footer>
    </div>
  );
}
