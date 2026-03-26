# PROMPT-008 — LedgerOps · Corrección docs PurchaseOrder — versión RMX

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-25 |
| **Proyecto destino** | LedgerOps |
| **Tipo** | fix |
| **Estado** | ✅ solved (2026-03-25) |

---

## Contexto

Los docs de integración de PurchaseOrder no indicaban que la sede RMX requiere `"version": "13.0"` en el payload. LedgerBridge clona el contrato v17.0 a v13.0 para RMX — el sistema origen debe enviar la versión correcta o el contrato no matchea.

---

## Archivos a actualizar

### 1. `docs/integration/developer/PurchaseOrder.md`

Agregar sección **"Versión por sede"** después de los endpoints y antes de PurchaseOrderAdd:

```markdown
## Versión por sede

| Sede | `version` a enviar |
|---|---|
| TEST · RUS · REC · RBR | `"17.0"` |
| RMX | `"13.0"` — LedgerBridge tiene un contrato separado clonado en v13.0 |

> Para RMX el payload debe incluir `"version": "13.0"`. Usar `"17.0"` en RMX resultará en error de contrato no encontrado.
```

---

### 2. `docs/integration/quickstart/PurchaseOrder.md`

Reemplazar la tabla "Campos que cambiar por sede" con:

```markdown
## Campos que cambiar por sede

| Sede | `version` | VendorRef.ListID | ItemRef.ListID |
|---|---|---|---|
| TEST | `"17.0"` | `800001F1-1597178964` | `8000995C-1773224502` |
| RUS · REC · RBR | `"17.0"` | Obtener de QB Desktop de la sede | Obtener de QB Desktop de la sede |
| RMX | `"13.0"` | Obtener de QB Desktop de la sede | Obtener de QB Desktop de la sede |

> **RMX usa `"version": "13.0"`** — LedgerBridge tiene un contrato separado clonado en v13.0. Enviar `"17.0"` resultará en error.
```

---

### 3. `docs/integration/architect/PurchaseOrder.md`

Reemplazar la fila RMX en la tabla "QBXML version por sede":

```markdown
| RMX | 2021 | **13.0** — LedgerBridge clona el contrato v17.0 a v13.0. El sistema origen debe enviar `"version": "13.0"` en el payload. |
```

---

## Respuesta esperada

Confirmación de commit aplicado con los 3 archivos corregidos.
