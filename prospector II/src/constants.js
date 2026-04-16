export const NICHOS = [
  { id: "dentist", label: "Dentistas", query: "dentist", ticket: "$800-1500", reason: "Site obrigatório, muitos horríveis. Alto ticket." },
  { id: "restaurant", label: "Restaurantes", query: "restaurant", ticket: "$500-1000", reason: "Visual importa, muitos sem site." },
  { id: "real_estate", label: "Imobiliárias", query: "real estate agency", ticket: "$1000-2000", reason: "Precisam de site bonito. Alto valor." },
  { id: "gym", label: "Academias", query: "gym fitness", ticket: "$600-1200", reason: "Dependem de Instagram, precisam de site." },
  { id: "barber", label: "Barbearias/Salões", query: "barbershop hair salon", ticket: "$500-800", reason: "Agendamento online é diferencial." },
  { id: "vet", label: "Veterinárias", query: "veterinary clinic", ticket: "$800-1200", reason: "Donos de pet gastam. Sites fracos." },
  { id: "law", label: "Advocacia", query: "law firm attorney", ticket: "$1000-2000", reason: "Credibilidade online. Alto ticket." },
  { id: "accountant", label: "Contadores", query: "accountant tax consultant", ticket: "$800-1500", reason: "Muitos sem site. Serviço recorrente." },
  { id: "photographer", label: "Fotógrafos", query: "photographer wedding", ticket: "$600-1200", reason: "Portfolio visual é tudo." },
  { id: "driving", label: "Auto escolas", query: "driving school", ticket: "$500-900", reason: "Mercado local. Agendamento é key." },
];

export const CITIES_SUGGESTED = [
  "Austin, Texas", "Denver, Colorado", "Nashville, Tennessee", "Portland, Oregon",
  "Raleigh, North Carolina", "Charlotte, North Carolina", "Columbus, Ohio",
  "Kansas City, Missouri", "Minneapolis, Minnesota", "Tampa, Florida",
  "Orlando, Florida", "Phoenix, Arizona", "San Diego, California",
  "Manchester, UK", "Birmingham, UK", "Leeds, UK",
  "Munich, Germany", "Hamburg, Germany", "Rotterdam, Netherlands",
];

export const PRIORITY_COLORS = {
  red: { label: "🔴 Sem site / Só Facebook", cls: "bg-red-950/40 text-red-300 border-red-800/60", dot: "bg-red-500" },
  yellow: { label: "🟡 Site ruim", cls: "bg-amber-950/40 text-amber-300 border-amber-800/60", dot: "bg-amber-500" },
  green: { label: "🟢 Site ok, melhorável", cls: "bg-emerald-950/40 text-emerald-300 border-emerald-800/60", dot: "bg-emerald-500" },
};

export const STATUS_OPTIONS = [
  { id: "new", label: "Novo" },
  { id: "researched", label: "Pesquisado" },
  { id: "demo_made", label: "Demo pronta" },
  { id: "email_sent", label: "Email enviado" },
  { id: "followup_1", label: "Follow-up 1" },
  { id: "followup_2", label: "Follow-up 2" },
  { id: "replied", label: "Respondeu" },
  { id: "closed_won", label: "✅ Fechou" },
  { id: "closed_lost", label: "❌ Perdido" },
];

export const PRICING = [
  { service: "Landing Page (1-3 páginas)", usd: "$500 - $800", brl: "R$ 1.500 - R$ 3.000" },
  { service: "Site Institucional (4-6 páginas)", usd: "$800 - $1.500", brl: "R$ 3.000 - R$ 5.000" },
  { service: "Site + Blog/CMS", usd: "$1.500 - $3.000", brl: "R$ 5.000 - R$ 8.000" },
  { service: "E-commerce simples", usd: "$2.000 - $4.000", brl: "R$ 7.000 - R$ 12.000" },
  { service: "Manutenção mensal", usd: "$20 - $50/mês", brl: "R$ 100 - R$ 200/mês" },
];

export const CHECKLIST_SEMANAL = {
  "Segunda — Prospecção": [
    "Escolher/manter nicho da semana",
    "Buscar 20-30 leads no Google Maps",
    "Preencher planilha (Nome, Email, Problema, Prioridade)",
    "Separar por prioridade (🔴 primeiro)",
    "Pesquisar os 10 melhores (Reviews, Insta, concorrentes)",
  ],
  "Terça-Quarta — Demos": [
    "Criar super prompt por lead",
    "Gerar demo no Lovable (~20min cada)",
    "Testar no celular + checklist qualidade",
    "Salvar links na planilha",
    "Salvar prompt como template do nicho",
  ],
  "Quinta-Sexta — Envio": [
    "Enviar 5-10 emails de primeiro contato",
    "Follow-up 1 (leads da semana passada)",
    "Follow-up 2 (leads de 2 semanas atrás)",
    "Atualizar status na planilha",
    "Responder interessados em até 4h",
  ],
};
