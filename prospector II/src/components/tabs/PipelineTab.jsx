import React, { useState } from 'react';
import { Target, Download, Trash2 } from 'lucide-react';
import { NICHOS, PRIORITY_COLORS, STATUS_OPTIONS } from '../../constants';
import { analyzeWebsite } from '../../heuristics';
import { Input } from '../ui/Input';

export function PipelineTab({ leads, setLeads, settings }) {
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  const filtered = leads.filter(l => {
    if (filter === "all") return true;
    if (filter === "red" || filter === "yellow" || filter === "green") return l.priority === filter;
    return l.status === filter;
  });

  const selected = leads.find(l => l.id === selectedId);

  function updateLead(id, patch) {
    setLeads(leads.map(l => l.id === id ? { ...l, ...patch } : l));
  }
  function removeLead(id) {
    if (!confirm("Remover este lead do pipeline?")) return;
    setLeads(leads.filter(l => l.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function exportCSV() {
    const headers = ["name", "city", "email", "phone", "website", "priority", "problem", "status", "demoLink", "price", "nicho", "notes"];
    const rows = leads.map(l => headers.map(h => {
      const v = h === "nicho" ? (NICHOS.find(n => n.id === l.nichoId)?.label || "") : (l[h] || "");
      return `"${String(v).replace(/"/g, '""')}"`;
    }).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-20">
        <Target className="w-12 h-12 text-stone-700 mx-auto mb-4" />
        <h2 className="serif text-4xl mb-2">Pipeline vazio.</h2>
        <p className="text-stone-500">Vá em <span className="text-amber-500">Caça de Leads</span> pra começar.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="serif text-4xl">Pipeline <span className="text-amber-500">({leads.length})</span></h2>
        <button onClick={exportCSV} className="text-xs mono px-3 py-2 border border-stone-700 rounded-md hover:border-amber-500 flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" /> exportar CSV
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {[
          { id: "all", label: `Todos (${leads.length})` },
          { id: "red", label: `🔴 Premium (${leads.filter(l => l.priority === "red").length})` },
          { id: "yellow", label: `🟡 Site ruim (${leads.filter(l => l.priority === "yellow").length})` },
          { id: "green", label: `🟢 Ok (${leads.filter(l => l.priority === "green").length})` },
          { id: "new", label: `Novos (${leads.filter(l => l.status === "new").length})` },
          { id: "email_sent", label: `Enviados (${leads.filter(l => l.status === "email_sent").length})` },
          { id: "replied", label: `Responderam (${leads.filter(l => l.status === "replied").length})` },
          { id: "closed_won", label: `✅ Fechados (${leads.filter(l => l.status === "closed_won").length})` },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`text-xs mono px-3 py-1.5 rounded-md border transition-all ${
              filter === f.id ? "bg-amber-500 text-stone-950 border-amber-500" : "border-stone-800 text-stone-400 hover:border-stone-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_1.3fr] gap-4">
        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
          {filtered.map(l => (
            <LeadRow key={l.id} lead={l} selected={selectedId === l.id} onClick={() => setSelectedId(l.id)} />
          ))}
        </div>

        <div>
          {selected ? (
            <LeadDetail lead={selected} onUpdate={(p) => updateLead(selected.id, p)} onRemove={() => removeLead(selected.id)} settings={settings} />
          ) : (
            <div className="bg-stone-950 border border-stone-800 rounded-xl p-12 text-center text-stone-500">
              Selecione um lead pra ver detalhes, editar e gerar prompt/email.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LeadRow({ lead, selected, onClick }) {
  const p = PRIORITY_COLORS[lead.priority];
  const nicho = NICHOS.find(n => n.id === lead.nichoId);
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        selected ? "bg-amber-950/20 border-amber-500" : "bg-stone-950 border-stone-800 hover:border-stone-600"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-1 self-stretch rounded-full ${p.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{lead.name}</div>
          <div className="text-xs text-stone-500 mono truncate">{lead.city} · {nicho?.label}</div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] mono border ${p.cls}`}>{lead.problem}</span>
            <span className="text-[10px] mono text-stone-500 uppercase">{STATUS_OPTIONS.find(s => s.id === lead.status)?.label}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function LeadDetail({ lead, onUpdate, onRemove, settings }) {
  const nicho = NICHOS.find(n => n.id === lead.nichoId);
  const p = PRIORITY_COLORS[lead.priority];
  const [section, setSection] = useState("info");

  return (
    <div className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-stone-800">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="serif text-2xl">{lead.name}</h3>
            <div className="text-xs text-stone-500 mono mt-1">
              {lead.city} · {nicho?.label} · <span className={p.cls.split(" ").filter(c => c.includes("text-")).join(" ")}>{lead.problem}</span>
            </div>
          </div>
          <button onClick={onRemove} className="p-2 text-stone-500 hover:text-red-400" title="Remover">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex border-b border-stone-800 mono text-xs">
        {[
          { id: "info", label: "INFO" },
          { id: "research", label: "PESQUISA" },
          { id: "demo", label: "DEMO" },
          { id: "status", label: "STATUS" },
        ].map(s => (
          <button
            key={s.id} onClick={() => setSection(s.id)}
            className={`flex-1 py-2.5 uppercase tracking-widest transition-all ${section === s.id ? "bg-stone-900 text-amber-500" : "text-stone-500 hover:text-stone-300"}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-3 max-h-[50vh] overflow-y-auto">
        {section === "info" && (
          <>
            <Input label="Email do lead" value={lead.email} onChange={v => onUpdate({ email: v })} placeholder="info@business.com" />
            <Input label="Nome do contato" value={lead.contactName} onChange={v => onUpdate({ contactName: v })} placeholder="Dr. Smith" />
            <Input label="Telefone" value={lead.phone} onChange={v => onUpdate({ phone: v })} />
            <Input label="Endereço" value={lead.address} onChange={v => onUpdate({ address: v })} />
            <Input label="Website atual" value={lead.website} onChange={v => onUpdate({ website: v, ...analyzeWebsite(v) })} />
          </>
        )}
        {section === "research" && (
          <>
            <p className="text-xs text-stone-500 mb-2">Preencha isso DEPOIS de pesquisar Google Reviews + Insta do lead. É o que faz o prompt do Lovable ficar realmente bom.</p>
            <Input label="Serviços principais (separados por vírgula)" value={lead.services} onChange={v => onUpdate({ services: v })} placeholder="Teeth whitening, Implants, Orthodontics" />
            <div>
              <label className="mono text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block">
                Temas dos reviews (o que clientes elogiam)
              </label>
              <textarea
                value={lead.reviewsHighlights} onChange={e => onUpdate({ reviewsHighlights: e.target.value })}
                placeholder="painless procedures, friendly staff, modern equipment..."
                rows={2}
                className="w-full bg-stone-900 border border-stone-700 rounded-md px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
            <Input label="Instagram" value={lead.instagram} onChange={v => onUpdate({ instagram: v })} placeholder="@handle" />
            <Input label="Facebook" value={lead.facebook} onChange={v => onUpdate({ facebook: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Cor primária (hex)" value={lead.color1} onChange={v => onUpdate({ color1: v })} />
              <Input label="Cor secundária (hex)" value={lead.color2} onChange={v => onUpdate({ color2: v })} />
            </div>
            <Input label="CTA principal (texto do botão)" value={lead.cta} onChange={v => onUpdate({ cta: v })} placeholder="Book Appointment" />
          </>
        )}
        {section === "demo" && (
          <>
            <Input label="Link da demo (Lovable ou Vercel)" value={lead.demoLink} onChange={v => onUpdate({ demoLink: v })} placeholder="https://..." />
            <Input label="Preço final a cobrar (USD, só número)" value={lead.price} onChange={v => onUpdate({ price: v })} />
            <p className="text-xs text-stone-500 mono mt-2">→ Vá na aba <span className="text-amber-500">Gerar Prompt + Email</span> pra criar o pitch deste lead.</p>
          </>
        )}
        {section === "status" && (
          <>
            <div>
              <label className="mono text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block">Status</label>
              <select
                value={lead.status} onChange={e => onUpdate({ status: e.target.value })}
                className="w-full bg-stone-900 border border-stone-700 rounded-md px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
              >
                {STATUS_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mono text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block">Notas</label>
              <textarea
                value={lead.notes} onChange={e => onUpdate({ notes: e.target.value })}
                rows={6} placeholder="conversa, objeções, pontos importantes..."
                className="w-full bg-stone-900 border border-stone-700 rounded-md px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
