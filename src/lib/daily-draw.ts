import catalog from "./_data/250-punk-hardcore-ska-punk-emo-internacional-v2.json";

export type Album = (typeof catalog.albums)[number];

const TIME_ZONE = "America/Sao_Paulo";

function dateInTimeZone(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${value("year")}-${value("month")}-${value("day")}`;
}

function previousDate(date: string) {
  const previous = new Date(`${date}T12:00:00Z`);
  previous.setUTCDate(previous.getUTCDate() - 1);
  return previous.toISOString().slice(0, 10);
}

// A stable hash makes the daily draw survive server restarts and deployments.
function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function drawIndex(date: string) {
  return hash(`punk-album-of-the-day:${date}`) % catalog.albums.length;
}

export function getDailyAlbum(now = new Date()) {
  const date = dateInTimeZone(now);
  const yesterdayIndex = drawIndex(previousDate(date));
  let index = drawIndex(date);

  // The current day can never select yesterday's number.
  if (index === yesterdayIndex) {
    index = (index + 1) % catalog.albums.length;
  }

  const album = catalog.albums[index] as Album;

  return {
    album,
    date,
    drawNumber: album.rank,
    total: catalog.albums.length,
  };
}

// Picks a uniformly random album. Used by the manual "Draw" button; it does
// not affect the deterministic album of the day.
export function getRandomAlbum(now = new Date()) {
  const index = Math.floor(Math.random() * catalog.albums.length);
  const album = catalog.albums[index] as Album;

  return {
    album,
    date: dateInTimeZone(now),
    drawNumber: album.rank,
    total: catalog.albums.length,
    random: true as const,
  };
}
