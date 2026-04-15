# PROMPT-RIQ-041 — RIQ · ItemService · Formulario vacío en Add y Mod del QB Playground

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-15 |
| **Proyecto destino** | RIQ |
| **Tipo** | bug |
| **Estado** | ✅ solved — causa raíz identificada · solución en LO |

---

## Contexto

`ItemServiceAdd` y `ItemServiceMod` están registrados en QB_ACTIONS con `hasContract: true`. Al seleccionarlos en el Playground, el formulario no muestra ningún campo.

LO fue consultado (PROMPT-LO-037) y confirmó que los contratos se sirven correctamente:

```
GET /webhook/contracts?type=ItemServiceAdd&sede=TEST
→ success: true · 11 fields · Name=required
```

El problema está en RIQ. LO identifica tres posibles causas:

---

## Posibles causas a verificar

**1 — URL incorrecta en el fetch**
Confirmar que el Playground llama a:
```
GET /webhook/contracts?type=ItemServiceAdd&sede=TEST
```
Y no a una variante con path params o nombre diferente.

**2 — `hasContract` incorrecto en contracts.ts**
Verificar que la entrada de `ItemServiceAdd` en `QB_ACTIONS` tiene `hasContract: true` y no `hasContract: false`.

**3 — Renderer no maneja campos anidados**
LO retorna campos con estructura anidada (`SalesOrPurchase`, `SalesTaxCodeRef`). Verificar que el renderer del formulario los procesa correctamente — igual que en entidades anteriores que sí funcionan.

---

## Acción requerida

1. Analizar las tres causas e identificar cuál aplica
2. Responder a FL con el diagnóstico antes de implementar
3. Esperar aprobación de FL si el fix requiere cambios no triviales
4. Reportar a FL: `PROMPT-RIQ-041 completado. Commit {hash}`
5. FL cierra el PROMPT

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-15 | Emisión | ItemService formulario vacío en Add/Mod — problema en RIQ · LO ya sirve contratos correctamente |
| 2026-04-15 | Diagnóstico RIQ | Dos mecanismos: headerFields (estático) vs template LO (dinámico). headerFields:[] + hasContract:true = LO provee campos via template activo. Bill/Invoice/InventorySite funcionan porque LO tiene template activo. ItemService no tiene template en LO — causa raíz confirmada. |
| 2026-04-15 | Cierre FL | Causa correctamente identificada — no es bug de RIQ. Solución derivada a LO vía PROMPT-LO-038. |
