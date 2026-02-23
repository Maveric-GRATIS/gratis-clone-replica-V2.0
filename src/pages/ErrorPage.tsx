/**
 * Generic Error Page
 * User-friendly page for application errors
 */

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { AppError } from "@/lib/errors/app-error";
import { ErrorSeverity } from "@/types/errors";

interface ErrorPageProps {
  error?: AppError | Error;
  resetError?: () => void;
}

export default function ErrorPage({ error, resetError }: ErrorPageProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isReloading, setIsReloading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const appError = error instanceof AppError ? error : null;
  const isDevelopment = import.meta.env.DEV;

  // Get error details
  const errorCode = appError?.code || "GRT-999-999";
  const errorMessage =
    appError?.message ||
    error?.message ||
    t("errors.generic.defaultMessage", "Er is een fout opgetreden");
  const errorSeverity = appError?.severity || ErrorSeverity.HIGH;

  const handleReload = () => {
    setIsReloading(true);

    if (resetError) {
      resetError();
    }

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleGoHome = () => {
    if (resetError) {
      resetError();
    }
    navigate("/");
  };

  const getSeverityColor = () => {
    switch (errorSeverity) {
      case ErrorSeverity.LOW:
        return "text-yellow-600";
      case ErrorSeverity.MEDIUM:
        return "text-orange-600";
      case ErrorSeverity.HIGH:
        return "text-red-600";
      case ErrorSeverity.CRITICAL:
        return "text-red-800";
      default:
        return "text-red-600";
    }
  };

  const getSeverityBg = () => {
    switch (errorSeverity) {
      case ErrorSeverity.LOW:
        return "bg-yellow-50 border-yellow-200";
      case ErrorSeverity.MEDIUM:
        return "bg-orange-50 border-orange-200";
      case ErrorSeverity.HIGH:
        return "bg-red-50 border-red-200";
      case ErrorSeverity.CRITICAL:
        return "bg-red-100 border-red-300";
      default:
        return "bg-red-50 border-red-200";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className={`inline-flex p-6 rounded-full ${getSeverityBg()}`}>
            <AlertTriangle className={`w-16 h-16 ${getSeverityColor()}`} />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          {t("errors.generic.title", "Oeps! Er ging iets mis")}
        </h1>

        {/* Error Message */}
        <div className={`rounded-lg border p-6 mb-6 ${getSeverityBg()}`}>
          <p className="text-lg text-gray-700 text-center mb-2">
            {errorMessage}
          </p>
          {errorCode && (
            <p className="text-sm text-gray-500 text-center font-mono">
              {t("errors.generic.errorCode", "Foutcode")}: {errorCode}
            </p>
          )}
        </div>

        {/* Error Details (Development Only) */}
        {isDevelopment && error && (
          <div className="mb-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-gray-600 hover:text-gray-800 underline mb-2"
            >
              {showDetails ? "Verberg details" : "Toon technische details"}
            </button>

            {showDetails && (
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-xs font-mono">
                <div className="mb-2">
                  <strong>Error Type:</strong> {error.constructor.name}
                </div>
                <div className="mb-2">
                  <strong>Message:</strong> {error.message}
                </div>
                {appError?.category && (
                  <div className="mb-2">
                    <strong>Category:</strong> {appError.category}
                  </div>
                )}
                {appError?.details && (
                  <div className="mb-2">
                    <strong>Details:</strong>
                    <pre className="mt-1">
                      {JSON.stringify(appError.details, null, 2)}
                    </pre>
                  </div>
                )}
                {error.stack && (
                  <div>
                    <strong>Stack Trace:</strong>
                    <pre className="mt-1 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Suggestions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            {t("errors.generic.suggestions", "Wat kun je proberen?")}
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t("errors.generic.reloadPage", "Herlaad de pagina")}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                {t(
                  "errors.generic.checkConnection",
                  "Controleer je internetverbinding",
                )}
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                {t("errors.generic.tryAgainLater", "Probeer het later opnieuw")}
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                {t(
                  "errors.generic.contactSupport",
                  "Neem contact op met support als het probleem aanhoudt",
                )}
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button
            onClick={handleReload}
            disabled={isReloading}
            size="lg"
            className="gap-2"
          >
            <RefreshCw
              className={`w-5 h-5 ${isReloading ? "animate-spin" : ""}`}
            />
            {t("errors.generic.reload", "Pagina herladen")}
          </Button>

          <Button
            onClick={handleGoHome}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Home className="w-5 h-5" />
            {t("errors.generic.homepage", "Naar homepagina")}
          </Button>
        </div>

        {/* Support Link */}
        <div className="text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 hover:underline"
          >
            <Mail className="w-4 h-4" />
            {t("errors.generic.contactSupport", "Neem contact op met support")}
          </Link>
        </div>

        {/* Additional Info for Critical Errors */}
        {errorSeverity === ErrorSeverity.CRITICAL && (
          <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-sm text-red-800 text-center">
              {t(
                "errors.generic.criticalError",
                "Dit is een kritieke fout. Ons team is automatisch op de hoogte gesteld.",
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
