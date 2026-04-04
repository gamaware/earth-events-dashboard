"use client";

import { useCallback, useMemo, useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { StatsBar } from "@/components/stats/stats-bar";
import { MapContainer } from "@/components/map/map-container";
import { MapProvider } from "@/components/map/map-provider";
import { EventMarkers } from "@/components/map/event-markers";
import { EventPopup } from "@/components/map/event-popup";
import { MapControls } from "@/components/map/map-controls";
import { StormTracks } from "@/components/map/storm-tracks";
import { EventDetailPanel } from "@/components/events/event-detail-panel";
import { useFilters } from "@/lib/hooks/use-filters";
import { useEvents } from "@/lib/hooks/use-events";
import { useGeoJSON } from "@/lib/hooks/use-geojson";
import { CATEGORY_IDS } from "@/lib/constants/categories";

export function DashboardShell() {
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [filters, setFilters] = useFilters();

  const activeCategories = useMemo(
    () =>
      filters.categories.length > 0 ? filters.categories : [...CATEGORY_IDS],
    [filters.categories],
  );

  // Build API params — categories are NOT sent to API (filtered client-side via Mapbox setFilter)
  const apiParams = useMemo(
    () => ({
      status: filters.status === "all" ? undefined : filters.status,
      days: filters.days,
      source:
        filters.sources.length > 0 ? filters.sources.join(",") : undefined,
      refreshInterval: isAutoRefresh ? 60000 : undefined,
    }),
    [filters.status, filters.days, filters.sources, isAutoRefresh],
  );

  const {
    data: eventsData,
    isLoading: eventsLoading,
  } = useEvents(apiParams);
  const { data: geojsonData } = useGeoJSON(apiParams);

  const events = useMemo(() => eventsData?.events ?? [], [eventsData]);
  const geojsonFeatureCollection =
    (geojsonData as unknown as GeoJSON.FeatureCollection) ?? null;

  const handleCategoryToggle = useCallback(
    (id: string) => {
      const current = filters.categories;
      // When empty (all active), clicking one deselects it (show all except that one)
      if (current.length === 0) {
        void setFilters({
          categories: CATEGORY_IDS.filter((c) => c !== id),
        });
        return;
      }
      const updated = current.includes(id)
        ? current.filter((c) => c !== id)
        : [...current, id];
      // If all categories selected again, reset to empty (= all)
      void setFilters({
        categories:
          updated.length === CATEGORY_IDS.length ? [] : updated,
      });
    },
    [filters.categories, setFilters],
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      void setFilters({
        status: status as "open" | "closed" | "all",
      });
    },
    [setFilters],
  );

  const handleDaysChange = useCallback(
    (days: number) => {
      void setFilters({ days });
    },
    [setFilters],
  );

  const handleEventSelect = useCallback(
    (id: string) => {
      void setFilters({ event: filters.event === id ? "" : id });
    },
    [filters.event, setFilters],
  );

  const handleRefreshToggle = useCallback(() => {
    setIsAutoRefresh((prev) => !prev);
  }, []);

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === filters.event) ?? null,
    [events, filters.event],
  );

  const handleDetailClose = useCallback(() => {
    void setFilters({ event: "" });
  }, [setFilters]);

  return (
    <div className="flex h-screen flex-col">
      <Header
        onRefreshToggle={handleRefreshToggle}
        isAutoRefresh={isAutoRefresh}
        eventTitles={events.map((e) => e.title)}
        onEventSearch={(title) => {
          const found = events.find((e) => e.title === title);
          if (found) handleEventSelect(found.id);
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          events={events}
          categories={filters.categories}
          onCategoryToggle={handleCategoryToggle}
          activeCategories={activeCategories}
          status={filters.status}
          onStatusChange={handleStatusChange}
          days={filters.days}
          onDaysChange={handleDaysChange}
          selectedEventId={filters.event || null}
          onEventSelect={handleEventSelect}
          isLoading={eventsLoading}
        />

        <main className="relative flex-1">
          <MapProvider>
            <MapContainer />
            <EventMarkers
              geojsonData={geojsonFeatureCollection}
              activeCategories={activeCategories}
              onEventClick={handleEventSelect}
            />
            <EventPopup selectedEventId={filters.event || null} />
            <StormTracks events={events} activeCategories={activeCategories} />
            <MapControls />
          </MapProvider>

          <StatsBar events={events} isLoading={eventsLoading} />
        </main>

        <MobileDrawer
          events={events}
          categories={filters.categories}
          onCategoryToggle={handleCategoryToggle}
          activeCategories={activeCategories}
          status={filters.status}
          onStatusChange={handleStatusChange}
          days={filters.days}
          onDaysChange={handleDaysChange}
          selectedEventId={filters.event || null}
          onEventSelect={handleEventSelect}
          isLoading={eventsLoading}
        />
      </div>

      <EventDetailPanel event={selectedEvent} onClose={handleDetailClose} />
    </div>
  );
}
