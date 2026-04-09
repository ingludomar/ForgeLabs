# PROMPT-003 — Configuración de URLs de sedes en archivo JSON externo

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

**Problema:** Cuando una VM cambia de IP (por reinicio, reconfiguración o nueva sede), hay que entrar al workflow en N8N y modificar el código manualmente. Esto es frágil, no trazable y requiere acceso al editor de N8N.

**Caso concreto que originó este PROMPT:** La VM de la sede TEST cambió de IP tras un reinicio del servidor. La IP hardcodeada quedó inválida y el testing de Invoice quedó bloqueado hasta que se actualizara el workflow manualmente.

---

## Solución propuesta

Mover el mapa de URLs a un archivo JSON externo en el servidor donde corre N8N. El nodo de código lee ese archivo en tiempo de ejecución en lugar de tener las URLs embebidas.

**Archivo:** `sedes.json` (ruta a definir por LedgerExec, sugerida: `/opt/ledgerexec/sedes.json`)

```json
{
  "TEST": "http://192.168.0.51:8600/qbxml",
  "RUS":  "http://192.168.0.74:8600/qbxml",
  "REC":  "http://192.168.0.66:8600/qbxml",
  "RBR":  "http://192.168.3.205:8600/qbxml",
  "RMX":  "http://192.168.4.216:8600/qbxml"
}
```

Cuando una VM cambia de IP → solo se edita el JSON. El workflow no se toca.

---

## Acción requerida

### Paso 1 — Crear `sedes.json`

Crear el archivo en el servidor con las URLs actuales de todas las sedes. Confirmar la ruta exacta donde quedará alojado.

### Paso 2 — Modificar el nodo "Code — Resolve Sede to qbxml Target"

Reemplazar el objeto hardcodeado por una lectura del archivo JSON:

```javascript
const fs = require('fs');
const sedes = JSON.parse(fs.readFileSync('/opt/ledgerexec/sedes.json', 'utf8'));

const sede = $input.first().json.sede;
const url = sedes[sede];

if (!url) {
  throw new Error(`Sede no configurada: ${sede}`);
}

return [{ json: { ...($input.first().json), targetUrl: url } }];
```

> **Nota:** Si N8N corre en un entorno que no permite `fs` directamente, usar el nodo `Read Binary File` de N8N antes del nodo de código y parsear el contenido ahí.

### Paso 3 — Verificar

Ejecutar un InvoiceQuery a TEST tras el cambio y confirmar que resuelve correctamente con la nueva IP.

### Paso 4 — Documentar la ruta del archivo

Incluir en `docs/integration/architect/` la ruta del `sedes.json` y cómo actualizarlo cuando una VM cambie de IP.

---

## Referencia

- IP actual de TEST (tras reinicio de servidor): `192.168.0.51` → URL: `http://192.168.0.51:8600/qbxml`
- Workflow afectado: `LedgerExec.workflow.json` — nodo "Code — Resolve Sede to qbxml Target"

---

## Respuesta esperada

Reportar a ForgeLabs Hub:

1. Ruta definitiva de `sedes.json` en el servidor
2. Confirmación de que el nodo fue actualizado
3. Resultado del InvoiceQuery a TEST con la nueva IP
4. Commit con los cambios

---

## Historial

| Fecha | Evento | Resumen |
|---|---|---|
| 2026-04-09 | Emisión | PROMPT emitido — URLs de sedes hardcodeadas → archivo JSON externo |
