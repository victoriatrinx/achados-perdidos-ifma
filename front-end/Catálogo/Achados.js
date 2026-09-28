// achados.js
// Página "Achados": monta os cards, filtra pela busca e trata o coração.

// Para adicionar um achado, inclua uma linha aqui e coloque a foto em imagens/achados/<foto>
const ACHADOS = [
    { id: 1,  titulo: 'Moletom preto',          local: 'Sala',      data: 'Hoje',           foto: 'moletom-preto.jpg' },
    { id: 2,  titulo: 'Fone de ouvido',         local: 'Refeitório', data: 'Ontem',          foto: 'airpods.jpg' },
    { id: 3,  titulo: 'Garrafa térmica',        local: 'Auditório', data: 'Há 3 dias',      foto: 'garrafa-termica.jpg' },
    { id: 4,  titulo: 'Chaves',                 local: 'Banheiro',  data: 'Há 1 semana',    foto: 'chaves.jpg' },
    { id: 5,  titulo: 'Celular (iPhone)',       local: 'Refeitório', data: 'Há 2 semanas',   foto: 'celular.jpg' },
    { id: 6,  titulo: 'Fone de ouvido',         local: 'Auditório', data: 'Há 1 mês',       foto: 'fone-de-ouvido.jpg' },
    { id: 7,  titulo: 'Caderneta universitária', local: 'Sala',      data: 'Há 1 mês',       foto: 'caderneta.jpg' },
    { id: 8,  titulo: 'Estojo de óculos',       local: 'Refeitório', data: 'Há 1 mês',       foto: 'estojo-de-oculos.jpg' },
    { id: 9,  titulo: 'Mochila',                local: 'Auditório', data: 'Ontem',          foto: 'mochila.jpg' },
    { id: 10, titulo: 'Casaco cinza',           local: 'Sala',      data: 'Há 2 semanas',   foto: 'casaco-cinza.jpg' },
    { id: 11, titulo: 'Carteira',               local: 'Refeitório', data: 'Há 1 semana',    foto: 'carteira.jpg' },
    { id: 12, titulo: 'Copo térmico',           local: 'Auditório', data: 'Há 3 semanas',   foto: 'copo-termico.jpg' }
];

const ICONE_LOCAL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11z"/><circle cx="12" cy="10" r="2"/></svg>';
const ICONE_DATA = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/></svg>';
const ICONE_CORACAO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';

function criarCard(item) {
    return `
        <article class="publicacao" data-id="${item.id}">
            <div class="foto-item">
                <span class="tag tag-achado">Achado</span>
                <img src="imagens/achados/${item.foto}" alt="${item.titulo}" loading="lazy">
            </div>
            <div class="info-item">
                <h3><a class="link-produto" href="produto.html?id=achado-${item.id}">${item.titulo}</a></h3>
                <p class="linha-info">${ICONE_LOCAL}${item.local}</p>
                <div class="rodape-card">
                    <p class="linha-info">${ICONE_DATA}${item.data}</p>
                    <button class="coracao" type="button" aria-label="Curtir ${item.titulo}" aria-pressed="false">${ICONE_CORACAO}</button>
                </div>
            </div>
        </article>`;
}

// Remove acentos e maiúsculas para a busca achar "refeitorio" e "Refeitório"
function normalizar(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

document.addEventListener('DOMContentLoaded', function () {
    const lista = document.getElementById('lista-achados');
    const campoBusca = document.getElementById('campo-busca');
    const semResultado = document.getElementById('sem-resultado');

    lista.innerHTML = ACHADOS.map(criarCard).join('');

    // --- BUSCA: título, local, data e a palavra "achado" ---
    campoBusca.addEventListener('input', function () {
        const termo = normalizar(campoBusca.value.trim());
        let visiveis = 0;

        lista.querySelectorAll('.publicacao').forEach(function (card) {
            const item = ACHADOS.find(function (a) { return a.id === Number(card.dataset.id); });
            const texto = normalizar(item.titulo + ' ' + item.local + ' ' + item.data + ' achado');
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