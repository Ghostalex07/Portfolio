import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

// Red de seguridad: sin esto, cualquier error de render deja la pagina en blanco
// sin mensaje ni forma de recuperacion.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled error in render tree", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-[80rem] flex-col justify-center gap-4 px-6 sm:px-8 lg:px-12">
          <h1 className="text-h2 font-bold tracking-tight text-text-primary">
            Something broke on my side.
          </h1>
          <p className="max-w-[58ch] text-base leading-relaxed text-text-secondary">
            The page failed to render. Reloading usually fixes it, and the source of the
            problem is worth a look in the console.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-pill bg-accent px-6 py-3 font-mono text-sm font-medium text-surface transition-all hover:brightness-110"
            >
              Reload
            </button>
            <a
              href="mailto:Alejandro.bj007@gmail.com?subject=Portfolio%20error"
              className="rounded-pill border border-surface-border px-6 py-3 font-mono text-sm text-text-secondary transition-all hover:border-accent/40 hover:text-accent"
            >
              Report it
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
