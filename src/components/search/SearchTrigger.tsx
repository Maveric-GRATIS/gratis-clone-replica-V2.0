/**
 * Search Trigger Button
 *
 * Part 7 - Section 32: Global Search & Discovery
 * Button that opens the global search dialog with keyboard shortcut (Cmd/Ctrl+K)
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { GlobalSearch } from "@/components/search/GlobalSearch";

export function SearchTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full md:w-64 justify-start text-gray-500 dark:text-gray-400"
        onClick={() => setIsOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 text-[10px] font-medium text-gray-500 dark:text-gray-400">
          ⌘K
        </kbd>
      </Button>

      <GlobalSearch open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
