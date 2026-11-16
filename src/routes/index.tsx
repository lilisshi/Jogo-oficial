import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { memories } from "@/data/memories";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LOVE.EXE — Livia & Wendel" },
      { name: "description", content: "Um joguinho do amor com as fases do nosso primeiro mês de namoro." },
      { property: "og:title", content: "LOVE.EXE — Livia & Wendel" },
      { property: "og:description", content: "A nossa história em fases. Aperte START." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Hearts() {
  return <div className="flex gap-1 text-primary text-lg">♥ ♥ ♥</div>;
}

function Level({ m, onSeen }: { m: (typeof memories)[number]; onSeen: (l: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); onSeen(m.level); io.disconnect(); }
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [m.level, onSeen]);
  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className={`pixel-card max-w-xl w-full p-6 md:p-8 transition-all duration-700 ${seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        <p className="font-pixel text-[10px] text-secondary-foreground/70">LEVEL {String(m.level).padStart(2, "0")}</p>
        <h2 className="font-pixel text-base md:text-xl mt-3 leading-relaxed text-foreground">{m.title}</h2>
        <p className="font-pixel text-[10px] mt-2 text-primary">{m.date}</p>
        <div className="pixel-photo my-6 flex aspect-video items-center justify-center text-6xl">
          <span className={seen ? "animate-bounce" : ""}>{m.emoji}</span>
        </div>
        <p className="font-body text-2xl leading-snug text-foreground">{m.text}</p>
      </div>
    </section>
  );
}

function Index() {
  const [toast, setToast] = useState<string | null>(null);
  const [done, setDone] = useState(0);
  const [chest, setChest] = useState(false);
  const [music, setMusic] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const seen = useRef(new Set<number>());

  const onSeen = useRef((l: number) => {
    if (seen.current.has(l)) return;
    seen.current.add(l);
    setDone(seen.current.size);
    setToast(memories.find((m) => m.level === l)!.achievement);
    setTimeout(() => setToast(null), 2600);
  }).current;

  const toggleMusic = () => {
    const a = audio.current; if (!a) return;
    if (music) a.pause(); else a.play().catch(() => {});
    setMusic(!music);
  };

  const pct = Math.round((done / memories.length) * 100);

  return (
    <main className="game-bg min-h-screen text-foreground">
      <audio ref={audio} src="/music/nossa-musica.mp3" loop />
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between gap-4 px-4 py-3 bg-background/80 backdrop-blur border-b-4 border-border">
        <Hearts />
        <div className="flex-1 max-w-xs">
          <div className="pixel-bar h-4"><div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} /></div>
          <p className="font-pixel text-[8px] mt-1 text-center text-muted-foreground">PROGRESSO {pct}%</p>
        </div>
        <button onClick={toggleMusic} className="pixel-btn px-3 py-2 font-pixel text-[10px]" aria-label="Som">{music ? "♪ ON" : "♪ OFF"}</button>
      </header>

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pixel-card px-4 py-3 animate-in fade-in slide-in-from-top-4">
          <p className="font-pixel text-[9px] text-primary">★ CONQUISTA</p>
          <p className="font-body text-xl">{toast}</p>
        </div>
      )}

      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="font-pixel text-xs text-primary tracking-widest">LOVE.EXE</p>
        <div className="text-4xl text-primary my-6 animate-pulse">♥ ♥ ♥</div>
        <h1 className="font-pixel text-2xl md:text-5xl leading-relaxed text-glow">LIVIA + WENDEL</h1>
        <p className="font-body text-3xl mt-4 text-muted-foreground">A nossa história em fases</p>
        <button onClick={() => document.getElementById("levels")?.scrollIntoView({ behavior: "smooth" })} className="pixel-btn mt-10 px-8 py-4 font-pixel text-sm blink">▶ START GAME</button>
      </section>

      <div id="levels">{memories.map((m) => <Level key={m.level} m={m} onSeen={onSeen} />)}</div>

      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        <p className="font-pixel text-[10px] text-primary">★ FASE SECRETA ★</p>
        {!chest ? (
          <button onClick={() => setChest(true)} className="mt-8 text-8xl hover:scale-110 transition-transform animate-bounce" aria-label="Abrir baú">🎁</button>
        ) : (
          <div className="pixel-card max-w-xl mt-8 p-8 animate-in zoom-in">
            <h2 className="font-pixel text-base text-primary">Para o meu Player 2</h2>
            <p className="font-body text-2xl mt-6 leading-snug">Wendel, esse primeiro mês foi o melhor jogo que eu já joguei. Obrigada por cada risada, cada carinho e cada momento. Mal posso esperar pelas próximas fases. Te amo! 💗</p>
            <p className="font-pixel text-[10px] mt-6 text-muted-foreground">— Livia</p>
          </div>
        )}
        <p className="font-pixel text-[9px] mt-12 text-muted-foreground">CONTINUE? ♥ YES</p>
      </section>
    </main>
  );
}
