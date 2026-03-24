import { addCheckInMeasurements, getMeasurementsValues } from "@/utils/checkIn";
import type { CheckIn } from "@/types";
import { measurements } from "../constants";

describe("addCheckInMeasurements", () => {
  it("converts string measurements to numbers", () => {
    const result = addCheckInMeasurements({
      date: "2026-03-23",
      weight: 80,
      measurements: { neck: "38", waist: "90", hips: "100" },
    });
    expect(result).toEqual({
      date: "2026-03-23",
      weight: 80,
      measurements: { neck: 38, waist: 90, hips: 100 },
    });
  });

  it("sets empty string measurements to undefined", () => {
    const result = addCheckInMeasurements({
      date: "2026-03-23",
      weight: 80,
      measurements: { neck: "", waist: "", hips: "" },
    });
    expect(result.measurements.neck).toBeUndefined();
    expect(result.measurements.waist).toBeUndefined();
    expect(result.measurements.hips).toBeUndefined();
    expect(result).toEqual({
      date: "2026-03-23",
      weight: 80,
      measurements: { neck: undefined, waist: undefined, hips: undefined },
    });
  });

  it("sets weight to undefined when 0", () => {
    const result = addCheckInMeasurements({
      date: "2026-03-23",
      weight: 0,
      measurements: { neck: "", waist: "", hips: "" },
    });
    expect(result).toEqual({
      weight: undefined,
      date: "2026-03-23",
      measurements: {
        neck: undefined,
        waist: undefined,
        hips: undefined,
      },
    });
  });

  it("preserves weight when non-zero", () => {
    const result = addCheckInMeasurements({
      date: "2026-03-23",
      weight: 75,
      measurements: { neck: "", waist: "", hips: "" },
    });
    expect(result).toEqual({
      date: "2026-03-23",
      weight: 75,
      measurements: { neck: undefined, waist: undefined, hips: undefined },
    });
  });

  it("preserves the date", () => {
    const result = addCheckInMeasurements({
      date: "2026-01-01",
      weight: 0,
      measurements: { neck: "", waist: "", hips: "" },
    });
    expect(result.date).toBe("2026-01-01");
  });
});
describe("getMeasurementsValues", () => {
  it("converts number measurements to strings", () => {
    const checkIn: CheckIn = {
      date: "2026-03-23",
      measurements,
    };
    const result = getMeasurementsValues(checkIn);
    expect(result).toEqual({
      neck: measurements.neck.toString(),
      waist: measurements.waist.toString(),
      hips: measurements.hips.toString(),
    });
  });

  it("returns empty strings when measurements are undefined", () => {
    const checkIn: CheckIn = { date: "2026-03-23", measurements: {} };
    const result = getMeasurementsValues(checkIn);
    expect(result).toEqual({
      neck: "",
      waist: "",
      hips: "",
    });
  });

  it("returns empty strings when checkIn is undefined", () => {
    const result = getMeasurementsValues(undefined);
    expect(result).toEqual({
      neck: "",
      waist: "",
      hips: "",
    });
  });
});
