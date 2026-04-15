# PROMPT-RIQ-043 — RIQ · ItemService · Bugs Fill Example y Obtener EditSequence en Playground

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-15 |
| **Proyecto destino** | RIQ |
| **Tipo** | bug |
| **Estado** | 🔵 pending |

---

## Contexto

Durante la verificación E2E (F3) de ItemService en el QB Playground se encontraron dos bugs que bloquean el flujo del usuario.

---

## Bug 1 — Fill Example no funciona en ItemServiceAdd

Al hacer clic en **Fill Example** en el formulario de `ItemServiceAdd`, los campos quedan vacíos. El botón no popula ningún valor.

**Causa probable:** no se definieron datos de ejemplo para `ItemServiceAdd` al implementar el routing (RIQ-040).

**Fix esperado:** agregar datos de ejemplo reales de TEST para `ItemServiceAdd`:

| Campo | Valor |
|---|---|
| `Name` | `RDX-SVC-001` |
| `IsActive` | `true` |
| `SalesTaxCodeRef.ListID` | valor real de TEST |
| `SalesOrPurchase.Price` | valor real de TEST |
| `SalesOrPurchase.AccountRef.ListID` | valor real de TEST |

> `ListID` disponible para referencia: `80009958-1776193394`

---

## Bug 2 — Obtener EditSequence borra el formulario en ItemServiceMod

Al ingresar el `ListID` en el formulario de `ItemServiceMod` y hacer clic en **Obtener EditSequence**:
- El campo `ListID` se borra
- Todos los demás campos quedan vacíos
- El `EditSequence` no se popula

**Comportamiento esperado:** hacer la query con el ListID, poblar solo el campo `EditSequence`, y conservar el `ListID` y todos los demás campos intactos.

**Causa probable:** el handler de "Obtener EditSequence" resetea el estado del formulario después de recibir la respuesta, en lugar de hacer un merge parcial.

---

## Acción requerida

1. Analizar ambos bugs e identificar causa exacta
2. Responder a FL con diagnóstico antes de implementar
3. Esperar aprobación de FL
4. Implementar fix en ambos + commit
5. Verificar en browser que Fill Example popula campos y que Obtener EditSequence conserva el formulario
6. Reportar a FL:
   - `PROMPT-RIQ-043 completado. Commit {hash}`
7. FL cierra el PROMPT

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-15 | Emisión | Dos bugs en ItemService Playground — Fill Example vacío · Obtener EditSequence borra el formulario |
