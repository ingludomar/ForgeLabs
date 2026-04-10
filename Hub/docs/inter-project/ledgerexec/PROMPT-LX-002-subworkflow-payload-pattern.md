# PROMPT-LX-002 — Patrón de payload en nodos post Execute Sub-workflow

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-09 |
| **Proyecto destino** | LedgerExec |
| **Tipo** | architecture |
| **Estado** | ✅ solved |

---

## Contexto

Durante la implementación del sub-workflow `[Config] Sede Routes` (PROMPT-LX-001 / PROMPT-003), se introdujo un bug crítico: el nodo que seguía al `Execute Sub-workflow` usaba `$input.first().json` para obtener el payload original — pero ese `$input` ya no contiene el payload original, sino el output del sub-workflow.

**Comportamiento de N8N — Execute Sub-workflow:**

En N8N, cuando un nodo `Execute Sub-workflow` corre, su **output reemplaza completamente el input**. El payload original que venía del nodo anterior desaparece del contexto de `$input`.

```
Code — Fix XML  →  Execute — Config Sede Routes  →  Code — Resolve Sede Target
     payload             { url, error }                    $input = { url, error }
                                                           ← payload original perdido
```

---

## Regla

**En cualquier nodo que siga a un `Execute Sub-workflow`, nunca usar `$input` para obtener el payload original.**

Para recuperar el payload original, referenciar el nodo anterior por nombre:

```javascript
// ✗ INCORRECTO — $input es el output del sub-workflow
const payload = $input.first().json;

// ✓ CORRECTO — referenciar el nodo que tenía el payload original
const payload = $('Code — Fix XML').first().json;
```

---

## Patrón correcto — nodo post Execute Sub-workflow

```javascript
// Output del sub-workflow
const result = $('Execute — Config Sede Routes').first().json;

if (result.error) {
  throw new Error(result.error);
}

// Payload original — referenciar por nombre de nodo
const payload = $('Code — Fix XML').first().json;

// Merge: payload original + dato del sub-workflow
return [{ json: { ...payload, qbxmlTarget: result.url } }];
```

---

## Regla de aplicación

Cada vez que se agregue un `Execute Sub-workflow` en LedgerExec:

1. Identificar cuál es el nodo que tiene el payload original antes del sub-workflow
2. En el nodo siguiente al Execute, referenciar ese nodo por nombre con `$('NombreNodo')`
3. Nunca asumir que `$input` contiene el payload original después de un Execute Sub-workflow

---

## Acción requerida

Documentar esta regla en el README de arquitectura de LedgerExec o en un archivo `PATTERNS.md` para que cualquier modificación futura del flujo la respete.

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-09 | Emisión | Patrón detectado como causa raíz del bug PROMPT-003/004 — documentar para evitar recurrencia |
