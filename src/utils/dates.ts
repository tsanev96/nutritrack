export function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export function getYesterdayDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function getTomorrowDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function toDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00");
}

export function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDateLabel(date: string): string {
  const today = getTodayDate();
  const yesterday = getYesterdayDate();
  const tomorrow = getTomorrowDate();

  switch (date) {
    case today:
      return "Today";
    case yesterday:
      return "Yesterday";
    case tomorrow:
      return "Tomorrow";
    default:
      return date;
  }
}
