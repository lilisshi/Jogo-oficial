import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { memories, inventory, lines, quiz, gallery, coupons } from "@/data/memories";
import casal from "@/assets/casal-pixel.png";
import mapa from "@/assets/mapa-pixel.jpg";
import boss from "@/assets/boss-saudade.png";

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

let ctx: AudioContext | null = null;
function blip(on: boolean, f = 660) {
  if (!on || typeof window === "undefined") return;
  ctx ??= new AudioContext();
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = "square"; o.frequency.value = f; g.gain.value = 0.04;
  o.connect(g).connect(ctx.destination); o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15); o.stop(ctx.currentTime + 0.16);
}

function Dialog({ m, sound }: { m: (typeof memories)[number]; sound: boolean }) {
  const [i, setI] = useState(0);
  const d = m.dialog[i]!;
  const last = i === m.dialog.length - 1;
  return (
    <div className="dialog-box p-4 md:p-5">
      <p className="font-pixel text-[10px] text-primary">{d.who}</p>
      <p key={i} className="font-body text-2xl leading-snug mt-2 animate-in fade-in">"{d.text}"</p>
      <button onClick={() => { blip(sound); setI(last ? 0 : i + 1); }} className="font-pixel text-[9px] mt-3 blink text-secondary inline-flex min-h-[40px] items-center px-2 -mx-2">
        {last ? "↺ RELER" : "▼ CONTINUAR"}
      </button>
    </div>
  );
}

function Level({ m, onSeen, sound, hidden }: { m: (typeof memories)[number]; onSeen: (l: number) => void; sound: boolean; hidden?: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setSeen(true); onSeen(m.level); io.disconnect(); } }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [m.level, onSeen]);
  return (
    <section id={`level-${m.level}`} ref={ref} className={`relative min-h-screen flex items-center justify-center px-4 py-24 ${m.time === "noite" ? "sky-night" : "sky-day"}`}>
      <span className="absolute top-8 right-8 text-4xl">{m.time === "noite" ? "🌙" : "☀️"}</span>
      {hidden}
      <div className={`pixel-card max-w-xl w-full p-6 md:p-8 transition-all duration-700 ${seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        <p className="font-pixel text-[10px] opacity-70">LEVEL {String(m.level).padStart(2, "0")}</p>
        <h2 className="font-pixel text-base md:text-xl mt-3 leading-relaxed">{m.title}</h2>
        <p className="font-pixel text-[10px] mt-2 text-secondary">{m.date}</p>
        <div className="pixel-photo my-5 flex aspect-video items-center justify-center text-6xl"><span className={seen ? "animate-bounce" : ""}>{m.emoji}</span></div>
        <Dialog m={m} sound={sound} />
      </div>
    </section>
  );
}

function Act({ n, title }: { n: number; title: string }) {
  return (
    <div className="py-24 text-center px-4">
      <p className="font-pixel text-xs text-primary">ATO {n}</p>
      <h2 className="font-pixel text-xl md:text-3xl mt-4 text-glow">{title}</h2>
    </div>
  );
}

function Panel({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/70 p-4" onClick={onClose}>
      <div className="pixel-card w-full max-w-md p-6 max-h-[85vh] overflow-auto animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center"><h3 className="font-pixel text-sm">{title}</h3><button onClick={onClose} className="font-pixel text-xs">✕</button></div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

function Quiz({ sound, achieve }: { sound: boolean; achieve: (s: string) => void }) {
  const [i, setI] = useState(0), [score, setScore] = useState(0), [pick, setPick] = useState<number | null>(null);
  if (i >= quiz.length) return (
    <div className="text-center"><p className="font-pixel text-sm">{score}/{quiz.length} ACERTOS</p>
      <p className="font-body text-2xl mt-3">{score === quiz.length ? "Perfeito! Recompensa: um vale-encontro romântico 💌" : "Quase! Mas eu te amo do mesmo jeito 💗"}</p>
      <button className="pixel-btn mt-4 inline-flex min-h-[40px] items-center justify-center px-4 py-2 font-pixel text-[10px]" onClick={() => { setI(0); setScore(0); }}>JOGAR DE NOVO</button></div>
  );
  const q = quiz[i]!;
  return (
    <div>
      <p className="font-pixel text-[10px] opacity-70">QUESTÃO {String(i + 1).padStart(2, "0")}/{String(quiz.length).padStart(2, "0")}</p>
      <p className="font-body text-2xl mt-3">{q.q}</p>
      <div className="grid gap-2 mt-4">
        {q.a.map((a, k) => (
          <button key={a} disabled={pick !== null} onClick={() => {
            setPick(k); const ok = k === q.c; blip(sound, ok ? 880 : 220); if (ok) setScore((s) => s + 1);
            setTimeout(() => { setPick(null); if (i + 1 === quiz.length) achieve("Quiz concluído!"); setI(i + 1); }, 900);
          }} className={`pixel-option px-4 py-2 font-body text-xl text-left ${pick !== null && k === q.c ? "is-right" : pick === k ? "is-wrong" : ""}`}>{a}</button>
        ))}
      </div>
    </div>
  );
}

function Boss({ sound, achieve }: { sound: boolean; achieve: (s: string) => void }) {
  const [hp, setHp] = useState(100), [log, setLog] = useState("O Chefão da Saudade apareceu!"), [hit, setHit] = useState(false);
  const atk = (name: string, dmg: number) => {
    if (hp <= 0) return; blip(sound, 500 + dmg * 10); setHit(true); setTimeout(() => setHit(false), 250);
    const n = Math.max(0, hp - dmg); setHp(n); setLog(`Você usou ${name}! -${dmg} HP`);
    if (n === 0) achieve("Saudade derrotada!");
  };
  return (
    <div className="pixel-card max-w-xl w-full p-6 text-center">
      <p className="font-pixel text-[10px] text-destructive">BOSS FIGHT</p>
      <img src={boss} alt="Chefão da Saudade" width={816} height={816} loading="lazy" className={`mx-auto w-48 pixelated transition ${hit ? "translate-x-2 opacity-60" : ""} ${hp === 0 ? "opacity-20 grayscale" : "animate-pulse"}`} />
      <div className="pixel-bar h-4 mt-2"><div className="h-full bg-destructive transition-all" style={{ width: `${hp}%` }} /></div>
      <p className="font-body text-2xl mt-4">{hp === 0 ? "Vitória! A saudade perdeu, mas meu amor por você aumentou. 💗" : log}</p>
      {hp > 0 ? (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button className="pixel-btn inline-flex min-h-[40px] items-center justify-center py-2 font-pixel text-[9px]" onClick={() => atk("Abraço", 25)}>🤗 ABRAÇO</button>
          <button className="pixel-btn inline-flex min-h-[40px] items-center justify-center py-2 font-pixel text-[9px]" onClick={() => atk("Beijo", 35)}>💋 BEIJO</button>
          <button className="pixel-btn inline-flex min-h-[40px] items-center justify-center py-2 font-pixel text-[9px]" onClick={() => atk("Carinho", 20)}>💗 CARINHO</button>
        </div>
      ) : <button className="pixel-btn mt-4 inline-flex min-h-[40px] items-center justify-center px-4 py-2 font-pixel text-[10px]" onClick={() => { setHp(100); setLog("A saudade voltou... lute de novo!"); }}>REVANCHE</button>}
    </div>
  );
}

function Coupons({ sound, achieve }: { sound: boolean; achieve: (s: string) => void }) {
  const KEY = "love-exe-coupons";
  const [used, setUsed] = useState<Record<string, string>>({});
  useEffect(() => { try { setUsed(JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { /* ignore */ } }, []);
  const save = (n: Record<string, string>) => { setUsed(n); localStorage.setItem(KEY, JSON.stringify(n)); };
  return (
    <div className="max-w-3xl w-full">
      <p className="font-pixel text-[10px] text-primary text-center mb-2 leading-relaxed">CUPONS DE AMOR</p>
      <p className="font-body text-xl text-center text-muted-foreground mb-6">{Object.keys(used).length}/{coupons.length} resgatados</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {coupons.map((c) => { const d = used[c.id]; return (
          <div key={c.id} className={`pixel-card p-4 ${d ? "opacity-60" : ""}`}>
            <div className="flex gap-3 items-start"><span className="text-3xl shrink-0">{c.icon}</span>
              <div className="flex-1 min-w-0"><p className="font-pixel text-[9px] leading-relaxed break-words">{c.title}</p><p className="font-body text-lg mt-1">{c.text}</p></div></div>
            {d ? (
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3"><span className="font-pixel text-[8px] leading-relaxed text-secondary min-w-0">✓ RESGATADO EM {d}</span>
                <button className="font-pixel text-[8px] underline min-h-[40px] px-1" onClick={() => { const n = { ...used }; delete n[c.id]; save(n); }}>DESFAZER</button></div>
            ) : (
              <button className="pixel-btn mt-3 w-full inline-flex min-h-[40px] items-center justify-center font-pixel text-[9px]" onClick={() => {
                blip(sound, 880); const n = { ...used, [c.id]: new Date().toLocaleDateString("pt-BR") }; save(n);
                achieve(`Cupom resgatado: ${c.title}`);
              }}>RESGATAR</button>
            )}
          </div>); })}
      </div>
    </div>
  );
}

function Index() {
  const [toast, setToast] = useState<string | null>(null);
  const [seenList, setSeenList] = useState<number[]>([]);
  const [chest, setChest] = useState<"closed" | "opening" | "open">("closed");
  const [sound, setSound] = useState(false);
  const [panel, setPanel] = useState<null | "conquistas" | "mochila" | "missoes">(null);
  const [item, setItem] = useState<number | null>(null);
  const [scroll, setScroll] = useState(0);
  const [bubble, setBubble] = useState<string | null>(null);
  const [found, setFound] = useState<number[]>([]);
  const [heartClicks, setHeartClicks] = useState(0);
  const [night, setNight] = useState(false);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [travel, setTravel] = useState(false);
  const [guess, setGuess] = useState<string | null>(null);
  const [funny, setFunny] = useState<string | null>(null);
  const [extra, setExtra] = useState<string[]>([]);
  const seen = useRef(new Set<number>());

  const achieve = useCallback((s: string) => {
    setToast(s); setExtra((e) => (e.includes(s) ? e : [...e, s])); setTimeout(() => setToast(null), 2600);
  }, []);

  const onSeen = useCallback((l: number) => {
    if (seen.current.has(l)) return;
    seen.current.add(l); setSeenList([...seen.current]);
    const a = memories.find((m) => m.level === l)!.achievement;
    setToast(`${a.icon} ${a.title}`); setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => {
    const f = () => setScroll(window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight));
    window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => { if (found.length === 3) achieve("Missão 01: 3 corações encontrados!"); }, [found.length, achieve]);

  const done = seenList.length;
  const pct = Math.round((done / memories.length) * 100);

  const hiddenHeart = (id: number, cls: string) => !found.includes(id) && (
    <button aria-label="coração escondido" onClick={() => { blip(sound, 990); setFound((f) => [...f, id]); }} className={`absolute flex h-11 w-11 items-center justify-center text-2xl opacity-40 hover:opacity-100 ${cls}`}>♥</button>
  );

  const timeMachine = () => {
    if (!seenList.length) return achieve("Desbloqueie uma memória primeiro!");
    setTravel(true); blip(sound, 300);
    setTimeout(() => {
      const l = seenList[Math.floor(Math.random() * seenList.length)];
      document.getElementById(`level-${l}`)?.scrollIntoView({ behavior: "smooth" }); setTravel(false);
    }, 1200);
  };

  return (
    <main className={`game-bg min-h-screen text-foreground ${night ? "night-mode" : ""}`}>
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between gap-3 px-3 py-2 bg-background/85 backdrop-blur border-b-4 border-border">
        <button className="text-primary text-lg inline-flex min-h-[40px] items-center px-1" onClick={() => { const n = heartClicks + 1; setHeartClicks(n); if (n === 5) achieve("Segredo: Eu te amo mais do que pizza 🍕💗"); }}>♥ ♥ ♥</button>
        <div className="flex-1 max-w-[180px]">
          <div className="pixel-bar h-3"><div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} /></div>
          <p className="font-pixel text-[7px] mt-1 text-center text-muted-foreground">{pct}%</p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setPanel("conquistas")} className="pixel-btn inline-flex min-h-[40px] min-w-[40px] items-center justify-center px-2 py-1 text-sm" aria-label="Conquistas">🏆</button>
          <button onClick={() => setPanel("mochila")} className="pixel-btn inline-flex min-h-[40px] min-w-[40px] items-center justify-center px-2 py-1 text-sm" aria-label="Mochila">🎒</button>
          <button onClick={() => setPanel("missoes")} className="pixel-btn inline-flex min-h-[40px] min-w-[40px] items-center justify-center px-2 py-1 text-sm" aria-label="Missões">📜</button>
          <button onClick={timeMachine} className="pixel-btn inline-flex min-h-[40px] min-w-[40px] items-center justify-center px-2 py-1 text-sm" aria-label="Voltar no tempo">⏳</button>
          <button onClick={() => setSound(!sound)} className="pixel-btn inline-flex min-h-[40px] min-w-[40px] items-center justify-center px-2 py-1 font-pixel text-[9px]" aria-label="Som">{sound ? "♪" : "✕♪"}</button>
        </div>
      </header>

      {/* Personagens caminhando */}
      <div className="fixed bottom-2 z-30 transition-[left] duration-300" style={{ left: `calc(${scroll * 80}% + 8px)` }}>
        {bubble && <div className="speech absolute bottom-full mb-2 w-52 p-2 font-body text-lg">{bubble}</div>}
        <button onClick={() => { blip(sound, 770); setBubble(lines[Math.floor(Math.random() * lines.length)]!); setTimeout(() => setBubble(null), 3000); }} aria-label="Livia e Wendel">
          <img src={casal} alt="Livia e Wendel em pixel art" width={816} height={816} className="w-20 md:w-28 pixelated walk" />
        </button>
      </div>

      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pixel-card px-4 py-3 animate-in fade-in slide-in-from-top-4">
          <p className="font-pixel text-[9px] text-secondary">★ CONQUISTA</p><p className="font-body text-xl">{toast}</p>
        </div>
      )}
      {travel && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80"><span className="text-8xl animate-spin">🕰️</span></div>}

      {panel === "conquistas" && (
        <Panel title={`🏆 CONQUISTAS ${done}/${memories.length}`} onClose={() => setPanel(null)}>
          <div className="grid gap-2">
            {memories.map((m) => { const ok = seenList.includes(m.level); return (
              <div key={m.level} className={`pixel-option flex gap-3 items-center px-3 py-2 ${ok ? "" : "opacity-50"}`}>
                <span className="text-2xl">{ok ? m.achievement.icon : "🔒"}</span>
                <div><p className="font-pixel text-[9px]">{m.achievement.title}</p><p className="font-body text-lg">{m.achievement.sub}</p></div>
              </div>); })}
            {extra.map((e) => <div key={e} className="pixel-option px-3 py-2 font-body text-lg">⭐ {e}</div>)}
          </div>
        </Panel>
      )}
      {panel === "mochila" && (
        <Panel title="🎒 INVENTÁRIO" onClose={() => { setPanel(null); setItem(null); }}>
          <div className="grid grid-cols-3 gap-2">
            {inventory.map((it, k) => <button key={it.name} onClick={() => { blip(sound); setItem(k); }} className={`pixel-option aspect-square text-3xl ${item === k ? "is-right" : ""}`}>{it.icon}</button>)}
          </div>
          {item !== null && <div className="dialog-box p-3 mt-4"><p className="font-pixel text-[9px]">{inventory[item]!.name}</p><p className="font-body text-xl mt-1">{inventory[item]!.text}</p></div>}
        </Panel>
      )}
      {panel === "missoes" && (
        <Panel title="📜 MISSÕES SECUNDÁRIAS" onClose={() => setPanel(null)}>
          <ul className="grid gap-2 font-body text-xl">
            <li>{found.length === 3 ? "✅" : "⬜"} 01: Encontre três corações escondidos ({found.length}/3)</li>
            <li>{guess ? "✅" : "⬜"} 02: Adivinhe o que eu pensei no primeiro encontro</li>
            <li>{funny ? "✅" : "⬜"} 03: Escolha nosso momento mais engraçado</li>
            <li>{heartClicks >= 5 ? "✅" : "⬜"} 04: Abra uma mensagem secreta (dica: o cabeçalho…)</li>
          </ul>
        </Panel>
      )}

      {/* Tela inicial */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
        {hiddenHeart(1, "bottom-24 left-6")}
        <p className="font-pixel text-xs text-primary tracking-widest">LOVE.EXE</p>
        <img src={casal} alt="" width={816} height={816} className="w-40 md:w-56 pixelated my-4 animate-bounce" />
        <h1 className="font-pixel text-2xl md:text-5xl leading-relaxed text-glow">LIVIA + WENDEL</h1>
        <p className="font-body text-3xl mt-4 text-muted-foreground">A nossa história em fases</p>
        <button onClick={() => { blip(sound); document.getElementById("ato1")?.scrollIntoView({ behavior: "smooth" }); }} className="pixel-btn mt-10 px-8 py-4 font-pixel text-sm blink">▶ START GAME</button>
      </section>

      <div id="ato1"><Act n={1} title="A descoberta" /></div>
      <Level m={memories[0]!} onSeen={onSeen} sound={sound} />
      <Level m={memories[1]!} onSeen={onSeen} sound={sound} hidden={hiddenHeart(2, "top-24 left-10")} />

      <section className="px-4 py-16 flex justify-center">
        <div className="pixel-card max-w-xl w-full p-6">
          <p className="font-pixel text-[10px] text-secondary">MISSÃO 02</p>
          <p className="font-body text-2xl mt-2">O que eu pensei no nosso primeiro encontro?</p>
          <div className="grid gap-2 mt-3">{["Que sorriso lindo!", "Tomara que ele goste de mim", "Quero ver de novo"].map((g) => (
            <button key={g} onClick={() => { setGuess(g); achieve("Missão 02 concluída!"); }} className={`pixel-option px-3 py-2 font-body text-xl text-left ${guess === g ? "is-right" : ""}`}>{g}</button>))}</div>
          {guess && <p className="font-body text-xl mt-3">Resposta: todas! 💗</p>}
        </div>
      </section>

      <Act n={2} title="Nossa aventura" />
      <section className="px-4 pb-16 flex flex-col items-center">
        <p className="font-pixel text-[10px] text-primary mb-4">MAPA DO NOSSO UNIVERSO</p>
        <div className="relative max-w-3xl w-full pixel-frame overflow-hidden">
          <img src={mapa} alt="Mapa pixel art do nosso universo" width={1280} height={768} loading="lazy" className="w-full pixelated" />
          <div className="absolute inset-0 map-fog transition-all duration-700" style={{ clipPath: `inset(0 0 0 ${pct}%)` }} />
          {memories.map((m) => seenList.includes(m.level) && (
            <div key={m.level} className={`absolute -translate-y-full animate-in zoom-in ${m.place.x >= 70 ? "-translate-x-full" : m.place.x <= 15 ? "translate-x-0" : "-translate-x-1/2"}`} style={{ left: `${m.place.x}%`, top: `${m.place.y}%` }}>
              <div className="speech px-2 py-1 font-pixel text-[7px] whitespace-nowrap">{m.place.name}</div><div className="text-center text-xl">📍</div>
            </div>))}
        </div>
      </section>
      <Level m={memories[2]!} onSeen={onSeen} sound={sound} />

      <section className="px-4 py-16 flex justify-center">
        <div className="pixel-card max-w-xl w-full p-6">
          <p className="font-pixel text-[10px] text-secondary">MISSÃO 03</p>
          <p className="font-body text-2xl mt-2">Qual foi nosso momento mais engraçado?</p>
          <div className="grid gap-2 mt-3">{["Aquela risada sem parar", "O tombo épico", "A piada interna"].map((g) => (
            <button key={g} onClick={() => { setFunny(g); achieve("Missão 03 concluída!"); }} className={`pixel-option px-3 py-2 font-body text-xl text-left ${funny === g ? "is-right" : ""}`}>{g}</button>))}</div>
        </div>
      </section>

      <Level m={memories[3]!} onSeen={onSeen} sound={sound} hidden={hiddenHeart(3, "bottom-16 right-12")} />

      <section className="px-4 py-16">
        <p className="font-pixel text-[10px] text-primary text-center mb-6">GALERIA DESBLOQUEÁVEL</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {gallery.map((g, k) => { const f = flipped.includes(k); return (
            <button key={g} onClick={() => { blip(sound); setFlipped((x) => (f ? x.filter((y) => y !== k) : [...x, k])); }} className="flip aspect-[3/4]" data-flipped={f}>
              <div className="flip-inner">
                <div className="flip-face pixel-card flex items-center justify-center font-pixel text-2xl text-primary">?</div>
                <div className="flip-face flip-back pixel-card flex flex-col items-center justify-center p-3"><span className="text-5xl">📸</span><span className="font-body text-lg mt-2">{g}</span></div>
              </div>
            </button>); })}
        </div>
      </section>

      <section className="px-4 py-16 flex justify-center"><Boss sound={sound} achieve={achieve} /></section>

      <Level m={memories[4]!} onSeen={onSeen} sound={sound} />

      <Act n={3} title="O nosso futuro" />
      <section className="px-4 py-12 flex justify-center"><Coupons sound={sound} achieve={achieve} /></section>
      <section className="px-4 py-12 flex justify-center">
        <div className="pixel-card max-w-xl w-full p-6"><p className="font-pixel text-[10px] text-secondary mb-3">MINIGAME</p><Quiz sound={sound} achieve={achieve} /></div>
      </section>

      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center relative">
        <button onClick={() => setNight(!night)} className="absolute top-10 right-10 flex h-11 w-11 items-center justify-center text-4xl" aria-label="Lua">🌙</button>
        <p className="font-pixel text-[10px] text-primary">★ FASE SECRETA ★</p>
        {chest === "closed" && <button onClick={() => { blip(sound, 440); setChest("opening"); setTimeout(() => setChest("open"), 1500); }} className="mt-8 text-8xl hover:scale-110 transition-transform animate-bounce" aria-label="Abrir baú">🧰</button>}
        {chest === "opening" && <div className="fixed inset-0 z-[70] bg-background flex items-center justify-center"><div className="chest-light" /></div>}
        {chest === "open" && (
          <div className="pixel-card max-w-xl mt-8 p-8 animate-in zoom-in">
            <h2 className="font-pixel text-base text-secondary">Para o meu Player 2</h2>
            <p className="font-body text-2xl mt-6 leading-snug">Wendel, esse primeiro mês foi o melhor jogo que eu já joguei. Obrigada por cada risada, cada carinho e cada momento. Mal posso esperar pelas próximas fases. Te amo! 💗</p>
            <p className="font-pixel text-[10px] mt-6 opacity-70">— Livia</p>
          </div>
        )}
      </section>

      <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center pb-40">
        <h2 className="font-pixel text-xl md:text-3xl text-glow">LEVEL COMPLETE!</h2>
        <p className="font-body text-3xl mt-4">1 mês de namoro concluído com sucesso!</p>
        <p className="font-pixel text-[10px] mt-10 text-primary">PRÓXIMA FASE</p>
        <p className="font-body text-2xl mt-2 text-muted-foreground">Nossa história continua...</p>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="pixel-btn mt-8 px-6 py-3 font-pixel text-xs blink">♥ CONTINUE?</button>
      </section>
    </main>
  );
}
