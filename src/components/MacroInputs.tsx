"use client";

import InputField from "./common/InputField";

type Macros = { fats: number; protein: number; carbs: number };

type Props = Readonly<{
  macros: Macros;
  onChange: (key: keyof Macros) => (val: number | string) => void;
}>;

export default function MacroInputs({ macros, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <InputField
        label="Protein (g)"
        type="number"
        value={macros.protein}
        onChange={onChange("protein")}
        placeholder="0"
        required={false}
      />
      <InputField
        label="Carbs (g)"
        type="number"
        value={macros.carbs}
        onChange={onChange("carbs")}
        placeholder="0"
        required={false}
      />
      <InputField
        label="Fat (g)"
        type="number"
        value={macros.fats}
        onChange={onChange("fats")}
        placeholder="0"
        required={false}
      />
    </div>
  );
}
