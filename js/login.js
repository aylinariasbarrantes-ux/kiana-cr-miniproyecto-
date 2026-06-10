// ============================================================
// login.js — Lógica del Login (Kiana CR)
// ============================================================

// ── Usuario de prueba ─────────────────────────────────────────
// En un proyecto real esto vendría de un servidor.
// Para esta demo, el usuario está definido aquí.
var USUARIO_DEMO = {
  correo:     'kiana@kianacr.com',
  contrasena: 'Kiana2024',
  nombre:     'Aylin'
};

// ── Referencias ───────────────────────────────────────────────
var inputCorreo    = document.getElementById('correo');
var inputContrasena = document.getElementById('contrasena');
var btnLogin       = document.getElementById('btn-login');
var btnOjo         = document.getElementById('btn-ojo');
var checkRecordar  = document.getElementById('recordar');
var alertaLogin    = document.getElementById('alerta-login');
var linkOlvidaste  = document.getElementById('link-olvidaste');

// ── Si ya hay sesión activa, redirigir directo ─────────────────
var sesion = localStorage.getItem('kiana_sesion');
if (sesion) {
  window.location.href = 'index.html';
}

// ── Pre-rellenar correo si fue recordado ───────────────────────
var correoRecordado = localStorage.getItem('kiana_correo_recordado');
if (correoRecordado) {
  inputCorreo.value = correoRecordado;
  checkRecordar.checked = true;
}

// ── Toggle mostrar / ocultar contraseña ───────────────────────
btnOjo.addEventListener('click', function () {
  var esPassword = inputContrasena.type === 'password';
  inputContrasena.type = esPassword ? 'text' : 'password';
  btnOjo.textContent   = esPassword ? '🙈' : '👁️';
  btnOjo.setAttribute('aria-label', esPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
});

// ── Validación en tiempo real ─────────────────────────────────
inputCorreo.addEventListener('input', function () {
  validarCampo(
    inputCorreo,
    document.getElementById('error-correo'),
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputCorreo.value.trim())
  );
});

inputContrasena.addEventListener('input', function () {
  validarCampo(
    inputContrasena,
    document.getElementById('error-contrasena'),
    inputContrasena.value.length >= 6
  );
});

// ── Enviar con Enter ──────────────────────────────────────────
inputContrasena.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') intentarLogin();
});
inputCorreo.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') intentarLogin();
});

// ── Botón iniciar sesión ──────────────────────────────────────
btnLogin.addEventListener('click', intentarLogin);

function intentarLogin() {
  ocultarAlerta();

  var correo     = inputCorreo.value.trim();
  var contrasena = inputContrasena.value;

  // Validar campos antes de verificar credenciales
  var correoValido     = validarCampo(inputCorreo, document.getElementById('error-correo'), /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo));
  var contrasenaValida = validarCampo(inputContrasena, document.getElementById('error-contrasena'), contrasena.length >= 6);

  if (!correoValido || !contrasenaValida) {
    mostrarAlerta('❗ Por favor corregí los campos marcados.', 'error');
    return;
  }

  // Verificar credenciales contra el usuario demo
  if (correo === USUARIO_DEMO.correo && contrasena === USUARIO_DEMO.contrasena) {

    // Guardar sesión en localStorage
    var datosSesion = {
      nombre: USUARIO_DEMO.nombre,
      correo: USUARIO_DEMO.correo,
      hora:   new Date().toISOString()
    };
    localStorage.setItem('kiana_sesion', JSON.stringify(datosSesion));

    // Recordar correo si está marcado el checkbox
    if (checkRecordar.checked) {
      localStorage.setItem('kiana_correo_recordado', correo);
    } else {
      localStorage.removeItem('kiana_correo_recordado');
    }

    // Mensaje de éxito y redirigir
    mostrarAlerta('✅ ¡Bienvenida, ' + USUARIO_DEMO.nombre + '! Redirigiendo...', 'exito');
    btnLogin.disabled = true;

    setTimeout(function () {
      window.location.href = 'index.html';
    }, 1400);

  } else {
    // Credenciales incorrectas
    mostrarAlerta('❌ Correo o contraseña incorrectos. Revisá los datos e intentá de nuevo.', 'error');
    inputContrasena.value = '';
    inputContrasena.classList.remove('valido');
    inputContrasena.classList.add('invalido');
    inputContrasena.focus();
  }
}

// ── Link "¿Olvidaste tu contraseña?" ─────────────────────────
linkOlvidaste.addEventListener('click', function (e) {
  e.preventDefault();
  mostrarAlerta('💡 Recordatorio: la contraseña de prueba es <strong>Kiana2024</strong>', 'exito');
  alertaLogin.innerHTML = '💡 Recordatorio: la contraseña de prueba es <strong>Kiana2024</strong>';
});

// ── Funciones auxiliares ──────────────────────────────────────
function validarCampo(input, spanError, esValido) {
  if (esValido) {
    input.classList.remove('invalido');
    input.classList.add('valido');
    spanError.classList.remove('visible');
  } else {
    input.classList.remove('valido');
    input.classList.add('invalido');
    spanError.classList.add('visible');
  }
  return esValido;
}

function mostrarAlerta(mensaje, tipo) {
  alertaLogin.innerHTML   = mensaje;
  alertaLogin.className = 'alerta-login ' + tipo;
}

function ocultarAlerta() {
  alertaLogin.className   = 'alerta-login';
  alertaLogin.innerHTML   = '';
}
