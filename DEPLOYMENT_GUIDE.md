# Guía de Despliegue - StockApp

## 📋 Resumen

StockApp utiliza **Firebase Hosting** para el despliegue del frontend SPA (Single Page Application) con CI/CD automatizado mediante **GitHub Actions**.

---

## 🏗️ Arquitectura de Despliegue

```
┌─────────────────┐
│  GitHub Repo    │
│   (main/master) │
└────────┬────────┘
         │
         │ git push
         ▼
┌─────────────────┐
│ GitHub Actions  │
│   - CI Build    │
│   - Lint        │
│   - Deploy      │
└────────┬────────┘
         │
         │ firebase deploy
         ▼
┌─────────────────┐
│ Firebase Hosting│
│  (CDN Global)   │
└────────┬────────┘
         │
         │ HTTPS
         ▼
    👥 Usuarios
```

**Backend:**
- Firebase Firestore (base de datos)
- Firebase Auth (autenticación)
- Todo serverless, no hay backend custom

**Frontend:**
- SPA Quasar/Vue.js compilado a `/dist/spa`
- Servido por Firebase Hosting CDN global

---

## 🚀 Configuración Inicial

### 1. Configurar Firebase Hosting

El proyecto ya está configurado con:
- Proyecto Firebase: `stock-kipreos`
- Configuración en `firebase.json`

### 2. Configurar Secretos en GitHub

Para que el pipeline funcione, necesitas agregar el service account de Firebase:

#### Pasos:

1. **Crear Service Account en Firebase:**
   ```bash
   # Instalar Firebase CLI si no lo tienes
   npm install -g firebase-tools

   # Login a Firebase
   firebase login

   # Generar el service account
   firebase init hosting:github
   ```

2. **El comando anterior:**
   - Te pedirá autorización en el navegador
   - Automáticamente creará el secret `FIREBASE_SERVICE_ACCOUNT_STOCK_KIPREOS` en GitHub
   - Configurará los workflows necesarios

   **Alternativa Manual:**

   Si prefieres hacerlo manualmente:

   a) Ve a la [Consola de Firebase](https://console.firebase.google.com/)

   b) Selecciona proyecto `stock-kipreos`

   c) Ve a **Project Settings** → **Service Accounts**

   d) Click en **Generate New Private Key**

   e) Copia el contenido del archivo JSON

   f) Ve a tu repo de GitHub → **Settings** → **Secrets and variables** → **Actions**

   g) Click en **New repository secret**

   h) Nombre: `FIREBASE_SERVICE_ACCOUNT_STOCK_KIPREOS`

   i) Valor: Pega el contenido del JSON completo

---

## 🔄 Workflows de GitHub Actions

### 1. **CI - Build and Lint** (`.github/workflows/ci.yml`)

**Trigger:** Cada push o PR a main/master

**Qué hace:**
- ✅ Checkout del código
- ✅ Instala dependencias (npm ci)
- ✅ Ejecuta ESLint
- ✅ Compila el proyecto (quasar build)
- ✅ Sube artifacts del build

**Matriz de testing:**
- Node.js 14.x
- Node.js 16.x

### 2. **Deploy to Firebase Hosting** (`.github/workflows/deploy.yml`)

**Trigger:** Push a main/master (solo después de merge)

**Qué hace:**
- ✅ Checkout del código
- ✅ Instala dependencias
- ✅ Compila el proyecto
- ✅ **Despliega a producción** en Firebase Hosting

**URL de producción:**
- `https://stock-kipreos.web.app`
- `https://stock-kipreos.firebaseapp.com`
- Dominio custom configurado en Firebase Console

### 3. **Deploy Preview** (`.github/workflows/preview.yml`)

**Trigger:** Cada Pull Request a main/master

**Qué hace:**
- ✅ Checkout del código
- ✅ Instala dependencias
- ✅ Compila el proyecto
- ✅ **Despliega a un preview channel temporal**

**Resultado:**
- Comenta en el PR con URL de preview
- URL temporal tipo: `https://stock-kipreos--pr-123-xyz.web.app`
- Se puede probar antes de hacer merge

---

## 🛠️ Scripts Disponibles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Lint del código
npm run lint

# Lint con auto-fix
npm run lint:fix

# Deploy manual a preview channel
npm run deploy:preview

# Deploy manual a producción
npm run deploy:prod

# Servidor local (sirve el build)
npm start
```

---

## 📦 Proceso de Despliegue Completo

### Flujo Normal (Automático)

1. **Desarrollo:**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   # ... hacer cambios ...
   git add .
   git commit -m "Add: nueva funcionalidad"
   git push origin feature/nueva-funcionalidad
   ```

2. **Pull Request:**
   - Crear PR en GitHub
   - **CI workflow** se ejecuta automáticamente
   - **Preview workflow** despliega a URL temporal
   - Revisar código y probar en preview
   - Aprobar PR

3. **Merge a Main:**
   - Hacer merge del PR
   - **Deploy workflow** se ejecuta automáticamente
   - Aplicación desplegada a producción
   - ✅ Listo!

### Despliegue Manual (Local)

Si necesitas desplegar manualmente desde tu máquina:

```bash
# 1. Asegúrate de estar en main/master
git checkout main
git pull origin main

# 2. Instala dependencias
npm install

# 3. Build
npm run build

# 4. Login a Firebase (solo primera vez)
firebase login

# 5. Deploy a producción
firebase deploy --only hosting

# O usando el script npm
npm run deploy:prod
```

---

## 🌐 Configurar Dominio Custom

### En Firebase Console:

1. Ve a **Hosting** en la consola de Firebase
2. Click en **Add custom domain**
3. Ingresa tu dominio: `miapp.digital` o `stockapp.miapp.digital`
4. Sigue las instrucciones para verificar el dominio
5. Agrega los registros DNS que Firebase te indique:
   ```
   Type: A
   Name: @
   Value: [IPs que Firebase proporciona]

   Type: CNAME
   Name: stockapp
   Value: stock-kipreos.web.app
   ```

---

## 🔍 Monitoreo y Logs

### Ver Deployments:

```bash
firebase hosting:channel:list
```

### Ver logs en Firebase Console:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona `stock-kipreos`
3. Ve a **Hosting** → **Release history**

### Ver logs de GitHub Actions:

1. Ve a tu repo en GitHub
2. Click en **Actions**
3. Selecciona el workflow que quieres ver
4. Click en el run específico

---

## 🐛 Troubleshooting

### ❌ El deploy falla con "Permission denied"

**Solución:** Verifica que el secret `FIREBASE_SERVICE_ACCOUNT_STOCK_KIPREOS` esté configurado correctamente en GitHub.

### ❌ El build falla en GitHub Actions

**Solución:**
1. Verifica que el build funcione localmente: `npm run build`
2. Revisa los logs del workflow en GitHub Actions
3. Asegúrate de que todas las dependencias estén en `package.json`

### ❌ La app muestra 404 en rutas

**Solución:** Ya está configurado el rewrite en `firebase.json`:
```json
"rewrites": [
  {
    "source": "**",
    "destination": "/index.html"
  }
]
```

Esto asegura que Vue Router funcione correctamente en modo history.

### ❌ Los assets no cargan

**Solución:** Verifica el `publicPath` en `quasar.conf.js`. Debe ser `/` para Firebase Hosting.

---

## 🔐 Seguridad

### Headers de Seguridad

Ya configurados en `firebase.json`:
```json
"headers": [
  {
    "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|woff|woff2|ttf|eot)",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "max-age=31536000"
      }
    ]
  }
]
```

### Recomendaciones adicionales:

Para agregar más headers de seguridad, edita `firebase.json`:

```json
{
  "source": "**/*.@(html|js)",
  "headers": [
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "X-Frame-Options",
      "value": "DENY"
    },
    {
      "key": "X-XSS-Protection",
      "value": "1; mode=block"
    }
  ]
}
```

---

## 📊 Costos

**Firebase Hosting - Plan Spark (Gratis):**
- ✅ 10 GB almacenamiento
- ✅ 360 MB/día transferencia
- ✅ CDN global incluido
- ✅ SSL automático

**Si necesitas más:**
- Plan Blaze (pay-as-you-go)
- $0.026 por GB almacenamiento adicional
- $0.15 por GB transferencia adicional

---

## ✅ Checklist de Configuración

- [ ] Service account configurado en GitHub Secrets
- [ ] Firebase CLI instalado localmente
- [ ] Firebase login exitoso
- [ ] Build local funciona correctamente
- [ ] Workflows de GitHub Actions creados
- [ ] Primer deploy manual exitoso
- [ ] Preview deployments funcionan en PRs
- [ ] Deploy automático funciona en merge a main
- [ ] Dominio custom configurado (opcional)
- [ ] DNS configurados para dominio custom (opcional)

---

## 📚 Referencias

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Quasar Framework Deployment](https://quasar.dev/quasar-cli/developing-spa/deploying)
- [Firebase Hosting GitHub Action](https://github.com/marketplace/actions/deploy-to-firebase-hosting)

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs en GitHub Actions
2. Revisa los logs en Firebase Console
3. Verifica que el build funcione localmente
4. Consulta la documentación oficial de Firebase
5. Revisa el status de Firebase: https://status.firebase.google.com/

---

**Última actualización:** 2025-11-17
