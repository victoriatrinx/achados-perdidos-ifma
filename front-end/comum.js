/* Código que toda página interna usa: aba lateral, filtros e avisos.
   Carregue o dados-perfil.js e depois este arquivo, ANTES do JS da própria página. */

/* Páginas que já estão prontas. Quando terminar uma, adicione aqui (e no home.js). */
const PRONTAS = ["home.html", "perfil.html", "editar-perfil.html", "configuracoes.html"];

/* ---------- Utilidades ---------- */
const $ = s => document.querySelector(s);

let tempoAviso;
function avisar(msg){
  const a = $("#aviso");
  a.textContent = msg;
  a.classList.add("mostra");
  clearTimeout(tempoAviso);
  tempoAviso = setTimeout(() => a.classList.remove("mostra"), 2600);
}

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

  /* Links: páginas em construção e botões em manutenção */
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
})();