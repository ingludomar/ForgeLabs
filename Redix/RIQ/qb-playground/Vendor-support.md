# Vendor — Guía de Soporte

**Entidad:** `Vendor`
**Operaciones:** Add · Mod · Query
**Audiencia:** Soporte técnico / Help Desk
**Actualizado:** 2026-04-07

---

## Diagnóstico rápido

### El botón Run no se activa

**Síntomas:** El botón Run aparece gris/deshabilitado.

**Pasos:**
1. Verificar que el campo `Name` esté lleno (Add/Mod)
2. Verificar que `ListID` y `EditSequence` estén llenos (Mod)
3. Revisar el contador de campos requeridos — indica cuántos faltan
4. Confirmar que el contrato cargó (sin spinner activo en el formulario)
5. Cambiar de entidad y volver para resetear el estado

**Solución rápida:** Usar **Fill Examples** y completar los campos faltantes.

---

### El botón Run permanece azul (stuck)

**Síntomas:** Clic en Run → botón queda azul indefinidamente.

**Pasos:**
1. Esperar hasta 20 segundos — el frontend tiene timeout automático
2. Si sigue azul después de 20s, verificar conectividad al API (`/api/webhook-config`)
3. Cambiar de entidad (selector izquierdo) y volver — resetea el estado `sending`
4. Recargar la página como último recurso

**Causa raíz:** El backend no respondió en 20s. Puede ser un workflow de LedgerOps caído o el
agente QB Desktop de la sede inactivo.

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
`"source": "sede"` → campo requerido por las reglas de negocio de esa sede específica.

**Solución:** Llenar los campos indicados y reenviar. Para TEST, los campos adicionales de sede
son `CurrencyRef.ListID` e `IsActive`.

---

### Error QB-3100 — nombre duplicado

**Síntomas:** `"errorCode": "QB-3100"` al crear un vendor.

**Causa:** Ya existe un vendor con ese `Name` en la compañía QB Desktop.

**Solución:** Usar un nombre diferente. No existen dos vendors con el mismo nombre en QB.
Ejecutar un `VendorQuery { "FullName": "<nombre>" }` para confirmar si ya existe.

---

### Error QB-3170 — no se puede fusionar registros

**Síntomas:** `"errorCode": "QB-3170"` al modificar un vendor.

**Causa:** El `Name` enviado en el Mod ya pertenece a otro vendor en QB. QB interpreta esto como
un intento de fusión de registros, lo cual no está permitido desde la API.

**Solución paso a paso:**
1. Ejecutar `VendorQuery { "FullName": "<nombre que se intentó usar>" }` — confirmar que existe
2. Si se quiere mantener el nombre original, enviarlo sin cambios en el campo `Name` del Mod
3. Si se quiere cambiar el nombre, usar uno que no exista en la compañía

---

### Error QB-3200 — EditSequence desactualizado

**Síntomas:** `"errorCode": "QB-3200"` al modificar un vendor.

**Causa:** El `EditSequence` enviado no coincide con el valor actual en QB Desktop.

**Solución paso a paso:**
1. En el formulario de Mod, hacer clic en **"Obtener EditSequence"**
2. O ejecutar `VendorQuery { "ListID": "<listID del vendor>" }`
3. Copiar el `EditSequence` de la respuesta
4. Pegarlo en el campo `EditSequence` del formulario de Mod
5. Enviar **inmediatamente** — cada modificación cambia el EditSequence

---

### Error QB-3240 — ListID no encontrado

**Síntomas:** `"errorCode": "QB-3240"` al crear o modificar un vendor.

**Causa:** Uno de los `ListID` (CurrencyRef, TermsRef, VendorTypeRef, etc.) no existe en el
archivo QB Desktop de la sede seleccionada.

**Solución:**
1. Verificar que la sede seleccionada sea la correcta
2. Ejecutar `VendorQuery { "MaxReturned": "1" }` en esa sede → extraer los ListIDs de un vendor existente
3. Los ListIDs de TEST no sirven en producción y viceversa

---

### El Query retorna lista vacía

**Síntomas:** `"success": true` pero `VendorRet` es un array vacío o no aparece.

**Posibles causas:**
- Todos los vendors están inactivos y el filtro usa `ActiveStatus: "ActiveOnly"`
- El `FullName` o `ListID` del filtro no existe en esa sede
- La compañía QB Desktop de esa sede no tiene vendors registrados

**Diagnóstico:** Cambiar el filtro a `ActiveStatus: "All"` y `MaxReturned: "5"` para ver todos.

---

## Cuándo escalar al equipo de desarrollo

- El error no está en esta guía y la respuesta no tiene código reconocible.
- El endpoint retorna HTTP 5xx.
- El workflow de LedgerOps muestra errores en el panel de N8N.
- El agente QB Desktop de la sede no responde (verificar con infraestructura).
- `LB-VALIDATION-MISSING_REQUIRED` menciona campos que sí están llenos en el formulario.

Al escalar, incluir: sede, operación, payload completo (JSON), respuesta completa (JSON), hora de la petición.
