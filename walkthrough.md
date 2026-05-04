# Walkthrough — Modularización TP6: Modelo Secuencial TensorFlow.js

## Objetivo

Reestructurar el archivo `index.html` monolítico en módulos separados con código legible para estudiantes de 2do año de Tecnicatura en Desarrollo de Software, como paso previo a la incorporación de un gráfico de pérdida del entrenamiento (a cargo del personal técnico).

---

## Estructura final de archivos

```
trabajo_practico_6/
│
├── index.html       → Esqueleto HTML limpio (estructura de la página)
├── style.css        → Todos los estilos visuales
├── main.js          → Lógica del modelo TensorFlow.js (crear, entrenar, predecir)
├── index.js         → Montaje de la página: eventos, actualización del DOM
│
└── docs/
    ├── auditoria_style_css.md    → Documentación y auditoría de style.css
    ├── auditoria_main_js.md      → Documentación y auditoría de main.js
    └── auditoria_index_js.md     → Documentación y auditoría de index.js
```

---

## Criterios de escritura de código

- **Comentarios en español**, explicando el *qué* y el *por qué*
- Uso correcto de `const` (no cambia) y `let` (puede cambiar)
- Nombres de variables y funciones **descriptivos y en español**
- Separación clara de responsabilidades por archivo
- Sin patrones avanzados (closures complejos, cadenas de promesas anidadas)
- Arrow functions solo en callbacks simples y breves

---

## Proceso de entrega y auditoría

Cada archivo se entrega por separado. Luego de cada entrega:
1. El personal técnico realiza la **auditoría del archivo**
2. Confirma la aprobación
3. Se registra la aprobación en este walkthrough y en el documento de auditoría correspondiente
4. Se continúa con el siguiente archivo

---

## Registro de avance

| Archivo         | Estado         | Auditoría          | Aprobado por | Fecha       |
|-----------------|----------------|--------------------|--------------|-------------|
| `style.css`     | ✅ Entregado   | ✅ Aprobado         | Personal técnico | 2026-05-04 |
| `main.js`       | ✅ Entregado   | ✅ Aprobado         | Personal técnico | 2026-05-04 |
| `index.js`      | ✅ Entregado   | ✅ Aprobado         | Personal técnico | 2026-05-04 |
| `index.html`    | ✅ Entregado   | ✅ Aprobado         | Personal técnico | 2026-05-04 |

---

## Decisiones técnicas relevantes

- **`main.js` vs `index.js`**: `main.js` contiene **solo** la lógica del modelo ML (sin tocar el DOM). `index.js` contiene **solo** la interacción con la página. Esta separación permite al personal técnico agregar el gráfico de pérdida en `main.js` (recibiendo los datos por callback) sin modificar `index.js`.
- **Callbacks de entrenamiento**: `main.js` expone el entrenamiento como una función que recibe callbacks, lo que facilita que `index.js` actualice la UI y que el gráfico futuro se conecte sin alterar la lógica.
- **Variables globales mínimas**: Solo `modeloEntrenado` es compartida entre archivos (a través de `main.js`). Todo lo demás es local a cada función.
