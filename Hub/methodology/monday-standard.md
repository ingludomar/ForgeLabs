# Estándar Monday.com

Monday.com es responsabilidad exclusiva de LedgerOps. Se registran tareas de todos los proyectos del ecosistema.

---

## Board principal

| Dato | Valor |
|---|---|
| Board | `18386559547` (Quickbooks Tools) |
| Subitems board | `18391160719` |
| Owner (Luis) | `56420968` |

## Grupos del board

| Grupo | ID | Propósito |
|---|---|---|
| **Planificación** | `new_group29179` | Feature analizado y planificado — trabajo no iniciado |
| **Ejecución** | `new_group43041` | Feature en progreso activo |
| **Lanzamiento** | `topics` | Feature completado — todas las subtareas cerradas |

## Items de proyectos

| Proyecto | Item ID |
|---|---|
| LedgerOps | `10782151442` |
| LedgerBridge | `11506881476` |
| qbxmlIntegrator | `11507020031` |

---

## Ciclo de vida de un item — universal

Todo item de Monday (work item o delivery item) sigue este ciclo, sin excepción:

```
1. CREAR     → Crear el item con todos los subitems definidos → grupo Planificación
2. INICIAR   → Al comenzar el trabajo: mover a grupo Ejecución + registrar fecha de inicio del item
3. EJECUTAR  → Al cerrar cada subtarea: registrar fecha de cierre en esa subtarea
4. COMPLETAR → Cuando todas las subtareas están cerradas: mover a grupo Lanzamiento
```

### Columnas a registrar por momento

| Momento | Nivel | Columna | Valor |
|---|---|---|---|
| Al crear | Item | `project_owner` | `{"personsAndTeams":[{"id":56420968,"kind":"person"}]}` |
| Al iniciar | Item | `project_timeline` | `{"from":"YYYY-MM-DD","to":"YYYY-MM-DD"}` — `from` = fecha de inicio real |
| Al completar | Item | `project_status` | `"Listo"` |
| Al completar | Item | `project_timeline` | actualizar `to` = fecha real de cierre |
| Al crear | Subitem | `person` | `{"personsAndTeams":[{"id":56420968,"kind":"person"}]}` |
| Al cerrar subtarea | Subitem | `status` | `"Done"` |
| Al cerrar subtarea | Subitem | `date0` | `{"date":"YYYY-MM-DD"}` — fecha en que se completó |

> **Regla de cronograma (`project_timeline`):** `from` = fecha en que se inició el item · `to` = fecha en que se cerró la última subtarea.

> Nunca crear subitems sin owner — quedan huérfanos en el board.

---

## Tipos de items por feature

---

### Tipo 1 — Entidad QB (P0-P5)

#### Work item
**Nombre:** `SyncBridge | LedgerOps | {Entidad}`

**7 subitems obligatorios:**
1. `P1 — AnalyzeSedeFields {Entidad} ({sedes})`
2. `PROMPT-{NNN} — LedgerBridge schemas v13.0 {Entidad} RMX`
3. `P2 — Business rules {Entidad} ({sedes})`
4. `P3 — Workflows {EntityAdd} · {EntityMod} · {EntityQuery}`
5. `P4 — Testing TEST: TC-ADD-01 · TC-QRY-01 · TC-MOD-01 · TC-DEL-01 · TC-DEL-02`
6. `Documentación por rol — 6 docs (quickstart · executive · developer · architect · qa · support)`
7. `Correo enviado — Celia Giraldo · {Entidad} Add · Mod · Query`

#### Delivery item
**Nombre:** `LedgerOps | Entrega formal {Entidad}`

**2 subitems:**
1. `Documentación por rol — 6 docs (quickstart · executive · developer · architect · qa · support)`
2. `Correo enviado — Celia Giraldo · {Entidad} Add · Mod · Query`

---

### Tipo 2 — Feature de plataforma (F1-F8)

Features de Redix visibles al usuario. Flujo: propuesta → aprobación → implementación → E2E → docs → push → correo.

#### Work item
**Nombre:** `Redix | {Nombre del feature}`
> Ejemplo: `Redix | N8N Webhook Administration`

**Subitems — uno por entregable clave:**
- `{Qué se hizo} — {detalle clave}` (sin mencionar "PROMPT" — describir la funcionalidad entregada)
- `Verificación E2E completa desde el UI de Redix`
- `Documentación por rol — 5 docs (executive · developer · architect · qa · support)`
- `Correo enviado — Luis Potte · CC Mike Habib`

> Ejemplos de nombres de subtarea: `Consumo de templates en QB Playground`, `Sistema de templates — DB, panel admin y selector`, `Panel de administración de webhooks N8N`

#### Delivery item
**Nombre:** `Redix | Entrega formal {Nombre del feature}`
> Ejemplo: `Redix | Entrega formal N8N Webhook Administration`

**2 subitems:**
1. `Documentación por rol — 5 docs (executive · developer · architect · qa · support)`
2. `Correo enviado — Luis Potte · CC Mike Habib`

---

### Tipo 3 — Infraestructura (I1-I4)

Mejoras internas sin entrega al usuario final. Sin delivery item.

#### Work item
**Nombre:** `Infraestructura | {Descripción breve}`
> Ejemplo: `Infraestructura | WebhookResolverService singleton`

**Subitems — uno por entregable clave:**
- `{Qué se hizo} — {detalle clave}` (sin mencionar "PROMPT" — describir el cambio técnico realizado)

> No se crea delivery item para Tipo 3.
