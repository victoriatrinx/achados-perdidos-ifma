// RecuperarSenha.js
// Tela "Recuperar senha": confere se o e-mail tem conta e segue para a redefinição.
// Simulação: sem back-end não existe envio de e-mail de verdade.
// Depende do auth.js (carregado antes no HTML).

document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('recuperar-form');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // não deixa a página recarregar

        const email = document.getElementById('email');
        limparErro(email);

        // 1) o e-mail está escrito de forma válida?
        if (!email.checkValidity() || email.value.trim() === '') {
            mostrarErro(email, 'Digite um e-mail válido.');
            return;
        }


       const botao = form.querySelector('button[type="submit"]');
        botao.disabled = true;

        const resultado = await Auth.recuperarSenha(email.value);

        if (!resultado.ok) {
            botao.disabled = false;
            mostrarErro(email, resultado.mensagem);
            return;
        }

        mostrarConfirmacao(form);
        form.querySelector('.mensagem-sucesso').textContent =
            'Se esse e-mail estiver cadastrado, você receberá instruções para recuperar sua senha.';
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