import { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Cpu,
  Coins,
  Shield,
  Activity,
  Zap,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  LineChart,
  DollarSign,
  Briefcase,
  AlertTriangle,
  Compass,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Sparkles,
  Lock,
  Clock,
  Terminal,
  Layers,
  Settings,
  HelpCircle,
  HelpCircle as CheckCircle2,
  ListFilter
} from 'lucide-react';

interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  high: number;
  low: number;
  history: number[];
  type: 'crypto' | 'forex' | 'idx' | 'commodity';
  iconColor: string;
}

interface OrderBookItem {
  price: number;
  size: number;
  total: number;
}

export default function InvestAI({ searchText, onExport }: { searchText: string; onExport?: (format: 'pdf' | 'csv' | 'xlsx', module: string, data: any) => void }) {
  // Navigation internal tabs
  const [activeTab, setActiveTab] = useState<'hub' | 'trading' | 'crypto' | 'forex' | 'portfolio' | 'bot' | 'strategies' | 'risk' | 'quant' | 'simulations'>('hub');
  
  // Real-time assets simulation data state
  const [assets, setAssets] = useState<Asset[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: 365280.40, change: 4.82, high: 368900, low: 348100, history: [348, 350, 349, 354, 358, 362, 365], type: 'crypto', iconColor: 'text-amber-500' },
    { symbol: 'ETH', name: 'Ethereum', price: 18450.15, change: 3.15, high: 18700, low: 17900, history: [17.9, 18.0, 18.2, 18.1, 18.3, 18.5, 18.45], type: 'crypto', iconColor: 'text-indigo-400' },
    { symbol: 'SOL', name: 'Solana', price: 835.60, change: 8.75, high: 845, low: 760, history: [76, 78, 81, 79, 82, 84, 83.5], type: 'crypto', iconColor: 'text-purple-400' },
    { symbol: 'BNB', name: 'BNB Chain', price: 3240.20, change: -1.24, high: 3310, low: 3200, history: [3.3, 3.28, 3.29, 3.25, 3.22, 3.26, 3.24], type: 'crypto', iconColor: 'text-yellow-500' },
    { symbol: 'XRP', name: 'Ripple', price: 3.12, change: 1.05, high: 3.22, low: 3.05, history: [3.05, 3.08, 3.1, 3.09, 3.12, 3.11, 3.12], type: 'crypto', iconColor: 'text-cyan-400' },
    { symbol: 'USD/BRL', name: 'Dólar Comercial', price: 5.1420, change: -0.38, high: 5.18, low: 5.12, history: [5.18, 5.17, 5.16, 5.15, 5.14, 5.15, 5.142], type: 'forex', iconColor: 'text-emerald-400' },
    { symbol: 'EUR/BRL', name: 'Euro', price: 5.5680, change: 0.12, high: 5.61, low: 5.54, history: [5.55, 5.56, 5.57, 5.55, 5.58, 5.56, 5.568], type: 'forex', iconColor: 'text-sky-450' },
    { symbol: 'XAU/USD', name: 'Ouro Terrestre t.oz', price: 12245.50, change: 1.84, high: 12280, low: 12010, history: [120, 121, 121.5, 120.8, 122, 122.3, 122.45], type: 'commodity', iconColor: 'text-yellow-600' },
    { symbol: 'NASDAQ', name: 'Nasdaq 100 Index', price: 18780.00, change: 1.45, high: 18910, low: 18540, history: [185, 186, 185.8, 186.5, 187.2, 187.5, 187.8], type: 'idx', iconColor: 'text-red-400' },
    { symbol: 'S&P500', name: 'Standard & Poor\'s 500', price: 5240.25, change: 0.92, high: 5265, low: 5190, history: [51.9, 52.1, 52.0, 52.2, 52.4, 52.3, 52.4], type: 'idx', iconColor: 'text-blue-500' },
  ]);

  // Order Book Dynamic Simulation (Standard bid & ask)
  const [bids, setBids] = useState<OrderBookItem[]>([
    { price: 365280, size: 0.42, total: 0.42 },
    { price: 365250, size: 1.15, total: 1.57 },
    { price: 365200, size: 2.84, total: 4.41 },
    { price: 365150, size: 3.50, total: 7.91 },
    { price: 365050, size: 12.45, total: 20.36 },
  ]);
  const [asks, setAsks] = useState<OrderBookItem[]>([
    { price: 365315, size: 0.85, total: 0.85 },
    { price: 365340, size: 1.40, total: 2.25 },
    { price: 365390, size: 4.22, total: 6.47 },
    { price: 365450, size: 1.80, total: 8.27 },
    { price: 365550, size: 18.20, total: 26.47 },
  ]);

  // Simulated Trading State
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeAmount, setTradeAmount] = useState<number>(0.1);
  const [tradeStatus, setTradeStatus] = useState<string>('');
  
  // Real-time market logs feed
  const [marketLogs, setMarketLogs] = useState<string[]>([
    '🏦 [CONTRATO QUANT] XP Corretora de Valores alocou R$ 14.2M em fundos de derivativos de Ouro.',
    '🤖 [IA ADVISOR] Padrão "Bullish Golden Cross" detectado no intervalo de 15m do Solana (SOL).',
    '⚠️ [RISK ALERT] Volatilidade na Bloomberg do Euro devido a discursos de autoridades bancárias.',
    '💥 [SINAL QUANT] Grande liquidação de posições short identificada em R$ 365.100 para o Par BTC/BRL.',
  ]);

  // AI suggestions state
  const [aiInsights, setAiInsights] = useState([
    { id: 1, title: 'Rompimento Iminente de Resistência', asset: 'BTC', insight: 'BTC testando os R$ 368K. Volume comprador subindo 12% acima da média móvel semanal de mercado.', action: 'Compra Parcial sugerida', confidence: 94, status: 'Ativo' },
    { id: 2, title: 'Força Relativa Extrema (Overbought)', asset: 'SOL', insight: 'Solana (SOL) atingiu índice RSI de 78%. Risco técnico temporário de retração corretiva saudável.', action: 'Aguardar Retração', confidence: 88, status: 'Alerta' },
    { id: 3, title: 'Reações Macro de S&P500', asset: 'S&P500', insight: 'S&P500 acumulando liquidez de ordens acima de 5.250 pontos. Rebalanceamento de derivativos institucional previsto.', action: 'Manter Alocação Fixa', confidence: 91, status: 'Estável' },
    { id: 4, title: 'Breakout de Padrão Triângulo', asset: 'ETH', insight: 'ETH saindo da acumulação triangular de 4 horas. Projeção técnica de R$ 19.100 nas próximas 72 horas.', action: 'Compra Recomendada', confidence: 85, status: 'Ativo' },
  ]);

  // Visual Strategy Builder Editor State
  const [strategyRules, setStrategyRules] = useState([
    { id: 'rule-1', signal: 'Preço BTC', condition: '>', value: '370000', action: 'Venda de Realocação', amount: '15%', active: true },
    { id: 'rule-2', signal: 'RSI Ethereum', condition: '<', value: '30', action: 'Compra Automática', amount: '5000', active: true },
    { id: 'rule-3', signal: 'Nasdaq 100 Volatilidade', condition: '==', value: 'Alta', action: 'Stop Loss Emergência', amount: 'Todos', active: false },
  ]);
  const [newRuleSignal, setNewRuleSignal] = useState('Preço SOL');
  const [newRuleCondition, setNewRuleCondition] = useState('>');
  const [newRuleValue, setNewRuleValue] = useState('850');
  const [newRuleAction, setNewRuleAction] = useState('Compra Automática');
  const [newRuleAmount, setNewRuleAmount] = useState('1000');

  // Backtesting simulator outputs
  const [backtestLogs, setBacktestLogs] = useState<string[]>([]);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResults, setBacktestResults] = useState<{
    roi: number;
    trades: number;
    winRate: number;
    profit: number;
  } | null>(null);

  // User simulated portfolio allocations
  const [portfolio, setPortfolio] = useState({
    balanceBrl: 1547805.00,
    lockedBrl: 450000.00,
    holdings: [
      { name: 'Bitcoin', symbol: 'BTC', qty: 2.15, avgPrice: 345000, color: 'bg-amber-500' },
      { name: 'Ethereum', symbol: 'ETH', qty: 15.00, avgPrice: 17200, color: 'bg-indigo-500' },
      { name: 'Solana', symbol: 'SOL', qty: 120.00, avgPrice: 790, color: 'bg-purple-500' },
      { name: 'Nasdaq Inst.', symbol: 'NASDAQ', qty: 5.00, avgPrice: 18100, color: 'bg-red-500' },
    ]
  });

  // Future Integrations credentials array (Binance, XP, Coinbase, MetaTrader etc)
  const [integrations, setIntegrations] = useState([
    { id: 'binance', name: 'Binance Global Pro', status: 'ready', apikey: 'bin_••••••••••••••••34a1', type: 'Crypto' },
    { id: 'xp', name: 'XP Investimentos Corporate', status: 'ready', apikey: 'xp_••••••••••••••••89b2', type: 'Ações & Fundos' },
    { id: 'metatrader', name: 'MetaTrader 5 Engine', status: 'disconnected', apikey: '', type: 'Forex & CFD' },
    { id: 'int_brokers', name: 'Interactive Brokers S.A', status: 'ready', apikey: 'ib_••••••••••••••••55ff', type: 'Global Treasury' },
    { id: 'bybit', name: 'Bybit Institutional', status: 'disconnected', apikey: '', type: 'Crypto Derivativos' },
  ]);

  // Simulated live prices updating
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate prices realistically
      setAssets(prevAssets =>
        prevAssets.map(asset => {
          const rng = (Math.random() - 0.49) * 0.008; // small change
          const newPrice = asset.price * (1 + rng);
          const priceDiff = newPrice - asset.price;
          const percentageChange = asset.change + (rng * 100);
          
          // Keep a short list for mini history
          const newHistory = [...asset.history.slice(1), parseFloat((newPrice / (asset.type === 'crypto' && asset.symbol !== 'SOL' ? 1000 : 1)).toFixed(1))];

          return {
            ...asset,
            price: parseFloat(newPrice.toFixed(asset.type === 'forex' ? 4 : 2)),
            change: parseFloat(percentageChange.toFixed(2)),
            high: Math.max(asset.high, newPrice),
            low: Math.min(asset.low, newPrice),
            history: newHistory,
          };
        })
      );

      // Fluctuate Order Book
      setBids(prevBids => 
        prevBids.map((bid, i) => {
          const randVariation = (Math.random() - 0.5) * 5;
          const newPrice = Math.round(bid.price + randVariation);
          const newSize = Math.max(0.01, parseFloat((bid.size + (Math.random() - 0.5) * 0.15).toFixed(2)));
          return { ...bid, price: newPrice, size: newSize };
        })
      );

      setAsks(prevAsks => 
        prevAsks.map((ask, i) => {
          const randVariation = (Math.random() - 0.5) * 5;
          const newPrice = Math.round(ask.price + randVariation);
          const newSize = Math.max(0.01, parseFloat((ask.size + (Math.random() - 0.5) * 0.15).toFixed(2)));
          return { ...ask, price: newPrice, size: newSize };
        })
      );
      
      // Randomly append technical market logs
      if (Math.random() > 0.70) {
        const events = [
          `💡 [REGISTRO QUANT] Sinais de alta de RSI identificados em ${['BTC', 'ETH', 'SOL'][Math.floor(Math.random() * 3)]}.`,
          `🔒 [SEGURANÇA CORPORATIVA] Chaves de API das corretoras auditadas redundantes com sucesso.`,
          `📊 [ALGORITMO ALADDIN] Testes Monte Carlo de estresse de liquidez indicam estabilidade de caixa corporativo de 99.4%.`,
          `🌐 [SUGESTÃO DA IA] Posições em Forex rebalanceadas conforme mudança na volatilidade global de commodities.`,
          `💰 [TESOURARIA EXECUTIVA] Robô de Hedge executou compra simulada automatizada programada com sucesso.`
        ];
        const newEvent = events[Math.floor(Math.random() * events.length)];
        setMarketLogs(prev => [newEvent, ...prev.slice(0, 10)]);
      }

    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Set default asset object helper
  const activeAssetObj = assets.find(a => a.symbol === selectedAsset) || assets[0];

  // Execute buy or sell order simulation
  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (tradeAmount <= 0) {
      setTradeStatus('Insira uma quantidade de ativo válida.');
      return;
    }

    const price = activeAssetObj.price;
    const totalCost = price * tradeAmount;

    if (tradeType === 'BUY') {
      if (portfolio.balanceBrl < totalCost) {
        setTradeStatus('❌ Erro: Saldo corporativo liquido insuficiente.');
        return;
      }

      setPortfolio(prev => {
        const currentHolding = prev.holdings.find(h => h.symbol === selectedAsset);
        let newHoldings;
        if (currentHolding) {
          newHoldings = prev.holdings.map(h => 
            h.symbol === selectedAsset 
              ? { ...h, qty: h.qty + tradeAmount, avgPrice: ((h.avgPrice * h.qty) + totalCost) / (h.qty + tradeAmount) }
              : h
          );
        } else {
          newHoldings = [...prev.holdings, {
            name: activeAssetObj.name,
            symbol: selectedAsset,
            qty: tradeAmount,
            avgPrice: price,
            color: 'bg-cyan-500'
          }];
        }
        return {
          ...prev,
          balanceBrl: prev.balanceBrl - totalCost,
          holdings: newHoldings
        };
      });

      const orderLog = `🤖 [TRADING CENTER] Compra executada: ${tradeAmount} ${selectedAsset} a R$ ${price.toLocaleString('pt-BR')} (Total: R$ ${totalCost.toLocaleString('pt-BR')})`;
      setMarketLogs(prev => [orderLog, ...prev]);
      setTradeStatus(`✅ Sucesso: Compra de ${tradeAmount} ${selectedAsset} processada pela AI-Hedge.`);
    } else {
      // SELL
      const currentHolding = portfolio.holdings.find(h => h.symbol === selectedAsset);
      if (!currentHolding || currentHolding.qty < tradeAmount) {
        setTradeStatus(`❌ Erro: Quantidade de ${selectedAsset} em holding insuficiente.`);
        return;
      }

      setPortfolio(prev => {
        const newHoldings = prev.holdings.map(h => 
          h.symbol === selectedAsset 
            ? { ...h, qty: h.qty - tradeAmount }
            : h
        ).filter(h => h.qty > 0);

        return {
          ...prev,
          balanceBrl: prev.balanceBrl + totalCost,
          holdings: newHoldings
        };
      });

      const orderLog = `🤖 [TRADING CENTER] Venda executada: ${tradeAmount} ${selectedAsset} a R$ ${price.toLocaleString('pt-BR')} (Recebido: R$ ${totalCost.toLocaleString('pt-BR')})`;
      setMarketLogs(prev => [orderLog, ...prev]);
      setTradeStatus(`✅ Sucesso: Venda de ${tradeAmount} ${selectedAsset} processada pela AI-Hedge.`);
    }

    // Reset feedback after some seconds
    setTimeout(() => setTradeStatus(''), 5050);
  };

  // Add rule in Visual Editor
  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule = {
      id: `rule-${Date.now()}`,
      signal: newRuleSignal,
      condition: newRuleCondition,
      value: newRuleValue,
      action: newRuleAction,
      amount: newRuleAmount,
      active: true,
    };
    setStrategyRules(prev => [...prev, newRule]);
  };

  // Delete a Strategy Rule
  const handleDeleteRule = (id: string) => {
    setStrategyRules(prev => prev.filter(r => r.id !== id));
  };

  const handleToggleRule = (id: string) => {
    setStrategyRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  // Run Strategy Backtesting Simulator
  const runStrategyBacktest = () => {
    setIsBacktesting(true);
    setBacktestLogs([
      '[19:02:11] 🚀 INICIANDO MÁQUINA VIRTUAL QUANT: Backtesting Estratégias...',
      '[19:02:11] ⚙️ Carregando histórico refinado Bloomberg Terminals (últimos 30 dias)...',
      '[19:02:12] 🔍 Analisando gatilhos e regras ativas da mesa...',
      '[19:02:12] 📊 Comparando performance com Benchmark CDI + Selic + Bitcoin spot...',
    ]);

    setTimeout(() => {
      setBacktestLogs(prev => [
        ...prev,
        '[19:02:13] 🕒 Processado: 1.482 ticks corporativos de mercado mapeados.',
        '[19:02:13] 📈 Sucesso: Sinais cruzados geraram 21 recompras de liquidez corporativa rápida.',
        '[19:02:14] ✅ FINISHED: Processo encerrado sem erros de corretora ou re-quotes.'
      ]);
      setBacktestResults({
        roi: 18.72,
        trades: 24,
        winRate: 83.3,
        profit: 289450.00
      });
      setIsBacktesting(false);
    }, 2800);
  };

  return (
    <div id="titanx-invest-ai-module" className="space-y-6">
      
      {/* HEADER BANNER DESIGN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-[#00E5FF]/20 via-purple-650/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00E5FF] via-purple-505 to-transparent opacity-40" />

        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full text-[9px] font-mono font-black uppercase text-cyan-450 bg-cyan-950/40 border border-cyan-500/25 animate-pulse flex items-center gap-1.5">
              <Zap size={10} className="text-cyan-450 animate-bounce" /> ALIVE HEDGE PLATFORM
            </span>
            <span className="p-1 px-2 text-[9px] font-mono text-purple-300 bg-purple-950/40 border border-purple-500/10 rounded-full">
              SECURE CRYPTO-SANDBOX
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase font-sans">
            TitanX <span className="text-[#00E5FF] glow-cyan">Invest AI</span> S/A
          </h1>
          <p className="text-xs text-slate-400 max-w-xl font-medium">
            Terminal executivo de alta performance de mesa quant proprietária corporativa. Análise preditiva profunda, robôs algoritmos de alta fidelidade e arbitragem multimoedas em tempo real.
          </p>
        </div>

        {/* METRIC WRAPPERS */}
        <div className="flex flex-wrap items-center gap-4 z-10 self-start md:self-auto">
          <div className="p-3.5 bg-slate-950/50 border border-slate-850 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-cyan-550/10 text-cyan-400 rounded-xl border border-cyan-500/10 shadow-[0_0_10px_rgba(0,229,255,0.1)]">
              <DollarSign size={16} />
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase block font-black leading-none">Capital Projetado</span>
              <span className="font-mono text-sm font-black text-white leading-none">R$ {(portfolio.balanceBrl + portfolio.lockedBrl).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/50 border border-slate-850 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-emerald-555/10 text-emerald-400 rounded-xl border border-emerald-500/10">
              <TrendingUp size={16} />
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase block font-black leading-none">ROI Alpha Realizado</span>
              <span className="font-mono text-sm font-bold text-emerald-400 leading-none">+12.84% <span className="text-[9px] font-mono font-medium text-slate-400">(A/M)</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERNAL NAVIGATION TABS */}
      <div className="flex overflow-x-auto gap-2 bg-slate-950/40 p-1.5 rounded-2xl border border-slate-850 scrollbar-none">
        {[
          { id: 'hub', label: 'Terminal Hub', icon: Compass },
          { id: 'trading', label: 'Trading Center', icon: Zap },
          { id: 'crypto', label: 'Crypto Monitor', icon: Coins },
          { id: 'forex', label: 'Forex & Índices', icon: LineChart },
          { id: 'portfolio', label: 'Carteira Alocada', icon: Briefcase },
          { id: 'bot', label: 'AI Bots Ativos', icon: Cpu },
          { id: 'strategies', label: 'Estratégias Visual', icon: Layers },
          { id: 'risk', label: 'Risco & Volatilidade', icon: AlertTriangle },
          { id: 'quant', label: 'Central Quant', icon: Activity },
          { id: 'simulations', label: 'Simulações Monte Carlo', icon: RotateCcw }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? 'bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-[#00E5FF] font-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_0_10px_rgba(0,229,255,0.05)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50 border border-transparent'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#00E5FF]' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* NOT FILTER SEARCH FOUND MATCH HELPER */}
      {searchText && (
        <div className="bg-cyan-950/10 border border-[#00E5FF]/15 p-3 rounded-xl text-xs text-sky-300">
          Resultados filtrados corporativos por: <strong>"{searchText}"</strong>
        </div>
      )}

      {/* RENDER ACTIVE TAB */}
      <div className="min-h-[500px]">
        {activeTab === 'hub' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* COLUMN 1: LIVE INVESTMENTS MONITOR HUB STATUS */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* ASSETS TICKERS TICKING GRIDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.slice(0, 6).map(asset => {
                  const isUp = asset.change >= 0;
                  return (
                    <div 
                      key={asset.symbol}
                      onClick={() => {
                        setSelectedAsset(asset.symbol);
                        setActiveTab('trading');
                      }}
                      className="glass-card p-4 rounded-2xl hover:border-[#00E5FF]/40 hover:scale-[1.02] cursor-pointer transition-all duration-300 group relative"
                    >
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00E5FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white group-hover:text-[#00E5FF] transition-colors">{asset.symbol}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-lg flex items-center gap-1 ${isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {isUp ? '+' : ''}{asset.change.toFixed(2)}%
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <span className="text-[10px] font-mono text-slate-500 font-medium block">{asset.name}</span>
                        <span className="font-mono text-base font-black text-white">
                          {asset.type === 'forex' ? '' : 'R$ '}{asset.price.toLocaleString('pt-BR', { minimumFractionDigits: asset.type === 'forex' ? 4 : 2 })}
                        </span>
                      </div>

                      {/* MICRO MINI VECTOR CANVAS GLOW GRAPH CHART */}
                      <div className="h-8 mt-3 overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <polyline
                            fill="none"
                            stroke={isUp ? '#10b981' : '#f43f5e'}
                            strokeWidth="1.5"
                            points={asset.history.map((val, idx) => `${(idx / (asset.history.length - 1)) * 100},${30 - ((val - Math.min(...asset.history)) / (Math.max(...asset.history) - Math.min(...asset.history) || 1)) * 25 - 2.5}`).join(' ')}
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INTEGRATIONS AND CAPABILITY BRIDGES */}
              <div className="glass-card p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-sidebar-800 pb-3">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Layers size={14} className="text-[#00E5FF]" /> Chaves de Corretoras & Portais de Investimento
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      Integração simulada e estrutura de contingência de conexões de fundos corporativos.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-0.5">
                    HEDGE COFRE CONECTADO
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {integrations.map(int => (
                    <div key={int.id} className="p-3 bg-slate-950/60 border border-slate-850/80 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{int.name}</span>
                          <span className="text-[8px] font-mono bg-slate-800 px-1 text-slate-400 rounded uppercase">{int.type}</span>
                        </div>
                        <span className="font-mono text-[9px] text-slate-500 block">
                          {int.status === 'ready' ? int.apikey : 'Parâmetros desativados'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${int.status === 'ready' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`} />
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {int.status === 'ready' ? 'Acoplado' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AUTOMATION TRIGGERS HUB RUN LIST MAP */}
              <div className="glass-card p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-sidebar-800 pb-3">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Activity size={14} className="text-purple-400" /> Gatilhos Ativos de Automação de Câmbio e Criptoativos
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveTab('strategies')} 
                    className="text-[10px] font-bold text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Editar Estratégia Visual <ChevronRight size={12} />
                  </button>
                </div>

                <div className="space-y-2">
                  {strategyRules.map(rule => (
                    <div key={rule.id} className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${rule.active ? 'bg-[#00E5FF] animate-pulse shadow-[0_0_10px_#00E5FF]' : 'bg-slate-700'}`} />
                        <div>
                          <p className="text-xs font-bold text-white flex items-center gap-2">
                            <span>IF {rule.signal} {rule.condition} {rule.value}</span>
                            <span className="text-slate-500 uppercase text-[9px] font-mono">{"=>"}</span>
                            <span className="text-cyan-400">{rule.action} ({rule.amount})</span>
                          </p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded ${rule.active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/10' : 'bg-slate-800 text-slate-400'}`}>
                        {rule.active ? 'Monitorando Ticks' : 'Desativado'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* COLUMN 2: INVEST AI COPILOT & LOGS */}
            <div className="space-y-6">
              
              {/* TITANX CORE-AI INVEST PANEL */}
              <div className="glass-card p-5 rounded-3xl space-y-4 relative overflow-hidden flex flex-col justify-between border-[#00E5FF]/20">
                <div className="absolute top-0 right-0 h-28 w-28 bg-gradient-to-br from-cyan-500/20 to-purple-600/10 blur-xl rounded-full" />
                
                <div className="space-y-3 z-10">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Sparkles size={16} className="animate-spin text-purple-400 duration-1000" />
                    <h4 className="text-xs font-black tracking-widest uppercase text-white font-mono flex items-center gap-1">
                      TITANX AI INVEST <span className="text-purple-400">PRO-ADVISOR</span>
                    </h4>
                  </div>

                  <p className="text-xs text-slate-350 leading-relaxed font-medium">
                    "O mercado global está apresentando sinais fortes de volatilidade sobre derivativos cambiais. Nossa mesa quant recomenda o rebalanceamento preventivo do Ouro para manter hegemonia patrimonial interna."
                  </p>

                  <div className="space-y-2 border-t border-slate-900 pt-3">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-wider block">OPORTUNIDADES DE IA ATIVAS:</span>
                    {aiInsights.slice(0, 3).map(insight => (
                      <div key={insight.id} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-900 flex items-start gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${insight.status === 'Ativo' ? 'bg-cyan-400' : 'bg-amber-400'}`} />
                        <div className="text-[11px]">
                          <p className="font-bold text-white flex items-center justify-between">
                            <span>{insight.title} ({insight.asset})</span>
                            <span className="font-mono text-[#00E5FF] text-[9px]">{insight.confidence}% Confiança</span>
                          </p>
                          <p className="text-slate-400 text-[10px] mt-0.5 leading-tight">{insight.insight}</p>
                          <span className="text-[9px] font-mono text-cyan-400 mt-1 block">{insight.action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-900 z-10">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Sensibilidade Algorítmica</span>
                    <span className="text-[#00E5FF] font-mono font-bold">Máxima (Hedge)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full w-[88%] rounded-full shadow-[0_0_10px_#00E5FF]" />
                  </div>
                </div>
              </div>

              {/* REALTIME SYSTEM EVENT LOGS */}
              <div className="glass-card p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2">
                  <Terminal size={14} className="text-cyan-400" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Mesa de Operações Feed</h4>
                </div>

                <div id="logs-container" className="h-56 overflow-y-auto space-y-2 pr-1 font-mono text-[9px]">
                  {marketLogs.map((log, index) => (
                    <div key={index} className="p-2 bg-slate-950/50 rounded-lg text-slate-350 border border-slate-850/40 hover:border-slate-800 transition-colors">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[8px] mb-0.5">
                        <Clock size={8} />
                        <span>Agora mesmo</span>
                      </div>
                      <p className="leading-relaxed">{log}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: TRADING CENTER CANDLESTICKS ORDERBOOK */}
        {activeTab === 'trading' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            
            {/* MAIN CHART SCREEN COLSPAN 3 */}
            <div className="xl:col-span-3 space-y-6">
              
              {/* TICKER BRIEF HEADER STATS */}
              <div className="glass-card p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center font-black border border-[#00E5FF]/20 shadow-[0_0_10px_rgba(0,229,255,0.15)]">
                    {activeAssetObj.symbol}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">{activeAssetObj.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">Ativo Comercial Ativo</span>
                  </div>
                </div>

                <div className="font-mono text-right flex gap-6">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block font-black">Preço Atual</span>
                    <span className="text-base font-black text-white">{activeAssetObj.type === 'forex' ? '' : 'R$ '}{activeAssetObj.price.toLocaleString('pt-BR', { minimumFractionDigits: activeAssetObj.type === 'forex' ? 4 : 2 })}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block font-black">Máxima (24H)</span>
                    <span className="text-xs font-bold text-slate-300">R$ {activeAssetObj.high.toLocaleString('pt-BR')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block font-black">Mínima (24H)</span>
                    <span className="text-xs font-bold text-slate-350">R$ {activeAssetObj.low.toLocaleString('pt-BR')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block font-black">Variação</span>
                    <span className={`text-xs font-black ${activeAssetObj.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{activeAssetObj.change >= 0 ? '+' : ''}{activeAssetObj.change.toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              {/* CANDLESTICK CHART REALTIME FLUIDITY */}
              <div className="glass-card p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-sidebar-850 pb-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <LineChart size={14} className="text-[#00E5FF]" /> Gráfico de Candlestick Dinâmico & Book de Arbitragem
                  </h4>
                  <div className="flex gap-2">
                    <span className="p-1 px-2.5 rounded font-mono text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/10">PERÍODO LIVE</span>
                    <span className="p-1 px-2.5 rounded font-mono text-[9px] text-slate-500 bg-slate-900 border border-slate-800">1m INTERVAL</span>
                  </div>
                </div>

                {/* GRAPHIC AREA CONTAINER */}
                <div className="relative h-64 w-full bg-slate-950/60 rounded-xl border border-slate-900/80 flex flex-col justify-between p-4 overflow-hidden">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                  
                  {/* Glowing custom SVG mockup candlestick flow */}
                  <div className="flex-1 flex items-end justify-between px-6 py-4">
                    {[
                      { o: 80, c: 92, h: 96, l: 75, up: true },
                      { o: 92, c: 85, h: 95, l: 80, up: false },
                      { o: 85, c: 98, h: 104, l: 82, up: true },
                      { o: 98, c: 110, h: 115, l: 94, up: true },
                      { o: 110, c: 102, h: 112, l: 99, up: false },
                      { o: 102, c: 118, h: 122, l: 100, up: true },
                      { o: 118, c: 124, h: 128, l: 115, up: true },
                      { o: 124, c: 121, h: 126, l: 119, up: false },
                      { o: 121, c: 135, h: 140, l: 118, up: true },
                      { o: 135, c: 139, h: 144, l: 132, up: true },
                      { o: 139, c: 148, h: 152, l: 137, up: true },
                    ].map((candle, idx) => (
                      <div key={idx} className="flex flex-col items-center flex-1 max-w-[20px] relative h-full justify-end">
                        <div className={`w-[2px] absolute hover:scale-x-2 transition-all`} style={{
                          height: `${(candle.h - candle.l) * 1.4}px`,
                          bottom: `${candle.l * 1.2}px`,
                          backgroundColor: candle.up ? '#10b981' : '#ef4444'
                        }} />
                        <div className={`w-[10px] rounded-sm absolute hover:scale-110 transition-all`} style={{
                          height: `${Math.abs(candle.c - candle.o) * 1.4}px`,
                          bottom: `${Math.min(candle.o, candle.c) * 1.2}px`,
                          backgroundColor: candle.up ? 'rgba(16, 185, 129, 0.45)' : 'rgba(239, 68, 68, 0.45)',
                          border: `1px solid ${candle.up ? '#10b981' : '#ef4444'}`
                        }} />
                      </div>
                    ))}
                  </div>

                  {/* BOTTOM INFO CHART BAR */}
                  <div className="border-t border-slate-900 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-500 z-10">
                    <span>Preços expressos indexados em mercado local corporativo BRL</span>
                    <span>Feed: TradingView Pro Live Feed</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ORDER BOOK & MANUAL INVESTMENT FORM */}
            <div className="space-y-6">
              
              {/* TRADING SIMULATOR ACTION BOX */}
              <div className="glass-card p-5 rounded-3xl space-y-4">
                <div className="flex border-b border-slate-900 pb-3 text-xs font-bold gap-3">
                  <button 
                    onClick={() => setTradeType('BUY')}
                    className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer transition-colors ${tradeType === 'BUY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black' : 'text-slate-400 hover:text-white'}`}
                  >
                    COMPRA (LONG)
                  </button>
                  <button 
                    onClick={() => setTradeType('SELL')}
                    className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer transition-colors ${tradeType === 'SELL' ? 'bg-rose-500/20 text-rose-450 border border-rose-500/30 font-black' : 'text-slate-400 hover:text-white'}`}
                  >
                    VENDA (SHORT)
                  </button>
                </div>

                <form onSubmit={handleExecuteTrade} className="space-y-3.5">
                  <div>
                    <label className="text-[9px] font-mono text-slate-500 uppercase font-black tracking-wider block mb-1">Escolher Ativo</label>
                    <select 
                      value={selectedAsset}
                      onChange={(e) => setSelectedAsset(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#00E5FF]/40"
                    >
                      {assets.map(a => (
                        <option key={a.symbol} value={a.symbol}>{a.symbol} - {a.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-slate-500 uppercase font-black tracking-wider block mb-1">Montante do Lançamento</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.01"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#00E5FF]/40 font-mono"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono font-bold">
                        {selectedAsset}
                      </span>
                    </div>
                  </div>

                  {/* SIMULATED SLIDER VALUES QUICK SELECT */}
                  <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[9px] text-slate-400">
                    {[0.1, 0.5, 1, 2].map(v => (
                      <button 
                        key={v}
                        type="button" 
                        onClick={() => setTradeAmount(v)}
                        className="p-1 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 hover:text-white cursor-pointer"
                      >
                        {v}x
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-900 font-mono text-[10px] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Preço Estimativo</span>
                      <span className="text-slate-350">R$ {activeAssetObj.price.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Despesa Prevista</span>
                      <span className="font-extrabold text-white">R$ {(activeAssetObj.price * tradeAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-900 pt-1.5 mt-1">
                      <span className="text-slate-500">Disponível em Caixa</span>
                      <span className="text-emerald-450 font-bold">R$ {portfolio.balanceBrl.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-xl text-xs font-black tracking-wider cursor-pointer transition-all ${
                      tradeType === 'BUY'
                        ? 'bg-emerald-500 hover:bg-emerald-450 text-slate-950 shadow-[0_4px_20px_rgba(16,185,129,0.35)]'
                        : 'bg-rose-500 hover:bg-rose-450 text-white shadow-[0_4px_20px_rgba(244,63,94,0.35)]'
                    }`}
                  >
                    CONFIRMAR ORDEM {tradeType === 'BUY' ? 'COMPRA' : 'VENDA'}
                  </button>

                  {tradeStatus && (
                    <p className="text-[10px] text-center font-mono font-bold text-sky-400 mt-2 bg-slate-950/80 p-2 rounded-lg border border-slate-900">
                      {tradeStatus}
                    </p>
                  )}
                </form>
              </div>

              {/* BOOK DE OFERTAS SIMULADO */}
              <div className="glass-card p-4 rounded-2xl space-y-3 font-mono text-[10px]">
                <div className="flex items-center justify-between border-b border-slate-950 pb-2">
                  <span className="font-bold text-slate-400 flex items-center gap-1">
                    <Layers size={12} className="text-sky-400" /> Book Ativo de Ordens
                  </span>
                  <span className="text-[8px] text-[#00E5FF]">Sinal 100ms</span>
                </div>

                <div className="space-y-4">
                  {/* ASKS (RED) -> SELLS */}
                  <div className="space-y-1">
                    <span className="text-[8px] text-rose-500 font-extrabold uppercase tracking-wide">Ofertas de Venda (Asks)</span>
                    <div className="space-y-0.5">
                      {asks.map((ask, i) => (
                        <div key={i} className="flex justify-between items-center text-rose-400">
                          <span>R$ {ask.price.toLocaleString()}</span>
                          <span className="text-slate-400">{ask.size} <span className="text-[8px] text-slate-600">QTY</span></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SPREAD INDICATOR */}
                  <div className="border-y border-slate-900 py-1.5 text-center text-[10px] text-slate-400 font-bold bg-slate-950/20">
                    Spread Médio: <span className="text-[#00E5FF]">R$ 35,00</span>
                  </div>

                  {/* BIDS (GREEN) -> BUYS */}
                  <div className="space-y-1">
                    <span className="text-[8px] text-emerald-500 font-extrabold uppercase tracking-wide">Ofertas de Compra (Bids)</span>
                    <div className="space-y-0.5">
                      {bids.map((bid, i) => (
                        <div key={i} className="flex justify-between items-center text-emerald-400">
                          <span>R$ {bid.price.toLocaleString()}</span>
                          <span className="text-slate-400">{bid.size} <span className="text-[8px] text-slate-600">QTY</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: CRYPTO MONITOR */}
        {activeTab === 'crypto' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {assets.filter(a => a.type === 'crypto').map(coin => {
                const isPositive = coin.change >= 0;
                return (
                  <div key={coin.symbol} className="glass-card p-5 rounded-3xl relative group overflow-hidden">
                    <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-indigo-500/10 to-transparent blur-xl rounded-full" />
                    
                    <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                      <div className="flex items-center gap-2">
                        <span className={`h-8 w-8 rounded-lg bg-slate-950 flex items-center justify-center font-black ${coin.iconColor}`}>
                          {coin.symbol.charAt(0)}
                        </span>
                        <div>
                          <h4 className="text-xs font-black text-white">{coin.name}</h4>
                          <span className="text-[8.5px] font-mono text-slate-500 uppercase">{coin.symbol} / BRL</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-450'}`}>
                        {isPositive ? '+' : ''}{coin.change}%
                      </span>
                    </div>

                    <div className="mt-4 font-mono">
                      <span className="text-[9px] text-slate-500 block uppercase font-black">Preço de Fechamento</span>
                      <span className="text-xl font-black text-white">R$ {coin.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-mono border-t border-slate-900 pt-3">
                      <div>
                        <span className="text-slate-500 block">Teto de Alta</span>
                        <span className="text-slate-350">R$ {coin.high.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Piso de Baixa</span>
                        <span className="text-slate-350">R$ {coin.low.toLocaleString()}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedAsset(coin.symbol);
                        setActiveTab('trading');
                      }}
                      className="w-full mt-4 py-2.5 rounded-xl border border-[#00E5FF]/20 bg-slate-950/20 hover:bg-[#00E5FF]/10 text-xs font-bold text-white transition-all cursor-pointer text-center block"
                    >
                      Acessar Livro de Ofertas
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: FOREX & INDEX MONITOR */}
        {activeTab === 'forex' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {assets.filter(a => a.type === 'forex' || a.type === 'idx' || a.type === 'commodity').map(asset => {
                const isPositive = asset.change >= 0;
                return (
                  <div key={asset.symbol} className="glass-card p-5 rounded-3xl relative group overflow-hidden">
                    <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-[#00E5FF]/10 to-transparent blur-xl rounded-full" />
                    
                    <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                      <div className="flex items-center gap-2">
                        <span className={`h-8 w-8 rounded-lg bg-slate-950 flex items-center justify-center font-black ${asset.iconColor}`}>
                          {asset.symbol.split('/')[0].substring(0, 2)}
                        </span>
                        <div>
                          <h4 className="text-xs font-black text-white">{asset.name}</h4>
                          <span className="text-[8.5px] font-mono text-slate-400">{asset.symbol}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-450'}`}>
                        {isPositive ? '+' : ''}{asset.change}%
                      </span>
                    </div>

                    <div className="mt-4 font-mono">
                      <span className="text-[9px] text-slate-500 block uppercase font-black">Preço de Mesa</span>
                      <span className="text-xl font-black text-white">
                        {asset.type === 'forex' ? '' : 'R$ '}{asset.price.toLocaleString('pt-BR', { minimumFractionDigits: asset.type === 'forex' ? 4 : 2 })}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-mono border-t border-slate-900 pt-3">
                      <div>
                        <span className="text-slate-500 block">Máximo</span>
                        <span className="text-slate-350">R$ {asset.high.toLocaleString('pt-BR')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Mínimo</span>
                        <span className="text-slate-350">R$ {asset.low.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedAsset(asset.symbol);
                        setActiveTab('trading');
                      }}
                      className="w-full mt-4 py-2.5 rounded-xl border border-[#00E5FF]/20 bg-slate-950/20 hover:bg-[#00E5FF]/10 text-xs font-bold text-white transition-all cursor-pointer text-center block"
                    >
                      Análise Técnica Dedicada
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: PORTFOLIO MANAGER */}
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* PORTFOLIO WEIGHT DISTRIBUTION BAR CHIPS */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="glass-card p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase size={14} className="text-[#00E5FF]" /> Balanço de Custódia Integrada S/A
                  </h4>
                  <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    Auditado Blockchain v42
                  </span>
                </div>

                <div className="space-y-4">
                  {portfolio.holdings.map(h => {
                    const assetVal = assets.find(a => a.symbol === h.symbol)?.price || h.avgPrice;
                    const currentValue = assetVal * h.qty;
                    const profitLoss = currentValue - (h.avgPrice * h.qty);
                    const profitPct = (profitLoss / (h.avgPrice * h.qty)) * 100;
                    
                    return (
                      <div key={h.symbol} className="p-4 bg-slate-950/60 rounded-xl border border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className={`h-2.5 w-2.5 rounded-full ${h.color}`} />
                          <div>
                            <p className="text-xs font-black text-white">{h.name}</p>
                            <span className="text-[10px] font-mono text-slate-500">{h.qty} {h.symbol} @ Avg R$ {h.avgPrice.toLocaleString('pt-BR')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-8 font-mono text-[11px] justify-between md:justify-end">
                          <div className="text-right">
                            <span className="text-[9px] text-slate-500 block">Total Estimado</span>
                            <span className="text-xs font-bold text-white">R$ {currentValue.toLocaleString('pt-BR')}</span>
                          </div>

                          <div className="text-right">
                            <span className="text-[9px] text-slate-500 block">Rentabilidade</span>
                            <span className={`text-xs font-bold ${profitLoss >= 0 ? 'text-emerald-450' : 'text-rose-450'}`}>
                              {profitLoss >= 0 ? '+' : ''}{profitPct.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* QUICK STATS & ALLOCATED GAINS PIES WEIGHT */}
            <div className="space-y-6">
              
              <div className="glass-card p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-950 pb-2">
                  <h4 className="text-xs font-bold text-white">Soberania Patrimonial</h4>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-900">
                    <span className="text-[9px] text-slate-500 block">SALDO LÍQUIDO DISPONÍVEL</span>
                    <span className="text-lg font-black text-white">R$ {portfolio.balanceBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-900">
                    <span className="text-[9px] text-slate-500 block">CAPITAL GARANTIA DE MARGEM</span>
                    <span className="text-base font-bold text-cyan-400">R$ {portfolio.lockedBrl.toLocaleString('pt-BR')}</span>
                  </div>

                  <div className="p-2 border border-slate-900 rounded-xl text-[10px] text-slate-500 text-center">
                    Mesa proprietária operada sob as diretivas regulamentadoras de riscos do Bacen e CVM.
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 6: AI ROBOTS */}
        {activeTab === 'bot' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu size={14} className="text-[#00E5FF]" /> Robôs de Inteligência Financeira Autônomos
                  </h4>
                  <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    SISTEMA ATIVO REDUNDANTE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Alpha Arbitrage Bot v3', type: 'Frequência Ultra-Instantânea', currency: 'Crypto / BTC-ETH', status: 'Processando Ticks', profit: '+14.2%', draw: '0.8%', active: true },
                    { name: 'Trend Sentinel Bot', type: 'Seguidor de Momentum Linear', currency: 'Nasdaq & S&P Global', status: 'Aguardando Sinais', profit: '+9.4%', draw: '1.2%', active: true },
                    { name: 'Gold Hedge Optimizer v1', type: 'Proteção Patrimonial Ouro/Dólar', currency: 'Commodity XAU', status: 'Monitorando Deflação', profit: '+3.15%', draw: '0.04%', active: false },
                    { name: 'Solana Breakout Bot', type: 'Rompimento de Picos de Volume', currency: 'Solana High Frequency', status: 'Processando Ticks', profit: '+28.4%', draw: '5.2%', active: true },
                  ].map((bot, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/60 rounded-xl border border-slate-900 hover:border-slate-800 transition-all space-y-3 relative overflow-hidden group">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block">{bot.name}</span>
                          <span className="text-[8.5px] font-mono text-slate-500 block">{bot.type}</span>
                        </div>
                        <span className={`h-2 w-2 rounded-full ${bot.active ? 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse' : 'bg-slate-700'}`} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-slate-900 pt-2.5">
                        <div>
                          <span className="text-slate-500 block">Ativo Operacional</span>
                          <span className="text-slate-300 font-bold">{bot.currency}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Retorno Líquido</span>
                          <span className="text-emerald-400 font-bold">{bot.profit}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Status: <strong className="text-[#00E5FF] font-mono">{bot.status}</strong></span>
                        <div className="flex gap-1.5">
                          <button className="text-[9px] font-mono bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors border border-sky-550/20">
                            Logs
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-950 pb-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    <Sparkles size={13} className="text-purple-400" /> Diretivas Generativas IA
                  </h4>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-900">
                    <p className="text-slate-350 leading-relaxed font-semibold">
                      Cada bot trabalha com algoritmos isolados acoplados ao feed da Bloomberg de Londres, gerando reequilíbrio contínuo para evitar perdas significativas de liquidez rápida.
                    </p>
                  </div>

                  <div className="p-3 bg-[#00E5FF]/5 border border-[#00E5FF]/20 text-[#00E5FF] rounded-xl text-[10px] font-mono">
                    🚨 Cuidado: Performance histórica não garante rendimentos futuros de caixa. Monitore os limites de Stop Loss.
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 7: STRATEGIES VISUAL BUILDER */}
        {activeTab === 'strategies' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* INTERACTIVE RULE EDITOR COLSPAN 2 */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="glass-card p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={14} className="text-purple-400" /> Editor Visual de Estratégias Quantitativas Automatizadas
                  </h4>
                  <span className="text-[9px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
                    CONSTRUTOR VISUAL IF/ELSE
                  </span>
                </div>

                {/* FORM ADDIER RULE BLOCK */}
                <form onSubmit={handleAddRule} className="p-4 bg-slate-950/60 rounded-2xl border border-slate-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="text-[9.5px] font-mono text-slate-500 block mb-1">Se Sinal (IF)</label>
                    <select
                      value={newRuleSignal}
                      onChange={(e) => setNewRuleSignal(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]/40"
                    >
                      <option value="Preço BTC">Preço BTC (BRL)</option>
                      <option value="Preço ETH">Preço ETH (BRL)</option>
                      <option value="Preço SOL">Preço SOL (BRL)</option>
                      <option value="RSI Ethereum">RSI Ethereum (Oscilador)</option>
                      <option value="Nasdaq 100 Volatilidade">Nasdaq Volatilidade</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9.5px] font-mono text-slate-500 block mb-1">Operador Condicional</label>
                    <select
                      value={newRuleCondition}
                      onChange={(e) => setNewRuleCondition(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]/40"
                    >
                      <option value=">">Maior que (&gt;)</option>
                      <option value="<">Menor que (&lt;)</option>
                      <option value="==">Exatamente Igual (==)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9.5px] font-mono text-slate-500 block mb-1">Valor do Limite</label>
                    <input
                      type="text"
                      value={newRuleValue}
                      onChange={(e) => setNewRuleValue(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]/40 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[9.5px] font-mono text-slate-500 block mb-1">Ação Automatizada</label>
                    <select
                      value={newRuleAction}
                      onChange={(e) => setNewRuleAction(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Compra Automática">Compra Automática</option>
                      <option value="Venda de Realocação">Venda de Realocação</option>
                      <option value="Stop Loss Emergência">Stop Loss Emergência</option>
                      <option value="Alerta de Áudio Mesa">Alerta de Áudio Mesa</option>
                    </select>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-[#00E5FF] hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus size={14} /> Acoplar Regra
                    </button>
                  </div>
                </form>

                {/* CURRENT FLOW CHART RULES LIST */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">GATILHOS ATIVOS NA MESA EXECUTIVA</span>
                  <div className="space-y-2">
                    {strategyRules.map((rule, idx) => (
                      <div key={rule.id} className="p-3 bg-slate-950/40 rounded-xl border border-slate-900 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-md bg-purple-500/10 text-purple-400 font-mono text-[10px] flex items-center justify-center">
                            #{idx + 1}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              IF <span className="text-[#00E5FF]">{rule.signal}</span> {rule.condition} <span className="font-mono text-emerald-400">{rule.value}</span>
                            </p>
                            <p className="text-[10px] text-slate-500">
                              Executar Ação: <span className="text-purple-450 font-bold">{rule.action}</span> com montante de <strong className="text-slate-350">{rule.amount}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleRule(rule.id)}
                            className={`p-1 px-2 rounded text-[9px] font-mono font-bold cursor-pointer transition-colors ${
                              rule.active 
                                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/20' 
                                : 'bg-slate-800 text-slate-500 border border-transparent'
                            }`}
                          >
                            {rule.active ? 'Ativo' : 'Pausado'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-1 px-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 cursor-pointer transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* BACKTESTING SIMULATOR ACTIONS */}
            <div className="space-y-6">
              
              <div className="glass-card p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-950 pb-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    <Terminal size={13} className="text-emerald-450" /> Backtester de Alta Fidelidade S/A
                  </h4>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                  Testar o comportamento histórico do seu construtor contra 30 dias de dados reais de mercado de alta frequência.
                </p>

                <button
                  type="button"
                  onClick={runStrategyBacktest}
                  disabled={isBacktesting}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-[0_4px_15px_rgba(147,51,234,0.3)]"
                >
                  <Play size={14} className={isBacktesting ? 'animate-spin' : ''} />
                  {isBacktesting ? 'Rodando Ticks...' : 'Iniciar Backtesting Histórico'}
                </button>

                {/* BACKTEST OUT STATUS PANEL */}
                {backtestResults && (
                  <div className="space-y-2.5 bg-slate-950 p-3.5 rounded-xl border border-slate-900 font-mono text-[10px]">
                    <h5 className="font-bold text-[#00E5FF] border-b border-slate-900 pb-1.5">MÉTRICAS DO RETRO-TESTE</h5>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ROI Projetado</span>
                      <span className="text-emerald-450 font-bold">+{backtestResults.roi}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Taxa de Win (Acerto)</span>
                      <span className="text-white">{backtestResults.winRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ordens Geradas</span>
                      <span className="text-white">{backtestResults.winRate}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-900 pt-1.5 mt-1">
                      <span className="text-slate-500">Lucro Estimado</span>
                      <span className="text-emerald-400 font-bold">R$ {backtestResults.profit.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                )}

                {/* LOGS PANEL */}
                {backtestLogs.length > 0 && (
                  <div className="p-3 bg-black/80 rounded-xl font-mono text-[9px] text-indigo-200 border border-slate-900 h-44 overflow-y-auto space-y-1 scrollbar-thin">
                    {backtestLogs.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 8: RISK MATRIX */}
        {activeTab === 'risk' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              <div className="glass-card p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-amber-500" /> Matriz de Probabilidade de Risco & Volatilidade
                  </h4>
                </div>

                <div className="text-xs text-slate-350 space-y-4">
                  <p className="font-semibold">
                    Monitoramento em tempo real do Value-At-Risk (VaR) e do estresse do patrimônio líquido contra eventos geopolíticos adversos e esgotamento técnico de exchanges.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-1">
                      <span className="text-[9px] text-slate-500 block font-mono">ÍNDICE DE ALFA BETA (COEFICIENTE)</span>
                      <span className="font-mono text-base font-black text-rose-450">1.42 (Risco Moderado/Alto)</span>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-1">
                      <span className="text-[9px] text-slate-500 block font-mono">VALUE AT RISK DIÁRIO (VaR 95%)</span>
                      <span className="font-mono text-base font-black text-emerald-450">R$ 48.400 (Seguro)</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="space-y-6">
              <div className="glass-card p-5 rounded-3xl space-y-3 text-xs font-mono">
                <h4 className="font-bold text-white uppercase tracking-wider border-b border-slate-900 pb-1.5 block">Nível de Colaterização</h4>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Mapeamento de Liquidez</span>
                    <span className="text-emerald-400 font-bold">Saudável</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[94%] rounded-full shadow-[0_0_10px_#10b981]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: CENTRAL QUANT */}
        {activeTab === 'quant' && (
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} className="text-[#00E5FF]" /> Central Quantitativa de Osciladores e Força Relativa
              </h4>
              <span className="text-[9px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded">
                SINAIS ATUALIZANDO DINAMICAMENTE
              </span>
            </div>

            <p className="text-xs text-slate-350 leading-relaxed font-medium">
              Acompanhamento matemático puro de oscilações estatísticas de volatilidade ajustada por volume técnico para fundamentação rápida de tesouraria de hedge.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-[11px] pt-2">
              {[
                { name: 'Índice de Volatilidade de Ouro', code: 'XAU_VOL', value: '14.85%', status: 'Normal' },
                { name: 'Relação de Ordens de Compra/Venda BTC', code: 'BTC_IMBALANCE', value: '1.24x long bias', status: 'Rompimento' },
                { name: 'Correlação Cambial Dólar/Euro', code: 'USD_EUR_CORR', value: '-0.38', status: 'Estável' },
                { name: 'Índice RSI Relativo Nasdaq 200', code: 'NASDAQ_RSI', value: '62.40 (Neutro)', status: 'Neutro' },
                { name: 'Afastamento Médio Móvel BTC (50 MA)', code: 'BTC_MA_50', value: '+4.81%', status: 'Rompimento' },
              ].map((quant, index) => (
                <div key={index} className="p-4 bg-slate-950/60 rounded-xl border border-slate-900 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{quant.name}</span>
                    <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 rounded">{quant.code}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-white">{quant.value}</span>
                    <span className={`p-0.5 px-2 rounded text-[9px] font-black ${quant.status === 'Rompimento' ? 'bg-[#00E5FF]/10 text-[#00E5FF]' : 'bg-slate-850 text-slate-400'}`}>
                      {quant.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: MONTE CARLO SIMULATIONS */}
        {activeTab === 'simulations' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              <div className="glass-card p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <RotateCcw size={14} className="text-[#00E5FF]" /> Simulador Monte Carlo de Fluxo de Caixa Futuro do ERP
                  </h4>
                </div>

                <div className="text-xs text-slate-355 space-y-4">
                  <p className="font-semibold leading-relaxed">
                    Testes numéricos para modelar a probabilidade de diferentes resultados futuros do caixa corporativo do TitanX S/A sob efeitos de taxas de juros, volatilidade cambial e perdas imprevistas.
                  </p>

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-900 font-mono space-y-3">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500">Capital Inicial Simulação</span>
                      <span className="text-slate-300">R$ 1.547.805,00 BRL</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500">Cenário de Estresse Standardizado (99.9% Confiança)</span>
                      <span className="text-sky-300">Reserva de R$ 1.150.000,00 após 1 ano fiscal</span>
                    </div>

                    <p className="text-[10px] text-slate-500 text-center leading-tight pt-2 border-t border-slate-900">
                      Nenhuma perda catastrófica de caixa corporativo foi localizada nas 10.000 iterações matemáticas executadas pela IA de proteção TitanX.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            <div className="space-y-6">
              <div className="glass-card p-5 rounded-3xl space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-900 pb-2 flex items-center gap-1">
                  <Settings size={13} className="text-purple-400" /> Parâmetros de Simulação
                </h4>

                <div className="space-y-3 font-mono text-[10px] text-slate-400">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Iterações Mapeadas</span>
                      <span>10.000 caminhos</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1 rounded-full"><div className="bg-purple-500 h-full w-full rounded-full" /></div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Volatilidade de Base</span>
                      <span>15% / ano</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1 rounded-full"><div className="bg-[#00E5FF] h-full w-[40%] rounded-full" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
