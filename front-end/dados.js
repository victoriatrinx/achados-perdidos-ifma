/* ==========================================================
   dados.js — lista de publicações do iFound
   Por enquanto são dados de exemplo. Quando houver back-end,
   é só trocar buscarItemPorId() por uma chamada à API.
   tipo: "perdido" | "achado" | "doacao" | "venda"
   icone: desenho em CSS usado enquanto não há foto real
   imagem: (opcional) caminho da foto, ex.: "Imagens/mochila.jpg"
   ========================================================== */
const ITENS = [
  {
    id: 1,
    tipo: "perdido",
    titulo: "Mochila preta",
    descricao: "Mochila preta encontrada na biblioteca do campus. Sem identificação aparente.",
    local: "Biblioteca",
    data: "2026-05-17",
    autor: "Usuário",
    icone: "mochila"
  },
  {
    id: 2,
    tipo: "perdido",
    titulo: "AirPods",
    descricao: "Perdi no intervalo, próximo ao bloco B.",
    local: "Bloco B",
    data: "2026-10-08",
    autor: "Usuário",
    icone: "airpods"
  },
  {
    id: 3,
    tipo: "doacao",
    titulo: "Livros didáticos",
    descricao: "Livros em bom estado. Pode ser doado!",
    local: "Bloco A",
    data: "2026-10-07",
    autor: "Usuário",
    icone: "livros"
  },
  {
    id: 4,
    tipo: "venda",
    titulo: "Garrafa térmica",
    descricao: "Garrafa de 750ml. Pouco uso e em ótimo estado.",
    local: "IFMA Rosário",
    data: "2026-10-06",
    autor: "Usuário",
    preco: 35,
    icone: "garrafa"
  },
  {
    id: 5,
    tipo: "achado",
    titulo: "Chaves",
    descricao: "Encontradas no pátio central.",
    local: "Pátio",
    data: "2026-10-06",
    autor: "Usuário",
    icone: "chaves"
  }
];

function buscarItemPorId(id) {
  return ITENS.find(function (item) { return item.id === Number(id); }) || null;
}