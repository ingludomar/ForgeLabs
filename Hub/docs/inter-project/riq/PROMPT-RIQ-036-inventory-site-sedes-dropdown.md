# PROMPT-RIQ-036 — Inventory Site · Sedes no se listan en el Playground UI

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-13 |
| **Proyecto destino** | RIQ |
| **Tipo** | bug |
| **Estado** | ✅ solved |

---

## Contexto

Al seleccionar cualquier operación de **Inventory Site** (`Inventory Site — Add`, `Update`, `Query`) en el QB Playground, el dropdown de sedes aparece vacío. No se listan las sedes disponibles.

Este bloquea el Testing E2E de usuario (F3) — sin sedes en el dropdown no es posible ejecutar ninguna operación desde el UI.

Las otras entidades del Playground (ItemInventory, Bill, Invoice, etc.) muestran las sedes correctamente.

---

## Análisis esperado

Verificar por qué el dropdown de sedes no carga para las acciones de InventorySite. Posibles causas:

1. El endpoint `GET /api/integration/qb-sedes` filtra sedes por entidad/categoría — InventorySite puede no estar en esa lista
2. El fetch de sedes falla silenciosamente para acciones con `hasContract: true` en combinación con la categoría `Inventory`
3. Las sedes se cargan condicionalmente según alguna propiedad de la `ContractAction` que InventorySite no cumple

---

## Acción requerida

1. Identificar la causa raíz
2. Aplicar el fix
3. Verificar que el dropdown de sedes aparece correctamente para `Inventory Site — Add`, `Update` y `Query`
4. Hacer commit y confirmar a ForgeLabs Hub con el hash

---

## Causa raíz confirmada

El workflow `[Tools] LedgerOps — Sedes Config` (ID: `3jWYZGDVU2mHkiPW`) estaba **inactivo** en N8N. Por eso tanto GET como POST a `/webhook/sedes` retornaban 404. No era un problema de método HTTP ni de RIQ — era el workflow apagado.

## Resolución

ForgeLabs Hub activó el workflow directamente vía MCP N8N (`n8n_activate_workflow`). Sin cambios de código. El dropdown de sedes funciona correctamente en todas las entidades.

## Lección aprendida para RIQ

**El testing por API/curl no es suficiente.** Antes de reportar testing completo a ForgeLabs Hub, RIQ debe verificar el flujo desde el **UI del Playground**:

1. Abrir el Playground en el browser
2. Seleccionar la entidad recién implementada
3. Confirmar que el **dropdown de sedes carga** con opciones
4. Confirmar que los **campos del formulario cargan** (contratos dinámicos)
5. Confirmar que el botón **Run ejecuta** y devuelve respuesta visible

En este caso, si RIQ hubiera abierto el Playground antes de reportar, habría detectado el dropdown vacío y activado el workflow antes de entregar. FL no debería detectar bloqueantes de infraestructura que RIQ puede verificar directamente.

Este punto se agrega al checklist de cierre de todos los PROMPTs de testing futuros.

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-13 | Emisión | Sedes no se listan en Playground para acciones InventorySite — bloqueante para E2E usuario |
| 2026-04-13 | Análisis | Causa raíz: GET /webhook/sedes retorna 404 — N8N solo acepta POST |
| 2026-04-13 | Decisión | FL aprueba Opción A — fix en integration.service.ts · método POST |
| 2026-04-13 | Resolución | Causa real: workflow "[Tools] LedgerOps — Sedes Config" (ID: 3jWYZGDVU2mHkiPW) estaba inactivo · activado vía MCP N8N — sin cambios de código |
