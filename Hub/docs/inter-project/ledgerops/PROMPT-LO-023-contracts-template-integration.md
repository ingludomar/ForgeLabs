# PROMPT-LO-023 — Integrar templates de LedgerCore en el endpoint /contracts

**Fecha:** 2026-04-03
**Tipo:** feature
**Estado:** ❌ cancelado — 2026-04-04

**Motivo de cancelación:** Los templates se almacenarán directamente en la DB de RIQ (Prisma), no en LC ni en un servicio externo. LO no necesita servir templates — RIQ consulta su propia DB en runtime. La creación de templates usa webhooks de LO/LB para obtener los campos disponibles (una vez), pero el serving es completamente local a RIQ. Ver PROMPT-RIQ-019.

## PROMPTs relacionados

- [PROMPT-LO-016](PROMPT-016-sedes-config-contract-endpoint.md) — endpoint `/contracts` que este PROMPT extiende
- [PROMPT-LO-018](PROMPT-018-contracts-intuit-required.md) — `requiredByIntuit` ya integrado en `/contracts`
- [PROMPT-LC-002](../ledgercore/PROMPT-LC-002-templates-status-and-api.md) — LC expone `GET /api/templates?type=X&sede=Y` que este PROMPT consume
- [PROMPT-RIQ-017](../riq/PROMPT-RIQ-017-template-playground.md) — RIQ ya consume templates desde `/contracts` — este PROMPT completa el flujo E2E

---

## Contexto

LedgerCore (LC) expone el endpoint:

```
GET http://localhost:3001/api/templates?type=X&sede=Y[&templateId=Z]
```

Respuesta cuando hay template:
```json
{
  "template": {
    "id": 365,
    "name": "ItemInventoryAdd — mínimo Intuit",
    "isDefault": true,
    "fields": [
      { "key": "Name", "label": "Name", "required": true }
    ]
  },
  "availableTemplates": [
    { "id": 365, "name": "ItemInventoryAdd — mínimo Intuit", "isDefault": true }
  ]
}
```

Sin template para esa combinación:
```json
{ "template": null, "availableTemplates": [] }
```

RIQ ya está preparado para consumir este dato en la respuesta de `/contracts` (PROMPT-RIQ-017 implementado).

---

## ⚠️ Antes de implementar

Entregar a SyncBridge una **propuesta de implementación**. No escribir código hasta recibir aprobación.

---

## Paso 1 — Propuesta de diseño (entregar primero)

### 1. Integración en el workflow de /contracts

El endpoint actual `GET /webhook/contracts?type=X&sede=Y` ya llama a LedgerBridge para obtener `requiredByIntuit` y `requiredBySede`. Se debe agregar una llamada a LC para obtener el template.

Describir:
- ¿La llamada a LC se hace en paralelo con la llamada a LB (`Promise.all`) o secuencial?
- ¿Qué pasa si LC no está disponible? (timeout, fallback, o error)
- ¿Se reenvía el `templateId` si viene como query param en la solicitud de RIQ?

### 2. Respuesta enriquecida

La respuesta actual de `/contracts`:
```json
{
  "requiredByIntuit": [...],
  "requiredBySede": [...]
}
```

La nueva respuesta debe incluir los campos de template de forma **aditiva** (sin romper clientes que ya consumen /contracts):
```json
{
  "requiredByIntuit": [...],
  "requiredBySede": [...],
  "template": { ... } | null,
  "availableTemplates": [...]
}
```

Confirmar que este es el formato o proponer ajuste.

### 3. Configuración del endpoint de LC

Describir cómo se configura la URL base de LC en el workflow:
- ¿Variable de entorno? ¿Hardcoded temporal?
- Si LC no tiene URL pública aún (corre en localhost), ¿cómo se resuelve para que N8N pueda llamarlo?

---

## Paso 2 — Implementación (solo después de aprobación de SyncBridge)

---

## Verificación (tras implementación)

1. `GET /webhook/contracts?type=ItemInventoryAdd&sede=TEST` → respuesta incluye `template` con campo `Name` y `availableTemplates` con un template
2. `GET /webhook/contracts?type=HostQuery&sede=TEST` → respuesta incluye `template: null` y `availableTemplates: []`
3. `GET /webhook/contracts?type=ItemInventoryAdd&sede=RMX` → respuesta incluye `template: null` (RMX sin seed v13.0) — fallback correcto
4. `GET /webhook/contracts?type=ItemInventoryAdd&sede=TEST&templateId=365` → respuesta sirve el template específico
5. LC caído / timeout → `/contracts` sigue respondiendo con `requiredByIntuit` y `requiredBySede` (degradación graceful)

---

## Respuesta esperada de LO

**Primera entrega:**
1. Propuesta de integración (paralelo vs secuencial, fallback, templateId)
2. Confirmación del formato de respuesta
3. Solución para la URL de LC (variable de entorno, tunneling, etc.)

**Segunda entrega — tras aprobación:**
1. Implementación
2. Resultado de los 5 pasos de verificación

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-03 | Emisión | PROMPT emitido a LedgerOps — integrar `GET /api/templates` de LC en el endpoint `/contracts` |
