# PROMPT-LB-021 — LedgerCore · Entrega Fase 1 al repositorio

**Fecha:** 2026-04-01
**Tipo:** delivery
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-LB-020](PROMPT-020-postgresql-architecture.md) — diseño de arquitectura que se entrega en este PROMPT

---

## Contexto

LedgerBridge completó el diseño de la Fase 1 de LedgerCore (PROMPT-LB-020). Los 4 archivos fueron generados y documentados. Ahora deben ser entregados al repositorio oficial del proyecto.

---

## Acción requerida

Crear los siguientes 4 archivos en el repositorio **LedgerCore**:

**Ruta destino:** `docs/architecture/ledgercore/`

| Archivo | Descripción |
|---|---|
| `SCHEMA.sql` | DDL completo — 5 tablas + 2 ENUMs + 2 vistas + función `resolve_version` + seed de versiones |
| `seed_catalog.py` | Script para poblar `qbxml_type`, `qbxml_source`, `qbxml_field` desde el filesystem de LedgerBridge |
| `seed_templates.py` | Script para generar ~1,195 templates base (239 tipos × 5 sedes) con business rules existentes |
| `DELIVERY.md` | Diagrama ER + templates base del piloto + notas de implementación + guía de ejecución |

**Repo local:** `/Users/luisdominguez/Documents/GitHub/LedgerCore`

---

## Verificación

Confirmar a SyncBridge:

1. Los 4 archivos creados en `docs/architecture/ledgercore/`
2. Commit realizado en el repo LedgerCore

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-01 | Emisión | PROMPT emitido a LedgerBridge — crear 4 artefactos de Fase 1 en repo LedgerCore |
| 2026-04-01 | Resolución | 4 archivos creados en `docs/architecture/ledgercore/` con commit en LedgerCore |
