# PROMPT-003 — qbxmlIntegrator · Revisión y sincronización de ramas

**Fecha:** 2026-04-08
**Tipo:** review
**Estado:** ⏳ pending

## PROMPTs relacionados

- [PROMPT-002](PROMPT-002-entrega-formal.md) — documentación por rol generada en rama `dev`

---

## Contexto

SyncBridge detectó que la rama `dev` local tiene **6 commits adelante de `origin/main`** en GitHub. Toda la documentación generada en PROMPT-002 (README, entrega formal, multi-empresa, SemVer) existe únicamente en `dev` y nunca fue integrada a `main`.

### Estado actual detectado

| Rama | Último commit | Descripción |
|---|---|---|
| `dev` (local) | `d6dd915` | docs: corrección entrega formal — v1.0.0 verified, v1.0.1 pending |
| `origin/main` | `213be48` | feat: fase 3+4 — logs avanzados, QB auto-open y workflow profesional |

### Commits en `dev` que no están en `origin/main`

1. `d6dd915` — docs: corrección entrega formal — v1.0.0 verified, v1.0.1 pending
2. `d76142f` — chore: actualizar GitHub URL y regla QB auto-open en CLAUDE.md
3. `f12123a` — docs: entrega formal v1.0.1 — estándar SyncBridge de documentación por rol
4. `660f6f1` — docs: README completo + RELEASE-v1.0.0 — documentación oficial v1.0.1
5. `eb28a0c` — chore: adopción SemVer — VERSION 1.0.1 + bitácora actualizada
6. `44d79e7` — feat: soporte multi-empresa via header X-Company

---

## Acción requerida

1. **Revisar** el estado actual del repo — confirmar que `dev` contiene los 6 commits listados
2. **Verificar** que no hay conflictos entre `dev` y `origin/main`
3. **Reportar** a SyncBridge:
   - Estado real de ambas ramas (local + remote)
   - Si hay conflictos o cambios no esperados
   - Propuesta de acción: merge `dev` → `main` o push directo

SyncBridge decide el siguiente paso tras recibir el reporte.

---

## Respuesta esperada

- Confirmación del estado de ramas
- Lista de archivos que se agregarían a `main`
- Indicación de si es seguro proceder con merge/push

---

## Contexto adicional — 2026-04-08

> **VM qb-api-test en restauración.** El usuario está restaurando la VM `qb-api-test` en un servidor alterno (Proxmox, Windows 10 x64 22H2) para cubrir la demo de instalación de la API QB solicitada por Carolina. Esta VM será el entorno de prueba/demo para qbxmlIntegrator. N8N está caído en este momento — se retomará el trabajo cuando los recursos estén disponibles.

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-08 | Emisión | PROMPT emitido — solicitar revisión y reporte de estado de ramas dev vs main |
| 2026-04-08 | Nota | VM qb-api-test en restauración en servidor alterno — para demo Carolina + instalación API QB |
