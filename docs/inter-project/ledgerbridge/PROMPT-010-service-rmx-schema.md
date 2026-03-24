# PROMPT-010 — Sede RMX · ItemService — Schemas v13.0

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-23 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | feature |
| **Estado** | ✅ solved |

---

## Contexto

La sede RMX corre QuickBooks Desktop 2021, que solo acepta QBXML versión 13.0. Este mismo patrón ya fue resuelto para:
- **ItemInventory** — PROMPT-007 · commit `65f1c46`
- **ItemNonInventory** — PROMPT-009 · herramienta `lb-xml-version-clone`

La infraestructura de mapeo `config/sede-version-map.json → {"RMX": "13.0"}` ya está en producción.

---

## Acción requerida

Aplicar el mismo patrón a **ItemService**:

| Tipo | Acción |
|---|---|
| `ItemServiceAdd` | Clonar/generar schema v13.0 |
| `ItemServiceMod` | Clonar/generar schema v13.0 |
| `ItemServiceQuery` | Clonar/generar schema v13.0 |

LedgerBridge es el experto — aplicar el enfoque que considere más apropiado.

---

## Referencia

| Prompt | Herramienta | Resultado |
|---|---|---|
| PROMPT-007 (ItemInventory) | `lb-xml-version-clone` | ✅ commit `65f1c46` |
| PROMPT-009 (ItemNonInventory) | `lb-xml-version-clone` | ✅ artefactos en servidor |

---

## Respuesta esperada

1. Confirmación de schemas v13.0 disponibles para ItemService en RMX
2. Commit o confirmación de artefactos generados
3. Cualquier diferencia respecto a entidades anteriores

LedgerOps ejecuta P2 (AnalyzeSedeFields + business-rules/replace) al confirmar disponibilidad.

---

## Reporte recibido — 2026-03-23

| Tipo | source-xml | describe | provider | GLOBAL | RMX |
|---|---|---|---|---|---|
| ItemServiceAdd | ✅ | ✅ | ✅ | ✅ | ✅ |
| ItemServiceMod | ✅ | ✅ | ✅ | ✅ | ✅ |
| ItemServiceQuery | ✅ | ✅ | ✅ | ✅ | ✅ |

- **Herramienta:** `lb-xml-version-clone` — mismo patrón que PROMPT-007 y PROMPT-009
- **Commit:** sin commit — artefactos generados directamente en el servidor
- **Diferencia vs entidades anteriores:** ninguna estructural
- **Nota:** en Mod, usar `SalesOrPurchaseMod` (no `SalesOrPurchase`) — aplica igual en v13.0

P2 RMX completado por LedgerOps — 2026-03-23.
