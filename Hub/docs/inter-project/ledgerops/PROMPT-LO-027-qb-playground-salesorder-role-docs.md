# PROMPT-LO-027 — QB Playground · Sales Order · Docs por rol

**Fecha:** 2026-04-07
**Tipo:** docs
**Estado:** ✅ solved
**Fecha de resolución:** 2026-04-07

## PROMPTs relacionados

- [PROMPT-RIQ-023](../riq/PROMPT-RIQ-023-playground-entity-docs-standard.md) — establece el estándar de 5 docs por rol para entidades QB Playground
- [PROMPT-LO-026](PROMPT-LO-026-qb-playground-salesorder-docs.md) — user guide `docs/qb-playground/SalesOrder.md` (ya publicado)

---

## Objetivo

Crear los 5 archivos de documentación por rol para la entidad **Sales Order** en el QB Playground.
La guía de usuario principal (`docs/qb-playground/SalesOrder.md`) ya existe — estos archivos son complementarios.

---

## Archivos a crear

| Archivo | Ruta en LO |
|---|---|
| `SalesOrder-executive.md` | `docs/qb-playground/SalesOrder-executive.md` |
| `SalesOrder-developer.md` | `docs/qb-playground/SalesOrder-developer.md` |
| `SalesOrder-architect.md` | `docs/qb-playground/SalesOrder-architect.md` |
| `SalesOrder-qa.md` | `docs/qb-playground/SalesOrder-qa.md` |
| `SalesOrder-support.md` | `docs/qb-playground/SalesOrder-support.md` |

---

## Contenido

### `docs/qb-playground/SalesOrder-executive.md`

```markdown
# QB Playground — Sales Order · Resumen Ejecutivo

## ¿Qué es Sales Order?

Sales Order (Orden de Venta) es el documento que formaliza un compromiso de venta con un cliente
antes de que los bienes sean despachados o facturados en QuickBooks Desktop. Es el paso previo
a la Invoice y permite gestionar el ciclo comercial completo desde el pedido hasta la entrega.

## ¿Qué permite hacer el QB Playground con Sales Order?

A través del QB Playground de Redix, cualquier usuario autorizado puede:

- **Consultar** órdenes de venta existentes en tiempo real — sin acceder a QB Desktop
- **Crear** nuevas órdenes de venta con líneas de detalle desde el navegador
- **Modificar** órdenes existentes con control de concurrencia integrado

Todo esto directamente desde Redix, con visibilidad inmediata del resultado en la pestaña **Resumen**.

## Valor para el negocio

| Beneficio | Descripción |
|---|---|
| **Agilidad operacional** | Verificar el estado de órdenes sin depender del equipo que tiene acceso a QB |
| **Testing seguro** | Probar flujos de creación y modificación de órdenes en sede TEST sin riesgo |
| **Diagnóstico rápido** | Identificar problemas en órdenes (datos faltantes, errores de configuración) en segundos |
| **Preparación para integración** | Validar contratos de datos reales antes de automatizar la creación desde sistemas externos |

## Sedes disponibles

Las siguientes sedes están verificadas y operativas:

| Sede | Operaciones disponibles |
|---|---|
| TEST | Add · Mod · Query |
| RUS (Redsis US) | Query |
| REC (Redsis Ecuador) | Query |
| RBR (Redsis Brasil) | Query |
| RMX (Redsis México) | Query |

> Las operaciones de escritura (Add · Mod) se limitan a TEST por política de testing.
> En producción se usa Query para consultar sin riesgo.
```

---

### `docs/qb-playground/SalesOrder-developer.md`

```markdown
# QB Playground — Sales Order · Referencia para Desarrolladores

## Endpoint del backend

```
POST /api/integration/qb-playground
Content-Type: application/json
```

El backend RIQ enruta la petición a LedgerOps según `type`:

| type | Endpoint LedgerOps |
|---|---|
| `SalesOrderAdd` | `/webhook/sales/order/add` |
| `SalesOrderMod` | `/webhook/sales/order/mod` |
| `SalesOrderQuery` | `/webhook/sales/order/query` |

## Payload completo — SalesOrderAdd

```json
{
  "type": "SalesOrderAdd",
  "sede": "TEST",
  "data": {
    "SalesOrderAdd": {
      "CustomerRef":              { "ListID": "800002C4-1597179052", "FullName": "RDX-CUSTOMER-UP-001" },
      "TemplateRef":              { "ListID": "80000011-1597182524", "FullName": "Custom Sales Order" },
      "TxnDate":                  "2026-04-06",
      "RefNumber":                "R021-0001",
      "BillAddress": {
        "Addr1": "1234 Main Street", "Addr2": "Suite 500",
        "Addr3": "Section A",        "City": "Miami",
        "State": "FL",               "PostalCode": "33101", "Country": "USA"
      },
      "ShipAddress": {
        "Addr1": "1234 Main Street", "Addr2": "Suite 500",
        "City": "Miami",             "State": "FL",         "Country": "USA"
      },
      "ShipDate":                 "2026-04-10",
      "DueDate":                  "2026-05-06",
      "FOB":                      "DDP",
      "IsToBePrinted":            "false",
      "IsToBeEmailed":            "false",
      "IsManuallyClosed":         "false",
      "ItemSalesTaxRef":          { "ListID": "80000001-1597179051", "FullName": "IVA-MX" },
      "CustomerSalesTaxCodeRef":  { "ListID": "80000001-1597174715", "FullName": "Tax" }
    },
    "SalesOrderLineAdd": {
      "ItemRef":         { "ListID": "80000026-1597198891" },
      "Quantity":        "2",
      "Rate":            "130.00",
      "SalesTaxCodeRef": { "ListID": "80000001-1597174715" }
    }
  }
}
```

> **Multiple lines:** `SalesOrderLineAdd` puede ser un array de objetos para enviar más de una línea.

## Campos requeridos — Add

| Campo | Restricción |
|---|---|
| `CustomerRef.ListID` | Específico por sede |
| `TemplateRef.ListID` | Específico por sede |
| `TxnDate` | Formato YYYY-MM-DD |
| `RefNumber` | **Máximo 11 caracteres** — QB-3070 si se excede |
| `BillAddress.Addr1`, `City` | Mínimo línea 1 y ciudad |
| `ShipAddress.Addr1`, `City` | Mínimo línea 1 y ciudad |
| `ShipDate`, `DueDate` | Formato YYYY-MM-DD |
| `ItemSalesTaxRef.ListID` | Específico por sede |
| `SalesOrderLineAdd.ItemRef.ListID` | Al menos una línea |
| `SalesOrderLineAdd.Quantity` | String numérico |

## Campos requeridos — Mod

| Campo | Notas |
|---|---|
| `TxnID` | Obtenido de Add o Query |
| `EditSequence` | **Debe ser el valor actual** — se invalida con cada modificación |
| `CustomerRef.ListID` + `FullName` | Requerido aunque no cambie |
| `TxnDate` | Requerido aunque no cambie |
| `RefNumber` | Requerido aunque no cambie |

## Errores técnicos clave

| Código | Causa | Solución |
|---|---|---|
| `QB-3070` | `RefNumber` > 11 caracteres | Truncar a 11 chars |
| `QB-3100` | `RefNumber` duplicado | Usar valor único |
| `QB-3120` | `TxnID` no encontrado en la sede | Verificar que la orden exista en esa sede |
| `QB-3200` | `EditSequence` desactualizado | Query previo para obtener el valor actual |
| `QB-3240` | `ListID` no existe en la compañía QB | Verificar ListID con Query en esa sede |
| `LB-VALIDATION-MISSING_REQUIRED` | Campo obligatorio vacío | Ver `details.details[]` para campo exacto |

## Nota sobre `ActiveStatus` en Query

`ActiveStatus` **no es un campo válido** en `SalesOrderQuery`. Incluirlo retorna `QB-PARSE-ERROR`.
Usar `MaxReturned` y filtros de fecha en su lugar.

## Timeouts

- **Frontend → Backend:** `AbortSignal.timeout(20_000)` — 20 segundos
- **Backend → LedgerOps:** timeout interno de 15 segundos
```

---

### `docs/qb-playground/SalesOrder-architect.md`

```markdown
# QB Playground — Sales Order · Arquitectura

## Flujo de datos completo

```
Usuario (Redix)
  │
  │  POST /api/integration/qb-playground
  │  { type: "SalesOrderAdd", sede: "TEST", data: { SalesOrderAdd: {...}, SalesOrderLineAdd: {...} } }
  ▼
RIQ Backend (NestJS)
  │  qb-endpoints.ts: "SalesOrderAdd" → "/webhook/sales/order/add"
  │  Construye payload: { sede, type, data: { SalesOrderAdd, SalesOrderLineAdd } }
  │  fetch con AbortSignal.timeout(20_000)
  ▼
LedgerOps (N8N)
  │  Webhook: /webhook/sales/order/add
  │  Valida campos requeridos según contrato dinámico de LedgerBridge
  │  Aplica business rules (requiredBySede)
  │  Construye QBXML SalesOrderAddRq
  ▼
LedgerBridge
  │  Genera QBXML v17.0 (TEST/RUS/REC/RBR) o v13.0 (RMX)
  │  Valida contra schema
  ▼
qbxmlIntegrator
  │  Ejecuta via win32com en QB Desktop
  ▼
QuickBooks Desktop
  │  Crea la orden → retorna SalesOrderRet con TxnID + EditSequence
  ▼
(respuesta reversa)
  │
  └─→ Redix muestra TxnID + campos clave en pestaña Resumen
```

## Contratos dinámicos

El frontend obtiene el contrato de campos antes de mostrar el formulario:

```
GET /webhook/contracts?type=SalesOrderAdd&sede=TEST
```

LedgerOps retorna los campos requeridos por Intuit + los requeridos por sede (business rules),
marcados con `required: true`. El Playground muestra estos campos resaltados con indicador visual.

## Versiones QBXML por sede

| Sedes | Versión QBXML | QB Desktop |
|---|---|---|
| TEST · RUS · REC · RBR | 17.0 | 2024 |
| RMX | 13.0 | 2021 |

LedgerBridge detecta la versión automáticamente por sede. El frontend envía `version` en el
payload pero LedgerBridge la deriva internamente — el campo es ignorado en la práctica.

## Control de concurrencia — EditSequence

QB Desktop usa `EditSequence` como token de concurrencia optimista. Flujo obligatorio para Mod:

```
SalesOrderQuery (TxnID específico)
  └─→ SalesOrderRet.EditSequence = "1775XXXXXXX"
        └─→ SalesOrderMod con ese EditSequence
              └─→ QB valida que nadie más modificó la orden
                    └─→ OK: nuevo EditSequence en respuesta
```

Si entre el Query y el Mod otro proceso modifica la orden, el EditSequence cambia y QB retorna QB-3200.

## Estructura del payload — header vs líneas

El backend RIQ separa el payload en dos claves: la entidad principal (`SalesOrderAdd`) y las líneas
(`SalesOrderLineAdd`). LedgerOps recibe ambas y construye el QBXML con el elemento `SalesOrderLineAdd`
anidado dentro de `SalesOrderAddRq`.

Para múltiples líneas, `SalesOrderLineAdd` es un array — QB las procesa en el orden recibido.
```

---

### `docs/qb-playground/SalesOrder-qa.md`

```markdown
# QB Playground — Sales Order · Casos de Prueba

## Metodología

- **Sede TEST**: CRUD completo (Add + Mod + Query)
- **Sedes producción** (RUS · REC · RBR · RMX): solo Query — no crear ni modificar datos reales

---

## Casos positivos

### TC-SO-01 — Query básico (TEST)

| Campo | Valor |
|---|---|
| Operación | SalesOrderQuery |
| Sede | TEST |
| Payload | `{ "MaxReturned": "5", "FromModifiedDate": "2026-01-01" }` |
| Resultado esperado | `success: true` · array `SalesOrderRet` con ≥1 orden · cada orden tiene `TxnID` y `EditSequence` |

### TC-SO-02 — Query conectividad producción

| Campo | Valor |
|---|---|
| Operación | SalesOrderQuery |
| Sede | RUS · REC · RBR · RMX (ejecutar en cada una) |
| Payload | `{ "MaxReturned": "1" }` |
| Resultado esperado | `success: true` por cada sede · confirma que el agente QB responde |

### TC-SO-03 — Add completo (TEST)

| Campo | Valor |
|---|---|
| Operación | SalesOrderAdd |
| Sede | TEST |
| Payload | Fill Examples completo (CustomerRef, TemplateRef, BillAddress, ShipAddress, línea con ItemRef real) |
| Resultado esperado | `success: true` · respuesta contiene `TxnID` nuevo + `EditSequence` |
| Post-condición | Anotar `TxnID` y `EditSequence` para TC-SO-05 |

### TC-SO-04 — Query por TxnID (TEST)

| Campo | Valor |
|---|---|
| Operación | SalesOrderQuery |
| Sede | TEST |
| Payload | `{ "TxnID": "<TxnID del TC-SO-03>" }` |
| Resultado esperado | `success: true` · retorna exactamente la orden creada con los mismos campos |

### TC-SO-05 — Mod de orden existente (TEST)

| Campo | Valor |
|---|---|
| Operación | SalesOrderMod |
| Sede | TEST |
| Pre-condición | Usar `TxnID` y `EditSequence` obtenidos de TC-SO-03 o TC-SO-04 |
| Payload | `{ "TxnID": "...", "EditSequence": "...", "CustomerRef": {...}, "TxnDate": "...", "RefNumber": "...", "Memo": "QA test mod" }` |
| Resultado esperado | `success: true` · `EditSequence` en respuesta es diferente al enviado |

---

## Casos negativos

### TC-SO-N01 — RefNumber demasiado largo

| Campo | Valor |
|---|---|
| Operación | SalesOrderAdd |
| Sede | TEST |
| Payload | Fill Examples + `RefNumber: "REF-12-CHARS"` (12 caracteres) |
| Resultado esperado | Error `QB-3070` |

### TC-SO-N02 — CustomerRef inválido

| Campo | Valor |
|---|---|
| Operación | SalesOrderAdd |
| Sede | TEST |
| Payload | Fill Examples + `CustomerRef.ListID: "INVALID-ID"` |
| Resultado esperado | Error `QB-3240` o `QB-3100` |

### TC-SO-N03 — EditSequence desactualizado

| Campo | Valor |
|---|---|
| Operación | SalesOrderMod |
| Sede | TEST |
| Payload | `TxnID` válido + `EditSequence` incorrecto (ej. "0000000001") |
| Resultado esperado | Error `QB-3200` — object modified |

### TC-SO-N04 — Campo requerido faltante

| Campo | Valor |
|---|---|
| Operación | SalesOrderAdd |
| Sede | TEST |
| Payload | Fill Examples sin `CustomerRef` |
| Resultado esperado | `LB-VALIDATION-MISSING_REQUIRED` · `details.details` indica el campo faltante |

### TC-SO-N05 — Timeout de respuesta

| Campo | Valor |
|---|---|
| Operación | SalesOrderQuery |
| Sede | Cualquiera con agente lento |
| Condición | El agente QB demora >20 segundos en responder |
| Resultado esperado | Botón **Run** se libera automáticamente · mensaje de error visible · no queda bloqueado |

---

## Checklist de cierre de entidad

- [ ] TC-SO-01 a TC-SO-05: todos `success: true`
- [ ] TC-SO-N01 a TC-SO-N04: todos retornan el error esperado
- [ ] TC-SO-N05: botón liberado en ≤20s
- [ ] Query ejecutado en las 5 sedes con éxito
- [ ] `ActiveStatus` **no** incluido en ningún Query (causa QB-PARSE-ERROR)
```

---

### `docs/qb-playground/SalesOrder-support.md`

```markdown
# QB Playground — Sales Order · Guía de Soporte

## Errores comunes y soluciones

### QB-3070 — Campo demasiado largo

**Mensaje:** `String too long in field "RefNumber"`

**Causa:** `RefNumber` supera los 11 caracteres permitidos por QB Desktop.

**Solución:**
1. Revisar el valor de `RefNumber` en el formulario
2. Acortarlo a 11 caracteres o menos
3. Ejemplo válido: `"R021-0001"` (9 chars) · inválido: `"REF-2026-001"` (12 chars)

---

### QB-3100 — Registro duplicado

**Mensaje:** `There is already a Sales Order with that ref number`

**Causa:** Ya existe una orden con el mismo `RefNumber` en esa sede.

**Solución:**
1. Usar un `RefNumber` diferente y único
2. O ejecutar un `SalesOrderQuery` con `RefNumberFilter` para verificar si ya existe

---

### QB-3120 — Transacción no encontrada

**Mensaje:** `The transaction TxnID XXX could not be found`

**Causa:** El `TxnID` enviado en Mod o Query no existe en esa sede.

**Solución:**
1. Ejecutar `SalesOrderQuery` en la misma sede para verificar que la orden existe
2. Confirmar que el `TxnID` corresponde a la sede seleccionada — los IDs no son portables entre sedes

---

### QB-3200 — EditSequence desactualizado

**Mensaje:** `The object you specified has been modified by another user`

**Causa:** El `EditSequence` enviado no coincide con el valor actual de la orden en QB.

**Solución:**
1. Ejecutar `SalesOrderQuery` con el `TxnID` para obtener el `EditSequence` actual
2. Usar ese valor inmediatamente en el `SalesOrderMod`
3. No almacenar `EditSequence` entre sesiones — puede cambiar en cualquier momento

---

### QB-3240 — ListID no encontrado

**Mensaje:** `Invalid reference: ListID XXX not found`

**Causa:** Un `ListID` de `CustomerRef`, `TemplateRef`, `ItemRef` u otro campo de referencia no existe en esa compañía QB.

**Solución:**
1. Los ListIDs son específicos por sede — no copiar de una sede a otra
2. Ejecutar `SalesOrderQuery` en la sede objetivo y extraer ListIDs de órdenes existentes
3. Para el `ItemRef`: usar `ItemInventoryQuery` en esa sede para obtener ListIDs válidos

---

### LB-VALIDATION-MISSING_REQUIRED — Campo obligatorio vacío

**Mensaje:** `Missing required fields: [campo1, campo2]`

**Causa:** Uno o más campos marcados como requeridos en el contrato están vacíos.

**Solución:**
1. Revisar la respuesta en la pestaña **Resumen** → campo `details.details`
2. Identifica exactamente qué campos faltan y si son requeridos por Intuit o por la sede
3. Completar los campos indicados y reintentar

---

### Botón Run inactivo / bloqueado

**Síntoma:** El botón **Run** aparece deshabilitado o no responde tras ejecutar una operación.

**Causas posibles:**
1. La respuesta del backend tardó más de 20 segundos → el frontend libera automáticamente después del timeout
2. Un error en la operación anterior dejó el estado en carga (sesión anterior)

**Solución:**
1. Esperar hasta 20 segundos — el frontend libera el botón automáticamente
2. Si persiste: cambiar de operación y volver, o recargar la página
3. Si el problema se repite con frecuencia en una sede específica: el agente QB puede tener problemas de conectividad

---

### MISSING-DATA — Payload vacío

**Causa:** El cuerpo del request llegó vacío a LedgerOps.

**Solución:**
1. Verificar que el formulario tenga al menos un campo completado
2. Para `SalesOrderQuery`: incluir `MaxReturned` o `FromModifiedDate` como mínimo

---

### QB-PARSE-ERROR — Respuesta XML inesperada de QB

**Causa más común para Sales Order:** El campo `ActiveStatus` fue incluido en el payload de `SalesOrderQuery`. Este campo **no es válido** para esta entidad.

**Solución:**
1. Eliminar `ActiveStatus` del payload del Query
2. Usar `MaxReturned` y filtros de fecha en su lugar

---

## Contacto para escalado

Para problemas que persisten después de aplicar las soluciones anteriores, responder al correo de entrega original con:
- Sede afectada
- Operación que falla
- Cuerpo completo del error (copiar desde la pestaña Resumen)
- `TxnID` o `RefNumber` si aplica
```

---

## Verificación requerida de LO

Confirmar a SyncBridge con los commits de cada archivo creado:
1. `docs/qb-playground/SalesOrder-executive.md`
2. `docs/qb-playground/SalesOrder-developer.md`
3. `docs/qb-playground/SalesOrder-architect.md`
4. `docs/qb-playground/SalesOrder-qa.md`
5. `docs/qb-playground/SalesOrder-support.md`

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-07 | Emisión | PROMPT emitido — 5 docs por rol para Sales Order QB Playground |
| 2026-04-07 | Resolución | LO publicó los 5 archivos en docs/qb-playground/ · commit 2989d23 |

