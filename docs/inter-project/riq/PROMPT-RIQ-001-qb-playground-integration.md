# PROMPT-RIQ-001 — QB Playground · Integración con LedgerOps

**Fecha:** 2026-03-30
**De:** SyncBridge
**Para:** RIQ (redix-integration-quickbooks)
**Tipo:** integration-spec
**Estado:** ✅ solved — 2026-03-30 · TC-01/02/03 pasados · endpoint operativo en TEST

---

## Contexto

El QB Playground en Redix necesita implementar el endpoint backend `POST /api/integration/qb-playground` para enrutar las operaciones QB al ecosistema LedgerOps.

Este documento especifica exactamente cómo debe hacerse esa integración: routing, transformación de payload, URL base, y formato de respuesta.

---

## 1. URL base del ecosistema

```
https://n8n-development.redsis.ai/webhook/
```

**Una sola URL para todas las sedes.** No hay una URL diferente por sede — el campo `sede` va dentro del body del request y LedgerBridge hace el routing interno.

---

## 2. Tabla de routing — type → endpoint

| type | Endpoint LedgerOps |
|---|---|
| `ItemInventoryAdd` | `POST /webhook/inventory/item/add` |
| `ItemInventoryMod` | `POST /webhook/inventory/item/mod` |
| `ItemInventoryQuery` | `POST /webhook/inventory/item/query` |
| `CustomerAdd` | `POST /webhook/contacts/customer/add` |
| `CustomerMod` | `POST /webhook/contacts/customer/mod` |
| `CustomerQuery` | `POST /webhook/contacts/customer/query` |
| `VendorAdd` | `POST /webhook/contacts/vendor/add` |
| `VendorMod` | `POST /webhook/contacts/vendor/mod` |
| `VendorQuery` | `POST /webhook/contacts/vendor/query` |
| `SalesOrderAdd` | `POST /webhook/sales/order/add` |
| `SalesOrderMod` | `POST /webhook/sales/order/mod` |
| `SalesOrderQuery` | `POST /webhook/sales/order/query` |
| `InvoiceAdd` | `POST /webhook/sales/invoice/add` |
| `PurchaseOrderAdd` | `POST /webhook/purchasing/purchase-order/add` |
| `PurchaseOrderMod` | `POST /webhook/purchasing/purchase-order/mod` |
| `PurchaseOrderQuery` | `POST /webhook/purchasing/purchase-order/query` |
| `BillAdd` | `POST /webhook/purchasing/bill/add` |
| `BillMod` | `POST /webhook/purchasing/bill/mod` |
| `CreditCardChargeAdd` | `POST /webhook/banking/credit-card-charge/add` |

> Nota: varios endpoints manejan múltiples tipos (ej. `/webhook/inventory/item/add` atiende ItemInventory, ItemNonInventory e ItemService). Por eso `type` debe enviarse siempre en el body — LedgerOps lo usa para discriminar internamente.

---

## 3. Transformación del payload

### Lo que RIQ genera (frontend → backend RIQ)

```json
{
  "type": "ItemInventoryAdd",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "ItemInventoryAdd": {
      "Name": "IBM 00E9925",
      "SalesDesc": "SAS HDD 300GB"
    }
  }
}
```

Para transacciones con líneas (SalesOrder, Invoice, Bill, PurchaseOrder, CreditCardCharge):

```json
{
  "type": "SalesOrderAdd",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "SalesOrderAdd": {
      "CustomerRef": { "ListID": "80000001-1234567890" },
      "TxnDate": "2026-03-30"
    },
    "SalesOrderLineAdd": [
      { "ItemRef": { "ListID": "80000026-1597198891" }, "Quantity": "5" }
    ]
  }
}
```

### Lo que LedgerOps espera (backend RIQ → n8n)

```json
{
  "type": "ItemInventoryAdd",
  "sede": "TEST",
  "data": {
    "Name": "IBM 00E9925",
    "SalesDesc": "SAS HDD 300GB"
  }
}
```

Con líneas:

```json
{
  "type": "SalesOrderAdd",
  "sede": "TEST",
  "data": {
    "CustomerRef": { "ListID": "80000001-1234567890" },
    "TxnDate": "2026-03-30",
    "SalesOrderLineAdd": [
      { "ItemRef": { "ListID": "80000026-1597198891" }, "Quantity": "5" }
    ]
  }
}
```

### Algoritmo de transformación (pseudocódigo)

```typescript
function transformPayload(riqPayload) {
  const { type, sede, data } = riqPayload;
  // version NO se envía — LedgerBridge la deriva de sede internamente

  // Extraer campos del header (están bajo data[type])
  const headerFields = data[type] ?? {};

  // Extraer líneas (cualquier otra key en data distinta al type)
  const lineEntries = Object.entries(data).filter(([key]) => key !== type);
  const lineData = Object.fromEntries(lineEntries);

  // Merge: header + líneas en un solo objeto data
  const ledgerOpsData = { ...headerFields, ...lineData };

  return {
    type,
    sede,
    data: ledgerOpsData,
  };
}
```

**Puntos clave:**
- `version` se elimina — no se envía a LedgerOps
- `data[type]` se desempaqueta (spread) en `data` plano
- Las líneas (ej. `SalesOrderLineAdd`) se mantienen como array dentro de `data`
- `type` y `sede` se conservan tal cual

---

## 4. Formatos de respuesta de LedgerOps

LedgerOps retorna dos formatos distintos según el resultado.

### Éxito

```json
{
  "success": true,
  "data": {
    "ItemInventoryRet": {
      "ListID": "80000026-1597198891",
      "Name": "#2 CLEAR",
      "EditSequence": "1597198891"
    }
  },
  "metadata": {
    "processedAt": "2026-03-30T15:42:54.808Z",
    "operationType": "ItemInventoryQueryRs",
    "itemsProcessed": 1
  }
}
```

### Error de validación / negocio

```json
{
  "ok": false,
  "httpStatus": 400,
  "code": "MISSING-SEDE",
  "message": "sede is required"
}
```

> **Importante:** Los dos formatos son inconsistentes (`success` vs `ok`). El backend de RIQ debe detectar cuál recibió y normalizarlo al envelope estándar de Redix antes de responder al frontend.

### Códigos de error conocidos

| code | Descripción |
|---|---|
| `MISSING-SEDE` | El campo `sede` no fue enviado |
| `MISSING-DATA` | El campo `data` está vacío o ausente |
| `INVALID-ITEM-TYPE` | El `type` no corresponde al endpoint (ej. enviar CustomerAdd a `/webhook/inventory/item/add`) |
| `LB-VALIDATION-MISSING_REQUIRED` | Faltan campos requeridos según business rules de LedgerBridge |
| `QB-3180` | Error QB — entidad requiere al menos una línea de detalle |
| `QB-PARSE-ERROR` | Error QB — payload QBXML malformado |

---

## 5. Normalización de respuesta hacia el frontend de RIQ

El backend de RIQ debe normalizar la respuesta de LedgerOps al envelope estándar de Redix:

```typescript
// Si LedgerOps retorna éxito ({ success: true, data, metadata })
return {
  success: true,
  data: ledgerOpsResponse.data,
  meta: ledgerOpsResponse.metadata,
};

// Si LedgerOps retorna error ({ ok: false, code, message })
throw new AppException(
  ledgerOpsResponse.code,       // errorCode
  ledgerOpsResponse.message,    // message
  ledgerOpsResponse.httpStatus, // httpStatus
);
```

---

## 6. Consideraciones adicionales

### Autenticación
Los webhooks de LedgerOps no requieren autenticación en la capa HTTP — la seguridad se gestiona a nivel de red (acceso restringido). El backend de RIQ llama directamente a la URL.

### Timeout
Las operaciones QB Desktop pueden tardar entre 2-10 segundos dependiendo de la carga. Configurar timeout mínimo de **15 segundos** en el HTTP client.

### Sede RMX — QBXML v13.0
La sede RMX usa QB Desktop 2021 (QBXML v13.0). LedgerBridge maneja el remapeo de versión internamente. RIQ no necesita hacer nada especial para RMX — solo enviar `sede: "RMX"` y el ecosistema se encarga.

---

## 7. Ejemplo completo — flujo end-to-end

**Frontend RIQ → Backend RIQ:**
```
POST /api/integration/qb-playground
{
  "type": "ItemInventoryQuery",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "ItemInventoryQuery": {
      "MaxReturned": "5"
    }
  }
}
```

**Backend RIQ → LedgerOps (después de transformación):**
```
POST https://n8n-development.redsis.ai/webhook/inventory/item/query
{
  "type": "ItemInventoryQuery",
  "sede": "TEST",
  "data": {
    "MaxReturned": "5"
  }
}
```

**LedgerOps → Backend RIQ:**
```json
{
  "success": true,
  "data": { "ItemInventoryRet": { ... } },
  "metadata": { "processedAt": "...", "operationType": "ItemInventoryQueryRs", "itemsProcessed": 1 }
}
```

**Backend RIQ → Frontend RIQ (normalizado):**
```json
{
  "success": true,
  "data": { "ItemInventoryRet": { ... } },
  "meta": { "processedAt": "...", "operationType": "ItemInventoryQueryRs", "itemsProcessed": 1 }
}
```

---

## 8. Comunicación con SyncBridge

**SyncBridge es el punto de contacto único para todo lo relacionado con LedgerOps.** RIQ no debe contactar directamente a LedgerOps ni a LedgerBridge.

### RIQ debe reportar a SyncBridge cuando:

| Situación | Qué reportar |
|---|---|
| Error desconocido de LedgerOps | `code` + `message` recibidos + payload enviado |
| Comportamiento inesperado de QB | Respuesta completa de LedgerOps + sede + type |
| Se necesita un endpoint nuevo | Entidad + operación (Add/Mod/Query) requerida |
| Inconsistencia en esta especificación | Sección + comportamiento observado vs esperado |

### SyncBridge responderá con:

- Corrección o aclaración de la spec (actualización de este PROMPT)
- Nuevo PROMPT si se requiere una entidad adicional en LedgerOps
- Escalamiento a LedgerBridge si el problema está en la capa inferior

### No está en scope de este PROMPT (pendiente):

- **Contratos por entidad** (campos disponibles por tipo): bloqueado por PROMPT-006 en LedgerBridge. Cuando se resuelva, SyncBridge emitirá PROMPT-RIQ-002 con contratos completos por entidad y sede.
- **Sedes TSI y RRC**: pendientes de configuración en LedgerBridge — no operativas aún.
