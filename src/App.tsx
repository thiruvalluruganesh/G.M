import React, { useState } from 'react';
import { ViewportSim } from './components/ViewportSim';
import { ArchitectBoard } from './components/ArchitectBoard';
import { UnifiedDashboard } from './components/UnifiedDashboard';
import { 
  INITIAL_CHATS, 
  INITIAL_STORIES, 
  INITIAL_MARKERS, 
  CURRENT_USER 
} from './data/mockData';
import { ChatThread, EphemeralStory, GeoMarker, WsLogEntry, Message } from './types';
import { 
  Sparkles, 
  Layers, 
  Cpu, 
  Tv, 
  Compass, 
  ChevronRight, 
  ArrowUpRight,
  Shield, 
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Global states for high fidelity interactivity
  const [chats, setChats] = useState<ChatThread[]>(INITIAL_CHATS);
  const [stories, setStories] = useState<EphemeralStory[]>(INITIAL_STORIES);
  const [markers, setMarkers] = useState<GeoMarker[]>(INITIAL_MARKERS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  // Tab control for mobile view responsive stacking
  const [activeLayoutCol, setActiveLayoutCol] = useState<'showcase' | 'dashboard' | 'both' | 'sim' | 'spec'>('showcase');

  const [projectMilestoneProgress, setProjectMilestoneProgress] = useState<number>(75);

  // WebSocket Log telemetry triggers
  const [wsLogs, setWsLogs] = useState<WsLogEntry[]>([
    {
      id: 'log_0',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      direction: 'server_to_client',
      event: 'connection:handshake',
      payload: { 
        status: 'authorized', 
        assignedPipe: 'GM-WS-PIPE-09', 
        user: CURRENT_USER.username,
        activeNode: 'us-west-edge-04',
        latencyMs: 14 
      }
    },
    {
      id: 'log_1',
      timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      direction: 'server_to_client',
      event: 'presence:broadcast',
      payload: { 
        activePeersCount: 4, 
        nearbyHotspotsCount: 3, 
        centerGeofence: 'SOMA_District_SF' 
      }
    }
  ]);

  const addWsLog = (entry: WsLogEntry) => {
    setWsLogs((prev) => [...prev, entry]);
  };

  // 1. Action: Client Sends Message
  const handleSendMessage = (
    chatId: string, 
    text: string, 
    options?: {
      isViewOnce?: boolean;
      mediaUrl?: string;
      mediaType?: 'image' | 'video' | 'audio';
      audioDuration?: number;
      expiresAt?: string;
      replyTo?: { id: string; senderName: string; text: string };
    }
  ) => {
    const timestampStr = new Date().toISOString();
    
    // Create new client message
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      senderAvatar: CURRENT_USER.avatar,
      text,
      timestamp: timestampStr,
      status: 'sent',
      isViewOnce: options?.isViewOnce,
      viewed: false,
      mediaUrl: options?.mediaUrl,
      mediaType: options?.mediaType,
      audioDuration: options?.audioDuration,
      expiresAt: options?.expiresAt,
      replyTo: options?.replyTo,
      reactions: []
    };

    // Log client transmission payload
    const logSend: WsLogEntry = {
      id: `log_${Date.now()}_send`,
      timestamp: timestampStr,
      direction: 'client_to_server',
      event: options?.isViewOnce ? 'chat:view_once_transmit' : 'chat:message_send',
      payload: { 
        chatId, 
        text: options?.isViewOnce ? '[🔒 Secure View Once Media]' : text, 
        senderId: CURRENT_USER.id, 
        recipientCount: 3,
        signature: 'AES256_GCM_P_12',
        isViewOnce: !!options?.isViewOnce,
        expiresAt: options?.expiresAt || 'null',
        repliedToMessage: options?.replyTo ? options.replyTo.id : 'none'
      }
    };
    addWsLog(logSend);

    // Update state & append message
    setChats((prevChats) => {
      const updated = prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            unreadCount: 0,
            lastMessageTimestamp: timestampStr,
            messages: [...chat.messages, newMsg]
          };
        }
        return chat;
      });
      return updated;
    });

    // Simulate multi-stage read receipts from counterparts
    const targetChat = chats.find(c => c.id === chatId);
    const isGroup = targetChat?.type === 'group';

    if (isGroup) {
      // Stage 1: Solomon reads message (400ms)
      setTimeout(() => {
        setChats((prevChats) => {
          return prevChats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: chat.messages.map((m) => {
                  if (m.id === newMsg.id) {
                    const currentRead = m.readBy || [];
                    return {
                      ...m,
                      status: 'delivered' as const,
                      readBy: [...currentRead, {
                        userId: 'user_3',
                        username: 'sol_pixel',
                        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                        timestamp: new Date().toISOString()
                      }]
                    };
                  }
                  return m;
                })
              };
            }
            return chat;
          });
        });
        addWsLog({
          id: `log_receipt_${Date.now()}_sol`,
          timestamp: new Date().toISOString(),
          direction: 'server_to_client',
          event: 'chat:read_receipt_ack',
          payload: { chatId, messageId: newMsg.id, userId: 'user_3', name: 'Solomon Vance' }
        });
      }, 500);

      // Stage 2: Luna reads message & updates message status to 'read' (1200ms)
      setTimeout(() => {
        setChats((prevChats) => {
          return prevChats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: chat.messages.map((m) => {
                  if (m.id === newMsg.id) {
                    const currentRead = m.readBy || [];
                    return {
                      ...m,
                      status: 'read' as const,
                      readBy: [...currentRead, {
                        userId: 'user_1',
                        username: 'luna_wave',
                        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                        timestamp: new Date().toISOString()
                      }]
                    };
                  }
                  return m;
                })
              };
            }
            return chat;
          });
        });
        addWsLog({
          id: `log_receipt_${Date.now()}_luna`,
          timestamp: new Date().toISOString(),
          direction: 'server_to_client',
          event: 'chat:read_receipt_ack',
          payload: { chatId, messageId: newMsg.id, userId: 'user_1', name: 'Luna Sterling' }
        });
      }, 1200);

      // Stage 3: Kai reads message (2000ms)
      setTimeout(() => {
        setChats((prevChats) => {
          return prevChats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: chat.messages.map((m) => {
                  if (m.id === newMsg.id) {
                    const currentRead = m.readBy || [];
                    return {
                      ...m,
                      readBy: [...currentRead, {
                        userId: 'user_2',
                        username: 'kai_zen',
                        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                        timestamp: new Date().toISOString()
                      }]
                    };
                  }
                  return m;
                })
              };
            }
            return chat;
          });
        });
        addWsLog({
          id: `log_receipt_${Date.now()}_kai`,
          timestamp: new Date().toISOString(),
          direction: 'server_to_client',
          event: 'chat:read_receipt_ack',
          payload: { chatId, messageId: newMsg.id, userId: 'user_2', name: 'Kai Takahashi' }
        });
      }, 2000);

    } else {
      // 1:1 Chat: Recipient reads message after 900ms
      setTimeout(() => {
        const recipientUser = chatId === 'chat_1' ? {
          userId: 'user_1',
          username: 'luna_wave',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
        } : {
          userId: 'user_2',
          username: 'kai_zen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        };

        setChats((prevChats) => {
          return prevChats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: chat.messages.map((m) => {
                  if (m.id === newMsg.id) {
                    return {
                      ...m,
                      status: 'read' as const,
                      readBy: [{
                        ...recipientUser,
                        timestamp: new Date().toISOString()
                      }]
                    };
                  }
                  return m;
                })
              };
            }
            return chat;
          });
        });

        addWsLog({
          id: `log_receipt_${Date.now()}_direct`,
          timestamp: new Date().toISOString(),
          direction: 'server_to_client',
          event: 'chat:read_receipt_ack',
          payload: { chatId, messageId: newMsg.id, userId: recipientUser.userId, name: recipientUser.username }
        });
      }, 900);
    }

    // Peer automated response simulation (to keep prototype lively!)
    setTimeout(() => {
        let responder = 'Luna Sterling';
        let respAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';
        let respId = 'user_1';
        let respText = 'Solid reply, just mapped that into SOMA coordinate arrays!';

        if (chatId === 'chat_2') {
          responder = 'Kai Takahashi';
          respAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
          respId = 'user_2';
          respText = 'Roger, synchronizing with your current active peripheral grid.';
        }

        // Randomly respond to what we sent!
        if (options?.isViewOnce) {
          respText = 'Whoa! Nice ephemeral snap shot. 📸 Low profile mode active!';
        } else if (options?.expiresAt) {
          respText = 'Noted! Expiring this stream link in 24h.';
        }

        const peerMsg: Message = {
          id: `msg_peer_${Date.now()}`,
          chatId,
          senderId: respId,
          senderName: responder,
          senderAvatar: respAvatar,
          text: respText,
          timestamp: new Date().toISOString(),
          status: 'read',
          reactions: []
        };

        // Append peer reply
        setChats((prevChats) => {
          return prevChats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: [...chat.messages, peerMsg],
                unreadCount: activeChatId === chatId ? 0 : chat.unreadCount + 1,
                lastMessageTimestamp: peerMsg.timestamp
              };
            }
            return chat;
          });
        });

        // Log peer server socket arrival
        addWsLog({
          id: `log_${Date.now()}_peer_in`,
          timestamp: new Date().toISOString(),
          direction: 'server_to_client',
          event: 'chat:message_dispatch',
          payload: { 
            chatId, 
            messageId: peerMsg.id, 
            originUserId: respId, 
            payloadSize: '512b' 
          }
        });
    }, 1200);
  };

  // Live reactions handler
  const handleAddReaction = (chatId: string, messageId: string, emoji: string) => {
    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages.map((m) => {
              if (m.id === messageId) {
                const existingReactions = m.reactions || [];
                const alreadyReacted = existingReactions.find(
                  (r) => r.userId === CURRENT_USER.id && r.emoji === emoji
                );
                
                let updatedReactions;
                if (alreadyReacted) {
                  updatedReactions = existingReactions.filter(
                    (r) => !(r.userId === CURRENT_USER.id && r.emoji === emoji)
                  );
                } else {
                  updatedReactions = [
                    ...existingReactions,
                    { emoji, userId: CURRENT_USER.id, username: CURRENT_USER.username }
                  ];
                }
                return { ...m, reactions: updatedReactions };
              }
              return m;
            })
          };
        }
        return chat;
      });
    });

    addWsLog({
      id: `log_reaction_${Date.now()}`,
      timestamp: new Date().toISOString(),
      direction: 'client_to_server',
      event: 'chat:message_reaction_sync',
      payload: { chatId, messageId, emoji, shooter: CURRENT_USER.username }
    });
  };

  // View once state trigger
  const handleViewMessageOnce = (chatId: string, messageId: string) => {
    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages.map((m) => {
              if (m.id === messageId) {
                return { ...m, viewed: true };
              }
              return m;
            })
          };
        }
        return chat;
      });
    });

    addWsLog({
      id: `log_viewonce_${Date.now()}`,
      timestamp: new Date().toISOString(),
      direction: 'client_to_server',
      event: 'chat:view_once_burned',
      payload: { chatId, messageId, evictedFromNodeCache: true, cryptoStatus: 'CLEARED' }
    });
  };

  const handleCreateNewChat = (username: string, name: string, avatar: string): string => {
    const existing = chats.find(c => c.type === '1:1' && c.name === name);
    if (existing) {
      setActiveChatId(existing.id);
      return existing.id;
    }

    const newChatId = `chat_${Date.now()}`;
    const newChat: ChatThread = {
      id: newChatId,
      name,
      avatar,
      type: '1:1',
      members: ['user_me', username],
      unreadCount: 0,
      lastMessageTimestamp: new Date().toISOString(),
      messages: [
        {
          id: `msg_welcome_${Date.now()}`,
          chatId: newChatId,
          senderId: 'user_me',
          senderName: CURRENT_USER.name,
          senderAvatar: CURRENT_USER.avatar,
          text: `🔐 Secure verification handshake established with @${username}. Keys synchronized over peer link.`,
          timestamp: new Date().toISOString(),
          status: 'sent',
          reactions: []
        }
      ]
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    
    addWsLog({
      id: `log_${Date.now()}_create_chat`,
      timestamp: new Date().toISOString(),
      direction: 'client_to_server',
      event: 'chat:create',
      payload: { chatId: newChatId, peer: username, encryption: 'KDF_AES256' }
    });

    return newChatId;
  };

  // 2. Action: Post New Ephemeral Story
  const handlePostStory = (content: string, bg: string, location?: string, isCloseFriendsOnly?: boolean) => {
    const timestampStr = new Date().toISOString();
    const expiresTimestamp = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const newStory: EphemeralStory = {
      id: `story_user_${Date.now()}`,
      userId: CURRENT_USER.id,
      username: CURRENT_USER.username,
      userAvatar: CURRENT_USER.avatar,
      mediaType: 'text_gradient',
      bgGradient: bg,
      content,
      createdAt: timestampStr,
      expiresAt: expiresTimestamp,
      isCloseFriendsOnly: !!isCloseFriendsOnly,
      geo: {
        lat: 37.7749,
        lng: -122.4194,
        locationName: location || 'Current Coordinates'
      },
      viewsCount: 0
    };

    // Push story to story feed
    setStories((prev) => [newStory, ...prev]);

    // Construct story spatial marker onto the Discovery Map
    const newMarker: GeoMarker = {
      id: `marker_story_${Date.now()}`,
      lat: 37.7749 + (Math.random() - 0.5) * 0.015, // random jitter around SOMA
      lng: -122.4194 + (Math.random() - 0.5) * 0.015,
      title: `${CURRENT_USER.username}'s ${isCloseFriendsOnly ? 'Close Circle' : 'disappearing'} packet`,
      description: content,
      type: 'media',
      creatorId: CURRENT_USER.id,
      creatorName: CURRENT_USER.username,
      creatorAvatar: CURRENT_USER.avatar,
      createdAt: timestampStr,
      likes: 0
    };

    setMarkers((prev) => [newMarker, ...prev]);

    // Emit live WS telemetry log
    addWsLog({
      id: `log_story_${Date.now()}`,
      timestamp: timestampStr,
      direction: 'client_to_server',
      event: 'ephemeral:story_publish',
      payload: {
        storyId: newStory.id,
        bgGradient: bg,
        isCloseFriendsOnly: !!isCloseFriendsOnly,
        geo: newStory.geo,
        ttlHours: 24,
        dbTrigger: 'TTL_Index_Evict'
      }
    });

    // Mirror server broadcast response
    setTimeout(() => {
      addWsLog({
        id: `log_story_${Date.now()}_sv_ack`,
        timestamp: new Date().toISOString(),
        direction: 'server_to_client',
        event: 'ephemeral:story_broadcast',
        payload: {
          success: true,
          broadcastNodesCount: isCloseFriendsOnly ? 3 : 12, // smaller audience subgroup for Close Friends
          radiusMeters: 500,
          injectedMarkers: [newMarker.id]
        }
      });
    }, 500);
  };

  // 3. Action: Draw Pin Event Marker directly to coordinates
  const handleAddMarker = (title: string, desc: string, type: 'media' | 'event' | 'ping') => {
    const timestampStr = new Date().toISOString();

    const newMarker: GeoMarker = {
      id: `marker_custom_${Date.now()}`,
      lat: 37.7749 + (Math.random() - 0.5) * 0.018, // random jitter around SOMA center
      lng: -122.4194 + (Math.random() - 0.5) * 0.018,
      title,
      description: desc,
      type,
      creatorId: CURRENT_USER.id,
      creatorName: CURRENT_USER.name,
      creatorAvatar: CURRENT_USER.avatar,
      createdAt: timestampStr,
      likes: 0
    };

    setMarkers((prev) => [newMarker, ...prev]);

    // WebSocket trigger client log
    addWsLog({
      id: `log_marker_${Date.now()}`,
      timestamp: timestampStr,
      direction: 'client_to_server',
      event: 'map:marker_register',
      payload: {
        markerId: newMarker.id,
        title,
        type,
        lat: newMarker.lat,
        lng: newMarker.lng,
        creator: CURRENT_USER.username
      }
    });

    // Mock incoming system response acknowledging marker sync
    setTimeout(() => {
      addWsLog({
        id: `log_marker_${Date.now()}_sync_ack`,
        timestamp: new Date().toISOString(),
        direction: 'server_to_client',
        event: 'map:marker_synced_broadcast',
        payload: {
          markerId: newMarker.id,
          activeAudienceInZone: 189,
          geoProximityState: 'BOUND_OK'
        }
      });
    }, 600);
  };

  const handleUpdateGroupSettings = (chatId: string, updates: { name?: string; avatar?: string; members?: string[] }) => {
    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            ...updates
          };
        }
        return chat;
      });
    });

    addWsLog({
      id: `log_group_settings_${Date.now()}`,
      timestamp: new Date().toISOString(),
      direction: 'client_to_server',
      event: 'chat:group_settings_modified',
      payload: { chatId, ...updates, authorizedBy: CURRENT_USER.username }
    });
  };

  return (
    <div id="application-root-container" className="min-h-screen bg-[#06030c] bg-radial-[circle_at_bottom] from-[#1d0e3a] via-[#06030c] to-[#040207] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
      
      {/* Top Professional Header section */}
      <header id="app-executive-nav" className="w-full bg-[#090514]/85 backdrop-blur-md border-b border-purple-950/40 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 z-40 shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 px-2 bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 rounded-lg text-white font-black text-xs md:text-sm tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              💎 GM
            </div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm md:text-base font-black tracking-tight text-white uppercase">Hybrid Social Architecture</h1>
              <span className="text-[9px] bg-purple-950/50 border border-purple-500/20 text-purple-300 font-bold px-1.5 py-0.2 rounded font-mono">SPEC V1.2.4</span>
            </div>
          </div>
          <p className="text-[11.5px] text-slate-300 mt-1 max-w-[550px] font-sans">
            A high-performance social core demonstrating high-frequency ephemeral stories side by side with real-time persistent cluster sockets. Use the live mockup on the left to fire events!
          </p>
        </div>

        {/* Action Toggle buttons for smaller responsive layout columns */}
        <div className="flex items-center gap-1.5 bg-[#080410]/95 border border-purple-950/60 p-1 rounded-xl shadow-md overflow-x-auto max-w-full">
          <button
            id="view-toggle-showcase"
            onClick={() => setActiveLayoutCol('showcase')}
            className={`px-3 py-1.5 text-[10.5px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeLayoutCol === 'showcase' 
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.35)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/20'
            }`}
          >
            🌟 Premium Showcase
          </button>
          <button
            id="view-toggle-dashboard"
            onClick={() => setActiveLayoutCol('dashboard')}
            className={`px-3 py-1.5 text-[10.5px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeLayoutCol === 'dashboard' 
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.35)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-purple-900/20'
            }`}
          >
            🔥 HUD Dashboard
          </button>
          <button
            id="view-toggle-both"
            onClick={() => setActiveLayoutCol('both')}
            className={`px-3 py-1.5 text-[10.5px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeLayoutCol === 'both' 
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.35)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-purple-900/20'
            }`}
          >
            Dual split spec
          </button>
          <button
            id="view-toggle-sim"
            onClick={() => setActiveLayoutCol('sim')}
            className={`px-3 py-1.5 text-[10.5px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeLayoutCol === 'sim' 
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.35)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-purple-900/20'
            }`}
          >
            Prototype App
          </button>
          <button
            id="view-toggle-spec"
            onClick={() => setActiveLayoutCol('spec')}
            className={`px-3 py-1.5 text-[10.5px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeLayoutCol === 'spec' 
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.35)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-purple-900/20'
            }`}
          >
            MERN Specs
          </button>
        </div>
      </header>

      {/* Main split display columns layout OR Showcase layout */}
      {activeLayoutCol === 'showcase' ? (
        <div id="showcase-workspace" className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 space-y-8 overflow-hidden">
          
          {/* Section 1: Parallel Devices Screens Side-by-Side */}
          <section className="space-y-4">
            <div className="text-center md:text-left pl-1">
              <span className="text-[10px] font-mono text-fuchsia-400 font-extrabold uppercase tracking-wide">Multi-Screen Parallel Architect</span>
              <h2 className="text-lg font-black tracking-tight mt-0.5 text-white">5-DEVICE INTERACTIVE DEMO (All views live & synchronized!)</h2>
            </div>
            
            {/* Horizontal row of 5 mobile devices with custom design */}
            <div className="flex items-start gap-4.5 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-slate-950/40">
              
              {/* Phone 1: Feed */}
              <div className="flex-shrink-0 w-[236px] flex flex-col items-center">
                <span className="text-[9.5px] font-mono font-black text-rose-450 uppercase mb-2.5 bg-rose-950/50 border border-rose-900/30 px-2.5 py-0.5 rounded-full select-none">Feed Screen</span>
                <div className="w-full bg-[#05020c] rounded-[38px] border-[5px] border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.85)] overflow-hidden aspect-[9/18.8] h-[465px] relative">
                  <ViewportSim
                    chats={chats}
                    stories={stories}
                    markers={markers}
                    wsLogs={wsLogs}
                    activeChatId={activeChatId}
                    onSendMessage={handleSendMessage}
                    onUpdateActiveChat={setActiveChatId}
                    onCreateNewChat={handleCreateNewChat}
                    onPostStory={handlePostStory}
                    onAddMarker={handleAddMarker}
                    onTriggerWsLog={addWsLog}
                    onAddReaction={handleAddReaction}
                    onViewMessageOnce={handleViewMessageOnce}
                    onUpdateGroupSettings={handleUpdateGroupSettings}
                    forcedTab="feed"
                  />
                </div>
              </div>

              {/* Phone 2: Explore */}
              <div className="flex-shrink-0 w-[236px] flex flex-col items-center">
                <span className="text-[9.5px] font-mono font-black text-purple-400 uppercase mb-2.5 bg-purple-950/50 border border-purple-900/30 px-2.5 py-0.5 rounded-full select-none">Explore Map</span>
                <div className="w-full bg-[#05020c] rounded-[38px] border-[5px] border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.85)] overflow-hidden aspect-[9/18.8] h-[465px] relative">
                  <ViewportSim
                    chats={chats}
                    stories={stories}
                    markers={markers}
                    wsLogs={wsLogs}
                    activeChatId={activeChatId}
                    onSendMessage={handleSendMessage}
                    onUpdateActiveChat={setActiveChatId}
                    onCreateNewChat={handleCreateNewChat}
                    onPostStory={handlePostStory}
                    onAddMarker={handleAddMarker}
                    onTriggerWsLog={addWsLog}
                    onAddReaction={handleAddReaction}
                    onViewMessageOnce={handleViewMessageOnce}
                    onUpdateGroupSettings={handleUpdateGroupSettings}
                    forcedTab="explore"
                  />
                </div>
              </div>

              {/* Phone 3: Create Hub (Gem Menu Open) */}
              <div className="flex-shrink-0 w-[236px] flex flex-col items-center">
                <span className="text-[9.5px] font-mono font-black text-pink-400 uppercase mb-2.5 bg-pink-950/50 border border-pink-900/30 px-2.5 py-0.5 rounded-full select-none">Create Hub</span>
                <div className="w-full bg-[#05020c] rounded-[38px] border-[5px] border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.85)] overflow-hidden aspect-[9/18.8] h-[465px] relative">
                  <ViewportSim
                    chats={chats}
                    stories={stories}
                    markers={markers}
                    wsLogs={wsLogs}
                    activeChatId={activeChatId}
                    onSendMessage={handleSendMessage}
                    onUpdateActiveChat={setActiveChatId}
                    onCreateNewChat={handleCreateNewChat}
                    onPostStory={handlePostStory}
                    onAddMarker={handleAddMarker}
                    onTriggerWsLog={addWsLog}
                    onAddReaction={handleAddReaction}
                    onViewMessageOnce={handleViewMessageOnce}
                    onUpdateGroupSettings={handleUpdateGroupSettings}
                    forcedIsGemMenuOpen={true}
                  />
                </div>
              </div>

              {/* Phone 4: Chats */}
              <div className="flex-shrink-0 w-[236px] flex flex-col items-center">
                <span className="text-[9.5px] font-mono font-black text-fuchsia-400 uppercase mb-2.5 bg-fuchsia-950/50 border border-fuchsia-900/30 px-2.5 py-0.5 rounded-full select-none">Chats Socket</span>
                <div className="w-full bg-[#05020c] rounded-[38px] border-[5px] border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.85)] overflow-hidden aspect-[9/18.8] h-[465px] relative">
                  <ViewportSim
                    chats={chats}
                    stories={stories}
                    markers={markers}
                    wsLogs={wsLogs}
                    activeChatId={activeChatId}
                    onSendMessage={handleSendMessage}
                    onUpdateActiveChat={setActiveChatId}
                    onCreateNewChat={handleCreateNewChat}
                    onPostStory={handlePostStory}
                    onAddMarker={handleAddMarker}
                    onTriggerWsLog={addWsLog}
                    onAddReaction={handleAddReaction}
                    onViewMessageOnce={handleViewMessageOnce}
                    onUpdateGroupSettings={handleUpdateGroupSettings}
                    forcedTab="chats"
                  />
                </div>
              </div>

              {/* Phone 5: Profile Node */}
              <div className="flex-shrink-0 w-[236px] flex flex-col items-center">
                <span className="text-[9.5px] font-mono font-black text-indigo-400 uppercase mb-2.5 bg-indigo-950/50 border border-indigo-900/30 px-2.5 py-0.5 rounded-full select-none">Profile telemetry</span>
                <div className="w-full bg-[#05020c] rounded-[38px] border-[5px] border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.85)] overflow-hidden aspect-[9/18.8] h-[465px] relative">
                  <ViewportSim
                    chats={chats}
                    stories={stories}
                    markers={markers}
                    wsLogs={wsLogs}
                    activeChatId={activeChatId}
                    onSendMessage={handleSendMessage}
                    onUpdateActiveChat={setActiveChatId}
                    onCreateNewChat={handleCreateNewChat}
                    onPostStory={handlePostStory}
                    onAddMarker={handleAddMarker}
                    onTriggerWsLog={addWsLog}
                    onAddReaction={handleAddReaction}
                    onViewMessageOnce={handleViewMessageOnce}
                    onUpdateGroupSettings={handleUpdateGroupSettings}
                    forcedTab="profile"
                  />
                </div>
              </div>

            </div>
          </section>

          {/* Section 2: Unified Showcase Dashboard (Contains Modular Cards, map, chat and analytics) */}
          <section className="space-y-4 pt-4 border-t border-purple-950/40">
            <div className="text-center md:text-left pl-1">
              <span className="text-[10px] font-mono text-purple-400 font-extrabold uppercase tracking-wide">Modular Interactive deck</span>
              <h2 className="text-lg font-black tracking-tight mt-0.5 text-white">MODULAR CARDS SYSTEM & ANALYTICS</h2>
            </div>
            
            <UnifiedDashboard
              chats={chats}
              stories={stories}
              markers={markers}
              projectMilestoneProgress={projectMilestoneProgress}
              onUpdateProjectProgress={setProjectMilestoneProgress}
              onSendMessage={handleSendMessage}
              onPostStory={handlePostStory}
              onAddMarker={handleAddMarker}
              onTriggerWsLog={addWsLog}
              activeChatId={activeChatId}
              onUpdateActiveChat={setActiveChatId}
            />
          </section>

        </div>
      ) : (
        <main id="app-workspace-body" className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start overflow-hidden">
          
          {/* COL 1: HIGH FIDELITY GM LIVE SIMULATOR APP */}
          {(activeLayoutCol === 'dashboard' || activeLayoutCol === 'both' || activeLayoutCol === 'sim') && (
            <section 
              id="section-client-device-drawer"
              className={`lg:col-span-12 w-full flex flex-col justify-center items-center max-w-[480px] mx-auto`}
            >
              <div className="mb-2 text-center">
                <span className="text-[10px] font-mono text-purple-400/85 font-bold uppercase tracking-wider">Device Sandbox Simulator</span>
              </div>
              
              <ViewportSim
                chats={chats}
                stories={stories}
                markers={markers}
                wsLogs={wsLogs}
                activeChatId={activeChatId}
                onSendMessage={handleSendMessage}
                onUpdateActiveChat={setActiveChatId}
                onCreateNewChat={handleCreateNewChat}
                onPostStory={handlePostStory}
                onAddMarker={handleAddMarker}
                onTriggerWsLog={addWsLog}
                onAddReaction={handleAddReaction}
                onViewMessageOnce={handleViewMessageOnce}
                onUpdateGroupSettings={handleUpdateGroupSettings}
              />
            </section>
          )}

          {/* COL 2: ARCHITECT DECK DRAWINGS & MEMORANDUMS OR LIVE MOCKUP DASHBOARD */}
          {(activeLayoutCol === 'dashboard' || activeLayoutCol === 'both' || activeLayoutCol === 'spec') && (
            <section 
              id="section-architect-specs-panel"
              className={`w-full flex-1 h-full min-h-[580px] ${
                activeLayoutCol === 'dashboard' || activeLayoutCol === 'both' ? 'lg:col-span-12' : 'lg:col-span-12'
              }`}
            >
              {activeLayoutCol === 'dashboard' ? (
                <UnifiedDashboard
                  chats={chats}
                  stories={stories}
                  markers={markers}
                  projectMilestoneProgress={projectMilestoneProgress}
                  onUpdateProjectProgress={setProjectMilestoneProgress}
                  onSendMessage={handleSendMessage}
                  onPostStory={handlePostStory}
                  onAddMarker={handleAddMarker}
                  onTriggerWsLog={addWsLog}
                  activeChatId={activeChatId}
                  onUpdateActiveChat={setActiveChatId}
                />
              ) : (
                <>
                  <div className="mb-2 text-center lg:text-left pl-2">
                    <span className="text-[10px] font-mono text-purple-400/85 font-bold uppercase tracking-wider">System Specifications Engine</span>
                  </div>
                  <ArchitectBoard chats={chats} stories={stories} />
                </>
              )}
            </section>
          )}

        </main>
      )}

      {/* Footer System Credits */}
      <footer id="app-design-footer" className="w-full bg-[#05020a] border-t border-purple-950/40 py-4.5 px-6 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[10px]">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
          <span className="text-slate-400">GM Cryptographic Hybrid Social Architecture specification deck • Standard Compliant</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-slate-500">
          <span>COORDINATES LOCK: 37.7749° N, 122.4194° W</span>
          <span>•</span>
          <span>LATENCY: ~14MS</span>
        </div>
      </footer>

    </div>
  );
}
