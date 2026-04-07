# Vendor — Referencia para QA

**Entidad:** `Vendor`
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
| Q-01 | Query activos con límite | `{ "ActiveStatus": "ActiveOnly", "MaxReturned": "5" }` | Lista de hasta 5 vendors activos con ListID y EditSequence |
| Q-02 | Query por FullName | `{ "FullName": "REDSIS CORP-USD" }` | Vendor específico retornado |
| Q-03 | Query por ListID | `{ "ListID": "800001F1-1597178964" }` | Vendor con ese ListID |
| Q-04 | Query producción (conectividad) | `{ "MaxReturned": "1" }` en RUS/REC/RBR/RMX | `success: true` — al menos un vendor |
| Q-05 | Query vacío | `{}` | `MISSING-DATA` — payload no puede estar vacío |
| Q-06 | Query inactivos | `{ "ActiveStatus": "InactiveOnly", "MaxReturned": "5" }` | Lista de vendors inactivos (puede estar vacía) |

### Add — casos de prueba

> **IMPORTANTE:** Ejecutar Add solo en sede TEST.

| # | Caso | Pasos | Resultado esperado |
|---|------|-------|-------------------|
| A-01 | Add completo con Fill Examples | Fill Examples → completar Name único → Run | `success: true` + ListID nuevo |
| A-02 | Add sin `Name` | Limpiar campo Name → Run | `LB-VALIDATION-MISSING_REQUIRED` — campo: Name |
| A-03 | Add sin `IsActive` | Omitir IsActive → Run | `LB-VALIDATION-MISSING_REQUIRED` o QB lo rechaza |
| A-04 | Add con `Name` duplicado | Repetir el mismo Name del A-01 | `QB-3100` — name already exists |
| A-05 | Add con `CurrencyRef.ListID` inválido | Usar ListID de otra sede | `QB-3240` — ListID not found |
| A-06 | Add mínimo (solo Name + IsActive) | Solo esos dos campos | `success: true` o validación de campos opcionales según sede |

### Mod — casos de prueba

> **IMPORTANTE:** Ejecutar Mod solo en sede TEST. Obtener EditSequence fresco antes de cada Mod.

| # | Caso | Pasos | Resultado esperado |
|---|------|-------|-------------------|
| M-01 | Mod correcto | VendorQuery → copiar EditSequence → Mod con cambio en Notes → Run | `success: true` + EditSequence incrementado |
| M-02 | Mod con EditSequence desactualizado | Repetir M-01 sin actualizar EditSequence | `QB-3200` — object modified |
| M-03 | Mod con ListID inexistente | `ListID: "00000000-0000000000"` | `QB-3240` — object not found |
| M-04 | Mod con Name que pertenece a otro vendor | Cambiar Name a un nombre de vendor existente | `QB-3170` — cannot merge list elements |
| M-05 | Mod sin Name | Omitir campo Name | `LB-VALIDATION-MISSING_REQUIRED` |
| M-06 | Mod consecutivo | Mod del resultado de M-01 con EditSequence actualizado | `success: true` — confirma que EditSequence se actualiza |

---

## Checklist de verificación del botón Run

- [ ] El campo `Name` no está vacío (para Add/Mod)
- [ ] El campo `ListID` no está vacío (para Mod)
- [ ] El campo `EditSequence` no está vacío (para Mod)
- [ ] El contador de campos requeridos faltantes muestra `0`
- [ ] El contrato se cargó (sin indicador de carga activo)
- [ ] El botón no está en estado `sending` persistente (azul → bug, esperar 20s o cambiar entidad)

---

## Flujo de CRUD completo — TEST

1. **Query**: `MaxReturned: "1", ActiveStatus: "ActiveOnly"` → anotar un ListID y EditSequence
2. **Add**: Fill Examples → Name único → Run → anotar ListID del nuevo vendor
3. **Query por ListID**: usar el ListID del Add → confirmar creación
4. **Mod**: VendorQuery con ListID → copiar EditSequence → modificar Notes → Run → verificar EditSequence incrementado
5. **Verificación**: Query por ListID del vendor modificado → confirmar cambio en Notes

---

## Errores esperados vs. inesperados

### Esperados (comportamiento correcto del sistema)

| Código | Cuándo ocurre |
|--------|--------------|
| `QB-3100` | Name duplicado en Add — QB funciona correctamente |
| `QB-3170` | Name del Mod ya pertenece a otro ListID — QB funciona correctamente |
| `QB-3200` | EditSequence desactualizado — control de concurrencia funcionando |
| `LB-VALIDATION-MISSING_REQUIRED` | Faltan campos requeridos — validación funcionando |

### Inesperados (requieren investigación)

| Código | Posible causa |
|--------|--------------|
| `MISSING-DATA` | Payload vacío llegó al backend — bug en serialización |
| `QB-3240` | ListID inválido o de otra sede |
| `success: false` sin código reconocible | Error en LedgerOps o LedgerBridge — revisar logs N8N |
| Botón stuck azul > 20s | Timeout no se disparó — verificar conexión al backend |

---

## Nota de regresión

- `IsActive` debe enviarse como string `"true"`, no booleano `true`. QB y LedgerBridge son
  sensibles a este tipo — verificar en cada release que el formulario no cambie el tipo.
- `CurrencyRef` es opcional según Intuit pero requerido por la sede TEST. Verificar que el
  requiredOverlay dinámico lo marque correctamente al seleccionar TEST.
