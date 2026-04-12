import {
  getTodayDate,
  getYesterdayDate,
  formatDateLabel,
  getTomorrowDate,
  toDate,
  toDateStr,
} from "@/utils/dates";
import { DATE_FORMAT_PATTERN, msDay } from "../constants";

describe("getTodayDate", () => {
  it("returns a date string in YYYY-MM-DD format", () => {
    expect(getTodayDate()).toMatch(DATE_FORMAT_PATTERN);
  });

  it("matches today's date", () => {
    const expected = new Date().toISOString().split("T")[0];
    expect(getTodayDate()).toBe(expected);
  });
});

describe("getYesterdayDate", () => {
  it("returns a date string in YYYY-MM-DD format", () => {
    expect(getYesterdayDate()).toMatch(DATE_FORMAT_PATTERN);
  });

  it("is one day before today", () => {
    const today = getTodayDate();
    const yesterday = getYesterdayDate();
    const diff = new Date(today).getTime() - new Date(yesterday).getTime();
    expect(diff).toBe(msDay);
  });
});

describe("getTomorrowDate", () => {
  it("returns a date string in YYYY-MM-DD format", () => {
    expect(getTomorrowDate()).toMatch(DATE_FORMAT_PATTERN);
  });

  it("is one day after today", () => {
    const today = getTodayDate();
    const tomorrow = getTomorrowDate();
    const diff = new Date(tomorrow).getTime() - new Date(today).getTime();
    expect(diff).toBe(msDay);
  });
});

describe("toDate", () => {
  it("parses a YYYY-MM-DD string into a Date", () => {
    const date = toDate("2024-01-15");
    expect(date).toBeInstanceOf(Date);
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(15);
  });

  it("does not shift the day due to timezone offset", () => {
    const date = toDate("2024-06-01");
    expect(date.getDate()).toBe(1);
  });
});

describe("toDateStr", () => {
  it("formats a Date into a YYYY-MM-DD string", () => {
    const date = new Date("2024-01-15T00:00:00");
    expect(toDateStr(date)).toBe("2024-01-15");
  });

  it("round-trips with toDate", () => {
    const original = "2024-06-15";
    expect(toDateStr(toDate(original))).toBe(original);
  });
});

describe("formatDateLabel", () => {
  it("returns 'Today' for today's date", () => {
    expect(formatDateLabel(getTodayDate())).toBe("Today");
  });

  it("returns 'Yesterday' for yesterday's date", () => {
    expect(formatDateLabel(getYesterdayDate())).toBe("Yesterday");
  });

  it("returns 'Tomorrow' for tomorrow's date", () => {
    expect(formatDateLabel(getTomorrowDate())).toBe("Tomorrow");
  });

  it("returns the date string as-is for older dates", () => {
    expect(formatDateLabel("2024-01-15")).toBe("2024-01-15");
  });
});
