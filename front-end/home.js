/* Páginas que já estão prontas. Quando terminar uma, adicione o nome do arquivo aqui. */
const PRONTAS = ["home.html", "perfil.html"];

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

/* ---------- Utilidades ---------- */
const $ = s => document.querySelector(s);
const norm = t => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
function quando(d){ return d>=7 ? "1 semana atrás" : `${d} dias atrás`; }

let tempoAviso;
function avisar(msg){
  const a = $("#aviso");
  a.textContent = msg;
  a.classList.add("mostra");
  clearTimeout(tempoAviso);
  tempoAviso = setTimeout(() => a.classList.remove("mostra"), 2600);
}

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

/* ---------- Aba lateral: mostrar / esconder ---------- */
const aba = $("#aba"), btnAba = $("#btnAba");
function definirAba(aberta){
  document.body.classList.toggle("sem-aba", !aberta);
  btnAba.setAttribute("aria-expanded", aberta);
  try{ localStorage.setItem("abaAberta", aberta); }catch(e){}
}
let guardada = null;
try{ guardada = localStorage.getItem("abaAberta"); }catch(e){}
definirAba(guardada !== null ? guardada === "true" : window.innerWidth > 860);
btnAba.addEventListener("click", () => definirAba(document.body.classList.contains("sem-aba")));

/* Rolar em cima da aba nunca move a página de trás */
aba.addEventListener("wheel", e => {
  const noTopo = aba.scrollTop <= 0 && e.deltaY < 0;
  const noFim = aba.scrollTop + aba.clientHeight >= aba.scrollHeight - 1 && e.deltaY > 0;
  if(noTopo || noFim) e.preventDefault();
}, {passive:false});
aba.addEventListener("touchmove", e => {
  if(aba.scrollHeight <= aba.clientHeight) e.preventDefault();
}, {passive:false});

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
  const pagina = e.target.closest(".aba a[href], a[data-pagina]");
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

/* ---------- Início ---------- */
buscarItens().then(d => { todos = d; filtrar(); });
const p = new URLSearchParams(location.search);
  if(p.get("q")) $("#busca").value = p.get("q");
  if(p.get("cat")) $("#fCategoria").value = p.get("cat");
  if(p.get("local")) $("#fLocal").value = p.get("local");
  if(p.get("data")) $("#fData").value = p.get("data");
  /* ---------- Perfil no topo e na saudação ---------- */
const perfilHome = lerPerfil();
mostrarTopo(perfilHome);
const saudacao = $("#saudacao");
if(saudacao) saudacao.textContent = "Olá, " + perfilHome.nome.split(" ")[0] + "! 👋";