# PROMPT-RIQ-038 — CreditCardCharge · Add faltante en QB Playground

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-14 |
| **Proyecto destino** | RIQ |
| **Tipo** | bug |
| **Estado** | ✅ cerrado — falsa alarma |
| **Relacionado con** | PROMPT-RIQ-037 |

---

## Contexto

En PROMPT-RIQ-037 se solicitaron 3 operaciones para CreditCardCharge: Add, Mod y Query.
Mod y Query fueron implementados correctamente. **Add quedó sin implementar.**

La causa fue una nota ambigua en el PROMPT anterior que decía "Add no requiere campos en contracts.ts" — esto se interpretó como "no agregar Add", cuando el significado correcto era "agregar la entrada de Add en QB_ACTIONS con `headerFields: []` vacío porque los campos vienen dinámicamente desde LO".

**La entrada en `QB_ACTIONS` es obligatoria aunque no tenga campos propios — es lo que registra la operación en el Playground.**

---

## Cambios requeridos

### 1 — `apps/api/src/modules/integration/constants/qb-endpoints.ts`

Agregar `CreditCardChargeAdd` junto a las otras dos entradas del bloque Banking:

```typescript
  // Banking
  CreditCardChargeAdd:   'QB_BANKING_CC_CHARGE_ADD',
  CreditCardChargeMod:   'QB_BANKING_CC_CHARGE_MOD',
  CreditCardChargeQuery: 'QB_BANKING_CC_CHARGE_QUERY',
```

> Usar el mismo prefijo `QB_BANKING_CC_CHARGE_*` ya establecido en el commit anterior.

---

### 2 — `apps/api/src/common/config/webhooks.config.ts`

**En la interfaz `WebhooksConfig`**, agregar junto a las otras dos:

```typescript
  QB_BANKING_CC_CHARGE_ADD:    string;
```

**En el factory `webhooksConfig`**, agregar junto a las otras dos:

```typescript
    QB_BANKING_CC_CHARGE_ADD: url('/webhook/banking/credit-card-charge/add'),
```

---

### 3 — `apps/web/src/modules/settings/components/sections/integrations/qb-playground/contracts.ts`

En `QB_ACTIONS`, dentro del bloque `// Banking`, agregar la entrada de Add **antes** de Mod:

```typescript
  { id: 'CreditCardChargeAdd', label: 'Credit Card Charge — Add', category: 'Banking', operation: 'Add', type: 'CreditCardChargeAdd', object: 'CreditCardChargeAdd', version: '17.0', endpoint: 'POST /webhook/banking/credit-card-charge/add', hasContract: true, headerFields: [] },
```

**Aclaración importante:** `hasContract: true` con `headerFields: []` significa que la entrada SÍ debe existir en QB_ACTIONS — los campos del formulario se cargan dinámicamente desde LO, no desde contracts.ts. La entrada es obligatoria para que el Playground registre y muestre la operación Add.

---

## Verificación

Con la app corriendo, confirmar en el Playground:

1. La sección `Banking` muestra **3 filas**: `Credit Card Charge — Add`, `Credit Card Charge — Update`, `Credit Card Charge — Query`
2. Al seleccionar `Credit Card Charge — Add`, el formulario carga los campos dinámicos desde LO (no campos vacíos ni error)
3. Mod y Query siguen funcionando igual que en el commit anterior

---

## Acción requerida

1. Aplicar los 3 cambios
2. Hacer commit en la rama activa
3. Confirmar a FL: `PROMPT-RIQ-038 completado. Commit {hash}`

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-14 | Emisión | CreditCardChargeAdd faltante — nota ambigua en RIQ-037 causó que Add no fuera implementado |
| 2026-04-14 | Cierre | Falsa alarma — RIQ sí implementó Add en RIQ-037. La tabla de resumen de RIQ no lo listó pero está visible en el Playground. |
