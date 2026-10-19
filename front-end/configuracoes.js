window.__cfgJs = true;

/* Precisa do comum.js carregado antes (aba, filtros, avisos e dados do perfil). */
mostrarTopo(lerPerfil());

/* Sair da conta: pergunta antes */
const modalSair = $("#modalSair");
$("#btnSair").addEventListener("click", () => { modalSair.showModal(); $("#btnFicar").focus(); });
$("#btnFicar").addEventListener("click", () => modalSair.close());
modalSair.addEventListener("click", e => { if(e.target === modalSair) modalSair.close(); });
$("#btnConfirmarSair").addEventListener("click", sairDaConta);