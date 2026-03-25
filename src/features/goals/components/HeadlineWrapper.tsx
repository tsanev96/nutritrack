"use client";

import Headline from "@/components/ui/Headline";

type Props = Readonly<{
  title: string;
  onEdit?: () => void;
  children?: React.ReactNode;
}>;

export default function HeadlineWrapper({ title, onEdit, children }: Props) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <Headline title={title} />
      {children}
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </button>
      )}
    </div>
  );
}
