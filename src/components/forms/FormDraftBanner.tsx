/**
 * FormDraftBanner
 *
 * Shown at the top of a form when a saved draft exists.
 * Two states:
 *  1. Not yet restored  → yellow alert with "Restore" + "Discard" buttons
 *  2. Already restored  → green info bar with "Discard" only
 */

import { formatDistanceToNow, format } from "date-fns";
import { nl } from "date-fns/locale";
import { AlertCircle, Clock, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormDraftBannerProps {
  lastSaved: Date | null;
  onRestore: () => void;
  onDiscard: () => void;
  restored?: boolean;
}

export function FormDraftBanner({
  lastSaved,
  onRestore,
  onDiscard,
  restored = false,
}: FormDraftBannerProps) {
  if (!lastSaved) return null;

  const relative = formatDistanceToNow(lastSaved, {
    addSuffix: true,
    locale: nl,
  });
  const absolute = format(lastSaved, "d MMM yyyy HH:mm", { locale: nl });

  if (restored) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm">
        <Clock className="h-4 w-4 text-green-400 flex-shrink-0" />
        <span className="text-green-400 font-medium flex-1">
          Concept hersteld — opgeslagen {relative}
        </span>
        <span
          className="text-muted-foreground text-xs hidden sm:block"
          title={absolute}
        >
          {absolute}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-muted-foreground hover:text-red-400"
          onClick={onDiscard}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Verwijder concept
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
        <div className="min-w-0">
          <span className="text-yellow-400 font-medium">
            Opgeslagen concept gevonden
          </span>
          <span className="text-muted-foreground ml-2 text-xs">
            ({relative} — {absolute})
          </span>
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Button
          type="button"
          size="sm"
          className="h-7 border border-yellow-500/30 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 hover:text-yellow-300"
          onClick={onRestore}
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Concept herstellen
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-muted-foreground hover:text-red-400"
          onClick={onDiscard}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Verwijder
        </Button>
      </div>
    </div>
  );
}
