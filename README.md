# To-Do List App (Ionic + Angular)

Aplicación híbrida de tareas desarrollada con Ionic 8 y Angular 20 (standalone).

## Objetivo

Gestionar tareas y categorías en una sola pantalla de Home, con persistencia local.

## Stack actual del proyecto

- Ionic 8
- Angular 20 (standalone components)
- TypeScript
- SCSS
- LocalStorage (persistencia)
- Configuración híbrida mixta en repositorio:
	- Cordova (plataformas y plugins en el proyecto)
	- Capacitor (archivo `capacitor.config.ts` y dependencias)

## Estado real según código

### Funcionalidades implementadas

- CRUD de tareas
	- Crear tarea
	- Editar tarea
	- Marcar como completada
	- Desmarcar para volver a activa
	- Eliminar tarea
- CRUD de categorías
	- Crear categoría
	- Editar categoría
	- Eliminar categoría
- Asignación de categoría a tarea
- Filtro por categoría
- Separación visual de tareas activas y completadas
- Persistencia local con `localStorage`
- Optimización para listas grandes
	- Render incremental con botón "Cargar más" en activas/completadas
	- `trackBy` en listas para reducir re-renderizados
	- `ChangeDetectionStrategy.OnPush` en Home
	- Suscripciones seguras con `takeUntilDestroyed`

### Funcionalidades no implementadas

- Firebase
- Remote Config / feature flags
- SQLite

## Rendimiento (estado actual)

- El componente Home usa estrategia `OnPush`.
- Las listas de tareas activas y completadas se muestran de forma incremental (paginación local por bloques).
- Se mantiene `trackBy` por `id` en ambos `*ngFor` principales.
- Las suscripciones de estado usan `takeUntilDestroyed` para evitar fugas de memoria.
- El flujo fue validado con `npm run build` exitoso.

## Arquitectura actual

- `src/app/models/task.model.ts`: modelo de tarea.
- `src/app/models/category.model.ts`: modelo de categoría.
- `src/app/services/storage.service.ts`: wrapper simple para `localStorage`.
- `src/app/services/task.service.ts`: estado y operaciones de tareas.
- `src/app/services/category.service.ts`: estado y operaciones de categorías.
- `src/app/home/home.page.ts`: lógica de UI (filtros, formulario, edición).
- `src/app/home/home.page.html`: estructura principal de Home.
- `src/app/home/home.page.scss`: estilos de Home.

## Ejecución en local

1. Instalar dependencias:

```bash
npm install
```

2. Levantar en desarrollo:

```bash
npm start
```

3. Build web:

```bash
npm run build
```

El output web se genera en `www/`.

## Compilación Android con Cordova

Este repositorio ya contiene estructura Cordova (`platforms/` y `plugins/`).

1. Build web:

```bash
npm run build
```

2. Compilar Android:

```bash
npx cordova build android
```

3. APK debug esperada:

```text
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## Compilación iOS con Cordova

Requiere macOS + Xcode.

```bash
npm run build
npx cordova build ios
```

## Scripts disponibles

```bash
npm start      # ng serve
npm run build  # ng build
npm run test   # karma
npm run lint   # angular-eslint
```

## Notas de coherencia

- El proyecto tiene dependencias de Capacitor y Cordova, pero el flujo nativo documentado arriba usa Cordova porque es el que está materializado en la estructura actual del repo.

## Autor

- Gregory Gonzalez

