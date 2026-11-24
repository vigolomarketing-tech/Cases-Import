// Panel administrativo (DEMO): funciona en el navegador, sin servidor.
// En la versión final se conecta a una base de datos real y se entra con usuario y contraseña propios.
(() => {
  const C = CONFIG, root = document.getElementById("panel");
  const $ = (s, el = root) => el.querySelector(s);
  const money = (n) => "$ " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const MODELOS = ["iPhone 16 Pro Max", "iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max", "iPhone 18 Pro", "iPhone 18 Pro Max"];
  const ETIQUETAS = ["", "Nueva", "Más pedida", "Oferta"];
  let logueada = sessionStorage.getItem("casesimport-panel") === "1";
  let busca = "", guia = true, armado = null;

  const guardar = () => {
    try { localStorage.setItem(PANEL_KEY, JSON.stringify(C.productos)); }
    catch (e) { toast("La foto es muy pesada, probá con otra"); return false; }
    window.CasesShop && CasesShop.refresh();
    return true;
  };
  function toast(t) {
    document.querySelectorAll(".pl-toast").forEach((x) => x.remove());
    const d = document.createElement("div"); d.className = "pl-toast"; d.textContent = t; d.setAttribute("role", "status");
    root.appendChild(d); setTimeout(() => d.remove(), 2400);
  }

  // ---------- abrir / cerrar ----------
  function abrir() { root.hidden = false; document.body.style.overflow = "hidden"; pintar(); root.scrollTop = 0; }
  function cerrar(irCatalogo) {
    root.hidden = true; document.body.style.overflow = "";
    if (location.hash === "#panel") history.replaceState(null, "", location.pathname + location.search);
    if (irCatalogo && window.CasesShop) CasesShop.abrirCatalogo();
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href="#panel"]'); if (!a) return;
    e.preventDefault(); history.replaceState(null, "", "#panel");
    document.querySelector(".top")?.classList.remove("open"); abrir();
  });

  // ---------- pantallas ----------
  function pintar() { root.innerHTML = logueada ? principal() : login(); }

  function login() {
    return `<section class="pl-login"><form class="pl-box" id="plLogin">
      <img src="img/logo.webp" width="84" height="84" alt="Logo de Cases Import">
      <span class="pl-demo">VERSIÓN DE DEMOSTRACIÓN</span>
      <h2>Panel administrativo</h2>
      <p class="sub">Entrá y probalo: cargá, editá y borrá productos. Nada se rompe, hay un botón para volver a empezar.</p>
      <label>Correo<input type="email" value="tu-correo@ejemplo.com" autocomplete="off"></label>
      <label>Contraseña<input type="password" value="demo1234" autocomplete="off"></label>
      <button class="btn btn-gold btn-block" type="submit">Ingresar</button>
      <button class="btn-link" type="button" data-a="volver">Volver a la tienda</button>
    </form></section>`;
  }

  function principal() {
    const todos = C.productos, q = busca.trim().toLowerCase();
    const lista = todos.filter((p) => !q || (p.nombre + " " + p.categoria).toLowerCase().includes(q));
    return `<header class="pl-top"><div class="pl-wrap">
        <img src="img/logo.webp" width="40" height="40" alt=""><h2>Panel administrativo<small>Cases Import</small></h2>
        <button class="pl-btn solid" data-a="tienda">Ver tienda</button><button class="pl-btn" data-a="salir">Salir</button>
      </div></header>
      <div class="pl-wrap">
        ${guia ? `<div class="pl-guide"><button class="x" data-a="guia" aria-label="Cerrar ayuda">✕</button>
          <h3>Así se usa, en 3 pasos</h3>
          <ol><li>Tocá <b>＋ Nuevo producto</b> y subí la foto, el precio y la descripción.</li>
          <li>Para cambiar algo, tocá <b>Editar</b>. Si se acabó el stock, tocá <b>Marcar agotado</b>.</li>
          <li>Tocá <b>Ver tienda</b>: tus cambios ya están publicados.</li></ol></div>` : ""}
        <div class="pl-stats">
          <div class="pl-stat"><b>${todos.length}</b><span>Productos</span></div>
          <div class="pl-stat"><b>${todos.filter((p) => p.categoria === "Fundas").length}</b><span>Fundas</span></div>
          <div class="pl-stat"><b>${todos.filter((p) => p.agotado).length}</b><span>Agotados</span></div>
        </div>
        <div class="pl-tools"><input id="plBusca" type="search" placeholder="Buscar producto…" value="${esc(busca)}" aria-label="Buscar producto">
          <button class="pl-btn solid" data-a="nuevo">＋ Nuevo producto</button></div>
        ${lista.length ? `<ul class="pl-list">${lista.map(fila).join("")}</ul>` : `<p class="pl-vacio">No hay productos con ese nombre.</p>`}
        <button class="pl-reset" data-a="reset">Restablecer demo (volver a los productos de ejemplo)</button>
      </div>`;
  }

  const fila = (p) => `<li class="pl-row${p.agotado ? " off" : ""}"><img src="${p.foto}" alt="" width="64" height="78">
    <div><b>${esc(p.nombre)}</b><small>${esc(p.categoria)}${p.modelos ? " · " + esc(p.modelos.join(", ")) : ""}</small>
    <span class="pr">${money(p.precio)}</span>${p.agotado ? " · Agotado" : ""}</div>
    <div class="pl-acts"><button class="pl-btn" data-a="editar" data-id="${p.id}">Editar</button>
    <button class="pl-btn" data-a="stock" data-id="${p.id}">${p.agotado ? "Marcar disponible" : "Marcar agotado"}</button>
    <button class="pl-btn danger${armado === p.id ? " armed" : ""}" data-a="borrar" data-id="${p.id}">${armado === p.id ? "¿Seguro? Tocá de nuevo" : "Eliminar"}</button></div></li>`;

  // ---------- formulario ----------
  let foto = null; // { src, w, h } si subió una nueva
  function formulario(p) {
    foto = null;
    const nuevo = !p; p = p || { categoria: C.categorias[0], modelos: [], etiqueta: "" };
    const d = document.createElement("div"); d.className = "pl-scrim"; d.id = "plScrim";
    d.innerHTML = `<form class="pl-sheet" id="plForm" data-id="${p.id || ""}"><h3>${nuevo ? "Nuevo producto" : "Editar producto"}</h3>
      <div class="pl-photo">${p.foto ? `<img id="plPrev" src="${p.foto}" alt="">` : `<div class="ph0" id="plPrev">📷</div>`}
        <div><label class="pl-btn" style="display:inline-flex;align-items:center;margin:0;cursor:pointer">Subir foto<input id="plFoto" type="file" accept="image/*"></label>
        <p style="font-size:.82rem;color:var(--suave);margin-top:.4rem">Sacala con buena luz y fondo liso.</p></div></div>
      <label>Nombre<input type="text" name="nombre" required maxlength="60" value="${esc(p.nombre)}" placeholder="Ej: Funda corazón rosa"></label>
      <label>Categoría<select name="categoria">${C.categorias.map((c) => `<option ${c === p.categoria ? "selected" : ""}>${c}</option>`).join("")}</select></label>
      <label>Precio ($)<input type="number" name="precio" required min="0" step="100" inputmode="numeric" value="${p.precio ?? ""}" placeholder="14500"></label>
      <label>Descripción<textarea name="descripcion" rows="3" maxlength="160">${esc(p.descripcion)}</textarea></label>
      <label style="margin-bottom:.2rem">Modelos compatibles</label>
      <div class="pl-chips">${MODELOS.map((m) => `<label><input type="checkbox" name="mod" value="${m}" ${p.modelos && p.modelos.includes(m) ? "checked" : ""}><span>${m}</span></label>`).join("")}</div>
      <p style="font-size:.82rem;color:var(--suave);margin:-.6rem 0 1rem">Si no marcás ninguno, el producto sirve para todos (cargadores, protectores, etc.).</p>
      <label>Etiqueta (opcional)<select name="etiqueta">${ETIQUETAS.map((t) => `<option value="${t}" ${t === (p.etiqueta || "") ? "selected" : ""}>${t || "Ninguna"}</option>`).join("")}</select></label>
      <p class="pl-err" id="plErr" role="alert"></p>
      <div class="pl-form-acts"><button class="btn btn-ghost" type="button" data-a="cancelar">Cancelar</button><button class="btn btn-gold" type="submit">Guardar</button></div></form>`;
    root.appendChild(d);
    $("#plFoto", d).onchange = (e) => leerFoto(e.target.files[0]);
  }

  function leerFoto(file) {
    if (!file) return;
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, 700 / img.width), w = Math.round(img.width * k), h = Math.round(img.height * k);
      const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
      cv.getContext("2d").drawImage(img, 0, 0, w, h);
      let src = cv.toDataURL("image/webp", 0.8); if (!src.startsWith("data:image/webp")) src = cv.toDataURL("image/jpeg", 0.8);
      foto = { src, w, h }; URL.revokeObjectURL(url);
      const prev = $("#plPrev"); const im = document.createElement("img"); im.id = "plPrev"; im.src = src; im.alt = "";
      prev.replaceWith(im);
    };
    img.onerror = () => ($("#plErr").textContent = "No pudimos leer esa foto, probá con otra.");
    img.src = url;
  }

  function enviar(form) {
    const f = new FormData(form), id = form.dataset.id;
    const prev = id ? C.productos.find((x) => x.id === id) : null;
    if (!prev && !foto) { $("#plErr").textContent = "Subí una foto del producto."; return; }
    const mods = f.getAll("mod");
    const p = {
      id: id || "p" + Date.now().toString(36),
      categoria: f.get("categoria"), nombre: f.get("nombre").trim(), descripcion: f.get("descripcion").trim(),
      precio: Math.max(0, Math.round(Number(f.get("precio")) || 0)),
      modelos: mods.length ? mods : null,
      foto: foto ? foto.src : prev.foto, w: foto ? foto.w : prev.w, h: foto ? foto.h : prev.h,
    };
    if (f.get("etiqueta")) p.etiqueta = f.get("etiqueta");
    if (prev && prev.agotado) p.agotado = true;
    if (prev && prev.opciones) p.opciones = prev.opciones;
    const copia = C.productos.slice();
    if (prev) copia[copia.indexOf(prev)] = p; else copia.unshift(p);
    const antes = C.productos; C.productos = copia;
    if (!guardar()) { C.productos = antes; return; }
    $("#plScrim").remove(); pintar(); toast(prev ? "¡Cambios guardados!" : "¡Producto publicado!");
  }

  // ---------- eventos ----------
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.target.id === "plLogin") { logueada = true; sessionStorage.setItem("casesimport-panel", "1"); pintar(); }
    else if (e.target.id === "plForm") enviar(e.target);
  });
  root.addEventListener("input", (e) => {
    if (e.target.id === "plBusca") { busca = e.target.value; const pos = e.target.selectionStart; pintar(); const i = $("#plBusca"); i.focus(); i.setSelectionRange(pos, pos); }
  });
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-a]"); if (!b) return;
    const a = b.dataset.a, id = b.dataset.id, p = C.productos.find((x) => x.id === id);
    if (a === "volver") cerrar();
    else if (a === "tienda") cerrar(true);
    else if (a === "salir") { logueada = false; sessionStorage.removeItem("casesimport-panel"); cerrar(); }
    else if (a === "guia") { guia = false; pintar(); }
    else if (a === "nuevo") formulario();
    else if (a === "editar") formulario(p);
    else if (a === "cancelar") $("#plScrim").remove();
    else if (a === "stock") { p.agotado = !p.agotado; if (!p.agotado) delete p.agotado; guardar(); pintar(); toast(p.agotado ? "Marcado como agotado" : "Marcado como disponible"); }
    else if (a === "borrar") {
      if (armado !== id) { armado = id; pintar(); setTimeout(() => { if (armado === id) { armado = null; if (!root.hidden) pintar(); } }, 3500); return; }
      armado = null; C.productos = C.productos.filter((x) => x.id !== id); guardar(); pintar(); toast("Producto eliminado");
    }
    else if (a === "reset") {
      if (armado !== "reset") { armado = "reset"; b.textContent = "¿Seguro? Tocá de nuevo para restablecer"; setTimeout(() => { armado = null; b.textContent = "Restablecer demo (volver a los productos de ejemplo)"; }, 3500); return; }
      armado = null; C.productos = JSON.parse(JSON.stringify(PRODUCTOS_DEMO)); try { localStorage.removeItem(PANEL_KEY); } catch (er) {}
      window.CasesShop && CasesShop.refresh(); pintar(); toast("Demo restablecida");
    }
  });
  if (location.hash === "#panel") abrir();
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !root.hidden) { const s = $("#plScrim"); s ? s.remove() : cerrar(); } });
})();
