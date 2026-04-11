"use client";

import { useState } from "react";
import { useStore } from "@/stores/useStore";
import CardSection from "@/components/common/CardSection";
import SaveActions from "../../../components/common/SaveActions";
import HeadlineWrapper from "./HeadlineWrapper";
import Rows from "./Rows";
import InputField from "@/components/common/InputField";

export default function WaterGoalSection() {
  const waterGoal = useStore((s) => s.waterGoal);
  const setWaterGoal = useStore((s) => s.setWaterGoal);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(String(waterGoal));

  function handleSave() {
    setWaterGoal(Number(form) || 0);
    setIsEditing(false);
  }

  function handleCancel() {
    setForm(String(waterGoal));
    setIsEditing(false);
  }

  return (
    <CardSection>
      <HeadlineWrapper title="Water" onEdit={() => setIsEditing(true)} />

      {isEditing ? (
        <div className="space-y-3">
          <InputField
            label="Daily goal (ml)"
            value={form}
            onChange={(value) => setForm(value)}
            type="number"
            placeholder="e.g. 2000"
          />
          <SaveActions onSave={handleSave} onCancel={handleCancel} />
        </div>
      ) : (
        <Rows rows={[{ label: "Daily goal", value: `${waterGoal} ml` }]} />
      )}
    </CardSection>
  );
}
