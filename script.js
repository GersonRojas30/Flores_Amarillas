// Posiciones de las flores: x, y, tamaño, rotación (de atrás hacia adelante)
const FLORES = [
  [82, 225, 0.72, -24], [318, 225, 0.72, 24],
  [128, 150, 0.86, -14], [272, 150, 0.86, 14],
  [200, 110, 1.0, 0], [145, 255, 0.6, -10],
  [255, 255, 0.6, 10], [200, 200, 0.95, 8],
];
const HOJAS = [
  [150, 335, -50], [250, 335, 50], [118, 325, -75], [282, 325, 75],
  [175, 315, -25], [225, 315, 25], [105, 335, -88], [295, 335, 88],
];
const RAMAS = [[42, 150], [358, 150], [95, 62], [305, 62], [38, 270], [362, 270], [160, 28], [240, 28]];
const BRILLOS = [
  [70, 90, 1, 0], [335, 100, 1.2, 1.1], [160, 20, .8, 2.2], [250, 45, .9, .6], [30, 210, .8, 1.8],
  [372, 215, 1, 2.7], [110, 300, .7, 3.3], [300, 300, .8, .3], [200, 55, .7, 3.9], [240, 195, .6, 1.5],
];

const $ = (id) => document.getElementById(id);
const az = (n) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };

// Tallos, hojas y flores
$("tallos").innerHTML = FLORES.map(([x, y]) =>
  `<path class="tallo" d="M${x} ${y} Q${(x + 200) / 2 + (x - 200) * 0.1} ${(y + 420) / 2} 200 420"/>`
).join("");

// Ramitas de relleno con florecillas crema y rosadas
$("relleno").innerHTML = RAMAS.map(([x, y], i) => {
  const puntos = Array.from({ length: 7 }, (_, k) => {
    const a = az(i * 10 + k) * 6.28, r = 4 + az(i * 7 + k + 3) * 12;
    const rosa = az(i + k * 5) > 0.72;
    return `<circle cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r).toFixed(1)}" r="${(2.2 + az(k + i * 3) * 2).toFixed(1)}" fill="${rosa ? "#ffc2d1" : "#fff6e4"}"/>`;
  }).join("");
  return `<path d="M200 420 Q${(x + 200) / 2} ${(y + 420) / 2 + 10} ${x} ${y}" stroke="#5aa068" stroke-width="1.6" fill="none" opacity=".85"/>${puntos}`;
}).join("");

$("hojas").innerHTML = HOJAS.map(([x, y, r], i) =>
  `<use href="#hoja" transform="translate(${x} ${y}) rotate(${r})" fill="url(#${i % 2 ? "g2" : "g1"})"/>`
).join("");

// Pétalos puntiagudos con nervadura, en tres capas
const capa = (n, extra, escala, fill) =>
  Array.from({ length: n }, (_, i) =>
    `<g transform="rotate(${((i * 360) / n + extra).toFixed(1)}) scale(${escala})">` +
    `<use href="#pet" fill="url(#${fill})" stroke="#e59a00" stroke-opacity=".45" stroke-width=".6"/><use href="#vena"/></g>`
  ).join("");

// Semillas del centro en espiral
const semillas = Array.from({ length: 30 }, (_, k) => {
  const r = 1.75 * Math.sqrt(k + 1), a = k * 2.39996;
  return `<circle cx="${(r * Math.cos(a)).toFixed(1)}" cy="${(r * Math.sin(a)).toFixed(1)}" r=".95"/>`;
}).join("");

$("flores").innerHTML = FLORES.map(([x, y, s, r], i) => `
  <g class="flor" tabindex="0" role="button" aria-label="Soltar pétalos"
     transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
    <g class="abrir" style="--d:${0.4 + i * 0.45}">
      ${capa(16, 0, 1, "p1")}
      ${capa(16, 11.25, 0.8, "p2")}
      ${capa(12, 0, 0.52, "p3")}
      <circle r="13" fill="url(#c)"/>
      <g fill="#f2b23a" opacity=".55">${semillas}</g>
      <ellipse cx="-3.5" cy="-4.5" rx="4" ry="2" fill="#fff" opacity=".3" transform="rotate(-30 -3.5 -4.5)"/>
    </g>
  </g>`).join("");

// Brillos que titilan sobre el ramo
$("brillos").innerHTML = BRILLOS.map(([x, y, s, t]) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><g class="brillo" style="--t:${(2 + t).toFixed(1)}"><use href="#estrella"/></g></g>`
).join("");

// Pétalos que caen al tocar una flor
function soltarPetalos(el) {
  const b = el.getBoundingClientRect();
  for (let i = 0; i < 7; i++) {
    const p = document.createElement("div");
    p.className = "petalo suelto";
    p.style.left = b.left + b.width / 2 + "px";
    p.style.top = b.top + b.height / 2 + "px";
    p.style.setProperty("--dx", (Math.random() * 180 - 90) + "px");
    p.style.setProperty("--dy", (120 + Math.random() * 200) + "px");
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2700);
  }
}
document.querySelectorAll(".flor").forEach((f) => {
  f.addEventListener("click", () => soltarPetalos(f));
  f.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); soltarPetalos(f); }
  });
});

// Pétalos de fondo, lentos
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("div");
    p.className = "petalo ambiente";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = 11 + Math.random() * 9 + "s";
    p.style.animationDelay = -Math.random() * 15 + "s";
    p.style.setProperty("--dx", Math.random() * 160 - 80 + "px");
    document.body.appendChild(p);
  }
}


// ================= CONFIGURACIÓN =================
const NOMBRE_CORRECTO = "denis";        // no importa mayúsculas, minúsculas ni tildes
const VIDEO_ID = "vbjkLoUziAs";         // canción de YouTube
const NUM_FOTOS = 6;                    // cantidad de marcos para fotos
// GIF de Tenor que se cargan desde internet (0 = marco 1, 3 = marco 4...).
// Si guardas un archivo fotos/fotoN.gif, ese tiene prioridad sobre el enlace.
const EXTERNAS = {
  3: "https://media1.tenor.com/m/nisaHYy8yAYAAAAC/besito-catlove.gif",
  4: "https://media1.tenor.com/m/PK_c_CuDXecAAAAC/cool-cat-cat.gif",
  5: "https://media1.tenor.com/m/R5228WgyVWMAAAAC/kiss-love.gif",
};

// =================================================

const normalizar = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

// ---- Música (YouTube) ----
let player = null, listo = false, quiereSonido = false;
let volumen = 35, fade = null, sonando = false, pausaManual = false;
$("volumen").value = volumen;

function marcar(activo) {
  sonando = activo;
  const b = $("btn-play");
  b.textContent = activo ? "❚❚" : "▶";
  b.setAttribute("aria-label", activo ? "Pausar música" : "Reproducir música");
}

// El volumen sube poco a poco para que no asuste
function activarSonido() {
  quiereSonido = true;
  if (!listo) return;
  clearInterval(fade);
  player.unMute();
  player.setVolume(0);
  player.playVideo();
  let v = 0;
  fade = setInterval(() => {
    v = Math.min(volumen, v + 2);
    player.setVolume(v);
    if (v >= volumen) clearInterval(fade);
  }, 100);
  marcar(true);
}

window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player("youtube", {
    videoId: VIDEO_ID,
    width: "100%", height: "100%",
    playerVars: { autoplay: 1, controls: 0, loop: 1, playlist: VIDEO_ID, playsinline: 1, rel: 0 },
    events: {
      onReady: (e) => {
        listo = true;
        e.target.mute();
        e.target.playVideo();
        if (quiereSonido) activarSonido();
      },
      onStateChange: (e) => {
        const t = e.target.getVideoData && e.target.getVideoData().title;
        if (t) $("titulo-cancion").textContent = t;
      },
    },
  });
};
const api = document.createElement("script");
api.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(api);

// Los navegadores solo dejan sonar tras el primer toque o tecla
function primero(e) {
  if (e.target.closest && e.target.closest("#btn-play")) return;
  quitarPrimero();
  activarSonido();
}
function quitarPrimero() {
  ["pointerdown", "keydown"].forEach((ev) => document.removeEventListener(ev, primero));
}
["pointerdown", "keydown"].forEach((ev) => document.addEventListener(ev, primero));

$("btn-play").addEventListener("click", () => {
  quitarPrimero();
  if (sonando) {
    clearInterval(fade);
    if (listo) player.pauseVideo();
    pausaManual = true;
    marcar(false);
  } else {
    pausaManual = false;
    activarSonido();
  }
});

$("volumen").addEventListener("input", (e) => {
  volumen = +e.target.value;
  clearInterval(fade);
  if (listo) player.setVolume(volumen);
});

// ---- Fotos: marcos repartidos por la página ----
// Pon tus fotos en la carpeta fotos/ con los nombres foto1.jpg, foto2.jpg ... foto8.jpg
const EXTENSIONES = ["jpg", "jpeg", "png", "webp", "gif", "JPG", "JPEG", "PNG", "GIF"];
// En tu computador (Live Server) puedes llenar los marcos vacíos; en GitHub los vacíos se ocultan
const EDITAR = ["localhost", "127.0.0.1", ""].includes(location.hostname);
const ROT = [-4, 3, -2, 5, -5, 2, 4, -3];

// ---- Guardar las fotos dentro del proyecto (solo en tu computador) ----
const TIPOS = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
const PUEDE_ESCRIBIR = EDITAR && "showDirectoryPicker" in window;
let carpeta = null; // carpeta del proyecto, conectada por ti

const bd = () => new Promise((ok, mal) => {
  const r = indexedDB.open("ramo-proyecto", 1);
  r.onupgradeneeded = () => r.result.createObjectStore("k");
  r.onsuccess = () => ok(r.result);
  r.onerror = () => mal(r.error);
});
const leerBD = async (k) => {
  const d = await bd();
  return new Promise((ok) => { const q = d.transaction("k").objectStore("k").get(k); q.onsuccess = () => ok(q.result); q.onerror = () => ok(null); });
};
const guardarBD = async (k, v) => {
  const d = await bd();
  return new Promise((ok) => { const t = d.transaction("k", "readwrite"); t.objectStore("k").put(v, k); t.oncomplete = ok; t.onerror = ok; });
};

let reloj;
function aviso(texto) {
  let a = $("aviso");
  if (!a) {
    a = document.createElement("p");
    a.id = "aviso"; a.className = "aviso"; a.setAttribute("role", "status");
    document.body.appendChild(a);
  }
  a.textContent = texto;
  a.classList.add("ver");
  clearTimeout(reloj);
  reloj = setTimeout(() => a.classList.remove("ver"), 5000);
}

function marcarConexion() {
  $("conectar").textContent = carpeta ? "Carpeta conectada ✓" : "Conectar carpeta del proyecto";
}

async function conectar() {
  try {
    let h = await leerBD("carpeta");
    const ok = h && ((await h.queryPermission({ mode: "readwrite" })) === "granted" ||
                     (await h.requestPermission({ mode: "readwrite" })) === "granted");
    if (!ok) {
      h = await showDirectoryPicker({ mode: "readwrite" });
      try { await h.getFileHandle("index.html"); }
      catch { aviso("Elige la carpeta ramo-flores-amarillas (la que tiene index.html)."); return; }
      await guardarBD("carpeta", h);
    }
    carpeta = h;
    marcarConexion();
    aviso("Carpeta conectada. Las fotos nuevas se guardarán dentro del proyecto.");
  } catch (e) { /* cancelaste */ }
}

if (PUEDE_ESCRIBIR) {
  const b = document.createElement("button");
  b.id = "conectar"; b.type = "button"; b.className = "conectar";
  b.addEventListener("click", conectar);
  document.body.appendChild(b);
  marcarConexion();
  leerBD("carpeta").then(async (h) => {
    if (h && (await h.queryPermission({ mode: "readwrite" })) === "granted") { carpeta = h; marcarConexion(); }
  }).catch(() => {});
}

// Devuelve true si la foto se puede mostrar
async function guardar(i, file) {
  const ext = TIPOS[file.type];
  if (!ext) { aviso("Formato no compatible. Usa JPG, PNG, WEBP o GIF."); return false; }
  const nombre = `foto${i + 1}.${ext}`;
  if (carpeta) {
    try {
      const dir = await carpeta.getDirectoryHandle("fotos", { create: true });
      for (const e of EXTENSIONES) { try { await dir.removeEntry(`foto${i + 1}.${e}`); } catch {} }
      const w = await (await dir.getFileHandle(nombre, { create: true })).createWritable();
      await w.write(file);
      await w.close();
      aviso(`Guardada en el proyecto: fotos/${nombre}`);
    } catch {
      carpeta = null; marcarConexion();
      aviso("No pude escribir en la carpeta. Toca “Conectar carpeta del proyecto” otra vez.");
    }
    return true;
  }
  if (PUEDE_ESCRIBIR) { aviso("Toca “Conectar carpeta del proyecto” para que se guarde dentro del proyecto."); return true; }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file); a.download = nombre; a.click();
  aviso(`Se descargó como ${nombre}. Muévela a la carpeta fotos/ del proyecto.`);
  return true;
}

function poner(marco, src) {
  const img = marco.querySelector("img");
  img.src = src;
  img.hidden = false;
  marco.classList.remove("vacio");
  marco.hidden = false;
}

function crearMarco(i) {
  const m = document.createElement("label");
  m.className = "foto vacio" + (EDITAR ? " editable" : "");
  m.style.setProperty("--r", ROT[i % ROT.length] + "deg");
  m.style.setProperty("--i", i);
  m.innerHTML = '<input class="sr" type="file" accept="image/*" aria-label="Agregar foto">' +
    '<img alt="Foto" hidden><span class="mas">＋<small>Agregar foto</small></span>';
  const input = m.querySelector("input");
  input.disabled = !EDITAR;
  input.addEventListener("change", async () => {
    const f = input.files[0];
    if (f && (await guardar(i, f))) poner(m, URL.createObjectURL(f));
  });
  m.hidden = !EDITAR; // sin foto y fuera de tu PC, el marco no se ve
  if (EXTERNAS[i]) poner(m, EXTERNAS[i]);
  m.querySelector("img").addEventListener("error", () => { // si una imagen no carga, vuelve a marco vacío
    m.querySelector("img").hidden = true;
    m.classList.add("vacio");
    m.hidden = !EDITAR;
  });

  // Busca fotos/fotoN.jpg (o png, webp...)
  let k = 0;
  const prueba = new Image();
  prueba.onload = () => poner(m, prueba.src);
  prueba.onerror = () => {
    if (++k < EXTENSIONES.length) prueba.src = `fotos/foto${i + 1}.${EXTENSIONES[k]}`;
  };
  prueba.src = `fotos/foto${i + 1}.${EXTENSIONES[0]}`;
  return m;
}

for (let i = 0; i < NUM_FOTOS; i++) {
  const lugar = i < 3 ? ".izq" : i < 6 ? ".der" : ".base";
  document.querySelector("#galeria " + lugar).appendChild(crearMarco(i));
}

// ---- Entrada ----
function entrar(rapido) {
  $("entrada").classList.add("salir");
  setTimeout(() => {
    $("entrada").hidden = true;
    $("pantalla-flores").hidden = false;
    requestAnimationFrame(() => {
      $("pantalla-flores").classList.add("visible");
      setTimeout(() => $("ramo").classList.add("abierto"), 300);
    });
  }, rapido ? 0 : 700);
}

$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (normalizar($("nombre").value) !== NOMBRE_CORRECTO) {
    $("error").textContent = "Ese no es el nombre que busco. Inténtalo de nuevo.";
    $("nombre").select();
    return;
  }
  if (!sonando && !pausaManual) activarSonido();
  try { sessionStorage.setItem("entrado", "1"); } catch (e) {}
  entrar(false);
});

// Solo en tu computador: al recargar no te vuelve a pedir el nombre
let yaEntro = false;
try { yaEntro = EDITAR && sessionStorage.getItem("entrado") === "1"; } catch (e) {}
if (yaEntro) entrar(true); else $("nombre").focus();
