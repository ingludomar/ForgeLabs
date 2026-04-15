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
| [PROMPT-006](ledgerbridge/PROMPT-006-generatecontract-requiredbysede.md) | 2026-03-19 | LedgerBridge | bug | GenerateContract | requiredBySede vacío y data:{} — URL corregida en workflow N8N | ✅ solved |
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
| [PROMPT-LB-020](ledgerbridge/PROMPT-020-postgresql-architecture.md) | 2026-04-01 | LedgerBridge | research | LedgerBridge completo | Diseño de arquitectura PostgreSQL — tablas, relaciones y constraints para migración completa | ✅ solved |
| [PROMPT-LB-021](ledgerbridge/PROMPT-021-ledgercore-phase1-delivery.md) | 2026-04-01 | LedgerBridge | delivery | LedgerCore · Fase 1 | Entregar 4 archivos (SCHEMA.sql · seeds · DELIVERY.md) al repo LedgerCore | ✅ solved |
| [PROMPT-LB-022](ledgerbridge/PROMPT-022-service-catalog.md) | 2026-04-02 | LedgerBridge | research | LedgerBridge completo | Catálogo completo de servicios — endpoints, parámetros y respuestas para referencia de LC | ✅ solved |
| [PROMPT-LB-023](ledgerbridge/PROMPT-LB-023-business-rules-active-flag.md) | 2026-04-14 | LedgerBridge | infrastructure | Business Rules | Flag de activación por campo — metodología de inferencia empírica genera reglas incorrectas | ✅ solved |
| [PROMPT-LB-024](ledgerbridge/PROMPT-LB-024-business-rules-toggle-design.md) | 2026-04-15 | LedgerBridge | research | Business Rules | Consulta de diseño — endpoint toggle por campo de sede · auditoría activos/inactivos | ✅ solved |
| [PROMPT-LB-025](ledgerbridge/PROMPT-LB-025-business-rules-bulk-toggle.md) | 2026-04-15 | LedgerBridge | feature | Business Rules | Bulk toggle por entidad+sede — activar/desactivar todas las reglas de sede en un llamado | ✅ solved |
| [PROMPT-LB-026](ledgerbridge/PROMPT-LB-026-business-rules-get-requiredfields-bug.md) | 2026-04-15 | LedgerBridge | bug | Business Rules | Bug requiredFields — objetos serializados como strings tras toggle-sede · lb-business-required-get.py | ✅ solved |
| [PROMPT-LX-001](ledgerexec/PROMPT-001-semver-versioning.md) | 2026-03-19 | LedgerExec | convention | — | Adoptar SemVer como esquema oficial de versioning | ✅ solved |
| [PROMPT-LX-002](ledgerexec/PROMPT-LX-002-subworkflow-payload-pattern.md) | 2026-04-09 | LedgerExec | architecture | — | Patrón de payload post Execute Sub-workflow — nunca usar `$input` después de un sub-workflow | ✅ solved |
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
| [PROMPT-LO-014](ledgerops/PROMPT-014-assembly-delivery.md) | 2026-03-27 | LedgerOps | delivery | Assembly | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-LO-015](ledgerops/PROMPT-015-roadmap-procesos.md) | 2026-03-27 | LedgerOps | docs | — | Hoja de ruta por procesos de negocio — documento ejecutivo global | ✅ solved |
| [PROMPT-LO-016](ledgerops/PROMPT-016-sedes-config-contract-endpoint.md) | 2026-03-30 | LedgerOps | feature | — | Endpoints GET /webhook/sedes y GET /webhook/contracts?type= para RIQ | ✅ solved |
| [PROMPT-LO-017](ledgerops/PROMPT-017-p25-contract-version-note.md) | 2026-03-30 | LedgerOps | docs | 13 entidades | P2.5 — nota de versión en contratos · contratos idénticos v17.0 y v13.0 | ✅ solved |
| [PROMPT-LO-018](ledgerops/PROMPT-018-contracts-intuit-required.md) | 2026-03-31 | LedgerOps | bug | Contratos dinámicos | Incluir requiredByIntuit en GET /webhook/contracts — usar LB contract nativo | ✅ solved |
| [PROMPT-LO-019](ledgerops/PROMPT-019-qb-playground-vendor-docs.md) | 2026-03-31 | LedgerOps | docs | Vendor · QB Playground | Crear docs/qb-playground/Vendor.md — documentación generada por RIQ | ✅ solved |
| [PROMPT-LO-020](ledgerops/PROMPT-020-qb-playground-customer-docs.md) | 2026-03-31 | LedgerOps | docs | Customer · QB Playground | Crear docs/qb-playground/Customer.md — documentación generada por RIQ | ✅ solved |
| [PROMPT-LO-021](ledgerops/PROMPT-021-qb-playground-executive-docs.md) | 2026-04-01 | LedgerOps | docs | Vendor · Customer · QB Playground | Resúmenes ejecutivos — docs/qb-playground/Vendor-executive.md y Customer-executive.md | ✅ solved |
| [PROMPT-LC-001](ledgercore/PROMPT-LC-001-setup-environment.md) | 2026-04-01 | LedgerCore | setup | — | Setup entorno — DB PostgreSQL · MCP Postgres · MCP N8N · stack del API | ✅ solved |
| [PROMPT-LC-002](ledgercore/PROMPT-LC-002-templates-status-and-api.md) | 2026-04-03 | LedgerCore | feature | Templates | Estado actual de templates en DB + propuesta de API para que LO pueda consultarlos | ✅ solved |
| [PROMPT-LC-003](ledgercore/PROMPT-LC-003-gsd-setup-parity-milestone.md) | 2026-04-06 | LedgerCore | setup + planning | Paridad LedgerBridge | Instalar GSD + planificar milestone de paridad completa con LedgerBridge | ✅ solved |
| [PROMPT-LC-004](ledgercore/PROMPT-LC-004-data-migration-lb-to-lc.md) | 2026-04-06 | LedgerCore | migration | Catálogo XML + Business Rules | Migrar datos de LB → LC: schemas QBXML y business rules por sede para poblar la DB | ✅ solved |
| [PROMPT-LO-023](ledgerops/PROMPT-LO-023-contracts-template-integration.md) | 2026-04-03 | LedgerOps | feature | Templates | Integrar templates de LC en `/contracts` | ❌ cancelado — templates viven en DB de RIQ, no en LO |
| [PROMPT-RIQ-001](riq/PROMPT-RIQ-001-qb-playground-integration.md) | 2026-03-30 | RIQ | integration-spec | QB Playground | Especificación de integración LedgerOps → RIQ — routing, payload transform, respuestas | ✅ solved |
| [PROMPT-RIQ-002](riq/PROMPT-RIQ-002-payload-empty-fields.md) | 2026-03-30 | RIQ | improvement | QB Playground | Filtrar campos vacíos del payload — solo enviar campos con datos | ✅ solved |
| [PROMPT-RIQ-003](riq/PROMPT-RIQ-003-ref-field-priority.md) | 2026-03-30 | RIQ | improvement | QB Playground | Prioridad ListID sobre FullName en campos Ref — lógica buildRef | ✅ solved |
| [PROMPT-RIQ-004](riq/PROMPT-RIQ-004-example-data-test.md) | 2026-03-30 | RIQ | data | QB Playground | Datos de ejemplo reales por entidad (sede TEST) — Fill Examples funcional | ✅ solved |
| [PROMPT-RIQ-005](riq/PROMPT-RIQ-005-dynamic-contracts-migration.md) | 2026-03-30 | RIQ | feature | QB Playground | Migración de contracts.ts estático a contratos dinámicos desde LedgerOps | ✅ solved |
| [PROMPT-RIQ-006](riq/PROMPT-RIQ-006-remove-companymiddleware-playground.md) | 2026-03-30 | RIQ | bug | QB Playground | Excluir CompanyContextMiddleware de los 3 endpoints del Playground | ✅ solved |
| [PROMPT-RIQ-007](riq/PROMPT-RIQ-007-billquery-route.md) | 2026-03-30 | RIQ | bug | QB Playground | BillQuery — ruta faltante en qb-endpoints.ts | ✅ solved |
| [PROMPT-RIQ-008](riq/PROMPT-RIQ-008-playground-test-suite.md) | 2026-03-31 | RIQ | testing | QB Playground | Test suite E2E + guía curl — 15 TCs ejecutables individualmente | ✅ solved |
| [PROMPT-RIQ-009](riq/PROMPT-RIQ-009-json-output-summary-tab.md) | 2026-03-31 | RIQ | improvement | QB Playground | Pestaña Resumen en JSON Output — vista amigable de campos clave | ✅ solved |
| [PROMPT-RIQ-010](riq/PROMPT-RIQ-010-fill-examples-editsequence.md) | 2026-03-31 | RIQ | bug | QB Playground | Fill Examples — EditSequence vacío con hint en operaciones Mod | ✅ solved |
| [PROMPT-RIQ-011](riq/PROMPT-RIQ-011-vendor-playground-docs.md) | 2026-03-31 | RIQ | docs | Vendor | Documentación Vendor en QB Playground — guía de uso y casos de prueba | ✅ solved |
| [PROMPT-RIQ-012](riq/PROMPT-RIQ-012-vendor-feature-delivery.md) | 2026-03-31 | RIQ | delivery | Vendor | Entrega formal — versión, docs y cuerpo de correo | ✅ solved |
| [PROMPT-RIQ-013](riq/PROMPT-RIQ-013-customer-playground-docs.md) | 2026-03-31 | RIQ | docs | Customer | Documentación Customer en QB Playground — guía de uso y casos de prueba | ✅ solved |
| [PROMPT-RIQ-014](riq/PROMPT-RIQ-014-webhook-config-system.md) | 2026-04-02 | RIQ | improvement | Global | Sistema de configuración centralizada de URLs de webhooks N8N | ✅ solved |
| [PROMPT-RIQ-015](riq/PROMPT-RIQ-015-webhook-admin-ui.md) | 2026-04-02 | RIQ | feature | Global | Panel de administración visual para gestión de URLs de webhooks N8N | ✅ solved |
| [PROMPT-RIQ-016](riq/PROMPT-RIQ-016-webhook-resolver-singleton.md) | 2026-04-02 | RIQ | bug / security | Global | WebhookResolverService singleton + JWT guard en PUT/DELETE | ✅ solved |
| [PROMPT-RIQ-017](riq/PROMPT-RIQ-017-template-playground.md) | 2026-04-03 | RIQ | feature | QB Playground | Templates — formulario configurable por sede y operación, consumo adaptativo desde RIQ DB | ✅ solved |
| [PROMPT-RIQ-018](riq/PROMPT-RIQ-018-item-inventory-playground-docs.md) | 2026-04-03 | RIQ | docs | Item Inventory | Testing Add·Mod·Query en 5 sedes + documentación QB Playground | ✅ solved |
| [PROMPT-RIQ-019](riq/PROMPT-RIQ-019-template-management.md) | 2026-04-04 | RIQ | feature | Templates | Gestión completa de templates en DB de RIQ — Prisma, seed via LO, panel admin | ✅ solved |
| [PROMPT-LO-025](ledgerops/PROMPT-LO-025-qb-playground-templates-docs.md) | 2026-04-04 | LedgerOps | docs | QB Playground Templates | Crear docs/platform/QBPlaygroundTemplates/ con 5 archivos por rol | ✅ solved |
| [PROMPT-RIQ-021](riq/PROMPT-RIQ-021-salesorder-playground-docs.md) | 2026-04-06 | RIQ | docs | Sales Order | Testing Add·Mod·Query en 5 sedes + documentación QB Playground | ✅ solved |
| [PROMPT-RIQ-022](riq/PROMPT-RIQ-022-playground-fetch-timeout-convention.md) | 2026-04-07 | RIQ | convention | QB Playground | fetch timeout obligatorio en handleSend — AbortSignal.timeout(20s) + checklist de cierre | ✅ solved |
| [PROMPT-RIQ-023](riq/PROMPT-RIQ-023-playground-entity-docs-standard.md) | 2026-04-07 | RIQ | convention + docs | QB Playground · SalesOrder | Estándar 5 docs por rol al cerrar entidad Playground + backfill SalesOrder | ✅ solved |
| [PROMPT-RIQ-024](riq/PROMPT-RIQ-024-purchaseorder-playground-docs.md) | 2026-04-07 | RIQ | docs | Purchase Order | Testing Add·Mod·Query en 5 sedes + 6 docs por rol QB Playground | ✅ solved |
| [PROMPT-LO-028](ledgerops/PROMPT-LO-028-qb-playground-purchaseorder-docs.md) | 2026-04-07 | LedgerOps | docs | Purchase Order | Publicar 6 docs por rol en docs/qb-playground/ | ✅ solved |
| [PROMPT-RIQ-025](riq/PROMPT-RIQ-025-playground-backfill-role-docs.md) | 2026-04-07 | RIQ | docs | Vendor · Customer · ItemInventory | Backfill 5 docs por rol para las 3 entidades en paralelo | ✅ solved |
| [PROMPT-LO-029](ledgerops/PROMPT-LO-029-qb-playground-vendor-role-docs.md) | 2026-04-08 | LedgerOps | docs | Vendor | Publicar 5 docs por rol en docs/qb-playground/ | ✅ solved |
| [PROMPT-LO-030](ledgerops/PROMPT-LO-030-qb-playground-customer-role-docs.md) | 2026-04-08 | LedgerOps | docs | Customer | Publicar 5 docs por rol en docs/qb-playground/ | ✅ solved |
| [PROMPT-LO-031](ledgerops/PROMPT-LO-031-qb-playground-item-inventory-role-docs.md) | 2026-04-08 | LedgerOps | docs | ItemInventory | Publicar 5 docs por rol en docs/qb-playground/ | ✅ solved |
| [PROMPT-LO-026](ledgerops/PROMPT-LO-026-qb-playground-salesorder-docs.md) | 2026-04-06 | LedgerOps | docs | Sales Order | Crear docs/qb-playground/SalesOrder.md — contenido generado por RIQ | ✅ solved |
| [PROMPT-LO-027](ledgerops/PROMPT-LO-027-qb-playground-salesorder-role-docs.md) | 2026-04-07 | LedgerOps | docs | Sales Order | Crear 5 docs por rol — executive · developer · architect · qa · support | ✅ solved |
| [PROMPT-RIQ-020](riq/PROMPT-RIQ-020-webhook-admin-docs.md) | 2026-04-04 | RIQ | docs | N8N Webhook Administration | Documentación por rol — Executive · Developer · Architect · QA · Support | ✅ solved |
| [PROMPT-LO-024](ledgerops/PROMPT-LO-024-webhook-admin-platform-docs.md) | 2026-04-04 | LedgerOps | docs | N8N Webhook Administration | Crear docs/platform/WebhookAdmin/ con 5 archivos por rol | ✅ solved |
| [PROMPT-LO-022](ledgerops/PROMPT-LO-022-qb-playground-item-inventory-docs.md) | 2026-04-03 | LedgerOps | docs | Item Inventory | Crear docs/qb-playground/ItemInventory.md — contenido generado por RIQ | ✅ solved |
| [PROMPT-RIQ-026](riq/PROMPT-RIQ-026-invoice-playground-docs.md) | 2026-04-08 | RIQ | docs | Invoice | Routing + testing 5 sedes + 6 docs por rol QB Playground | ✅ solved |
| [PROMPT-RIQ-027](riq/PROMPT-RIQ-027-invoice-routing-fix.md) | 2026-04-09 | RIQ | bug | Invoice | Routing InvoiceMod + InvoiceQuery faltaban en qb-endpoints.ts y webhooks.config.ts | ✅ solved |
| [PROMPT-RIQ-028](riq/PROMPT-RIQ-028-invoice-contracts-mod-query.md) | 2026-04-09 | RIQ | bug | Invoice | InvoiceMod + InvoiceQuery faltaban en contracts.ts — Playground UI incompleto | ✅ solved |
| [PROMPT-RIQ-029](riq/PROMPT-RIQ-029-invoice-mod-query-map.md) | 2026-04-09 | RIQ | bug | Invoice | InvoiceMod no registrado en MOD_QUERY_MAP — botón "Obtener EditSequence" no aparece | ✅ solved |
| [PROMPT-RIQ-030](riq/PROMPT-RIQ-030-invoice-push-branch.md) | 2026-04-09 | RIQ | delivery | Invoice | Push rama feature/redix-integration-quickbooks-playground — 6 commits locales pendientes | ✅ solved |
| [PROMPT-RIQ-031](riq/PROMPT-RIQ-031-bill-mod-query-map.md) | 2026-04-12 | RIQ | bug | Bill | BillMod no registrado en MOD_QUERY_MAP — botón "Obtener EditSequence" no aparece | ✅ solved |
| [PROMPT-RIQ-032](riq/PROMPT-RIQ-032-bill-push-branch.md) | 2026-04-13 | RIQ | delivery | Bill | Push commit c13cfb2 pendiente — BillMod en MOD_QUERY_MAP | ✅ solved |
| [PROMPT-LO-034](ledgerops/PROMPT-LO-034-invoice-playground-docs.md) | 2026-04-09 | LedgerOps | docs | Invoice | Publicar 6 docs por rol en docs/qb-playground/ | ✅ solved |
| [PROMPT-LO-035](ledgerops/PROMPT-LO-035-bill-playground-docs.md) | 2026-04-13 | LedgerOps | docs | Bill | Publicar 6 docs por rol en docs/integration/ (executive · developer · architect · qa · support · quickstart) | ✅ solved |
| [PROMPT-LO-036](ledgerops/PROMPT-LO-036-inventory-site-playground-docs.md) | 2026-04-14 | LedgerOps | docs | InventorySite | Publicar 6 docs por rol en docs/integration/ (executive · developer · architect · qa · support · quickstart) · commit 22a5010 | ✅ solved |
| [PROMPT-LO-037](ledgerops/PROMPT-LO-037-item-service-contract.md) | 2026-04-15 | LedgerOps | feature | ItemService | Contrato dinámico Add + Mod para QB Playground — LO ya sirve contratos · problema en RIQ | ✅ solved |
| [PROMPT-RIQ-041](riq/PROMPT-RIQ-041-item-service-form-empty.md) | 2026-04-15 | RIQ | bug | ItemService | Formulario vacío — causa: LO sin template activo · solución derivada a LO | ✅ solved |
| [PROMPT-LO-038](ledgerops/PROMPT-LO-038-item-service-template.md) | 2026-04-15 | LedgerOps | feature | ItemService | Template activo Add + Mod para QB Playground | 🔵 pending |
| [PROMPT-RIQ-033](riq/PROMPT-RIQ-033-inventory-site-playground.md) | 2026-04-13 | RIQ | feature | InventorySite | Routing · webhooks · contratos · MOD_QUERY_MAP para QB Playground | ✅ solved |
| [PROMPT-RIQ-034](riq/PROMPT-RIQ-034-inventory-site-has-contract-fix.md) | 2026-04-13 | RIQ | bug | InventorySite | hasContract: false incorrecto para Add/Mod — formulario vacío en Playground | ✅ solved |
| [PROMPT-RIQ-035](riq/PROMPT-RIQ-035-inventory-site-testing.md) | 2026-04-13 | RIQ | testing + docs | InventorySite | Testing E2E Add · Query · Mod en TEST + Query en sedes + 6 docs por rol · commit 24ddac9 | ✅ solved |
| [PROMPT-RIQ-036](riq/PROMPT-RIQ-036-inventory-site-sedes-dropdown.md) | 2026-04-13 | RIQ | bug | InventorySite | Sedes no se listan en Playground UI para acciones InventorySite — bloqueante E2E usuario | ✅ solved |
| [PROMPT-RIQ-037](riq/PROMPT-RIQ-037-credit-card-charge-playground.md) | 2026-04-14 | RIQ | feature | CreditCardCharge | Routing · webhooks · contratos · MOD_QUERY_MAP para QB Playground · commit eb6e1a8 | ✅ solved |
| [PROMPT-RIQ-038](riq/PROMPT-RIQ-038-credit-card-charge-add-fix.md) | 2026-04-14 | RIQ | bug | CreditCardCharge | CreditCardChargeAdd faltante — falsa alarma · RIQ-037 fue suficiente | ✅ cerrado |
| [PROMPT-RIQ-039](riq/PROMPT-RIQ-039-credit-card-charge-testing.md) | 2026-04-14 | RIQ | testing + docs | CreditCardCharge | Testing E2E Add · Query · Mod en TEST + Query en sedes + 6 docs por rol | 🔵 pending |

---

## Por proyecto

### LedgerBridge
26 prompts · 23 solved · 3 pending

| ID | Entidad | Asunto | Estado |
|---|---|---|---|
| [PROMPT-001](ledgerbridge/PROMPT-001-xml-field-ordering.md) | ItemInventoryAdd | XML field ordering | ✅ solved |
| [PROMPT-002](ledgerbridge/PROMPT-002-barcode-schema.md) | ItemNonInventoryAdd (41 tipos) | BarCode schema interpretation | ✅ solved |
| [PROMPT-003](ledgerbridge/PROMPT-003-noninventory-schema.md) | ItemNonInventoryAdd + roadmap | describe.json faltante para tipos del roadmap | ✅ solved |
| [PROMPT-004](ledgerbridge/PROMPT-004-noninventory-elementorder.md) | ItemNonInventoryMod / ItemServiceMod | QB-PARSE-ERROR — asimetría Rq/Rs nombres QBXML SDK | ✅ cerrado |
| [PROMPT-005](ledgerbridge/PROMPT-005-semver-versioning.md) | — | Adoptar SemVer como esquema oficial de versioning | ✅ solved |
| [PROMPT-006](ledgerbridge/PROMPT-006-generatecontract-requiredbysede.md) | GenerateContract | requiredBySede vacío aunque reglas registradas | ✅ solved |
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
| [PROMPT-019](ledgerbridge/PROMPT-019-inventorytransfer-assembly-schema.md) | InventoryTransfer · Assembly | Schemas v17.0 + v13.0 RMX — tipos Enterprise | ✅ solved |
| [PROMPT-LB-020](ledgerbridge/PROMPT-020-postgresql-architecture.md) | LedgerBridge completo | Diseño de arquitectura PostgreSQL | ✅ solved |
| [PROMPT-LB-021](ledgerbridge/PROMPT-021-ledgercore-phase1-delivery.md) | LedgerCore · Fase 1 | Entregar 4 archivos (SCHEMA.sql · seeds · DELIVERY.md) al repo LedgerCore | ✅ solved |
| [PROMPT-LB-022](ledgerbridge/PROMPT-022-service-catalog.md) | LedgerBridge completo | Catálogo completo de servicios — endpoints, parámetros y respuestas | ✅ solved |
| [PROMPT-LB-023](ledgerbridge/PROMPT-LB-023-business-rules-active-flag.md) | Business Rules | Flag de activación por campo — backward compatible · admin puede desactivar reglas incorrectas | ✅ solved |
| [PROMPT-LB-024](ledgerbridge/PROMPT-LB-024-business-rules-toggle-design.md) | Business Rules | Consulta de diseño — add como upsert · get retorna estado completo · catálogo 4 endpoints | ✅ solved |
| [PROMPT-LB-025](ledgerbridge/PROMPT-LB-025-business-rules-bulk-toggle.md) | Business Rules | Bulk toggle por entidad+sede — desactivar/activar todas las reglas de sede en un llamado · commit d23ca53 | ✅ solved |
| [PROMPT-LB-026](ledgerbridge/PROMPT-LB-026-business-rules-get-requiredfields-bug.md) | Business Rules | Bug requiredFields — objetos serializados como strings tras toggle-sede | ✅ solved |

### LedgerExec
5 prompts · 3 solved · 2 pending

| ID | Entidad | Asunto | Estado |
|---|---|---|---|
| [PROMPT-001](ledgerexec/PROMPT-001-semver-versioning.md) | — | Adoptar SemVer como esquema oficial de versioning | ✅ solved |
| [PROMPT-002](ledgerexec/PROMPT-002-entrega-formal.md) | — | Entrega formal · Estándar de documentación por rol | ✅ solved |
| [PROMPT-003](ledgerexec/PROMPT-003-sede-url-config-json.md) | — | URLs de sedes → sub-workflow · implementación rota | ✅ solved |
| [PROMPT-004](ledgerexec/PROMPT-004-sede-url-subworkflow-fix.md) | — | Revert + reimplementación correcta del sub-workflow | ✅ solved |
| [PROMPT-LX-002](ledgerexec/PROMPT-LX-002-subworkflow-payload-pattern.md) | — | Patrón de payload post Execute Sub-workflow — referenciar nodo original por nombre | ✅ solved |

### LedgerOps
24 prompts · 23 solved · 1 pending

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
| [PROMPT-014](ledgerops/PROMPT-014-assembly-delivery.md) | Assembly | Entrega Add · Mod · Query — workflows + docs | ✅ solved |
| [PROMPT-015](ledgerops/PROMPT-015-roadmap-procesos.md) | — | Hoja de ruta por procesos — documento ejecutivo global | ✅ solved |
| [PROMPT-LO-029](ledgerops/PROMPT-LO-029-qb-playground-vendor-role-docs.md) | Vendor | Publicar 5 docs por rol en docs/qb-playground/ | ✅ solved |
| [PROMPT-LO-030](ledgerops/PROMPT-LO-030-qb-playground-customer-role-docs.md) | Customer | Publicar 5 docs por rol en docs/qb-playground/ | ✅ solved |
| [PROMPT-LO-031](ledgerops/PROMPT-LO-031-qb-playground-item-inventory-role-docs.md) | ItemInventory | Publicar 5 docs por rol en docs/qb-playground/ | ✅ solved |
| [PROMPT-LO-032](ledgerops/PROMPT-LO-032-invoicequery-payload-fix.md) | InvoiceQuery | Bug payload — tag extra en data genera XML inválido en QB | ✅ solved |
| [PROMPT-LO-033](ledgerops/PROMPT-LO-033-data-contract-standard.md) | — | Estándar de contrato `data` — campos directos sin wrapper + 5 workflows corregidos | ✅ solved |
| [PROMPT-LO-034](ledgerops/PROMPT-LO-034-invoice-playground-docs.md) | Invoice | Publicar 6 docs por rol en docs/qb-playground/ | ✅ solved |
| [PROMPT-LO-035](ledgerops/PROMPT-LO-035-bill-playground-docs.md) | Bill | Publicar 6 docs por rol en docs/integration/ | ✅ solved |
| [PROMPT-LO-036](ledgerops/PROMPT-LO-036-inventory-site-playground-docs.md) | InventorySite | Publicar 6 docs por rol en docs/integration/ · commit 22a5010 | ✅ solved |
| [PROMPT-LO-037](ledgerops/PROMPT-LO-037-item-service-contract.md) | ItemService | Contrato dinámico Add + Mod para QB Playground — LO ya sirve contratos · problema en RIQ | ✅ solved |
| [PROMPT-LO-038](ledgerops/PROMPT-LO-038-item-service-template.md) | ItemService | Template activo Add + Mod para QB Playground — formulario vacío por ausencia de template | 🔵 pending |

### RIQ (redix-integration-quickbooks)
42 prompts · 41 solved · 1 pending

| ID | Entidad | Asunto | Estado |
|---|---|---|---|
| [PROMPT-RIQ-001](riq/PROMPT-RIQ-001-qb-playground-integration.md) | QB Playground | Especificación de integración con LedgerOps | ✅ solved |
| [PROMPT-RIQ-002](riq/PROMPT-RIQ-002-payload-empty-fields.md) | QB Playground | Filtrar campos vacíos del payload | ✅ solved |
| [PROMPT-RIQ-003](riq/PROMPT-RIQ-003-ref-field-priority.md) | QB Playground | Prioridad ListID sobre FullName en campos Ref | ✅ solved |
| [PROMPT-RIQ-004](riq/PROMPT-RIQ-004-example-data-test.md) | QB Playground | Datos de ejemplo reales por entidad (sede TEST) | ✅ solved |
| [PROMPT-RIQ-005](riq/PROMPT-RIQ-005-dynamic-contracts-migration.md) | QB Playground | Migración de contracts.ts estático a contratos dinámicos | ✅ solved |
| [PROMPT-RIQ-006](riq/PROMPT-RIQ-006-remove-companymiddleware-playground.md) | QB Playground | Excluir CompanyContextMiddleware de endpoints Playground | ✅ solved |
| [PROMPT-RIQ-007](riq/PROMPT-RIQ-007-billquery-route.md) | QB Playground | BillQuery — ruta faltante en qb-endpoints.ts | ✅ solved |
| [PROMPT-RIQ-008](riq/PROMPT-RIQ-008-playground-test-suite.md) | QB Playground | Test suite E2E + guía curl — 15 TCs | ✅ solved |
| [PROMPT-RIQ-009](riq/PROMPT-RIQ-009-json-output-summary-tab.md) | QB Playground | Pestaña Resumen en JSON Output | ✅ solved |
| [PROMPT-RIQ-010](riq/PROMPT-RIQ-010-fill-examples-editsequence.md) | QB Playground | Fill Examples — EditSequence vacío con hint en Mod | ✅ solved |
| [PROMPT-RIQ-011](riq/PROMPT-RIQ-011-vendor-playground-docs.md) | Vendor | Documentación Vendor en QB Playground | ✅ solved |
| [PROMPT-RIQ-012](riq/PROMPT-RIQ-012-vendor-feature-delivery.md) | Vendor | Entrega formal — versión, docs y correo | ✅ solved |
| [PROMPT-RIQ-013](riq/PROMPT-RIQ-013-customer-playground-docs.md) | Customer | Documentación Customer en QB Playground | ✅ solved |
| [PROMPT-RIQ-014](riq/PROMPT-RIQ-014-webhook-config-system.md) | Global | Sistema de configuración centralizada de webhooks N8N | ✅ solved |
| [PROMPT-RIQ-015](riq/PROMPT-RIQ-015-webhook-admin-ui.md) | Global | Panel de administración visual de URLs de webhooks N8N | ✅ solved |
| [PROMPT-RIQ-016](riq/PROMPT-RIQ-016-webhook-resolver-singleton.md) | Global | WebhookResolverService singleton + JWT guard | ✅ solved |
| [PROMPT-RIQ-017](riq/PROMPT-RIQ-017-template-playground.md) | QB Playground | Templates — formulario configurable por sede y operación | ✅ solved |
| [PROMPT-RIQ-018](riq/PROMPT-RIQ-018-item-inventory-playground-docs.md) | Item Inventory | Testing + documentación QB Playground | ✅ solved |
| [PROMPT-RIQ-019](riq/PROMPT-RIQ-019-template-management.md) | Templates | Gestión completa de templates en DB de RIQ | ✅ solved |
| [PROMPT-RIQ-020](riq/PROMPT-RIQ-020-webhook-admin-docs.md) | Webhook Admin | Documentación por rol — 5 archivos | ✅ solved |
| [PROMPT-RIQ-021](riq/PROMPT-RIQ-021-salesorder-playground-docs.md) | Sales Order | Testing + documentación QB Playground | ✅ solved |
| [PROMPT-RIQ-022](riq/PROMPT-RIQ-022-playground-fetch-timeout-convention.md) | QB Playground | fetch timeout + checklist de cierre | ✅ solved |
| [PROMPT-RIQ-023](riq/PROMPT-RIQ-023-playground-entity-docs-standard.md) | QB Playground · SalesOrder | Estándar 5 docs por rol + backfill SalesOrder | ✅ solved |
| [PROMPT-RIQ-024](riq/PROMPT-RIQ-024-purchaseorder-playground-docs.md) | Purchase Order | Testing + 6 docs por rol QB Playground | ✅ solved |
| [PROMPT-LO-028](ledgerops/PROMPT-LO-028-qb-playground-purchaseorder-docs.md) | Purchase Order | Publicar 6 docs en docs/qb-playground/ | ✅ solved |
| [PROMPT-RIQ-025](riq/PROMPT-RIQ-025-playground-backfill-role-docs.md) | Vendor · Customer · ItemInventory | Backfill 5 docs por rol — 15 archivos en paralelo | ✅ solved |
| [PROMPT-RIQ-026](riq/PROMPT-RIQ-026-invoice-playground-docs.md) | Invoice | Routing + testing 5 sedes + 6 docs por rol QB Playground | ✅ solved |
| [PROMPT-RIQ-027](riq/PROMPT-RIQ-027-invoice-routing-fix.md) | Invoice | Routing InvoiceMod + InvoiceQuery faltaban en qb-endpoints.ts y webhooks.config.ts | ✅ solved |
| [PROMPT-RIQ-028](riq/PROMPT-RIQ-028-invoice-contracts-mod-query.md) | Invoice | InvoiceMod + InvoiceQuery faltaban en contracts.ts — Playground UI incompleto | ✅ solved |
| [PROMPT-RIQ-029](riq/PROMPT-RIQ-029-invoice-mod-query-map.md) | Invoice | InvoiceMod no registrado en MOD_QUERY_MAP — botón "Obtener EditSequence" no aparece | ✅ solved |
| [PROMPT-RIQ-030](riq/PROMPT-RIQ-030-invoice-push-branch.md) | Invoice | Push rama feature/redix-integration-quickbooks-playground — 6 commits locales pendientes | ✅ solved |
| [PROMPT-RIQ-031](riq/PROMPT-RIQ-031-bill-mod-query-map.md) | Bill | BillMod no registrado en MOD_QUERY_MAP — botón "Obtener EditSequence" no aparece | ✅ solved |
| [PROMPT-RIQ-032](riq/PROMPT-RIQ-032-bill-push-branch.md) | Bill | Push commit c13cfb2 pendiente — BillMod en MOD_QUERY_MAP | ✅ solved |
| [PROMPT-RIQ-033](riq/PROMPT-RIQ-033-inventory-site-playground.md) | InventorySite | Routing · webhooks · contratos · MOD_QUERY_MAP para QB Playground | ✅ solved |
| [PROMPT-RIQ-034](riq/PROMPT-RIQ-034-inventory-site-has-contract-fix.md) | InventorySite | hasContract: false incorrecto para Add/Mod — formulario vacío en Playground | ✅ solved |
| [PROMPT-RIQ-035](riq/PROMPT-RIQ-035-inventory-site-testing.md) | InventorySite | Testing E2E Add · Query · Mod en TEST + Query en RUS · RBR · RMX | ✅ solved |
| [PROMPT-RIQ-036](riq/PROMPT-RIQ-036-inventory-site-sedes-dropdown.md) | InventorySite | Sedes no se listan en Playground UI — bloqueante E2E usuario | ✅ solved |
| [PROMPT-RIQ-037](riq/PROMPT-RIQ-037-credit-card-charge-playground.md) | CreditCardCharge | Routing · webhooks · contratos · MOD_QUERY_MAP para QB Playground · commit eb6e1a8 | ✅ solved |
| [PROMPT-RIQ-038](riq/PROMPT-RIQ-038-credit-card-charge-add-fix.md) | CreditCardCharge | CreditCardChargeAdd faltante — falsa alarma · RIQ-037 fue suficiente | ✅ cerrado |
| [PROMPT-RIQ-039](riq/PROMPT-RIQ-039-credit-card-charge-testing.md) | CreditCardCharge | Testing E2E Add · Query · Mod en TEST + Query en sedes + 6 docs por rol | 🔵 pending |
| [PROMPT-RIQ-040](riq/PROMPT-RIQ-040-item-service-playground.md) | ItemService | Routing · webhooks · contratos · MOD_QUERY_MAP para QB Playground · commit f6aae04 | ✅ solved |
| [PROMPT-RIQ-041](riq/PROMPT-RIQ-041-item-service-form-empty.md) | ItemService | Formulario vacío en Add/Mod — causa: LO sin template activo para ItemService · solución en LO | ✅ solved |

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
| ✅ solved | Prompt emitido — esperando respuesta |
| ✅ solved | LedgerBridge/proyecto está trabajando en ello |
| ✅ solved | Resuelto y verificado |
| 🔴 blocked | Bloqueado por dependencia externa |
