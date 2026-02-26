import os
from app.models.user_model import User
from app.utils.database import db
from datetime import datetime

class UsersService:
    
    @staticmethod
    def obtener_usuario_por_slug(slug: str) -> dict:  # ✅ Cambiado string por str
        """
        Obtener un usuario específico por SLUG con TODA la información
        """
        try:
            print(f"🔍 Obteniendo usuario por slug: {slug}")
            
            # Buscar usuario por slug
            usuario = User.query.filter_by(slug=slug).first()
            if not usuario:
                raise ValueError("Usuario no encontrado")
            
            print(f"✅ Usuario encontrado: {usuario.name_user} (Slug: {usuario.slug}, Status: {usuario.status})")
            
            # Devolver información COMPLETA del usuario
            return {
                'success': True,
                'data': UsersService._user_to_complete_dict(usuario)
            }
            
        except ValueError as e:
            print(f"❌ Usuario no encontrado: {str(e)}")
            raise e
        except Exception as e:
            print(f"❌ Error al obtener usuario por slug: {str(e)}")
            raise e

    @staticmethod
    def obtener_usuario_por_id(usuario_id: int) -> dict:  # ✅ Este método ya estaba correcto
        """
        Obtener un usuario específico por ID con TODA la información
        """
        try:
            print(f"🔍 Obteniendo usuario por ID: {usuario_id}")
            
            # Buscar usuario por ID
            usuario = User.query.get(usuario_id)
            if not usuario:
                raise ValueError("Usuario no encontrado")
            
            print(f"✅ Usuario encontrado: {usuario.name_user} (ID: {usuario.id}, Status: {usuario.status})")
            
            # Devolver información COMPLETA del usuario
            return {
                'success': True,
                'data': UsersService._user_to_complete_dict(usuario)
            }
            
        except ValueError as e:
            print(f"❌ Usuario no encontrado: {str(e)}")
            raise e
        except Exception as e:
            print(f"❌ Error al obtener usuario por ID: {str(e)}")
            raise e

    @staticmethod
    def _user_to_complete_dict(user: User) -> dict:
        """
        Convertir objeto User a diccionario COMPLETO con toda la información
        """
        # Calcular edad
        edad_calculada = None
        if user.fechanacimiento:
            hoy = datetime.now()
            edad_calculada = hoy.year - user.fechanacimiento.year - ((hoy.month, hoy.day) < (user.fechanacimiento.month, user.fechanacimiento.day))
        
        # Estructura de imágenes
        imagenes_webp = []
        if user.urlphotoperfil and user.urlphotoperfil.startswith('/utils/pictures/'):
            filename = os.path.basename(user.urlphotoperfil)
            imagen_info = {
                'id': user.id,
                'orden': 0,
                'url_webp': f"/player/{user.id}/imagen-perfil/{filename}",
                'nombre': filename,
                'formato': 'webp'
            }
            imagenes_webp.append(imagen_info)
        
        # URL accesible para compatibilidad
        url_foto_accesible = user.urlphotoperfil
        if user.urlphotoperfil and user.urlphotoperfil.startswith('/utils/pictures/'):
            filename = os.path.basename(user.urlphotoperfil)
            url_foto_accesible = f"/player/{user.id}/imagen-perfil/{filename}"
        
        return {
            # Información básica
            'id': user.id,
            'name_user': user.name_user,
            'email': user.email,
            
            # ✅ SLUG desde la base de datos
            'slug': user.slug,
            
            # Información personal
            'edad': edad_calculada,
            'fechanacimiento': user.fechanacimiento.isoformat() if user.fechanacimiento else None,
            'telephone': user.telephone,
            'city': user.city,
            
            # Información deportiva
            'sport': user.sport,
            'position': user.position,
            'biography': user.biography,
            
            # Estado y configuración
            'role': user.role,
            'status': user.status,
            'terms': user.terms,
            'is_profile_completed': user.is_profile_completed,
            
            # Fechas
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'updated_at': user.updated_at.isoformat() if user.updated_at else None,
            
            # Imágenes (nueva estructura)
            'imagenes_webp': imagenes_webp,
            
            # Compatibilidad (mantener campos anteriores)
            'urlphotoperfil': url_foto_accesible
        }

    @staticmethod
    def _user_to_basic_dict(user: User) -> dict:
        """
        Convertir objeto User a diccionario básico (para lista de usuarios)
        """
        imagenes_webp = []
        if user.urlphotoperfil and user.urlphotoperfil.startswith('/utils/pictures/'):
            filename = os.path.basename(user.urlphotoperfil)
            imagen_info = {
                'id': user.id,
                'orden': 0,
                'url_webp': f"/player/{user.id}/imagen-perfil/{filename}",
                'nombre': filename,
                'formato': 'webp'
            }
            imagenes_webp.append(imagen_info)
        
        return {
            'id': user.id,
            'name_user': user.name_user or 'Sin nombre',
            'slug': user.slug,  # ✅ Slug desde BD
            'imagenes_webp': imagenes_webp
        }

    @staticmethod
    def obtener_todos_usuarios() -> dict:
        """
        Obtener TODOS los usuarios sin filtros
        """
        try:
            print(f"🔍 Obteniendo TODOS los usuarios (sin filtros)")
            
            # Obtener TODOS los usuarios sin filtros
            usuarios = User.query.order_by(User.name_user.asc()).all()
            print(f"✅ Total de usuarios encontrados: {len(usuarios)}")
            
            # Procesar usuarios
            usuarios_formateados = []
            for usuario in usuarios:
                usuario_dict = UsersService._user_to_basic_dict(usuario)
                usuarios_formateados.append(usuario_dict)
                print(f"👤 Procesado: {usuario.name_user} (ID: {usuario.id}, Slug: {usuario.slug})")
            
            return {
                'success': True,
                'data': usuarios_formateados,
                'count': len(usuarios_formateados)
            }
            
        except Exception as e:
            print(f"❌ Error al obtener usuarios: {str(e)}")
            import traceback
            print(f"🔍 Traceback: {traceback.format_exc()}")
            raise e

    @staticmethod
    def buscar_usuarios_por_nombre(nombre: str) -> dict:
        """
        Buscar usuarios por nombre
        """
        try:
            print(f"🔍 Buscar usuarios por nombre: '{nombre}'")
            
            # Query para buscar por nombre (case insensitive)
            usuarios = User.query.filter(
                User.name_user.ilike(f'%{nombre}%')
            ).order_by(User.name_user.asc()).all()
            
            print(f"✅ Encontrados {len(usuarios)} usuarios para búsqueda: '{nombre}'")
            
            # Procesar usuarios (solo información básica para búsqueda)
            usuarios_formateados = []
            for usuario in usuarios:
                usuario_dict = UsersService._user_to_basic_dict(usuario)
                usuarios_formateados.append(usuario_dict)
            
            return {
                'success': True,
                'data': usuarios_formateados,
                'count': len(usuarios_formateados),
                'busqueda': nombre
            }
            
        except Exception as e:
            print(f"❌ Error al buscar usuarios: {str(e)}")
            raise e