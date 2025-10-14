import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('[ErrorBoundary] Error caught:', error);
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    this.setState({
      error,
      errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
          <div className="max-w-2xl w-full bg-destructive/10 border border-destructive rounded-lg p-6">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-4">
              An error occurred while rendering this page.
            </p>
            
            {this.state.error && (
              <div className="bg-background rounded p-4 mb-4">
                <p className="font-mono text-sm text-destructive mb-2">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {this.state.errorInfo && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium mb-2">
                  Component Stack Trace
                </summary>
                <pre className="text-xs bg-background p-4 rounded overflow-auto max-h-96">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
