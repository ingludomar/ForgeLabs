# PROMPT-RIQ-010 — QB Playground · Fill Examples · EditSequence en operaciones Mod

**Fecha:** 2026-03-31
**Tipo:** bug
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-RIQ-004](PROMPT-RIQ-004-example-data-test.md) — Fill Examples definido en ese PROMPT; este fix corrige el comportamiento para operaciones Mod
- [PROMPT-RIQ-009](PROMPT-RIQ-009-json-output-summary-tab.md) — mejora de UX complementaria al mismo sprint

---

## Problema

En operaciones Mod, Fill Examples coloca valores de texto como `"notapreliminar"` o `"{{query primero}}"` en el campo `EditSequence`. QB Desktop rechaza cualquier valor que no sea el EditSequence numérico actual del registro — el error resultante es `QB-OPERATION-ERROR` statusCode 3100 o 3210.

---

## Causa raíz

`EditSequence` es un valor dinámico que QB asigna y actualiza con cada modificación. No puede ser un valor estático en Fill Examples porque es diferente por registro y cambia con el tiempo.

---

## Acción requerida

### 1. EditSequence — dejar vacío con instrucción clara

En operaciones Mod, el campo `EditSequence` debe:
- Aparecer vacío (sin valor pre-llenado)
- Mostrar un hint o placeholder visible: `"Obtener del Query previo"`
- Estar marcado como requerido (punto rojo)

### 2. Flujo sugerido — botón "Query para Mod"

Opcionalmente, agregar un botón en operaciones Mod que ejecute automáticamente el Query del registro por `ListID` y complete `EditSequence` con el valor real retornado. Esto elimina el paso manual y evita el error.

---

## Comportamiento esperado

1. Usuario selecciona `Vendor — Mod` + sede TEST
2. Click Fill Examples → ListID se completa, EditSequence queda vacío con hint visible
3. Usuario hace Query manual (o usa botón automático) para obtener EditSequence actual
4. Usuario ingresa EditSequence real → Send → éxito

---

## Verificación

Confirmar a SyncBridge:
1. Fill Examples en operaciones Mod no coloca texto en EditSequence
2. El campo muestra hint "Obtener del Query previo"
3. VendorMod ejecuta correctamente con el flujo descrito

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-31 | Emisión | PROMPT emitido a RIQ — Fill Examples colocaba texto inválido en EditSequence de operaciones Mod |
| 2026-03-31 | Resolución | EditSequence queda vacío con hint "Obtener del Query previo"; VendorMod ejecuta correctamente |
