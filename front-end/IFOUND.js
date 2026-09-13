// IFOUND.js
// Comportamentos da home pré-login do iFound

document.addEventListener('DOMContentLoaded', function () {

    // --- BOTÃO "PUBLICAR ITEM" ---
    // Só quem está logado pode publicar, então manda pro login
    document.getElementById('btn-publicar').addEventListener('click', function () {
        window.location.href = 'login.html';
    });


    // --- BUSCA ---
    // Filtra os cards de "Publicações recentes" enquanto a pessoa digita
    const campoBusca = document.getElementById('campo-busca');
    campoBusca.addEventListener('input', filtrarPublicacoes);


    // --- BOTÕES DA BARRA LATERAL (Achados, Perdidos, Doações, Vendas) ---
    // As páginas de listagem ainda não existem, então por enquanto
    // avisa que está em construção em vez de dar link quebrado
    const itensCategoria = document.querySelectorAll('.item-categoria');

    itensCategoria.forEach(function (item) {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            alert('Essa listagem ainda está em construção.');
        });
    });


    // --- "VER TODAS" (publicações recentes) ---
    // Também não existe página de listagem completa ainda
    const linkVerTodas = document.querySelector('#cabecalho-publicacoes a');
    linkVerTodas.addEventListener('click', function (event) {
        event.preventDefault();
        alert('Essa página ainda está em construção.');
    });


    // --- BOTÃO "SAIBA MAIS" (banner de gamificação) ---
    const btnSaibaMais = document.querySelector('#banner-conteudo button');
    btnSaibaMais.addEventListener('click', function () {
        alert('Essa página ainda está em construção.');
    });

});


// Esconde os cards cujo título não bate com o texto digitado
function filtrarPublicacoes() {
    const termo = document.getElementById('campo-busca').value
        .trim()
        .toLowerCase();

    const publicacoes = document.querySelectorAll('.publicacao');

    publicacoes.forEach(function (publicacao) {
        const titulo = publicacao.querySelector('h3').textContent.toLowerCase();

        if (termo === '' || titulo.includes(termo)) {
            publicacao.style.display = '';
        } else {
            publicacao.style.display = 'none';
        }
    });
}