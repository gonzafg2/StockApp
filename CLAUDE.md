# CLAUDE.md — StockApp

Contexto de desarrollo para Claude Code. Leer antes de cualquier tarea.

---

## 🏗️ Arquitectura

- **Frontend:** SPA Quasar v2 + Vue 3 (Webpack 5), build en `/dist/spa`
- **Backend:** Firebase (Firestore + Auth) — serverless, sin API custom
- **Hosting:** Firebase Hosting, proyecto `stock-kipreos`
- **Dominio:** Firebase Hosting URL por defecto (`stock-kipreos.web.app`)
- **Package manager:** pnpm 10.30.3 (`pnpm-lock.yaml`)
- **Node requerido:** >= 22 (package.json), workflows en Node LTS Krypton (22)

---

## 🌿 Ramas Activas

### `claude/audit-deprecated-dependencies-011CV2Vd1maKLmG8mGBctVBY`
Actualización de dependencias deprecadas y vulnerabilidades de seguridad.

**Cambios:**
- `axios` 0.18.1 → 1.7.7 (CVE-2019-10742)
- `firebase` 7.14.4 → 8.10.1
- `babel-eslint` → `@babel/eslint-parser` (deprecado)
- `eslint-loader` → `eslint-webpack-plugin` (deprecado)

**Estado:** ✅ Pusheada — pendiente PR y merge a main

---

### `feat/migrate-to-pnpm` ← rama actual
Migración de npm a pnpm como gestor de paquetes.

**Cambios:**
- `package-lock.json` eliminado → `pnpm-lock.yaml` generado vía `pnpm import`
- `packageManager: "pnpm@10.30.3"` agregado a `package.json`
- Scripts actualizados: `npm run` → `pnpm run` en heroku-postbuild, deploy:preview, deploy:prod
- `engines.npm` → `engines.pnpm: ">= 10"` en `package.json`
- Workflows actualizados: `pnpm/action-setup@v4` + `cache: 'pnpm'` + `pnpm install --frozen-lockfile`

**Estado:** 🔄 En progreso — pendiente CI verde, push, PR y merge

---

## ⏳ Pendientes

- [ ] `FirebaseExtended/action-hosting-deploy@v0` aún usa node20 internamente — pendiente actualización por Firebase (deadline GitHub: junio 2026)
- [ ] Verificar runtime: `pnpm run dev` en browser

---

## ⚠️ Consideraciones Importantes

### pnpm y hoisting estricto
pnpm usa symlinks hacia un store central en vez de copiar paquetes. Esto hace que las
dependencias transitivas faltantes (como `yaml` en `@apphosting/build`) fallen más temprano
y sean más visibles que con npm. `yaml@^2.8.3` está como devDependency directa por este motivo.

Configuración necesaria en `package.json` para compatibilidad con Quasar + Firebase:
- `shamefully-hoist=true` en `.npmrc`: hoisteara loaders de webpack (babel-loader, etc.) que
  `@quasar/app-webpack` requiere pero no declara como peerDeps — sin esto el build falla.
- `pnpm.overrides.core-js: "^3.49.0"`: firebase@8 arrastra `@firebase/polyfill` que pide
  core-js@3.6.5; Quasar necesita 3.49.0 (módulos `es.uint8-array.*`). El override fuerza una
  sola versión que satisface ambos (3.49.0 >= 3.6.5 en el rango ^3.x.x).
- `pnpm.onlyBuiltDependencies`: core-js, protobufjs y re2 necesitan correr sus scripts de
  instalación (pnpm v10 los bloquea por defecto).

### Quasar v2 + Webpack 5
Migrado desde Quasar v1 (Vue 2, Webpack 4). El conflicto Node ≥17 + OpenSSL
(`error:0308010C:digital envelope routines::unsupported`) está resuelto de raíz.
**No se necesita** `NODE_OPTIONS=--openssl-legacy-provider`.

### Firebase v8
Se mantiene Firebase 8 (no 9+) para conservar la API compat existente.
Firebase 9+ usa API modular y requeriría refactorizar `src/boot/firebase.js`.
Las advertencias de Webpack 5 sobre `export 'initializeApp' was not found in 'firebase/app'`
son cosméticas (análisis estático de namespace imports de v8) — no afectan el runtime.

### NPM_CONFIG_YES en workflows
Se mantiene `NPM_CONFIG_YES: 'true'` aunque se use pnpm. El action `FirebaseExtended/action-hosting-deploy@v0`
invoca `npx firebase-tools` internamente (con npm/npx del runner), por lo que esta variable
sigue siendo necesaria para evitar prompts interactivos de npx.

### vue/multi-word-component-names
Deshabilitado en `.eslintrc.js` — los nombres de componentes existentes (`Index`, `Error404`, etc.)
son pre-migración y renombrarlos está fuera de scope.

---

## 🔧 Comandos Útiles

```bash
pnpm run dev           # Desarrollo local
pnpm run build         # Build de producción
pnpm run lint          # Lint
pnpm run lint:fix      # Lint con auto-fix
pnpm run deploy:prod   # Build + deploy a Firebase Hosting (producción)
pnpm run deploy:preview # Build + deploy a preview channel
```

---

## 📁 Archivos Clave

| Archivo | Descripción |
|---------|-------------|
| `firebase.json` | Hosting config + emuladores locales |
| `.firebaserc` | Proyecto Firebase: `stock-kipreos` |
| `quasar.config.js` | Config de Quasar v2 + Webpack 5 |
| `.eslintrc.js` | ESLint con `@babel/eslint-parser` + vue3-essential |
| `server.js` | Express sirve `/dist/spa` (legacy Heroku) |
| `public/icons/` | Favicons (en v1 estaban en `src/statics/icons/`) |
| `pnpm-lock.yaml` | Lockfile de pnpm (reemplaza package-lock.json) |
| `.github/workflows/firebase-hosting-merge.yml` | Deploy a producción |
| `.github/workflows/firebase-hosting-pull-request.yml` | Preview en PRs |
