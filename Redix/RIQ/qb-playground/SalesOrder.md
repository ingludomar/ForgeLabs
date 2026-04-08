# QB Playground — Sales Order

**Entidad:** `SalesOrder` (Orden de Venta)
**Operaciones disponibles:** Add · Mod · Query
**Versiones QBXML:** 17.0 (TEST · RUS · REC · RBR) · 13.0 (RMX)

---

## Descripción general

`SalesOrder` representa una orden de venta en QuickBooks Desktop. Es el documento que precede
a la factura (`Invoice`) — registra el compromiso de venta con el cliente antes de que los
bienes sean despachados o facturados. Cada orden requiere al menos un cliente, una línea de
detalle con ítem y cantidad, y campos de dirección de facturación y envío.

El `RefNumber` es el número de referencia visible para el cliente (equivalente al número de
orden). Tiene un límite de **11 caracteres** en QB Desktop — excederlo retorna QB-3070.

---

## Cómo acceder al Playground

1. Ir a **Configuración → Integraciones → QB Playground**
2. En la sección **Sales**, seleccionar la operación (`Sales Order — Add`, `Mod` o `Query`)
3. Seleccionar la **Sede**
4. Completar el formulario y ejecutar con **Run**

> Si existe un template para la combinación tipo+sede, el formulario mostrará solo los campos
> del template. Usar el selector en el action bar para cambiar o elegir "Todos los campos".

---

## Estado por sede (smoke tests 2026-04-06)

| Operación | TEST | RUS | REC | RBR | RMX |
|-----------|------|-----|-----|-----|-----|
| **Query** | ✅ OK | ✅ OK | ✅ OK | ✅ OK | ✅ OK |
| **Add** | ✅ OK | — | — | — | — |
| **Mod** | ✅ OK | — | — | — | — |

> **Metodología:** CRUD completo en TEST · solo Query en producción.
> Los ListIDs se obtuvieron con un Query previo a cada sede.

---

## SalesOrderAdd

### Campos requeridos (header)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `CustomerRef.ListID` | ref | Identificador QB del cliente |
| `CustomerRef.FullName` | ref | Nombre completo del cliente |
| `TemplateRef.ListID` | ref | Plantilla de impresión QB |
| `TemplateRef.FullName` | ref | Nombre de la plantilla |
| `TxnDate` | string | Fecha de la orden (YYYY-MM-DD) |
| `RefNumber` | string | Número de referencia — **máx. 11 caracteres** |
| `BillAddress.Addr1` | string | Dirección de facturación línea 1 |
| `BillAddress.Addr2` | string | Dirección de facturación línea 2 |
| `BillAddress.Addr3` | string | Dirección de facturación línea 3 |
| `BillAddress.City` | string | Ciudad de facturación |
| `ShipAddress.Addr1` | string | Dirección de envío línea 1 |
| `ShipAddress.Addr2` | string | Dirección de envío línea 2 |
| `ShipAddress.City` | string | Ciudad de envío |
| `ShipDate` | string | Fecha de envío (YYYY-MM-DD) |
| `DueDate` | string | Fecha de vencimiento (YYYY-MM-DD) |
| `FOB` | string | Términos de envío (ej. `"DDP"`, `"FOB"`) |
| `IsToBePrinted` | string | `"true"` / `"false"` |
| `IsToBeEmailed` | string | `"true"` / `"false"` |
| `IsManuallyClosed` | string | `"true"` / `"false"` |
| `ItemSalesTaxRef.ListID` | ref | Impuesto de venta aplicado al total |
| `ItemSalesTaxRef.FullName` | ref | Nombre del impuesto |
| `CustomerSalesTaxCodeRef.ListID` | ref | Código fiscal del cliente |
| `CustomerSalesTaxCodeRef.FullName` | ref | Nombre del código fiscal |

### Líneas de detalle (SalesOrderLineAdd)

Al menos una línea es requerida. Los campos se envían bajo la clave `SalesOrderLineAdd` en el
objeto `data`, fuera del objeto `SalesOrderAdd`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ItemRef.ListID` | ref | Ítem de inventario o servicio |
| `Quantity` | string | Cantidad |
| `Rate` | string | Precio unitario |
| `SalesTaxCodeRef.ListID` | ref | Código de impuesto por línea |

### Campos opcionales (header)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Memo` | string | Nota interna |
| `PONumber` | string | Número de orden de compra del cliente |
| `ShipMethodRef.ListID` | ref | Método de envío |
| `TermsRef.ListID` | ref | Condiciones de pago |
| `SalesRepRef.ListID` | ref | Representante de ventas |
| `ClassRef.ListID` | ref | Clase contable |
| `CustomerMsgRef.ListID` | ref | Mensaje al cliente |
| `ExchangeRate` | string | Tipo de cambio (transacciones en moneda extranjera) |
| `IsTaxIncluded` | string | Impuesto incluido en el precio |
| `ExternalGUID` | string | Identificador externo |

### Fill Examples (valores de referencia para TEST)

```json
{
  "SalesOrderAdd": {
    "CustomerRef":              { "ListID": "800002C4-1597179052", "FullName": "RDX-CUSTOMER-UP-001" },
    "TemplateRef":              { "ListID": "80000011-1597182524", "FullName": "Custom Sales Order" },
    "TxnDate":                  "2026-04-06",
    "RefNumber":                "R021-0001",
    "BillAddress": {
      "Addr1": "1234 Main Street", "Addr2": "Suite 500",
      "Addr3": "Section A", "City": "Miami",
      "State": "FL", "PostalCode": "33101", "Country": "USA"
    },
    "ShipAddress": {
      "Addr1": "1234 Main Street", "Addr2": "Suite 500",
      "City": "Miami", "State": "FL", "Country": "USA"
    },
    "ShipDate":                 "2026-04-10",
    "DueDate":                  "2026-05-06",
    "FOB":                      "DDP",
    "IsToBePrinted":            "false",
    "IsToBeEmailed":            "false",
    "IsManuallyClosed":         "false",
    "ItemSalesTaxRef":          { "ListID": "80000001-1597179051", "FullName": "IVA-MX" },
    "CustomerSalesTaxCodeRef":  { "ListID": "80000001-1597174715", "FullName": "Tax" }
  },
  "SalesOrderLineAdd": {
    "ItemRef":          { "ListID": "80000026-1597198891" },
    "Quantity":         "2",
    "Rate":             "130.00",
    "SalesTaxCodeRef":  { "ListID": "80000001-1597174715" }
  }
}
```

> Los `ListID` son específicos por compañía QB. Obtenerlos con `SalesOrderQuery` o
> `ItemInventoryQuery` en cada sede.

### Resultado esperado

```json
{
  "success": true,
  "data": {
    "SalesOrderRet": {
      "TxnID": "626B8-XXXXXXXXXX",
      "TimeCreated": "2026-04-06T...",
      "EditSequence": "1775XXXXXXX",
      "RefNumber": "R021-0001",
      "CustomerRef": { "ListID": "...", "FullName": "RDX-CUSTOMER-UP-001" },
      ...
    }
  }
}
```

---

## SalesOrderMod

### Campos requeridos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `TxnID` | string | Identificador de la transacción — obtenido de Add o Query |
| `EditSequence` | string | Token de concurrencia — debe ser el valor actual |
| `CustomerRef.ListID` | ref | Cliente (requerido aunque no cambie) |
| `CustomerRef.FullName` | ref | Nombre del cliente |
| `TxnDate` | string | Fecha de la orden |
| `RefNumber` | string | Número de referencia |

> **`EditSequence` es dinámico**: QB lo incrementa en cada modificación. Usar un valor
> desactualizado retorna QB-3200. El flujo correcto es:
> 1. `SalesOrderQuery` con `TxnID` → obtener `EditSequence` actual
> 2. Usar ese valor inmediatamente en el `SalesOrderMod`

### Campos opcionales en Mod

Cualquier campo del header de Add puede modificarse. Para modificar líneas de detalle usar
`SalesOrderLineMod` con el `TxnLineID` de cada línea (obtenido del Query).

### Fill Examples

```json
{
  "SalesOrderMod": {
    "TxnID":        "<obtener de Query o Add>",
    "EditSequence": "<obtener de Query o Add>",
    "CustomerRef":  { "ListID": "800002C4-1597179052", "FullName": "RDX-CUSTOMER-UP-001" },
    "TxnDate":      "2026-04-06",
    "RefNumber":    "R021-0001",
    "Memo":         "Actualizado desde Redix",
    "ShipDate":     "2026-04-15"
  }
}
```

### Resultado esperado

```json
{
  "success": true,
  "data": {
    "SalesOrderRet": {
      "TxnID": "626B8-XXXXXXXXXX",
      "EditSequence": "1775XXXXXXX",
      "Memo": "Actualizado desde Redix",
      ...
    }
  }
}
```

---

## SalesOrderQuery

### Nota sobre el payload

A diferencia de otras entidades, `SalesOrderQuery` acepta un objeto vacío y retorna todos los
registros (limitado por `MaxReturned`). En inventarios grandes usar `MaxReturned` para evitar
timeouts.

### Campos de filtro disponibles

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `MaxReturned` | string | Límite de resultados — recomendado en producción |
| `FromModifiedDate` | string | Filtro por fecha de modificación desde (YYYY-MM-DD) |
| `ToModifiedDate` | string | Filtro por fecha de modificación hasta (YYYY-MM-DD) |
| `TxnID` | string | Buscar una orden específica por ID interno |
| `RefNumberFilter` | object | `{"MatchCriterion": "StartsWith", "RefNumber": "R021-"}` |
| `EntityFilter` | object | `{"ListID": "<CustomerListID>"}` — órdenes de un cliente |

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
    "SalesOrderRet": [
      {
        "TxnID": "626B8-XXXXXXXXXX",
        "EditSequence": "1775XXXXXXX",
        "RefNumber": "R021-0001",
        "TxnDate": "2026-04-06",
        "CustomerRef": { "ListID": "...", "FullName": "..." },
        "BillAddress": { ... },
        "ShipAddress":  { ... },
        "SalesOrderLineRet": [ ... ]
      }
    ]
  }
}
```

---

## Notas importantes

### RefNumber — límite de 11 caracteres

QB Desktop limita `RefNumber` a 11 caracteres. Excederlo retorna **QB-3070**. Diseñar los
números de referencia teniendo en cuenta este límite.

### TxnID vs RefNumber

`TxnID` es el identificador interno de QB (ej. `626B8-1775501397`) — se usa en Mod y para
relacionar documentos. `RefNumber` es el número visible al cliente. Ambos se obtienen de la
respuesta de Add o de un Query.

### ListIDs son específicos por compañía

Los `ListID` de CustomerRef, TemplateRef, ItemSalesTaxRef, etc. son internos de cada archivo
QB Desktop y no son portables entre sedes. Obtener los ListIDs correctos ejecutando un
`SalesOrderQuery` en cada sede y extrayendo los valores de una orden existente.

### EditSequence en Mod

`EditSequence` es un token de control de concurrencia que QB incrementa en cada modificación.
Si el valor enviado no coincide con el actual, QB retorna **QB-3200** (object modified).
Siempre obtener el `EditSequence` fresco con un Query inmediatamente antes del Mod.

### Estructura del payload — header vs líneas

El Playground envía header y líneas en claves separadas dentro del objeto `data`:
```json
{
  "data": {
    "SalesOrderAdd": { ...campos header... },
    "SalesOrderLineAdd": { ...una línea... }
  }
}
```
Para múltiples líneas, `SalesOrderLineAdd` puede ser un array de objetos.

---

## Tabla de casos de prueba rápidos

| # | Operación | Sede | Payload | Resultado esperado |
|---|-----------|------|---------|-------------------|
| 1 | Query | TEST | `MaxReturned: "1"` | `success: true` + una orden con TxnID/EditSequence |
| 2 | Query | RUS · REC · RBR · RMX | `MaxReturned: "1"` | `success: true` — conectividad confirmada |
| 3 | Add | TEST | Campos completos + línea con ItemRef real | `success: true` + TxnID nuevo |
| 4 | Add | TEST | `RefNumber` de 12+ caracteres | `QB-3070` — string too long |
| 5 | Add | TEST | Sin `CustomerRef` | `LB-VALIDATION-MISSING_REQUIRED` |
| 6 | Add | TEST | Sin línea de detalle | `LB-VALIDATION-MISSING_REQUIRED` |
| 7 | Mod | TEST | TxnID y EditSequence del Add anterior | `success: true` + EditSequence actualizado |
| 8 | Mod | TEST | `EditSequence` desactualizado | `QB-3200` — object modified |
| 9 | Mod | TEST | `TxnID` inexistente | `QB-3120` — transaction not found |
| 10 | Mod | TEST | Sin `CustomerRef` ni `TxnDate` | `LB-VALIDATION-MISSING_REQUIRED` |

---

## Referencia de errores comunes

| Código | Fuente | Descripción | Solución |
|--------|--------|-------------|----------|
| `QB-3070` | QB Desktop | Campo demasiado largo (típicamente `RefNumber` > 11 chars) | Acortar el valor del campo |
| `QB-3100` | QB Desktop | Registro duplicado — `RefNumber` ya existe | Usar un `RefNumber` único |
| `QB-3120` | QB Desktop | Transacción no encontrada | Verificar que el `TxnID` exista en esa sede |
| `QB-3200` | QB Desktop | `EditSequence` desactualizado | Obtener `EditSequence` fresco con Query previo |
| `QB-3240` | QB Desktop | `ListID` no encontrado en la compañía | Verificar que el ListID exista en esa sede específica |
| `LB-VALIDATION-MISSING_REQUIRED` | LedgerBridge | Faltan campos requeridos | Revisar `details.details[]` — indica exactamente qué campos faltan y su origen |
| `MISSING-DATA` | LedgerOps | Payload completamente vacío | Incluir al menos `MaxReturned` u otro filtro |
| `QB-PARSE-ERROR` | LedgerBridge | QB respondió con XML no estándar | Verificar `ActiveStatus` en el filtro; el agente puede estar retornando formato inesperado |
