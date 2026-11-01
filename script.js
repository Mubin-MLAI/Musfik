/* ===== EDIT YOUR DETAILS HERE (no need to touch the HTML) ===== */
const CONFIG = {
  groom: "Syed Abul Kalam “Mushfiq”", city: "Barabanki",
  dateISO: "2026-11-24T18:00:00+05:30",        // date/time with timezone offset (time is a placeholder: set the real one)
  dateLong: "Tuesday, 24 November 2026",
  elders: "Mr. and Mrs. Haji Shaukat Ali Sahab",
  parents: "Mr. and Mrs. Haji Syed Sarwar Ali",
  venue: "Lakhpedabagh Lawn", address: "Barabanki, Uttar Pradesh",
  mapLink: "",                                  // optional: your own Google Maps link (else built from venue + address)
  fromName: "Haji Syed Sarwar Ali", fromAddr: "Ali Villa, Mayur Vihar Colony, Nawabganj, Barabanki",
  phones: ["+91 9889092032", "+91 8887009496"],
  whatsapp: "919889092032",                     // country code + number, no "+"
  music: ["assets/jashn-e-bahaaraa-instrumental.mp3", "assets/music.mp3"],  // tried in order
  events: [  // add or remove cards freely
    { time: "Baad Namaz-e-Maghrib", date: "24 November 2026", name: "Walima Ceremony", img: "assets/dinner.webp" }
  ]
};

const $ = (s, r = document) => r.querySelector(s);
const when = new Date(CONFIG.dateISO), enc = encodeURIComponent;

/* Fill text */
document.querySelectorAll("[data-b]").forEach(el => el.textContent = CONFIG[el.dataset.b]);
$("#d-day").textContent = when.getDate();
$("#d-mon").textContent = when.toLocaleString("en-GB", { month: "long" });
$("#d-yr").textContent = when.getFullYear();

/* Links */
const fmt = d => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
const end = new Date(+when + 3 * 36e5);
$("#cal").href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${enc("Walima Ceremony: " + CONFIG.groom)}&dates=${fmt(when)}/${fmt(end)}&location=${enc(CONFIG.venue + ", " + CONFIG.address)}`;
$("#dir").href = CONFIG.mapLink || `https://www.google.com/maps/dir/?api=1&destination=${enc(CONFIG.venue + " " + CONFIG.address)}`;
$("#map").src = `https://www.google.com/maps?q=${enc(CONFIG.venue + " " + CONFIG.address)}&output=embed`;
$("#rsvp").href = `https://wa.me/${CONFIG.whatsapp}?text=${enc("Assalamu alaikum! I'd love to attend the Walima on " + CONFIG.dateLong + ".")}`;

$("#phones").innerHTML = CONFIG.phones.map(p => `<a href="tel:${p.replace(/\s/g, "")}">${p}</a>`).join(" · ");

/* Events timeline from one template */
CONFIG.events.forEach((e, i) => {
  const n = $("#ev").content.cloneNode(true);
  n.querySelector(".num").textContent = i + 1;
  const img = n.querySelector("img");
  img.onerror = () => { const d = document.createElement("div"); d.className = "ph"; d.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#fl" width="100" height="100"/></svg>'; img.replaceWith(d); };  // flower placeholder if the photo is missing
  img.alt = e.name; img.src = e.img;
  n.querySelector(".etime").textContent = e.time; n.querySelector(".edate").textContent = e.date;
  n.querySelector("h3").textContent = e.name; $("#events").append(n);
});

/* Countdown */
const units = { d: 864e5, h: 36e5, m: 6e4, s: 1e3 };
function tick() {
  let diff = when - Date.now();
  if (diff <= 0) { $("#count").hidden = true; $("#done").hidden = false; return clearInterval(timer); }
  for (const k in units) {
    const el = $(`[data-u=${k}]`), v = String(Math.floor(diff / units[k]) % (k === "d" ? 1e9 : k === "h" ? 24 : 60));
    if (el.textContent !== v) { el.textContent = v; el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); }
  }
}
const timer = setInterval(tick, 1000); tick();

/* Scroll reveal */
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: .15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* Music: starts on envelope tap, state remembered, pauses when tab hidden */
const bgm = $("#bgm"), btn = $("#music"); let track = 0; bgm.src = CONFIG.music[0]; bgm.volume = .5;
/* If a file is missing, try the next one; warn in the console if none load */
bgm.addEventListener("error", () => {
  if (++track < CONFIG.music.length) { bgm.src = CONFIG.music[track]; bgm.play().then(() => btn.classList.add("on")).catch(() => {}); }
  else console.warn("Music file not found. Put an .mp3 in assets/ named exactly as in CONFIG.music.");
});
const store = { get: () => { try { return localStorage.getItem("muted"); } catch { return null; } }, set: v => { try { localStorage.setItem("muted", v); } catch {} } };
function setMusic(on, save = true) {
  btn.classList.toggle("on", on); btn.setAttribute("aria-pressed", on);
  on ? bgm.play().catch(() => btn.classList.remove("on")) : bgm.pause(); if (save) store.set(on ? "0" : "1");
}
btn.onclick = () => setMusic(bgm.paused);
document.addEventListener("visibilitychange", () => { if (document.hidden) bgm.pause(); else if (btn.classList.contains("on")) bgm.play().catch(() => {}); });

/* Envelope */
$("#open").onclick = () => {
  $(".envelope").classList.add("open");
  if (store.get() !== "1") setMusic(true, false);
  setTimeout(() => { $("#intro").classList.add("gone"); document.body.classList.remove("locked"); }, 2200);
  setTimeout(() => $("#intro").remove(), 3300);
};

/* Light petals */
if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("i"); p.className = "petal";
    p.style.cssText = `left:${Math.random() * 100}vw;--x:${Math.random() * 80 - 40}px;animation-duration:${9 + Math.random() * 9}s;animation-delay:${-Math.random() * 15}s`;
    document.body.append(p);
  }
