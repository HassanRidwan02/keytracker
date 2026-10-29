const timeFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const shortDateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

const longDateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const mediumDateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function dayDiff(date, now) {
  const a = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const b = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((b - a) / 86_400_000);
}

/** "09:12 today" · "Yesterday, 16:32" · "12 May, 14:05" */
export function formatCollected(iso, now = new Date()) {
  const date = new Date(iso);
  const time = timeFmt.format(date);
  const diff = dayDiff(date, now);
  if (diff === 0) return `${time} today`;
  if (diff === 1) return `Yesterday, ${time}`;
  return `${shortDateFmt.format(date)}, ${time}`;
}

/** "Today, 10:04" · "Yesterday, 17:20" · "12 May, 14:05" */
export function formatEvent(iso, now = new Date()) {
  const date = new Date(iso);
  const time = timeFmt.format(date);
  const diff = dayDiff(date, now);
  if (diff === 0) return `Today, ${time}`;
  if (diff === 1) return `Yesterday, ${time}`;
  return `${shortDateFmt.format(date)}, ${time}`;
}

export const formatLongDate = (date = new Date()) => longDateFmt.format(date);
export const formatMediumDate = (date = new Date()) => mediumDateFmt.format(date);
export const formatTime = (date = new Date()) => timeFmt.format(date);
