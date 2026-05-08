'use strict';

let PRODUCTOS = [];

async function cargarProductos() {
    try {
        const res = await fetch('api/productos.php');
        PRODUCTOS = await res.json();
        mostrarProductos(filtroActual);
    } catch (e) {
        console.error('No se pudieron cargar los productos:', e);
        document.getElementById('lista-productos').innerHTML =
            '<p style="color:red;padding:20px">Error al conectar con el servidor. ¿Está Docker corriendo?</p>';
    }
}

// --- Estado ---
let usuarioActual = null;
let carrito       = [];
let filtroActual  = 'todos';
let timerNotif    = null;

// --- DOM ---
const btnLogin         = document.getElementById('btn-login');
const btnLogout        = document.getElementById('btn-logout');
const btnCarrito       = document.getElementById('btn-carrito');
const btnHero          = document.getElementById('btn-hero');
const numCarrito       = document.getElementById('num-carrito');

const modalLogin       = document.getElementById('modal-login');

// Pestañas
const tabs             = document.querySelectorAll('.modal-tabs .tab');
const panelLogin       = document.getElementById('panel-login');
const panelRegistro    = document.getElementById('panel-registro');

// Login
const formLogin        = document.getElementById('form-login');
const inputUsuario     = document.getElementById('input-usuario');
const inputContrasena  = document.getElementById('input-contrasena');
const errorLogin       = document.getElementById('error-login');
const btnCancelar      = document.getElementById('btn-cancelar');

// Registro
const formRegistro     = document.getElementById('form-registro');
const regUsuario       = document.getElementById('reg-usuario');
const regContrasena    = document.getElementById('reg-contrasena');
const regContrasena2   = document.getElementById('reg-contrasena2');
const errorRegistro    = document.getElementById('error-registro');
const okRegistro       = document.getElementById('ok-registro');
const btnCancelarReg   = document.getElementById('btn-cancelar-reg');

// Carrito
const panelCarrito     = document.getElementById('panel-carrito');
const itemsCarrito     = document.getElementById('items-carrito');
const carritoVacio     = document.getElementById('carrito-vacio');
const totalCarrito     = document.getElementById('total-carrito');
const btnComprar       = document.getElementById('btn-comprar');
const btnCerrarCarrito = document.getElementById('btn-cerrar-carrito');

// Catálogo
const listaProductos   = document.getElementById('lista-productos');
const navFiltros       = document.querySelector('.filtros');

const notificacion     = document.getElementById('notificacion');
const seccionHistorial = document.getElementById('historial');
const listaHistorial   = document.getElementById('lista-historial');
const historialVacio   = document.getElementById('historial-vacio');
const navHistorial     = document.getElementById('nav-historial');


// --- UI Toasts ---
function mostrarNotificacion(mensaje) {
    clearTimeout(timerNotif);
    notificacion.textContent = mensaje;
    notificacion.hidden = false;
    notificacion.classList.remove('mostrar-toast');
    void notificacion.offsetWidth;
    notificacion.classList.add('mostrar-toast');
    timerNotif = setTimeout(() => {
        notificacion.classList.remove('mostrar-toast');
        notificacion.hidden = true;
    }, 3000);
}


// --- Modal: pestañas ---
function cambiarTab(tabName) {
    tabs.forEach(t => t.classList.toggle('activo', t.dataset.tab === tabName));
    panelLogin.hidden    = tabName !== 'login';
    panelRegistro.hidden = tabName !== 'registro';
    // Limpiar mensajes al cambiar
    errorLogin.hidden = true;
    errorRegistro.hidden = true;
    okRegistro.hidden = true;
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => cambiarTab(tab.dataset.tab));
});


// --- Auth: Login ---
function abrirLogin() {
    cambiarTab('login');
    inputContrasena.value = '';
    errorLogin.hidden = true;
    modalLogin.showModal();
}

function cerrarLogin() {
    modalLogin.close();
}

async function hacerLogin(event) {
    event.preventDefault();

    const nombre = inputUsuario.value.trim();
    const pass   = inputContrasena.value;

    let data;
    try {
        const res = await fetch("api/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: nombre, password: pass })
        });
        data = await res.json();
    } catch (e) {
        errorLogin.textContent = 'Error de conexión con el servidor';
        errorLogin.hidden = false;
        return;
    }

    if (data.ok) {
        if (nombre === 'jose') {
            cerrarLogin();
            document.body.innerHTML = `
                <div class="pantalla-jose">
                    <h1>¡Hola Jose!</h1>
                    <img src="holaJose.png" class="img-jose" alt="Hola Jose">
                    <button id="btn-salir-jose">Cerrar sesión y volver</button>
                </div>`;
            document.getElementById('btn-salir-jose')
                .addEventListener('click', () => location.reload());
            return;
        }

        usuarioActual = nombre;
        localStorage.setItem('usuarioActual', nombre);
        cerrarLogin();
        actualizarHeader();
        mostrarProductos(filtroActual);
        mostrarNotificacion(`¡Bienvenido, ${nombre}!`);
    } else {
        errorLogin.textContent = data.msg || 'Usuario o contraseña incorrectos';
        errorLogin.hidden = false;
        inputContrasena.value = '';
    }
}


// --- Auth: Registro ---
async function hacerRegistro(event) {
    event.preventDefault();

    errorRegistro.hidden = true;
    okRegistro.hidden    = true;

    const nombre = regUsuario.value.trim();
    const pass   = regContrasena.value;
    const pass2  = regContrasena2.value;

    // Validación cliente
    if (nombre.length < 3) {
        errorRegistro.textContent = 'El usuario debe tener al menos 3 caracteres';
        errorRegistro.hidden = false;
        return;
    }
    if (pass.length < 4) {
        errorRegistro.textContent = 'La contraseña debe tener al menos 4 caracteres';
        errorRegistro.hidden = false;
        return;
    }
    if (pass !== pass2) {
        errorRegistro.textContent = 'Las contraseñas no coinciden';
        errorRegistro.hidden = false;
        return;
    }

    let data;
    try {
        const res = await fetch("api/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: nombre, password: pass })
        });
        data = await res.json();
    } catch (e) {
        errorRegistro.textContent = 'Error de conexión con el servidor';
        errorRegistro.hidden = false;
        return;
    }

    if (data.ok) {
        okRegistro.hidden = false;
        formRegistro.reset();
        // Tras 1.5s volver al login con el nombre pre-rellenado
        setTimeout(() => {
            inputUsuario.value = nombre;
            cambiarTab('login');
        }, 1500);
    } else {
        errorRegistro.textContent = data.msg || 'Error al registrar';
        errorRegistro.hidden = false;
    }
}


function cerrarSesion() {
    usuarioActual = null;
    carrito = [];
    localStorage.removeItem("usuarioActual");
    panelCarrito.hidden = true;
    actualizarHeader();
    actualizarContadorCarrito();
    mostrarProductos(filtroActual);
    mostrarNotificacion('Sesión cerrada correctamente.');
}

function actualizarHeader() {
    const logueado = !!usuarioActual;
    btnLogin.hidden          =  logueado;
    btnLogout.hidden         = !logueado;
    btnCarrito.hidden        = !logueado;
    seccionHistorial.hidden  = !logueado;
    navHistorial.hidden      = !logueado;
    if (logueado) cargarHistorial();
}


// --- Catálogo ---
function mostrarProductos(filtro) {
    filtroActual = filtro;
    const filtrados = filtro === 'todos'
        ? PRODUCTOS
        : PRODUCTOS.filter(p => p.tipo === filtro);

    listaProductos.innerHTML = filtrados.map(p => crearTarjeta(p)).join('');

    listaProductos.querySelectorAll('button[data-id]').forEach(btn => {
        btn.addEventListener('click', () => anadirAlCarrito(Number(btn.dataset.id)));
    });
}

function crearTarjeta(producto) {
    const textoBoton = usuarioActual ? 'Añadir al carrito' : 'Inicia sesión para comprar';
    return `
    <article class="tarjeta">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="img-producto">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="precio">${producto.precio} €</p>
        <button data-id="${producto.id}">${textoBoton}</button>
    </article>`;
}


// --- Filtros ---
function manejarFiltro(event) {
    const boton = event.target.closest('.filtro');
    if (!boton) return;
    navFiltros.querySelectorAll('.filtro').forEach(b => b.classList.remove('activo'));
    boton.classList.add('activo');
    mostrarProductos(boton.dataset.cat);
}


// --- Carrito ---
function anadirAlCarrito(id) {
    if (!usuarioActual) { abrirLogin(); return; }
    const producto = PRODUCTOS.find(p => String(p.id) === String(id));
    const yaEsta   = carrito.find(item => String(item.id) === String(id));
    if (yaEsta) { yaEsta.cantidad++; }
    else        { carrito.push({ ...producto, precio: parseFloat(producto.precio), cantidad: 1 }); }
    actualizarContadorCarrito();
    renderizarCarrito();
    mostrarNotificacion(`${producto.nombre} añadido al carrito`);
}

function actualizarContadorCarrito() {
    numCarrito.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
}

function abrirCarrito()  { panelCarrito.hidden = false; renderizarCarrito(); }
function cerrarCarrito() { panelCarrito.hidden = true; }

function renderizarCarrito() {
    if (carrito.length === 0) {
        itemsCarrito.innerHTML = '';
        carritoVacio.hidden = false;
        totalCarrito.textContent = '0';
        return;
    }
    carritoVacio.hidden = true;
    itemsCarrito.innerHTML = carrito.map(item => `
    <article class="item-carrito">
        <span>${item.nombre} ×${item.cantidad}</span>
        <span>${(parseFloat(item.precio) * item.cantidad).toFixed(2)} €</span>
        <button data-id="${item.id}" aria-label="Quitar ${item.nombre}">✕</button>
    </article>`).join('');

    itemsCarrito.querySelectorAll('button[data-id]').forEach(btn => {
        btn.addEventListener('click', () => quitarDelCarrito(Number(btn.dataset.id)));
    });

    totalCarrito.textContent = carrito.reduce(
        (acc, item) => acc + parseFloat(item.precio) * item.cantidad, 0
    ).toFixed(2);
}

function quitarDelCarrito(id) {
    carrito = carrito.filter(item => String(item.id) !== String(id));
    actualizarContadorCarrito();
    renderizarCarrito();
}

async function comprar() {
    if (carrito.length === 0) { mostrarNotificacion('El carrito está vacío.'); return; }
    await fetch("api/comprar.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: usuarioActual, carrito })
    });
    mostrarNotificacion(`¡Compra realizada! Gracias, ${usuarioActual}`);
    carrito = [];
    actualizarContadorCarrito();
    cerrarCarrito();
    cargarHistorial();
}


// --- Historial ---
async function cargarHistorial() {
    listaHistorial.innerHTML = '<p class="muted">Cargando...</p>';

    try {
        const res  = await fetch("api/historial.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: usuarioActual })
        });
        const data = await res.json();

        if (!data.ok || data.compras.length === 0) {
            listaHistorial.innerHTML = '<p id="historial-vacio" class="muted">No tienes compras todavía.</p>';
            return;
        }

        const filas = data.compras.map(c => {
            const fecha = new Date(c.fecha).toLocaleString('es-ES');
            const total = (parseFloat(c.precio) * c.cantidad).toFixed(2);
            return `
            <tr>
                <td>${fecha}</td>
                <td><span class="badge-tipo">${c.tipo}</span> ${c.nombre}</td>
                <td>${c.cantidad}</td>
                <td>${parseFloat(c.precio).toFixed(2)} €</td>
                <td><strong>${total} €</strong></td>
            </tr>`;
        }).join('');

        listaHistorial.innerHTML = `
        <table class="historial-tabla">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio unit.</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>${filas}</tbody>
        </table>`;
    } catch (e) {
        listaHistorial.innerHTML = '<p class="muted" style="color:red">Error al cargar el historial.</p>';
    }
}

// --- Bindings ---
btnLogin.addEventListener('click', abrirLogin);
btnHero.addEventListener('click', abrirLogin);
btnLogout.addEventListener('click', cerrarSesion);
btnCarrito.addEventListener('click', abrirCarrito);
btnCancelar.addEventListener('click', cerrarLogin);
btnCancelarReg.addEventListener('click', cerrarLogin);
btnComprar.addEventListener('click', comprar);
btnCerrarCarrito.addEventListener('click', cerrarCarrito);
formLogin.addEventListener('submit', hacerLogin);
formRegistro.addEventListener('submit', hacerRegistro);
navFiltros.addEventListener('click', manejarFiltro);

window.addEventListener("load", () => {
    const usuarioGuardado = localStorage.getItem("usuarioActual");
    if (usuarioGuardado) {
        usuarioActual = usuarioGuardado;
        actualizarHeader();
        mostrarNotificacion(`Sesión restaurada: ${usuarioActual}`);
    }
    cargarProductos();
});