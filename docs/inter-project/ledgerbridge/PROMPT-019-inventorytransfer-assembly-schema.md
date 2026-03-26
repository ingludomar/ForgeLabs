# PROMPT-019 — LedgerBridge · InventoryTransfer · Assembly · Schemas v17.0 + v13.0 RMX

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-26 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | feature |
| **Estado** | ⏳ pending |

---

## Contexto

Inicio de desarrollo de las entidades **InventoryTransfer** (#11) y **Assembly** (#12) en roadmap. Ambas requieren QB Enterprise con Advanced Inventory — confirmado disponible en TEST.

Antes de ejecutar P1 y P2 necesitamos que LedgerBridge audite el estado de soporte para ambas entidades en v17.0 (sedes TEST · RUS · REC · RBR) y v13.0 (sede RMX).

---

## Acción requerida

### InventoryTransfer

Auditar y resolver schemas para los siguientes tipos:

| Tipo | Operación |
|---|---|
| `TransferInventoryAdd` | Add |
| `TransferInventoryQuery` | Query |

> **Nota:** QB Desktop no expone Mod para TransferInventory. Si el SDK incluye tipos adicionales, confirmar cuáles están disponibles.

### Assembly (BuildAssembly)

Auditar y resolver schemas para los siguientes tipos:

| Tipo | Operación |
|---|---|
| `BuildAssemblyAdd` | Add |
| `BuildAssemblyMod` | Mod |
| `BuildAssemblyQuery` | Query |

### Para cada entidad — v17.0 y v13.0

1. **Auditar** si los schemas existen y están correctamente cargados en v17.0 (sedes TEST · RUS · REC · RBR)
2. **Clonar** schemas v13.0 para sede RMX — mismo patrón que entidades anteriores
3. **Resolver** lo que sea necesario (carga de schemas faltantes, validación de tipos disponibles)

---

## Respuesta esperada

Reporte de auditoría con:
- Estado encontrado para cada tipo en v17.0 y v13.0
- Confirmación de los tipos QBXML exactos disponibles en el SDK
- Acciones tomadas
- Confirmación de que los endpoints responden correctamente para todos los tipos
