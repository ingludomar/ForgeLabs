# PROMPT-001 — Adoptar SemVer como esquema de versioning

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-19 |
| **Proyecto destino** | LedgerExec |
| **Tipo** | convention |
| **Estado** | ✅ solved |

## PROMPTs relacionados

- [PROMPT-LB-005](../ledgerbridge/PROMPT-005-semver-versioning.md) — misma convención SemVer aplicada simultáneamente a LedgerBridge

---

## Contexto

El ecosistema SyncBridge ha adoptado **Semantic Versioning (SemVer)** como esquema oficial de versioning para todos sus proyectos. Este prompt formaliza la adopción para LedgerExec y establece cómo debe reflejarse en Monday.com.

---

## Esquema acordado

```
MAJOR . MINOR . PATCH
  1   .   0   .   1
```

| Componente | Cuándo incrementa |
|---|---|
| `PATCH` | Bug fix, sin cambios de interfaz ni comportamiento externo |
| `MINOR` | Feature nuevo compatible hacia atrás (nuevo módulo, nueva lógica de orquestación) |
| `MAJOR` | Cambio rompedor de interfaz, contrato de integración o arquitectura de orquestación |

---

## Estado actual de LedgerExec

- **v1.0.0** — Entrega inicial (motor de orquestación genérico, routing a LedgerBridge vía SSH, manejo de sesiones QB). **Cerrado.**
- **v1.0.1** — Ciclo activo (mejoras y patches post-integración con LedgerOps).

---

## Reflejo en Monday.com

En el board `Quickbooks Tools` (ID `18386559547`), LedgerExec tiene un item por versión:

| Item Monday | Estado |
|---|---|
| `SyncBridge \| LedgerExec \| v1.0.0` | Listo |
| `SyncBridge \| LedgerExec \| v1.0.1` | En curso — ID `11548866872` |

**Regla:** Cada versión es un item independiente. Los subitems de ese item son las tareas de esa versión.

---

## Acción requerida

1. Adoptar SemVer para todos los releases internos y externos de LedgerExec.
2. Al completar v1.0.1: notificar a LedgerOps con la lista de cambios para cerrar el item en Monday y crear v1.0.2 (o v1.1.0 si hay features nuevos).
3. Cuando se publique una versión → actualizar el item Monday correspondiente a `Listo` + timeline real.

---

## Regla de comunicación

Cada vez que LedgerExec complete una versión, debe informar a LedgerOps:
- Número de versión
- Lista de cambios (bugs cerrados, features agregados)
- Fecha de cierre

LedgerOps se encarga de actualizar Monday.com.

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-19 | Emisión | PROMPT emitido a LedgerExec — adopción formal de SemVer para releases y Monday.com |
| 2026-03-19 | Resolución | Convención adoptada; v1.0.0 cerrado, v1.0.1 en curso (ID Monday `11548866872`) |
