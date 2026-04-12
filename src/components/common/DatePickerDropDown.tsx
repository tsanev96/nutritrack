"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { toDate, toDateStr } from "@/utils/dates";

type Props = Readonly<{
  label?: string;
  value: string;
  onChange: (date: string) => void;
  maxDate?: string;
}>;

export default function DatePickerDropDown({
  label,
  value,
  onChange,
  maxDate,
}: Props) {
  const [open, setOpen] = useState(false);
  const selected = toDate(value);

  return (
    <Field className="w-44">
      {label && <FieldLabel htmlFor="date">{label}</FieldLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button
            variant="outline"
            id="date"
            className="justify-start font-normal"
          >
            {selected.toLocaleDateString()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            captionLayout="dropdown"
            disabled={maxDate ? { after: toDate(maxDate) } : undefined}
            onSelect={(date) => {
              if (date) onChange(toDateStr(date));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
