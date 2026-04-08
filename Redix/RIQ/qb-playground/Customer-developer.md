# Customer — Referencia para Desarrolladores

**Entidad:** `Customer`
**Operaciones:** Add · Mod · Query
**Audiencia:** Desarrollador
**Actualizado:** 2026-04-07

---

## Endpoint

```
POST /api/integration/qb-playground
Content-Type: application/json
Authorization: Bearer <token>
```

---

## Routing de operaciones

| QB Type | Webhook Key | Módulo |
|---------|-------------|--------|
| `CustomerAdd` | `qb-customer-add` | Contacts |
| `CustomerMod` | `qb-customer-mod` | Contacts |
| `CustomerQuery` | `qb-customer-query` | Contacts |

---

## Tabla de campos requeridos

### CustomerAdd

| Campo | Tipo | Requerido por Intuit | Requerido por sede TEST |
|-------|------|--------------------|------------------------|
| `Name` | string | ✅ | ✅ |
| `CurrencyRef.ListID` | string | No | ✅ (regla de negocio TEST) |
| `SalesTaxCodeRef.ListID` | string | No | ✅ (regla de negocio TEST) |

> `Name` es el único campo obligatorio por Intuit. Los demás son requeridos por reglas de
> negocio de la sede TEST. En otras sedes puede variar — verificar con el `requiredOverlay`
> dinámico de `/webhook/contracts?type=CustomerAdd&sede=<sede>`.

### CustomerAdd — campos opcionales relevantes

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `FirstName` / `LastName` | string | Nombre del contacto principal |
| `CompanyName` | string | Nombre comercial |
| `Phone` / `Email` | string | Datos de contacto |
| `BillAddress.Addr1` | string | Dirección de facturación |
| `BillAddress.City` | string | Ciudad |
| `BillAddress.Country` | string | País |
| `ShipAddress.Addr1` | string | Dirección de envío |
| `CurrencyRef.FullName` | string | Nombre de la moneda (ej. `"US Dollar"`) |
| `SalesTaxCodeRef.ListID` | string | Código de impuesto de venta — específico por sede |
| `ItemSalesTaxRef.ListID` | string | Impuesto específico de venta — específico por sede |
| `TermsRef.ListID` | string | Términos de pago — específico por sede |
| `SalesRepRef.ListID` | string | Representante de ventas — específico por sede |
| `CustomerTypeRef.ListID` | string | Tipo de cliente — específico por sede |
| `CreditLimit` | string | Límite de crédito |
| `IsActive` | string | `"true"` / `"false"` (default: `"true"`) |
| `Notes` | string | Notas adicionales |

### CustomerMod — campos requeridos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ListID` | string | ID interno del cliente en QB |
| `EditSequence` | string | Token de concurrencia — debe ser el valor **actual** |

> Para CustomerMod, cualquier campo de Add puede incluirse para ser actualizado.
> No es necesario reenviar todos los campos — solo los que cambian (más `ListID` y `EditSequence`).

---

## Payloads completos

### CustomerAdd

```json
{
  "type": "CustomerAdd",
  "sede": "TEST",
  "data": {
    "Name": "RDX-CUSTOMER-TEST-001",
    "CompanyName": "Cliente de Prueba Redix",
    "Phone": "555-0300",
    "Email": "cliente@redix.test",
    "BillAddress": {
      "Addr1": "1234 Main Street",
      "Addr2": "Suite 500",
      "City": "Miami",
      "State": "FL",
      "PostalCode": "33101",
      "Country": "USA"
    },
    "ShipAddress": {
      "Addr1": "1234 Main Street",
      "City": "Miami",
      "State": "FL",
      "Country": "USA"
    },
    "CurrencyRef": { "ListID": "800000XX-XXXXXXXXXX", "FullName": "US Dollar" },
    "SalesTaxCodeRef": { "ListID": "80000001-1597174715" },
    "IsActive": "true",
    "Notes": "Cliente creado desde Redix"
  }
}
```

### CustomerMod

```json
{
  "type": "CustomerMod",
  "sede": "TEST",
  "data": {
    "ListID": "800002C4-1597179052",
    "EditSequence": "<obtener de CustomerQuery>",
    "Notes": "Actualizado desde Redix",
    "Phone": "555-0400"
  }
}
```

### CustomerQuery

```json
{
  "type": "CustomerQuery",
  "sede": "TEST",
  "data": {
    "MaxReturned": "5",
    "ActiveStatus": "ActiveOnly"
  }
}
```

---

## ListIDs de referencia — sede TEST

| Referencia | ListID | FullName |
|------------|--------|----------|
| CustomerRef (cliente de referencia) | `800002C4-1597179052` | RDX-CUSTOMER-UP-001 |
| SalesTaxCodeRef | `80000001-1597174715` | Tax |
| ItemSalesTaxRef | `80000001-1597179051` | IVA-MX |

> Los ListIDs de `CurrencyRef`, `SalesTaxCodeRef`, `CustomerTypeRef` y `TermsRef` son
> específicos por compañía QB. Obtener con `CustomerQuery` en cada sede.

---

## Timeouts

| Capa | Timeout | Comportamiento |
|------|---------|---------------|
| Frontend (fetch) | 20 s | `AbortError` — botón Run se desbloquea automáticamente |
| Backend → LedgerOps | 15 s | `INTERNAL_ERROR — timeout` en la respuesta |

---

## Errores frecuentes

| Código | Causa | Condición | Solución |
|--------|-------|-----------|----------|
| `QB-3100` | `Name` duplicado | Ya existe un cliente con ese nombre | Usar un `Name` único |
| `QB-3170` | Conflicto de fusión | El `Name` del Mod ya pertenece a otro `ListID` | Usar el nombre original o uno nuevo que no exista |
| `QB-3200` | `EditSequence` desactualizado | `EditSequence` no coincide con el actual en QB | Obtener `EditSequence` fresco con `CustomerQuery` |
| `QB-3240` | `ListID` no encontrado | `ListID` de otra sede o inválido | Verificar con `CustomerQuery` en la misma sede |
| `LB-VALIDATION-MISSING_REQUIRED` | Campo requerido faltante | Sin `Name`, sin `CurrencyRef` (TEST), etc. | Revisar `details.details[]` — indica campo y origen |
| `MISSING-DATA` | Payload de Query vacío | `data: {}` sin filtros | Incluir al menos `MaxReturned` o `ActiveStatus` |
