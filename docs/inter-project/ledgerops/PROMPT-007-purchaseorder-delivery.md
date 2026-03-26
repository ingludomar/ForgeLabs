# PROMPT-007 — LedgerOps · Entrega PurchaseOrder

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-25 |
| **Proyecto destino** | LedgerOps |
| **Tipo** | delivery |
| **Estado** | ✅ solved — v1.7.0 (2026-03-25) |

---

## Contexto

P0-P4 completados para PurchaseOrder. El workflow Add ya existía en LO pero usaba un formato de payload desactualizado — fue corregido como parte de esta entrega.

---

## Acción requerida

### 1. Actualizar workflow existente

**Archivo:** `workflows/purchasing/LedgerOps-PurchaseOrderAdd.workflow.json`

El nodo `Code — Validate Type` debe actualizarse. Reemplazar la línea del return con:

```javascript
const objectName = type + 'Rq';
return [{ json: { ok: true, payload: { type: type, sede: sede, version: version, object: objectName, data: { [objectName]: { [type]: body.data } } } } }];
```

> El workflow en N8N (ID: `cAQkiczW7gRV5Air`) ya fue actualizado. Solo aplicar el cambio en el archivo JSON del repo.

---

### 2. Agregar workflows nuevos

Ubicación: `workflows/purchasing/`

| Archivo | N8N ID | Webhook path |
|---|---|---|
| `LedgerOps-PurchaseOrderMod.workflow.json` | `tSDf8lBe6fdGM2ag` | `purchasing/purchase-order/mod` |
| `LedgerOps-PurchaseOrderQuery.workflow.json` | `svnpXVNzn6SrILNw` | `purchasing/purchase-order/query` |

Los archivos JSON están en `SyncBridge/production/purchasing/`.

---

### 3. Agregar documentación por rol

Ubicación: `docs/integration/`

| Rol | Archivo |
|---|---|
| Quickstart | `quickstart/PurchaseOrder.md` |
| Executive | `executive/PurchaseOrder.md` |
| Developer | `developer/PurchaseOrder.md` |
| Architect | `architect/PurchaseOrder.md` |
| QA | `qa/PurchaseOrder.md` |
| Support | `support/PurchaseOrder.md` |

El contenido de los 6 archivos está incluido a continuación.

---

## Business rules registradas

**PurchaseOrderAdd** (TEST · RUS · REC · RBR · RMX):
```
VendorRef/ListID · DueDate · ExpectedDate · IsToBePrinted · IsToBeEmailed
```

**PurchaseOrderMod** (TEST · RUS · REC · RBR · RMX):
```
VendorRef/ListID · RefNumber · DueDate · ExpectedDate
```

---

## Known issues

- `IsManuallyClosed` es Rs-only en PurchaseOrderAdd (no puede enviarse en Add, solo en Mod).
- PROMPT-006 LedgerBridge: requiredBySede vacío en GenerateContract (bug conocido, pendiente).

---

## Respuesta esperada

Confirmación de commit aplicado y workflows activos en N8N producción.
