import os
from app.models.friendship_model import Friendship
from app.models.user_model import User
from app.utils.database import db
from app.utils.auth_utils import obtener_usuario_desde_token
from datetime import datetime

class FriendshipService:

    # ============================================
    # 1. VERIFICAR ESTADO DE AMISTAD
    # ============================================
    @staticmethod
    def verificar_estado_amistad(usuario_objetivo_id: int) -> dict:
        """
        Verificar el estado de amistad entre el usuario autenticado y otro usuario
        """
        try:
            print(f"🔍 Verificando estado de amistad con usuario ID: {usuario_objetivo_id}")
            
            # Obtener usuario autenticado
            usuario_actual, error, status = obtener_usuario_desde_token()
            if error:
                raise PermissionError("Usuario no autenticado")
            
            usuario_actual_id = usuario_actual.id
            
            # Si es el mismo usuario
            if usuario_actual_id == usuario_objetivo_id:
                return {
                    'success': True,
                    'status': 'self',
                    'message': 'Es el mismo usuario',
                    'can_send_request': False
                }
            
            # Verificar que el usuario objetivo existe
            usuario_objetivo = User.query.get(usuario_objetivo_id)
            if not usuario_objetivo:
                raise ValueError("Usuario no encontrado")
            
            # Buscar relación
            relacion = Friendship.query.filter(
                ((Friendship.sender_id == usuario_actual_id) & (Friendship.receiver_id == usuario_objetivo_id)) |
                ((Friendship.sender_id == usuario_objetivo_id) & (Friendship.receiver_id == usuario_actual_id))
            ).first()
            
            # Determinar estado
            if not relacion:
                estado = 'none'
                mensaje = 'No hay relación de amistad'
                can_send_request = True
            else:
                estado = relacion.status  # 'pending', 'accepted', 'rejected'
                if estado == 'pending':
                    mensaje = 'Solicitud pendiente'
                    can_send_request = False
                elif estado == 'accepted':
                    mensaje = 'Ya son amigos'
                    can_send_request = False
                elif estado == 'rejected':
                    mensaje = 'Solicitud rechazada anteriormente'
                    can_send_request = True
            
            print(f"✅ Estado encontrado: {estado}")
            return {
                'success': True,
                'status': estado,
                'message': mensaje,
                'can_send_request': can_send_request,
                'friendship': relacion.to_dict() if relacion else None,
                'user_info': {
                    'id': usuario_objetivo.id,
                    'name_user': usuario_objetivo.name_user,
                    'slug': usuario_objetivo.slug
                }
            }
            
        except PermissionError as e:
            raise e
        except ValueError as e:
            raise e
        except Exception as e:
            print(f"💥 Error al verificar estado de amistad: {str(e)}")
            raise Exception("Error interno al verificar estado de amistad")

    # ============================================
    # 2. ENVIAR SOLICITUD DE AMISTAD
    # ============================================
    @staticmethod
    def enviar_solicitud_amistad(data: dict) -> dict:
        """
        Enviar solicitud de amistad a otro usuario
        """
        try:
            print(f"📨 Enviando solicitud de amistad")
            
            # Obtener usuario autenticado
            usuario_actual, error, status = obtener_usuario_desde_token()
            if error:
                raise PermissionError("Usuario no autenticado")

            sender_id = usuario_actual.id
            receiver_id = data.get('friend_id')
            
            if not receiver_id:
                raise ValueError("ID de amigo es requerido")

            print(f"👤 Usuario autenticado: {usuario_actual.name_user} (ID: {sender_id})")
            print(f"🎯 Enviando solicitud a usuario ID: {receiver_id}")

            # Validaciones básicas
            if sender_id == receiver_id:
                raise ValueError("No puedes enviarte una solicitud de amistad a ti mismo")

            # Verificar que el usuario receptor existe
            receptor = User.query.get(receiver_id)
            if not receptor:
                raise ValueError("Usuario receptor no encontrado")

            # Verificar si ya existe una relación
            relacion_existente = Friendship.query.filter(
                ((Friendship.sender_id == sender_id) & (Friendship.receiver_id == receiver_id)) |
                ((Friendship.sender_id == receiver_id) & (Friendship.receiver_id == sender_id))
            ).first()

            if relacion_existente:
                if relacion_existente.status == 'accepted':
                    raise ValueError("Ya son amigos")
                elif relacion_existente.status == 'pending':
                    if relacion_existente.sender_id == sender_id:
                        raise ValueError("Ya has enviado una solicitud a este usuario")
                    else:
                        raise ValueError("Este usuario ya te ha enviado una solicitud")
                elif relacion_existente.status == 'rejected':
                    # Permitir reenviar solicitud si fue rechazada anteriormente
                    relacion_existente.status = 'pending'
                    relacion_existente.sender_id = sender_id
                    relacion_existente.receiver_id = receiver_id
                    db.session.commit()
                    print("✅ Solicitud reenviada (anteriormente rechazada)")
                    return {
                        'success': True,
                        'message': 'Solicitud de amistad enviada',
                        'friendship': relacion_existente.to_dict()
                    }

            # Crear nueva solicitud
            nueva_solicitud = Friendship(
                sender_id=sender_id,
                receiver_id=receiver_id,
                status='pending'
            )

            db.session.add(nueva_solicitud)
            db.session.commit()

            print(f"✅ Solicitud de amistad enviada: {sender_id} -> {receiver_id}")
            return {
                'success': True,
                'message': 'Solicitud de amistad enviada',
                'friendship': nueva_solicitud.to_dict()
            }
            
        except PermissionError as e:
            db.session.rollback()
            raise e
        except ValueError as e:
            db.session.rollback()
            raise e
        except Exception as e:
            db.session.rollback()
            print(f"💥 Error al enviar solicitud de amistad: {str(e)}")
            raise Exception("Error interno al enviar solicitud de amistad")

    # ============================================
    # 3. CANCELAR SOLICITUD PENDIENTE
    # ============================================
    @staticmethod
    def cancelar_solicitud_amistad(usuario_objetivo_id: int) -> dict:
        """
        Cancelar una solicitud de amistad pendiente que envió el usuario autenticado
        """
        try:
            print(f"❌ Cancelando solicitud de amistad con usuario ID: {usuario_objetivo_id}")
            
            # Obtener usuario autenticado
            usuario_actual, error, status = obtener_usuario_desde_token()
            if error:
                raise PermissionError("Usuario no autenticado")

            sender_id = usuario_actual.id
            
            # Buscar solicitud pendiente enviada por el usuario actual
            solicitud = Friendship.query.filter_by(
                sender_id=sender_id,
                receiver_id=usuario_objetivo_id,
                status='pending'
            ).first()

            if not solicitud:
                raise ValueError("No se encontró una solicitud pendiente para este usuario")

            # Eliminar la solicitud
            db.session.delete(solicitud)
            db.session.commit()

            print(f"✅ Solicitud cancelada: {sender_id} -> {usuario_objetivo_id}")
            return {
                'success': True,
                'message': 'Solicitud de amistad cancelada'
            }
            
        except PermissionError as e:
            db.session.rollback()
            raise e
        except ValueError as e:
            db.session.rollback()
            raise e
        except Exception as e:
            db.session.rollback()
            print(f"💥 Error al cancelar solicitud: {str(e)}")
            raise Exception("Error interno al cancelar solicitud")

    # ============================================
    # 4. ACEPTAR/RECHAZAR SOLICITUD (para el receptor)
    # ============================================
    @staticmethod
    def procesar_solicitud_amistad(friendship_id: int, accion: str) -> dict:
        """
        Procesar una solicitud de amistad recibida (aceptar o rechazar)
        """
        try:
            print(f"🔄 Procesando solicitud ID: {friendship_id}, Acción: {accion}")
            
            # Obtener usuario autenticado
            usuario_actual, error, status = obtener_usuario_desde_token()
            if error:
                raise PermissionError("Usuario no autenticado")

            # Buscar la solicitud donde el usuario es el receptor
            solicitud = Friendship.query.filter_by(
                id=friendship_id,
                receiver_id=usuario_actual.id,
                status='pending'
            ).first()

            if not solicitud:
                raise ValueError("Solicitud de amistad no encontrada o ya fue procesada")

            remitente = User.query.get(solicitud.sender_id)
            if not remitente:
                raise ValueError("Usuario remitente no encontrado")

            if accion == 'accept':
                # Aceptar la solicitud
                solicitud.status = 'accepted'
                mensaje = f"¡Solicitud aceptada! Ahora eres amigo de {remitente.name_user}"
                print(f"✅ Solicitud aceptada: {usuario_actual.name_user} aceptó a {remitente.name_user}")
                
            elif accion == 'reject':
                # Rechazar la solicitud
                solicitud.status = 'rejected'
                mensaje = f"Solicitud de {remitente.name_user} rechazada"
                print(f"❌ Solicitud rechazada: {usuario_actual.name_user} rechazó a {remitente.name_user}")
                
            else:
                raise ValueError("Acción no válida. Use 'accept' o 'reject'")

            db.session.commit()

            return {
                'success': True,
                'message': mensaje,
                'action': accion,
                'friendship': solicitud.to_dict()
            }

        except PermissionError as e:
            db.session.rollback()
            raise e
        except ValueError as e:
            db.session.rollback()
            raise e
        except Exception as e:
            db.session.rollback()
            print(f"💥 Error al procesar solicitud: {str(e)}")
            raise Exception("Error interno al procesar solicitud")

    # ============================================
    # 5. OBTENER LISTA DE AMIGOS
    # ============================================
    @staticmethod
    def obtener_amigos() -> dict:
        """
        Obtener lista de amigos del usuario autenticado
        """
        try:
            print("👥 Obteniendo lista de amigos")
            
            # Obtener usuario autenticado
            usuario_actual, error, status = obtener_usuario_desde_token()
            if error:
                raise PermissionError("Usuario no autenticado")

            # Buscar relaciones aceptadas
            relaciones = Friendship.query.filter(
                Friendship.status == 'accepted',
                ((Friendship.sender_id == usuario_actual.id) | 
                 (Friendship.receiver_id == usuario_actual.id))
            ).all()

            amigos = []
            for relacion in relaciones:
                # Determinar quién es el amigo
                amigo_id = relacion.receiver_id if relacion.sender_id == usuario_actual.id else relacion.sender_id
                amigo = User.query.get(amigo_id)
                
                if amigo:
                    # Obtener imágenes del amigo
                    imagenes_webp = []
                    if amigo.urlphotoperfil and amigo.urlphotoperfil.startswith('/utils/pictures/'):
                        filename = os.path.basename(amigo.urlphotoperfil)
                        imagen_info = {
                            'id': amigo.id,
                            'orden': 0,
                            'url_webp': f"/player/{amigo.id}/imagen-perfil/{filename}",
                            'nombre': filename,
                            'formato': 'webp'
                        }
                        imagenes_webp.append(imagen_info)
                    
                    amigo_info = {
                        'id': amigo.id,
                        'name_user': amigo.name_user,
                        'slug': amigo.slug,
                        'imagenes_webp': imagenes_webp,
                        'friendship_id': relacion.id,
                        'friendship_since': relacion.updated_at.isoformat() if relacion.updated_at else None
                    }
                    amigos.append(amigo_info)

            print(f"✅ Encontrados {len(amigos)} amigos")
            return {
                'success': True,
                'data': amigos,
                'count': len(amigos)
            }

        except PermissionError as e:
            raise e
        except Exception as e:
            print(f"💥 Error al obtener amigos: {str(e)}")
            raise Exception("Error interno al obtener amigos")
        
    # ============================================
    # 6. ELIMINAR AMIGO (eliminar relación de amistad) - VERSIÓN CORREGIDA
    # ============================================
    @staticmethod
    def eliminar_amigo(usuario_objetivo_id: int) -> dict:
        """
        Eliminar relación de amistad con otro usuario
        """
        try:
            print(f"🗑️ [FRIENDSHIP SERVICE] Iniciando eliminación de amigo: usuario objetivo ID {usuario_objetivo_id}")
            
            # 1. Obtener usuario autenticado desde el token
            usuario_actual, error, status = obtener_usuario_desde_token()
            if error:
                print(f"❌ [FRIENDSHIP SERVICE] Error de autenticación: {error}")
                raise PermissionError(f"Usuario no autenticado: {error}")
            
            usuario_actual_id = usuario_actual.id
            print(f"✅ [FRIENDSHIP SERVICE] Usuario autenticado: {usuario_actual.name_user} (ID: {usuario_actual_id})")
            
            # 2. Validaciones básicas
            if usuario_actual_id == usuario_objetivo_id:
                print("⚠️ [FRIENDSHIP SERVICE] Intento de eliminar amistad consigo mismo")
                raise ValueError("No puedes eliminar la amistad contigo mismo")
            
            # 3. Verificar que el usuario objetivo existe
            usuario_objetivo = User.query.get(usuario_objetivo_id)
            if not usuario_objetivo:
                print(f"❌ [FRIENDSHIP SERVICE] Usuario objetivo no encontrado: {usuario_objetivo_id}")
                raise ValueError(f"Usuario no encontrado (ID: {usuario_objetivo_id})")
            
            print(f"✅ [FRIENDSHIP SERVICE] Usuario objetivo encontrado: {usuario_objetivo.name_user}")
            
            # 4. Buscar relación de amistad existente (status='accepted')
            print(f"🔍 [FRIENDSHIP SERVICE] Buscando relación de amistad...")
            
            amistad = Friendship.query.filter(
                Friendship.status == 'accepted',
                (
                    (Friendship.sender_id == usuario_actual_id) & 
                    (Friendship.receiver_id == usuario_objetivo_id)
                ) | (
                    (Friendship.sender_id == usuario_objetivo_id) & 
                    (Friendship.receiver_id == usuario_actual_id)
                )
            ).first()
            
            print(f"📊 [FRIENDSHIP SERVICE] Resultado de búsqueda: {'Encontrada' if amistad else 'No encontrada'}")
            
            if not amistad:
                # Verificar si existe alguna relación en otro estado
                otra_relacion = Friendship.query.filter(
                    (
                        (Friendship.sender_id == usuario_actual_id) & 
                        (Friendship.receiver_id == usuario_objetivo_id)
                    ) | (
                        (Friendship.sender_id == usuario_objetivo_id) & 
                        (Friendship.receiver_id == usuario_actual_id)
                    )
                ).first()
                
                if otra_relacion:
                    estado_actual = otra_relacion.status
                    print(f"ℹ️ [FRIENDSHIP SERVICE] Existe relación pero no son amigos. Estado: {estado_actual}")
                    raise ValueError(f"No son amigos. Estado actual de la relación: {estado_actual}")
                else:
                    print(f"❌ [FRIENDSHIP SERVICE] No existe ninguna relación con este usuario")
                    raise ValueError("No existe una relación de amistad con este usuario")
            
            print(f"✅ [FRIENDSHIP SERVICE] Amistad encontrada: ID {amistad.id}, Estado: {amistad.status}")
            
            # 5. Determinar quién es el amigo para el mensaje
            es_remitente = amistad.sender_id == usuario_actual_id
            amigo_id = amistad.receiver_id if es_remitente else amistad.sender_id
            amigo = User.query.get(amigo_id)
            
            if not amigo:
                print(f"❌ [FRIENDSHIP SERVICE] Usuario amigo no encontrado en DB: {amigo_id}")
                raise ValueError("Error al obtener información del amigo")
            
            print(f"👤 [FRIENDSHIP SERVICE] Amigo a eliminar: {amigo.name_user} (ID: {amigo.id})")
            
            # 6. Eliminar la relación de amistad
            print(f"🗑️ [FRIENDSHIP SERVICE] Eliminando relación de amistad ID: {amistad.id}...")
            db.session.delete(amistad)
            db.session.commit()
            
            print(f"✅ [FRIENDSHIP SERVICE] Amistad eliminada exitosamente")
            
            # 7. Preparar respuesta
            return {
                'success': True,
                'message': f'Has eliminado a {amigo.name_user} de tus amigos',
                'data': {
                    'deleted_friendship_id': amistad.id,
                    'friend_id': amigo.id,
                    'friend_name': amigo.name_user,
                    'friend_slug': amigo.slug,
                    'deleted_at': datetime.now().isoformat()
                }
            }
            
        except PermissionError as e:
            print(f"🔒 [FRIENDSHIP SERVICE] Error de permisos: {str(e)}")
            if 'db.session' in locals():
                db.session.rollback()
            raise e
        except ValueError as e:
            print(f"⚠️ [FRIENDSHIP SERVICE] Error de validación: {str(e)}")
            if 'db.session' in locals():
                db.session.rollback()
            raise e
        except Exception as e:
            print(f"💥 [FRIENDSHIP SERVICE] Error inesperado al eliminar amigo: {str(e)}")
            import traceback
            print(f"🔍 [FRIENDSHIP SERVICE] Traceback completo:\n{traceback.format_exc()}")
            if 'db.session' in locals():
                db.session.rollback()
            raise Exception("Error interno al eliminar amigo")