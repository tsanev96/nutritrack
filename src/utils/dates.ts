export function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export function getYesterdayDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function formatDateLabel(date: string): string {
  const today = getTodayDate();
  const yesterday = getYesterdayDate();
  if (date === today) return "Today";
  if (date === yesterday) return "Yesterday";
  return date;
}
