"use client";

import { useState } from "react";
import { useStore } from "@/stores/useStore";
import type { MicroNutrients } from "@/types";
import { MICRO_NUTRIENTS_NAMES } from "@/config/constants";
import CardSection from "@/components/common/CardSection";
import SaveActions from "../../../components/common/SaveActions";
import HeadlineWrapper from "./HeadlineWrapper";
import InputField from "@/components/common/InputField";
import Paragraph from "@/components/ui/Paragraph";

type MicroKey = keyof MicroNutrients;

const GROUPS: { label: string; keys: MicroKey[] }[] = [
  {
    label: "Fats",
    keys: ["saturatedFat", "polyunsaturatedFat", "monounsaturatedFat", "transFat"],
  },
  { label: "Carbohydrates", keys: ["fiber", "sugar"] },
  { label: "Minerals", keys: ["cholesterol", "sodium", "potassium", "calcium", "iron"] },
  { label: "Vitamins", keys: ["vitaminA", "vitaminC", "vitaminD", "vitaminE", "vitaminK"] },
];

type GroupProps = {
  label: string;
  keys: MicroKey[];
  goals: MicroNutrients;
  isEditing: boolean;
  form: Record<MicroKey, string>;
  onFormChange: (key: MicroKey, value: string) => void;
};

function MicroGroup({ label, keys, goals, isEditing, form, onFormChange }: Readonly<GroupProps>) {
  return (
    <div className="mb-4 last:mb-0">
      <Paragraph>{label}</Paragraph>
      {isEditing ? (
        <div className="grid grid-cols-2 gap-2">
          {keys.map((key) => (
            <InputField
              key={key}
              label={`${MICRO_NUTRIENTS_NAMES[key]} (${goals[key].unit})`}
              onChange={(value) => onFormChange(key, value)}
              type="number"
              min={0}
              value={form[key]}
            />
          ))}
        </div>
      ) : (
        <ul className="divide-y">
          {keys.map((key) => (
            <li key={key} className="flex justify-between py-1.5 text-sm">
              <span className="text-gray-500">{MICRO_NUTRIENTS_NAMES[key]}</span>
              <span className="font-medium text-gray-900">
                {goals[key].value} {goals[key].unit}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function MicronutrientsSection() {
  const goals = useStore((s) => s.microNutrientGoals);
  const setGoals = useStore((s) => s.setMicroNutrientGoals);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Record<MicroKey, string>>(
    Object.fromEntries(
      Object.entries(goals).map(([k, v]) => [k, String(v.value)]),
    ) as Record<MicroKey, string>,
  );

  function handleFormChange(key: MicroKey, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleSave() {
    const updated = Object.fromEntries(
      Object.entries(goals).map(([k, v]) => [
        k,
        { value: Number(form[k as MicroKey]) || 0, unit: v.unit },
      ]),
    ) as MicroNutrients;
    setGoals(updated);
    setIsEditing(false);
  }

  function handleCancel() {
    setForm(
      Object.fromEntries(
        Object.entries(goals).map(([k, v]) => [k, String(v.value)]),
      ) as Record<MicroKey, string>,
    );
    setIsEditing(false);
  }

  return (
    <CardSection>
      <HeadlineWrapper title="Micronutrients" onEdit={() => setIsEditing(true)} />

      {GROUPS.map(({ label, keys }) => (
        <MicroGroup
          key={label}
          label={label}
          keys={keys}
          goals={goals}
          isEditing={isEditing}
          form={form}
          onFormChange={handleFormChange}
        />
      ))}

      {isEditing && <SaveActions onSave={handleSave} onCancel={handleCancel} />}
    </CardSection>
  );
}
