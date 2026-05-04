
## 1. Propósito del archivo

`main.js` contiene **exclusivamente la lógica del modelo de Machine Learning**.  
No accede al HTML ni modifica elementos de la página (eso es responsabilidad de `index.js`).

**Responsabilidades de este archivo:**
- Definir los datos de entrenamiento
- Crear y compilar el modelo de red neuronal
- Ejecutar el entrenamiento
- Realizar predicciones con el modelo entrenado

---

## 2. Constantes definidas

| Constante             | Tipo       | Valor                          | Descripción                                              |
|-----------------------|------------|--------------------------------|----------------------------------------------------------|
| `TOTAL_EPOCAS`        | `number`   | `350`                          | Cantidad de ciclos de entrenamiento                      |
| `DATOS_ENTRADA_X`     | `number[]` | `[1, 2, 3, 4, 5, 6, 7, 8]`    | Valores de X para el entrenamiento                       |
| `DATOS_SALIDA_Y`      | `number[]` | `[3, 5, 7, 9, 11, 13, 15, 17]`| Valores de Y esperados (y = 2x + 1)                     |

> **Nota pedagógica:** Se usa `const` porque estos valores **no deben cambiar** durante la ejecución. Si cambiaran, el modelo aprendería una función diferente.

---

## 3. Variables globales

| Variable           | Tipo inicial | Tipo final           | Descripción                                         |
|--------------------|-------------|----------------------|-----------------------------------------------------|
| `modeloEntrenado`  | `null`      | `tf.Sequential`      | Guarda el modelo tras el entrenamiento. Compartida con `index.js` |

> **Nota técnica:** Es la **única** variable global del archivo. Inicia en `null` como señal de que el modelo todavía no fue entrenado. `index.js` y `predecir()` consultan este valor para saber si el modelo está disponible.

---

## 4. Funciones

### 4.1 `crearYCompilarModelo()`

| Característica | Detalle |
|---|---|
| **Tipo** | Función sincrónica (no necesita `await`) |
| **Parámetros** | Ninguno |
| **Retorna** | `tf.Sequential` — el modelo listo para entrenar |

**Qué hace paso a paso:**
1. Crea un modelo secuencial vacío con `tf.sequential()`
2. Agrega una capa densa con `units: 1` y `inputShape: [1]`
3. Compila el modelo con:
   - **loss:** `"meanSquaredError"` — mide el error como la diferencia al cuadrado entre el valor predicho y el real
   - **optimizer:** `"sgd"` — Stochastic Gradient Descent, ajusta los pesos para minimizar el error
4. Devuelve el modelo compilado

**¿Por qué está separada?**  
Para que si en el futuro se necesita cambiar la arquitectura del modelo (agregar más capas, cambiar el optimizador), el cambio sea localizado en esta función sin afectar al entrenamiento.

---

### 4.2 `entrenarModelo(callbackPorEpoca, callbackAlTerminar)`

| Característica | Detalle |
|---|---|
| **Tipo** | Función **asincrónica** (`async`) |
| **Parámetros** | `callbackPorEpoca` (función), `callbackAlTerminar` (función) |
| **Retorna** | `Promise<void>` — no devuelve valor, pero se espera con `await` |

**Parámetros en detalle:**

| Parámetro              | Tipo       | Cuándo se llama                   | Argumentos que recibe               |
|------------------------|------------|-----------------------------------|-------------------------------------|
| `callbackPorEpoca`     | `function` | Al finalizar **cada** época       | `(numeroEpoca, perdidaActual)`      |
| `callbackAlTerminar`   | `function` | **Una vez**, al terminar todo     | Ninguno                             |

**Qué hace paso a paso:**
1. Llama a `crearYCompilarModelo()` para obtener el modelo listo
2. Convierte los arrays de datos a tensores con `tf.tensor2d()`
3. Llama a `modelo.fit()` con los tensores y el número de épocas
4. En cada `onEpochEnd`: llama a `callbackPorEpoca` con el número de época y la pérdida (`registros.loss`)
5. Al terminar el `fit()`: guarda el modelo en `modeloEntrenado`
6. Llama a `callbackAlTerminar`

**¿Por qué usa callbacks y no actualiza la UI directamente?**

> Este es el principio de **separación de responsabilidades**. `main.js` sabe *qué pasó* (la época terminó, el error fue X), pero no sabe *cómo mostrarlo*. Eso lo decide `index.js`.  
> Esto también facilita al personal técnico **conectar el gráfico de pérdida**: solo debe pasar su función de graficado como `callbackPorEpoca`, sin modificar este archivo.

---

### 4.3 `predecir(valorX)`

| Característica | Detalle |
|---|---|
| **Tipo** | Función sincrónica |
| **Parámetros** | `valorX` (number) — el número ingresado por el usuario |
| **Retorna** | `number` redondeado a 3 decimales, o `null` si el modelo no está entrenado |

**Qué hace paso a paso:**
1. Verifica que `modeloEntrenado !== null`; si no, retorna `null` y registra un `console.warn`
2. Convierte `valorX` a tensor con `tf.tensor2d([valorX], [1, 1])`
3. Llama a `modeloEntrenado.predict()` con el tensor
4. Extrae el número del tensor con `.dataSync()[0]`
5. Redondea a 3 decimales con `Math.round(valor * 1000) / 1000`
6. Devuelve el resultado

---

## 5. Flujo de datos entre archivos

```
index.js
   │
   ├─ llama ──→  entrenarModelo(fn1, fn2)   [main.js]
   │                  │
   │                  ├─ por época ──→  fn1(epoca, perdida)   [index.js actualiza UI]
   │                  │                                        [técnico actualiza gráfico]
   │                  └─ al terminar → fn2()                  [index.js habilita botón]
   │
   └─ llama ──→  predecir(valorX)           [main.js]
                      │
                      └─ retorna ──→ número  [index.js lo muestra en pantalla]
```

---

## 6. Convenciones de estilo aplicadas

| Convención            | Aplicación                                                    |
|-----------------------|---------------------------------------------------------------|
| `const` vs `let`      | `const` para datos que no cambian, `let` para `modeloEntrenado` |
| Nombres en español    | `DATOS_ENTRADA_X`, `modeloEntrenado`, `callbackPorEpoca`     |
| Comentarios explicativos | En cada sección y línea clave, en español               |
| Sin arrow functions en lógica principal | Solo en el callback de `onEpochEnd` (contexto simple) |
| Verificación defensiva | `predecir()` verifica `null` antes de operar               |

---

## 7. Punto de conexión para el gráfico de pérdida (personal técnico)

El parámetro `callbackPorEpoca` recibe en cada época:
- `numeroEpoca` (0-indexed): número de la época actual
- `perdidaActual`: valor de pérdida (MSE) de esa época

**Ejemplo de uso futuro:**
```javascript
// En index.js, al llamar a entrenarModelo:
await entrenarModelo(
    function(epoca, perdida) {
        actualizarBarraProgreso(epoca);    // ya existe
        actualizarGrafico(epoca, perdida); // por implementar (personal técnico)
    },
    function() {
        alTerminarEntrenamiento();
    }
);
```

---

## 8. Registro de auditoría

| Campo               | Detalle                          |
|---------------------|----------------------------------|
| Revisado por        | _(pendiente)_                    |
| Fecha de revisión   | _(pendiente)_                    |
| Observaciones       | _(pendiente)_                    |
| Estado              | ⏳ Pendiente de aprobación        |

---

> Una vez aprobado, actualizar el estado en este documento y en `walkthrough.md`.
