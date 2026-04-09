# Forge Labs Hub

Espacio central de trabajo de **Forge Labs** — el estudio de desarrollo formado por Luis Domínguez y Claude.

Aquí se visualizan los ecosistemas y proyectos que desarrollamos, se define la metodología, se investiga y se coordina el trabajo entre proyectos.

---

## Ecosistemas y proyectos

### LedgerGateway
> Convierte QuickBooks Desktop en un ERP moderno con APIs abiertas. Permite a cualquier sistema externo realizar operaciones en QB Desktop sin acceso directo.

```
Sistema externo
    ↓ POST /webhook/{module}/{entity}/{op}
[LedgerOps]       Capa de aplicación — webhooks, validaciones, reglas de negocio
    ↓
[LedgerExec]      Orquestador genérico — sin lógica de negocio propia
    ↓ SSH
[LedgerBridge]    Fuente de verdad — schemas QBXML, business rules, construcción XML
    ↓ HTTP
[qbxmlIntegrator] Interfaz COM — ejecuta QBXML en QB Desktop vía win32com
```

| Proyecto | Rol | Fuente de verdad |
|---|---|---|
| LedgerOps | Capa de aplicación N8N | [GitHub](https://github.com/redsis-rgh/LedgerOps) |
| LedgerExec | Orquestador N8N genérico | — |
| LedgerBridge | Fuente de verdad QBXML | `/opt/LedgerBridge` |
| qbxmlIntegrator | Interfaz COM Windows | VM por sede (repo = prototipo multiempresa) |

Ver detalle: [`LedgerGateway/architecture/components.md`](LedgerGateway/architecture/components.md)

---

### Redix
> ERP personalizado para la empresa. Plataforma de usuario en evolución continua.

| Proyecto | Descripción | Rama activa |
|---|---|---|
| RIQ | Redix-Integration-Quickbooks — integración de Redix con LedgerGateway | QB Playground |

Ver detalle: [`Redix/`](Redix/)

---

## En evolución

Proyectos en desarrollo activo, fuera del ecosistema operativo. Pueden pausarse sin afectar LedgerGateway.

| Proyecto | Estado | Descripción |
|---|---|---|
| LedgerCore | En desarrollo | Evolución de LedgerBridge como producto multi-empresa con PostgreSQL |
| qbxmlIntegrator multiempresa | Pendiente testing | Una instancia por VM atiende RUS · TSI · RRC. Cuando pase testing, las VMs individuales de TSI y RRC se eliminan. |

---

## Navegación

| Sección | Contenido |
|---|---|
| [`Hub/methodology/`](Hub/methodology/) | WF Tipo 1 · 2 · 3 — cómo trabajamos |
| [`Hub/research/`](Hub/research/) | Investigaciones por proyecto y generales |
| [`Hub/docs/inter-project/`](Hub/docs/inter-project/) | PROMPTs emitidos a cada proyecto |
| [`Hub/docs/development/`](Hub/docs/development/) | Guías técnicas y casos de prueba |
| [`Hub/roadmap/`](Hub/roadmap/) | Estado de entidades y próximos pasos |
