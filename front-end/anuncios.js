/* Dados reais do usuário, salvos no navegador (localStorage). Nada vem pré-preenchido.
   Carregue depois de comum.js. */
(function(){
var A='ifound_anuncios',F='ifound_favoritos',C='ifound_conversas';
function ler(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch(e){return[]}}
function gravar(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
function svg(p,s){s=s||18;return '<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
var T={achado:'Achado',perdido:'Perdido',doacao:'Doação',venda:'Venda'};
window.IF={
  TIPOS:T,
  anuncios:function(){return ler(A)}, gravarAnuncios:function(v){return gravar(A,v)},
  favoritos:function(){return ler(F)}, gravarFavoritos:function(v){return gravar(F,v)},
  conversas:function(){return ler(C)}, gravarConversas:function(v){return gravar(C,v)},
  svg:svg,
  ico:{
    pin:'<path d="M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11z"/><circle cx="12" cy="10" r="2"/>',
    rel:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    caixa:'<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
    chat:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8"/>',
    cor:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    pessoa:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>'
  },
  esc:function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})},
  etq:function(t){return '<span class="etq etq-'+t+'">'+(T[t]||t)+'</span>'},
  ha:function(ts){
    var ms=Date.now()-ts,d=Math.floor(ms/864e5),h=Math.floor(ms/36e5);
    if(d<1)return h<1?'agora há pouco':'há '+h+(h===1?' hora':' horas');
    if(d<7)return 'há '+d+(d===1?' dia':' dias');
    if(d<30){var s=Math.floor(d/7);return 'há '+s+(s===1?' semana':' semanas')}
    var m=Math.floor(d/30);return 'há '+m+(m===1?' mês':' meses');
  },
  data:function(ts){return new Date(ts).toLocaleDateString('pt-BR')},
  preco:function(n){return n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})},
  aviso:function(m){if(typeof avisar==='function')avisar(m);else alert(m)},
  foto:function(arq){
    return new Promise(function(ok,er){
      if(!/^image\//.test(arq.type))return er(new Error('Escolha um arquivo de imagem.'));
      var r=new FileReader();
      r.onerror=function(){er(new Error('Não foi possível ler a imagem.'))};
      r.onload=function(){
        var i=new Image();i.onerror=r.onerror;
        i.onload=function(){
          var k=Math.min(1,800/Math.max(i.width,i.height)),c=document.createElement('canvas');
          c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);
          c.getContext('2d').drawImage(i,0,0,c.width,c.height);
          ok(c.toDataURL('image/jpeg',.8));
        };
        i.src=r.result;
      };
      r.readAsDataURL(arq);
    });
  },
  /* Use no coração da home/produto: IF.favoritar({id,tipo,titulo,local,preco,img,href}) → true se favoritou */
  favoritar:function(item){
    var f=ler(F),i=f.findIndex(function(x){return x.id===item.id});
    if(i>=0)f.splice(i,1);else f.push(Object.assign({salvoEm:Date.now()},item));
    gravar(F,f);return i<0;
  },
  /* Use no botão "Mensagem" da página do anúncio: location.href = IF.abrirConversa(anuncio, nomeDoPublicador) */
  abrirConversa:function(anuncio,com){
    var c=ler(C),x=c.find(function(k){return k.anuncio&&k.anuncio.id===anuncio.id&&k.com===com});
    if(!x){x={id:Date.now().toString(36),com:com,anuncio:anuncio,msgs:[],naoLida:false,criado:Date.now()};c.push(x);gravar(C,c)}
    return 'mensagens.html?c='+x.id;
  }
};
if(typeof mostrarTopo==='function'&&typeof lerPerfil==='function')mostrarTopo(lerPerfil());
})();
