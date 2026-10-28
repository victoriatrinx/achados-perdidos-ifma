async function carregarAchados() {
    const lista = document.getElementById("lista-achados");

    lista.innerHTML = "<p>Carregando achados...</p>";

    const { data, error } = await clienteSupabase
        .from("publicacoes")
        .select("*")
        .eq("tipo", "encontrado")
        .eq("status", "ativo")
        .order("criado_em", { ascending: false });

    if (error) {
        console.error("Erro ao buscar achados:", error);
        lista.innerHTML = "<p>Não foi possível carregar os achados.</p>";
        return;
    }

    function renderizarAchados(publicacoes) {
        if (!publicacoes.length) {
            lista.innerHTML = "<p>Nenhum achado publicado ainda.</p>";
            return;
        }

      lista.innerHTML = publicacoes.map(item => `
    <article class="publicacao" data-id="${item.id}">
        <div class="foto-item">
            <span class="tag tag-achado">Achado</span>
            ${item.imagem_url
                ? `<img src="${item.imagem_url}" alt="${item.titulo}" loading="lazy">`
                : `<div class="sem-foto">Sem imagem</div>`
            }
        </div>

        <div class="info-item">
            <h3>${item.titulo}</h3>

            <p class="linha-info">
                ${item.local || "Local não informado"}
            </p>

            <div class="rodape-card">
                <p class="linha-info">
                    ${item.criado_em
                        ? new Date(item.criado_em).toLocaleDateString("pt-BR")
                        : ""}
                </p>
            </div>
        </div>
    </article>
`).join("");

       lista.querySelectorAll(".publicacao").forEach(card => {
    card.addEventListener("click", () => {
        window.location.href = `../Item.html?id=${card.dataset.id}`;
    });
});
    }

    renderizarAchados(data);

    const busca = document.getElementById("campo-busca");

    if (busca) {
        busca.addEventListener("input", () => {
            const termo = busca.value.toLowerCase().trim();

            const filtrados = data.filter(item =>
                item.titulo.toLowerCase().includes(termo)
            );

            renderizarAchados(filtrados);
        });
    }
}

carregarAchados();