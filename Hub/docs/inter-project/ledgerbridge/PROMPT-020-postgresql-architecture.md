# PROMPT-LB-020 — LedgerCore · Nuevo producto basado en PostgreSQL

**Fecha:** 2026-04-01
**Tipo:** research / architecture
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-LB-021](PROMPT-021-ledgercore-phase1-delivery.md) — entrega al repo de los artefactos diseñados en este PROMPT

---

## Contexto

LedgerBridge actual **sigue operando sin cambios**. Este PROMPT no es una migración — es la definición de un **nuevo proyecto independiente** llamado **LedgerCore**.

LedgerCore es la evolución de LedgerBridge como producto comercial multi-empresa. Usa PostgreSQL como capa de datos en lugar del sistema de archivos, lo que permite:

- Onboarding de nuevos clientes sin montar servidores
- Administración de sedes, schemas y reglas desde una API
- Soporte multi-tenant nativo
- Templates de formulario configurables por sede (ver sección Concepto de Template)

LedgerBridge es la **referencia de implementación** — LedgerCore la reimplementa sobre DB.

---

## Respuestas a las preguntas pendientes del análisis previo

| # | Pregunta | Decisión |
|---|---|---|
| 5.1 | ¿Dónde corre PostgreSQL? | Docker local para desarrollo y piloto → Cloud cuando escale a producto |
| 5.2 | ¿Un tenant por DB o todos en la misma? | Misma DB con `tenant_id` (Opción A). Opción B cuando el volumen lo justifique |
| 5.3 | ¿El cliente puede modificar el catálogo QBXML? | No — catálogo exclusivo del equipo LedgerCore. Clientes operan solo a nivel de Templates |
| 5.4 | ¿Cuándo se refresca el catálogo de templates? | Consistencia eventual aceptable — templates son configuración administrativa |

El concepto de **Templates** propuesto por LedgerBridge está aprobado e incluido en el alcance de LedgerCore.

---

## Requerimiento

Con base en el análisis previo entregado por LedgerBridge (PROMPT-LB-020 respuesta v1.0), proceder con:

### Fase 1 — Schema PostgreSQL definitivo

Diseñar y documentar el schema PostgreSQL completo de LedgerCore incluyendo:

**Catálogo global** (mantenido por el equipo LedgerCore):
- `qbxml_type` — 239 tipos de operación
- `qbxml_version` — versiones QB Desktop (v13.0, v17.0, extensible)
- `qbxml_field` — campos por tipo + versión: nombre, orden, tipo, cardinalidad, `required_by_intuit`

**Por tenant:**
- `tenant` — empresas cliente
- `sede` — sucursales QB Desktop por empresa (versión QB + URL integrador)
- `template` — definición de formulario por tipo QBXML y tenant
- `template_field` — campos del template: visible + required/optional
- `template_sede` — asignación template → sede(s), con `is_default`

**Vistas derivadas:**
- `template_field_resolved` — campos de un template con flags combinados (tiempo real)
- `sede_template_catalog` — catálogo de templates disponibles por sede (selector de front)

Para cada tabla: columnas, tipos de dato, constraints (PK, FK, NOT NULL, UNIQUE), índices recomendados.

### Fase 2 — Seed del catálogo

Script para poblar el catálogo global desde los archivos actuales de LedgerBridge:
- 239 tipos QBXML
- Sus campos con orden y flags de Intuit
- Versiones v17.0 y v13.0

### Fase 3 — Templates base del piloto

Generar los templates iniciales de las sedes actuales (TEST, RUS, REC, RBR, RMX) a partir de las business rules existentes en LedgerBridge — como punto de partida para que el cliente los refine.

---

## Lo que NO cambia

- **LedgerBridge actual** — sin modificaciones, sigue operando
- **Constructor QBXML** — sigue siendo código; DB alimenta los datos
- **Parser de respuestas** — sigue siendo código
- **qbxmlIntegrator** — sin cambios

---

## Respuesta esperada de LedgerBridge

Entregar a SyncBridge:

1. **Schema PostgreSQL definitivo** — DDL completo (CREATE TABLE) con constraints y relaciones
2. **Diagrama ER** — relaciones entre todas las tablas
3. **Script de seed** — para poblar catálogo desde filesystem actual
4. **Templates base** — listado de templates generados para las 5 sedes del piloto
5. **Notas de implementación** — decisiones de diseño no obvias y riesgos identificados

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-01 | Emisión | PROMPT emitido a LedgerBridge — diseño de arquitectura PostgreSQL para LedgerCore (Fase 1) |
| 2026-04-01 | Resolución | Schema DDL, diagrama ER, seed scripts y templates base entregados por LedgerBridge |
