# PROMPT-LO-020 — QB Playground · Hospedar documentación Customer

**Fecha:** 2026-03-31
**Tipo:** docs
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-RIQ-013](../riq/PROMPT-RIQ-013-customer-playground-docs.md) — RIQ generó el contenido Markdown que este PROMPT publica en LedgerOps

---

## Objetivo

Crear el archivo `docs/qb-playground/Customer.md` en el repositorio de LedgerOps con el contenido generado por RIQ para la entidad Customer en el QB Playground.

---

## Acción requerida

Crear el archivo `docs/qb-playground/Customer.md` con el siguiente contenido:

---

```markdown
# Customer — QB Playground

## Descripción general

**Customer** representa a un cliente en QuickBooks Desktop. Es la entidad que gestiona los contactos comerciales a quienes se realizan ventas o se emiten facturas.

En el QB Playground están disponibles las siguientes operaciones:

| Operación | Descripción |
|---|---|
| **CustomerAdd** | Crea un nuevo cliente en QB Desktop |
| **CustomerMod** | Modifica los datos de un cliente existente |
| **CustomerQuery** | Consulta clientes por nombre, ListID u otros filtros |

---

## Cómo acceder

1. Ingresar a **Redix** con tu usuario
2. Ir al módulo **Integraciones** → **QB Playground**
3. En el selector de **Entidad**, elegir `Customer`
4. Seleccionar la **Operación** (Add / Mod / Query)
5. Seleccionar la **Sede** (TEST · RUS · REC · RBR · RMX)

---

## Operaciones disponibles

### CustomerAdd

Crea un nuevo cliente en QuickBooks Desktop.

#### Campos requeridos

| Campo | Tipo | Descripción |
|---|---|---|
| `Name` | string | Nombre único del cliente en QB |

#### Campos opcionales (selección)

- `FirstName`, `LastName`, `MiddleName` — Nombre completo del contacto
- `CompanyName` — Nombre de la empresa
- `Phone`, `AltPhone`, `Fax`, `Email`
- `BillAddress` — Dirección de facturación (Addr1, Addr2, City, State, PostalCode, Country)
- `ShipAddress` — Dirección de envío
- `CurrencyRef` — Referencia a la moneda (ListID o FullName); específico por sede
- `SalesTaxCodeRef` — Código de impuesto de venta
- `ItemSalesTaxRef` — Impuesto de venta específico
- `TermsRef` — Términos de pago
- `SalesRepRef` — Representante de ventas
- `CreditLimit` — Límite de crédito
- `Notes` — Notas adicionales
- `IsActive` — Estado activo del cliente (default: `true`)

#### Fill Examples

Al hacer clic en **Fill Examples**, el sistema completa automáticamente los campos con datos reales de la sede **TEST**, incluyendo `Name`, direcciones y referencias de moneda e impuestos.

> **Nota:** Fill Examples usa datos de TEST. Para otras sedes, los ListIDs de `CurrencyRef`, `SalesTaxCodeRef` y otros campos Ref son distintos.

#### Resultado esperado

Si la operación es exitosa, la pestaña **Resumen** mostrará:

```json
{
  "ListID": "...",
  "Name": "...",
  "IsActive": "true",
  "EditSequence": "...",
  ...
}
```

---

### CustomerMod

Modifica los datos de un cliente existente en QuickBooks Desktop.

#### Campos requeridos

| Campo | Tipo | Descripción |
|---|---|---|
| `ListID` | string | Identificador único del cliente en QB — obtenido via CustomerQuery |
| `EditSequence` | string | Token de concurrencia QB — **debe obtenerse fresco via Query justo antes de Mod** |

#### Campos opcionales

Los mismos que CustomerAdd — cualquier campo incluido será actualizado.

#### Fill Examples

Fill Examples completa `ListID` y deja `EditSequence` vacío intencionalmente.

> **IMPORTANTE — EditSequence:**
> El campo `EditSequence` queda vacío intencionalmente. Antes de ejecutar CustomerMod **siempre** se debe:
> 1. Ir a CustomerQuery
> 2. Buscar el cliente que se quiere modificar
> 3. Copiar el `EditSequence` del resultado
> 4. Pegarlo en el campo correspondiente de CustomerMod
>
> O usar el botón **"Obtener EditSequence"** que ejecuta la consulta automáticamente.

#### Resultado esperado

Si la operación es exitosa, la pestaña **Resumen** mostrará el cliente con los datos actualizados:

```json
{
  "ListID": "...",
  "EditSequence": "...",
  "Name": "...",
  "TimeModified": "...",
  ...
}
```

---

### CustomerQuery

Consulta clientes existentes en QuickBooks Desktop.

#### Campos opcionales (filtros)

| Campo | Descripción |
|---|---|
| `MaxReturned` | Número máximo de resultados (recomendado: `1`–`3` para pruebas) |
| `ListID` | Buscar por ID específico |
| `FullName` | Buscar por nombre exacto |
| `ActiveStatus` | `All` · `ActiveOnly` · `InactiveOnly` |
| `FromModifiedDate` / `ToModifiedDate` | Filtro por fecha de modificación |

#### Fill Examples

Completa `MaxReturned` y el identificador del cliente de referencia en TEST.

#### Resultado esperado

La pestaña **Resumen** muestra el listado de clientes. Si retorna más de un registro, los resultados se presentan en un acordeón expandible por registro:

```json
[
  {
    "ListID": "...",
    "EditSequence": "...",
    "Name": "...",
    "IsActive": "true",
    ...
  }
]
```

---

## Notas importantes

1. **EditSequence es dinámico** — QB asigna un nuevo `EditSequence` cada vez que un registro es modificado. Siempre obtenerlo fresh desde CustomerQuery antes de ejecutar CustomerMod.

2. **Error 3170 — nombre duplicado** — Si el `Name` que envías en Mod ya existe en QB bajo otro `ListID`, QB rechaza la operación con "Cannot merge list elements". Siempre usar el nombre original del cliente o un nombre nuevo que no exista en QB.

3. **ListIDs son específicos por sede** — Los valores de `CurrencyRef`, `SalesTaxCodeRef`, `ItemSalesTaxRef`, etc. son distintos en cada sede. Fill Examples solo es válido para TEST.

4. **Contrato dinámico** — Los campos disponibles en el formulario se cargan dinámicamente desde LedgerOps al seleccionar la entidad y sede. Si cambias de sede, los campos Ref pueden variar.

---

## Casos de prueba rápidos

| # | Operación | Pasos | Resultado esperado |
|---|---|---|---|
| TC-1 | CustomerQuery | Fill Examples → Send Query | Cliente retornado con sus datos completos |
| TC-2 | CustomerAdd | Fill Examples → completar `Name` único → Send | Nuevo `ListID` en respuesta |
| TC-3 | CustomerMod | CustomerQuery cliente existente → copiar `EditSequence` → Fill Examples en Mod → pegar EditSequence → modificar un campo → Send | Cliente modificado confirmado |

---

## Referencia de errores comunes

| Código | Causa | Solución |
|---|---|---|
| `3100` | Nombre ya existe en QB | Usar un nombre único para el Add |
| `3170` | No se puede fusionar registros (nombre apunta a otro ListID) | Usar el nombre original del cliente o un nombre que no exista |
| `3200` | `EditSequence` inválido o desactualizado | Re-consultar el cliente y obtener EditSequence fresco |
| `LB-VALIDATION-MISSING_REQUIRED` | Campo requerido por sede no incluido | Revisar el contrato de la sede y completar los campos marcados como requeridos |
| `500` | Error interno en LedgerOps o LedgerBridge | Revisar logs; contactar soporte técnico |
```

---

## Verificación

Confirmar a SyncBridge:

1. Ruta del archivo creado: `docs/qb-playground/Customer.md`
2. Commit y rama donde fue aplicado
3. URL directa al archivo en GitHub

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-31 | Emisión | PROMPT emitido a LedgerOps — crear `docs/qb-playground/Customer.md` con contenido generado por RIQ |
| 2026-03-31 | Resolución | Archivo creado y publicado en el repo de LedgerOps |
