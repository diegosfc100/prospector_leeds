import React from 'react';

export function Stat({ label, value, color = "text-stone-100" }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-stone-500 uppercase tracking-widest">{label}</span>
      <span className={`${color} font-semibold text-base`}>{value}</span>
    </div>
  );
}
