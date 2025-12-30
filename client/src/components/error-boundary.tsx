import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="h-10 w-10 text-destructive" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Bir Şeyler Ters Gitti</h1>
                        <p className="text-muted-foreground mb-6">
                            Beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
                        </p>
                        {this.state.error && (
                            <details className="mb-6 text-left bg-muted p-4 rounded-lg">
                                <summary className="cursor-pointer text-sm font-medium">
                                    Teknik Detaylar
                                </summary>
                                <pre className="mt-2 text-xs overflow-auto text-destructive">
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}
                        <Button onClick={this.handleRetry} size="lg">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sayfayı Yenile
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
