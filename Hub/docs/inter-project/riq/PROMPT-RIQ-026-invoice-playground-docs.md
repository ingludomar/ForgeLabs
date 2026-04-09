# PROMPT-RIQ-026 — QB Playground · Invoice · Testing + 6 docs por rol

**Fecha:** 2026-04-08
**Tipo:** docs
**Estado:** ⏳ pending

## PROMPTs relacionados

- [PROMPT-RIQ-023](PROMPT-RIQ-023-playground-entity-docs-standard.md) — estándar de 6 archivos por entidad QB Playground
- [PROMPT-RIQ-024](PROMPT-RIQ-024-purchaseorder-playground-docs.md) — mismo patrón, entidad Purchase Order
- [PROMPT-LO-009](../ledgerops/PROMPT-009-invoice-delivery.md) — entrega Invoice en LedgerOps (workflows activos)

---

## Objetivo

Verificar las operaciones de **Invoice** en el QB Playground y generar los **6 archivos de documentación** por rol. El contenido será publicado por LedgerOps en `docs/qb-playground/`.

---

## Paso 1 — Verificar routing en qb-endpoints.ts

Confirmar que los 3 tipos están registrados en el routing table:

| Tipo QB | Webhook LedgerOps |
|---|---|
| `InvoiceAdd` | `/webhook/sales/invoice/add` |
| `InvoiceMod` | `/webhook/sales/invoice/mod` |
| `InvoiceQuery` | `/webhook/sales/invoice/query` |

Si alguno no existe, agregarlo antes de continuar con el testing.

---

## Paso 2 — Testing en 5 sedes

Ejecutar todas las operaciones. Metodología: CRUD completo en TEST · solo Query en producción.

| Operación | TEST | RUS | REC | RBR | RMX |
|---|---|---|---|---|---|
| InvoiceQuery | | | | | |
| InvoiceAdd | | | | | |
| InvoiceMod | | | | | |

Reportar resultado (✅ / ❌ + descripción del error si aplica) por cada combinación.

### Notas de testing

- `CustomerRef.ListID` es específico por sede — obtener con CustomerQuery o desde Fill Examples
- `ItemRef.ListID` en `InvoiceLineAdd` es específico por sede
- Para Add: requerido al menos un `InvoiceLineAdd` — usar item de tipo Service o NonInventory para evitar error de stock negativo
- Para Mod: ejecutar Query previo para obtener `TxnID` + `EditSequence`
- `RefNumber` tiene límite de 11 caracteres — QB-3070 si se excede
- `ARAccountRef` debe corresponder a la moneda del Customer — error QB-3140 si hay mismatch
- `InvoiceQuery`: `ActiveStatus` no es filtro válido — usar `RefNumberFilter`, `TxnDateRangeFilter` o `MaxReturned`

### Datos de referencia (sede TEST)

Del testing previo de SyncBridge:
- TxnID de referencia: `62651-1774441034`
- Customer de referencia: Lenovo Mexico USD

---

## Paso 3 — Documentación (6 archivos)

Generar los 6 archivos siguiendo el estándar de PROMPT-RIQ-023:

| Archivo | Audiencia | Contenido |
|---|---|---|
| `Invoice.md` | Usuario final | Guía de uso — operaciones, campos, Fill Examples, casos de prueba |
| `Invoice-executive.md` | Mike Habib / Dirección | Valor de negocio — facturación directa desde Redix |
| `Invoice-developer.md` | Desarrollador | Payload técnico, campos requeridos vs opcionales, errores, ejemplos JSON |
| `Invoice-architect.md` | Arquitecto | Flujo UI → backend → LedgerOps → QB Desktop, contratos dinámicos |
| `Invoice-qa.md` | QA | Tabla de casos de prueba — positivos + negativos |
| `Invoice-support.md` | Soporte | Errores comunes, causas y soluciones |

### Contenido mínimo por archivo

**`Invoice.md` (guía de usuario)**
- Qué es Invoice en QB Desktop — relación con SalesOrder y ReceivePayment
- Cómo acceder: Configuración → Integraciones → QB Playground → Sales
- Estado por sede (tabla de testing)
- InvoiceAdd: campos requeridos + Fill Examples con datos reales de TEST
- InvoiceMod: flujo obligatorio Query → Mod para EditSequence
- InvoiceQuery: filtros disponibles (RefNumberFilter, TxnDateRangeFilter, MaxReturned)
- Casos de prueba rápidos (tabla)
- Referencia de errores comunes

**`Invoice-executive.md`**
- Qué es Invoice en el contexto del negocio (documento formal de cobro al cliente)
- Qué permite el Playground: crear, consultar y modificar facturas desde Redix
- Valor operacional: facturación en tiempo real, auditoría, testing sin riesgo
- Sedes disponibles

**`Invoice-developer.md`**
- Endpoint: `POST /api/integration/qb-playground`
- Routing: `InvoiceAdd` → `/webhook/sales/invoice/add` (y Mod, Query)
- Payload Add con `InvoiceLineAdd`
- Tabla campos requeridos: requiredByIntuit vs requiredBySede TEST
- Errores: QB-3070 (RefNumber > 11 chars), QB-3100 (ListID inválido), QB-3140 (mismatch moneda ARAccountRef), QB-3120 (EditSequence), LB-VALIDATION-MISSING_REQUIRED
- Nota: `InvoiceQuery` no acepta `ActiveStatus` como filtro
- Timeouts: frontend 20s · backend 15s

**`Invoice-architect.md`**
- Flujo: Redix → `POST /api/integration/qb-playground` → backend RIQ → LedgerOps N8N → LedgerBridge → qbxmlIntegrator → QB Desktop
- Contratos dinámicos: `GET /webhook/contracts?type=InvoiceAdd&sede=TEST`
- Versiones QBXML: v17.0 (TEST/RUS/REC/RBR) · v13.0 (RMX)
- Control de concurrencia EditSequence en Mod
- Relación transaccional: SalesOrder → Invoice → ReceivePayment

**`Invoice-qa.md`**
- Mínimo 6 casos de prueba:
  - TC-INV-01: Query básico TEST
  - TC-INV-02: Query conectividad 4 sedes producción
  - TC-INV-03: Add completo TEST (anotar TxnID + EditSequence)
  - TC-INV-04: Query por RefNumberFilter TEST
  - TC-INV-05: Mod de Invoice existente TEST
  - TC-INV-N01: Negativo — CustomerRef inválido → QB-3100
  - TC-INV-N02: Negativo — EditSequence desactualizado → QB-3200
  - TC-INV-N03: Negativo — RefNumber > 11 chars → QB-3070
  - TC-INV-N04: Negativo — ARAccountRef con moneda incorrecta → QB-3140
  - TC-INV-N05: Timeout simulado — botón se libera en ≤20s

**`Invoice-support.md`**
- Errores: QB-3070 (RefNumber largo), QB-3100 (ListID inválido), QB-3120 (TxnID no encontrado), QB-3140 (mismatch moneda), QB-3200 (EditSequence), LB-VALIDATION-MISSING_REQUIRED, botón Run bloqueado
- Para cada error: mensaje, causa, solución paso a paso

---

## Fill Examples — referencia

Usar datos reales de sede TEST. Los ListIDs se obtienen ejecutando:
- `CustomerQuery` → `CustomerRef.ListID`
- `ItemInventoryQuery` / `ItemServiceQuery` → `ItemRef.ListID` para las líneas

---

## Respuesta esperada de RIQ

Entregar a SyncBridge:

1. **Tabla de testing** completa (3 operaciones × 5 sedes)
2. **6 archivos Markdown** completos listos para publicar:
   - `Invoice.md`
   - `Invoice-executive.md`
   - `Invoice-developer.md`
   - `Invoice-architect.md`
   - `Invoice-qa.md`
   - `Invoice-support.md`

SyncBridge generará el PROMPT-LO correspondiente para publicación en LedgerOps.

---

## Checklist de cierre (PROMPT-RIQ-022 + PROMPT-RIQ-023)

Antes de entregar, verificar:

- [ ] Routing `InvoiceAdd/Mod/Query` presente en `qb-endpoints.ts`
- [ ] `fetch` en `handleSend` incluye `AbortSignal.timeout(20_000)`
- [ ] Bloque `catch` maneja `AbortError` con mensaje descriptivo
- [ ] Bloque `finally` libera estado `sending` incondicionalmente
- [ ] Fill Examples con datos reales de TEST (CustomerRef + ItemRef con ListIDs válidos)
- [ ] Testing manual en todas las sedes confirmado
- [ ] 6 archivos de documentación generados

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-08 | Emisión | PROMPT emitido a RIQ — Invoice QB Playground · routing + testing 5 sedes + 6 docs por rol |
