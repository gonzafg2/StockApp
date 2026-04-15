# CLAUDE.md — StockApp

Contexto de desarrollo para Claude Code. Leer antes de cualquier tarea.

---

## 🏗️ Arquitectura

- **Frontend:** SPA Quasar v2 + Vue 3 (Webpack 5), build en `/dist/spa`
- **Backend:** Firebase (Firestore + Auth) — serverless, sin API custom
- **Hosting:** Firebase Hosting, proyecto `stock-kipreos`
- **Dominio:** `miapp.digital/stockapp` (pendiente configurar en Firebase Console)
- **Node requerido:** >= 18 (package.json), workflows en Node 20

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

### `claude/setup-firebase-hosting-pipeline-011CV2Vd1maKLmG8mGBctVBY` ← rama actual
Pipeline CI/CD + migración Quasar v2.

**Cambios pipeline:**
- `firebase.json` configurado con hosting, rewrites para SPA y headers de caché
- `.github/workflows/firebase-hosting-merge.yml` — deploy a producción en push a main/master
- `.github/workflows/firebase-hosting-pull-request.yml` — preview deployment en PRs
- Scripts npm: `deploy:prod`, `deploy:preview`, `lint`, `lint:fix`
- Secret `FIREBASE_SERVICE_ACCOUNT_STOCK_KIPREOS` ya configurado en GitHub

**Cambios migración Quasar v1 → v2 (incluidos en este PR):**
- `quasar.conf.js` → `quasar.config.js` (API `configure()`, key `eslint:`)
- Vue Router v3 → v4 (`createRouter`, `history:`, `scrollBehavior` left/top)
- Vuex 3 → 4 (`createStore`, `process.env.DEBUGGING`)
- Boot axios: `Vue.prototype` → `app.config.globalProperties`
- `q-table`: `:data` → `:rows`, `.sync` → `v-model:` (Index.vue)
- `src/statics/` → `public/` (activos estáticos Quasar v2)
- ESLint: `plugin:vue/essential` → `plugin:vue/vue3-essential`
- `ajv@^8.18.0` como devDependency directa (resuelve conflicto ajv-keywords)
- Node 18 → 20 en workflows de GitHub Actions

**Estado:** ✅ Commiteada localmente — pendiente push, PR y merge a main

---

## ⏳ Pendientes

- [ ] Push de rama actual y crear PR (pipeline + migración Quasar v2)
- [ ] PR y merge de rama de dependencias a main
- [ ] Verificar runtime: `npm run dev` + Firebase en browser
- [ ] Configurar dominio custom `miapp.digital` en Firebase Console (Hosting → Add custom domain)
- [ ] Primer deploy real a Firebase Hosting tras merge

---

## ⚠️ Consideraciones Importantes

### Quasar v2 + Webpack 5
Migrado desde Quasar v1 (Vue 2, Webpack 4). El conflicto Node ≥17 + OpenSSL
(`error:0308010C:digital envelope routines::unsupported`) está resuelto de raíz.
**No se necesita** `NODE_OPTIONS=--openssl-legacy-provider`.

### Firebase v8
Se mantiene Firebase 8 (no 9+) para conservar la API compat existente.
Firebase 9+ usa API modular y requeriría refactorizar `src/boot/firebase.js`.
Las advertencias de Webpack 5 sobre `export 'initializeApp' was not found in 'firebase/app'`
son cosméticas (análisis estático de namespace imports de v8) — no afectan el runtime.

### vue/multi-word-component-names
Deshabilitado en `.eslintrc.js` — los nombres de componentes existentes (`Index`, `Error404`, etc.)
son pre-migración y renombrarlos está fuera de scope.

---

## 🔧 Comandos Útiles

```bash
npm run dev           # Desarrollo local
npm run build         # Build de producción
npm run lint          # Lint
npm run lint:fix      # Lint con auto-fix
npm run deploy:prod   # Build + deploy a Firebase Hosting (producción)
npm run deploy:preview # Build + deploy a preview channel
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
| `.github/workflows/firebase-hosting-merge.yml` | Deploy a producción |
| `.github/workflows/firebase-hosting-pull-request.yml` | Preview en PRs |
