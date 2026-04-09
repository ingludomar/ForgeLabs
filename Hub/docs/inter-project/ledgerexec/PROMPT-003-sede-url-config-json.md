# PROMPT-003 — Configuración de URLs de sedes · Sub-workflow de configuración

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-04-09 |
| **Proyecto destino** | LedgerExec |
| **Tipo** | improvement |
| **Estado** | ⏳ pending |

---

## Contexto

Las URLs de `qbxmlIntegrator` por sede están hardcodeadas en el código JavaScript del nodo "Code — Resolve Sede to qbxml Target" dentro del workflow de LedgerExec:

```javascript
const sedeRoutes = {
  TEST: "http://192.168.0.27:8600/qbxml", // ← desactualizada, nueva IP: 192.168.0.51
  RUS:  "http://192.168.0.74:8600/qbxml",
  REC:  "http://192.168.0.66:8600/qbxml",
  RBR:  "http://192.168.3.205:8600/qbxml",
  RMX:  "http://192.168.4.216:8600/qbxml"
};
```

**Problema:** Cuando una VM cambia de IP hay que entrar al workflow y modificar el código manualmente. Frágil, no trazable.

**Caso concreto:** La VM de TEST cambió de IP tras un reinicio. IP anterior `192.168.0.27` quedó inválida. Nueva IP: `192.168.0.51`.

---

## Solución — Sub-workflow de configuración

Crear un workflow dedicado `[Config] Sede Routes` que centraliza el mapa de URLs. LedgerExec lo invoca como sub-workflow antes de resolver la sede.

**Ventajas:**
- 100% dentro de N8N — sin disco, sin variables de entorno, sin reinicio
- Cambio de IP → editar solo `[Config] Sede Routes`, LedgerExec no se toca
- Cuando LedgerCore esté listo, este sub-workflow se reemplaza por una llamada a la BD

---

## Acción requerida

### Paso 1 — Crear workflow `[Config] Sede Routes`

Workflow con un único nodo de código que devuelve el mapa de URLs actualizado:

```javascript
return [{
  json: {
    TEST: "http://192.168.0.51:8600/qbxml",
    RUS:  "http://192.168.0.74:8600/qbxml",
    REC:  "http://192.168.0.66:8600/qbxml",
    RBR:  "http://192.168.3.205:8600/qbxml",
    RMX:  "http://192.168.4.216:8600/qbxml"
  }
}];
```

### Paso 2 — Modificar el nodo "Code — Resolve Sede to qbxml Target" en LedgerExec

Reemplazar el objeto hardcodeado por una llamada al sub-workflow y resolución de la URL:

```javascript
const sede = $input.first().json.sede;
const sedes = $input.first().json.sedeRoutes; // viene del sub-workflow

const url = sedes[sede];

if (!url) {
  throw new Error(`Sede no configurada: ${sede}`);
}

return [{ json: { ...($input.first().json), targetUrl: url } }];
```

### Paso 3 — Verificar

Ejecutar un InvoiceQuery a TEST con la nueva IP (`192.168.0.51`) y confirmar respuesta correcta.

### Paso 4 — Documentar

Incluir en `docs/integration/architect/` cómo actualizar el sub-workflow cuando una VM cambie de IP.

---

## Referencia

- IP anterior de TEST: `192.168.0.27` (inválida tras reinicio)
- IP actual de TEST: `192.168.0.51` → `http://192.168.0.51:8600/qbxml`
- Workflow afectado: `LedgerExec.workflow.json` — nodo "Code — Resolve Sede to qbxml Target"

---

## Respuesta esperada

Reportar a ForgeLabs Hub:

1. ID/nombre del sub-workflow `[Config] Sede Routes` creado en N8N
2. Confirmación de que LedgerExec fue actualizado para invocar el sub-workflow
3. Resultado del InvoiceQuery a TEST con la nueva IP
4. Commit con los cambios

---

## Reporte recibido — 2026-04-09 · commit `31f433a`

### Sub-workflow creado
- **Nombre:** `[Config] Sede Routes`
- **N8N ID:** `KY2WAU9GZlzXnOBf`
- **Archivo:** `[Config] Sede Routes.workflow.json`
- **Estado:** activo en N8N

### LedgerExec actualizado
- **N8N ID:** `GizrbIGXcdtXPyUJ` (activo)
- Nodo `Execute — Config Sede Routes` insertado entre `Code — Fix XML` y `Code — Resolve Sede Target`
- `Code — Resolve Sede Target` reescrito: lee el output del sub-workflow en lugar del objeto hardcodeado

**Flujo resultante:**
```
Code — Fix XML
  → Execute — Config Sede Routes   ← obtiene mapa de URLs
  → Code — Resolve Sede Target     ← resuelve sede contra el mapa
  → IF — Sede Known → qbxmlIntegrator — POST
```

### Nota técnica
Se corrigió `cleanPayloadForUpdate` en `mcp-n8n/index.js` para excluir el campo `description` del payload PUT — la API de N8N lo rechazaba como "additional property" en la versión actual del servidor.

### Verificación — diagnóstico completo

**QB Desktop:** OK — XML directo a `http://192.168.0.51:8600/qbxml` devuelve `statusCode="0"` con datos reales.

**Error en flujo completo:** Todas las entidades fallan — Invoice, Customer, y otras ya verificadas anteriormente. Esto confirma que el problema es **global y ocurrió con el PROMPT-003**, no es específico de Invoice ni de LedgerBridge.

**XML malformado que llega a qbxmlIntegrator:**
```xml
<InvoiceQueryRq>
  <InvoiceQuery>        ← tag extra incorrecto — no debe existir
    <MaxReturned>1</MaxReturned>
  </InvoiceQuery>
</InvoiceQueryRq>
```

**XML correcto que debe llegar:**
```xml
<InvoiceQueryRq>
  <MaxReturned>1</MaxReturned>
</InvoiceQueryRq>
```

**Causa probable:** El nodo `Execute — Config Sede Routes` devuelve solo el mapa de URLs como output. Cuando `Code — Resolve Sede Target` lee `$input.first().json`, obtiene el output del sub-workflow (solo URLs) en lugar del payload original completo (`object`, `data`, `sede`, `version`, `xml`). El payload llega incompleto o mal estructurado a qbxmlIntegrator.

**Acción requerida:**

1. Ejecutar el workflow en modo test en N8N con un InvoiceQuery a TEST
2. Revisar el output de `Execute — Config Sede Routes` — confirmar si el payload original está o no en el output
3. En `Code — Resolve Sede Target`: el mapa de URLs debe mergearse con el payload original, no reemplazarlo. Ejemplo:

```javascript
// El payload original viene de $('Code — Fix XML').first().json
// El mapa de URLs viene de $input.first().json (output del sub-workflow)
const sedeRoutes = $input.first().json;
const original = $('Code — Fix XML').first().json;

const sede = original.sede;
const url = sedeRoutes[sede];

if (!url) throw new Error(`Sede no configurada: ${sede}`);

return [{ json: { ...original, targetUrl: url } }];
```

4. Verificar que el XML que llega a qbxmlIntegrator es correcto antes del POST
5. Confirmar con InvoiceQuery a TEST desde LedgerOps que devuelve datos reales

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-09 | Emisión | PROMPT emitido — URLs hardcodeadas → sub-workflow `[Config] Sede Routes` |
| 2026-04-09 | Corrección | Solución actualizada de archivo JSON en disco a sub-workflow N8N nativo |
| 2026-04-09 | Resolución parcial | Sub-workflow creado · LedgerExec actualizado · commit `31f433a` · verificación pendiente (QB Desktop) |
