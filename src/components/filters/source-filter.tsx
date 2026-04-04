"use client";

import { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SourceFilterProps {
  sources: string[];
  activeSources: string[];
  onChange: (sources: string[]) => void;
}

export function SourceFilter({
  sources,
  activeSources,
  onChange,
}: SourceFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(
    (source: string) => {
      const next = activeSources.includes(source)
        ? activeSources.filter((s) => s !== source)
        : [...activeSources, source];
      onChange(next);
    },
    [activeSources, onChange],
  );

  return (
    <div>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={isOpen}
        aria-label="Toggle source filter"
      >
        <span>
          Sources{" "}
          {activeSources.length > 0 && `(${activeSources.length})`}
        </span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {activeSources.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {activeSources.map((source) => (
            <Badge
              key={source}
              variant="secondary"
              className="cursor-pointer text-xs"
              onClick={() => handleToggle(source)}
            >
              {source}
              <span className="ml-1" aria-hidden="true">
                &times;
              </span>
            </Badge>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="mt-2 flex flex-col gap-1 rounded-md border border-border bg-muted/30 p-2">
          {sources.length === 0 && (
            <span className="text-xs text-muted-foreground px-2 py-1">
              No sources available
            </span>
          )}
          {sources.map((source) => (
            <label
              key={source}
              className="flex items-center gap-2 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={activeSources.includes(source)}
                onChange={() => handleToggle(source)}
                className="rounded border-border"
              />
              {source}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
