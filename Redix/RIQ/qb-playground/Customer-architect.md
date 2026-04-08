# Customer — Referencia para Arquitectos

**Entidad:** `Customer`
**Operaciones:** Add · Mod · Query
**Audiencia:** Arquitecto de software / Tech Lead
**Actualizado:** 2026-04-07

---

## Flujo completo

```
Redix Web (React 19)
  └── POST /api/integration/qb-playground
        └── QBPlaygroundController (NestJS 11)
              └── QB_TYPE_TO_WEBHOOK_KEY  →  "qb-customer-add/mod/query"
                    └── IntegrationService → LedgerOps (N8N webhook)
                          └── LedgerBridge (validation + QBXML transform)
                                └── qbxmlIntegrator → QB Desktop SDK
                                      └── QB Desktop — companyFile sede
```

El endpoint `/api/integration/qb-playground` es stateless y comparte implementación con los
flujos automatizados de producción.

---

## Routing table

`QB_TYPE_TO_WEBHOOK_KEY` en `apps/api/src/modules/integration/qb-endpoints.ts`:

| QB Type | Webhook Key | Módulo QB |
|---------|-------------|-----------|
| `CustomerAdd` | `qb-customer-add` | Contacts |
| `CustomerMod` | `qb-customer-mod` | Contacts |
| `CustomerQuery` | `qb-customer-query` | Contacts |

---

## Contratos dinámicos

Los campos requeridos adicionales por sede se resuelven en tiempo de ejecución:

```
GET /webhook/contracts?type=CustomerAdd&sede=TEST
→ { requiredFields: ["Name", "CurrencyRef.ListID", "SalesTaxCodeRef.ListID"], ... }
```

El frontend fusiona este overlay con el contrato estático de `contracts.ts`, marcando con
asterisco los campos requeridos por sede que no son requeridos por Intuit. Si la sede cambia,
el overlay se recarga y el formulario se actualiza.

---

## Versiones QBXML por sede

| Sede | Versión QBXML | Notas |
|------|--------------|-------|
| TEST | 17.0 | Versión completa |
| RUS | 17.0 | — |
| REC | 17.0 | — |
| RBR | 17.0 | — |
| RMX | 13.0 | Versión reducida — algunos campos opcionales pueden no estar disponibles |

---

## Estructura del payload

Para Customer, el payload `data` es flat — los campos van directamente en `data` sin un objeto
contenedor con el nombre de la operación.

```typescript
// Add
{
  type: "CustomerAdd",
  sede: string,
  data: {
    Name: string,
    CurrencyRef?: { ListID: string, FullName?: string },
    SalesTaxCodeRef?: { ListID: string },
    BillAddress?: { Addr1: string, City: string, ... },
    // ...campos opcionales
  }
}

// Mod
{
  type: "CustomerMod",
  sede: string,
  data: {
    ListID: string,
    EditSequence: string,
    // solo los campos que cambian
  }
}

// Query
{
  type: "CustomerQuery",
  sede: string,
  data: {
    MaxReturned?: string,
    ActiveStatus?: string,
    FullName?: string,
    ListID?: string,
  }
}
```

> A diferencia de `SalesOrder`/`PurchaseOrder`, `Customer` no usa objeto contenedor
> (`CustomerAdd: {...}`). Los campos van directamente en `data`. Mismo patrón que `Vendor`.

---

## Relación con otras entidades

`Customer.ListID` es la referencia que usan `SalesOrderAdd` (`CustomerRef.ListID`) e
`InvoiceAdd` (`CustomerRef.ListID`). La consistencia de los ListIDs entre entidades es
crítica: un `CustomerRef.ListID` en una Sales Order debe corresponder a un Customer activo
en la misma compañía QB Desktop.

Dependencias directas:
- `SalesOrderAdd` → `CustomerRef.ListID` (desde CustomerQuery)
- `InvoiceAdd` → `CustomerRef.ListID` (desde CustomerQuery)
- `ReceivePaymentAdd` → `CustomerRef.ListID` (desde CustomerQuery)

---

## Control de concurrencia — EditSequence

`EditSequence` es un string numérico que QB incrementa en cada escritura. El flujo Mod:

1. `CustomerQuery { ListID }` → obtiene `EditSequence` actual
2. `CustomerMod { ListID, EditSequence, ...fields }` — enviado inmediatamente

Si `EditSequence` no coincide → `QB-3200`. El Playground implementa **"Obtener EditSequence"**
para automatizar el paso 1.

---

## Restricción de nombre — QB-3170

QB Desktop no permite que dos clientes tengan el mismo `Name`. Si un `CustomerMod` envía un
`Name` que ya pertenece a otro `ListID`, QB retorna `QB-3170` ("Cannot merge list elements").
Solución: usar el nombre original del cliente, o verificar con `CustomerQuery` que el nuevo
nombre no existe antes del Mod.

---

## ListIDs específicos por sede

Los campos que contienen ListIDs sede-específicos en Customer:
- `CurrencyRef.ListID` — moneda registrada en esa compañía
- `SalesTaxCodeRef.ListID` — código de impuesto de venta local
- `ItemSalesTaxRef.ListID` — impuesto específico local
- `TermsRef.ListID` — términos de pago locales
- `SalesRepRef.ListID` — representantes de venta locales
- `CustomerTypeRef.ListID` — tipos de cliente locales

Un `ListID` válido en TEST no existe en RUS/REC/RBR/RMX.

---

## Archivos relevantes

| Artefacto | Ruta |
|-----------|------|
| Contrato frontend | `apps/web/src/modules/settings/components/sections/integrations/qb-playground/contracts.ts` |
| Componente principal | `apps/web/src/modules/settings/components/sections/integrations/qb-playground/QBPlaygroundSection.tsx` |
| Routing table | `apps/api/src/modules/integration/qb-endpoints.ts` |
| Webhook config | `apps/api/src/modules/integration/webhooks.config.ts` |
