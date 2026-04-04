"use client";

import type { EONETEvent } from "@/lib/api/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "@/components/events/event-card";

interface EventListProps {
  events: EONETEvent[];
  selectedEventId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

function EventListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex items-start gap-2">
            <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EventList({
  events,
  selectedEventId,
  onSelect,
  isLoading,
}: EventListProps) {
  if (isLoading) {
    return <EventListSkeleton />;
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No events match your filters
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Try adjusting the time range or categories
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-1.5">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isSelected={selectedEventId === event.id}
            onClick={() => onSelect(event.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
