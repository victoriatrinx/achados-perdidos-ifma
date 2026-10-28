/* Carregue no <head> de cada página. Aplica tema/contraste salvos e desenha topo, menu e rodapé. */
(function(){
var K='ifound_acess',a={},h=document.documentElement;
try{a=JSON.parse(localStorage.getItem(K))||{}}catch(e){}
function aplicar(){h.classList.toggle('tema-escuro',a.tema==='escuro');h.classList.toggle('alto-contraste',!!a.contraste)}
aplicar();
document.write('<link rel="stylesheet" href="tema-escuro.css">');
window.IFA={
  ler:function(){return a},
  salvar:function(n){Object.assign(a,n);aplicar();try{localStorage.setItem(K,JSON.stringify(a))}catch(e){}}
};
var itens=[['inicio','home.html','🏠','Início'],['perfil','perfil.html','👤','Meu perfil'],['publicar','publicar-item.html','➕','Publicar item'],['anuncios','meus-anuncios.html','🏷️','Meus anúncios'],['mensagens','mensagens.html','💬','Mensagens'],['favoritos','favoritos.html','🤍','Favoritos']];
function naoLidas(){
  if(a.notifMsg===false)return 0;
  try{return (JSON.parse(localStorage.getItem('ifound_conversas'))||[]).filter(function(c){return c.naoLida}).length}catch(e){return 0}
}
window.IFShell={
  topo:function(ativo){
    var n=naoLidas();
    document.write(
'<header class="topo"><div class="topo-logo"><a class="logo" href="home.html" aria-label="iFound, página inicial"><img src="Imagens/logo.png" alt=""><span class="logo-texto"><strong>iFound</strong><small>Campus Rosário</small></span></a></div>'+
'<div class="topo-busca"><button class="btn-aba" id="btnAba" aria-controls="aba" aria-expanded="true" aria-label="Mostrar ou esconder o menu"><span></span><span></span><span></span></button>'+
'<label class="busca"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input type="search" id="busca" placeholder="Pesquisar por item, local, categoria..."></label></div>'+
'<button class="topo-user" type="button"><span class="avatar" id="topoAvatar"></span><span><span id="topoNome">Aluno(a)</span><br>Trocar conta</span></button></header>'+
'<nav class="aba" id="aba" aria-label="Menu principal">'+
itens.map(function(i){return '<a class="nav-item'+(i[0]===ativo?' ativo':'')+'" href="'+i[1]+'"'+(i[0]===ativo?' aria-current="page"':'')+'><i>'+i[2]+'</i>'+i[3]+(i[0]==='mensagens'&&n?'<span class="selo">'+n+'</span>':'')+'</a>'}).join('')+
'<button class="nav-item nav-filtros" id="btnFiltros" aria-expanded="false" aria-controls="painelFiltros"><i>🔻</i>Filtros<span class="seta">⌄</span></button>'+
'<form class="filtros" id="painelFiltros" hidden><label>Categoria<select id="fCategoria"><option value="">Todas as categorias</option><option>Achado</option><option>Perdido</option><option>Doação</option><option>Venda</option></select></label>'+
'<label>Local<input type="text" id="fLocal" placeholder="Buscar local..."></label>'+
'<div class="chips" id="chipsLocais"><button type="button">Biblioteca</button><button type="button">Corredor</button><button type="button">Auditório</button><button type="button">Pátio</button><button type="button">Sala</button><button type="button">Bloco</button></div>'+
'<label>Data<select id="fData"><option value="">Qualquer data</option><option value="2">Últimos 2 dias</option><option value="7">Últimos 7 dias</option><option value="30">Últimos 30 dias</option></select></label>'+
'<button type="submit" class="btn-aplicar">Aplicar filtros</button><button type="reset" class="btn-limpar">Limpar filtros</button></form>'+
'<p class="aba-lema">Juntos por<br>um campus<br>mais solidário!</p></nav>');
  },
  rodape:function(){
    document.write(
'<footer class="rodape"><div class="rodape-col"><a class="logo" href="home.html"><img src="Imagens/logo.png" alt=""><span class="logo-texto"><strong>iFound</strong><small>Campus Rosário</small></span></a>'+
'<p>Plataforma oficial do IFMA Campus Rosário, para Achados, Perdidos, Doações e Vendas.</p><div class="redes"><a href="#" data-manutencao aria-label="Instagram">IG</a><a href="#" data-manutencao aria-label="Facebook">f</a><a href="#" data-manutencao aria-label="YouTube">▶</a></div></div>'+
'<div class="rodape-col"><h4>Links rápidos</h4><a href="sobre.html">Sobre o projeto</a><a href="#" data-manutencao>Regras</a><a href="#" data-manutencao>Dúvidas frequentes</a><a href="#" data-manutencao>Fale conosco</a></div>'+
'<div class="rodape-col"><h4>Suporte</h4><p>DDE - Diretoria de Desenvolvimento Educacional</p><a href="#" data-manutencao>✉️ dde.ar@ifma.edu.br</a><a href="#" data-manutencao>📞 (98) 00000-0000</a><a class="rodape-legal" href="termos.html">Termos de Uso</a><a class="rodape-legal" href="privacidade.html">Política de Privacidade</a></div>'+
'<p class="direitos">© 2026 IFMA, Campus Rosário. Todos os direitos reservados.</p></footer><div class="aviso" id="aviso" role="status"></div>');
  }
};
})();
