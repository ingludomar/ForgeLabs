# PROMPT-007 — Sede RMX: validar y registrar schemas QBXML v13.0 para ItemInventory

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-20 |
| **Proyecto destino** | LedgerBridge |
| **Tipo** | feature |
| **Estado** | ✅ solved |

---

## Contexto

La sede **RMX** corre **QB Desktop 2021**. QB Desktop valida el número de versión en el header del XML — rechaza cualquier XML con `version="17.0"`, solo acepta hasta `v13.0`.

Las demás sedes (TEST · RUS · REC · RBR) corren QB Desktop 2024 y operan con `v17.0` sin cambios.

**LedgerOps siempre enviará `"version": "17.0"` en todos los requests** — el mapeo de versión por sede es responsabilidad de LedgerBridge.

---

## Requerimiento

1. Verificar si los schemas de ItemInventory existentes en `v17.0` son estructuralmente válidos para `v13.0` (mismos elementos, mismo orden, mismos tipos)
2. Si son compatibles → registrarlos como `v13.0` sin modificar el contenido
3. Implementar el mapeo: cuando `sede = RMX` → construir el XML con header `version="13.0"`

**No registrar nada que no esté verificado — LedgerBridge debe permanecer limpio.**

---

## XMLs a validar

Los siguientes son los tres tipos QBXML que cubre el feature ItemInventory. Se listan con los campos reales utilizados en producción (sede TEST, verificados en P4).

---

### 1. ItemInventoryAdd

```xml
<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="13.0"?>
<QBXML>
  <QBXMLMsgsRq onError="stopOnError">
    <ItemInventoryAddRq requestID="1">
      <ItemInventoryAdd>
        <Name>ITEM-RMX-TEST-001</Name>
        <SalesDesc>Descripción de venta</SalesDesc>
        <SalesPrice>25.00</SalesPrice>
        <IncomeAccountRef>
          <ListID>{{IncomeAccountRef.ListID}}</ListID>
        </IncomeAccountRef>
        <PurchaseDesc>Descripción de compra</PurchaseDesc>
        <PurchaseCost>10.00</PurchaseCost>
        <COGSAccountRef>
          <ListID>{{COGSAccountRef.ListID}}</ListID>
        </COGSAccountRef>
        <AssetAccountRef>
          <ListID>{{AssetAccountRef.ListID}}</ListID>
        </AssetAccountRef>
      </ItemInventoryAdd>
    </ItemInventoryAddRq>
  </QBXMLMsgsRq>
</QBXML>
```

**Campos requeridos por sede (business rules registradas):**
`Name` · `IncomeAccountRef/ListID` · `COGSAccountRef/ListID` · `AssetAccountRef/ListID` · `SalesDesc` · `SalesPrice` · `PurchaseDesc` · `PurchaseCost` · `Max`

---

### 2. ItemInventoryMod

```xml
<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="13.0"?>
<QBXML>
  <QBXMLMsgsRq onError="stopOnError">
    <ItemInventoryModRq requestID="1">
      <ItemInventoryMod>
        <ListID>{{ListID}}</ListID>
        <EditSequence>{{EditSequence}}</EditSequence>
        <Name>ITEM-RMX-TEST-001</Name>
        <SalesDesc>Descripción modificada</SalesDesc>
        <SalesPrice>30.00</SalesPrice>
        <PurchaseDesc>Descripción de compra</PurchaseDesc>
        <PurchaseCost>15.00</PurchaseCost>
        <Max>100</Max>
      </ItemInventoryMod>
    </ItemInventoryModRq>
  </QBXMLMsgsRq>
</QBXML>
```

**Nota:** `Name` es requerido por QB en todo Mod aunque no se modifique. `IsActive` debe ser string `"false"` (no booleano) para desactivar.

---

### 3. ItemInventoryQuery

```xml
<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="13.0"?>
<QBXML>
  <QBXMLMsgsRq onError="stopOnError">
    <ItemInventoryQueryRq requestID="1">
      <ListID>{{ListID}}</ListID>
    </ItemInventoryQueryRq>
  </QBXMLMsgsRq>
</QBXML>
```

---

## Criterio de validación

Para cada uno de los tres XMLs, verificar contra QB Desktop 2021 (RMX):

| XML | Resultado esperado |
|---|---|
| ItemInventoryAdd v13.0 | QB acepta el request y devuelve `ListID` + `EditSequence` |
| ItemInventoryMod v13.0 | QB acepta el request y devuelve registro actualizado |
| ItemInventoryQuery v13.0 | QB devuelve el registro consultado |

Si los tres pasan → registrar schemas v13.0 en LedgerBridge y confirmar a LedgerOps.
Si alguno falla → documentar qué elemento difiere entre v13.0 y v17.0.

---

## Verificación final desde LedgerOps

Una vez registrados los schemas, LedgerOps confirmará con:

```bash
POST /webhook/tools/analyze-sede-fields
{
  "type": "ItemInventoryAdd",
  "sede": "RMX",
  "version": "17.0",
  "limit": 20
}
# → debe devolver registros reales de RMX
```

---

## Respuesta LedgerBridge — 2026-03-20 · commit `65f1c46`

- Compatibilidad v13.0 ↔ v17.0 confirmada: elementOrder idéntico, mismos campos, solo difiere el header
- Artefactos v13.0 registrados: `ItemInventoryAdd` ✅ · `ItemInventoryMod` ✅ · `ItemInventoryQuery` ✅
- Mapeo implementado: `config/sede-version-map.json → {"RMX": "13.0"}` — `lb-part2-xml.sh` reemplaza la versión antes de llamar a `lb-xml-build.py`
- LedgerOps sigue enviando `"version": "17.0"` — el remap es transparente

---

## Referencia Monday.com

| Item | ID |
|---|---|
| Sedes bloqueadas \| P2 pendiente (RMX · TSI · RRC) | `11548144020` |
| ItemInventory — P2 RMX · TSI · RRC | `11548130964` |
