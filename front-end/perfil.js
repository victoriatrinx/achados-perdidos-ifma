window.__perfilJs = true;

let perfil = null;

function mostrarPerfil(p) {
  $("#perfilNome").textContent = p.nome;
  $("#perfilUsuario").textContent = p.usuario;
  $("#statAnuncios").textContent = p.anuncios ?? 0;
  $("#statFavoritos").textContent = p.favoritos ?? 0;

  pintarFoto($("#perfilFoto"), p.foto);
  mostrarTopo(p);
}

async function iniciarPerfil() {
  const resultado = await carregarPerfilSupabase();

  if (!resultado.ok) {
    avisar(resultado.mensagem);
    return;
  }

  perfil = resultado.perfil;
  mostrarPerfil(perfil);
}

iniciarPerfil();

/* Lápis: abre a edição do perfil */
$("#btnEditar").addEventListener("click", () => {
  location.href = "editar-perfil.html";
});

/* Câmera: seleciona uma foto */
$("#btnCamera").addEventListener("click", () => {
  $("#arquivoFoto").click();
});

/* Atualiza a foto */
$("#arquivoFoto").addEventListener("change", async e => {
  const arquivo = e.target.files[0];
  e.target.value = "";

  if (!arquivo || !perfil) return;

  try {
    const foto = await reduzirFoto(arquivo);

    const { error } = await clienteSupabase
      .from("perfis")
      .update({ foto_url: foto })
      .eq("id", perfil.id);

    if (error) {
      console.error(error);
      avisar("Não foi possível salvar a foto.");
      return;
    }

    perfil = { ...perfil, foto };
    mostrarPerfil(perfil);
    avisar("Foto atualizada.");
  } catch (erro) {
    console.error(erro);
    avisar("Não foi possível carregar a imagem.");
  }
});