# PROMPT-RIQ-045 — RIQ · ItemService + ItemNonInventory · Docs por rol QB Playground

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-15 |
| **Proyecto destino** | RIQ |
| **Tipo** | docs |
| **Estado** | ✅ solved — 12 docs entregados · pendiente PROMPT a LO |

---

## Contexto

`ItemService` e `ItemNonInventory` están completamente integrados en el QB Playground — routing, templates, Fill Examples y E2E verificados (AMQ exitoso en TEST). El siguiente paso es la documentación por rol para publicación en LedgerOps.

---

## Acción requerida

Entregar 6 documentos en Markdown para cada entidad (12 en total), siguiendo el mismo formato y estructura de las entidades ya entregadas (Bill, Invoice, CreditCardCharge, etc.).

### Estructura por entidad

```
docs/integration/
├── quickstart/      ItemService.md      ItemNonInventory.md
├── executive/       ItemService.md      ItemNonInventory.md
├── developer/       ItemService.md      ItemNonInventory.md
├── architect/       ItemService.md      ItemNonInventory.md
├── qa/              ItemService.md      ItemNonInventory.md
└── support/         ItemService.md      ItemNonInventory.md
```

### Contexto relevante por entidad

**ItemService**
- Operaciones: Add · Mod · Query
- Sede TEST verificada · mismas rutas que ItemInventory (`/webhook/inventory/item/*`)
- Campos requeridos por Intuit: `Name`
- Campos template Add: Name, IsActive, SalesTaxCodeRef.ListID, SalesOrPurchase.Desc, SalesOrPurchase.Price, SalesOrPurchase.AccountRef.ListID
- Fill Example Add: `RDX-SVC-001` · tax `80000002` · account `80000078` · price `100.00`
- Fill Example Mod: ListID `80009958-1776193394` · price `150.00`

**ItemNonInventory**
- Operaciones: Add · Mod · Query
- Sede TEST verificada · mismas rutas que ItemInventory (`/webhook/inventory/item/*`)
- Campos requeridos por Intuit: `Name`
- Campos template Add: Name, IsActive, SalesTaxCodeRef.ListID, SalesOrPurchase.Desc, SalesOrPurchase.Price, SalesOrPurchase.AccountRef.ListID
- SalesTaxCodeRef.ListID en TEST: `80000001-1597174715` (distinto a ItemService)
- Fill Example Mod: datos reales TEST cargados en commit `babc414`

---

## Formato de entrega

Entregar el contenido de los 12 archivos directamente en la respuesta a FL (en Markdown). FL generará el PROMPT a LO para publicarlos.

No es necesario hacer commit en RIQ para los docs — LO es quien los publica en su repo.

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-15 | Emisión | Docs por rol para ItemService e ItemNonInventory — E2E verificado · ambas entidades listas |
| 2026-04-15 | Completado RIQ | 12 docs entregados (6 por entidad) · sin commit en RIQ · branch: feature/redix-integration-quickbooks-playground · último commit: babc414 |
