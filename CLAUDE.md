# CLAUDE.md — StockApp

Contexto de desarrollo para Claude Code. Leer antes de cualquier tarea.

---

## 🏗️ Arquitectura

- **Frontend:** SPA Quasar v1 + Vue 2, build en `/dist/spa`
- **Backend:** Firebase (Firestore + Auth) — serverless, sin API custom
- **Hosting:** Firebase Hosting, proyecto `stock-kipreos`
- **Dominio:** `miapp.digital/stockapp` (pendiente configurar en Firebase Console)
- **Node requerido:** >= 10.18.1 (package.json), workflows en Node 18

---

## 🌿 Ramas Activas

### `claude/audit-deprecated-dependencies-011CV2Vd1maKLmG8mGBctVBY`
Actualización de dependencias deprecadas y vulnerabilidades de seguridad.

**Cambios:**
- `axios` 0.18.1 → 1.7.7 (CVE-2019-10742)
- `firebase` 7.14.4 → 8.10.1
- `babel-eslint` → `@babel/eslint-parser` (deprecado)
- `eslint-loader` → `eslint-webpack-plugin` (deprecado)
- `quasar` 1.0.0 → 1.22.10, `@quasar/app` 1.8.8 → 1.9.6
- Agregado `firebase-tools ^13.0.0` a devDependencies
- `.eslintrc.js` y `quasar.conf.js` adaptados a los nuevos paquetes

**Estado:** ✅ Pusheada — pendiente PR y merge a main

---

### `claude/setup-firebase-hosting-pipeline-011CV2Vd1maKLmG8mGBctVBY`
Pipeline CI/CD con Firebase Hosting via GitHub Actions.

**Cambios:**
- `firebase.json` configurado con hosting, rewrites para SPA y headers de caché
- `.github/workflows/firebase-hosting-merge.yml` — deploy a producción en push a main/master
- `.github/workflows/firebase-hosting-pull-request.yml` — preview deployment en PRs
- Scripts npm: `deploy:prod`, `deploy:preview`, `lint`, `lint:fix`
- Secret `FIREBASE_SERVICE_ACCOUNT_STOCK_KIPREOS` ya configurado en GitHub (via `firebase init hosting:github`)

**Estado:** ✅ Pusheada — pendiente PR y merge a main

---

## ⏳ Pendientes

- [ ] Decidir versión de Node en workflows: **Node 18** (limpio) o **Node 24 LTS** (requiere `NODE_OPTIONS=--openssl-legacy-provider` por Webpack 4)
- [ ] PR y merge de rama de dependencias a main
- [ ] PR y merge de rama de pipeline a main
- [ ] Configurar dominio custom `miapp.digital` en Firebase Console (Hosting → Add custom domain)
- [ ] Primer deploy real a Firebase Hosting tras merge

---

## ⚠️ Consideraciones Importantes

### Node + Webpack 4
`@quasar/app` v1.x usa Webpack 4. Desde Node 17+ hay conflicto con OpenSSL:
```
Error: error:0308010C:digital envelope routines::unsupported
```
Workaround si se sube a Node 18+:
```yaml
env:
  NODE_OPTIONS: --openssl-legacy-provider
```

### Quasar v1 → v2 (futuro)
No se migró a Quasar v2 (Vue 3) intencionalmente — es un proyecto separado más grande.
Requeriría: Vue 2 → Vue 3, Vuex → Pinia, Webpack 4 → 5, refactor de componentes.

### Firebase v8
Se actualizó a Firebase 8 (no 9+) para mantener compatibilidad con la API existente sin refactorizar los archivos boot (`src/boot/firebase.js`, `src/boot/axios.js`).
Firebase 9+ usa API modular y requeriría cambios en el código.

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
| `quasar.conf.js` | Config de Quasar + Webpack |
| `.eslintrc.js` | ESLint con `@babel/eslint-parser` |
| `server.js` | Express sirve `/dist/spa` (legacy Heroku) |
| `.github/workflows/firebase-hosting-merge.yml` | Deploy a producción |
| `.github/workflows/firebase-hosting-pull-request.yml` | Preview en PRs |
| `DEPLOYMENT_GUIDE.md` | Guía completa de despliegue |
