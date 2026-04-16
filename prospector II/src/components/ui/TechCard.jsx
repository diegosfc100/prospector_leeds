import React from 'react';

export function TechCard({ num, title, body }) {
  return (
    <div className="p-4 border border-stone-800 rounded-md bg-stone-950/50">
      <div className="mono text-[10px] text-amber-500 tracking-widest mb-2">TÉCNICA {num}</div>
      <h4 className="font-semibold mb-1.5 text-stone-100">{title}</h4>
      <p className="text-stone-400 text-[13px] leading-relaxed">{body}</p>
    </div>
  );
}
