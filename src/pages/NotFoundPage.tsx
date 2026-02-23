/**
 * 404 Not Found Page
 * User-friendly page for missing routes
 */

import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-200 mb-4">404</h1>
          <div className="w-32 h-1 bg-primary-500 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {t("errors.notFound.title", "Pagina niet gevonden")}
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          {t(
            "errors.notFound.description",
            "De pagina die je zoekt bestaat niet of is verplaatst.",
          )}
        </p>

        {/* Suggestions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">
            {t("errors.notFound.suggestions", "Wat kun je doen?")}
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                {t(
                  "errors.notFound.checkUrl",
                  "Controleer de URL op typefouten",
                )}
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                {t("errors.notFound.useSearch", "Gebruik de zoekfunctie")}
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                {t("errors.notFound.goHome", "Ga terug naar de homepagina")}
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                {t(
                  "errors.notFound.contactSupport",
                  "Neem contact op met support",
                )}
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("errors.notFound.goBack", "Ga terug")}
          </Button>

          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              <Home className="w-5 h-5" />
              {t("errors.notFound.homepage", "Naar homepagina")}
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/search">
              <Search className="w-5 h-5" />
              {t("errors.notFound.search", "Zoeken")}
            </Link>
          </Button>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            {t("errors.notFound.needHelp", "Hulp nodig?")}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/help"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              {t("errors.notFound.helpCenter", "Helpcentrum")}
            </Link>
            <Link
              to="/contact"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              {t("errors.notFound.contact", "Contact")}
            </Link>
            <Link
              to="/faq"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              {t("errors.notFound.faq", "Veelgestelde vragen")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
