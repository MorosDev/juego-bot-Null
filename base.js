// NULL · Arcade — utilidades compartidas por todos los juegos
const W = 360, H = 640
const MORADO = '#8b5cf6', CIAN = '#22d3ee', ROJO = '#f43f5e', ROJO2 = '#e11d48', ORO = '#fbbf24', VERDE = '#34d399', GRIS = '#b8b0cc', GRIS2 = '#8a80a6'
const c = document.getElementById('c')
const x = c.getContext('2d')

function ajustar() {
  const s = Math.min(innerWidth / W, innerHeight / H) * 0.98
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  c.style.width = Math.floor(W * s) + 'px'
  c.style.height = Math.floor(H * s) + 'px'
  c.width = Math.floor(W * s * dpr)
  c.height = Math.floor(H * s * dpr)
  x.setTransform(c.width / W, 0, 0, c.height / H, 0, 0)
}
addEventListener('resize', ajustar)
ajustar()

// Piloto que manda el bot (?n=Nombre)
let piloto = ''
try { piloto = (new URLSearchParams(location.search).get('n') || '').replace(/[\u0000-\u001f]/g, '').slice(0, 18) } catch (e) {}

// Coordenadas del toque dentro del lienzo
function enLienzo(e) {
  const r = c.getBoundingClientRect()
  return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }
}

function texto(s, px, py, tam, col, peso = '700', alin = 'center') {
  x.font = peso + ' ' + tam + 'px ui-monospace, Menlo, Consolas, monospace'
  x.fillStyle = col; x.textAlign = alin; x.fillText(s, px, py)
}

// Sonido
let actx
function initAudio() {
  try {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)()
    if (actx.state === 'suspended') actx.resume()
  } catch (e) {}
}
function tono(f1, f2, tipo, dur, vol = 0.08) {
  if (!actx) return
  try {
    const o = actx.createOscillator(), g = actx.createGain()
    o.type = tipo
    o.frequency.setValueAtTime(f1, actx.currentTime)
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, actx.currentTime + dur)
    g.gain.setValueAtTime(vol, actx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur)
    o.connect(g); g.connect(actx.destination)
    o.start(); o.stop(actx.currentTime + dur)
  } catch (e) {}
}

// Récord por juego
function leerRecord(k) { try { return parseInt(localStorage.getItem('null_rec_' + k) || '0', 10) || 0 } catch (e) { return 0 } }
function guardarRecord(k, v) { try { localStorage.setItem('null_rec_' + k, String(Math.floor(v))) } catch (e) {} }

// Botón "← JUEGOS" (abajo, en menú y fin)
const VOLVER = { x: W / 2 - 60, y: H - 62, w: 120, h: 34 }
function dibujarVolver() {
  x.strokeStyle = '#3a2d55'; x.lineWidth = 1.5
  x.beginPath(); x.roundRect ? x.roundRect(VOLVER.x, VOLVER.y, VOLVER.w, VOLVER.h, 8) : x.rect(VOLVER.x, VOLVER.y, VOLVER.w, VOLVER.h); x.stroke()
  texto('← JUEGOS', W / 2, VOLVER.y + 22, 13, GRIS, '700')
}
function tocaVolver(p) { return p.x > VOLVER.x && p.x < VOLVER.x + VOLVER.w && p.y > VOLVER.y && p.y < VOLVER.y + VOLVER.h }
function volver() { location.href = 'index.html' + location.search }

// Fondo de estrellas
const estrellas = []
for (let i = 0; i < 60; i++) estrellas.push({ x: Math.random() * W, y: Math.random() * H, r: 0.6 + Math.random() * 1.6, vy: 0.6 + Math.random() * 2 })
function moverEstrellas(dt, f = 1) { estrellas.forEach(s => { s.y += s.vy * dt * f; if (s.y > H) { s.y = 0; s.x = Math.random() * W } }) }
function dibujarEstrellas() { estrellas.forEach(s => { x.fillStyle = 'rgba(200,190,255,' + (s.r * 0.22) + ')'; x.fillRect(s.x, s.y, s.r, s.r) }) }

// Pantallas comunes
function pantallaMenu(titulo, lineas, rec, t) {
  x.fillStyle = 'rgba(11,7,18,.6)'; x.fillRect(0, 0, W, H)
  texto('N U L L', W / 2, 190, 34, '#ffffff', '900')
  texto('— ' + titulo + ' —', W / 2, 222, 14, MORADO, '700')
  if (piloto) texto('Piloto: ' + piloto, W / 2, 268, 14, CIAN, '700')
  lineas.forEach((l, i) => texto(l, W / 2, 340 + i * 22, 13, GRIS, '400'))
  if (rec) texto('Tu récord: ' + Math.floor(rec), W / 2, 490, 13, GRIS2, '700')
  if (Math.floor(t / 30) % 2 === 0) texto('TOCA PARA EMPEZAR', W / 2, 535, 16, '#ffffff', '900')
  dibujarVolver()
}
function pantallaFin(titulo, puntos, extra, nuevo, rec, listo, t) {
  x.fillStyle = 'rgba(11,7,18,.82)'; x.fillRect(0, 0, W, H)
  texto(titulo, W / 2, 230, 30, ROJO, '900')
  texto(String(Math.floor(puntos)), W / 2, 295, 44, '#ffffff', '900')
  if (extra) texto(extra, W / 2, 322, 13, GRIS, '400')
  if (nuevo) texto('¡NUEVO RÉCORD!', W / 2, 365, 16, ORO, '900')
  else texto('Récord: ' + Math.floor(rec), W / 2, 365, 13, GRIS2, '700')
  if (listo && Math.floor(t / 30) % 2 === 0) texto('TOCA PARA REINTENTAR', W / 2, 450, 15, '#ffffff', '900')
  dibujarVolver()
}
function pantallaPausa() {
  x.fillStyle = 'rgba(11,7,18,.75)'; x.fillRect(0, 0, W, H)
  texto('PAUSA', W / 2, H / 2 - 10, 28, '#ffffff', '900')
  texto('Toca para seguir', W / 2, H / 2 + 22, 13, GRIS, '400')
}

// Deslizar (para serpiente y 2048)
function alDeslizar(fn) {
  let ini = null
  c.addEventListener('pointerdown', e => { ini = { x: e.clientX, y: e.clientY } })
  c.addEventListener('pointerup', e => {
    if (!ini) return
    const dx = e.clientX - ini.x, dy = e.clientY - ini.y
    ini = null
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return
    if (Math.abs(dx) > Math.abs(dy)) fn(dx > 0 ? 'der' : 'izq')
    else fn(dy > 0 ? 'abajo' : 'arriba')
  })
  addEventListener('keydown', e => {
    const m = { ArrowLeft: 'izq', ArrowRight: 'der', ArrowUp: 'arriba', ArrowDown: 'abajo', KeyA: 'izq', KeyD: 'der', KeyW: 'arriba', KeyS: 'abajo' }
    if (m[e.code]) { e.preventDefault(); fn(m[e.code]) }
  })
}
