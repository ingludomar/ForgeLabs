# PROMPT-RIQ-019 — Templates · Gestión completa en DB de RIQ

**Fecha:** 2026-04-04
**Tipo:** feature
**Estado:** ✅ solved
**Fecha de resolución:** 2026-04-04

## PROMPTs relacionados

- [PROMPT-RIQ-017](PROMPT-RIQ-017-template-playground.md) — consumo de templates ya implementado (fuente cambia: DB de RIQ en lugar de LO)
- [PROMPT-RIQ-014](PROMPT-RIQ-014-webhook-config-system.md) — patrón de referencia: webhook_override en DB de RIQ con panel admin
- [PROMPT-LO-016](../ledgerops/PROMPT-LO-016-sedes-config-contract-endpoint.md) — `/contracts` y `/sedes` que se usan para obtener campos al crear templates

---

## Contexto

PROMPT-RIQ-017 implementó el **consumo** de templates en el QB Playground — el formulario se adapta si hay template disponible. Sin embargo, la fuente de los templates estaba pendiente de definir.

**Decisión de arquitectura:** Los templates se almacenan en la DB de RIQ (Prisma). RIQ es autónomo — no depende de ningún servicio externo para servir templates en runtime. LO/LB se consultan solo en el momento de **crear** un template (para obtener el catálogo de campos disponibles). En producción, la DB migra con el resto de la app — cero cambios de código.

---

## Cambio respecto a PROMPT-RIQ-017

RIQ-017 asumía que el template vendría en la respuesta de `GET /webhook/contracts` desde LO. **Eso ya no aplica.** El flujo correcto es:

```
Antes (RIQ-017):
  RIQ frontend → LO /contracts → LO retorna contrato + template

Ahora (RIQ-019):
  RIQ frontend → RIQ backend → DB local → retorna template
  RIQ frontend → LO /contracts → LO retorna solo contrato (sin template)
```

El componente `QBPlaygroundSection.tsx` necesita ajustarse para obtener el template desde el backend de RIQ, no desde la respuesta de LO.

---

## ⚠️ Antes de implementar

Entregar a SyncBridge una **propuesta de diseño**. No escribir código hasta recibir aprobación.

---

## Paso 1 — Propuesta de diseño (entregar primero)

### 1. Modelos Prisma

Describir las tablas necesarias en la DB de RIQ:

- `qb_template` — un template por combinación `(entity_type, sede)`. Columnas mínimas: `id`, `entity_type`, `sede`, `name`, `is_default`, `created_at`
- `qb_template_field` — campos del template. Columnas mínimas: `id`, `template_id`, `field_key`, `label`, `required`, `sort_order`

Incluir el schema Prisma completo y la migración.

### 2. Seed inicial

Al crear un template para `(entity_type, sede)`, RIQ llama a `GET /webhook/contracts?type=X&sede=Y` para obtener los campos disponibles (`requiredByIntuit` + `requiredBySede`). Con esos campos crea el template base.

Describir:
- ¿El seed se dispara manualmente desde el panel admin (botón "Generar template base")?
- ¿O hay un proceso automático que genera templates para todas las combinaciones al iniciar?
- ¿Qué campos incluye el template generado? (solo required, o todos los disponibles en el contrato)

### 3. Ajuste en QBPlaygroundSection.tsx

El componente actualmente espera el template en la respuesta de LO. Describir cómo se ajusta:

- ¿Se hace una llamada separada al backend de RIQ para obtener el template?
- ¿Esa llamada va en paralelo con la llamada a LO /contracts?
- ¿El backend de RIQ tiene un endpoint `GET /api/integration/template?type=X&sede=Y` propio?

### 4. Panel de administración de templates

Un administrador debe poder gestionar los templates desde Redix. Describir:

- **Dónde vive en la navegación** — ¿junto al panel de webhook config en Settings → Integrations?
- **CRUD básico:**
  - Listar templates existentes (agrupados por entidad o por sede)
  - Crear template para una combinación type+sede (usa /contracts de LO para obtener campos)
  - Editar campos de un template (agregar/quitar campos, cambiar label, marcar required)
  - Eliminar template (el Playground vuelve al formulario completo)
- **Selector de template default** cuando hay múltiples templates para la misma combinación

### 5. Compatibilidad con PROMPT-RIQ-017

Confirmar que:
- El componente sigue funcionando si no hay template en DB para esa combinación (formulario completo — sin cambios)
- La tabla `integration_template_preference` (ya implementada en RIQ-017) sigue siendo válida — guarda el `templateId` que apunta a la DB local
- Los 6 pasos de verificación de RIQ-017 siguen pasando con el ajuste de fuente

---

### Propuesta RIQ · 2026-04-04

#### 1. Modelos Prisma

```prisma
model qb_template {
  id          BigInt              @id @default(autoincrement())
  public_id   String              @unique @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  entity_type String              @db.VarChar(60)
  sede        String              @db.VarChar(20)
  name        String              @db.VarChar(120)
  is_default  Boolean             @default(false)
  is_active   Boolean             @default(true)
  created_at  DateTime            @default(now()) @db.Timestamptz(6)
  updated_at  DateTime            @updatedAt @db.Timestamptz(6)
  created_by  String              @default("system") @db.VarChar(100)

  fields      qb_template_field[]

  @@unique([entity_type, sede, name], map: "uq_qb_template")
  @@index([entity_type, sede], map: "idx_qb_template_type_sede")
  @@schema("utils")
}

model qb_template_field {
  id          BigInt      @id @default(autoincrement())
  template_id BigInt
  field_key   String      @db.VarChar(100)
  label       String      @db.VarChar(120)
  required    Boolean     @default(false)
  sort_order  Int         @default(0)

  template    qb_template @relation(fields: [template_id], references: [id], onDelete: Cascade)

  @@unique([template_id, field_key], map: "uq_qb_template_field")
  @@index([template_id], map: "idx_qb_template_field_template")
  @@schema("utils")
}
```

`integration_template_preference.template_id` almacena el `public_id` (UUID) del template.

#### 2. Seed — manual desde el panel admin

Botón "Generar template base": administrador selecciona `entity_type + sede` → RIQ llama a `GET /webhook/contracts` de LO → crea template con **todos los campos** del contrato (`requiredByIntuit` + `requiredBySede`). Los required se marcan según el contrato. Nombre: `"Base {entity_type} {sede}"`, `is_default = true`. No automático al arrancar — evita 161 llamadas innecesarias.

#### 3. Ajuste en QBPlaygroundSection.tsx

Nuevo endpoint: `GET /api/integration/qb-template?type=X&sede=Y[&templateId=UUID]`

Flujo:
```
GET /api/integration/template-preference  (secuencial, DB local ~5ms)
→ savedTemplateId

Promise.all([
  GET /api/integration/qb-template?type=X&sede=Y&templateId=savedId,  // RIQ DB
  GET /api/integration/qb-contracts?type=X&sede=Y                     // LO (sin templateId)
])
```

LO queda limpio de lógica de templates. `templateId` puede eliminarse de `/qb-contracts`.

#### 4. Panel admin

Ruta: `/settings/integrations/qb-templates` — junto a Webhooks N8N.
CRUD: listar (agrupado por entity_type), generar base, editar campos (label/required/sort_order/agregar/eliminar), marcar default, eliminar (soft delete `is_active = false`).

#### 5. Compatibilidad con RIQ-017

Sin template en DB → `{ template: null }` → `activeTemplate = null` → formulario completo intacto. `integration_template_preference` sigue válida. Los 6 pasos de RIQ-017 siguen pasando.

---

### Aprobación SyncBridge · 2026-04-04

⚠️ Aprobado con ajuste: agregar `is_active Boolean @default(true)` al modelo `qb_template` (incluido en la propuesta arriba). El resto aprobado sin cambios.

---

## Paso 2 — Implementación

### Implementación RIQ · 2026-04-04

- Modelos `qb_template` (con `is_active Boolean @default(true)`) y `qb_template_field` en Prisma — tablas creadas en schema `utils`
- 6 endpoints REST en `/api/integration/qb-template`
- `createTemplate` hace COUNT previo y auto-setea `is_default = true` si es el primero para ese `type+sede`
- `QBPlaygroundSection.tsx` ajustado: template viene de RIQ vía `Promise.all([GET qb-template, GET qb-contracts])`
- `QBTemplatesSection.tsx`: panel admin con flujo de 2 pasos — selector de tipo+sede+nombre → checklist de campos con required bloqueados
- Sede en el modal usa dropdown desde `GET /api/integration/qb-sedes` — misma fuente que el Playground
- Selector de template en el Playground visible cuando `availableTemplates.length >= 1`, incluye opción "Todos los campos"
- Ruta `/settings/integrations/qb-templates` + ítem en el menú lateral

---

## Verificación (tras implementación)

1. Sin template en DB → Playground muestra formulario completo (comportamiento actual intacto)
2. Crear template para `ItemInventoryAdd + TEST` desde el panel admin → campos guardados en DB
3. Abrir Playground `ItemInventoryAdd + TEST` → formulario muestra solo los campos del template
4. Editar el template (agregar un campo) → Playground refleja el cambio sin reiniciar
5. Eliminar el template → Playground vuelve al formulario completo
6. Preferencia de template persiste entre sesiones (templateId en DB apunta a template local)
7. Cambiar de local a producción (migración de DB) → templates disponibles sin ningún cambio de código

---

## Respuesta esperada de RIQ

**Primera entrega:**
1. Modelos Prisma (`qb_template` + `qb_template_field`) con migración
2. Estrategia de seed (manual vs automático, campos incluidos)
3. Ajuste en `QBPlaygroundSection.tsx` (endpoint propio, llamada paralela)
4. Diseño del panel admin (navegación + CRUD)
5. Confirmación de compatibilidad con RIQ-017

**Segunda entrega — tras aprobación:**
1. Implementación
2. Resultado de los 7 pasos de verificación

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-04 | Emisión | PROMPT emitido a RIQ — templates en DB de RIQ, panel admin, ajuste de fuente vs RIQ-017 |
| 2026-04-04 | Propuesta recibida | 5 puntos entregados — [ver propuesta](#propuesta-riq--2026-04-04) |
| 2026-04-04 | Aprobación SyncBridge | Aprobado con ajuste: `is_active` agregado al modelo — [ver aprobación](#aprobación-syncbridge--2026-04-04) |
| 2026-04-04 | Implementación | Entregada — 7 pasos técnicos verificados |
| 2026-04-04 | Correcciones | 3 correcciones aplicadas: required bloqueados en editor, template auto-aplicado, sede como dropdown |
| 2026-04-04 | E2E | ✅ 7 pasos + selector A/B/C/D verificados desde el UI de Redix |
| 2026-04-04 | Resolución | PROMPT cerrado — [ver implementación](#implementación-riq--2026-04-04) |
| 2026-04-04 | Push | Rama `feature/redix-integration-quickbooks-playground` — último commit ff9a898 |
