# Research — LedgerCore

**Fecha:** 2026-04-01
**Estado:** 🚀 Fase 1 completada por LedgerBridge
**Autor:** SyncBridge

---

## Qué es LedgerCore

**LedgerCore** es un nuevo proyecto — evolución arquitectural de LedgerBridge — que reemplaza el modelo de servidor de archivos por una arquitectura basada en PostgreSQL, diseñada para operar como producto multi-empresa.

> LedgerBridge actual sigue operando sin cambios. LedgerCore se desarrolla en paralelo como producto independiente. Cuando esté probado y maduro, reemplazará a LedgerBridge.

---

## Origen

LedgerBridge nació como componente de integración para un cliente específico — desplegado en `/opt/LedgerBridge` con schemas, business rules y configuraciones en archivos del sistema operativo. Este modelo funciona bien para un cliente, pero limita la escalabilidad:

- Requiere montar un servidor por cliente
- Configuración vive en archivos — difícil de administrar remotamente
- Crear una sede implica operaciones en el filesystem
- No tiene UI de administración
- No es multi-tenant por diseño

---

## Qué ofrece LedgerCore

Todo lo que hace LedgerBridge hoy, más:

| Capacidad | LedgerBridge | LedgerCore |
|---|---|---|
| Schemas QBXML | Archivos JSON | Tabla `qbxml_field` en DB |
| Business rules | Archivos JSON por sede | Tabla `business_rule` en DB |
| Gestión de sedes | Archivos + deploy manual | CRUD desde API |
| Multi-tenant | ❌ Un cliente | ✅ N empresas en la misma DB |
| Templates de formulario | ❌ No existe | ✅ Formularios configurables por sede |
| UI de administración | ❌ No existe | ✅ Via API + front |
| Onboarding nuevo cliente | Montar servidor | Crear registros en DB |
| Portabilidad | Servidor dedicado | Docker → cualquier infra |

---

## Concepto clave — Templates

Un **Template** define qué campos mostrar en un formulario para una operación QBXML específica en una sede determinada.

Problema que resuelve: cada operación QBXML tiene entre 50 y 200+ campos. Sin templates, el usuario ve todos — formularios engorrosos e inutilizables. Con templates, el administrador configura qué campos son visibles y cuáles son obligatorios para cada flujo de trabajo.

### Cómo funciona

```
Al abrir "Crear Vendor" en sede REC:
  1. Sistema consulta templates disponibles para VendorAdd en REC
  2. Muestra selector: [Vendor estándar ✓ · Vendor con régimen fiscal · Vendor básico]
  3. Usuario elige template → formulario muestra solo esos campos
  4. Campos Intuit: siempre incluidos, no removibles
  5. Campos de negocio: configurados por el administrador (visible + required/optional)
```

### Estructura de un template

```
Template "Vendor estándar"
  └── Empresa: ACME Corp
  └── Tipo: VendorAdd
  └── Sedes asignadas: REC, RBR, RUS (mismo template en 3 sedes)
  └── Campos:
        Name              → required (Intuit)
        IsActive          → required (Intuit)
        CurrencyRef       → required (negocio)
        CompanyName       → optional (visible)
        Phone             → optional (visible)
        BillAddress       → optional (visible)
        [resto de campos] → ocultos
```

---

## Arquitectura

### Dos capas de datos

```
┌──────────────────────────────────────────────┐
│  CATÁLOGO GLOBAL — mantenido por LedgerCore  │
│  239 tipos QBXML + campos + validaciones QB  │
│  Igual para todos los clientes               │
│  Solo el equipo de LedgerCore puede editar   │
└──────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────┐
│  POR TENANT (empresa cliente)                │
│  Sedes + configuración QB                    │
│  Templates por sede y tipo de operación      │
│  Business rules propias de cada sede         │
└──────────────────────────────────────────────┘
```

### Flujo de operación

```
Empresa A ──┐
Empresa B ──┼──▶ LedgerCore API ──▶ PostgreSQL (Docker → Cloud)
Empresa C ──┘         │
                       ▼
              qbxmlIntegrator
              (Windows + QB Desktop por empresa)
```

### Tablas principales

**Catálogo global:**

| Tabla | Propósito |
|---|---|
| `qbxml_type` | 239 tipos de operación (VendorAdd, CustomerMod, etc.) |
| `qbxml_version` | Versiones QB Desktop (v13.0, v17.0, extensible) |
| `qbxml_field` | Campos por tipo + versión: nombre, orden, tipo, required_by_intuit |

**Por tenant:**

| Tabla | Propósito |
|---|---|
| `tenant` | Empresas cliente |
| `sede` | Sucursales QB Desktop por empresa (versión QB + URL integrador) |
| `template` | Definición de formulario por tipo QBXML y tenant |
| `template_field` | Campos del template: visible + required/optional |
| `template_sede` | Asignación template → sede(s), con is_default |

**Vistas derivadas:**

| Vista | Propósito |
|---|---|
| `template_field_resolved` | Campos de un template con todos los flags combinados — usada en tiempo real |
| `sede_template_catalog` | Catálogo de templates disponibles por sede — usada para el selector del front |

---

## Decisiones de arquitectura

| Decisión | Opción elegida | Razón |
|---|---|---|
| Hosting PostgreSQL | Docker local → Cloud cuando escale | Agilidad en desarrollo; portabilidad garantizada |
| Multi-tenancy | Misma DB con `tenant_id` | Simple de operar; Opción por-DB cuando el volumen lo justifique |
| Catálogo QBXML editable por cliente | No — solo equipo LedgerCore | Protege integridad del producto |
| Refresco de templates | Consistencia eventual | Templates son config administrativa; segundos de latencia aceptables |

---

## Lo que NO cambia

- **LedgerBridge actual** — sigue operando sin modificaciones
- **qbxmlIntegrator** — Windows + QB Desktop por empresa; es físico, no migrable
- **Constructor QBXML** — sigue siendo código; la DB alimenta los datos
- **Parser de respuestas QB** — sigue siendo código
- **Conexión COM con QB** — inamovible

---

## Servicios a implementar en LC (por prioridad)

Fuente: `docs/SERVICE_CATALOG.md` — catálogo entregado por LedgerBridge (PROMPT-LB-022 ✅)

| Prioridad | ID | Servicio | Equivalente en LC |
|---|---|---|---|
| 🔴 P0 | LB-02 | Part 2 — Assemble (XML Build) | Consulta `template_field_resolved` + construye XML desde DB |
| 🔴 P0 | LB-05 | JsonIn Get (Contrato dinámico) | Enriquecido con `template_field_resolved` — incluye `template_id` |
| 🟠 P1 | LB-01 | Part 1 — Blueprint (XML Register) | INSERT en `qbxml_source` + `qbxml_field` |
| 🟠 P1 | LB-04 | Describe Get | SELECT en `qbxml_field` por tipo + versión |
| 🟠 P1 | LB-03 | Types List | SELECT en `qbxml_type` |
| 🟠 P1 | LB-P1 | Validate JSON In | Nuevo en LC — implementar de primera clase |
| 🟡 P2 | LB-13 | Rules Get | SELECT en `template_field WHERE required = TRUE` |
| 🟡 P2 | LB-08/09 | Sedes List / Get | SELECT en `sede` por tenant |
| 🔵 P3 | LB-07 | Version Clone | INSERT en catalog con nueva `version_id` |
| 🔵 P3 | LB-14..16 | Rules Add / Replace / Remove | CRUD en `template_field` |
| 🔵 P3 | LB-10..12 | Sedes CRUD | CRUD en `sede` |
| ➕ Nuevo | — | Templates CRUD | Exclusivo de LC — no existe en LB |
| ⚫ N/A | LB-06 | Describe Regen All | No aplica — LC no tiene filesystem |
| ⚫ N/A | LB-18 | LB-Contracts | LC tendrá su propia API docs |

**Contrato de respuesta estándar** (mismo envelope que LB):
```json
{ "ok": true/false, "httpStatus": NNN, "code": "LC-{SERVICIO}-{RESULTADO}", "data": {}, "error": {} }
```

## Fases de desarrollo

| Fase | Alcance |
|---|---|
| **1 — DB + Catálogo** | Schema PostgreSQL + seed 239 tipos ✅ commit bf0525a |
| **2 — Setup entorno** | Docker DB + MCP PostgreSQL + MCP N8N + stack API (PROMPT-LC-001) |
| **3 — P0 Services** | LB-02 Assemble + LB-05 JsonIn Get — primera entidad E2E |
| **4 — P1 Services** | LB-01 Blueprint + LB-04 Describe + LB-03 Types + Validate |
| **5 — P2/P3 + Templates** | Sedes CRUD + Rules CRUD + Templates CRUD |
| **6 — Prueba comparativa** | Misma operación en LB y LC → validar paridad |
| **7 — Corte** | LC reemplaza LB en producción |

---

## Estado de fases

| Fase | Estado | Entregables |
|---|---|---|
| **1 — DB + Catálogo** | ✅ Completada — commit bf0525a | SCHEMA.sql · seed_catalog.py · seed_templates.py · DELIVERY.md |
| **2 — Primera entidad E2E** | ⏳ Pendiente | — |
| **3 — Templates + API** | ⏳ Pendiente | — |
| **4 — Entidades restantes** | ⏳ Pendiente | — |
| **5 — Prueba comparativa** | ⏳ Pendiente | — |
| **6 — Corte** | ⏳ Pendiente | — |

## Entregables Fase 1 (LedgerBridge — 2026-04-01)

Ubicación en repo: `docs/architecture/ledgercore/`

| Archivo | Contenido |
|---|---|
| `SCHEMA.sql` | DDL completo — 5 tablas + 2 ENUMs + 2 vistas + función `resolve_version` + seed de versiones |
| `seed_catalog.py` | Puebla `qbxml_type`, `qbxml_source`, `qbxml_field` desde el filesystem de LedgerBridge |
| `seed_templates.py` | Genera ~1,195 templates base (239 tipos × 5 sedes) con business rules existentes |
| `DELIVERY.md` | Diagrama ER + templates base del piloto + notas de implementación + guía de ejecución |

### Decisiones de diseño clave

- `required_by_intuit` viene de `requiredCorePaths` en `describe.json` — no del combined schema (mostró inconsistencias)
- `ordinal` viene de `elementOrder` — misma fuente que usa `lb-xml-build.py` hoy → compatibilidad garantizada
- `data_type` / `cardinality` inicializados en `STRTYPE` / `0..1` — refinables en fase posterior con SDK spec
- `template_field_resolved` es VIEW simple (no materializada) — depende del `template_id` elegido en runtime
- `sede_template_catalog` es MATERIALIZED VIEW — solo se refresca cuando cambian asignaciones

### Ejecución del seed

```bash
psql ledgercore < docs/architecture/ledgercore/SCHEMA.sql
python3 seed_catalog.py  --lb-root /opt/LedgerBridge --dsn "postgresql://..."
python3 seed_templates.py --lb-root /opt/LedgerBridge --dsn "postgresql://..."
```

## Referencia

- PROMPT-LB-020: `docs/inter-project/ledgerbridge/PROMPT-020-postgresql-architecture.md` ✅ solved
- Repo: `/Users/luisdominguez/Documents/GitHub/LedgerCore`
