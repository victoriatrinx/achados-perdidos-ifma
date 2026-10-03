// RecuperarSenha.js
// Tela "Recuperar senha": confere se o e-mail tem conta e segue para a redefinição.
// Simulação: sem back-end não existe envio de e-mail de verdade.
// Depende do auth.js (carregado antes no HTML).

document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('recuperar-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // não deixa a página recarregar

        const email = document.getElementById('email');
        limparErro(email);

        // 1) o e-mail está escrito de forma válida?
        if (!email.checkValidity() || email.value.trim() === '') {
            mostrarErro(email, 'Digite um e-mail válido.');
            return;
        }

        // 2) existe conta com esse e-mail?
        if (!Auth.emailExiste(email.value)) {
            mostrarErro(email, 'Não encontramos uma conta com esse e-mail.');
            return;
        }

        // 3) guarda o e-mail para a próxima tela (só enquanto a aba estiver aberta)
        sessionStorage.setItem('emailRecuperacao', email.value.trim().toLowerCase());

        // 4) mostra a confirmação e, depois de 2 segundos, vai para a redefinição
        form.querySelector('button[type="submit"]').disabled = true;
        mostrarConfirmacao(form);

        setTimeout(function () {
            window.location.href = 'RedefinirSenha.html';
        }, 2000);
    });

});

// Mensagem verde de confirmação, acima do card
function mostrarConfirmacao(form) {
    const msg = document.createElement('p');
    msg.className = 'mensagem-sucesso';
    msg.textContent = 'Link enviado! Confira seu e-mail. Redirecionando...';
    form.insertAdjacentElement('beforebegin', msg);
}

// Mostra a mensagem de erro no fim do grupo do campo (não atrapalha o ícone)
function mostrarErro(input, mensagem) {
    limparErro(input);
    input.classList.add('input-error');

    const erro = document.createElement('span');
    erro.className = 'erro-msg';
    erro.textContent = mensagem;
    input.closest('.input-group').appendChild(erro);
}

// Tira o erro antigo do campo
function limparErro(input) {
    input.classList.remove('input-error');
    const erro = input.closest('.input-group').querySelector('.erro-msg');
    if (erro) erro.remove();
}