# ADR-001 — Delete lógico vía IsActive: false

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-10 |
| **Estado** | ✅ Adoptado |
| **Aplica a** | Todas las entidades de contactos e inventario |

## Decisión

No se implementa delete físico en ninguna entidad. La "eliminación" es siempre un Mod con `IsActive: "false"`.

## Razón

QB Desktop no permite eliminar registros que tienen transacciones históricas asociadas. Forzar un delete físico provocaría errores en todos los casos reales de producción. El delete lógico es el comportamiento correcto y esperado por QB.

## Consecuencias

- El registro queda en QB pero desaparece de listas activas
- Se puede consultar por ListID aunque esté inactivo
- TC-DEL-01 siempre es un Mod con IsActive: false
- TC-DEL-02 siempre verifica el estado con Query por ListID
