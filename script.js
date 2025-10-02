/* ===========================
   Datos base (inicio + carrusel)
=========================== */
const stickersInicio = [
  { id: 1,  nombre: "Sticker 1",  precio: 1000, img: "img/sticker1.jpg" },
  { id: 2,  nombre: "Sticker 2",  precio: 1000, img: "img/sticker2.jpg" },
  { id: 3,  nombre: "Sticker 3",  precio: 1000, img: "img/sticker3.jpg" },
  { id: 4,  nombre: "Sticker 4",  precio: 1000, img: "img/sticker4.jpg" },
  { id: 5,  nombre: "Sticker 5",  precio: 1000, img: "img/sticker5.jpg" },
  { id: 6,  nombre: "Sticker 6",  precio: 1000, img: "img/sticker6.jpg" },
  { id: 7,  nombre: "Sticker 7",  precio: 1000, img: "img/sticker7.jpg" },
  { id: 8,  nombre: "Sticker 8",  precio: 1000, img: "img/sticker8.jpg" },
  { id: 9,  nombre: "Sticker 9",  precio: 1000, img: "img/sticker9.jpg" },
  { id:10,  nombre: "Sticker 10", precio: 1000, img: "img/sticker10.jpg" },
  { id:11,  nombre: "Sticker 11", precio: 1000, img: "img/sticker11.jpg" },
  { id:12,  nombre: "Sticker 12", precio: 1000, img: "img/sticker12.jpg" },
];

const imagenesCarrusel = [
  "img/imagen_promocional1.jpg",
  "img/imagen_promocional2.jpg",
  "img/imagen_promocional3.jpg",
  "img/imagen_promocional4.jpg",
  "img/imagen_promocional5.jpg"
];

/* ===========================
   Utilidades
=========================== */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

/* ===========================
   Carrito (persistente)
=========================== */
const CART_KEY = "carrito";

function cargarCarrito() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function guardarCarrito(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); }
function contarCarrito(c) { return c.reduce((acc, it) => acc + (it.cantidad || 1), 0); }
function totalCarrito(c) { return c.reduce((acc, it) => acc + it.precio * (it.cantidad || 1), 0); }

let carrito = cargarCarrito();

function actualizarBadge() {
  const badge = $("#cart-count");
  if (badge) badge.textContent = contarCarrito(carrito);
}

function agregarAlCarrito(producto, cantidad = 1) {
  const id = String(producto.id);
  const idx = carrito.findIndex(it => String(it.id) === id);
  if (idx >= 0) {
    carrito[idx].cantidad = (carrito[idx].cantidad || 1) + cantidad;
  } else {
    carrito.push({ ...producto, id, cantidad });
  }
  guardarCarrito(carrito);
  actualizarBadge();
  renderCarrito();
}

function quitarDelCarrito(id) {
  id = String(id);
  carrito = carrito.filter(it => String(it.id) !== id);
  guardarCarrito(carrito);
  actualizarBadge();
  renderCarrito();
}

function cambiarCantidad(id, delta) {
  id = String(id);
  const item = carrito.find(it => String(it.id) === id);
  if (!item) return;
  item.cantidad = Math.max(1, (item.cantidad || 1) + delta);
  guardarCarrito(carrito);
  actualizarBadge();
  renderCarrito();
}

function renderCarrito() {
  const list = $("#cart-items");
  const totalEl = $("#total");
  if (!list || !totalEl) return;

  list.innerHTML = "";
  if (carrito.length === 0) {
    list.innerHTML = `<li style="padding:6px 0;color:#777">Tu carrito está vacío.</li>`;
  } else {
    carrito.forEach(it => {
      const li = document.createElement("li");
      li.className = "carrito-item";
      li.innerHTML = `
        <img src="${it.img || 'https://source.unsplash.com/80x80/?sticker'}" alt="${it.nombre}">
        <div>
          <h5>${it.nombre}</h5>
          <span class="precio">$${it.precio}</span>
        </div>
        <div class="qty-controls" aria-label="Controles de cantidad">
          <button class="qty-btn" type="button" data-act="dec" data-id="${it.id}">-</button>
          <span aria-live="polite">${it.cantidad || 1}</span>
          <button class="qty-btn" type="button" data-act="inc" data-id="${it.id}">+</button>
        </div>
        <button class="remove-btn" type="button" data-act="rm" data-id="${it.id}">Eliminar</button>
      `;
      list.appendChild(li);
    });
  }
  totalEl.textContent = `Total: $${totalCarrito(carrito)}`;

  list.onclick = (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const act = btn.getAttribute("data-act");
    const id = String(btn.getAttribute("data-id"));
    if (act === "inc") cambiarCantidad(id, +1);
    if (act === "dec") cambiarCantidad(id, -1);
    if (act === "rm") quitarDelCarrito(id);
  };

  const comprarBtn = $("#comprarBtn");
  if (comprarBtn && !comprarBtn._bound) {
    comprarBtn._bound = true;
    comprarBtn.addEventListener("click", () => {
      if (carrito.length === 0) {
        notificar("⚠️ Tu carrito está vacío.", "err");
        return;
      }
      notificar("✅ ¡Gracias por tu compra!", "ok");
      carrito = [];
      guardarCarrito(carrito);
      actualizarBadge();
      renderCarrito();
    });
  }
}

/* ===========================
   Notificaciones simples
=========================== */
function notificar(mensaje, tipo="ok"){
  let cont = $("#toast-inline");
  if(!cont){
    cont = document.createElement("div");
    cont.id = "toast-inline";
    cont.style.position = "fixed";
    cont.style.top = "16px";
    cont.style.right = "16px";
    cont.style.zIndex = "9999";
    document.body.appendChild(cont);
  }
  const el = document.createElement("div");
  el.textContent = mensaje;
  el.style.background = tipo==="ok" ? "#1c7c37" : "#b00020";
  el.style.color = "#fff";
  el.style.padding = "10px 14px";
  el.style.margin = "0 0 10px 0";
  el.style.borderRadius = "8px";
  el.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  el.style.fontSize = "14px";
  cont.appendChild(el);
  setTimeout(()=> el.remove(), 2000);
}

/* ===========================
   Carrusel
=========================== */
function initCarrusel(){
  const img = $("#carousel-img");
  if(!img) return;

  let indice = 0;
  const prev = $(".carousel-btn.left");
  const next = $(".carousel-btn.right");

  const cambiar = (dir)=>{
    indice = (indice + dir + imagenesCarrusel.length) % imagenesCarrusel.length;
    img.src = imagenesCarrusel[indice];
  };

  [prev, next].forEach(btn=>{
    if(!btn) return;
    btn.addEventListener("click", ()=> cambiar(parseInt(btn.dataset.dir || (btn.classList.contains('left')?-1:1))));
  });

  let timer = setInterval(()=> cambiar(1), 4000);
  const root = img.closest(".carousel");
  if(root){
    root.addEventListener("mouseenter", ()=> clearInterval(timer));
    root.addEventListener("mouseleave", ()=> timer = setInterval(()=> cambiar(1), 4000));
  }

  document.addEventListener("keydown", (e)=>{
    if(e.key === "ArrowLeft") cambiar(-1);
    if(e.key === "ArrowRight") cambiar(1);
  });
}

/* ===========================
   Pirámide de stickers dinámica
=========================== */
function initPiramide(){
  const container = $("#stickerContainer");
  if(!container) return;

  container.innerHTML = "";
  let idx = 0, fila = 1;
  while (idx < stickersInicio.length){
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("sticker-row");

    for (let col = 0; col < fila && idx < stickersInicio.length; col++){
      const s = stickersInicio[idx++];
      const card = document.createElement("div");
      card.classList.add("sticker-card");
      card.innerHTML = `
        <img src="${s.img}" alt="${s.nombre}" loading="lazy">
        <h4>${s.nombre}</h4>
        <p>$${s.precio}</p>
        <button type="button" data-id="${s.id}">Agregar</button>
      `;
      rowDiv.appendChild(card);
    }
    container.appendChild(rowDiv);
    fila++;
  }

  container.addEventListener("click", (e)=>{
    const btn = e.target.closest("button[data-id]");
    if(!btn) return;
    const id = parseInt(btn.getAttribute("data-id"));
    const prod = stickersInicio.find(p=>p.id===id);
    if(prod){
      agregarAlCarrito(prod, 1);
      notificar("🧡 Agregado al carrito", "ok");
    }
  });
}

/* ===========================
   Catálogo
=========================== */
function obtenerProductosCatalogo(){
  return Array.from({ length: 70 }, (_, i) => ({
    id: 1000 + i + 1,
    nombre: `Sticker ${i+1}`,
    precio: 1500 + i*50,
    img: `https://source.unsplash.com/300x200/?sticker,fun,${i}`
  }));
}

function initCatalogo(){
  const cat = $("#catalogo");
  if(!cat) return;

  const productos = obtenerProductosCatalogo();
  cat.innerHTML = "";
  productos.forEach(p=>{
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.nombre}" loading="lazy">
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
      <button type="button" data-id="${p.id}">Agregar</button>
    `;
    cat.appendChild(div);
  });

  cat.addEventListener("click", (e)=>{
    const btn = e.target.closest("button[data-id]");
    if(!btn) return;
    const id = parseInt(btn.getAttribute("data-id"));
    const prod = productos.find(x=>x.id===id);
    if(prod){
      agregarAlCarrito(prod, 1);
      notificar("🧡 Agregado al carrito", "ok");
    }
  });
}

/* ===========================
   Inicio
=========================== */
document.addEventListener("DOMContentLoaded", ()=>{
  actualizarBadge();
  initCarrusel();
  initPiramide();
  renderCarrito();
  initCatalogo();

  // Inicializar formulario de pedidos
  const pedidoForm = $("#pedidoForm");
  if(pedidoForm){
    pedidoForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      const nombre = $("#nombreCliente").value.trim();
      const email = $("#emailCliente").value.trim();
      const detalle = $("#detallePedido").value.trim();
      const msg = $("#pedido-msg");

      if(!nombre || !email || !detalle){
        msg.textContent = "⚠️ Por favor completa todos los campos.";
        msg.className = "err";
        msg.style.display = "block";
        return;
      }

      // Guardar en localStorage (simulación de envío)
      let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
      pedidos.push({nombre,email,detalle,fecha:new Date().toLocaleString()});
      localStorage.setItem("pedidos", JSON.stringify(pedidos));

      // Mensaje bonito
      msg.textContent = `🎉 ¡Gracias ${nombre}! Tu pedido ha sido enviado con éxito.`;
      msg.className = "ok";
      msg.style.display = "block";

      // Limpiar formulario
      pedidoForm.reset();

      // Hacer desaparecer el mensaje después de 3s
      setTimeout(()=> msg.style.display = "none", 3000);
    });
  }

  // Compatibilidad con función global
  window.agregarAlCarrito = agregarAlCarrito;
});
