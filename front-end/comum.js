/* Código que toda página interna usa: aba lateral, filtros e avisos.
   Carregue o dados-perfil.js e depois este arquivo, ANTES do JS da própria página. */

/* Mostra erros na própria tela (faixa vermelha embaixo). Ajuda enquanto o site está sendo feito;
   quando tudo estiver pronto, pode apagar este bloco. */
function erroNaTela(t){
  let d = document.getElementById("erroTela");
  if(!d){
    d = document.createElement("div"); d.id = "erroTela";
    d.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:999;background:#b00020;color:#fff;padding:10px 14px;font:600 14px/1.4 sans-serif";
    document.body.appendChild(d);
  }
  if(!d.textContent) d.textContent = "ERRO: " + t;   /* mostra só o primeiro erro (é o que causa os outros) */
}
window.addEventListener("error", e => {
  if(e.target && e.target.tagName === "SCRIPT") erroNaTela("não consegui carregar " + e.target.getAttribute("src"));
  else if(e.message) erroNaTela(e.message + " (" + String(e.filename || "").split("/").pop() + ", linha " + e.lineno + ")");
}, true);
if(typeof lerPerfil === "undefined"){
  erroNaTela("o dados-perfil.js não carregou. Ele precisa estar na mesma pasta e vir ANTES do comum.js no HTML.");
}

/* Páginas que já estão prontas. Quando terminar uma, adicione aqui (e no home.js). */
const PRONTAS = ["home.html", "perfil.html", "editar-perfil.html", "configuracoes.html", "RedefinirSenha.html"];

/* ---------- Utilidades ---------- */
const $ = s => document.querySelector(s);
/* Atualiza o usuário exibido no cabeçalho */
async function atualizarTopoUsuario() {
  const avatar = $("#topoAvatar");
  const nome = $("#topoNome");

  if (!avatar || !nome) return;
// Esconde os dados antigos enquanto carrega o perfil atual.
nome.textContent = "";
avatar.replaceChildren();
avatar.style.backgroundImage = "";
avatar.textContent = ""; 

  // Evita mostrar dados antigos enquanto o perfil carrega
  nome.textContent = "Carregando...";
  avatar.replaceChildren();
  avatar.textContent = "...";

  const resultado = await carregarPerfilSupabase();

  if (!resultado.ok) {
    nome.textContent = "Aluno(a)";
    avatar.textContent = "A";
    return;
  }

  const perfil = resultado.perfil;

  nome.textContent = perfil.nome || "Aluno(a)";
  avatar.replaceChildren();

  if (perfil.foto) {
    const img = document.createElement("img");
    img.src = perfil.foto;
    img.alt = "Foto do perfil";
    avatar.appendChild(img);
  } else {
    avatar.textContent = (perfil.nome || "A").charAt(0).toUpperCase();
  }
}

async function atualizarTopoUsuario() {
  const avatar = document.querySelector("#topoAvatar");
  const nome = document.querySelector("#topoNome");

  if (!avatar || !nome) return;

  const resultado = await carregarPerfilSupabase();

  if (!resultado.ok) {
    nome.textContent = "Aluno(a)";
    avatar.replaceChildren();
    avatar.textContent = "A";
    avatar.style.backgroundImage = "";
    return;
  }

  const perfil = resultado.perfil;

  nome.textContent = perfil.nome || "Aluno(a)";
  avatar.replaceChildren();
  avatar.style.backgroundImage = "";

  if (perfil.foto) {
    const img = document.createElement("img");
    img.src = perfil.foto;
    img.alt = "Foto do perfil";
    avatar.appendChild(img);
  } else {
    avatar.textContent = (perfil.nome || "A").charAt(0).toUpperCase();
  }
}
function avisar(mensagem) {
  const elemento = document.querySelector("#aviso");

  if (elemento) {
    elemento.textContent = mensagem;
    elemento.classList.add("visivel");
  } else {
    console.error(mensagem);
  }
}
atualizarTopoUsuario();

/* ---------- Topo, aba lateral e filtros ---------- */
(function(){
  const aba = $("#aba"), btnAba = $("#btnAba");

  function definirAba(aberta){
    document.body.classList.toggle("sem-aba", !aberta);
    /* Estilo direto: funciona mesmo que o home.css use outro nome de classe */
    aba.style.display = aberta ? "" : "none";
    const pg = document.querySelector(".pagina");
    if(pg) pg.style.marginLeft = aberta ? "" : "0";
    const rd = document.querySelector(".rodape");
    if(rd) rd.style.marginLeft = aberta ? "" : "0";
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

  /* Busca e filtros: aqui não existe a lista de itens, então buscar leva
     para a home com os valores na URL (o home.js lê esses valores ao abrir). */
  function irParaBusca(){
    const p = new URLSearchParams();
    const q = $("#busca").value.trim();
    if(q) p.set("q", q);
    if($("#fCategoria").value) p.set("cat", $("#fCategoria").value);
    if($("#fLocal").value.trim()) p.set("local", $("#fLocal").value.trim());
    if($("#fData").value) p.set("data", $("#fData").value);
    location.href = "home.html" + (p.toString() ? "?" + p : "");
  }
  /* Na home quem cuida dos filtros é o home.js; aqui só nas outras páginas (senão o clique é tratado 2x e o painel nunca abre) */
  if(!$("#grade")){
  const btnFiltros = $("#btnFiltros"), painel = $("#painelFiltros");
  btnFiltros.addEventListener("click", () => {
    const abrir = painel.hidden;
    painel.hidden = !abrir;
    btnFiltros.setAttribute("aria-expanded", abrir);
  });
  painel.addEventListener("submit", e => { e.preventDefault(); irParaBusca(); });
  $("#chipsLocais").addEventListener("click", e => {
    if(e.target.tagName === "BUTTON"){ $("#fLocal").value = e.target.textContent; irParaBusca(); }
  });
  $("#busca").addEventListener("keydown", e => { if(e.key === "Enter"){ e.preventDefault(); irParaBusca(); } });
  }

  /* Links: páginas em construção e botões em manutenção */
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
})();