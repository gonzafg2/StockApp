# GitHub Workflows - StockApp

Este directorio contiene la configuración de CI/CD para StockApp.

## 📁 Estructura

```
.github/
├── workflows/
│   ├── ci.yml           # Continuous Integration (lint + build)
│   ├── deploy.yml       # Deploy a producción (main/master)
│   └── preview.yml      # Deploy preview en PRs
├── PIPELINE.md          # Documentación detallada del pipeline
└── README.md            # Este archivo
```

## 🚀 Workflows Activos

| Workflow | Trigger | Descripción |
|----------|---------|-------------|
| **CI** | PR o Push a main/master | Lint y build del código |
| **Deploy** | Push a main/master | Deploy automático a producción |
| **Preview** | PR a main/master | Deploy de preview temporal |

## 📖 Documentación

- Ver [`PIPELINE.md`](./PIPELINE.md) para detalles del pipeline
- Ver [`../DEPLOYMENT_GUIDE.md`](../DEPLOYMENT_GUIDE.md) para guía completa de despliegue

## 🔧 Configuración Requerida

Asegúrate de tener configurado el secret:
- `FIREBASE_SERVICE_ACCOUNT_STOCK_KIPREOS`

## 🎯 Quick Links

- [Firebase Console](https://console.firebase.google.com/project/stock-kipreos)
- [GitHub Actions](../../actions)
- [Deployment History](https://console.firebase.google.com/project/stock-kipreos/hosting/sites)
