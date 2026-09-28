// achados.js
// Página "Achados": monta os cards, filtra pela busca e trata o coração.
//
// ============================================================
// IMPORTANTE:
// No campo "foto" de cada item abaixo, coloque o URL da imagem.
//
// Exemplos:
// foto: 'imagens/achados/moletom-preto.jpg'
// ou, se a imagem estiver hospedada na internet:
// foto: 'https://seusite.com/imagens/moletom-preto.jpg'
//
// Se você usar apenas o nome do arquivo, como:
// foto: 'moletom-preto.jpg'
// o código irá procurar automaticamente em:
// imagens/achados/moletom-preto.jpg
// ============================================================

const ACHADOS = [
    {
        id: 1,
        titulo: 'Moletom preto',
        local: 'Sala',
        data: 'Hoje',

        // >>> COLOQUE AQUI O URL DA IMAGEM DO MOLETOM <<<
        foto: 'https://consuladodorock.com.br/cdn/shop/files/LISAS-Moletom-Fechado-preto.webp?v=1740445169&width=750'
    },

    {
        id: 2,
        titulo: 'Fone de ouvido',
        local: 'Refeitório',
        data: 'Ontem',

        // >>> COLOQUE AQUI O URL DA IMAGEM DO FONE <<<
        foto: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRDH6EcMGHqtGdsY0LRvHGxrczv3fCHAfSMtin5Ki-BiSfZUX49mMNZbyJlMC2F4BAuPzIh_ghAZk5ZItznjBjGVMTWNYNM_lxFK8i4JvLo'
    },

    {
        id: 3,
        titulo: 'Garrafa térmica',
        local: 'Auditório',
        data: 'Há 3 dias',

        // >>> COLOQUE AQUI O URL DA IMAGEM DA GARRAFA <<<
        foto: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTs_kElsQHz0Oh8YVlA2-h55C73d1NNPNNU6KtkFS9VR0ohghEJ1guvRmzzP_gMh80Zs5Bk4pWBHiElSnO2tAOG_nB-YlSL'
    },

    {
        id: 4,
        titulo: 'Chaves',
        local: 'Banheiro',
        data: 'Há 1 semana',

        // >>> COLOQUE AQUI O URL DA IMAGEM DAS CHAVES <<<
        foto: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRxJbLHJ6ft0wRz3hoO1kp_V0qqMcwtQ3gK-XWDg_j1wH7Ww5oDZRPMJvEkh9-wyMzoL_8R20cx1r0gLs0w6rd6KdHUFizr14taIVxYr96Z'
    },

    {
        id: 5,
        titulo: 'Celular (iPhone)',
        local: 'Refeitório',
        data: 'Há 2 semanas',

        // >>> COLOQUE AQUI O URL DA IMAGEM DO CELULAR <<<
        foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm1epyUsfx9kcBwui8tgQYxrNwdhAwgldYi7gdhQPUcQ&s=10'
    },

    {
        id: 6,
        titulo: 'Fone de ouvido',
        local: 'Auditório',
        data: 'Há 1 mês',

        // >>> COLOQUE AQUI O URL DA IMAGEM DO FONE <<<
        foto: 'fone-de-ouvido.jpg'
    },

    {
        id: 7,
        titulo: 'Caderneta universitária',
        local: 'Sala',
        data: 'Há 1 mês',

        // >>> COLOQUE AQUI O URL DA IMAGEM DA CADERNETA <<<
        foto: 'caderneta.jpg'
    },

    {
        id: 8,
        titulo: 'Estojo de óculos',
        local: 'Refeitório',
        data: 'Há 1 mês',

        // >>> COLOQUE AQUI O URL DA IMAGEM DO ESTOJO <<<
        foto: 'estojo-de-oculos.jpg'
    },

    {
        id: 9,
        titulo: 'Mochila',
        local: 'Auditório',
        data: 'Ontem',

        // >>> COLOQUE AQUI O URL DA IMAGEM DA MOCHILA <<<
        foto: 'mochila.jpg'
    },

    {
        id: 10,
        titulo: 'Casaco cinza',
        local: 'Sala',
        data: 'Há 2 semanas',

        // >>> COLOQUE AQUI O URL DA IMAGEM DO CASACO <<<
        foto: 'casaco-cinza.jpg'
    },

    {
        id: 11,
        titulo: 'Carteira',
        local: 'Refeitório',
        data: 'Há 1 semana',

        // >>> COLOQUE AQUI O URL DA IMAGEM DA CARTEIRA <<<
        foto: 'carteira.jpg'
    },

    {
        id: 12,
        titulo: 'Copo térmico',
        local: 'Auditório',
        data: 'Há 3 semanas',

        // >>> COLOQUE AQUI O URL DA IMAGEM DO COPO <<<
        foto: 'copo-termico.jpg'
    }
];


// ============================================================
// ÍCONES
// ============================================================

const ICONE_LOCAL = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11z"/>
        <circle cx="12" cy="10" r="2"/>
    </svg>
`;

const ICONE_DATA = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2"/>
        <path d="M4 10h16M8 3v4M16 3v4"/>
    </svg>
`;

const ICONE_CORACAO = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>
    </svg>
`;


// ============================================================
// CRIA O CARD
// ============================================================

function criarCard(item) {

    // Se "foto" começar com http:// ou https://,
    // usamos o URL diretamente.
    //
    // Se for apenas o nome do arquivo,
    // usamos a pasta imagens/achados/.

    const urlImagem =
        item.foto.startsWith('http://') ||
        item.foto.startsWith('https://')
            ? item.foto
            : `imagens/achados/${item.foto}`;

    return `
        <article class="publicacao" data-id="${item.id}">

            <div class="foto-item">

                <span class="tag tag-achado">
                    Achado
                </span>

                <img
                    src="${urlImagem}"
                    alt="${item.titulo}"
                    loading="lazy"
                >

            </div>

            <div class="info-item">

                <h3>
                    <a
                        class="link-produto"
                        href="produto.html?id=achado-${item.id}"
                    >
                        ${item.titulo}
                    </a>
                </h3>

                <p class="linha-info">
                    ${ICONE_LOCAL}
                    ${item.local}
                </p>

                <div class="rodape-card">

                    <p class="linha-info">
                        ${ICONE_DATA}
                        ${item.data}
                    </p>

                    <button
                        class="coracao"
                        type="button"
                        aria-label="Curtir ${item.titulo}"
                        aria-pressed="false"
                    >
                        ${ICONE_CORACAO}
                    </button>

                </div>

            </div>

        </article>
    `;
}


// ============================================================
// NORMALIZA TEXTO PARA A BUSCA
// Exemplo:
// "Refeitório" -> "refeitorio"
// ============================================================

function normalizar(texto) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}


// ============================================================
// INICIALIZAÇÃO DA PÁGINA
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    const lista = document.getElementById('lista-achados');
    const campoBusca = document.getElementById('campo-busca');
    const semResultado = document.getElementById('sem-resultado');

    if (!lista) {
        console.error('Elemento #lista-achados não foi encontrado.');
        return;
    }

    // Monta todos os cards
    lista.innerHTML = ACHADOS.map(criarCard).join('');


    // ========================================================
    // BUSCA
    // Procura por:
    // - título
    // - local
    // - data
    // - palavra "achado"
    // ========================================================

    if (campoBusca) {

        campoBusca.addEventListener('input', function () {

            const termo = normalizar(
                campoBusca.value.trim()
            );

            let visiveis = 0;

            lista
                .querySelectorAll('.publicacao')
                .forEach(function (card) {

                    const item = ACHADOS.find(function (a) {
                        return a.id === Number(card.dataset.id);
                    });

                    if (!item) return;

                    const texto = normalizar(
                        item.titulo +
                        ' ' +
                        item.local +
                        ' ' +
                        item.data +
                        ' achado'
                    );

                    const mostrar =
                        termo === '' ||
                        texto.includes(termo);

                    card.hidden = !mostrar;

                    if (mostrar) {
                        visiveis++;
                    }
                });

            if (semResultado) {
                semResultado.hidden = visiveis > 0;
            }

        });
    }


    // ========================================================
    // CORAÇÃO
    // Um único evento controla todos os cards.
    // ========================================================

    lista.addEventListener('click', function (evento) {

        const botao = evento.target.closest('.coracao');

        if (!botao) return;

        const curtido =
            botao.classList.toggle('curtido');

        botao.setAttribute(
            'aria-pressed',
            String(curtido)
        );

    });


    // ========================================================
    // IMAGEM AUSENTE
    // Esconde a imagem caso o URL esteja errado
    // ou a imagem não exista.
    // ========================================================

    lista.addEventListener(
        'error',
        function (evento) {

            if (evento.target.tagName === 'IMG') {

                evento.target.classList.add(
                    'sem-imagem'
                );

                console.warn(
                    'Imagem não encontrada:',
                    evento.target.src
                );
            }

        },
        true
    );

});
