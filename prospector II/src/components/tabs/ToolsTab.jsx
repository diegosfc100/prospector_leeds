import React, { useState } from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { NICHOS, PRIORITY_COLORS } from '../../constants';
import { buildSuperPrompt, buildEmailDireto, buildEmailCompetitivo, buildEmailSemSite, buildFollowup1, buildFollowup2 } from '../../templates';
import { CopyButton } from '../ui/CopyButton';

export function ToolsTab({ leads, settings }) {
  const [leadId, setLeadId] = useState(leads[0]?.id || "");
  const [emailVariant, setEmailVariant] = useState("auto");
  const lead = leads.find(l => l.id === leadId);
  const nicho = lead ? NICHOS.find(n => n.id === lead.nichoId) : null;

  if (leads.length === 0) {
    return (
      <div className="text-center py-20">
        <Sparkles className="w-12 h-12 text-stone-700 mx-auto mb-4" />
        <h2 className="serif text-4xl mb-2">Sem leads ainda.</h2>
        <p className="text-stone-500">Adicione leads primeiro na <span className="text-amber-500">Caça</span>.</p>
      </div>
    );
  }

  const superPrompt = lead ? buildSuperPrompt(lead, nicho) : "";
  const variant = emailVariant === "auto"
    ? (lead?.priority === "red" ? "semsite" : "direto")
    : emailVariant;

  const emails = lead ? {
    direto: buildEmailDireto(lead, nicho, lead.demoLink, lead.price),
    competitivo: buildEmailCompetitivo(lead, nicho, lead.demoLink, lead.price),
    semsite: buildEmailSemSite(lead, nicho, lead.demoLink, lead.price),
    followup1: buildFollowup1(lead, lead.demoLink),
    followup2: buildFollowup2(lead, lead.demoLink),
  } : null;

  const selectedEmail = emails?.[variant];

  return (
    <div>
      <h2 className="serif text-4xl mb-2">Gerar Prompt + Email.</h2>
      <p className="text-stone-500 mb-6">Escolha o lead, copie o super prompt pro Lovable, depois copie o email pronto.</p>

      <div className="mb-6">
        <label className="mono text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block">Lead</label>
        <select
          value={leadId} onChange={e => setLeadId(e.target.value)}
          className="w-full md:w-auto min-w-[360px] bg-stone-900 border border-stone-700 rounded-md px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
        >
          {leads.map(l => (
            <option key={l.id} value={l.id}>
              {PRIORITY_COLORS[l.priority].label.split(" ")[0]} {l.name} · {l.city}
            </option>
          ))}
        </select>
      </div>

      {lead && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
              <div>
                <div className="mono text-[10px] text-amber-500 uppercase tracking-widest">01 · Lovable</div>
                <h3 className="font-semibold mt-0.5">Super Prompt</h3>
              </div>
              <CopyButton text={superPrompt} />
            </div>
            <pre className="p-5 text-xs mono whitespace-pre-wrap leading-relaxed text-stone-300 max-h-[500px] overflow-y-auto">{superPrompt}</pre>
            <div className="px-5 py-3 border-t border-stone-800 bg-stone-900/40 text-[11px] text-stone-500 mono">
              cole no lovable.dev → ajuste no chat → exporte → deploy na vercel
            </div>
          </div>

          <div className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-800">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="mono text-[10px] text-amber-500 uppercase tracking-widest">02 · Outreach</div>
                  <h3 className="font-semibold mt-0.5">Email</h3>
                </div>
                <CopyButton text={`Subject: ${selectedEmail.subject}\n\n${selectedEmail.body}`} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "auto", label: "auto" },
                  { id: "direto", label: "direto" },
                  { id: "competitivo", label: "competitivo" },
                  { id: "semsite", label: "sem site" },
                  { id: "followup1", label: "follow-up 1" },
                  { id: "followup2", label: "follow-up 2" },
                ].map(v => (
                  <button
                    key={v.id} onClick={() => setEmailVariant(v.id)}
                    className={`mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded border ${
                      emailVariant === v.id ? "bg-amber-500 text-stone-950 border-amber-500" : "border-stone-700 text-stone-400 hover:border-stone-500"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-5 max-h-[500px] overflow-y-auto">
              <div className="mono text-[11px] text-stone-500 mb-1">Subject:</div>
              <div className="text-sm font-semibold mb-4 pb-4 border-b border-stone-800">{selectedEmail.subject}</div>
              <pre className="text-xs mono whitespace-pre-wrap leading-relaxed text-stone-300">{selectedEmail.body}</pre>
            </div>
            <div className="px-5 py-3 border-t border-stone-800 bg-stone-900/40 text-[11px] text-stone-500 mono">
              {lead.email ? `→ enviar pra ${lead.email}` : "adicione o email do lead em Info"}
            </div>
          </div>
        </div>
      )}

      {lead && !lead.demoLink && (
        <div className="mt-6 bg-amber-950/20 border border-amber-800/50 rounded-md p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-200">
            Lead ainda sem link de demo. Gere a demo no Lovable com o prompt acima, deploya na Vercel, e cola o link na aba <strong>Pipeline → DEMO</strong>. Daí o email fica perfeito.
          </div>
        </div>
      )}
    </div>
  );
}
