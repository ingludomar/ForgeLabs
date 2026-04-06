# PROMPT-009 — Sede RMX · ItemNonInventory — Schemas v13.0

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-23 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | feature |
| **Estado** | ✅ solved |

## PROMPTs relacionados

- [PROMPT-007](PROMPT-007-rmx-sede-schema.md) — misma lógica RMX v13.0 resuelta para ItemInventory; PROMPT-009 aplica el mismo patrón a ItemNonInventory

---

## Contexto

La sede RMX corre QuickBooks Desktop 2021, que solo acepta QBXML versión 13.0 en el header XML. Versiones superiores (incluyendo v17.0) son rechazadas por QB.

Este mismo problema ya fue resuelto para la entidad **ItemInventory** en PROMPT-007 (commit `65f1c46`). La solución consistió en:
1. Clonar los schemas de ItemInventory de v17.0 a v13.0
2. Implementar el mapeo de sede → versión en `config/sede-version-map.json` con `{"RMX": "13.0"}`
3. `lb-part2-xml.sh` remapea la versión al construir el XML cuando la sede es RMX

Esa infraestructura ya está en producción. El mapeo `"RMX": "13.0"` en `sede-version-map.json` ya existe.

---

## Acción requerida

Para la entidad **ItemNonInventory**, aplicar el mismo patrón que funcionó para ItemInventory:

Entidades involucradas:
- `ItemNonInventoryAdd`
- `ItemNonInventoryMod`
- `ItemNonInventoryQuery`

Clonar (o generar) los schemas v13.0 para estos tres tipos, de forma que LedgerBridge pueda construir el QBXML correcto cuando `sede = RMX`.

> LedgerBridge es el experto en la estructura interna de schemas. Si el patrón de ItemInventory no aplica directamente para ItemNonInventory, aplicar el enfoque que considere más apropiado. El objetivo es que las tres operaciones funcionen para RMX.

---

## Verificación esperada

Una vez implementado, LedgerOps verificará con:

```bash
# Add
curl -s -X POST https://n8n-development.redsis.ai/webhook/inventory/item/add \
  -H "Content-Type: application/json" \
  -d '{
    "type": "ItemNonInventoryAdd",
    "sede": "RMX",
    "version": "17.0",
    "data": {
      "Name": "NON-INV-RMX-TEST-01",
      "SalesTaxCodeRef": { "ListID": "<rmx-tax-listid>" },
      "SalesOrPurchase": {
        "Price": "50.00",
        "AccountRef": { "ListID": "<rmx-account-listid>" }
      }
    }
  }'
```

LedgerOps enviará siempre `"version": "17.0"` — LedgerBridge remapea a 13.0 internamente para RMX.

---

## Referencia

| Prompt anterior | Commit resolutorio | Archivo clave |
|---|---|---|
| PROMPT-007 (ItemInventory RMX) | `65f1c46` | `config/sede-version-map.json` |

---

## Respuesta esperada

Reportar a LedgerOps:
1. Confirmación de schemas v13.0 disponibles para ItemNonInventory en RMX
2. Commit en el repositorio
3. Cualquier diferencia de implementación respecto a ItemInventory

LedgerOps se encarga de correr el P2 (AnalyzeSedeFields + business-rules/replace) una vez confirmada la disponibilidad.

---

## Reporte recibido — 2026-03-23

| Tipo | source-xml | describe | provider | GLOBAL | RMX |
|---|---|---|---|---|---|
| ItemNonInventoryAdd | ✅ | ✅ | ✅ | ✅ | ✅ |
| ItemNonInventoryMod | ✅ | ✅ | ✅ | ✅ | ✅ |
| ItemNonInventoryQuery | ✅ | ✅ | ✅ | ✅ | ✅ |

- **Herramienta:** `lb-xml-version-clone` — misma que PROMPT-007, sin cambio de código
- **Commit:** sin commit — artefactos generados directamente en el servidor
- **Diferencia vs ItemInventory:** ninguna — patrón idéntico
- **businessRulesCopied.RMX:** `no-source-rules` — P2 pendiente por LedgerOps
- **config/sede-version-map.json** → `{"RMX": "13.0"}` ya cubre esta entidad automáticamente

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-23 | Emisión | PROMPT emitido a LedgerBridge — schemas v13.0 para ItemNonInventory en sede RMX |
| 2026-03-23 | Resolución | Schemas generados con `lb-xml-version-clone`; 3/3 tipos disponibles en RMX |
