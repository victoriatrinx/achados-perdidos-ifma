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
            const local = document.getElementById('local').value.trim();
            const dataPerda = document.getElementById('data').value;
            const fotos = document.getElementById('fotos').files;

            if (fotos.length > 3) {
                alert('Você pode selecionar no máximo 3 fotos.');
                return;
            }

            if (fotos.length > 0) {
                alert(
                    'A publicação será salva sem as fotos por enquanto. ' +
                    'O envio de imagens ainda precisa ser conectado ao armazenamento.'
                );
            }

            const { error } = await clienteSupabase
                .from('publicacoes')
                .insert({
                    usuario_id: user.id,
                    titulo: titulo,
                    descricao: descricao,
                    categoria: 'Perdido',
                    tipo: 'perdido',
                    local: local,
                    data_perda: dataPerda,
                    status: 'ativo'
                });

            if (error) {
                console.error('Erro ao publicar:', error);
                alert('Não foi possível publicar. Confira o console do navegador.');
                return;
            }

            alert('Item perdido publicado com sucesso!');
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