# SyncBridge — Template de notificación de release

> Usar este template cada vez que se completa P5 de una entidad.
> Rellenar los `{placeholders}` y entregar al usuario para envío manual.

---

## Asunto

```
[LedgerOps] ✅ {Entidad} — {Op1} · {Op2} · {Op3} lista para testing ({SEDE1} · {SEDE2} · ...)
```

**Ejemplo:**
```
[LedgerOps] ✅ Vendor — Add · Mod · Query lista para testing (TEST · RUS · REC · RBR · RMX)
```

---

## Cuerpo

```
Buen día @Celia Giraldo Paez,

La integración de {Entidad} ({descripcion_negocio}) ya está disponible en LedgerOps.
A partir de hoy es posible {accion_negocio} en QuickBooks Desktop desde cualquier sistema
externo, sin acceso directo a QB.

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

## Placeholders

| Placeholder | Qué poner |
|---|---|
| `{Entidad}` | Nombre de la entidad tal como aparece en los docs (ej: `Vendor`, `Customer`, `ItemInventory`) |
| `{Op1} · {Op2} · {Op3}` | Operaciones entregadas (ej: `Add · Mod · Query`) |
| `{SEDE1} · {SEDE2}` | Sedes verificadas (ej: `TEST · RUS · REC · RBR · RMX`) |
| `{descripcion_negocio}` | Nombre legible en español (ej: `proveedores`, `clientes`, `artículos de inventario`) |
| `{accion_negocio}` | Verbo de negocio (ej: `crear, consultar, modificar y desactivar proveedores`) |

---

## Reglas

- El correo lo envía el usuario manualmente — el agente solo entrega el texto listo
- Siempre incluir asunto + cuerpo completo
- No agregar preguntas ni texto adicional después del cuerpo
- Confirmar con el usuario cuando el correo haya sido enviado para cerrar P5
