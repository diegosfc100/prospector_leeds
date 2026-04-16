import React, { useState } from 'react';
import { PRICING } from '../../constants';
import { Input } from '../ui/Input';
import { CopyButton } from '../ui/CopyButton';

export function PricingTab() {
  const [form, setForm] = useState({
    invoiceNum: "001", date: new Date().toISOString().slice(0, 10),
    fromName: "", fromEmail: "",
    clientName: "", clientBiz: "",
    price: "800", description: "Responsive landing page (mobile + desktop)\n- Contact form + SEO\n- Domain setup + Hosting (1yr)\n- 30 days post-launch support",
  });

  const invoice = `INVOICE #${form.invoiceNum}
Date: ${form.date} | Due: Upon receipt

From: ${form.fromName || "[YOUR NAME]"} | ${form.fromEmail || "[YOUR EMAIL]"}
To: ${form.clientName || "[CLIENT]"} | ${form.clientBiz || "[BUSINESS NAME]"}

Website design and development:
${form.description}

Total: $${form.price}

Payment: 50% upfront | 50% on delivery
Pay via: PayPal / Wise / Stripe`;

  return (
    <div>
      <h2 className="serif text-4xl mb-2">Preços & Invoice.</h2>
      <p className="text-stone-500 mb-6">Tabela de referência do método + gerador de invoice pronto.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-800">
            <div className="mono text-[10px] text-amber-500 uppercase tracking-widest">TABELA</div>
            <h3 className="font-semibold mt-0.5">Preços de referência</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="mono text-[10px] uppercase tracking-widest text-stone-500 border-b border-stone-800">
              <tr>
                <th className="text-left px-4 py-2.5">serviço</th>
                <th className="text-right px-4 py-2.5">gringa</th>
                <th className="text-right px-4 py-2.5">brasil</th>
              </tr>
            </thead>
            <tbody>
              {PRICING.map((p, i) => (
                <tr key={i} className="border-b border-stone-900/60">
                  <td className="px-4 py-3 text-stone-200">{p.service}</td>
                  <td className="px-4 py-3 text-right mono text-amber-400">{p.usd}</td>
                  <td className="px-4 py-3 text-right mono text-stone-400">{p.brl}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 bg-stone-900/40 border-t border-stone-800 text-[11px] mono text-stone-500">
            → comece no mínimo da faixa · aumente após 3-5 clientes fechados
          </div>
        </div>

        <div className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
            <div>
              <div className="mono text-[10px] text-amber-500 uppercase tracking-widest">GERADOR</div>
              <h3 className="font-semibold mt-0.5">Invoice</h3>
            </div>
            <CopyButton text={invoice} />
          </div>
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Invoice #" value={form.invoiceNum} onChange={v => setForm({ ...form, invoiceNum: v })} />
              <Input label="Data" value={form.date} onChange={v => setForm({ ...form, date: v })} type="date" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Seu nome" value={form.fromName} onChange={v => setForm({ ...form, fromName: v })} />
              <Input label="Seu email" value={form.fromEmail} onChange={v => setForm({ ...form, fromEmail: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nome do cliente" value={form.clientName} onChange={v => setForm({ ...form, clientName: v })} />
              <Input label="Negócio" value={form.clientBiz} onChange={v => setForm({ ...form, clientBiz: v })} />
            </div>
            <Input label="Preço (USD)" value={form.price} onChange={v => setForm({ ...form, price: v })} />
            <div>
              <label className="mono text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 block">Descrição (uma linha por item, pode iniciar com -)</label>
              <textarea
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                rows={5}
                className="w-full bg-stone-900 border border-stone-700 rounded-md px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
            <pre className="bg-stone-900/60 border border-stone-800 rounded-md p-3 text-xs mono whitespace-pre-wrap leading-relaxed text-stone-300">{invoice}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
