# PROMPT-002 — BarCode Schema Interpretation Rule

| Campo | Valor |
|---|---|
| **Proyecto** | LedgerBridge |
| **Tipo** | improvement |
| **Entidad** | ItemNonInventoryAdd (posiblemente otros tipos QBXML) |
| **Detectado** | 2026-03-17 — P4 ItemNonInventoryAdd en sede TEST |
| **Estado** | ✅ solved — 2026-03-17 |
| **Monday** | `[HALLAZGO] 11526269541` · `[FIX] 11526261311` · `[DOC] 11526286103` |
| **Índice** | [← Volver al índice maestro](../README.md) |

## PROMPTs relacionados

- [PROMPT-001](PROMPT-001-xml-field-ordering.md) — mismo tipo XML (ItemInventory/ItemNonInventory), campo BarCode también presente en el schema afectado por PROMPT-001

---

## Hallazgo

Durante P4 de ItemNonInventoryAdd en sede TEST, LedgerBridge devolvía error
de validación porque marcaba `BarCode` como `requiredByIntuit`. Al intentar
enviar el payload sin `BarCode`, la validación lo rechazaba antes de llegar
a QuickBooks.

---

## Análisis del QBXML SDK spec

El spec para `ItemNonInventoryAdd` contiene:

```xml
<BarCode>  <!-- required -->
  <BarCodeValue >  <!-- optional -->
  STRTYPE
  </BarCodeValue>
  <AssignEvenIfUsed >  <!-- optional -->
  BOOLTYPE
  </AssignEvenIfUsed>
  <AllowOverride >  <!-- optional -->
  BOOLTYPE
  </AllowOverride>
</BarCode>
```

- El contenedor `<BarCode>` está marcado `<!-- required -->`
- Todos sus hijos (`BarCodeValue`, `AssignEvenIfUsed`, `AllowOverride`) son `<!-- optional -->`

---

## Prueba directa confirmada

Se llamó a qbxmlIntegrator con un payload de ItemNonInventoryAdd **sin incluir
`<BarCode>`**. QuickBooks Desktop respondió:

```json
{
  "statusCode": "0",
  "statusSeverity": "Info",
  "statusMessage": "Status OK"
}
```

**Conclusión:** QB Desktop acepta ItemNonInventoryAdd sin `BarCode`. El elemento
**no** es realmente requerido en tiempo de ejecución — el spec es ambiguo.

---

## Interpretación correcta del spec

Cuando el QBXML SDK marca un elemento contenedor como `required` pero TODOS
sus hijos son `optional`, el significado es:

> "Si envías este contenedor, debes incluir al menos un hijo válido —
> pero el contenedor en sí puede omitirse completamente."

QB Desktop **no** lo valida como requerido. La interpretación de LedgerBridge
es incorrecta para este caso específico.

---

## Regla solicitada a LedgerBridge

> Si un elemento está marcado `required` pero TODOS sus hijos directos son
> `optional` (ninguno es `required`), entonces ese elemento debe clasificarse
> como `optional` en `requiredByIntuit`, NO como `required`.

**Nota:** Esto NO es un bug — es un hallazgo de interpretación del spec QBXML.
Debe documentarse como regla de interpretación en LedgerBridge, no como corrección de código defectuoso.

---

## Acción solicitada

1. Identificar dónde se determina `requiredByIntuit` en el build del schema
2. Aplicar la nueva regla: verificar si al menos UN hijo directo es `required` — si ninguno lo es, clasificar el padre como `optional`
3. Actualizar el schema de `ItemNonInventoryAdd` para que `BarCode` no aparezca en `requiredByIntuit`
4. Verificar si hay otros tipos QBXML con el mismo patrón y aplicar la corrección
5. Documentar como regla de interpretación del spec en el repo de LedgerBridge

---

## Reporte de salida solicitado

```
ESTADO: [Completado / Parcial / Bloqueado]

COMMITS:
- [hash corto] [mensaje del commit]

ARCHIVOS MODIFICADOS:
- [path relativo] — [descripción del cambio]

DOCUMENTO CREADO:
- Path: [path relativo al repo]
- Título: [título]

OTROS TIPOS QBXML AFECTADOS:
- [tipo] → [elemento] (o "ninguno")

VERIFICACIÓN:
- ¿BarCode ya no aparece en requiredByIntuit de ItemNonInventoryAdd? [Sí/No]
- ¿Se corrieron pruebas de regresión? [Sí/No — resultado]
- ¿Bloqueante pendiente? [descripción o "ninguno"]
```

---

## Resolución

**Fecha:** 2026-03-17
**Alcance real:** 41 tipos QBXML afectados (12 con BarCode + 29 con contenedores `*Ref` y otros). De 243 tipos en servidor: 41 actualizados, 202 sin cambios, 0 fallos.

### Commits

| Hash | Descripción |
|---|---|
| `0d6f1b7` | fix(source-xml): mark BarCode as optional in ItemInventoryAdd v17.0 |
| `0ab0c89` | fix(describe): drop all-optional-children containers from requiredCorePaths |
| `7f9a829` | feat(regen): add lb-describe-regen-all.sh + N8N workflow |

### Archivos modificados
- `bin/lb-describe-from-source-xml.py` — nueva regla de filtrado post-procesamiento
- `source-xml/ItemInventoryAdd/v17.0/ItemInventoryAddRq.xml` — BarCode marcado optional
- `describe/ItemInventoryAdd/v17.0/describe.json` — regenerado

### Archivos creados
- `docs/spec-interpretation/required-container-all-optional-children.md` — regla documentada con evidencia empírica y lista de los 42 tipos afectados
- `bin/lb-describe-regen-all.sh` — tool de deploy + regeneración masiva
- `n8n/admin/LedgerBridge-DescribeRegenAll.workflow.json` — workflow N8N para regeneración

### Verificación
- `ItemNonInventoryAdd` requiredCorePaths: solo `Name` ✅ (BarCode eliminado)
- LB-XML-BUILD construye XML sin `<BarCode>` → `LB-XML-BUILD-OK` ✅
- 243 tipos procesados: 41 actualizados, 202 sin cambios, 0 fallos ✅

### Nota
La corrección se aplicó de forma masiva a todos los tipos afectados por el mismo patrón — no solo a `ItemNonInventoryAdd`. Esto convierte el hallazgo en una mejora sistémica del motor de LedgerBridge.

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-03-17 | Emisión | PROMPT emitido a LedgerBridge — BarCode marcado incorrectamente como `requiredByIntuit` en ItemNonInventoryAdd |
| 2026-03-17 | Resolución | Nueva regla aplicada a 41 tipos QBXML: contenedor con todos los hijos opcionales clasifica como opcional — [ver resolución](#resolución) |
