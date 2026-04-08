# Customer — Guía de Soporte

**Entidad:** `Customer`
**Operaciones:** Add · Mod · Query
**Audiencia:** Soporte técnico / Help Desk
**Actualizado:** 2026-04-07

---

## Diagnóstico rápido

### El botón Run no se activa

**Síntomas:** El botón Run aparece gris/deshabilitado.

**Pasos:**
1. Verificar que el campo `Name` esté lleno (Add)
2. Verificar que `ListID` y `EditSequence` estén llenos (Mod)
3. Revisar el contador de campos requeridos debajo del botón
4. Confirmar que el contrato cargó (sin spinner en el formulario)
5. Cambiar de entidad y volver para resetear el estado

**Solución rápida:** Usar **Fill Examples** y completar los campos faltantes manualmente.

---

### El botón Run permanece azul (stuck)

**Síntomas:** Clic en Run → botón queda azul sin respuesta.

**Pasos:**
1. Esperar hasta 20 segundos — el frontend tiene timeout automático
2. Si sigue azul, verificar conectividad al API
3. Cambiar de entidad y volver — resetea el estado `sending`
4. Recargar la página como último recurso

---

### Error LB-VALIDATION-MISSING_REQUIRED

**Síntomas:** `"success": false`, código `LB-VALIDATION-MISSING_REQUIRED`.

**Cómo leer el error:**
```json
{
  "error": {
    "code": "LB-VALIDATION-MISSING_REQUIRED",
    "details": {
      "details": [
        { "field": "Name", "source": "intuit" },
        { "field": "CurrencyRef.ListID", "source": "sede" }
      ]
    }
  }
}
```

`"source": "intuit"` → campo obligatorio de QB Desktop.
`"source": "sede"` → campo requerido por las reglas de negocio de esa sede.

**Solución:** Llenar los campos indicados y reenviar.

---

### Error QB-3100 — nombre duplicado

**Síntomas:** `"errorCode": "QB-3100"` al crear un cliente.

**Causa:** Ya existe un cliente con ese `Name` en la compañía QB Desktop.

**Solución:** Usar un nombre diferente. Ejecutar `CustomerQuery { "FullName": "<nombre>" }`
para confirmar si ya existe antes de intentar el Add.

---

### Error QB-3170 — no se puede fusionar registros

**Síntomas:** `"errorCode": "QB-3170"` al modificar un cliente.

**Causa:** El `Name` enviado en el Mod ya pertenece a otro cliente en QB Desktop. QB no permite
fusionar dos registros de cliente vía API.

**Solución paso a paso:**
1. Ejecutar `CustomerQuery { "FullName": "<nombre que se intentó usar>" }` para confirmar que existe
2. Decidir:
   - Si se quiere mantener el nombre original → enviarlo sin cambios en el campo `Name`
   - Si se quiere cambiar el nombre → usar uno que no exista en la compañía
3. Reenviar el Mod con el nombre correcto

---

### Error QB-3200 — EditSequence desactualizado

**Síntomas:** `"errorCode": "QB-3200"` al modificar un cliente.

**Causa:** El `EditSequence` enviado no coincide con el valor actual en QB Desktop.

**Solución paso a paso:**
1. Hacer clic en **"Obtener EditSequence"** en el formulario de Mod (si está disponible)
2. O ejecutar `CustomerQuery { "ListID": "<listID del cliente>" }`
3. Copiar el `EditSequence` de la respuesta
4. Pegarlo en el campo `EditSequence` del formulario
5. Enviar **inmediatamente** — no esperar

---

### Error QB-3240 — ListID no encontrado

**Síntomas:** `"errorCode": "QB-3240"` al crear o modificar.

**Causa:** Uno de los `ListID` (CurrencyRef, SalesTaxCodeRef, etc.) no existe en el archivo QB
Desktop de la sede seleccionada.

**Solución:**
1. Verificar que la sede seleccionada sea la correcta
2. Ejecutar `CustomerQuery { "MaxReturned": "1" }` en esa sede → extraer ListIDs de un cliente existente
3. Recordar: los ListIDs de TEST no son válidos en producción y viceversa

---

### El Query retorna lista vacía

**Síntomas:** `"success": true` pero `CustomerRet` es un array vacío.

**Posibles causas:**
- Todos los clientes están inactivos y el filtro usa `ActiveStatus: "ActiveOnly"`
- El `FullName` o `ListID` del filtro no existe en esa sede
- La compañía QB Desktop de esa sede no tiene clientes registrados

**Diagnóstico:** Cambiar a `ActiveStatus: "All"` y `MaxReturned: "5"`.

---

### La respuesta incluye múltiples clientes en acordeón

**Síntomas:** La respuesta del Playground muestra varios clientes en un acordeón expandible.

**Causa:** Es el comportamiento esperado cuando Query retorna más de un registro. Expandir cada
elemento del acordeón para ver el ListID y EditSequence de cada cliente.

---

## Cuándo escalar al equipo de desarrollo

- El error no está en esta guía y la respuesta no tiene código reconocible.
- El endpoint retorna HTTP 5xx.
- El workflow de LedgerOps muestra errores en el panel de N8N.
- El agente QB Desktop de la sede no responde.
- `LB-VALIDATION-MISSING_REQUIRED` menciona campos que sí están llenos.

Al escalar, incluir: sede, operación, payload (JSON), respuesta (JSON), hora de la petición.
