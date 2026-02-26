export interface Post {
    id: number;
    contenido: string;
    imagen_url: string | null;
    imagen_url_accesible?: string | null;
    tipo_post: 'foto' | 'texto';
    total_likes: number;
    total_comentarios: number;
    created_at: string;
    usuario: {
        name_user: string;
        email: string;
        urlphotoperfil: string | null;
    };
}
