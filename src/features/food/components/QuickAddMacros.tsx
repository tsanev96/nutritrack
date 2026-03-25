"use client";

import { useState } from "react";
import InputField from "@/components/common/InputField";
import { Macros } from "@/types";

// type Props = Readonly<{
//   macros: Macros;
//   disabled?: boolean;
//   onChange: (key: keyof Macros) => (val: number | string) => void;
// }>;

export default function QuickAddMacros() {
  const [macros, setMacros] = useState<Macros>({
    fats: 0,
    protein: 0,
    carbs: 0,
  });

  const setMacro = (key: keyof typeof macros) => (val: number | string) =>
    setMacros((prev) => ({ ...prev, [key]: Number(val) || 0 }));

  return (
    <div className="grid grid-cols-3 gap-3">
      <InputField
        label="Protein (g)"
        type="number"
        value={macros.protein}
        onChange={setMacro("protein")}
        placeholder="0"
        required={false}
        // disabled={disabled}
      />
      <InputField
        label="Carbs (g)"
        type="number"
        value={macros.carbs}
        onChange={setMacro("carbs")}
        placeholder="0"
        required={false}
        // disabled={disabled}
      />
      <InputField
        label="Fat (g)"
        type="number"
        value={macros.fats}
        onChange={setMacro("fats")}
        placeholder="0"
        required={false}
        // disabled={disabled}
      />
    </div>
  );
}
