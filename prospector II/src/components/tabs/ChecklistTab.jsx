import React from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { CHECKLIST_SEMANAL } from '../../constants';
import { Scenario } from '../ui/Scenario';

function getWeekKey() {
  const d = new Date();
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay() + 1);
  return start.toISOString().slice(0, 10);
}

export function ChecklistTab({ state, setState }) {
  const weekKey = getWeekKey();
  const weekState = state[weekKey] || {};

  function toggle(key) {
    setState({ ...state, [weekKey]: { ...weekState, [key]: !weekState[key] } });
  }

  const allItems = Object.values(CHECKLIST_SEMANAL).flat();
  const done = allItems.filter(i => weekState[i]).length;
  const pct = Math.round((done / allItems.length) * 100);

  return (
    <div>
      <h2 className="serif text-4xl mb-2">Checklist semanal.</h2>
      <p className="text-stone-500 mb-6">Semana de {weekKey} · {done}/{allItems.length} concluídos · {pct}%</p>

      <div className="w-full bg-stone-900 rounded-full h-1 mb-8 overflow-hidden">
        <div className="bg-amber-500 h-full transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {Object.entries(CHECKLIST_SEMANAL).map(([day, items]) => (
          <div key={day} className="bg-stone-950 border border-stone-800 rounded-xl p-5">
            <h3 className="serif text-xl mb-4">{day}</h3>
            <div className="space-y-2">
              {items.map(i => {
                const checked = weekState[i];
                return (
                  <button
                    key={i} onClick={() => toggle(i)}
                    className="w-full flex items-start gap-2 text-left text-sm py-1.5 hover:text-amber-300"
                  >
                    {checked ? <CheckSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />}
                    <span className={checked ? "text-stone-500 line-through" : "text-stone-300"}>{i}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-5 bg-gradient-to-br from-amber-950/20 to-transparent border border-amber-900/40 rounded-xl">
        <h4 className="serif text-xl mb-2 text-amber-200">A matemática que importa</h4>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <Scenario label="pior caso" emails="30" result="1 cliente" money="$800" />
          <Scenario label="médio" emails="30" result="2 clientes" money="$1.600" />
          <Scenario label="bom" emails="40" result="3 clientes" money="$2.400" />
          <Scenario label="escalando" emails="60+" result="5+ clientes" money="$4.000+" accent />
        </div>
        <p className="text-xs text-stone-400 mt-4">
          Taxa de conversão realista: 3-5%. A cada 20-30 emails, 1 fecha. <strong className="text-stone-200">Volume + consistência</strong>.
        </p>
      </div>
    </div>
  );
}
