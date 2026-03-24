# LedgerOps — Estructura del contrato QB

> Referencia estándar del contrato de operación.
> Todo workflow en LedgerOps tiene un archivo `*.contract.json` que sigue esta estructura.

---

## ¿Qué es el contrato?

El contrato es un archivo JSON de referencia que describe **todo lo necesario para ejecutar una operación en QB Desktop**: qué campos existen, cuáles son obligatorios, y cuál es el payload exacto a enviar.

Cada entidad y operación tiene su propio contrato:
```
workflows/{módulo}/LedgerOps-{EntidadOperación}.contract.json
```

Ejemplos:
- `workflows/inventory/LedgerOps-ItemAdd.contract.json`
- `workflows/inventory/LedgerOps-ItemMod.contract.json`
- `workflows/inventory/LedgerOps-ItemQuery.contract.json`

---

## Estructura — dos secciones

Todo contrato tiene exactamente **dos propiedades en el nivel raíz**:

```json
{
  "info":     { ... },   ← sección informativa — solo para leer
  "contract": { ... }    ← payload real — lo que se envía a LedgerExec
}
```

---

## Sección `info` — referencia informativa

**No se envía.** Es solo para que el desarrollador sepa qué campos son obligatorios y dónde apunta el webhook.

```json
"info": {
  "_nota":    "Sección informativa — no forma parte del payload a enviar.",
  "type":     "ItemInventoryAdd",          ← tipo QB de la operación
  "sede":     "TEST",                      ← sede para la que fue generado
  "version":  "17.0",                      ← versión QBXML
  "object":   "ItemInventoryAdd",          ← objeto QB interno
  "endpoint": "POST /webhook/inventory/item/add",  ← webhook de LedgerOps

  "requiredByIntuit": {
    "_desc": "Campos que QB Desktop rechaza si están vacíos",
    "fields": ["Name"]                     ← QB falla si no vienen
  },

  "requiredBySede": {
    "_desc": "Campos exigidos por reglas de negocio de la sede",
    "fields": []                           ← se llena con AnalyzeSedeFields + business-rules/replace
  }
}
```

### `requiredByIntuit` vs `requiredBySede`

| Campo | Qué significa | Quién lo define |
|-------|--------------|-----------------|
| `requiredByIntuit` | QB Desktop rechaza la operación si estos campos no están presentes | Intuit — universal para todos |
| `requiredBySede` | La sede siempre los usa en sus datos reales — sin ellos el registro queda incompleto para ese negocio | Se descubre con `AnalyzeSedeFields` y se registra en LedgerBridge |

> Un `requiredBySede` vacío significa que aún no se han analizado los datos reales de esa sede.
> Ver proceso en [`feature-dev-process.md`](feature-dev-process.md).

---

## Sección `contract` — el payload real

**Esto es lo que se envía a LedgerExec.** Contiene todos los campos disponibles para la operación con valores vacíos — el desarrollador llena solo los que necesita.

```json
"contract": {
  "type":    "ItemInventoryAdd",     ← mismo que info.type
  "sede":    "TEST",                 ← sede destino
  "version": "17.0",                 ← versión QBXML
  "object":  "ItemInventoryAdd",     ← objeto QB
  "data":    { ... }                 ← campos de la operación (ver variantes abajo)
}
```

---

## Variantes de `data` según tipo de operación

### Add y Mod — `data` envuelto bajo la clave del tipo

Los campos van dentro de una clave con el nombre del tipo (`ItemInventoryAdd`, `ItemInventoryMod`, etc.):

```json
"data": {
  "IncludeRetElement": "",
  "ItemInventoryAdd": {        ← clave = tipo de operación
    "Name": "",
    "SalesPrice": "",
    "IncomeAccountRef": { "FullName": "", "ListID": "" },
    "COGSAccountRef":   { "FullName": "", "ListID": "" },
    "AssetAccountRef":  { "FullName": "", "ListID": "" },
    ...
  }
}
```

**Para Mod**, los campos siempre incluyen `ListID` y `EditSequence` — son los identificadores del registro a modificar:

```json
"data": {
  "ItemInventoryMod": {
    "ListID":       "",    ← identificador del registro en QB
    "EditSequence": "",    ← versión del registro (cambia con cada modificación)
    "Name":         "",
    ...
  }
}
```

### Query — `data` plano, sin clave envolvente

Los campos de filtro van directamente en `data`, sin una clave intermedia:

```json
"data": {
  "ListID":          "",    ← buscar por ID específico
  "FullName":        "",    ← buscar por nombre exacto
  "MaxReturned":     "",    ← límite de resultados
  "ActiveStatus":    "",    ← "All" | "ActiveOnly" | "InactiveOnly"
  "FromModifiedDate": "",
  "ToModifiedDate":   "",
  "NameFilter": {
    "MatchCriterion": "",   ← "StartsWith" | "Contains" | "EndsWith"
    "Name": ""
  },
  ...
}
```

---

## Diferencia clave Add/Mod vs Query

| Aspecto | Add / Mod | Query |
|---------|-----------|-------|
| `object` | `ItemInventoryAdd` / `ItemInventoryMod` | `ItemInventoryQueryRq` (lleva `Rq` al final) |
| `data` | Campos envueltos bajo clave del tipo | Campos planos directamente en `data` |
| Campos obligatorios Add | `Name` + cuentas requeridas | — |
| Campos obligatorios Mod | `ListID` + `EditSequence` + `Name` | — |
| Campos obligatorios Query | — | `NameFilter.Name` (si se usa filtro por nombre) |

---

## Cómo usar el contrato

### 1. Consultar qué campos son obligatorios
Leer `info.requiredByIntuit` y `info.requiredBySede` antes de construir el payload.

### 2. Construir el payload real
Tomar `contract` como plantilla, eliminar los campos que no aplican y llenar los que sí:

```json
{
  "type":    "ItemInventoryAdd",
  "sede":    "TEST",
  "version": "17.0",
  "object":  "ItemInventoryAdd",
  "data": {
    "ItemInventoryAdd": {
      "Name":             "MI-PRODUCTO",
      "SalesPrice":       "25.00",
      "IncomeAccountRef": { "ListID": "80000078-1597178857" },
      "COGSAccountRef":   { "ListID": "8000007C-1597178857" },
      "AssetAccountRef":  { "ListID": "80000034-1597178856" }
    }
  }
}
```

### 3. Enviar al webhook de LedgerOps (NO a LedgerExec directamente)

```bash
curl -X POST https://n8n-development.redsis.ai/webhook/inventory/item/add \
  -H "Content-Type: application/json" \
  -d '{ ...payload del contrato... }'
```

> LedgerOps valida, aplica reglas de negocio y reenvía a LedgerExec.
> El sistema origen **nunca llama a LedgerExec directamente**.

---

## Cómo generar un contrato

Los contratos se generan con la herramienta `GenerateContract`:

```bash
curl -s -X POST https://n8n-development.redsis.ai/webhook/tools/contract \
  -H "Content-Type: application/json" \
  -d '{"type": "ItemInventoryAdd", "sede": "TEST"}'
```

La respuesta incluye exactamente las dos secciones: `data.info` y `data.contract`.

Guardar el resultado en:
```
workflows/{módulo}/LedgerOps-{EntidadOperación}.contract.json
```

---

## Cuándo regenerar el contrato

| Situación | Acción |
|-----------|--------|
| Se agrega una nueva entidad al ecosistema | Generar contrato y guardarlo en el repo |
| Se registran nuevos `requiredBySede` en LedgerBridge | Regenerar — el contrato reflejará los nuevos campos |
| Cambia la versión QBXML de la sede | Regenerar con el nuevo `version` |

---

## Contratos existentes en el repo

| Archivo | Tipo | Operación |
|---------|------|-----------|
| `inventory/LedgerOps-ItemAdd.contract.json` | ItemInventoryAdd | Add |
| `inventory/LedgerOps-ItemMod.contract.json` | ItemInventoryMod | Mod |
| `inventory/LedgerOps-ItemQuery.contract.json` | ItemInventoryQuery | Query |
| `purchasing/LedgerOps-BillAdd.contract.json` | BillAdd | Add |
| `purchasing/LedgerOps-BillMod.contract.json` | BillMod | Mod |
| `purchasing/LedgerOps-PurchaseOrderAdd.contract.json` | PurchaseOrderAdd | Add |
| `sales/LedgerOps-InvoiceAdd.contract.json` | InvoiceAdd | Add |
| `banking/LedgerOps-CreditCardChargeAdd.contract.json` | CreditCardChargeAdd | Add |
| `contacts/LedgerOps-CustomerAdd.contract.json` | CustomerAdd | Add |
| `contacts/LedgerOps-VendorAdd.contract.json` | VendorAdd | Add |
