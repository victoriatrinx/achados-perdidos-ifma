
/* ---------- Dados (trocar pelo back-end depois) ---------- */
const ITENS = [
  {id:1,cat:"Achado",nome:"Mochila preta",desc:"Encontrada na biblioteca. Sem marca aparente.",local:"Biblioteca",dias:2,forma:"mochila"},
  {id:2,cat:"Perdido",nome:"AirPods",desc:"Perdi no intervalo, próximo ao bloco B.",local:"Bloco B",dias:3,forma:"airpods"},
  {id:3,cat:"Doação",nome:"Livros didáticos",desc:"Livros em bom estado. Pode ser doado!",local:"Bloco A",dias:4,forma:"livros"},
  {id:4,cat:"Venda",nome:"Garrafa térmica",desc:"Garrafa de 750ml. Pouco uso e em ótimo estado.",local:"IFMA Rosário",dias:5,forma:"garrafa"},
  {id:5,cat:"Achado",nome:"Chaves",desc:"Encontradas no pátio central.",local:"Pátio",dias:5,forma:"chaves"},
  {id:6,cat:"Perdido",nome:"Caderno",desc:"Perdi na sala do 2º ano.",local:"Sala 203",dias:6,forma:"caderno"},
  {id:7,cat:"Doação",nome:"Fone de ouvido",desc:"Funcionando perfeitamente.",local:"Bloco C",dias:7,forma:"fone"},
  {id:8,cat:"Venda",nome:"Calculadora científica",desc:"Em ótimo estado.",local:"Bloco C",dias:7,forma:"calculadora"}
];

/* Quando o back-end existir, troque o corpo por:
   const r = await fetch("/api/itens"); return r.json();  */
async function buscarItens(){ return ITENS; }


/* ---------- Lista de itens ---------- */
let todos = [];
function desenhar(lista){
  $("#grade").innerHTML = lista.length ? lista.map(i => `
    <article class="card">
      <span class="tag ${i.cat}">${i.cat}</span>
      <button class="fav" type="button" aria-label="Favoritar ${i.nome}" aria-pressed="false">♡</button>
      <div class="thumb"><span class="obj ${i.forma}"></span></div>
      <h4>${i.nome}</h4>
      <p class="desc">${i.desc}</p>
      <p class="meta">📍 ${i.local}</p>
      <p class="meta">🗓️ ${quando(i.dias)}</p>
    </article>`).join("") : `<p class="vazio">Nenhum item encontrado. Tente mudar a busca ou os filtros.</p>`;
}

function filtrar(){
  const q = norm($("#busca").value.trim());
  const cat = $("#fCategoria").value;
  const loc = norm($("#fLocal").value.trim());
  const dias = Number($("#fData").value) || Infinity;
  desenhar(todos.filter(i =>
    (!q || norm(`${i.nome} ${i.desc} ${i.local} ${i.cat}`).includes(q)) &&
    (!cat || i.cat === cat) &&
    (!loc || norm(i.local).includes(loc)) &&
    i.dias <= dias));
}

/* ---------- Filtros ---------- */
const btnFiltros = $("#btnFiltros"), painel = $("#painelFiltros");
btnFiltros.addEventListener("click", () => {
  const abrir = painel.hidden;
  painel.hidden = !abrir;
  btnFiltros.setAttribute("aria-expanded", abrir);
});
painel.addEventListener("submit", e => { e.preventDefault(); filtrar(); });
painel.addEventListener("reset", () => setTimeout(filtrar));
$("#chipsLocais").addEventListener("click", e => {
  if(e.target.tagName === "BUTTON"){ $("#fLocal").value = e.target.textContent; filtrar(); }
});
$("#busca").addEventListener("input", filtrar);

/* ---------- Favoritos (visual por enquanto) ---------- */
$("#grade").addEventListener("click", e => {
  const b = e.target.closest(".fav");
  if(!b) return;
  const ativo = b.getAttribute("aria-pressed") !== "true";
  b.setAttribute("aria-pressed", ativo);
  b.textContent = ativo ? "♥" : "♡";
});

/* ---------- Links: páginas em construção e rodapé em manutenção ---------- */
document.addEventListener("click", e => {
  const pagina = e.target.closest("a[data-pagina]");
  if(pagina){
    if(!PRONTAS.includes(pagina.getAttribute("href"))){
      e.preventDefault();
      avisar("Esta página ainda está sendo feita.");
    }
    return;
  }
  if(e.target.closest("[data-manutencao]")){
    e.preventDefault();
    avisar("Esta função ainda está em manutenção.");
  }
});

const saudacao = $("#saudacao");

async function atualizarSaudacao() {
  const resultado = await carregarPerfilSupabase();

  if (!resultado.ok) return;

  const perfilHome = resultado.perfil;

  if (saudacao) {
    saudacao.textContent =
      "Olá, " + perfilHome.nome.split(" ")[0] + "! 👋";
  }
}

atualizarSaudacao();

/* ---------- Busca vinda de outras páginas (ex.: digitou no perfil) ---------- */
const params = new URLSearchParams(location.search);
if(params.get("q")) $("#busca").value = params.get("q");
if(params.get("cat")) $("#fCategoria").value = params.get("cat");
if(params.get("local")) $("#fLocal").value = params.get("local");
if(params.get("data")) $("#fData").value = params.get("data");

/* ---------- Início ---------- */
buscarItens().then(d => { todos = d; filtrar(); });