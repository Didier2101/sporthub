from flask_restx import Resource, Namespace, fields
from flask import request
from app.services.auth.friendship_service import FriendshipService
from app.utils.auth_utils import obtener_usuario_desde_token

# Namespace para amistades
friends_ns = Namespace('friends', description='Operaciones relacionadas con amistades', path='/friends')

# Modelos para documentación Swagger
friend_request_model = friends_ns.model('FriendRequest', {
    'friend_id': fields.Integer(required=True, description='ID del usuario al que se le envía la solicitud')
})

process_request_model = friends_ns.model('ProcessRequest', {
    'action': fields.String(required=True, description='Acción a realizar: "accept" o "reject"', 
                           enum=['accept', 'reject'])
})

# ============================================
# 1. VERIFICAR ESTADO DE AMISTAD
# ============================================
@friends_ns.route('/status/<int:usuario_id>')
class FriendshipStatus(Resource):
    @friends_ns.doc('verificar_estado_amistad')
    @friends_ns.response(200, 'Estado obtenido')
    @friends_ns.response(401, 'No autorizado')
    @friends_ns.response(404, 'Usuario no encontrado')
    @friends_ns.response(500, 'Error interno')
    def get(self, usuario_id):
        """Verificar el estado de amistad entre el usuario autenticado y otro usuario"""
        print(f"🌐 [FRIENDS] Verificando estado de amistad con usuario ID: {usuario_id}")
        
        try:
            result = FriendshipService.verificar_estado_amistad(usuario_id)
            return result, 200
        except ValueError as e:
            return {'success': False, 'message': str(e)}, 404
        except PermissionError as e:
            return {'success': False, 'message': str(e)}, 401
        except Exception as e:
            print(f"💥 Error en controlador: {str(e)}")
            return {'success': False, 'message': 'Error interno del servidor'}, 500

# ============================================
# 2. ENVIAR SOLICITUD DE AMISTAD
# ============================================
@friends_ns.route('/request')
class SendFriendRequest(Resource):
    @friends_ns.doc('enviar_solicitud_amistad')
    @friends_ns.expect(friend_request_model)
    @friends_ns.response(201, 'Solicitud enviada')
    @friends_ns.response(400, 'Error de validación')
    @friends_ns.response(401, 'No autorizado')
    @friends_ns.response(500, 'Error interno')
    def post(self):
        """Enviar solicitud de amistad a un usuario"""
        print("🌐 [FRIENDS] Enviando solicitud de amistad")
        
        data = request.get_json()
        if not data:
            return {'success': False, 'message': 'Datos inválidos'}, 400

        try:
            result = FriendshipService.enviar_solicitud_amistad(data)
            return result, 201
        except ValueError as e:
            return {'success': False, 'message': str(e)}, 400
        except PermissionError as e:
            return {'success': False, 'message': str(e)}, 401
        except Exception:
            return {'success': False, 'message': 'Error interno del servidor'}, 500

# ============================================
# 3. CANCELAR SOLICITUD PENDIENTE
# ============================================
@friends_ns.route('/request/<int:usuario_id>')
class CancelFriendRequest(Resource):
    @friends_ns.doc('cancelar_solicitud_amistad')
    @friends_ns.response(200, 'Solicitud cancelada')
    @friends_ns.response(400, 'Error de validación')
    @friends_ns.response(401, 'No autorizado')
    @friends_ns.response(404, 'Solicitud no encontrada')
    @friends_ns.response(500, 'Error interno')
    def delete(self, usuario_id):
        """Cancelar una solicitud de amistad pendiente"""
        print(f"🌐 [FRIENDS] Cancelando solicitud con usuario ID: {usuario_id}")
        
        try:
            result = FriendshipService.cancelar_solicitud_amistad(usuario_id)
            return result, 200
        except ValueError as e:
            return {'success': False, 'message': str(e)}, 404
        except PermissionError as e:
            return {'success': False, 'message': str(e)}, 401
        except Exception:
            return {'success': False, 'message': 'Error interno del servidor'}, 500

# ============================================
# 4. ACEPTAR/RECHAZAR SOLICITUD (para el receptor)
# ============================================
@friends_ns.route('/request/<int:friendship_id>/process')
class ProcessFriendRequest(Resource):
    @friends_ns.doc('procesar_solicitud_amistad')
    @friends_ns.expect(process_request_model)
    @friends_ns.response(200, 'Solicitud procesada')
    @friends_ns.response(400, 'Error de validación')
    @friends_ns.response(401, 'No autorizado')
    @friends_ns.response(404, 'Solicitud no encontrada')
    @friends_ns.response(500, 'Error interno')
    def put(self, friendship_id):
        """Procesar una solicitud de amistad recibida (aceptar o rechazar)"""
        print(f"🌐 [FRIENDS] Procesando solicitud ID: {friendship_id}")
        
        data = request.get_json()
        if not data:
            return {'success': False, 'message': 'Datos inválidos'}, 400

        accion = data.get('action')
        if not accion or accion not in ['accept', 'reject']:
            return {'success': False, 'message': 'Acción no válida. Use "accept" o "reject"'}, 400

        try:
            result = FriendshipService.procesar_solicitud_amistad(friendship_id, accion)
            return result, 200
        except ValueError as e:
            return {'success': False, 'message': str(e)}, 404
        except PermissionError as e:
            return {'success': False, 'message': str(e)}, 401
        except Exception:
            return {'success': False, 'message': 'Error interno del servidor'}, 500

# ============================================
# 5. OBTENER LISTA DE AMIGOS
# ============================================
@friends_ns.route('/list')
class FriendsList(Resource):
    @friends_ns.doc('obtener_lista_amigos')
    @friends_ns.response(200, 'Lista obtenida')
    @friends_ns.response(401, 'No autorizado')
    @friends_ns.response(500, 'Error interno')
    def get(self):
        """Obtener lista de amigos del usuario autenticado"""
        print("🌐 [FRIENDS] Obteniendo lista de amigos")
        
        try:
            result = FriendshipService.obtener_amigos()
            return result, 200
        except PermissionError as e:
            return {'success': False, 'message': str(e)}, 401
        except Exception:
            return {'success': False, 'message': 'Error interno del servidor'}, 500
        
    # ============================================
# 6. ELIMINAR AMIGO
# ============================================
@friends_ns.route('/delete/<int:usuario_id>')
class RemoveFriend(Resource):
    @friends_ns.doc('eliminar_amigo')
    @friends_ns.response(200, 'Amigo eliminado')
    @friends_ns.response(400, 'Error de validación')
    @friends_ns.response(401, 'No autorizado')
    @friends_ns.response(404, 'Amistad no encontrada')
    @friends_ns.response(500, 'Error interno')
    def delete(self, usuario_id):
        """Eliminar relación de amistad con otro usuario"""
        print(f"🌐 [FRIENDS] Eliminando amigo ID: {usuario_id}")
        
        try:
            result = FriendshipService.eliminar_amigo(usuario_id)
            return result, 200
        except ValueError as e:
            return {'success': False, 'message': str(e)}, 404
        except PermissionError as e:
            return {'success': False, 'message': str(e)}, 401
        except Exception as e:
            print(f"💥 Error en eliminar amigo: {str(e)}")
            return {'success': False, 'message': 'Error interno del servidor'}, 500