import { useState } from 'react';
import {
  Cpu,
  Flame,
  Activity,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Clock,
  Gauge
} from 'lucide-react';

export interface ProducaoProps {
  searchText: string;
}

export default function Producao({ searchText }: ProducaoProps) {
  const [machines, setMachines] = useState([
    { id: 1, name: 'Prensa Hidráulica H-400', status: 'Ativa', speed: '98%', temp: '42 °C', output: 1450, errorCount: 0 },
    { id: 2, name: 'Torno Mecânico CNC T-80', status: 'Ativa', speed: '91%', temp: '48 °C', output: 850, errorCount: 1 },
    { id: 3, name: 'Extrusora Metálica EX-33', status: 'Alerta', speed: '75%', temp: '68 °C', output: 340, errorCount: 4 },
    { id: 4, name: 'Injetora Industrial IP-12', status: 'Inativa', speed: '0%', temp: '18 °C', output: 0, errorCount: 0 }
  ]);

  const [simulationState, setSimulationState] = useState(false);

  const triggerLiveDiagnostics = () => {
    setSimulationState(true);
    setTimeout(() => {
      // Modify a random machine's output
      setMachines(prev =>
        prev.map(m =>
          m.id === 1 ? { ...m, output: m.output + Math.floor(5 + Math.random() * 15) } : m
        )
      );
      setSimulationState(false);
    }, 1500);
  };

  const filteredMachines = machines.filter((m) =>
    m.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-850 dark:text-slate-100 font-sans">
            Produção Industrial Realtime
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Painel supervisor OEE do pátio de manufatura fábrica. Telemetria Ativa de sensores e produtividade horária.
          </p>
        </div>

        <button
          onClick={triggerLiveDiagnostics}
          disabled={simulationState}
          className="flex items-center gap-1.5 px-4 py-2 border border-[#00E5FF]/20 hover:border-[#00E5FF]/50 bg-[#00E5FF]/10 text-xs font-bold text-[#00E5FF] rounded-xl cursor-pointer transition-colors"
        >
          <RefreshCw size={14} className={simulationState ? 'animate-spin' : ''} />
          {simulationState ? 'Diagnóstico Ativo...' : 'Atualizar Sensores'}
        </button>
      </div>

      {/* DETAILED STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {machines.map((mac) => {
          return (
            <div
              key={mac.id}
              className={`bg-white dark:bg-slate-900 border p-5 rounded-xl shadow-sm space-y-4 ${
                mac.status === 'Ativa' ? 'border-[#00E5FF]/20' :
                mac.status === 'Alerta' ? 'border-amber-500/20' : 'border-slate-200 dark:border-slate-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`inline-block h-2 w-2 rounded-full ${
                  mac.status === 'Ativa' ? 'bg-[#00E5FF]' :
                  mac.status === 'Alerta' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'
                }`} />
                <span className="text-[9px] font-mono font-bold tracking-wide text-slate-400 uppercase">{mac.status}</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-xs truncate text-slate-800 dark:text-slate-100">{mac.name}</h3>
                <p className="text-[10px] text-slate-400 font-mono">ID: SEC-310-M{mac.id}</p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-850 pt-3 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500">
                <div className="flex flex-col">
                  <span>Velocidade</span>
                  <span className="font-bold text-slate-700 dark:text-slate-250 font-sans text-[11px]">{mac.speed}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span>Sensor Temperatura</span>
                  <span className={`font-bold text-slate-700 dark:text-slate-250 font-sans text-[11px] ${
                    parseInt(mac.temp) > 60 ? 'text-amber-500' : ''
                  }`}>{mac.temp}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Rendimento Lote</span>
                <span className="font-bold text-[#00E5FF]">{mac.output} Peças</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CORE GRAPH AND CONVEYOR FLOW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* RUNTIME LINE INTENSITY GRAPHICS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-5 shadow-sm col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">Supervisor Operacional Horário</h3>
            <span className="flex items-center gap-1 text-[9px] text-[#00E5FF] font-mono"><Activity size={10} /> SENSOR_FIBRE_ACTIVE</span>
          </div>

          <div className="h-44 w-full relative flex items-end justify-between border-b border-slate-200 dark:border-slate-800">
            {/* GRID GRAPH */}
            <div className="absolute inset-0 top-3 pointer-events-none flex flex-col justify-between">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-full border-t border-dashed border-slate-100 dark:border-slate-850/40" />
              ))}
            </div>

            {/* DRAW LINE GRAPH PATH */}
            <svg className="w-full h-full absolute inset-0 pt-3" viewBox="0 0 500 150" preserveAspectRatio="none">
              <path
                d="M 0,120 Q 80,70 160,110 T 320,40 T 500,20"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="160" cy="110" r="4.5" fill="#00E5FF" />
              <circle cx="320" cy="40" r="4.5" fill="#00E5FF" />
              <circle cx="500" cy="20" r="4.5" fill="#00E5FF" />
            </svg>

            <span className="absolute bottom-[-18px] left-0 text-[8px] text-slate-400 font-mono">08:00</span>
            <span className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 text-[8px] text-slate-400 font-mono">13:00</span>
            <span className="absolute bottom-[-18px] right-0 text-[8px] text-slate-400 font-mono">18:00 (Agora)</span>
          </div>
        </div>

        {/* PLANT STATUS LOG */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">Alertas Ativos CLPs</h3>
          <div className="space-y-3">
            {[
              { id: 1, text: 'Erro de Overheat extrusora EX-33', status: 'critical', desc: 'Resistência de aquecimento atingiu 68 °C limite.' },
              { id: 2, text: 'Calibração CNC T-80 agendada', status: 'caution', desc: 'Exige troca de brocas de diamante amanhã.' }
            ].map((al) => (
              <div key={al.id} className="p-3 border border-slate-100 dark:border-slate-850/60 bg-slate-50 dark:bg-slate-950/20 rounded-lg space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 font-bold">
                  <span className={`h-1.5 w-1.5 rounded-full ${al.status === 'critical' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                  <span className="text-slate-800 dark:text-slate-200">{al.text}</span>
                </div>
                <p className="text-slate-400 leading-tight pl-3">{al.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
