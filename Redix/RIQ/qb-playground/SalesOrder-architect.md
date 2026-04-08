# Sales Order — Referencia de Arquitectura

**Entidad:** `SalesOrder`
**Audiencia:** Arquitecto de sistemas
**Actualizado:** 2026-04-07

---

## Flujo de datos completo

```
Usuario (Redix UI)
       │
       │  POST /api/integration/qb-playground
       ▼
RIQ Backend (NestJS — redix-integration-quickbooks)
       │
       │  HTTP POST con timeout 15s
       │  hacia webhook de LedgerOps
       ▼
LedgerOps (N8N — orquestador de webhooks)
       │
       │  Ruteo por tipo de operación
       ▼
LedgerBridge (validación + transformación QBXML)
       │
       │  QBXML request string
       ▼
qbxmlIntegrator (agente local QB Desktop)
       │
       │  QBXML via SDK de Intuit
       ▼
QB Desktop (archivo de compañía .QBW)
       │
       │  QBXML response
       └──────────────────────────────► respuesta upstream hasta Redix UI
```

### Timeouts en la cadena

| Capa | Timeout | Mecanismo |
|------|---------|-----------|
| Frontend (Redix UI) | 20 s | `AbortSignal.timeout(20000)` — libera el botón automáticamente |
| RIQ Backend → LedgerOps | 15 s | `axios` / `fetch` con timeout configurado en el servicio |

El timeout del frontend (20 s) es intencionalmente mayor que el del backend (15 s) para dar tiempo a que el backend complete su propio ciclo antes de que el cliente aborte.

---

## Contratos dinámicos por sede

El frontend consulta los contratos de campos requeridos de forma dinámica antes de renderizar el formulario:

```
GET /webhook/contracts?type=SalesOrderAdd&sede=TEST
```

La respuesta define qué campos son requeridos para esa combinación `tipo + sede`, permitiendo que las reglas de negocio por sede (ej. `BillAddress.Addr3` requerido en TEST) sean configurables sin desplegar código.

El formulario superpone este contrato dinámico sobre el esquema base de la entidad — mostrando solo los campos del template si existe uno, o todos los campos si el usuario elige "Todos los campos" en el action bar.

---

## Routing en qb-endpoints.ts

El mapeo entre tipo de operación y clave de webhook está definido en `QB_TYPE_TO_WEBHOOK_KEY`:

```typescript
QB_TYPE_TO_WEBHOOK_KEY = {
  SalesOrderAdd:   'QB_SALES_ORDER_ADD',
  SalesOrderMod:   'QB_SALES_ORDER_MOD',
  SalesOrderQuery: 'QB_SALES_ORDER_QUERY',
  // ...otras entidades
}
```

Este mapa determina qué webhook de LedgerOps se invoca para cada tipo de operación. Agregar soporte para un nuevo tipo de operación requiere:
1. Añadir la clave en `QB_TYPE_TO_WEBHOOK_KEY`
2. Configurar el webhook correspondiente en LedgerOps (N8N)
3. Definir el contrato de campos en LedgerBridge

---

## transformPayload() — separación header / líneas

La función `transformPayload()` en el backend separa el payload del formulario en dos claves distintas dentro del objeto `data` antes de enviarlo a LedgerOps:

```typescript
// Input del formulario (flat):
{
  "SalesOrderAdd": { ...campos header... },
  "SalesOrderLineAdd": { ...campos de línea... }
}

// Output hacia LedgerOps:
{
  "data": {
    "SalesOrderAdd": { ...campos header... },  // → elemento XML <SalesOrderAdd>
    "SalesOrderLineAdd": { ...campos línea... } // → elemento XML <SalesOrderLineAdd>
  }
}
```

QB Desktop requiere que header y líneas estén en elementos XML separados pero anidados. `transformPayload()` respeta esta estructura. Para múltiples líneas, `SalesOrderLineAdd` puede ser un array — LedgerBridge genera un `<SalesOrderLineAdd>` por cada elemento.

### Mod vs Add

La diferencia estructural clave en Mod:
- El header usa `SalesOrderMod` (en lugar de `SalesOrderAdd`) y requiere `TxnID` + `EditSequence`
- Las líneas usan `SalesOrderLineMod` (en lugar de `SalesOrderLineAdd`) y requieren `TxnLineID` por línea
- `TxnID` y `EditSequence` deben obtenerse siempre de un Query fresco — nunca de caché

---

## flattenQbRecord() — hidratación del formulario de Mod

Cuando el usuario selecciona Mod y hace clic en "Obtener EditSequence", el frontend ejecuta un `SalesOrderQuery` con el `TxnID` proporcionado y pasa la respuesta a `flattenQbRecord()`.

Esta función:
1. Extrae `EditSequence` y lo inyecta en el formulario de Mod
2. Aplana los campos del `SalesOrderRet` para pre-poblar el formulario
3. Maneja el comportamiento de QB Desktop donde una única línea retorna como objeto (`{}`) y múltiples líneas retornan como array (`[]`) — esto se controla mediante `QB_LINE_RET_KEYS`

```typescript
// QB_LINE_RET_KEYS define qué claves son líneas (pueden ser objeto o array):
QB_LINE_RET_KEYS = ['SalesOrderLineRet', 'SalesOrderLineMod', ...]
```

`flattenQbRecord()` normaliza siempre las líneas a array para que el formulario funcione de forma consistente independientemente de si hay una o varias líneas en la respuesta.

---

## SalesOrderQuery — restricción de ActiveStatus

`SalesOrderQuery` en QBXML **no soporta el elemento `<ActiveStatus>`**. Incluirlo genera un error de parseo XML en QB Desktop que LedgerBridge retorna como `QB-PARSE-ERROR`.

Esto es una limitación del SDK de Intuit para esta entidad específica — otras entidades (ej. `ItemInventoryQuery`) sí soportan `ActiveStatus`. Para filtrar resultados en `SalesOrderQuery` usar:
- `MaxReturned` — límite de resultados
- `TxnID` — búsqueda por ID específico
- `FromModifiedDate` / `ToModifiedDate` — filtro por rango de fechas
- `RefNumberFilter` — filtro por número de referencia
- `EntityFilter` — filtro por cliente

---

## ListIDs — aislamiento por compañía

Los `ListID` (CustomerRef, TemplateRef, ItemRef, etc.) son identificadores internos del archivo `.QBW` de cada compañía QB Desktop. **No son portables entre sedes.**

Implicaciones:
- Un `ListID` válido en TEST no existe en RUS (y vice versa)
- El contrato dinámico por sede puede incluir `ListID` de ejemplo específicos para ese archivo de compañía
- El error `QB-3240` indica que un `ListID` enviado no existe en el archivo QB activo para esa sede
- Flujo correcto para obtener `ListID` de una sede: ejecutar `SalesOrderQuery` o `ItemInventoryQuery` en esa sede y extraer los `ListID` de una orden o ítem existente

---

## Versiones QBXML por sede

| Sede | Versión QBXML |
|------|---------------|
| TEST | 17.0 |
| RUS | 17.0 |
| REC | 17.0 |
| RBR | 17.0 |
| RMX | 13.0 |

La versión 13.0 de RMX puede no soportar algunos campos disponibles en 17.0. LedgerBridge debe validar compatibilidad de campos al construir el QBXML para RMX.

---

## Diagrama de responsabilidades por capa

| Capa | Responsabilidad en el flujo SalesOrder |
|------|----------------------------------------|
| **Redix UI** | Renderizado de formulario, contratos dinámicos, timeout 20s, flattenQbRecord() para Mod |
| **RIQ Backend (NestJS)** | Autenticación JWT, routing por `QB_TYPE_TO_WEBHOOK_KEY`, timeout 15s hacia LedgerOps, envelope `{ success, data, meta }` |
| **LedgerOps (N8N)** | Orquestación de webhooks, reintento en caso de fallo del agente |
| **LedgerBridge** | Validación de campos requeridos por sede (contratos), construcción del QBXML, parseo de la respuesta XML de QB |
| **qbxmlIntegrator** | Comunicación directa con QB Desktop vía SDK de Intuit, gestión del agente QBFC |
| **QB Desktop** | Ejecución de la operación, retorno de `TxnID`, `EditSequence` y datos de la orden |
