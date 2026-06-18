import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  BarChart,
  Bar,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  MessageSquare, 
  Tv, 
  Zap, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { ChatThread, EphemeralStory } from '../types';

interface AnalyticsPanelProps {
  chats: ChatThread[];
  stories: EphemeralStory[];
}

interface ChartDataPoint {
  hourLabel: string;
  hourVal: number;
  messages: number;
  engagement: number;
}

export function AnalyticsPanel({ chats, stories }: AnalyticsPanelProps) {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [simulationSpike, setSimulationSpike] = useState<number>(0);
  const [simulationActive, setSimulationActive] = useState<boolean>(false);

  // Derive total messages from live state
  const liveMessageCount = useMemo(() => {
    return chats.reduce((acc, chat) => acc + chat.messages.length, 0);
  }, [chats]);

  const liveStoryCount = useMemo(() => {
    return stories.length;
  }, [stories]);

  // Track initial message and story count to calculate relative additions
  const [initialMessageCount, setInitialMessageCount] = useState<number | null>(null);
  const [initialStoryCount, setInitialStoryCount] = useState<number | null>(null);

  useEffect(() => {
    if (initialMessageCount === null && liveMessageCount > 0) {
      setInitialMessageCount(liveMessageCount);
    }
  }, [liveMessageCount, initialMessageCount]);

  useEffect(() => {
    if (initialStoryCount === null && liveStoryCount > 0) {
      setInitialStoryCount(liveStoryCount);
    }
  }, [liveStoryCount, initialStoryCount]);

  // Compute standard 24h message traffic & ephemeral story engagement metrics
  const hourlyData = useMemo<ChartDataPoint[]>(() => {
    // Standard baseline distribution representing real daily cycles: 
    // Low activity in graveyard (00:00 - 06:00), rising in day, peaking in evening (18:00 - 22:00)
    const baseDistribution = [
      { hourLabel: '00:00', hourVal: 0,  messages: 12, engagement: 25 },
      { hourLabel: '02:00', hourVal: 2,  messages: 6,  engagement: 14 },
      { hourLabel: '04:00', hourVal: 4,  messages: 3,  engagement: 8  },
      { hourLabel: '06:00', hourVal: 6,  messages: 8,  engagement: 19 },
      { hourLabel: '08:00', hourVal: 8,  messages: 24, engagement: 42 },
      { hourLabel: '10:00', hourVal: 10, messages: 45, engagement: 68 },
      { hourLabel: '12:00', hourVal: 12, messages: 52, engagement: 74 },
      { hourLabel: '14:00', hourVal: 14, messages: 38, engagement: 59 },
      { hourLabel: '16:00', hourVal: 16, messages: 41, engagement: 65 },
      { hourLabel: '18:00', hourVal: 18, messages: 68, engagement: 95 },
      { hourLabel: '20:00', hourVal: 20, messages: 84, engagement: 120 },
      { hourLabel: '22:00', hourVal: 22, messages: 48, engagement: 82 },
    ];

    // Read current hour to overlay live user additions into the closest bucket
    const currentHour = new Date().getHours();
    const targetIdx = baseDistribution.findIndex(item => {
      // Find the interval bucket we are currently in
      return currentHour >= item.hourVal && (currentHour < item.hourVal + 2 || item.hourVal === 22);
    }) !== -1 ? baseDistribution.findIndex(item => {
      return currentHour >= item.hourVal && (currentHour < item.hourVal + 2 || item.hourVal === 22);
    }) : 10; // default to 20:00 bucket if not found

    // Calculate added count relative to start offsets
    const addedMessages = initialMessageCount !== null ? Math.max(0, liveMessageCount - initialMessageCount) : 0;
    const addedStories = initialStoryCount !== null ? Math.max(0, liveStoryCount - initialStoryCount) : 0;

    return baseDistribution.map((item, idx) => {
      let msgModifier = 0;
      let engModifier = 0;

      // Add user's real actions to the active time segment
      if (idx === targetIdx) {
        // Multiply by 4.5 for dynamic visual amplification on charts
        msgModifier += addedMessages * 4;
        engModifier += addedStories * 8;
      }

      // Add simulation spike if user clicks load test
      if (simulationSpike > 0) {
        msgModifier += Math.round(simulationSpike * (0.3 + 0.7 * Math.sin(idx * 0.9)));
        engModifier += Math.round(simulationSpike * 1.5 * (0.2 + 0.8 * Math.cos(idx * 0.7)));
      }

      return {
        ...item,
        messages: item.messages + msgModifier,
        engagement: item.engagement + engModifier
      };
    });
  }, [liveMessageCount, liveStoryCount, initialMessageCount, initialStoryCount, simulationSpike]);

  // Simulate Load Test Spike sequence
  const handleLoadTest = () => {
    if (simulationActive) return;
    setSimulationActive(true);
    
    // Wave 1 peak
    setSimulationSpike(35);

    setTimeout(() => {
      setSimulationSpike(68); // Wave 2 maximum
    }, 700);

    setTimeout(() => {
      setSimulationSpike(28); // Descending
    }, 1800);

    setTimeout(() => {
      setSimulationSpike(0); // Finished
      setSimulationActive(false);
    }, 2800);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div id="recharts-custom-tooltip" className="bg-[#0e0a1f] border border-purple-500/30 p-3 rounded-xl shadow-2xl text-[11px] font-sans">
          <p className="font-mono text-slate-400 font-bold mb-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Hour block: {label}</span>
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-6">
              <span className="text-purple-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Message Packets
              </span>
              <span className="font-bold font-mono text-white">{payload[0].value}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-pink-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                Story Engagement
              </span>
              <span className="font-bold font-mono text-white">{payload[1].value}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="integrated-analytics-panel" className="mt-6 pt-5 border-t border-purple-900/20 text-left">
      {/* Panel header */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-purple-400 font-mono text-[10px] uppercase tracking-widest font-bold">
            <Activity className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Active Sync Analytics (Last 24h)</span>
          </div>
          <h3 className="text-xs font-bold text-slate-200">
            Node Traffic & Ephemeral Engagement Density
          </h3>
        </div>

        {/* View mode buttons & Spike trigger */}
        <div className="flex items-center gap-1.5">
          <div className="flex bg-purple-950/40 p-0.5 rounded-lg border border-purple-900/30">
            <button
              id="analytics-toggle-area"
              onClick={() => setChartType('area')}
              className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all ${
                chartType === 'area' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Area
            </button>
            <button
              id="analytics-toggle-bar"
              onClick={() => setChartType('bar')}
              className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all ${
                chartType === 'bar' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bar
            </button>
          </div>

          <button
            id="btn-trigger-load-test"
            onClick={handleLoadTest}
            disabled={simulationActive}
            className={`p-1 px-2.5 rounded-lg border text-[9px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
              simulationActive 
                ? 'bg-purple-950/20 border-purple-500/40 text-purple-400 cursor-not-allowed' 
                : 'bg-purple-900/20 border-purple-800/40 text-purple-300 hover:bg-purple-900/40 hover:border-purple-600'
            }`}
          >
            <Zap className={`w-3 h-3 ${simulationActive ? 'animate-bounce text-pink-400' : 'text-amber-400'}`} />
            <span>{simulationActive ? 'LOAD SPIKING...' : 'SPIKE REQ'}</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div id="recharts-container" className="w-full bg-[#05020c]/40 border border-purple-950/50 p-2.5 rounded-2xl h-[155px] relative">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={hourlyData} margin={{ top: 5, right: 5, left: -25, bottom: -5 }}>
              <defs>
                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e1065" opacity={0.25} />
              <XAxis 
                dataKey="hourLabel" 
                tick={{ fill: '#94a3b8', fontSize: 8, fontFamily: 'monospace' }} 
                axisLine={{ stroke: '#4c1d95', opacity: 0.3 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 8, fontFamily: 'monospace' }} 
                axisLine={{ stroke: '#4c1d95', opacity: 0.3 }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="messages" 
                stroke="#a855f7" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorMessages)" 
                name="Messages"
              />
              <Area 
                type="monotone" 
                dataKey="engagement" 
                stroke="#f43f5e" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorEngagement)" 
                name="Engagement"
              />
            </AreaChart>
          ) : (
            <BarChart data={hourlyData} margin={{ top: 5, right: 5, left: -25, bottom: -5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e1065" opacity={0.25} />
              <XAxis 
                dataKey="hourLabel" 
                tick={{ fill: '#94a3b8', fontSize: 8, fontFamily: 'monospace' }} 
                axisLine={{ stroke: '#4c1d95', opacity: 0.3 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 8, fontFamily: 'monospace' }} 
                axisLine={{ stroke: '#4c1d95', opacity: 0.3 }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="messages" fill="#a855f7" radius={[2, 2, 0, 0]} name="Messages" />
              <Bar dataKey="engagement" fill="#f43f5e" radius={[2, 2, 0, 0]} name="Engagement" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Mini Stats Summary Footer */}
      <div className="grid grid-cols-3 gap-2.5 mt-3">
        <div className="p-2 bg-[#06030c] border border-purple-950/40 rounded-xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[8px] font-mono text-slate-400 block uppercase">Continuous Sockets</span>
            <span className="text-xs font-bold font-mono text-purple-300">4 Active Pipes</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        </div>

        <div className="p-2 bg-[#06030c] border border-purple-950/40 rounded-xl flex flex-col justify-center">
          <span className="text-[8px] font-mono text-slate-400 block uppercase">24h Message Sum</span>
          <span className="text-xs font-bold font-mono text-purple-300">
            {hourlyData.reduce((sum, item) => sum + item.messages, 0)} packets
          </span>
        </div>

        <div className="p-2 bg-[#06030c] border border-purple-950/40 rounded-xl flex flex-col justify-center font-sans">
          <span className="text-[8px] font-mono text-slate-400 block uppercase">Engagement Metric</span>
          <span className="text-xs font-bold font-mono text-pink-300">
            {hourlyData.reduce((sum, item) => sum + item.engagement, 0)} interactive
          </span>
        </div>
      </div>
    </div>
  );
}
