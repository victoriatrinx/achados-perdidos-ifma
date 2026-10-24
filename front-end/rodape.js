// rodape.js — rodapé único do iFound (inclua <div id="rodape"></div> + este script em cada página)
// Para mudar o rodapé em todo o site, edite só este arquivo.
(function () {
    var alvo = document.getElementById('rodape');
    if (!alvo) return;
    alvo.outerHTML =
    '<footer class="rodape"><div class="rodape-conteudo">' +
      '<div class="rodape-marca"><div class="logo logo-claro">' +
        '<span class="logo-icone"><img src="Imagens/logo.png" alt=""></span>' +
        '<span class="logo-texto"><strong>iFound</strong><small>Campus Rosário</small></span></div>' +
        '<p>Plataforma oficial do IFMA Campus Rosário para Achados, Perdidos, Doações e Vendas.</p>' +
        '<div class="redes">' +
          '<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/></svg></a>' +
          '<a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M14 8h2V5h-2.5A3.5 3.5 0 0 0 10 8.5V11H8v3h2v6h3v-6h2.2l.5-3H13V8.6c0-.4.3-.6.6-.6z"/></svg></a>' +
          '<a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="4"/><path d="m10.5 9.5 4 2.5-4 2.5z"/></svg></a>' +
        '</div></div>' +
      '<nav class="rodape-links" aria-label="Links rápidos"><h3>Links rápidos</h3>' +
        '<a href="sobre.html">Sobre o projeto</a><a href="#">Regras</a><a href="#">Dúvidas frequentes</a><a href="#">Fale conosco</a>' +
        '<a href="termos.html">Termos de Uso</a><a href="privacidade.html">Política de Privacidade</a></nav>' +
      '<div class="rodape-suporte"><h3>Suporte</h3>' +
        '<p>DDE - Diretoria de Desenvolvimento Educacional</p>' +
        '<p class="contato">dde.arr@ifma.edu.br</p><p class="contato">(98) 00000-0000</p>' +
        '<p class="contato"><a href="termos.html">Termos de Uso</a></p>' +
        '<p class="contato"><a href="privacidade.html">Política de Privacidade</a></p></div>' +
    '</div><p class="copyright">© 2026 IFMA, Campus Rosário. Todos os direitos reservados.</p></footer>';
})();
