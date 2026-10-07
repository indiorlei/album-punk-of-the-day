import { NextResponse } from "next/server";
import { getDailyAlbum, getRandomAlbum } from "@/lib/daily-draw";

export const dynamic = "force-dynamic";

async function findCover(artist: string, album: string) {
  try {
    const query = encodeURIComponent(`${artist} ${album}`);
    const response = await fetch(
      `https://itunes.apple.com/search?term=${query}&entity=album&limit=8`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) return "";

    const data = await response.json();
    const normalizedArtist = artist.toLowerCase();
    const normalizedAlbum = album.toLowerCase();
    const match = data.results?.find(
      (result: { artistName?: string; collectionName?: string }) =>
        result.artistName?.toLowerCase().includes(normalizedArtist) &&
        result.collectionName?.toLowerCase().includes(normalizedAlbum)
    ) ?? data.results?.[0];

    return match?.artworkUrl100?.replace("100x100", "600x600") ?? "";
  } catch {
    return "";
  }
}

export async function GET(request: Request) {
  const isRandom = new URL(request.url).searchParams.get("random") === "1";
  const draw = isRandom ? getRandomAlbum() : getDailyAlbum();
  const coverUrl = await findCover(draw.album.artist, draw.album.album);

  return NextResponse.json({ ...draw, coverUrl }, {
    headers: {
      "Cache-Control": isRandom
        ? "no-store"
        : "public, s-maxage=3600, stale-while-revalidate=60",
    },
  });
}
