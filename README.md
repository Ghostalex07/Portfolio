# Alejandro Blanco - Cybersecurity Portfolio

Este proyecto está configurado con **GitHub Actions** para que se despliegue automáticamente.

## 🚀 Despliegue Automático (Sin Terminal)

No necesitas usar la terminal para publicar los cambios. Todo funciona de la siguiente manera:

1.  **Sincroniza tus cambios**: Cuando guardas o sincronizas tus cambios desde este editor hacia tu repositorio de GitHub en la rama `main`.
2.  **GitHub Actions se activa**: Automáticamente, GitHub detectará el cambio y ejecutará un "Workflow" (puedes verlo en la pestaña **Actions** de tu repositorio en GitHub).
3.  **Construcción y Publicación**: GitHub instalará las dependencias, compilará el proyecto y lo publicará en la rama `gh-pages` por ti.
4.  **Listo**: En un par de minutos, los cambios estarán vivos en `https://Ghostalex07.github.io/Portfolio/`.

## 🛠️ Configuración Incluida

- **Vite Config**: Configurado para la ruta `/Portfolio/`.
- **404 Fallback**: Manejo de rutas para evitar errores al recargar.
- **NoJekyll**: Asegura que GitHub no interfiera con los archivos de CSS/JS.
- **Workflow**: Ubicado en `.github/workflows/deploy.yml`.

---
*Desarrollado con enfoque en Ciberseguridad y Rendimiento.*
