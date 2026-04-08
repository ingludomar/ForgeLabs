# ADR-002 — RMX usa QBXML v13.0 — LedgerBridge remapea

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-20 |
| **Estado** | ✅ Adoptado |
| **Aplica a** | Sede RMX |

## Decisión

LedgerOps siempre envía `"version": "17.0"` para todas las sedes incluyendo RMX. LedgerBridge es responsable de remapear a v13.0 para RMX usando `config/sede-version-map.json`.

## Razón

RMX corre QB Desktop 2021 que solo acepta QBXML v13.0. Centralizar el remapeo en LedgerBridge evita que LedgerOps tenga que conocer la versión de QB de cada sede — eso es responsabilidad de la fuente de verdad.

## Consecuencias

- Para cada entidad nueva, LedgerBridge debe clonar los schemas v13.0 (PROMPT al inicio del ciclo)
- LedgerOps nunca envía v13.0 — siempre v17.0
- El equipo que opera RMX no necesita conocer el detalle de versioning
