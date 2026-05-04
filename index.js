/* ============================================================
   index.js — Montaje de la página y manejo de eventos
   Responsabilidad: interactuar con el DOM y conectar la UI
   con la lógica del modelo definida en main.js.
   ============================================================ */


// ── Referencias a elementos del DOM ─────────────────────────
// Se obtienen una sola vez al cargar la página

const elementoEstado      = document.getElementById("estado-entrenamiento");
const elementoMensaje     = document.getElementById("mensaje-estado");
const elementoProgreso    = document.getElementById("progreso-contenedor");
const elementoBarra       = document.getElementById("progreso-barra");
const elementoBadge       = document.getElementById("badge-entrenado");
const elementoResultado   = document.getElementById("resultado-valor");
const elementoFormula     = document.getElementById("resultado-formula");
const botonEntrenar       = document.getElementById("btn-entrenar");
const botonPredecir       = document.getElementById("btn-predecir");
const inputValor          = document.getElementById("input-valor");


// ── Funciones de actualización de UI ────────────────────────

// Cambia el mensaje y el estilo visual del cuadro de estado
function actualizarEstado(mensaje, tipo) {
    elementoEstado.className = "estado-msg" + (tipo ? " " + tipo : "");
    elementoMensaje.textContent = mensaje;
}

// Muestra u oculta la barra de progreso y actualiza su ancho
function actualizarProgreso(porcentaje) {
    elementoProgreso.style.display = porcentaje > 0 ? "block" : "none";
    elementoBarra.style.width = porcentaje + "%";
}

// Activa el badge verde y habilita el botón de predicción
function marcarComoEntrenado() {
    elementoBadge.textContent = "Entrenado";
    elementoBadge.classList.add("entrenado");
    botonPredecir.disabled = false;
}

// Muestra el resultado en pantalla luego de una predicción
function mostrarResultado(valorX, valorY) {
    elementoResultado.classList.remove("sin-resultado");
    elementoResultado.textContent = valorY;
    elementoFormula.textContent = "Para x = " + valorX + " → y ≈ " + valorY;
}

// Muestra un mensaje de error en el cuadro de resultado
function mostrarErrorPrediccion() {
    elementoResultado.classList.add("sin-resultado");
    elementoResultado.textContent = "Valor inválido";
    elementoFormula.textContent = "Ingresá un número para predecir";
}


// ── Manejadores de eventos ───────────────────────────────────

// Se ejecuta cuando el usuario hace clic en "Empezar Entrenamiento"
async function alClickEntrenar() {
    botonEntrenar.disabled = true;
    botonPredecir.disabled = true;

    actualizarEstado("Entrenando… por favor esperá.", "ejecutando");
    actualizarProgreso(1);

    // Conectamos entrenarModelo() con las funciones de UI
    await entrenarModelo(
        // Callback por época: actualiza barra y mensaje cada 50 épocas
        function(numeroEpoca, perdida) {
            const porcentaje = Math.round(((numeroEpoca + 1) / TOTAL_EPOCAS) * 100);
            actualizarProgreso(porcentaje);

            if ((numeroEpoca + 1) % 50 === 0) {
                actualizarEstado(
                    "Entrenando… épocas: " + (numeroEpoca + 1) + " / " + TOTAL_EPOCAS,
                    "ejecutando"
                );
            }
        },
        // Callback al terminar: actualiza la UI al estado final
        function() {
            actualizarProgreso(100);
            actualizarEstado("Entrenamiento completado con éxito.", "exito");
            marcarComoEntrenado();
            botonEntrenar.disabled = false;
            botonEntrenar.textContent = "Re-Entrenar Modelo";
        }
    );
}

// Se ejecuta cuando el usuario hace clic en "Predecir"
function alClickPredecir() {
    const valorIngresado = parseFloat(inputValor.value);

    if (isNaN(valorIngresado)) {
        mostrarErrorPrediccion();
        return;
    }

    const resultado = predecir(valorIngresado);

    if (resultado !== null) {
        mostrarResultado(valorIngresado, resultado);
    }
}


// ── Inicialización ───────────────────────────────────────────

// Asigna los manejadores de eventos a los botones e input
function inicializar() {
    botonEntrenar.addEventListener("click", alClickEntrenar);
    botonPredecir.addEventListener("click", alClickPredecir);

    // Permite predecir presionando Enter dentro del input
    inputValor.addEventListener("keydown", function(evento) {
        if (evento.key === "Enter") {
            alClickPredecir();
        }
    });
}

// Espera a que el HTML esté completamente cargado antes de inicializar
document.addEventListener("DOMContentLoaded", inicializar);
