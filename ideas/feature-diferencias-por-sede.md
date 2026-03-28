# Feature — Diferencias de contrato por sede

**Fecha:** 2026-03-28
**Estado:** ⏳ pendiente de análisis y diseño
**Prioridad:** alta — afecta todas las entidades entregadas y las futuras

---

## Problema identificado

Actualmente se entrega un solo contrato por entidad indicando que aplica para todas las sedes. Sin embargo existen diferencias reales entre sedes que no se documentan ni se comunican al desarrollador:

### Nivel 1 — Schema (estructural)
- TEST · RUS · REC · RBR usan QB Desktop 2024 → QBXML **v17.0**
- RMX usa QB Desktop 2021 → QBXML **v13.0**
- Algunos campos disponibles en v17.0 no existen en v13.0 — el contrato varía

### Nivel 2 — Business rules (operativo)
- P2 registra reglas por sede individualmente en LedgerBridge
- Un campo puede ser requerido en RMX y opcional en TEST (ej. ExchangeRate)
- Esto no se refleja en ningún documento entregado al desarrollador

### Relación con PROMPT-006
- `requiredBySede` en GenerateContract debería mostrar esto automáticamente
- Está reportado como bug pendiente — devuelve vacío aunque las reglas estén registradas
- Mientras no se resuelva, la información existe en LedgerBridge pero no sale al contrato

---

## Impacto

- El desarrollador que consume la API no sabe que en RMX el payload puede ser diferente
- Riesgo de errores en producción al usar un contrato de v17.0 en sede RMX
- Las 13 entidades ya entregadas tienen este gap en su documentación

---

## Preguntas a resolver

1. ¿Cómo se comunican las diferencias por sede en el contrato y en la documentación?
2. ¿Se agrega una sección "Diferencias por sede" en el developer doc?
3. ¿Se agrega un paso en el flujo P1–P5 para verificar y documentar explícitamente las diferencias?
4. ¿Se prioriza la resolución de PROMPT-006 para que GenerateContract las muestre automáticamente?
5. ¿Se retroalimenta la documentación de las 13 entidades ya entregadas?

---

## Opciones preliminares

**Opción A — Documentar manualmente en el developer doc**
Agregar tabla "Diferencias por sede" en cada doc de desarrollador mostrando qué campos varían.
- Pro: funciona aunque PROMPT-006 no esté resuelto
- Contra: trabajo manual en 13 entidades ya entregadas + todas las futuras

**Opción B — Esperar resolución de PROMPT-006**
Cuando GenerateContract devuelva `requiredBySede` correctamente, el contrato ya muestra las diferencias.
- Pro: automático, no requiere trabajo manual
- Contra: PROMPT-006 lleva tiempo pendiente sin fecha

**Opción C — Híbrido**
Agregar paso en el flujo P2 para comparar reglas entre sedes y documentar diferencias explícitamente. Al mismo tiempo escalar PROMPT-006.
- Pro: cubre el gap hoy y se automatiza cuando PROMPT-006 se resuelva

---

## Decisión pendiente

Definir qué opción adoptar y en qué momento del flujo se verifica + documenta.
