"use client";

import type { EONETGeometry } from "@/lib/api/types";
import { formatDateTime, formatMagnitude, formatCoordinates } from "@/lib/utils/format";

interface EventTimelineProps {
  geometries: EONETGeometry[];
}

export function EventTimeline({ geometries }: EventTimelineProps) {
  const sorted = [...geometries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <div className="relative pl-4">
      {/* Vertical connecting line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

      <div className="flex flex-col gap-4">
        {sorted.map((geo, index) => {
          const coords =
            geo.type === "Point" && Array.isArray(geo.coordinates)
              ? formatCoordinates(geo.coordinates as number[])
              : "Polygon";

          return (
            <div key={index} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background" />

              <div className="ml-2">
                <p className="text-xs font-medium text-foreground">
                  {formatDateTime(geo.date)}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  {coords}
                </p>
                {geo.magnitudeValue !== null && geo.magnitudeValue !== undefined && (
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                    {formatMagnitude(geo.magnitudeValue, geo.magnitudeUnit)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
