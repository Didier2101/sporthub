from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Date, func
from app.db.session import Base
import re
import unicodedata
from enum import Enum as PyEnum

class Genero(str, PyEnum):
    masculino = "masculino"
    femenino = "femenino"
    otro = "otro"

class LadoDominante(str, PyEnum):
    izquierda = "izquierda"
    derecha = "derecha"
    ambas = "ambas"

class EstadoUsuario(str, PyEnum):
    activo = "activo"
    inactivo = "inactivo"
    lesion = "lesion"

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default='user') # 'user', 'admin', etc.
    terms = Column(Boolean, nullable=False, default=True)
    is_profile_completed = Column(Boolean, default=False)
    status = Column(Boolean, default=True)
    
    # Perfil Básico
    name_user = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=True)
    urlphotoperfil = Column(String(255), nullable=True)
    telephone = Column(String(50), nullable=True)
    city = Column(String(255), nullable=True)
    biography = Column(String(500), nullable=True)
    fechanacimiento = Column(Date, nullable=True)
    
    # Datos Deportivos (Anteriormente en Player)
    sport = Column(String(100), nullable=True)
    position = Column(String(100), nullable=True)
    pierna_dominante = Column(Enum(LadoDominante), nullable=True)
    mano_dominante = Column(Enum(LadoDominante), nullable=True)
    genero = Column(Enum(Genero), nullable=True)
    altura = Column(Integer, nullable=True) # cm
    peso = Column(Integer, nullable=True)   # kg
    estado_fisico = Column(Enum(EstadoUsuario), nullable=True)
    
    # Datos de Propietario/Admin (Anteriormente en Owner)
    nombre_administrador = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f'<User {self.email}>'

    @staticmethod
    def _generar_slug(nombre: str) -> str:
        if not nombre:
            return "usuario"
        slug = nombre.lower()
        slug = unicodedata.normalize('NFKD', slug).encode('ascii', 'ignore').decode('ascii')
        slug = re.sub(r'[^a-z0-9\s-]', '', slug)
        slug = re.sub(r'[\s-]+', '-', slug)
        slug = re.sub(r'^-+|-+$', '', slug)
        return slug or "usuario"

    def generar_y_guardar_slug(self):
        self.slug = self._generar_slug(self.name_user)
        return self.slug