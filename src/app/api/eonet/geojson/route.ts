import { NextRequest, NextResponse } from "next/server";

const EONET_BASE = "https://eonet.gsfc.nasa.gov/api/v3";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const upstream = new URL(`${EONET_BASE}/events/geojson`);

    for (const [key, value] of searchParams.entries()) {
      upstream.searchParams.set(key, value);
    }

    const response = await fetch(upstream.toString(), {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `EONET API returned ${response.status}` },
        { status: 502 },
      );
    }

    const data: unknown = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
