# CoproTech — Investigación ERPNext

> Fuente: conocimiento base agosto 2025 · ERPNext v15/v16 + ecosistema Frappe

---

## Módulos relevantes vs. necesidades del nicho

| Necesidad | Módulo ERPNext | Cobertura | Notas |
|---|---|---|---|
| Gestión de propietarios y unidades | CRM + Customer + Property (v15+) | Parcial | No hay DocType "Unidad" nativo — se modela con Customer + Site Address |
| Cobro de cuotas de administración | Accounts Receivable + Subscription | Alta | Subscription permite cuotas periódicas automáticas por propietario |
| Contabilidad básica | Accounting (GL, AP, AR, Cash Flow) | Alta | Contabilidad doble entrada completa, multimoneda |
| Comunicación con propietarios | Notification + Email / WhatsApp | Media | Nativo vía plantillas de correo · WhatsApp requiere integración externa |
| Gestión de proveedores y contratos | Purchase + Supplier + Contracts | Alta | Purchase Order, contratos con fechas de vigencia, evaluación de proveedor |
| Control de visitantes / portería | Sin módulo nativo | Nula | Requiere app custom o integración externa |

---

## Apps de comunidad para condominios / HOA

No existe app oficial en el Frappe Marketplace específica para condominios con mantenimiento activo. Lo relevante:

- **Frappe Property Management** — app comunitaria en GitHub, no oficial. Cubre: unidades, arrendatarios, contratos de arrendamiento, cobros. Orientada a renta, no a administración de conjuntos.
- **HRMS + Maintenance Module** — workaround para registrar mantenimiento de áreas comunes.

**Conclusión:** ERPNext no tiene una solución lista para condominios. Requeriría customización con Frappe Framework (Python + Vue). Estimado: 2-4 semanas de desarrollo inicial.

**Oportunidad:** Esta brecha es precisamente el valor diferencial de CoproTech — nosotros hacemos la customización y la entregamos como producto.

---

## Infraestructura mínima para producción

Para 1-3 condominios con 50-200 unidades cada uno:

| Componente | Mínimo | Cómodo |
|---|---|---|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB |
| Disco | 40 GB SSD | 80 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |
| Stack | Frappe Bench + MariaDB 10.6 + Redis + Nginx | igual |

- Bench (instalador oficial) maneja todo el stack automáticamente
- Para 3 condominios con ~600 unidades totales: 4 GB RAM suficiente sin cargas concurrentes altas
- Backups: S3 o Rclone — configurar desde el primer día

---

## Versión actual

| Item | Detalle |
|---|---|
| Versión estable actual | **ERPNext v16** (`v16.13.3`) |
| Versión LTS anterior | v15 — aún con soporte activo |
| Frappe Cloud | `frappecloud.com` — hosting gestionado oficial · desde ~$50 USD/mes por sitio · backups, SSL, actualizaciones incluidos |
| Recomendación | v15 para estabilidad máxima · v16 si se quiere lo más reciente |

---

## Veredicto

ERPNext cubre bien: contabilidad, proveedores, cobros recurrentes.

**Gap crítico:** falta modelo nativo de "unidad residencial" y control de portería — ambos requieren desarrollo custom sobre Frappe.

**Para CoproTech:** ERPNext es la base sólida correcta. La customización es nuestro producto — no un problema.

---

## Gaps identificados → oportunidades de automatización

| Gap | Solución CoproTech |
|---|---|
| No hay DocType "Unidad" nativo | Crear DocType custom: Unidad (torre, piso, número, propietario, área) |
| Comunicación WhatsApp | Integración con WhatsApp Business API para notificaciones de cobro |
| Control de portería | App custom o integración con sistema de acceso (futuro) |
| Reportes para asambleas | Templates de reportes financieros y de gestión para presentar a propietarios |
