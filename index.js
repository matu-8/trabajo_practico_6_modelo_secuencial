/* ============================================================
   index.js — Montaje de la página y manejo de eventos
   Responsabilidad: interactuar con el DOM y conectar la UI
   con la lógica del modelo definida en main.js.
   ============================================================ */

// ── Referencias a elementos del DOM ─────────────────────────
// Se obtienen una sola vez al cargar la página

const elementoEstado = document.getElementById("estado-entrenamiento");
const elementoMensaje = document.getElementById("mensaje-estado");
const elementoProgreso = document.getElementById("progreso-contenedor");
const elementoBarra = document.getElementById("progreso-barra");
const elementoBadge = document.getElementById("badge-entrenado");
const elementoResultado = document.getElementById("resultado-valor");
const elementoFormula = document.getElementById("resultado-formula");
const botonEntrenar = document.getElementById("btn-entrenar");
const botonPredecir = document.getElementById("btn-predecir");
const inputValor = document.getElementById("input-valor");
const canvasGrafico = document.getElementById("grafico-perdida");

// Variable para almacenar la instancia del gráfico de Chart.js
let graficoPerdidasInstancia = null;

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

// Crea o actualiza el gráfico de pérdida utilizando Chart.js
function crearGraficoPerdidasConChartJs(datosPerdidasPorEpoca) {
  // Crear array de números de época (1, 2, 3, ...)
  const numeroEpocas = Array.from({ length: datosPerdidasPorEpoca.length }, (_, i) => i + 1);

  // Destruir gráfico anterior si existe
  if (graficoPerdidasInstancia) {
    graficoPerdidasInstancia.destroy();
  }

  // Crear nuevo gráfico con Chart.js
  const contexto = canvasGrafico.getContext("2d");
  graficoPerdidasInstancia = new Chart(contexto, {
    type: "line",
    data: {
      labels: numeroEpocas,
      datasets: [
        {
          label: "Pérdida por Época (Loss)",
          data: datosPerdidasPorEpoca,
          borderColor: "#81c3d7",
          backgroundColor: "rgba(129, 195, 215, 0.1)",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: "#81c3d7",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Progreso del Entrenamiento",
          font: { size: 16, weight: "bold" },
          padding: 20,
        },
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Época",
            font: { size: 12, weight: "bold" },
          },
          grid: { display: true, color: "rgba(0, 0, 0, 0.1)" },
        },
        y: {
          type: "linear",
          title: {
            display: true,
            text: "Loss (Pérdida)",
            font: { size: 12, weight: "bold" },
          },
          grid: { display: true, color: "rgba(0, 0, 0, 0.1)" },
          beginAtZero: true,
        },
      },
    },
  });
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
    function (numeroEpoca, perdida) {
      const porcentaje = Math.round(((numeroEpoca + 1) / TOTAL_EPOCAS) * 100);
      actualizarProgreso(porcentaje);

      if ((numeroEpoca + 1) % 50 === 0) {
        actualizarEstado(
          "Entrenando… épocas: " + (numeroEpoca + 1) + " / " + TOTAL_EPOCAS,
          "ejecutando",
        );
      }
    },
    // Callback al terminar: actualiza la UI al estado final y crea el gráfico
    function () {
      actualizarProgreso(100);
      actualizarEstado("Entrenamiento completado con éxito.", "exito");
      marcarComoEntrenado();
      botonEntrenar.disabled = false;
      botonEntrenar.textContent = "Re-Entrenar Modelo";

      // Crear el gráfico con los datos de pérdida
      const datosPerdidasPorEpoca = obtenerDatosPerdidasPorEpoca();
      crearGraficoPerdidasConChartJs(datosPerdidasPorEpoca);
    },
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
  inputValor.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
      alClickPredecir();
    }
  });
}

// Espera a que el HTML esté completamente cargado antes de inicializar
document.addEventListener("DOMContentLoaded", inicializar);
