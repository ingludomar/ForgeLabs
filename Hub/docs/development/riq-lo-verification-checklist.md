# RIQ ↔ LedgerOps — Hoja de verificación

**Sede:** TEST
**Fecha:** ___________
**Verificado por:** ___________

---

## Instrucciones

1. Abrir QB Playground en RIQ
2. Seleccionar entidad + operación + sede TEST
3. Click **Fill Examples**
4. Click **Send**
5. Marcar resultado y anotar el ID obtenido

**Criterio general:**
- ✅ `success: true` + datos en respuesta
- ❌ cualquier error o `success: false`

---

## CONTACTOS

| # | Entidad | Operación | Resultado | ID obtenido | Observaciones |
|---|---|---|---|---|---|
| 1 | Vendor | Query | ⬜ | `800001F1-1597178964` esperado | `Name = "REDSIS CORP-USD"` |
| 2 | Vendor | Add | ⬜ | _____________ | Nuevo `ListID` en respuesta |
| 3 | Vendor | Mod | ⬜ | _____________ | Usar ListID de #2 |
| 4 | Customer | Query | ⬜ | `800002C4-1597179052` esperado | `FullName = "Lenovo Mexico USD"` |
| 5 | Customer | Add | ⬜ | _____________ | Nuevo `ListID` en respuesta |
| 6 | Customer | Mod | ⬜ | _____________ | Usar ListID de #5 |

---

## INVENTARIO

| # | Entidad | Operación | Resultado | ID obtenido | Observaciones |
|---|---|---|---|---|---|
| 7 | Item Inventory | Query | ⬜ | `80000026-1597198891` esperado | `Name = "#2 CLEAR"` |
| 8 | Item Inventory | Add | ⬜ | _____________ | Nuevo `ListID` en respuesta |
| 9 | Item Inventory | Mod | ⬜ | _____________ | Usar ListID de #8 |

---

## VENTAS

| # | Entidad | Operación | Resultado | ID obtenido | Observaciones |
|---|---|---|---|---|---|
| 10 | Sales Order | Query | ⬜ | `1-1597258879` esperado | `CustomerRef.ListID` confirmado |
| 11 | Sales Order | Add | ⬜ | _____________ | Nuevo `TxnID` en respuesta |
| 12 | Sales Order | Mod | ⬜ | _____________ | Usar TxnID de #11 |
| 13 | Invoice | Query | ⬜ | `12B8-1597547050` esperado | `CustomerRef` confirmado |
| 14 | Invoice | Add | ⬜ | _____________ | Nuevo `TxnID` en respuesta |

---

## COMPRAS

| # | Entidad | Operación | Resultado | ID obtenido | Observaciones |
|---|---|---|---|---|---|
| 15 | Purchase Order | Query | ⬜ | `F8C-1597523528` esperado | `VendorRef.ListID` confirmado |
| 16 | Purchase Order | Add | ⬜ | _____________ | Nuevo `TxnID` en respuesta |
| 17 | Purchase Order | Mod | ⬜ | _____________ | Usar TxnID de #16 |
| 18 | Bill | Query | ⬜ | `100D-1597526169` esperado | `VendorRef.ListID` confirmado |
| 19 | Bill | Add | ⬜ | _____________ | Nuevo `TxnID` en respuesta |
| 20 | Bill | Mod | ⬜ | _____________ | Usar TxnID de #19 |

---

## BANCA

| # | Entidad | Operación | Resultado | ID obtenido | Observaciones |
|---|---|---|---|---|---|
| 21 | Credit Card Charge | Add | ⬜ | _____________ | Nuevo `TxnID` en respuesta |

---

## INVENTARIO AVANZADO

| # | Entidad | Operación | Resultado | ID obtenido | Observaciones |
|---|---|---|---|---|---|
| 22 | Inventory Site | Query | ⬜ | _____________ | Cualquier site retornado |
| 23 | Inventory Transfer | Add | ⬜ | _____________ | Nuevo `TxnID` en respuesta |
| 24 | Assembly | Add | ⬜ | _____________ | Nuevo `TxnID` en respuesta |

---

## Resumen

| Grupo | Total | ✅ | ❌ |
|---|---|---|---|
| Contactos | 6 | | |
| Inventario | 3 | | |
| Ventas | 5 | | |
| Compras | 6 | | |
| Banca | 1 | | |
| Inventario Avanzado | 3 | | |
| **TOTAL** | **24** | | |

---

## Notas

- En operaciones **Add**: si el nombre ya existe en QB (`Name duplicado`), cambiar el nombre manualmente antes de Send — ej. `RDX-VENDOR-002`
- En operaciones **Mod**: usar el `ListID` / `TxnID` obtenido en el Add anterior, no el ejemplo fijo
- En **Timeout 15s**: QB Desktop estaba ocupado — esperar 30s y reintentar
