from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time, DateTime, func
from sqlalchemy.orm import relationship
from app.db.session import Base
from decimal import Decimal

class Reserva(Base):
    __tablename__ = 'reservas'
    
    id = Column(Integer, primary_key=True, index=True)
    cancha_id = Column(Integer, ForeignKey('canchas.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    fecha = Column(Date, nullable=False)
    hora = Column(Time, nullable=False)
    estado = Column(String(20), default='pendiente') # 'pendiente', 'confirmada', 'cancelada'
    created_at = Column(DateTime, server_default=func.now())
    
    # Relaciones
    cancha = relationship('Cancha', back_populates='reservas')
    usuario = relationship('User', backref='reservas')