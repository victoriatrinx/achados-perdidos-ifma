/* Código que toda página interna usa: aba lateral, filtros, avisos e dados do perfil.
   Carregue este arquivo ANTES do JS da própria página. */

/* Páginas que já estão prontas. Quando terminar uma, adicione aqui (e no home.js). */
const PRONTAS = ["home.html", "perfil.html", "editar-perfil.html"];

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

/* ---------- Conta (vem do login) ----------
   Procura no navegador os dados da conta que entrou (objeto com nome/email
   ou token JWT). Sem login, mostra "Aluno(a)", igual à home.
   Se o login guardar de outro jeito, ajuste só a função lerConta(). */
function lerJSON(v){ try{ return JSON.parse(v); }catch(e){ return null; } }
function lerJWT(t){
  try{
    const b = t.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");
    return JSON.parse(decodeURIComponent(atob(b).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")));
  }catch(e){ return null; }
}
function lerConta(){
  for(const loja of [localStorage, sessionStorage]){
    for(let i = 0; i < loja.length; i++){
      const chave = loja.key(i);
      if(chave.startsWith("ifoundPerfil") || chave === "abaAberta") continue;
      const v = loja.getItem(chave);
      let d = lerJWT(v) || lerJSON(v);
      if(d && d.user && typeof d.user === "object") d = d.user;
      if(d && typeof d === "object" && (d.nome || d.name || d.username || d.email)){
        const email = d.email || "";
        return {
          id: String(d.id || d.sub || email || d.matricula || d.username || "conta"),
          nome: d.nome || d.name || d.username || email.split("@")[0],
          usuario: d.usuario || d.username || (email ? email.split("@")[0] : ""),
          email: email
        };
      }
    }
  }
  return null;
}

/* ---------- Dados do perfil ----------
   O que a pessoa editar fica salvo no navegador, separado por conta.
   Quando o back-end existir, troque lerPerfil/salvarPerfil por fetch na API. */
const conta = lerConta();
const CHAVE = "ifoundPerfil:" + (conta ? conta.id : "visitante");
const PADRAO = {
  nome: conta ? conta.nome : "Aluno(a)",
  usuario: conta && conta.usuario ? "@" + conta.usuario.replace(/^@+/, "") : "@aluno(a)",
  email: conta ? conta.email : "",
  telefone: "",
  foto: "", anuncios: 0, favoritos: 0
};

function lerPerfil(){
  try{ return {...PADRAO, ...JSON.parse(localStorage.getItem(CHAVE) || "{}")}; }
  catch(e){ return {...PADRAO}; }
}
function salvarPerfil(p){
  try{
    localStorage.setItem(CHAVE, JSON.stringify({nome:p.nome, usuario:p.usuario, email:p.email, telefone:p.telefone, foto:p.foto}));
    return true;
  }catch(e){ return false; }
}

/* Mostra a foto num elemento (ou o desenho padrão, se não tiver foto) */
function pintarFoto(el, foto){
  if(!el) return;
  el.classList.toggle("com-foto", !!foto);
  el.style.backgroundImage = foto ? `url("${foto}")` : "";
}
/* Nome e foto no canto do topo */
function mostrarTopo(p){
  const n = $("#topoNome");
  if(n) n.textContent = p.nome;
  pintarFoto($("#topoAvatar"), p.foto);
}

/* Corta a imagem no quadrado e reduz para 256px (cabe no armazenamento).
   Devolve uma promessa com a imagem em texto (data URL). */
function reduzirFoto(arq){
  return new Promise((ok, falha) => {
    if(!arq || !arq.type.startsWith("image/")){ falha(new Error("Escolha um arquivo de imagem.")); return; }
    const img = new Image();
    const url = URL.createObjectURL(arq);
    img.onload = () => {
      const lado = Math.min(img.width, img.height), T = 256;
      const c = document.createElement("canvas");
      c.width = c.height = T;
      c.getContext("2d").drawImage(img, (img.width - lado) / 2, (img.height - lado) / 2, lado, lado, 0, 0, T, T);
      URL.revokeObjectURL(url);
      ok(c.toDataURL("image/jpeg", .85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); falha(new Error("Não consegui abrir essa imagem.")); };
    img.src = url;
  });
}