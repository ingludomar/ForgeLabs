# LedgerOps — Proceso estándar de desarrollo por feature QB Desktop

> Todo feature de QB Desktop debe seguir este proceso antes de ser considerado completado.
> Aplica sin excepción a cualquier entidad: Item, Customer, Vendor, SO, PO, Invoice, Bill, etc.

---

## Por qué este proceso

Trabajar CRUD "en el vacío" genera errores que no son bugs de desarrollo: campos requeridos
que la sede siempre llena, valores de referencia inválidos, ListIDs incorrectos.

**La regla:** siempre partir de datos reales de la sede.
El Query inicial provee todo lo necesario para ejecutar el CRUD completo sin sorpresas.

---

## Flujo completo P1 → P5

```
P1 — AnalyzeSedeFields          Consultar datos reales de la sede
P2 — Business Rules             Registrar requiredBySede en todas las sedes
P3 — Workflow                   Crear/activar workflow en N8N + commit al repo
P4 — Testing                    Ejecutar todos los TCs en sede TEST
P5 — Cierre formal              Monday + correo de release + "Listo para producción"
```

> **P5 es la condición de salida.** Solo después de P5 se puede iniciar el siguiente feature.

---

## P1 — AnalyzeSedeFields

Obtiene registros reales de la sede, analiza cobertura de campos y extrae datos de prueba.

```bash
curl -s -X POST https://n8n-development.redsis.ai/webhook/tools/analyze-sede-fields \
  -H "Content-Type: application/json" \
  -d '{
    "type": "{TipoAdd}",
    "sede": "TEST",
    "version": "17.0",
    "limit": 20
  }'
```

**Output clave:**
- `data.suggestedRequiredBySede` — paths QBXML obligatorios por negocio de la sede
- `data.sampleRecord` — registro real con valores válidos (plantilla para Add/Mod)
- `data.listIDs` — ListIDs reales para usar en Read, Update y Delete
- `data.fieldCoverage` — cobertura por campo (umbral: 1.0 = 100%)

**Muestra mínima:** 20 registros. Si hay menos, usar todos y documentar en `knownIssues`.

---

## P2 — Business Rules (requiredBySede)

Registrar los campos requeridos por la sede en LedgerBridge para **todas las sedes**.
Filtrar siempre: `ListID`, `EditSequence`, `TimeCreated`, `TimeModified`, `FullName`, `Sublevel`.

```bash
curl -s -X POST https://n8n-development.redsis.ai/webhook/business-rules/replace \
  -H "Content-Type: application/json" \
  -d '{
    "type":    "{TipoAdd}",
    "sede":    "TEST",
    "version": "17.0",
    "paths":   [ ...paths filtrados de suggestedRequiredBySede... ]
  }'
```

Repetir para: **TEST · RUS · REC · RBR** (y para Add + Mod por separado).

> RMX/TSI/RRC: bloqueados hasta que LedgerBridge soporte su versión QBXML.

---

## P3 — Workflow

1. Crear el workflow en N8N siguiendo el patrón estándar de `CLAUDE.md`
2. Guardar JSON en `workflows/{modulo}/LedgerOps-{EntidadOp}.workflow.json`
3. Activar desde la **UI de N8N** (el toggle — la API `/activate` no registra el webhook)
4. Hacer commit al repo

---

## P4 — Testing (sede TEST únicamente)

Ejecutar todos los casos de uso del catálogo (`docs/development/test-cases.md`).
Orden mínimo obligatorio:

```
TC-ADD-01  →  TC-QRY-01  →  TC-MOD-01  →  TC-DEL-01  →  TC-DEL-02   (flujo positivo)
TC-ADD-02/03/04/05/06/07                                               (validaciones Add)
TC-MOD-02/03/04/05/06                                                  (validaciones Mod)
TC-QRY-03/04                                                           (casos negativos Query)
TC-DEL-03                                                              (caso negativo Delete)
```

**Antes de ejecutar:** consultar `tests/{modulo}/{Entidad}{Op}-TEST.verified.json`.
**Al obtener éxito:** actualizar `successfulRecords` y `lastSuccessfulResponse` en el archivo.

---

## P5 — Cierre formal

P5 no es un paso técnico. Es el **cierre formal del feature** que habilita al área de automatización
para iniciar su propio testing y al equipo para comenzar el siguiente feature.

### P5.1 — Registrar en Monday.com

Crear o actualizar subitems bajo el item de LedgerOps en el board `Quickbooks Tools`:
- Un subitem por entidad completada
- Estado: `✅ Listo para producción`
- Incluir: Add / Mod / Query / Delete completados, sedes con business rules registradas

### P5.2 — Enviar correo de release

Usar el workflow `SendReleaseNotification` (`POST /webhook/tools/send-release`):

```bash
curl -s -X POST https://n8n-development.redsis.ai/webhook/tools/send-release \
  -H "Content-Type: application/json" \
  -d '{
    "feature": "{NombreDelFeature}",
    "entities": ["{TipoAdd}", "{TipoMod}", "{TipoQuery}"],
    "sedes": ["TEST", "RUS", "REC", "RBR"],
    "notes": "..."
  }'
```

El correo informa al área de automatización qué endpoints están disponibles, qué campos
son requeridos por sede, y qué pueden empezar a usar.

### P5.3 — Marcar en documentación

- `docs/development/features.md` → todas las operaciones de la entidad en `✅`
- `docs/development/roadmap.md` → feature marcado como completado

---

## Checklist rápido

```
P1  [ ] AnalyzeSedeFields ejecutado (TEST) — suggestedRequiredBySede obtenido
P2  [ ] business-rules/replace ejecutado para Add en TEST / RUS / REC / RBR
    [ ] business-rules/replace ejecutado para Mod en TEST / RUS / REC / RBR
P3  [ ] Workflow creado en N8N
    [ ] JSON guardado en repo (commit)
    [ ] Workflow activo en N8N UI
P4  [ ] TC-ADD-01→07 completos — verified.json creado
    [ ] TC-QRY-01→04 completos — verified.json creado
    [ ] TC-MOD-01→06 completos — verified.json creado
    [ ] TC-DEL-01→03 completos — verified.json actualizado
P5  [ ] Subitems registrados en Monday.com
    [ ] Correo de release enviado (SendReleaseNotification)
    [ ] features.md + roadmap.md actualizados con ✅
```

---

## Tabla de endpoints por entidad

| Entidad | type (Add) | Add | Mod | Query |
|---------|------------|-----|-----|-------|
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
