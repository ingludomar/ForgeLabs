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
| [PROMPT-011](ledgerbridge/PROMPT-011-customer-rmx-schema.md) | 2026-03-23 | LedgerBridge | feature | Sede RMX · Customer | Schemas v13.0 para CustomerAdd/Mod/Query | ⏳ pending |
| [PROMPT-LX-001](ledgerexec/PROMPT-001-semver-versioning.md) | 2026-03-19 | LedgerExec | convention | — | Adoptar SemVer como esquema oficial de versioning | ✅ solved |

---

## Por proyecto

### LedgerBridge
12 prompts · 11 solved · 1 pending

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

### LedgerExec
2 prompts · 2 solved · 0 pending

| ID | Entidad | Asunto | Estado |
|---|---|---|---|
| [PROMPT-001](ledgerexec/PROMPT-001-semver-versioning.md) | — | Adoptar SemVer como esquema oficial de versioning | ✅ solved |
| [PROMPT-002](ledgerexec/PROMPT-002-entrega-formal.md) | — | Entrega formal · Estándar de documentación por rol | ✅ solved |

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
