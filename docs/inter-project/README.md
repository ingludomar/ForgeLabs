# Inter-Project Prompts — SyncBridge Ecosystem

LedgerOps es la capa más alta del ecosistema SyncBridge. Este directorio
registra todos los requerimientos, bugs y mejoras enviados a proyectos
dependientes, con su evidencia técnica, estado de resolución y referencia
a Monday.com.

> Cada vez que LedgerOps detecta un hallazgo que requiere acción en otro
> proyecto, se crea un documento aquí antes de emitir el prompt.

---

## Índice maestro

| ID | Fecha | Proyecto | Tipo | Entidad | Asunto | Estado |
|---|---|---|---|---|---|---|
| [PROMPT-001](ledgerbridge/PROMPT-001-xml-field-ordering.md) | 2026-03-13 | LedgerBridge | bug | ItemInventoryAdd | XML field ordering — QB rechazaba campos opcionales fuera de orden | ✅ solved |
| [PROMPT-002](ledgerbridge/PROMPT-002-barcode-schema.md) | 2026-03-17 | LedgerBridge | improvement | ItemNonInventoryAdd (41 tipos afectados) | BarCode contenedor `required` con todos sus hijos `optional` no debe ser enforced | ✅ solved |
| [PROMPT-003](ledgerbridge/PROMPT-003-noninventory-schema.md) | 2026-03-17 | LedgerBridge | feature | ItemNonInventoryAdd + roadmap | describe.json faltante — source XML no cargado para tipos del roadmap | ✅ solved |
| [PROMPT-004](ledgerbridge/PROMPT-004-noninventory-elementorder.md) | 2026-03-19 | LedgerBridge | bug | ItemNonInventoryMod / ItemServiceMod | QB-PARSE-ERROR — asimetría Rq/Rs en nombres de elementos QBXML SDK | ✅ cerrado (no es bug LB) |
| [PROMPT-005](ledgerbridge/PROMPT-005-semver-versioning.md) | 2026-03-19 | LedgerBridge | convention | — | Adoptar SemVer como esquema oficial de versioning | ✅ solved |
| [PROMPT-006](ledgerbridge/PROMPT-006-generatecontract-requiredbysede.md) | 2026-03-19 | LedgerBridge | bug | GenerateContract | requiredBySede vacío aunque reglas estén registradas en business-rules | ⏳ pending |
| [PROMPT-007](ledgerbridge/PROMPT-007-rmx-sede-schema.md) | 2026-03-20 | LedgerBridge | feature | Sede RMX · ItemInventory | Soporte QBXML v13.0 para QB Desktop 2021 — mapeo sede→versión implementado | ✅ solved |
| [PROMPT-009](ledgerbridge/PROMPT-009-noninventory-rmx-schema.md) | 2026-03-23 | LedgerBridge | feature | Sede RMX · ItemNonInventory | Schemas v13.0 para ItemNonInventoryAdd/Mod/Query — mismo patrón que ItemInventory | ✅ solved |
| [PROMPT-010](ledgerbridge/PROMPT-010-service-rmx-schema.md) | 2026-03-23 | LedgerBridge | feature | Sede RMX · ItemService | Schemas v13.0 para ItemServiceAdd/Mod/Query | ✅ solved |
| [PROMPT-011](ledgerbridge/PROMPT-011-customer-rmx-schema.md) | 2026-03-23 | LedgerBridge | feature | Sede RMX · Customer | Schemas v13.0 para CustomerAdd/Mod/Query | ✅ solved |
| [PROMPT-012](ledgerbridge/PROMPT-012-vendor-rmx-schema.md) | 2026-03-23 | LedgerBridge | feature | Sede RMX · Vendor | Schemas v13.0 para VendorAdd/Mod/Query | ✅ solved |
| [PROMPT-013](ledgerbridge/PROMPT-013-salesorder-rmx-schema.md) | 2026-03-24 | LedgerBridge | feature | Sede RMX · SalesOrder | Schemas v13.0 para SalesOrderAdd/Mod/Query | ✅ solved |
| [PROMPT-014](ledgerbridge/PROMPT-014-purchaseorder-rmx-schema.md) | 2026-03-25 | LedgerBridge | feature | Sede RMX · PurchaseOrder | Schemas v13.0 para PurchaseOrderAdd/Mod/Query | ✅ solved |
| [PROMPT-015](ledgerbridge/PROMPT-015-invoice-rmx-schema.md) | 2026-03-25 | LedgerBridge | feature | Sede RMX · Invoice | Schemas v13.0 para InvoiceAdd/Mod/Query | ✅ solved |
| [PROMPT-016](ledgerbridge/PROMPT-016-bill-rmx-schema.md) | 2026-03-25 | LedgerBridge | feature | Sede RMX · Bill | Schemas v13.0 para BillAdd/Mod/Query | ✅ solved |
| [PROMPT-017](ledgerbridge/PROMPT-017-creditcardcharge-schema.md) | 2026-03-26 | LedgerBridge | feature | CreditCardCharge | Schemas v17.0 + v13.0 RMX para Add/Mod/Query | ✅ solved |
| [PROMPT-018](ledgerbridge/PROMPT-018-inventorysite-schema.md) | 2026-03-26 | LedgerBridge | feature | InventorySite | Schemas v17.0 + v13.0 RMX para Add/Mod/Query | ✅ solved |
| [PROMPT-019](ledgerbridge/PROMPT-019-inventorytransfer-assembly-schema.md) | 2026-03-26 | LedgerBridge | feature | InventoryTransfer · Assembly | Schemas v17.0 + v13.0 RMX para tipos Enterprise | ✅ solved |
| [PROMPT-LX-001](ledgerexec/PROMPT-001-semver-versioning.md) | 2026-03-19 | LedgerExec | convention | — | Adoptar SemVer como esquema oficial de versioning | ✅ solved |
| [PROMPT-LO-001](ledgerops/PROMPT-001-itemInventory-delivery.md) | 2026-03-23 | LedgerOps | delivery | ItemInventory | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-LO-002](ledgerops/PROMPT-002-itemNonInventory-delivery.md) | 2026-03-23 | LedgerOps | delivery | ItemNonInventory | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-LO-003](ledgerops/PROMPT-003-itemService-delivery.md) | 2026-03-23 | LedgerOps | delivery | ItemService | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-LO-004](ledgerops/PROMPT-004-customer-delivery.md) | 2026-03-23 | LedgerOps | delivery | Customer | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-LO-005](ledgerops/PROMPT-005-vendor-delivery.md) | 2026-03-23 | LedgerOps | delivery | Vendor | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-LO-006](ledgerops/PROMPT-006-salesorder-delivery.md) | 2026-03-24 | LedgerOps | delivery | SalesOrder | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-LO-007](ledgerops/PROMPT-007-purchaseorder-delivery.md) | 2026-03-25 | LedgerOps | delivery | PurchaseOrder | Entrega Add · Mod · Query — workflows + docs + fix payload Add | ✅ solved |
| [PROMPT-LO-008](ledgerops/PROMPT-008-purchaseorder-docs-rmx-version.md) | 2026-03-25 | LedgerOps | fix | PurchaseOrder | Corrección docs — versión 13.0 obligatoria para sede RMX | ✅ solved |
| [PROMPT-LO-009](ledgerops/PROMPT-009-invoice-delivery.md) | 2026-03-25 | LedgerOps | delivery | Invoice | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-LO-010](ledgerops/PROMPT-010-bill-delivery.md) | 2026-03-25 | LedgerOps | delivery | Bill | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-LO-011](ledgerops/PROMPT-011-inventorysite-delivery.md) | 2026-03-26 | LedgerOps | delivery | InventorySite | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-LO-012](ledgerops/PROMPT-012-creditcardcharge-delivery.md) | 2026-03-26 | LedgerOps | delivery | CreditCardCharge | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-LO-013](ledgerops/PROMPT-013-inventorytransfer-delivery.md) | 2026-03-27 | LedgerOps | delivery | InventoryTransfer | Entrega Add · Query — workflows + docs | ✅ solved |
| [PROMPT-LO-014](ledgerops/PROMPT-014-assembly-delivery.md) | 2026-03-27 | LedgerOps | delivery | Assembly | Entrega Add · Mod · Query — workflows + docs | ⏳ pending |

---

## Por proyecto

### LedgerBridge
19 prompts · 16 solved · 3 pending

| ID | Entidad | Asunto | Estado |
|---|---|---|---|
| [PROMPT-001](ledgerbridge/PROMPT-001-xml-field-ordering.md) | ItemInventoryAdd | XML field ordering | ✅ solved |
| [PROMPT-002](ledgerbridge/PROMPT-002-barcode-schema.md) | ItemNonInventoryAdd (41 tipos) | BarCode schema interpretation | ✅ solved |
| [PROMPT-003](ledgerbridge/PROMPT-003-noninventory-schema.md) | ItemNonInventoryAdd + roadmap | describe.json faltante para tipos del roadmap | ✅ solved |
| [PROMPT-004](ledgerbridge/PROMPT-004-noninventory-elementorder.md) | ItemNonInventoryMod / ItemServiceMod | QB-PARSE-ERROR — asimetría Rq/Rs nombres QBXML SDK | ✅ cerrado |
| [PROMPT-005](ledgerbridge/PROMPT-005-semver-versioning.md) | — | Adoptar SemVer como esquema oficial de versioning | ✅ solved |
| [PROMPT-006](ledgerbridge/PROMPT-006-generatecontract-requiredbysede.md) | GenerateContract | requiredBySede vacío aunque reglas registradas | ⏳ pending |
| [PROMPT-007](ledgerbridge/PROMPT-007-rmx-sede-schema.md) | Sede RMX · ItemInventory | Soporte QBXML v13.0 para QB Desktop 2021 | ✅ solved |
| [PROMPT-008](ledgerbridge/PROMPT-008-entrega-formal.md) | — | Entrega formal · Estándar de documentación por rol | ✅ solved |
| [PROMPT-009](ledgerbridge/PROMPT-009-noninventory-rmx-schema.md) | Sede RMX · ItemNonInventory | Schemas v13.0 para Add/Mod/Query | ✅ solved |
| [PROMPT-010](ledgerbridge/PROMPT-010-service-rmx-schema.md) | Sede RMX · ItemService | Schemas v13.0 para Add/Mod/Query | ✅ solved |
| [PROMPT-011](ledgerbridge/PROMPT-011-customer-rmx-schema.md) | Sede RMX · Customer | Schemas v13.0 para CustomerAdd/Mod/Query | ✅ solved |
| [PROMPT-012](ledgerbridge/PROMPT-012-vendor-rmx-schema.md) | Sede RMX · Vendor | Schemas v13.0 para VendorAdd/Mod/Query | ✅ solved |
| [PROMPT-013](ledgerbridge/PROMPT-013-salesorder-rmx-schema.md) | Sede RMX · SalesOrder | Schemas v13.0 para SalesOrderAdd/Mod/Query | ✅ solved |
| [PROMPT-014](ledgerbridge/PROMPT-014-purchaseorder-rmx-schema.md) | Sede RMX · PurchaseOrder | Schemas v13.0 para PurchaseOrderAdd/Mod/Query | ✅ solved |
| [PROMPT-015](ledgerbridge/PROMPT-015-invoice-rmx-schema.md) | Sede RMX · Invoice | Schemas v13.0 para InvoiceAdd/Mod/Query | ✅ solved |
| [PROMPT-016](ledgerbridge/PROMPT-016-bill-rmx-schema.md) | Sede RMX · Bill | Schemas v13.0 para BillAdd/Mod/Query | ✅ solved |
| [PROMPT-017](ledgerbridge/PROMPT-017-creditcardcharge-schema.md) | CreditCardCharge | Schemas v17.0 + v13.0 RMX — Add/Mod/Query | ✅ solved |
| [PROMPT-018](ledgerbridge/PROMPT-018-inventorysite-schema.md) | InventorySite | Schemas v17.0 + v13.0 RMX — Add/Mod/Query | ✅ solved |
| [PROMPT-019](ledgerbridge/PROMPT-019-inventorytransfer-assembly-schema.md) | InventoryTransfer · Assembly | Schemas v17.0 + v13.0 RMX — tipos Enterprise | ⏳ pending |

### LedgerExec
2 prompts · 2 solved · 0 pending

| ID | Entidad | Asunto | Estado |
|---|---|---|---|
| [PROMPT-001](ledgerexec/PROMPT-001-semver-versioning.md) | — | Adoptar SemVer como esquema oficial de versioning | ✅ solved |
| [PROMPT-002](ledgerexec/PROMPT-002-entrega-formal.md) | — | Entrega formal · Estándar de documentación por rol | ✅ solved |

### LedgerOps
14 prompts · 13 solved · 1 pending

| ID | Entidad | Asunto | Estado |
|---|---|---|---|
| [PROMPT-001](ledgerops/PROMPT-001-itemInventory-delivery.md) | ItemInventory | Entrega Add · Mod · Query | ✅ solved |
| [PROMPT-002](ledgerops/PROMPT-002-itemNonInventory-delivery.md) | ItemNonInventory | Entrega Add · Mod · Query | ✅ solved |
| [PROMPT-003](ledgerops/PROMPT-003-itemService-delivery.md) | ItemService | Entrega Add · Mod · Query | ✅ solved |
| [PROMPT-004](ledgerops/PROMPT-004-customer-delivery.md) | Customer | Entrega Add · Mod · Query | ✅ solved |
| [PROMPT-005](ledgerops/PROMPT-005-vendor-delivery.md) | Vendor | Entrega Add · Mod · Query | ✅ solved |
| [PROMPT-006](ledgerops/PROMPT-006-salesorder-delivery.md) | SalesOrder | Entrega Add · Mod · Query | ✅ solved |
| [PROMPT-007](ledgerops/PROMPT-007-purchaseorder-delivery.md) | PurchaseOrder | Entrega Add · Mod · Query + fix payload | ✅ solved |
| [PROMPT-008](ledgerops/PROMPT-008-purchaseorder-docs-rmx-version.md) | PurchaseOrder | Corrección docs — versión 13.0 para RMX | ✅ solved |
| [PROMPT-009](ledgerops/PROMPT-009-invoice-delivery.md) | Invoice | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-010](ledgerops/PROMPT-010-bill-delivery.md) | Bill | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-011](ledgerops/PROMPT-011-inventorysite-delivery.md) | InventorySite | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-012](ledgerops/PROMPT-012-creditcardcharge-delivery.md) | CreditCardCharge | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-013](ledgerops/PROMPT-013-inventorytransfer-delivery.md) | InventoryTransfer | Entrega Add · Query — workflows + docs | ✅ solved |
| [PROMPT-014](ledgerops/PROMPT-014-assembly-delivery.md) | Assembly | Entrega Add · Mod · Query — workflows + docs | ⏳ pending |

### qbxmlIntegrator
2 prompts · 2 solved · 0 pending

| ID | Entidad | Asunto | Estado |
|---|---|---|---|
| [PROMPT-001](qbxmlintegrator/PROMPT-001-semver-versioning.md) | — | Adoptar SemVer como esquema oficial de versioning | ✅ solved |
| [PROMPT-002](qbxmlintegrator/PROMPT-002-entrega-formal.md) | — | Entrega formal v1.0.1 · Estándar de documentación por rol | ✅ solved |

---

## Convención de archivos

```
docs/inter-project/
└── {proyecto}/
    └── PROMPT-{NNN}-{tema-corto}.md
```

### Estados
| Símbolo | Significado |
|---|---|
| ⏳ pending | Prompt emitido — esperando respuesta |
| 🔄 in-progress | LedgerBridge/proyecto está trabajando en ello |
| ✅ solved | Resuelto y verificado |
| 🔴 blocked | Bloqueado por dependencia externa |
