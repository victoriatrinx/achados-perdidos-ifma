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