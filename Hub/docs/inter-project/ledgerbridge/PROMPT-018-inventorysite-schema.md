# PROMPT-018 — LedgerBridge · InventorySite · Schemas v17.0 + v13.0 RMX

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-26 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | feature |
| **Estado** | ✅ solved (2026-03-26) |

## PROMPTs relacionados

- [PROMPT-017](PROMPT-017-creditcardcharge-schema.md) — misma lógica de auditoría y carga de schemas v17.0 + clonado v13.0 RMX

---

## Contexto

Inicio de desarrollo de la entidad **InventorySite** (posición 10 en roadmap). Antes de poder ejecutar P1 y P2 en todas las sedes, necesitamos que LedgerBridge audite el estado actual de soporte para esta entidad.

---

## Acción requerida

1. **Auditar** si los schemas existen y están correctamente cargados para los siguientes tipos en v17.0 (sedes TEST · RUS · REC · RBR) y v13.0 (sede RMX):

| Tipo | Operación |
|---|---|
| `InventorySiteAdd` | Add |
| `InventorySiteMod` | Mod |
| `InventorySiteQuery` | Query |

2. **Resolver** lo que sea necesario según los hallazgos de la auditoría — incluyendo carga de schemas faltantes y clonado v13.0 para RMX si aplica.

---

## Respuesta esperada

Reporte de auditoría con el estado encontrado y las acciones tomadas. Confirmación de que `/webhook/tools/describe` responde correctamente para los 3 tipos en todas las sedes requeridas.

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-26 | Emisión | PROMPT emitido a LedgerBridge — auditoría y carga de schemas InventorySite en v17.0 + v13.0 RMX |
| 2026-03-26 | Resolución | Schemas auditados y resueltos; describe responde correctamente en todas las sedes |
