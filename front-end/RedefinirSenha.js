// RedefinirSenha.js
// Tela "Redefinir senha": troca a senha da conta que veio da tela anterior.
// Depende do auth.js (carregado antes no HTML).

document.addEventListener('DOMContentLoaded', async function () {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        alert('Link de recuperação inválido ou expirado. Solicite outro.');
        window.location.href = 'RecuperarSenha.html';
        return;
    }
    

    // Botões do "olhinho": alternam entre esconder e mostrar a senha
    document.querySelectorAll('.toggle-senha').forEach(function (botao) {
        botao.addEventListener('click', function () {
            const campo = document.getElementById(botao.dataset.alvo);
            campo.type = campo.type === 'password' ? 'text' : 'password';
        });
    });

    const form = document.getElementById('redefinir-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // não deixa a página recarregar

        const senha = document.getElementById('senha');
        const confirmar = document.getElementById('confirmar');
        let valido = true;

        limparErro(senha);
        limparErro(confirmar);

        // Mínimo de 8 caracteres (como pede o design)
        if (senha.value.length < 8) {
            mostrarErro(senha, 'A senha precisa ter pelo menos 8 caracteres.');
            valido = false;
        }

        // As duas senhas precisam ser iguais
        if (confirmar.value !== senha.value || confirmar.value === '') {
            mostrarErro(confirmar, 'As senhas não coincidem.');
            valido = false;
        }

        if (!valido) return;

        // Tudo certo: troca a senha da conta
        const resultado = await Auth.redefinirSenha(senha.value);

        if (resultado.ok) {
            alert('Senha redefinida com sucesso! Faça login com a nova senha.');
            window.location.href = 'login.html';
        } else {
            mostrarErro(senha, resultado.mensagem);
        }
    });

});

// Mostra a mensagem de erro no fim do grupo do campo (não atrapalha o ícone nem o olhinho)
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