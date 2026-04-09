# LedgerOps — Casos de uso por operación CRUD

> Aplica a todas las entidades. Los nombres de campos cambian por entidad,
> el patrón de prueba es el mismo.
>
> Antes de ejecutar cualquier caso: consultar `tests/{module}/{Entity}{Op}-{Sede}.verified.json`

---

## Leyenda

| Símbolo | Significado |
|---|---|
| ✅ | Prueba positiva — se espera éxito |
| ❌ | Prueba negativa — se espera error controlado |
| `code` | Código de error esperado en la respuesta |

---

## C — Add (Crear)

| ID | Caso de uso | Qué se prueba | Resultado esperado |
|---|---|---|---|
| TC-ADD-01 | **Creación exitosa** ✅ | Payload completo con todos los campos requeridos | `success: true` + `ListID` en respuesta |
| TC-ADD-02 | **Regla Intuit** ❌ | Omitir un campo requerido por QuickBooks (ej: `Name`) | `LB-VALIDATION-MISSING_REQUIRED` — source: `intuit` |
| TC-ADD-03 | **Regla sede** ❌ | Omitir un campo requerido por regla de negocio de la sede | `LB-VALIDATION-MISSING_REQUIRED` — source: `sede` |
| TC-ADD-04 | **Ambas reglas** ❌ | Omitir campos de Intuit y de sede simultáneamente | Error listando ambas violaciones |
| TC-ADD-05 | **Nombre duplicado** ❌ | `Name` ya existente en QB para esa sede | QB error — nombre en uso |
| TC-ADD-06 | **Type inválido** ❌ | Enviar `type` que no corresponde al endpoint | `INVALID-ITEM-TYPE` o `INVALID-TYPE` |
| TC-ADD-07 | **Data vacía** ❌ | Enviar `data: {}` o sin campo `data` | `MISSING-DATA` |

> **Guardar** el `ListID` + `EditSequence` del TC-ADD-01 — son el punto de partida para Mod y Delete.

---

## R — Query (Consultar)

| ID | Caso de uso | Qué se prueba | Resultado esperado |
|---|---|---|---|
| TC-QRY-01 | **Query por ListID exitoso** ✅ | `ListID` válido del registro creado en TC-ADD-01 | Registro completo con todos sus campos |
| TC-QRY-02 | **Query lista general** ✅ | Sin filtros específicos — solo `MaxReturned` | Lista de N registros de la sede |
| TC-QRY-03 | **Sin resultados** ✅ | `ListID` inexistente o filtro sin coincidencias | QB retorna `statusCode:500 Warn` → `success: false`, `QB-OPERATION-ERROR` (comportamiento real confirmado 2026-03-14) |
| TC-QRY-04 | **Type inválido** ❌ | `type` que no corresponde al endpoint | `INVALID-TYPE` |

---

## U — Mod (Modificar)

| ID | Caso de uso | Qué se prueba | Resultado esperado |
|---|---|---|---|
| TC-MOD-01 | **Modificación exitosa** ✅ | `ListID` + `EditSequence` válidos + al menos un campo a modificar | `success: true` + datos actualizados |
| TC-MOD-02 | **Regla Intuit** ❌ | Omitir un campo requerido por Intuit en Mod | `LB-VALIDATION-MISSING_REQUIRED` — source: `intuit` |
| TC-MOD-03 | **Regla sede** ❌ | Omitir un campo requerido por regla de negocio de la sede | `LB-VALIDATION-MISSING_REQUIRED` — source: `sede` |
| TC-MOD-04 | **Ambas reglas** ❌ | Omitir campos de Intuit y de sede simultáneamente | Error listando ambas violaciones |
| TC-MOD-05 | **ListID inexistente** ❌ | Usar `ListID` que no existe en QB | QB error — registro no encontrado |
| TC-MOD-06 | **EditSequence desactualizado** ❌ | Usar `EditSequence` de versión anterior (registro fue modificado) | QB error — conflicto de versión |

> **Nota:** Para TC-MOD-02 al TC-MOD-06 usar el `ListID` + `EditSequence` obtenido en TC-ADD-01.
> Después de TC-MOD-01 el `EditSequence` cambia — actualizar en `tests/*.verified.json`.

---

## D — Delete lógico (Desactivar)

> QB Desktop no elimina registros físicamente. El delete es un Mod con `IsActive: false`.

| ID | Caso de uso | Qué se prueba | Resultado esperado |
|---|---|---|---|
| TC-DEL-01 | **Desactivación exitosa** ✅ | Mod con `IsActive: false` + `ListID` + `EditSequence` válidos | `success: true` |
| TC-DEL-02 | **Verificación post-delete** ✅ | Query por `ListID` después de TC-DEL-01 | Registro con `IsActive: "false"` |
| TC-DEL-03 | **ListID inexistente** ❌ | Usar `ListID` inválido en el delete lógico | QB error — registro no encontrado |

---

## Orden de ejecución recomendado

```
TC-ADD-01  →  TC-QRY-01  →  TC-MOD-01  →  TC-DEL-01  →  TC-DEL-02   (casos positivos — flujo completo)
TC-ADD-02  →  TC-ADD-03  →  TC-ADD-04  →  TC-ADD-05  →  TC-ADD-06  →  TC-ADD-07   (validaciones Add)
TC-MOD-02  →  TC-MOD-03  →  TC-MOD-04  →  TC-MOD-05  →  TC-MOD-06   (validaciones Mod)
TC-QRY-02  →  TC-QRY-03  →  TC-QRY-04   (variantes Query)
TC-DEL-03   (validación Delete)
```

---

## Criterio para `requiredBySede` (P1 → P2)

| Criterio | Regla |
|---|---|
| **Muestra mínima** | 20 registros — con menos, el 100% puede ser coincidencia |
| **Umbral de cobertura** | `fieldCoverage = 1.0` (100%) — si no aparece en todos, no es obligatorio para la sede |
| **Fundamento** | Los registros existentes en QB fueron creados con la plantilla de la sede, por lo que su campo de cobertura total refleja fielmente la regla de negocio real |
| **Filtro read-only** | Excluir siempre: `ListID`, `EditSequence`, `TimeCreated`, `TimeModified`, `FullName`, `Sublevel`, `QuantityOnHand`, `AverageCost`, `QuantityOnOrder`, `QuantityOnSalesOrder` |
| **Entidades sin suficientes registros** | Si total < 20, usar todos los disponibles y documentar la limitación en `_meta.knownIssues` del `.verified.json` |

---

## Flujo completo P4 — Testing (resumen)

```
1. Leer tests/{module}/{Entity}{Op}-{Sede}.verified.json
2. Ejecutar TC-ADD-01 → guardar ListID + EditSequence
3. Ejecutar TC-QRY-01, TC-MOD-01, TC-DEL-01, TC-DEL-02  (flujo positivo completo)
4. Ejecutar casos negativos TC-ADD-02 al TC-ADD-07
5. Ejecutar casos negativos TC-MOD-02 al TC-MOD-06
6. Ejecutar variantes TC-QRY-02 al TC-QRY-04
7. Ejecutar TC-DEL-03
8. Actualizar verified.json con lastSuccessfulResponse y successfulRecords
9. Marcar entidad como ✅ en features.md y roadmap.md
```
