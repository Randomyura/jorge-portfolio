# Publicar el portafolio en GitHub Pages

Repositorio previsto: https://github.com/Randomyura/jorge-portfolio

## Primera publicación

1. Subir el contenido de esta carpeta a la raíz del repositorio, incluyendo `.github/workflows/pages.yml`, `src`, `public`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `tsconfig.json`, `vite.config.ts` e `index.html`.
2. En GitHub, abrir **Settings → Pages** y elegir **GitHub Actions** como Source.
3. En **Actions → Publicar portafolio**, ejecutar **Run workflow** sobre `main` si la primera ejecución ocurrió antes de activar Pages.
4. Esperar a que la publicación termine correctamente. El enlace confirmado aparecerá en Pages y en la ejecución.

La dirección prevista es https://randomyura.github.io/jorge-portfolio/; solo estará disponible tras publicar correctamente.

## Actualizaciones

Cada subida de cambios a `main` comprueba TypeScript, compila la web y publica una versión nueva. Las rutas de los recursos son relativas para funcionar bajo el nombre del repositorio.

No subir `node_modules`, `dist`, archivos `.env` ni los ZIP de publicación. `.gitignore` ya los excluye.

## Probar en el ordenador

Abrir `ABRIR-DEMO.cmd`, o ejecutar `npm run dev` con las dependencias instaladas.

## Contenido de la demo

La web incluye cuatro pantallas, navegación con piezas y scroll, archivo de proyectos, laboratorio, ES/EN, modos claro/oscuro y efectos de movimiento reducido. Los proyectos siguen siendo espacios provisionales. El contacto abre un borrador en la aplicación de correo del visitante.
