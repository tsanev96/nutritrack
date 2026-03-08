type Props = Readonly<{
  onSave: () => void;
  onCancel: () => void;
}>;

export default function SaveActions({ onCancel, onSave }: Props) {
  return (
    <div className="flex gap-2 pt-1">
      <button
        onClick={onSave}
        className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="flex-1 rounded-md border py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
      >
        Cancel
      </button>
    </div>
  );
}
