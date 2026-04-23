import { useCallback, useEffect, useMemo, useRef, useState, forwardRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight, Music, Music2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { spreads, BIRTHDAY_NAME } from "@/data/book";
import { PageContent } from "./PageContent";
import coverTexture from "@/assets/cover-texture.jpg";

/** Realistic flipbook powered by react-pageflip — follows the official demo pattern. */

type PageFlipRef = {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
    turnToPage: (p: number) => void;
    getPageCount: () => number;
  };
};

/** Hard cover page — must use data-density="hard" so the library renders it as a rigid cover. */
const PageCover = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  ({ children }, ref) => (
    <div
      className="page page-cover relative overflow-hidden"
      ref={ref}
      data-density="hard"
      style={{
        backgroundImage: `url(${coverTexture})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="page-content h-full w-full">{children}</div>
    </div>
  )
);
PageCover.displayName = "PageCover";

/** Inner soft page. */
const Page = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  ({ children }, ref) => (
    <div className="page bg-card" ref={ref}>
      <div className="page-content h-full w-full">{children}</div>
    </div>
  )
);
Page.displayName = "Page";

const CoverFront = () => (
  <div
    className="relative h-full w-full flex flex-col items-center justify-center text-center px-8"
    style={{
      backgroundImage: `linear-gradient(135deg, hsl(350 60% 22% / 0.85), hsl(350 55% 30% / 0.7)), url(${coverTexture})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <span className="pointer-events-none absolute inset-3 border border-gold/50 rounded-sm" />
    <span className="pointer-events-none absolute inset-5 border border-gold/30 rounded-sm" />
    <p className="script text-lg sm:text-xl text-secondary/90 mb-2 animate-shimmer">a keepsake for</p>
    <h2 className="serif font-bold text-3xl sm:text-4xl gold-text mb-3 leading-tight">{BIRTHDAY_NAME}</h2>
    <div className="h-px w-20 bg-gold/70 mb-4" />
    <h1 className="serif italic text-base sm:text-lg text-secondary/90 tracking-widest">Twenty·One</h1>
    <p className="script text-sm text-secondary/70 mt-6 animate-shimmer">tap to open →</p>
  </div>
);

const CoverBack = () => (
  <div
    className="relative h-full w-full flex flex-col items-center justify-center text-center px-8"
    style={{
      backgroundImage: `linear-gradient(135deg, hsl(350 60% 22% / 0.85), hsl(350 55% 30% / 0.7)), url(${coverTexture})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <span className="pointer-events-none absolute inset-3 border border-gold/50 rounded-sm" />
    <p className="script text-2xl text-secondary/90 mb-2 animate-shimmer">the end</p>
    <div className="h-px w-20 bg-gold/60 mb-4" />
    <p className="serif italic text-xl sm:text-2xl text-secondary/90">
      Happy 21st, {BIRTHDAY_NAME}.
      <br />I love you, always.
    </p>
    <p className="script text-base text-secondary/70 mt-6 animate-shimmer">♥</p>
  </div>
);

const Flipbook = () => {
  const bookRef = useRef<PageFlipRef | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [size, setSize] = useState({ w: 500, h: 700 });

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        const w = Math.min(window.innerWidth - 32, 380);
        setSize({ w, h: Math.round(w * 1.4) });
      } else {
        const h = Math.min(window.innerHeight - 220, 720);
        const w = Math.round(h * 0.7);
        setSize({ w, h });
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const next = useCallback(() => bookRef.current?.pageFlip()?.flipNext(), []);
  const prev = useCallback(() => bookRef.current?.pageFlip()?.flipPrev(), []);
  const restart = () => bookRef.current?.pageFlip()?.turnToPage(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  useEffect(() => {
    if (!audioRef.current) {
      const a = new Audio(
        "https://cdn.pixabay.com/audio/2023/10/12/audio_d75b37e7b0.mp3"
      );
      a.loop = true;
      a.volume = 0.35;
      audioRef.current = a;
    }
    if (musicOn) audioRef.current.play().catch(() => setMusicOn(false));
    else audioRef.current.pause();
  }, [musicOn]);

  // Build the array of page elements: front cover, then for each spread two inner pages, then back cover.
  const pages = useMemo(() => {
    const els: React.ReactNode[] = [];
    els.push(
      <PageCover key="cover-front">
        <CoverFront />
      </PageCover>
    );
    spreads.forEach((spread, i) => {
      if (spread.type === "photos") {
        els.push(
          <Page key={`p-${i}-l`}>
            <PageContent side="left" spread={spread} photoIndex={0} />
          </Page>
        );
        els.push(
          <Page key={`p-${i}-r`}>
            <PageContent side="right" spread={spread} photoIndex={1} />
          </Page>
        );
      } else {
        els.push(
          <Page key={`p-${i}-l`}>
            <PageContent side="left" spread={spread} />
          </Page>
        );
        els.push(
          <Page key={`p-${i}-r`}>
            <PageContent side="right" spread={spread} />
          </Page>
        );
      }
    });
    els.push(
      <PageCover key="cover-back">
        <CoverBack />
      </PageCover>
    );
    return els;
  }, []);

  const progressLabel = useMemo(() => {
    if (totalPages === 0) return "Cover";
    if (currentPage === 0) return "Cover";
    if (currentPage >= totalPages - 1) return "The End";
    return `Page ${currentPage} of ${totalPages - 2}`;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-6 px-4 bg-gradient-to-b from-background to-secondary">
      <Header
        musicOn={musicOn}
        setMusicOn={setMusicOn}
        progressLabel={progressLabel}
        onRestart={restart}
      />

      <div className="flex-1 w-full flex items-center justify-center my-6">
        <div style={{ width: size.w * (isMobile ? 1 : 2), height: size.h }} className="mx-auto">
          {/* @ts-expect-error - react-pageflip types are loose */}
          <HTMLFlipBook
            width={size.w}
            height={size.h}
            size="stretch"
            minWidth={280}
            maxWidth={1000}
            minHeight={380}
            maxHeight={1400}
            showCover={true}
            usePortrait={isMobile}
            mobileScrollSupport={true}
            drawShadow={true}
            flippingTime={900}
            maxShadowOpacity={0.5}
            className="shadow-elegant"
            startPage={0}
            ref={bookRef as never}
            onFlip={(e: { data: number }) => setCurrentPage(e.data)}
            onInit={(e: { data: { pages: number } }) => setTotalPages(e.data.pages)}
          >
            {pages}
          </HTMLFlipBook>
        </div>
      </div>

      <NavBar
        onPrev={prev}
        onNext={next}
        canPrev={currentPage > 0}
        canNext={currentPage < totalPages - 1}
      />
      <p className="script text-sm text-muted-foreground mt-3 text-center">
        Drag a corner, swipe, or use the arrows to turn the page
      </p>
    </div>
  );
};

const Header = ({
  musicOn,
  setMusicOn,
  progressLabel,
  onRestart,
}: {
  musicOn: boolean;
  setMusicOn: (v: boolean) => void;
  progressLabel: string;
  onRestart: () => void;
}) => (
  <header className="w-full max-w-4xl flex items-center justify-between gap-3">
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-gold" />
      <span className="script text-lg text-primary">A Keepsake Book</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground hidden sm:inline">{progressLabel}</span>
      <Button variant="ghost" size="icon" onClick={onRestart} aria-label="Restart" className="hover:bg-primary/10">
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMusicOn(!musicOn)}
        aria-label={musicOn ? "Turn music off" : "Turn music on"}
        className="hover:bg-primary/10"
      >
        {musicOn ? <Music2 className="h-4 w-4" /> : <Music className="h-4 w-4" />}
      </Button>
    </div>
  </header>
);

const NavBar = ({
  onPrev,
  onNext,
  canPrev,
  canNext,
}: {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}) => (
  <div className="flex items-center gap-3">
    <Button variant="outline" onClick={onPrev} disabled={!canPrev} className="gap-1">
      <ChevronLeft className="h-4 w-4" /> Previous
    </Button>
    <Button onClick={onNext} disabled={!canNext} className="gap-1">
      Next <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

export default Flipbook;
