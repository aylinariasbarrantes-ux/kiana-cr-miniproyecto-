// ============================================================
// sesion.js — Gestión de sesión compartida (Kiana CR)
// Se incluye en index.html, animales.html y registro.html
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ── Menú hamburguesa ───────────────────────────────────────
  var hamburger = document.getElementById('hamburger');
  var menu      = document.getElementById('menu');
  if (hamburger && menu) {
    hamburger.addEventListener('click', function () {
      menu.classList.toggle('abierto');
    });
  }

  // ── Leer sesión del localStorage ───────────────────────────
  var sesionRaw = localStorage.getItem('kiana_sesion');
  var sesion    = sesionRaw ? JSON.parse(sesionRaw) : null;
  var headerInner = document.querySelector('.header-inner');
  if (!headerInner) return;

  // Eliminar el botón hamburguesa del DOM temporalmente para reordenar
  var hambBtn = document.getElementById('hamburger');

  if (sesion) {
    // ── Usuario CON sesión: mostrar nombre y botón cerrar sesión
    var divSesion = document.createElement('div');
    divSesion.classList.add('sesion-info');
    divSesion.innerHTML =
      '<span class="sesion-nombre">👋 ' + sesion.nombre + '</span>' +
      '<button class="btn-cerrar-sesion" id="btn-cerrar-sesion">Salir 🚪</button>';
    headerInner.appendChild(divSesion);
    if (hambBtn) headerInner.appendChild(hambBtn);

    document.getElementById('btn-cerrar-sesion').addEventListener('click', function () {
      var confirmar = confirm('¿Querés cerrar sesión?');
      if (confirmar) {
        localStorage.removeItem('kiana_sesion');
        window.location.href = 'login.html';
      }
    });

  } else {
    // ── Usuario SIN sesión: mostrar botón de login
    var btnLogin = document.createElement('a');
    btnLogin.href = 'login.html';
    btnLogin.className = 'btn-login-nav';
    btnLogin.textContent = '🔑 Iniciar sesión';
    headerInner.appendChild(btnLogin);
    if (hambBtn) headerInner.appendChild(hambBtn);
  }
});
