## 1. Propósito del archivo

`index.js` conecta la lógica del modelo (`main.js`) con los elementos visuales de la página.  
No contiene lógica de Machine Learning: solo maneja el DOM, eventos y actualizaciones de la interfaz.

---

## 2. Referencias al DOM

Se obtienen **una sola vez** al cargar el script, usando `document.getElementById()`.  
Almacenarlas en constantes evita buscar el elemento en el DOM cada vez que se necesita.

| Constante            | `id` en el HTML              | Elemento                              |
|----------------------|------------------------------|---------------------------------------|
| `elementoEstado`     | `estado-entrenamiento`       | Cuadro de mensaje de estado           |
| `elementoMensaje`    | `mensaje-estado`             | Texto dentro del cuadro de estado     |
| `elementoProgreso`   | `progreso-contenedor`        | Contenedor de la barra de progreso    |
| `elementoBarra`      | `progreso-barra`             | Barra de progreso rellena             |
| `elementoBadge`      | `badge-entrenado`            | Etiqueta "No entrenado / Entrenado"   |
| `elementoResultado`  | `resultado-valor`            | Número grande del resultado           |
| `elementoFormula`    | `resultado-formula`          | Texto con la ecuación del resultado   |
| `botonEntrenar`      | `btn-entrenar`               | Botón "Empezar Entrenamiento"         |
| `botonPredecir`      | `btn-predecir`               | Botón "Predecir"                      |
| `inputValor`         | `input-valor`                | Campo numérico de entrada             |

> Todas se declaran con `const` porque la referencia al elemento no cambia, aunque su contenido sí pueda cambiar.

---

## 3. Funciones de actualización de UI

### 3.1 `actualizarEstado(mensaje, tipo)`

| Parámetro | Tipo     | Valores posibles                         |
|-----------|----------|------------------------------------------|
| `mensaje` | `string` | Texto a mostrar en el cuadro de estado   |
| `tipo`    | `string` | `""` / `"ejecutando"` / `"exito"` / `"error"` |

Reemplaza el `className` del cuadro de estado para activar el estilo CSS correspondiente.  
Actualiza el texto visible del mensaje.

---

### 3.2 `actualizarProgreso(porcentaje)`

| Parámetro    | Tipo     | Rango    |
|--------------|----------|----------|
| `porcentaje` | `number` | `0`–`100` |

- Con `porcentaje > 0`: muestra el contenedor y actualiza el ancho de la barra.
- Con `porcentaje === 0`: oculta el contenedor.

---

### 3.3 `marcarComoEntrenado()`

- Cambia el texto del badge a `"Entrenado"` y agrega la clase `.entrenado` (estilo verde).
- Habilita el botón de predicción (`botonPredecir.disabled = false`).

---

### 3.4 `mostrarResultado(valorX, valorY)`

| Parámetro | Tipo     | Descripción            |
|-----------|----------|------------------------|
| `valorX`  | `number` | Valor ingresado por el usuario |
| `valorY`  | `number` | Resultado de la predicción    |

- Quita la clase `.sin-resultado` para mostrar el número en celeste completo.
- Actualiza el texto grande con `valorY` y la fórmula con ambos valores.

---

### 3.5 `mostrarErrorPrediccion()`

- Agrega la clase `.sin-resultado` para mostrar el resultado atenuado.
- Muestra mensajes de error descriptivos en el resultado y la fórmula.

---

## 4. Manejadores de eventos

### 4.1 `alClickEntrenar()` — `async`

Es `async` porque llama a `entrenarModelo()` de `main.js`, que es asincrónica.

**Secuencia de acciones:**
1. Deshabilita ambos botones para evitar doble clic durante el entrenamiento
2. Actualiza el estado a `"ejecutando"` con mensaje de espera
3. Inicia la barra de progreso en `1%`
4. Llama a `entrenarModelo()` con dos callbacks:

| Callback           | Cuándo se llama    | Qué hace                                            |
|--------------------|--------------------|-----------------------------------------------------|
| `callbackPorEpoca` | Cada época         | Actualiza `%` de progreso y mensaje cada 50 épocas  |
| `callbackAlTerminar` | Al finalizar     | Completa barra, muestra éxito, marca como entrenado |

**Cálculo del porcentaje:**
```
porcentaje = ((épocaActual + 1) / TOTAL_EPOCAS) * 100
```
Se usa `numeroEpoca + 1` porque `numeroEpoca` es 0-indexed (empieza en 0).

---

### 4.2 `alClickPredecir()`

1. Lee el valor del `input` con `parseFloat()` — convierte texto a número decimal
2. Si el valor es `NaN` (no es un número): llama a `mostrarErrorPrediccion()` y sale
3. Si es válido: llama a `predecir(valorIngresado)` de `main.js`
4. Si `predecir()` devuelve un número: llama a `mostrarResultado()`

---

## 5. Inicialización

### `inicializar()`

Asigna manejadores de eventos usando `addEventListener`:

| Elemento       | Evento      | Manejador          |
|----------------|-------------|--------------------|
| `botonEntrenar`| `"click"`   | `alClickEntrenar`  |
| `botonPredecir`| `"click"`   | `alClickPredecir`  |
| `inputValor`   | `"keydown"` | Predice si `key === "Enter"` |

Se usa `addEventListener` en lugar de `onclick` en el HTML para mantener separada la lógica del HTML.

### `DOMContentLoaded`

```javascript
document.addEventListener("DOMContentLoaded", inicializar);
```

Garantiza que `inicializar()` se ejecute recién cuando el HTML esté completamente cargado y los elementos del DOM existan. Si se ejecutara antes, las constantes de referencia al DOM serían `null`.

---

## 6. Flujo completo de interacción

```
Usuario hace clic en "Entrenar"
    → alClickEntrenar()
        → entrenarModelo(callbackPorEpoca, callbackAlTerminar)   [main.js]
            → por cada época: callbackPorEpoca(epoca, perdida)
                → actualizarProgreso()
                → actualizarEstado()
            → al terminar: callbackAlTerminar()
                → actualizarProgreso(100)
                → actualizarEstado("completado", "exito")
                → marcarComoEntrenado()

Usuario ingresa número y hace clic en "Predecir" (o Enter)
    → alClickPredecir()
        → parseFloat(inputValor.value)
        → predecir(valorIngresado)   [main.js]
        → mostrarResultado(x, y)
```

---

## 7. Convenciones de estilo aplicadas

| Convención                  | Aplicación                                              |
|-----------------------------|---------------------------------------------------------|
| `const` para referencias DOM | No cambian durante la ejecución                        |
| Nombres en español          | `actualizarEstado`, `alClickEntrenar`, `inputValor`     |
| `addEventListener` en JS    | Sin `onclick` inline en el HTML                         |
| `async/await`               | Para esperar `entrenarModelo()` sin bloquear el hilo    |
| `function` explícita        | En manejadores principales; arrow solo en el keydown   |

---

## 8. IDs del HTML requeridos por este archivo

Los siguientes `id` deben existir en `index.html` para que `index.js` funcione correctamente:

`estado-entrenamiento`, `mensaje-estado`, `progreso-contenedor`, `progreso-barra`,
`badge-entrenado`, `resultado-valor`, `resultado-formula`, `btn-entrenar`, `btn-predecir`, `input-valor`

---

## 9. Registro de auditoría

| Campo               | Detalle                          |
|---------------------|----------------------------------|
| Revisado por        | _(pendiente)_                    |
| Fecha de revisión   | _(pendiente)_                    |
| Observaciones       | _(pendiente)_                    |
| Estado              | ⏳ Pendiente de aprobación        |

---

> Una vez aprobado, actualizar el estado en este documento y en `walkthrough.md`.
