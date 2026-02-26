from app.models.reserva import Reserva
from app.models.cancha import Cancha
from app.models.horario_cancha import HorarioCancha
from app.utils.database import db
from app.utils.auth_utils import obtener_usuario_desde_token
from datetime import datetime, date, time, timedelta
import calendar

class ReservaService:

    @staticmethod
    def _obtener_dia_semana(fecha):
        """Obtener el día de la semana en español"""
        dias_map = {
            'monday': 'lunes',
            'tuesday': 'martes', 
            'wednesday': 'miercoles',
            'thursday': 'jueves',
            'friday': 'viernes',
            'saturday': 'sabado',
            'sunday': 'domingo'
        }
        dia_semana = calendar.day_name[fecha.weekday()].lower()
        return dias_map.get(dia_semana)

    @staticmethod
    def crear_reserva(data):
        """
        Crear una nueva reserva - CORREGIDO para permitir reservas del mismo día
        """
        try:
            # Obtener usuario autenticado desde el token
            usuario, error, status = obtener_usuario_desde_token()
            if error:
                raise PermissionError("Usuario no autenticado")

            print(f"👤 Usuario haciendo reserva: {usuario.email}")
            
            # Validar datos requeridos
            if not all(key in data for key in ['cancha_id', 'fecha', 'hora']):
                raise ValueError("Datos incompletos: se requieren cancha_id, fecha y hora")
            
            fecha = datetime.strptime(data['fecha'], '%Y-%m-%d').date()
            hora_solicitada = datetime.strptime(data['hora'], '%H:%M').time().replace(second=0)
            cancha_id = data['cancha_id']

            # ✅ VERIFICACIÓN CORREGIDA: Permitir reservas del mismo día para horarios FUTUROS
            ahora = datetime.now()
            fecha_hora_solicitada = datetime.combine(fecha, hora_solicitada)
            
            # Si es una fecha pasada (días anteriores)
            if fecha < ahora.date():
                raise ValueError("No se pueden hacer reservas para fechas pasadas")
            
            # Si es el mismo día pero la hora ya pasó
            if fecha == ahora.date() and hora_solicitada <= ahora.time():
                raise ValueError("No se pueden hacer reservas para horarios que ya han pasado hoy")

            print(f"✅ Fecha/hora válida: {fecha} {hora_solicitada} (ahora: {ahora})")

            # Verificar si ya tiene reserva para este día
            reserva_existente = Reserva.query.filter_by(
                user_id=usuario.id, 
                fecha=fecha,
                estado='confirmada'
            ).first()
            
            if reserva_existente:
                raise ValueError("Ya tienes una reserva confirmada para este día")

            # Verificar si la cancha existe
            cancha = Cancha.query.get(cancha_id)
            if not cancha:
                raise ValueError("Cancha no encontrada")

            # Verificar si el horario está disponible según los rangos configurados
            dia_semana = ReservaService._obtener_dia_semana(fecha)
            if not ReservaService._verificar_disponibilidad_horario(cancha_id, dia_semana, hora_solicitada, fecha):
                raise ValueError(f"El horario {hora_solicitada.strftime('%H:%M')} no está disponible para {dia_semana}")

            # Verificar si ya existe una reserva en ese horario
            reserva_existente = Reserva.query.filter_by(
                cancha_id=cancha_id,
                fecha=fecha,
                hora=hora_solicitada,
                estado='confirmada'
            ).first()
            
            if reserva_existente:
                raise ValueError("Ya existe una reserva confirmada en ese horario")

            # Crear reserva
            nueva_reserva = Reserva(
                cancha_id=cancha_id,
                user_id=usuario.id,
                fecha=fecha,
                hora=hora_solicitada,
                estado='confirmada'
            )

            db.session.add(nueva_reserva)
            db.session.commit()
            
            print(f"✅ Reserva creada exitosamente: ID {nueva_reserva.id}, Cancha {cancha_id}, Fecha {fecha}, Hora {hora_solicitada}")
            return nueva_reserva
            
        except PermissionError as e:
            db.session.rollback()
            raise e
        except ValueError as e:
            db.session.rollback()
            raise e
        except Exception as e:
            db.session.rollback()
            print(f"💥 Error al crear reserva: {str(e)}")
            import traceback
            print(f"🔍 Traceback completo: {traceback.format_exc()}")
            raise Exception("Error interno al crear la reserva")

    @staticmethod
    def _verificar_disponibilidad_horario(cancha_id, dia_semana, hora_solicitada, fecha):
        """
        Verificar si un horario está disponible según los rangos configurados
        """
        horarios_rango = HorarioCancha.query.filter_by(
            cancha_id=cancha_id,
            dia_semana=dia_semana,
            disponible=True
        ).all()

        for horario in horarios_rango:
            if ReservaService._hora_en_rango(hora_solicitada, horario.hora_inicio, horario.hora_fin, horario.intervalo_minutos, fecha):
                return True
        
        return False

    @staticmethod
    def _hora_en_rango(hora_solicitada, hora_inicio, hora_fin, intervalo_minutos, fecha):
        """
        Verificar si una hora específica está dentro de un rango considerando el intervalo
        Y si no ha pasado la fecha/hora
        """
        ahora = datetime.now()
        fecha_hora_solicitada = datetime.combine(fecha, hora_solicitada)
        
        # ✅ LÓGICA CORREGIDA: Solo bloquear si es fecha pasada o mismo día con hora pasada
        if fecha < ahora.date():
            print(f"❌ Fecha bloqueada: {fecha} es una fecha pasada")
            return False
            
        if fecha == ahora.date() and hora_solicitada <= ahora.time():
            print(f"❌ Horario bloqueado: {hora_solicitada} ya pasó hoy")
            return False

        hora_solicitada_dt = datetime.combine(datetime.today(), hora_solicitada)
        inicio_dt = datetime.combine(datetime.today(), hora_inicio)
        fin_dt = datetime.combine(datetime.today(), hora_fin)

        # Validar rango principal
        if not (inicio_dt <= hora_solicitada_dt < fin_dt):
            print(f"❌ Horario {hora_solicitada} fuera del rango {hora_inicio}-{hora_fin}")
            return False

        # Validar intervalos
        tiempo_desde_inicio = hora_solicitada_dt - inicio_dt
        minutos_desde_inicio = tiempo_desde_inicio.total_seconds() / 60
        
        es_valido_intervalo = minutos_desde_inicio % intervalo_minutos == 0
        if not es_valido_intervalo:
            print(f"❌ Horario {hora_solicitada} no coincide con intervalo de {intervalo_minutos}min")
        
        return es_valido_intervalo

    @staticmethod
    def obtener_horarios_disponibles(cancha_id, fecha):
        """
        Obtener horarios disponibles para una cancha en una fecha específica
        NO INCLUYE HORARIOS QUE YA PASARON
        """
        try:
            fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
            dia_semana = ReservaService._obtener_dia_semana(fecha_obj)
            
            print(f"🔍 Buscando horarios para cancha {cancha_id}, fecha {fecha}, día {dia_semana}")
            
            # Obtener rangos de horarios configurados
            horarios_rango = HorarioCancha.query.filter_by(
                cancha_id=cancha_id,
                dia_semana=dia_semana,
                disponible=True
            ).all()
            
            if not horarios_rango:
                print(f"❌ No hay horarios configurados para {dia_semana}")
                return []
            
            horarios_disponibles = []
            ahora = datetime.now()
            
            for horario in horarios_rango:
                print(f"📅 Procesando rango: {horario.hora_inicio} - {horario.hora_fin}, intervalo: {horario.intervalo_minutos}min")
                
                # Generar horarios dentro del rango según el intervalo
                hora_actual = horario.hora_inicio
                while hora_actual < horario.hora_fin:
                    fecha_hora_completa = datetime.combine(fecha_obj, hora_actual)
                    
                    # ✅ LÓGICA CORREGIDA: Solo excluir si es fecha pasada o mismo día con hora pasada
                    es_valido = True
                    
                    if fecha_obj < ahora.date():
                        es_valido = False
                        print(f"❌ Excluyendo {hora_actual}: fecha pasada")
                    elif fecha_obj == ahora.date() and hora_actual <= ahora.time():
                        es_valido = False
                        print(f"❌ Excluyendo {hora_actual}: hora pasada hoy")
                    
                    if es_valido:
                        # Verificar si no hay reserva en este horario
                        reserva_existente = Reserva.query.filter_by(
                            cancha_id=cancha_id,
                            fecha=fecha_obj,
                            hora=hora_actual,
                            estado='confirmada'
                        ).first()
                        
                        if not reserva_existente:
                            horarios_disponibles.append({
                                'hora': hora_actual.strftime('%H:%M'),
                                'disponible': True,
                                'intervalo': horario.intervalo_minutos
                            })
                            print(f"✅ Hora disponible: {hora_actual}")
                        else:
                            print(f"⏰ Hora {hora_actual} ya reservada")
                    
                    # Siguiente intervalo
                    hora_actual = (datetime.combine(date.today(), hora_actual) + 
                                 timedelta(minutes=horario.intervalo_minutos)).time()
            
            # Ordenar horarios
            horarios_disponibles.sort(key=lambda x: x['hora'])
            
            print(f"✅ Horarios disponibles encontrados: {len(horarios_disponibles)}")
            return horarios_disponibles
            
        except Exception as e:
            print(f"💥 Error al obtener horarios disponibles: {str(e)}")
            import traceback
            print(f"🔍 Traceback: {traceback.format_exc()}")
            return []

    @staticmethod
    def actualizar_estado_reserva(reserva):
        """
        Validar si la reserva ya pasó y cambiar estado a 'finalizado'
        """
        try:
            ahora = datetime.now()
            fecha_hora_reserva = datetime.combine(reserva.fecha, reserva.hora)
            
            # Si la fecha/hora de reserva es anterior a ahora, cambiar a finalizado
            if fecha_hora_reserva < ahora and reserva.estado == 'confirmada':
                reserva.estado = 'finalizado'
                print(f"✅ Reserva {reserva.id} actualizada a 'finalizado' (fecha: {reserva.fecha} {reserva.hora})")
                return True
                
            return False
            
        except Exception as e:
            print(f"💥 Error al actualizar estado de reserva {reserva.id}: {str(e)}")
            return False

    @staticmethod
    def obtener_todas_las_reservas_usuario():
        """
        Obtener TODAS las reservas del usuario autenticado sin filtros
        CON VALIDACIÓN AUTOMÁTICA DE ESTADO
        """
        try:
            print(f"🔍 Obteniendo TODAS las reservas del usuario")
            
            # Obtener usuario desde el token
            usuario, error, status = obtener_usuario_desde_token()
            if error:
                raise PermissionError("Usuario no autenticado")
            
            print(f"👤 Usuario: {usuario.email} (ID: {usuario.id})")
            
            # Obtener TODAS las reservas del usuario sin filtros
            reservas = Reserva.query.filter_by(
                user_id=usuario.id
            ).order_by(
                Reserva.fecha.desc(),  # Fecha más reciente primero
                Reserva.hora.desc()    # Hora más reciente primero
            ).all()
            
            print(f"📊 Total de reservas encontradas: {len(reservas)}")
            
            # Validar y actualizar estados de cada reserva
            reservas_actualizadas = 0
            for reserva in reservas:
                if ReservaService.actualizar_estado_reserva(reserva):
                    reservas_actualizadas += 1
            
            # Guardar cambios si hubo actualizaciones
            if reservas_actualizadas > 0:
                db.session.commit()
                print(f"📈 {reservas_actualizadas} reservas actualizadas a 'finalizado'")
            
            # Preparar respuesta con información completa
            reservas_formateadas = []
            for reserva in reservas:
                reserva_info = {
                    'id': reserva.id,
                    'cancha_id': reserva.cancha_id,
                    'fecha': reserva.fecha.isoformat(),
                    'hora': reserva.hora.strftime('%H:%M'),
                    'estado': reserva.estado,
                    'created_at': reserva.created_at.isoformat() if reserva.created_at else None
                }
                
                # Agregar información COMPLETA de la cancha
                if reserva.cancha:
                    reserva_info['cancha'] = {
                        'id': reserva.cancha.id,
                        'nombre': reserva.cancha.nombre,
                        'tipo': reserva.cancha.tipo,
                        'subtipo': reserva.cancha.subtipo,
                        'direccion': reserva.cancha.direccion,
                        'direccion_completa': reserva.cancha.direccion_completa,
                        'superficie': reserva.cancha.superficie,
                        'capacidad': reserva.cancha.capacidad,
                        'precio_hora': float(reserva.cancha.precio_hora) if reserva.cancha.precio_hora else None,
                        'descripcion': reserva.cancha.descripcion,
                        'estado': reserva.cancha.estado
                    }
                
                reservas_formateadas.append(reserva_info)
                print(f"📅 Reserva {reserva.id}: {reserva.fecha} {reserva.hora.strftime('%H:%M')} - Estado: {reserva.estado}")
            
            print(f"✅ Retornando {len(reservas_formateadas)} reservas para el usuario {usuario.email}")
            return reservas_formateadas
            
        except PermissionError as e:
            print(f"❌ Error de autenticación: {str(e)}")
            raise e
        except Exception as e:
            print(f"💥 Error al obtener todas las reservas del usuario: {str(e)}")
            import traceback
            print(f"🔍 Traceback: {traceback.format_exc()}")
            raise Exception("Error interno al obtener las reservas")

    @staticmethod
    def cancelar_reserva(reserva_id: int):
        """
        Cancelar una reserva específica del usuario
        """
        try:
            print(f"🗑️ Intentando cancelar reserva ID: {reserva_id}")
            
            # Obtener usuario desde el token
            usuario, error, status = obtener_usuario_desde_token()
            if error:
                raise PermissionError("Usuario no autenticado")
            
            print(f"👤 Usuario intentando cancelar: {usuario.email} (ID: {usuario.id})")
            
            # Buscar la reserva
            reserva = Reserva.query.get(reserva_id)
            if not reserva:
                raise ValueError("Reserva no encontrada")
            
            # Verificar que el usuario es el dueño de la reserva
            if reserva.user_id != usuario.id:
                raise PermissionError("No tienes permisos para cancelar esta reserva")
            
            # Verificar que la reserva no esté ya cancelada
            if reserva.estado == 'cancelada':
                raise ValueError("La reserva ya está cancelada")
            
            # ✅ NUEVO: Verificar que no sea demasiado tarde para cancelar
            ahora = datetime.now()
            fecha_hora_reserva = datetime.combine(reserva.fecha, reserva.hora)
            diferencia = fecha_hora_reserva - ahora
            
            # Si la reserva es en menos de 2 horas, no se puede cancelar
            if diferencia.total_seconds() < 7200:  # 2 horas en segundos
                raise ValueError("No se puede cancelar la reserva con menos de 2 horas de anticipación")
            
            # Cambiar estado a cancelada
            reserva.estado = 'cancelada'
            db.session.commit()
            
            print(f"✅ Reserva {reserva_id} cancelada exitosamente por usuario {usuario.email}")
            
            # Preparar respuesta
            reserva_cancelada = {
                'id': reserva.id,
                'cancha_id': reserva.cancha_id,
                'fecha': reserva.fecha.isoformat(),
                'hora': reserva.hora.strftime('%H:%M'),
                'estado': reserva.estado,
                'cancelada_at': datetime.now().isoformat(),
                'cancha': {
                    'id': reserva.cancha.id,
                    'nombre': reserva.cancha.nombre,
                    'tipo': reserva.cancha.tipo
                } if reserva.cancha else None
            }
            
            return reserva_cancelada
            
        except PermissionError as e:
            print(f"❌ Error de permisos al cancelar reserva: {str(e)}")
            raise e
        except ValueError as e:
            print(f"❌ Error de validación al cancelar reserva: {str(e)}")
            raise e
        except Exception as e:
            print(f"💥 Error interno al cancelar reserva: {str(e)}")
            db.session.rollback()
            raise Exception("Error interno al cancelar la reserva")