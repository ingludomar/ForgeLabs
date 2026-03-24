# Convenciones del ecosistema

## Naming — LedgerOps

| Elemento | Convención | Ejemplo |
|---|---|---|
| Archivo workflow | `LedgerOps-{EntityAction}.workflow.json` | `LedgerOps-VendorAdd.workflow.json` |
| URL webhook | `/webhook/{module}/{entity}/{op}` | `/webhook/contacts/vendor/add` |
| Verified test | `{Entity}{Op}-{Sede}.verified.json` | `VendorAdd-TEST.verified.json` |
| Docs de integración | `docs/integration/{rol}/{Entity}.md` | `docs/integration/quickstart/Vendor.md` |
| Prompt inter-proyecto | `PROMPT-{NNN}-{tema-corto}.md` | `PROMPT-012-vendor-rmx-schema.md` |

## Payload hacia LedgerExec

```json
{
  "type": "VendorAdd",
  "sede": "TEST",
  "version": "17.0",
  "object": "VendorAddRq",
  "data": {
    "VendorAddRq": {
      "VendorAdd": { ... }
    }
  }
}
```

**Regla:** `data` siempre envuelto bajo la clave del tipo + `Rq`.
- Add/Mod: `data: { [type+'Rq']: { [type]: body.data } }`
- Query: `data: { [type+'Rq']: body.data }`

## Versioning — SemVer

Todos los proyectos usan SemVer (`MAJOR.MINOR.PATCH`).

## Sede en el body
La `sede` va siempre en el body del request, nunca en la URL.

## Comunicación
- Con el equipo técnico / código: **inglés**
- Documentación / manuales: **español**
- Con el usuario (Luis): **español**

## Sedes de prueba vs producción
- `TEST` = sede de pruebas. QBD real con datos productivos. Válido para marcar features ✅.
- `REC`, `MIA`, `RUS`, `RBR`, `RMX` = producción. Solo cambiar cuando se confirme explícitamente.
