# PROMPT-LO-013 — LedgerOps · InventoryTransfer · Entrega

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-27 |
| **Proyecto destino** | LedgerOps |
| **Tipo** | delivery |
| **Estado** | ✅ solved — v1.12.0 (2026-03-27) |

---

## Entidad

**InventoryTransfer** — operaciones Add · Query (QB Desktop no expone Mod)

---

## Archivos a guardar en LedgerOps

### docs/integration/

Guardar los siguientes 6 archivos con el contenido exacto adjunto:

- `docs/integration/developer/InventoryTransfer.md`
- `docs/integration/quickstart/InventoryTransfer.md`
- `docs/integration/architect/InventoryTransfer.md`
- `docs/integration/qa/InventoryTransfer.md`
- `docs/integration/support/InventoryTransfer.md`
- `docs/integration/executive/InventoryTransfer.md`

---

## Business rules registradas

### TransferInventoryAdd — todas las sedes

| Campo | TEST | RUS | REC | RBR | RMX |
|---|---|---|---|---|---|
| `TxnDate` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `RefNumber` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `FromInventorySiteRef/ListID` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `ToInventorySiteRef/ListID` | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Workflows N8N activos

| Workflow | ID N8N | Endpoint |
|---|---|---|
| TransferInventoryAdd | `ITk8Dllh3vHInpEH` | `/webhook/inventory/transfer/add` |
| TransferInventoryQuery | `LCI7zXYd8d8ozcFq` | `/webhook/inventory/transfer/query` |

---

## Verified payload (TC-ADD-01)

```json
{
  "type": "TransferInventoryAdd",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "TxnDate": "2026-03-27",
    "RefNumber": "TRF001",
    "FromInventorySiteRef": { "ListID": "80000001-1607388775" },
    "ToInventorySiteRef": { "ListID": "80000006-1610573894" },
    "TransferInventoryLineAdd": [
      {
        "ItemRef": { "ListID": "800078CB-1597202979" },
        "QuantityToTransfer": "1"
      }
    ]
  }
}
```

TxnID resultado: `6265B-1774597537`

---

## Known issues

- `RefNumber` máximo ~11 caracteres (QB-3070 si es más largo)
- `ItemRef` debe ser ItemInventory — ItemService/NonInventory causan QB-3140
- QB Desktop no expone `TransferInventoryMod`

---

## Acción requerida

1. Guardar los 6 archivos en `docs/integration/`
2. Hacer commit en rama `main`
3. Confirmar versión de tag y commit hash
