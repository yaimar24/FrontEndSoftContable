import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-4 rounded-2xl bg-rose-50 text-rose-500 mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide mb-2">
            Algo salió mal
          </h2>
          <p className="text-sm text-slate-500 font-medium text-center max-w-md mb-6">
            Ocurrió un error inesperado. Intenta recargar esta sección.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <RefreshCw size={14} /> Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
