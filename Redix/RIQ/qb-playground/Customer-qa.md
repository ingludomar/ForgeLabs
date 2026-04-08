# Customer — Referencia para QA

**Entidad:** `Customer`
**Operaciones:** Add · Mod · Query
**Audiencia:** QA / Tester
**Actualizado:** 2026-04-07

---

## Tabla de smoke tests por sede

| Operación | TEST | RUS | REC | RBR | RMX |
|-----------|------|-----|-----|-----|-----|
| **Query** | ✅ OK | ✅ OK | ✅ OK | ✅ OK | ✅ OK |
| **Add**   | ✅ OK | — | — | — | — |
| **Mod**   | ✅ OK | — | — | — | — |

> Metodología: CRUD completo en TEST · solo Query en producción para confirmar conectividad.

---

## Suite de pruebas

### Query — casos de prueba

| # | Caso | Payload | Resultado esperado |
|---|------|---------|-------------------|
| Q-01 | Query activos con límite | `{ "ActiveStatus": "ActiveOnly", "MaxReturned": "5" }` | Lista de hasta 5 clientes con ListID, EditSequence y datos completos |
| Q-02 | Query por FullName | `{ "FullName": "RDX-CUSTOMER-UP-001" }` | Cliente específico retornado |
| Q-03 | Query por ListID | `{ "ListID": "800002C4-1597179052" }` | Cliente con ese ListID |
| Q-04 | Query producción (conectividad) | `{ "MaxReturned": "1" }` en RUS/REC/RBR/RMX | `success: true` — al menos un cliente |
| Q-05 | Query vacío | `{}` | `MISSING-DATA` — payload no puede estar vacío |
| Q-06 | Query por rango de fechas | `{ "MaxReturned": "10", "FromModifiedDate": "2026-01-01" }` | Clientes modificados desde esa fecha |

### Add — casos de prueba

> **IMPORTANTE:** Ejecutar Add solo en sede TEST.

| # | Caso | Pasos | Resultado esperado |
|---|------|-------|-------------------|
| A-01 | Add completo con Fill Examples | Fill Examples → cambiar Name a uno único → Run | `success: true` + ListID nuevo |
| A-02 | Add mínimo (solo Name) | Solo campo `Name` único | `success: true` o validación de campos adicionales según sede |
| A-03 | Add sin `Name` | Limpiar campo Name → Run | `LB-VALIDATION-MISSING_REQUIRED` — campo: Name |
| A-04 | Add con `Name` duplicado | Repetir el mismo Name del A-01 | `QB-3100` — name already exists |
| A-05 | Add con `SalesTaxCodeRef.ListID` inválido | Usar ListID de otra sede | `QB-3240` — ListID not found |
| A-06 | Add con datos de dirección completos | BillAddress + ShipAddress completas | `success: true` + datos de dirección en respuesta |

### Mod — casos de prueba

> **IMPORTANTE:** Ejecutar Mod solo en sede TEST. Obtener EditSequence fresco antes de cada Mod.

| # | Caso | Pasos | Resultado esperado |
|---|------|-------|-------------------|
| M-01 | Mod correcto | CustomerQuery → copiar EditSequence → Mod con cambio en Notes → Run | `success: true` + EditSequence incrementado |
| M-02 | Mod con EditSequence desactualizado | Repetir M-01 sin actualizar EditSequence | `QB-3200` — object modified |
| M-03 | Mod con ListID inexistente | `ListID: "00000000-0000000000"` | `QB-3240` — object not found |
| M-04 | Mod con Name de otro cliente | Cambiar Name a un nombre de cliente existente | `QB-3170` — cannot merge list elements |
| M-05 | Mod de dirección | Actualizar `BillAddress.Addr1` | `success: true` + nueva dirección en respuesta |
| M-06 | Mod consecutivo | Mod del resultado de M-01 con EditSequence actualizado | `success: true` — confirma actualización del EditSequence |

---

## Checklist de verificación del botón Run

- [ ] El campo `Name` no está vacío (Add)
- [ ] El campo `ListID` no está vacío (Mod)
- [ ] El campo `EditSequence` no está vacío (Mod)
- [ ] El contador de campos requeridos faltantes muestra `0`
- [ ] El contrato se cargó sin indicador de carga activo
- [ ] El botón no está en estado `sending` persistente (azul > 20s = bug)

---

## Flujo de CRUD completo — TEST

1. **Query**: `MaxReturned: "1", ActiveStatus: "ActiveOnly"` → anotar ListID y EditSequence
2. **Add**: Fill Examples → cambiar Name a uno único → Run → anotar ListID del nuevo cliente
3. **Query por ListID**: usar el ListID del Add → confirmar creación y datos
4. **Mod**: CustomerQuery con ListID del Add → copiar EditSequence → modificar Notes → Run
5. **Verificación**: Query por ListID del cliente modificado → confirmar cambio en Notes

---

## Errores esperados vs. inesperados

### Esperados (comportamiento correcto)

| Código | Cuándo ocurre |
|--------|--------------|
| `QB-3100` | Name duplicado en Add |
| `QB-3170` | Name del Mod ya pertenece a otro ListID |
| `QB-3200` | EditSequence desactualizado |
| `LB-VALIDATION-MISSING_REQUIRED` | Faltan campos requeridos |

### Inesperados (requieren investigación)

| Código | Posible causa |
|--------|--------------|
| `MISSING-DATA` | Payload vacío llegó al backend |
| `QB-3240` | ListID inválido o de otra sede |
| `success: false` sin código reconocible | Error en LedgerOps/LedgerBridge — revisar logs N8N |
| Botón stuck azul > 20s | Timeout no se disparó — verificar conexión al backend |

---

## Notas de regresión

- `CurrencyRef` es opcional según Intuit pero requerido por sede TEST. Verificar que el
  `requiredOverlay` dinámico lo marque correctamente al seleccionar TEST.
- El Mod de Customer no requiere reenviar todos los campos del Add — solo `ListID`,
  `EditSequence` y los campos que cambian. Verificar que el formulario no envíe campos vacíos
  que sobreescriban datos existentes.
- `CustomerQuery` acepta `ActiveStatus` como filtro (a diferencia de `SalesOrderQuery` que no
  lo acepta). Verificar en cada release que este filtro no genere `QB-PARSE-ERROR`.
