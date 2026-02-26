# Sporthub Backend (FastAPI)

## Estructura de Proyecto Senior

Esta es una estructura profesional organizada por capas (Layered Architecture) optimizada para FastAPI:

```text
backend/
├── app/
│   ├── main.py
│   ├── core/
│   ├── db/
│   ├── api/
│   │   └── v1/
│   │       ├── api.py
│   │       └── endpoints/
│   │           ├── auth/       # Login, Register, Logout
│   │           ├── users/      # Profile, Account, Users
│   │           ├── canchas/    # Court management
│   │           ├── posts/      # Post management
│   │           ├── reservas/   # Bookings
│   │           └── social/     # Friendship & Social
│   ├── models/
│   │   ├── users/
│   │   ├── canchas/
│   │   ├── posts/
│   │   ├── reservas/
│   │   └── social/
│   ├── schemas/
│   │   ├── auth/
│   │   └── users/
│   ├── services/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── canchas/
│   │   ├── posts/
│   │   ├── reservas/
│   │   └── social/
│   ├── modules/
│   └── utils/
├── .env
├── requirements.txt
└── README.md
```

## Próximos Pasos para la Migración

1. **Refactorizar Modelos**: Cambiar `db.Model` a `Base` importado de `app.db.session`.
2. **Refactorizar Endpoints**: Convertir las clases `Resource` de Flask-RestX a funciones de `APIRouter` de FastAPI.
3. **Pydantic Schemas**: Crear esquemas de Pydantic en `app/schemas/` para reemplazar los modelos de Swagger/Flask-RestX.
4. **Inyección de Dependencias**: Usar `Depends(get_db)` en los endpoints para manejar las sesiones de base de datos.
