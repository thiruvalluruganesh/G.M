import { UserProfile, ChatThread, EphemeralStory, GeoMarker } from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'user_me',
  username: 'alex_gem',
  name: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  status: 'online',
  geo: {
    lat: 37.7749,
    lng: -122.4194,
    updatedAt: new Date().toISOString(),
  }
};

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user_1',
    username: 'luna_wave',
    name: 'Luna Sterling',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'online',
  },
  {
    id: 'user_2',
    username: 'kai_zen',
    name: 'Kai Takahashi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'away',
  },
  {
    id: 'user_3',
    username: 'sol_pixel',
    name: 'Solomon Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'online',
  },
  {
    id: 'user_4',
    username: 'mia_grid',
    name: 'Mia Sterling',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'offline',
    lastSeen: '2h ago',
  }
];

export const INITIAL_CHATS: ChatThread[] = [
  {
    id: 'chat_group_1',
    name: '⚡ SOMA Core Crew',
    avatar: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=150&auto=format&fit=crop&q=80',
    type: 'group',
    members: ['user_me', 'user_1', 'user_2', 'user_3'],
    unreadCount: 2,
    lastMessageTimestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
    typingUsers: [],
    messages: [
      {
        id: 'msg_g1',
        chatId: 'chat_group_1',
        senderId: 'user_2',
        senderName: 'Kai Takahashi',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Who is skating near the SOMA intersection later? The sunset light is going to be amazing for filming.',
        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        status: 'read'
      },
      {
        id: 'msg_g2',
        chatId: 'chat_group_1',
        senderId: 'user_1',
        senderName: 'Luna Sterling',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'Count me in! I just dropped a geo-tagged story preview near South Park. Let’s meet there at 6!',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: 'read'
      },
      {
        id: 'msg_g3',
        chatId: 'chat_group_1',
        senderId: 'user_3',
        senderName: 'Solomon Vance',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        text: 'I just uploaded an invitation card event marker! Press on the South Park spot on map for details.',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        status: 'delivered'
      }
    ]
  },
  {
    id: 'chat_1',
    name: 'Luna Sterling',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    type: '1:1',
    members: ['user_me', 'user_1'],
    unreadCount: 0,
    lastMessageTimestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    messages: [
      {
        id: 'msg_l1',
        chatId: 'chat_1',
        senderId: 'user_me',
        senderName: 'Alex Rivera',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'Hey Luna, loved your dynamic coordinates story! Did you take that on film?',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        status: 'read'
      },
      {
        id: 'msg_l2',
        chatId: 'chat_1',
        senderId: 'user_1',
        senderName: 'Luna Sterling',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'Yes! Leica M6 + Portra 400. Scan came back amazing. Just tagged it on the GM map.',
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        status: 'read'
      }
    ]
  },
  {
    id: 'chat_2',
    name: 'Kai Takahashi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: '1:1',
    members: ['user_me', 'user_2'],
    unreadCount: 0,
    lastMessageTimestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    messages: [
      {
        id: 'msg_k1',
        chatId: 'chat_2',
        senderId: 'user_2',
        senderName: 'Kai Takahashi',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Check out the ephemeral stream. I set a lock radius around the pier.',
        timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
        status: 'read'
      },
      {
        id: 'msg_k2',
        chatId: 'chat_2',
        senderId: 'user_me',
        senderName: 'Alex Rivera',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'Sick, arriving within the boundary in 15 mins to unlock.',
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        status: 'read'
      }
    ]
  }
];

export const INITIAL_STORIES: EphemeralStory[] = [
  {
    id: 'story_1',
    userId: 'user_1',
    username: 'luna_wave',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&auto=format&fit=crop&q=80',
    caption: 'Chasing golden hour rays near South Park 🌅',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // 40m ago
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
    viewsCount: 34,
    geo: {
      lat: 37.7814,
      lng: -122.3934,
      locationName: 'South Park, SOMA'
    }
  },
  {
    id: 'story_2',
    userId: 'user_2',
    username: 'kai_zen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?w=600&auto=format&fit=crop&q=80',
    caption: 'Back Alley Reels testing standard lens. 🛹',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    viewsCount: 68,
    geo: {
      lat: 37.7770,
      lng: -122.4080,
      locationName: 'SOMA Skatepark'
    }
  },
  {
    id: 'story_3',
    userId: 'user_3',
    username: 'sol_pixel',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    mediaType: 'text_gradient',
    bgGradient: 'from-fuchsia-600 to-pink-500',
    content: '🚨 ROOFTOP POP-UP LIVE IN 2 HOURS. Exclusive tech demos. Unlock location on the GM tab!',
    caption: 'First 50 users unlock premium tokens.',
    createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 20.5 * 60 * 60 * 1000).toISOString(),
    viewsCount: 142,
    geo: {
      lat: 37.7845,
      lng: -122.4020,
      locationName: 'Modernist Rooftop SOMA'
    }
  }
];

export const INITIAL_MARKERS: GeoMarker[] = [
  {
    id: 'marker_1',
    lat: 37.7814,
    lng: -122.3934,
    title: 'Luna’s Golden Hour Story',
    description: 'Chasing sunset beams relative to local high-rises.',
    type: 'media',
    creatorId: 'user_1',
    creatorName: 'Luna Sterling',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    likes: 12
  },
  {
    id: 'marker_2',
    lat: 37.7770,
    lng: -122.4080,
    title: 'SOMA Skate Jam Feed',
    description: 'Ephemeral live video feed tracking SOMA kickflip challenge.',
    type: 'media',
    creatorId: 'user_2',
    creatorName: 'Kai Takahashi',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 45
  },
  {
    id: 'marker_3',
    lat: 37.7845,
    lng: -122.4020,
    title: 'Rooftop Tech Pop-up',
    description: 'Exclusive hardware and applet demos hosted by Solana. Boundary unlocks 50m.',
    type: 'event',
    creatorId: 'user_3',
    creatorName: 'Solomon Vance',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
    likes: 89
  },
  {
    id: 'marker_4',
    lat: 37.7715,
    lng: -122.3965,
    title: 'Third Street Art Exhibit',
    description: 'Ephemeral micro-gallery featuring cyber-noir photography.',
    type: 'event',
    creatorId: 'user_4',
    creatorName: 'Mia Sterling',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 56
  }
];
