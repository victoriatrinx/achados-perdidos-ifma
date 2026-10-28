document.addEventListener('DOMContentLoaded', async () => {
    const formulario = document.querySelector('.formulario');

    if (!formulario) {
        console.error('Formulário não encontrado.');
        return;
    }

    const botao = formulario.querySelector('button[type="submit"]');
    const parametros = new URLSearchParams(location.search);
    const idEdicao = parametros.get('editar');

    // Carrega os dados do anúncio selecionado
    if (idEdicao) {
        botao.disabled = true;

        try {
            const { data: { user }, error: erroUsuario } =
                await clienteSupabase.auth.getUser();

            if (erroUsuario || !user) {
                alert('Entre na sua conta para editar o anúncio.');
                return;
            }

            const { data, error } = await clienteSupabase
                .from('publicacoes')
                .select('*')
                .eq('id', idEdicao)
                .eq('usuario_id', user.id)
                .maybeSingle();
            console.log('ID:', idEdicao);
            console.log('Usuário:', user.id);
            console.log('Anúncio encontrado:', data);
            console.log('Erro:', error);
            console.log('URL da imagem:', data?.imagem_url);
            console.log('URLs das fotos:', data?.fotos_urls);
            console.log('Tipo de fotos_urls:', typeof data?.fotos_urls);
            console.log('É lista?', Array.isArray(data?.fotos_urls));
            console.log('Quantidade:', data?.fotos_urls?.length);
            console.log('Preview existe?', !!document.querySelector('#fotos-preview'));

            if (error) {
                console.error('Erro ao buscar anúncio:', error);
                alert('Erro ao carregar anúncio: ' + error.message);
                return;
            }

            if (!data) {
                alert('Anúncio não encontrado ou você não tem permissão para editá-lo.');
                return;
            }

            document.querySelector('#titulo').value = data.titulo ?? '';
            document.querySelector('#descricao').value = data.descricao ?? '';
            document.querySelector('#local').value = data.local ?? '';
            document.querySelector('#data').value =
                data.data_achado || data.data_perda || '';
                const preview = document.querySelector('#fotos-preview');
const fotosSalvas = Array.isArray(data.fotos_urls)
    ? data.fotos_urls
    : [];

if (preview) {
    preview.replaceChildren();

    const fotos = fotosSalvas.length
        ? fotosSalvas
        : (data.imagem_url ? [data.imagem_url] : []);

    fotos.forEach((url) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Foto do anúncio';
        img.style.width = '120px';
        img.style.height = '120px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        img.style.marginTop = '8px';

        preview.appendChild(img);
    });
}
            console.log('Campos preenchidos:', {
            titulo: document.querySelector('#titulo').value,
            descricao: document.querySelector('#descricao').value,
            local: document.querySelector('#local').value,
            data: document.querySelector('#data').value
        });

            const titulo = document.querySelector('h1');
            if (titulo) titulo.textContent = 'Editar achado';

            if (botao) {
                botao.textContent = 'Salvar alterações';
            }

            const contador = document.querySelector('.contador');
            if (contador) {
                contador.textContent =
                    (data.descricao || '').length + '/350';
            }
        } catch (erro) {
            console.error('Erro ao carregar anúncio:', erro);
            alert('Não foi possível carregar o anúncio.');
            return;
        } finally {
            botao.disabled = false;
        }
    }

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        botao.disabled = true;

        try {
            const { data: { user }, error: erroUsuario } =
                await clienteSupabase.auth.getUser();

            if (erroUsuario || !user) {
                alert('Entre na sua conta para continuar.');
                location.href = '../login.html';
                return;
            }

            const publicacao = {
                titulo: document.getElementById('titulo').value.trim(),
                descricao: document.getElementById('descricao').value.trim(),
                local: document.getElementById('local').value.trim(),
                data_perda: document.getElementById('data').value || null
            };

            if (!publicacao.titulo || !publicacao.descricao ||
                !publicacao.local) {
                alert('Preencha todos os campos obrigatórios.');
                return;
            }

            let resultado;

            if (idEdicao) {
                resultado = await clienteSupabase
                    .from('publicacoes')
                    .update(publicacao)
                    .eq('id', idEdicao)
                    .eq('usuario_id', user.id)
                    .select('id');

                if (!resultado.error && !resultado.data?.length) {
                    alert('Nenhuma alteração foi salva. Verifique suas permissões.');
                    return;
                }
            } else {
                resultado = await clienteSupabase
                    .from('publicacoes')
                    .insert({
                        ...publicacao,
                        usuario_id: user.id,
                        categoria: 'Achado',
                        tipo: 'encontrado',
                        status: 'ativo'
                    });
            }

            if (resultado.error) {
                console.error('Erro ao salvar:', resultado.error);
                alert('Não foi possível salvar: ' + resultado.error.message);
                return;
            }

            alert(idEdicao ? 'Anúncio atualizado!' : 'Achado publicado!');
            location.href = '../meus-anuncios.html';

        } catch (erro) {
            console.error('Erro inesperado:', erro);
            alert('Ocorreu um erro ao salvar.');
        } finally {
            botao.disabled = false;
        }
    });
});