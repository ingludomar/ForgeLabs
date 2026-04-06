# QB Playground Templates — Diseño de Arquitectura

## Componentes

```
IntegrationModule
├── IntegrationController   — endpoints /api/integration/qb-template*
├── IntegrationService      — lógica: getQbTemplate, generateBaseTemplate, CRUD
└── IntegrationRepository   — Prisma → utils.qb_template + utils.qb_template_field

Frontend
├── QBTemplatesSection      — panel admin (Settings → Integrations → QB Templates)
└── QBPlaygroundSection     — selector de template + formulario adaptativo
```

## Esquema de base de datos (schema `utils`)

```sql
CREATE TABLE utils.qb_template (
  id          BIGSERIAL PRIMARY KEY,
  public_id   UUID UNIQUE DEFAULT gen_random_uuid(),
  entity_type VARCHAR(60)  NOT NULL,   -- ej. "ItemInventoryAdd"
  sede        VARCHAR(20)  NOT NULL,   -- ej. "TEST"
  name        VARCHAR(120) NOT NULL,
  is_default  BOOLEAN      NOT NULL DEFAULT false,
  is_active   BOOLEAN      NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL,
  created_by  VARCHAR(100) NOT NULL DEFAULT 'system',
  CONSTRAINT uq_qb_template UNIQUE (entity_type, sede, name)
);

CREATE TABLE utils.qb_template_field (
  id          BIGSERIAL PRIMARY KEY,
  template_id BIGINT       NOT NULL REFERENCES utils.qb_template(id) ON DELETE CASCADE,
  field_key   VARCHAR(100) NOT NULL,   -- path top-level del ContractField
  label       VARCHAR(120) NOT NULL,
  required    BOOLEAN      NOT NULL DEFAULT false,
  sort_order  INT          NOT NULL DEFAULT 0,
  CONSTRAINT uq_qb_template_field UNIQUE (template_id, field_key)
);
```

Soft delete: `is_active = false`. Nunca se borran filas físicamente.

## Regla de auto-default

Cuando se crea el **primer template activo** para una combinación `(entity_type, sede)`,
`is_default` se establece automáticamente en `true`. Para combinaciones que ya tienen templates,
el admin debe marcar el default explícitamente desde el panel.

## Fuente de campos: contrato estático + overlay dinámico

Los campos disponibles para un template provienen de dos fuentes:

| Fuente | Qué aporta |
|--------|-----------|
| `QB_ACTIONS` en `contracts.ts` | Lista completa de campos con tipo, label y `required` base |
| `GET /api/integration/qb-contracts` (LO) | `requiredFields[]` — paths adicionales requeridos por sede |

El frontend combina ambas fuentes antes de mostrar el editor de checkboxes. El backend
recibe los campos ya seleccionados y los persiste sin reinterpretar el contrato de LO.

## Flujo de resolución en el Playground

```
Selección type + sede
  │
  ├─ GET /api/integration/template-preference  → templateId guardado (o null)
  │
  └─ Promise.all
       ├─ GET /api/integration/qb-template?type&sede[&templateId]
       │    └─ si templateId → busca ese template (is_active=true)
       │    └─ si no → busca is_default=true para ese type+sede
       │    └─ resultado: { template | null, availableTemplates[] }
       │
       └─ GET /api/integration/qb-contracts?type&sede
            └─ resultado: { requiredFields[] }

Si template ≠ null → formulario reducido (campos del template)
Si template = null → formulario completo (todos los campos del contrato)
```

## Selector en el Playground

Aparece cuando `availableTemplates.length >= 1`. Incluye opción "Todos los campos" (value vacío)
para que el usuario pueda volver al formulario completo sin borrar su preferencia guardada.

## Preferencia por usuario

Tabla `utils.integration_template_preference`:
- `(user_id, sede, operation_type)` → unique constraint
- `template_id` almacena el `public_id` UUID del template seleccionado
- Upsert en cada cambio desde el selector
