# PROMPT-RIQ-024 — QB Playground · Purchase Order · Testing + Documentación

**Fecha:** 2026-04-07
**Tipo:** docs
**Estado:** ✅ solved
**Fecha de resolución:** 2026-04-07

## PROMPTs relacionados

- [PROMPT-RIQ-023](PROMPT-RIQ-023-playground-entity-docs-standard.md) — estándar de 6 archivos por entidad QB Playground
- [PROMPT-RIQ-021](PROMPT-RIQ-021-salesorder-playground-docs.md) — mismo patrón, entidad Sales Order

---

## Objetivo

Verificar las operaciones de **Purchase Order** en el QB Playground y generar los **6 archivos de documentación** por rol. El contenido será publicado por LedgerOps en `docs/qb-playground/`.

---

## Paso 1 — Testing

Ejecutar todas las operaciones en el Playground. Metodología: CRUD completo en TEST · solo Query en producción.

| Operación | TEST | RUS | REC | RBR | RMX |
|---|---|---|---|---|---|
| PurchaseOrderQuery | | | | | |
| PurchaseOrderAdd | | | | | |
| PurchaseOrderMod | | | | | |

Reportar resultado (✅ / ❌ + descripción del error si aplica) por cada combinación.

### Notas de testing

- `VendorRef.ListID` es específico de cada sede — obtener con un Query previo o desde Fill Examples
- `ItemRef.ListID` en las líneas también es específico por sede
- Para Mod: ejecutar primero un Query para obtener `TxnID` + `EditSequence` actuales
- `RefNumber` tiene límite de caracteres — verificar si aplica igual que en SalesOrder

---

## Paso 2 — Documentación (6 archivos)

Generar los 6 archivos siguiendo el estándar establecido en PROMPT-RIQ-023:

| Archivo | Audiencia | Contenido |
|---|---|---|
| `PurchaseOrder.md` | Usuario final | Guía de uso — operaciones, campos, Fill Examples, casos de prueba |
| `PurchaseOrder-executive.md` | Mike Habib / Dirección | Valor de negocio — qué permite, por qué importa, impacto operacional |
| `PurchaseOrder-developer.md` | Desarrollador | Payload técnico, campos requeridos vs opcionales, errores, ejemplos JSON |
| `PurchaseOrder-architect.md` | Arquitecto | Flujo UI → backend → LedgerOps → QB Desktop, contratos dinámicos |
| `PurchaseOrder-qa.md` | QA | Tabla de casos de prueba — positivos + negativos — con pasos y resultado esperado |
| `PurchaseOrder-support.md` | Soporte | Errores comunes, causas y soluciones paso a paso |

### Contenido mínimo requerido por archivo

**`PurchaseOrder.md` (guía de usuario)**
- Descripción: qué es una PO en QB Desktop, relación con Bill e ItemReceipt
- Cómo acceder: Configuración → Integraciones → QB Playground → Purchasing
- Estado por sede (tabla de testing)
- PurchaseOrderAdd: campos requeridos (header + líneas `PurchaseOrderLineAdd`) + Fill Examples con datos reales de TEST
- PurchaseOrderMod: campos requeridos + flujo obligatorio Query → Mod para EditSequence
- PurchaseOrderQuery: filtros disponibles + Fill Examples
- Casos de prueba rápidos (tabla)
- Referencia de errores comunes

**`PurchaseOrder-executive.md`**
- Qué es una PO en el contexto del negocio (compromiso de compra con un proveedor)
- Qué permite el Playground: crear, consultar y modificar POs desde Redix
- Valor operacional: verificación de órdenes, testing sin riesgo, auditoría en tiempo real
- Sedes disponibles

**`PurchaseOrder-developer.md`**
- Endpoint backend: `POST /api/integration/qb-playground`
- Routing: `PurchaseOrderAdd` → `/webhook/purchasing/purchase-order/add` (y Mod, Query)
- Payload completo Add con `PurchaseOrderLineAdd`
- Campos requeridos Add vs Mod (tabla)
- Errores técnicos clave con código y causa
- Nota sobre timeouts: frontend 20s · backend 15s

**`PurchaseOrder-architect.md`**
- Flujo completo: formulario Redix → backend RIQ → LedgerOps N8N → LedgerBridge → qbxmlIntegrator → QB Desktop
- Contratos dinámicos: `GET /webhook/contracts?type=PurchaseOrderAdd&sede=TEST`
- Versiones QBXML: v17.0 (TEST/RUS/REC/RBR) · v13.0 (RMX)
- Control de concurrencia EditSequence

**`PurchaseOrder-qa.md`**
- Mínimo 6 casos de prueba:
  - TC-PO-01: Query básico TEST
  - TC-PO-02: Query conectividad en 4 sedes producción
  - TC-PO-03: Add completo TEST (anotar TxnID + EditSequence)
  - TC-PO-04: Query por TxnID TEST
  - TC-PO-05: Mod de PO existente TEST
  - TC-PO-N01: Negativo — VendorRef inválido
  - TC-PO-N02: Negativo — EditSequence desactualizado
  - TC-PO-N03: Negativo — campo requerido faltante
  - TC-PO-N04: Timeout simulado — botón se libera en ≤20s

**`PurchaseOrder-support.md`**
- Errores: QB-3120 (TxnID no encontrado), QB-3200 (EditSequence desactualizado), QB-3240 (ListID inválido), LB-VALIDATION-MISSING_REQUIRED, botón Run bloqueado, MISSING-DATA
- Para cada error: mensaje, causa, solución paso a paso

---

## Fill Examples — referencia

Usar datos reales de sede TEST. Los `ListID` se obtienen ejecutando:
- `VendorQuery` → `VendorRef.ListID`
- `ItemInventoryQuery` → `ItemRef.ListID` para las líneas

---

## Respuesta esperada de RIQ

Entregar a SyncBridge:

1. **Tabla de testing** completa (3 operaciones × 5 sedes)
2. **6 archivos Markdown** completos listos para publicar:
   - `PurchaseOrder.md`
   - `PurchaseOrder-executive.md`
   - `PurchaseOrder-developer.md`
   - `PurchaseOrder-architect.md`
   - `PurchaseOrder-qa.md`
   - `PurchaseOrder-support.md`

SyncBridge generará el PROMPT-LO correspondiente para publicación en LedgerOps.

---

## Checklist de cierre (PROMPT-RIQ-022 + PROMPT-RIQ-023)

Antes de entregar, verificar:

- [ ] `fetch` en `handleSend` incluye `AbortSignal.timeout(20_000)`
- [ ] Bloque `catch` maneja `AbortError` con mensaje descriptivo
- [ ] Bloque `finally` libera estado `sending` incondicionalmente
- [ ] `setRequiredOverlay(new Set())` + `setSending(false)` en `handleActionChange`
- [ ] Fill Examples con datos reales de TEST (VendorRef + ItemRef con ListIDs válidos)
- [ ] Testing manual en todas las sedes confirmado
- [ ] 6 archivos de documentación generados

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-07 | Emisión | PROMPT emitido a RIQ — testing PurchaseOrder en 5 sedes + 6 docs por rol |
| 2026-04-07 | Resolución | Testing completo ✅ · 6 docs entregados · commit RIQ dc0be7a · commit SyncBridge c5f598a · Hallazgo: ExpectedDate requerido por regla de negocio sede TEST |

