# Estándar de PROMPTs inter-proyecto

Cuando LedgerOps detecta un hallazgo que requiere acción en otro proyecto, se emite un PROMPT formal antes de comunicarlo.

---

## Cuándo emitir un PROMPT

- Bug detectado en LedgerBridge, LedgerExec o qbxmlIntegrator
- Feature requerido en otro proyecto para desbloquear trabajo en LedgerOps
- Convención o estándar que debe adoptarse en otro proyecto
- RMX: schemas v13.0 necesarios para una entidad nueva (siempre al inicio)

---

## Estructura del archivo

**Ubicación:** `Hub/docs/inter-project/{proyecto}/PROMPT-{NNN}-{tema-corto}.md`

**Formato:**

```markdown
# PROMPT-{NNN} — {Título corto}

| Campo | Detalle |
|---|---|
| **Fecha** | YYYY-MM-DD |
| **Proyecto destino** | LedgerBridge / LedgerExec / qbxmlIntegrator |
| **Tipo** | bug / feature / improvement / convention |
| **Estado** | ⏳ pending |

---

## Contexto
{Por qué se emite — hallazgo, bloqueo, necesidad}

---

## Acción requerida
{Qué debe hacer el proyecto destino — específico y accionable}

---

## Referencia
{Evidencia técnica: errores, payloads, logs}

---

## Respuesta esperada
{Qué necesita LedgerOps para cerrar el PROMPT}
```

---

## Estados

| Símbolo | Significado |
|---|---|
| ⏳ pending | Prompt emitido — esperando respuesta |
| 🔄 in-progress | El proyecto destino está trabajando |
| ✅ solved | Resuelto y verificado |
| 🔴 blocked | Bloqueado por dependencia externa |

---

## Índice maestro

Actualizar siempre `Hub/docs/inter-project/README.md` al emitir o cerrar un PROMPT.

**Formato de la fila:**
```
| [PROMPT-{NNN}]({path}) | YYYY-MM-DD | {Proyecto} | {tipo} | {Entidad} | {Asunto} | {Estado} |
```

---

## Numeración

- LedgerBridge: PROMPT-001, PROMPT-002, ... (secuencial global)
- LedgerExec: PROMPT-001, PROMPT-002, ... (secuencial por proyecto)
- qbxmlIntegrator: PROMPT-001, PROMPT-002, ... (secuencial por proyecto)
