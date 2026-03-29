# SyncBridge — Proceso estándar de desarrollo por feature

> SB es responsable del ciclo completo P0-P5 de cada entidad.
> LO (LedgerOps) solo recibe el PROMPT final de SB y aplica los archivos al repo.

---

## Flujo completo

```
SB ejecuta:
  P0 — RMX Global       Un solo PROMPT a LedgerBridge para todos los tipos QB pendientes
  P1 — AnalyzeSedeFields   Datos reales de todas las sedes (TEST · RUS · REC · RBR · RMX)
  P2 — Business Rules      Registrar requiredBySede en todas las sedes
  P3 — Workflow            Crear en development/, probar, mover a production/
  P4 — Testing             CRUD completo en sede TEST
  P5 — Cierre formal       Docs por rol → PROMPT a LO → esperar confirmación → correo → Monday

LO aplica:
  Recibe PROMPT de SB → guarda archivos → hace commit → confirma éxito
```

---

## Estructura de carpetas en SB

```
SB/
├── development/          ← trabajo en curso (borrador, en prueba)
│   ├── purchasing/
│   ├── sales/
│   ├── banking/
│   ├── contacts/
│   └── inventory/
└── production/           ← verificado, listo para clonar en LO
    ├── purchasing/
    ├── sales/
    ├── banking/
    ├── contacts/
    └── inventory/
```

Cuando P4 está completo → mover de `development/` a `production/`.

---

## P0 — PROMPT RMX (por entidad, antes de P1)

Emitir PROMPT a LedgerBridge solicitando los schemas v13.0 para la entidad que se va a trabajar.
RMX usa QB Desktop 2021 — necesita schemas v13.0 antes de poder ejecutar P1+P2 en esa sede.

Formato: `docs/inter-project/ledgerbridge/PROMPT-{NNN}-{entidad}-rmx-schema.md`
Actualizar índice: `docs/inter-project/README.md`

Entregar al usuario para que lo lleve a LedgerBridge.
**Esperar confirmación antes de ejecutar P1+P2 en RMX.**
P1+P2 en TEST · RUS · REC · RBR pueden ejecutarse en paralelo mientras se espera.

---

## P1 — AnalyzeSedeFields

Ejecutar para la entidad en **todas las sedes**: TEST · RUS · REC · RBR · RMX

```bash
curl -s -X POST https://n8n-development.redsis.ai/webhook/tools/analyze-sede-fields \
  -H "Content-Type: application/json" \
  -d '{ "type": "{TipoAdd}", "sede": "TEST", "version": "17.0", "limit": 20 }'
```

**Output clave:**
- `suggestedRequiredBySede` — paths QBXML obligatorios por sede
- `sampleRecord` — registro real con valores válidos
- `listIDs` — ListIDs reales para usar en testing
- `fieldCoverage` — umbral mínimo: 1.0 (100%)

---

## P2 — Business Rules

Registrar `requiredBySede` en LedgerBridge para todas las sedes (Add + Mod por separado).

```bash
curl -s -X POST https://n8n-development.redsis.ai/webhook/business-rules/replace \
  -H "Content-Type: application/json" \
  -d '{ "type": "{TipoAdd}", "sede": "TEST", "version": "17.0", "paths": [...] }'
```

Repetir para: **TEST · RUS · REC · RBR · RMX**

Verificar: `POST /webhook/tools/contract` → `info.requiredBySede` debe mostrar los campos.

---

## P2.5 — Verificar diferencias de contrato por versión

Después de registrar las business rules en todas las sedes, comparar el contrato generado entre versiones para identificar y documentar diferencias.

**Ejecutar GenerateContract para ambas versiones:**

```bash
# v17.0 — sedes TEST · RUS · REC · RBR
curl -s -X POST https://n8n-development.redsis.ai/webhook/tools/contract \
  -H "Content-Type: application/json" \
  -d '{ "type": "{TipoAdd}", "sede": "TEST", "version": "17.0" }'

# v13.0 — sede RMX
curl -s -X POST https://n8n-development.redsis.ai/webhook/tools/contract \
  -H "Content-Type: application/json" \
  -d '{ "type": "{TipoAdd}", "sede": "RMX", "version": "13.0" }'
```

**Comparar y registrar:**
- ¿Qué campos existen en v17.0 pero no en v13.0?
- ¿Qué campos son requeridos en RMX pero opcionales en otras sedes (o viceversa)?
- ¿El payload mínimo funcional es diferente entre versiones?

**Output:** Las diferencias documentadas se incluyen en el **developer doc (P5.1)** como sección separada por versión:

```
## Contrato

### QB Desktop 2024 — QBXML v17.0
> Sedes: TEST · RUS · REC · RBR
{contrato v17.0}

### QB Desktop 2021 — QBXML v13.0
> Sede: RMX
{contrato v13.0 — solo si difiere de v17.0}
```

> Si los contratos son idénticos entre versiones, documentar una sola sección con nota: "Válido para todas las sedes y versiones."

---

## P3 — Workflow

1. Crear el workflow JSON en `development/{modulo}/`
2. Subirlo a N8N vía MCP (`n8n_create_workflow`)
3. Activar desde la UI de N8N (el toggle — no usar API `/activate`)
4. Probar manualmente que el webhook responde
5. Cuando P4 esté completo → mover a `production/{modulo}/`

**Patrón estándar:**
```
Webhook → Code Validate → IF OK
  ✅ → HTTP LedgerExec → Respond Result
  ❌ → Respond Validation Error
```

**Payload hacia LedgerExec:**
- Add/Mod: `object: type+'Rq'`, `data: { [type+'Rq']: { [type]: body.data } }`
- Query: `object: type+'Rq'`, `data: { [type+'Rq']: body.data }`

---

## P4 — Testing (sede TEST)

Consultar `tests/{modulo}/{Entidad}Add-TEST.verified.json` antes de ejecutar.

Orden obligatorio:
```
TC-ADD-01 → TC-QRY-01 → TC-MOD-01 → TC-DEL-01 → TC-DEL-02   (flujo positivo)
TC-ADD-02/03/04                                                (negativos Add)
TC-MOD-02/03/04                                                (negativos Mod)
```

Al obtener éxito → actualizar `successfulRecords` y `lastSuccessfulResponse` en el verified.json.

---

## P5 — Cierre formal

### P5.1 — Documentación por rol (6 archivos en LO)
Preparar los 6 docs para `docs/integration/`:
quickstart · executive · developer · architect · qa · support

### P5.2 — PROMPT a LO
Generar PROMPT con todo lo producido:
- Workflow JSON (desde `production/{modulo}/`)
- Verified payload (`verified.json`)
- Business rules registradas (sedes + paths)
- Docs por rol (6 archivos)
- Known issues

Entregar al usuario para que LO lo aplique.
**Esperar confirmación de LO antes de continuar.**

### P5.3 — LO confirma éxito
LO aplica los archivos, hace commit, activa workflows en producción y confirma.
Solo cuando LO confirma → proceder con P5.4 y P5.5.

### P5.4 — Correo de entrega
Generar ASUNTO + CUERPO siguiendo la sección **"Correo de entrega"** de `CLAUDE.md`.
Entregar al usuario para envío manual.
Esperar confirmación del usuario de que el correo fue enviado antes de cerrar en Monday.

### P5.5 — Monday.com
**Item de trabajo** (ej. "SyncBridge | LedgerOps | {Entidad}"):
- 7 subitems: P1 · PROMPT-RMX · P2 · P3 · P4 · Documentación por rol · Correo enviado
- A nivel de **item**: Estado = `Listo` · Owner = Luis (56420968) · Cronograma = rango derivado de subitems · Grupo = Lanzamiento
- A nivel de **subitem**: Estado = `Done` · Owner = Luis (56420968) · Fecha = fecha en que se completó esa fase

**Item de entrega formal** (ej. "LedgerOps | Entrega formal · {Entidad} v{version}"):
- 2 subitems: Documentación por rol · Correo enviado
- A nivel de **item**: Estado = `Listo` · Owner = Luis (56420968) · Cronograma = rango derivado de subitems · Grupo = Lanzamiento · Comentario de entrega
- A nivel de **subitem**: Estado = `Done` · Owner = Luis (56420968) · Fecha = fecha en que se completó esa fase

**Regla de cronograma (project_timeline):**
- Tomar las fechas de todos los subitems del item
- Si todas son iguales → `from` = `to` = esa fecha
- Si son distintas → `from` = fecha mínima · `to` = fecha máxima

### P5.6 — Actualizar roadmap
- `docs/development/features.md` → operaciones en ✅
- `docs/development/roadmap.md` → entidad en ✅ con fecha de entrega

### P5.7 — Commit en SyncBridge
Hacer commit en el repo SyncBridge con todos los artefactos generados durante el flujo:
- Workflows JSON (`development/` y `production/`)
- `verified-{entidad}.json`
- PROMPTs emitidos (`docs/inter-project/`)
- `docs/development/bitacora.md` actualizada
- `docs/development/roadmap.md` + `features.md` actualizados
- `docs/inter-project/README.md` actualizado

---

## Checklist rápido

```
P0  [ ] PROMPT-{NNN} RMX emitido para esta entidad → confirmado por LedgerBridge
P1  [ ] AnalyzeSedeFields ejecutado en TEST · RUS · REC · RBR · RMX
P2  [ ] business-rules/replace ejecutado (Add + Mod) en todas las sedes
P2.5[ ] Contratos v17.0 vs v13.0 comparados → diferencias documentadas para developer doc
P3  [ ] Workflow en development/ → subido a N8N → activo
P4  [ ] CRUD completo verificado en TEST → verified.json actualizado
    [ ] Workflow movido de development/ a production/
P5  [ ] 6 docs por rol preparados
    [ ] PROMPT generado y entregado a LO
    [ ] LO confirma commit + workflows activos en producción
    [ ] Correo entregado al usuario → usuario confirma envío
    [ ] Monday: item de trabajo (7 subitems) + item de entrega (2 subitems)
    [ ] roadmap.md + features.md actualizados
    [ ] Commit en SyncBridge — workflows + verified.json + PROMPTs + bitácora + roadmap
```

---

## Endpoints por entidad

| Entidad | type (Add) | Add | Mod | Query |
|---|---|---|---|---|
| ItemInventory | `ItemInventoryAdd` | `/webhook/inventory/item/add` | `/webhook/inventory/item/mod` | `/webhook/inventory/item/query` |
| ItemNonInventory | `ItemNonInventoryAdd` | `/webhook/inventory/item/add` | `/webhook/inventory/item/mod` | `/webhook/inventory/item/query` |
| ItemService | `ItemServiceAdd` | `/webhook/inventory/item/add` | `/webhook/inventory/item/mod` | `/webhook/inventory/item/query` |
| Customer | `CustomerAdd` | `/webhook/contacts/customer/add` | `/webhook/contacts/customer/mod` | `/webhook/contacts/customer/query` |
| Vendor | `VendorAdd` | `/webhook/contacts/vendor/add` | `/webhook/contacts/vendor/mod` | `/webhook/contacts/vendor/query` |
| SalesOrder | `SalesOrderAdd` | `/webhook/sales/order/add` | `/webhook/sales/order/mod` | `/webhook/sales/order/query` |
| PurchaseOrder | `PurchaseOrderAdd` | `/webhook/purchasing/purchase-order/add` | `/webhook/purchasing/purchase-order/mod` | `/webhook/purchasing/purchase-order/query` |
| Invoice | `InvoiceAdd` | `/webhook/sales/invoice/add` | `/webhook/sales/invoice/mod` | `/webhook/sales/invoice/query` |
| Bill | `BillAdd` | `/webhook/purchasing/bill/add` | `/webhook/purchasing/bill/mod` | `/webhook/purchasing/bill/query` |
| CreditCardCharge | `CreditCardChargeAdd` | `/webhook/banking/credit-card-charge/add` | `/webhook/banking/credit-card-charge/mod` | `/webhook/banking/credit-card-charge/query` |
