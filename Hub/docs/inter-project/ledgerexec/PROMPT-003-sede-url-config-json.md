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

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-09 | Emisión | PROMPT emitido — URLs hardcodeadas → sub-workflow `[Config] Sede Routes` |
| 2026-04-09 | Corrección | Solución actualizada de archivo JSON en disco a sub-workflow N8N nativo |
