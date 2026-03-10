import type { BodyMeasurements, CheckIn } from "@/types";

interface CheckInInput {
  date: string;
  weight: number;
  measurements: Record<keyof BodyMeasurements, string>;
}

export function addCheckInMeasurements({
  date,
  weight,
  measurements,
}: CheckInInput): CheckIn {
  return {
    date,
    weight: weight || undefined,
    measurements: {
      neck: measurements.neck ? Number(measurements.neck) : undefined,
      waist: measurements.waist ? Number(measurements.waist) : undefined,
      hips: measurements.hips ? Number(measurements.hips) : undefined,
    },
  };
}
