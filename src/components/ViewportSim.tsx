import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Map, 
  Plus, 
  Send, 
  Compass, 
  Navigation, 
  Sparkles, 
  Heart, 
  Layers, 
  Wifi, 
  Battery, 
  Signal, 
  Clock, 
  User, 
  Filter, 
  MapPin, 
  ChevronLeft,
  Tv, 
  Trash,
  X,
  Share2,
  Check,
  AlertCircle,
  Search,
  Bell,
  Edit3,
  Bookmark,
  Play,
  Settings,
  ShieldCheck,
  Activity,
  Gem,
  Lock,
  Unlock,
  Star,
  Eye,
  EyeOff,
  CornerUpLeft,
  Zap,
  BarChart2,
  Video,
  Mic,
  Palette,
  Pause,
  UserPlus
} from 'lucide-react';
import { UserProfile, ChatThread, EphemeralStory, GeoMarker, WsLogEntry } from '../types';
import { CURRENT_USER, MOCK_USERS } from '../data/mockData';

export const WALLPAPER_STYLES: Record<string, { name: string; bgClass: string; textCard: string; accentColor: string; description: string }> = {
  default: { 
    name: 'Default Crypt', 
    bgClass: 'bg-[#070311]/50', 
    textCard: 'bg-[#120a24]/80 text-slate-200 border border-purple-950/30',
    accentColor: 'text-fuchsia-400',
    description: 'Symmetric dark matte atmospheric cipher mesh' 
  },
  sunset: { 
    name: 'Cyber Sunset Neon', 
    bgClass: 'bg-gradient-to-b from-[#1c082b] via-[#350d3d] to-[#04010a] bg-opacity-95', 
    textCard: 'bg-[#210931]/85 text-pink-100 border border-pink-950/45',
    accentColor: 'text-pink-400',
    description: 'Hot neon twilight mesh gradients' 
  },
  nebula: { 
    name: 'Cosmic Nebula Glow', 
    bgClass: 'bg-gradient-to-tr from-[#04051a] via-[#0d0c24] to-[#0a1826] bg-opacity-95', 
    textCard: 'bg-[#0f1131]/85 text-cyan-100 border border-cyan-950/40',
    accentColor: 'text-cyan-400',
    description: 'Deconstruct cosmic stardust spectrum' 
  },
  matrix: { 
    name: 'Matrix Grid Protocol', 
    bgClass: 'bg-gradient-to-b from-[#020b03] to-[#000500] relative after:content-[""] after:absolute after:inset-0 after:bg-[radial-gradient(circle,rgba(34,197,94,0.1)_1px,transparent_1px)] after:bg-[size:16px_16px]', 
    textCard: 'bg-[#021808]/90 text-emerald-100 border border-emerald-950/50',
    accentColor: 'text-emerald-400',
    description: 'Interactive green command line matrix' 
  },
  charcoal: { 
    name: 'Monochrome Carbon', 
    bgClass: 'bg-[#080808] relative after:content-[""] after:absolute after:inset-0 after:bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] after:bg-[size:20px_20px]', 
    textCard: 'bg-[#141414]/90 text-neutral-200 border border-neutral-850',
    accentColor: 'text-neutral-400',
    description: 'Pure stealth matte grid aesthetics' 
  }
};

interface ViewportSimProps {
  chats: ChatThread[];
  stories: EphemeralStory[];
  markers: GeoMarker[];
  wsLogs: WsLogEntry[];
  activeChatId: string | null;
  onSendMessage: (
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
  ) => void;
  onUpdateActiveChat: (chatId: string | null) => void;
  onPostStory: (content: string, bg: string, location?: string, isCloseFriendsOnly?: boolean) => void;
  onAddMarker: (title: string, desc: string, type: 'media' | 'event' | 'ping') => void;
  onTriggerWsLog: (entry: WsLogEntry) => void;
  onAddReaction: (chatId: string, messageId: string, emoji: string) => void;
  onViewMessageOnce: (chatId: string, messageId: string) => void;
  onUpdateGroupSettings?: (chatId: string, updates: { name?: string; avatar?: string; members?: string[] }) => void;
  onCreateNewChat?: (username: string, name: string, avatar: string) => string;
  forcedTab?: 'feed' | 'explore' | 'chats' | 'profile';
  forcedIsGemMenuOpen?: boolean;
}

export function ViewportSim({
  chats,
  stories,
  markers,
  wsLogs,
  activeChatId,
  onSendMessage,
  onUpdateActiveChat,
  onPostStory,
  onAddMarker,
  onTriggerWsLog,
  onAddReaction,
  onViewMessageOnce,
  onUpdateGroupSettings,
  onCreateNewChat,
  forcedTab,
  forcedIsGemMenuOpen
}: ViewportSimProps) {
  
  // 5 Active Tabs: 'feed' | 'explore' | 'chats' | 'profile'
  const [localActiveTab, setLocalActiveTab] = useState<'feed' | 'explore' | 'chats' | 'profile'>('feed');
  const activeTab = forcedTab || localActiveTab;
  const setActiveTab = forcedTab ? () => {} : setLocalActiveTab;

  // INTEGRATED PHASES STATE (The User Journey)
  const [projectMilestoneProgress, setProjectMilestoneProgress] = useState(70);
  const [curatorLevel, setCuratorLevel] = useState(5);
  const [totalGEMSGenerated, setTotalGEMSGenerated] = useState(1482);
  const [isLegacySaved, setIsLegacySaved] = useState(false);
  const [isMyAiChatOpen, setIsMyAiChatOpen] = useState(false);
  const [aiInputText, setAiInputText] = useState('');
  const [myAiChatLog, setMyAiChatLog] = useState<Array<{ sender: 'user' | 'ai', text: string, timestamp: string }>>([
    {
      sender: 'ai',
      text: "👋 Salutations, Curator! I am your AI Design & Impact Coach. Ask me how to grow your Local Intention projects or optimize community GEM interest!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isProofEditorOpen, setIsProofEditorOpen] = useState(false);
  const [proofEditorBrightness, setProofEditorBrightness] = useState(100);
  const [proofEditorContrast, setProofEditorContrast] = useState(100);
  const [proofEditorSaturation, setProofEditorSaturation] = useState(100);
  const [proofSelectedMilestone, setProofSelectedMilestone] = useState('Completed Milestone 2: Coordinate Volunteers');
  const [proofSelectedImg, setProofSelectedImg] = useState('https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80');
  const [proofEditorCaption, setProofEditorCaption] = useState('Success at SOMA! Gathered the roasters for calibration and organic tasting profiles.');
  const [proofPosts, setProofPosts] = useState<Array<{
    id: string;
    author: string;
    username: string;
    avatar: string;
    imgUrl: string;
    caption: string;
    milestone: string;
    brightness: number;
    contrast: number;
    saturation: number;
    likes: number;
    hasLiked?: boolean;
    timestamp: string;
  }>>([
    {
      id: 'proof_1_mia',
      author: 'Mia C.',
      username: '@mia_phorgraphy',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      imgUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format&fit=crop&q=80',
      caption: 'Main garden layout set! Planted 4 regional botanicals in South Park.',
      milestone: 'Completed Garden Milestone 1',
      brightness: 110,
      contrast: 105,
      saturation: 120,
      likes: 42,
      timestamp: '1h ago'
    }
  ]);
  const [isVideoCallSuiteOpen, setIsVideoCallSuiteOpen] = useState(false);
  const [videoCallMode, setVideoCallMode] = useState<'normal_split' | 'comms_debrief'>('normal_split');
  
  // Story interactive filters & search queries
  const [storySearchQuery, setStorySearchQuery] = useState('');
  const [storyActiveFilter, setStoryActiveFilter] = useState<'all' | 'close_friends' | 'text' | 'media'>('all');

  // Group settings UI states
  const [isGroupSettingsOpen, setIsGroupSettingsOpen] = useState(false);
  const [groupSettingsName, setGroupSettingsName] = useState('');
  const [groupSettingsAvatar, setGroupSettingsAvatar] = useState('');
  const [groupMutedChats, setGroupMutedChats] = useState<Record<string, boolean>>({});
  const [groupDisappearingChats, setGroupDisappearingChats] = useState<Record<string, boolean>>({});

  // Message read receipt detailed popover
  const [activeReadReceiptPopoverMsgId, setActiveReadReceiptPopoverMsgId] = useState<string | null>(null);

  // Chat viewport states
  const [isInsideChatRoom, setIsInsideChatRoom] = useState(false);

  // Search filter for map/events
  const [searchQuery, setSearchQuery] = useState('');

  // Story Carousel Modal
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  
  // Map interactive states
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>('marker_cozy'); // Default to cozy pop-up card view
  const [localIsGemMenuOpen, setLocalIsGemMenuOpen] = useState(false);
  const isGemMenuOpen = forcedIsGemMenuOpen !== undefined ? forcedIsGemMenuOpen : localIsGemMenuOpen;
  const setIsGemMenuOpen = forcedIsGemMenuOpen !== undefined ? () => {} : setLocalIsGemMenuOpen;
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  // Custom interactive mock post counters
  const [sunsetLikes, setSunsetLikes] = useState(12431);
  const [hasLikedSunset, setHasLikedSunset] = useState(false);
  const [sunsetCommentsCount, setSunsetCommentsCount] = useState(189);
  const [vlogViews, setVlogViews] = useState(31400);

  // Create New Content Modal States
  const [isNewStoryModalOpen, setIsNewStoryModalOpen] = useState(false);
  const [isNewMarkerModalOpen, setIsNewMarkerModalOpen] = useState(false);
  const [newStoryText, setNewStoryText] = useState('');
  const [newStoryBg, setNewStoryBg] = useState('from-indigo-600 via-purple-600 to-pink-500');
  const [newMarkerTitle, setNewMarkerTitle] = useState('');
  const [newMarkerDesc, setNewMarkerDesc] = useState('');
  const [newMarkerType, setNewMarkerType] = useState<'media' | 'event' | 'ping'>('media');

  // Input Box for Messaging
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Custom Disappearing Chats Settings
  const [isViewOnceSelected, setIsViewOnceSelected] = useState(false);
  const [is24hExpireSelected, setIs24hExpireSelected] = useState(false);
  const [selectedMediaPreview, setSelectedMediaPreview] = useState<string | null>(null);
  const [viewingOnceMediaUrl, setViewingOnceMediaUrl] = useState<string | null>(null);
  const [viewingOnceMessageId, setViewingOnceMessageId] = useState<string | null>(null);

  // Gem Circles settings (Instagram Close Friends)
  const [isCloseFriendsSelected, setIsCloseFriendsSelected] = useState(false);
  const [closeFriendsList, setCloseFriendsList] = useState<string[]>(['user_1', 'user_2']); // Starts with Sarah and Kai

  // Message Reactions & Direct Replies states
  const [emojiPickerMsgId, setEmojiPickerMsgId] = useState<string | null>(null);
  const [replyingMessage, setReplyingMessage] = useState<any | null>(null);

  // --- NEW INTEGRATIONS: Chat Wallpapers, Search, and Audio Messages ---
  const [chatWallpapers, setChatWallpapers] = useState<Record<string, string>>({});
  const [isWallpaperMenuOpen, setIsWallpaperMenuOpen] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioRecordingSecs, setAudioRecordingSecs] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioPlayProgress, setAudioPlayProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    let recTimer: any;
    if (isRecordingAudio) {
      setAudioRecordingSecs(0);
      recTimer = setInterval(() => {
        setAudioRecordingSecs(prev => prev + 1);
      }, 1000);
    } else {
      setAudioRecordingSecs(0);
    }
    return () => clearInterval(recTimer);
  }, [isRecordingAudio]);

  useEffect(() => {
    let playTimer: any;
    if (playingAudioId) {
      playTimer = setInterval(() => {
        setAudioPlayProgress(prev => {
          const current = prev[playingAudioId] || 0;
          if (current >= 100) {
            setPlayingAudioId(null);
            return { ...prev, [playingAudioId]: 0 };
          }
          return { ...prev, [playingAudioId]: current + 5 };
        });
      }, 150);
    }
    return () => clearInterval(playTimer);
  }, [playingAudioId]);
  // ---------------------------------------------------------------------

  // Live Location settings (WhatsApp/Snapchat SnapMap)
  const [isSharingLiveCoords, setIsSharingLiveCoords] = useState(false);
  const [isFriendSharingLive, setIsFriendSharingLive] = useState<Record<string, boolean>>({
    'user_1': true, // Sarah L is on live track initially!
    'user_2': false
  });
  const [trackingRouteToFriend, setTrackingRouteToFriend] = useState<string | null>(null);

  // Profile insights drawer/view selector
  const [showCreatorInsights, setShowCreatorInsights] = useState(false);

  // Auto Scroll Chat Room
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChatId, chats, isInsideChatRoom]);

  // Handle active chat selection
  const handleChatSelect = (chatId: string) => {
    onUpdateActiveChat(chatId);
    setIsInsideChatRoom(true);
    setActiveTab('chats');
    
    // Log WebSocket Room Join
    const targetChat = chats.find(c => c.id === chatId);
    onTriggerWsLog({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      direction: 'client_to_server',
      event: 'room:join',
      payload: { chatId, roomName: targetChat?.name || 'Unknown' }
    });
  };

  const handleBackToChats = () => {
    setIsInsideChatRoom(false);
    onUpdateActiveChat(null);
  };

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && !selectedMediaPreview) return;
    if (!activeChatId) return;
    
    const options: any = {};
    
    if (isViewOnceSelected) {
      options.isViewOnce = true;
      options.mediaUrl = selectedMediaPreview || 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80';
      options.mediaType = 'image';
    } else if (selectedMediaPreview) {
      options.mediaUrl = selectedMediaPreview;
      options.mediaType = 'image';
    }

    if (is24hExpireSelected) {
      options.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    }

    if (replyingMessage) {
      options.replyTo = {
        id: replyingMessage.id,
        senderName: replyingMessage.senderName,
        text: replyingMessage.text
      };
    }

    onSendMessage(
      activeChatId, 
      messageText || (isViewOnceSelected ? 'Sent a disappearing view-once' : 'Shared photo attachment'), 
      options
    );
    
    // Reset States
    setMessageText('');
    setIsViewOnceSelected(false);
    setIs24hExpireSelected(false);
    setSelectedMediaPreview(null);
    setReplyingMessage(null);
  };

  // Story Carousel Autoplay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeStoryIdx !== null) {
      timer = setTimeout(() => {
        if (activeStoryIdx < stories.length - 1) {
          setActiveStoryIdx(activeStoryIdx + 1);
        } else {
          setActiveStoryIdx(null); // Close at the end
        }
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [activeStoryIdx, stories]);

  // Handle posting a story
  const handleCreateStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryText.trim()) return;
    onPostStory(newStoryText, newStoryBg, 'SOMA tech corridor', isCloseFriendsSelected);
    setNewStoryText('');
    setIsCloseFriendsSelected(false);
    setIsNewStoryModalOpen(false);
    setIsGemMenuOpen(false);
    setStatusMessage(isCloseFriendsSelected ? 'Story broadcasted to Gem Circle only! 🌟' : 'Disappearing story shot uploaded to Gem Grid!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Handle adding map marker
  const handleCreateMarkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMarkerTitle.trim()) return;
    onAddMarker(newMarkerTitle, newMarkerDesc, newMarkerType);
    setNewMarkerTitle('');
    setNewMarkerDesc('');
    setIsNewMarkerModalOpen(false);
    setIsGemMenuOpen(false);
    setStatusMessage('Aura marker localized onto active coordinate grid!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  // Gradient helper for backgrounds
  const storyGradients = [
    'from-indigo-600 via-purple-600 to-pink-500',
    'from-emerald-500 via-teal-600 to-cyan-500',
    'from-rose-500 via-red-600 to-amber-500',
    'from-violet-800 via-purple-700 to-fuchsia-600',
    'from-slate-900 via-purple-900 to-slate-900'
  ];

  // Interactive profile decryption cypher simulator
  const [crypticKey, setCrypticKey] = useState('7F3A-89913-9E4B-8B5E4');
  useEffect(() => {
    const interval = setInterval(() => {
      const hex = '0123456789ABCDEF';
      let result = '';
      for (let i = 0; i < 4; i++) {
        result += hex[Math.floor(Math.random() * 16)];
      }
      result += '-';
      for (let i = 0; i < 5; i++) {
        result += hex[Math.floor(Math.random() * 16)];
      }
      result += '-';
      for (let i = 0; i < 4; i++) {
        result += hex[Math.floor(Math.random() * 16)];
      }
      setCrypticKey(result);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="gm-viewport-container" className="flex flex-col items-center justify-center p-4">
      
      {/* Device wrapper mockup */}
      <div id="mobile-device-shell" className="relative w-full max-w-[390px] h-[780px] bg-[#0c0716] rounded-[52px] border-[8px] border-[#221735] shadow-[0_0_60px_rgba(168,85,247,0.22)] overflow-hidden flex flex-col select-none">
        
        {/* Status Bar */}
        <div id="device-status-bar" className="h-11 px-7 flex items-center justify-between text-slate-400 text-[11px] font-sans bg-[#0c0716]/90 backdrop-blur-md z-40 shrink-0">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-semibold text-slate-200">9:41</span>
          </div>
          {/* Audio receiver speaker pill shape */}
          <div className="w-28 h-5.5 bg-[#05020c] border border-purple-950/40 rounded-full flex items-center justify-center">
            <div className="w-10 h-1 bg-purple-950/80 rounded-full" />
          </div>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span className="text-[9px] text-fuchsia-400 font-bold bg-fuchsia-500/10 px-1 py-0.2 rounded border border-fuchsia-500/20 font-mono">5G_GM_STABLE</span>
            <Battery className="w-4 h-4 text-slate-300" />
          </div>
        </div>

        {/* Temporary Notification Banner */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div 
              id="device-alert-toast"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute top-14 left-4 right-4 bg-[#140b2e]/95 border border-fuchsia-500/40 text-slate-100 text-xs py-2.5 px-4 rounded-xl shadow-[0_4px_25px_rgba(168,85,247,0.3)] backdrop-blur-md z-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-spin" />
              <span className="font-sans font-medium">{statusMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Viewable Screen Area */}
        <div id="mobile-screen-content" className="flex-1 relative overflow-hidden flex flex-col bg-[#05020c]">
          
          <AnimatePresence mode="wait">
            
            {/* TABS 1 & 2: DYNAMIC DASHBOARD SOCIAL FEED */}
            {activeTab === 'feed' && (
              <motion.div
                key="feed_screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col"
              >
                {/* Header */}
                <div className="p-4 bg-gradient-to-b from-[#0e0921] to-[#05020c] border-b border-purple-950/50 shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <h1 id="feed-screen-title" className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                      <span>Gem Stories</span>
                    </h1>
                    <div className="flex items-center gap-2.5">
                      <button 
                        id="btn-edit-story-shortcut" 
                        onClick={() => setIsNewStoryModalOpen(true)}
                        className="p-1.5 bg-purple-950/50 hover:bg-purple-900/60 rounded-xl border border-purple-500/20 text-purple-300 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        id="btn-bell-feed-notification" 
                        onClick={() => {
                          setStatusMessage("Connected socket alerts: 0 unresolved");
                          setTimeout(() => setStatusMessage(null), 2500);
                        }}
                        className="p-1.5 bg-purple-950/50 hover:bg-purple-900/60 rounded-xl border border-purple-500/20 text-purple-300 transition-colors"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Story Search */}
                  <div className="relative mb-2">
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-purple-400 opacity-70" />
                    <input
                      type="text"
                      placeholder="Search stories by peer or caption..."
                      value={storySearchQuery}
                      onChange={(e) => setStorySearchQuery(e.target.value)}
                      className="w-full bg-[#120726]/90 text-[10.5px] text-slate-100 placeholder-purple-400/40 pl-8 pr-7 py-1.5 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 border border-purple-950/60 transition-all font-sans"
                    />
                    {storySearchQuery && (
                      <button
                        onClick={() => setStorySearchQuery('')}
                        className="absolute right-2.5 top-2.5 text-purple-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Dynamic Story Filter badges */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-1 scrollbar-none">
                    <button
                      onClick={() => setStoryActiveFilter('all')}
                      className={`px-2 py-0.5 text-[8.5px] font-black uppercase font-mono tracking-wider rounded transition-all ${
                        storyActiveFilter === 'all'
                          ? 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.45)]'
                          : 'bg-[#150a29] text-purple-300/80 hover:text-white border border-purple-950/60'
                      }`}
                    >
                      🧪 All
                    </button>
                    <button
                      onClick={() => setStoryActiveFilter('close_friends')}
                      className={`px-2 py-0.5 text-[8.5px] font-black uppercase font-mono tracking-wider rounded transition-all flex items-center gap-1 leading-none ${
                        storyActiveFilter === 'close_friends'
                          ? 'bg-emerald-600 text-white shadow-[0_0_8px_rgba(16,185,129,0.45)]'
                          : 'bg-[#150a29] text-emerald-400/85 hover:text-emerald-300 border border-emerald-950/60'
                      }`}
                    >
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>Circles</span>
                    </button>
                    <button
                      onClick={() => setStoryActiveFilter('text')}
                      className={`px-2 py-0.5 text-[8.5px] font-black uppercase font-mono tracking-wider rounded transition-all ${
                        storyActiveFilter === 'text'
                          ? 'bg-fuchsia-600 text-white shadow-[0_0_8px_rgba(217,70,239,0.45)]'
                          : 'bg-[#150a29] text-purple-300/80 hover:text-white border border-purple-950/60'
                      }`}
                    >
                      📝 Text
                    </button>
                    <button
                      onClick={() => setStoryActiveFilter('media')}
                      className={`px-2 py-0.5 text-[8.5px] font-black uppercase font-mono tracking-wider rounded transition-all ${
                        storyActiveFilter === 'media'
                          ? 'bg-pink-600 text-white shadow-[0_0_8px_rgba(236,72,153,0.45)]'
                          : 'bg-[#150a29] text-pink-300/80 hover:text-white border border-purple-950/60'
                      }`}
                    >
                      📸 Photos
                    </button>
                  </div>
                  
                  {/* Dynamic Stories Carousel (Screenshot 2 Styling) */}
                  <div className="relative">
                    <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                      {/* Plus Button inside a circular ring */}
                      <button 
                        id="btn-post-story-feed"
                        onClick={() => setIsNewStoryModalOpen(true)}
                        className="flex flex-col items-center gap-1 shrink-0 focus:outline-none"
                      >
                        <div className="relative w-[50px] h-[50px] rounded-full bg-purple-950/40 border border-dashed border-purple-500/30 flex items-center justify-center hover:border-purple-400 transition-transform hover:scale-105">
                          <Plus className="w-5 h-5 text-purple-300" />
                        </div>
                        <span className="text-[10px] text-purple-300/80 mt-0.5 font-sans">Share Story</span>
                      </button>

                      {/* Mocked/Real Stories Rings */}
                      {stories.filter(story => {
                        const userName = story.username.toLowerCase();
                        const actualName = story.username === 'luna_wave' ? 'sarah l.' : story.username === 'kai_zen' ? 'liam k.' : 'jordan p.';
                        const matchesQuery = storySearchQuery ? (
                          userName.includes(storySearchQuery.toLowerCase()) ||
                          actualName.includes(storySearchQuery.toLowerCase()) ||
                          (story.caption && story.caption.toLowerCase().includes(storySearchQuery.toLowerCase())) ||
                          (story.content && story.content.toLowerCase().includes(storySearchQuery.toLowerCase())) ||
                          (story.geo?.locationName && story.geo.locationName.toLowerCase().includes(storySearchQuery.toLowerCase()))
                        ) : true;

                        if (!matchesQuery) return false;

                        if (storyActiveFilter === 'close_friends') return story.isCloseFriendsOnly;
                        if (storyActiveFilter === 'text') return story.mediaType === 'text_gradient';
                        if (storyActiveFilter === 'media') return story.mediaType === 'image';
                        return true;
                      }).map((story, idx) => (
                        <button 
                          key={story.id} 
                          id={`story-ring-interactive-${story.id}`}
                          onClick={() => setActiveStoryIdx(idx)}
                          className="flex flex-col items-center gap-1 shrink-0 focus:outline-none relative animate-fade-in"
                        >
                          {/* Circle gradient wrap */}
                          <div className={`relative p-[2.5px] rounded-full bg-gradient-to-tr ${
                            story.isCloseFriendsOnly 
                              ? 'from-emerald-500 via-teal-400 to-green-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]' 
                              : 'from-purple-500 via-fuchsia-500 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                            } transition-transform hover:scale-105 active:scale-95 duration-200`}>
                            <div className="p-0.5 bg-[#05020c] rounded-full">
                              <img src={story.userAvatar} alt={story.username} className="w-[44px] h-[44px] rounded-full object-cover" />
                            </div>
                            
                            {story.isCloseFriendsOnly && (
                              <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-[3px] border border-slate-900 shadow">
                                <Star className="w-[8px] h-[8px] fill-emerald-100" />
                              </div>
                            )}

                            {/* Visual timestamp marker tag */}
                            <div className={`absolute -bottom-1 -right-1 text-white text-[7px] font-bold px-1 py-0.2 rounded border border-slate-900 scale-90 ${
                              story.isCloseFriendsOnly ? 'bg-emerald-600' : 'bg-purple-600'
                            }`}>
                              {idx === 0 ? '2h' : idx === 1 ? '3h' : '4h'}
                            </div>
                          </div>
                          <span className={`text-[10px] max-w-[56px] truncate font-sans mt-0.5 ${
                            story.isCloseFriendsOnly ? 'text-emerald-400 font-bold' : 'text-slate-300 font-medium'
                          }`}>
                            {story.username === 'luna_wave' ? 'Sarah L.' : story.username === 'kai_zen' ? 'Liam K.' : 'Jordan P.'}
                          </span>
                        </button>
                      ))}

                      {/* Explicit extra dummy story from screenshot (Mia C.) */}
                      {(storyActiveFilter === 'all' || storyActiveFilter === 'media') && (!storySearchQuery || 'mia c.'.includes(storySearchQuery.toLowerCase())) && (
                        <button 
                          onClick={() => {
                            setStatusMessage("Mia C.'s storage is locking in. Interactive unlock via Map.");
                            setTimeout(() => setStatusMessage(null), 3000);
                          }}
                          className="flex flex-col items-center gap-1 shrink-0 focus:outline-none opacity-90"
                        >
                          <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-pink-500">
                            <div className="p-0.5 bg-[#05020c] rounded-full">
                              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Mia C." className="w-[44px] h-[44px] rounded-full object-cover" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-[7px] font-bold px-1 py-0.2 rounded border border-slate-900 scale-90">
                              4h
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-300 max-w-[56px] truncate font-medium mt-0.5">Mia C.</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dashboard Scroll Segment */}
                <div className="flex-1 overflow-y-auto p-3 space-y-4">

                  {/* Curated Proof-Of-Impact Posts */}
                  {proofPosts.map((post) => (
                    <div 
                      key={post.id} 
                      className="bg-[#120a24]/80 border-2 border-fuchsia-500/25 rounded-[24px] p-3 shadow-xl space-y-3 relative overflow-hidden"
                    >
                      {/* Ambient background glow if user-curated */}
                      <div className="absolute -top-12 -left-12 w-24 h-24 bg-fuchsia-500/10 blur-xl rounded-full" />
                      
                      {/* Post Header */}
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2.5">
                          <img src={post.avatar} alt={post.author} className="w-8.5 h-8.5 rounded-full object-cover border border-purple-500/30" />
                          <div className="flex flex-col text-left">
                            <div className="flex items-center gap-1">
                              <span className="text-[11.5px] font-extrabold text-white">{post.author}</span>
                              <span className="w-1 h-1 bg-fuchsia-400 rounded-full animate-ping" />
                              <span className="text-[8.5px] text-fuchsia-300 font-mono font-bold">VERIFIED CURATOR</span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono leading-none mt-0.5">{post.username}</span>
                          </div>
                        </div>

                        <span className="text-slate-500 font-mono text-[8px]">{post.timestamp}</span>
                      </div>

                      {/* Display Image with exact CSS filters embedded */}
                      <div className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-[#05020c] border border-purple-950">
                        <img 
                          src={post.imgUrl} 
                          alt="Curated result state" 
                          className="w-full h-full object-cover transition-all"
                          style={{
                            filter: `brightness(${post.brightness}%) contrast(${post.contrast}%) saturate(${post.saturation}%)`
                          }}
                        />
                        
                        {/* Dynamic filter telemetry badges */}
                        <div className="absolute top-2.5 right-2.5 bg-black/75 px-2 py-0.5 rounded-full text-[7.5px] font-mono text-fuchsia-300 border border-purple-500/20 flex gap-2">
                          <span>B:{post.brightness}%</span>
                          <span>C:{post.contrast}%</span>
                          <span>S:{post.saturation}%</span>
                        </div>

                        {/* Location / Zone Tag */}
                        <div className="absolute bottom-3 left-3 bg-black/80 border border-purple-500/20 px-2 py-0.5 rounded-full text-[8.5px] text-slate-300 font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-fuchsia-400 animate-bounce" />
                          <span>SOMA Volunteer Zone</span>
                        </div>
                      </div>

                      <div className="text-left space-y-1.5 relative z-10 font-sans">
                        {/* Milestone verified block */}
                        <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.8 rounded-xl text-emerald-400 text-[8.5px] font-mono font-bold">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{post.milestone}</span>
                        </div>

                        <p className="text-[11px] text-slate-200 leading-relaxed font-medium">
                          {post.caption}
                        </p>
                      </div>

                      {/* Action Trays */}
                      <div className="flex items-center justify-between pt-1 border-t border-purple-950/30 font-mono">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => {
                              setProofPosts(prev => prev.map(p => {
                                if (p.id === post.id) {
                                  const liked = !p.hasLiked;
                                  return { ...p, hasLiked: liked, likes: p.likes + (liked ? 1 : -1) };
                                }
                                return p;
                              }));
                              setStatusMessage("+1 Gem heart registered");
                              setTimeout(() => setStatusMessage(null), 1500);
                            }}
                            className={`flex items-center gap-1 text-[10px] transition-all cursor-pointer ${post.hasLiked ? 'text-pink-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'}`}
                          >
                            <Gem className={`w-3.5 h-3.5 ${post.hasLiked ? 'text-pink-400 fill-pink-500/20' : 'text-slate-400'}`} />
                            <span>{post.likes} Gems</span>
                          </button>
                        </div>

                        <span className="text-[7.5px] text-purple-400 font-mono uppercase bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/10">ON-CHAIN VERIFIED</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Sunset Post from Alex R. (@alex_photography - 2h) */}
                  <div id="feed-sunset-post" className="bg-[#120a24]/50 border border-purple-950/40 rounded-[24px] p-3 shadow-xl space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Alex R." className="w-8.5 h-8.5 rounded-full object-cover border border-purple-500/30" />
                        <div className="flex flex-col text-left">
                          <div className="flex items-center gap-1">
                            <span className="text-[11.5px] font-extrabold text-white">Alex R.</span>
                            <span className="w-1 h-1 bg-purple-500 rounded-full" />
                            <span className="text-[9.5px] text-slate-400">2h</span>
                          </div>
                          <span className="text-[9px] text-purple-400 font-mono leading-none mt-0.5">@alex_photography</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setStatusMessage("Cryptographic key for post locked in feed context");
                          setTimeout(() => setStatusMessage(null), 2500);
                        }}
                        className="text-purple-400 hover:text-purple-300 text-xs font-bold font-mono"
                      >
                        SPEC #04
                      </button>
                    </div>

                    {/* Image Area */}
                    <div className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-[#05020c]">
                      <img 
                        src="https://images.unsplash.com/photo-1472214222541-d510753a4707?w=600&auto=format&fit=crop&q=80" 
                        alt="Golden hour vibes sunset" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                      {/* Interactive overlay tag */}
                      <div className="absolute bottom-3 left-3 bg-[#0a0514]/80 backdrop-blur-md border border-purple-500/20 px-2 py-0.5 rounded-full text-[8.5px] text-purple-300 font-bold flex items-center gap-1.5 shadow-md">
                        <MapPin className="w-3 h-3 text-pink-500" />
                        <span>SOMA Overlook point</span>
                      </div>
                    </div>

                    {/* Captions and hashtags */}
                    <div className="text-left space-y-1">
                      <p className="text-[11px] text-slate-200 leading-relaxed">
                        Golden hour vibes... ✨ <span className="text-purple-400">#sunset</span> <span className="text-pink-400">#travel</span>
                      </p>
                    </div>

                    {/* Action Trays */}
                    <div className="flex items-center justify-between pt-1 border-t border-purple-950/30">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => {
                            if (hasLikedSunset) {
                              setSunsetLikes(prev => prev - 1);
                              setHasLikedSunset(false);
                            } else {
                              setSunsetLikes(prev => prev + 1);
                              setHasLikedSunset(true);
                              setStatusMessage("+1 heart synchronized to SOMA Grid node!");
                              setTimeout(() => setStatusMessage(null), 2500);
                            }
                          }}
                          className={`flex items-center gap-1.5 text-[10.5px] transition-all hover:scale-105 cursor-pointer ${
                            hasLikedSunset ? 'text-pink-500' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${hasLikedSunset ? 'fill-pink-500 stroke-pink-500' : ''}`} />
                          <span className="font-mono font-bold">{sunsetLikes.toLocaleString()}</span>
                        </button>

                        <button 
                          onClick={() => {
                            setSunsetCommentsCount(c => c + 1);
                            setStatusMessage("Feed comments lock into persistent chat frame!");
                            setTimeout(() => setStatusMessage(null), 2500);
                          }}
                          className="flex items-center gap-1.5 text-[10.5px] text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span className="font-mono font-bold">{sunsetCommentsCount}</span>
                        </button>

                        <button 
                          onClick={() => {
                            setStatusMessage("Post link copied to system broadcast loop");
                            setTimeout(() => setStatusMessage(null), 2500);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button 
                        onClick={() => {
                          setStatusMessage("Saved to encrypted memory vault");
                          setTimeout(() => setStatusMessage(null), 2000);
                        }}
                        className="p-1 text-slate-400 hover:text-purple-400 cursor-pointer"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* BENTO GRID ROW: Mia C. Vlog Left & Recent Chats Right */}
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Left: Mia C. Vlog Card */}
                    <div id="vlog-play-card" className="bg-[#120a24]/50 border border-purple-950/40 rounded-[20px] p-2 flex flex-col justify-between h-[155px] text-left relative overflow-hidden group shadow-lg">
                      <div className="absolute inset-0 z-0">
                        <img 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80" 
                          alt="Mia C Vlog" 
                          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0716] via-transparent to-black/30" />
                      </div>

                      {/* Header block metadata */}
                      <div className="relative z-10 flex items-center gap-1 bg-[#120a24]/80 p-1 rounded-lg border border-purple-500/15 w-fit">
                        <span className="text-[8px] font-bold text-fuchsia-400">Mia C.</span>
                        <span className="text-[7.5px] text-slate-405 font-mono">@mia_vlogs</span>
                      </div>

                      {/* Play Action center overlay */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <button 
                          onClick={() => {
                            setVlogViews(v => v + 1);
                            setStatusMessage("Simulating play session of AES-Encrypted HLS stream...");
                            setTimeout(() => setStatusMessage(null), 3000);
                          }}
                          className="w-[34px] h-[34px] rounded-full bg-[#ec4899]/90 border border-pink-400 flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 duration-200"
                        >
                          <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                        </button>
                      </div>

                      {/* Footer view stats info */}
                      <div className="relative z-10 flex items-end justify-between font-sans">
                        <span className="text-[10px] font-bold text-slate-100 max-w-[90px] truncate leading-tight">A day in the life! ☀️</span>
                        <span className="text-[8px] font-mono text-pink-300 bg-pink-500/10 px-1 py-0.2 rounded shrink-0">{vlogViews.toLocaleString()} views</span>
                      </div>
                    </div>

                    {/* Right: Recent Chats Mini card (matches screenshot 2) */}
                    <div id="mini-recent-chats-card" className="bg-[#120a24]/50 border border-purple-950/40 rounded-[20px] p-3 flex flex-col justify-between h-[155px] text-left shadow-lg">
                      <div>
                        <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-purple-950/30">
                          <span className="text-[9.5px] font-bold tracking-wider text-slate-400 uppercase">Recent Chats</span>
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                        </div>

                        {/* Chats mini lists layout */}
                        <div className="space-y-2">
                          <button 
                            onClick={() => handleChatSelect('chat_1')}
                            className="w-full flex items-start gap-1.5 hover:bg-purple-950/35 p-1 rounded-lg transition-transform hover:scale-102 text-left"
                          >
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Sarah L." className="w-6 h-6 rounded-full object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between leading-none">
                                <span className="text-[9px] font-extrabold text-slate-200 truncate">Sarah L.</span>
                                <span className="text-[7px] text-purple-400">10:15am</span>
                              </div>
                              <p className="text-[8px] text-slate-300 truncate mt-0.5"><span className="text-purple-400 font-bold">Sarah:</span> Yes!</p>
                            </div>
                            <div className="w-3 h-3 bg-pink-600 rounded-full flex items-center justify-center text-[7px] text-white font-bold shrink-0 self-center">1</div>
                          </button>

                          <button 
                            onClick={() => handleChatSelect('chat_group_1')}
                            className="w-full flex items-start gap-1.5 hover:bg-purple-950/35 p-1 rounded-lg transition-transform hover:scale-102 text-left"
                          >
                            <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=100&auto=format&fit=crop&q=80" alt="Group Project" className="w-6 h-6 rounded-full object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between leading-none">
                                <span className="text-[9px] font-extrabold text-slate-200 truncate">Group: Project X</span>
                                <span className="text-[7px] text-slate-500 font-mono">Typing...</span>
                              </div>
                              <p className="text-[8px] text-slate-300 truncate mt-0.5"><span className="text-pink-400 font-bold">Liam:</span> Updated file...</p>
                            </div>
                          </button>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          setActiveTab('chats');
                          setIsInsideChatRoom(false);
                        }}
                        className="w-full py-1 text-center bg-purple-950/60 hover:bg-purple-900/50 rounded-lg text-[8.5px] text-purple-300 font-bold border border-purple-500/10 active:scale-95 transition-transform"
                      >
                        All Stream Channels →
                      </button>
                    </div>

                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB 3: SPLENDID MAP VIEW DISCOVERY (Screenshot 1 Styling) */}
            {activeTab === 'explore' && (
              <motion.div
                key="explore_screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col relative"
              >
                {/* Header view overlay */}
                <div className="p-3 bg-gradient-to-b from-[#0e0921] to-[#05020c]/10 border-b border-purple-950/20 shrink-0 space-y-2.5 z-30">
                  <div className="flex items-center justify-between">
                    <h2 id="map-view-title" className="text-sm font-extrabold text-white tracking-tight">Map View</h2>
                    <button 
                      onClick={() => {
                        setSelectedMarkerId('marker_cozy');
                        setStatusMessage("South Park regional node centered. Coordinates synchronized!");
                        setTimeout(() => setStatusMessage(null), 2500);
                      }}
                      className="p-1.5 bg-purple-950/60 hover:bg-purple-900/40 text-purple-300 rounded-xl border border-purple-500/15"
                    >
                      <Navigation className="w-4 h-4 transform rotate-45" />
                    </button>
                  </div>

                  {/* Modern Map Search input bar */}
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search" 
                      className="w-full bg-[#120a24]/90 border border-purple-900/30 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  {/* Live Location Sync Bar */}
                  <div className="flex items-center justify-between bg-[#12072a]/85 p-2 rounded-xl border border-purple-950/60 shadow-inner">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-sans font-bold">
                      <div className={`w-2.5 h-2.5 rounded-full ${isSharingLiveCoords ? 'bg-emerald-500 animate-pulse ring-4 ring-emerald-950' : 'bg-slate-600'}`} />
                      <span>Live Coordinate Share</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSharingLiveCoords && (
                        <span className="text-[7.5px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider animate-pulse">
                          Sync Status: Active
                        </span>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => {
                          const nextState = !isSharingLiveCoords;
                          setIsSharingLiveCoords(nextState);
                          if (!nextState) setTrackingRouteToFriend(null);
                          onTriggerWsLog({
                            id: `log_${Date.now()}`,
                            timestamp: new Date().toISOString(),
                            direction: 'client_to_server',
                            event: 'map:live_location_share',
                            payload: { isSharingActive: nextState, trackingRadiusMeters: 500 }
                          });
                          setStatusMessage(nextState ? "Live GPS handshake broadcast fully active!" : "Live GPS link severed. Coordinates masked.");
                          setTimeout(() => setStatusMessage(null), 2500);
                        }}
                        className={`text-[8.5px] font-black uppercase font-mono px-2 py-0.5 rounded transition-all active:scale-95 duration-150 ${
                          isSharingLiveCoords 
                            ? 'bg-emerald-500 text-[#05020c] font-extrabold hover:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                            : 'bg-purple-950 text-purple-300 border border-purple-500/20'
                        }`}
                      >
                        {isSharingLiveCoords ? 'Active' : 'Muted'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Simulated high-end Map Grid Container */}
                <div 
                  ref={mapContainerRef} 
                  id="gm-interactive-map-explore"
                  className="w-full flex-1 relative bg-[#05020c] overflow-hidden"
                >
                  {/* Grid topology template simulation lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a114f_1px,transparent_1px),linear-gradient(to_bottom,#2a114f_1px,transparent_1px)] bg-[size:32px_32px] opacity-25" />

                  {/* High Quality SVG Roadmap lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none">
                    <path d="M-10,120 Q120,180 400,240" fill="none" stroke="#4a1873" strokeWidth="3" />
                    <path d="M120,-10 C90,260 210,500 240,800" fill="none" stroke="#37155a" strokeWidth="2.5" />
                    <path d="M280,0 Q320,380 180,800" fill="none" stroke="#6b21a8" strokeWidth="1.5" strokeDasharray="3,3" />
                    <circle cx="210" cy="310" r="110" fill="none" stroke="#d946ef" strokeWidth="1" strokeDasharray="5,15" className="animate-spin duration-10000" />
                    <circle cx="210" cy="310" r="55" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                  </svg>

                  {/* Real-time Dotted Coordinate Routing Path tracker */}
                  {isSharingLiveCoords && trackingRouteToFriend && (
                    <svg className="absolute inset-0 w-full h-full opacity-95 pointer-events-none z-15">
                      <line 
                        x1="130" 
                        y1="210" 
                        x2={trackingRouteToFriend === 'Sarah L.' ? '85' : trackingRouteToFriend === 'Liam K.' ? '290' : '285'} 
                        y2={trackingRouteToFriend === 'Sarah L.' ? '180' : trackingRouteToFriend === 'Liam K.' ? '140' : '320'} 
                        stroke="#10b981" 
                        strokeWidth="2.5" 
                        strokeDasharray="6,4" 
                        className="animate-pulse"
                      />
                    </svg>
                  )}

                  {/* User's own Live GPS Icon */}
                  {isSharingLiveCoords && (
                    <div className="absolute left-[110px] top-[195px] z-25 text-center pointer-events-none">
                      <div className="relative">
                        <div className="absolute -inset-2 bg-emerald-500 rounded-full blur-md opacity-40 animate-ping" />
                        <div className="p-0.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] pr-1.5 pl-0.5 py-0.5 flex items-center gap-1.5 text-[8.5px] font-mono text-white font-extrabold bg-[#05020c] border border-emerald-500/40">
                          <img src={CURRENT_USER.avatar} alt="Me" className="w-[18px] h-[18px] rounded-full object-cover border border-emerald-400" />
                          <span>Me (Live)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Concentric pulsing layout around active points */}
                  <div className="absolute left-[35px] top-[140px] w-[110px] h-[110px] rounded-full border border-purple-500/10 animate-ping duration-3000 pointer-events-none" />
                  <div className="absolute left-[155px] top-[255px] w-[110px] h-[110px] rounded-full border border-fuchsia-500/15 animate-ping duration-2000 pointer-events-none" />
                  <div className="absolute left-[245px] top-[340px] w-[110px] h-[110px] rounded-full border border-pink-500/10 animate-ping duration-4000 pointer-events-none" />

                  {/* Current Active Pin (Glowing violet gem from screenshot 1!) */}
                  <div className="absolute left-[195px] top-[295px] z-20">
                    <div className="relative">
                      {/* Aura glowing */}
                      <div className="absolute -inset-3 bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 rounded-full opacity-50 blur-md animate-pulse" />
                      <button 
                        onClick={() => {
                          setSelectedMarkerId('marker_cozy');
                          setStatusMessage("Centered on pop-up coordinates");
                          setTimeout(() => setStatusMessage(null), 2500);
                        }}
                        className="relative w-8.5 h-8.5 bg-gradient-to-tr from-purple-800 to-fuchsia-600 border border-pink-300 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.45)] hover:scale-108 transition-transform"
                      >
                        <Gem className="w-5 h-5 text-pink-300 animate-spin" />
                      </button>
                    </div>
                  </div>

                  {/* Map Avatars with glowing rings */}
                  {/* Avatar 1: Sarah L */}
                  <div className="absolute left-[85px] top-[180px] z-10">
                    <button 
                      onClick={() => {
                        setSelectedMarkerId('marker_1');
                        if (isSharingLiveCoords) {
                          setTrackingRouteToFriend(prev => prev === 'Sarah L.' ? null : 'Sarah L.');
                          setStatusMessage("Routing trajectory link computed!");
                          setTimeout(() => setStatusMessage(null), 2500);
                        }
                        onTriggerWsLog({
                          id: `log_${Date.now()}`,
                          timestamp: new Date().toISOString(),
                          direction: 'client_to_server',
                          event: 'map:select_sarah',
                          payload: { peer: "Sarah L.", routing: isSharingLiveCoords }
                        });
                      }}
                      className="group relative focus:outline-none"
                    >
                      <div className="absolute -inset-2 rounded-full bg-purple-500/20 blur-sm group-hover:scale-125 transition-transform animate-pulse" />
                      <div className={`relative p-0.5 rounded-full ${isSharingLiveCoords && trackingRouteToFriend === 'Sarah L.' ? 'bg-emerald-400 ring-4 ring-emerald-950/80 animate-bounce' : 'bg-[#a855f7]'} shadow-[0_0_8px_rgba(168,85,247,0.5)]`}>
                        <div className="p-0.5 bg-[#05020c] rounded-full">
                          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Sarah L" className="w-[34px] h-[34px] rounded-full object-cover" />
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Avatar 2: Liam K */}
                  <div className="absolute right-[95px] top-[140px] z-10">
                    <button 
                      onClick={() => {
                        setSelectedMarkerId('marker_2');
                        if (isSharingLiveCoords) {
                          setTrackingRouteToFriend(prev => prev === 'Liam K.' ? null : 'Liam K.');
                          setStatusMessage("Routing trajectory link computed!");
                          setTimeout(() => setStatusMessage(null), 2500);
                        }
                      }}
                      className="group relative focus:outline-none"
                    >
                      <div className="absolute -inset-2 rounded-full bg-fuchsia-500/20 blur-sm group-hover:scale-125 transition-transform animate-pulse" />
                      <div className={`relative p-0.5 rounded-full ${isSharingLiveCoords && trackingRouteToFriend === 'Liam K.' ? 'bg-emerald-400 ring-4 ring-emerald-950/80 animate-bounce' : 'bg-[#ec4899]'} shadow-[0_0_8px_rgba(236,72,153,0.5)]`}>
                        <div className="p-0.5 bg-[#05020c] rounded-full">
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Liam K" className="w-[34px] h-[34px] rounded-full object-cover" />
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Avatar 3: Solomon */}
                  <div className="absolute right-[65px] top-[320px] z-10">
                    <button 
                      onClick={() => {
                        setSelectedMarkerId('marker_3');
                        if (isSharingLiveCoords) {
                          setTrackingRouteToFriend(prev => prev === 'Solomon K.' ? null : 'Solomon K.');
                          setStatusMessage("Routing trajectory link computed!");
                          setTimeout(() => setStatusMessage(null), 2500);
                        }
                      }}
                      className="group relative focus:outline-none"
                    >
                      <div className="absolute -inset-2 rounded-full bg-pink-500/20 blur-sm group-hover:scale-125 transition-transform" />
                      <div className={`relative p-0.5 rounded-full ${isSharingLiveCoords && trackingRouteToFriend === 'Solomon K.' ? 'bg-emerald-400 ring-4 ring-emerald-950/80 animate-bounce' : 'bg-gradient-to-tr from-[#ec4899] to-[#bfdbfe]'} shadow-[0_0_8px_rgba(244,63,94,0.5)]`}>
                        <div className="p-0.5 bg-[#05020c] rounded-full">
                          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Solomon" className="w-[34px] h-[34px] rounded-full object-cover" />
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Glassmorphism details Overlay Drawer card (Matches Screenshot 1 details perfectly!) */}
                  <AnimatePresence>
                    {selectedMarkerId && (() => {
                      if (selectedMarkerId === 'marker_cozy') {
                        return (
                          <motion.div
                            id="cozy-pop-up-card"
                            initial={{ y: 150, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 150, opacity: 0 }}
                            className="absolute bottom-4 left-4 right-4 bg-[#0e0722]/95 border border-fuchsia-500/30 p-3.5 rounded-3xl shadow-[0_4px_30px_rgba(244,63,94,0.15)] backdrop-blur-xl z-30 flex flex-col gap-2.5 text-left"
                          >
                            <div className="flex items-start gap-3">
                              {/* Cafe thumbnail photo left */}
                              <div className="w-[85px] h-[95px] rounded-2xl overflow-hidden bg-[#05020c] shrink-0 border border-purple-500/10 relative">
                                <img 
                                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80" 
                                  alt="Local Roasters Meetup" 
                                  className="w-full h-full object-cover saturate-110"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1 text-center">
                                  <span className="text-[7px] text-fuchsia-300 font-extrabold uppercase tracking-wide">GEM PROJECT</span>
                                </div>
                              </div>

                              {/* Details right */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-[12px] font-black text-white hover:text-fuchsia-300 transition-colors truncate">☕ Local Roasters Meetup</h4>
                                  <button onClick={() => setSelectedMarkerId(null)} className="text-slate-400 hover:text-white p-0.5 transition-colors cursor-pointer">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <span className="text-[9px] text-fuchsia-400 font-mono font-bold flex items-center gap-1">
                                  by Sarah L.
                                  <ShieldCheck className="w-3 h-3 text-fuchsia-400" />
                                </span>
                                <p className="text-[9.5px] text-slate-300 leading-snug mt-1 max-h-[38px] overflow-hidden">
                                  Co-designing customized micro-roasts with community flavor metrics & spatial feedback logs.
                                </p>
                                
                                {/* Dynamic project metric: Milestone Progress */}
                                <div className="mt-1.5 space-y-1">
                                  <div className="flex items-center justify-between text-[8px] font-mono">
                                    <span className="text-slate-400 uppercase">Project Milestone</span>
                                    <span className="text-fuchsia-400 font-extrabold">{projectMilestoneProgress}% complete</span>
                                  </div>
                                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-purple-900/45">
                                    <div 
                                      className="h-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 rounded-full transition-all duration-500"
                                      style={{ width: `${projectMilestoneProgress}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* View Project goal / Media showcase section */}
                            <div className="grid grid-cols-2 gap-2 my-0.5 bg-[#120a24]/50 p-2 rounded-2xl border border-purple-950/40">
                              <div className="flex flex-col text-left">
                                <span className="text-[7.5px] font-mono text-slate-400 uppercase">Live interested</span>
                                <span className="text-xs font-black text-rose-400 flex items-center gap-1 font-mono">
                                  <Gem className="w-3.5 h-3.5 animate-pulse text-pink-400" />
                                  15 GEMS
                                </span>
                              </div>
                              <div className="flex flex-col text-left border-l border-purple-950/40 pl-2">
                                <span className="text-[7.5px] font-mono text-slate-400 uppercase">Proof Media</span>
                                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 font-mono">
                                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                                  {proofPosts.length + 1} curated
                                </span>
                              </div>
                            </div>

                            {/* Badge and Active interaction buttons */}
                            <div className="flex items-center justify-between border-t border-purple-950/40 pt-2 text-[9px]">
                              {/* 15 gems interested badge button */}
                              <button 
                                onClick={() => {
                                  setTotalGEMSGenerated(prev => prev + 1);
                                  setStatusMessage("Successfully staked 1 GEM coordinate on Sarah's project!");
                                  onTriggerWsLog({
                                    id: `log_${Date.now()}`,
                                    timestamp: new Date().toISOString(),
                                    direction: 'client_to_server',
                                    event: 'project:stake_gem',
                                    payload: { project: "Local Roasters Meetup", participant: CURRENT_USER.username }
                                  });
                                  setTimeout(() => setStatusMessage(null), 2500);
                                }}
                                className="flex items-center gap-1 text-pink-300 bg-pink-500/10 p-1 px-2.5 rounded-full border border-pink-500/25 hover:bg-pink-500/20 active:scale-95 transition-all text-[8.5px] font-mono cursor-pointer"
                              >
                                <Gem className="w-3 h-3 text-pink-400 animate-bounce" />
                                <span className="font-semibold">+ STAKE GEM</span>
                              </button>

                              <div className="flex items-center gap-1.5">
                                <button 
                                  onClick={() => {
                                    setStatusMessage("Launching Content Universe detail deck...");
                                    setTimeout(() => setStatusMessage(null), 2000);
                                    setActiveStoryIdx(0);
                                  }}
                                  className="p-1 px-2 rounded-xl bg-purple-950/70 border border-purple-500/20 hover:bg-purple-900/60 transition-colors text-slate-300 hover:text-white font-mono text-[8.5px] cursor-pointer"
                                >
                                  VIEW MEDIA
                                </button>
                                <button 
                                  onClick={() => {
                                    setStatusMessage("Synthesizing Temporary Volunteer Crew Sockets...");
                                    onTriggerWsLog({
                                      id: `log_${Date.now()}`,
                                      timestamp: new Date().toISOString(),
                                      direction: 'client_to_server',
                                      event: 'room:convert_volunteer_group',
                                      payload: {
                                        roomId: 'chat_group_roasters_vol',
                                        originalMarkerId: 'marker_cozy',
                                        assignedName: '☕ Roasters Volunteers Squad',
                                        volunteers: ['@luna_wave', '@kai_zen', '@sol_pixel', '@alex_gem']
                                      }
                                    });

                                    setTimeout(() => {
                                      handleChatSelect('chat_group_1');
                                      setStatusMessage("Formed Crew! Group chat synchronized.");
                                      setTimeout(() => setStatusMessage(null), 2500);
                                    }, 800);
                                  }}
                                  className="p-1 px-2.5 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white font-bold rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all text-[8.5px] cursor-pointer"
                                >
                                  FORM CREW
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      }

                      // Dynamic Marker overlay
                      const selMarker = markers.find(m => m.id === selectedMarkerId);
                      if (!selMarker) return null;
                      return (
                        <motion.div
                          id="marker-detail-generic"
                          initial={{ y: 150, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 150, opacity: 0 }}
                          className="absolute bottom-4 left-4 right-4 bg-[#0a0515]/95 border border-purple-500/20 p-3 rounded-2xl shadow-xl backdrop-blur-xl z-30 flex flex-col gap-2.5"
                        >
                          <div className="flex items-start justify-between text-left">
                            <div className="flex items-center gap-2">
                              <img src={selMarker.creatorAvatar} alt={selMarker.creatorName} className="w-7.5 h-7.5 rounded-full border border-purple-500/30 object-cover" />
                              <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400">Tagged by {selMarker.creatorName}</span>
                                <h4 className="text-xs font-black text-white">{selMarker.title}</h4>
                              </div>
                            </div>
                            <button 
                              onClick={() => setSelectedMarkerId(null)} 
                              className="p-0.5 text-slate-400 hover:text-white hover:bg-purple-950/50 rounded-md"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-[9.5px] text-slate-300 leading-relaxed text-left">{selMarker.description}</p>

                          {selMarker.thumbnailUrl && (
                            <div className="relative w-full h-[85px] rounded-xl overflow-hidden border border-purple-950/50 bg-[#05020c]">
                              <img src={selMarker.thumbnailUrl} alt={selMarker.title} className="w-full h-full object-cover" />
                              <div className="absolute top-2 right-2 bg-purple-950/80 backdrop-blur-md text-[7px] text-fuchsia-400 font-bold px-1.5 py-0.5 rounded border border-fuchsia-500/30">
                                24h Remaining
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between border-t border-purple-950/40 pt-2 text-[9px]">
                            <span className="text-purple-400 font-bold font-mono">Range segment: 35m</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => {
                                  setStatusMessage(`Voted spatial record on network!`);
                                  setTimeout(() => setStatusMessage(null), 2500);
                                }}
                                className="flex items-center gap-1.5 text-slate-300 hover:text-pink-400 font-bold font-mono bg-purple-950/50 p-1 px-2.5 rounded-lg border border-purple-500/10 cursor-pointer"
                              >
                                <Heart className="w-3 h-3 fill-pink-500/10" />
                                <span>{selMarker.likes}</span>
                              </button>
                              <button 
                                onClick={() => {
                                  const matchingChat = chats.find(c => c.name.includes(selMarker.creatorName) || c.id === 'chat_group_1');
                                  if (matchingChat) {
                                    handleChatSelect(matchingChat.id);
                                    setSelectedMarkerId(null);
                                  }
                                }}
                                className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-2.5 py-1 rounded-xl text-[8.5px] cursor-pointer shadow-md shadow-purple-950/50"
                              >
                                Open Sync Chat
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* TAB 4: HIGH FREQUENCY CHATS (LIST VIEW & ACTIVE ROOM) */}
            {activeTab === 'chats' && (
              <motion.div
                key="chats_screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col"
              >
                {!isInsideChatRoom ? (
                  /* Conversations List View */
                  <div className="w-full h-full flex flex-col">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-b from-[#0e0921] to-[#05020c] border-b border-purple-950/50 shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col text-left">
                          <h2 className="text-sm font-extrabold text-white tracking-tight">Encrypted Streams</h2>
                          <span className="text-[9px] text-fuchsia-400 flex items-center gap-1 font-mono mt-0.5">
                            <span className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse" />
                            Secure Keys Authorized
                          </span>
                        </div>
                        <img src={CURRENT_USER.avatar} alt="Me" className="w-7.5 h-7.5 rounded-full border border-purple-500/30 object-cover" />
                      </div>
                    </div>

                    {/* Chat Search Input */}
                    <div className="px-3 pb-3.5 pt-1 border-b border-purple-950/30 shrink-0">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-purple-400">
                          <Search className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="text"
                          placeholder="Search streams, logs, or look up users..."
                          value={chatSearchQuery}
                          onChange={(e) => setChatSearchQuery(e.target.value)}
                          className="w-full pl-8.5 pr-8 py-1.5 bg-[#120a24]/50 border border-purple-950/50 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl text-xs text-white placeholder-slate-500 outline-none font-sans"
                        />
                        {chatSearchQuery && (
                          <button
                            onClick={() => setChatSearchQuery('')}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white pb-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Chat channels listing */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-thin">
                      {(() => {
                        const trimmedQuery = chatSearchQuery.trim().toLowerCase();
                        
                        if (trimmedQuery) {
                          const matchedChats = chats.filter(chat => 
                            chat.name.toLowerCase().includes(trimmedQuery) ||
                            chat.messages.some(msg => msg.text.toLowerCase().includes(trimmedQuery))
                          );

                          // Users that are searchable (excluding user_me)
                          const matchedUsers = MOCK_USERS.filter(u => 
                            u.id !== 'user_me' && (
                              u.name.toLowerCase().includes(trimmedQuery) ||
                              u.username.toLowerCase().includes(trimmedQuery)
                            )
                          );

                          return (
                            <div className="space-y-4">
                              {/* 1. Matches inside active streams */}
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between px-1">
                                  <span className="text-[9px] font-bold text-fuchsia-400 tracking-wider uppercase">Active Sockets Matched ({matchedChats.length})</span>
                                </div>
                                {matchedChats.length > 0 ? (
                                  matchedChats.map(chat => {
                                    const lastMsg = chat.messages[chat.messages.length - 1];
                                    return (
                                      <div
                                        key={chat.id}
                                        onClick={() => {
                                          handleChatSelect(chat.id);
                                          setChatSearchQuery('');
                                        }}
                                        className="p-3 bg-[#120a24]/50 hover:bg-[#120a24]/90 border border-purple-950/40 rounded-2xl flex items-start gap-3 transition-colors cursor-pointer group"
                                      >
                                        <img src={chat.avatar} alt={chat.name} className="w-9 h-9 rounded-xl object-cover border border-purple-500/20" />
                                        <div className="flex-1 min-w-0 text-left">
                                          <div className="flex items-center justify-between leading-none mb-1">
                                            <h4 className="text-[11px] font-black text-slate-200 group-hover:text-purple-400 truncate">{chat.name}</h4>
                                            <span className="text-[8px] text-slate-500 font-mono">LINKED</span>
                                          </div>
                                          <p className="text-[9px] text-slate-400 truncate">
                                            {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : 'No messages'}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="text-[9px] text-slate-500 italic py-2 text-center">No active chats match your query</div>
                                )}
                              </div>

                              {/* 2. Matches inside global simulated directory */}
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between px-1">
                                  <span className="text-[9px] font-bold text-cyan-400 tracking-wider uppercase">Secure Directory Lookup ({matchedUsers.length})</span>
                                </div>
                                {matchedUsers.length > 0 ? (
                                  matchedUsers.map(user => {
                                    return (
                                      <div
                                        key={user.id}
                                        onClick={() => {
                                          if (onCreateNewChat) {
                                            const id = onCreateNewChat(user.username, user.name, user.avatar);
                                            handleChatSelect(id);
                                          }
                                          setChatSearchQuery('');
                                        }}
                                        className="p-3 bg-[#0a0f1d]/40 hover:bg-cyan-500/10 border border-cyan-950/20 hover:border-cyan-505/30 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer group"
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <div className="relative shrink-0">
                                            <img src={user.avatar} alt={user.name} className="w-8.5 h-8.5 rounded-xl object-cover border border-cyan-500/15" />
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#05020c] ${user.status === 'online' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                                          </div>
                                          <div className="text-left min-w-0">
                                            <h4 className="text-[11px] font-bold text-slate-200 group-hover:text-cyan-400 truncate">{user.name}</h4>
                                            <p className="text-[8px] text-slate-400 font-mono">@{user.username}</p>
                                          </div>
                                        </div>
                                        <button className="p-1.5 text-[8px] font-black text-cyan-400 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20 uppercase font-mono flex items-center gap-1">
                                          <UserPlus className="w-2.5 h-2.5" />
                                          Connect
                                        </button>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="text-[9px] text-slate-500 italic py-2 text-center">No directory nodes match query</div>
                                )}
                              </div>
                            </div>
                          );
                        }

                        // Otherwise show standard list
                        return (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between px-1 pb-1">
                              <span className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">Active Sockets</span>
                              <div className="flex items-center gap-2 text-slate-500 font-mono text-[8px]">
                                <span>AES-GCM-256</span>
                                <Filter className="w-3 h-3" />
                              </div>
                            </div>

                            {chats.map(chat => {
                              const lastMsg = chat.messages[chat.messages.length - 1];
                              return (
                                <div
                                  key={chat.id}
                                  id={`chat-thread-${chat.id}`}
                                  onClick={() => handleChatSelect(chat.id)}
                                  className="p-3 bg-[#120a24]/40 hover:bg-[#120a24]/80 border border-purple-950/40 rounded-2xl flex items-start gap-3 transition-colors cursor-pointer group"
                                >
                                  <div className="relative shrink-0">
                                    <img src={chat.avatar} alt={chat.name} className="w-9.5 h-9.5 rounded-xl object-cover border border-purple-500/20" />
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-fuchsia-500 border-2 border-[#05020c] rounded-full" />
                                  </div>
                                  <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center justify-between leading-none mb-1">
                                      <h4 className="text-[11.5px] font-extrabold text-slate-200 group-hover:text-purple-400 transition-colors truncate">{chat.name}</h4>
                                      <span className="text-[8.5px] text-slate-500 font-mono">
                                        {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                      </span>
                                    </div>
                                    <p className="text-[9.5px] text-slate-400 truncate">
                                      {lastMsg ? (
                                        lastMsg.mediaType === 'audio' ? (
                                          <span className="flex items-center gap-1 text-rose-450 font-mono text-[9px]">
                                            🎙️ Voice Note ({lastMsg.audioDuration ? `${Math.floor(lastMsg.audioDuration / 60)}:${String(lastMsg.audioDuration % 60).padStart(2, '0')}` : '0:07'})
                                          </span>
                                        ) : (
                                          `${lastMsg.senderName}: ${lastMsg.text}`
                                        )
                                      ) : 'No messages'}
                                    </p>
                                  </div>
                                  {chat.unreadCount > 0 && (
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-[8.5px] text-white font-bold h-3.5 px-1.5 min-w-3.5 rounded-full flex items-center justify-center shrink-0 self-center">
                                      {chat.unreadCount}
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {/* Direct Connect Quick Start Directory Shortcuts */}
                            <div className="pt-2 border-t border-purple-950/20">
                              <span className="text-[8px] text-purple-400 font-black uppercase tracking-widest pl-1">Secure Directory Quick Sockets</span>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {MOCK_USERS.filter(u => u.id !== 'user_me' && !chats.some(c => c.name === u.name)).map(user => (
                                  <div
                                    key={user.id}
                                    onClick={() => {
                                      if (onCreateNewChat) {
                                        const id = onCreateNewChat(user.username, user.name, user.avatar);
                                        handleChatSelect(id);
                                      }
                                    }}
                                    className="p-2 bg-[#0c051a]/60 hover:bg-[#1a0f35]/50 border border-purple-950/40 hover:border-purple-500/20 rounded-xl flex items-center gap-2 transition-all cursor-pointer text-left"
                                  >
                                    <img src={user.avatar} className="w-6.5 h-6.5 rounded-lg object-cover border border-purple-500/10 animate-fade-in" alt={user.name} />
                                    <div className="min-w-0">
                                      <h5 className="text-[9.5px] font-black text-slate-200 truncate leading-tight">{user.name.split(' ')[0]}</h5>
                                      <span className="text-[7px] text-fuchsia-400 font-mono">@{user.username}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  /* Inside Active Chat Thread Room */
                  activeChat && (
                    <div className="w-full h-full flex flex-col bg-[#05020c]">
                      {/* Chat Room Header */}
                      <div className="p-3 bg-[#0d071a] border-b border-purple-950/50 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                          <button id="btn-back-to-chats" onClick={handleBackToChats} className="p-1 text-slate-400 hover:text-white rounded-lg">
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <div 
                            className="relative cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => {
                              if (activeChat.type === 'group') {
                                setGroupSettingsName(activeChat.name);
                                setGroupSettingsAvatar(activeChat.avatar || '');
                                setIsGroupSettingsOpen(true);
                              } else {
                                setStatusMessage(`${activeChat.name} encryption status is bound.`);
                                setTimeout(() => setStatusMessage(null), 2000);
                              }
                            }}
                          >
                            <img src={activeChat.avatar} alt={activeChat.name} className="w-8.5 h-8.5 rounded-xl object-cover border border-purple-950" />
                            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-fuchsia-500 border-2 border-purple-950 rounded-full" />
                          </div>
                          <div 
                            className="flex flex-col min-w-0 text-left cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => {
                              if (activeChat.type === 'group') {
                                setGroupSettingsName(activeChat.name);
                                setGroupSettingsAvatar(activeChat.avatar || '');
                                setIsGroupSettingsOpen(true);
                              }
                            }}
                          >
                            <h3 className="text-[11.5px] font-extrabold text-slate-200 truncate max-w-[110px] flex items-center gap-1">
                              <span>{activeChat.name}</span>
                              {activeChat.type === 'group' && <span className="text-[9px] text-fuchsia-400 font-mono">• Settings</span>}
                            </h3>
                            <span className="text-[8px] text-fuchsia-400 flex items-center gap-1 font-mono">
                              AES_GCM_P_12 LINKED
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          {activeChat.type === 'group' && (
                            <>
                              {/* Integrated Phase 2: Debrief Video Call Trigger */}
                              <button
                                id="btn-start-video-call"
                                onClick={() => {
                                  setIsVideoCallSuiteOpen(true);
                                  onTriggerWsLog({
                                    id: `log_${Date.now()}`,
                                    timestamp: new Date().toISOString(),
                                    direction: 'client_to_server',
                                    event: 'call:initiate_video_hud',
                                    payload: {
                                      roomId: activeChat.id,
                                      participants: ['@alex_gem_sfc', '@luna_wave', '@kai_zen'],
                                      projectScorecardActive: true
                                    }
                                  });
                                  setStatusMessage("Connecting to Volunteers Debrief Stream...");
                                  setTimeout(() => setStatusMessage(null), 2500);
                                }}
                                className="flex items-center gap-1 text-[8.5px] bg-rose-500/10 border border-rose-500/30 text-rose-300 p-1 px-2 rounded-full hover:bg-rose-500/25 transition-all animate-pulse font-mono cursor-pointer"
                                title="Start Volunteers Video Call & Scorecard overlay"
                              >
                                <Video className="w-3 h-3 text-rose-400" />
                                <span className="font-bold">CALL DEBRIEF</span>
                              </button>

                              <button
                                id="btn-group-settings-cog"
                                onClick={() => {
                                  setGroupSettingsName(activeChat.name);
                                  setGroupSettingsAvatar(activeChat.avatar || '');
                                  setIsGroupSettingsOpen(true);
                                }}
                                className="p-1.5 bg-purple-950/60 border border-purple-500/20 hover:border-purple-400 rounded-xl text-purple-300 hover:text-white transition-all cursor-pointer"
                                title="Configure Group"
                              >
                                <Settings className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          
                          {/* Map-Based Coordination Zone Teleport */}
                          <button 
                            onClick={() => {
                              setActiveTab('explore');
                              setSelectedMarkerId('marker_cozy');
                              onTriggerWsLog({
                                id: `log_${Date.now()}`,
                                timestamp: new Date().toISOString(),
                                direction: 'client_to_server',
                                  event: 'room:teleport_map',
                                payload: { chatId: activeChat.id, purpose: "Coordinate temporary volunteer zone" }
                              });
                              setStatusMessage("Teleporting to temporary coordination zone!");
                              setTimeout(() => setStatusMessage(null), 2000);
                            }}
                            className="flex items-center gap-1 text-[9px] bg-purple-500/15 border border-purple-500/35 text-purple-300 p-1 px-2.5 rounded-full hover:bg-purple-500/25 transition-all font-mono"
                            title="Go to Temporary Coordination Zone on Map"
                          >
                            <Map className="w-2.5 h-2.5 text-fuchsia-400 animate-spin" style={{ animationDuration: '4s' }} />
                            <span>ZONE</span>
                          </button>

                          {/* Wallpaper Palette Selector */}
                          <button 
                            onClick={() => setIsWallpaperMenuOpen(!isWallpaperMenuOpen)}
                            className={`p-1.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                              isWallpaperMenuOpen 
                                ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300' 
                                : 'bg-purple-950/60 border-purple-500/20 text-purple-300 hover:text-white hover:border-purple-400'
                            }`}
                            title="Customize Chat Wallpaper Aesthetic"
                          >
                            <Palette className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Active Wallpaper Selection Popover Overlay */}
                      {isWallpaperMenuOpen && (
                        <div className="absolute top-[52px] right-3 w-56 p-3 bg-[#0d071d]/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl z-40 space-y-2.5 animate-slide-down text-left">
                          <div className="flex items-center justify-between border-b border-purple-950/40 pb-1.5">
                            <span className="text-[9px] font-black uppercase tracking-wider text-fuchsia-400 font-mono">Stream Wallpapers</span>
                            <button 
                              onClick={() => setIsWallpaperMenuOpen(false)}
                              className="text-slate-400 hover:text-white text-[9px] font-bold"
                            >
                              ✕
                            </button>
                          </div>
                          
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                            {Object.entries(WALLPAPER_STYLES).map(([key, style]) => {
                              const isActive = (chatWallpapers[activeChat.id] || 'default') === key;
                              return (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => {
                                    setChatWallpapers(prev => ({ ...prev, [activeChat.id]: key }));
                                    onTriggerWsLog({
                                      id: `log_wp_${Date.now()}`,
                                      timestamp: new Date().toISOString(),
                                      direction: 'client_to_server',
                                      event: 'chat:wallpaper_mutate',
                                      payload: { chatId: activeChat.id, key, scheme: style.name }
                                    });
                                    setIsWallpaperMenuOpen(false);
                                    setStatusMessage(`Style configured to ${style.name}`);
                                    setTimeout(() => setStatusMessage(null), 2000);
                                  }}
                                  className={`w-full p-2 text-left rounded-xl border text-[10px] transition-all flex items-center justify-between ${
                                    isActive
                                      ? 'bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-300'
                                      : 'bg-purple-950/30 border-purple-950/40 hover:bg-purple-950/60 text-slate-300 hover:border-purple-800'
                                  }`}
                                >
                                  <div>
                                    <div className="font-extrabold flex items-center gap-1.5">
                                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-fuchsia-400' : 'bg-slate-600'}`} />
                                      {style.name}
                                    </div>
                                    <div className="text-[7.5px] text-slate-500 mt-0.5">{style.description}</div>
                                  </div>
                                  {isActive && <Check className="w-3 h-3 text-fuchsia-400 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Main Message List Drawer */}
                      {(() => {
                        const activeBgStyle = WALLPAPER_STYLES[chatWallpapers[activeChat.id] || 'default'];
                        return (
                          <div className={`flex-1 overflow-y-auto p-3.5 space-y-3 relative transition-all duration-500 ${activeBgStyle.bgClass}`}>
                            <div className="flex items-center justify-center my-1 z-10 relative">
                              <span className="bg-[#0b0318]/70 text-[8.5px] text-purple-300 px-3 py-0.5 rounded-full border border-purple-500/20 font-mono backdrop-blur-md">
                                SOCKET LINK SECURE • SHA-256 SYMMETRIC
                              </span>
                            </div>

                            {activeChat.messages.map((msg) => {
                              const isMe = msg.senderId === CURRENT_USER.id;
                              return (
                                <div
                                  key={msg.id}
                                  className={`flex gap-2 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''} animate-fade-in`}
                                >
                                  {!isMe && (
                                    <img src={msg.senderAvatar} alt={msg.senderName} className="w-7 h-7 rounded-full object-cover border border-[#22123f] self-end shadow-sm" />
                                  )}
                                  <div className="flex flex-col text-left">
                                    {!isMe && (
                                      <span className="text-[8.5px] text-slate-500 ml-1 mb-0.5">{msg.senderName}</span>
                                    )}
                                    
                                    {/* Replying to quoted box preview */}
                                    {msg.replyTo && (
                                      <div className="mb-0.5 p-1.5 px-2 bg-purple-950/50 rounded-lg border-l-2 border-fuchsia-500 text-[8px] text-slate-400 italic flex flex-col gap-0.5 max-w-xs truncate">
                                        <span className="font-bold text-fuchsia-400 not-italic">@{msg.replyTo.senderName}</span>
                                        <span>{msg.replyTo.text}</span>
                                      </div>
                                    )}

                                    {/* Message bubble itself */}
                                    <div className={`p-2.5 rounded-2xl text-[10.5px] leading-relaxed shadow-sm transition-all relative ${
                                      isMe 
                                        ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-none' 
                                        : `${activeBgStyle.textCard} rounded-bl-none`
                                    }`}>
                                      
                                      {/* View Once Photo render block */}
                                      {msg.isViewOnce ? (
                                        !msg.viewed ? (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setViewingOnceMediaUrl(msg.mediaUrl || '');
                                              setViewingOnceMessageId(msg.id);
                                            }}
                                            className="flex items-center gap-2 p-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-450 border border-pink-500/30 rounded-xl text-white font-extrabold text-[10px] shadow-md active:scale-95 transition-transform"
                                          >
                                            <Lock className="w-3.5 h-3.5 text-white animate-pulse" />
                                            <span>👁️ View Once Media (Tap to Open)</span>
                                          </button>
                                        ) : (
                                          <div className="flex items-center gap-2 text-slate-500 font-mono text-[9px] py-1">
                                            <Unlock className="w-3.5 h-3.5 text-slate-600" />
                                            <span>Disappearing media burned & evicted</span>
                                          </div>
                                        )
                                      ) : (
                                        <div>
                                          {msg.mediaUrl && msg.mediaType !== 'audio' && (
                                            <div className="mb-1.5 rounded-xl overflow-hidden border border-purple-950 max-w-[190px]">
                                              <img src={msg.mediaUrl} alt="Attached attachment" className="w-full h-24 object-cover" />
                                            </div>
                                          )}
                                          
                                          {msg.mediaType === 'audio' ? (
                                            <div className="flex flex-col gap-1 w-44 text-left py-0.5">
                                              <div className="flex items-center gap-2 text-slate-200">
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (playingAudioId === msg.id) {
                                                      setPlayingAudioId(null);
                                                    } else {
                                                      setPlayingAudioId(msg.id);
                                                      onTriggerWsLog({
                                                        id: `log_audio_${Date.now()}`,
                                                        timestamp: new Date().toISOString(),
                                                        direction: 'client_to_server',
                                                        event: 'chat:audio_playback',
                                                        payload: { chatId: activeChat.id, msgId: msg.id, duration: msg.audioDuration || 6 }
                                                      });
                                                    }
                                                  }}
                                                  className="w-7.5 h-7.5 rounded-full bg-fuchsia-500 hover:bg-fuchsia-400 text-white flex items-center justify-center shrink-0 shadow active:scale-90 transition-transform cursor-pointer"
                                                  title="Play Voice Message"
                                                >
                                                  {playingAudioId === msg.id ? (
                                                    <Pause className="w-3 h-3 text-white fill-white" />
                                                  ) : (
                                                    <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                                                  )}
                                                </button>
                                                
                                                {/* Audio waves */}
                                                <div className="flex-1 flex items-end gap-[2px] h-6 px-1 font-mono">
                                                  {[16, 28, 48, 20, 64, 40, 75, 30, 52, 22, 60, 26, 44, 12, 5].map((h, i) => {
                                                    const progress = audioPlayProgress[msg.id] || 0;
                                                    const isPlayed = (i / 15) * 100 < progress;
                                                    return (
                                                      <div 
                                                        key={i} 
                                                        style={{ height: `${h}%` }}
                                                        className={`w-[3px] rounded-full transition-all duration-150 ${isPlayed ? 'bg-fuchsia-400' : 'bg-slate-500/40'}`}
                                                      />
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                              <div className="flex items-center justify-between text-[7px] font-mono pl-1">
                                                <span className={`${activeBgStyle.accentColor} font-bold`}>🎙️ peer voice packet</span>
                                                <span className="text-slate-400 font-mono">
                                                  {playingAudioId === msg.id 
                                                    ? `${Math.floor(((audioPlayProgress[msg.id] || 0) / 100) * (msg.audioDuration || 6))}s` 
                                                    : `0:${String(msg.audioDuration || 6).padStart(2, '0')}`}
                                                </span>
                                              </div>
                                            </div>
                                          ) : (
                                            <span style={{ wordBreak: 'break-word' }}>{msg.text}</span>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                {/* Timer / Expire Countdown clocks */}
                                {msg.expiresAt && (
                                  <div className="flex items-center gap-1 mt-0.5 text-[7.5px] text-amber-400 font-mono">
                                    <Clock className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                    <span>24h Ephemeral packet remaining</span>
                                  </div>
                                )}

                                {/* Message Reactions pills list */}
                                {msg.reactions && msg.reactions.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {(() => {
                                      const counts: Record<string, number> = {};
                                      msg.reactions.forEach(r => { counts[r.emoji] = (counts[r.emoji] || 0) + 1; });
                                      return Object.entries(counts).map(([emoji, count]) => (
                                        <button
                                          key={emoji}
                                          onClick={() => onAddReaction(activeChat.id, msg.id, emoji)}
                                          className="bg-[#120726] border border-purple-950 px-1.5 py-0.2 rounded-full text-[9px] font-bold text-fuchsia-300 flex items-center gap-0.5"
                                        >
                                          <span>{emoji}</span>
                                          <span>{count}</span>
                                        </button>
                                      ));
                                    })()}
                                  </div>
                                )}

                                {/* Micro Interactions Toolbar (Reactions shortcuts & direct replies) */}
                                <div className="flex items-center gap-2 mt-1 px-1 opacity-60 hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => setReplyingMessage({ id: msg.id, senderName: msg.senderName, text: msg.text })}
                                    className="text-slate-500 hover:text-fuchsia-400 font-sans font-bold text-[8px] uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <CornerUpLeft className="w-2.5 h-2.5" />
                                    <span>Quote</span>
                                  </button>
                                  <div className="h-2 w-px bg-purple-950" />
                                  {['❤️', '👍', '🔥', '😂'].map(emoji => (
                                    <button
                                      key={emoji}
                                      type="button"
                                      onClick={() => onAddReaction(activeChat.id, msg.id, emoji)}
                                      className="hover:scale-120 active:scale-95 transition-transform text-[11px] px-0.5 outline-none"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>

                                <div className={`flex items-center gap-1.5 mt-0.5 relative ${isMe ? 'justify-end' : 'justify-start'}`}>
                                  <span className="text-[7.5px] text-slate-500 font-mono">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </span>

                                  {isMe && (() => {
                                    const readByCount = msg.readBy?.length || 0;
                                    const isGroup = activeChat.type === 'group';
                                    const totalRecipients = isGroup 
                                      ? (activeChat.members?.length ? activeChat.members.length - 1 : 3) 
                                      : 1;

                                    const isFullyRead = readByCount >= totalRecipients;
                                    const tickColor = isFullyRead 
                                      ? 'text-cyan-400 font-bold' 
                                      : readByCount > 0 
                                        ? 'text-fuchsia-400 font-bold' 
                                        : 'text-slate-500';

                                    const ticksLabel = readByCount > 0 ? '✓✓' : '✓';
                                    
                                    return (
                                      <div className="relative inline-block">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveReadReceiptPopoverMsgId(prev => prev === msg.id ? null : msg.id);
                                          }}
                                          className={`text-[8.5px] hover:underline hover:text-white focus:outline-none focus:ring-0 ${tickColor} cursor-pointer p-0.5`}
                                          title={readByCount > 0 ? `Read by ${readByCount} peers. Click for info.` : 'Sent'}
                                        >
                                          {ticksLabel}
                                          {readByCount > 0 && <span className="text-[7.5px] ml-0.2 font-sans font-black">({readByCount})</span>}
                                        </button>

                                        {/* Detailed Receipt Overlay Tooltip Popover */}
                                        {activeReadReceiptPopoverMsgId === msg.id && (
                                          <div className="absolute right-0 bottom-full mb-1.5 w-44 p-2.5 bg-[#0e071c]/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.8)] z-50 text-left space-y-1.5 animate-fade-in font-sans">
                                            <div className="flex items-center justify-between border-b border-purple-950/40 pb-1 text-[8px] font-bold text-slate-400 font-mono uppercase tracking-widest">
                                              <span>Secure Ticks</span>
                                              <button 
                                                onClick={(e) => { e.stopPropagation(); setActiveReadReceiptPopoverMsgId(null); }}
                                                className="text-slate-400 hover:text-white"
                                              >
                                                ✕
                                              </button>
                                            </div>
                                            <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                                              {msg.readBy && msg.readBy.length > 0 ? (
                                                msg.readBy.map((reader, rIdx) => {
                                                  const readerDisplayName = reader.username === 'luna_wave' ? 'Sarah L.' : reader.username === 'kai_zen' ? 'Liam K.' : reader.username === 'sol_pixel' ? 'Jordan P.' : reader.username;
                                                  return (
                                                    <div key={rIdx} className="flex items-center gap-1.5">
                                                      <img src={reader.avatar} alt={reader.username} className="w-4 h-4 rounded-full object-cover border border-purple-500/20" />
                                                      <div className="flex flex-col min-w-0">
                                                        <span className="text-[8.5px] font-bold text-slate-200 truncate">{readerDisplayName}</span>
                                                        <span className="text-[6.5px] text-fuchsia-400/80 font-mono">
                                                          {new Date(reader.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  );
                                                })
                                              ) : (
                                                <div className="text-[8px] text-slate-500 italic py-1 text-center font-mono">
                                                  Sent - Unread
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    );
                  })()}

                      {/* Floating Attachment / Disappearing Settings Console & Replies context preview */}
                      <div className="px-3 py-1.5 bg-[#090412] border-t border-purple-950/40 flex flex-col gap-1.5 relative shrink-0">
                        {/* Reply Preview Card */}
                        {replyingMessage && (
                          <div className="flex items-center justify-between bg-[#110825] p-2 rounded-xl border border-purple-900/30 text-left animate-slide-up">
                            <div className="flex flex-col border-l-2 border-fuchsia-500 pl-2">
                              <span className="text-[8px] font-extrabold text-fuchsia-400 uppercase tracking-widest font-mono">Quoting Message</span>
                              <span className="text-[10px] text-slate-300 truncate max-w-[220px]">{replyingMessage.text}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setReplyingMessage(null)}
                              className="p-1 rounded-full bg-purple-950 text-slate-400 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Interactive Photo Attachment Picker Row */}
                        <div className="flex items-center justify-between text-left">
                          <span className="text-[8.5px] text-slate-500 font-sans uppercase font-bold tracking-wider">Secure Attachments</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedMediaPreview(prev => prev === 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80' ? null : 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80')}
                              className={`px-2 py-0.5 rounded text-[8.5px] font-semibold border ${
                                selectedMediaPreview === 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80' 
                                  ? 'bg-purple-900/40 border-purple-500 text-purple-300' 
                                  : 'bg-transparent border-purple-950 text-slate-500'
                              }`}
                            >
                              🌇 Sunset
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedMediaPreview(prev => prev === 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80' ? null : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80')}
                              className={`px-2 py-0.5 rounded text-[8.5px] font-semibold border ${
                                selectedMediaPreview === 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80' 
                                  ? 'bg-purple-900/40 border-purple-500 text-purple-300' 
                                  : 'bg-transparent border-purple-950 text-slate-500'
                              }`}
                            >
                              🌌 Cyber Alley
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedMediaPreview(prev => prev === 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80' ? null : 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80')}
                              className={`px-2 py-0.5 rounded text-[8.5px] font-semibold border ${
                                selectedMediaPreview === 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80' 
                                  ? 'bg-purple-900/40 border-purple-500 text-purple-300' 
                                  : 'bg-transparent border-purple-950 text-slate-500'
                              }`}
                            >
                              🎛️ Audio Deck
                            </button>
                          </div>
                        </div>

                        {/* Setting Toggles bar */}
                        <div className="flex items-center gap-3 mt-1 justify-start">
                          <button
                            type="button"
                            onClick={() => {
                              setIsViewOnceSelected(!isViewOnceSelected);
                              if (is24hExpireSelected) setIs24hExpireSelected(false);
                            }}
                            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg border text-[8px] font-extrabold uppercase font-mono transition-transform active:scale-95 ${
                              isViewOnceSelected 
                                ? 'bg-pink-600/30 border-pink-500 text-pink-400' 
                                : 'bg-transparent border-purple-950 text-slate-500'
                            }`}
                          >
                            <Lock className="w-2.5 h-2.5" />
                            <span>👁️ View Once</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIs24hExpireSelected(!is24hExpireSelected);
                              if (isViewOnceSelected) setIsViewOnceSelected(false);
                            }}
                            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg border text-[8px] font-extrabold uppercase font-mono transition-transform active:scale-95 ${
                              is24hExpireSelected 
                                ? 'bg-amber-600/30 border-amber-500 text-amber-400' 
                                : 'bg-transparent border-purple-950 text-slate-500'
                            }`}
                          >
                            <Clock className="w-2.5 h-2.5 animate-pulse" />
                            <span>⏱️ 24h Expiry</span>
                          </button>

                          {selectedMediaPreview && (
                            <span className="text-[8px] font-bold text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded border border-fuchsia-500/30 animate-pulse">
                              🌇 Photo Selected
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Input controls bottom */}
                      <form id="chat-input-form-viewport" onSubmit={handleSendMessageSubmit} className="p-3 bg-[#0a0515]/95 border-t border-purple-950/50 shrink-0 flex items-center gap-2 relative">
                        {isRecordingAudio ? (
                          <div className="flex-1 flex items-center justify-between bg-[#19092c] border border-red-500/30 rounded-xl px-3 py-1.5 text-xs text-white outline-none font-sans animate-pulse">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                              <span className="text-red-400 font-bold font-mono uppercase text-[9.5px] tracking-wider">SECURE_VOICE RECORDING :</span>
                              <span className="font-mono text-[10px] text-slate-100 font-bold">{`0:${String(audioRecordingSecs).padStart(2, '0')}`}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {/* Cancel / Bin Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setIsRecordingAudio(false);
                                  setAudioRecordingSecs(0);
                                  onTriggerWsLog({
                                    id: `log_audio_cancel_${Date.now()}`,
                                    timestamp: new Date().toISOString(),
                                    direction: 'client_to_server',
                                    event: 'chat:audio_cancelled',
                                    payload: { chatId: activeChat.id }
                                  });
                                }}
                                className="text-slate-400 hover:text-red-400 p-1 rounded-lg cursor-pointer transition-colors"
                                title="Cancel Recording"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                              
                              {/* Stop & Send Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const durationVal = audioRecordingSecs || 6;
                                  onSendMessage(activeChat.id, `🎙️ Secure Voice Note (${durationVal}s)`, {
                                    mediaType: 'audio',
                                    audioDuration: durationVal
                                  });
                                  setIsRecordingAudio(false);
                                  setAudioRecordingSecs(0);
                                  onTriggerWsLog({
                                    id: `log_audio_sent_${Date.now()}`,
                                    timestamp: new Date().toISOString(),
                                    direction: 'client_to_server',
                                    event: 'chat:audio_broadcast',
                                    payload: { chatId: activeChat.id, duration: durationVal }
                                  });
                                }}
                                className="bg-red-500 hover:bg-red-400 text-white font-extrabold text-[8px] tracking-wider uppercase font-mono px-2.5 py-1 rounded-lg flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                              >
                                <Mic className="w-3 h-3 text-white" />
                                <span>BROADCAST</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <input
                              type="text"
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              placeholder={isViewOnceSelected ? "Add a caption to view-once media..." : "Send encrypted message packet..."}
                              className="flex-1 bg-[#120a24]/90 border border-purple-900/30 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none font-sans"
                            />
                            
                            {messageText.trim() ? (
                              <button
                                type="submit"
                                id="btn-chat-send-viewport"
                                className="p-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-md hover:scale-103 active:scale-95 transition-all outline-none cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setIsRecordingAudio(true);
                                  setAudioRecordingSecs(0);
                                  onTriggerWsLog({
                                    id: `log_audio_start_${Date.now()}`,
                                    timestamp: new Date().toISOString(),
                                    direction: 'client_to_server',
                                    event: 'chat:audio_record_init',
                                    payload: { chatId: activeChat.id, source: "Secure Device Mic (WebOS)" }
                                  });
                                }}
                                className="p-2.5 bg-rose-600/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/25 rounded-xl shadow-md hover:scale-103 active:scale-95 transition-all outline-none cursor-pointer"
                                title="Record Voice Message"
                              >
                                <Mic className="w-3.5 h-3.5 animate-pulse" />
                              </button>
                            )}
                          </>
                        )}
                      </form>
                    </div>
                  )
                )}
              </motion.div>
            )}

            {/* TAB 5: CIPHER PROFILE HUD */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile_screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col"
              >
                {/* Header */}
                <div className="p-4 bg-gradient-to-b from-[#0e0921] to-[#05020c] border-b border-purple-950/50 shrink-0 flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-white tracking-tight font-sans">GM Identity Node</h2>
                  <button 
                    onClick={() => {
                      setStatusMessage("Keys regenerated on hardware vault");
                      setTimeout(() => setStatusMessage(null), 2500);
                    }}
                    className="p-1 bg-[#120a24] text-slate-400 hover:text-white rounded-md border border-purple-950/40"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                {/* Profile detail */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
                  
                  {/* Hologram Card (Matches visual styling of dashboard) */}
                  <div className="p-4 bg-gradient-to-br from-[#1b103c] to-[#0c0716] border border-fuchsia-500/20 rounded-[28px] relative overflow-hidden shadow-2xl">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent blur-xl" />
                    
                    <div className="flex items-center gap-3.5">
                      <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500">
                        <div className="p-0.5 bg-[#05020c] rounded-full">
                          <img src={CURRENT_USER.avatar} alt="Alex Rivera" className="w-[52px] h-[52px] rounded-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 px-1 h-3 rounded-full bg-emerald-500 border-2 border-[#0c0716]" />
                      </div>

                      <div className="flex flex-col text-left">
                        <span className="text-[13px] font-black text-slate-100 flex items-center gap-1">
                          Alex Rivera
                          <ShieldCheck className="w-3.5 h-3.5 text-fuchsia-400" />
                        </span>
                        <span className="text-[10px] text-purple-300 font-mono">@alex_gem_sfc</span>
                        <span className="text-[8.5px] text-slate-400 font-mono mt-0.5">S-Node: West_Edge-04</span>
                      </div>
                    </div>

                    {/* Stats summary block */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-purple-500/10 text-center font-sans">
                      <div className="flex flex-col justify-center">
                        <span className="text-[8px] text-slate-400 uppercase tracking-wider font-mono">My Gems</span>
                        <span className="text-xs font-black text-fuchsia-400 font-mono">1,482</span>
                      </div>
                      <div className="flex flex-col justify-center border-x border-purple-500/10">
                        <span className="text-[8px] text-slate-400 uppercase tracking-wider font-mono">Sockets</span>
                        <span className="text-xs font-black text-purple-400 font-mono">24 channels</span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[8px] text-slate-400 uppercase tracking-wider font-mono">Stories</span>
                        <span className="text-xs font-black text-pink-400 font-mono">14 active</span>
                      </div>
                    </div>
                  </div>

                  {/* High Tech encryption panel */}
                  <div className="p-3.5 bg-[#120a24]/30 border border-purple-950/60 rounded-2xl space-y-2">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
                      Dynamic Encryption Rotator
                    </span>
                    <p className="text-[9px] text-slate-350 leading-relaxed font-sans">
                      The keys below rotates every 1500ms on the clients and maps spherical 2dsphere vectors dynamically:
                    </p>
                    <div className="bg-[#05020c] font-mono text-[10px] text-fuchsia-400 p-2 rounded-xl text-center border border-purple-500/10 select-all font-semibold">
                      {crypticKey}
                    </div>
                  </div>

                  {/* Location spec telemetry */}
                  <div className="p-3.5 bg-[#120a24]/30 border border-purple-950/60 rounded-2xl space-y-2 text-left text-[9.5px]">
                    <div className="flex justify-between border-b border-purple-950/20 pb-1.5 text-slate-400">
                      <span>PRIMARY VECTOR</span>
                      <span className="text-slate-200 font-mono">37.7749° N, 122.4194° W</span>
                    </div>
                    <div className="flex justify-between border-b border-purple-950/20 pb-1.5 text-slate-400">
                      <span>RADIAL GEOFENCE</span>
                      <span className="text-slate-200 font-bold text-pink-300">500 meters (SOMA)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>AUTHORIZED CHATS</span>
                      <span className="text-slate-200 font-mono">2 Socket Rooms</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Full Device Immersive Stories Overlay View */}
          <AnimatePresence>
            {activeStoryIdx !== null && (() => {
              const storyItem = stories[activeStoryIdx];
              return (
                <motion.div
                  id="immersive-story-viewport"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950 z-50 flex flex-col justify-between p-4"
                >
                  {/* Top Tick Timers bar selection */}
                  <div className="flex items-center gap-1.5 w-full shrink-0 z-10">
                    {stories.map((_, i) => (
                      <div key={i} className="flex-1 h-1 bg-slate-850 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: i < activeStoryIdx ? '100%' : '0%' }}
                          animate={{ width: i === activeStoryIdx ? '100%' : i < activeStoryIdx ? '100%' : '0%' }}
                          transition={{ 
                            duration: i === activeStoryIdx ? 4 : 0, 
                            ease: 'linear' 
                          }}
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Header metadata layout */}
                  <div className="flex items-center justify-between mt-3 z-10 shrink-0">
                    <div className="flex items-center gap-2">
                      <img src={storyItem.userAvatar} alt={storyItem.username} className="w-8.5 h-8.5 rounded-full border border-purple-400 object-cover" />
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-slate-100">{storyItem.username === 'luna_wave' ? 'Sarah L.' : storyItem.username === 'kai_zen' ? 'Liam K.' : 'Jordan P.'}</span>
                          {storyItem.isCloseFriendsOnly && (
                            <span className="text-[7.5px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 py-px rounded font-black tracking-wide uppercase font-sans flex items-center gap-0.5 shadow-sm">
                              <Star className="w-[8px] h-[8px] fill-emerald-100" /> Close Friends
                            </span>
                          )}
                        </div>
                        {storyItem.geo && (
                          <span className="text-[8px] text-pink-400 flex items-center gap-1">
                            <MapPin className="w-2 h-2" />
                            {storyItem.geo.locationName}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setActiveStoryIdx(null);
                        onTriggerWsLog({
                          id: `log_${Date.now()}`,
                          timestamp: new Date().toISOString(),
                          direction: 'client_to_server',
                          event: 'story:stream_view_exit',
                          payload: { storyId: storyItem.id }
                        });
                      }} 
                      className="p-1 rounded-full bg-slate-900/60 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content Box centered */}
                  <div className="flex-1 flex items-center justify-center my-4 relative">
                    {storyItem.mediaType === 'image' && storyItem.mediaUrl ? (
                      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                        <img src={storyItem.mediaUrl} alt="Story Content" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />
                      </div>
                    ) : (
                      <div className={`w-full aspect-[9/16] max-h-[420px] rounded-2xl bg-gradient-to-b ${storyItem.bgGradient} p-6 flex flex-col justify-center items-center text-center shadow-lg`}>
                        <Sparkles className="w-10 h-10 text-white/90 mb-4 animate-bounce" />
                        <p className="text-sm font-black text-white tracking-tight leading-relaxed">{storyItem.content}</p>
                      </div>
                    )}

                    {storyItem.caption && (
                      <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-slate-700/30 p-3 rounded-xl">
                        <p className="text-[11.5px] text-white font-medium">{storyItem.caption}</p>
                      </div>
                    )}
                  </div>

                  {/* Interactive Quick reaction buttons */}
                  <div className="flex items-center justify-around bg-slate-900/40 border border-slate-800 p-2 rounded-2xl z-10 shrink-0">
                    <button 
                      onClick={() => {
                        setStatusMessage('Reacted with 💙');
                        setTimeout(() => setStatusMessage(null), 2500);
                        onTriggerWsLog({
                          id: `log_${Date.now()}`,
                          timestamp: new Date().toISOString(),
                          direction: 'client_to_server',
                          event: 'story:reaction',
                          payload: { storyId: storyItem.id, reaction: 'heart' }
                        });
                      }}
                      className="flex flex-col items-center text-[10px] text-slate-400 hover:text-pink-400 cursor-pointer"
                    >
                      <Heart className="w-5 h-5 fill-pink-500/10" />
                      <span className="text-[8px] mt-0.5">Appreciate</span>
                    </button>
                    <button 
                      onClick={() => {
                        const matchingChat = chats.find(c => c.name.includes(storyItem.username) || c.id === 'chat_group_1');
                        if (matchingChat) {
                          handleChatSelect(matchingChat.id);
                          setActiveStoryIdx(null);
                        }
                      }}
                      className="flex flex-col items-center text-[10px] text-slate-400 hover:text-purple-400 cursor-pointer"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-[8px] mt-0.5">Send Message</span>
                    </button>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Fututistic Radial GEM Expansion Quick-Menu Panel */}
          <AnimatePresence>
            {isGemMenuOpen && (
              <motion.div
                key="gem-menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#070311]/95 backdrop-blur-md z-45 flex flex-col items-center justify-end pb-24"
              >
                <div className="flex flex-col items-center gap-4 text-center max-w-[260px] mb-8">
                  <div className="p-3 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 animate-pulse">
                    <Sparkles className="w-6.5 h-6.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest font-mono">GEM Actions Ring</h3>
                    <p className="text-[10px] text-slate-400 mt-1">Deploy ephemeral location snapshots or sync real-time points onto the region grid.</p>
                  </div>
                </div>

                {/* Grid of Action buttons */}
                <div className="grid grid-cols-2 gap-3 w-full px-6">
                  <button
                    id="btn-post-media-action"
                    onClick={() => {
                      setIsNewStoryModalOpen(true);
                      setIsGemMenuOpen(false);
                    }}
                    className="p-3.5 bg-[#120a24] border border-purple-500/20 rounded-2xl flex flex-col items-center gap-1.5 hover:bg-slate-800/80 hover:border-purple-500/60 active:scale-95 transition-all text-center cursor-pointer"
                  >
                    <div className="p-1 px-[7px] rounded-lg bg-pink-500/10 text-pink-400">
                      <Tv className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-200">Ephemeral Story</span>
                    <span className="text-[8px] text-slate-500">24-hour video/card</span>
                  </button>

                  <button
                    id="btn-post-marker-action"
                    onClick={() => {
                      setIsNewMarkerModalOpen(true);
                      setIsGemMenuOpen(false);
                    }}
                    className="p-3.5 bg-[#120a24] border border-purple-500/20 rounded-2xl flex flex-col items-center gap-1.5 hover:bg-slate-800/80 hover:border-purple-500/60 active:scale-95 transition-all text-center cursor-pointer"
                  >
                    <div className="p-1 px-[7px] rounded-lg bg-amber-500/10 text-amber-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-200">Draw Location Pin</span>
                    <span className="text-[8px] text-slate-500">Local event marker</span>
                  </button>

                  <button
                    id="btn-proof-impact-curator"
                    onClick={() => {
                      setIsProofEditorOpen(true);
                      setIsGemMenuOpen(false);
                    }}
                    className="col-span-2 p-3.5 bg-gradient-to-br from-[#1b103c] to-[#0c0716] border border-fuchsia-500/30 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800/80 hover:border-fuchsia-500/60 active:scale-95 transition-all cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-fuchsia-500/20 text-fuchsia-400">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-black text-slate-100 block uppercase tracking-wider">📐 CURATE PROOF OF IMPACT</span>
                      <span className="text-[8px] text-fuchsia-300">Publish high-fidelity images with custom editing sliders</span>
                    </div>
                  </button>
                </div>

                <div className="mt-8 flex flex-col items-center gap-3">
                  <span className="text-[9px] text-slate-500">Tapping ‘GEM’ closes action hub.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* NAVIGATION BAR - CENTRAL INTERACTIVE GEM ANCHOR (Matches screenshots) */}
          <div id="device-bottom-nav" className="h-[74px] bg-[#0c0716] border-t border-purple-950/50 px-4.5 flex items-center justify-between shrink-0 z-40 relative">
            
            {/* L1: Feed Column Icon */}
            <button
              id="btn-nav-feed"
              onClick={() => {
                setActiveTab('feed');
                setIsGemMenuOpen(false);
              }}
              className={`flex-1 flex flex-col items-center gap-1 focus:outline-none transition-colors ${
                activeTab === 'feed' ? 'text-fuchsia-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Tv className="w-5 h-5" />
              <span className="text-[9px]">Feed</span>
            </button>

            {/* L2: Explore / Map Column Icon */}
            <button
              id="btn-nav-explore"
              onClick={() => {
                setActiveTab('explore');
                setIsGemMenuOpen(false);
                setSelectedMarkerId('marker_cozy'); // display default cozy pop-up card
              }}
              className={`flex-1 flex flex-col items-center gap-1 focus:outline-none transition-colors ${
                activeTab === 'explore' ? 'text-fuchsia-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[9px]">Explore</span>
            </button>

            {/* C: CENTRAL GLOWING GEM INTERACTIVE ANCHOR (screenshot icon matches) */}
            <div className="relative -top-4 w-15 h-15 flex items-center justify-center">
              {/* Pulse circle */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 rounded-full blur opacity-65 animate-pulse" />
              <button
                id="btn-nav-gem-anchor"
                onClick={() => {
                  setIsGemMenuOpen(!isGemMenuOpen);
                  onTriggerWsLog({
                    id: `log_${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    direction: 'client_to_server',
                    event: 'nav:gem_activate',
                    payload: { currentScreen: activeTab, isMenuOpening: !isGemMenuOpen }
                  });
                }}
                className={`relative w-13 h-13 bg-gradient-to-tr from-[#160c2b] to-[#3a085d] border-2 border-purple-400/30 rounded-full flex items-center justify-center shadow-[0_0_18px_rgba(168,85,247,0.4)] focus:outline-none active:scale-95 transition-all duration-300 ${
                  isGemMenuOpen ? 'rotate-45 scale-105' : 'hover:-translate-y-0.5'
                }`}
              >
                <div className="p-1 bgColor-purple-950/20 rounded-full">
                  <Gem className="w-5.5 h-5.5 text-pink-300 font-extrabold animate-pulse" />
                </div>
              </button>
            </div>

            {/* R1: Secure socket Chats Column Icon */}
            <button
              id="btn-nav-chats"
              onClick={() => {
                setActiveTab('chats');
                setIsInsideChatRoom(false);
                setIsGemMenuOpen(false);
              }}
              className={`flex-1 flex flex-col items-center gap-1 focus:outline-none transition-colors relative ${
                activeTab === 'chats' ? 'text-fuchsia-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-[9px]">Chats</span>
              <div className="absolute top-0 right-5 w-3.5 h-3.5 bg-pink-600 rounded-full flex items-center justify-center text-[7px] text-white font-bold font-mono">6</div>
            </button>

            {/* R2: Member Profile Column Icon */}
            <button
              id="btn-nav-profile"
              onClick={() => {
                setActiveTab('profile');
                setIsGemMenuOpen(false);
              }}
              className={`flex-1 flex flex-col items-center gap-1 focus:outline-none transition-colors ${
                activeTab === 'profile' ? 'text-fuchsia-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[9px]">Profile</span>
            </button>
          </div>

        </div>

        {/* MODAL: POST NEW EPHEMERAL STORY */}
        <AnimatePresence>
          {isNewStoryModalOpen && (
            <motion.div
              key="new-story-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#05020c]/98 z-55 flex flex-col justify-between p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-fuchsia-400 font-mono text-left">Ephemeris Broadcaster</span>
                <button 
                  onClick={() => setIsNewStoryModalOpen(false)} 
                  className="p-1 rounded-full bg-purple-950 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="my-auto flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-slate-400 text-left">Dynamic Background Pattern</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {storyGradients.map((grad) => (
                      <button
                        key={grad}
                        id={`story-grad-${grad.substring(0, 10)}`}
                        type="button"
                        onClick={() => setNewStoryBg(grad)}
                        className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${grad} border-2 ${
                          newStoryBg === grad ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60'
                        } shrink-0 transition-transform`}
                      />
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-2xl bg-gradient-to-tr ${newStoryBg} shadow-inner min-h-[140px] flex items-center justify-center text-center`}>
                  <textarea
                    autoFocus
                    value={newStoryText}
                    onChange={(e) => setNewStoryText(e.target.value)}
                    maxLength={100}
                    placeholder="Type disappearing packet details... (Limit 100)"
                    className="w-full bg-transparent border-none text-white font-extrabold text-sm text-center placeholder-white/60 focus:ring-0 resize-none outline-none"
                    rows={3}
                  />
                </div>
                
                {/* Close Friends Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Star className={`w-4 h-4 ${isCloseFriendsSelected ? 'text-emerald-400 fill-emerald-400' : 'text-slate-500'}`} />
                    <div className="text-left">
                      <span className="text-[11px] font-bold text-slate-200 block">Close Friends Only</span>
                      <span className="text-[9px] text-slate-500 block">Restrict to Gem Circle ({closeFriendsList.length} members)</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCloseFriendsSelected(!isCloseFriendsSelected)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-all outline-none ${isCloseFriendsSelected ? 'bg-emerald-500' : 'bg-slate-800'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all ${isCloseFriendsSelected ? 'translate-x-4' : 'translate-x-[1px]'}`} />
                  </button>
                </div>
                
                <p className="text-[9px] text-slate-500 text-center">Your GPS coordinates will be compiled to geo-track the packet for regional users.</p>
              </div>

              <div className="flex items-center gap-2 font-sans font-bold">
                <button
                  type="button"
                  onClick={() => setIsNewStoryModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-purple-950 text-xs text-slate-400"
                >
                  Discard
                </button>
                <button
                  onClick={handleCreateStorySubmit}
                  className="flex-1 py-2.5 rounded-xl bg-[#ec4899] text-white text-xs shadow-md shadow-pink-950/50 hover:bg-pink-500"
                >
                  Grid Broadcast
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL: DROP NEW MAP MARKER */}
        <AnimatePresence>
          {isNewMarkerModalOpen && (
            <motion.div
              key="new-marker-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#05020c]/98 z-55 flex flex-col justify-between p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-fuchsia-400 font-mono text-left">S-Spatial Core Syncing</span>
                <button 
                  onClick={() => setIsNewMarkerModalOpen(false)} 
                  className="p-1 rounded-full bg-purple-950 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="my-auto flex flex-col gap-3.5 text-left">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Marker Designation</label>
                  <input
                    type="text"
                    value={newMarkerTitle}
                    onChange={(e) => setNewMarkerTitle(e.target.value)}
                    placeholder="e.g. SOMA rooftop concert, art pop..."
                    className="bg-[#120a24] border border-purple-950 focus:border-purple-600 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Ephemeral Description</label>
                  <textarea
                    value={newMarkerDesc}
                    onChange={(e) => setNewMarkerDesc(e.target.value)}
                    placeholder="Keep it descriptive..."
                    className="bg-[#120a24] border border-purple-950 focus:border-purple-600 rounded-xl px-3 py-2 text-xs text-white resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Packet Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['media', 'event', 'ping'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewMarkerType(t)}
                        className={`py-1.5 text-[10px] rounded-lg font-bold border transition-colors ${
                          newMarkerType === t 
                            ? 'bg-purple-900/40 border-purple-500 text-purple-300' 
                            : 'bg-[#120a24] border-purple-950 text-slate-400'
                        }`}
                      >
                        {t.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewMarkerModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-purple-950 text-xs text-slate-400 font-bold"
                >
                  Abstain
                </button>
                <button
                  onClick={handleCreateMarkerSubmit}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md shadow-purple-950/50 hover:bg-purple-500"
                >
                  Lock Coordinates
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL: VIEW ONCE SECURE MEDIA VIEWER */}
        <AnimatePresence>
          {viewingOnceMediaUrl && (
            <motion.div
              key="view-once-media-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 bg-black/98 z-55 flex flex-col justify-between p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-rose-500 font-mono tracking-widest uppercase flex items-center gap-1">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                  Self-Destruct Matrix
                </span>
                <button 
                  onClick={() => {
                    if (viewingOnceMessageId && activeChatId) {
                      onViewMessageOnce(activeChatId, viewingOnceMessageId);
                    }
                    setViewingOnceMediaUrl(null);
                    setViewingOnceMessageId(null);
                    setStatusMessage("Media burned and wiped from cache.");
                    setTimeout(() => setStatusMessage(null), 2500);
                  }} 
                  className="p-1.5 rounded-full bg-rose-950 text-rose-300 hover:text-white border border-rose-500/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Media Container box */}
              <div className="my-auto relative rounded-3xl overflow-hidden border border-rose-500/20 shadow-2xl h-[280px]">
                <img src={viewingOnceMediaUrl} alt="Self-destruct media" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/35" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="text-[10px] text-zinc-400 font-mono">This message will be permanently shredded after closing.</span>
                </div>
              </div>

              {/* Action and Countdown bar */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (viewingOnceMessageId && activeChatId) {
                      onViewMessageOnce(activeChatId, viewingOnceMessageId);
                    }
                    setViewingOnceMediaUrl(null);
                    setViewingOnceMessageId(null);
                    setStatusMessage("Media burned and wiped from cache.");
                    setTimeout(() => setStatusMessage(null), 2500);
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-extrabold uppercase font-mono tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  🔥 Incinerate & Close Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL: GROUP CHAT SETTINGS */}
        <AnimatePresence>
          {isGroupSettingsOpen && activeChat && (
            <motion.div
              key="group-settings-modal"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute inset-0 bg-[#05020c]/98 z-55 flex flex-col justify-between p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-fuchsia-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 animate-spin" />
                    Channel Settings Core
                  </span>
                  <span className="text-[8px] text-slate-500 font-mono">Modifying Socket: {activeChat.id}</span>
                </div>
                <button 
                  onClick={() => setIsGroupSettingsOpen(false)} 
                  className="p-1.5 rounded-full bg-purple-950/60 text-slate-400 hover:text-white border border-purple-500/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto my-4 space-y-4 text-left scrollbar-thin pr-1">
                {/* Visual Identity Profile Frame */}
                <div className="p-3.5 bg-gradient-to-tr from-[#160c2b] to-[#120a24]/90 border border-purple-500/20 rounded-2xl flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={groupSettingsAvatar || activeChat.avatar} 
                      alt="Current avatar" 
                      className="w-12 h-12 rounded-xl object-cover border border-purple-500/45 saturate-110" 
                    />
                    <div className="absolute -bottom-1 -right-1 bg-fuchsia-500 text-white p-0.5 rounded-md border border-slate-900">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] text-fuchsia-400 uppercase tracking-widest font-mono font-bold block">Stream Avatar Preset</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      {[
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                      ].map((presetAvatar, aIdx) => (
                        <button
                          key={aIdx}
                          type="button"
                          onClick={() => setGroupSettingsAvatar(presetAvatar)}
                          className={`w-7 h-7 rounded-lg overflow-hidden border ${
                            groupSettingsAvatar === presetAvatar ? 'border-fuchsia-500 scale-110 shadow-md shadow-fuchsia-500/30' : 'border-purple-950 opacity-60'
                          } transition-all`}
                        >
                          <img src={presetAvatar} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Input block - Group name changer */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Stream Signature</label>
                  <input
                    type="text"
                    value={groupSettingsName}
                    onChange={(e) => setGroupSettingsName(e.target.value)}
                    placeholder="Enter Group Stream Name..."
                    className="bg-[#120a24]/80 border border-purple-950/60 focus:border-fuchsia-500/50 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                {/* Mute and Ephemeral Settings toggles */}
                <div className="space-y-2 pt-2 border-t border-purple-950/40">
                  <div className="flex items-center justify-between p-2.5 bg-[#120a24]/40 border border-purple-950/30 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-200">Silence Incoming Streams</span>
                      <span className="text-[7.5px] text-slate-500 font-mono">Suppress alerts for this socket</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const isCurrentlyMuted = groupMutedChats.includes(activeChat.id);
                        if (isCurrentlyMuted) {
                          setGroupMutedChats(prev => prev.filter(id => id !== activeChat.id));
                        } else {
                          setGroupMutedChats(prev => [...prev, activeChat.id]);
                        }
                      }}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                        groupMutedChats.includes(activeChat.id) ? 'bg-[#c026d3]' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        groupMutedChats.includes(activeChat.id) ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#120a24]/40 border border-purple-950/30 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-200">Force Ephemeral Pack Mode</span>
                      <span className="text-[7.5px] text-slate-500 font-mono">Autodelete messages in 24 hours</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const isCurrentlyDisappearing = groupDisappearingChats.includes(activeChat.id);
                        if (isCurrentlyDisappearing) {
                          setGroupDisappearingChats(prev => prev.filter(id => id !== activeChat.id));
                        } else {
                          setGroupDisappearingChats(prev => [...prev, activeChat.id]);
                        }
                      }}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                        groupDisappearingChats.includes(activeChat.id) ? 'bg-[#c026d3]' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        groupDisappearingChats.includes(activeChat.id) ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Manage Stream Participants */}
                <div className="space-y-2 pt-2 border-t border-purple-950/40">
                  <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Authorized Socket Keyholders</span>
                  
                  {/* Preset list of potential participants */}
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {[
                      { id: 'usr_sarah', name: 'Sarah L.', username: '@luna_wave', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
                      { id: 'usr_liam', name: 'Liam K.', username: '@kai_zen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
                      { id: 'usr_jordan', name: 'Jordan P.', username: '@sol_pixel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' }
                    ].map((user) => {
                      const isChecked = true;
                      return (
                        <div key={user.id} className="flex items-center justify-between p-2 bg-[#120a24]/10 rounded-xl border border-purple-950/50">
                          <div className="flex items-center gap-2">
                            <img src={user.avatar} className="w-6 h-6 rounded-lg object-cover" />
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-200 leading-none">{user.name}</span>
                              <span className="text-[7.5px] text-slate-500 font-mono">{user.username}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <span className="text-[8px] text-emerald-400 font-mono mr-1">ACTIVE</span>
                            <div className="w-4 h-4 rounded border border-fuchsia-500/40 bg-fuchsia-500/25 flex items-center justify-center text-[10px] text-fuchsia-400">
                              ✓
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p className="text-[8.5px] text-slate-500 text-center !mt-4 font-mono">
                  AES-256 signatures are re-keying automatically upon settings sync.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-purple-950/40 shrink-0 font-sans font-bold">
                <button
                  type="button"
                  onClick={() => setIsGroupSettingsOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-purple-950 text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateGroupSettings) {
                      onUpdateGroupSettings(activeChat.id, {
                        name: groupSettingsName,
                        avatar: groupSettingsAvatar
                      });
                      
                      onTriggerWsLog({
                        id: `log_${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        direction: 'client_to_server',
                        event: 'room:update_group_settings',
                        payload: {
                          chatId: activeChat.id,
                          name: groupSettingsName,
                          avatar: groupSettingsAvatar,
                          muted: groupMutedChats.includes(activeChat.id),
                          disappearing: groupDisappearingChats.includes(activeChat.id)
                        }
                      });

                      setStatusMessage("Group settings updated and distributed!");
                      setTimeout(() => setStatusMessage(null), 2500);
                      setIsGroupSettingsOpen(false);
                    }
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white text-xs shadow-md shadow-pink-950/50 hover:opacity-90 transition-opacity"
                >
                  Apply Sync
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PHASE 3: PROOF-OF-IMPACT IMAGE CURATOR & SLIDER EDITOR */}
        <AnimatePresence>
          {isProofEditorOpen && (
            <motion.div
              key="proof-editor-overlay"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute inset-0 bg-[#060312] z-50 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-b from-[#0e0921] to-[#060312] border-b border-purple-950/50 shrink-0 flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-fuchsia-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-fuchsia-500" />
                    Proof-Of-Impact Curator
                  </span>
                  <span className="text-[8px] text-slate-500 font-mono">Micro-filter Calibration Engine</span>
                </div>
                <button
                  onClick={() => setIsProofEditorOpen(false)}
                  className="p-1 px-1.5 bg-purple-950 text-slate-400 hover:text-white rounded-md border border-purple-500/10 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left scrollbar-thin">
                {/* Visual Preset Selection Strip */}
                <div className="space-y-1.5">
                  <label className="text-[8.5px] text-slate-400 font-mono uppercase tracking-widest block font-bold">1. Select Impact Snapshot</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Micro roast', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&auto=format&fit=crop&q=80', tag: 'SOMA Roast' },
                      { name: 'Community harvest', url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=300&auto=format&fit=crop&q=80', tag: 'Urban Garden' },
                      { name: 'Calibration talk', url: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=300&auto=format&fit=crop&q=80', tag: 'Tasting Hub' }
                    ].map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => {
                          setProofSelectedImg(preset.url);
                          setStatusMessage(`Switched snapshot to: ${preset.tag}`);
                          setTimeout(() => setStatusMessage(null), 1500);
                        }}
                        className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                          proofSelectedImg === preset.url ? 'border-fuchsia-400 scale-105 shadow-md shadow-fuchsia-500/20' : 'border-purple-950 opacity-60'
                        }`}
                      >
                        <img src={preset.url} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[7px] text-slate-300 font-mono text-center truncate px-0.5 py-px">{preset.tag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Interactive Canvas Preview */}
                <div className="space-y-1.5">
                  <label className="text-[8.5px] text-slate-400 font-mono uppercase tracking-widest block font-bold">2. Interactive CSS Sliders</label>
                  <div className="relative rounded-2xl overflow-hidden border border-purple-950 aspect-video bg-[#05020c] flex items-center justify-center">
                    <img
                      src={proofSelectedImg}
                      alt="Calibration Image"
                      className="w-full h-full object-cover transition-all"
                      style={{
                        filter: `brightness(${proofEditorBrightness}%) contrast(${proofEditorContrast}%) saturate(${proofEditorSaturation}%)`
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-black/75 backdrop-blur border border-purple-500/10 px-2 py-0.5 rounded-full text-[7.5px] font-mono text-fuchsia-400">
                      LIVE RENDER ENGINE
                    </div>
                  </div>
                </div>

                {/* Built-in Sliders */}
                <div className="p-3 bg-[#120a24]/50 border border-purple-950/40 rounded-2xl space-y-3 font-mono text-[9px]">
                  {/* Brightness */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Brightness (Exposure)</span>
                      <span className="text-fuchsia-400 font-bold">{proofEditorBrightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={proofEditorBrightness}
                      onChange={(e) => setProofEditorBrightness(Number(e.target.value))}
                      className="w-full accent-fuchsia-500 h-1 bg-purple-950 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Contrast Correction</span>
                      <span className="text-fuchsia-400 font-bold">{proofEditorContrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={proofEditorContrast}
                      onChange={(e) => setProofEditorContrast(Number(e.target.value))}
                      className="w-full accent-fuchsia-500 h-1 bg-purple-950 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Saturation Bloom</span>
                      <span className="text-fuchsia-400 font-bold">{proofEditorSaturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={proofEditorSaturation}
                      onChange={(e) => setProofEditorSaturation(Number(e.target.value))}
                      className="w-full accent-fuchsia-500 h-1 bg-purple-950 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Milestone & Caption info */}
                <div className="space-y-3 font-sans">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[8.5px] text-slate-400 font-mono uppercase tracking-widest font-bold">3. Tag Project Milestone</label>
                    <select
                      value={proofSelectedMilestone}
                      onChange={(e) => setProofSelectedMilestone(e.target.value)}
                      className="bg-[#120a24]/90 border border-purple-950 text-xs text-slate-200 p-2 rounded-xl focus:border-fuchsia-500/50 outline-none cursor-pointer"
                    >
                      <option value="Completed Milestone 2: Coordinate Volunteers">Completed Milestone 2: Coordinate Volunteers</option>
                      <option value="Completed Milestone 3: Roast Tasting Session">Completed Milestone 3: Roast Tasting Session</option>
                      <option value="Completed Milestone 1: Equipment Procurement">Completed Milestone 1: Equipment Procurement</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[8.5px] text-slate-400 font-mono uppercase tracking-widest font-bold">4. Curator Notes</label>
                    <textarea
                      value={proofEditorCaption}
                      onChange={(e) => setProofEditorCaption(e.target.value)}
                      rows={2}
                      className="bg-[#120a24]/90 border border-purple-950 text-xs text-white p-2.5 rounded-xl resize-none focus:border-fuchsia-500/50 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions footer */}
              <div className="p-4 bg-[#05020c] border-t border-purple-950/50 flex gap-2 shrink-0 font-sans font-bold">
                <button
                  type="button"
                  onClick={() => setIsProofEditorOpen(false)}
                  className="flex-1 py-3 bg-[#120a24] text-slate-400 hover:text-white rounded-xl border border-purple-950 hover:bg-slate-900 transition-colors text-xs"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newId = `proof_${Date.now()}`;
                    const newPost = {
                      id: newId,
                      author: 'Alex Rivera',
                      username: '@alex_gem_sfc',
                      avatar: CURRENT_USER.avatar,
                      imgUrl: proofSelectedImg,
                      caption: proofEditorCaption,
                      milestone: proofSelectedMilestone,
                      brightness: proofEditorBrightness,
                      contrast: proofEditorContrast,
                      saturation: proofEditorSaturation,
                      likes: 12,
                      hasLiked: false,
                      timestamp: 'Just now'
                    };

                    setProofPosts(prev => [newPost, ...prev]);

                    setTotalGEMSGenerated(prev => prev + 125);
                    setCuratorLevel(prev => prev + 1);
                    setProjectMilestoneProgress(prev => {
                      if (proofSelectedMilestone.includes('Milestone 2')) return 85;
                      if (proofSelectedMilestone.includes('Milestone 3')) return 100;
                      return prev;
                    });

                    onTriggerWsLog({
                      id: `log_${Date.now()}`,
                      timestamp: new Date().toISOString(),
                      direction: 'client_to_server',
                      event: 'proof:publish_milestone',
                      payload: {
                        postId: newId,
                        spatialVectors: { lat: 37.7749, lng: -122.4194, zone: 'SOMA' },
                        imageFilters: { b: proofEditorBrightness, c: proofEditorContrast, s: proofEditorSaturation },
                        milestoneTag: proofSelectedMilestone,
                        gemsAwarded: 125,
                        curatorLevelAdvance: true
                      }
                    });

                    setStatusMessage("🚀 Proof-of-Impact Distributed! Curator level advanced & dashboard synced.");
                    setTimeout(() => setStatusMessage(null), 3000);

                    setIsProofEditorOpen(false);
                    setActiveTab('feed');
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:opacity-95 text-white rounded-xl shadow-lg shadow-purple-950/50 transition-transform active:scale-[0.98] text-xs"
                >
                  🚀 Publish & Sync Dash
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PHASE 2: IMMERSIVE VIDEO CALL & SCORECARD OVERLAY */}
        <AnimatePresence>
          {isVideoCallSuiteOpen && (
            <motion.div
              key="video-call-overlay"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="absolute inset-0 bg-[#070312] z-50 flex flex-col justify-between p-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between z-10 shrink-0 bg-[#0e0921]/40 p-2.5 rounded-2xl border border-purple-950/20">
                <div className="flex items-center gap-1.5 text-left font-sans">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-rose-400 font-mono uppercase tracking-widest leading-none">DEBRIEF_STREAM://LIVE</span>
                    <span className="text-[7.5px] text-slate-500 font-mono mt-0.5">Encrypted volunteers link - 4 Nodes Online</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsVideoCallSuiteOpen(false)}
                  className="p-1 px-2.5 bg-rose-950/80 text-rose-200 border border-rose-500/10 hover:bg-rose-900 rounded-xl font-mono text-[9px] font-extrabold cursor-pointer"
                >
                  END CALL
                </button>
              </div>

              {/* Split Video Canvas screen */}
              <div className="flex-1 my-3 overflow-hidden flex flex-col gap-2 relative">
                {videoCallMode === 'normal_split' ? (
                  <div className="grid grid-cols-2 gap-2 h-full">
                    {/* Frame 1: Alex (Self) */}
                    <div className="bg-[#120a24] rounded-2xl overflow-hidden border-2 border-fuchsia-500/30 relative shadow-inner">
                      <img src={CURRENT_USER.avatar} className="w-full h-full object-cover saturate-110" />
                      <div className="absolute bottom-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-300">
                        Alex Rivera (You)
                      </div>
                      <div className="absolute top-2 right-2 p-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[6.5px] font-mono border border-emerald-500/30 animate-pulse">
                        SND-TX
                      </div>
                    </div>

                    {/* Frame 2: Sarah L (Organizer) */}
                    <div className="bg-[#120a24] rounded-2xl overflow-hidden border border-purple-950/50 relative shadow-inner">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80" className="w-full h-full object-cover saturate-[1.12]" />
                      <div className="absolute bottom-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-300">
                        Sarah L.
                      </div>
                      <div className="absolute top-2 right-2 p-0.5 rounded bg-fuchsia-500/20 text-fuchsia-400 text-[6.5px] font-mono border border-fuchsia-500/30 animate-pulse">
                        REC-RX
                      </div>
                    </div>

                    {/* Frame 3: Liam K (Live track coordinate) */}
                    <div className="bg-[#120a24] rounded-2xl overflow-hidden border border-purple-950/50 relative shadow-inner">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" className="w-full h-full object-cover saturate-110" />
                      <div className="absolute bottom-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-300">
                        Liam K.
                      </div>
                    </div>

                    {/* Frame 4: Jordan P */}
                    <div className="bg-[#120a24] rounded-2xl overflow-hidden border border-purple-950/50 relative shadow-inner">
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" className="w-full h-full object-cover saturate-110" />
                      <div className="absolute bottom-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-300">
                        Jordan P.
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Debrief Split View with the Edited Proof-of-Impact Image! */
                  <div className="flex flex-col h-full gap-2 text-left">
                    {/* Tiny video row */}
                    <div className="grid grid-cols-4 gap-1.5 shrink-0 h-[65px]">
                      {[
                        { name: 'Alex', avatar: CURRENT_USER.avatar },
                        { name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
                        { name: 'Liam', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
                        { name: 'Jordan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' }
                      ].map((v, vIdx) => (
                        <div key={vIdx} className="bg-[#120a24] border border-purple-500/20 rounded-xl overflow-hidden relative">
                          <img src={v.avatar} className="w-full h-full object-cover saturate-110" />
                          <span className="absolute bottom-1 left-1 text-[6.5px] bg-black/60 text-slate-300 px-1 rounded truncate max-w-full font-mono">{v.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Proof-of-Impact Highlight Review and Close-the-Loop */}
                    <div className="flex-1 bg-[#120a24]/60 border border-purple-950/80 rounded-2xl p-3 flex flex-col justify-between overflow-y-auto scrollbar-none gap-2">
                      <div className="space-y-1.5 font-sans">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded-md font-mono font-bold">MILESTONE VERIFIED PROOF</span>
                          <span className="text-[8.5px] text-fuchsia-400 font-mono font-black">{projectMilestoneProgress}% METRIC</span>
                        </div>
                        
                        <div className="aspect-video rounded-xl overflow-hidden border border-purple-950 relative">
                          <img 
                            src={proofSelectedImg} 
                            alt="Curated result" 
                            className="w-full h-full object-cover" 
                            style={{ filter: `brightness(${proofEditorBrightness}%) contrast(${proofEditorContrast}%) saturate(${proofEditorSaturation}%)` }}
                          />
                          <div className="absolute bottom-2 left-2 right-2 bg-black/70 p-1.5 rounded-lg border border-purple-500/10">
                            <p className="text-[9px] text-white font-medium leading-none">"{proofEditorCaption}"</p>
                            <span className="text-[7.5px] text-fuchsia-300 font-mono mt-0.5 block">{proofSelectedMilestone}</span>
                          </div>
                        </div>

                        <div className="p-2 bg-[#05020c] rounded-xl border border-purple-950/40 text-[8.5px] text-slate-300 leading-relaxed">
                          <p className="font-semibold text-slate-200">Sarah L: "Excellent calibration result! Live feedback aligns. Let's archive this on-chain."</p>
                        </div>
                      </div>

                      {/* ARCHIVING REENGAGEMENT BUTTON */}
                      <button
                        onClick={() => {
                          setIsLegacySaved(true);
                          setTotalGEMSGenerated(prev => prev + 250);
                          setStatusMessage("⭐ Saved as Legacy Gem Template! Archived for SOMA Roasters.");
                          
                          onTriggerWsLog({
                            id: `log_${Date.now()}`,
                            timestamp: new Date().toISOString(),
                            direction: 'client_to_server',
                            event: 'reengage:save_legacy_gem',
                            payload: {
                              project: 'Local Roasters Meetup',
                              originalVols: ['@luna_wave', '@kai_zen', '@alex_gem'],
                              archivedMetadata: {
                                milestoneMet: 'Completed Milestones 1, 2 & 3',
                                creatorLevelReached: curatorLevel,
                                finalImpactRating: 'Excellent 1.4k Gems'
                              }
                            }
                          });

                          setTimeout(() => setStatusMessage(null), 2500);
                        }}
                        className={`w-full py-2 bg-gradient-to-r ${isLegacySaved ? 'from-purple-950 to-indigo-950 border border-purple-800' : 'from-fuchsia-500 to-indigo-500'} text-white rounded-xl text-[9px] font-mono tracking-wider font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
                      >
                        <Gem className="w-3.5 h-3.5 animate-bounce text-pink-300 fill-fuchsia-500/20" />
                        <span>{isLegacySaved ? '⭐ ALREADY SAVED TO LEGACY RETENTION ARCHIVE' : '⭐ SAVE ENTIRE PROJECT AS LEGACY GEM TEMPLATE'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* PROJECT SCORECARD HUD OVERLAY */}
                <div id="video-scorecard-dock" className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-md border border-purple-500/30 p-2.5 rounded-2xl text-left shadow-2xl flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Gem className="w-3 h-3 text-pink-400 animate-spin" />
                      <span className="text-[10px] font-black text-slate-200 uppercase font-sans tracking-wide">Micro Core Scorecard</span>
                    </div>
                    <span className="text-[8px] bg-purple-950 border border-purple-500/20 text-purple-300 px-1.5 rounded font-mono">ACTIVE TELEMETRY</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-purple-950/40 pt-1.5 font-mono text-[8px] text-slate-400">
                    <div className="text-left font-sans">
                      <span>Curator lvl</span>
                      <p className="text-[10px] font-black text-fuchsia-400 font-mono">Level {curatorLevel}</p>
                    </div>
                    <div className="text-left border-x border-purple-950/20 px-2 font-sans">
                      <span>Milestone</span>
                      <p className="text-[10px] font-black text-indigo-400 font-mono">{projectMilestoneProgress}%</p>
                    </div>
                    <div className="text-left font-sans">
                      <span>Staked Gems</span>
                      <p className="text-[10px] font-black text-emerald-400 font-mono">{totalGEMSGenerated}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-purple-950/40 pt-1.5">
                    <span className="text-[7.5px] text-slate-400 font-mono">Simulate user engagement pulse:</span>
                    <button
                      onClick={() => {
                        setTotalGEMSGenerated(prev => prev + 15);
                        setStatusMessage("Pulsed +15 GEMS interest telemetry event stream!");
                        
                        onTriggerWsLog({
                          id: `log_${Date.now()}`,
                          timestamp: new Date().toISOString(),
                          direction: 'client_to_server',
                          event: 'scorecard:spark_interest',
                          payload: { liveGemsStakeCount: totalGEMSGenerated + 15 }
                        });

                        setTimeout(() => setStatusMessage(null), 2500);
                      }}
                      className="p-1 px-2.5 bg-[#120a24] border border-purple-500/25 hover:bg-purple-900 text-fuchsia-400 hover:text-white rounded-lg font-mono text-[7px] font-black active:scale-95 transition-all text-center cursor-pointer"
                    >
                      + IGNITE ENGAGEMENT
                    </button>
                  </div>
                </div>
              </div>

              {/* FOOTER ACTIONS MODES CONTROLLER */}
              <div className="grid grid-cols-2 gap-2 p-2 bg-[#05020c] border-t border-purple-950/40 font-mono text-[9px] text-slate-300 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setVideoCallMode('normal_split');
                    setStatusMessage("Switched View to Face Frame Sockets");
                    setTimeout(() => setStatusMessage(null), 1500);
                  }}
                  className={`py-2 rounded-xl border transition-all cursor-pointer ${
                    videoCallMode === 'normal_split' ? 'bg-purple-950 border-fuchsia-500 text-white font-black shadow' : 'bg-slate-900/20 border-purple-950 text-slate-500 hover:text-white'
                  }`}
                >
                  Face Sockets Grid
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVideoCallMode('comms_debrief');
                    setStatusMessage("Switched to Closing the Loop Debrief Module");
                    setTimeout(() => setStatusMessage(null), 1500);
                  }}
                  className={`py-2 rounded-xl border transition-all cursor-pointer ${
                    videoCallMode === 'comms_debrief' ? 'bg-purple-950 border-fuchsia-500 text-white font-black shadow' : 'bg-slate-900/20 border-purple-950 text-slate-500 hover:text-white'
                  }`}
                >
                  Closing-the-Loop Debrief
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* DEV CONSOLE DRAWER - Real-time Socket log frames */}
      <div id="device-socket-terminal" className="mt-4 w-full max-w-[390px] bg-[#0c0716]/90 backdrop-blur border border-purple-950/60 rounded-2xl p-3 flex flex-col gap-1.5 shadow-md">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-purple-950/20 pb-1.5">
          <div className="flex items-center gap-1.5 text-left">
            <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-ping" />
            <span className="font-mono text-fuchsia-400">GM-WS://SOCKET-TAP_0</span>
          </div>
          <span className="text-[9px] bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/20 font-mono">LIVESTREAM</span>
        </div>
        
        <div className="h-[95px] overflow-y-auto space-y-1 scrollbar-none font-mono text-[9px] leading-relaxed flex flex-col-reverse text-left">
          {wsLogs.slice().reverse().map((log) => {
            const isClient = log.direction === 'client_to_server';
            return (
              <div key={log.id} className="border-b border-purple-950/20 pb-1 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className={`font-bold uppercase ${isClient ? 'text-cyan-400' : 'text-fuchsia-400'}`}>
                    {isClient ? '➜ CL_SEND' : '⬅ SV_RECV'}
                  </span>
                  <span className="text-slate-500 text-[8px]">{log.event}</span>
                </div>
                <pre className="text-slate-300 bg-[#05020c] p-1.5 rounded text-[8px] overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(log.payload)}
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
