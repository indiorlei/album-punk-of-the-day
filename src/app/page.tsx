"use client";

import { useEffect, useState } from "react";

type Album = {
  rank: number;
  artist: string;
  album: string;
  year: number;
  genres: string[];
  country: string;
  city_scene: string | null;
  decade: string;
  essential: boolean;
  influence: string;
  spotify_search: string;
};

type DailyAlbum = { album: Album; date: string; drawNumber: number; total: number; coverUrl: string; random?: boolean };

const genreName = (genre: string) => genre.replaceAll("_", " ");

export default function Home() {
  const [daily, setDaily] = useState<DailyAlbum | null>(null);
  const [error, setError] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const [drawing, setDrawing] = useState(false);

  const loadAlbum = (random = false) => {
    setDrawing(true);
    setCoverFailed(false);
    fetch(random ? "/api/album-of-the-day?random=1" : "/api/album-of-the-day")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch the album");
        return response.json();
      })
      .then(setDaily)
      .catch(() => setError(true))
      .finally(() => setDrawing(false));
  };

  useEffect(() => {
    loadAlbum();
  }, []);

  if (error) {
    return <main className="grid min-h-dvh place-items-center p-6 text-center"><p>Couldn&apos;t load today&apos;s album. Refresh the page to try again.</p></main>;
  }

  if (!daily) {
    return <main className="noise grid min-h-dvh place-items-center bg-[#17130f] p-6"><p className="animate-pulse text-xl font-black uppercase tracking-[.2em]">Cueing up today&apos;s sound…</p></main>;
  }

  const { album } = daily;
  const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(album.spotify_search)}`;

  return (
    <main className="noise flex min-h-dvh flex-col overflow-y-auto bg-[#17130f] px-5 py-6 sm:px-10 sm:py-8 lg:h-dvh lg:min-h-0 lg:overflow-hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <header className="mb-8 flex items-start justify-between gap-6 border-b-4 border-[#f1ead8] pb-4 lg:mb-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[.24em] text-[#d7ff00]">Daily draw · Punk / Hardcore</p>
            <h1 className="text-3xl font-black uppercase leading-none sm:text-4xl lg:text-5xl">Punk Album<br />of the Day</h1>
          </div>
          <span className="cut shrink-0 bg-[#f0422a] px-3 py-2 text-xs font-black uppercase text-[#17130f]">{daily.date.split("-").reverse().join(".")}</span>
        </header>

        <section className="grid flex-1 items-center gap-8 lg:min-h-0 lg:grid-cols-[minmax(260px,380px)_1fr] lg:gap-12">
          <div className="relative mx-auto w-full max-w-[360px] lg:max-h-full">
            <div className="absolute -inset-3 rotate-[-3deg] border-2 border-[#f0422a]" aria-hidden="true" />
            <div className="relative aspect-square overflow-hidden border-4 border-[#f1ead8] bg-[#d7ff00] shadow-[10px_10px_0_#f0422a]">
              {daily.coverUrl && !coverFailed ? (
                <img
                  src={daily.coverUrl}
                  alt={`Cover of ${album.album}, ${album.artist}`}
                  className="h-full w-full object-cover"
                  onError={() => setCoverFailed(true)}
                />
              ) : (
                <div className="flex h-full flex-col justify-between p-6 text-[#17130f] sm:p-8">
                  <span className="text-7xl font-black leading-none">{String(album.rank).padStart(3, "0")}</span>
                  <div><p className="text-3xl font-black uppercase leading-none">{album.album}</p><p className="mt-2 font-bold uppercase">{album.artist}</p></div>
                </div>
              )}
            </div>
            <p className="relative mt-4 text-center text-[10px] font-bold uppercase tracking-[.2em] text-[#f1ead8]/60">Cover via Apple Music</p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1fr_minmax(240px,300px)] xl:items-start xl:gap-10">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[.18em] text-[#d7ff00]">Record #{daily.drawNumber.toString().padStart(3, "0")} of {daily.total}</p>
              <h2 className="text-4xl font-black uppercase leading-[.85] tracking-[-.055em] sm:text-5xl lg:text-6xl">{album.album}</h2>
              <p className="mt-4 text-xl font-bold sm:text-2xl">{album.artist}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {album.genres.map((genre) => <span className="border-2 border-[#f1ead8] px-3 py-1 text-xs font-bold uppercase" key={genre}>{genreName(genre)}</span>)}
              </div>
            </div>

            <aside className="cut border-4 border-[#f1ead8] bg-[#f1ead8] p-1 text-[#17130f]">
              <div className="cut bg-[#d7ff00] p-5 sm:p-6">
                <p className="text-sm font-black uppercase tracking-[.16em]">Record sheet</p>
                <dl className="mt-5 grid gap-3 text-base font-bold">
                  <div className="flex justify-between gap-4 border-b-2 border-[#17130f] pb-2"><dt>Year</dt><dd>{album.year}</dd></div>
                  <div className="flex justify-between gap-4 border-b-2 border-[#17130f] pb-2"><dt>Origin</dt><dd className="text-right">{album.country}</dd></div>
                  <div className="flex justify-between gap-4 border-b-2 border-[#17130f] pb-2"><dt>Scene</dt><dd className="text-right">{album.city_scene ?? "—"}</dd></div>
                  <div className="flex justify-between gap-4 border-b-2 border-[#17130f] pb-2"><dt>Decade</dt><dd>{album.decade}</dd></div>
                </dl>
                <a className="mt-5 inline-flex bg-[#17130f] px-5 py-3 text-sm font-black uppercase tracking-wider text-[#f1ead8] transition hover:bg-[#f0422a]" href={spotifyUrl} target="_blank" rel="noreferrer">Listen on Spotify ↗</a>
              </div>
            </aside>
          </div>
        </section>

        <footer className="mt-6 flex flex-col gap-4 border-t border-[#f1ead8]/50 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-[#f1ead8]/70">
            One album is picked each day and never repeats the previous day&apos;s draw.
          </p>
          <button
            type="button"
            onClick={() => loadAlbum(true)}
            disabled={drawing}
            className="cut shrink-0 self-start bg-[#d7ff00] px-6 py-3 text-sm font-black uppercase tracking-wider text-[#17130f] transition hover:bg-[#f0422a] hover:text-[#f1ead8] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            {drawing ? "Drawing…" : "Draw ↻"}
          </button>
        </footer>
      </div>
    </main>
  );
}
