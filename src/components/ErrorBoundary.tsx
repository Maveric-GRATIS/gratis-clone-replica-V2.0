/**
 * Enhanced Error Boundary Component
 * Catches React errors and integrates with error handling system
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import ErrorPage from "@/pages/ErrorPage";
import { errorHandler } from "@/lib/errors/error-handler";
import { toAppError, AppError } from "@/lib/errors/app-error";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error?: Error | AppError;
  errorInfo?: ErrorInfo;
  resetCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    resetCount: 0,
  };

  private resetTimeout?: NodeJS.Timeout;

  /**
   * Derive error state from error
   */
  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error: toAppError(error),
    };
  }

  /**
   * Handle component error
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Convert to AppError
    const appError = toAppError(error);

    // Log error details
    console.error("ErrorBoundary caught an error:", {
      error: appError,
      errorInfo,
      componentStack: errorInfo.componentStack,
    });

    // Update state with error info
    this.setState({ errorInfo });

    // Report error through error handler
    errorHandler.handle(appError, {
      component: "ErrorBoundary",
      componentStack: errorInfo.componentStack,
      resetCount: this.state.resetCount,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Auto-reset after 5 minutes if not manually reset
    this.scheduleAutoReset();
  }

  /**
   * Reset error boundary when resetKeys change
   */
  public componentDidUpdate(prevProps: Props) {
    if (this.state.hasError && this.props.resetKeys) {
      const hasResetKeyChanged = this.props.resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index],
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  /**
   * Cleanup on unmount
   */
  public componentWillUnmount() {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
  }

  /**
   * Schedule auto-reset
   */
  private scheduleAutoReset() {
    // Clear existing timeout
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }

    // Don't auto-reset critical errors
    const error = this.state.error;
    if (error instanceof AppError && error.severity === "critical") {
      return;
    }

    // Reset after 5 minutes
    this.resetTimeout = setTimeout(
      () => {
        console.log("Auto-resetting error boundary after timeout");
        this.resetErrorBoundary();
      },
      5 * 60 * 1000,
    );
  }

  /**
   * Reset error boundary
   */
  private resetErrorBoundary = () => {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }

    this.setState((prevState) => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      resetCount: prevState.resetCount + 1,
    }));
  };

  /**
   * Render error UI or children
   */
  public render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Use ErrorPage component
      return (
        <ErrorPage
          error={this.state.error}
          resetError={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap component with ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, "children">,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
