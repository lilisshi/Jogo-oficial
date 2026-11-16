// Textos de exemplo — troque pelas memórias reais de vocês.
export type Memory = {
  level: number; title: string; date: string; emoji: string; time: "dia" | "noite";
  dialog: { who: "LIVIA" | "WENDEL"; text: string }[];
  achievement: { icon: string; title: string; sub: string };
  place: { name: string; x: number; y: number };
};

export const memories: Memory[] = [
  { level: 1, title: "O dia em que tudo começou", date: "?? / ?? / 2026", emoji: "💬", time: "noite",
    dialog: [{ who: "LIVIA", text: "Naquele dia eu ainda não sabia, mas você estava prestes a se tornar uma das minhas pessoas favoritas..." }, { who: "WENDEL", text: "Oi! Tudo bem? 😊" }, { who: "LIVIA", text: "E foi assim, com um simples 'oi', que o jogo começou." }],
    achievement: { icon: "💬", title: "Primeiro contato", sub: "Duas histórias se cruzaram" }, place: { name: "Onde nos conhecemos", x: 22, y: 30 } },
  { level: 2, title: "Nosso primeiro encontro", date: "?? / ?? / 2026", emoji: "☕", time: "dia",
    dialog: [{ who: "LIVIA", text: "Eu estava tão nervosa que ensaiei o 'oi' umas dez vezes no caminho." }, { who: "WENDEL", text: "E eu fingindo que estava tranquilo..." }, { who: "LIVIA", text: "Quando te vi, o nervosismo virou sorriso." }],
    achievement: { icon: "💘", title: "Primeiro encontro", sub: "A aventura começou" }, place: { name: "Primeiro encontro", x: 50, y: 50 } },
  { level: 3, title: "O primeiro beijo", date: "?? / ?? / 2026", emoji: "💋", time: "noite",
    dialog: [{ who: "LIVIA", text: "Estrelinhas, borboletas e um coração gigante." }, { who: "LIVIA", text: "Combo perfeito. Corações sincronizados." }],
    achievement: { icon: "💋", title: "Primeiro beijo", sub: "Corações sincronizados" }, place: { name: "Primeiro beijo", x: 77, y: 14 } },
  { level: 4, title: "Namoro desbloqueado!", date: "16 / 10 / 2026", emoji: "🏆", time: "dia",
    dialog: [{ who: "WENDEL", text: "Quer namorar comigo?" }, { who: "LIVIA", text: "SIM! Novo status: namorando 💗" }],
    achievement: { icon: "💍", title: "Namoro oficial", sub: "Nova fase desbloqueada" }, place: { name: "Início do namoro", x: 86, y: 50 } },
  { level: 5, title: "Nosso primeiro mês", date: "16 / 11 / 2026", emoji: "🎂", time: "noite",
    dialog: [{ who: "LIVIA", text: "Um mês de risadas, carinho e saudade." }, { who: "LIVIA", text: "E a próxima fase ainda está sendo escrita..." }],
    achievement: { icon: "🎂", title: "Um mês de nós", sub: "Recompensa especial" }, place: { name: "Um passeio especial", x: 40, y: 84 } },
];

export const inventory = [
  { icon: "🎟️", name: "Ingresso", text: "Guardado do nosso passeio especial." },
  { icon: "💌", name: "Mensagem", text: "A primeira mensagem que você me mandou." },
  { icon: "📷", name: "Foto", text: "Nossa primeira foto juntos." },
  { icon: "💗", name: "Coração", text: "O meu. Agora é seu." },
  { icon: "🌹", name: "Flor", text: "Um presente simbólico de nós dois." },
  { icon: "🍫", name: "Chocolate", text: "Porque todo dia com você é doce." },
];

export const lines = [
  "Wendel: você é meu save point favorito.",
  "Livia: player 2 mais lindo do servidor!",
  "Wendel: mais uma fase com você? Sempre.",
  "Livia: meu coração tem HP infinito por você.",
];

export const quiz = [
  { q: "Onde a gente se conheceu?", a: ["Internet", "Faculdade", "Festa"], c: 0 },
  { q: "Qual foi a primeira coisa que fizemos juntos?", a: ["Cinema", "Café", "Parque"], c: 1 },
  { q: "Quantos meses de namoro estamos comemorando?", a: ["1", "6", "12"], c: 0 },
];

export const gallery = ["Nossa primeira foto", "Aquele dia engraçado", "Pôr do sol juntos", "Selfie boba", "Encontro especial", "Um mês de nós"];
