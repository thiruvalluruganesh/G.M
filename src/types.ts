export interface UserProfile {
  id: string;
  username: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: string;
  geo?: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  type: '1:1' | 'group';
  members: string[];
  messages: Message[];
  unreadCount: number;
  lastMessageTimestamp: string;
  typingUsers?: string[];
}

export interface EphemeralStory {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  mediaType: 'image' | 'text_gradient';
  mediaUrl?: string;
  content?: string;
  bgGradient?: string;
  caption?: string;
  createdAt: string;
  expiresAt: string;
  geo?: {
    lat: number;
    lng: number;
    locationName: string;
  };
  viewsCount: number;
}

export interface GeoMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  type: 'media' | 'event' | 'ping';
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  thumbnailUrl?: string;
  createdAt: string;
  likes: number;
}

export interface WsLogEntry {
  id: string;
  timestamp: string;
  direction: 'client_to_server' | 'server_to_client';
  event: string;
  payload: Record<string, any>;
}
