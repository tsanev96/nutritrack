"use client";

import { useState } from "react";
import { useTrackerStore } from "@/stores/useTrackerStore";
import CardSection from "@/components/common/CardSection";
import SaveActions from "../../../components/common/SaveActions";
import HeadlineWrapper from "./HeadlineWrapper";
import Rows from "./Rows";
import InputField from "@/components/common/InputField";

export default function WaterGoalSection() {
  const waterGoals = useTrackerStore((s) => s.waterGoals);
  const setWaterGoals = useTrackerStore((s) => s.setWaterGoals);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(String(waterGoals));

  function handleSave() {
    setWaterGoals(Number(form) || 0);
    setIsEditing(false);
  }

  function handleCancel() {
    setForm(String(waterGoals));
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
        <Rows rows={[{ label: "Daily goal", value: `${waterGoals} ml` }]} />
      )}
    </CardSection>
  );
}
