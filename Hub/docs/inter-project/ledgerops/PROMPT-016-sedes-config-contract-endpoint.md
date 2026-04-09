# PROMPT-LO-016 — Endpoints de configuración de sedes y contrato dinámico

**Fecha:** 2026-03-30
**De:** SyncBridge
**Para:** LedgerOps
**Tipo:** feature
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-RIQ-005](../riq/PROMPT-RIQ-005-dynamic-contracts-migration.md) — RIQ consume los endpoints de este PROMPT para migrar de contratos estáticos a dinámicos

---

## Contexto

RIQ (Redix QB Playground) necesita dos cosas para funcionar correctamente de forma dinámica:

1. Saber qué versión QBXML usa cada sede — hoy lo tiene hardcodeado (`version: "17.0"` para todas)
2. Obtener el contrato de campos por entidad y sede — hoy lo tiene estático en `contracts.ts`

LO es la capa con la que RIQ interactúa. LO debe exponer esta información como endpoints.

---

## Endpoint 1 — Configuración de sedes

### `GET /webhook/sedes`

Retorna la tabla de sedes activas con su configuración QB Desktop.

**Response:**
```json
{
  "success": true,
  "data": {
    "sedes": [
      { "code": "TEST", "label": "TEST — Test Environment", "qbDesktop": "2024", "qbxmlVersion": "17.0", "status": "active" },
      { "code": "RUS",  "label": "RUS — Redsis USA",        "qbDesktop": "2024", "qbxmlVersion": "17.0", "status": "active" },
      { "code": "REC",  "label": "REC — Redsis Ecuador",    "qbDesktop": "2024", "qbxmlVersion": "17.0", "status": "active" },
      { "code": "RBR",  "label": "RBR — Redsis Brasil",     "qbDesktop": "2024", "qbxmlVersion": "17.0", "status": "active" },
      { "code": "RMX",  "label": "RMX — Redsis México",     "qbDesktop": "2021", "qbxmlVersion": "13.0", "status": "active" },
      { "code": "TSI",  "label": "TSI",                     "qbDesktop": null,   "qbxmlVersion": null,   "status": "pending" },
      { "code": "RRC",  "label": "RRC",                     "qbDesktop": null,   "qbxmlVersion": null,   "status": "pending" }
    ]
  }
}
```

**Uso en RIQ:**
- Al cargar el QB Playground, RIQ llama este endpoint una vez
- Construye el selector de sede con los datos reales
- Cuando el usuario selecciona una sede, RIQ conoce automáticamente la versión QBXML
- Sedes con `status: "pending"` se muestran deshabilitadas en el selector

---

## Endpoint 2 — Contrato dinámico por tipo y sede

### `GET /webhook/contracts?type={type}&sede={sede}`

Retorna el contrato de campos para la combinación type + sede. LO consulta internamente a LedgerBridge (`business-rules/get`) para obtener los campos requeridos por sede.

**Ejemplo:**
```
GET /webhook/contracts?type=ItemInventoryAdd&sede=TEST
GET /webhook/contracts?type=ItemInventoryAdd&sede=RMX
```

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "ItemInventoryAdd",
    "sede": "TEST",
    "qbxmlVersion": "17.0",
    "fields": {
      "Name":             { "type": "string",  "required": true },
      "IsActive":         { "type": "string",  "required": false },
      "SalesDesc":        { "type": "string",  "required": true },
      "SalesPrice":       { "type": "string",  "required": true },
      "PurchaseDesc":     { "type": "string",  "required": true },
      "PurchaseCost":     { "type": "string",  "required": true },
      "Max":              { "type": "string",  "required": true },
      "IncomeAccountRef": { "type": "ref",     "required": true  },
      "COGSAccountRef":   { "type": "ref",     "required": true  },
      "AssetAccountRef":  { "type": "ref",     "required": true  },
      "SalesTaxCodeRef":  { "type": "ref",     "required": true  },
      "PrefVendorRef":    { "type": "ref",     "required": false },
      "ReorderPoint":     { "type": "string",  "required": false },
      "QuantityOnHand":   { "type": "string",  "required": false },
      "InventoryDate":    { "type": "string",  "required": false }
    },
    "requiredFields": [
      "Name",
      "SalesDesc",
      "SalesPrice",
      "PurchaseDesc",
      "PurchaseCost",
      "Max",
      "IncomeAccountRef/ListID",
      "COGSAccountRef/ListID",
      "AssetAccountRef/ListID",
      "SalesTaxCodeRef/ListID"
    ]
  }
}
```

**Lógica interna de LO para construir el contrato:**
1. Determinar `qbxmlVersion` a partir de `sede` (usando la misma tabla del Endpoint 1)
2. Llamar `POST /webhook/business-rules/get` en LedgerBridge con `{ type, sede, version }`
3. Los campos en `requiredBusiness` → `required: true` en el contrato
4. Los campos del schema general → `required: false` por defecto
5. Retornar el contrato consolidado

---

## Impacto en RIQ una vez implementado

RIQ migra de `contracts.ts` estático a lógica dinámica:

```
Usuario abre QB Playground
        ↓
RIQ llama GET /webhook/sedes
        ↓
Usuario selecciona entidad + sede (ej. ItemInventoryAdd + RMX)
        ↓
RIQ llama GET /webhook/contracts/ItemInventoryAdd?sede=RMX
        ↓
RIQ construye el form con campos reales + marca requeridos
        ↓
Usuario llena solo los campos que necesita
        ↓
RIQ construye payload con type + sede + version (derivada de sede)
        ↓
POST /webhook/inventory/item/add
```

**Resultado:** El playground siempre muestra los campos correctos para cada entidad y sede — sin hardcoding, sin versiones manuales, sin ListIDs cruzados.

---

## Verificación esperada

LO confirma a SyncBridge cuando ambos endpoints estén activos. SyncBridge emitirá PROMPT-RIQ-005 para que RIQ implemente la migración de estático a dinámico.

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-30 | Emisión | PROMPT emitido a LedgerOps — crear endpoints `GET /webhook/sedes` y `GET /webhook/contracts` para RIQ |
| 2026-03-30 | Resolución | Ambos endpoints activos y verificados |
