# PROMPT-RIQ-025 — QB Playground · Backfill 5 docs por rol · Vendor · Customer · ItemInventory

**Fecha:** 2026-04-07
**Tipo:** docs
**Estado:** ⏳ pending

## PROMPTs relacionados

- [PROMPT-RIQ-023](PROMPT-RIQ-023-playground-entity-docs-standard.md) — estándar de 6 archivos por entidad QB Playground
- [PROMPT-RIQ-011](PROMPT-RIQ-011-vendor-playground-docs.md) — documentación Vendor (user guide)
- [PROMPT-RIQ-013](PROMPT-RIQ-013-customer-playground-docs.md) — documentación Customer (user guide)
- [PROMPT-RIQ-018](PROMPT-RIQ-018-item-inventory-playground-docs.md) — documentación ItemInventory (user guide)

---

## Contexto

Las entidades Vendor, Customer e ItemInventory tienen el user guide publicado en LedgerOps pero les faltan los **5 docs por rol** que establece PROMPT-RIQ-023. Este PROMPT cubre el backfill completo de las 3 entidades en paralelo.

El user guide (archivo base) **ya existe** para cada una — no regenerar:
- `docs/qb-playground/Vendor.md` (LO commit: PROMPT-LO-019)
- `docs/qb-playground/Customer.md` (LO commit: PROMPT-LO-020)
- `docs/qb-playground/ItemInventory.md` (LO commit: PROMPT-LO-022)

---

## Archivos a generar — 15 en total

### Vendor (5 archivos)

| Archivo | Audiencia |
|---|---|
| `Vendor-executive.md` | Mike Habib / Dirección |
| `Vendor-developer.md` | Desarrollador |
| `Vendor-architect.md` | Arquitecto |
| `Vendor-qa.md` | QA |
| `Vendor-support.md` | Soporte |

### Customer (5 archivos)

| Archivo | Audiencia |
|---|---|
| `Customer-executive.md` | Mike Habib / Dirección |
| `Customer-developer.md` | Desarrollador |
| `Customer-architect.md` | Arquitecto |
| `Customer-qa.md` | QA |
| `Customer-support.md` | Soporte |

### ItemInventory (5 archivos)

| Archivo | Audiencia |
|---|---|
| `ItemInventory-executive.md` | Mike Habib / Dirección |
| `ItemInventory-developer.md` | Desarrollador |
| `ItemInventory-architect.md` | Arquitecto |
| `ItemInventory-qa.md` | QA |
| `ItemInventory-support.md` | Soporte |

---

## Referencia de estructura por doc (aplica a las 3 entidades)

Seguir exactamente el mismo formato que `SalesOrder-*.md` y `PurchaseOrder-*.md` ya entregados. Adaptar contenido específico de cada entidad.

**`{Entidad}-executive.md`**
- Qué es la entidad en el contexto del negocio
- Qué permite el Playground (Add · Mod · Query desde Redix sin acceso a QB)
- Valor operacional: verificación, auditoría en tiempo real, testing sin riesgo
- Sedes disponibles: TEST · RUS · REC · RBR · RMX

**`{Entidad}-developer.md`**
- Endpoint: `POST /api/integration/qb-playground`
- Routing de cada operación hacia LedgerOps (webhook path)
- Payload Add completo con campos requeridos por Intuit vs requeridos por sede TEST
- Tabla: campo · tipo · requiredByIntuit · requiredBySede TEST
- Errores técnicos con código y causa
- Nota timeouts: frontend 20s · backend 15s
- Fill Examples con ListIDs reales de TEST

**`{Entidad}-architect.md`**
- Flujo completo: formulario Redix → `POST /api/integration/qb-playground` → backend RIQ → LedgerOps N8N → LedgerBridge → qbxmlIntegrator → QB Desktop
- Contratos dinámicos: `GET /webhook/contracts?type={Entidad}Add&sede=TEST`
- Versiones QBXML: v17.0 (TEST/RUS/REC/RBR) · v13.0 (RMX)
- Control de concurrencia EditSequence (para Mod)

**`{Entidad}-qa.md`**
- Mínimo 6 casos de prueba (positivos + negativos) con pasos y resultado esperado
- Incluir: Query básico · Add completo · Mod (con EditSequence) · Negativo ListID inválido · Negativo campo requerido faltante · Timeout simulado
- Tabla de smoke test por sede (Query en producción)

**`{Entidad}-support.md`**
- Errores comunes con mensaje, causa y solución paso a paso
- Incluir mínimo: QB-3100 (ListID inválido), QB-3120 (TxnID/ListID no encontrado), QB-3200 (EditSequence desactualizado), LB-VALIDATION-MISSING_REQUIRED, botón Run bloqueado

---

## Notas específicas por entidad

### Vendor
- `CurrencyRef.ListID` específico por sede — obtener con CurrencyQuery
- `TermsRef.ListID` específico por sede
- Error QB-3170: Name duplicado al hacer Add
- Para Mod: query previo para obtener `ListID` + `EditSequence`
- Testing referencia: PROMPT-RIQ-011

### Customer
- `SalesTaxCodeRef.ListID` específico por sede
- `CustomerTypeRef.ListID` específico por sede
- Error QB-3170: Name ya existe en QB Desktop — usar nombres únicos
- `BillAddress` y `ShipAddress` son opcionales pero comunes en producción
- Testing referencia: PROMPT-RIQ-013

### ItemInventory
- `IncomeAccountRef.ListID`, `AssetAccountRef.ListID`, `COGSAccountRef.ListID` — todos específicos por sede
- `Name` debe ser único en QB — duplicados generan error
- Para Mod: `ListID` + `EditSequence` obtenidos con Query previo
- No confundir `ItemInventory` con `ItemNonInventory` o `ItemService`
- Testing referencia: PROMPT-RIQ-018

---

## Respuesta esperada de RIQ

Entregar a SyncBridge los **15 archivos Markdown completos**, agrupados por entidad:

**Vendor (5):**
1. `Vendor-executive.md`
2. `Vendor-developer.md`
3. `Vendor-architect.md`
4. `Vendor-qa.md`
5. `Vendor-support.md`

**Customer (5):**
6. `Customer-executive.md`
7. `Customer-developer.md`
8. `Customer-architect.md`
9. `Customer-qa.md`
10. `Customer-support.md`

**ItemInventory (5):**
11. `ItemInventory-executive.md`
12. `ItemInventory-developer.md`
13. `ItemInventory-architect.md`
14. `ItemInventory-qa.md`
15. `ItemInventory-support.md`

SyncBridge generará 3 PROMPTs a LedgerOps para publicar cada grupo.

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-07 | Emisión | PROMPT emitido — backfill 5 docs por rol para Vendor · Customer · ItemInventory en paralelo |
