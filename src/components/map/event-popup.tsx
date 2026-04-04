"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { MapMouseEvent } from "mapbox-gl";

import { getCategoryConfig } from "@/lib/constants/categories";
import { useMap } from "@/components/map/map-provider";

const LAYER_UNCLUSTERED = "unclustered-point";

interface EventPopupProps {
  selectedEventId: string | null;
}

function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function buildPopupHTML(properties: Record<string, unknown>): string {
  const title = String(properties.title ?? "Unknown Event");
  const date = properties.date ? formatDate(String(properties.date)) : "";
  const categoryId = String(properties.categoryId ?? "unknown");
  const magnitudeValue = properties.magnitudeValue as number | null;
  const magnitudeUnit = properties.magnitudeUnit as string | null;
  const config = getCategoryConfig(categoryId);

  let magnitudeHtml = "";
  if (magnitudeValue !== null && magnitudeValue !== undefined) {
    const unit = magnitudeUnit ? ` ${magnitudeUnit}` : "";
    magnitudeHtml = `
      <div style="font-size:12px;color:#A1A1AA;margin-top:4px;">
        Magnitude: <span style="color:#E4E4E7;font-weight:500;">${magnitudeValue}${unit}</span>
      </div>
    `;
  }

  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;padding:4px;max-width:260px;">
      <div style="font-size:14px;font-weight:600;color:#F4F4F5;margin-bottom:6px;line-height:1.3;">
        ${title}
      </div>
      <div style="display:inline-flex;align-items:center;gap:6px;margin-bottom:6px;">
        <span style="
          display:inline-block;
          width:8px;height:8px;
          border-radius:50%;
          background:${config.color};
        "></span>
        <span style="font-size:12px;color:${config.color};font-weight:500;">
          ${config.label}
        </span>
      </div>
      ${date ? `<div style="font-size:12px;color:#A1A1AA;margin-top:2px;">${date}</div>` : ""}
      ${magnitudeHtml}
    </div>
  `;
}

export function EventPopup({ selectedEventId }: EventPopupProps) {
  const { map, isLoaded } = useMap();
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const hoverPopupRef = useRef<mapboxgl.Popup | null>(null);

  // Hover popup on mousemove
  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }

    const handleMouseMove = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [LAYER_UNCLUSTERED],
      });

      if (!features.length) {
        if (hoverPopupRef.current) {
          hoverPopupRef.current.remove();
          hoverPopupRef.current = null;
        }
        return;
      }

      const feature = features[0];
      const geometry = feature.geometry;
      if (geometry.type !== "Point") {
        return;
      }

      const properties = feature.properties ?? {};
      const coords = geometry.coordinates as [number, number];

      if (hoverPopupRef.current) {
        hoverPopupRef.current.remove();
      }

      hoverPopupRef.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 12,
        className: "event-hover-popup",
      })
        .setLngLat(coords)
        .setHTML(buildPopupHTML(parseProperties(properties)))
        .addTo(map);
    };

    const handleMouseLeave = () => {
      if (hoverPopupRef.current) {
        hoverPopupRef.current.remove();
        hoverPopupRef.current = null;
      }
    };

    map.on("mousemove", LAYER_UNCLUSTERED, handleMouseMove);
    map.on("mouseleave", LAYER_UNCLUSTERED, handleMouseLeave);

    return () => {
      map.off("mousemove", LAYER_UNCLUSTERED, handleMouseMove);
      map.off("mouseleave", LAYER_UNCLUSTERED, handleMouseLeave);
      if (hoverPopupRef.current) {
        hoverPopupRef.current.remove();
        hoverPopupRef.current = null;
      }
    };
  }, [map, isLoaded]);

  // Selected event popup
  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }

    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    if (!selectedEventId) {
      return;
    }

    const features = map.querySourceFeatures("events", {
      filter: ["==", ["get", "id"], selectedEventId],
    });

    if (!features.length) {
      return;
    }

    const feature = features[0];
    const geometry = feature.geometry;
    if (geometry.type !== "Point") {
      return;
    }

    const coords = geometry.coordinates as [number, number];
    const properties = feature.properties ?? {};

    popupRef.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
      offset: 12,
      className: "event-selected-popup",
    })
      .setLngLat(coords)
      .setHTML(buildPopupHTML(parseProperties(properties)))
      .addTo(map);

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, [map, isLoaded, selectedEventId]);

  return (
    <style jsx global>{`
      .event-hover-popup .mapboxgl-popup-content,
      .event-selected-popup .mapboxgl-popup-content {
        background: rgba(24, 24, 27, 0.95);
        border: 1px solid rgba(63, 63, 70, 0.5);
        border-radius: 8px;
        padding: 8px 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(8px);
      }
      .event-hover-popup .mapboxgl-popup-tip,
      .event-selected-popup .mapboxgl-popup-tip {
        border-top-color: rgba(24, 24, 27, 0.95);
      }
      .event-selected-popup .mapboxgl-popup-close-button {
        color: #a1a1aa;
        font-size: 16px;
        padding: 2px 6px;
      }
      .event-selected-popup .mapboxgl-popup-close-button:hover {
        color: #f4f4f5;
        background: transparent;
      }
    `}</style>
  );
}

/**
 * Mapbox serializes nested objects to JSON strings in feature properties.
 * Parse them back to structured data when needed.
 */
function parseProperties(
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...raw };

  if (typeof result.categories === "string") {
    try {
      result.categories = JSON.parse(result.categories) as unknown;
    } catch {
      // keep as-is
    }
  }

  if (typeof result.magnitudeValue === "string") {
    const parsed = Number(result.magnitudeValue);
    result.magnitudeValue = Number.isNaN(parsed) ? null : parsed;
  }

  return result;
}
