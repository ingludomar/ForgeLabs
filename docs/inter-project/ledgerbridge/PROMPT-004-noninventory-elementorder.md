# PROMPT-004 — QB-PARSE-ERROR en ItemNonInventoryMod

| Campo | Valor |
|---|---|
| **Proyecto** | LedgerBridge |
| **Tipo** | bug |
| **Entidad** | ItemNonInventoryMod (posiblemente otros tipos cargados en PROMPT-003) |
| **Detectado** | 2026-03-19 — TC-MOD-01 ItemNonInventoryMod |
| **Estado** | ✅ cerrado — no es bug de LedgerBridge (ver Resolución) |
| **Monday** | `[BUG] 11546040457` |
| **Índice** | [← Volver al índice maestro](../README.md) |

## PROMPTs relacionados

- [PROMPT-003](PROMPT-003-noninventory-schema.md) — ItemNonInventoryMod fue cargado al servidor en PROMPT-003 mediante git sync; este bug surgió a raíz de ese evento

---

## Observación

Durante P4 Testing de `ItemNonInventoryMod` en sede TEST, el primer caso positivo
(modificación exitosa) devolvió el siguiente error:

```json
{
  "success": false,
  "error": {
    "code": "QB-PARSE-ERROR",
    "message": "No se encontro QBXMLMsgsRs en la respuesta",
    "details": [{
      "raw": "QB COM error hresult=-2147352567 source=QBXMLRP2.RequestProcessor.2 scode=-2147220480 desc=QuickBooks found an error when parsing the provided XML text stream."
    }]
  }
}
```

**Payload enviado:**
```json
{
  "type": "ItemNonInventoryMod",
  "sede": "TEST",
  "version": "17.0",
  "data": {
    "ListID": "80009963-1773909144",
    "EditSequence": "1773909144",
    "Name": "NON-INV-TEST-01",
    "SalesTaxCodeRef": { "ListID": "80000001-1597174715" },
    "SalesOrPurchase": {
      "Desc": "Descripcion MODIFICADA",
      "Price": "75.00",
      "AccountRef": { "ListID": "80000078-1597178857" }
    }
  }
}
```

**Lo que sí funcionó:**
- La validación de campos requeridos pasó sin errores
- El error ocurre al intentar ejecutar la operación en QB Desktop

---

## Contexto relevante

- Este tipo (`ItemNonInventoryMod`) fue cargado al servidor en PROMPT-003
  mediante git sync desde GitHub
- El error `QB COM hresult=-2147352567` es el mismo que se observó en PROMPT-001
  (XML field ordering) antes de su resolución
- La consulta al endpoint `/webhook/describe` para este tipo devuelve `hasDescribe: false`

---

## Hipótesis (para que LedgerBridge valide)

Podría estar relacionado con cómo se generó o cargó el `describe.json` para
este tipo luego del git sync. Sin embargo, LedgerBridge es quien tiene visibilidad
completa de su estado interno y puede determinar la causa real.

---

## Lo que necesito para continuar

Para poder completar P4 de NonInventory y continuar con el desarrollo, necesito
que LedgerBridge investigue, certifique la causa y reporte:

```
ESTADO DEL HALLAZGO: [Confirmado / Descartado / En investigación]

CAUSA IDENTIFICADA:
- [descripción de lo que encontraron]

SOLUCIÓN APLICADA (si aplica):
- [descripción de lo que se hizo]

COMMITS:
- [hash] [descripción]

TIPOS AFECTADOS (si el problema aplica a más tipos del roadmap):
- [lista o "solo ItemNonInventoryMod"]

VERIFICACIÓN:
- ¿ItemNonInventoryMod puede procesar un Mod sin QB-PARSE-ERROR? [Sí / No]
- ¿Hay otros tipos con el mismo comportamiento? [lista o "ninguno"]
```

---

## Resolución — 2026-03-19

**Estado:** Cerrado — no es bug de LedgerBridge. LB se comporta correctamente.

**Causa real:** Asimetría de diseño del QBXML SDK. El nombre del elemento en la sección `Rq` (request) es diferente al de la sección `Rs` (response). LedgerOps enviaba el nombre de la respuesta en el request.

| Tipo | Nombre en Rs (respuesta) | Nombre correcto en Rq (request) |
|---|---|---|
| ItemNonInventoryMod | `SalesOrPurchase` | `SalesOrPurchaseMod` o `SalesAndPurchaseMod` |
| ItemServiceMod | `SalesOrPurchase` | `SalesOrPurchaseMod` o `SalesAndPurchaseMod` |

**Evidencia en LedgerBridge:**
- `describe/ItemNonInventoryMod/v17.0/describe.json` → `elementOrder["ItemNonInventoryMod"]` contiene `SalesOrPurchaseMod`
- `source-xml/ItemNonInventoryMod/v17.0/ItemNonInventoryModRq.xml` → línea 60: `<SalesOrPurchaseMod>` (Rq) vs `<SalesOrPurchase>` (Rs)

**Acción en LedgerOps:** Corregir los payloads de NonInventoryMod y ServiceMod para usar `SalesOrPurchaseMod`. Documentar como `knownIssue` en los verified.json de estas entidades.

**Commits LedgerBridge:** Ninguno — no requirió cambios.

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-19 | Emisión | PROMPT emitido a LedgerBridge — QB-PARSE-ERROR en ItemNonInventoryMod después del git sync de PROMPT-003 |
| 2026-03-19 | Resolución | Cerrado — no es bug de LedgerBridge; asimetría del QBXML SDK entre Rq (`SalesOrPurchaseMod`) y Rs (`SalesOrPurchase`). Acción correctiva en LedgerOps — [ver resolución](#resolución--2026-03-19) |
