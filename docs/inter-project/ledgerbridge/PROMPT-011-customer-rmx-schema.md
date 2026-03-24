# PROMPT-011 — Sede RMX · Customer — Schemas v13.0

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-23 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | feature |
| **Estado** | ✅ solved |

---

## Contexto

La sede RMX corre QuickBooks Desktop 2021, que solo acepta QBXML versión 13.0. Este patrón ya fue resuelto para:
- **ItemInventory** — PROMPT-007 · commit `65f1c46`
- **ItemNonInventory** — PROMPT-009 · herramienta `lb-xml-version-clone`
- **ItemService** — PROMPT-010 · herramienta `lb-xml-version-clone`

La infraestructura de mapeo `config/sede-version-map.json → {"RMX": "13.0"}` ya está en producción.

---

## Acción requerida

Aplicar el mismo patrón a **Customer**:

| Tipo | Acción |
|---|---|
| `CustomerAdd` | Clonar/generar schema v13.0 |
| `CustomerMod` | Clonar/generar schema v13.0 |
| `CustomerQuery` | Clonar/generar schema v13.0 |

LedgerBridge es el experto — aplicar el enfoque que considere más apropiado.

---

## Referencia

| Prompt | Herramienta | Resultado |
|---|---|---|
| PROMPT-007 (ItemInventory) | `lb-xml-version-clone` | ✅ commit `65f1c46` |
| PROMPT-009 (ItemNonInventory) | `lb-xml-version-clone` | ✅ artefactos en servidor |
| PROMPT-010 (ItemService) | `lb-xml-version-clone` | ✅ artefactos en servidor |

---

## Respuesta esperada

1. Confirmación de schemas v13.0 disponibles para Customer en RMX
2. Commit o confirmación de artefactos generados
3. Cualquier diferencia respecto a entidades anteriores

LedgerOps ejecuta P2 RMX (business-rules/replace) al confirmar disponibilidad.
