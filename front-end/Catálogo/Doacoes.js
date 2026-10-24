// Doacoes.js
// Página "Doações": monta os cards, filtra pela busca e trata o coração.

// Para adicionar uma doação, inclua uma linha aqui e coloque a foto em imagens/doacoes/<foto>
const DOACOES = [
    { id: 1,  titulo: 'Mochila escolar',         data: 'Há 2 dias',     foto: 'mochila-escolar.jpg' },
    { id: 2,  titulo: 'AirPods',                 data: 'Há 2 semanas',  foto: 'airpods.jpg' },
    { id: 3,  titulo: 'Caderno universitário',   data: 'Há 2 semanas',  foto: 'caderno-universitario.jpg' },
    { id: 4,  titulo: 'Garrafa térmica',         data: 'Há 2 dias',     foto: 'garrafa-termica.jpg' },
    { id: 5,  titulo: 'Chaves',                  data: 'Há 2 dias',     foto: 'chaves.jpg' },
    { id: 6,  titulo: 'Celular (iPhone)',        data: 'Há 2 semanas',  foto: 'celular.jpg' },
    { id: 7,  titulo: 'Fone de ouvido',          data: 'Há 2 semanas',  foto: 'fone-de-ouvido.jpg' },
    { id: 8,  titulo: 'Carteira',                data: 'Há 2 semanas',  foto: 'carteira.jpg' },
    { id: 9,  titulo: 'Óculos de grau',          data: 'Há 2 semanas',  foto: 'oculos-de-grau.jpg' },
    { id: 10, titulo: 'Moletom cinza',           data: 'Há 2 meses',    foto: 'moletom-cinza.jpg' },
    { id: 11, titulo: 'Pen drive',               data: 'Há 2 semanas',  foto: 'pen-drive.jpg' },
    { id: 12, titulo: 'Garrafa',                 data: 'Há 2 semanas',  foto: 'garrafa.jpg' }
];

const ICONE_DATA = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/></svg>';
const ICONE_CORACAO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
const ICONE_PRESENTE = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8c-2.5 0-4-1-4-2.5S9.5 3 11 4.5L12 8zm0 0c2.5 0 4-1 4-2.5S14.5 3 13 4.5L12 8z"/></svg>';

function criarCard(item) {
    return `
        <article class="publicacao" data-id="${item.id}">
            <div class="foto-item">
                <span class="tag tag-doacao">${ICONE_PRESENTE}Doação</span>
                <img src="imagens/doacoes/${item.foto}" alt="${item.titulo}" loading="lazy">
            </div>
            <div class="info-item">
                <h3><a class="link-produto" href="../produto.html?id=doacao-${item.id}">${item.titulo}</a></h3>
                <div class="rodape-card">
                    <p class="linha-info">${ICONE_DATA}${item.data}</p>
                    <button class="coracao" type="button" aria-label="Curtir ${item.titulo}" aria-pressed="false">${ICONE_CORACAO}</button>
                </div>
            </div>
        </article>`;
}

// Remove acentos e maiúsculas para a busca achar "oculos" e "Óculos"
function normalizar(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

document.addEventListener('DOMContentLoaded', function () {
    const lista = document.getElementById('lista-doacoes');
    const campoBusca = document.getElementById('campo-busca');
    const semResultado = document.getElementById('sem-resultado');

    lista.innerHTML = DOACOES.map(criarCard).join('');

    // --- BUSCA: título, data e a palavra "doação" ---
    campoBusca.addEventListener('input', function () {
        const termo = normalizar(campoBusca.value.trim());
        let visiveis = 0;

        lista.querySelectorAll('.publicacao').forEach(function (card) {
            const item = DOACOES.find(function (d) { return d.id === Number(card.dataset.id); });
            const texto = normalizar(item.titulo + ' ' + item.data + ' doacao');
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