// auth.js
// Cuida das contas de usuário do iFound.
// Por enquanto guarda tudo no localStorage do navegador (simulação, sem banco de dados).
// Quando o banco chegar, só ESTE arquivo precisa mudar: as telas continuam chamando Auth.algumaCoisa().

const Auth = {

    // Devolve a lista de contas salvas (ou uma lista vazia se ainda não existir nenhuma)
    listarUsuarios() {
        return JSON.parse(localStorage.getItem('usuarios')) || [];
    },

    // Cria uma conta nova. Recusa se o e-mail já estiver em uso.
    cadastrar(dados) {
        const emailLimpo = dados.email.trim().toLowerCase();
        const usuarios = this.listarUsuarios();

        const jaExiste = usuarios.some(function (u) {
            return u.email === emailLimpo;
        });

        if (jaExiste) {
            return { ok: false, mensagem: 'Já existe uma conta com esse e-mail.' };
        }

        usuarios.push({
            nome: dados.nome.trim(),
            email: emailLimpo,
            curso: dados.curso,
            telefone: dados.telefone,
            senha: dados.senha
        });

        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        return { ok: true };
    },

    // Confere e-mail e senha. Se estiver certo, guarda quem entrou.
    entrar(email, senha) {
        const emailLimpo = email.trim().toLowerCase();

        const usuario = this.listarUsuarios().find(function (u) {
            return u.email === emailLimpo && u.senha === senha;
        });

        if (!usuario) {
            return { ok: false, mensagem: 'E-mail ou senha incorretos.' };
        }

        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        return { ok: true };
    },

    // Quem está logado agora (ou null se ninguém)
    usuarioLogado() {
        return JSON.parse(localStorage.getItem('usuarioLogado'));
    },

    // Faz logout
    sair() {
        localStorage.removeItem('usuarioLogado');
    },

    // Responde sim/não: "esse e-mail tem conta?"
    emailExiste(email) {
        const emailLimpo = email.trim().toLowerCase();

        return this.listarUsuarios().some(function (u) {
            return u.email === emailLimpo;
        });
    },

    // Troca a senha da conta que tem esse e-mail
    redefinirSenha(email, novaSenha) {
        const emailLimpo = email.trim().toLowerCase();
        const usuarios = this.listarUsuarios();

        const usuario = usuarios.find(function (u) {
            return u.email === emailLimpo;
        });

        if (!usuario) {
            return { ok: false, mensagem: 'Conta não encontrada.' };
        }

        usuario.senha = novaSenha;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        return { ok: true };
    }
};