// Set your Worker base URL once
const BASE = "https://cp-assistant-worker.merisoiu.workers.dev";
const ASK_URL = BASE + "/ask";
const PRESET_URL = BASE + "/preset";
const UPLOAD_URL = BASE + "/upload";

/* ------------ Tabs ------------ */
const tabs = [
  ["tab-ask","ask"],
  ["tab-presets","presets"],
  ["tab-upload","upload"]
];
tabs.forEach(([btn, panel])=>{
  document.getElementById(btn).onclick = ()=>{
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
    document.getElementById(btn).classList.add("active");
    document.getElementById(panel).classList.add("active");
  };
});

/* ------------ Ask ------------ */
document.getElementById("askSend").onclick = async ()=>{
  const q = document.getElementById("question").value.trim();
  const out = document.getElementById("askOut");
  out.textContent = "Thinking…";
  try{
    const r = await fetch(ASK_URL, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ question: q })
    });
    const j = await r.json();
    out.textContent = j.response || JSON.stringify(j, null, 2);
  }catch(e){ out.textContent = "Error: " + e.message; }
};
document.getElementById("askCopy").onclick = ()=>{
  navigator.clipboard.writeText(document.getElementById("askOut").textContent || "");
};

/* ------------ Presets → Newsletter (full) ------------ */
document.getElementById("genNewsletter").onclick = async ()=>{
  const topic = document.getElementById("newsTopic").value.trim();
  const out = document.getElementById("newsOut");
  out.textContent = "Thinking…";
  try{
    const r = await fetch(PRESET_URL, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ type:"newsletter", lang:"de", topic })
    });
    const j = await r.json();
    out.textContent = j.response || JSON.stringify(j, null, 2);
  }catch(e){ out.textContent = "Error: " + e.message; }
};
document.getElementById("newsCopy").onclick = ()=>{
  navigator.clipboard.writeText(document.getElementById("newsOut").textContent || "");
};

/* ------------ Presets → LinkedIn ------------ */
document.getElementById("genLinkedIn").onclick = async ()=>{
  const topic = document.getElementById("liTopic").value.trim();
  const lang = document.getElementById("liLang").value;
  const out = document.getElementById("liOut");
  out.textContent = "Thinking…";
  try{
    const r = await fetch(PRESET_URL, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ type:"linkedin", lang, topic })
    });
    const j = await r.json();
    out.textContent = j.response || JSON.stringify(j, null, 2);
  }catch(e){ out.textContent = "Error: " + e.message; }
};
document.getElementById("liCopy").onclick = ()=>{
  navigator.clipboard.writeText(document.getElementById("liOut").textContent || "");
};

/* ------------ Presets → Blog (DE) ------------ */
document.getElementById("genBlog").onclick = async ()=>{
  const topic = document.getElementById("blogTopic").value.trim();
  const out = document.getElementById("blogOut");
  out.textContent = "Thinking…";
  try{
    const r = await fetch(PRESET_URL, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ type:"blog", lang:"de", topic })
    });
    const j = await r.json();
    out.textContent = j.response || JSON.stringify(j, null, 2);
  }catch(e){ out.textContent = "Error: " + e.message; }
};
document.getElementById("blogCopy").onclick = ()=>{
  navigator.clipboard.writeText(document.getElementById("blogOut").textContent || "");
};

// ------------ X (DE) preset ------------
const genX = document.getElementById("genX");
if (genX) {
  genX.onclick = async () => {
    const topic = (document.getElementById("xTopic").value || "").trim();
    const landing = document.getElementById("xLanding").checked;
    const out = document.getElementById("xOut");
    if (!topic) { out.textContent = "Bitte ein Thema angeben."; return; }
    out.textContent = "Thinking…";
    try {
      const r = await fetch(PRESET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "x", lang: "de", topic, landing })
      });
      const j = await r.json();
      out.textContent = j.response || JSON.stringify(j, null, 2);
    } catch (e) {
      out.textContent = "Error: " + e.message;
    }
  };

  const xCopy = document.getElementById("xCopy");
  xCopy.onclick = () => {
    const txt = document.getElementById("xOut").textContent || "";
    navigator.clipboard.writeText(txt);
  };
}

/* =========================
   REVISION HELPERS (front-end only)
   ========================= */

/**
 * Build a minimal, type-specific revise instruction that leans on the Assistant's
 * existing system prompt. We pass draft + your tweak as a single /ask request.
 */
function buildRevisePrompt({ type, lang, topic, draft, userNote }) {
  const L = (lang || "de").toLowerCase();
  const t = type.toLowerCase();

  if (t === "linkedin") {
    return (L === "en"
      ? `Revise this LinkedIn draft in CP's voice (English). Keep the same TOPIC: "${topic}".
Apply this change: ${userNote}.
Rules: 120–150 words; start with a statement; reflective, radically honest, systemic; cultural-philosophical; no emojis; no hashtags unless truly meaningful; no promotional phrasing.
Return only the revised post.

DRAFT:
${draft}`
      : `Überarbeite diesen LinkedIn-Entwurf in CP-Stimme (Deutsch). Behalte das THEMA: "${topic}".
Änderung: ${userNote}.
Vorgaben: 120–150 Wörter; Einstieg mit Aussage; reflexiv, radikal ehrlich, systemisch; kulturphilosophisch; keine Emojis; keine Hashtags (außer wirklich sinnvoll); keine Werbesprache.
Gib nur den überarbeiteten Post aus.

ENTWURF:
${draft}`);
  }

  if (t === "x") {
    return `Überarbeite diesen X-Post (Deutsch). Behalte das THEMA: "${topic}".
Änderung: ${userNote}.
Regeln: 1–3 Sätze, scharf, provokante These oder Metapher. Keine Hashtags, keine Emojis, kein Promotion-Ton.
Gib nur den überarbeiteten X-Post aus.

ENTWURF:
${draft}`;
  }

  if (t === "blog") {
    return `Überarbeite diesen Blogentwurf (Deutsch) in CP-Stimme. Behalte das THEMA: "${topic}".
Änderung: ${userNote}.
Vorgaben: 400–600 Wörter; formelle Sie-Ansprache; klare Struktur (These, Vertiefung, Fazit); genderneutrale Sprache; ein natürlich verwendetes SEO-Schlüsselwort; keine Wiederholung früherer Titel/Metaphern/Angles.
Gib nur den überarbeiteten Blogtext aus.

ENTWURF:
${draft}`;
  }

  // newsletter
  return `Revise this monthly newsletter draft in CP's voice (bilingual: German + English). Keep the TOPIC: "${topic}".
Change requested: ${userNote}.
Keep the structure:
1) Bilingual Intro.
2) Gannaca Bulletin (DE + EN, one working URL, no bullets).
3) Challenges: 5 items, each DE + EN, each sourced.
4) Questionnaire: 3 neutral questions, bilingual.
5) News: updates, bilingual.
Tone: reflective, provocative, metaphor-rich; neutral where needed, sharp when it counts.
Return only the revised newsletter.

DRAFT:
${draft}`;
}

async function runRevise({ type, lang, topic, outEl }) {
  const draft = (outEl.textContent || "").trim();
  if (!draft) { outEl.textContent = "Nothing to revise. Generate first."; return; }

  const userNote = window.prompt("How should I revise it?\n(e.g. 'sharper first sentence, less buzzwords')");
  if (userNote == null || !userNote.trim()) return;

  const prompt = buildRevisePrompt({ type, lang, topic, draft, userNote: userNote.trim() });

  outEl.textContent = "Revising…";
  try {
    const r = await fetch(ASK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: prompt })
    });
    const j = await r.json();
    outEl.textContent = j.response || JSON.stringify(j, null, 2);
  } catch (e) {
    outEl.textContent = "Error: " + e.message;
  }
}

/* ------------ Revise buttons (one per preset) ------------ */

// Newsletter revise
document.getElementById("newsRevise").onclick = async ()=>{
  const topic = document.getElementById("newsTopic").value.trim();
  const out = document.getElementById("newsOut");
  await runRevise({ type: "newsletter", lang: "de", topic, outEl: out });
};

// LinkedIn revise
document.getElementById("liRevise").onclick = async ()=>{
  const topic = document.getElementById("liTopic").value.trim();
  const lang = document.getElementById("liLang").value;
  const out = document.getElementById("liOut");
  await runRevise({ type: "linkedin", lang, topic, outEl: out });
};

// X revise
const xRev = document.getElementById("xRevise");
if (xRev) {
  xRev.onclick = async ()=>{
    const topic = (document.getElementById("xTopic").value || "").trim();
    const out = document.getElementById("xOut");
    await runRevise({ type: "x", lang: "de", topic, outEl: out });
  };
}

// Blog revise
document.getElementById("blogRevise").onclick = async ()=>{
  const topic = document.getElementById("blogTopic").value.trim();
  const out = document.getElementById("blogOut");
  await runRevise({ type: "blog", lang: "de", topic, outEl: out });
};

/* ------------ Upload PDFs (optional future) ------------ */
document.getElementById("uploadBtn").onclick = async ()=>{
  const file = document.getElementById("pdfFile").files[0];
  const out = document.getElementById("uploadOut");
  if(!file){ out.textContent = "No file selected."; return; }
  out.textContent = "Uploading…";
  try{
    const form = new FormData();
    form.append("file", file, file.name);
    const r = await fetch(UPLOAD_URL, { method:"POST", body: form });
    const j = await r.json();
    out.textContent = JSON.stringify(j, null, 2);
  }catch(e){ out.textContent = "Error: " + e.message; }
};
