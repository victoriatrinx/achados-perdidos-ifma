const Auth = {
    async cadastrar(dados) {
        const { data, error } = await clienteSupabase.auth.signUp({
            email: dados.email.trim().toLowerCase(),
            password: dados.senha,
            options: {
                data: {
                    nome: dados.nome.trim(),
                    curso_setor: dados.curso,
                    telefone: dados.telefone
                }
            }
        });

        if (error) {
            return {
                ok: false,
                mensagem: error.message
            };
        }

        return {
            ok: true,
            usuario: data.user,
            sessao: data.session
        };
    },
    async entrar(email, senha) {
        const { data, error } = await clienteSupabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password: senha
        });

        if (error) {
            return {
                ok: false,
                mensagem: 'E-mail ou senha incorretos.'
            };
        }

        return {
            ok: true,
            usuario: data.user,
            sessao: data.session
        };
    },
    async sair() {
        const { error } = await clienteSupabase.auth.signOut();

        if (error) {
            return {
                ok: false,
                mensagem: 'Não foi possível sair da conta.'
            };
        }

        return { ok: true };
    },
    async recuperarSenha(email) {
        const { error } = await clienteSupabase.auth.resetPasswordForEmail(
            email.trim().toLowerCase(),
            {
                redirectTo: new URL('RedefinirSenha.html', window.location.href).href
            }
        );

        if (error) {
            return {
                ok: false,
                mensagem: 'Não foi possível solicitar a recuperação. Tente novamente.'
            };
        }

        return { ok: true };
    },
    async redefinirSenha(novaSenha) {
        const { error } = await clienteSupabase.auth.updateUser({
            password: novaSenha
        });

        if (error) {
            return {
                ok: false,
                mensagem: 'Não foi possível alterar a senha. Solicite um novo link de recuperação.'
            };
        }

        return { ok: true };
    }
};