# PROMPT-RIQ-043 — RIQ · ItemService · Bugs Fill Example y Obtener EditSequence en Playground

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-15 |
| **Proyecto destino** | RIQ |
| **Tipo** | bug |
| **Estado** | ✅ solved — commit 16996e8 |

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

## Diagnóstico RIQ (2026-04-15)

**Bug 1 — Fill Example:**
`fillExamples` no tenía rama para template mode. Con `activeTemplate != null` y `headerFields: []`, iteraba array vacío → `setHeaderValues({})`. Fix: nueva rama template que itera `activeTemplate.fields` y busca en `QB_TEMPLATE_EXAMPLES[selectedAction.type]`. EditSequence excluido intencionalmente (dinámico, viene del QB Query). Datos cargados: `RDX-SVC-001` · tax `80000002` · account `80000078` · price `100.00`. Mod: ListID `80009958-1776193394` · price `150.00`.

**Bug 2 — Obtener EditSequence:**
`knownPaths` se construía solo desde `selectedAction.headerFields` (`[]`) → filtro excluía todo el QB return → `setHeaderValues({})` borraba el formulario. Fix en dos partes: (1) si `activeTemplate`, agrega `tf.key` de cada campo del template a `knownPaths`; (2) `setHeaderValues(filteredHeader)` → `setHeaderValues(prev => ({ ...prev, ...filteredHeader }))` — merge preserva campos no retornados por el Query.

**Hallazgo adicional:** el mismo bug latente existía en InvoiceMod, BillMod y CreditCardChargeMod — corregido en el mismo fix.

**FL aprobó implementación.**

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-15 | Emisión | Dos bugs en ItemService Playground — Fill Example vacío · Obtener EditSequence borra el formulario |
| 2026-04-15 | Diagnóstico RIQ | Causa raíz identificada en ambos bugs · fix latente en InvoiceMod/BillMod/CreditCardChargeMod incluido · FL aprobó |
| 2026-04-15 | Completado RIQ | Commit 16996e8 — implementación entregada junto al diagnóstico |
| 2026-04-15 | Push RIQ | Branch feature/redix-integration-quickbooks-playground pusheada · remoto: redsis-rgh/redix-platform-engine · rango: f6aae04..babc414 |
