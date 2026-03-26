# Estándar Monday.com

Monday.com es responsabilidad exclusiva de LedgerOps. Se registran tareas de todos los proyectos del ecosistema.

---

## Board principal

| Dato | Valor |
|---|---|
| Board | `18386559547` (Quickbooks Tools) |
| Subitems board | `18391160719` |
| Owner (Luis) | `56420968` |

## Items de proyectos

| Proyecto | Item ID |
|---|---|
| LedgerOps | `10782151442` |
| LedgerBridge | `11506881476` |
| qbxmlIntegrator | `11507020031` |

---

## Tipos de items

### Work item — flujo completo P1-P5
**Nombre:** `SyncBridge | LedgerOps | {Entidad}`

**7 subitems obligatorios:**
1. `P1 — AnalyzeSedeFields {Entidad} ({sedes})`
2. `PROMPT-{NNN} — LedgerBridge schemas v13.0 {Entidad} RMX`
3. `P2 — Business rules {Entidad} ({sedes})`
4. `P3 — Workflows {EntityAdd} · {EntityMod} · {EntityQuery}`
5. `P4 — Testing TEST: TC-ADD-01 · TC-QRY-01 · TC-MOD-01 · TC-DEL-01 · TC-DEL-02`
6. `Documentación por rol — 6 docs (quickstart · executive · developer · architect · qa · support)`
7. `Correo enviado — Celia Giraldo · {Entidad} Add · Mod · Query`

### Delivery item — entrega formal
**Nombre:** `LedgerOps | Entrega formal · {Entidad}`

**2 subitems:**
1. `Documentación por rol — 6 docs (quickstart · executive · developer · architect · qa · support)`
2. `Correo enviado — Celia Giraldo · {Entidad} Add · Mod · Query`

---

## Reglas operativas

- **Items** — columnas a completar siempre:
  - `project_owner` → `{"personsAndTeams":[{"id":56420968,"kind":"person"}]}`
  - `project_status` → `"Listo"` al completar
  - `project_timeline` → `{"from":"YYYY-MM-DD","to":"YYYY-MM-DD"}`
- **Subitems** — columnas a completar siempre:
  - `person` → `{"personsAndTeams":[{"id":56420968,"kind":"person"}]}`
  - `status` → `"Done"` al completar
  - `date0` → `{"date":"YYYY-MM-DD"}`
- Items completados van al grupo **Lanzamiento** (`topics`)
- Nunca crear subitems sin owner — queda huérfano en el board
