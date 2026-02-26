from flask_restx import Resource, Namespace, fields
from flask import request
from app.services.auth.users_service import UsersService
from app.utils.auth_utils import obtener_usuario_desde_token

# Namespace para usuarios
users_ns = Namespace('users', description='Operaciones relacionadas con usuarios')

# Modelos para documentación Swagger
imagen_webp_model = users_ns.model('ImagenWebp', {
    'id': fields.Integer(description='ID de la imagen'),
    'orden': fields.Integer(description='Orden de la imagen'),
    'url_webp': fields.String(description='URL de la imagen WebP'),
    'nombre': fields.String(description='Nombre del archivo'),
    'formato': fields.String(description='Formato de la imagen')
})

user_basic_model = users_ns.model('UserBasic', {
    'id': fields.Integer(description='ID del usuario'),
    'name_user': fields.String(description='Nombre del usuario'),
    'slug': fields.String(description='Slug del usuario para URLs'),
    'imagenes_webp': fields.List(fields.Nested(imagen_webp_model))
})

user_complete_model = users_ns.model('UserComplete', {
    'id': fields.Integer(description='ID del usuario'),
    'name_user': fields.String(description='Nombre del usuario'),
    'slug': fields.String(description='Slug del usuario para URLs'),
    'email': fields.String(description='Email del usuario'),
    'edad': fields.Integer(description='Edad del usuario'),
    'fechanacimiento': fields.String(description='Fecha de nacimiento'),
    'telephone': fields.String(description='Teléfono'),
    'city': fields.String(description='Ciudad'),
    'sport': fields.String(description='Deporte'),
    'position': fields.String(description='Posición'),
    'biography': fields.String(description='Biografía'),
    'role': fields.String(description='Rol'),
    'status': fields.String(description='Estado'),
    'terms': fields.Boolean(description='Aceptó términos'),
    'is_profile_completed': fields.Boolean(description='Perfil completado'),
    'created_at': fields.String(description='Fecha de creación'),
    'updated_at': fields.String(description='Fecha de actualización'),
    'imagenes_webp': fields.List(fields.Nested(imagen_webp_model)),
    'urlphotoperfil': fields.String(description='URL de foto de perfil (compatibilidad)')
})

users_list_response = users_ns.model('UsersListResponse', {
    'success': fields.Boolean(description='Indica si la operación fue exitosa'),
    'data': fields.List(fields.Nested(user_basic_model)),
    'count': fields.Integer(description='Número de usuarios'),
    'busqueda': fields.String(description='Término de búsqueda (si aplica)', required=False)
})

user_detail_response = users_ns.model('UserDetailResponse', {
    'success': fields.Boolean(description='Indica si la operación fue exitosa'),
    'data': fields.Nested(user_complete_model)
})

# Endpoints para Usuarios
@users_ns.route('/')
class UsersList(Resource):
    @users_ns.doc('obtener_usuarios')
    @users_ns.marshal_with(users_list_response)
    def get(self):
        """Obtener lista de todos los usuarios (información básica)"""
        print("🌐 [USERS] Solicitud recibida para obtener todos los usuarios")
        
        try:
            result = UsersService.obtener_todos_usuarios()
            return result, 200
        except Exception as e:
            return {'success': False, 'message': 'Error interno del servidor'}, 500

@users_ns.route('/buscar')
class UsersSearch(Resource):
    @users_ns.doc('buscar_usuarios')
    @users_ns.param('q', 'Término de búsqueda', required=True)
    @users_ns.marshal_with(users_list_response)
    def get(self):
        """Buscar usuarios por nombre (información básica)"""
        print("🌐 [USERS] Solicitud recibida para buscar usuarios")
        
        query = request.args.get('q', '').strip()
        if not query:
            return {'success': False, 'message': 'Parámetro de búsqueda requerido'}, 400

        try:
            result = UsersService.buscar_usuarios_por_nombre(query)
            return result, 200
        except Exception as e:
            return {'success': False, 'message': 'Error interno del servidor'}, 500

@users_ns.route('/<int:usuario_id>')
class UserDetailById(Resource):
    @users_ns.doc('obtener_usuario_por_id')
    @users_ns.marshal_with(user_detail_response)
    @users_ns.response(404, 'Usuario no encontrado')
    def get(self, usuario_id):
        """Obtener un usuario específico por ID (información COMPLETA)"""
        print(f"🌐 [USERS] Solicitud recibida para obtener usuario ID: {usuario_id}")
        
        try:
            result = UsersService.obtener_usuario_por_id(usuario_id)
            return result, 200
        except ValueError as e:
            return {'success': False, 'message': str(e)}, 404
        except Exception as e:
            return {'success': False, 'message': 'Error interno del servidor'}, 500

# ✅ NUEVO ENDPOINT PARA BUSCAR POR SLUG
@users_ns.route('/slug/<string:usuario_slug>')
class UserDetailBySlug(Resource):
    @users_ns.doc('obtener_usuario_por_slug')
    @users_ns.marshal_with(user_detail_response)
    @users_ns.response(404, 'Usuario no encontrado')
    def get(self, usuario_slug):
        """Obtener un usuario específico por SLUG (información COMPLETA)"""
        print(f"🌐 [USERS] Solicitud recibida para obtener usuario por SLUG: {usuario_slug}")
        
        try:
            result = UsersService.obtener_usuario_por_slug(usuario_slug)
            return result, 200
        except ValueError as e:
            return {'success': False, 'message': str(e)}, 404
        except Exception as e:
            return {'success': False, 'message': 'Error interno del servidor'}, 500