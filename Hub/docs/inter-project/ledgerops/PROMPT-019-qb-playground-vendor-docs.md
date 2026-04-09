# PROMPT-LO-019 — QB Playground · Hospedar documentación Vendor

**Fecha:** 2026-03-31
**Tipo:** docs
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-RIQ-011](../riq/PROMPT-RIQ-011-vendor-playground-docs.md) — RIQ generó el contenido Markdown que este PROMPT publica en LedgerOps

---

## Objetivo

Crear el archivo `docs/qb-playground/Vendor.md` en el repositorio de LedgerOps con el contenido generado por RIQ para la entidad Vendor en el QB Playground.

---

## Acción requerida

Crear el archivo `docs/qb-playground/Vendor.md` con el siguiente contenido exacto:

---

```markdown
# Vendor — QB Playground

## Descripción general

**Vendor** representa a un proveedor en QuickBooks Desktop. Es la entidad que gestiona los contactos comerciales a quienes se realizan compras o pagos.

En el QB Playground están disponibles las siguientes operaciones:

| Operación | Descripción |
|---|---|
| **VendorAdd** | Crea un nuevo proveedor en QB Desktop |
| **VendorMod** | Modifica los datos de un proveedor existente |
| **VendorQuery** | Consulta proveedores por nombre, ListID u otros filtros |

---

## Cómo acceder

1. Ingresar a **Redix** con tu usuario
2. Ir al módulo **Integraciones** → **QB Playground**
3. En el selector de **Entidad**, elegir `Vendor`
4. Seleccionar la **Operación** (Add / Mod / Query)
5. Seleccionar la **Sede** (TEST · RUS · REC · RBR · RMX)

---

## Operaciones disponibles

### VendorAdd

Crea un nuevo proveedor en QuickBooks Desktop.

#### Campos requeridos

| Campo | Tipo | Descripción |
|---|---|---|
| `Name` | string | Nombre único del proveedor en QB |
| `IsActive` | boolean | Estado activo del proveedor — requerido por Intuit, usar `true` |

#### Campos opcionales (selección)

- `CompanyName` — Nombre de la empresa
- `Phone`, `AltPhone`, `Fax`, `Email`
- `BillAddress` — Dirección de facturación (Addr1, Addr2, City, State, PostalCode, Country)
- `CurrencyRef` — Referencia a la moneda (ListID o FullName); específico por sede
- `VendorTypeRef` — Tipo de proveedor
- `TermsRef` — Términos de pago
- `CreditLimit` — Límite de crédito
- `TaxIdentifier` — Identificador fiscal
- `Notes` — Notas adicionales

#### Fill Examples

Al hacer clic en **Fill Examples**, el sistema completa automáticamente los campos con datos reales de la sede **TEST**:
- `Name`: un nombre de proveedor existente (referencia)
- `CurrencyRef`: ListID de la moneda USD en TEST

> **Nota:** Fill Examples usa datos de TEST. Para otras sedes, los ListIDs de `CurrencyRef` y otros campos Ref son distintos.
> El campo `IsActive` **no se completa** automáticamente — debes ingresarlo manualmente con `true`.

#### Resultado esperado

Si la operación es exitosa, la pestaña **Resumen** mostrará:

```json
{
  "ListID": "...",
  "Name": "...",
  "IsActive": true,
  ...
}
```

---

### VendorMod

Modifica los datos de un proveedor existente en QuickBooks Desktop.

#### Campos requeridos

| Campo | Tipo | Descripción |
|---|---|---|
| `ListID` | string | Identificador único del proveedor en QB — obtenido via VendorQuery |
| `EditSequence` | string | Token de concurrencia QB — **debe obtenerse fresco via Query justo antes de Mod** |
| `Name` | string | Nombre del proveedor (puede ser el mismo para no cambiarlo) |

#### Campos opcionales

Los mismos que VendorAdd — cualquier campo incluido será actualizado.

#### Fill Examples

Fill Examples completa `ListID` y `EditSequence` con datos del proveedor `REDSIS CORP-USD` en sede TEST.

> **IMPORTANTE — EditSequence:**
> El campo `EditSequence` queda vacío intencionalmente. Antes de ejecutar VendorMod **siempre** se debe:
> 1. Ir a VendorQuery
> 2. Buscar el proveedor que se quiere modificar
> 3. Copiar el `EditSequence` del resultado
> 4. Pegarlo en el campo correspondiente de VendorMod
>
> O usar el botón **"Obtener EditSequence"** que ejecuta la consulta automáticamente.

#### Resultado esperado

Si la operación es exitosa, la pestaña **Resumen** mostrará el proveedor con los datos actualizados:

```json
{
  "ListID": "...",
  "EditSequence": "...",
  "Name": "...",
  ...
}
```

---

### VendorQuery

Consulta proveedores existentes en QuickBooks Desktop.

#### Campos opcionales (filtros)

| Campo | Descripción |
|---|---|
| `MaxReturned` | Número máximo de resultados (recomendado: `1` para pruebas) |
| `ListID` | Buscar por ID específico |
| `FullName` | Buscar por nombre exacto |
| `ActiveStatus` | `All` · `ActiveOnly` · `InactiveOnly` |
| `FromModifiedDate` / `ToModifiedDate` | Filtro por fecha de modificación |

#### Fill Examples

Completa `MaxReturned = 1` y el `FullName` del proveedor de referencia en TEST (`REDSIS CORP-USD`).

#### Resultado esperado

La pestaña **Resumen** muestra el listado de proveedores coincidentes:

```json
[
  {
    "ListID": "...",
    "EditSequence": "...",
    "Name": "REDSIS CORP-USD",
    "IsActive": true,
    ...
  }
]
```

---

## Notas importantes

1. **EditSequence es dinámico** — QB asigna un nuevo `EditSequence` cada vez que un registro es modificado. Siempre obtenerlo fresh desde VendorQuery antes de ejecutar VendorMod.

2. **ListIDs son específicos por sede** — Los valores de `CurrencyRef`, `VendorTypeRef`, `TermsRef`, etc. son distintos en cada sede. Fill Examples solo es válido para TEST.

3. **IsActive es requerido por Intuit en Add** — Aunque no aparece en todos los contratos, QB rechaza el Add si no se incluye. Siempre enviar `IsActive: true`.

4. **No renombrar a un ListID recién creado** — Si acabas de crear un vendor y quieres modificarlo, asegúrate de que el nombre no colisione con otro existente.

---

## Casos de prueba rápidos

| # | Operación | Pasos | Resultado esperado |
|---|---|---|---|
| TC-1 | VendorQuery | Fill Examples → Send Query | Proveedor `REDSIS CORP-USD` retornado con sus datos |
| TC-2 | VendorAdd | Fill Examples → completar `Name` único + `IsActive=true` → Send | Nuevo `ListID` en respuesta |
| TC-3 | VendorMod | VendorQuery proveedor existente → copiar `EditSequence` → Fill Examples en Mod → pegar EditSequence → Send | Proveedor modificado confirmado |

---

## Referencia de errores comunes

| Código | Causa | Solución |
|---|---|---|
| `3100` | Nombre ya existe en QB | Usar un nombre único para el Add |
| `3170` | No se puede fusionar registros (nombre apunta a otro ListID) | Usar un nombre diferente |
| `3210` | `EditSequence` inválido o desactualizado | Re-consultar el proveedor y obtener EditSequence fresco |
| `LB-VALIDATION-MISSING_REQUIRED` | Campo requerido por sede no incluido | Revisar el contrato de la sede y completar los campos marcados como requeridos |
| `500` | Error interno en LedgerOps o LedgerBridge | Revisar logs; contactar soporte técnico |
```

---

## Verificación

Confirmar a SyncBridge:

1. Ruta del archivo creado: `docs/qb-playground/Vendor.md`
2. Commit y rama donde fue aplicado
3. URL directa al archivo en GitHub

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-31 | Emisión | PROMPT emitido a LedgerOps — crear `docs/qb-playground/Vendor.md` con contenido generado por RIQ |
| 2026-03-31 | Resolución | Archivo creado y publicado en el repo de LedgerOps |
