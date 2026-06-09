# Lista de Tareas — Modularización TP6

## Fase 0: Planificación y seguimiento
- [x] Leer y analizar `index.html` completo
- [x] Crear `walkthrough.md`
- [x] Crear `task.md`

---

## Fase 1: `style.css`
- [x] Extraer todos los estilos del `<style>` de `index.html`
- [x] Organizar por secciones con comentarios claros
- [x] Crear `docs/auditoria_style_css.md`
- [ ] ⏸️ **PAUSA** — Esperar aprobación del personal técnico
- [ ] Registrar aprobación en walkthrough y auditoría

---

## Fase 2: `main.js` ✅ APROBADO
- [x] Crear `main.js` con lógica del modelo TensorFlow.js
  - [ ] Constante `EPOCHS`
  - [ ] Variable `modeloEntrenado`
  - [ ] Función `crearYCompilarModelo()`
  - [ ] Función `entrenarModelo(callbackPorEpoca, callbackAlTerminar)`
  - [ ] Función `predecir(valorX)`
- [ ] Crear `docs/auditoria_main_js.md`
- [ ] ⏸️ **PAUSA** — Esperar aprobación del personal técnico
- [ ] Registrar aprobación en walkthrough y auditoría

---

## Fase 3: `index.js` ✅ APROBADO
- [x] Crear `index.js` con montaje de página y eventos
  - [ ] Función `actualizarEstadoEntrenamiento(mensaje, tipo)`
  - [ ] Función `actualizarBarraProgreso(porcentaje)`
  - [ ] Función `alClickEntrenar()`
  - [ ] Función `alClickPredecir()`
  - [ ] Función `inicializar()`
  - [ ] Event listener `DOMContentLoaded`
- [ ] Crear `docs/auditoria_index_js.md`
- [ ] ⏸️ **PAUSA** — Esperar aprobación del personal técnico
- [ ] Registrar aprobación en walkthrough y auditoría

---

## Fase 4: `index.html` ✅ COMPLETADO limpio
- [x] Reescribir `index.html` sin `<style>` ni `<script>` inline
- [x] Vincular `style.css`, `main.js`, `index.js`
- [x] ⏸️ **PAUSA** — Aprobado ✅
- [x] Registrar aprobación en walkthrough

---

## Estado general
**Estado general: ✅ MODULARIZACIÓN COMPLETA Y APROBADA**
