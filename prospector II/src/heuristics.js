export function analyzeWebsite(website) {
  if (!website || website.trim() === "") {
    return { priority: "red", problem: "Sem site", problems: ["Não tem website"] };
  }
  const w = website.toLowerCase();
  const problems = [];
  let priority = "green";

  if (w.includes("facebook.com") || w.includes("fb.com")) {
    problems.push("Usa Facebook como site");
    priority = "red";
  }
  if (w.includes("instagram.com")) {
    problems.push("Usa Instagram como site");
    priority = "red";
  }
  if (w.includes("linktr.ee") || w.includes("linktree")) {
    problems.push("Usa Linktree como 'site'");
    priority = "red";
  }
  if (w.includes("wix.com") || w.includes("wixsite")) {
    problems.push("Template Wix sem customização");
    if (priority === "green") priority = "yellow";
  }
  if (w.includes("weebly.com") || w.includes("godaddysites")) {
    problems.push("Template genérico (Weebly/GoDaddy)");
    if (priority === "green") priority = "yellow";
  }
  if (w.startsWith("http://") && !w.startsWith("https://")) {
    problems.push("Sem HTTPS (inseguro)");
    if (priority === "green") priority = "yellow";
  }

  if (problems.length === 0) {
    return { priority: "green", problem: "Site existe (avaliar manualmente)", problems: ["Site existe — revise manualmente se vale o pitch"] };
  }
  return { priority, problem: problems[0], problems };
}
