# Purchase Order — Referencia para Arquitectos

**Entidad:** `PurchaseOrder`
**Operaciones:** Add · Mod · Query
**Audiencia:** Arquitecto de software / Tech Lead
**Actualizado:** 2026-04-07

---

## Posición en el stack

```
Redix Web (React 19)
  └── /api/integration/qb-playground  [POST]
        └── QBPlaygroundController (NestJS 11)
              └── QB_TYPE_TO_WEBHOOK_KEY routing table
                    └── LedgerOps (N8N workflow)
                          └── LedgerBridge (validation + QBXML transform)
                                └── QB Desktop (QBFC / qbXML SDK)
```

El Playground es una capa de testing interactivo que comparte la misma ruta y routing que la
integración de producción. No existe una ruta separada para pruebas.

---

## Routing

| QB Type | Webhook Key | Módulo |
|---------|-------------|--------|
| `PurchaseOrderAdd` | `qb-purchase-order-add` | Purchasing |
| `PurchaseOrderMod` | `qb-purchase-order-mod` | Purchasing |
| `PurchaseOrderQuery` | `qb-purchase-order-query` | Purchasing |

La clave `QB_TYPE_TO_WEBHOOK_KEY` en el backend mapea el campo `type` del payload al webhook de
LedgerOps correspondiente. Si un tipo no está en el mapa, el botón Run queda inactivo en el
Playground (el frontend valida esto antes de habilitar el botón).

---

## Estructura del payload

```typescript
interface QBPlaygroundRequest {
  type: string;      // ej. "PurchaseOrderAdd"
  sede: string;      // ej. "TEST"
  data: {
    PurchaseOrderAdd?: PurchaseOrderAddFields;
    PurchaseOrderLineAdd?: PurchaseOrderLineFields | PurchaseOrderLineFields[];
    PurchaseOrderMod?: PurchaseOrderModFields;
    PurchaseOrderLineMod?: PurchaseOrderLineModFields | PurchaseOrderLineModFields[];
    // Query fields son root-level dentro de data
    MaxReturned?: string;
    TxnID?: string;
    FromModifiedDate?: string;
    // ...
  };
}
```

Para Query, los campos de filtro son root-level dentro de `data` (no anidados bajo
`PurchaseOrderQuery`). Para Add/Mod, los campos header van dentro del objeto con el nombre de la
operación, y las líneas van en una clave hermana.

---

## Validación

### LedgerBridge (backend QB)

LedgerBridge aplica dos capas de validación:

1. **Validación Intuit**: campos obligatorios según el esquema QBXML (`VendorRef`, al menos una
   línea de detalle, etc.)
2. **Validación de sede**: reglas de negocio adicionales por compañía QB. Para TEST:
   - `ExpectedDate` es requerido
   - `VendorAddress.Addr3` es requerido
   - `RefNumber` es requerido (aunque Intuit no lo exija)

   Error retornado: `LB-VALIDATION-MISSING_REQUIRED` con `details.details[]` indicando cada
   campo faltante y su origen (Intuit vs sede).

### Frontend (Redix Web)

El frontend aplica una validación previa basada en `contracts.ts` y el `requiredOverlay` dinámico
obtenido de `/api/integration/qb-contracts`. La validación es visual (contador de campos
requeridos faltantes) y no bloquea el envío al backend — sirve como guía al usuario.

---

## Control de concurrencia — EditSequence

QB Desktop implementa optimistic locking vía `EditSequence`. Es un string numérico que QB
incrementa en cada modificación del registro. El flujo de Mod requiere:

1. **Read**: `PurchaseOrderQuery { TxnID }` → obtiene `EditSequence` actual
2. **Write**: `PurchaseOrderMod { TxnID, EditSequence, ...fields }`

Si `EditSequence` no coincide → `QB-3200`. No existe un mecanismo de retry automático; el
sistema debe re-obtener el `EditSequence` y reenviar.

El Playground implementa esto en `fetchEditSequence()`: ejecuta un Query en el frontend y
pre-rellena `TxnID` y `EditSequence` en el formulario de Mod.

---

## Comportamiento de líneas

### Add

`PurchaseOrderLineAdd` puede ser un objeto (una línea) o un array (múltiples líneas). El backend
acepta ambos formatos y los serializa correctamente en QBXML.

### Mod

`PurchaseOrderLineMod` requiere `TxnLineID` — el identificador de la línea dentro de QB. Se
obtiene del Query en `PurchaseOrderLineRet[].TxnLineID`.

### Query con TxnID

`PurchaseOrderQuery` filtrado por `TxnID` retorna el header del PO pero **no incluye
`PurchaseOrderLineRet`**. Esto es comportamiento nativo del SDK QB. Para obtener líneas, ejecutar
un Query sin filtro de TxnID o usar `RefNumberFilter`.

---

## Manejo de líneas en el frontend — flattenQbRecord

El frontend usa `flattenQbRecord()` para hidratar el formulario de Mod a partir de la respuesta
del Query. Esta función convierte el objeto QB anidado en dot-paths (`ItemRef.ListID`, etc.) y
separa header de líneas usando `QB_LINE_RET_KEYS`:

```typescript
const QB_LINE_RET_KEYS = new Set([
  'PurchaseOrderLineRet', 'PurchaseOrderLineGroupRet',
  // ...otras entidades
]);
```

QB Desktop puede retornar una línea como objeto `{}` o múltiples líneas como array `[]`.
`flattenQbRecord()` normaliza ambos casos. Si el Query por TxnID no retorna líneas, el Playground
muestra un banner de advertencia al usuario.

---

## Timeouts y resiliencia

- El frontend aplica `AbortSignal.timeout(20_000)` en cada `fetch` al endpoint del Playground.
  Si el backend no responde en 20 segundos, el fetch se cancela y el estado `sending` se resetea.
- El estado `sending` es efímero (solo React state). No se persiste en localStorage ni
  sessionStorage. Cualquier handler que resetee el formulario debe llamar `setSending(false)`.

---

## Versiones QBXML por sede

| Sede | Versión QBXML | Notas |
|------|--------------|-------|
| TEST | 17.0 | Versión completa — todas las features |
| RUS | 17.0 | — |
| REC | 17.0 | — |
| RBR | 17.0 | — |
| RMX | 13.0 | Versión reducida — algunos campos pueden no estar disponibles |

---

## Contratos — ubicación en el código

| Artefacto | Ruta |
|-----------|------|
| Definición de campos (frontend) | `apps/web/src/modules/settings/components/sections/integrations/qb-playground/contracts.ts` |
| Componente principal | `apps/web/src/modules/settings/components/sections/integrations/qb-playground/QBPlaygroundSection.tsx` |
| Routing table (backend) | `apps/api/src/modules/integration/qb-endpoints.ts` |
| Webhook config | `apps/api/src/modules/integration/webhooks.config.ts` |

---

## Consideraciones de escalabilidad

- **Templates por sede**: el sistema soporta templates que filtran los campos visibles por
  combinación tipo+sede. Configurar templates en `webhooks.config.ts` reduce la superficie de
  error en producción.
- **requiredOverlay dinámico**: los campos requeridos adicionales por sede se obtienen del
  endpoint `/api/integration/qb-contracts` en tiempo de ejecución, permitiendo cambiar reglas de
  validación sin deploy de frontend.
- **Sin estado en el servidor**: el endpoint del Playground es stateless. Cada petición incluye
  toda la información necesaria (`type`, `sede`, `data`). No existe sesión ni caché de contexto
  QB en el servidor Redix.
