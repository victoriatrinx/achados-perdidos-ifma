document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('.formulario');

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const botao = formulario.querySelector('button[type="submit"]');
        const textoOriginal = botao.textContent;

        botao.disabled = true;
        botao.textContent = 'Publicando...';

        try {
            const { data: { user }, error: erroUsuario } =
                await clienteSupabase.auth.getUser();

            if (erroUsuario || !user) {
                alert('Você precisa entrar na sua conta para publicar.');
                window.location.href = '../login.html';
                return;
            }

            const titulo = document.getElementById('titulo').value.trim();
            const descricao = document.getElementById('descricao').value.trim();
            const estado = document.getElementById('estado').value;
            const local = document.getElementById('local').value.trim();

            const { error } = await clienteSupabase
                .from('publicacoes')
                .insert({
                    usuario_id: user.id,
                    titulo: titulo,
                    descricao: descricao,
                    categoria: 'Doação',
                    tipo: 'doacao',
                    local: local,
                    status: 'ativo'
                });

            if (error) {
                console.error('Erro ao publicar doação:', error);
                alert('Não foi possível publicar a doação. Confira o console.');
                return;
            }

            alert('Doação publicada com sucesso!');
            formulario.reset();

        } catch (erro) {
            console.error('Erro inesperado:', erro);
            alert('Ocorreu um erro ao publicar. Tente novamente.');
        } finally {
            botao.disabled = false;
            botao.textContent = textoOriginal;
        }
    });
});