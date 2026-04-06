# PROMPT-LO-014 — LedgerOps · Assembly · Entrega

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-27 |
| **Proyecto destino** | LedgerOps |
| **Tipo** | delivery |
| **Estado** | ✅ solved — v1.13.0 (2026-03-27) |

---

## Entidad

**Assembly (BuildAssembly)** — operaciones Add · Mod · Query

---

## Archivos a guardar en LedgerOps

### docs/integration/

Guardar los siguientes 6 archivos con el contenido exacto adjunto:

- `docs/integration/developer/Assembly.md`
- `docs/integration/quickstart/Assembly.md`
- `docs/integration/architect/Assembly.md`
- `docs/integration/qa/Assembly.md`
- `docs/integration/support/Assembly.md`
- `docs/integration/executive/Assembly.md`

---

## Business rules registradas

### BuildAssemblyAdd — todas las sedes

| Campo | TEST | RUS | REC | RBR | RMX |
|---|---|---|---|---|---|
| `ItemInventoryAssemblyRef/ListID` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `TxnDate` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `QuantityToBuild` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `RefNumber` | ✅ | ✅ | ✅ | ✅ | ✅ |

### BuildAssemblyMod — todas las sedes

| Campo | TEST | RUS | REC | RBR | RMX |
|---|---|---|---|---|---|
| `TxnID` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `EditSequence` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `TxnDate` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `QuantityToBuild` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `RefNumber` | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Workflows N8N activos

| Workflow | ID N8N | Endpoint |
|---|---|---|
| BuildAssemblyAdd | `lN5uKrOpfLz1Z0wT` | `/webhook/inventory/assembly/add` |
| BuildAssemblyMod | `0iTkdwSH8O6nZ7uV` | `/webhook/inventory/assembly/mod` |
| BuildAssemblyQuery | `dHr98MHz8RXEw7ID` | `/webhook/inventory/assembly/query` |

---

## Verified payload (TC-ADD-01)

```json
{
  "type": "BuildAssemblyAdd",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "ItemInventoryAssemblyRef": { "ListID": "80009375-1635546523" },
    "InventorySiteRef": { "ListID": "80000001-1607388775" },
    "TxnDate": "2026-03-27",
    "RefNumber": "ASM001",
    "QuantityToBuild": "1",
    "MarkPendingIfRequired": "false"
  }
}
```

TxnID resultado: `6265F-1774597585`

---

## Known issues

- `MarkPendingIfRequired` es obligatorio en Add (requerido por QuickBooks/Intuit) — siempre incluirlo
- `MarkPendingIfRequired: "false"` falla si no hay stock suficiente — usar `"true"` en ese caso
- `EditSequence` en Mod debe estar vigente — consultar antes de modificar

---

## Acción requerida

1. Guardar los 6 archivos en `docs/integration/`
2. Hacer commit en rama `main`
3. Confirmar versión de tag y commit hash

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-27 | Emisión | PROMPT emitido a LedgerOps — entrega de Assembly/BuildAssembly (Add · Mod · Query) con docs de 6 roles |
| 2026-03-27 | Resolución | Docs aplicados al repo (v1.13.0) |
