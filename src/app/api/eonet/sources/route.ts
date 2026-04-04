import { NextResponse } from "next/server";

const EONET_BASE = "https://eonet.gsfc.nasa.gov/api/v3";

export async function GET() {
  try {
    const response = await fetch(`${EONET_BASE}/sources`, {
      next: { revalidate: 86400 },
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
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
