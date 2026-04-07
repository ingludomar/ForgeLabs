# Purchase Order — Guía de Soporte

**Entidad:** `PurchaseOrder`
**Operaciones:** Add · Mod · Query
**Audiencia:** Soporte técnico / Help Desk
**Actualizado:** 2026-04-07

---

## Diagnóstico rápido

### El botón Run no se activa

**Síntomas:** El botón Run aparece gris/deshabilitado después de llenar los campos.

**Pasos de diagnóstico:**
1. Verificar que `VendorRef.ListID` esté lleno (campo obligatorio más común que falta)
2. Verificar que `ExpectedDate` esté lleno (requerido en sede TEST)
3. Revisar el contador de campos requeridos debajo del botón — indica cuántos faltan
4. Confirmar que el contrato se cargó (la sección no debe mostrar indicador de carga)
5. Cambiar de entidad y volver — resetea el estado del formulario

**Causa raíz frecuente:** El campo `VendorRef` no tiene `ListID` o `ExpectedDate` está vacío.
Usar **Fill Examples** para pre-llenar todos los campos de prueba con valores válidos para TEST.

---

### El botón Run permanece azul (stuck)

**Síntomas:** El usuario hace clic en Run, el botón queda azul indefinidamente sin respuesta.

**Pasos de diagnóstico:**
1. Esperar hasta 20 segundos — el frontend tiene un timeout que resetea el estado automáticamente
2. Si después de 20 segundos sigue azul, verificar la conexión al backend:
   - Ir a **Configuración → Integraciones → Estado** y confirmar que el API responde
3. Cambiar de entidad (desplegable de la izquierda) y volver — resetea el estado `sending`
4. Recargar la página como último recurso

**Causa raíz:** El backend no respondió dentro del timeout de 20 segundos. Puede ser un problema
de red, un workflow de LedgerOps caído, o un agente QB Desktop sin respuesta.

---

### Error LB-VALIDATION-MISSING_REQUIRED

**Síntomas:** La respuesta muestra `"success": false` con código `LB-VALIDATION-MISSING_REQUIRED`.

**Cómo leer el error:**
```json
{
  "success": false,
  "error": {
    "code": "LB-VALIDATION-MISSING_REQUIRED",
    "details": {
      "details": [
        { "field": "ExpectedDate", "source": "sede" },
        { "field": "VendorAddress.Addr3", "source": "sede" }
      ]
    }
  }
}
```

El array `details.details` lista exactamente qué campos faltan y si son requeridos por Intuit
(`"source": "intuit"`) o por las reglas de la sede (`"source": "sede"`).

**Solución:** Llenar los campos indicados en `details` y reenviar. Para TEST, los campos
adicionales requeridos por la sede son: `ExpectedDate`, `VendorAddress.Addr3`, `RefNumber`.

---

### Error QB-3070 — string too long

**Síntomas:** `"code": "QB-3070"` en la respuesta.

**Causa:** El `RefNumber` excede 11 caracteres. QB Desktop tiene este límite hardcodeado.

**Solución:** Acortar el `RefNumber` a 11 caracteres o menos. El Playground genera un RefNumber
válido automáticamente al usar **Fill Examples** (`PO-XXXXXXXX` = 11 chars máximo).

---

### Error QB-3100 — duplicate

**Síntomas:** `"code": "QB-3100"` al intentar crear un PO.

**Causa:** Ya existe un PO con el mismo `RefNumber` en la compañía QB Desktop.

**Solución:** Usar un `RefNumber` diferente. El botón **Fill Examples** genera un número basado
en timestamp que evita duplicados. Si el error persiste, ejecutar un `PurchaseOrderQuery` con
`RefNumberFilter` para confirmar que el número ya existe.

---

### Error QB-3200 — object modified

**Síntomas:** `"code": "QB-3200"` al intentar modificar un PO.

**Causa:** El `EditSequence` enviado no coincide con el valor actual en QB Desktop. Otro usuario
o proceso modificó el PO después de que se obtuvo el EditSequence.

**Solución paso a paso:**
1. En el formulario de Mod, hacer clic en **"Obtener EditSequence"** (si está disponible)
2. O ejecutar un `PurchaseOrderQuery` con el TxnID del PO
3. Copiar el `EditSequence` de la respuesta
4. Pegar ese valor en el campo `EditSequence` del formulario de Mod
5. Enviar inmediatamente (no esperar — otro cambio invalidará el EditSequence)

---

### Error QB-3240 — ListID not found

**Síntomas:** `"code": "QB-3240"` al intentar crear o modificar un PO.

**Causa:** Uno de los `ListID` (VendorRef, ItemRef, etc.) no existe en el archivo QB Desktop
de la sede seleccionada. Los ListIDs son específicos por compañía — no son portables entre sedes.

**Solución:**
1. Verificar que la sede seleccionada es la correcta
2. Ejecutar un `PurchaseOrderQuery` en la misma sede para obtener ListIDs válidos
3. Actualizar los valores del formulario con los ListIDs obtenidos
4. Los ListIDs de TEST no sirven para producción (RUS, REC, RBR, RMX) y viceversa

---

### Error QB-3171 — accounting period closed

**Síntomas:** `"code": "QB-3171"` al intentar crear un PO.

**Causa:** La fecha en `TxnDate` corresponde a un período contable cerrado en QB Desktop.

**Solución:** Cambiar `TxnDate` a la fecha actual o a una fecha dentro del período abierto.
El botón **Fill Examples** establece `TxnDate` con la fecha actual automáticamente.

---

### La respuesta no incluye las líneas del PO

**Síntomas:** El Query retorna el PO pero sin `PurchaseOrderLineRet`.

**Causa esperada:** Al filtrar `PurchaseOrderQuery` por `TxnID`, QB Desktop no incluye las líneas
en la respuesta. Este es el comportamiento nativo del SDK de QB — no es un error.

**Solución:** Para ver las líneas, ejecutar `PurchaseOrderQuery` con `MaxReturned` (sin filtro de
TxnID) y localizar la orden por `RefNumber` o `TxnDate` en la lista de resultados.

---

## Escalar al equipo de desarrollo

Escalar si:

- El error no está en esta guía y la respuesta no incluye un código de error reconocible.
- El endpoint `/api/integration/qb-playground` retorna HTTP 5xx.
- El workflow de LedgerOps muestra errores en el panel de N8N.
- El QB Desktop Agent no está respondiendo (confirmar con el equipo de infraestructura que el
  agente está activo y conectado a la compañía correcta).
- El error `LB-VALIDATION-MISSING_REQUIRED` menciona campos que sí están llenos en el formulario.

Al escalar, incluir:
- Sede utilizada
- Operación (Add / Mod / Query)
- Payload completo enviado (JSON)
- Respuesta completa recibida (JSON)
- Hora de la petición (para cruzar con logs de LedgerOps)
