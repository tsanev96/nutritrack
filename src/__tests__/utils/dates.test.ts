import {
  getTodayDate,
  getYesterdayDate,
  formatDateLabel,
  getTomorrowDate,
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
