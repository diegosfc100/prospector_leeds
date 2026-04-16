import React from 'react';

export function Scenario({ label, emails, result, money, accent }) {
  return (
    <div className={`p-3 rounded-md border ${accent ? "border-amber-500/60 bg-amber-950/20" : "border-stone-800"}`}>
      <div className="mono text-[10px] uppercase tracking-widest text-stone-500">{label}</div>
      <div className="mono text-xs text-stone-300 mt-2">{emails} emails</div>
      <div className="font-semibold mt-0.5">{result}</div>
      <div className={`mono text-sm mt-0.5 ${accent ? "text-amber-400" : "text-emerald-400"}`}>{money}</div>
    </div>
  );
}
