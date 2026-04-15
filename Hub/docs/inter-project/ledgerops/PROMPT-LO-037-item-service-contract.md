# PROMPT-LO-037 — LedgerOps · ItemService · Contrato dinámico para QB Playground

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-15 |
| **Proyecto destino** | LedgerOps |
| **Tipo** | feature |
| **Estado** | 🔵 pending |

---

## Contexto

`ItemServiceAdd` y `ItemServiceMod` están registrados en el QB Playground de RIQ con `hasContract: true` — los campos del formulario se cargan dinámicamente desde LO via `GET /webhook/contracts?type=ItemServiceAdd&sede=TEST`.

Al seleccionar estas operaciones en el Playground, el formulario no muestra ningún campo — LO no tiene el contrato registrado para `ItemService`.

Las entidades anteriores (ItemInventory, Bill, Invoice, etc.) funcionan correctamente porque LO ya tiene sus contratos. ItemService es nuevo y requiere que LO lo registre.

---

## Propuesta de FL

Registrar los contratos de `ItemServiceAdd` y `ItemServiceMod` en LO siguiendo el mismo patrón de las entidades existentes.

### Campos requeridos por Intuit para Add

Basado en el testing de RIQ (PROMPT-RIQ-040):

```json
{
  "type": "ItemServiceAdd",
  "requiredByIntuit": ["Name"],
  "requiredBySede": []
}
```

> Las reglas de sede fueron desactivadas via `toggle-sede` — solo aplica lo que Intuit exige.

### Fill Examples sugeridos (datos reales de TEST)

```json
{
  "Name": "RDX-SVC-001",
  "SalesTaxCodeRef": { "ListID": "80000002-1597174715" },
  "SalesOrPurchase": {
    "Price": 100.00,
    "AccountRef": { "ListID": "80000078-1597178857" }
  }
}
```

### Para Mod

El contenedor cambia de `SalesOrPurchase` a `SalesOrPurchaseMod`. Requiere `ListID` + `EditSequence`.

---

## Lo que FL necesita de LO

1. **Analizar** si el contrato debe seguir exactamente el patrón de entidades existentes o hay algo diferente para ItemService
2. Registrar contratos para `ItemServiceAdd` y `ItemServiceMod`
3. Verificar que el Playground carga los campos correctamente

---

## Acción requerida

1. Analizar viabilidad y responder a FL con análisis o contraopropuesta
2. Esperar aprobación de FL antes de implementar
3. Una vez aprobado: implementar + commit
4. Reportar a FL cada paso por separado:
   - `PROMPT-LO-037 completado. Commit {hash}`
5. FL cierra el PROMPT

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-15 | Emisión | Contrato dinámico ItemServiceAdd + ItemServiceMod para QB Playground |
