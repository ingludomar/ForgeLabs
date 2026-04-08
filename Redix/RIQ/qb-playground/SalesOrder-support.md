# Sales Order — Guía de Soporte

**Entidad:** `SalesOrder` (Orden de Venta)
**Audiencia:** Soporte técnico y operativo
**Actualizado:** 2026-04-07

---

## Regla fundamental

> Las sedes de producción (**RUS · REC · RBR · RMX**) son de **solo lectura** desde el Playground.
> En producción únicamente se puede ejecutar **Query**. Nunca Add ni Mod.
> Para operaciones de escritura (Add / Mod) usar exclusivamente la sede **TEST**.

---

## Tabla de errores comunes

| Código | Causa | Solución |
|--------|-------|----------|
| `QB-3070` | `RefNumber` supera el límite de 11 caracteres | Acortar el `RefNumber` a máximo 11 caracteres. El botón **Fill Examples** genera automáticamente un `RefNumber` válido basado en timestamp |
| `QB-3100` | `RefNumber` duplicado — ya existe una orden con ese número en la compañía QB | Usar un `RefNumber` diferente. **Fill Examples** genera uno único basado en timestamp para evitar este error |
| `QB-3120` | `TxnID` no encontrado en la compañía QB de esa sede | Verificar que el `TxnID` exista ejecutando un `SalesOrderQuery` en la misma sede. Un `TxnID` de TEST no es válido en RUS |
| `QB-3200` | `EditSequence` desactualizado — otra modificación ocurrió desde la última consulta | Hacer clic en **"Obtener EditSequence"** en el formulario de Mod para obtener el valor actual fresco antes de reenviar |
| `QB-3240` | `ListID` no encontrado en la compañía QB de esa sede | Los `ListID` son específicos por compañía. Ejecutar un `SalesOrderQuery` o `ItemInventoryQuery` en la sede destino para obtener los `ListID` válidos de esa sede |
| `QB-PARSE-ERROR` | Se usó `ActiveStatus` como filtro en `SalesOrderQuery` | Eliminar el campo `ActiveStatus` del payload. `SalesOrderQuery` no soporta ese filtro. Usar `MaxReturned` o dejar el payload vacío |
| `LB-VALIDATION-MISSING_REQUIRED` | Falta uno o más campos requeridos en el payload | Revisar el campo `details.details[]` en la respuesta de error — lista exactamente qué campos faltan y desde qué fuente (Intuit o regla de negocio de sede) |
| `MISSING-DATA` | El payload de Query está completamente vacío | Agregar al menos el campo `MaxReturned` (ej. `"1"`) o cualquier otro filtro válido |
| Botón Run bloqueado / no responde | La solicitud excedió el tiempo de espera o el agente QB Desktop no está activo | El botón se libera automáticamente después de **20 segundos**. Si persiste, hacer recarga forzada: **Cmd + Shift + R** (Mac) o **Ctrl + Shift + R** (Windows) |

---

## Cómo hacer un Mod correctamente (paso a paso)

El error más frecuente en Mod es usar un `EditSequence` desactualizado (`QB-3200`). Seguir este flujo garantiza el éxito:

### Paso 1 — Obtener el TxnID de la orden

Si ya se tiene el `TxnID`, ir al Paso 2. Si no:

1. Seleccionar operación **Sales Order — Query**
2. Seleccionar sede **TEST**
3. En el campo `RefNumber` o `MaxReturned` ingresar un filtro que identifique la orden
4. Ejecutar con **Run**
5. Copiar el valor de `TxnID` del resultado (formato: `626B8-1775501397`)

### Paso 2 — Seleccionar Mod e ingresar el TxnID

1. Seleccionar operación **Sales Order — Mod**
2. Seleccionar sede **TEST**
3. Pegar el `TxnID` copiado en el campo correspondiente

### Paso 3 — Obtener el EditSequence fresco

1. Hacer clic en el botón **"Obtener EditSequence"**
2. El sistema ejecuta automáticamente un Query con ese `TxnID` y pre-llena el campo `EditSequence` con el valor actual de QB Desktop
3. Verificar que el campo `EditSequence` tenga un valor numérico (ej. `1775501419`)

> **No ingresar el EditSequence manualmente** — usar siempre el botón "Obtener EditSequence" para garantizar que el valor está actualizado.

### Paso 4 — Realizar los cambios

Modificar los campos deseados (Memo, ShipDate, RefNumber, etc.). Los campos requeridos (`CustomerRef`, `TxnDate`, `RefNumber`) deben estar presentes aunque no cambien.

### Paso 5 — Ejecutar

Hacer clic en **Run**. El resultado esperado es:

```json
{
  "success": true,
  "data": {
    "SalesOrderRet": {
      "TxnID": "626B8-1775501397",
      "EditSequence": "1775501420",
      ...
    }
  }
}
```

El `EditSequence` en la respuesta será diferente al enviado — QB Desktop lo incrementa en cada modificación exitosa.

---

## Preguntas frecuentes

### ¿Por qué el botón Run se quedó girando y luego apareció un error?

El frontend espera máximo 20 segundos la respuesta de QB Desktop. Si el agente QB Desktop de la sede seleccionada no está activo o hay un problema de conectividad, la solicitud expira y el botón se libera automáticamente. Verificar que el agente QB esté corriendo en el servidor correspondiente a esa sede.

### ¿Por qué los ListIDs del Fill Examples no funcionan en RUS/REC/RBR/RMX?

Los `ListID` (de cliente, ítem, plantilla, impuesto, etc.) son identificadores internos de cada archivo de compañía QuickBooks Desktop (`.QBW`). Los valores de TEST no existen en las compañías de producción. Para obtener los `ListID` válidos de una sede de producción, ejecutar un `SalesOrderQuery` en esa sede y extraer los valores de una orden existente.

### ¿Por qué no puedo usar ActiveStatus en SalesOrderQuery?

A diferencia de otras entidades como `ItemInventory`, `SalesOrderQuery` en QB Desktop no acepta el campo `ActiveStatus` como filtro. Incluirlo genera un error de XML mal formado (`QB-PARSE-ERROR`). Para limitar los resultados usar `MaxReturned`.

### ¿Puedo crear o modificar órdenes directamente en RUS, REC, RBR o RMX?

No. El Playground restringe Add y Mod a la sede TEST. Las sedes de producción solo permiten Query (consulta). Esta restricción protege los datos de producción de modificaciones accidentales durante pruebas o desarrollo.

### ¿Qué hago si el TxnID de la respuesta no aparece en QB Desktop?

El `TxnID` es interno a QB Desktop y es específico por archivo de compañía. Si ejecutaste un Add en TEST y buscas la orden en QB Desktop, debes abrir el archivo de compañía de TEST. Los `TxnID` creados en TEST no existen en los archivos de producción.

---

## Contacto y escalamiento

Si el error no está en la tabla anterior o el problema persiste después de seguir los pasos indicados, documentar:

1. **Código de error exacto** tal como aparece en la respuesta
2. **Sede** seleccionada al momento del error
3. **Operación** (Add / Mod / Query)
4. **Payload enviado** (copiar desde el formulario del Playground)
5. **Respuesta completa** recibida (incluyendo `details` si existe)

Con esa información el equipo de desarrollo puede diagnosticar si el problema está en LedgerBridge, LedgerOps, el agente QB Desktop o la configuración de la sede.
