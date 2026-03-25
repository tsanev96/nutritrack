import Button from "@/components/Button";

type Props = Readonly<{
  onSave: () => void;
  onCancel: () => void;
}>;

export default function SaveActions({ onCancel, onSave }: Props) {
  return (
    <div className="flex gap-2 pt-1">
      <Button onClick={onSave} className="flex-1">
        Save
      </Button>
      <Button onClick={onCancel} variant="secondary" className="flex-1">
        Cancel
      </Button>
    </div>
  );
}
