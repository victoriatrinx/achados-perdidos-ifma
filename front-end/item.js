/* ==========================================================
   item.js — página de detalhe de um item do iFound
   Uso: item.html?id=1  (o id vem do card clicado na home)
   ========================================================== */

const ROTULOS = { perdido: "Perdido", achado: "Achado", doacao: "Doação", venda: "Venda" };

const MOTIVOS = [
  "Anúncio falso",
  "Conteúdo ofensivo",
  "Fraude / golpe",
  "Ilegal",
  "Pode prejudicar outros usuários",
  "Outro"
];

const SVG = {
  alerta: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/></svg>',
  coracao: '<svg viewBox="0 0 24 24" width="26" height="26" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10z"/></svg>',
  local: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></svg>',
  data: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>',
  usuario: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>',
  preco: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.2c-.6-.8-1.5-1.2-2.6-1.2-1.4 0-2.4.7-2.4 1.8 0 2.7 5 1.2 5 4 0 1.1-1.1 1.9-2.6 1.9-1.2 0-2.2-.5-2.8-1.4M12 6.5V8M12 16v1.5"/></svg>',
  msg: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 3C6.9 3 3 6.6 3 11c0 2.3 1 4.3 2.7 5.8L5 21l4.2-2c.9.2 1.8.3 2.8.3 5.1 0 9-3.6 9-8S17.1 3 12 3z"/></svg>',
  triangulo: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5L2.8 20h18.4L12 3.5z"/><path d="M12 10v4.5M12 17.5v.3"/></svg>',
  ok: '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
};

/* ---------- Utilidades ---------- */
function escapar(texto) {
  const d = document.createElement("div");
  d.textContent = texto == null ? "" : String(texto);
  return d.innerHTML;
}

function formatarData(iso) {
  const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  const p = String(iso).split("-");
  if (p.length !== 3) return escapar(iso);
  return Number(p[2]) + " de " + meses[Number(p[1]) - 1];
}

function formatarPreco(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function avisar(texto) {
  const a = document.createElement("div");
  a.className = "aviso";
  a.setAttribute("role", "status");
  a.textContent = texto;
  document.body.appendChild(a);
  setTimeout(function () { a.remove(); }, 2600);
}

/* Favoritos (guardados no navegador; depois virão do back-end) */
function lerFavoritos() {
  try { return JSON.parse(localStorage.getItem("ifound_favoritos") || "[]"); } catch (e) { return []; }
}
function salvarFavoritos(lista) {
  try { localStorage.setItem("ifound_favoritos", JSON.stringify(lista)); } catch (e) { /* ignora */ }
}

/* ---------- Desenho da página ---------- */
const conteudo = document.getElementById("conteudo");
let itemAtual = null;

function desenharFoto(item) {
  if (item.imagem) {
    return '<img src="' + escapar(item.imagem) + '" alt="Foto: ' + escapar(item.titulo) + '">';
  }
  const partes = {
    mochila: '<div class="mochila"><div class="corpo"></div><div class="bolso"></div><div class="losango"></div></div>',
    airpods: '<div class="airpods"></div>',
    livros: '<div class="livros"></div>',
    garrafa: '<div class="garrafa"></div>',
    chaves: '<div class="chaves"></div>'
  };
  return partes[item.icone] || "";
}

function desenharItem(item) {
  const favorito = lerFavoritos().indexOf(item.id) !== -1;
  const icoSelo = item.tipo === "perdido" ? SVG.alerta : "";

  let html = "";
  html += '<div class="foto">';
  html +=   desenharFoto(item);
  html +=   '<span class="selo ' + item.tipo + '">' + icoSelo + ROTULOS[item.tipo] + '</span>';
  html +=   '<button class="fav" id="btnFav" aria-pressed="' + favorito + '" aria-label="Favoritar">' + SVG.coracao + '</button>';
  html += '</div>';

  html += '<h1 class="titulo">' + escapar(item.titulo) + '</h1>';
  html += '<p class="descricao">' + escapar(item.descricao) + '</p>';

  html += '<div class="infos">';
  html +=   '<div class="info"><span class="ico">' + SVG.local + '</span><div><small>Local:</small><strong>' + escapar(item.local) + '</strong></div></div>';
  html +=   '<div class="info"><span class="ico">' + SVG.data + '</span><div><small>Data:</small><strong>' + formatarData(item.data) + '</strong></div></div>';
  if (item.tipo === "venda" && item.preco != null) {
    html += '<div class="info largo"><span class="ico">' + SVG.preco + '</span><div><small>Preço:</small><strong>' + formatarPreco(item.preco) + '</strong></div></div>';
  }
  html +=   '<div class="info largo"><span class="ico">' + SVG.usuario + '</span><div><small>Publicado por:</small><strong>' + escapar(item.autor) + '</strong></div></div>';
  html += '</div>';

  html += '<div class="acoes">';
  html +=   '<button class="btn btn-verde" id="btnMensagem">' + SVG.msg + 'Mensagem</button>';
  html +=   '<button class="btn btn-rosa" id="btnDenunciar">' + SVG.triangulo + 'Denunciar</button>';
  html += '</div>';

  conteudo.innerHTML = html;

  document.getElementById("btnFav").addEventListener("click", alternarFavorito);
  document.getElementById("btnMensagem").addEventListener("click", function () {
    avisar("A página de Mensagens ainda está sendo feita.");
  });
  document.getElementById("btnDenunciar").addEventListener("click", abrirPainel);
  document.title = item.titulo + " • iFound";
}

function desenharNaoEncontrado() {
  conteudo.innerHTML =
    '<div class="vazio">' +
      '<h1>Item não encontrado</h1>' +
      '<p>Esse anúncio pode ter sido removido. Volte para o início e escolha outro.</p>' +
      '<a class="btn btn-verde" href="home.html">Voltar ao início</a>' +
    '</div>';
}

function alternarFavorito() {
  const botao = document.getElementById("btnFav");
  let lista = lerFavoritos();
  const i = lista.indexOf(itemAtual.id);
  if (i === -1) lista.push(itemAtual.id); else lista.splice(i, 1);
  salvarFavoritos(lista);
  botao.setAttribute("aria-pressed", String(i === -1));
}

/* ---------- Denúncia ---------- */
const fundo = document.getElementById("fundo");
const painel = document.getElementById("painel");
const passoMotivo = document.getElementById("passoMotivo");
const passoTexto = document.getElementById("passoTexto");
const listaMotivos = document.getElementById("listaMotivos");
const btnContinuar = document.getElementById("btnContinuar");
const textoDenuncia = document.getElementById("textoDenuncia");
const contador = document.getElementById("contador");
const erroTexto = document.getElementById("erroTexto");
const painelTitulo = document.getElementById("painelTitulo");

let motivoEscolhido = null;

function montarMotivos() {
  listaMotivos.innerHTML = "";
  MOTIVOS.forEach(function (m) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "motivo";
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", "false");
    b.innerHTML = '<span class="radio"></span><span>' + escapar(m) + '</span>';
    b.addEventListener("click", function () { escolherMotivo(m); });
    listaMotivos.appendChild(b);
  });
  listaMotivos.setAttribute("role", "radiogroup");
}

function escolherMotivo(m) {
  motivoEscolhido = m;
  Array.prototype.forEach.call(listaMotivos.children, function (b, i) {
    const marcado = MOTIVOS[i] === m;
    b.setAttribute("aria-checked", String(marcado));
    b.querySelector(".radio").classList.toggle("marcado", marcado);
  });
  btnContinuar.disabled = false;
}

function abrirPainel() {
  motivoEscolhido = null;
  btnContinuar.disabled = true;
  textoDenuncia.value = "";
  contador.textContent = "0/500";
  erroTexto.hidden = true;
  montarMotivos();
  mostrarPasso("motivo");
  fundo.hidden = false;
  painel.hidden = false;
  document.getElementById("btnFechar").focus();
}

function fecharPainel() {
  fundo.hidden = true;
  painel.hidden = true;
}

function mostrarPasso(qual) {
  passoMotivo.hidden = qual !== "motivo";
  passoTexto.hidden = qual !== "texto";
  if (qual === "texto") textoDenuncia.focus();
}

/* Aqui é onde, no futuro, a denúncia vai para o back-end/ADM. */
function enviarDenuncia(dados) {
  let lista = [];
  try { lista = JSON.parse(localStorage.getItem("ifound_denuncias") || "[]"); } catch (e) { lista = []; }
  lista.push(dados);
  try { localStorage.setItem("ifound_denuncias", JSON.stringify(lista)); } catch (e) { /* ignora */ }
  console.log("Denúncia registrada:", dados);
}

function concluirDenuncia(descricao) {
  enviarDenuncia({
    itemId: itemAtual.id,
    motivo: motivoEscolhido,
    descricao: descricao || "",
    enviadoEm: new Date().toISOString()
  });
  fecharPainel();
  mostrarSucesso();
}

function mostrarSucesso() {
  conteudo.innerHTML =
    '<div class="sucesso">' +
      '<div class="selo-ok">' + SVG.ok + '</div>' +
      '<h1>Denúncia enviada<br>com sucesso.</h1>' +
      '<p>Sua denúncia foi registrada e encaminhada ao ADM para análise e providências.</p>' +
      '<button class="btn btn-verde btn-largo" id="btnOk">OK</button>' +
    '</div>';
  document.getElementById("btnOk").addEventListener("click", function () {
    desenharItem(itemAtual);
  });
  document.getElementById("btnOk").focus();
}

btnContinuar.addEventListener("click", function () {
  if (!motivoEscolhido) return;
  if (motivoEscolhido === "Outro") {
    mostrarPasso("texto");
  } else {
    concluirDenuncia("");
  }
});

document.getElementById("btnVoltarPasso").addEventListener("click", function () { mostrarPasso("motivo"); });

document.getElementById("btnEnviar").addEventListener("click", function () {
  const texto = textoDenuncia.value.trim();
  if (!texto) { erroTexto.hidden = false; textoDenuncia.focus(); return; }
  concluirDenuncia(texto);
});

textoDenuncia.addEventListener("input", function () {
  contador.textContent = textoDenuncia.value.length + "/500";
  if (textoDenuncia.value.trim()) erroTexto.hidden = true;
});

document.getElementById("btnFechar").addEventListener("click", fecharPainel);
fundo.addEventListener("click", fecharPainel);
document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !painel.hidden) fecharPainel(); });

/* ---------- Voltar ---------- */
document.getElementById("btnVoltar").addEventListener("click", function () {
  if (document.referrer) history.back(); else location.href = "home.html";
});

/* ---------- Início ---------- */
(function iniciar() {
  const id = new URLSearchParams(location.search).get("id");
  itemAtual = buscarItemPorId(id);
  if (itemAtual) desenharItem(itemAtual); else desenharNaoEncontrado();
})();