// src/types/notifications.ts
export type NotificationType = 'friend_request' | 'match_invitation' | 'reservation_confirmation' | 'system';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    senderId?: string;
    senderName?: string;
    senderAvatar?: string;
    relatedId?: string; // ID relacionado (ej: reserva, partido, etc)
    isRead: boolean;
    createdAt: Date;
    expiresAt?: Date;
}

export interface FriendRequestNotification extends Notification {
    type: 'friend_request';
    senderId: string;
    senderName: string;
    senderAvatar?: string;
}