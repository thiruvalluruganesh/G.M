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
  Gem
} from 'lucide-react';
import { UserProfile, ChatThread, EphemeralStory, GeoMarker, WsLogEntry } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface ViewportSimProps {
  chats: ChatThread[];
  stories: EphemeralStory[];
  markers: GeoMarker[];
  wsLogs: WsLogEntry[];
  activeChatId: string | null;
  onSendMessage: (chatId: string, text: string) => void;
  onUpdateActiveChat: (chatId: string | null) => void;
  onPostStory: (content: string, bg: string, location?: string) => void;
  onAddMarker: (title: string, desc: string, type: 'media' | 'event' | 'ping') => void;
  onTriggerWsLog: (entry: WsLogEntry) => void;
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
  onTriggerWsLog
}: ViewportSimProps) {
  
  // 5 Active Tabs: 'feed' | 'explore' | 'chats' | 'profile'
  const [activeTab, setActiveTab] = useState<'feed' | 'explore' | 'chats' | 'profile'>('feed');
  
  // Chat viewport states
  const [isInsideChatRoom, setIsInsideChatRoom] = useState(false);

  // Search filter for map/events
  const [searchQuery, setSearchQuery] = useState('');

  // Story Carousel Modal
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  
  // Map interactive states
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>('marker_cozy'); // Default to cozy pop-up card view
  const [isGemMenuOpen, setIsGemMenuOpen] = useState(false);
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
    if (!messageText.trim() || !activeChatId) return;
    
    onSendMessage(activeChatId, messageText);
    setMessageText('');
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
    onPostStory(newStoryText, newStoryBg, 'SOMA tech corridor');
    setNewStoryText('');
    setIsNewStoryModalOpen(false);
    setIsGemMenuOpen(false);
    setStatusMessage('Disappearing story shot uploaded to Gem Grid!');
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
                  <div className="flex items-center justify-between mb-4">
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
                      {stories.map((story, idx) => (
                        <button 
                          key={story.id} 
                          id={`story-ring-interactive-${story.id}`}
                          onClick={() => setActiveStoryIdx(idx)}
                          className="flex flex-col items-center gap-1 shrink-0 focus:outline-none relative"
                        >
                          {/* Circle gradient wrap */}
                          <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.35)] animate-gradient-xy transition-transform hover:scale-105 active:scale-95 duration-200">
                            <div className="p-0.5 bg-[#05020c] rounded-full">
                              <img src={story.userAvatar} alt={story.username} className="w-[44px] h-[44px] rounded-full object-cover" />
                            </div>
                            {/* Visual timestamp marker tag */}
                            <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-[7px] font-bold px-1 py-0.2 rounded border border-slate-900 scale-90">
                              {idx === 0 ? '2h' : idx === 1 ? '3h' : '4h'}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-300 max-w-[56px] truncate font-medium font-sans mt-0.5">
                            {story.username === 'luna_wave' ? 'Sarah L.' : story.username === 'kai_zen' ? 'Liam K.' : 'Jordan P.'}
                          </span>
                        </button>
                      ))}

                      {/* Explicit extra dummy story from screenshot (Mia C.) */}
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
                    </div>
                  </div>
                </div>

                {/* Dashboard Scroll Segment */}
                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                  
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
                        onTriggerWsLog({
                          id: `log_${Date.now()}`,
                          timestamp: new Date().toISOString(),
                          direction: 'client_to_server',
                          event: 'map:select_sarah',
                          payload: { peer: "Sarah L." }
                        });
                      }}
                      className="group relative focus:outline-none"
                    >
                      <div className="absolute -inset-2 rounded-full bg-purple-500/20 blur-sm group-hover:scale-125 transition-transform animate-pulse" />
                      <div className="relative p-0.5 rounded-full bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.5)]">
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
                      }}
                      className="group relative focus:outline-none"
                    >
                      <div className="absolute -inset-2 rounded-full bg-fuchsia-500/20 blur-sm group-hover:scale-125 transition-transform animate-pulse" />
                      <div className="relative p-0.5 rounded-full bg-[#ec4899] shadow-[0_0_8px_rgba(236,72,153,0.5)]">
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
                      }}
                      className="group relative focus:outline-none"
                    >
                      <div className="absolute -inset-2 rounded-full bg-pink-500/20 blur-sm group-hover:scale-125 transition-transform" />
                      <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#ec4899] to-[#bfdbfe] shadow-[0_0_8px_rgba(244,63,94,0.5)]">
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
                            className="absolute bottom-4 left-4 right-4 bg-[#0a0515]/90 border border-purple-500/20 p-3.5 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl z-30 flex flex-col gap-3"
                          >
                            <div className="flex items-start gap-3 text-left">
                              {/* Cafe thumbnail photo left */}
                              <div className="w-[85px] h-[90px] rounded-2xl overflow-hidden bg-[#05020c] shrink-0 border border-purple-500/10">
                                <img 
                                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80" 
                                  alt="The Cozy Cup Pop-Up" 
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Details right */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-xs font-black text-white truncate max-w-[150px]">The Cozy Cup Pop-Up</h4>
                                  <button onClick={() => setSelectedMarkerId(null)} className="text-slate-400 hover:text-white p-0.5">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <span className="text-[9px] text-fuchsia-400 font-mono">by @local_roaster</span>
                                <p className="text-[9.5px] text-slate-300 leading-snug mt-1 max-h-[38px] overflow-hidden">
                                  Event description for a curated booth comement with in a curated booth.
                                </p>
                                
                                <div className="flex items-center gap-1.5 text-[8.5px] text-slate-400 font-mono mt-1.5">
                                  <Clock className="w-3 h-3 text-purple-400 shrink-0" />
                                  <span>Sat, 10am - 4pm</span>
                                </div>
                              </div>
                            </div>

                            {/* Badge and Active interaction buttons */}
                            <div className="flex items-center justify-between border-t border-purple-950/40 pt-2 text-[9px]">
                              {/* 15 gems interested badge */}
                              <div className="flex items-center gap-1 text-pink-300 bg-pink-500/10 p-1 px-2.5 rounded-full border border-pink-500/25">
                                <Gem className="w-3 h-3 text-pink-400" />
                                <span className="font-semibold font-mono">15 gems interested</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    setStatusMessage("Marked interest! Synchronized coordinates.");
                                    setTimeout(() => setStatusMessage(null), 2500);
                                  }}
                                  className="p-1 px-2 rounded-xl bg-purple-950/70 border border-purple-500/15 hover:bg-purple-900/60 transition-colors text-slate-300 hover:text-white font-mono"
                                >
                                  + INTEREST
                                </button>
                                <button 
                                  onClick={() => {
                                    handleChatSelect('chat_group_1');
                                    setSelectedMarkerId(null);
                                  }}
                                  className="p-1 px-2.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold rounded-xl shadow-md cursor-pointer hover:opacity-90 active:scale-95 duration-150"
                                >
                                  Enter Chat
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

                    {/* Chat channels listing */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Active Socket Links</span>
                        <Filter className="w-3 h-3 text-slate-500" />
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
                              <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-xl object-cover border border-purple-500/20" />
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-fuchsia-500 border-2 border-[#05020c] rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center justify-between leading-none mb-1">
                                <h4 className="text-[11.5px] font-bold text-slate-200 group-hover:text-purple-400 transition-colors truncate">{chat.name}</h4>
                                <span className="text-[8.5px] text-slate-500 font-mono">
                                  {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                </span>
                              </div>
                              <p className="text-[9.5px] text-slate-400 truncate">
                                {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : 'No messages'}
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
                          <div className="relative">
                            <img src={activeChat.avatar} alt={activeChat.name} className="w-8.5 h-8.5 rounded-xl object-cover border border-purple-950" />
                            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-fuchsia-500 border-2 border-purple-950 rounded-full" />
                          </div>
                          <div className="flex flex-col min-w-0 text-left">
                            <h3 className="text-[11.5px] font-extrabold text-slate-200 truncate max-w-[130px]">{activeChat.name}</h3>
                            <span className="text-[8px] text-fuchsia-400 flex items-center gap-1 font-mono">
                              AES_GCM_P_12 LINKED
                            </span>
                          </div>
                        </div>
                        
                        {/* Short cut to Map view */}
                        <button 
                          onClick={() => {
                            setActiveTab('explore');
                            setSelectedMarkerId('marker_cozy');
                            onTriggerWsLog({
                              id: `log_${Date.now()}`,
                              timestamp: new Date().toISOString(),
                              direction: 'client_to_server',
                              event: 'room:teleport_map',
                              payload: { chatId: activeChat.id }
                            });
                          }}
                          className="flex items-center gap-1.5 text-[9px] bg-purple-500/15 border border-purple-500/30 text-purple-300 p-1 px-2 rounded-full hover:bg-purple-500/25 transition-colors font-mono"
                        >
                          <Map className="w-3 h-3" />
                          <span>LOC MAP</span>
                        </button>
                      </div>

                      {/* Main Message List Drawer */}
                      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#070311]/50">
                        <div className="flex items-center justify-center my-1">
                          <span className="bg-purple-950/40 text-[8.5px] text-purple-300 px-3 py-0.5 rounded-full border border-purple-500/15 font-mono">
                            SOCKET LINK SECURE • SHA-256 SYMMETRIC
                          </span>
                        </div>

                        {activeChat.messages.map((msg) => {
                          const isMe = msg.senderId === CURRENT_USER.id;
                          return (
                            <div
                              key={msg.id}
                              className={`flex gap-2 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                            >
                              {!isMe && (
                                <img src={msg.senderAvatar} alt={msg.senderName} className="w-7 h-7 rounded-full object-cover border border-[#22123f] self-end" />
                              )}
                              <div className="flex flex-col text-left">
                                {!isMe && (
                                  <span className="text-[8.5px] text-slate-500 ml-1 mb-0.5">{msg.senderName}</span>
                                )}
                                <div className={`p-2.5 rounded-2xl text-[10.5px] leading-relaxed shadow-sm ${
                                  isMe 
                                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-none' 
                                    : 'bg-[#120a24]/80 text-slate-200 border border-purple-950/30 rounded-bl-none'
                                }`}>
                                  {msg.text}
                                </div>
                                <span className={`text-[7.5px] text-slate-500 font-mono mt-0.5 ${isMe ? 'text-right' : ''}`}>
                                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  {isMe && <span className="ml-1 text-fuchsia-400">✓✓</span>}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input controls bottom */}
                      <form id="chat-input-form-viewport" onSubmit={handleSendMessageSubmit} className="p-3.5 bg-[#0a0515]/95 border-t border-purple-950/50 shrink-0 flex items-center gap-2">
                        <input
                          type="text"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Send encrypted message packet..."
                          className="flex-1 bg-[#120a24]/90 border border-purple-900/30 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-slate-550 outline-none font-sans"
                        />
                        <button
                          type="submit"
                          id="btn-chat-send-viewport"
                          className="p-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-md hover:scale-103 active:scale-95 transition-all outline-none"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
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
                        <span className="text-[11px] font-bold text-slate-100">{storyItem.username === 'luna_wave' ? 'Sarah L.' : storyItem.username === 'kai_zen' ? 'Liam K.' : 'Jordan P.'}</span>
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
