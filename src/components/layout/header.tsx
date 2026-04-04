"use client";

import { useState, useCallback } from "react";
import { Globe, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface HeaderProps {
  onRefreshToggle?: () => void;
  isAutoRefresh?: boolean;
  eventTitles?: string[];
  onEventSearch?: (id: string) => void;
}

export function Header({
  onRefreshToggle,
  isAutoRefresh = false,
  eventTitles = [],
  onEventSearch,
}: HeaderProps) {
  const [commandOpen, setCommandOpen] = useState(false);

  const handleSelect = useCallback(
    (value: string) => {
      onEventSearch?.(value);
      setCommandOpen(false);
    },
    [onEventSearch],
  );

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" aria-hidden="true" />
          <h1 className="text-base font-semibold tracking-tight text-foreground">
            Earth Events
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => setCommandOpen(true)}
            aria-label="Search events"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline text-sm">Search...</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs text-muted-foreground sm:flex">
              <span className="text-xs">&#8984;</span>K
            </kbd>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={
              isAutoRefresh
                ? "text-primary hover:text-primary"
                : "text-muted-foreground hover:text-foreground"
            }
            onClick={onRefreshToggle}
            aria-label={
              isAutoRefresh ? "Disable auto-refresh" : "Enable auto-refresh"
            }
          >
            <RefreshCw
              className={`h-4 w-4 ${isAutoRefresh ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
          </Button>
        </div>
      </header>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search events by title..." />
        <CommandList>
          <CommandEmpty>No events found.</CommandEmpty>
          <CommandGroup heading="Events">
            {eventTitles.map((title) => (
              <CommandItem key={title} value={title} onSelect={handleSelect}>
                {title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
