// cadastro.js
// Validação do formulário de cadastro do iFound
// Por enquanto só valida no navegador (sem conexão com banco de dados ainda)

document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('cadastro-form');

    // Liga a máscara de telefone ao campo, enquanto a pessoa digita
    document.getElementById('telefone').addEventListener('input', aplicarMascaraTelefone);

    // Escuta o clique em "Criar conta"
form.addEventListener('submit', async function (event) { 
    event.preventDefault(); // impede o navegador de recarregar a página

        const formValido = validarFormulario();

       if (formValido) {
    const email = document.getElementById('email');

    const resultado = await Auth.cadastrar({
        nome: document.getElementById('nome').value,
        email: email.value,
        curso: document.getElementById('curso').value,
        telefone: document.getElementById('telefone').value,
        senha: document.getElementById('senha').value
    });

   if (resultado.ok) {
    if (resultado.sessao) {
        alert('Conta criada com sucesso!');
        window.location.href = 'home.html';
    } else {
        alert('Conta criada! Confira seu e-mail para confirmar o cadastro antes de entrar.');
        window.location.href = 'login.html';
    }
} else {
    mostrarErro(email, resultado.mensagem);
}
}
    });

});


// Formata o telefone automaticamente enquanto a pessoa digita: (98) 99999-9999
function aplicarMascaraTelefone(event) {
    const input = event.target;

    // Remove tudo que não for número
    let valor = input.value.replace(/\D/g, '');

    // Limita a 11 dígitos (2 do DDD + 9 do número)
    valor = valor.slice(0, 11);

    // Vai montando o formato conforme a quantidade de dígitos já digitados
    if (valor.length > 0) {
        valor = '(' + valor;
    }
    if (valor.length > 3) {
        valor = valor.slice(0, 3) + ') ' + valor.slice(3);
    }
    if (valor.length > 10) {
        valor = valor.slice(0, 10) + '-' + valor.slice(10);
    }

    input.value = valor;
}


// Mostra uma mensagem de erro embaixo do campo
function mostrarErro(input, mensagem) {
    limparErro(input); // tira erro antigo, se já tiver um

    input.classList.add('input-error');

    const erro = document.createElement('span');
    erro.className = 'erro-msg';
    erro.textContent = mensagem;
    erro.style.color = '#7B001C'; // vinho do site
    erro.style.fontSize = '0.85rem';
    erro.style.marginTop = '4px';

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


// Valida todos os campos do formulário
// Retorna true se estiver tudo certo, false se tiver algum erro
function validarFormulario() {
    let valido = true;

    // --- NOME COMPLETO ---
    const nome = document.getElementById('nome');
    limparErro(nome);
    if (nome.value.trim().length < 3) {
        mostrarErro(nome, 'Digite seu nome completo.');
        valido = false;
    }

    // --- E-MAIL ---
    const email = document.getElementById('email');
    limparErro(email);
    if (!email.checkValidity() || email.value.trim() === '') {
        mostrarErro(email, 'Digite um e-mail válido.');
        valido = false;
    }

    // --- CURSO/SETOR ---
    const curso = document.getElementById('curso');
    limparErro(curso);
    if (curso.value === '') {
        mostrarErro(curso, 'Selecione uma opção.');
        valido = false;
    }

    // --- TELEFONE ---
    const telefone = document.getElementById('telefone');
    limparErro(telefone);
    const regexTelefone = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    if (!regexTelefone.test(telefone.value.trim())) {
        mostrarErro(telefone, 'Use o formato (98) 99999-9999.');
        valido = false;
    }

    // --- SENHA ---
    const senha = document.getElementById('senha');
    limparErro(senha);
    if (senha.value.length < 6) {
        mostrarErro(senha, 'A senha precisa ter pelo menos 6 caracteres.');
        valido = false;
    }

    // --- CONFIRMAR SENHA ---
    const confirmar = document.getElementById('confirmar');
    limparErro(confirmar);
    if (confirmar.value !== senha.value || confirmar.value === '') {
        mostrarErro(confirmar, 'As senhas não coincidem.');
        valido = false;
    }

    // --- TERMOS DE USO ---
    const termos = document.getElementById('termos');
    if (!termos.checked) {
        alert('Você precisa aceitar os Termos de uso para continuar.');
        valido = false;
    }

    return valido;
}