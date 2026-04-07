# Sales Order — Referencia para Desarrolladores

**Entidad:** `SalesOrder`
**Operaciones:** Add · Mod · Query
**Audiencia:** Desarrollador
**Actualizado:** 2026-04-07

---

## Tabla de campos requeridos

### SalesOrderAdd — campos requeridos (header)

| Campo | Tipo | Requerido por Intuit | Requerido por sede TEST |
|-------|------|--------------------|------------------------|
| `CustomerRef.ListID` | string | ✅ | ✅ |
| `CustomerRef.FullName` | string | ✅ | ✅ |
| `TemplateRef.ListID` | string | ✅ | ✅ |
| `TemplateRef.FullName` | string | ✅ | ✅ |
| `TxnDate` | string (YYYY-MM-DD) | ✅ | ✅ |
| `RefNumber` | string (máx. 11 chars) | No | ✅ |
| `BillAddress.Addr1` | string | No | ✅ |
| `BillAddress.Addr2` | string | No | ✅ |
| `BillAddress.Addr3` | string | No | ✅ (regla de negocio TEST) |
| `BillAddress.City` | string | No | ✅ |
| `ShipAddress.Addr1` | string | No | ✅ |
| `ShipAddress.Addr2` | string | No | ✅ |
| `ShipAddress.City` | string | No | ✅ |
| `ShipDate` | string (YYYY-MM-DD) | No | ✅ |
| `DueDate` | string (YYYY-MM-DD) | No | ✅ |
| `FOB` | string | No | ✅ |
| `IsToBePrinted` | string (`"true"`/`"false"`) | No | ✅ |
| `IsToBeEmailed` | string (`"true"`/`"false"`) | No | ✅ |
| `IsManuallyClosed` | string (`"true"`/`"false"`) | No | ✅ |
| `ItemSalesTaxRef.ListID` | string | No | ✅ |
| `ItemSalesTaxRef.FullName` | string | No | ✅ |
| `CustomerSalesTaxCodeRef.ListID` | string | No | ✅ |
| `CustomerSalesTaxCodeRef.FullName` | string | No | ✅ |

> `BillAddress.Addr3` es requerido por reglas de negocio de la sede TEST — no es un campo obligatorio de Intuit, pero LedgerBridge lo valida para esta sede.

### SalesOrderAdd — líneas de detalle (SalesOrderLineAdd)

Al menos una línea es obligatoria. Se envía como clave separada dentro del objeto `data`, fuera del objeto `SalesOrderAdd`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ItemRef.ListID` | string | Ítem de inventario o servicio |
| `Quantity` | string | Cantidad |
| `Rate` | string | Precio unitario |
| `SalesTaxCodeRef.ListID` | string | Código de impuesto por línea |

### SalesOrderMod — campos requeridos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `TxnID` | string | ID interno de QB (ej. `626B8-1775501397`) |
| `EditSequence` | string | Token de concurrencia — debe ser el valor **actual** |
| `CustomerRef.ListID` | string | Requerido aunque no cambie |
| `CustomerRef.FullName` | string | Requerido aunque no cambie |
| `TxnDate` | string | Fecha de la orden |
| `RefNumber` | string (máx. 11 chars) | Número de referencia |

> Para modificar líneas de detalle usar `SalesOrderLineMod` con el `TxnLineID` de cada línea (obtenido del Query).

---

## Estructura del payload completo

### Add

```json
{
  "type": "SalesOrderAdd",
  "sede": "TEST",
  "data": {
    "SalesOrderAdd": {
      "CustomerRef":             { "ListID": "800002C4-1597179052", "FullName": "RDX-CUSTOMER-UP-001" },
      "TemplateRef":             { "ListID": "80000011-1597182524", "FullName": "Custom Sales Order" },
      "TxnDate":                 "2026-04-06",
      "RefNumber":               "R021-0001",
      "BillAddress": {
        "Addr1": "1234 Main Street",
        "Addr2": "Suite 500",
        "Addr3": "Section A",
        "City": "Miami",
        "State": "FL",
        "PostalCode": "33101",
        "Country": "USA"
      },
      "ShipAddress": {
        "Addr1": "1234 Main Street",
        "Addr2": "Suite 500",
        "City": "Miami",
        "State": "FL",
        "Country": "USA"
      },
      "ShipDate":                "2026-04-10",
      "DueDate":                 "2026-05-06",
      "FOB":                     "DDP",
      "IsToBePrinted":           "false",
      "IsToBeEmailed":           "false",
      "IsManuallyClosed":        "false",
      "ItemSalesTaxRef":         { "ListID": "80000001-1597179051", "FullName": "IVA-MX" },
      "CustomerSalesTaxCodeRef": { "ListID": "80000001-1597174715", "FullName": "Tax" },
      "TermsRef":                { "ListID": "80000007-1597174729" },
      "SalesRepRef":             { "ListID": "80000007-1630168297" },
      "Memo":                    "Orden generada desde Redix"
    },
    "SalesOrderLineAdd": {
      "ItemRef":         { "ListID": "80000026-1597198891" },
      "Quantity":        "2",
      "Rate":            "130.00",
      "SalesTaxCodeRef": { "ListID": "80000001-1597174715" }
    }
  }
}
```

Para múltiples líneas, `SalesOrderLineAdd` puede ser un array:

```json
"SalesOrderLineAdd": [
  { "ItemRef": { "ListID": "80000026-1597198891" }, "Quantity": "2", "Rate": "130.00" },
  { "ItemRef": { "ListID": "80000027-1597198900" }, "Quantity": "1", "Rate": "250.00" }
]
```

### Mod

```json
{
  "type": "SalesOrderMod",
  "sede": "TEST",
  "data": {
    "SalesOrderMod": {
      "TxnID":        "626B8-1775501397",
      "EditSequence": "1775501419",
      "CustomerRef":  { "ListID": "800002C4-1597179052", "FullName": "RDX-CUSTOMER-UP-001" },
      "TxnDate":      "2026-04-06",
      "RefNumber":    "R021-0001",
      "Memo":         "Actualizado desde Redix",
      "ShipDate":     "2026-04-15"
    }
  }
}
```

### Query

```json
{
  "type": "SalesOrderQuery",
  "sede": "TEST",
  "data": {
    "MaxReturned": "1"
  }
}
```

> **Importante:** `SalesOrderQuery` NO soporta el filtro `ActiveStatus`. Incluirlo retorna `QB-PARSE-ERROR`. Usar `MaxReturned`, `TxnID`, `FromModifiedDate`/`ToModifiedDate`, `RefNumberFilter` o `EntityFilter`.

---

## ListIDs de referencia — sede TEST

| Referencia | ListID | FullName |
|------------|--------|----------|
| CustomerRef | `800002C4-1597179052` | RDX-CUSTOMER-UP-001 |
| TemplateRef | `80000011-1597182524` | Custom Sales Order |
| ItemSalesTaxRef | `80000001-1597179051` | IVA-MX |
| CustomerSalesTaxCodeRef | `80000001-1597174715` | Tax |
| ItemRef (línea) | `80000026-1597198891` | Redil App |
| TermsRef | `80000007-1597174729` | Net 60 |
| SalesRepRef | `80000007-1630168297` | OCR |

> Los ListIDs son específicos por archivo QB Desktop. **No son portables entre sedes.** Obtener los ListIDs de otras sedes con un `SalesOrderQuery` o `ItemInventoryQuery` en cada sede.

**Valores de ejemplo para Mod:**
- `TxnID`: `626B8-1775501397`
- `EditSequence`: `1775501419`

---

## Errores frecuentes

| Código | Causa | Condición que lo dispara | Solución |
|--------|-------|--------------------------|----------|
| `QB-3070` | `RefNumber` excede 11 caracteres | `RefNumber: "TOOLONGREFNUMBER"` | Truncar a máx. 11 chars. `Fill Examples` genera un `RefNumber` válido automáticamente |
| `QB-3100` | `RefNumber` duplicado | Ya existe una SO con ese `RefNumber` en la compañía | Usar `RefNumber` único — `Fill Examples` genera uno basado en timestamp |
| `QB-3120` | `TxnID` no encontrado | `TxnID` no existe en esa sede | Verificar `TxnID` con `SalesOrderQuery` en la misma sede |
| `QB-3200` | `EditSequence` desactualizado | `EditSequence` no coincide con el valor actual en QB | Usar "Obtener EditSequence" en el formulario de Mod antes de enviar |
| `QB-3240` | `ListID` no encontrado en la compañía | `ListID` de otra sede o inválido | Los `ListID` son por compañía — obtener con Query en la sede destino |
| `QB-PARSE-ERROR` | `ActiveStatus` en `SalesOrderQuery` | `ActiveStatus: "ActiveOnly"` en el payload | Eliminar `ActiveStatus`. Usar `MaxReturned` o payload vacío |
| `LB-VALIDATION-MISSING_REQUIRED` | Campo requerido faltante | Sin `CustomerRef`, sin línea de detalle, etc. | Revisar `details.details[]` en la respuesta — lista exactamente qué campos faltan |
| `MISSING-DATA` | Payload de Query completamente vacío | `data: {}` sin ningún campo | Incluir al menos `MaxReturned` o un filtro |

---

## Reglas críticas de negocio

### RefNumber — máximo 11 caracteres

QB Desktop limita `RefNumber` a 11 caracteres. Excederlo lanza `QB-3070` inmediatamente. Diseñar los identificadores de orden respetando este límite. El botón `Fill Examples` genera un `RefNumber` válido por defecto.

### EditSequence — flujo obligatorio en Mod

`EditSequence` es un token de control de concurrencia que QB incrementa en cada modificación. El flujo correcto es:

1. Ejecutar `SalesOrderQuery` con `TxnID` para obtener el `EditSequence` actual
2. Usar ese valor **inmediatamente** en el `SalesOrderMod`

Usar un valor desactualizado retorna `QB-3200`. El formulario de Mod incluye el botón **"Obtener EditSequence"** que automatiza este paso.

### SalesOrderQuery — sin ActiveStatus

A diferencia de otras entidades QB (como `ItemInventory`), `SalesOrderQuery` no acepta el campo `ActiveStatus` como filtro. Incluirlo genera `QB-PARSE-ERROR`. Para limitar resultados usar `MaxReturned`.

### Estructura header vs líneas

El `transformPayload()` del backend separa el payload en dos claves dentro de `data`:
- `SalesOrderAdd` / `SalesOrderMod` → campos del header de la orden
- `SalesOrderLineAdd` / `SalesOrderLineMod` → líneas de detalle

QB Desktop distingue estos dos contextos en el XML. El backend los ensambla correctamente si se envían bajo las claves correctas.
