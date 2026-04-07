# Vendor — Referencia para Desarrolladores

**Entidad:** `Vendor`
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
| `VendorAdd` | `qb-vendor-add` | Contacts |
| `VendorMod` | `qb-vendor-mod` | Contacts |
| `VendorQuery` | `qb-vendor-query` | Contacts |

---

## Tabla de campos requeridos

### VendorAdd

| Campo | Tipo | Requerido por Intuit | Requerido por sede TEST |
|-------|------|--------------------|------------------------|
| `Name` | string | ✅ | ✅ |
| `IsActive` | string (`"true"`) | ✅ | ✅ |
| `CurrencyRef.ListID` | string | No | ✅ (regla de negocio TEST) |

> `IsActive` es obligatorio por Intuit en `VendorAdd`. QB rechaza el Add si se omite.
> `CurrencyRef` es requerido por regla de negocio en TEST — su ListID es específico por
> compañía QB y debe obtenerse con un `VendorQuery` en cada sede.

### VendorAdd — campos opcionales relevantes

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `CompanyName` | string | Nombre comercial de la empresa |
| `Phone` | string | Teléfono principal |
| `Email` | string | Correo electrónico |
| `BillAddress.Addr1` | string | Dirección de facturación línea 1 |
| `BillAddress.City` | string | Ciudad |
| `BillAddress.Country` | string | País |
| `CurrencyRef.FullName` | string | Nombre de la moneda (ej. `"US Dollar"`) |
| `TermsRef.ListID` | string | Términos de pago — específico por sede |
| `VendorTypeRef.ListID` | string | Tipo de proveedor — específico por sede |
| `CreditLimit` | string | Límite de crédito |
| `TaxIdentifier` | string | RFC / EIN / identificador fiscal |
| `Notes` | string | Notas adicionales |

### VendorMod — campos requeridos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ListID` | string | ID interno del proveedor en QB (ej. `800001F1-1597178964`) |
| `EditSequence` | string | Token de concurrencia — debe ser el valor **actual** |
| `Name` | string | Nombre del proveedor (requerido aunque no cambie) |

---

## Payloads completos

### VendorAdd

```json
{
  "type": "VendorAdd",
  "sede": "TEST",
  "data": {
    "Name": "RDX-VENDOR-TEST-001",
    "IsActive": "true",
    "CompanyName": "Vendor de Prueba Redix",
    "Phone": "555-0100",
    "Email": "vendor@redix.test",
    "BillAddress": {
      "Addr1": "1234 Main Street",
      "Addr2": "Suite 500",
      "City": "Miami",
      "State": "FL",
      "PostalCode": "33101",
      "Country": "USA"
    },
    "CurrencyRef": { "ListID": "800000XX-XXXXXXXXXX", "FullName": "US Dollar" },
    "Notes": "Proveedor creado desde Redix"
  }
}
```

### VendorMod

```json
{
  "type": "VendorMod",
  "sede": "TEST",
  "data": {
    "ListID": "800001F1-1597178964",
    "EditSequence": "<obtener de VendorQuery>",
    "Name": "REDSIS CORP-USD",
    "Notes": "Actualizado desde Redix",
    "Phone": "555-0200"
  }
}
```

### VendorQuery

```json
{
  "type": "VendorQuery",
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
| VendorRef (proveedor de referencia) | `800001F1-1597178964` | REDSIS CORP-USD |

> Los ListIDs de `CurrencyRef`, `TermsRef` y `VendorTypeRef` son específicos por compañía QB.
> Obtener con `VendorQuery` en cada sede → extraer de un vendor existente.

---

## Timeouts

| Capa | Timeout | Comportamiento al superar |
|------|---------|--------------------------|
| Frontend (fetch) | 20 s | `AbortError` — botón Run se desbloquea automáticamente |
| Backend RIQ → LedgerOps | 15 s | `INTERNAL_ERROR — timeout` en la respuesta |

---

## Errores frecuentes

| Código | Causa | Condición | Solución |
|--------|-------|-----------|----------|
| `QB-3100` | `Name` duplicado | Ya existe un vendor con ese nombre | Usar un `Name` único |
| `QB-3170` | Conflicto de fusión | El `Name` del Mod apunta a otro `ListID` existente | Usar el nombre original o un nombre que no exista |
| `QB-3200` | `EditSequence` desactualizado | Otro proceso modificó el vendor después de obtener el EditSequence | Obtener `EditSequence` fresco con `VendorQuery` |
| `QB-3240` | `ListID` no encontrado | `ListID` inválido o de otra sede | Verificar con `VendorQuery` en la misma sede |
| `LB-VALIDATION-MISSING_REQUIRED` | Campo requerido faltante | Sin `Name`, sin `IsActive`, sin `CurrencyRef` (en TEST) | Revisar `details.details[]` — indica campo y origen |
| `MISSING-DATA` | Payload vacío en Query | `data: {}` sin ningún filtro | Incluir al menos `MaxReturned` o `ActiveStatus` |
