/**
 * SaveDraftButton — "Opslaan als concept" button
 *
 * Shows spinner while saving, checkmark for 2.5 s after success,
 * then reverts. Displays last-saved time underneath.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Check, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

interface SaveDraftButtonProps {
  onSave: () => Promise<void>;
  lastSaved: Date | null;
  saving: boolean;
  label?: string;
  className?: string;
}

export function SaveDraftButton({
  onSave,
  lastSaved,
  saving,
  label = "Opslaan als concept",
  className = "",
}: SaveDraftButtonProps) {
  const [justSaved, setJustSaved] = useState(false);

  const handleClick = async () => {
    await onSave();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  return (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={saving}
        onClick={handleClick}
        className={`gap-2 transition-all ${
          justSaved
            ? "border-green-500/50 text-green-400 hover:border-green-500/50"
            : "border-primary/40 text-primary hover:border-primary hover:bg-primary/5"
        }`}
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : justSaved ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {saving ? "Opslaan..." : justSaved ? "Opgeslagen!" : label}
      </Button>

      {lastSaved && (
        <p className="text-xs text-muted-foreground pl-1">
          Laatste opslag:{" "}
          {format(lastSaved, "d MMM yyyy HH:mm", { locale: nl })}
        </p>
      )}
    </div>
  );
}
