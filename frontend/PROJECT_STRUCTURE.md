# Estructura del Proyecto

Generado el: 12/12/2025, 3:53:00 p. m.

```
liga_agil_app/
├── 📁 app
│   ├── 📁 (auth)
│   │   ├── 📁 forgot-password
│   │   │   └── 📄 page.tsx
│   │   └── 📁 register
│   │       └── 📄 page.tsx
│   ├── 📁 (feed)
│   │   ├── 📁 canchas
│   │   │   ├── 📁 [id]
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 nueva
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 home
│   │   │   ├── 📄 loading.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 perfil
│   │   │   └── 📁 [slug]
│   │   │       └── 📄 page.tsx
│   │   ├── 📁 profile
│   │   │   ├── 📁 achievements
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 edit
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 friends
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 settings
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 statistics
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📄 layout.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 torneos
│   │   │   └── 📄 page.tsx
│   │   └── 📄 layout.tsx
│   ├── 📄 favicon.ico
│   ├── 📄 globals.css
│   ├── 📄 layout.tsx
│   ├── 📄 not-found.tsx
│   └── 📄 page.tsx
├── 📁 components
│   ├── 📁 auth
│   │   ├── 📄 AuthGuard.tsx
│   │   ├── 📄 FormEditPerfil.tsx
│   │   ├── 📄 FormLogin.tsx
│   │   ├── 📄 FormRecoverPassword.tsx
│   │   ├── 📄 FormRegister.tsx
│   │   ├── 📄 LogoutButton.tsx
│   │   └── 📄 VerificationCodeModal.tsx
│   ├── 📁 brand
│   │   ├── 📄 Loading.tsx
│   │   └── 📄 Logo.tsx
│   ├── 📁 header
│   │   ├── 📄 DesktopNav.tsx
│   │   ├── 📄 Header.tsx
│   │   ├── 📄 MobileNav.tsx
│   │   ├── 📄 Notifications.tsx
│   │   ├── 📄 ProfileMenu.tsx
│   │   ├── 📄 SearchBar.tsx
│   │   └── 📄 SearchResults.tsx
│   ├── 📁 layout
│   │   ├── 📁 canchas
│   │   │   ├── 📄 CanchaDetalle.tsx
│   │   │   ├── 📄 CanchasList.tsx
│   │   │   ├── 📄 CanchasMobile.tsx
│   │   │   ├── 📄 CardCancha.tsx
│   │   │   ├── 📄 FormCreateCancha.tsx
│   │   │   ├── 📄 MapLocationSelector.tsx
│   │   │   └── 📄 ReservaModal.tsx
│   │   ├── 📄 MobileNavigation.tsx
│   │   ├── 📄 Publicidad.tsx
│   │   └── 📄 PublicidadLateral.tsx
│   ├── 📁 noticias
│   │   └── 📄 Noticias.tsx
│   ├── 📁 perfil
│   │   ├── 📄 BotonEliminarAmigo.tsx
│   │   ├── 📄 BotonSolicitudAmistad.tsx
│   │   ├── 📄 ListaAmigos.tsx
│   │   ├── 📄 MisReservasModal.tsx
│   │   ├── 📄 Perfil.tsx
│   │   ├── 📄 PerfilUsuario.tsx
│   │   └── 📄 Settings.tsx
│   ├── 📁 social
│   │   ├── 📄 CommentItem.tsx
│   │   ├── 📄 CommentsSection.tsx
│   │   ├── 📄 CreatePost.tsx
│   │   ├── 📄 Feed.tsx
│   │   ├── 📄 FeedSidebar.tsx
│   │   └── 📄 PostCard.tsx
│   ├── 📁 torneos
│   │   └── 📄 Torneos.tsx
│   └── 📁 ui
│       ├── 📄 CardLoading.tsx
│       ├── 📄 FeatureCard.tsx
│       ├── 📄 ListLoading.tsx
│       └── 📄 StatBadge.tsx
├── 📁 public
│   └── 📄 logo-sport-hub.png
├── 📁 scripts
│   └── 📄 generate-structure.ts
├── 📁 src
│   ├── 📁 constants
│   │   ├── 📄 api-routes.ts
│   │   ├── 📄 app-routes.ts
│   │   ├── 📄 feed-routes.ts
│   │   ├── 📄 header-routes.ts
│   │   └── 📄 index.ts
│   ├── 📁 data
│   │   ├── 📄 features.ts
│   │   ├── 📄 navigation.ts
│   │   └── 📄 socialData.ts
│   ├── 📁 hooks
│   │   ├── 📁 auth
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 useAuthRedirect.ts
│   │   │   ├── 📄 useCheckSession.ts
│   │   │   ├── 📄 useLogin.ts
│   │   │   ├── 📄 useLogout.ts
│   │   │   ├── 📄 useRecoverPassword.ts
│   │   │   └── 📄 useRegister.ts
│   │   ├── 📁 canchas
│   │   │   ├── 📁 reservas
│   │   │   │   ├── 📄 useCancelarReserva.ts
│   │   │   │   ├── 📄 useMisReservas.ts
│   │   │   │   ├── 📄 useReservarCancha.ts
│   │   │   │   └── 📄 useReservasCancha.ts
│   │   │   ├── 📄 useCreateCancha.ts
│   │   │   ├── 📄 useGetCanchaById.ts
│   │   │   └── 📄 useGetCanchas.ts
│   │   ├── 📁 header
│   │   │   └── 📄 useHeader.ts
│   │   ├── 📁 notificaciones
│   │   │   ├── 📄 useFriendRequestActions.ts
│   │   │   ├── 📄 useNotifications.ts
│   │   │   ├── 📄 useNotificationsCount.ts
│   │   │   └── 📄 useNotificationsData.ts
│   │   ├── 📁 perfil
│   │   │   ├── 📁 amigos
│   │   │   │   ├── 📄 useEliminarAmigo.ts
│   │   │   │   └── 📄 useFriendsList.ts
│   │   │   ├── 📁 settings
│   │   │   │   ├── 📄 useChangeEmail.ts
│   │   │   │   └── 📄 useChangePassword.ts
│   │   │   ├── 📄 useEditProfile.ts
│   │   │   └── 📄 useGetCurrentUser.ts
│   │   ├── 📁 users
│   │   │   ├── 📁 friends
│   │   │   │   └── 📄 useFriendRequest.ts
│   │   │   ├── 📄 useGetPerfilUsuario.ts
│   │   │   └── 📄 useSearchUsers.ts
│   │   ├── 📄 useComments.ts
│   │   ├── 📄 useCreatePost.ts
│   │   ├── 📄 usePosts.ts
│   │   ├── 📄 useSearch.ts
│   │   └── 📄 useToast.ts
│   ├── 📁 schemas
│   │   ├── 📁 auth
│   │   │   ├── 📄 loginSchema.ts
│   │   │   ├── 📄 profileSchema.ts
│   │   │   ├── 📄 schema_create_cancha.ts
│   │   │   └── 📄 schema_register.ts
│   │   ├── 📁 canchas
│   │   │   ├── 📄 schemasAdmin.ts
│   │   │   └── 📄 schemasCancha.ts
│   │   └── 📁 jugador
│   │       └── 📄 profile-schema.ts
│   ├── 📁 services
│   │   ├── 📄 auth-service.ts
│   │   └── 📄 notificationsService.ts
│   ├── 📁 store
│   │   └── 📄 useAuthStore.ts
│   ├── 📁 types
│   │   ├── 📁 header
│   │   │   └── 📄 navigation.ts
│   │   ├── 📄 Cancha.ts
│   │   ├── 📄 Reserva.ts
│   │   ├── 📄 auth.ts
│   │   ├── 📄 image-upload.ts
│   │   ├── 📄 notifications.ts
│   │   └── 📄 user.ts
│   └── 📁 utils
│       └── 📄 capitalizarPrimerNombre.ts
├── 📄 .env.development
├── 📄 .env.production
├── 📄 .gitignore
├── 📄 PROJECT_STRUCTURE.md
├── 📄 README.md
├── 📄 SPORT-HUB.md
├── 📄 eslint.config.mjs
├── 📄 middleware.ts
├── 📄 next-env.d.ts
├── 📄 next.config.ts
├── 📄 package.json
├── 📄 postcss.config.mjs
└── 📄 tsconfig.json

```

## Descripción de Directorios Principales

### `/app`
Directorio principal de Next.js 15 App Router. Contiene todas las rutas y layouts de la aplicación.

### `/components`
Componentes React reutilizables organizados por funcionalidad.

### `/lib`
Utilidades, helpers, y configuraciones (Supabase client, etc.).

### `/types`
Definiciones de tipos TypeScript para la aplicación.

### `/hooks`
Custom hooks de React.

### `/utils`
Funciones de utilidad y helpers.

### `/public`
Archivos estáticos (imágenes, fonts, etc.).

### `/styles`
Archivos de estilos globales (si los hay).
