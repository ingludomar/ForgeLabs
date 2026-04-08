# Research — General / Transversal

Investigaciones que aplican a múltiples proyectos, ideas sobre nuevos proyectos, o temas que aún no tienen un hogar definido en el ecosistema.

---

## Items

| ID | Fecha | Tema | Estado | Resumen |
|---|---|---|---|---|
| RES-GEN-001 | 2026-04-08 | Aplicar GSD al ecosistema SyncBridge | 🔍 Investigando | Explorar cómo la filosofía GSD puede reducir overhead del WF sin sacrificar trazabilidad |

---

---

### RES-GEN-001 — Aplicar GSD (Get Shit Done) al ecosistema SyncBridge

**Fecha:** 2026-04-08
**Estado:** 🔍 Investigando

**Contexto:** El WF actual de SyncBridge (P0-P5 / F1-F8 / I1-I4) garantiza trazabilidad y calidad, pero tiene overhead real: PROMPTs de ida y vuelta entre proyectos, Monday con múltiples subitems y grupos, docs por 5 roles, confirmaciones formales antes de cada paso. La pregunta es si todo ese proceso nos hace más rápidos o más lentos en la práctica.

**Hipótesis:** La filosofía GSD — bias toward action, eliminar fricción, reducir ceremonia innecesaria — puede aplicarse a partes del WF sin comprometer la trazabilidad que sí aporta valor. El resultado sería un WF más liviano donde se automatiza lo repetitivo y se elimina lo que nadie consume.

**Áreas a explorar:**

1. **¿Qué pasos del WF son overhead puro?**
   - ¿Hay PROMPTs que podrían ser un mensaje directo en lugar de un documento?
   - ¿Los docs por 5 roles se leen todos, o algunos nunca se consultan?
   - ¿El Monday con subitems granulares da visibilidad real o es solo burocracia?

2. **¿Qué se puede automatizar para que "ya esté hecho"?**
   - Generación de docs por rol → ¿podría ser automático al cerrar un PROMPT?
   - Monday updates → ¿podría actualizarse solo con hooks o triggers?
   - Commits de SyncBridge → ¿podrían generarse sin intervención manual?

3. **¿Dónde perdemos más tiempo esperando?**
   - Confirmaciones de proyectos antes de continuar
   - N8N / infraestructura caída bloqueando todo
   - Revisiones de PROMPTs que son solo ACK (sin cambios reales)

4. **¿Qué principios GSD son directamente aplicables?**
   - *One owner per task* — cada PROMPT tiene un responsable claro, sin ambigüedad
   - *Default to action* — si no hay bloqueador real, proceder sin esperar confirmación
   - *Ship small* — ¿podemos cerrar entidades en menos pasos?
   - *Kill what doesn't add value* — auditar cada paso del WF contra: ¿quién lo usa? ¿para qué?

**Exploración:** (pendiente — recopilar datos reales del WF en las próximas semanas)

**Conclusión:** (se completa al cerrar)
→ Derivó en: _pendiente_

---

## Plantilla para nuevo item

```
### RES-GEN-001 — Título del tema
**Fecha:** YYYY-MM-DD
**Estado:** 💡 Idea

**Contexto:** ¿Qué observación o problema originó esta investigación?

**Hipótesis:** ¿Qué se cree que podría funcionar o mejorar?

**Exploración:** (se completa durante la investigación)

**Conclusión:** (se completa al cerrar)
→ Derivó en: [PROMPT / Feature / Descartada — con razón]
```
