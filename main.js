/* ============================================================
   main.js — Lógica del modelo TensorFlow.js
   Responsabilidad: crear, entrenar y predecir con el modelo.
   No modifica el DOM. Eso es responsabilidad de index.js.
   ============================================================ */

// ── Constantes ───────────────────────────────────────────────

const TOTAL_EPOCAS = 50; //Varío este número para poder ver la variación del grafico de pérdida.

// Datos de entrenamiento: y = 2x + 1
const DATOS_ENTRADA_X = [1, 2, 3, 4, 5, 6, 7, 8];
const DATOS_SALIDA_Y = [3, 5, 7, 9, 11, 13, 15, 17];

// ── Variables globales ───────────────────────────────────────

// Guarda el modelo una vez entrenado; null significa "no entrenado"
let modeloEntrenado = null;

// Almacena los datos de pérdida de cada época para el gráfico
let datosPerdidasPorEpoca = [];

// ── Funciones ────────────────────────────────────────────────

// Crea un modelo secuencial de una capa densa y lo compila
function crearYCompilarModelo() {
  const modelo = tf.sequential();

  modelo.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  modelo.compile({
    loss: "meanSquaredError",
    optimizer: "sgd",
  });

  return modelo;
}

// Entrena el modelo y llama a los callbacks en cada época y al terminar
async function entrenarModelo(callbackPorEpoca, callbackAlTerminar) {
  const modelo = crearYCompilarModelo();

  // Limpiar datos previos de pérdidas
  datosPerdidasPorEpoca = [];

  // Convertir arrays a tensores 2D (8 filas, 1 columna)
  const tensoresX = tf.tensor2d(DATOS_ENTRADA_X, [8, 1]);
  const tensoresY = tf.tensor2d(DATOS_SALIDA_Y, [8, 1]);

  await modelo.fit(tensoresX, tensoresY, {
    epochs: TOTAL_EPOCAS,
    callbacks: {
      onEpochEnd: function (numeroEpoca, registros) {
        // Almacenar el valor de pérdida
        datosPerdidasPorEpoca.push(registros.loss);

        if (typeof callbackPorEpoca === "function") {
          callbackPorEpoca(numeroEpoca, registros.loss);
        }
      },
    },
  });

  modeloEntrenado = modelo;

  if (typeof callbackAlTerminar === "function") {
    callbackAlTerminar();
  }
}

// Predice el valor de Y para un X dado; retorna null si el modelo no está entrenado
function predecir(valorX) {
  if (modeloEntrenado === null) {
    console.warn("El modelo no ha sido entrenado todavía.");
    return null;
  }

  const tensorEntrada = tf.tensor2d([valorX], [1, 1]);
  const tensorSalida = modeloEntrenado.predict(tensorEntrada);
  const valorPredicho = tensorSalida.dataSync()[0];

  // Redondear a 3 decimales para mostrar en pantalla
  return Math.round(valorPredicho * 1000) / 1000;
}

// Retorna los datos de pérdida acumulados durante el entrenamiento
function obtenerDatosPerdidasPorEpoca() {
  return datosPerdidasPorEpoca;
}
