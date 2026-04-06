# Redix (RIQ) — Resumen de implementaciones

**Fecha:** 2026-04-06
**Proyecto:** Redix Integration QuickBooks (`redix-integration-quickbooks`)

---

## QB Playground — Core

| # | Feature | Descripción |
|---|---|---|
| RIQ-001 | Integración con LedgerOps | Endpoint `POST /api/integration/qb-playground` — routing, transformación de payload y normalización de respuesta hacia webhooks de LedgerOps |
| RIQ-002 | Filtro de campos vacíos | `pruneEmpty` — excluye campos sin datos antes de enviar el payload a LO |
| RIQ-003 | Prioridad en campos Ref | `buildRef` — prioriza ListID sobre FullName en referencias de entidades QB |
| RIQ-004 | Datos de ejemplo reales | IDs y valores reales de sede TEST en Fill Examples — 15 test cases ejecutados |
| RIQ-005 | Contratos dinámicos | Formulario migrado de contratos estáticos a llamadas dinámicas a `/webhook/sedes` y `/webhook/contracts` de LO |
| RIQ-006 | Excluir CompanyMiddleware | Endpoints del Playground excluidos del `CompanyContextMiddleware` para evitar fallo de contexto de empresa |
| RIQ-007 | BillQuery — ruta faltante | BillQuery registrado en la routing table con TxnID de ejemplo actualizado |
| RIQ-008 | Test Suite E2E | Guía curl copy-paste y test suite con 5 archivos por grupo de entidades |
| RIQ-009 | Pestaña Resumen en JSON Output | Panel de respuesta con pestaña "Resumen" — campos clave en formato legible (ListID, Name, EditSequence, TxnID) |
| RIQ-010 | Fill Examples — EditSequence en Mod | EditSequence vacío con hint en operaciones Mod — evita error QB por valor desactualizado |

---

## Webhooks N8N Administration

| # | Feature | Descripción |
|---|---|---|
| RIQ-014 | Configuración centralizada de webhooks | `webhooks.config.ts` con claves semánticas, separación por ambiente (development/production) y validación al inicio de la app |
| RIQ-015 | Panel de administración | UI en `/settings/integrations/n8n` con tabla `webhook_override` en PostgreSQL — permite sobrescribir URLs de webhooks sin tocar código |
| RIQ-016 | Singleton + JWT guard | `WebhookConfigModule` marcado `@Global()` para instancia única garantizada; JWT guard + validación de rol Administrador en endpoints PUT/DELETE |

---

## QB Playground Templates

| # | Feature | Descripción |
|---|---|---|
| RIQ-017 | Consumo de templates en el Playground | Formulario adaptativo — si existe template para la combinación tipo+sede, muestra solo los campos configurados; selector con persistencia de preferencia por usuario |
| RIQ-019 | Gestión completa de templates | Modelos Prisma `qb_template` + `qb_template_field`; 6 endpoints REST; panel admin en `/settings/integrations/qb-templates`; soft delete; auto-default en primer template |

---

## Entidades QB verificadas

Las siguientes entidades han sido implementadas, verificadas E2E desde el UI de Redix y documentadas formalmente.

| Entidad | Módulo | Add | Mod | Query |
|---|---|:---:|:---:|:---:|
| **Vendor** | Contactos | ✅ | ✅ | ✅ |
| **Customer** | Contactos | ✅ | ✅ | ✅ |
| **Item Inventory** | Inventario | ✅ | ✅ | ✅ |

> Las operaciones se ejecutan desde el QB Playground vía `POST /api/integration/qb-playground` con routing hacia LedgerOps. Sedes verificadas: TEST · RUS · REC · RBR · RMX.

---

*Documentación técnica completa por rol disponible en el repositorio LedgerOps bajo `docs/qb-playground/`.*
