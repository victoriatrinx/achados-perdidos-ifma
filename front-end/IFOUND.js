// IFOUND.js
// Comportamentos da página inicial do iFound

document.addEventListener('DOMContentLoaded', function () {

    // --- BUSCA ---
    // Filtra os cards de "Publicações recentes" enquanto a pessoa digita
    const campoBusca = document.getElementById('campo-busca');
    campoBusca.addEventListener('input', filtrarPublicacoes);


    // --- IMAGENS DOS PRODUTOS ---
    // Se a foto não existir/carregar, esconde o ícone de imagem quebrada
    document.querySelectorAll('.foto-item img').forEach(function (img) {
        function marcarErro() { img.classList.add('sem-imagem'); }
        img.addEventListener('error', marcarErro);
        if (img.complete && img.naturalWidth === 0) marcarErro();
    });


    // --- CORAÇÃO (curtir) ---
    // Alterna o estado e atualiza o contador
    document.querySelectorAll('.coracao').forEach(function (botao) {
        botao.addEventListener('click', function () {
            const contador = botao.querySelector('span');
            let total = parseInt(contador.textContent, 10) || 0;

            if (botao.classList.toggle('curtido')) {
                total++;
            } else {
                total--;
            }

            contador.textContent = total;
        });
    });

});


// Esconde os cards que não batem com o texto digitado
// (procura no título, no local/data e na etiqueta do card)
function filtrarPublicacoes() {
    const termo = document.getElementById('campo-busca').value
        .trim()
        .toLowerCase();

    const publicacoes = document.querySelectorAll('.publicacao');
    let visiveis = 0;

    publicacoes.forEach(function (publicacao) {
        const texto = publicacao.textContent.toLowerCase();

        if (termo === '' || texto.includes(termo)) {
            publicacao.style.display = '';
            visiveis++;
        } else {
            publicacao.style.display = 'none';
        }
    });

    document.getElementById('sem-resultado').hidden = visiveis > 0;
}

// Buscar publicações reais no Supabase
async function buscarPublicacoesSupabase() {
    const { data, error } = await clienteSupabase
        .from("publicacoes")
        .select("*")
        .eq("status", "ativo")
        .order("criado_em", { ascending: false });

    if (error) {
        console.error("Erro ao buscar publicações:", error);
        return [];
    }

    return data;
}

// Mostrar publicações do Supabase na pré-login
async function carregarPublicacoes() {
    const grade = document.getElementById("grid-publicacoes");

    if (!grade) {
        console.error("Área de publicações não encontrada.");
        return;
    }

    const publicacoes = await buscarPublicacoesSupabase();

    const categorias = {
        encontrado: "Achado",
        perdido: "Perdido",
        doacao: "Doação",
        venda: "Venda"
    };

    grade.innerHTML = "";

    publicacoes.forEach(function (item) {
        const artigo = document.createElement("article");
        artigo.className = "publicacao";
        artigo.style.cursor = "pointer";

        artigo.addEventListener("click", function () {
            window.location.href = `item.html?id=${item.id}`;
        });

        const categoria = categorias[item.tipo] || item.tipo;
        const imagem = item.imagem_url ||
            (Array.isArray(item.fotos_urls) ? item.fotos_urls[0] : "");

        artigo.innerHTML = `
            <div class="foto-item">
                <span class="tag">${categoria}</span>
                ${imagem ? `<img src="${imagem}" alt="${item.titulo}" loading="lazy">` : ""}
            </div>
            <div class="info-item">
                <h3>${item.titulo}</h3>
                <p>${item.descricao || ""}</p>
                <p class="linha-info">${item.local || "Local não informado"}</p>
            </div>
        `;

        grade.appendChild(artigo);
    });

    filtrarPublicacoes();
}

document.addEventListener("DOMContentLoaded", carregarPublicacoes);