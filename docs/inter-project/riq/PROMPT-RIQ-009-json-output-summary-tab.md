# PROMPT-RIQ-009 — QB Playground · Pestaña Resumen en JSON Output

**Fecha:** 2026-03-31
**Tipo:** improvement
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-RIQ-001](PROMPT-RIQ-001-qb-playground-integration.md) — integración cuyo JSON Output este PROMPT hace más legible con la pestaña Resumen

---

## Contexto

El panel JSON Output actualmente tiene dos pestañas: `Request` y `Response`. La respuesta JSON es técnicamente correcta pero poco amigable para el usuario — requiere leer JSON crudo para confirmar que el registro retornado es el correcto.

---

## Acción requerida

Agregar una tercera pestaña `Resumen` en el panel JSON Output que muestre los campos más relevantes de la respuesta en formato legible, sin reemplazar el JSON.

---

## Comportamiento esperado

### Estructura del panel

```
[ Request ]  [ Response ]  [ Resumen ]
```

### Contenido de Resumen

Mostrar los campos clave del objeto `*Ret` de la respuesta en formato clave-valor. Los campos a mostrar dependen del tipo de operación:

**Contactos (VendorRet / CustomerRet):**
- Nombre
- Estado (Activo / Inactivo)
- Email
- Teléfono
- Balance
- Última modificación

**Items (ItemInventoryRet / ItemNonInventoryRet / ItemServiceRet):**
- Nombre
- Descripción de venta
- Precio de venta
- Estado (Activo / Inactivo)
- Última modificación

**Transacciones (SalesOrderRet / InvoiceRet / PurchaseOrderRet / BillRet / CreditCardChargeRet):**
- Número de referencia (RefNumber)
- Fecha
- Cliente o Proveedor (FullName)
- Total
- Estado

**Operaciones Add / Mod:**
- Mostrar el `ListID` o `TxnID` generado de forma destacada — es el dato más importante para el usuario después de un Add exitoso

### Múltiples registros (Max Returned > 1)

Cuando la respuesta contiene más de un registro (`*Ret` es un array), el Resumen debe mostrarlos como una lista/tabla — un registro por fila con los campos clave. No silenciar el Resumen cuando hay múltiples resultados.

Ejemplo para VendorQuery con Max Returned = 5:

```
# | Nombre              | Estado  | Email              | Balance
1 | REDSIS CORP-USD     | Activo  | po@redsis.com      | $1,279,456.17
2 | SUPPLIER-001        | Activo  | —                  | $0.00
3 | ...
```

### Fallback

Si el tipo de respuesta no tiene un mapeo definido, mostrar los campos de primer nivel del objeto `*Ret` en formato clave-valor genérico.

---

## Notas de implementación

- La pestaña `Resumen` solo se activa cuando `success: true` — si hay error, no mostrar
- No reemplaza `Response` — ambas pestañas coexisten
- Seleccionar automáticamente la pestaña `Resumen` después de cada Send exitoso
- Detectar si `*Ret` es objeto (1 registro) o array (múltiples) y renderizar acordemente

---

## Verificación

Confirmar a SyncBridge con screenshot de la pestaña Resumen para al menos 3 tipos de operación distintos (Query, Add, transacción).

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-31 | Emisión | PROMPT emitido a RIQ — agregar pestaña "Resumen" en el panel JSON Output del QB Playground |
| 2026-03-31 | Resolución | Pestaña Resumen implementada; selección automática post-Send exitoso; soporte para 1 y múltiples registros |
