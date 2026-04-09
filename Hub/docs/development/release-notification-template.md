# SyncBridge — Template de notificación de release

> Copiar EXACTAMENTE esta estructura. Reemplazar solo los valores entre `{}`. No cambiar separadores ni estructura de secciones.

---

## ASUNTO

```
[LedgerOps] ✅ {Entidad} — Add · Mod · Query lista para testing (TEST · RUS · REC · RBR · RMX)
```

---

## CUERPO — copiar exactamente, reemplazar {} únicamente

Buen día @Celia Giraldo Paez,

La integración de **{Entidad}** ({descripcion}) ya está disponible en LedgerOps.
A partir de hoy es posible {accion} en QuickBooks Desktop desde cualquier sistema externo, sin acceso directo a QB.

────────────────────────────────────────
**Sedes verificadas y listas para usar**
────────────────────────────────────────

&nbsp;&nbsp;• TEST
&nbsp;&nbsp;• RUS &nbsp;&nbsp;(Redsis US)
&nbsp;&nbsp;• REC &nbsp;&nbsp;(Redsis Ecuador)
&nbsp;&nbsp;• RBR &nbsp;&nbsp;(Redsis Brasil)
&nbsp;&nbsp;• RMX &nbsp;(Redsis México)

────────────────────────────────────────
**Inicio rápido**
────────────────────────────────────────

Para comenzar a usar la integración de inmediato, la guía de inicio rápido incluye contratos de ejemplo listos con datos reales de TEST: [Ver guía](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/quickstart/{Entidad}.md)

────────────────────────────────────────
**Para el Sr. Mike Habib**
────────────────────────────────────────

Si desea conocer el alcance de esta integración y su valor para el negocio, puede consultar el [Resumen Ejecutivo](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/executive/{Entidad}.md) donde encontrará una visión general de la entrega.

────────────────────────────────────────
**Documentación**
────────────────────────────────────────

Para quienes deseen profundizar en los detalles técnicos o de implementación, a continuación encontrarán la documentación completa organizada por rol:

| Rol | Enlace |
|---|---|
| Desarrollador | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/developer/{Entidad}.md) |
| Arquitecto | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/architect/{Entidad}.md) |
| QA | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/qa/{Entidad}.md) |
| Soporte | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/support/{Entidad}.md) |

────────────────────────────────────────

Para consultas o comentarios relacionados con esta entrega, por favor responder directamente a este correo. De esta manera mantenemos un hilo unificado que nos permite dar seguimiento oportuno a cada solicitud y conservar la trazabilidad completa de todas las comunicaciones del proyecto.

---

## EJEMPLO REAL — Vendor (referencia)

**ASUNTO:**
```
[LedgerOps] ✅ Vendor — Add · Mod · Query lista para testing (TEST · RUS · REC · RBR · RMX)
```

**CUERPO:**

Buen día @Celia Giraldo Paez,

La integración de **Vendor** (proveedores) ya está disponible en LedgerOps.
A partir de hoy es posible crear, consultar, modificar y desactivar proveedores en QuickBooks Desktop desde cualquier sistema externo, sin acceso directo a QB.

────────────────────────────────────────
**Sedes verificadas y listas para usar**
────────────────────────────────────────

&nbsp;&nbsp;• TEST
&nbsp;&nbsp;• RUS &nbsp;&nbsp;(Redsis US)
&nbsp;&nbsp;• REC &nbsp;&nbsp;(Redsis Ecuador)
&nbsp;&nbsp;• RBR &nbsp;&nbsp;(Redsis Brasil)
&nbsp;&nbsp;• RMX &nbsp;(Redsis México)

────────────────────────────────────────
**Inicio rápido**
────────────────────────────────────────

Para comenzar a usar la integración de inmediato, la guía de inicio rápido incluye contratos de ejemplo listos con datos reales de TEST: [Ver guía](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/quickstart/Vendor.md)

────────────────────────────────────────
**Para el Sr. Mike Habib**
────────────────────────────────────────

Si desea conocer el alcance de esta integración y su valor para el negocio, puede consultar el [Resumen Ejecutivo](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/executive/Vendor.md) donde encontrará una visión general de la entrega.

────────────────────────────────────────
**Documentación**
────────────────────────────────────────

Para quienes deseen profundizar en los detalles técnicos o de implementación, a continuación encontrarán la documentación completa organizada por rol:

| Rol | Enlace |
|---|---|
| Desarrollador | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/developer/Vendor.md) |
| Arquitecto | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/architect/Vendor.md) |
| QA | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/qa/Vendor.md) |
| Soporte | [Ver doc](https://github.com/redsis-rgh/LedgerOps/blob/main/docs/integration/support/Vendor.md) |

────────────────────────────────────────

Para consultas o comentarios relacionados con esta entrega, por favor responder directamente a este correo. De esta manera mantenemos un hilo unificado que nos permite dar seguimiento oportuno a cada solicitud y conservar la trazabilidad completa de todas las comunicaciones del proyecto.

---

## REGLAS — nunca violar

1. Entregar siempre ASUNTO + CUERPO completos, listos para copiar y pegar
2. Los links SIEMPRE con formato `[texto](URL)` — nunca URL sola, nunca solo texto
3. Los separadores `────` se copian exactamente — no reemplazar con `---` ni `###`
4. Los títulos de sección van en **negrita**
5. El orden de secciones es fijo: Sedes → Inicio rápido → Mike Habib → Documentación → Trazabilidad
6. La sección Documentación siempre incluye el párrafo introductorio antes de la tabla
7. El correo lo envía el usuario — el agente solo entrega el texto
