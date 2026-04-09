# Proceso de desarrollo — P1 a P5

Todo feature nuevo (entidad + operaciones CRUD) sigue este ciclo obligatorio. No se salta ningún paso.

---

## P1 — AnalyzeSedeFields

**Objetivo:** Entender qué campos usa realmente cada sede en la entidad.

```bash
curl -s -X POST https://n8n-development.redsis.ai/webhook/tools/analyze-sede-fields \
  -H "Content-Type: application/json" \
  -d '{ "type": "{EntityAdd}", "sede": "{SEDE}", "version": "17.0", "limit": 20 }'
```

**Extraer:**
- `data.suggestedRequiredBySede` → candidatos para business rules
- `data.listIDs[0]` + `data.sampleRecord` → para tests P4

**Criterios:**
- Muestra mínima: 20 registros. Si hay menos, usar todos y documentar en `knownIssues`.
- Umbral: `fieldCoverage = 1.0` (100%)
- **Filtrar siempre:** `ListID`, `EditSequence`, `TimeCreated`, `TimeModified`, `FullName`, `Sublevel`, `QuantityOnHand`, `AverageCost`, `QuantityOnOrder`, `QuantityOnSalesOrder`

**Ejecutar para todas las sedes:** TEST · RUS · REC · RBR · RMX

---

## PROMPT RMX — Emitir AL INICIO

RMX = QB Desktop 2021 = QBXML v13.0. LedgerBridge necesita schemas v13.0 clonados para esta entidad antes de que P1 y P2 puedan correr en RMX.

**Emitir PROMPT a LedgerBridge en paralelo con P1** de otras sedes — no al final.

Formato: `docs/inter-project/ledgerbridge/PROMPT-{NNN}-{entidad}-rmx-schema.md`

---

## P2 — Business Rules

**Objetivo:** Registrar en LedgerBridge qué campos son obligatorios por sede.

```bash
# Para cada sede
curl -s -X POST https://n8n-development.redsis.ai/webhook/business-rules/replace \
  -H "Content-Type: application/json" \
  -d '{
    "type": "{EntityAdd}",
    "sede": "{SEDE}",
    "paths": [
      "/QBXML/QBXMLMsgsRq/{EntityAdd}Rq/{EntityAdd}/{Campo1}",
      "/QBXML/QBXMLMsgsRq/{EntityAdd}Rq/{EntityAdd}/{Campo2}/FullName"
    ]
  }'
```

**Verificar:** `POST /webhook/tools/contract` → `info.requiredBySede` debe mostrar los campos registrados.

---

## P3 — Workflows

**Objetivo:** Crear los workflows N8N para la entidad.

**Patrón estándar:**
```
Webhook — Entry
  → Code — Validate Type
  → IF — Validation OK
      ✅ → HTTP — LedgerExec → Respond — Result
      ❌ → Respond — Validation Error
```

**Por cada operación:** Add, Mod, Query (workflows independientes para entidades de contactos; compartidos para inventory).

**Al crear:**
1. Crear en N8N vía API
2. Guardar JSON en `workflows/{module}/LedgerOps-{EntityAction}.workflow.json`
3. Activar desde la UI (toggle) — la API `/activate` no registra el webhook
4. Actualizar tabla en `CLAUDE.md`

---

## P4 — Testing

**Orden mínimo obligatorio:**
1. TC-ADD-01 → guardar ListID + EditSequence
2. TC-QRY-01 → verificar datos
3. TC-MOD-01 → modificar campo no crítico
4. TC-DEL-01 → IsActive: "false"
5. TC-DEL-02 → Query verifica IsActive: false
6. Casos negativos: TC-ADD-02/03/04, TC-MOD-02/03/04

**Regla verified.json:**
- Consultar `tests/{module}/{Entity}{Op}-{Sede}.verified.json` antes de cualquier prueba
- Si existe → usar `verifiedPayload` como base
- Si no existe → correr AnalyzeSedeFields primero, luego crear al obtener éxito
- Al éxito → actualizar `successfulRecords` y `lastSuccessfulResponse`

---

## P5 — Cierre formal

**5 acciones en orden:**

### 1. Commit
Incluir todos los archivos del ciclo: workflows, tests, docs, PROMPT.

### 2. Documentación por rol (6 docs)

| Rol | Archivo | Contenido |
|---|---|---|
| Inicio rápido | `docs/integration/quickstart/{Entity}.md` | Payloads reales de TEST, qué cambiar |
| Ejecutivo | `docs/integration/executive/{Entity}.md` | Valor de negocio, sedes, operaciones |
| Desarrollador | `docs/integration/developer/{Entity}.md` | Endpoints, contratos, errores |
| Arquitecto | `docs/integration/architect/{Entity}.md` | Ecosistema, business rules, versiones QBXML |
| QA | `docs/integration/qa/{Entity}.md` | Casos de prueba verificados, issues conocidos |
| Soporte | `docs/integration/support/{Entity}.md` | Catálogo de errores, troubleshooting |

Actualizar `docs/integration/README.md` con la nueva fila.

### 3. Correo a Celia

**Asunto:**
```
[LedgerOps] ✅ {Entidad} — {Op1} · {Op2} · {Op3} lista para testing ({SEDE1} · {SEDE2} · ...)
```

**Formato del cuerpo:**
```
Buen día @Celia Giraldo Paez,

{Descripción del entregable — qué se puede hacer ahora}.

Para comenzar a probar, revisar la guía de inicio rápido:
{URL quickstart doc}

El señor Mike puede consultar el resumen de negocio en:
{URL executive doc}

---

| Rol | Documento |
|---|---|
| Inicio rápido (todos) | [quickstart/{Entity}.md]({URL}) |
| Ejecutivo | [executive/{Entity}.md]({URL}) |
| Desarrollador | [developer/{Entity}.md]({URL}) |
| Arquitecto | [architect/{Entity}.md]({URL}) |
| QA | [qa/{Entity}.md]({URL}) |
| Soporte | [support/{Entity}.md]({URL}) |

{Nota sobre sedes pendientes si aplica}.
```

**URL base GitHub:** `https://github.com/redsis-rgh/LedgerOps/blob/main/`

El correo lo envía el usuario — proveer asunto + cuerpo listos para copiar.

### 4. Monday — Work item

Item: `SyncBridge | LedgerOps | {Entidad}`
Board: `18386559547` | Owner: `56420968` | Fecha: fecha real de entrega

**7 subitems obligatorios:**
1. `P1 — AnalyzeSedeFields {Entidad} ({sedes})`
2. `PROMPT-{NNN} — LedgerBridge schemas v13.0 {Entidad} RMX`
3. `P2 — Business rules {Entidad} ({sedes})`
4. `P3 — Workflows {EntityAdd} · {EntityMod} · {EntityQuery}`
5. `P4 — Testing TEST: TC-ADD-01 · TC-QRY-01 · TC-MOD-01 · TC-DEL-01 · TC-DEL-02`
6. `Documentación por rol — 6 docs (quickstart · executive · developer · architect · qa · support)`
7. `Correo enviado — Celia Giraldo · {Entidad} Add · Mod · Query`

### 5. Monday — Delivery item

Item: `LedgerOps | Entrega formal · {Entidad}`
Board: `18386559547` | Owner: `56420968` | Fecha: fecha real de entrega

**2 subitems:**
1. `Documentación por rol — 6 docs (quickstart · executive · developer · architect · qa · support)`
2. `Correo enviado — Celia Giraldo · {Entidad} Add · Mod · Query`
