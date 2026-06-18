import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  MapPin, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  Play, 
  Pause, 
  Mic, 
  UserPlus, 
  Compass, 
  Shield, 
  Flame, 
  PhoneCall, 
  Video, 
  MoreVertical, 
  Layers, 
  Send, 
  Check, 
  Lock, 
  Eye, 
  Database, 
  Zap, 
  Plus, 
  CheckCircle2, 
  Star,
  Users
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  LineChart,
  Line
} from 'recharts';
import { ChatThread, EphemeralStory, GeoMarker, Message } from '../types';

interface UnifiedDashboardProps {
  chats: ChatThread[];
  stories: EphemeralStory[];
  markers: GeoMarker[];
  projectMilestoneProgress: number;
  onUpdateProjectProgress: (progress: number) => void;
  onSendMessage: (chatId: string, text: string, mediaProps?: { mediaUrl?: string; mediaType?: 'image' | 'audio'; isViewOnce?: boolean; audioDuration?: number }) => void;
  onPostStory: (content: string, bg: string, location?: string, isCloseFriendsOnly?: boolean) => void;
  onAddMarker: (title: string, desc: string, type: 'media' | 'event' | 'ping') => void;
  onTriggerWsLog: (log: any) => void;
  activeChatId: string | null;
  onUpdateActiveChat: (chatId: string | null) => void;
}

export function UnifiedDashboard({
  chats,
  stories,
  markers,
  projectMilestoneProgress,
  onUpdateProjectProgress,
  onSendMessage,
  onPostStory,
  onAddMarker,
  onTriggerWsLog,
  activeChatId,
  onUpdateActiveChat
}: UnifiedDashboardProps) {

  // Map settings
  const [ghostMode, setGhostMode] = useState(false);
  const [preciseLoc, setPreciseLoc] = useState(true);
  const [liveLocation, setLiveLocation] = useState(true);
  const [hideMe, setHideMe] = useState(false);

  // Chat interface state
  const [typedMsgText, setTypedMsgText] = useState('');
  const [dashboardPlayingAudio, setDashboardPlayingAudio] = useState(false);
  const [dashboardAudioProgress, setDashboardAudioProgress] = useState(35);
  const [favoriteMarket, setFavoriteMarket] = useState(false);

  // Pop-up markers inside Dashboard MAP
  const [isSunsetYogaJoined, setIsSunsetYogaJoined] = useState(false);

  // Local state for load testing simulation
  const [simulateSpike, setSimulateSpike] = useState(false);

  // Generate Recharts Line Sparklines for the Analytics Widgets
  const sparklineReachData = [
    { name: 'M', val: 112 },
    { name: 'T', val: 114 },
    { name: 'W', val: 110 },
    { name: 'T', val: 118 },
    { name: 'F', val: 122 },
    { name: 'S', val: 121 },
    { name: 'S', val: 124 },
  ];

  const sparklineEngagementData = [
    { name: 'M', val: 19.5 },
    { name: 'T', val: 20.8 },
    { name: 'W', val: 19.8 },
    { name: 'T', val: 22.1 },
    { name: 'F', val: 21.9 },
    { name: 'S', val: 23.2 },
    { name: 'S', val: 23.8 },
  ];

  const sparklineMessagesData = [
    { name: 'M', val: 1.4 },
    { name: 'T', val: 1.6 },
    { name: 'W', val: 1.8 },
    { name: 'T', val: 1.7 },
    { name: 'F', val: 2.0 },
    { name: 'S', val: 2.1 },
    { name: 'S', val: 2.1 },
  ];

  const sparklineFollowersData = [
    { name: 'M', val: 0.95 },
    { name: 'T', val: 1.05 },
    { name: 'W', val: 1.10 },
    { name: 'T', val: 1.08 },
    { name: 'F', val: 1.15 },
    { name: 'S', val: 1.18 },
    { name: 'S', val: 1.20 },
  ];

  // Message Traffic Area Chart data (May 17 to May 23)
  const trafficChartData = useMemo(() => {
    const base = [
      { name: 'May 17', traffic: 1540 },
      { name: 'May 18', traffic: 1680 },
      { name: 'May 19', traffic: 1490 },
      { name: 'May 20', traffic: 1850 },
      { name: 'May 21', traffic: 2110 },
      { name: 'May 22', traffic: 1980 },
      { name: 'May 23', traffic: 2145 },
    ];

    if (simulateSpike) {
      return base.map(item => ({
        ...item,
        traffic: item.traffic + Math.round(Math.random() * 600 + 400)
      }));
    }
    return base;
  }, [simulateSpike]);

  // Audio Playback effect simulated on Dashboard
  const toggleAudio = () => {
    setDashboardPlayingAudio(!dashboardPlayingAudio);
    if (!dashboardPlayingAudio) {
      onTriggerWsLog({
        id: `log_dash_audio_${Date.now()}`,
        timestamp: new Date().toISOString(),
        direction: 'client_to_server',
        event: 'dashboard:voice_playback_init',
        payload: { length: '18s', codec: 'opus_high_res' }
      });
      // Simulate progress moving
      const interval = setInterval(() => {
        setDashboardAudioProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setDashboardPlayingAudio(false);
            return 100;
          }
          return prev + 6;
        });
      }, 300);
    }
  };

  const handleSupportClick = () => {
    const nextVal = Math.min(100, projectMilestoneProgress + 5);
    onUpdateProjectProgress(nextVal);
    onTriggerWsLog({
      id: `log_support_${Date.now()}`,
      timestamp: new Date().toISOString(),
      direction: 'client_to_server',
      event: 'project:support_pledge',
      payload: { projectId: 'green_earth', previousPct: projectMilestoneProgress, updatedPct: nextVal }
    });
  };

  const handleJoinSunsetYoga = () => {
    setIsSunsetYogaJoined(!isSunsetYogaJoined);
    onTriggerWsLog({
      id: `log_yoga_${Date.now()}`,
      timestamp: new Date().toISOString(),
      direction: 'client_to_server',
      event: isSunsetYogaJoined ? 'event:rsvp_cancel' : 'event:rsvp_secure',
      payload: { eventTitle: 'Sunset Yoga', baseFee: 'Free', secureTokenId: `SEC_YOGA_${Date.now()}` }
    });

    if (!isSunsetYogaJoined) {
      // Draw event coordinate marker
      onAddMarker('Sunset Yoga Session', 'Live Yoga on the grass of Ocean Drive', 'event');
    }
  };

  const handleSendChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMsgText.trim()) return;

    // Send through standard app channel
    const activeChatUUID = activeChatId || 'chat_group_1';
    onSendMessage(activeChatUUID, typedMsgText);
    setTypedMsgText('');

    onTriggerWsLog({
      id: `log_dash_send_${Date.now()}`,
      timestamp: new Date().toISOString(),
      direction: 'client_to_server',
      event: 'chat:message_broadcast',
      payload: { source: 'Unified Dashboard Console', chatId: activeChatUUID }
    });
  };

  return (
    <div id="unified-realtime-dashboard" className="w-full space-y-10 text-left">
      
      {/* 1. MODULAR CARDS SYSTEM SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-purple-950/40 pb-3">
          <div>
            <h2 className="text-lg font-black tracking-wider text-fuchsia-400 font-mono uppercase">Modular Cards System</h2>
            <p className="text-xs text-slate-400 mt-0.5">High-impact dynamic templates tailored for geo-spatial feeds and community actions.</p>
          </div>
          <span className="text-[10px] bg-purple-950 px-2 py-0.5 rounded-full border border-purple-500/20 text-purple-300 font-mono">SPEC V1.0 • 6 VARIANTS</span>
        </div>

        {/* 6-Card beautiful grid layout */}
        <div id="cards-grid-system" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          
          {/* Card 1: Story Card */}
          <div className="relative group overflow-hidden rounded-2xl aspect-[3/4] bg-slate-900 border border-purple-500/20 shadow-lg flex flex-col justify-end p-3 text-left">
            {/* Story Image */}
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80" 
              alt="Ava Portrait" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-blacks/40 to-black/20" />
            
            {/* Top Close Button mock */}
            <button className="absolute top-2.5 right-2.5 p-1 bg-black/40 hover:bg-black/60 rounded-full text-white/70 hover:text-white backdrop-blur-md border border-white/10 z-10">
              <X className="w-3 h-3" />
            </button>

            {/* Close Friends Tag */}
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-emerald-500/80 backdrop-blur-md rounded-full text-[8.5px] font-extrabold text-white uppercase tracking-wider flex items-center gap-0.5 border border-emerald-400/20">
              <Star className="w-2 h-2 fill-white animate-pulse" />
              <span>Close Friends</span>
            </div>

            {/* Bottom details */}
            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10.5px] font-extrabold text-white">Ava Thompson</span>
              </div>
              <p className="text-[9px] text-slate-300 line-clamp-1">Golden hour at local coffee roasters</p>
              <span className="text-[8px] text-slate-400 font-mono">2h ago • Downtown</span>
            </div>
          </div>

          {/* Card 2: Project Card */}
          <div className="bg-[#0e0721]/90 border border-purple-500/25 p-4 rounded-2xl shadow-lg flex flex-col justify-between aspect-[3/4]">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] font-black text-purple-300 bg-purple-950/75 border border-purple-500/30 px-2 py-0.5 rounded-full uppercase font-mono tracking-wider">Gem Project</span>
              <button className="text-slate-500 hover:text-white p-1 rounded-full hover:bg-white/5">
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="my-auto space-y-1.5 text-left py-2">
              <h3 className="text-[13px] font-extrabold text-white tracking-tight">Green Earth Initiative</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">Planting trees for a better tomorrow.</p>
              <div className="flex items-center gap-1 text-[9px] text-fuchsia-300 font-mono">
                <MapPin className="w-3 h-3 shrink-0" />
                <span>Central Park</span>
              </div>
            </div>

            <div className="space-y-2">
              {/* Supporters indicator */}
              <div className="flex items-center justify-between text-[8px] font-mono text-slate-400">
                <div className="flex -space-x-1">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&auto=format&fit=crop&q=80" className="w-4 h-4 rounded-full object-cover border border-[#0e0721]" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80" className="w-4 h-4 rounded-full object-cover border border-[#0e0721]" />
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&auto=format&fit=crop&q=80" className="w-4 h-4 rounded-full object-cover border border-[#0e0721]" />
                </div>
                <span>{240 + Math.round(projectMilestoneProgress / 5)} supporters</span>
                <span className="font-bold text-fuchsia-400">{projectMilestoneProgress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-purple-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${projectMilestoneProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[8.5px] text-rose-400 font-mono">3 days left</span>
                <button 
                  onClick={handleSupportClick}
                  className="p-1 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-[9px] rounded-lg tracking-wider uppercase flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-white" />
                  <span>Support</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Event Card */}
          <div className="bg-[#0e0721]/90 border border-purple-500/25 p-4 rounded-2xl shadow-lg flex flex-col justify-between aspect-[3/4]">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] font-black text-amber-300 bg-amber-950/75 border border-amber-900/30 px-2 py-0.5 rounded-full uppercase font-mono tracking-wider">Event</span>
              <button className="text-slate-500 hover:text-white p-1 rounded-full hover:bg-white/5">
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="my-auto space-y-1.5 text-left py-2">
              <h3 className="text-[13px] font-extrabold text-white tracking-tight">Sunset Music Fest</h3>
              <p className="text-[9.5px] text-orange-400 font-bold font-mono">Sat, May 25 • 5:00 PM</p>
              <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                <MapPin className="w-3 h-3 shrink-0 text-fuchsia-400" />
                <span>Bayfront Park, Miami</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[8px] font-mono text-slate-400">
                <span className="font-extrabold text-fuchsia-400">+120 attending</span>
              </div>
              <button 
                onClick={() => {
                  onAddMarker('Sunset Music Fest RSVP', 'Attending glorious Miami Beach sunset music', 'event');
                  alert('RSVP Confirmed for Sunset Music Fest!');
                }}
                className="w-full py-1.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-extrabold text-[9.5px] rounded-xl tracking-wider uppercase active:scale-95 transition-transform cursor-pointer text-center"
              >
                RSVP
              </button>
            </div>
          </div>

          {/* Card 4: Marketplace Card */}
          <div className="bg-[#0e0721]/90 border border-purple-500/25 p-3 rounded-2xl shadow-lg flex flex-col justify-between aspect-[3/4] relative">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] font-black text-cyan-300 bg-cyan-950/75 border border-cyan-900/30 px-2 py-0.5 rounded-full uppercase font-mono tracking-wider">Marketplace</span>
              <button className="text-slate-500 hover:text-white p-1 rounded-full hover:bg-white/5">
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Sneaker image */}
            <div className="h-18 my-1 flex items-center justify-center overflow-hidden rounded-xl border border-purple-950 bg-slate-950 p-1">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80" 
                alt="Product Mockup" 
                className="h-full object-contain hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="text-left space-y-0.5">
              <h4 className="text-[11px] font-black text-white truncate">Nike Air Max 270</h4>
              <p className="text-[8.5px] text-slate-400 font-mono">Men's Size 10</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black font-mono text-cyan-400">$120</span>
                <span className="text-[8.5px] line-through text-slate-550 font-mono">$160</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-purple-950/50">
              <span className="text-[7.5px] text-slate-500 font-mono">Miami, FL</span>
              <button 
                onClick={() => setFavoriteMarket(!favoriteMarket)}
                className={`p-1 rounded-full border transition-colors cursor-pointer ${
                  favoriteMarket ? 'bg-pink-950 border-pink-500 text-pink-400 animate-pulse' : 'bg-slate-900 border-purple-950 text-slate-400'
                }`}
              >
                <Heart className="w-3 h-3 fill-current" />
              </button>
            </div>
          </div>

          {/* Card 5: Chat Preview Card */}
          <div 
            onClick={() => {
              onUpdateActiveChat('chat_group_1');
              onTriggerWsLog({
                id: `log_squad_select_${Date.now()}`,
                timestamp: new Date().toISOString(),
                direction: 'client_to_server',
                event: 'ux:card_chat_engage',
                payload: { chatId: 'chat_group_1', roomName: 'Project Squad' }
              });
            }}
            className="bg-[#0e0721]/90 border border-purple-500/25 p-3 rounded-2xl shadow-lg flex flex-col justify-between aspect-[3/4] cursor-pointer hover:border-purple-400 hover:bg-[#120a2e] transition-all text-left"
          >
            <div>
              <div className="flex justify-between items-center text-[7.5px] font-mono text-fuchsia-400">
                <span>SECURE INSTANCE</span>
                <span className="text-pink-500 bg-pink-950/50 px-1 py-0.2 rounded font-black">LIVE</span>
              </div>
              <h4 className="text-[12px] font-black text-white mt-1.5">Project Squad</h4>
              <p className="text-[9px] text-slate-400 leading-relaxed mt-1 line-clamp-2">Ava: Let's review the designs for South Park botanicals.</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono">
                <span>9:41 AM</span>
                <span className="bg-fuchsia-500 text-white font-extrabold px-1.5 py-0.2 rounded-full text-[8.5px]">3</span>
              </div>

              {/* Stacked avatars */}
              <div className="flex items-center justify-between pt-1 border-t border-purple-950/50">
                <div className="flex -space-x-1.5">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80" className="w-5 h-5 rounded-full object-cover border border-[#0d071a]" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&auto=format&fit=crop&q=80" className="w-5 h-5 rounded-full object-cover border border-[#0d071a]" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80" className="w-5 h-5 rounded-full object-cover border border-[#0d071a]" />
                </div>
                <span className="text-[8px] font-mono font-bold text-indigo-300 hover:underline">+5 active</span>
              </div>
            </div>
          </div>

          {/* Card 6: Analytics Card */}
          <div className="bg-[#0e0721]/90 border border-purple-500/25 p-3 rounded-2xl shadow-lg flex flex-col justify-between aspect-[3/4] text-left">
            <div>
              <div className="flex items-center justify-between text-[8px] text-slate-400 font-sans uppercase">
                <span>Story Views</span>
                <span>Last 7 days</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-lg font-black text-white font-mono">18.4K</span>
                <span className="text-[8px] font-extrabold font-mono text-emerald-400">+32.6%</span>
              </div>
            </div>

            {/* Stylized Weekly micro-bar chart representing M T W T F S S */}
            <div className="flex items-end gap-1.5 h-16 px-1 font-mono">
              {[
                { label: 'M', height: 28 },
                { label: 'T', height: 45 },
                { label: 'W', height: 35 },
                { label: 'T', height: 60 },
                { label: 'F', height: 50 },
                { label: 'S', height: 78 },
                { label: 'S', height: 95 },
              ].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gradient-to-t from-purple-800 to-fuchsia-500 rounded-sm relative" style={{ height: `${item.height}%` }}>
                    <div className="absolute inset-x-0 top-0 h-1 bg-white/20" />
                  </div>
                  <span className="text-[7.5px] text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 2. MAP DISCOVERY & CHAT INTERFACE SIDE-BY-SIDE */}
      <div id="dual-mockup-block" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MAP DISCOVERY CARD - COLUMN SPAN 5 */}
        <section className="lg:col-span-5 bg-[#0b0717]/85 border border-purple-500/20 p-5 rounded-3xl text-left shadow-2xl relative flex flex-col justify-between h-[390px] overflow-hidden">
          {/* Decorative grid pattern in map */}
          <div className="absolute inset-0 bg-radial-[circle_at_center] from-[#1f093d] to-transparent opacity-25 pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between border-b border-purple-950/40 pb-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-fuchsia-400 animate-spin" style={{ animationDuration: '6s' }} />
                <h3 className="text-xs font-black tracking-wider text-slate-100 uppercase font-mono">Map Discovery</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="grid grid-cols-12 gap-3.5 mt-4 flex-1">
              {/* Toggles Panel */}
              <div className="col-span-4 space-y-3 pt-1 border-r border-purple-950/50 pr-2.5">
                
                {/* Toggle 1: Ghost Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[8.5px] font-black text-slate-300 block font-mono">Ghost Mode</span>
                    <span className="text-[6.5px] text-slate-500">Hide my position</span>
                  </div>
                  <button 
                    onClick={() => setGhostMode(!ghostMode)}
                    className={`w-6.5 h-3.5 rounded-full p-0.5 transition-colors cursor-pointer ${ghostMode ? 'bg-[#ff00ea]' : 'bg-slate-800'}`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${ghostMode ? 'translate-x-3' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Toggle 2: Precise Location */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[8.5px] font-black text-slate-300 block font-mono">Precise GPS</span>
                    <span className="text-[6.5px] text-slate-500">Dynamic meter map</span>
                  </div>
                  <button 
                    onClick={() => setPreciseLoc(!preciseLoc)}
                    className={`w-6.5 h-3.5 rounded-full p-0.5 transition-colors cursor-pointer ${preciseLoc ? 'bg-[#ff00ea]' : 'bg-slate-800'}`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${preciseLoc ? 'translate-x-3' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Toggle 3: Live Location */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[8.5px] font-black text-slate-300 block font-mono">Live Sockets</span>
                    <span className="text-[6.5px] text-slate-500">Continuous ping</span>
                  </div>
                  <button 
                    onClick={() => setLiveLocation(!liveLocation)}
                    className={`w-6.5 h-3.5 rounded-full p-0.5 transition-colors cursor-pointer ${liveLocation ? 'bg-[#ff00ea]' : 'bg-slate-800'}`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${liveLocation ? 'translate-x-3' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Toggle 4: Hide Me */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[8.5px] font-black text-slate-300 block font-mono">Hide Me</span>
                    <span className="text-[6.5px] text-slate-500">Drop local links</span>
                  </div>
                  <button 
                    onClick={() => setHideMe(!hideMe)}
                    className={`w-6.5 h-3.5 rounded-full p-0.5 transition-colors cursor-pointer ${hideMe ? 'bg-[#ff00ea]' : 'bg-slate-800'}`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${hideMe ? 'translate-x-3' : 'translate-x-0'}`} />
                  </button>
                </div>

              </div>

              {/* Graphic Radar Map View */}
              <div className="col-span-8 bg-slate-950/80 border border-purple-950 rounded-2xl h-52 relative overflow-hidden flex items-center justify-center p-2">
                
                {/* Concentric radar circles */}
                <div className="absolute w-44 h-44 rounded-full border border-purple-500/10 animate-ping" style={{ animationDuration: '4s' }} />
                <div className="absolute w-28 h-28 rounded-full border border-purple-500/15" />
                <div className="absolute w-12 h-12 rounded-full border border-purple-500/20" />
                
                {/* Grid lines crossed */}
                <div className="absolute inset-x-0 h-px bg-purple-500/10" />
                <div className="absolute inset-y-0 w-px bg-purple-500/10" />

                {/* Floating avatars as map nodes with coordinate threads connected */}
                <div className="absolute top-10 left-12 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-fuchsia-500 rounded-full blur-sm opacity-50 animate-pulse" />
                    <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&auto=format&fit=crop&q=80" className="w-5.5 h-5.5 rounded-full border border-fuchsia-400 relative z-10" />
                  </div>
                  <span className="absolute -top-4 -left-2 bg-purple-950/90 text-white text-[6.5px] px-1 py-0.2 rounded border border-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity font-mono whitespace-nowrap">Mia S.</span>
                </div>

                <div className="absolute bottom-12 right-12 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-500 rounded-full blur-sm opacity-50" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80" className="w-5.5 h-5.5 rounded-full border border-amber-400 relative z-10" />
                  </div>
                  <span className="absolute -top-4 -left-2 bg-purple-950/90 text-white text-[6.5px] px-1 py-0.2 rounded border border-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity font-mono whitespace-nowrap">Kai T.</span>
                </div>

                <div className="absolute top-6 right-16">
                  <span className="text-[7px] text-fuchsia-400 font-mono tracking-widest uppercase animate-pulse">SECURE_PIPE</span>
                </div>

                {/* Glowing Core Connector lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-purple-500/30 font-bold" strokeWidth="1.5">
                  <line x1="60" y1="50" x2="180" y2="150" strokeDasharray="3 3 shrink-0" />
                </svg>

                {/* Overlaid Event popup card representation (Sunset Yoga) */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#0c0716]/95 border border-purple-500/35 p-2 rounded-xl flex items-center justify-between text-left shadow-2xl z-20">
                  <div className="flex items-center gap-2">
                    <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=100&auto=format&fit=crop&q=80" className="w-8.5 h-8.5 rounded-lg object-cover border border-purple-900" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-white">Sunset Yoga</span>
                        <span className="text-[6.5px] bg-pink-500 text-white px-1 py-0.2 rounded uppercase font-bold tracking-tight">Live</span>
                      </div>
                      <span className="text-[7.5px] text-slate-400">Tomorrow • 7:00 AM • Ocean Drive</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleJoinSunsetYoga}
                    className={`p-1 px-3 rounded-lg font-extrabold uppercase font-mono tracking-wider transition-all cursor-pointer text-[8px] ${
                      isSunsetYogaJoined 
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse' 
                        : 'bg-purple-600 hover:bg-purple-500 text-white'
                    }`}
                  >
                    {isSunsetYogaJoined ? 'Joined ✓' : 'Join'}
                  </button>
                </div>

              </div>
            </div>
            
            {/* Coordinates indicator at bottom of Map */}
            <div className="flex items-center justify-between text-[7.5px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-purple-950/20">
              <span>BOUNDS: SOMA DISTRICT • SF CA</span>
              <span className="text-purple-400">HOST_IP: 10.32.148.9</span>
            </div>
          </div>
        </section>

        {/* CHAT INTERFACE CUSTOM CARD - COLUMN SPAN 7 */}
        <section className="lg:col-span-7 bg-[#0b0717]/85 border border-purple-500/20 p-5 rounded-3xl text-left shadow-2xl h-[390px] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-950/40 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" className="w-8.5 h-8.5 rounded-full object-cover border border-purple-500/30" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0b0717]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white tracking-wide">Ava Thompson</h3>
                  <span className="text-[8px] text-emerald-400 font-mono uppercase tracking-wider font-bold">Online • Secure Node Link</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => alert("Simulated video call packet dialed to Ava Thompson!")}
                  className="p-1 px-[7px] rounded-lg bg-purple-950 border border-purple-900/30 text-purple-300 hover:text-white transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => alert("Simulated call pipeline opened!")}
                  className="p-1 px-[7px] rounded-lg bg-purple-950 border border-purple-900/30 text-purple-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 text-slate-400 hover:text-white">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated chats flow list */}
            <div className="h-48 overflow-y-auto space-y-3.5 py-3.5 pr-2 scrolling-touch scrollbar-thin">
              
              {/* Msg 1 Received */}
              <div className="flex gap-2 max-w-[85%] text-left">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&auto=format&fit=crop&q=80" className="w-6.5 h-6.5 rounded-full object-cover border border-purple-900" />
                <div>
                  <div className="bg-[#120a24]/90 text-[10.5px] leading-relaxed p-2.5 rounded-2xl rounded-tl-none border border-purple-950/30 text-slate-200">
                    Hey! Are you coming to the Sunset Street event tonight?
                  </div>
                  <span className="text-[7.5px] text-slate-500 ml-1 mt-0.5 block font-mono">9:30 AM ✓✓</span>
                </div>
              </div>

              {/* Msg 2 Sent */}
              <div className="flex gap-2 max-w-[85%] ml-auto flex-row-reverse text-right">
                <div className="flex flex-col items-end">
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-[10.5px] leading-relaxed p-2.5 rounded-2xl rounded-br-none text-white font-medium">
                    Absolutely! Can't wait 🔥 I just prepared the coordinates marker.
                  </div>
                  <span className="text-[7.5px] text-slate-500 mr-1 mt-0.5 block font-mono">9:31 AM ✓✓</span>
                </div>
              </div>

              {/* Msg 3 Received: Audio voice packet waves */}
              <div className="flex gap-2 max-w-[85%] text-left">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&auto=format&fit=crop&q=80" className="w-6.5 h-6.5 rounded-full object-cover border border-purple-900" />
                <div>
                  <div className="bg-[#120a24]/90 p-2.5 rounded-2xl rounded-tl-none border border-purple-950/30 text-slate-200">
                    <div className="flex flex-col gap-1 w-44 text-left">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <button
                          type="button"
                          onClick={toggleAudio}
                          className="w-7 h-7 rounded-full bg-fuchsia-500 hover:bg-fuchsia-400 text-white flex items-center justify-center shrink-0 shadow active:scale-90 transition-transform cursor-pointer"
                        >
                          {dashboardPlayingAudio ? (
                            <Pause className="w-3 h-3 text-white fill-white" />
                          ) : (
                            <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                          )}
                        </button>
                        
                        {/* Audio waves visualizer */}
                        <div className="flex-1 flex items-end gap-[2px] h-6 px-1">
                          {[16, 28, 48, 20, 64, 40, 75, 30, 52, 22, 60].map((h, idx) => {
                            const isPlayed = (idx / 11) * 100 < dashboardAudioProgress;
                            return (
                              <div 
                                key={idx} 
                                style={{ height: `${h}%` }}
                                className={`w-[3px] rounded-full transition-all duration-150 ${isPlayed ? 'bg-fuchsia-400' : 'bg-slate-700'}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[7px] font-mono mt-0.5">
                        <span className="text-fuchsia-400 font-bold">🎙️ peer voice packet</span>
                        <span className="text-slate-500">0:18</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[7.5px] text-slate-500 ml-1 mt-0.5 block font-mono">9:32 AM ✓✓</span>
                </div>
              </div>

              {/* Msg 4 View Once disapearing image banner block */}
              <div className="flex gap-2 max-w-[85%] ml-auto flex-row-reverse text-right">
                <div className="flex flex-col items-end">
                  <div className="bg-gradient-to-br from-purple-900/40 to-indigo-950 p-2.5 rounded-2xl rounded-br-none border border-purple-500/20 text-slate-200">
                    <div className="flex flex-col gap-1.5 w-44">
                      {/* Image Preview */}
                      <div className="rounded-xl overflow-hidden border border-purple-950 h-16 relative">
                        <img 
                          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80" 
                          alt="Sunset coordinate viewonce" 
                          className="w-full h-full object-cover filter blur-[2px] brightness-75"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-[7.5px] text-pink-300 font-bold font-mono tracking-widest uppercase bg-pink-950/70 p-1 rounded">View once packet burned</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[7px] font-mono mt-0.5">
                        <span className="text-pink-400 font-bold flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" />
                          burned
                        </span>
                        <span>9:33 AM</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[7.5px] text-slate-500 mr-1 mt-0.5 block font-mono">9:33 AM ✓✓</span>
                </div>
              </div>

            </div>
          </div>

          {/* Form input bottom bar */}
          <form onSubmit={handleSendChatSubmit} className="flex items-center gap-2 pt-2 border-t border-purple-950/40">
            <button 
              type="button" 
              onClick={() => alert("Audio session initialized directly")}
              className="p-2 bg-purple-950 border border-purple-900/30 text-purple-300 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-purple-300" />
            </button>

            <input
              type="text"
              value={typedMsgText}
              onChange={(e) => setTypedMsgText(e.target.value)}
              placeholder="Inject encrypted message packets onto public stream..."
              className="flex-1 bg-[#120a24]/90 border border-purple-900/30 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-slate-550 outline-none font-sans"
            />

            <button
              type="submit"
              className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-103 active:scale-95 text-white rounded-xl shadow-md transition-all outline-none cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>

      </div>

      {/* 3. ANALYTICS DASHBOARD CARD */}
      <section className="bg-[#0b0717]/85 border border-purple-500/20 p-5 rounded-3xl shadow-2xl relative text-left">
        
        {/* Header mode config */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-950/50 pb-4 mb-4">
          <div>
            <span className="text-[9px] font-bold text-fuchsia-400 font-mono uppercase tracking-widest block mb-0.5">Live Metrics Analyzer</span>
            <h3 className="text-xs font-black text-slate-100 uppercase font-sans tracking-wide">Analytics Dashboard</h3>
          </div>

          <div className="flex items-center gap-2">
            <select className="bg-purple-950 border border-purple-900/40 p-1.5 px-3 rounded-lg text-[10px] text-purple-300 font-bold font-mono outline-none cursor-pointer">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>All time</option>
            </select>

            <button
              onClick={() => {
                setSimulateSpike(true);
                setTimeout(() => setSimulateSpike(false), 3000);
              }}
              disabled={simulateSpike}
              className={`p-1.5 px-3 rounded-lg border text-[10px] font-mono font-black tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-all ${
                simulateSpike 
                  ? 'bg-pink-950 border-pink-500 text-pink-400 animate-pulse' 
                  : 'bg-purple-900/20 border-purple-800/40 text-purple-300 hover:bg-purple-900/40 hover:border-purple-600 shadow-md'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 text-amber-400 ${simulateSpike ? 'animate-bounce' : ''}`} />
              <span>{simulateSpike ? 'SPIKE SIMULATED' : 'SPIKE REQ'}</span>
            </button>
          </div>
        </div>

        {/* Bento grid stats blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          
          {/* Bento item 1: Reach */}
          <div className="p-3 bg-[#0c071a]/90 border border-purple-950 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[8.5px] font-mono text-slate-400 block uppercase">Reach</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-black text-white font-mono">{simulateSpike ? '184.2K' : '124K'}</span>
                <span className="text-[8.5px] font-extrabold text-emerald-400 font-mono">+18.2%</span>
              </div>
            </div>
            {/* Reach Mini Sparkline */}
            <div className="h-7 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineReachData}>
                  <Line type="monotone" dataKey="val" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bento item 2: Engagement */}
          <div className="p-3 bg-[#0c071a]/90 border border-purple-950 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[8.5px] font-mono text-slate-400 block uppercase">Engagement</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-black text-white font-mono">{simulateSpike ? '45.1K' : '23.8K'}</span>
                <span className="text-[8.5px] font-extrabold text-emerald-400 font-mono">+22.7%</span>
              </div>
            </div>
            {/* Engagement Mini Sparkline */}
            <div className="h-7 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineEngagementData}>
                  <Line type="monotone" dataKey="val" stroke="#ec4899" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bento item 3: Messages */}
          <div className="p-3 bg-[#0c071a]/90 border border-purple-950 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[8.5px] font-mono text-slate-400 block uppercase">Messages</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-black text-white font-mono">{chats.reduce((sum, c) => sum + c.messages.length, 0) + (simulateSpike ? 15 : 0)} packets</span>
                <span className="text-[8.5px] font-extrabold text-emerald-400 font-mono">+15.3%</span>
              </div>
            </div>
            {/* Messages Mini Sparkline */}
            <div className="h-7 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineMessagesData}>
                  <Line type="monotone" dataKey="val" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bento item 4: New Followers */}
          <div className="p-3 bg-[#0c071a]/90 border border-purple-950 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[8.5px] font-mono text-slate-400 block uppercase">New Followers</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-black text-white font-mono">1.2K</span>
                <span className="text-[8.5px] font-extrabold text-emerald-400 font-mono">+17.6%</span>
              </div>
            </div>
            {/* Followers Mini Sparkline */}
            <div className="h-7 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineFollowersData}>
                  <Line type="monotone" dataKey="val" stroke="#f43f5e" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Dynamic Big Area Chart: Message Traffic */}
        <div className="space-y-1.5">
          <span className="text-[9px] uppercase font-mono font-extrabold text-slate-450 block tracking-wide">Continuous Messaging Hub Traffic Flow (May 17 - May 23)</span>
          <div className="w-full bg-[#05020c]/40 border border-purple-950 p-3 rounded-2xl h-[210px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficChartData} margin={{ top: 5, right: 5, left: -25, bottom: -5 }}>
                <defs>
                  <linearGradient id="colorTrafficFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 8, fontFamily: 'monospace' }} 
                  axisLine={{ stroke: '#4c1d95', opacity: 0.3 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 8, fontFamily: 'monospace' }} 
                  axisLine={{ stroke: '#4c1d95', opacity: 0.3 }}
                  tickLine={false}
                />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="traffic" 
                  stroke="#f43f5e" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTrafficFlow)" 
                  name="Packets Exchanged"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

      {/* 4. DESIGN VALUE SECTIONS FOOTER - 4 CARDS (Unified, Real-time, Privacy, Community) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        
        {/* Value block 1 */}
        <div className="p-4 bg-purple-950/20 border border-purple-500/10 rounded-2xl flex items-start gap-3 text-left">
          <div className="p-2 bg-purple-950 rounded-xl text-fuchsia-400 font-extrabold shrink-0 border border-purple-900/30">
            <Layers className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-100 uppercase tracking-tight">Unified Experience</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Everything works seamlessly together in one glorious responsive dashboard hub.</p>
          </div>
        </div>

        {/* Value block 2 */}
        <div className="p-4 bg-purple-950/20 border border-purple-500/10 rounded-2xl flex items-start gap-3 text-left">
          <div className="p-2 bg-purple-950 rounded-xl text-amber-400 font-extrabold shrink-0 border border-purple-900/30">
            <Zap className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-100 uppercase tracking-tight">Real-Time Connection</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Chat, collaborate, share and synchronize location indices under millisecond latency.</p>
          </div>
        </div>

        {/* Value block 3 */}
        <div className="p-4 bg-purple-950/20 border border-purple-500/10 rounded-2xl flex items-start gap-3 text-left">
          <div className="p-2 bg-purple-950 rounded-xl text-pink-400 font-extrabold shrink-0 border border-purple-900/30">
            <Lock className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-100 uppercase tracking-tight">Privacy First</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">You command absolute security over your location visibility and expiring media feeds.</p>
          </div>
        </div>

        {/* Value block 4 */}
        <div className="p-4 bg-purple-950/20 border border-purple-500/10 rounded-2xl flex items-start gap-3 text-left">
          <div className="p-2 bg-purple-950 rounded-xl text-cyan-400 font-extrabold shrink-0 border border-purple-900/30">
            <Users className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-100 uppercase tracking-tight">Built For Community</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Host events, back initiatives, transact on marketplace boards together.</p>
          </div>
        </div>

      </section>

    </div>
  );
}
