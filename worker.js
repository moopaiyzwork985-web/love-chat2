const HTML = "<!DOCTYPE html>\n<html lang=\"th\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n<title>แชทของเรา 💗</title>\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link href=\"https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;600&display=swap\" rel=\"stylesheet\">\n<style>\n  :root { --pink:#ff6f9c; --pink-soft:#ffe3ec; --bg:#fff7fa; --text:#3a2a31; --muted:#a08a93; }\n  * { box-sizing:border-box; }\n  html, body { margin:0; height:100%; }\n  body { font-family:\"Noto Sans Thai\",system-ui,sans-serif; background:var(--bg); color:var(--text);\n         display:flex; flex-direction:column; height:100dvh; }\n  header { display:flex; align-items:center; gap:10px; padding:12px 16px; background:#fff;\n           border-bottom:1px solid #f3d6e0; padding-top:max(12px, env(safe-area-inset-top)); }\n  header h1 { font-size:17px; margin:0; flex:1; }\n  #status { font-size:12px; color:var(--muted); }\n  .dot { display:inline-block; width:8px; height:8px; border-radius:50%; background:#ccc; margin-right:4px; }\n  .dot.on { background:#3ccf7a; }\n  header button { border:0; background:var(--pink-soft); color:var(--pink); border-radius:999px;\n                  padding:6px 12px; font:inherit; font-size:13px; cursor:pointer; }\n  #log { flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:6px; }\n  .row { display:flex; flex-direction:column; max-width:78%; }\n  .row.me { align-self:flex-end; align-items:flex-end; }\n  .row.them { align-self:flex-start; align-items:flex-start; }\n  .who { font-size:11px; color:var(--muted); margin:6px 6px 2px; }\n  .bubble { padding:9px 13px; border-radius:18px; line-height:1.45; white-space:pre-wrap;\n            word-break:break-word; font-size:15px; }\n  .me .bubble { background:var(--pink); color:#fff; border-bottom-right-radius:6px; }\n  .them .bubble { background:#fff; border:1px solid #f3d6e0; border-bottom-left-radius:6px; }\n  .time { font-size:10px; color:var(--muted); margin:2px 6px 0; }\n  .sys { align-self:center; font-size:12px; color:var(--muted); margin:8px 0; }\n  #typing { font-size:12px; color:var(--muted); padding:0 18px 4px; height:18px; }\n  form { display:flex; gap:8px; padding:10px 12px; background:#fff; border-top:1px solid #f3d6e0;\n         padding-bottom:max(10px, env(safe-area-inset-bottom)); }\n  textarea { flex:1; resize:none; border:1px solid #f0c9d6; border-radius:20px; padding:10px 14px;\n             font:inherit; font-size:15px; max-height:120px; outline:none; }\n  textarea:focus { border-color:var(--pink); }\n  form button { border:0; background:var(--pink); color:#fff; border-radius:50%; width:44px; height:44px;\n                font-size:18px; cursor:pointer; flex-shrink:0; }\n  form button:disabled { opacity:.4; }\n  #nameModal { position:fixed; inset:0; background:rgba(58,42,49,.35); display:flex; align-items:center;\n               justify-content:center; padding:20px; }\n  #nameModal .card { background:#fff; border-radius:20px; padding:24px; width:100%; max-width:340px; text-align:center; }\n  #nameModal h2 { margin:0 0 6px; font-size:20px; }\n  #nameModal p { margin:0 0 16px; color:var(--muted); font-size:14px; }\n  #nameModal input { width:100%; border:1px solid #f0c9d6; border-radius:12px; padding:11px 14px; font:inherit; font-size:16px; outline:none; }\n  #nameModal button { margin-top:12px; width:100%; border:0; background:var(--pink); color:#fff; border-radius:12px;\n                      padding:11px; font:inherit; font-weight:600; font-size:15px; cursor:pointer; }\n  .hidden { display:none !important; }\n  #toast { position:fixed; left:50%; bottom:90px; transform:translateX(-50%); background:var(--text); color:#fff;\n           padding:8px 14px; border-radius:999px; font-size:13px; opacity:0; transition:opacity .2s; pointer-events:none; }\n  #toast.show { opacity:1; }\n</style>\n</head>\n<body>\n<header>\n  <h1>💗 แชทของเรา</h1>\n  <span id=\"status\"><span class=\"dot\" id=\"dot\"></span><span id=\"statusText\">กำลังเชื่อมต่อ…</span></span>\n  <button id=\"shareBtn\" type=\"button\">คัดลอกลิงก์</button>\n  <button id=\"menuBtn\" type=\"button\" title=\"ตั้งค่า\">⋯</button>\n</header>\n\n<div id=\"log\"></div>\n<div id=\"typing\"></div>\n\n<form id=\"form\">\n  <textarea id=\"input\" rows=\"1\" placeholder=\"พิมพ์ข้อความ…\" autocomplete=\"off\"></textarea>\n  <button id=\"send\" type=\"submit\" disabled>➤</button>\n</form>\n\n<div id=\"nameModal\" class=\"hidden\">\n  <div class=\"card\">\n    <h2>ชื่อเล่นของคุณ</h2>\n    <p>ใส่ชื่อที่อยากให้อีกฝ่ายเห็น</p>\n    <input id=\"nameInput\" maxlength=\"30\" placeholder=\"เช่น ต้นข้าว\">\n    <button id=\"nameSave\" type=\"button\">เข้าแชท</button>\n  </div>\n</div>\n<div id=\"toast\"></div>\n\n<script>\n(() => {\n  const $ = (id) => document.getElementById(id);\n  const log = $(\"log\"), input = $(\"input\"), sendBtn = $(\"send\");\n  const store = {\n    get(k) { try { return localStorage.getItem(k); } catch { return null; } },\n    set(k, v) { try { localStorage.setItem(k, v); } catch {} },\n  };\n\n  let uid = store.get(\"lc_uid\");\n  if (!uid) { uid = Math.random().toString(36).slice(2) + Date.now().toString(36); store.set(\"lc_uid\", uid); }\n  let name = store.get(\"lc_name\") || \"\";\n\n  const wsUrl = location.href.replace(/^http/, \"ws\").replace(/[?#].*$/, \"\").replace(/\\/$/, \"\") + \"/ws\";\n  let ws, retry = 0, lastDay = \"\";\n\n  function toast(t) { const el = $(\"toast\"); el.textContent = t; el.classList.add(\"show\"); setTimeout(() => el.classList.remove(\"show\"), 1600); }\n  function nearBottom() { return log.scrollHeight - log.scrollTop - log.clientHeight < 120; }\n  function scrollDown() { log.scrollTop = log.scrollHeight; }\n  function fmtTime(ts) { return new Date(ts).toLocaleTimeString(\"th-TH\", { hour: \"2-digit\", minute: \"2-digit\" }); }\n  function fmtDay(ts) { return new Date(ts).toLocaleDateString(\"th-TH\", { day: \"numeric\", month: \"short\", year: \"numeric\" }); }\n\n  function sys(text) { const d = document.createElement(\"div\"); d.className = \"sys\"; d.textContent = text; log.appendChild(d); }\n\n  function addMsg(m) {\n    const day = fmtDay(m.ts);\n    if (day !== lastDay) { sys(day); lastDay = day; }\n    const mine = m.uid === uid;\n    const row = document.createElement(\"div\");\n    row.className = \"row \" + (mine ? \"me\" : \"them\");\n    const prev = log.lastElementChild;\n    if (!(prev && prev.dataset && prev.dataset.uid === m.uid)) {\n      const who = document.createElement(\"div\"); who.className = \"who\"; who.textContent = mine ? \"คุณ\" : m.name;\n      row.appendChild(who);\n    }\n    const b = document.createElement(\"div\"); b.className = \"bubble\"; b.textContent = m.text;\n    const t = document.createElement(\"div\"); t.className = \"time\"; t.textContent = fmtTime(m.ts);\n    row.appendChild(b); row.appendChild(t);\n    row.dataset.uid = m.uid;\n    log.appendChild(row);\n  }\n\n  function setStatus(on, text) { $(\"dot\").classList.toggle(\"on\", on); $(\"statusText\").textContent = text; }\n\n  function connect() {\n    ws = new WebSocket(wsUrl);\n    ws.onopen = () => { retry = 0; setStatus(true, \"ออนไลน์\"); };\n    ws.onmessage = (e) => {\n      let d; try { d = JSON.parse(e.data); } catch { return; }\n      if (d.type === \"history\") {\n        log.innerHTML = \"\"; lastDay = \"\";\n        if (!d.messages.length) sys(\"ยังไม่มีข้อความ ส่งลิงก์นี้ให้อีกฝ่ายแล้วเริ่มคุยกันได้เลย 💌\");\n        d.messages.forEach(addMsg); scrollDown();\n      } else if (d.type === \"msg\") {\n        const stick = nearBottom() || d.msg.uid === uid;\n        addMsg(d.msg); if (stick) scrollDown();\n        if (d.msg.uid !== uid) { $(\"typing\").textContent = \"\"; if (document.hidden) document.title = \"💬 ข้อความใหม่ | แชทของเรา\"; }\n      } else if (d.type === \"typing\" && d.uid !== uid) {\n        $(\"typing\").textContent = d.name + \" กำลังพิมพ์…\";\n        clearTimeout(window._tt); window._tt = setTimeout(() => $(\"typing\").textContent = \"\", 2500);\n      } else if (d.type === \"online\") {\n        setStatus(true, d.count > 1 ? `ออนไลน์ ${d.count} คน` : \"ออนไลน์ (คุณคนเดียว)\");\n      } else if (d.type === \"cleared\") {\n        log.innerHTML = \"\"; lastDay = \"\"; sys(d.name + \" ล้างแชททั้งหมดแล้ว\");\n      }\n    };\n    ws.onclose = () => {\n      setStatus(false, \"หลุดการเชื่อมต่อ กำลังต่อใหม่…\");\n      setTimeout(connect, Math.min(1000 * 2 ** retry++, 15000));\n    };\n  }\n\n  function send(obj) { if (ws && ws.readyState === 1) { ws.send(JSON.stringify(obj)); return true; } return false; }\n\n  function askName() {\n    $(\"nameInput\").value = name; $(\"nameModal\").classList.remove(\"hidden\");\n    setTimeout(() => $(\"nameInput\").focus(), 50);\n  }\n  function saveName() {\n    const v = $(\"nameInput\").value.trim();\n    if (!v) return;\n    name = v; store.set(\"lc_name\", v); $(\"nameModal\").classList.add(\"hidden\"); input.focus();\n  }\n  $(\"nameSave\").onclick = saveName;\n  $(\"nameInput\").onkeydown = (e) => { if (e.key === \"Enter\") saveName(); };\n\n  input.addEventListener(\"input\", () => {\n    sendBtn.disabled = !input.value.trim();\n    input.style.height = \"auto\"; input.style.height = Math.min(input.scrollHeight, 120) + \"px\";\n    const now = Date.now();\n    if (!window._lt || now - window._lt > 1500) { window._lt = now; send({ type: \"typing\", uid, name }); }\n  });\n  input.addEventListener(\"keydown\", (e) => {\n    if (e.key === \"Enter\" && !e.shiftKey && !e.isComposing && window.matchMedia(\"(pointer:fine)\").matches) {\n      e.preventDefault(); $(\"form\").requestSubmit();\n    }\n  });\n  $(\"form\").onsubmit = (e) => {\n    e.preventDefault();\n    const text = input.value.trim();\n    if (!text) return;\n    if (!name) { askName(); return; }\n    if (send({ type: \"msg\", uid, name, text })) {\n      input.value = \"\"; input.style.height = \"auto\"; sendBtn.disabled = true;\n    } else toast(\"ยังเชื่อมต่อไม่ได้ ลองใหม่อีกที\");\n  };\n\n  $(\"shareBtn\").onclick = async () => {\n    const link = location.href.replace(/[?#].*$/, \"\");\n    try {\n      if (navigator.share && matchMedia(\"(pointer:coarse)\").matches) await navigator.share({ title: \"แชทของเรา\", url: link });\n      else { await navigator.clipboard.writeText(link); toast(\"คัดลอกลิงก์แล้ว\"); }\n    } catch {}\n  };\n  $(\"menuBtn\").onclick = () => {\n    const c = prompt(\"พิมพ์ 1 = เปลี่ยนชื่อ\\nพิมพ์ ล้าง = ลบข้อความทั้งหมด (ทั้งสองฝั่ง)\");\n    if (c === \"1\") askName();\n    else if (c && c.trim() === \"ล้าง\" && confirm(\"ลบข้อความทั้งหมดจริงไหม?\")) send({ type: \"clear\", uid, name });\n  };\n  document.addEventListener(\"visibilitychange\", () => { if (!document.hidden) document.title = \"แชทของเรา 💗\"; });\n\n  if (!name) askName();\n  connect();\n})();\n</script>\n</body>\n</html>\n";

const MAX_HISTORY = 300;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    // หน้าแรก: สร้างห้องใหม่แบบสุ่มแล้วพาเข้าไป
    if (url.pathname === "/") {
      const room = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
      return Response.redirect(`${url.origin}/r/${room}`, 302);
    }

    const m = url.pathname.match(/^\/r\/([A-Za-z0-9_-]{3,64})(\/ws)?$/);
    if (!m) return new Response("Not found", { status: 404 });

    if (m[2]) {
      if (req.headers.get("Upgrade") !== "websocket") {
        return new Response("Expected WebSocket", { status: 426 });
      }
      const stub = env.ROOMS.get(env.ROOMS.idFromName(m[1]));
      return stub.fetch(req);
    }

    return new Response(HTML, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};

export class ChatRoom {
  constructor(state) {
    this.state = state;
  }

  async fetch() {
    const { 0: client, 1: server } = new WebSocketPair();
    this.state.acceptWebSocket(server);

    const list = await this.state.storage.list({ prefix: "m:", reverse: true, limit: MAX_HISTORY });
    const history = [...list.values()].reverse();
    server.send(JSON.stringify({ type: "history", messages: history }));
    this.broadcastOnline();

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, raw) {
    let data;
    try { data = JSON.parse(raw); } catch { return; }

    const name = String(data.name || "").trim().slice(0, 30) || "ไม่ระบุชื่อ";
    const uid = String(data.uid || "").slice(0, 40);

    if (data.type === "msg") {
      const text = String(data.text || "").trim().slice(0, 2000);
      if (!text) return;
      const ts = Date.now();
      const msg = { id: crypto.randomUUID(), uid, name, text, ts };
      await this.state.storage.put(`m:${String(ts).padStart(15, "0")}:${msg.id}`, msg);
      this.broadcast({ type: "msg", msg });
      this.trim();
    } else if (data.type === "typing") {
      this.broadcast({ type: "typing", uid, name }, ws);
    } else if (data.type === "clear") {
      await this.state.storage.deleteAll();
      this.broadcast({ type: "cleared", name });
    }
  }

  async trim() {
    const all = await this.state.storage.list({ prefix: "m:" });
    const extra = all.size - MAX_HISTORY;
    if (extra > 0) await this.state.storage.delete([...all.keys()].slice(0, extra));
  }

  broadcast(obj, except) {
    const s = JSON.stringify(obj);
    for (const ws of this.state.getWebSockets()) {
      if (ws === except) continue;
      try { ws.send(s); } catch {}
    }
  }

  broadcastOnline(closing) {
    const n = this.state.getWebSockets().filter((w) => w !== closing).length;
    const s = JSON.stringify({ type: "online", count: n });
    for (const ws of this.state.getWebSockets()) {
      if (ws === closing) continue;
      try { ws.send(s); } catch {}
    }
  }

  webSocketClose(ws, code) {
    this.broadcastOnline(ws);
    try { ws.close(code, "bye"); } catch {}
  }

  webSocketError(ws) {
    this.broadcastOnline(ws);
  }
}
