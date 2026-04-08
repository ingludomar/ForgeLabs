# ItemInventory — Referencia para QA

**Entidad:** `ItemInventory`
**Operaciones:** Add · Mod · Query
**Audiencia:** QA / Tester
**Actualizado:** 2026-04-07

---

## Tabla de smoke tests por sede

| Operación | TEST | RUS | REC | RBR | RMX |
|-----------|------|-----|-----|-----|-----|
| **Query** | ✅ OK | ✅ OK | ✅ OK (569 ítems) | ✅ OK | ✅ OK |
| **Add**   | ✅ OK | — | — | — | — |
| **Mod**   | ✅ OK | — | — | — | — |

> Metodología: CRUD completo en TEST · solo Query en producción.
> REC tiene 569 artículos activos — usar siempre `MaxReturned` para evitar timeout (>25s sin filtro).

**Datos de referencia TEST:**
- `IncomeAccountRef.ListID`: `80000078-1597178857`
- `COGSAccountRef.ListID`: `8000007C-1597178857`
- `AssetAccountRef.ListID`: `80000034-1597178856`
- Ítem de referencia: `80000026-1597198891` (#2 CLEAR)

---

## Suite de pruebas

### Query — casos de prueba

| # | Caso | Payload | Resultado esperado |
|---|------|---------|-------------------|
| Q-01 | Query activos con límite | `{ "ActiveStatus": "ActiveOnly", "MaxReturned": "5" }` | Lista de hasta 5 ítems con ListID, EditSequence y AccountRefs |
| Q-02 | Query por nombre (prefix) | `{ "NameFilter": { "MatchCriterion": "StartsWith", "Name": "RDX-" }, "ActiveStatus": "All" }` | Ítems que empiezan con "RDX-" |
| Q-03 | Query por ListID específico | `{ "ListIDList": { "ListID": ["80000026-1597198891"] } }` | Ítem #2 CLEAR con todos sus datos |
| Q-04 | Query producción — REC con límite | `{ "ActiveStatus": "ActiveOnly", "MaxReturned": "10" }` en REC | `success: true` — 10 ítems, sin timeout |
| Q-05 | Query vacío | `{}` | `MISSING-DATA` — comportamiento esperado |
| Q-06 | Query inactivos | `{ "ActiveStatus": "InactiveOnly", "MaxReturned": "5" }` | Lista de ítems inactivos |

### Add — casos de prueba

> **IMPORTANTE:** Ejecutar Add solo en sede TEST.

| # | Caso | Pasos | Resultado esperado |
|---|------|-------|-------------------|
| A-01 | Add completo con Fill Examples | Fill Examples → cambiar Name a uno único → Run | `success: true` + ListID nuevo |
| A-02 | Add sin `Name` | Limpiar campo Name → Run | `LB-VALIDATION-MISSING_REQUIRED` — campo: Name |
| A-03 | Add sin `IncomeAccountRef` | Omitir IncomeAccountRef → Run | `LB-VALIDATION-MISSING_REQUIRED` o QB rechaza |
| A-04 | Add sin `SalesDesc` (requerido por TEST) | Omitir SalesDesc → Run | `LB-VALIDATION-MISSING_REQUIRED` — campo: SalesDesc |
| A-05 | Add con `Name` duplicado | Repetir el mismo Name del A-01 | `QB-3100` — name already exists |
| A-06 | Add con `IncomeAccountRef.ListID` de otra sede | Usar ListID inválido | `QB-3240` — ListID not found |
| A-07 | Add con cuenta contable de tipo incorrecto | Usar un ListID de cuenta Expense como IncomeAccountRef | `QB-3170` — account type mismatch |
| A-08 | Add con `QuantityOnHand` sin `InventoryDate` | Incluir QuantityOnHand pero omitir InventoryDate | Error de validación QB — InventoryDate requerido cuando QuantityOnHand > 0 |

### Mod — casos de prueba

> **IMPORTANTE:** Ejecutar Mod solo en sede TEST. Obtener EditSequence fresco antes de cada Mod.

| # | Caso | Pasos | Resultado esperado |
|---|------|-------|-------------------|
| M-01 | Mod correcto | ItemInventoryQuery → copiar ListID y EditSequence → Mod con SalesPrice nuevo → Run | `success: true` + EditSequence incrementado |
| M-02 | Mod con EditSequence desactualizado | Repetir M-01 sin actualizar EditSequence | `QB-3200` — object modified |
| M-03 | Mod con ListID inexistente | `ListID: "00000000-0000000000"` | `QB-3240` — object not found |
| M-04 | Mod con Name duplicado | Cambiar Name a uno de otro ítem existente | `QB-3100` — name already exists |
| M-05 | Mod sin SalesDesc (requerido por TEST) | Omitir SalesDesc → Run | `LB-VALIDATION-MISSING_REQUIRED` |
| M-06 | Mod consecutivo | Mod del resultado de M-01 con EditSequence actualizado | `success: true` |

---

## Checklist de verificación del botón Run

- [ ] El campo `Name` no está vacío (Add/Mod)
- [ ] Los tres `AccountRef.ListID` no están vacíos (Add)
- [ ] `SalesDesc`, `PurchaseDesc`, `SalesPrice`, `Max` no están vacíos (Add en TEST)
- [ ] `ListID` y `EditSequence` no están vacíos (Mod)
- [ ] El contador de campos requeridos muestra `0`
- [ ] El contrato se cargó sin spinner activo
- [ ] El botón no está en estado `sending` persistente

---

## Flujo de CRUD completo — TEST

1. **Query**: `ActiveStatus: "ActiveOnly", MaxReturned: "3"` → anotar un ListID y EditSequence
2. **Add**: Fill Examples → Name único (ej. `RDX-QA-YYYY-MM-DD`) → Run → anotar ListID
3. **Query por NameFilter**: verificar que el ítem creado aparece
4. **Mod**: ItemInventoryQuery por ListID del Add → copiar EditSequence → cambiar SalesPrice → Run
5. **Verificación**: Query por ListID → confirmar SalesPrice actualizado

---

## Errores esperados vs. inesperados

### Esperados (comportamiento correcto)

| Código | Cuándo ocurre |
|--------|--------------|
| `QB-3100` | Name duplicado — QB funciona correctamente |
| `QB-3170` | Tipo de cuenta incorrecto — QB valida correctamente |
| `QB-3200` | EditSequence desactualizado — control de concurrencia activo |
| `LB-VALIDATION-MISSING_REQUIRED` | Faltan campos requeridos — validación activa |
| `MISSING-DATA` | Query sin filtros — validación activa |

### Inesperados (requieren investigación)

| Código | Posible causa |
|--------|--------------|
| `INTERNAL_ERROR — timeout` | Inventario grande sin `MaxReturned` — agregar filtro |
| `QB-3240` | ListID inválido o de otra sede |
| `success: false` sin código reconocible | Error en LedgerOps/LedgerBridge |
| Botón stuck azul > 20s | Timeout no se disparó |

---

## Notas de regresión

- `ItemInventoryQuery` es la única entidad del Playground que retorna `MISSING-DATA` con payload
  vacío. `SalesOrderQuery` y `PurchaseOrderQuery` aceptan payload mínimo con solo `MaxReturned`.
  Verificar en cada release que este comportamiento no cambie.
- `QuantityOnHand` solo puede enviarse en `Add`, no en `Mod`. En Mod, la cantidad se actualiza
  por el módulo de recepciones de inventario. Verificar que el formulario de Mod no exponga este campo.
- Los ListIDs de cuentas contables (`*AccountRef`) deben verificarse por sede en cada test —
  no asumir que los de TEST son válidos en otras sedes.
