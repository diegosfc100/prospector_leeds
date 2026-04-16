import React from 'react';

export function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="mono text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block">{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-stone-900 border border-stone-700 rounded-md px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
      />
    </div>
  );
}
