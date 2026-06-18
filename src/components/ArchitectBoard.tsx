import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Share2, 
  Cpu, 
  Layers, 
  Code, 
  MapPin, 
  Cloud, 
  ShieldAlert, 
  Tv, 
  CheckCircle2, 
  Clock, 
  Shuffle, 
  Zap, 
  HardDrive,
  Copy,
  ChevronRight
} from 'lucide-react';
import { ChatThread, EphemeralStory } from '../types';
import { AnalyticsPanel } from './AnalyticsPanel';

interface ArchitectBoardProps {
  chats?: ChatThread[];
  stories?: EphemeralStory[];
}

export function ArchitectBoard({ chats = [], stories = [] }: ArchitectBoardProps = {}) {
  const [activeTab, setActiveTab] = useState<'database' | 'websockets' | 'state' | 'scaling'>('database');
  const [selectedSchema, setSelectedSchema] = useState<string>('users');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const triggerCopyNotify = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const dbCodeGems = {
    users: `{
  "_id": "ObjectId",
  "username": "String (Unique, Indexed)",
  "name": "String",
  "avatar": "String",
  "status": "String (enum: online, away, offline)",
  "location": {
    "type": "Point",
    "coordinates": [Number, Number] // [lng, lat] for 2dsphere!
  },
  "lastPresenceUpdate": "Date",
  "createdAt": "Date"
}
// INDEX: { "location": "2dsphere" } for real-time proximity discovery`,
    messages: `{
  "_id": "ObjectId",
  "chatId": "ObjectId (Indexed)",
  "senderId": "ObjectId",
  "text": "String (Encrypted field)",
  "timestamp": "Date",
  "status": "String (enum: sent, delivered, read)",
  "expiresAt": "Date (Nullable - for self-destruct packets)"
}
// COMPOUND INDEX: { "chatId": 1, "timestamp": -1 } for fast room renders`,
    stories: `{
  "_id": "ObjectId",
  "userId": "ObjectId (Indexed)",
  "mediaUrl": "String",
  "caption": "String",
  "location": {
    "type": "Point",
    "coordinates": [Number, Number] // Geo-pinned story
  },
  "createdAt": "Date",
  "expiresAt": "Date" // TTL Indexed! 
}
// TTL INDEX: { "expiresAt": 1 } - automatic MongoDB deletion after 24h`,
    markers: `{
  "_id": "ObjectId",
  "location": {
    "type": "Point",
    "coordinates": [Number, Number]
  },
  "title": "String",
  "description": "String",
  "type": "String (enum: media, event, ping)",
  "creatorId": "ObjectId",
  "likesCount": "Number",
  "createdAt": "Date"
}
// INDEX: { "location": "2dsphere" } for spatial coordinate fetching`
  };

  return (
    <div id="architect-specification-deck" className="bg-[#0b0717]/85 border border-purple-900/30 rounded-3xl p-6 flex flex-col h-full shadow-[0_4px_30px_rgba(0,0,0,0.5),0_0_40px_rgba(109,40,217,0.12)] relative text-left backdrop-blur-xl">
      
      {/* Header section of Architect specifications */}
      <div className="mb-5 pb-5 border-b border-purple-900/20">
        <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-wider mb-1.5 font-bold">
          <Cpu className="w-4 h-4 animate-spin text-purple-400" />
          <span>Product Architect Blueprint Deck</span>
        </div>
        <h2 className="text-xl font-bold font-sans text-white tracking-tight">GM Architecture Speclist</h2>
        <p className="text-[11.5px] text-slate-300 mt-2 leading-relaxed">
          Technical definition outlining the MERN stack integration, schema optimization for coordinate indexing, state lifecycle patterns, and WebSocket broadcast synchronization.
        </p>
      </div>

      {/* Tabs configuration */}
      <div className="flex items-center gap-1 bg-[#05020c]/60 p-1 rounded-2xl mb-4.5 border border-purple-950/80">
        <button
          id="tab-db-schema"
          onClick={() => setActiveTab('database')}
          className={`flex-1 py-2 text-[10px] md:text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'database' 
              ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.45)]' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/20'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>MERN Schemas</span>
        </button>

        <button
          id="tab-ws-sync"
          onClick={() => setActiveTab('websockets')}
          className={`flex-1 py-2 text-[10px] md:text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'websockets' 
              ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.45)]' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/20'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Socket Channels</span>
        </button>

        <button
          id="tab-state-perf"
          onClick={() => setActiveTab('state')}
          className={`flex-1 py-2 text-[10px] md:text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'state' 
              ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.45)]' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/20'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>State Optimization</span>
        </button>

        <button
          id="tab-scale"
          onClick={() => setActiveTab('scaling')}
          className={`flex-1 py-2 text-[10px] md:text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'scaling' 
              ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.45)]' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/20'
          }`}
        >
          <Cloud className="w-3.5 h-3.5" />
          <span>Concur Scaling</span>
        </button>
      </div>

      {/* Main Spec Panels contents */}
      <div className="flex-1 overflow-y-auto">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: MERN DATABASE MODEL SCHEMAS */}
          {activeTab === 'database' && (
            <motion.div
              key="database-spec"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="p-3 bg-purple-950/15 border border-purple-500/15 rounded-2xl flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Low-Latency GeoProximity Spatial Markers</h4>
                  <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                    By utilising MongoDB’s native <code className="text-pink-400 font-semibold font-mono">2dsphere</code> index architecture on spherical coordinate points, GM queries active 2D areas within specific coordinates at sub-millisecond rates.
                  </p>
                </div>
              </div>

              {/* Interactive collection inspector */}
              <div className="grid grid-cols-4 gap-2 border-b border-purple-950/60 pb-3">
                {(['users', 'messages', 'stories', 'markers'] as const).map((col) => (
                  <button
                    key={col}
                    id={`btn-schema-inspect-${col}`}
                    onClick={() => setSelectedSchema(col)}
                    className={`py-1.5 text-[10px] rounded-lg font-bold border transition-all cursor-pointer ${
                      selectedSchema === col 
                        ? 'bg-purple-900/40 border-purple-500 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]' 
                        : 'bg-[#06030c] border-purple-950 text-slate-400 hover:bg-purple-950/20 hover:text-slate-300'
                    }`}
                  >
                    {col.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Render Code Editor Blueprint */}
              <div className="relative">
                <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
                  <span className="text-[8px] text-slate-500 font-mono">schema.ts</span>
                  <button
                    id={`btn-copy-schema-${selectedSchema}`}
                    onClick={() => triggerCopyNotify(selectedSchema, dbCodeGems[selectedSchema as keyof typeof dbCodeGems])}
                    className="p-1 px-1.5 bg-slate-900 border border-slate-700/50 hover:border-purple-500 text-slate-400 hover:text-white rounded text-[9px] font-bold flex items-center gap-1 transition-colors"
                  >
                    {copiedId === selectedSchema ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === selectedSchema ? 'Indexed!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-[#05020c]/90 text-indigo-200 font-mono text-[10px] p-4.5 rounded-2xl border border-purple-950/60 overflow-x-auto leading-relaxed max-h-[290px] shadow-inner">
                  {dbCodeGems[selectedSchema as keyof typeof dbCodeGems]}
                </pre>
              </div>

              {/* TTL and Indexes Specifications list */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">Critical Indexes Configured</span>
                <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                  <div className="p-2.5 bg-[#06030c] border border-purple-950/40 rounded-xl flex flex-col gap-1">
                    <span className="font-bold text-slate-200">Stories TTL Burner</span>
                    <span className="text-[9px] text-slate-400">Automatically deletes documents older than 24 hours via database indexes:</span>
                    <code className="text-[9px] text-pink-400 mt-1 font-mono">createIndex({"{"}"expiresAt": 1{"}"}, {"{"}expireAfterSeconds: 0{"}"})</code>
                  </div>
                  <div className="p-2.5 bg-[#06030c] border border-purple-950/40 rounded-xl flex flex-col gap-1">
                    <span className="font-bold text-slate-200">Sharding GeoKeys</span>
                    <span className="text-[9px] text-slate-400">Compounds shard indices for cross-region speed matching users:</span>
                    <code className="text-[9px] text-pink-400 mt-1 font-mono">{"{ 'location': '2dsphere', 'status': 1 }"}</code>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: WEBSOCKET SYNC CHANNEL LIFECYCLE */}
          {activeTab === 'websockets' && (
            <motion.div
              key="ws-spec"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="p-3.5 bg-[#070411]/80 border border-purple-950/60 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                  <h4 className="text-xs font-bold text-slate-100">WS Session Synchronization (Protocol)</h4>
                </div>
                <p className="text-[10.5px] text-slate-300 leading-relaxed">
                  Sockets utilize raw binary representation or low footprint JSON. The clients preserve active frames over continuous connections, maintaining heartbeats at 15-second cycles to drop stale coordinate links.
                </p>
              </div>

              {/* Event Lifecycle flow representation */}
              <div className="border border-purple-950/50 bg-[#05020c]/40 p-4 rounded-xl space-y-3.5">
                <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Active Event Flow Routing</span>
                
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="text-[9px] font-mono font-bold bg-[#0a1e2d] text-cyan-300 p-1 rounded border border-cyan-800/30 w-[120px] shrink-0 uppercase tracking-tight text-center">
                      presence:geo_sync
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="text-[10.5px] text-slate-300 leading-tight">Sends current lat/lng sequence. Broadcasts proximity markers within 500m radius of peers.</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-[9px] font-mono font-bold bg-[#1e0a21] text-pink-300 p-1 rounded border border-pink-800/30 w-[120px] shrink-0 uppercase tracking-tight text-center">
                      chat:message_push
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="text-[10.5px] text-slate-300 leading-tight">Sends AES-256 message packet. Decrypts and appends securely to local thread memory.</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-[9px] font-mono font-bold bg-[#1f1406] text-amber-300 p-1 rounded border border-amber-800/30 w-[120px] shrink-0 uppercase tracking-tight text-center">
                      ephemeral:burn
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="text-[10.5px] text-slate-300 leading-tight">Triggers immediate cache eviction of story records across active subscribers under 1 second.</span>
                  </div>
                </div>
              </div>

              {/* Technical Code block for websocket handshake */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">Node & Express Upgrader</span>
                <pre className="bg-[#05020c]/90 text-indigo-300 font-mono text-[9px] p-3.5 rounded-xl border border-purple-950/60 overflow-x-auto leading-relaxed">
{`// Express to WS integration using Native Net sockets
server.on('upgrade', (request, socket, head) => {
  const { pathname } = url.parse(request.url);
  if (pathname === '/api/v1/gm-socket') {
    wsServer.handleUpgrade(request, socket, head, (ws) => {
      wsServer.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});`}
                </pre>
              </div>
            </motion.div>
          )}

          {/* TAB 3: STATE LIFECYCLE & PERFORMANCE */}
          {activeTab === 'state' && (
            <motion.div
              key="state-spec"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="p-3.5 bg-[#0c0717]/60 border border-purple-950/60 rounded-2xl flex items-start gap-3">
                <HardDrive className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-100">State Virtualization & Decoupled Caching</h4>
                  <p className="text-[10.5px] text-slate-300 mt-1 leading-relaxed font-sans">
                    Switching between intensive Chat Streams and Discovery Vector Maps causes layout overhead. We employ lightweight detached memory states so garbage collector sweeps do not freeze map animations.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <div className="p-3 bg-[#06030c] border border-purple-950/50 rounded-xl space-y-1.5 text-[11px]">
                  <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    Coordinate Throttle Middleware
                  </h5>
                  <p className="text-slate-400 text-[10px] leading-relaxed">
                    Rather than updating the Redux state coordinate records continuously on minor drags or map pans, panning coordinates are captured via Refs and written to the map at 300ms intervals to optimize performance.
                  </p>
                </div>

                <div className="p-3 bg-[#06030c] border border-purple-950/50 rounded-xl space-y-1.5 text-[11px]">
                  <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    Dynamic Screen Buffering
                  </h5>
                  <p className="text-slate-400 text-[10px] leading-relaxed">
                    By caching layout states of hidden divisions, complex chat timelines load instantly relative to system transitions. Components are unmounted dynamically only under low system memory flags.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-indigo-950/35 border border-indigo-500/20 rounded-xl text-[10.5px] text-indigo-300 leading-relaxed font-mono">
                <strong>Principal Recommendation:</strong> Implement selector memoization using Reselect, making sure to cache coordinate queries directly on client devices, preventing server-to-client overhead.
              </div>
            </motion.div>
          )}

          {/* TAB 4: HORIZONTAL SCALING & CONCURRENCY */}
          {activeTab === 'scaling' && (
            <motion.div
              key="scaling-spec"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-[#06030c] border border-purple-950/40 rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Dynamic Redis PubSub</span>
                  <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                    WebSocket connections bind horizontally. Standard Redis channels handle socket frame broadcasts across multiple container instances smoothly.
                  </p>
                </div>

                <div className="p-3.5 bg-[#06030c] border border-purple-950/40 rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">CDN Media Caching</span>
                  <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                    Disappearing story videos/photos bypass server storage. Elements load directly via secure pre-signed AWS S3 nodes with a hard retention policy.
                  </p>
                </div>
              </div>

              {/* Full System Flow Chart simulation */}
              <div className="border border-purple-950/50 bg-[#05020c] p-4 rounded-xl text-center space-y-3">
                <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase tracking-widest block text-left">GM Deployment Infrastructure Architecture</span>
                
                <div className="flex flex-col md:flex-row items-center justify-around gap-2 py-2 text-[10px] font-mono font-bold">
                  <div className="p-1.5 px-3 bg-indigo-950/40 border border-indigo-500 text-indigo-200 rounded-xl">
                    Mobile Client
                  </div>
                  <div className="text-purple-500 text-xs font-black animate-pulse">↔</div>
                  <div className="p-1.5 px-3 bg-purple-950/40 border border-purple-500 text-purple-200 rounded-xl">
                    HTTP/WS Proxy
                  </div>
                  <div className="text-purple-500 text-xs font-black animate-pulse">↔</div>
                  <div className="p-1.5 px-3 bg-pink-950/40 border border-pink-500 text-pink-200 rounded-xl">
                    Redis / PubSub
                  </div>
                  <div className="text-purple-500 text-xs font-black animate-pulse">↔</div>
                  <div className="p-1.5 px-3 bg-emerald-950/40 border border-emerald-500 text-emerald-200 rounded-xl">
                    MongoDB Cluster
                  </div>
                </div>
              </div>

              {/* Key design warning */}
              <div className="p-3 bg-amber-950/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-300 flex items-start gap-2 leading-relaxed">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  <strong>Security Directive:</strong> To enforce ephemerality, S3 pre-signed story URLs must mirror story TTLs. URLs will naturally fail authorization at the exact hour of database document eviction.
                </span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Integrated Analytics panel showing real-time load/engagement graph */}
        <AnalyticsPanel chats={chats} stories={stories} />

      </div>
    </div>
  );
}
