# SyncBridge — Template de notificación de release

> Copiar EXACTAMENTE esta estructura. Reemplazar solo los valores entre `{}`. No cambiar separadores, no usar markdown headers, no usar tablas sin links.

---

## ASUNTO

```
[LedgerOps] ✅ {Entidad} — Add · Mod · Query lista para testing (TEST · RUS · REC · RBR · RMX)
```

---

## CUERPO — copiar exactamente, reemplazar {} únicamente

```
Buen día @Celia Giraldo Paez,

La integración de {Entidad} ({descripcion en español, ej: proveedores}) ya está disponible en LedgerOps.
A partir de hoy es posible {acción, ej: crear, consultar, modificar y desactivar proveedores}
en QuickBooks Desktop desde cualquier sistema externo, sin acceso directo a QB.

────────────────────────────────────────
Sedes verificadas y listas para usar
────────────────────────────────────────

  • TEST
  • RUS  (Redsis US)
  • REC  (Redsis Ecuador)
  • RBR  (Redsis Brasil)
  • RMX  (Redsis México)

────────────────────────────────────────
Documentación
────────────────────────────────────────

| Rol           | Enlace |
|---|---|
| Inicio rápido | [Ver guía](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/quickstart/{Entidad}.md) |
| Ejecutivo     | [Ver resumen](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/executive/{Entidad}.md) |
| Desarrollador | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/developer/{Entidad}.md) |
| Arquitecto    | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/architect/{Entidad}.md) |
| QA            | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/qa/{Entidad}.md) |
| Soporte       | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/support/{Entidad}.md) |

────────────────────────────────────────

Quedamos atentos ante cualquier consulta.
```

---

## EJEMPLO REAL — Vendor (referencia)

**ASUNTO:**
```
[LedgerOps] ✅ Vendor — Add · Mod · Query lista para testing (TEST · RUS · REC · RBR · RMX)
```

**CUERPO:**
```
Buen día @Celia Giraldo Paez,

La integración de Vendor (proveedores) ya está disponible en LedgerOps.
A partir de hoy es posible crear, consultar, modificar y desactivar proveedores
en QuickBooks Desktop desde cualquier sistema externo, sin acceso directo a QB.

────────────────────────────────────────
Sedes verificadas y listas para usar
────────────────────────────────────────

  • TEST
  • RUS  (Redsis US)
  • REC  (Redsis Ecuador)
  • RBR  (Redsis Brasil)
  • RMX  (Redsis México)

────────────────────────────────────────
Documentación
────────────────────────────────────────

| Rol           | Enlace |
|---|---|
| Inicio rápido | [Ver guía](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/quickstart/Vendor.md) |
| Ejecutivo     | [Ver resumen](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/executive/Vendor.md) |
| Desarrollador | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/developer/Vendor.md) |
| Arquitecto    | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/architect/Vendor.md) |
| QA            | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/qa/Vendor.md) |
| Soporte       | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/support/Vendor.md) |

────────────────────────────────────────

Quedamos atentos ante cualquier consulta.
```

---

## REGLAS — nunca violar

1. Entregar siempre ASUNTO + CUERPO completos, listos para copiar y pegar
2. Los links de la tabla SIEMPRE con formato `[texto](URL)` — nunca URL sola, nunca solo texto
3. Los separadores `────` se copian exactamente — no reemplazar con `---` ni `###`
4. No agregar preguntas, comentarios ni texto después de "Quedamos atentos ante cualquier consulta."
5. El correo lo envía el usuario — el agente solo entrega el texto
