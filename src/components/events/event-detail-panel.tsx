"use client";

import { ExternalLink, X } from "lucide-react";
import type { EONETEvent } from "@/lib/api/types";
import { getCategoryConfig } from "@/lib/constants/categories";
import { formatDateTime, formatMagnitude } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EventTimeline } from "@/components/events/event-timeline";

interface EventDetailPanelProps {
  event: EONETEvent | null;
  onClose: () => void;
}

export function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  return (
    <Sheet open={event !== null} onOpenChange={() => onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:w-96 bg-card border-border p-0"
      >
        {event && <EventDetailContent event={event} onClose={onClose} />}
      </SheetContent>
    </Sheet>
  );
}

function EventDetailContent({
  event,
  onClose,
}: {
  event: EONETEvent;
  onClose: () => void;
}) {
  const latestGeometry =
    event.geometry.length > 0
      ? event.geometry[event.geometry.length - 1]
      : null;

  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="border-b border-border px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <SheetTitle className="text-base font-semibold text-foreground leading-tight">
            {event.title}
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            onClick={onClose}
            aria-label="Close detail panel"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5">
            {event.categories.map((cat) => {
              const config = getCategoryConfig(cat.id);
              return (
                <Badge
                  key={cat.id}
                  variant="outline"
                  className="border-current text-xs"
                  style={{ color: config.color }}
                >
                  <span
                    className="mr-1 inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: config.color }}
                    aria-hidden="true"
                  />
                  {config.label}
                </Badge>
              );
            })}
          </div>

          {/* Description */}
          {event.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Status */}
          <div className="flex items-center gap-2">
            <Badge variant={event.closed ? "secondary" : "default"}>
              {event.closed ? "Closed" : "Active"}
            </Badge>
            {event.closed && (
              <span className="text-xs text-muted-foreground">
                Closed {formatDateTime(event.closed)}
              </span>
            )}
          </div>

          {/* Latest magnitude */}
          {latestGeometry?.magnitudeValue !== null &&
            latestGeometry?.magnitudeValue !== undefined && (
              <div>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Magnitude
                </h3>
                <p className="font-mono text-sm text-foreground">
                  {formatMagnitude(
                    latestGeometry.magnitudeValue,
                    latestGeometry.magnitudeUnit,
                  )}
                </p>
              </div>
            )}

          <Separator />

          {/* Sources */}
          {event.sources.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sources
              </h3>
              <div className="flex flex-col gap-1">
                {event.sources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <ExternalLink
                      className="h-3 w-3 shrink-0"
                      aria-hidden="true"
                    />
                    {source.id}
                  </a>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Timeline */}
          {event.geometry.length > 0 && (
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Geometry Timeline ({event.geometry.length} point
                {event.geometry.length !== 1 ? "s" : ""})
              </h3>
              <EventTimeline geometries={event.geometry} />
            </div>
          )}

          {/* NASA link */}
          <div className="pt-2">
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              View on NASA EONET
            </a>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
