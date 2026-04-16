export const buildSuperPrompt = (lead, nicho) => {
  const services = lead.services || "[SERVIÇO 1], [SERVIÇO 2], [SERVIÇO 3]";
  const city = lead.city || "[CIDADE]";
  const cor1 = lead.color1 || "#2563EB";
  const cor2 = lead.color2 || "#1E40AF";
  const keywords = `${nicho?.query || "service"} ${city}`;
  const reviews = lead.reviewsHighlights || "professional service, great results, friendly staff";
  const cta = lead.cta || "Book Appointment";
  const nichoLabel = nicho?.label?.toLowerCase() || "business";
  const customer = nichoLabel.includes("dent") || nichoLabel.includes("vet") || nichoLabel.includes("advoc")
    ? "patient/client"
    : "customer";

  return `Create a modern, professional landing page for a ${nichoLabel.replace(/s$/, "")} called ${lead.name} located in ${city}.

Services offered: ${services}

Design: Clean, modern, trustworthy. ${cor1} and ${cor2} palette with white backgrounds. Mobile-first, responsive, fast loading.

Sections:
1) Hero with headline emphasizing trust/quality + CTA button "${cta}"
2) Services grid with icons and short descriptions
3) About section — highlight experience, certifications, what makes ${lead.name} different
4) Testimonials — 3 testimonials based on these real review themes: ${reviews}
5) Contact section with address (${lead.address || city}), phone ${lead.phone || "[PHONE]"}, embedded Google Maps, contact form
6) Footer with social links (${lead.instagram || "Instagram"}, ${lead.facebook || "Facebook"})

Technical requirements:
- Responsive mobile-first design
- Fast loading (lazy load images, optimize assets)
- Smooth scroll navigation
- Contact form that sends to ${lead.email || "[EMAIL]"}
- SEO meta tags optimized for "${keywords}"
- Schema.org LocalBusiness markup
- WhatsApp floating button linking to ${lead.phone || "[PHONE]"}

Tone: Professional but warm. Convey trust and local community presence.`;
};

export const buildEmailDireto = (lead, nicho, demoLink, price) => {
  const nichoLabel = nicho?.label?.toLowerCase() || "business";
  const customer = nichoLabel.includes("dent") ? "patients" : nichoLabel.includes("vet") ? "pet owners" : "customers";
  return {
    subject: `Modern website concept for ${lead.name}`,
    body: `Hi ${lead.contactName || "there"},

I came across ${lead.name} while looking for ${nichoLabel} in ${lead.city} and noticed your online presence could use a modern refresh to better match the quality of your services.

I created a concept for you — here's a live preview:
${demoLink || "[PASTE DEMO LINK HERE]"}

It includes responsive mobile design, ${nicho?.id === "dentist" || nicho?.id === "barber" || nicho?.id === "gym" ? "online booking" : "contact form"}, and an optimized layout to convert visitors into ${customer}.

Final version in 5 business days for $${price || "800"}. Preview available for 7 days.

Best,
[Your Name] | Web Developer`,
  };
};

export const buildEmailCompetitivo = (lead, nicho, demoLink, price) => {
  const nichoLabel = nicho?.label?.toLowerCase() || "business";
  return {
    subject: `Your competitors have better websites — let's fix that`,
    body: `Hi ${lead.contactName || "there"},

I compared ${nichoLabel} websites in ${lead.city}. Your reviews are great, but your online presence doesn't reflect ${lead.name}'s quality. I built a concept to put you ahead:

${demoLink || "[PASTE DEMO LINK HERE]"}

5 business days, $${price || "800"}. Preview live 7 days.

Best,
[Your Name]`,
  };
};

export const buildEmailSemSite = (lead, nicho, demoLink, price) => {
  const nichoLabel = nicho?.label?.toLowerCase() || "business";
  return {
    subject: `I built a website for ${lead.name} — take a look`,
    body: `Hi ${lead.contactName || "there"},

Found ${lead.name} on Google Maps — ${lead.rating ? `${lead.rating}★ ratings!` : "great reviews!"} A website would help more people find you. I created one:

${demoLink || "[PASTE DEMO LINK HERE]"}

Mobile-friendly, your services + location + booking button. Ready in 5 days for $${price || "800"}. Preview up for 7 days.

Best,
[Your Name] | Web Developer`,
  };
};

export const buildFollowup1 = (lead, demoLink) => ({
  subject: `Re: Website concept for ${lead.name}`,
  body: `Hi ${lead.contactName || "there"},

Just following up on the website concept I sent. Preview still active:
${demoLink || "[DEMO LINK]"}

Would you have 5 min to look? Happy to answer questions.

Best,
[Your Name]`,
});

export const buildFollowup2 = (lead, demoLink) => ({
  subject: `Re: Website — last chance to preview`,
  body: `Hi ${lead.contactName || "there"},

Taking the preview down soon. Here's the link one more time:
${demoLink || "[DEMO LINK]"}

No pressure!

Best,
[Your Name]`,
});
