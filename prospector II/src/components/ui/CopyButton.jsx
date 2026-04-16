import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs px-3 py-2 rounded-md flex items-center gap-1.5"
    >
      {copied ? <><Check className="w-3.5 h-3.5" /> copiado</> : <><Copy className="w-3.5 h-3.5" /> copiar</>}
    </button>
  );
}
