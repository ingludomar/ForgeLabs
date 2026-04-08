# LedgerGateway

**Propósito:** Convierte QuickBooks Desktop en un ERP moderno con APIs abiertas. Permite a cualquier sistema externo realizar operaciones en QB Desktop (crear, modificar, consultar) sin acceso directo al software.

**Producto vendible:** cualquier empresa con QB Desktop puede conectar sus sistemas internos a través de LedgerGateway sin modificar ni reemplazar QB.

---

## Proyectos

| Proyecto | Rol | Estado | Repo local |
|---|---|---|---|
| **LedgerOps** | Capa de aplicación N8N. Expone webhooks, valida, aplica reglas de negocio, delega a LedgerExec. | ✅ Producción | `/Users/luisdominguez/Documents/GitHub/LedgerOps` |
| **LedgerExec** | Orquestador N8N genérico. Recibe de LedgerOps, invoca LedgerBridge vía SSH. Sin lógica de negocio. | ✅ Producción | — |
| **LedgerBridge** | Fuente de verdad. Construye QBXML, valida schemas, aplica business rules, parsea respuestas QB. | ✅ Producción | `/opt/LedgerBridge` |
| **LedgerCore** | Evolución de LedgerBridge como producto multi-empresa con PostgreSQL. En desarrollo. | 🔧 Fase 1 completada | `/Users/luisdominguez/Documents/GitHub/LedgerCore` |
| **qbxmlIntegrator** | Interfaz COM Windows. Recibe QBXML de LedgerBridge, lo ejecuta en QB Desktop vía win32com. | ✅ Producción | `/Users/luisdominguez/Documents/GitHub/qbxmlIntegrator` |

---

## Flujo de operación

```
Sistema externo
    ↓ POST /webhook/{module}/{entity}/{op}
    ↓ body: { type, sede, data }
[LedgerOps]
    - Valida type, sede y data
    - Aplica reglas de negocio de la organización
    - Delega a LedgerExec
    ↓
[LedgerExec]
    - Orquesta el flujo genérico
    - Invoca LedgerBridge vía SSH
    ↓ SSH (JSON)
[LedgerBridge]
    - Valida schema QBXML
    - Aplica business rules por sede
    - Construye el XML completo
    - Invoca qbxmlIntegrator vía HTTP
    ↓ HTTP :{sede-ip}:8600
[qbxmlIntegrator]
    - Ejecuta el QBXML en QB Desktop vía win32com
    - Devuelve la respuesta XML parseada
    ↑ respuesta sube por la cadena hasta el sistema externo
```

---

## Sedes activas

| Sede | QB Desktop | QBXML | Estado |
|---|---|---|---|
| TEST | 2024 | 17.0 | ✅ Pruebas |
| RUS | 2024 | 17.0 | ✅ Producción |
| REC | 2024 | 17.0 | ✅ Producción |
| RBR | 2024 | 17.0 | ✅ Producción |
| RMX | 2021 | 13.0 | ✅ Producción — LB remapea v13.0 |
| TSI | — | — | ⏳ Pendiente |
| RRC | — | — | ⏳ Pendiente |

---

## Entidades entregadas

Ver [`roadmap/`](../roadmap/) para el estado completo.

---

## Arquitectura detallada

Ver [`ecosystem/`](../ecosystem/) para decisiones técnicas, convenciones y componentes en profundidad.
