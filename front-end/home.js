/* =====================================================================
   HOME PRINCIPAL - iFound
   Como o projeto não tem back-end, usamos uma lista de dados fictícios
   para simular as publicações, e o localStorage para lembrar quais
   itens o usuário marcou como favorito.
   ===================================================================== */

// ---------- 1. DADOS FICTÍCIOS DAS PUBLICAÇÕES ----------
// Cada objeto representa um card do mural. "tipo" define a cor do selo.
// "imagem" aponta pra pasta Imagens/ do projeto. Como ainda não temos
// uma foto pra cada item específico, usei as ilustrações genéricas
// (Itensilu.png, Itensilu(2).png...) alternadas entre os cards —
// é só trocar o caminho de cada uma quando tiverem a imagem certa.
const publicacoes = [
  { id: 1, tipo: "Achado", imagem: "Imagens/Itensilu.png", titulo: "Mochila preta", descricao: "Encontrada na biblioteca. Sem marca aparente.", local: "Biblioteca", data: "2 dias atrás" },
  { id: 2, tipo: "Perdido", imagem: "Imagens/Itensilu(2).png", titulo: "AirPods", descricao: "Perdi no intervalo, próximo ao bloco B.", local: "Bloco B", data: "3 dias atrás" },
  { id: 3, tipo: "Doação", imagem: "Imagens/Itensilu(3).jpg", titulo: "Livros didáticos", descricao: "Livros em bom estado. Pode ser doado!", local: "Bloco A", data: "4 dias atrás" },
  { id: 4, tipo: "Venda", imagem: "Imagens/Itensilu(4).jpg", titulo: "Garrafa térmica", descricao: "Garrafa de 750ml. Pouco uso e em ótimo estado.", local: "IFMA Rosário", data: "5 dias atrás", preco: "R$ 25,00" },
  { id: 5, tipo: "Achado", imagem: "Imagens/Itensilu(5).jpg", titulo: "Chaves", descricao: "Encontradas no pátio central.", local: "Pátio", data: "5 dias atrás" },
  { id: 6, tipo: "Perdido", imagem: "Imagens/Itensilu.png", titulo: "Caderno", descricao: "Perdi na sala do 2º ano.", local: "Sala 203", data: "6 dias atrás" },
  { id: 7, tipo: "Doação", imagem: "Imagens/Itensilu(2).png", titulo: "Fone de ouvido", descricao: "Funcionando perfeitamente.", local: "Bloco C", data: "1 semana atrás" },
  { id: 8, tipo: "Venda", imagem: "Imagens/Itensilu(3).jpg", titulo: "Calculadora científica", descricao: "Em ótimo estado.", local: "Bloco C", data: "1 semana atrás", preco: "R$ 60,00" },
];

// Mapa auxiliar: tipo -> classe CSS do selo colorido
const classeSelo = {
  "Achado": "selo-achado",
  "Perdido": "selo-perdido",
  "Doação": "selo-doacao",
  "Venda": "selo-venda",
};

// ---------- 2. FAVORITOS (salvos no localStorage) ----------
function pegarFavoritos() {
  const salvos = localStorage.getItem("ifound_favoritos");
  return salvos ? JSON.parse(salvos) : [];
}

function alternarFavorito(id) {
  let favoritos = pegarFavoritos();
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter((fid) => fid !== id);
  } else {
    favoritos.push(id);
  }
  localStorage.setItem("ifound_favoritos", JSON.stringify(favoritos));
}

// ---------- 3. CRIAÇÃO DOS CARDS NA TELA ----------
function criarCard(item) {
  const favoritos = pegarFavoritos();
  const favoritado = favoritos.includes(item.id);

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <span class="card-selo ${classeSelo[item.tipo]}">${item.tipo}</span>
    <button class="card-favorito ${favoritado ? "ativo" : ""}" data-id="${item.id}">
      ${favoritado ? "❤️" : "🤍"}
    </button>
    <div class="card-imagem"><img src="${item.imagem}" alt="${item.titulo}"></div>
    <div class="card-corpo">
      <h4>${item.titulo}</h4>
      <p>${item.descricao}</p>
      <div class="card-info">
        <span>📍 ${item.local}</span>
        <span>📅 ${item.data}</span>
      </div>
      ${item.preco ? `<span class="card-preco">${item.preco}</span>` : ""}
    </div>
  `;

  // Clique no coração: favorita/desfavorita e já atualiza o ícone
  const botaoFavorito = card.querySelector(".card-favorito");
  botaoFavorito.addEventListener("click", () => {
    alternarFavorito(item.id);
    const agoraFavoritado = pegarFavoritos().includes(item.id);
    botaoFavorito.classList.toggle("ativo", agoraFavoritado);
    botaoFavorito.textContent = agoraFavoritado ? "❤️" : "🤍";
  });

  return card;
}

// Desenha a lista de publicações passada como parâmetro dentro do grid
function renderizarPublicacoes(lista) {
  const grid = document.getElementById("gridPublicacoes");
  const msgVazio = document.getElementById("msgVazio");

  grid.innerHTML = "";

  if (lista.length === 0) {
    msgVazio.hidden = false;
    return;
  }
  msgVazio.hidden = true;

  lista.forEach((item) => grid.appendChild(criarCard(item)));
}

// ---------- 4. BUSCA (barra de pesquisa do topo) ----------
const inputBusca = document.getElementById("inputBusca");

inputBusca.addEventListener("input", () => {
  const termo = inputBusca.value.toLowerCase().trim();

  const filtradas = publicacoes.filter((item) =>
    item.titulo.toLowerCase().includes(termo) ||
    item.local.toLowerCase().includes(termo) ||
    item.tipo.toLowerCase().includes(termo)
  );

  renderizarPublicacoes(filtradas);
});

// ---------- 5. FILTROS DA BARRA LATERAL ----------
// Agora cada grupo (Local, Categoria, Data) usa "radio": só dá pra
// marcar uma opção por vez. A primeira opção de cada grupo é o
// "Todos/Todas/Qualquer", que significa "não filtrar por isso".
const btnAplicarFiltros = document.getElementById("btnAplicarFiltros");

// Valores que representam "sem filtro" em cada grupo
const SEM_FILTRO = ["todos", "todas", "qualquer"];

btnAplicarFiltros.addEventListener("click", () => {
  const local = valorMarcado("local");
  const categoria = valorMarcado("categoria");
  // OBS: o filtro de "data" ainda não tem datas reais para comparar
  // (estamos usando textos fictícios tipo "2 dias atrás"), então por
  // enquanto ele só filtra local e categoria. Dá pra evoluir isso
  // quando os dados vierem de um banco de verdade.

  const filtradas = publicacoes.filter((item) => {
    const passaLocal = SEM_FILTRO.includes(local) || item.local.includes(local);
    const passaCategoria = SEM_FILTRO.includes(categoria) || item.tipo === categoria;
    return passaLocal && passaCategoria;
  });

  renderizarPublicacoes(filtradas);
});

// Pega o valor do radio marcado dentro de um grupo (ex: "local")
function valorMarcado(nomeGrupo) {
  const marcado = document.querySelector(`input[name="${nomeGrupo}"]:checked`);
  return marcado ? marcado.value : SEM_FILTRO[0];
}

// ---------- 5.1 ACCORDION DA ABA "FILTROS" (mestre) ----------
// O botão verde "Filtros" abre/fecha o painel inteiro (Local+Categoria+Data)
const secaoFiltros = document.getElementById("secaoFiltros");
const btnFiltros = document.getElementById("btnFiltros");

btnFiltros.addEventListener("click", () => {
  secaoFiltros.classList.toggle("aberta");
});

// ---------- 5.2 ACCORDION DOS GRUPOS DE FILTRO (Local/Categoria/Data) ----------
// Clicar no título de um grupo (ex: "📍 Local") abre a lista de opções;
// clicar de novo recolhe. Cada grupo funciona de forma independente.
const botoesFiltro = document.querySelectorAll(".filtros-titulo");

botoesFiltro.forEach((botao) => {
  botao.addEventListener("click", () => {
    const grupo = botao.closest(".filtro-grupo");
    grupo.classList.toggle("aberto");
  });
});

// ---------- 5.3 BADGE DE MENSAGENS NÃO LIDAS ----------
// O número só aparece se realmente existir mensagem não lida. Por
// enquanto não temos chat de verdade, então o valor fica 0 (badge
// escondido). Quando o chat for feito, é só atualizar essa variável
// com a contagem real (ex: puxando do localStorage das conversas).
const mensagensNaoLidas = 0;

function atualizarBadgeMensagens(quantidade) {
  const badge = document.getElementById("badgeMensagens");
  if (quantidade > 0) {
    badge.textContent = quantidade;
    badge.hidden = false;
  } else {
    badge.hidden = true;
  }
}

atualizarBadgeMensagens(mensagensNaoLidas);

// ---------- 6. LINKS/BOTÕES AINDA NÃO IMPLEMENTADOS ----------
// Todo item da barra lateral que ainda não tem página própria mostra
// um aviso. Quando a página for feita, é só tirar o data-page da lista
// abaixo (ou trocar o href="#" pelo link real).
const paginasPendentes = document.querySelectorAll('.nav-item[data-page]:not([data-page="inicio"])');

paginasPendentes.forEach((link) => {
  link.addEventListener("click", (evento) => {
    evento.preventDefault();
    alert("Essa página ainda está em construção. 🚧");
  });
});

document.getElementById("linkVerTodas").addEventListener("click", (evento) => {
  evento.preventDefault();
  alert("Essa página ainda está em construção. 🚧");
});

document.getElementById("userMenu").addEventListener("click", () => {
  alert("Essa página ainda está em construção. 🚧");
});

// ---------- 7. PRIMEIRA RENDERIZAÇÃO DA PÁGINA ----------
renderizarPublicacoes(publicacoes);