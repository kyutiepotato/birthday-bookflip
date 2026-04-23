import type { Spread } from "@/data/book";

/** Decorative gold corner ornaments on each page. */
const Corners = () => (
  <>
    <span className="pointer-events-none absolute left-3 top-3 h-8 w-8 border-l-2 border-t-2 border-gold/70 rounded-tl-sm" />
    <span className="pointer-events-none absolute right-3 top-3 h-8 w-8 border-r-2 border-t-2 border-gold/70 rounded-tr-sm" />
    <span className="pointer-events-none absolute left-3 bottom-3 h-8 w-8 border-l-2 border-b-2 border-gold/70 rounded-bl-sm" />
    <span className="pointer-events-none absolute right-3 bottom-3 h-8 w-8 border-r-2 border-b-2 border-gold/70 rounded-br-sm" />
  </>
);

interface PageProps {
  side: "left" | "right";
  spread: Spread;
  /** For "photos" spreads with two images, which image to show on this side. */
  photoIndex?: number;
}

/** A single physical page surface. Renders the appropriate half of a spread. */
export const PageContent = ({ side, spread, photoIndex }: PageProps) => {
  const isLeft = side === "left";

  return (
    <div className="relative h-full w-full paper overflow-hidden flex flex-col">
      <Corners />

      {/* Inner gutter shadow to imply the spine */}
      <div
        className={`pointer-events-none absolute top-0 bottom-0 w-12 ${
          isLeft ? "right-0 bg-gradient-to-l from-black/15 to-transparent" : "left-0 bg-gradient-to-r from-black/15 to-transparent"
        }`}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-8 text-center">
        {spread.type === "greeting" && isLeft && (
          <div className="animate-fade-up max-w-md">
            <p className="script text-2xl text-primary/70 mb-4">a keepsake for</p>
            <h2 className="serif text-4xl sm:text-5xl gold-text font-semibold mb-3">21</h2>
            <div className="h-px w-24 bg-gold/60 mx-auto mb-6" />
            <p className="script text-3xl text-primary">{spread.subtitle}</p>
          </div>
        )}

        {spread.type === "greeting" && !isLeft && (
          <div className="animate-fade-up max-w-md" style={{ animationDelay: "0.2s" }}>
            <h1 className="serif text-3xl sm:text-4xl text-primary leading-tight mb-6">
              {spread.title}
            </h1>
            <div className="h-px w-16 bg-gold/60 mx-auto mb-4" />
            <p className="serif italic text-sm sm:text-base text-foreground/80 leading-relaxed">{spread.body}</p>
            
          </div>
        )}

        {spread.type === "photos" && (() => {
          const idx = photoIndex ?? (isLeft ? 0 : 1);
          const img = spread.images[idx] ?? spread.images[0];
          const showHeading = isLeft;
          return (
            <div className="w-full h-full min-h-0 flex flex-col items-center justify-center gap-3 animate-fade-up">
              {showHeading && (
                <h3 className="serif text-2xl sm:text-3xl text-primary shrink-0">{spread.heading}</h3>
              )}
              <div className="relative flex-1 min-h-0 w-auto max-w-[85%] aspect-[4/5] shadow-page rounded-sm overflow-hidden border-4 border-card">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-gold/40" />
              </div>
              {!showHeading && (
                <p className="script text-xl text-primary/90 px-4 max-w-sm shrink-0">{spread.caption}</p>
              )}
            </div>
          );
        })()}

        {spread.type === "finale" && isLeft && (
          <div className="animate-fade-up max-w-sm">
            <p className="script text-2xl text-primary/70 mb-4">and finally…</p>
            <h3 className="serif text-3xl text-primary mb-4">The Star of Today</h3>
            <div className="h-px w-20 bg-gold/60 mx-auto" />
            <p className="serif italic text-base text-foreground/75 mt-6 leading-relaxed">
              Some chapters deserve a portrait of their own. This one belongs to you.
            </p>
          </div>
        )}

        {spread.type === "finale" && !isLeft && (
          <div className="w-full h-full min-h-0 flex flex-col items-center justify-center gap-3 animate-fade-up">
            <div className="relative flex-1 min-h-0 w-auto max-w-[80%] aspect-[4/5] shadow-page rounded-sm overflow-hidden border-4 border-card">
              <img src={spread.image} alt={spread.alt} loading="lazy" className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-gold/40" />
            </div>
            <p className="script text-lg text-primary/80 shrink-0">{spread.signature}</p>
          </div>
        )}
      </div>
    </div>
  );
};

/** Mobile single-page renderer — shows one logical "side" at a time. */
export const MobilePage = ({ spread, side, photoIndex }: PageProps) => {
  if (spread.type === "finale" && side === "right") {
    return (
      <div className="paper relative w-full min-h-[80vh] flex flex-col items-center justify-start gap-4 px-6 py-10">
        <Corners />
        <h3 className="serif text-2xl text-primary text-center">For You, Always</h3>
        <div className="relative w-full max-w-md aspect-[4/5] shadow-page rounded-sm overflow-hidden border-4 border-card">
          <img src={spread.image} alt={spread.alt} className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-gold/40" />
        </div>
        <p className="serif italic text-base text-foreground/80 text-center leading-relaxed mt-2 animate-fade-up">
          {spread.wish}
        </p>
        <p className="script text-xl text-primary/80">{spread.signature}</p>
      </div>
    );
  }
  return (
    <div className="paper relative w-full min-h-[80vh]">
      <PageContent side={side} spread={spread} photoIndex={photoIndex} />
    </div>
  );
};
