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

Si no existe template default y no se pasa `templateId`, `template` es `null` y el Playground
muestra el formulario completo.

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
