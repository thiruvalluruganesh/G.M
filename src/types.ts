export interface UserProfile {
  id: string;
  username: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: string;
  isSharingLiveLocation?: boolean;
  liveLocationCoords?: { lat: number; lng: number };
  liveDurationHours?: number;
  geo?: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
}

export interface MessageReaction {
  emoji: string;
  username: string;
  userId: string;
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
  
  // View Once & Expiration Features
  isViewOnce?: boolean;
  viewed?: boolean;
  expiresAt?: string; // For 24-hour expiring messages
  mediaUrl?: string;  // Simulated attachment image option
  mediaType?: 'image' | 'video' | 'audio';
  audioDuration?: number;

  // Reply Structure
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };

  // Reactions List
  reactions?: MessageReaction[];

  // Dynamic Read Receipts (Group/1:1 detail)
  readBy?: {
    userId: string;
    username: string;
    avatar: string;
    timestamp: string;
  }[];
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
  isLiveSharingActive?: boolean; // Matches 1000124867.png live status text
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
  isCloseFriendsOnly?: boolean; // Gem Circles support
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
