async function carregarPerdidos() {
    const lista = document.getElementById("lista-perdidos");

    lista.innerHTML = "<p>Carregando publicações...</p>";

    const { data, error } = await clienteSupabase
        .from("publicacoes")
        .select("*")
        .eq("tipo", "perdido")
        .eq("status", "ativo")
        .order("criado_em", { ascending: false });

    if (error) {
        console.error("Erro ao buscar perdidos:", error);
        lista.innerHTML = "<p>Não foi possível carregar os perdidos.</p>";
        return;
    }

    function renderizarPerdidos(publicacoes) {
        if (!publicacoes.length) {
            lista.innerHTML = "<p>Nenhum item perdido publicado ainda.</p>";
            return;
        }

        lista.innerHTML = publicacoes.map(item => `
            <article class="publicacao" data-id="${item.id}">
                <div class="foto-item">
                    <span class="tag tag-perdido">Perdido</span>
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

    renderizarPerdidos(data);

    const busca = document.getElementById("campo-busca");

    if (busca) {
        busca.addEventListener("input", () => {
            const termo = busca.value.toLowerCase().trim();

            const filtrados = data.filter(item =>
                `${item.titulo} ${item.descricao || ""} ${item.local || ""}`
                    .toLowerCase()
                    .includes(termo)
            );

            renderizarPerdidos(filtrados);
        });
    }
}

carregarPerdidos();