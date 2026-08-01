type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="space-y-2">
      {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.25em] text-black/60">{eyebrow}</p> : null}
      <h1 className="text-4xl font-black sm:text-5xl">{title}</h1>
      {description ? <p className="max-w-3xl text-base leading-7 text-black/80">{description}</p> : null}
    </div>
  );
}
