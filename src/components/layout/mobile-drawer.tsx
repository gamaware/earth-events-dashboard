"use client";

import { Drawer } from "vaul";
import type { EONETEvent } from "@/lib/api/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryFilter } from "@/components/filters/category-filter";
import { StatusFilter } from "@/components/filters/status-filter";
import { DateRangeFilter } from "@/components/filters/date-range-filter";
import { EventList } from "@/components/events/event-list";

interface MobileDrawerProps {
  events: EONETEvent[];
  categories: string[];
  onCategoryToggle: (id: string) => void;
  activeCategories: string[];
  status: string;
  onStatusChange: (status: string) => void;
  days: number;
  onDaysChange: (days: number) => void;
  selectedEventId: string | null;
  onEventSelect: (id: string) => void;
  isLoading: boolean;
}

export function MobileDrawer({
  events,
  activeCategories,
  onCategoryToggle,
  status,
  onStatusChange,
  days,
  onDaysChange,
  selectedEventId,
  onEventSelect,
  isLoading,
}: MobileDrawerProps) {
  return (
    <div className="lg:hidden">
      <Drawer.Root
        snapPoints={[0.3, 0.7, 1]}
        activeSnapPoint={undefined}
        modal={false}
      >
        <Drawer.Trigger asChild>
          <button
            className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-center bg-card border-t border-border py-2 lg:hidden"
            aria-label="Open events drawer"
          >
            <div className="h-1 w-10 rounded-full bg-muted-foreground/40" />
          </button>
        </Drawer.Trigger>

        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[96vh] flex-col rounded-t-xl bg-card">
            <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/40" />

            <Drawer.Title className="sr-only">
              Events and Filters
            </Drawer.Title>

            <div className="flex flex-col gap-4 p-4">
              <div>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Categories
                </h2>
                <CategoryFilter
                  activeCategories={activeCategories}
                  onToggle={onCategoryToggle}
                />
              </div>

              <div>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </h2>
                <StatusFilter status={status} onChange={onStatusChange} />
              </div>

              <div>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Time Range
                </h2>
                <DateRangeFilter days={days} onChange={onDaysChange} />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between px-4 py-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Events
              </h2>
              {isLoading ? (
                <Skeleton className="h-4 w-8" />
              ) : (
                <span className="text-xs font-medium text-muted-foreground">
                  {events.length}
                </span>
              )}
            </div>

            <ScrollArea className="flex-1 px-2 pb-4">
              <EventList
                events={events}
                selectedEventId={selectedEventId}
                onSelect={onEventSelect}
                isLoading={isLoading}
              />
            </ScrollArea>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
