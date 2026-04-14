# CoproTech — Documento Base

> Emprendimiento de servicios tecnológicos para propiedades horizontales (condominios / copropiedades).
> Documento vivo — se actualiza con cada sesión de trabajo.

---

## La idea

Ofrecer ERPNext + Frappe Helpdesk (opensource, gratis para el cliente) desplegado en VM cloud,
donde el ingreso de CoproTech es la **administración mensual de la VM** por cliente.
El software no se vende — se ofrece como ventaja competitiva. El servicio es el negocio.

### Modelo de negocio

| Fuente de ingreso | Tipo | Cuándo |
|---|---|---|
| Instalación + capacitación | Pago único | Al arrancar cada cliente |
| Administración mensual de VM | Recurrente · escala por cliente | Todos los meses |
| Comisiones del proveedor VM | Recurrente · por cliente activo | Según programa de partners |

### Propuesta de valor central

1. **Software gratis** — ERPNext + Frappe Helpdesk opensource, sin costo de licencia
2. **Sin inversión en hardware** — VM en la nube, pago mensual, sin servidor propio
3. **Todo administrado** — backups, actualizaciones, soporte: responsabilidad de CoproTech
4. **Ventaja financiera clara** — en 3 años la VM cuesta menos que un servidor/PC propio

### Argumento financiero para el cliente

| | Servidor / PC propio | CoproTech VM |
|---|---|---|
| Inversión inicial | $800 – $2,000 USD | $0 |
| Licencia software | $500 – $3,000 USD/año | $0 (opensource) |
| Mantenimiento | $100 – $300 USD/año | Incluido |
| En 3 años | $3,000 – $7,000+ USD | Menos que un servidor básico |

---

## Productos — hoja de ruta

| # | Producto | Base tecnológica | Estado |
|---|---|---|---|
| **1** | **CoproTech Helpdesk** | Frappe Helpdesk | Primera prioridad — dolor #1 confirmado |
| **2** | **CoproTech ERP** | ERPNext | Segundo paso — contabilidad, cobros, proveedores |
| **3** | **Automatizaciones** | N8N / Frappe custom | Se define con la observancia del cliente |

> El cliente primero adopta el Helpdesk (solución a su dolor inmediato).
> La confianza abre la puerta al ERP completo.

---

## ERP candidato

| ERP | Por qué | Estado |
|---|---|---|
| **ERPNext** | Opensource, activo, módulos contables y de gestión, comunidad grande, basado en Python (Frappe framework) | Primera opción — investigar módulos útiles para PH |

---

## Modelo de negocio

### VM cloud
- Pago mensual al cliente
- Investigar proveedor óptimo: económico, estable, escalable
- Candidatos a evaluar: Hetzner, DigitalOcean, Linode (Akamai), Vultr, Contabo

### Argumento de venta — ROI vs. servidor propio
- Un servidor/PC de escritorio para montar ERP: $800 - $2,000 USD (según país)
- Una VM básica: ~$10-20 USD/mes
- En 3 años de VM = $360-720 USD — sin mantenimiento, sin obsolescencia, con backups y escalabilidad
- El cliente ahorra en licenciamiento Y en hardware Y en mantenimiento

---

## Nicho objetivo

**Propiedades horizontales** — condominios, conjuntos residenciales, edificios de apartamentos con administración propia.

### Necesidades típicas del nicho
- Gestión de propietarios y unidades
- Cobro de cuotas de administración
- Contabilidad básica (ingresos/egresos)
- Comunicación con propietarios
- Gestión de proveedores y contratos
- Control de visitantes / portería (futuro)

---

## Hallazgos clave

### ERPNext
- Versión actual: v16 (v15 LTS con soporte activo) — ver [erpnext-investigacion.md](erpnext-investigacion.md)
- Cubre bien: contabilidad, cobros recurrentes, proveedores
- **Gap crítico:** no hay DocType "Unidad" nativo ni módulo de portería — requiere customización Frappe (2-4 semanas)
- **Esta brecha ES nuestro producto** — la customización que nadie más ha empaquetado para el nicho

### VM — Proveedor recomendado
- **Vultr** (São Paulo) — única opción con DC en Latam, precio competitivo — ver [vm-proveedores.md](vm-proveedores.md)
- **Hetzner** como alternativa si el costo es prioritario (~$8 USD/mes plan básico)
- Modelo: una VM por cliente · 2vCPU/4GB/80GB para clientes pequeños

### Programas de partners — ver [vm-partners.md](vm-partners.md)

| Ranking | Proveedor | Por qué |
|---|---|---|
| **1** | DigitalOcean Hatch | Diseñado para MSPs · 20-35% recurrente · portal multi-cliente |
| **2** | Vultr Partner | 10% mensual recurrente sin techo · DC Latam · acceso fácil |
| **3** | Linode (Akamai) | $100 por cliente nuevo · portal multi-cuenta · requiere volumen mínimo |
| **4** | Hetzner | Solo €20 único por referido — no recurrente · ideal para costos propios |
| **5** | Contabo | Sin programa de partners — descartado |

> **Arranque recomendado:** Vultr Partner (sin requisitos, 10% recurrente, DC São Paulo). Escalar a DigitalOcean Hatch cuando el volumen lo justifique.

---

## Pendiente de investigación

- [ ] Qué automatizaciones son posibles desde el primer paquete (WhatsApp, reportes, recordatorios)
- [ ] Nombre de dominio disponible: coprotech.com / coprotech.co / coprotech.io
- [ ] Precios definitivos por plan (costo VM + margen)
- [ ] Estimado de tiempo de customización inicial en Frappe

---

## Sesiones de trabajo

| Fecha | Tema | Resultado |
|---|---|---|
| 2026-04-14 | Idea inicial + nombre + estructura base | Nombre: CoproTech · Documento base creado |
| 2026-04-14 | Investigación ERPNext + VM + Brochure | ERPNext v16 confirmado · Vultr/Hetzner recomendados · Brochure 8 páginas estructurado |
| 2026-04-14 | Estrategia arranque + entrevista piloto | Modelo Luis+Claude definido · esposa contadora con clientes PH = ventaja clave · guía de entrevista lista |
| 2026-04-14 | Programas de partners VM | Ranking completo: DO Hatch #1 · Vultr Partner #2 · Contabo descartado |
