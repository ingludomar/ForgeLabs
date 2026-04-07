# ItemInventory — Guía de Soporte

**Entidad:** `ItemInventory`
**Operaciones:** Add · Mod · Query
**Audiencia:** Soporte técnico / Help Desk
**Actualizado:** 2026-04-07

---

## Diagnóstico rápido

### El botón Run no se activa

**Síntomas:** El botón Run aparece gris/deshabilitado.

**Pasos:**
1. Verificar que `Name` esté lleno (Add/Mod)
2. Verificar que los tres `AccountRef.ListID` (Income, COGS, Asset) estén llenos (Add)
3. Verificar que `ListID` y `EditSequence` estén llenos (Mod)
4. Revisar el contador de campos requeridos debajo del botón
5. Confirmar que el contrato cargó (sin spinner activo)
6. Cambiar de entidad y volver para resetear el estado

**Solución rápida:** Usar **Fill Examples** y completar los campos faltantes.

---

### El botón Run permanece azul (stuck)

**Síntomas:** Clic en Run → botón queda azul indefinidamente.

**Pasos:**
1. Esperar hasta 20 segundos — timeout automático del frontend
2. Si sigue azul, verificar conectividad al API
3. Cambiar de entidad y volver — resetea el estado
4. Recargar la página como último recurso

---

### Error MISSING-DATA en Query

**Síntomas:** `"success": false`, código `MISSING-DATA` después de ejecutar un Query.

**Causa:** El payload del Query estaba completamente vacío. `ItemInventoryQuery` es la única
entidad del Playground que requiere obligatoriamente al menos un campo de filtro.

**Solución:** Agregar al menos uno de estos campos al Query:
```json
{ "ActiveStatus": "ActiveOnly" }
```
o
```json
{ "MaxReturned": "10" }
```

El botón **Fill Examples** completa automáticamente un Query válido.

---

### Error INTERNAL_ERROR — timeout en Query

**Síntomas:** `"success": false`, mensaje sobre timeout, especialmente en sede REC.

**Causa:** QB Desktop tardó más de 15 segundos en responder. Ocurre cuando el inventario es
grande (REC tiene 569 artículos) y el Query no tiene `MaxReturned`.

**Solución:** Agregar `MaxReturned` con un valor razonable:
```json
{
  "ActiveStatus": "ActiveOnly",
  "MaxReturned": "20"
}
```

Para buscar un artículo específico, usar `NameFilter`:
```json
{
  "NameFilter": { "MatchCriterion": "StartsWith", "Name": "<prefijo>" },
  "ActiveStatus": "ActiveOnly"
}
```

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
        { "field": "SalesDesc", "source": "sede" },
        { "field": "COGSAccountRef.ListID", "source": "intuit" }
      ]
    }
  }
}
```

`"source": "intuit"` → campo obligatorio de QB Desktop (Name, IncomeAccountRef, COGSAccountRef, AssetAccountRef).
`"source": "sede"` → campo requerido por reglas de negocio de la sede (SalesDesc, PurchaseDesc, SalesPrice, Max en TEST).

**Solución:** Llenar los campos indicados y reenviar. Usar Fill Examples como punto de partida.

---

### Error QB-3100 — nombre duplicado

**Síntomas:** `"errorCode": "QB-3100"` al crear un artículo.

**Causa:** Ya existe un artículo con ese `Name` en la compañía QB Desktop. Esto incluye ítems
de tipo `ItemNonInventory` e `ItemService` — QB comparte el espacio de nombres entre todos los tipos.

**Solución:**
1. Ejecutar `ItemInventoryQuery { "NameFilter": { "MatchCriterion": "Contains", "Name": "<nombre>" }, "ActiveStatus": "All" }`
2. Si el artículo existe pero está inactivo, reactivarlo con un Mod (`IsActive: "true"`) en lugar de crear uno nuevo
3. Si se necesita un artículo nuevo, usar un nombre diferente

---

### Error QB-3170 — tipo de cuenta incorrecto

**Síntomas:** `"errorCode": "QB-3170"` al crear o modificar un artículo.

**Causa para ItemInventory:** Uno de los `AccountRef` apunta a una cuenta contable de tipo
incorrecto en QB Desktop. QB requiere:
- `IncomeAccountRef` → cuenta de tipo **Income**
- `COGSAccountRef` → cuenta de tipo **Cost of Goods Sold**
- `AssetAccountRef` → cuenta de tipo **Other Current Asset**

**Solución:**
1. Ejecutar `ItemInventoryQuery { "ListIDList": { "ListID": ["<listID de ítem existente>"] }, "ActiveStatus": "ActiveOnly" }` para obtener los ListIDs de cuentas válidas
2. Usar esos ListIDs en el Add/Mod
3. Si es urgente, verificar en QB Desktop → Chart of Accounts el tipo de cada cuenta

---

### Error QB-3200 — EditSequence desactualizado

**Síntomas:** `"errorCode": "QB-3200"` al modificar un artículo.

**Solución paso a paso:**
1. Hacer clic en **"Obtener EditSequence"** en el formulario de Mod
2. O ejecutar `ItemInventoryQuery { "ListIDList": { "ListID": ["<listID>"] }, "ActiveStatus": "All" }`
3. Copiar `EditSequence` de la respuesta
4. Pegarlo en el campo `EditSequence` del Mod
5. Enviar **inmediatamente**

---

### Error QB-3240 — ListID no encontrado

**Síntomas:** `"errorCode": "QB-3240"` al crear o modificar.

**Causa:** Un `ListID` de AccountRef, PrefVendorRef u otro campo Ref no existe en el archivo QB
Desktop de la sede seleccionada.

**Solución:**
1. Verificar que la sede sea la correcta
2. Obtener los ListIDs de cuentas válidos ejecutando un `ItemInventoryQuery` en esa sede y extrayendo los `*AccountRef` de un ítem activo
3. Los ListIDs de cuentas de TEST no son válidos en producción

---

## Aclaraciones frecuentes

**¿Por qué no puedo usar el mismo ítem en otra sede?**
Los `ListID` son internos de cada archivo QB Desktop. El mismo artículo en dos sedes distintas
tiene ListIDs diferentes. Siempre obtener los ListIDs con un Query en la sede destino.

**¿Cuál es la diferencia entre ItemInventory e ItemService?**
`ItemInventory` rastrea cantidad en stock y tiene `AssetAccountRef`. `ItemService` y
`ItemNonInventory` no rastrean inventario. Para órdenes de compra y venta con control de stock,
usar siempre `ItemInventory`. Los ListIDs no son intercambiables entre tipos.

---

## Cuándo escalar al equipo de desarrollo

- El error no está en esta guía y la respuesta no tiene código reconocible.
- El endpoint retorna HTTP 5xx.
- El workflow de LedgerOps muestra errores en el panel de N8N.
- El agente QB Desktop de la sede no responde.
- `LB-VALIDATION-MISSING_REQUIRED` menciona campos que sí están llenos.
- Timeout persistente incluso con `MaxReturned: "1"`.

Al escalar, incluir: sede, operación, payload (JSON), respuesta (JSON), hora de la petición.
