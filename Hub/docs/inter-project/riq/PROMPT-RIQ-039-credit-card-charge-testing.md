# PROMPT-RIQ-039 — QB Playground · CreditCardCharge · Testing + 6 docs por rol

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-14 |
| **Proyecto destino** | RIQ |
| **Tipo** | testing + docs |
| **Estado** | 🔵 pending |

---

## PROMPTs relacionados

- [PROMPT-RIQ-023](PROMPT-RIQ-023-playground-entity-docs-standard.md) — estándar de 6 archivos por entidad QB Playground
- [PROMPT-RIQ-037](PROMPT-RIQ-037-credit-card-charge-playground.md) — implementación routing · webhooks · contratos · MOD_QUERY_MAP

---

## Objetivo

Verificar las operaciones de **CreditCardCharge** en el QB Playground y generar los **6 archivos de documentación** por rol. El contenido será publicado por LedgerOps en `docs/integration/`.

---

## Paso 1 — Verificar routing en qb-endpoints.ts

Confirmar que los 3 tipos están registrados:

| Tipo QB | Webhook LedgerOps |
|---|---|
| `CreditCardChargeAdd` | `/webhook/banking/credit-card-charge/add` |
| `CreditCardChargeMod` | `/webhook/banking/credit-card-charge/mod` |
| `CreditCardChargeQuery` | `/webhook/banking/credit-card-charge/query` |

---

## Paso 2 — Testing en sedes

Metodología: CRUD completo en TEST · solo Query en producción.

| Operación | TEST | RUS | RBR | RMX | REC | RRC | TSI |
|---|---|---|---|---|---|---|---|
| CreditCardChargeAdd | | — | — | — | — | — | — |
| CreditCardChargeQuery | | | | | ⏳ bloq. | ⏳ bloq. | ⏳ bloq. |
| CreditCardChargeMod | | — | — | — | — | — | — |

REC · RRC · TSI bloqueadas por conflicto de red pendiente de resolución.

### Payload mínimo funcional para Add

```json
{
  "type": "CreditCardChargeAdd",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "AccountRef": { "FullName": "<nombre de cuenta de tarjeta de crédito en TEST>" }
  }
}
```

> Consultar en TEST qué cuentas de tipo CreditCard existen antes de ejecutar el Add.

### Notas de testing

- `CreditCardCharge` es una **transacción** — usa `TxnID`, no `ListID`
- Para Mod: ejecutar Query previo para obtener `TxnID` + `EditSequence`
- `CreditCardChargeMod` usa `TxnID` en MOD_QUERY_MAP — confirmar que el botón "Obtener EditSequence" aparece al seleccionar Update
- Add y Mod usan `hasContract: true` — el formulario carga los campos dinámicamente desde LO
- Query puede retornar lista vacía en sedes productivas — es resultado válido

---

## Paso 3 — Documentación (6 archivos)

Generar los 6 archivos siguiendo el estándar de PROMPT-RIQ-023:

| Archivo | Audiencia | Contenido |
|---|---|---|
| `CreditCardCharge.md` | Usuario final | Guía de uso — operaciones, campos, Fill Examples, casos de prueba |
| `CreditCardCharge-executive.md` | Mike Habib / Dirección | Valor de negocio — registro de gastos de tarjeta desde Redix |
| `CreditCardCharge-developer.md` | Desarrollador | Payload técnico, campos requeridos vs opcionales, errores, ejemplos JSON |
| `CreditCardCharge-architect.md` | Arquitecto | Flujo UI → backend → LedgerOps → QB Desktop, contratos dinámicos |
| `CreditCardCharge-qa.md` | QA | Tabla de casos de prueba — positivos + negativos |
| `CreditCardCharge-support.md` | Soporte | Errores comunes, causas y soluciones |

### Contenido mínimo por archivo

**`CreditCardCharge.md` (guía de usuario)**
- Qué es CreditCardCharge en QB Desktop — registro de gastos con tarjeta de crédito
- Cómo acceder: Configuración → Integraciones → QB Playground → Banking
- Estado por sede (tabla de testing)
- CreditCardChargeAdd: campos requeridos + Fill Examples con datos reales de TEST
- CreditCardChargeMod: flujo obligatorio Query → Mod para obtener TxnID + EditSequence
- CreditCardChargeQuery: filtros disponibles (TxnID, RefNumber, fechas, PayeeEntityRef, AccountRef)
- Casos de prueba rápidos (tabla)
- Referencia de errores comunes

**`CreditCardCharge-executive.md`**
- Qué es CreditCardCharge en el contexto del negocio
- Qué permite el Playground: registrar, consultar y modificar cargos de tarjeta desde Redix
- Valor operacional: trazabilidad de gastos corporativos en tiempo real, testing sin riesgo
- Sedes disponibles

**`CreditCardCharge-developer.md`**
- Endpoint: `POST /api/integration/qb-playground`
- Routing: `CreditCardChargeAdd` → `/webhook/banking/credit-card-charge/add` (y Mod, Query)
- Add y Mod: `hasContract: true` — campos cargados dinámicamente desde LO
- Query: `hasContract: false` — campos estáticos definidos en contracts.ts
- Tabla campos requeridos: requiredByIntuit vs requiredBySede TEST
- Errores conocidos: QB-3100 (TxnID inválido), QB-3120 (EditSequence desactualizado), LB-VALIDATION-MISSING_REQUIRED
- `CreditCardChargeMod` usa `TxnID` como identificador
- Timeouts: frontend 20s · backend 15s

**`CreditCardCharge-architect.md`**
- Flujo: Redix → `POST /api/integration/qb-playground` → backend RIQ → LedgerOps N8N → LedgerBridge → qbxmlIntegrator → QB Desktop
- Contratos dinámicos: `GET /webhook/contracts?type=CreditCardChargeAdd&sede=TEST`
- CreditCardChargeQuery usa campos estáticos (`hasContract: false`) — no requiere fetch a LO
- Versiones QBXML: v17.0 (TEST/RUS/REC/RBR) · v13.0 (RMX)
- Entidad de transacción (TxnID) — MOD_QUERY_MAP usa `idField: 'TxnID'`

**`CreditCardCharge-qa.md`**
- Mínimo 6 casos de prueba:
  - TC-CCC-01: Query básico TEST (sin filtros)
  - TC-CCC-02: Query conectividad sedes producción (RUS · RBR · RMX)
  - TC-CCC-03: Add completo TEST — AccountRef requerido (anotar TxnID + EditSequence)
  - TC-CCC-04: Query por TxnID TEST
  - TC-CCC-05: Mod de cargo existente TEST
  - TC-CCC-N01: Negativo — Mod con EditSequence desactualizado → QB-3120
  - TC-CCC-N02: Negativo — TxnID inválido en Mod → QB-3100
  - TC-CCC-N03: Negativo — Add sin AccountRef → LB-VALIDATION-MISSING_REQUIRED
  - TC-CCC-N04: Timeout simulado — botón se libera en ≤20s

**`CreditCardCharge-support.md`**
- Errores: QB-3100 (TxnID inválido), QB-3120 (EditSequence desactualizado), LB-VALIDATION-MISSING_REQUIRED, botón Run bloqueado
- Para cada error: mensaje, causa, solución paso a paso

---

## Respuesta esperada de RIQ

Entregar a FL:

1. **Tabla de testing** completa (3 operaciones × sedes disponibles) — incluyendo el **payload exacto** usado en cada operación. Sin payload no se puede reproducir ni validar el test.
2. **Campos descartados** — cualquier campo que cause error debe listarse explícitamente con el error obtenido.
3. **6 archivos Markdown** completos listos para publicar:
   - `CreditCardCharge.md`
   - `CreditCardCharge-executive.md`
   - `CreditCardCharge-developer.md`
   - `CreditCardCharge-architect.md`
   - `CreditCardCharge-qa.md`
   - `CreditCardCharge-support.md`

---

## Checklist de cierre

Antes de entregar, verificar:

- [ ] Routing `CreditCardChargeAdd/Mod/Query` presente en `qb-endpoints.ts`
- [ ] `fetch` en `handleSend` incluye `AbortSignal.timeout(20_000)`
- [ ] Bloque `catch` maneja `AbortError` con mensaje descriptivo
- [ ] Bloque `finally` libera estado `sending` incondicionalmente
- [ ] Fill Examples con datos reales de TEST (TxnID válido de CreditCardChargeQuery)
- [ ] Testing manual en todas las sedes disponibles confirmado
- [ ] **Verificación UI obligatoria antes de reportar:** abrir el Playground en el browser, confirmar que (1) el dropdown de sedes carga con opciones, (2) los campos del formulario cargan, (3) el botón Run ejecuta y devuelve respuesta visible en pantalla
- [ ] 6 archivos de documentación generados

---

## Resultados de testing

| Sede | Add | Query | Mod |
|---|---|---|---|
| TEST | ✅ TxnID: 62656-1776183522 · EditSequence: 1776183522 | ✅ Retorna registro con Memo: RDX-CC-TEST-001 | ✅ EditSequence: 1776183540 |
| RUS | — | ✅ items: 1 | — |
| RBR | — | ✅ items: 1 | — |
| RMX | — | ✅ items: 1 | — |
| REC | — | ⏳ bloqueada (red) | — |
| RRC | — | ⏳ bloqueada (red) | — |
| TSI | — | ⏳ bloqueada (red) | — |

### Payload Add funcional (TEST)
```json
{
  "AccountRef": "800000FF-1601048998",
  "PayeeEntityRef": "8000032A-1607638179",
  "TxnDate": "2026-04-14",
  "ExchangeRate": 1,
  "ItemLineAdd": { "ItemRef": "80000026-1597198891", "Qty": 1, "Amount": 100.00 }
}
```

### Hallazgo — ExchangeRate requerido por sede TEST
`ExchangeRate` es requerido por regla de negocio en sede TEST (source: "sede"). No es requerido por Intuit.
**Acción pendiente:** incluir en Fill Examples del contrato dinámico de LO para CreditCardChargeAdd — ver PROMPT-LO a emitir.

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-14 | Emisión | CreditCardCharge QB Playground — testing sedes + 6 docs por rol |
| 2026-04-14 | Testing confirmado | CRUD TEST ✅ · RUS/RBR/RMX Query ✅ · REC/RRC/TSI bloqueadas (red) · Hallazgo: ExchangeRate requerido por sede TEST |
