# Purchase Order — Referencia para Desarrolladores

**Entidad:** `PurchaseOrder`
**Operaciones:** Add · Mod · Query
**Audiencia:** Desarrollador
**Actualizado:** 2026-04-07

---

## Tabla de campos requeridos

### PurchaseOrderAdd — campos requeridos (header)

| Campo | Tipo | Requerido por Intuit | Requerido por sede TEST |
|-------|------|--------------------|------------------------|
| `VendorRef.ListID` | string | ✅ | ✅ |
| `VendorRef.FullName` | string | ✅ | ✅ |
| `TxnDate` | string (YYYY-MM-DD) | ✅ | ✅ |
| `RefNumber` | string (máx. 11 chars) | No | ✅ |
| `DueDate` | string (YYYY-MM-DD) | No | ✅ |
| `ExpectedDate` | string (YYYY-MM-DD) | No | ✅ (regla de negocio TEST) |
| `VendorAddress.Addr1` | string | No | ✅ |
| `VendorAddress.Addr2` | string | No | ✅ |
| `VendorAddress.Addr3` | string | No | ✅ (regla de negocio TEST) |
| `VendorAddress.City` | string | No | ✅ |
| `ShipAddress.Addr1` | string | No | ✅ |
| `ShipAddress.Addr2` | string | No | ✅ |
| `ShipAddress.City` | string | No | ✅ |
| `IsToBePrinted` | string (`"true"`/`"false"`) | No | ✅ |
| `IsToBeEmailed` | string (`"true"`/`"false"`) | No | ✅ |

> `ExpectedDate` y `VendorAddress.Addr3` son requeridos por reglas de negocio de la sede TEST —
> no son campos obligatorios de Intuit, pero LedgerBridge los valida para esta sede.

### PurchaseOrderAdd — líneas de detalle (PurchaseOrderLineAdd)

Al menos una línea es obligatoria. Se envía como clave separada dentro del objeto `data`, fuera del objeto `PurchaseOrderAdd`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ItemRef.ListID` | string | Ítem de inventario o servicio |
| `Quantity` | string | Cantidad |
| `Rate` | string | Precio unitario |
| `OverrideUOMSetRef.ListID` | string | Unidad de medida (opcional) |
| `Desc` | string | Descripción de la línea (opcional) |

### PurchaseOrderMod — campos requeridos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `TxnID` | string | ID interno de QB (ej. `626C6-1775578032`) |
| `EditSequence` | string | Token de concurrencia — debe ser el valor **actual** |
| `VendorRef.ListID` | string | Requerido aunque no cambie |
| `VendorRef.FullName` | string | Requerido aunque no cambie |
| `TxnDate` | string | Fecha de la orden |
| `ExpectedDate` | string | Requerido por sede TEST aunque no cambie |

> Para modificar líneas de detalle usar `PurchaseOrderLineMod` con el `TxnLineID` de cada línea (obtenido del Query).

---

## Estructura del payload completo

### Add

```json
{
  "type": "PurchaseOrderAdd",
  "sede": "TEST",
  "data": {
    "PurchaseOrderAdd": {
      "VendorRef":     { "ListID": "800001F1-1597178964", "FullName": "REDSIS CORP-USD" },
      "TxnDate":       "2026-04-07",
      "RefNumber":     "PO-0000001",
      "DueDate":       "2026-05-07",
      "ExpectedDate":  "2026-04-14",
      "VendorAddress": {
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
}
```

Para múltiples líneas, `PurchaseOrderLineAdd` puede ser un array:

```json
"PurchaseOrderLineAdd": [
  { "ItemRef": { "ListID": "80000026-1597198891" }, "Quantity": "5", "Rate": "45.00" },
  { "ItemRef": { "ListID": "80000027-1597198900" }, "Quantity": "2", "Rate": "120.00" }
]
```

### Mod

```json
{
  "type": "PurchaseOrderMod",
  "sede": "TEST",
  "data": {
    "PurchaseOrderMod": {
      "TxnID":        "626C6-1775578032",
      "EditSequence": "1775578073",
      "VendorRef":    { "ListID": "800001F1-1597178964", "FullName": "REDSIS CORP-USD" },
      "TxnDate":      "2026-04-07",
      "ExpectedDate": "2026-04-21",
      "Memo":         "Actualizado desde Redix"
    }
  }
}
```

### Query

```json
{
  "type": "PurchaseOrderQuery",
  "sede": "TEST",
  "data": {
    "MaxReturned": "1"
  }
}
```

---

## ListIDs de referencia — sede TEST

| Referencia | ListID | FullName |
|------------|--------|----------|
| VendorRef | `800001F1-1597178964` | REDSIS CORP-USD |
| ItemRef (línea) | `80000026-1597198891` | #2 CLEAR |

> Los ListIDs son específicos por archivo QB Desktop. **No son portables entre sedes.** Obtener los ListIDs de otras sedes con un `PurchaseOrderQuery` o `ItemInventoryQuery` en cada sede.

**Valores de ejemplo para Mod (TEST):**
- `TxnID`: `626C6-1775578032`
- `EditSequence` post-Mod: `1775578073`
- `TxnLineID`: `626C8-1775578032`

---

## Errores frecuentes

| Código | Causa | Condición que lo dispara | Solución |
|--------|-------|--------------------------|----------|
| `QB-3070` | `RefNumber` excede 11 caracteres | `RefNumber: "TOOLONGREFNUMBER"` | Truncar a máx. 11 chars. `Fill Examples` genera un `RefNumber` válido automáticamente |
| `QB-3100` | `RefNumber` duplicado | Ya existe un PO con ese `RefNumber` en la compañía | Usar `RefNumber` único — `Fill Examples` genera uno basado en timestamp |
| `QB-3120` | `TxnID` no encontrado | `TxnID` no existe en esa sede | Verificar `TxnID` con `PurchaseOrderQuery` en la misma sede |
| `QB-3200` | `EditSequence` desactualizado | `EditSequence` no coincide con el valor actual en QB | Usar "Obtener EditSequence" en el formulario de Mod antes de enviar |
| `QB-3240` | `ListID` no encontrado en la compañía | `ListID` de otra sede o inválido | Los `ListID` son por compañía — obtener con Query en la sede destino |
| `LB-VALIDATION-MISSING_REQUIRED` | Campo requerido faltante | Sin `VendorRef`, sin `ExpectedDate`, sin línea de detalle | Revisar `details.details[]` en la respuesta — lista exactamente qué campos faltan |
| `MISSING-DATA` | Payload de Query completamente vacío | `data: {}` sin ningún campo | Incluir al menos `MaxReturned` o un filtro |

---

## Reglas críticas de negocio

### RefNumber — máximo 11 caracteres

QB Desktop limita `RefNumber` a 11 caracteres. Excederlo lanza `QB-3070` inmediatamente.
Diseñar los identificadores de PO respetando este límite. El botón `Fill Examples` genera
un `RefNumber` válido por defecto (`PO-XXXXXXXX` — 11 chars).

### ExpectedDate — requerido por sede TEST

`ExpectedDate` no es un campo obligatorio de Intuit pero la sede TEST lo requiere por sus reglas
de negocio en LedgerBridge. Omitirlo en Add o Mod retorna `LB-VALIDATION-MISSING_REQUIRED`.
El botón `Fill Examples` lo incluye automáticamente (+7 días desde hoy).

### EditSequence — flujo obligatorio en Mod

`EditSequence` es un token de control de concurrencia que QB incrementa en cada modificación. El flujo correcto es:

1. Ejecutar `PurchaseOrderQuery` con `TxnID` para obtener el `EditSequence` actual
2. Usar ese valor **inmediatamente** en el `PurchaseOrderMod`

Usar un valor desactualizado retorna `QB-3200`. El formulario de Mod incluye el botón **"Obtener EditSequence"** que automatiza este paso.

### PurchaseOrderQuery por TxnID — sin líneas

Al filtrar por `TxnID`, QB Desktop retorna el header del PO pero no incluye `PurchaseOrderLineRet`.
Esto es comportamiento nativo de QB para este filtro. Para ver o hidratar líneas, ejecutar un Query
general con `MaxReturned` y localizar la orden por `RefNumber` o `TxnDate`.

### Estructura header vs líneas

El `transformPayload()` del backend separa el payload en dos claves dentro de `data`:
- `PurchaseOrderAdd` / `PurchaseOrderMod` → campos del header del PO
- `PurchaseOrderLineAdd` / `PurchaseOrderLineMod` → líneas de detalle

QB Desktop distingue estos dos contextos en el XML. El backend los ensambla correctamente si se envían bajo las claves correctas.
