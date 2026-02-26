// src/data/socialData.ts

interface Usuario {
    nombre: string;
    avatar: string;
    equipo: string;
}

interface Post {
    id: number;
    usuario: Usuario;
    contenido: string;
    imagen?: string;
    fecha: string;
    comentarios: number;
    likes: number;
    esPromocion: boolean;
}

interface Sponsor {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    enlace: string;
}

interface Evento {
    id: number;
    nombre: string;
    fecha: string;
    deporte: string;
    ubicacion: string;
}

export const publicaciones: Post[] = [
    {
        id: 1,
        usuario: {
            nombre: "Carlos Mendoza",
            avatar: "/avatar1.jpg",
            equipo: "Los Halcones FC"
        },
        contenido: "¡Gran victoria hoy 3-2 contra Los Cóndores! ⚽ Dos goles míos y uno de @juanperez. #Fútbol #Victoria",
        imagen: "/partido-futbol.jpg",
        fecha: "Hace 2 horas",
        comentarios: 12,
        likes: 45,
        esPromocion: false
    },
    {
        id: 2,
        usuario: {
            nombre: "Liga Regional",
            avatar: "/liga-avatar.jpg",
            equipo: "Liga de Fútbol"
        },
        contenido: "🚨 Abiertas inscripciones para el Torneo Verano 2025. Premio en efectivo para los primeros 3 lugares. ¡Inscríbanse ya!",
        imagen: "/torneo-verano.jpg",
        fecha: "Hace 5 horas",
        comentarios: 8,
        likes: 32,
        esPromocion: true
    },
    {
        id: 3,
        usuario: {
            nombre: "María Gómez",
            avatar: "/avatar2.jpg",
            equipo: "Volley Pro"
        },
        contenido: "Nuevo récord personal: 15 puntos en un set. Gracias al equipo por el apoyo. 🏐 #Voleibol #Superación",
        imagen: "/voleibol.jpg",
        fecha: "Ayer",
        comentarios: 5,
        likes: 28,
        esPromocion: false
    },
    {
        id: 4,
        usuario: {
            nombre: "Pedro Rodríguez",
            avatar: "/avatar3.jpg",
            equipo: "Runners Bogotá"
        },
        contenido: "Completados 21km en el medio maratón de la ciudad. ¡Tiempo personal de 1:38:42! #Running #Maratón",
        imagen: "/maraton.jpg",
        fecha: "Hace 3 días",
        comentarios: 15,
        likes: 64,
        esPromocion: false
    }
];

export const anuncios: Sponsor[] = [
    {
        id: 1,
        titulo: "Nuevos Botines Adidas 2025",
        descripcion: "30% de descuento para miembros registrados. Usa el código: DEPORTE25",
        imagen: "/anuncio-adidas.jpg",
        enlace: "#"
    },
    {
        id: 2,
        titulo: "Hidrátate con Gatorade",
        descripcion: "Bebida oficial de los deportistas profesionales",
        imagen: "/anuncio-gatorade.jpg",
        enlace: "#"
    },
    {
        id: 3,
        titulo: "Entrenamiento Personalizado",
        descripcion: "Mejora tu rendimiento con nuestros entrenadores certificados",
        imagen: "/anuncio-entrenamiento.jpg",
        enlace: "#"
    }
];

export const eventos: Evento[] = [
    {
        id: 1,
        nombre: "Torneo Interclubes",
        fecha: "2025-07-25",
        deporte: "Fútbol",
        ubicacion: "Estadio Municipal"
    },
    {
        id: 2,
        nombre: "Clínica de Voleibol",
        fecha: "2025-08-02",
        deporte: "Voleibol",
        ubicacion: "Polideportivo Central"
    },
    {
        id: 3,
        nombre: "Carrera 10K Nocturna",
        fecha: "2025-08-15",
        deporte: "Atletismo",
        ubicacion: "Parque Metropolitano"
    }
];

export const comunidades = [
    {
        nombre: "Liga de Fútbol Amateur",
        miembros: "1.2K",
        deporte: "Fútbol"
    },
    {
        nombre: "Club Voleibol Bogotá",
        miembros: "856",
        deporte: "Voleibol"
    },
    {
        nombre: "Corredores Capital",
        miembros: "3.4K",
        deporte: "Running"
    },
    {
        nombre: "Ciclistas Urbanos",
        miembros: "2.1K",
        deporte: "Ciclismo"
    }
];