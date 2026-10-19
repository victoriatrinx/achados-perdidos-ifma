window.__perfilJs = true; /* avisa o diagnóstico do HTML que este arquivo carregou */

/* Precisa do comum.js carregado antes (aba, filtros, avisos e dados do perfil). */
let perfil = lerPerfil();

function mostrarPerfil(p){
  $("#perfilNome").textContent = p.nome;
  $("#perfilUsuario").textContent = p.usuario;
  $("#statAnuncios").textContent = p.anuncios;
  $("#statFavoritos").textContent = p.favoritos;
  pintarFoto($("#perfilFoto"), p.foto);
  mostrarTopo(p);
}
mostrarPerfil(perfil);

/* Lápis: abre a página de editar perfil */
$("#btnEditar").addEventListener("click", () => { location.href = "editar-perfil.html"; });

/* Câmera: troca a foto direto aqui */
$("#btnCamera").addEventListener("click", () => $("#arquivoFoto").click());
$("#arquivoFoto").addEventListener("change", e => {
  const arq = e.target.files[0];
  e.target.value = "";
  if(!arq) return;
  reduzirFoto(arq).then(foto => {
    perfil = {...perfil, foto};
    if(!salvarPerfil(perfil)){ avisar("Não foi possível salvar a foto."); return; }
    mostrarPerfil(perfil);
    avisar("Foto atualizada.");
  }).catch(err => avisar(err.message));
});