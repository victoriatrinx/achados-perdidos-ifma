// Perdidos.js
// Página "Perdidos": monta os cards, filtra pela busca e trata o coração.

// Pasta das fotos, relativa a esta página. Mude aqui se suas imagens ficarem em outro lugar
// (ex.: '../Imagens/perdidos/').
const PASTA_FOTOS = 'imagens/perdidos/';

// Para adicionar um item perdido, inclua uma linha aqui e coloque a foto na pasta acima
const PERDIDOS = [
    { id: 1,  titulo: 'Mochila',              local: 'Auditório',  data: 'Essa semana',  foto: 'mochila.jpg' },
    { id: 2,  titulo: 'Garrafa',              local: 'Banheiro',   data: 'Duas semanas', foto: 'garrafa.jpg' },
    { id: 3,  titulo: 'Fone de ouvido',       local: 'Refeitório', data: 'Um mês',       foto: 'fone-de-ouvido.jpg' },
    { id: 4,  titulo: 'Moletom',              local: 'Sala',       data: 'Essa semana',  foto: 'moletom.jpg' },
    { id: 5,  titulo: 'Celular (iPhone)',     local: 'Refeitório', data: 'Duas semanas', foto: 'celular.jpg' },
    { id: 6,  titulo: 'Carteira',             local: 'Sala',       data: 'Um mês',       foto: 'carteira.jpg' },
    { id: 7,  titulo: 'Óculos de sol',        local: 'Banheiro',   data: 'Essa semana',  foto: 'oculos-de-sol.jpg' },
    { id: 8,  titulo: 'AirPods',              local: 'Auditório',  data: 'Duas semanas', foto: 'airpods.jpg' },
    { id: 9,  titulo: 'Chaves',               local: 'Refeitório', data: 'Um mês',       foto: 'chaves.jpg' },
    { id: 10, titulo: 'Caderno universitário', local: 'Sala',       data: 'Essa semana',  foto: 'caderno.jpg' },
    { id: 11, titulo: 'Boné',                 local: 'Auditório',  data: 'Duas semanas', foto: 'bone.jpg' },
    { id: 12, titulo: 'Smartwatch',           local: 'Banheiro',   data: 'Um mês',       foto: 'smartwatch.jpg' }
];

const ICONE_ALERTA = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#fff" stroke="none"/><path d="M12 7v6M12 16.5v.5" stroke="#9A0B33" stroke-width="2.6"/></svg>';
const ICONE_LOCAL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11z"/><circle cx="12" cy="10" r="2"/></svg>';
const ICONE_DATA = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/></svg>';
const ICONE_CORACAO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';

function criarCard(item) {
    return `
        <article class="publicacao" data-id="${item.id}">
            <div class="foto-item">
                <span class="tag tag-perdido">${ICONE_ALERTA}Perdido</span>
                <img src="${PASTA_FOTOS}${item.foto}" alt="${item.titulo}" loading="lazy">
            </div>
            <div class="info-item">
                <h3><a class="link-produto" href="produto.html?id=perdido-${item.id}">${item.titulo}</a></h3>
                <p class="linha-info">${ICONE_LOCAL}${item.local}</p>
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
    const lista = document.getElementById('lista-perdidos');
    const campoBusca = document.getElementById('campo-busca');
    const semResultado = document.getElementById('sem-resultado');

    lista.innerHTML = PERDIDOS.map(criarCard).join('');

    // --- BUSCA: título, local, data e a palavra "perdido" ---
    campoBusca.addEventListener('input', function () {
        const termo = normalizar(campoBusca.value.trim());
        let visiveis = 0;

        lista.querySelectorAll('.publicacao').forEach(function (card) {
            const item = PERDIDOS.find(function (p) { return p.id === Number(card.dataset.id); });
            const texto = normalizar(item.titulo + ' ' + item.local + ' ' + item.data + ' perdido');
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
    // (o evento "error" não sobe na árvore, por isso usamos a fase de captura)
    lista.addEventListener('error', function (evento) {
        if (evento.target.tagName === 'IMG') evento.target.classList.add('sem-imagem');
    }, true);
});