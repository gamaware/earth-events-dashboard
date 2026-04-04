import { describe, it, expect, vi, afterEach } from "vitest";
import {
  formatDate,
  formatDateTime,
  formatMagnitude,
  formatCoordinates,
  timeAgo,
} from "@/lib/utils/format";

describe("formatDate", () => {
  it("formats a valid ISO date", () => {
    const result = formatDate("2026-04-03T14:30:00Z");
    expect(result).toMatch(/Apr\s+3,\s+2026/);
  });

  it("returns 'Invalid date' for garbage input", () => {
    expect(formatDate("not-a-date")).toBe("Invalid date");
  });

  it("handles dates without time component", () => {
    const result = formatDate("2025-12-25T12:00:00Z");
    expect(result).toMatch(/Dec\s+25,\s+2025/);
  });
});

describe("formatDateTime", () => {
  it("formats a valid ISO datetime with time", () => {
    const result = formatDateTime("2026-04-03T14:30:00Z");
    expect(result).toContain("2026");
    expect(result).toMatch(/Apr/);
  });

  it("returns 'Invalid date' for garbage input", () => {
    expect(formatDateTime("nope")).toBe("Invalid date");
  });
});

describe("formatMagnitude", () => {
  it("formats value with unit", () => {
    expect(formatMagnitude(655.7, "acres")).toBe("655.7 acres");
  });

  it("formats value with Mw unit", () => {
    expect(formatMagnitude(4.5, "Mw")).toBe("4.5 Mw");
  });

  it("returns N/A for null value", () => {
    expect(formatMagnitude(null, "acres")).toBe("N/A");
  });

  it("returns value as string when unit is null", () => {
    expect(formatMagnitude(42, null)).toBe("42");
  });

  it("returns N/A when both are null", () => {
    expect(formatMagnitude(null, null)).toBe("N/A");
  });

  it("handles zero value", () => {
    expect(formatMagnitude(0, "km")).toBe("0 km");
  });
});

describe("formatCoordinates", () => {
  it("formats northern and western coordinates", () => {
    expect(formatCoordinates([-92.7, 45.7])).toBe("45.7\u00B0N, 92.7\u00B0W");
  });

  it("formats southern and eastern coordinates", () => {
    expect(formatCoordinates([151.2, -33.9])).toBe("33.9\u00B0S, 151.2\u00B0E");
  });

  it("handles equator and prime meridian", () => {
    expect(formatCoordinates([0, 0])).toBe("0.0\u00B0N, 0.0\u00B0E");
  });

  it("returns N/A for empty array", () => {
    expect(formatCoordinates([])).toBe("N/A");
  });

  it("returns N/A for single-element array", () => {
    expect(formatCoordinates([42])).toBe("N/A");
  });
});

describe("timeAgo", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'just now' for very recent timestamps", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-03T12:00:30Z"));
    expect(timeAgo("2026-04-03T12:00:00Z")).toBe("just now");
  });

  it("returns minutes ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-03T12:05:00Z"));
    expect(timeAgo("2026-04-03T12:00:00Z")).toBe("5 minutes ago");
  });

  it("returns '1 minute ago' for singular", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-03T12:01:00Z"));
    expect(timeAgo("2026-04-03T12:00:00Z")).toBe("1 minute ago");
  });

  it("returns hours ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-03T14:00:00Z"));
    expect(timeAgo("2026-04-03T12:00:00Z")).toBe("2 hours ago");
  });

  it("returns '1 hour ago' for singular", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-03T13:00:00Z"));
    expect(timeAgo("2026-04-03T12:00:00Z")).toBe("1 hour ago");
  });

  it("returns days ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-06T12:00:00Z"));
    expect(timeAgo("2026-04-03T12:00:00Z")).toBe("3 days ago");
  });

  it("returns '1 day ago' for singular", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-04T12:00:00Z"));
    expect(timeAgo("2026-04-03T12:00:00Z")).toBe("1 day ago");
  });

  it("returns weeks ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-17T12:00:00Z"));
    expect(timeAgo("2026-04-03T12:00:00Z")).toBe("2 weeks ago");
  });

  it("returns months ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-03T12:00:00Z"));
    expect(timeAgo("2026-04-03T12:00:00Z")).toBe("3 months ago");
  });

  it("returns years ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2028-04-03T12:00:00Z"));
    expect(timeAgo("2026-04-03T12:00:00Z")).toBe("2 years ago");
  });

  it("returns 'Invalid date' for garbage input", () => {
    expect(timeAgo("garbage")).toBe("Invalid date");
  });

  it("returns 'just now' for future dates", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-03T12:00:00Z"));
    expect(timeAgo("2026-04-03T13:00:00Z")).toBe("just now");
  });
});
