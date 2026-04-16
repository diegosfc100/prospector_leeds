import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, MapPin, Globe, ExternalLink, Plus, Star, ChevronRight } from 'lucide-react';
import { NICHOS, CITIES_SUGGESTED, PRIORITY_COLORS } from '../../constants';
import { analyzeWebsite } from '../../heuristics';
import { TechCard } from '../ui/TechCard';
import { Input } from '../ui/Input';

export function HuntTab({ leads, setLeads, settings }) {
  const [nichoId, setNichoId] = useState("dentist");
  const [city, setCity] = useState("Austin, Texas");
  const [onlyNoWebsite, setOnlyNoWebsite] = useState(false);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [manualMode, setManualMode] = useState(!settings.googleApiKey);

  const nicho = NICHOS.find(n => n.id === nichoId);

  useEffect(() => { setManualMode(!settings.googleApiKey); }, [settings.googleApiKey]);

  async function searchGoogle() {
    if (!settings.googleApiKey) {
      setError("Configure sua Google Places API key em Configuração primeiro.");
      return;
    }
    setSearching(true);
    setError("");
    setResults([]);

    try {
      const query = `${nicho.query} in ${city}`;
      const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": settings.googleApiKey,
          "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.websiteUri,places.internationalPhoneNumber,places.rating,places.userRatingCount,places.googleMapsUri,places.businessStatus",
        },
        body: JSON.stringify({ textQuery: query, pageSize: 20 }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API ${response.status}: ${errText.substring(0, 200)}`);
      }
      const data = await response.json();
      const places = data.places || [];

      const enriched = places.map(p => {
        const analysis = analyzeWebsite(p.websiteUri);
        return {
          _googleId: p.id,
          name: p.displayName?.text || "",
          address: p.formattedAddress || "",
          city,
          phone: p.internationalPhoneNumber || "",
          website: p.websiteUri || "",
          rating: p.rating || null,
          reviewCount: p.userRatingCount || 0,
          mapsUri: p.googleMapsUri || "",
          priority: analysis.priority,
          problem: analysis.problem,
          problems: analysis.problems,
        };
      });

      const filtered = onlyNoWebsite ? enriched.filter(r => r.priority === "red") : enriched;
      setResults(filtered);
      if (filtered.length === 0) setError("Nenhum resultado. Tente outra cidade ou remova o filtro 'só sem site'.");
    } catch (e) {
      setError(`Erro: ${e.message}. Verifique sua API key e se a Places API (New) está habilitada no Google Cloud.`);
    } finally {
      setSearching(false);
    }
  }

  function addLead(r) {
    if (leads.some(l => l._googleId && l._googleId === r._googleId)) {
      alert("Lead já está no pipeline.");
      return;
    }
    const newLead = {
      id: `L${Date.now()}${Math.floor(Math.random() * 1000)}`,
      ...r,
      nichoId,
      email: "",
      contactName: "",
      instagram: "",
      facebook: "",
      services: "",
      reviewsHighlights: "",
      cta: "",
      color1: "#2563EB",
      color2: "#1E40AF",
      demoLink: "",
      price: settings.defaultPrice || "800",
      status: "new",
      notes: "",
      createdAt: Date.now(),
    };
    setLeads([newLead, ...leads]);
  }

  function addAllVisible() {
    const newOnes = results
      .filter(r => !leads.some(l => l._googleId && l._googleId === r._googleId))
      .map(r => ({
        id: `L${Date.now()}${Math.floor(Math.random() * 10000)}`,
        ...r, nichoId, email: "", contactName: "", instagram: "", facebook: "",
        services: "", reviewsHighlights: "", cta: "", color1: "#2563EB", color2: "#1E40AF",
        demoLink: "", price: settings.defaultPrice || "800", status: "new", notes: "", createdAt: Date.now(),
      }));
    setLeads([...newOnes, ...leads]);
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="serif text-5xl md:text-6xl leading-[0.95] mb-3">
          Caça de leads.<br />
          <span className="text-amber-500 italic">Pragmática.</span>
        </h1>
        <p className="text-stone-400 max-w-2xl">
          Busca negócios em {nicho?.label.toLowerCase() || "nicho"} na cidade alvo via Google Places,
          detecta quem não tem site ou usa Facebook/Wix, e classifica por prioridade automaticamente —
          exatamente como o método ensina.
        </p>
      </div>

      <div className="bg-stone-950 border border-stone-800 rounded-xl p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="mono text-[10px] uppercase tracking-widest text-stone-500 mb-2 block">Nicho</label>
            <select
              value={nichoId} onChange={e => setNichoId(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 rounded-md px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
            >
              {NICHOS.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
            <p className="text-[11px] text-stone-500 mt-1.5 mono">ticket {nicho?.ticket}</p>
          </div>
          <div>
            <label className="mono text-[10px] uppercase tracking-widest text-stone-500 mb-2 block">Cidade</label>
            <input
              value={city} onChange={e => setCity(e.target.value)}
              list="cities" placeholder="Austin, Texas"
              className="w-full bg-stone-900 border border-stone-700 rounded-md px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
            />
            <datalist id="cities">
              {CITIES_SUGGESTED.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div className="flex items-end gap-3">
            <button
              onClick={() => setOnlyNoWebsite(!onlyNoWebsite)}
              className={`flex-1 px-3 py-2.5 rounded-md text-xs font-medium border transition-all ${
                onlyNoWebsite ? "bg-red-950/50 border-red-800 text-red-300" : "bg-stone-900 border-stone-700 text-stone-400"
              }`}
            >
              <Filter className="w-3.5 h-3.5 inline mr-1.5" />
              Só sem site
            </button>
            <button
              onClick={searchGoogle}
              disabled={searching || !settings.googleApiKey}
              className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 disabled:text-stone-500 text-stone-950 font-semibold px-4 py-2.5 rounded-md text-sm transition-all flex items-center justify-center gap-2"
            >
              {searching ? <>Buscando…</> : <><Search className="w-4 h-4" /> Buscar</>}
            </button>
          </div>
        </div>

        {!settings.googleApiKey && (
          <div className="mt-4 bg-amber-950/30 border border-amber-800/60 rounded-md p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-200 font-medium mb-1">Modo manual ativo</p>
              <p className="text-amber-300/80 text-xs">
                Você não configurou a Google Places API key. Use o formulário manual abaixo pra adicionar leads
                copiando do Google Maps diretamente. <span className="underline">Ou vá em Configuração</span> e cole sua chave (grátis até ~10k consultas/mês).
              </p>
            </div>
          </div>
        )}
        {error && (
          <div className="mt-4 bg-red-950/30 border border-red-800/60 rounded-md p-3 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{results.length} resultados</h3>
              <p className="text-xs text-stone-500 mono mt-0.5">
                {results.filter(r => r.priority === "red").length} 🔴 premium ·{" "}
                {results.filter(r => r.priority === "yellow").length} 🟡 ·{" "}
                {results.filter(r => r.priority === "green").length} 🟢
              </p>
            </div>
            <button
              onClick={addAllVisible}
              className="text-xs mono px-3 py-2 border border-stone-700 rounded-md hover:border-amber-500 hover:text-amber-400 transition-all"
            >
              + Adicionar todos ao pipeline
            </button>
          </div>
          <div className="divide-y divide-stone-800">
            {results.map(r => (
              <ResultRow key={r._googleId} r={r} onAdd={() => addLead(r)} inPipeline={leads.some(l => l._googleId === r._googleId)} />
            ))}
          </div>
        </div>
      )}

      <ManualLeadEntry onAdd={(lead) => setLeads([lead, ...leads])} nichoId={nichoId} city={city} defaultPrice={settings.defaultPrice} />

      <div className="bg-gradient-to-br from-stone-950 to-stone-900/60 border border-stone-800 rounded-xl p-6">
        <h3 className="serif text-2xl mb-4">Técnicas do método <span className="text-amber-500">— cheat sheet</span></h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <TechCard num="01" title="Filtro visual no Maps" body="Clique em cada negócio — tem botão Website? Se não → lead premium (🔴). Se aponta pro Facebook → também premium." />
          <TechCard num="02" title="Identificar sites ruins" body="Não responsivo, design antigo, Wix/Weebly sem custom, sem HTTPS, fotos genéricas, template óbvio." />
          <TechCard num="03" title="Dica de ouro" body="Ache o concorrente que TEM site bom. No email: 'I noticed [X] in your area has a modern website that ranks well...' Nada vende mais que mostrar que o vizinho tá na frente." />
        </div>
      </div>
    </div>
  );
}

function ResultRow({ r, onAdd, inPipeline }) {
  const p = PRIORITY_COLORS[r.priority];
  return (
    <div className="px-6 py-4 hover:bg-stone-900/50 transition-colors flex items-center gap-4">
      <div className={`w-2 h-12 rounded-full ${p.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-semibold truncate">{r.name}</h4>
          {r.rating && (
            <span className="mono text-[11px] text-amber-400 flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400" /> {r.rating} ({r.reviewCount})
            </span>
          )}
        </div>
        <div className="text-xs text-stone-500 flex flex-wrap gap-3 mt-1 mono">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.address}</span>
          {r.phone && <span>{r.phone}</span>}
          {r.website ? (
            <a href={r.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-stone-400 hover:text-amber-400">
              <Globe className="w-3 h-3" />{r.website.replace(/^https?:\/\//, "").replace(/\/$/, "").substring(0, 30)}
            </a>
          ) : (
            <span className="text-red-400">sem site</span>
          )}
        </div>
        <div className={`inline-block mt-2 px-2 py-0.5 rounded text-[11px] mono border ${p.cls}`}>
          {r.problem}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {r.mapsUri && (
          <a href={r.mapsUri} target="_blank" rel="noreferrer" className="p-2 text-stone-500 hover:text-stone-200" title="Ver no Maps">
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
        {inPipeline ? (
          <span className="text-xs mono text-emerald-400 px-3">✓ no pipeline</span>
        ) : (
          <button onClick={onAdd} className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> adicionar
          </button>
        )}
      </div>
    </div>
  );
}

function ManualLeadEntry({ onAdd, nichoId, city, defaultPrice }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", website: "", email: "", phone: "", address: "", city: city });

  function submit() {
    if (!form.name) return alert("Nome do negócio é obrigatório.");
    const analysis = analyzeWebsite(form.website);
    onAdd({
      id: `L${Date.now()}`,
      name: form.name,
      website: form.website,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city || city,
      contactName: "",
      nichoId,
      priority: analysis.priority,
      problem: analysis.problem,
      problems: analysis.problems,
      instagram: "", facebook: "",
      services: "", reviewsHighlights: "", cta: "",
      color1: "#2563EB", color2: "#1E40AF",
      demoLink: "",
      price: defaultPrice || "800",
      status: "new",
      notes: "",
      rating: null,
      reviewCount: 0,
      createdAt: Date.now(),
    });
    setForm({ name: "", website: "", email: "", phone: "", address: "", city: city });
    setOpen(false);
  }

  return (
    <div className="bg-stone-950 border border-stone-800 rounded-xl">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone-900/40"
      >
        <div>
          <h3 className="font-semibold">+ Adicionar lead manualmente</h3>
          <p className="text-xs text-stone-500 mt-0.5">Copiou dados do Google Maps no braço? Cola aqui.</p>
        </div>
        <ChevronRight className={`w-5 h-5 text-stone-500 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2 border-t border-stone-800 grid md:grid-cols-2 gap-3">
          <Input label="Nome do negócio *" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <Input label="Cidade" value={form.city} onChange={v => setForm({ ...form, city: v })} />
          <Input label="Website (deixe vazio se não tem)" value={form.website} onChange={v => setForm({ ...form, website: v })} placeholder="https://... ou facebook.com/..." />
          <Input label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
          <Input label="Telefone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
          <Input label="Endereço" value={form.address} onChange={v => setForm({ ...form, address: v })} />
          <div className="md:col-span-2 flex justify-end">
            <button onClick={submit} className="bg-amber-500 text-stone-950 font-semibold px-5 py-2 rounded-md text-sm hover:bg-amber-400">
              Adicionar ao pipeline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
