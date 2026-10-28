//* ---------- Publicações do Supabase ---------- */

async function buscarItens() {
    const { data, error } = await clienteSupabase
        .from("publicacoes")
        .select("*")
        .eq("status", "ativo")
        .order("criado_em", { ascending: false });

    if (error) {
        console.error("Erro ao carregar publicações:", error);
        avisar("Não foi possível carregar as publicações.");
        return [];
    }

    return data.map(function(p) {
        const categorias = {
            encontrado: "Achado",
            perdido: "Perdido",
            doacao: "Doação",
            venda: "Venda"
        };

        return {
            id: p.id,
            cat: categorias[p.tipo] || p.tipo,
            nome: p.titulo,
            desc: p.descricao,
            local: p.local || "Local não informado",
            dias: Math.floor(
                (Date.now() - new Date(p.criado_em).getTime())
                / 86400000
            ),
            imagem: p.imagem_url ||
                (Array.isArray(p.fotos_urls)
                    ? p.fotos_urls[0]
                    : ""),
            forma: ""
        };
    });
}
/* ---------- Lista de itens ---------- */
let todos = [];
function quando(dias) {
    if (dias === 0) return "Hoje";
    if (dias === 1) return "Ontem";
    return "Há " + dias + " dias";
}
function desenhar(lista){
  $("#grade").innerHTML = lista.length ? lista.map(i => `
    <article class="card"
    style="cursor:pointer"
    onclick="if (!event.target.closest('button, a')) location.href='Item.html?id=${i.id}'">
      <span class="tag ${i.cat}">${i.cat}</span>
      <button class="fav" type="button" aria-label="Favoritar ${i.nome}" aria-pressed="false">♡</button>
      <div class="thumb">
      ${i.imagem
        ? `<img src="${i.imagem}" alt="${i.nome}">`
        : `<span class="obj ${i.forma}"></span>`}
      </div>
      <h4>${i.nome}</h4>
      <p class="desc">${i.desc}</p>
      <p class="meta">📍 ${i.local}</p>
      <p class="meta">🗓️ ${quando(i.dias)}</p>
    </article>`).join("") : `<p class="vazio">Nenhum item encontrado. Tente mudar a busca ou os filtros.</p>`;
}
function norm(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
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
if(params.get("cat") || params.get("local") || params.get("data")){ painel.hidden = false; btnFiltros.setAttribute("aria-expanded", "true"); }

/* ---------- Início ---------- */
buscarItens().then(d => { todos = d; filtrar(); });