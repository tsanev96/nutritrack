import { twMerge } from "tailwind-merge";

type Props = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

export default function PageWrapper({ children, className = "" }: Props) {
  return (
    <section className="flex-1 bg-slate-50 p-6">
      <div
        className={twMerge(
          "mx-auto w-full max-w-xl md:max-w-2xl lg:max-w-4xl px-4 space-y-4",
          className,
        )}
      >
        {children}
      </div>
    </section>
  );
}
