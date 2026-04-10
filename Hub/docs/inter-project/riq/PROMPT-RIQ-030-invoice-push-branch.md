# PROMPT-RIQ-030 — Invoice · Push rama feature/redix-integration-quickbooks-playground

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-09 |
| **Proyecto destino** | RIQ |
| **Tipo** | delivery |
| **Estado** | ✅ solved |

---

## Contexto

La rama `feature/redix-integration-quickbooks-playground` tiene 6 commits locales que no han
sido enviados al remoto. Estos commits incluyen todos los cambios de Invoice QB Playground
(PROMPT-RIQ-027, RIQ-028, RIQ-029) más ajustes previos.

```
70d32ad fix(qb-playground): filtrar IsFinanceCharge de invoiceModHeader
4699e8d fix(qb-playground): PROMPT-RIQ-029 — InvoiceMod en MOD_QUERY_MAP
65eb615 fix(docker): set NODE_ENV=production in Dockerfile and docker-compose
c88e088 fix(qb-playground): PROMPT-RIQ-028 — InvoiceMod + InvoiceQuery en contracts.ts
594501f fix(qb-playground): PROMPT-RIQ-027 — Invoice routing InvoiceMod + InvoiceQuery
```

F3 (E2E desde UI) verificado exitosamente — InvoiceQuery, InvoiceAdd y InvoiceMod desde
el Playground de Redix con sede TEST.

---

## Acción requerida

```bash
git push origin feature/redix-integration-quickbooks-playground
```

Confirmar con el hash del último commit remoto tras el push.

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-09 | Emisión | 6 commits locales pendientes de push — F5 del WF Tipo 2 Invoice QB Playground |
| 2026-04-09 | Resolución | Push completado — 5 commits enviados (594501f → 70d32ad) · último remoto `70d32ad` · repo: redix-platform-engine |
