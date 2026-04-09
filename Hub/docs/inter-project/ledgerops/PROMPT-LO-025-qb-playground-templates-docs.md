# PROMPT-LO-025 — QB Playground Templates · Documentación por rol

**Fecha:** 2026-04-04
**Tipo:** docs
**Estado:** ✅ solved
**Fecha de resolución:** 2026-04-04

## PROMPTs relacionados

- [PROMPT-RIQ-017](../riq/PROMPT-RIQ-017-template-playground.md) — consumo de templates en QB Playground
- [PROMPT-RIQ-019](../riq/PROMPT-RIQ-019-template-management.md) — sistema completo de templates en DB de RIQ

---

## Objetivo

Crear los 5 documentos del feature **QB Playground Templates** en `docs/platform/QBPlaygroundTemplates/` del repo LedgerOps.

---

## Archivos a crear

### `docs/platform/QBPlaygroundTemplates/Executive.md`

# QB Playground Templates — Resumen Ejecutivo

## Qué problema resuelve

El QB Playground mostraba hasta 32 campos por operación, la mayoría irrelevantes para el flujo
diario de trabajo. Los usuarios debían identificar manualmente qué campos llenar en cada
transacción, aumentando el tiempo de operación y el riesgo de errores.

## Qué se construyó

Un sistema de **templates de campos** para el QB Playground. Un administrador define, por
operación y sede, qué campos aparecen en el formulario. Los usuarios ven únicamente los campos
relevantes para su trabajo — el resto queda oculto pero disponible si lo necesitan.

## Impacto

- El formulario pasa de hasta 32 campos a solo los necesarios para esa operación
- Cada usuario puede elegir qué template usar y el sistema recuerda su preferencia
- Un administrador puede crear o modificar templates en segundos sin tocar código
- El cambio aplica de inmediato — sin reinicio de la aplicación

## Seguridad

La creación, edición y eliminación de templates requiere cuenta de Administrador.
Los usuarios estándar solo pueden seleccionar el template que desean usar.

## Base para

Estandarizar los flujos de alta de ítems, clientes, proveedores y órdenes de venta en QB
Desktop sin depender del equipo técnico para ajustar qué campos se presentan en cada sede.

---

### `docs/platform/QBPlaygroundTemplates/Developer.md`

# QB Playground Templates — Guía para Desarrolladores

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/integration/qb-template` | Template activo + lista de disponibles para un type+sede |
| `GET` | `/api/integration/qb-template/list` | Lista todos los templates activos (admin) |
| `POST` | `/api/integration/qb-template/generate` | Crear template con campos seleccionados |
| `PUT` | `/api/integration/qb-template/:publicId` | Actualizar nombre y/o campos |
| `PUT` | `/api/integration/qb-template/:publicId/set-default` | Marcar como default para su type+sede |
| `DELETE` | `/api/integration/qb-template/:publicId` | Soft-delete (is_active = false) |

Todos los endpoints están excluidos del `CompanyContextMiddleware` — no requieren header de compañía.

## GET /api/integration/qb-template

```
GET /api/integration/qb-template?type=ItemInventoryAdd&sede=TEST
GET /api/integration/qb-template?type=ItemInventoryAdd&sede=TEST&templateId=<uuid>
```

Respuesta:
```json
{
  "data": {
    "template": {
      "publicId": "uuid",
      "name": "Template Reducido",
      "isDefault": true,
      "fields": [
        { "fieldKey": "Name", "label": "Item Name", "required": true, "sortOrder": 0 }
      ]
    },
    "availableTemplates": [
      { "publicId": "uuid", "name": "Template Reducido", "isDefault": true }
    ]
  }
}
```

Si no existe template default y no se pasa `templateId`, `template` es `null` y el Playground muestra el formulario completo.

## POST /api/integration/qb-template/generate

```json
{
  "type": "ItemInventoryAdd",
  "sede": "TEST",
  "name": "Mi Template",
  "fields": [
    { "fieldKey": "Name", "label": "Item Name", "required": true, "sortOrder": 0 },
    { "fieldKey": "SalesPrice", "label": "Precio", "required": false, "sortOrder": 1 }
  ]
}
```

- Si es el **primer template** para ese type+sede, se auto-asigna `is_default = true`.
- Los campos vienen del frontend (seleccionados con el editor de checkboxes).

## Preferencia de template por usuario

```
GET /api/integration/template-preference?sede=TEST&operationType=ItemInventoryAdd
PUT /api/integration/template-preference
    Body: { "sede": "TEST", "operationType": "ItemInventoryAdd", "templateId": "uuid" }
```

La preferencia se guarda por `(user_id, sede, operation_type)` en `utils.integration_template_preference`.

## Flujo en el QB Playground

Al seleccionar tipo + sede:
1. `GET /api/integration/template-preference` → obtiene templateId guardado
2. `Promise.all`:
   - `GET /api/integration/qb-template?type=X&sede=Y[&templateId=uuid]` → campos del template
   - `GET /api/integration/qb-contracts?type=X&sede=Y` → requiredFields overlay de LO
3. Si `activeTemplate` existe → formulario reducido (solo campos del template)
4. Si `activeTemplate` es null → formulario completo con todos los campos del contrato

## Agregar soporte a un nuevo tipo de operación

1. Asegurarse de que el tipo esté en `QB_ACTIONS` en `contracts.ts` con `hasContract: true`
2. El admin puede crear un template desde el panel QB Templates
3. No se requiere código adicional en el backend

---

### `docs/platform/QBPlaygroundTemplates/Architect.md`

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
  entity_type VARCHAR(60)  NOT NULL,
  sede        VARCHAR(20)  NOT NULL,
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
  field_key   VARCHAR(100) NOT NULL,
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

| Fuente | Qué aporta |
|--------|-----------|
| `QB_ACTIONS` en `contracts.ts` | Lista completa de campos con tipo, label y `required` base |
| `GET /api/integration/qb-contracts` (LO) | `requiredFields[]` — paths adicionales requeridos por sede |

El frontend combina ambas fuentes antes de mostrar el editor de checkboxes. El backend recibe los campos ya seleccionados y los persiste sin reinterpretar el contrato de LO.

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

Aparece cuando `availableTemplates.length >= 1`. Incluye opción "Todos los campos" (value vacío) para que el usuario pueda volver al formulario completo sin borrar su preferencia guardada.

## Preferencia por usuario

Tabla `utils.integration_template_preference`:
- `(user_id, sede, operation_type)` → unique constraint
- `template_id` almacena el `public_id` UUID del template seleccionado
- Upsert en cada cambio desde el selector

---

### `docs/platform/QBPlaygroundTemplates/QA.md`

# QB Playground Templates — Guía de Testing

## Acceso al panel de administración

`Redix → Configuración → Integraciones → QB Templates`

---

## TC-01 — Generar template base: auto-default en primera creación

**Precondición:** no existe ningún template para `ItemInventoryAdd` + sede TEST.

1. Abrir el panel QB Templates → clic en **Generar template base**
2. Seleccionar tipo `Item — Add (ItemInventoryAdd)`, sede `TEST`, nombre `"Template Base"`
3. Verificar que aparece la lista de checkboxes con todos los campos del contrato
4. Campos requeridos (req): pre-chequeados y deshabilitados
5. Campos opcionales: desmarcados, pueden seleccionarse libremente
6. Seleccionar algunos opcionales → clic en **Generar template**
7. **Resultado esperado:** template creado con `isDefault = true`

---

## TC-02 — Template se aplica automáticamente en el Playground

**Precondición:** TC-01 ejecutado.

1. Ir a QB Playground → seleccionar `Item — Add` y sede `TEST`
2. **Resultado esperado:** formulario muestra solo los campos del template (no los 32 del contrato completo)
3. En el action bar debe aparecer el selector de template con el nombre del template activo

---

## TC-03 — Selector visible con un solo template

**Precondición:** existe exactamente un template para la combinación activa.

1. Con el template del TC-01 activo, verificar el action bar del Playground
2. **Resultado esperado:** el selector aparece con la opción "Todos los campos" y el nombre del template

---

## TC-04 — Opción "Todos los campos" restaura formulario completo

1. Con un template activo en el Playground, seleccionar **Todos los campos** en el selector
2. **Resultado esperado:** el formulario muestra el contrato completo (todos los campos)
3. La preferencia guardada NO se sobrescribe (al recargar vuelve al template)

---

## TC-05 — Preferencia de template se persiste por usuario

1. En el Playground, cambiar a un template específico
2. Recargar la página
3. **Resultado esperado:** el mismo template sigue seleccionado

---

## TC-06 — Editar campos de un template

1. En el panel QB Templates, clic en **Editar** sobre un template
2. Verificar que aparece el editor de checkboxes con todos los campos del contrato
3. Los campos ya guardados aparecen chequeados
4. Campos requeridos: bloqueados
5. Modificar labels de campos opcionales → clic en **Guardar**
6. **Resultado esperado:** los cambios se reflejan en el Playground sin reinicio

---

## TC-07 — Segundo template: auto-default NO se activa

1. Crear un segundo template para `ItemInventoryAdd` + `TEST`
2. **Resultado esperado:** `is_default = false` en el nuevo template; el primero conserva `is_default = true`

---

## TC-08 — Marcar template como default

1. En el panel QB Templates, clic en el ícono ⭐ del segundo template
2. **Resultado esperado:** el segundo template pasa a `isDefault = true`; el primero a `false`
3. Abrir Playground → el template default activo es ahora el segundo

---

## TC-09 — Soft delete

1. Eliminar un template desde el panel
2. **Resultado esperado:**
   - El template desaparece del panel (`is_active = false`)
   - `GET /api/integration/qb-template/list` no lo retorna
   - Si era el default, el Playground vuelve al formulario completo

---

## Errores esperados

| Error | Causa | Solución |
|-------|-------|----------|
| Dropdown de sede vacío en el modal | LO no responde | Verificar que LedgerOps esté activo |
| Tipo no encontrado en contratos estáticos | Tipo no existe en `QB_ACTIONS` | Verificar `contracts.ts` |
| Template no aparece en Playground | `is_default = false` y no hay preferencia guardada | Marcar el template como default desde el panel |
| `500` en `GET /api/integration/qb-template` | BD no accesible | Verificar conexión a PostgreSQL |

---

### `docs/platform/QBPlaygroundTemplates/Support.md`

# QB Playground Templates — Guía de Soporte y Uso

## ¿Qué es esta función?

Los **QB Templates** permiten a un administrador definir qué campos aparecen en el QB Playground para cada tipo de operación y sede. En lugar de ver los 32 campos del formulario completo, los usuarios solo ven los campos relevantes para su trabajo diario.

---

## Cómo acceder al panel de administración

1. Iniciar sesión con una cuenta de **Administrador**
2. Ir a **Configuración** → **Integraciones** → **QB Templates**

---

## Cómo crear un template

1. Clic en **Generar template base**
2. Seleccionar el **Tipo de Operación** (ej. `Item — Add`)
3. Seleccionar la **Sede**
4. Ingresar un nombre descriptivo
5. Clic en **Siguiente** — el sistema carga los campos del contrato
6. En la lista de checkboxes:
   - Campos marcados con **req**: siempre incluidos, no se pueden desmarcar
   - Campos opcionales: marcar los que deben aparecer en el Playground
   - El **label** de cualquier campo puede editarse haciendo clic sobre el texto
7. Clic en **Generar template**

> El primer template creado para una combinación tipo + sede se activa automáticamente como default.

---

## Cómo editar un template

1. En la lista, clic en el ícono **lápiz** del template
2. Se carga el editor de checkboxes con los campos actuales
3. Marcar, desmarcar o editar labels según sea necesario
4. Clic en **Guardar**

El cambio aplica de inmediato en el Playground — no es necesario reiniciar la aplicación.

---

## Cómo marcar un template como default

Cuando existe más de un template para una misma operación y sede, solo uno puede ser el default.

1. Localizar el template que debe ser el nuevo default
2. Clic en el ícono **⭐**
3. El badge **Default** se mueve a ese template

---

## Cómo eliminar un template

1. Clic en el ícono **papelera** del template
2. Confirmar la eliminación

El template se desactiva (no se borra físicamente). Si era el default, el Playground volverá al formulario completo hasta que otro template se marque como default.

---

## Cómo usar los templates en el QB Playground

Cuando existe al menos un template para la combinación activa (tipo + sede), aparece un **selector** en el action bar del Playground:

- Seleccionar un template → el formulario se reduce a solo esos campos
- Seleccionar **Todos los campos** → el formulario muestra el contrato completo
- La selección se guarda por usuario — al volver al Playground el mismo template estará activo

---

## Cuándo usar esta función

- Al incorporar un nuevo usuario a operaciones QB: crear un template con solo los campos que debe completar
- Al detectar errores frecuentes por campos incorrectamente llenados: eliminar esos campos del template
- Al migrar de sede TEST a producción: crear templates equivalentes para la sede de producción

---

## Qué NO hacer

- **No eliminar el template default sin tener otro listo** — el Playground volverá al formulario completo con todos los campos
- **No desmarcar campos requeridos** — el sistema no lo permite; son obligatorios para QB Desktop
- **No crear templates duplicados** — si ya existe un template con el mismo nombre para esa operación y sede, el sistema rechazará la creación

---

## Respuesta esperada de LO

Confirmar:
1. Los 5 archivos creados en `docs/platform/QBPlaygroundTemplates/`
2. Commit realizado con el hash y mensaje

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-04 | Emisión | PROMPT emitido a LO — publicar 5 docs del feature QB Playground Templates |
| 2026-04-04 | Resolución | 5 archivos creados en `docs/platform/QBPlaygroundTemplates/` — commit 09b60a5 |
