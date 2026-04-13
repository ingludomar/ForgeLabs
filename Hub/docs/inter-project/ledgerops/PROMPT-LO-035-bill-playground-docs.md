# PROMPT-LO-035 — Bill · Documentación por rol (QB Playground)

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-13 |
| **Proyecto destino** | LedgerOps |
| **Tipo** | docs |
| **Estado** | ✅ solved |

---

## Contexto

El feature **Bill QB Playground** (Tipo 2 — F4) ha completado F3 con éxito:

- BillAdd · BillQuery · BillMod verificados en TEST (CRUD completo)
- BillQuery verificado en RUS · RBR · RMX
- REC · RRC · TSI bloqueadas por conflicto de red (pendiente resolución con Jack)

Se requiere crear los 6 archivos de documentación por rol bajo `docs/integration/`.

---

## Acción requerida

Crear los siguientes 6 archivos exactamente con el contenido especificado:

---

### 1. `docs/integration/executive/Bill.md`

```markdown
# Bill — Resumen Ejecutivo

## ¿Qué es?

La integración de **Bill** (Factura de Proveedor) permite crear, consultar y modificar
facturas de proveedor en QuickBooks Desktop desde cualquier sistema externo, sin acceso
directo a QB ni intervención manual del equipo contable.

## Valor para el negocio

| Beneficio | Descripción |
|---|---|
| **Automatización de compras** | Registrar facturas de proveedor desde ERP, portales o scripts sin abrir QB |
| **Cero intervención manual** | El pipeline valida, construye y ejecuta el XML en QB automáticamente |
| **Trazabilidad completa** | Cada operación queda registrada con TxnID, timestamps y EditSequence |
| **Multi-sede** | Una sola API atiende todas las sedes con reglas de negocio diferenciadas |

## Operaciones disponibles

| Operación | Descripción |
|---|---|
| **Add** | Registra una nueva factura de proveedor en QB |
| **Query** | Consulta facturas existentes por TxnID, RefNumber, fechas u otros filtros |
| **Mod** | Modifica una factura existente (requiere TxnID + EditSequence vigente) |

## Sedes verificadas

| Sede | Estado |
|---|---|
| TEST | ✅ Verificada — CRUD completo |
| RUS (Redsis US) | ✅ Verificada — Query confirmado |
| RBR (Redsis Brasil) | ✅ Verificada — Query confirmado |
| RMX (Redsis México) | ✅ Verificada — Query confirmado (QB 2021, QBXML v13.0) |
| REC (Redsis Ecuador) | ⏳ Pendiente — conflicto de red en resolución |
| RRC | ⏳ Pendiente — conflicto de red en resolución |
| TSI | ⏳ Pendiente — conflicto de red en resolución |

## Dependencias técnicas

- LedgerBridge v1.0.1
- LedgerExec v1.0.0
- qbxmlIntegrator v1.0.0
```

---

### 2. `docs/integration/developer/Bill.md`

```markdown
# Bill — Referencia para Desarrolladores

## Endpoints

| Operación | Método | URL |
|---|---|---|
| Add | POST | `https://n8n-development.redsis.ai/webhook/purchasing/bill/add` |
| Mod | POST | `https://n8n-development.redsis.ai/webhook/purchasing/bill/mod` |
| Query | POST | `https://n8n-development.redsis.ai/webhook/purchasing/bill/query` |

## Versión QBXML por sede

| Sede | Versión |
|---|---|
| TEST · RUS · REC · RBR · RRC · TSI | `"17.0"` |
| RMX | `"13.0"` |

Si se omite `version`, el sistema usa `"17.0"` por defecto.

---

## BillAdd

### Payload

```json
{
  "type": "BillAdd",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "VendorRef": { "ListID": "800001F1-1597178964" },
    "TxnDate": "2026-04-13",
    "DueDate": "2026-05-13",
    "RefNumber": "PO-2026-001",
    "Memo": "Factura de proveedor de prueba",
    "ItemLineAdd": {
      "ItemRef": { "ListID": "80000544-1597199018" },
      "Quantity": "1",
      "Cost": "100.00"
    }
  }
}
```

### Campos requeridos por sede — BillAdd

| Campo | TEST | RUS · RBR · RMX | Fuente |
|---|---|---|---|
| `VendorRef.ListID` | ✅ | ✅ | Intuit |
| `DueDate` | ✅ | — | Regla sede |
| Al menos 1 línea (`ItemLineAdd` o `ExpenseLineAdd`) | ✅ | ✅ | Intuit |

### Respuesta exitosa

```json
{
  "success": true,
  "data": {
    "BillRet": {
      "TxnID": "6264A-1776098930",
      "EditSequence": "1776098930",
      "TxnNumber": "28013",
      "VendorRef": { "ListID": "800001F1-1597178964", "FullName": "REDSIS CORP-USD" },
      "TxnDate": "2026-04-13",
      "DueDate": "2026-05-13",
      "AmountDue": "100.00"
    }
  }
}
```

---

## BillMod

### Payload

```json
{
  "type": "BillMod",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "TxnID": "6264A-1776098930",
    "EditSequence": "1776098930",
    "DueDate": "2026-05-13",
    "RefNumber": "PO-2026-001",
    "Memo": "Memo actualizado"
  }
}
```

### Campos requeridos por sede — BillMod

| Campo | TEST | RUS · RBR · RMX | Fuente |
|---|---|---|---|
| `TxnID` | ✅ | ✅ | Intuit |
| `EditSequence` | ✅ | ✅ | Intuit |
| `DueDate` | ✅ | — | Regla sede |
| `RefNumber` | ✅ | — | Regla sede |

> **Importante:** El `EditSequence` cambia en cada modificación. Siempre hacer un BillQuery
> previo para obtener el EditSequence vigente antes de un BillMod.

---

## BillQuery

### Payload

```json
{
  "type": "BillQuery",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "TxnID": "6264A-1776098930"
  }
}
```

### Filtros disponibles

| Campo | Descripción |
|---|---|
| `TxnID` | ID único de la transacción |
| `RefNumber` | Número de referencia / PO number |
| `MaxReturned` | Límite de resultados |
| `IncludeLineItems` | `"true"` para incluir líneas de detalle |
| `ModifiedDateRangeFilter` | `{ "FromModifiedDate": "...", "ToModifiedDate": "..." }` |
| `TxnDateRangeFilter` | `{ "FromTxnDate": "...", "ToTxnDate": "..." }` |

---

## Catálogo de errores

| Código | Mensaje | Causa | Solución |
|---|---|---|---|
| `LB-VALIDATION-MISSING_REQUIRED` | Missing required field(s) | Campo obligatorio faltante por reglas de sede | Revisar `details` en la respuesta y agregar el campo |
| `QB-OPERATION-ERROR` / statusCode 3180 | The transaction is empty | BillAdd sin ninguna línea de detalle | Agregar al menos un `ItemLineAdd` o `ExpenseLineAdd` |
| `QB-OPERATION-ERROR` / statusCode 3200 | Object not found / stale EditSequence | EditSequence desactualizado | Hacer BillQuery para obtener EditSequence vigente |
| `INVALID-BILL-TYPE` | type must be one of: BillAdd/BillMod/BillQuery | Campo `type` incorrecto | Verificar que `type` sea exactamente uno de los tres valores válidos |
| `MISSING-SEDE` | sede is required | Falta el campo `sede` | Incluir `sede` en el payload |
```

---

### 3. `docs/integration/architect/Bill.md`

```markdown
# Bill — Referencia de Arquitectura

## Flujo del sistema

```
Sistema origen
    → POST /webhook/purchasing/bill/{add|mod|query}   [LedgerOps / N8N]
        → Valida type · sede · data
        → POST /webhook/ledgerexec                    [LedgerExec / N8N]
            → Resuelve sede → SSH → LedgerBridge
                → Aplica business rules por sede
                → Construye QBXML
                → POST http://{sede-ip}:{puerto}/qbxml [qbxmlIntegrator]
                    → Ejecuta en QB Desktop via COM
                    → Devuelve respuesta QBXML
                → Parsea respuesta → JSON
            ← JSON estructurado
        ← JSON estructurado
    ← JSON estructurado
```

## Estructura del payload hacia LedgerExec

### BillAdd

```json
{
  "type": "BillAdd",
  "sede": "TEST",
  "version": "17.0",
  "object": "BillAddRq",
  "data": {
    "BillAddRq": {
      "BillAdd": { ...campos del contrato... }
    }
  }
}
```

### BillQuery

```json
{
  "type": "BillQuery",
  "sede": "TEST",
  "version": "17.0",
  "object": "BillQueryRq",
  "data": {
    "BillQueryRq": { ...campos del contrato... }
  }
}
```

> **Diferencia clave:** BillAdd/BillMod usan doble anidamiento (`BillAddRq → BillAdd`).
> BillQuery usa anidamiento simple (`BillQueryRq → campos directo`).

## Versiones QBXML por sede

| Sede | QB Desktop | QBXML |
|---|---|---|
| TEST · RUS · REC · RBR · RRC · TSI | 2024 | 17.0 |
| RMX | 2021 | 13.0 |

LedgerBridge remapea automáticamente el schema a v13.0 para RMX.

## Business rules por sede — BillAdd

| Campo | TEST | RUS | RBR | RMX | REC |
|---|---|---|---|---|---|
| `VendorRef.ListID` | Req (Intuit) | Req (Intuit) | Req (Intuit) | Req (Intuit) | Req (Intuit) |
| `DueDate` | Req (sede) | — | — | — | — |

## Business rules por sede — BillMod

| Campo | TEST | RUS | RBR | RMX | REC |
|---|---|---|---|---|---|
| `TxnID` | Req (Intuit) | Req (Intuit) | Req (Intuit) | Req (Intuit) | Req (Intuit) |
| `EditSequence` | Req (Intuit) | Req (Intuit) | Req (Intuit) | Req (Intuit) | Req (Intuit) |
| `DueDate` | Req (sede) | — | — | — | — |
| `RefNumber` | Req (sede) | — | — | — | — |

## Restricciones conocidas

- `EditSequence` es inmutable y cambia en cada modificación — siempre consultar antes de modificar
- BillAdd requiere al menos una línea de detalle (`ItemLineAdd` o `ExpenseLineAdd`)
- `VendorRef` debe enviarse con `ListID` (no solo `FullName`) cuando se usa con QB Desktop
```

---

### 4. `docs/integration/qa/Bill.md`

```markdown
# Bill — Guía de QA y Casos de Prueba

## Entorno de pruebas

- **Sede:** TEST
- **QB Desktop:** 2024 · QBXML 17.0
- **VendorRef ListID:** `800001F1-1597178964` (REDSIS CORP-USD)
- **ItemRef ListID:** `80000544-1597199018` (00UP067)

---

## Casos de prueba verificados

### TC-ADD-01 — BillAdd exitoso

**Input:**
```json
{
  "type": "BillAdd",
  "sede": "TEST",
  "data": {
    "VendorRef": { "ListID": "800001F1-1597178964" },
    "TxnDate": "2026-04-13",
    "DueDate": "2026-05-13",
    "RefNumber": "TEST-BILL-001",
    "Memo": "Testing BillAdd via QB Playground",
    "ItemLineAdd": {
      "ItemRef": { "ListID": "80000544-1597199018" },
      "Quantity": "1",
      "Cost": "10.00"
    }
  }
}
```

**Resultado:** `success: true` · TxnID `6264A-1776098930` · TxnNumber 28013

---

### TC-MOD-01 — BillMod exitoso

**Input:**
```json
{
  "type": "BillMod",
  "sede": "TEST",
  "data": {
    "TxnID": "6264A-1776098930",
    "EditSequence": "1776098930",
    "DueDate": "2026-05-13",
    "RefNumber": "TEST-BILL-001",
    "Memo": "Testing BillMod via QB Playground - UPDATED"
  }
}
```

**Resultado:** `success: true` · Memo actualizado · EditSequence nueva `1776098948`

---

### TC-QRY-01 — BillQuery por TxnID

**Input:**
```json
{
  "type": "BillQuery",
  "sede": "TEST",
  "data": { "TxnID": "6264A-1776098930" }
}
```

**Resultado:** `success: true` · BillRet con datos completos

---

### TC-QRY-02 — BillQuery con líneas de detalle

**Input:**
```json
{
  "type": "BillQuery",
  "sede": "TEST",
  "data": {
    "TxnID": "100D-1597526169",
    "IncludeLineItems": "true"
  }
}
```

**Resultado:** `success: true` · BillRet con `ItemLineRet` incluido

---

## Pruebas de validación

| Caso | Input | Resultado esperado |
|---|---|---|
| Type inválido | `"type": "BillDelete"` | `INVALID-BILL-TYPE` · 400 |
| Sin sede | `sede` omitido | `MISSING-SEDE` · 400 |
| Sin data | `data: {}` | `MISSING-DATA` · 400 |
| Sin líneas en Add | `data` sin `ItemLineAdd` ni `ExpenseLineAdd` | QB error 3180: transaction is empty |
| Sin DueDate en TEST Add | `DueDate` omitido | `LB-VALIDATION-MISSING_REQUIRED` |
| Sin DueDate+RefNumber en TEST Mod | campos omitidos | `LB-VALIDATION-MISSING_REQUIRED` |
| EditSequence stale | EditSequence desactualizado | QB error 3200 |

---

## Matriz de cobertura por sede

| Sede | Add | Query | Mod |
|---|---|---|---|
| TEST | ✅ 2026-04-13 | ✅ 2026-04-13 | ✅ 2026-04-13 |
| RUS | — | ✅ 2026-04-13 | — |
| RBR | — | ✅ 2026-04-13 | — |
| RMX | — | ✅ 2026-04-13 | — |
| REC | — | ⏳ pendiente | — |
| RRC | — | ⏳ pendiente | — |
| TSI | — | ⏳ pendiente | — |
```

---

### 5. `docs/integration/support/Bill.md`

```markdown
# Bill — Guía de Soporte y Troubleshooting

## Errores frecuentes

### LB-VALIDATION-MISSING_REQUIRED

**Síntoma:** `"code": "LB-VALIDATION-MISSING_REQUIRED"` con lista de campos faltantes

**Causa:** El contrato no incluye un campo obligatorio según las reglas de negocio de la sede.

**Solución:** Revisar el array `details` en la respuesta — indica exactamente qué campo falta
y si es requerido por Intuit o por regla de sede. Agregar el campo al payload.

**Campos frecuentes por sede:**

| Sede | BillAdd | BillMod |
|---|---|---|
| TEST | `DueDate` | `DueDate` · `RefNumber` |

---

### QB error 3180 — The transaction is empty

**Síntoma:** `"message": "The transaction is empty"` · statusCode 3180

**Causa:** BillAdd enviado sin ninguna línea de detalle.

**Solución:** Agregar al menos un `ItemLineAdd` (con `ItemRef.ListID`) o un
`ExpenseLineAdd` (con `AccountRef.ListID`) al payload.

---

### QB error 3200 — Stale EditSequence

**Síntoma:** Error al intentar BillMod con un EditSequence que ya no es el vigente.

**Causa:** El bill fue modificado desde que se obtuvo el EditSequence — ya no es válido.

**Solución:**
1. Ejecutar un BillQuery con el TxnID del bill
2. Copiar el `EditSequence` de la respuesta
3. Reintentar el BillMod con el EditSequence actualizado

---

### INVALID-BILL-TYPE

**Síntoma:** `"code": "INVALID-BILL-TYPE"` · HTTP 400

**Causa:** El campo `type` no es uno de los valores permitidos.

**Valores válidos:** `BillAdd` · `BillMod` · `BillQuery`

---

### MISSING-SEDE / MISSING-DATA

**Síntoma:** HTTP 400 con código `MISSING-SEDE` o `MISSING-DATA`

**Solución:** Verificar que el payload incluya los campos `sede` y `data` con contenido.

---

## Verificación de conectividad

Para confirmar que una sede responde antes de operar:

```bash
curl -X POST https://n8n-development.redsis.ai/webhook/purchasing/bill/query \
  -H "Content-Type: application/json" \
  -d '{"type":"BillQuery","sede":"TEST","data":{"MaxReturned":"1"}}'
```

Una respuesta `success: true` confirma que el pipeline completo está operativo para esa sede.

---

## Escalación

Para problemas no resueltos con este documento, contactar al equipo de desarrollo
respondiendo al hilo del correo de entrega de esta integración.
```

---

### 6. `docs/integration/quickstart/Bill.md`

```markdown
# Bill — Guía de Inicio Rápido

Contratos de ejemplo listos para usar con datos reales de la sede TEST.

---

## 1. Consultar un bill existente (BillQuery)

```bash
curl -X POST https://n8n-development.redsis.ai/webhook/purchasing/bill/query \
  -H "Content-Type: application/json" \
  -d '{
    "type": "BillQuery",
    "sede": "TEST",
    "data": {
      "TxnID": "100D-1597526169"
    }
  }'
```

---

## 2. Crear un bill (BillAdd)

```bash
curl -X POST https://n8n-development.redsis.ai/webhook/purchasing/bill/add \
  -H "Content-Type: application/json" \
  -d '{
    "type": "BillAdd",
    "sede": "TEST",
    "data": {
      "VendorRef": { "ListID": "800001F1-1597178964" },
      "TxnDate": "2026-04-13",
      "DueDate": "2026-05-13",
      "RefNumber": "PO-2026-001",
      "Memo": "Factura de prueba",
      "ItemLineAdd": {
        "ItemRef": { "ListID": "80000544-1597199018" },
        "Quantity": "1",
        "Cost": "100.00"
      }
    }
  }'
```

> Guarda el `TxnID` y `EditSequence` de la respuesta — los necesitas para BillMod.

---

## 3. Modificar un bill (BillMod)

```bash
curl -X POST https://n8n-development.redsis.ai/webhook/purchasing/bill/mod \
  -H "Content-Type: application/json" \
  -d '{
    "type": "BillMod",
    "sede": "TEST",
    "data": {
      "TxnID": "6264A-1776098930",
      "EditSequence": "1776098948",
      "DueDate": "2026-05-13",
      "RefNumber": "PO-2026-001",
      "Memo": "Memo actualizado"
    }
  }'
```

---

## Referencia de campos por sede

| Campo | TEST | RUS · RBR | RMX |
|---|---|---|---|
| `version` | `"17.0"` | `"17.0"` | `"13.0"` |
| `DueDate` en Add | **Requerido** | Opcional | Opcional |
| `DueDate` en Mod | **Requerido** | Opcional | Opcional |
| `RefNumber` en Mod | **Requerido** | Opcional | Opcional |

---

## Obtener ListIDs reales de una sede

Para descubrir VendorRef.ListID o ItemRef.ListID válidos en cualquier sede, usar el
tool de análisis:

```bash
curl -X POST https://n8n-development.redsis.ai/webhook/tools/analyze-sede-fields \
  -H "Content-Type: application/json" \
  -d '{"type": "BillAdd", "sede": "RUS"}'
```
```

---

## Commit sugerido

```
docs: PROMPT-LO-035 — Bill QB Playground · 6 docs por rol (executive · developer · architect · qa · support · quickstart)
```

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-13 | Emisión | F4 Bill QB Playground — 6 docs por rol para LedgerOps |
| 2026-04-13 | Resolución | Commit `355586c` — 6 archivos creados en docs/integration/ (quickstart · executive · developer · architect · qa · support) |
