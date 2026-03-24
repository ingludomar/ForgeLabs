# PROMPT-005 — Adoptar SemVer como esquema de versioning

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-19 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | convention |
| **Estado** | ✅ solved |

---

## Contexto

El ecosistema SyncBridge ha adoptado **Semantic Versioning (SemVer)** como esquema oficial de versioning para todos sus proyectos. Este prompt formaliza la adopción para LedgerBridge y establece cómo debe reflejarse en Monday.com.

---

## Esquema acordado

```
MAJOR . MINOR . PATCH
  1   .   0   .   1
```

| Componente | Cuándo incrementa |
|---|---|
| `PATCH` | Bug fix, sin cambios de interfaz ni comportamiento externo |
| `MINOR` | Feature nuevo compatible hacia atrás (nuevo tipo QBXML, nueva sede, nueva tool) |
| `MAJOR` | Cambio rompedor de interfaz, arquitectura o contrato de integración |

---

## Estado actual de LedgerBridge

- **v1.0.0** — Entrega inicial (desarrollo del motor QBXML, tools de sede, business rules, schemas para los tipos del roadmap). **Cerrado.**
- **v1.0.1** — Ciclo activo de patches (bugs detectados en integración con LedgerOps).

---

## Reflejo en Monday.com

En el board `Quickbooks Tools` (ID `18386559547`), LedgerBridge tiene un item por versión:

| Item Monday | Estado |
|---|---|
| `SyncBridge \| LedgerBridge \| v1.0.0` | Listo |
| `SyncBridge \| LedgerBridge \| v1.0.1` | En curso — ID `11548875773` |

**Regla:** Cada versión es un item independiente. Los subitems de ese item son las tareas de esa versión.

---

## Acción requerida

1. Adoptar SemVer para todos los releases internos y externos de LedgerBridge.
2. Al completar v1.0.1: notificar a LedgerOps con la lista de cambios para cerrar el item en Monday y crear v1.0.2 (o v1.1.0 si hay features nuevos).
3. Cuando se publique una versión → actualizar el item Monday correspondiente a `Listo` + timeline real.

---

## Regla de comunicación

Cada vez que LedgerBridge complete una versión, debe informar a LedgerOps:
- Número de versión
- Lista de cambios (bugs cerrados, features agregados)
- Fecha de cierre

LedgerOps se encarga de actualizar Monday.com.
