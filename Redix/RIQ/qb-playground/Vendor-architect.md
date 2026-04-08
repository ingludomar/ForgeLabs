# Vendor — Referencia para Arquitectos

**Entidad:** `Vendor`
**Operaciones:** Add · Mod · Query
**Audiencia:** Arquitecto de software / Tech Lead
**Actualizado:** 2026-04-07

---

## Flujo completo

```
Redix Web (React 19)
  └── POST /api/integration/qb-playground
        └── QBPlaygroundController (NestJS 11)
              └── QB_TYPE_TO_WEBHOOK_KEY  →  "qb-vendor-add/mod/query"
                    └── IntegrationService → LedgerOps (N8N webhook)
                          └── LedgerBridge (validation + QBXML transform)
                                └── qbxmlIntegrator → QB Desktop SDK
                                      └── QB Desktop — companyFile sede
```

El endpoint `/api/integration/qb-playground` es stateless y comparte implementación con los
flujos automatizados de producción. El Playground es únicamente una capa de UI para construir
y enviar el payload manualmente.

---

## Routing table

`QB_TYPE_TO_WEBHOOK_KEY` en `apps/api/src/modules/integration/qb-endpoints.ts`:

| QB Type | Webhook Key | Módulo QB |
|---------|-------------|-----------|
| `VendorAdd` | `qb-vendor-add` | Contacts |
| `VendorMod` | `qb-vendor-mod` | Contacts |
| `VendorQuery` | `qb-vendor-query` | Contacts |

Si un `type` no está registrado en esta tabla, el frontend deshabilita el botón Run antes de
enviar la petición.

---

## Contratos dinámicos

Los campos requeridos adicionales por sede se obtienen en tiempo de ejecución:

```
GET /webhook/contracts?type=VendorAdd&sede=TEST
→ { requiredFields: ["Name", "IsActive", "CurrencyRef.ListID"], ... }
```

El frontend fusiona este overlay con el contrato estático de `contracts.ts`. Esto permite
ajustar validaciones por sede sin deploy de frontend.

---

## Versiones QBXML por sede

| Sede | Versión QBXML | Notas |
|------|--------------|-------|
| TEST | 17.0 | Versión completa |
| RUS | 17.0 | — |
| REC | 17.0 | — |
| RBR | 17.0 | — |
| RMX | 13.0 | Versión reducida — verificar compatibilidad de campos opcionales |

---

## Estructura del payload

Para Vendor, el payload `data` es flat (no tiene clave contenedora con el nombre de la operación
para Add/Mod — los campos van directamente en `data`). Query sigue el mismo patrón.

```typescript
// Add / Mod
{
  type: "VendorAdd" | "VendorMod",
  sede: string,
  data: {
    Name: string,
    IsActive: string,
    ListID?: string,       // solo Mod
    EditSequence?: string, // solo Mod
    CurrencyRef?: { ListID: string, FullName?: string },
    // ...campos opcionales
  }
}

// Query
{
  type: "VendorQuery",
  sede: string,
  data: {
    MaxReturned?: string,
    ActiveStatus?: string,
    FullName?: string,
    ListID?: string,
    FromModifiedDate?: string,
  }
}
```

> A diferencia de `SalesOrder` y `PurchaseOrder`, `Vendor` no tiene un objeto contenedor con el
> nombre de la operación (`VendorAdd: {...}`). Los campos van directamente en `data`.

---

## Control de concurrencia — EditSequence

`EditSequence` es un string numérico que QB incrementa en cada escritura sobre el registro.
El flujo de Mod requiere:

1. `VendorQuery { ListID }` → obtiene `EditSequence` actual
2. `VendorMod { ListID, EditSequence, ...fields }` — enviado inmediatamente

Si `EditSequence` no coincide → `QB-3200`. No existe retry automático; el cliente debe re-obtener
y reenviar. El Playground implementa el botón **"Obtener EditSequence"** que automatiza el paso 1.

---

## Restricciones de nombre — QB-3170

QB Desktop no permite que dos registros del mismo tipo (vendors) tengan el mismo `Name`. Si un
`VendorMod` envía un `Name` que ya pertenece a otro `ListID`, QB interpreta esto como un intento
de fusión de registros y retorna `QB-3170` ("Cannot merge list elements"). La solución es usar el
nombre original del vendor o un nombre que no exista en esa compañía.

---

## ListIDs y portabilidad entre sedes

Los `ListID` son asignados por QB Desktop al crear un registro y son únicos dentro de cada archivo
de compañía. **No son portables entre sedes.** El mismo proveedor en RUS y TEST tendrá ListIDs
distintos. Para operaciones en producción, los ListIDs deben obtenerse con `VendorQuery` en cada
sede.

Los campos que contienen ListIDs específicos por sede:
- `CurrencyRef.ListID` — moneda registrada en esa compañía
- `TermsRef.ListID` — términos de pago locales
- `VendorTypeRef.ListID` — tipos de proveedor locales

---

## Timeouts y resiliencia

- **Frontend**: `AbortSignal.timeout(20_000)` en cada fetch. Si el backend no responde en 20s,
  el fetch se cancela y el estado `sending` del Playground se resetea automáticamente.
- **Backend → LedgerOps**: timeout de 15s. Si se supera, retorna `INTERNAL_ERROR — timeout`.
- El estado `sending` es efímero (React state). No se persiste. Cualquier cambio de entidad o
  recarga de página lo resetea.

---

## Archivos relevantes

| Artefacto | Ruta |
|-----------|------|
| Contrato frontend (campos) | `apps/web/src/modules/settings/components/sections/integrations/qb-playground/contracts.ts` |
| Componente principal | `apps/web/src/modules/settings/components/sections/integrations/qb-playground/QBPlaygroundSection.tsx` |
| Routing table | `apps/api/src/modules/integration/qb-endpoints.ts` |
| Webhook config | `apps/api/src/modules/integration/webhooks.config.ts` |
