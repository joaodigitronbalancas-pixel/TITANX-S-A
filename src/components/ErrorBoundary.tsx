import React, { ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, ChevronRight } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in TitanX:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-screen" className="flex flex-col items-center justify-center min-h-[400px] p-8 border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/10 rounded-2xl space-y-6 shadow-xl max-w-xl mx-auto my-12 backdrop-blur-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/25 shadow-inner">
            <AlertOctagon size={28} className="animate-pulse" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-base font-bold font-sans tracking-tight text-slate-850 dark:text-slate-100">
              Falha na Renderização do Módulo TitanX
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Ocorreu um erro inesperado no processador deste componente. A segurança ativa do TitanX isolou o incidente para proteger a integridade do banco de dados central.
            </p>
          </div>

          {this.state.error && (
            <div className="w-full bg-slate-900 border border-slate-800 p-3.5 rounded-xl font-mono text-[10px] text-rose-400 overflow-x-auto max-h-36 scrollbar-thin">
              <span className="font-bold text-slate-400 block mb-1">Rastro do Erro:</span>
              {this.state.error.message}
              {this.state.error.stack && (
                <span className="opacity-60 block mt-2 whitespace-pre leading-normal">
                  {this.state.error.stack.split('\n').slice(0, 3).join('\n')}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              <RefreshCw size={14} /> Recarregar Recurso
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.hash = '';
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 border border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-350 text-xs font-bold rounded-xl transition-all cursor-pointer bg-transparent"
            >
              Voltar ao Início <ChevronRight size={14} />
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
