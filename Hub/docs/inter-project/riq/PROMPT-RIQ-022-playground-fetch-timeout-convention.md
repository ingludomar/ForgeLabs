# PROMPT-RIQ-022 — Convención: fetch timeout obligatorio en handleSend

**Fecha:** 2026-04-07
**Tipo:** convention
**Estado:** ✅ solved
**Fecha de resolución:** 2026-04-07

## Contexto

Durante el cierre de PROMPT-RIQ-021 (SalesOrder) se detectó que el botón de ejecución del QB Playground quedaba atrapado en estado de carga cuando el backend tardaba más de lo esperado. Causa raíz: `handleSend` no tenía timeout en el `fetch` al backend.

Este mismo problema puede reaparecer en cualquier entidad futura si no se establece como convención obligatoria.

---

## Fix aplicado (2026-04-07)

```typescript
// handleSend — fetch con timeout obligatorio
const response = await fetch('/api/integration/qb-playground', {
  method: 'POST',
  signal: AbortSignal.timeout(20_000), // 20s frontend > 15s backend
  ...
});
```

Si el fetch supera 20s lanza `AbortError` → el `catch` muestra el error → el `finally` libera el botón. El backend ya tenía su propio timeout de 15s sobre LedgerOps — el frontend tiene 20s con 5s de margen.

---

## Regla persistente

> **Todo `fetch` a `/api/integration/qb-playground` en `handleSend` debe incluir `AbortSignal.timeout(20_000)`.**

### Checklist de cierre para cualquier feature del QB Playground

Antes de hacer push de cualquier feature que modifique `handleSend` o agregue un nuevo endpoint al Playground, verificar:

- [ ] `fetch` incluye `AbortSignal.timeout(20_000)`
- [ ] El bloque `catch` maneja `AbortError` con mensaje descriptivo al usuario
- [ ] El bloque `finally` libera el estado `sending` incondicionalmente
- [ ] Testing manual: simular latencia alta (ej. sede con agente lento) y verificar que el botón se libera

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-07 | Emisión y resolución | Fix ya aplicado en RIQ · convención establecida como checklist de cierre de features Playground |
| 2026-04-07 | Bug adicional | requiredOverlay de entidad anterior persistía ~3s al navegar → botón bloqueado en Add/Mod. Fix: setRequiredOverlay(new Set()) + setSending(false) en handleActionChange · commits db68f09 · c20160d |
| 2026-04-07 | Estabilización completa | 9 issues resueltos en sesión post-RIQ-021: timeout, sending SPA, overlay, contractLoading, fillFields line contamination, Mod hydration desde QB, QB objeto/array líneas, checkFields ref containers, Fill Examples SalesOrder con datos reales TEST · commits db68f09 → e9e0460 |
