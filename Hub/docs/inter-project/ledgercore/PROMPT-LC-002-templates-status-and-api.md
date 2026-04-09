# PROMPT-LC-002 — Templates · Estado actual y plan de implementación del API

**Fecha:** 2026-04-03
**Tipo:** feature
**Estado:** ✅ solved
**Fecha de resolución:** 2026-04-03

## PROMPTs relacionados

- [PROMPT-LC-001](PROMPT-LC-001-setup-environment.md) — setup del entorno donde se aplicó el schema inicial (incluye tablas de template)
- [PROMPT-LB-021](../ledgerbridge/PROMPT-021-ledgercore-phase1-delivery.md) — LB entregó SCHEMA.sql + seed_templates.py que definen la estructura de templates

---

## Contexto

El QB Playground de Redix (RIQ) ya tiene implementado el consumo de templates (PROMPT-RIQ-017). El componente espera que el endpoint `GET /webhook/contracts?type=X&sede=Y` de LedgerOps devuelva opcionalmente un objeto `template` con los campos configurados para esa combinación.

LedgerOps servirá ese template consultando a LedgerCore. **LC es el sistema de registro de templates** — los almacena en PostgreSQL y los expone via API.

Para que este flujo funcione de extremo a extremo, LC necesita:
1. Templates en la base de datos (generados a partir de datos reales del ecosistema)
2. Un endpoint que LO pueda llamar para obtener el template de una combinación type × sede

---

## ⚠️ Antes de implementar

Entregar a SyncBridge un **informe del estado actual** y una **propuesta de implementación**. No escribir código hasta recibir aprobación.

---

## Paso 1 — Informe del estado actual (entregar primero)

### 1. Tablas en la base de datos

Reportar el estado actual de las tablas relacionadas con templates en la DB `ledgercore`:

- ¿Qué tablas existen? (nombres, columnas clave)
- ¿Cuántos registros hay en cada una?
- ¿Se ejecutó `seed_templates.py`? ¿Qué datos generó?

Ejecutar y reportar:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;
```

Y para cada tabla de template:

```sql
SELECT COUNT(*) FROM <tabla_template>;
SELECT * FROM <tabla_template> LIMIT 5;
```

### 2. Estado del API

- ¿Hay algún endpoint de templates implementado actualmente?
- ¿El NestJS scaffold tiene algún módulo de templates?

### 3. Estado del seed

- ¿`seed_templates.py` fue ejecutado?
- Si sí: ¿qué fuente de datos usó? ¿llamó a LO o LB para obtener los campos?
- Si no: ¿qué necesita para poder ejecutarse?

---

## Paso 2 — Propuesta de implementación

Con base en el estado actual, describir cómo se implementará:

### A. Seed de templates

Describir cómo LC generará templates con datos reales:

- ¿LC llama directamente a LB (`/describe`, `/generate-contract`) o a LO (`/contracts`, `/sedes`)?
- ¿Qué combinaciones cubre el seed? (¿todas las entidades × todas las sedes o un subconjunto inicial?)
- ¿El template default incluye solo `requiredByIntuit` + `requiredBySede`, o más campos?
- ¿Cómo se actualiza si cambian los campos en LB?

### B. Endpoint para LO

LO necesita llamar a LC para obtener el template de una combinación. Describir:

- Ruta y método: `GET /templates?type=X&sede=Y[&templateId=Z]`
- Estructura de respuesta esperada:

```json
{
  "id": "uuid",
  "name": "Alta rápida de inventario",
  "isDefault": true,
  "fields": [
    { "key": "Name", "label": "Nombre del artículo", "required": true },
    { "key": "SalesPrice", "label": "Precio de venta", "required": false }
  ]
}
```

- ¿Qué retorna si no hay template para esa combinación? (null, 404, objeto vacío)
- ¿Incluye `availableTemplates` en la respuesta o es un endpoint separado?

### C. Panel de administración (alcance futuro)

Describir brevemente qué necesitaría un panel para que un administrador cree/edite templates. No implementar ahora — solo describir el alcance para tenerlo en cuenta en el diseño del API (que el CRUD quede preparado).

---

## Respuesta esperada de LC

**Primera entrega:**
1. Estado de tablas en DB (nombres, conteos, muestra de datos)
2. Estado del seed (ejecutado o no, fuente de datos)
3. Estado del API (endpoints existentes si los hay)
4. Propuesta de implementación (seed + endpoint para LO + alcance de panel admin)

**Segunda entrega — tras aprobación de SyncBridge:**
1. Seed ejecutado con datos reales
2. Endpoint `GET /templates?type=X&sede=Y` funcional
3. Ejemplo de llamada y respuesta real con datos de TEST

---

## Resolución — LC 2026-04-03

### Informe de estado

| Tabla | Registros | Observación |
|---|---|---|
| `qbxml_version` | 2 | 17.0 + 13.0 — correcto |
| `qbxml_type` | 0 | Seed no ejecutado |
| `qbxml_field` | 0 | Seed no ejecutado |
| `qbxml_source` | 0 | Seed no ejecutado |
| `tenant` | 0 | Sin datos |
| `sede` | 0 | Sin datos |
| `template` | 0 | Sin templates |
| `template_field` | 0 | Sin campos |
| `template_sede` | 0 | Sin asignaciones |

Seeds no ejecutados. Business rules vacías → templates serán "mínimo Intuit" (solo `required_by_intuit = TRUE`). API: solo `GET /api/health`.

### Propuesta aprobada

**Seed:** `seed_catalog.py + seed_templates.py --lb-root ~/Documents/GitHub/LedgerBridge/` → ~1,195 templates (239 tipos × 5 sedes). Todos `is_default = TRUE`.

**Endpoint para LO:** `GET /api/templates?type=X&sede=Y[&templateId=Z]` — respuesta inline con template + availableTemplates:

```json
{
  "template": { "id", "name", "isDefault", "fields": [...] },
  "availableTemplates": [{ "id", "name", "isDefault" }]
}
```

Sin template → `{ "template": null, "availableTemplates": [] }` (HTTP 200 — no es error).

**Panel admin:** CRUD preparado en el diseño (`/api/admin/templates/...`) pero no implementar en esta fase.

### Aprobación SyncBridge · 2026-04-03

1. ✅ Ejecutar seeds con `--lb-root ~/Documents/GitHub/LedgerBridge/`
2. ✅ `null` HTTP 200 cuando no hay template para la combinación
3. ✅ `availableTemplates` **inline** en la misma respuesta — LO hace una sola llamada a LC

Proceder con implementación.

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-03 | Emisión | PROMPT emitido a LedgerCore — informe de estado de templates en DB + propuesta de API para que LO pueda consultarlos |
| 2026-04-03 | Informe recibido | Tablas vacías, seeds listos, API sin implementar — propuesta entregada con 3 decisiones |
| 2026-04-03 | Aprobación SyncBridge | Seeds aprobados, null HTTP 200 aprobado, availableTemplates inline aprobado — [ver aprobación](#aprobación-syncbridge--2026-04-03) |
| 2026-04-03 | Implementación | Seeds ejecutados (208 templates, 594 campos, 832 asignaciones), endpoint funcional — [ver resolución](#resolución--lc-2026-04-03) |
