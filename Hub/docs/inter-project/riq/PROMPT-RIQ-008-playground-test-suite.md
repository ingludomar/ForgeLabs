# PROMPT-RIQ-008 — QB Playground · Test Suite + Guía manual

**Fecha:** 2026-03-31
**Tipo:** testing
**Estado:** ✅ solved

## PROMPTs relacionados

- [PROMPT-RIQ-001](PROMPT-RIQ-001-qb-playground-integration.md) — integración base que los tests ejercitan de punta a punta

---

## Objetivo

Dos entregables para verificar el QB Playground de forma completa:

1. **Guía manual copy-paste** — comandos listos para ejecutar desde terminal, sin abrir el browser
2. **Test suite E2E** — un test por cada TC, ejecutable individualmente, con resultado pass/fail

---

## Entregable 1 — Guía manual (curl)

Proveer un archivo `docs/qb-playground-manual-test.sh` (o similar) con los 15 TCs como comandos `curl` listos para copiar y pegar.

Formato por cada TC:

```bash
# TC-CON-04 — VendorQuery
curl -s -X POST http://localhost:{PORT}/api/integration/qb-playground \
  -H "Content-Type: application/json" \
  -d '{
    "type": "VendorQuery",
    "sede": "TEST",
    "data": { "ListID": "800001F1-1597178964" }
  }' | jq '.data'
```

Criterio de éxito para cada TC — igual que la tabla de PROMPT-RIQ-004.

---

## Entregable 2 — Test suite E2E

### Estructura

Un archivo por grupo de entidades, con un `describe` por TC:

```
test/e2e/qb-playground/
  inventory.e2e-spec.ts     → TC-INV-01, TC-INV-02, TC-INV-03
  contacts.e2e-spec.ts      → TC-CON-01, TC-CON-02, TC-CON-03, TC-CON-04
  sales.e2e-spec.ts         → TC-SAL-01, TC-SAL-02, TC-SAL-03
  purchasing.e2e-spec.ts    → TC-PUR-01, TC-PUR-02, TC-PUR-03, TC-PUR-04
  banking.e2e-spec.ts       → TC-BNK-01
```

### Patrón por test

```typescript
describe('TC-CON-04 — VendorQuery', () => {
  it('retorna VendorRet con ListID = 800001F1-1597178964', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/integration/qb-playground')
      .send({
        type: 'VendorQuery',
        sede: 'TEST',
        data: { ListID: '800001F1-1597178964' }
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });
});
```

### Payloads por TC

Usar exactamente los payloads validados en PROMPT-RIQ-004 (los que dieron 15/15 ✅).

Para los TCs de tipo Add (TC-INV-01, TC-CON-01, TC-CON-03, TC-SAL-01, TC-SAL-03, TC-PUR-01, TC-PUR-03, TC-BNK-01): usar nombres únicos con timestamp para evitar duplicados en QB Desktop — por ejemplo `RDX-VENDOR-${Date.now()}`.

### Ejecución individual

Cada archivo debe poder correrse de forma independiente:

```bash
npx jest test/e2e/qb-playground/contacts.e2e-spec.ts --testNamePattern="TC-CON-04"
```

---

## Notas

- Los tests son E2E — requieren que la API esté levantada y que QB Desktop esté disponible en sede TEST
- Los tests de tipo Query son idempotentes — se pueden correr N veces sin efecto
- Los tests de tipo Add crean registros reales en QB Desktop TEST — es esperado
- Los tests de tipo Mod dependen de que exista el ListID/TxnID de referencia — incluir en el setup del describe

---

## Verificación

Confirmar a SyncBridge:
1. Archivo curl con los 15 TCs listo
2. Test suite con los 5 archivos e2e creados
3. Resultado de `npx jest test/e2e/qb-playground/` — tabla con pass/fail por TC

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-31 | Emisión | PROMPT emitido a RIQ — guía manual curl + test suite E2E para los 15 TCs del QB Playground |
| 2026-03-31 | Resolución | Guía curl y 5 archivos e2e creados; suite completa ejecutable por TC |
