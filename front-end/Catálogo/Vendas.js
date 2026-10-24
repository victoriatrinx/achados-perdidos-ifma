// Vendas.js
// Página "Vendas": monta os cards, filtra pela busca e trata o coração.

// Para adicionar um item, inclua uma linha aqui e coloque a foto em imagens/vendas/<foto>
// "preco" é um número (ex.: 45 ou 45.5); a página formata em reais.
const VENDAS = [
    { id: 1,  titulo: 'Calculadora científica',  preco: 45,   data: 'Hoje',          foto: 'calculadora.jpg' },
    { id: 2,  titulo: 'Jaleco branco (M)',       preco: 35,   data: 'Ontem',         foto: 'jaleco.jpg' },
    { id: 3,  titulo: 'Livro de Cálculo I',      preco: 60,   data: 'Há 2 dias',     foto: 'livro-calculo.jpg' },
    { id: 4,  titulo: 'Mochila escolar',         preco: 80,   data: 'Há 3 dias',     foto: 'mochila.jpg' },
    { id: 5,  titulo: 'Fone de ouvido',          preco: 50,   data: 'Há 1 semana',   foto: 'fone-de-ouvido.jpg' },
    { id: 6,  titulo: 'Garrafa térmica',         preco: 25,   data: 'Há 1 semana',   foto: 'garrafa-termica.jpg' },
    { id: 7,  titulo: 'Kit de réguas e esquadros', preco: 20, data: 'Há 1 semana',   foto: 'kit-reguas.jpg' },
    { id: 8,  titulo: 'Caderno universitário',   preco: 15,   data: 'Há 2 semanas',  foto: 'caderno.jpg' },
    { id: 9,  titulo: 'Pen drive 32 GB',         preco: 30,   data: 'Há 2 semanas',  foto: 'pen-drive.jpg' },
    { id: 10, titulo: 'Moletom do IFMA (G)',     preco: 55,   data: 'Há 2 semanas',  foto: 'moletom.jpg' },
    { id: 11, titulo: 'Fichário',                preco: 28.5, data: 'Há 3 semanas',  foto: 'fichario.jpg' },
    { id: 12, titulo: 'Estojo completo',         preco: 18,   data: 'Há 1 mês',      foto: 'estojo.jpg' }
];

const ICONE_DATA = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/></svg>';
const ICONE_CORACAO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
const ICONE_ETIQUETA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="7.5" cy="8.5" r="1"/></svg>';

function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function criarCard(item) {
    return `
        <article class="publicacao" data-id="${item.id}">
            <div class="foto-item">
                <span class="tag tag-venda">${ICONE_ETIQUETA}Venda</span>
                <img src="imagens/vendas/${item.foto}" alt="${item.titulo}" loading="lazy">
            </div>
            <div class="info-item">
                <h3><a class="link-produto" href="../produto.html?id=venda-${item.id}">${item.titulo}</a></h3>
                <p class="preco">${formatarPreco(item.preco)}</p>
                <div class="rodape-card">
                    <p class="linha-info">${ICONE_DATA}${item.data}</p>
                    <button class="coracao" type="button" aria-label="Curtir ${item.titulo}" aria-pressed="false">${ICONE_CORACAO}</button>
                </div>
            </div>
        </article>`;
}

// Remove acentos e maiúsculas para a busca achar "calculo" e "Cálculo"
function normalizar(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

document.addEventListener('DOMContentLoaded', function () {
    const lista = document.getElementById('lista-vendas');
    const campoBusca = document.getElementById('campo-busca');
    const semResultado = document.getElementById('sem-resultado');

    lista.innerHTML = VENDAS.map(criarCard).join('');

    // --- BUSCA: título, preço, data e a palavra "venda" ---
    campoBusca.addEventListener('input', function () {
        const termo = normalizar(campoBusca.value.trim());
        let visiveis = 0;

        lista.querySelectorAll('.publicacao').forEach(function (card) {
            const item = VENDAS.find(function (v) { return v.id === Number(card.dataset.id); });
            const texto = normalizar(item.titulo + ' ' + formatarPreco(item.preco) + ' ' + item.data + ' venda');
            const mostrar = termo === '' || texto.includes(termo);

            card.hidden = !mostrar;
            if (mostrar) visiveis++;
        });

        semResultado.hidden = visiveis > 0;
    });

    // --- CORAÇÃO: um único ouvinte para todos os cards ---
    lista.addEventListener('click', function (evento) {
        const botao = evento.target.closest('.coracao');
        if (!botao) return;
        const curtido = botao.classList.toggle('curtido');
        botao.setAttribute('aria-pressed', curtido);
    });

    // --- FOTO AUSENTE: esconde o ícone de imagem quebrada ---
    lista.addEventListener('error', function (evento) {
        if (evento.target.tagName === 'IMG') evento.target.classList.add('sem-imagem');
    }, true);
});