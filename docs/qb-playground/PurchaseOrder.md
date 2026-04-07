# QB Playground — Purchase Order

**Entidad:** `PurchaseOrder` (Orden de Compra)
**Operaciones disponibles:** Add · Mod · Query
**Versiones QBXML:** 17.0 (TEST · RUS · REC · RBR) · 13.0 (RMX)

---

## Descripción general

`PurchaseOrder` representa una orden de compra en QuickBooks Desktop. Es el documento que formaliza
la compra de bienes o servicios a un proveedor. Cada orden requiere al menos un proveedor, una línea
de detalle con ítem y cantidad, y una fecha esperada de entrega (`ExpectedDate`).

El `RefNumber` es el número de referencia visible en el documento (número de PO). Tiene un límite de
**11 caracteres** en QB Desktop — excederlo retorna QB-3070.

---

## Cómo acceder al Playground

1. Ir a **Configuración → Integraciones → QB Playground**
2. En la sección **Purchasing**, seleccionar la operación (`Purchase Order — Add`, `Mod` o `Query`)
3. Seleccionar la **Sede**
4. Completar el formulario y ejecutar con **Run**

> Si existe un template para la combinación tipo+sede, el formulario mostrará solo los campos
> del template. Usar el selector en el action bar para cambiar o elegir "Todos los campos".

---

## Estado por sede (smoke tests 2026-04-07)

| Operación | TEST | RUS | REC | RBR | RMX |
|-----------|------|-----|-----|-----|-----|
| **Query** | ✅ OK | ✅ OK | ✅ OK | ✅ OK | ✅ OK |
| **Add**   | ✅ OK | — | — | — | — |
| **Mod**   | ✅ OK | — | — | — | — |

> **Metodología:** CRUD completo en TEST · solo Query en producción.
> Los ListIDs se obtuvieron con un Query previo a cada sede.

---

## PurchaseOrderAdd

### Campos requeridos (header)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `VendorRef.ListID` | ref | Identificador QB del proveedor |
| `VendorRef.FullName` | ref | Nombre completo del proveedor |
| `TxnDate` | string | Fecha de la orden (YYYY-MM-DD) |
| `RefNumber` | string | Número de referencia — **máx. 11 caracteres** |
| `DueDate` | string | Fecha de vencimiento (YYYY-MM-DD) |
| `ExpectedDate` | string | Fecha esperada de entrega (YYYY-MM-DD) — **requerido por sede TEST** |
| `VendorAddress.Addr1` | string | Dirección del proveedor línea 1 |
| `VendorAddress.Addr2` | string | Dirección del proveedor línea 2 |
| `VendorAddress.Addr3` | string | Dirección del proveedor línea 3 |
| `VendorAddress.City` | string | Ciudad del proveedor |
| `ShipAddress.Addr1` | string | Dirección de envío línea 1 |
| `ShipAddress.Addr2` | string | Dirección de envío línea 2 |
| `ShipAddress.City` | string | Ciudad de envío |
| `IsToBePrinted` | string | `"true"` / `"false"` |
| `IsToBeEmailed` | string | `"true"` / `"false"` |

### Líneas de detalle (PurchaseOrderLineAdd)

Al menos una línea es requerida. Los campos se envían bajo la clave `PurchaseOrderLineAdd` en el
objeto `data`, fuera del objeto `PurchaseOrderAdd`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ItemRef.ListID` | ref | Ítem de inventario o servicio |
| `Quantity` | string | Cantidad |
| `Rate` | string | Precio unitario |
| `OverrideUOMSetRef.ListID` | ref | Unidad de medida (opcional) |

### Campos opcionales (header)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Memo` | string | Nota interna |
| `ShipToEntityRef.ListID` | ref | Entidad destino de envío |
| `TermsRef.ListID` | ref | Condiciones de pago |
| `ClassRef.ListID` | ref | Clase contable |
| `FOB` | string | Términos de envío (ej. `"DDP"`, `"FOB"`) |
| `ExchangeRate` | string | Tipo de cambio (transacciones en moneda extranjera) |
| `ExternalGUID` | string | Identificador externo |

### Fill Examples (valores de referencia para TEST)

```json
{
  "PurchaseOrderAdd": {
    "VendorRef":        { "ListID": "800001F1-1597178964", "FullName": "REDSIS CORP-USD" },
    "TxnDate":          "2026-04-07",
    "RefNumber":        "PO-0000001",
    "DueDate":          "2026-05-07",
    "ExpectedDate":     "2026-04-14",
    "VendorAddress": {
      "Addr1": "1234 Main Street", "Addr2": "Suite 500",
      "Addr3": "Section A", "City": "Miami",
      "State": "FL", "PostalCode": "33101", "Country": "USA"
    },
    "ShipAddress": {
      "Addr1": "1234 Main Street", "Addr2": "Suite 500",
      "City": "Miami", "State": "FL", "Country": "USA"
    },
    "IsToBePrinted": "false",
    "IsToBeEmailed":  "false",
    "Memo":           "Orden generada desde Redix"
  },
  "PurchaseOrderLineAdd": {
    "ItemRef":  { "ListID": "80000026-1597198891" },
    "Quantity": "5",
    "Rate":     "45.00"
  }
}
```

> Los `ListID` son específicos por compañía QB. Obtenerlos con `PurchaseOrderQuery` o
> `ItemInventoryQuery` en cada sede.

### Resultado esperado

```json
{
  "success": true,
  "data": {
    "PurchaseOrderRet": {
      "TxnID": "626C6-XXXXXXXXXX",
      "TimeCreated": "2026-04-07T...",
      "EditSequence": "1775XXXXXXX",
      "RefNumber": "PO-0000001",
      "VendorRef": { "ListID": "...", "FullName": "REDSIS CORP-USD" },
      ...
    }
  }
}
```

---

## PurchaseOrderMod

### Campos requeridos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `TxnID` | string | Identificador de la transacción — obtenido de Add o Query |
| `EditSequence` | string | Token de concurrencia — debe ser el valor actual |
| `VendorRef.ListID` | ref | Proveedor (requerido aunque no cambie) |
| `VendorRef.FullName` | ref | Nombre del proveedor |
| `TxnDate` | string | Fecha de la orden |
| `ExpectedDate` | string | Fecha esperada de entrega — **requerido por sede TEST** |

> **`EditSequence` es dinámico**: QB lo incrementa en cada modificación. Usar un valor
> desactualizado retorna QB-3200. El flujo correcto es:
> 1. `PurchaseOrderQuery` con `TxnID` → obtener `EditSequence` actual
> 2. Usar ese valor inmediatamente en el `PurchaseOrderMod`

### Campos opcionales en Mod

Cualquier campo del header de Add puede modificarse. Para modificar líneas de detalle usar
`PurchaseOrderLineMod` con el `TxnLineID` de cada línea (obtenido del Query).

### Fill Examples

```json
{
  "PurchaseOrderMod": {
    "TxnID":        "<obtener de Query o Add>",
    "EditSequence": "<obtener de Query o Add>",
    "VendorRef":    { "ListID": "800001F1-1597178964", "FullName": "REDSIS CORP-USD" },
    "TxnDate":      "2026-04-07",
    "ExpectedDate": "2026-04-21",
    "Memo":         "Actualizado desde Redix"
  }
}
```

### Resultado esperado

```json
{
  "success": true,
  "data": {
    "PurchaseOrderRet": {
      "TxnID": "626C6-XXXXXXXXXX",
      "EditSequence": "1775XXXXXXX",
      "Memo": "Actualizado desde Redix",
      ...
    }
  }
}
```

---

## PurchaseOrderQuery

### Nota sobre el payload

`PurchaseOrderQuery` acepta un objeto vacío y retorna todos los registros (limitado por
`MaxReturned`). En inventarios grandes usar `MaxReturned` para evitar timeouts.

> **Nota:** `PurchaseOrderQuery` por `TxnID` retorna el registro header pero **no incluye
> `PurchaseOrderLineRet`** en la respuesta. Para ver líneas, ejecutar un Query sin filtro de
> TxnID o consultar con `MaxReturned`.

### Campos de filtro disponibles

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `MaxReturned` | string | Límite de resultados — recomendado en producción |
| `FromModifiedDate` | string | Filtro por fecha de modificación desde (YYYY-MM-DD) |
| `ToModifiedDate` | string | Filtro por fecha de modificación hasta (YYYY-MM-DD) |
| `TxnID` | string | Buscar una orden específica por ID interno |
| `RefNumberFilter` | object | `{"MatchCriterion": "StartsWith", "RefNumber": "PO-"}` |
| `EntityFilter` | object | `{"ListID": "<VendorListID>"}` — órdenes de un proveedor |

### Fill Examples

```json
{
  "MaxReturned": "20",
  "FromModifiedDate": "2026-01-01"
}
```

### Resultado esperado

```json
{
  "success": true,
  "data": {
    "PurchaseOrderRet": [
      {
        "TxnID": "626C6-XXXXXXXXXX",
        "EditSequence": "1775XXXXXXX",
        "RefNumber": "PO-0000001",
        "TxnDate": "2026-04-07",
        "VendorRef": { "ListID": "...", "FullName": "..." },
        "VendorAddress": { ... },
        "ShipAddress":   { ... },
        "PurchaseOrderLineRet": [ ... ]
      }
    ]
  }
}
```

---

## Notas importantes

### RefNumber — límite de 11 caracteres

QB Desktop limita `RefNumber` a 11 caracteres. Excederlo retorna **QB-3070**. Diseñar los
números de PO teniendo en cuenta este límite.

### ExpectedDate — requerido por sede TEST

`ExpectedDate` no es obligatorio según Intuit pero la sede TEST lo requiere por reglas de negocio
de LedgerBridge. Omitirlo retorna `LB-VALIDATION-MISSING_REQUIRED`. El botón `Fill Examples`
lo incluye automáticamente con valor a +7 días de la fecha actual.

### TxnID vs RefNumber

`TxnID` es el identificador interno de QB (ej. `626C6-1775578032`) — se usa en Mod y para
relacionar documentos. `RefNumber` es el número visible en el PO. Ambos se obtienen de la
respuesta de Add o de un Query.

### ListIDs son específicos por compañía

Los `ListID` de VendorRef, ItemRef, etc. son internos de cada archivo QB Desktop y no son
portables entre sedes. Obtener los ListIDs correctos ejecutando un `PurchaseOrderQuery` en cada
sede y extrayendo los valores de una orden existente.

### EditSequence en Mod

`EditSequence` es un token de control de concurrencia que QB incrementa en cada modificación.
Si el valor enviado no coincide con el actual, QB retorna **QB-3200** (object modified).
Siempre obtener el `EditSequence` fresco con un Query inmediatamente antes del Mod.

### PurchaseOrderQuery por TxnID no retorna líneas

Al filtrar por `TxnID` en `PurchaseOrderQuery`, la respuesta incluye los campos del header pero
no `PurchaseOrderLineRet`. Este es el comportamiento de QB Desktop para este filtro. Para
hidratar el formulario de Mod con las líneas, usar un Query general con `MaxReturned` y localizar
la orden por `RefNumber` o `TxnDate`.

### Estructura del payload — header vs líneas

El Playground envía header y líneas en claves separadas dentro del objeto `data`:
```json
{
  "data": {
    "PurchaseOrderAdd": { ...campos header... },
    "PurchaseOrderLineAdd": { ...una línea... }
  }
}
```
Para múltiples líneas, `PurchaseOrderLineAdd` puede ser un array de objetos.

---

## Tabla de casos de prueba rápidos

| # | Operación | Sede | Payload | Resultado esperado |
|---|-----------|------|---------|-------------------|
| 1 | Query | TEST | `MaxReturned: "1"` | `success: true` + una orden con TxnID/EditSequence |
| 2 | Query | RUS · REC · RBR · RMX | `MaxReturned: "1"` | `success: true` — conectividad confirmada |
| 3 | Add | TEST | Campos completos + línea con ItemRef real + ExpectedDate | `success: true` + TxnID nuevo |
| 4 | Add | TEST | `RefNumber` de 12+ caracteres | `QB-3070` — string too long |
| 5 | Add | TEST | Sin `VendorRef` | `LB-VALIDATION-MISSING_REQUIRED` |
| 6 | Add | TEST | Sin `ExpectedDate` | `LB-VALIDATION-MISSING_REQUIRED` |
| 7 | Add | TEST | Sin línea de detalle | `LB-VALIDATION-MISSING_REQUIRED` |
| 8 | Mod | TEST | TxnID y EditSequence del Add anterior | `success: true` + EditSequence actualizado |
| 9 | Mod | TEST | `EditSequence` desactualizado | `QB-3200` — object modified |
| 10 | Mod | TEST | `TxnID` inexistente | `QB-3120` — transaction not found |

---

## Referencia de errores comunes

| Código | Fuente | Descripción | Solución |
|--------|--------|-------------|----------|
| `QB-3070` | QB Desktop | Campo demasiado largo (típicamente `RefNumber` > 11 chars) | Acortar el valor del campo |
| `QB-3100` | QB Desktop | Registro duplicado — `RefNumber` ya existe | Usar un `RefNumber` único |
| `QB-3120` | QB Desktop | Transacción no encontrada | Verificar que el `TxnID` exista en esa sede |
| `QB-3200` | QB Desktop | `EditSequence` desactualizado | Obtener `EditSequence` fresco con Query previo |
| `QB-3240` | QB Desktop | `ListID` no encontrado en la compañía | Verificar que el ListID exista en esa sede específica |
| `LB-VALIDATION-MISSING_REQUIRED` | LedgerBridge | Faltan campos requeridos (incl. `ExpectedDate`) | Revisar `details.details[]` — indica exactamente qué campos faltan y su origen |
| `MISSING-DATA` | LedgerOps | Payload completamente vacío | Incluir al menos `MaxReturned` u otro filtro |
