# PROMPT-001 — XML Field Ordering

| Campo | Valor |
|---|---|
| **Proyecto** | LedgerBridge |
| **Tipo** | bug |
| **Entidad** | ItemInventoryAdd (aplica a todos los tipos QBXML) |
| **Detectado** | 2026-03-13 — P4 ItemInventoryAdd en sede TEST |
| **Estado** | ✅ solved — 2026-03-14 |
| **Monday** | ver subitems bajo `SyncBridge \| LedgerBridge` (item `11506881476`) |
| **Índice** | [← Volver al índice maestro](../README.md) |

---

## Hallazgo

Al enviar un payload con campos opcionales (`SalesDesc`, `SalesPrice`,
`PurchaseDesc`, `PurchaseCost`) en un `ItemInventoryAdd`, QuickBooks Desktop
respondía con:

```
QB COM error hresult=-2147352567
desc=QuickBooks found an error when parsing the provided XML text stream.
```

El mismo payload **sin** los campos opcionales funcionaba correctamente.

---

## Causa raíz

LedgerBridge generaba el XML usando el orden en que llegaban los campos en el
JSON (orden arbitrario o alfabético según `jsonInTemplate`).

QuickBooks Desktop exige que los elementos QBXML respeten el **orden exacto
definido en el QBXML SDK spec**. Cualquier desviación provoca un parse error.

---

## Regla solicitada a LedgerBridge

> El XML debe construirse siguiendo el orden del QBXML spec (schema),
> sin importar el orden en que lleguen los campos en el JSON de entrada.

El JSON es un contrato flexible — los campos pueden llegar en cualquier orden.
El XML es estricto — QB rechaza cualquier campo fuera de posición.

---

## Evidencia de confirmación

Se envió el XML con el orden correcto del spec **directamente** a qbxmlIntegrator
(sin pasar por LedgerBridge), incluyendo los campos opcionales que fallaban:

```bash
curl -X POST http://192.168.0.11:8600/qbxml \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/xml" \
  -d '<QBXML>...<SalesDesc>Venta del producto</SalesDesc><SalesPrice>25.00</SalesPrice>...</QBXML>'
```

**Respuesta:**
```xml
<ItemInventoryAddRs statusCode="0" statusSeverity="Info" statusMessage="Status OK">
  <ItemInventoryRet>
    <ListID>8000995D-1773422759</ListID>
    <SalesDesc>Venta del producto</SalesDesc>
    <SalesPrice>25.00</SalesPrice>
    ...
  </ItemInventoryRet>
</ItemInventoryAddRs>
```

**Conclusión:** QB acepta perfectamente los campos opcionales cuando el XML
respeta el orden del spec. El problema era exclusivo de LedgerBridge.

---

## Orden QBXML spec — ItemInventoryAdd (referencia)

| Pos | Campo | Requerido |
|-----|-------|-----------|
| 1 | Name | ✅ Intuit |
| 2 | IsActive | opcional |
| 3 | ClassRef | opcional |
| 4 | ParentRef | opcional |
| 5 | ManufacturerPartNumber | opcional |
| 6 | SalesTaxCodeRef | opcional |
| 7 | SalesDesc | opcional |
| 8 | SalesPrice | opcional |
| 9 | IncomeAccountRef | ✅ Intuit |
| 10 | IsTaxIncluded | opcional |
| 11 | ApplicableTaxCodeRef | opcional |
| 12 | PurchaseDesc | opcional |
| 13 | PurchaseCost | opcional |
| 14 | PurchaseTaxCodeRef | opcional |
| 15 | COGSAccountRef | ✅ Intuit |
| 16 | PrefVendorRef | opcional |
| 17 | AssetAccountRef | ✅ Intuit |
| 18 | ReorderPoint | opcional |
| 19 | Max | opcional |
| 20 | QuantityOnHand | opcional |
| 21 | TotalValue | opcional |
| 22 | InventoryDate | opcional |
| 23 | ExternalGUID | opcional |
| 24 | BarCode | opcional |
| 25 | UnitOfMeasureSetRef | opcional |
| 26 | IncludeRetElement | opcional |

---

## Resolución

**Archivos modificados en LedgerBridge:**
- `lb-xml-build.py` — lee `elementOrder` del schema, construye XML en ese orden
- `lb-jsonin.py` — extrae `elementOrder` del XML fuente al generar el schema

**Verificación post-fix:**
- ItemInventoryAdd con todos los campos opcionales → `statusCode="0"` ✅
- P4 ItemInventoryAdd sede TEST completado exitosamente ✅
