(() => {
  const C = CONFIG, $ = (s) => document.querySelector(s);
  const money = (n) => "$ " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const wa = (txt) => `https://wa.me/${C.contacto.whatsapp}?text=${encodeURIComponent(txt)}`;
  const KEY = "casesimport-pedido";

  // --- Links de contacto ---
  document.querySelectorAll("[data-wa]").forEach((a) => { a.href = wa(C.contacto.mensajeWhatsapp); a.target = "_blank"; a.rel = "noopener"; });
  document.querySelectorAll("[data-wa-msg]").forEach((a) => { a.href = wa(a.dataset.waMsg); a.target = "_blank"; a.rel = "noopener"; });
  $("#linkIg").href = $("#igFoot").href = C.contacto.instagram;
  $("#linkIg").textContent = C.contacto.instagramUsuario;
  $("#anio").textContent = new Date().getFullYear();

  // --- Menú mobile ---
  const top = $(".top"), burger = $("#burger");
  burger.onclick = () => { const o = top.classList.toggle("open"); burger.setAttribute("aria-expanded", o); };
  $("#nav").onclick = (e) => { if (e.target.tagName === "A") { top.classList.remove("open"); burger.setAttribute("aria-expanded", false); } };

  // --- Filtros ---
  let cat = "Todo", modelo = "Todos";
  const modelos = [...new Set(C.productos.flatMap((p) => p.modelos || []))].sort();
  $("#selModelo").innerHTML = ["Todos", ...modelos].map((m) => `<option>${m}</option>`).join("");
  $("#selModelo").onchange = (e) => { modelo = e.target.value; pintar(); };
  const pintarChips = () => {
    $("#chipsCat").innerHTML = ["Todo", ...C.categorias].map((c) => `<button class="chip" aria-pressed="${c === cat}" data-c="${c}">${c}</button>`).join("");
  };
  $("#chipsCat").onclick = (e) => { const b = e.target.closest("[data-c]"); if (!b) return; cat = b.dataset.c; pintarChips(); pintar(); };

  const visibles = () => C.productos.filter((p) =>
    (cat === "Todo" || p.categoria === cat) && (modelo === "Todos" || !p.modelos || p.modelos.includes(modelo)));

  function pintar() {
    const lista = visibles();
    $("#vacio").hidden = lista.length > 0;
    $("#vacio a").href = wa(`¡Hola! Busco funda para ${modelo}. ¿Tienen o van a tener? 💌`);
    $("#grilla").innerHTML = lista.map((p, i) => {
      const sel = p.modelos && p.modelos.length > 1
        ? `<select aria-label="Modelo de ${p.nombre}" data-sel="${p.id}">${p.modelos.map((m) => `<option ${m === modelo ? "selected" : ""}>${m}</option>`).join("")}</select>`
        : p.modelos ? `<p class="compat">Para ${p.modelos[0]}</p>` : p.opciones
        ? `<select aria-label="Opción de ${p.nombre}" data-sel="${p.id}">${p.opciones.map((o) => `<option>${o}</option>`).join("")}</select>` : "";
      return `<article class="card">
        ${p.etiqueta ? `<span class="tag">${p.etiqueta}</span>` : ""}
        <div class="card-img"><img src="${p.foto}" width="${p.w}" height="${p.h}" alt="${p.nombre}" ${i > 1 ? 'loading="lazy"' : ""}></div>
        <div class="card-body"><h3>${p.nombre}</h3><p class="desc">${p.descripcion}</p><p class="precio">${money(p.precio)}</p>${sel}
        <button class="btn btn-gold" data-add="${p.id}">Agregar al pedido</button></div></article>`;
    }).join("");
  }
  $("#grilla").onclick = (e) => {
    const b = e.target.closest("[data-add]"); if (!b) return;
    const p = C.productos.find((x) => x.id === b.dataset.add);
    const s = b.parentElement.querySelector("select");
    const variante = s ? s.value : p.modelos ? p.modelos[0] : "";
    agregar(p.id, variante);
    b.textContent = "¡Agregado! ✓"; setTimeout(() => (b.textContent = "Agregar al pedido"), 1200);
  };

  // --- Carrito ---
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
  cart = cart.filter((i) => C.productos.some((p) => p.id === i.id));
  const guardar = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };
  const prod = (id) => C.productos.find((p) => p.id === id);
  function agregar(id, variante) {
    const it = cart.find((i) => i.id === id && i.v === variante);
    it ? it.q++ : cart.push({ id, v: variante, q: 1 });
    pintarCarrito();
  }
  const abrir = (o) => {
    $("#drawer").classList.toggle("open", o); $("#drawer").setAttribute("aria-hidden", !o); $("#scrim").hidden = !o;
    document.body.style.overflow = o ? "hidden" : "";
  };
  ["#abrirCarrito", "#abrirCarrito2"].forEach((s) => ($(s).onclick = () => abrir(true)));
  $("#cerrarCarrito").onclick = $("#scrim").onclick = () => abrir(false);
  document.addEventListener("keydown", (e) => e.key === "Escape" && abrir(false));

  const total = () => cart.reduce((t, i) => t + prod(i.id).precio * i.q, 0);
  const cant = () => cart.reduce((t, i) => t + i.q, 0);
  function pintarCarrito() {
    guardar();
    const n = cant();
    $("#cantCarrito").hidden = !n; $("#cantCarrito").textContent = n;
    $("#barraCarrito").hidden = !n;
    $("#barraTxt").textContent = `Ver mi pedido (${n})`; $("#barraTotal").textContent = money(total());
    $("#carritoVacio").hidden = n > 0; $("#form").hidden = !n; $("#total").textContent = money(total());
    $("#items").innerHTML = cart.map((i, k) => { const p = prod(i.id); return `<li class="item">
      <img src="${p.foto}" alt="" width="64" height="76"><div><b>${p.nombre}</b>${i.v ? `<small>${i.v}</small>` : ""}
      <div class="qty"><button data-m="${k}" aria-label="Quitar uno">−</button><span>${i.q}</span><button data-p="${k}" aria-label="Sumar uno">+</button></div></div>
      <span class="p">${money(p.precio * i.q)}</span></li>`; }).join("");
  }
  $("#items").onclick = (e) => {
    const m = e.target.dataset.m, p = e.target.dataset.p;
    if (m !== undefined) { cart[m].q--; if (cart[m].q <= 0) cart.splice(m, 1); }
    else if (p !== undefined) cart[p].q++;
    else return;
    pintarCarrito();
  };
  $("#vaciar").onclick = () => { cart = []; pintarCarrito(); };

  $("#selEntrega").innerHTML = C.pedidos.entregas.map((x) => `<option>${x}</option>`).join("");
  $("#selPago").innerHTML = C.pedidos.formasDePago.map((x) => `<option>${x}</option>`).join("");
  $("#form").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const lineas = cart.map((i) => { const p = prod(i.id); return `• ${i.q}x ${p.nombre}${i.v ? " (" + i.v + ")" : ""} — ${money(p.precio * i.q)}`; });
    const msg = ["¡Hola! Quiero hacer este pedido:", ...lineas, `Total productos: ${money(total())}`,
      `Entrega: ${f.get("entrega")}`, `Ciudad: ${f.get("ciudad")}`, `Pago: ${f.get("pago")}`, `Nombre: ${f.get("nombre")}`,
      ...(f.get("notas") ? [`Aclaraciones: ${f.get("notas")}`] : [])].join("\n");
    window.open(wa(msg), "_blank", "noopener");
  };

  // --- Hero 3D: sigue el dedo/mouse y, si no, se mece solo ---
  const rig = $("#rig"), hero = $(".hero");
  if (rig && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0, activo = false;
    hero.addEventListener("pointermove", (e) => {
      const r = $("#stage").getBoundingClientRect();
      ty = ((e.clientX - r.left) / r.width - 0.5) * 36;
      tx = -((e.clientY - r.top) / r.height - 0.5) * 22;
      activo = true;
    });
    hero.addEventListener("pointerleave", () => (activo = false));
    (function loop(t) {
      if (!activo) { ty = Math.sin(t / 1800) * 12; tx = Math.cos(t / 2300) * 5; }
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      rig.style.setProperty("--rx", cx.toFixed(2) + "deg");
      rig.style.setProperty("--ry", cy.toFixed(2) + "deg");
      requestAnimationFrame(loop);
    })(0);
  }

  pintarChips(); pintar(); pintarCarrito();
})();
