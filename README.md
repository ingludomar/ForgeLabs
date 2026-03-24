# SyncBridge

SyncBridge es el timón del ecosistema. No es un componente técnico — es el espacio donde se diseña, se decide y se dirige.

Aquí vive la metodología, la arquitectura, las convenciones y el roadmap. Cuando alguien nuevo llegue a operar el ecosistema, encontrará los 4 proyectos técnicos funcionando. Este repositorio es el mapa de cómo se construyeron.

---

## El ecosistema

```
Sistema origen (CRM / portal / ERP)
    ↓ POST /webhook/{module}/{entity}/{op}
[LedgerOps]       N8N — capa de aplicación, webhooks, reglas de negocio
    ↓ POST /webhook/ledgerexec
[LedgerExec]      N8N — orquestador genérico, sin lógica de negocio propia
    ↓ SSH                          ↓ HTTP :{sede-ip}:8600
[LedgerBridge]               [qbxmlIntegrator]
Linux /opt/LedgerBridge/     Windows — FastAPI, interfaz COM
FUENTE DE VERDAD             Ejecuta el QBXML en QB Desktop
```

**4 componentes. Ninguno funciona solo.**

---

## Navegación

| Sección | Contenido |
|---|---|
| [`ecosystem/`](ecosystem/) | Arquitectura, roles de cada componente, decisiones |
| [`methodology/`](methodology/) | P1-P5, estándar de entrega, PROMPTs a proyectos |
| [`roadmap/`](roadmap/) | Estado actual y próximas entidades |
| [`ideas/`](ideas/) | Experimentos, conversaciones, propuestas |
