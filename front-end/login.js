// login.js
// Validação do formulário de login do iFound
// Por enquanto só valida no navegador (sem conexão com banco de dados ainda)

document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('login-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // impede o envio real pro action="/login" por enquanto

        const formValido = validarLogin();

       if (formValido) {
    const email = document.getElementById('user-identifier');
    const senha = document.getElementById('password');

    const resultado = Auth.entrar(email.value, senha.value);

    if (resultado.ok) {
        window.location.href = 'Home.html';
        } else {
        mostrarErro(senha, resultado.mensagem);
        }
   }
 });
});


// Mostra uma mensagem de erro embaixo do campo (mesma lógica do cadastro.js)
function mostrarErro(input, mensagem) {
    limparErro(input);

    input.classList.add('input-error');

    const erro = document.createElement('span');
    erro.className = 'erro-msg';
    erro.textContent = mensagem;
    erro.style.color = '#780D26';
    erro.style.fontSize = '0.8rem';
    erro.style.marginTop = '4px';
    erro.style.display = 'block';
    erro.style.textAlign = 'left';

    input.insertAdjacentElement('afterend', erro);
}

// Remove a mensagem de erro de um campo
function limparErro(input) {
    input.classList.remove('input-error');
    const proximo = input.nextElementSibling;
    if (proximo && proximo.classList.contains('erro-msg')) {
        proximo.remove();
    }
}


// Valida os campos do login
function validarLogin() {
    let valido = true;

    // --- E-MAIL ---
    const email = document.getElementById('user-identifier');
    limparErro(email);
    if (!email.checkValidity() || email.value.trim() === '') {
        mostrarErro(email, 'Digite um e-mail válido.');
        valido = false;
    }

    // --- SENHA ---
    const senha = document.getElementById('password');
    limparErro(senha);
    if (senha.value.trim() === '') {
        mostrarErro(senha, 'Digite sua senha.');
        valido = false;
    }

    return valido;
}