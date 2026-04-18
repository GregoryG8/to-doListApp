# Prueba Técnica Mobile Dev - Ionic To-Do App

Aplicación híbrida desarrollada con Ionic + Angular para resolver la prueba técnica de desarrollo mobile.

## 1) Objetivo

Implementar una aplicación de tareas (To-Do List) que permita:

- Agregar nuevas tareas.
- Marcar tareas como completadas.
- Eliminar tareas.
- Gestionar categorías (crear, editar, eliminar).
- Asignar categoría a cada tarea.
- Filtrar tareas por categoría.
- Controlar funcionalidades con Firebase Remote Config (feature flags).
- Optimizar rendimiento para carga inicial, listas grandes y uso de memoria.

## 2) Stack Tecnológico

- Ionic 8
- Angular 20 (Standalone)
- TypeScript
- SCSS
- Capacitor 8 para Android/iOS

Nota: El enunciado menciona Cordova. Este proyecto está configurado con Capacitor, que es la opción recomendada actualmente por Ionic para compilación híbrida.

## 3) Estado del Proyecto

Checklist de cumplimiento:

- [ ] CRUD de tareas
- [ ] Persistencia local (LocalStorage/SQLite)
- [ ] CRUD de categorías
- [ ] Asignación de categoría a tarea
- [ ] Filtro por categoría
- [ ] Firebase configurado
- [ ] Feature flag con Remote Config
- [ ] Optimizaciones de rendimiento aplicadas
- [ ] APK generado
- [ ] IPA generado

## 4) Requisitos Previos

- Node.js LTS (recomendado: 20+)
- npm
- Ionic CLI
- Android Studio (para Android)
- Xcode + CocoaPods (para iOS, en macOS)

Instalación de Ionic CLI:

```bash
npm install -g @ionic/cli
```

## 5) Instalación y Ejecución Local

1. Clonar repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd to-doListApp
```

2. Instalar dependencias:

```bash
npm install
```

3. Levantar en navegador:

```bash
ionic serve
```

## 6) Build y Ejecución en Android

1. Compilar web assets:

```bash
npm run build
```

2. Agregar plataforma Android (solo primera vez):

```bash
npx cap add android
```

3. Sincronizar cambios:

```bash
npx cap sync android
```

4. Abrir en Android Studio:

```bash
npx cap open android
```

5. Generar APK desde Android Studio:

- Build > Build Bundle(s) / APK(s) > Build APK(s)

Ruta esperada (debug):

- android/app/build/outputs/apk/debug/app-debug.apk

## 7) Build y Ejecución en iOS

Requiere macOS.

1. Agregar plataforma iOS (solo primera vez):

```bash
npx cap add ios
```

2. Sincronizar cambios:

```bash
npx cap sync ios
```

3. Abrir en Xcode:

```bash
npx cap open ios
```

4. Generar IPA desde Xcode:

- Product > Archive > Distribute App

## 8) Firebase y Remote Config

### 8.1 Configuración de Firebase

1. Crear proyecto en Firebase Console.
2. Registrar app Android e iOS.
3. Descargar credenciales:
	 - Android: google-services.json
	 - iOS: GoogleService-Info.plist
4. Integrar SDK según plataforma.

### 8.2 Feature Flag con Remote Config

Flag sugerido:

- remote_config key: enable_categories
- tipo: boolean
- default: true

Comportamiento esperado:

- `true`: se muestran módulos de categorías y filtro.
- `false`: se ocultan categorías/filtros y la app opera como To-Do básico.

Demostración:

- Cambiar valor del flag en Firebase.
- Forzar fetch/activate de Remote Config.
- Verificar cambio visual/funcional en la app.

## 9) Optimización de Rendimiento

Técnicas aplicadas o recomendadas para esta prueba:

- Renderizado eficiente de listas grandes (Virtual Scroll o paginación incremental).
- `ChangeDetectionStrategy.OnPush` en componentes de lista.
- `trackBy` en `*ngFor` para evitar re-render innecesario.
- Lazy loading por rutas.
- Compresión/optimización de assets.
- Evitar suscripciones huérfanas (manejo de ciclo de vida).

## 10) Evidencias de Entrega

### 10.1 Capturas o Video

Agregar enlaces o rutas aquí:

- [ ] Flujo CRUD tareas
- [ ] CRUD categorías
- [ ] Filtro por categoría
- [ ] Demo feature flag con Remote Config
- [ ] Demo de rendimiento con lista grande

### 10.2 APK e IPA

Agregar enlaces de descarga:

- APK: <URL_APK>
- IPA: <URL_IPA>

## 11) Respuestas de la Prueba

### 11.1 Principales desafíos

Escribe aquí tu respuesta.

Ejemplo de enfoque:

- Sincronizar estado local de tareas/categorías sin inconsistencias.
- Diseñar un UX simple para crear/editar categorías sin fricción.
- Controlar cambios remotos por feature flags sin romper flujos existentes.

### 11.2 Técnicas de optimización aplicadas y por qué

Escribe aquí tu respuesta.

Ejemplo de enfoque:

- `OnPush` + `trackBy` para reducir renders.
- Carga diferida para mejorar tiempo de arranque.
- Estructura de datos simple para minimizar consumo de memoria.

### 11.3 Calidad y mantenibilidad del código

Escribe aquí tu respuesta.

Ejemplo de enfoque:

- Arquitectura por capas (UI, lógica, persistencia).
- Código tipado con TypeScript e interfaces de dominio.
- Linting, pruebas unitarias y commits descriptivos por feature.

## 12) Estrategia de Versionamiento (Git)

Flujo sugerido:

1. Crear rama de trabajo desde `main`:

```bash
git checkout -b feature/prueba-ionic-todo
```

2. Commits pequeños y descriptivos por funcionalidad.

3. Subir rama:

```bash
git push origin feature/prueba-ionic-todo
```

4. Abrir Pull Request para revisión.

## 13) Comandos Útiles

```bash
# ejecutar en desarrollo
ionic serve

# tests
npm run test

# lint
npm run lint

# build web
npm run build

# sincronizar cambios nativos
npx cap sync
```

## 14) Estructura Base del Proyecto

```text
src/
	app/
		home/
	assets/
	environments/
```

## 15) Autor

- Nombre: Gregory Gonzalez

