# PROMPT-RIQ-017 — Templates en QB Playground · Formulario configurable por sede y operación

**Fecha:** 2026-04-03
**Tipo:** feature
**Estado:** ✅ solved
**Fecha de resolución:** 2026-04-04

---

## PROMPTs relacionados

- [PROMPT-RIQ-005](PROMPT-RIQ-005-dynamic-contracts-migration.md) — migración a contratos dinámicos (base de este feature)
- [PROMPT-LO-016](../ledgerops/PROMPT-LO-016-sedes-config-contract-endpoint.md) — endpoint `/contracts` que este feature extiende
- [PROMPT-LO-018](../ledgerops/PROMPT-LO-018-contracts-intuit-required.md) — `requiredByIntuit` en contratos (campo que coexiste con template)

---

## Contexto

El QB Playground actualmente muestra todos los campos disponibles para una operación (puede superar 200 campos). Esto hace el formulario inmanejable para operaciones del día a día donde el usuario solo necesita 10-15 campos.

LedgerOps va a evolucionar el endpoint de contratos para devolver, opcionalmente, una definición de Template — un conjunto reducido de campos configurados para una sede y operación específica. RIQ debe consumir esa información de forma **adaptativa**: si el contrato incluye template, usarlo; si no, continuar con el comportamiento actual.

**El objetivo de este PROMPT es preparar RIQ para consumir Templates sin que RIQ contenga lógica de plantillas.** La lógica vive en LedgerOps (y eventualmente en LedgerCore). RIQ es solo el consumidor.

---

## Contexto técnico — cómo evolucionará el contrato

Hoy, el endpoint `GET /webhook/contracts?type=ItemInventoryAdd&sede=TEST` retorna:

```json
{
  "requiredByIntuit": ["Name", "IncomeAccountRef"],
  "requiredBySede": ["SalesPrice", "AssetAccountRef"]
}
```

En el futuro (cuando LO active Templates), retornará **campos adicionales** de forma backward-compatible:

```json
{
  "requiredByIntuit": ["Name", "IncomeAccountRef"],
  "requiredBySede": ["SalesPrice", "AssetAccountRef"],
  "template": {
    "id": "uuid-del-template",
    "name": "Alta rápida de inventario",
    "isDefault": true,
    "fields": [
      { "key": "Name", "label": "Nombre del artículo", "required": true },
      { "key": "SalesPrice", "label": "Precio de venta", "required": false },
      { "key": "IncomeAccountRef", "label": "Cuenta de ingreso", "required": true }
    ]
  },
  "availableTemplates": [
    { "id": "uuid-1", "name": "Alta rápida de inventario" },
    { "id": "uuid-2", "name": "Alta completa con costos" }
  ]
}
```

RIQ no necesita saber cómo se crean o administran los templates — solo consumirlos.

---

## ⚠️ Antes de implementar

Entregar a SyncBridge una **propuesta de diseño** para cada uno de los puntos de abajo. No escribir código hasta recibir aprobación.

---

## Paso 1 — Propuesta de diseño

### Propuesta RIQ · 2026-04-03

#### 1. Consumo adaptativo del contrato

El `useEffect` que hoy hace el fetch a `/api/integration/qb-contracts` ya existe (línea 662). Solo se amplía para leer template si viene en la respuesta:

```typescript
// Estado nuevo — null = sin template activo (comportamiento actual)
const [activeTemplate, setActiveTemplate] = useState<TemplateDefinition | null>(null);
const [availableTemplates, setAvailableTemplates] = useState<TemplateRef[]>([]);

// En el useEffect de contrato, después del fetch:
setRequiredOverlay(buildRequiredOverlay(requiredFields));
setActiveTemplate(res?.data?.template ?? null);          // null si no viene
setAvailableTemplates(res?.data?.availableTemplates ?? []);
```

Renderizado: en el bloque de "Header Fields" (línea 954), se añade una condición antes de renderizar los campos:

```
if (activeTemplate)  → renderizar solo activeTemplate.fields como FieldInput planos
                       (sin FieldGroup, sin children — los templates son flat)
if (!activeTemplate) → renderizar displayHeaderFields como hoy (comportamiento actual intacto)
```

Los `label` y `required` del template se usan tal como vienen — sin overlay adicional porque el template ya los define correctamente.

#### 2. Selector de templates

Ubicación: en el "action info bar" (línea 911), a la derecha del badge de operación y antes del botón Fill Examples. Solo visible cuando `availableTemplates.length > 1`.

```
[ Add ] [ endpoint ] [ type ] [ version ]   [Template: Alta rápida ▼]   [Fill Examples] [Reset]
```

Al cambiar de template:
- Se limpia `headerValues` (reset del formulario) — los campos del nuevo template son diferentes
- Se hace un nuevo fetch a `/api/integration/qb-contracts?type=X&sede=Y&templateId=Z`
- Se guarda la preferencia en DB

Cómo se solicita: query param `templateId` en el mismo endpoint existente. RIQ solo cambia la URL del fetch — LO decide qué devolver basado en el `templateId`.

#### 3. Persistencia de preferencia

Nueva tabla en Prisma: `integration_template_preference`

```typescript
model integration_template_preference {
  id             BigInt   @id @default(autoincrement())
  user_id        Int
  sede           String   @db.VarChar(20)
  operation_type String   @db.VarChar(60)   // ej. "ItemInventoryAdd"
  template_id    String   @db.VarChar(100)  // solo el ID, no la definición
  updated_at     DateTime @default(now()) @updatedAt

  @@unique([user_id, sede, operation_type])
}
```

- Por usuario — cada usuario tiene su preferencia independiente
- Se actualiza al cambiar de template desde el selector (no al ejecutar)
- RIQ solo guarda el `templateId` como string — nunca la definición de campos

API: un solo endpoint `PUT /api/integration/template-preference` con body `{ sede, operationType, templateId }`. El `userId` viene del JWT (`req.user`). Se usa para precargar el `templateId` en el fetch inicial del contrato.

Flujo de carga inicial:

```
GET /api/integration/template-preference?sede=X&operationType=Y
→ { templateId: "uuid" | null }
→ si templateId → fetch contrato con &templateId=uuid
→ si null → fetch contrato sin templateId (comportamiento actual)
```

#### 4. Flujo completo (propuesto con optimización)

```
Usuario selecciona sede + operación
  → Promise.all([
      GET /api/integration/template-preference?sede=X&operationType=Y,
      GET /api/integration/qb-contracts?type=X&sede=Y  (sin templateId aún)
    ])
  → Si hay preferencia guardada Y el contrato no tiene template por defecto
    → segundo fetch: GET /api/integration/qb-contracts?type=X&sede=Y&templateId=Z
  → Si contrato incluye template.fields → renderiza campos reducidos
  → Si no → renderiza todos los campos (comportamiento actual)
  → Usuario cambia template
    → nuevo fetch con templateId
    → PUT /api/integration/template-preference para guardar
```

#### 5. Compatibilidad con el sistema actual

| Punto | Estado |
|---|---|
| Sin templates activos en LO → formulario muestra todos los campos | ✅ `activeTemplate === null` → rama de renderizado actual sin cambios |
| Webhook config (RIQ-014/015/016) | ✅ Sin interacción — son capas independientes |
| Tests existentes del Playground | ✅ Los tests prueban el payload y el envío, no el renderizado de campos |
| `missingRequired` para Query | ✅ La lógica sigue retornando 0 para Query — el template no cambia esto |

---

### Aprobación SyncBridge · 2026-04-03

Propuesta aprobada con un ajuste en el flujo de carga inicial:

**Ajuste — flujo de carga:**
El `Promise.all` + segundo fetch condicional puede resultar en 2 llamadas al contrato en cada carga cuando hay preferencia guardada. La alternativa más simple:

```
GET /api/integration/template-preference?sede=X&operationType=Y  (DB local, ~5ms)
→ templateId obtenido (o null)
→ GET /api/integration/qb-contracts?type=X&sede=Y[&templateId=Z]  (un solo fetch)
```

Secuencial pero con un único fetch al contrato. La preferencia es una consulta local — la latencia agregada es mínima (~5ms). Más simple que manejar el caso del segundo fetch condicional.

**Resto de la propuesta aprobada sin cambios.**

---

## Paso 2 — Implementación

### Implementación RIQ · 2026-04-03

#### Resultado de verificación

| Paso | Resultado |
|---|---|
| 1. Sin templates en LO → formulario muestra todos los campos | ✅ `has template: False` — `activeTemplate = null` → rama de renderizado actual sin cambios |
| 2. LO activa template → formulario muestra solo campos del template | ✅ `if (activeTemplate)` → renderiza `activeTemplate.fields` planos con `label` y `required` del template |
| 3. Cambiar template desde selector → formulario se actualiza | ✅ `handleTemplateChange` limpia `headerValues`, hace nuevo fetch con `templateId`, guarda preferencia |
| 4. Cambiar sede → preferencia no se aplica a otra sede | ✅ `GET template-preference?sede=RUS&operationType=ItemInventoryAdd` → `templateId: null` (independiente) |
| 5. Cerrar y reabrir → preferencia se mantiene | ✅ `GET preference` → `templateId: "uuid-alta-rapida"` persiste en DB tras PUT |
| 6. Contracts con `templateId` desconocido → backward-compatible | ✅ LO retorna contrato normal sin `template.fields` — `activeTemplate` queda null, formulario completo |

---

## Verificación (tras implementación)

1. Abrir QB Playground, seleccionar `ItemInventoryAdd`, sede `TEST`
2. Si LO no tiene templates activos aún → el formulario muestra todos los campos (comportamiento actual sin cambios)
3. Cuando LO active un template → el formulario muestra solo los campos del template, con sus labels y marcadores de required correctos
4. Cambiar de template desde el selector → el formulario se actualiza con los campos del nuevo template
5. Cambiar de sede → la preferencia de template no se aplica (cada combinación sede+tipo es independiente)
6. Cerrar y reabrir el Playground → la preferencia de template se mantiene (se cargó de DB)

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-03 | Emisión | PROMPT emitido a RIQ |
| 2026-04-03 | Propuesta recibida | 5 puntos — [ver propuesta](#propuesta-riq--2026-04-03) |
| 2026-04-03 | Aprobación SyncBridge | Aprobada con ajuste en flujo de carga (un solo fetch al contrato) — [ver aprobación](#aprobación-syncbridge--2026-04-03) |
| 2026-04-03 | Implementación | 6/6 pasos verificados — [ver implementación](#implementación-riq--2026-04-03) |
