# Purchase Order — Referencia para QA

**Entidad:** `PurchaseOrder`
**Operaciones:** Add · Mod · Query
**Audiencia:** QA / Tester
**Actualizado:** 2026-04-07

---

## Resultados de smoke tests — 2026-04-07

| Operación | TEST | RUS | REC | RBR | RMX |
|-----------|------|-----|-----|-----|-----|
| **Query** | ✅ OK | ✅ OK | ✅ OK | ✅ OK | ✅ OK |
| **Add**   | ✅ OK | — | — | — | — |
| **Mod**   | ✅ OK | — | — | — | — |

**Datos del Add en TEST:**
- TxnID: `626C6-1775578032`
- RefNumber: `PO-RIQ-024`
- VendorRef: `800001F1-1597178964` (REDSIS CORP-USD)
- ItemRef: `80000026-1597198891` (#2 CLEAR)

**Datos del Mod en TEST:**
- EditSequence post-Mod: `1775578073`
- TxnLineID: `626C8-1775578032`

---

## Suite de pruebas manuales

### Query — casos de prueba

| # | Caso | Payload | Resultado esperado |
|---|------|---------|-------------------|
| Q-01 | Query sin filtros | `{ "MaxReturned": "5" }` | Lista de hasta 5 POs con header completo y líneas |
| Q-02 | Query por TxnID | `{ "TxnID": "626C6-1775578032" }` | PO específico — sin PurchaseOrderLineRet (comportamiento esperado de QB) |
| Q-03 | Query por rango de fechas | `{ "MaxReturned": "10", "FromModifiedDate": "2026-01-01", "ToModifiedDate": "2026-12-31" }` | POs modificados en 2026 |
| Q-04 | Query por proveedor | `{ "EntityFilter": { "ListID": "800001F1-1597178964" } }` | POs del proveedor REDSIS CORP-USD |
| Q-05 | Query con MaxReturned 1 — producción | `{ "MaxReturned": "1" }` en RUS/REC/RBR/RMX | `success: true` — confirma conectividad |
| Q-06 | Query vacío | `{}` | `MISSING-DATA` o timeout — no es un caso de uso válido |

### Add — casos de prueba

> **IMPORTANTE:** Ejecutar Add solo en sede TEST.

| # | Caso | Comportamiento esperado |
|---|------|------------------------|
| A-01 | Add completo con Fill Examples | `success: true` + TxnID nuevo |
| A-02 | Add sin `VendorRef` | `LB-VALIDATION-MISSING_REQUIRED` — campo: VendorRef |
| A-03 | Add sin `ExpectedDate` | `LB-VALIDATION-MISSING_REQUIRED` — campo: ExpectedDate |
| A-04 | Add sin línea de detalle | `LB-VALIDATION-MISSING_REQUIRED` — campo: PurchaseOrderLineAdd |
| A-05 | Add con `RefNumber` de 12 caracteres | `QB-3070` — string too long |
| A-06 | Add con `RefNumber` duplicado (repetir A-01) | `QB-3100` — duplicate |
| A-07 | Add con `ListID` inválido (ItemRef de otra sede) | `QB-3240` — ListID not found |
| A-08 | Add con `TxnDate` en periodo cerrado | `QB-3171` — accounting period closed |
| A-09 | Add mínimo (solo VendorRef + ExpectedDate + una línea) | `success: true` o validación de campos opcionales faltantes según sede |

### Mod — casos de prueba

> **IMPORTANTE:** Ejecutar Mod solo en sede TEST. Siempre obtener EditSequence fresco antes de Mod.

| # | Caso | Comportamiento esperado |
|---|------|------------------------|
| M-01 | Mod con datos correctos (TxnID y EditSequence frescos) | `success: true` + EditSequence incrementado |
| M-02 | Mod con `EditSequence` desactualizado | `QB-3200` — object modified |
| M-03 | Mod con `TxnID` inexistente | `QB-3120` — transaction not found |
| M-04 | Mod sin `VendorRef` | `LB-VALIDATION-MISSING_REQUIRED` |
| M-05 | Mod sin `ExpectedDate` (sede TEST) | `LB-VALIDATION-MISSING_REQUIRED` |
| M-06 | Mod con `RefNumber` de 12 caracteres | `QB-3070` |
| M-07 | Mod consecutivo (Mod del resultado de M-01) | `success: true` — confirma que EditSequence se actualiza correctamente |

---

## Checklist de verificación del botón Run

Verificar que el botón **Run** esté activo antes de ejecutar cada caso:

- [ ] El campo `VendorRef.ListID` no está vacío
- [ ] El campo `ExpectedDate` no está vacío (para Add/Mod en TEST)
- [ ] El contador de campos requeridos faltantes muestra `0`
- [ ] El contrato se cargó (indicador de carga no activo)
- [ ] El botón no está en estado `sending` (azul persistente = bug)

Si el botón permanece azul después de hacer clic y no cambia en 20 segundos, es el bug de
`sending=true` — verificar que el backend responda en `/api/integration/qb-playground`.

---

## Flujo de prueba de CRUD completo (TEST)

1. **Query**: ejecutar con `MaxReturned: "5"` — anotar un TxnID existente
2. **Add**: usar Fill Examples → Run → anotar TxnID y EditSequence del resultado
3. **Query por TxnID**: usar el TxnID del Add → verificar que retorna el PO (sin líneas)
4. **Mod**: usar TxnID y EditSequence del Add → modificar `Memo` → Run → verificar EditSequence incrementado
5. **Query de verificación**: `MaxReturned: "1", FromModifiedDate: <hoy>` → verificar que el Mod aparece

---

## Errores esperados vs. errores inesperados

### Errores esperados (parte del comportamiento correcto)

| Código | Cuando ocurre | Es un error? |
|--------|--------------|-------------|
| `QB-3070` | RefNumber > 11 chars | No — QB funciona correctamente |
| `QB-3100` | RefNumber duplicado | No — QB funciona correctamente |
| `QB-3200` | EditSequence desactualizado | No — control de concurrencia funcionando |
| `LB-VALIDATION-MISSING_REQUIRED` | Faltan campos requeridos | No — validación funcionando |

### Errores inesperados (requieren investigación)

| Código | Posible causa |
|--------|--------------|
| `QB-PARSE-ERROR` | Campo inválido en el payload (ej. campo que QB no acepta en el filtro) |
| `MISSING-DATA` | Payload vacío llegó al backend — bug en serialización del frontend |
| `QB-3240` | ListID inválido — verificar que sea del mismo archivo QB Desktop |
| `success: false` sin código de error | Error en LedgerOps o LedgerBridge — revisar logs de N8N |
| Botón stuck en azul | `sending=true` no se reseteó — timeout de 20s no se disparó — verificar conexión al backend |

---

## Notas de regresión

- **2026-04-07**: Se detectó que `ExpectedDate` es requerido por la sede TEST (no por Intuit).
  El contrato en `contracts.ts` fue actualizado para incluirlo en Fill Examples con valor dinámico
  (+7 días). Verificar en futuros tests que no desaparezca del formulario.
- **RefNumber generado automáticamente**: Fill Examples genera `PO-XXXXXXXX` basado en
  `Date.now()`. Es único por ejecución pero no garantiza unicidad si se ejecutan dos Add en el
  mismo milisegundo. En pruebas automatizadas, usar un RefNumber explícito.
- **Query por TxnID sin líneas**: comportamiento confirmado como nativo de QB — no es un bug.
  El banner de advertencia en el Playground es el comportamiento esperado.
