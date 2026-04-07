# Sales Order — Plan de Pruebas QA

**Entidad:** `SalesOrder`
**Audiencia:** QA
**Actualizado:** 2026-04-07

---

## Metodología

| Tipo de prueba | Sedes aplicables | Regla |
|----------------|-----------------|-------|
| CRUD completo (Add + Mod + Query) | **TEST únicamente** | Nunca ejecutar Add/Mod en producción desde el Playground |
| Query (solo lectura) | TEST · RUS · REC · RBR · RMX | Usado para verificar conectividad y obtener ListIDs/TxnIDs reales |

> **Regla de oro:** Add y Mod solo en TEST. Query para verificar conectividad en producción.

---

## Resultados smoke tests — 2026-04-06

| Operación | Sede | Resultado |
|-----------|------|-----------|
| SalesOrderQuery | TEST | ✅ OK |
| SalesOrderQuery | RUS | ✅ OK |
| SalesOrderQuery | REC | ✅ OK |
| SalesOrderQuery | RBR | ✅ OK |
| SalesOrderQuery | RMX | ✅ OK |
| SalesOrderAdd | TEST | ✅ OK — TxnID: `626B8-1775501397` |
| SalesOrderMod | TEST | ✅ OK |

---

## Tabla de casos de prueba

| TC | Operación | Sede | Pasos | Input | Resultado esperado |
|----|-----------|------|-------|-------|--------------------|
| **TC-01** | SalesOrderQuery | TEST | 1. Seleccionar Query<br>2. Seleccionar sede TEST<br>3. Clic en Fill Examples<br>4. Clic en Run | `MaxReturned: "1"` | `success: true` + `SalesOrderRet` con `TxnID` y `EditSequence` |
| **TC-02** | SalesOrderQuery | RUS · REC · RBR · RMX | 1. Seleccionar Query<br>2. Seleccionar cada sede de producción<br>3. Clic en Fill Examples<br>4. Clic en Run | `MaxReturned: "1"` | `success: true` — conectividad confirmada por cada sede |
| **TC-03** | SalesOrderAdd | TEST | 1. Seleccionar Add<br>2. Seleccionar sede TEST<br>3. Clic en Fill Examples<br>4. Verificar todos los campos requeridos<br>5. Clic en Run | Payload completo con ListIDs válidos de TEST + línea con `ItemRef.ListID: 80000026-1597198891` | `success: true` + nuevo `TxnID` en `SalesOrderRet` |
| **TC-04** | SalesOrderMod | TEST | 1. Ejecutar Query con `TxnID: 626B8-1775501397`<br>2. Seleccionar Mod<br>3. Ingresar `TxnID`<br>4. Clic en "Obtener EditSequence"<br>5. Modificar campo `Memo`<br>6. Clic en Run | `TxnID: 626B8-1775501397`, `Memo: "Actualizado QA test"` | `success: true` + `EditSequence` actualizado en respuesta |
| **TC-05** | Negativo — QB-3070 | TEST | 1. Seleccionar Add<br>2. Completar campos con Fill Examples<br>3. Cambiar `RefNumber` a más de 11 caracteres<br>4. Clic en Run | `RefNumber: "TOOLONGREFNUMBER"` | Error `QB-3070` — string too long |
| **TC-06** | Negativo — QB-3200 | TEST | 1. Seleccionar Mod<br>2. Ingresar `TxnID` válido<br>3. Ingresar `EditSequence` desactualizado (ej. valor anterior al último Mod)<br>4. Clic en Run | `EditSequence` intencionalmente obsoleto | Error `QB-3200` — object modified |
| **TC-07** | Negativo — MISSING_REQUIRED | TEST | 1. Seleccionar Add<br>2. Completar campos pero omitir `CustomerRef`<br>3. Clic en Run | Payload sin `CustomerRef` | Error `LB-VALIDATION-MISSING_REQUIRED` con `details.details[]` indicando el campo faltante |
| **TC-08** | Negativo — timeout | TEST | 1. Verificar que el agente QB esté inactivo (o simular con sede incorrecta)<br>2. Seleccionar Add<br>3. Completar con Fill Examples<br>4. Clic en Run<br>5. Observar el botón | Cualquier payload válido | El botón Run se libera automáticamente después de ≤ 20 segundos y muestra error de timeout |
| **TC-09** | Negativo — QB-PARSE-ERROR | TEST | 1. Seleccionar Query<br>2. Agregar manualmente campo `ActiveStatus: "ActiveOnly"` al payload<br>3. Clic en Run | `ActiveStatus: "ActiveOnly"` en el payload de Query | Error `QB-PARSE-ERROR` — `ActiveStatus` no es un filtro válido para `SalesOrderQuery` |

---

## Criterios de aceptación por caso

### TC-01 — Query básico en TEST
- `success === true`
- `data.SalesOrderRet` presente (objeto o array)
- `TxnID` con formato `XXXXX-XXXXXXXXXX`
- `EditSequence` presente como string numérico
- Tiempo de respuesta < 15 s

### TC-02 — Conectividad multi-sede
- `success === true` en las 4 sedes de producción
- No se requiere contenido específico — confirmar que el canal está activo

### TC-03 — Add exitoso
- `success === true`
- `data.SalesOrderRet.TxnID` presente y no vacío
- `data.SalesOrderRet.RefNumber` coincide con el enviado
- `data.SalesOrderRet.EditSequence` presente

### TC-04 — Mod exitoso
- `success === true`
- `data.SalesOrderRet.EditSequence` es diferente al valor usado en el Mod (QB lo incrementa)
- `data.SalesOrderRet.Memo` contiene el valor modificado

### TC-05 a TC-09 — Casos negativos
- `success === false`
- `error.code` coincide con el código esperado en cada caso
- Para TC-07: `error.details.details` es un array con al menos un elemento describiendo el campo faltante

---

## Datos de referencia para pruebas en TEST

| Campo | Valor de referencia |
|-------|-------------------|
| `CustomerRef.ListID` | `800002C4-1597179052` |
| `TemplateRef.ListID` | `80000011-1597182524` |
| `ItemSalesTaxRef.ListID` | `80000001-1597179051` |
| `CustomerSalesTaxCodeRef.ListID` | `80000001-1597174715` |
| `ItemRef.ListID` (línea) | `80000026-1597198891` |
| `TermsRef.ListID` | `80000007-1597174729` |
| `SalesRepRef.ListID` | `80000007-1630168297` |
| `TxnID` de referencia (smoke test) | `626B8-1775501397` |
| `EditSequence` de referencia (base) | `1775501419` |

> Los valores de `TxnID` y `EditSequence` pueden cambiar con cada Mod. Usar siempre "Obtener EditSequence" antes de un Mod en pruebas.

---

## Notas para el equipo QA

1. **Orden de ejecución recomendado:** TC-01 → TC-02 → TC-03 → TC-04 → TC-05 → TC-06 → TC-07 → TC-08 → TC-09
2. **TC-04 depende de TC-03:** el `TxnID` para el Mod puede obtenerse del Add anterior o del valor de referencia del smoke test.
3. **TC-06:** para obtener un `EditSequence` desactualizado, ejecutar un Mod exitoso (TC-04) y luego intentar un segundo Mod con el `EditSequence` del primer intento.
4. **TC-08:** si no es posible desactivar el agente QB, documentar como "no ejecutable en entorno actual" y marcar como pendiente.
5. **Producción (TC-02):** solo Query. Si alguna sede retorna `success: false` con un error de conexión, reportar inmediatamente — indica que el agente QB de esa sede no está activo.
