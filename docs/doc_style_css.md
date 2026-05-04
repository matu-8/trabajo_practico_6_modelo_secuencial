
---

## 1. Propósito del archivo

`style.css` contiene **todos los estilos visuales** de la aplicación. No tiene lógica JavaScript ni estructura HTML: su única responsabilidad es definir cómo se ve cada elemento de la página.

---

## 2. Variables CSS definidas (`:root`)

Las variables se declaran en `:root` para que estén disponibles en todo el archivo.

| Variable                  | Valor       | Uso en la interfaz                          |
|---------------------------|-------------|---------------------------------------------|
| `--color-azul-oscuro`     | `#2f6690`   | Color principal, textos, barra de progreso  |
| `--color-azul-medio`      | `#3a7ca5`   | Acentos, gradientes, borde secciones        |
| `--color-gris-claro`      | `#d9dcd6`   | Fondo de secciones internas y footer        |
| `--color-azul-profundo`   | `#16425b`   | Header, resultado, fondo oscuro             |
| `--color-celeste`         | `#81c3d7`   | Detalles, valor de resultado, botón predecir|
| `--borde-redondeado`      | `14px`      | Redondeo de la tarjeta principal            |
| `--sombra-tarjeta`        | (rgba)      | Sombra de profundidad de la tarjeta         |

---

## 3. Secciones de estilo y clases aplicadas

### 3.1 Reset básico
- **Selector:** `*, *::before, *::after`
- **Propósito:** Eliminar estilos por defecto del navegador
- **Propiedades clave:** `box-sizing: border-box`, `margin: 0`, `padding: 0`

---

### 3.2 Cuerpo de la página
- **Selector:** `body`
- **Propósito:** Centrar la tarjeta en pantalla con fondo degradado
- **Propiedades clave:**
  - `min-height: 100vh` — Ocupa la pantalla completa
  - `display: flex` + `align-items/justify-content: center` — Centra el contenido
  - `background: linear-gradient(...)` — Degradado con paleta del proyecto
  - `font-family: 'Inter', sans-serif` — Tipografía del proyecto

---

### 3.3 Tarjeta principal
- **Selector:** `.card`
- **Propósito:** Contenedor central blanco
- **Propiedades clave:**
  - `max-width: 500px` — Limita el ancho
  - `overflow: hidden` — Los bordes redondeados se aplican a los hijos
  - `animation: aparecer-desde-abajo` — Animación de entrada

| Animación                  | Descripción                                                  |
|----------------------------|--------------------------------------------------------------|
| `@keyframes aparecer-desde-abajo` | La tarjeta sube 24px con fade-in al cargar la página |

---

### 3.4 Encabezado (`.card-header`, `.marca`, `.formula`, `.subtitulo`)

| Clase         | Propósito                                          |
|---------------|----------------------------------------------------|
| `.card-header`| Franja oscura superior con padding y texto centrado|
| `.marca`      | Nombre de la tecnología con ícono SVG alineado     |
| `.formula`    | Caja semitransparente con la expresión matemática  |
| `.subtitulo`  | Texto pequeño y opaco debajo de la fórmula         |

---

### 3.5 Cuerpo y secciones (`.card-body`, `.section`, `.section-titulo`)

| Clase           | Propósito                                              |
|-----------------|--------------------------------------------------------|
| `.card-body`    | Área de contenido con `gap` entre secciones            |
| `.section`      | Bloque gris con las subsecciones de la app             |
| `.section-titulo`| Título con línea de acento izquierda (border-left)   |

---

### 3.6 Mensaje de estado (`.estado-msg` y modificadores)

| Clase                    | Color de texto | Fondo              | Cuándo se usa            |
|--------------------------|----------------|--------------------|--------------------------|
| `.estado-msg` (base)     | Azul oscuro    | Azul suave         | Estado neutro / listo    |
| `.estado-msg.ejecutando` | Azul oscuro    | Azul un poco más fuerte | Entrenando          |
| `.estado-msg.exito`      | Verde          | Verde suave        | Entrenamiento completo   |
| `.estado-msg.error`      | Rojo           | Rojo suave         | Error                    |

- `.punto-estado`: Círculo de 8×8px que toma el color del texto del padre (`currentColor`)

---

### 3.7 Barra de progreso (`.progreso-contenedor`, `.progreso-barra`)

| Clase                   | Propósito                                              |
|-------------------------|--------------------------------------------------------|
| `.progreso-contenedor`  | Pista gris; `display: none` por defecto (JS la muestra)|
| `.progreso-barra`       | Relleno azul→celeste; `width` controlado por JS        |

- La transición `width 0.2s` genera la animación suave de avance.

---

### 3.8 Botones (`.btn`, `.btn-entrenar`, `.btn-predecir`)

| Clase          | Color de fondo                       | Color de texto          |
|----------------|--------------------------------------|-------------------------|
| `.btn-entrenar`| Degradado azul oscuro → azul medio   | Blanco                  |
| `.btn-predecir`| Degradado celeste → celeste oscuro   | Azul profundo           |

- `.btn:active` — Reduce la escala a 0.97 al hacer clic (feedback visual)
- `.btn:disabled` — Opacidad 0.55, cursor `not-allowed`

---

### 3.9 Badge (`.badge`, `.badge.entrenado`)

| Estado          | Fondo      | Texto  |
|-----------------|------------|--------|
| Sin entrenar    | Rojo suave | Rojo   |
| `.entrenado`    | Verde suave| Verde  |

---

### 3.10 Campo de entrada (`.input-numero`)

- Borde de 2px sólido, con transición al foco
- Al hacer foco: borde cambia a `--color-azul-medio` + sombra externa suave
- Las flechitas numéricas del navegador se reducen con `::-webkit-inner-spin-button`

---

### 3.11 Caja de resultado (`.resultado-caja`, `.resultado-valor`, `.resultado-formula`)

| Clase                    | Propósito                                              |
|--------------------------|--------------------------------------------------------|
| `.resultado-caja`        | Bloque oscuro centrado con padding                     |
| `.resultado-etiqueta`    | Texto en mayúsculas con letra espaciada                |
| `.resultado-valor`       | Número grande en celeste                               |
| `.resultado-valor.sin-resultado` | Estado vacío (— — —) con baja opacidad        |
| `.resultado-formula`     | Ecuación en cursiva debajo del número                  |

---

### 3.12 Pie de tarjeta (`.card-footer`)

- Fondo gris claro, texto pequeño en azul oscuro
- Muestra información técnica del modelo (tipo de capa, épocas)

---

## 4. Nombres de clase — Cambios respecto al código anterior

> Se renombraron las clases para mayor claridad semántica:

| Nombre anterior      | Nombre nuevo         | Motivo                              |
|----------------------|----------------------|-------------------------------------|
| `.brand`             | `.marca`             | Más claro en español                |
| `.subtitle`          | `.subtitulo`         | Consistencia en español             |
| `.section-title`     | `.section-titulo`    | Consistencia en español             |
| `.status-msg`        | `.estado-msg`        | Más descriptivo                     |
| `.dot`               | `.punto-estado`      | Más descriptivo                     |
| `.progress-wrap`     | `.progreso-contenedor` | Más descriptivo                   |
| `.progress-bar`      | `.progreso-barra`    | Más descriptivo                     |
| `.result-box`        | `.resultado-caja`    | Más descriptivo                     |
| `.result-label`      | `.resultado-etiqueta`| Más descriptivo                     |
| `.result-value`      | `.resultado-valor`   | Más descriptivo                     |
| `.result-formula`    | `.resultado-formula` | Consistencia                        |
| `.placeholder`       | `.sin-resultado`     | Más semántico                       |
| `.trained`           | `.entrenado`         | Consistencia en español             |
| `.running`           | `.ejecutando`        | Consistencia en español             |
| `.success`           | `.exito`             | Consistencia en español             |
| `.input-wrap`        | `.input-contenedor`  | Más descriptivo                     |
| `.input-number`      | `.input-numero`      | Consistencia en español             |
| `.card-footer`       | `.card-footer`       | Se mantiene (ya es claro)           |

---

## 5. Registro de auditoría

| Campo               | Detalle                          |
|---------------------|----------------------------------|
| Revisado por        | _(pendiente)_                    |
| Fecha de revisión   | _(pendiente)_                    |
| Observaciones       | _(pendiente)_                    |
| Estado              | ⏳ Pendiente de aprobación        |

---

> Una vez aprobado, actualizar el estado en este documento y en `walkthrough.md`.
