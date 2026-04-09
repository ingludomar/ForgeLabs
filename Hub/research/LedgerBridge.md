# Research — LedgerBridge

Investigaciones relacionadas con la fuente de verdad del ecosistema: construcción QBXML, validación de schemas, business rules, parseo de respuestas QB.

---

## Items

| ID | Fecha | Tema | Estado | Resumen |
|---|---|---|---|---|
| RES-LB-001 | 2026-03-28 | Diferencias de contrato por sede | 💡 Idea | Los contratos no reflejan que RMX usa QBXML v13.0 ni las business rules por sede — gap en todas las entidades entregadas |

---

---

### RES-LB-001 — Diferencias de contrato por sede

**Fecha:** 2026-03-28
**Estado:** 💡 Idea

**Contexto:** Se entrega un solo contrato por entidad indicando que aplica para todas las sedes. Sin embargo existen diferencias reales que no se documentan:
- TEST · RUS · REC · RBR usan QBXML v17.0 — RMX usa v13.0 (algunos campos no existen en v13.0)
- Las business rules por sede (registradas en P2) no se reflejan en ningún documento entregado al desarrollador
- PROMPT-006: `requiredBySede` en GenerateContract devuelve vacío aunque las reglas estén registradas

**Impacto:** El desarrollador que consume la API no sabe que en RMX el payload puede ser diferente. Las 13 entidades ya entregadas tienen este gap.

**Opciones exploradas:**
- **A** — Agregar tabla "Diferencias por sede" manualmente en cada developer doc (funciona hoy, trabajo manual)
- **B** — Esperar resolución de PROMPT-006 para que GenerateContract lo muestre automáticamente
- **C** — Híbrido: agregar paso en P2 para comparar y documentar diferencias + escalar PROMPT-006

**Conclusión:** (pendiente)
→ Derivó en: _pendiente_

---

## Plantilla para nuevo item

```
### RES-LB-001 — Título del tema
**Fecha:** YYYY-MM-DD
**Estado:** 💡 Idea

**Contexto:** ¿Qué observación o problema originó esta investigación?

**Hipótesis:** ¿Qué se cree que podría funcionar o mejorar?

**Exploración:** (se completa durante la investigación)

**Conclusión:** (se completa al cerrar)
→ Derivó en: [PROMPT / Feature / Descartada — con razón]
```
