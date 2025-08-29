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
