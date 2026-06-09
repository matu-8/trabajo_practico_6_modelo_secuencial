# Proyecto: Visualización de pérdida en entrenamiento de modelo
Este repositorio contiene una aplicación web simple que entrena un modelo de regresión lineal con TensorFlow.js y muestra el gráfico de pérdida por época usando Chart.js.

## Cómo utilizar el proyecto
1. Clonar el repositorio desde GitHub, desde la rama grf_perdida.
2. Abrir el archivo `index.html` en un navegador moderno.
3. Presionar el botón **"Empezar Entrenamiento"** para entrenar el modelo.
4. Una vez finalizado el entrenamiento, el botón **"Predecir"** se habilita.
5. Ingresar un valor en el campo numérico y presionar **"Predecir"** para ver el resultado.

## Estructura principal
- `index.html` - interfaz de usuario y contenedor del gráfico.
- `style.css` - estilos visuales del proyecto.
- `main.js` - lógica del modelo y entrenamiento con TensorFlow.js.
- `index.js` - interacción con el DOM y creación del gráfico de pérdida.

> Nota: El proyecto carga TensorFlow.js y Chart.js desde CDN, por lo que necesita conexión a internet para funcionar.

