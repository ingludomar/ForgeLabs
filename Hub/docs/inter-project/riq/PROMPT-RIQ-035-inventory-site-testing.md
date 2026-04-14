# PROMPT-RIQ-035 — QB Playground · Inventory Site · Testing + 6 docs por rol

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-13 |
| **Proyecto destino** | RIQ |
| **Tipo** | testing + docs |
| **Estado** | ✅ solved |

---

## PROMPTs relacionados

- [PROMPT-RIQ-023](PROMPT-RIQ-023-playground-entity-docs-standard.md) — estándar de 6 archivos por entidad QB Playground
- [PROMPT-RIQ-033](PROMPT-RIQ-033-inventory-site-playground.md) — implementación routing · webhooks · contratos · MOD_QUERY_MAP
- [PROMPT-RIQ-034](PROMPT-RIQ-034-inventory-site-has-contract-fix.md) — fix hasContract Add/Mod → true

---

## Objetivo

Verificar las operaciones de **Inventory Site** en el QB Playground y generar los **6 archivos de documentación** por rol. El contenido será publicado por LedgerOps en `docs/qb-playground/`.

---

## Paso 1 — Verificar routing en qb-endpoints.ts

Confirmar que los 3 tipos están registrados:

| Tipo QB | Webhook LedgerOps |
|---|---|
| `InventorySiteAdd` | `/webhook/inventory/site/add` |
| `InventorySiteMod` | `/webhook/inventory/site/mod` |
| `InventorySiteQuery` | `/webhook/inventory/site/query` |

---

## Paso 2 — Testing en 5 sedes

Metodología: CRUD completo en TEST · solo Query en producción.

| Operación | TEST | RUS | RBR | RMX | REC | RRC | TSI |
|---|---|---|---|---|---|---|---|
| InventorySiteAdd | | — | — | — | — | — | — |
| InventorySiteQuery | | | | | ⏳ bloq. | ⏳ bloq. | ⏳ bloq. |
| InventorySiteMod | | — | — | — | — | — | — |

REC · RRC · TSI bloqueadas por conflicto de red — reportado a Jack · en espera de resolución.

### Payload mínimo funcional para Add

```json
{
  "type": "InventorySiteAdd",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "Name": "RDX-SITE-001",
    "IsActive": "true"
  }
}
```

> **Nota:** `SiteDesc` funciona correctamente — la corrección previa era errónea. El único campo problemático es `MaxReturned` en Query.

### Notas de testing

- `InventorySiteAdd` solo requiere `Name` — campos opcionales adicionales: `IsActive`, `ParentSiteRef`
- Para Mod: ejecutar Query previo para obtener `ListID` + `EditSequence`
- `InventorySiteMod` usa `ListID` (no `TxnID`) — es entidad de lista, no transacción
- Query en sedes productivas puede retornar lista vacía — es resultado válido si la sede no tiene sites configurados
- `SiteDesc` causa QB-PARSE-ERROR — omitir en todos los tests

### Datos de referencia (sede TEST)

- `ListID` site creado en verificación previa: `8000002B-1776113170` (nombre `RDX-SITE-001-MOD`)

---

## Paso 3 — Documentación (6 archivos)

Generar los 6 archivos siguiendo el estándar de PROMPT-RIQ-023:

| Archivo | Audiencia | Contenido |
|---|---|---|
| `InventorySite.md` | Usuario final | Guía de uso — operaciones, campos, Fill Examples, casos de prueba |
| `InventorySite-executive.md` | Mike Habib / Dirección | Valor de negocio — gestión de almacenes desde Redix |
| `InventorySite-developer.md` | Desarrollador | Payload técnico, campos requeridos vs opcionales, errores, ejemplos JSON |
| `InventorySite-architect.md` | Arquitecto | Flujo UI → backend → LedgerOps → QB Desktop, contratos dinámicos |
| `InventorySite-qa.md` | QA | Tabla de casos de prueba — positivos + negativos |
| `InventorySite-support.md` | Soporte | Errores comunes, causas y soluciones |

### Contenido mínimo por archivo

**`InventorySite.md` (guía de usuario)**
- Qué es Inventory Site en QB Desktop — almacenes y ubicaciones de inventario
- Cómo acceder: Configuración → Integraciones → QB Playground → Inventory
- Estado por sede (tabla de testing)
- InventorySiteAdd: campos requeridos + Fill Examples con datos reales de TEST
- InventorySiteMod: flujo obligatorio Query → Mod para EditSequence
- InventorySiteQuery: filtros disponibles (FullName, ListID, MaxReturned, ActiveStatus)
- Nota: `SiteDesc` no es un campo soportado — omitir del payload
- Casos de prueba rápidos (tabla)
- Referencia de errores comunes

**`InventorySite-executive.md`**
- Qué es Inventory Site en el contexto del negocio (almacenes y ubicaciones físicas)
- Qué permite el Playground: crear, consultar y modificar sites desde Redix
- Valor operacional: gestión de almacenes en tiempo real, testing sin riesgo
- Sedes disponibles

**`InventorySite-developer.md`**
- Endpoint: `POST /api/integration/qb-playground`
- Routing: `InventorySiteAdd` → `/webhook/inventory/site/add` (y Mod, Query)
- Payload Add mínimo funcional (Name requerido, SiteDesc no soportado)
- Tabla campos requeridos: requiredByIntuit vs requiredBySede TEST
- Errores: QB-PARSE-ERROR (campo no soportado ej. SiteDesc), QB-3100 (ListID inválido), QB-3120 (EditSequence), LB-VALIDATION-MISSING_REQUIRED
- Nota: `InventorySiteMod` usa `ListID` como identificador (no `TxnID`)
- Timeouts: frontend 20s · backend 15s

**`InventorySite-architect.md`**
- Flujo: Redix → `POST /api/integration/qb-playground` → backend RIQ → LedgerOps N8N → LedgerBridge → qbxmlIntegrator → QB Desktop
- Contratos dinámicos: `GET /webhook/contracts?type=InventorySiteAdd&sede=TEST`
- InventorySiteQuery usa campos estáticos (`hasContract: false`) — no requiere fetch a LO
- Versiones QBXML: v17.0 (TEST/RUS/REC/RBR) · v13.0 (RMX)
- Entidad de lista (ListID) vs entidad de transacción (TxnID) — MOD_QUERY_MAP usa `idField: 'ListID'`

**`InventorySite-qa.md`**
- Mínimo 6 casos de prueba:
  - TC-INV-SITE-01: Query básico TEST (sin filtros)
  - TC-INV-SITE-02: Query conectividad sedes producción (RUS · RBR · RMX)
  - TC-INV-SITE-03: Add completo TEST — Name requerido (anotar ListID + EditSequence)
  - TC-INV-SITE-04: Query por FullName TEST
  - TC-INV-SITE-05: Mod de site existente TEST
  - TC-INV-SITE-N01: Negativo — Add con SiteDesc → QB-PARSE-ERROR
  - TC-INV-SITE-N02: Negativo — Mod con EditSequence desactualizado → QB-3120
  - TC-INV-SITE-N03: Negativo — ListID inválido en Mod → QB-3100
  - TC-INV-SITE-N04: Timeout simulado — botón se libera en ≤20s

**`InventorySite-support.md`**
- Errores: QB-PARSE-ERROR (campo no soportado), QB-3100 (ListID inválido), QB-3120 (EditSequence desactualizado), LB-VALIDATION-MISSING_REQUIRED, botón Run bloqueado
- Para cada error: mensaje, causa, solución paso a paso
- Nota especial: `SiteDesc` no es un campo soportado por QB Desktop — si el usuario lo intenta, recibirá QB-PARSE-ERROR

---

## Fill Examples — referencia

Usar datos reales de sede TEST:
- `InventorySiteQuery` → `ListID` para usar en Mod
- Site de referencia: `8000002B-1776113170` (nombre `RDX-SITE-001-MOD`)

---

## Respuesta esperada de RIQ

Entregar a ForgeLabs Hub:

1. **Tabla de testing** completa (3 operaciones × sedes disponibles) — incluyendo el **payload exacto** usado en cada operación. Sin payload no se puede reproducir ni validar el test.
2. **Campos descartados** — cualquier campo que cause QB-PARSE-ERROR debe listarse explícitamente con el error obtenido, para que FL pueda documentarlo y el usuario no los use en su E2E.
3. **6 archivos Markdown** completos listos para publicar:
   - `InventorySite.md`
   - `InventorySite-executive.md`
   - `InventorySite-developer.md`
   - `InventorySite-architect.md`
   - `InventorySite-qa.md`
   - `InventorySite-support.md`

ForgeLabs Hub generará el PROMPT-LO correspondiente para publicación en LedgerOps.

---

## Checklist de cierre (PROMPT-RIQ-022 + PROMPT-RIQ-023)

Antes de entregar, verificar:

- [ ] Routing `InventorySiteAdd/Mod/Query` presente en `qb-endpoints.ts`
- [ ] `fetch` en `handleSend` incluye `AbortSignal.timeout(20_000)`
- [ ] Bloque `catch` maneja `AbortError` con mensaje descriptivo
- [ ] Bloque `finally` libera estado `sending` incondicionalmente
- [ ] Fill Examples con datos reales de TEST (ListID válido de InventorySiteQuery)
- [ ] Testing manual en todas las sedes disponibles confirmado
- [ ] **Verificación UI obligatoria antes de reportar:** abrir el Playground en el browser, confirmar que (1) el dropdown de sedes carga con opciones, (2) los campos del formulario cargan, (3) el botón Run ejecuta y devuelve respuesta visible
- [ ] 6 archivos de documentación generados

---

## Resultados de testing

| Sede | Add | Query | Mod |
|---|---|---|---|
| TEST | ✅ ListID: 8000002C-1776115152 | ✅ EditSequence: 1776115152 | ✅ RDX-SITE-001-A |
| RBR | — | ✅ | — |
| RMX | — | ✅ | — |
| RUS | — | ❌ QB-3250 — Advanced Inventory no habilitado | — |
| REC | — | ⏳ bloqueada (red) | — |
| RRC | — | ⏳ bloqueada (red) | — |
| TSI | — | ⏳ bloqueada (red) | — |

**RUS — QB-3250:** InventorySite requiere el módulo Advanced Inventory de QuickBooks Enterprise. RUS responde correctamente pero no tiene el módulo habilitado. Decisión: RUS queda fuera del scope de InventorySite.

**Nota Add:** RDX-SITE-001-MOD ya existía en TEST (QB-3170 name collision) — se usó RDX-SITE-001-A. Operación funcional.

**Pendiente:** 6 archivos de documentación por rol.

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-13 | Emisión | Inventory Site QB Playground — testing 5 sedes + 6 docs por rol · incluye hallazgo SiteDesc |
| 2026-04-13 | Testing confirmado | CRUD TEST ✅ · RBR/RMX Query ✅ · RUS QB-3250 (descartado) · REC/RRC/TSI bloqueadas |
| 2026-04-13 | Reporte completo | Payloads exactos + campos descartados entregados · MaxReturned eliminado de inventorySiteQueryFields — commit 24ddac9 · SiteDesc funciona (corrección previa errónea) · 6 docs generados |
