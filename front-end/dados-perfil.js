/* Dados da conta e do perfil (nome, usuário, e-mail, telefone, foto).
   Usado por TODAS as páginas, inclusive a home. Carregue antes do comum.js e do JS da página.
   Não depende de nada dos outros arquivos. */

/* ---------- Conta (vem do login) ----------
   Procura no navegador os dados da conta que entrou (objeto com nome/email
   ou token JWT). Sem login, mostra "Aluno(a)", igual à home.
   Se o login guardar de outro jeito, ajuste só a função lerConta(). */
function lerJSON(v){ try{ return JSON.parse(v); }catch(e){ return null; } }
function lerJWT(t){
  try{
    const b = t.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");
    return JSON.parse(decodeURIComponent(atob(b).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")));
  }catch(e){ return null; }
}
/* Se o texto guardado for uma conta (objeto com nome/email ou token JWT), devolve os dados */
function dadosDaConta(v){
  let d = lerJWT(v) || lerJSON(v);
  if(d && d.user && typeof d.user === "object") d = d.user;
  if(d && typeof d === "object" && (d.nome || d.name || d.username || d.email)){
    const email = d.email || "";
    return {
      id: String(d.id || d.sub || email || d.matricula || d.username || "conta"),
      nome: d.nome || d.name || d.username || email.split("@")[0],
      usuario: d.usuario || d.username || (email ? email.split("@")[0] : ""),
      email: email
    };
  }
  return null;
}
function lerConta(){
  for(const loja of [localStorage, sessionStorage]){
    for(let i = 0; i < loja.length; i++){
      const chave = loja.key(i);
      if(chave.startsWith("ifoundPerfil") || chave === "abaAberta") continue;
      const c = dadosDaConta(loja.getItem(chave));
      if(c) return c;
    }
  }
  return null;
}

/* Sair da conta: apaga os dados do login e vai para esta página */
const SAIR_PARA = "iFound.html";
async function sairDaConta(){
  const resultado = await Auth.sair();

  if (!resultado.ok) {
    avisar(resultado.mensagem);
    return;
  }

  for (const loja of [localStorage, sessionStorage]) {
    for (let i = loja.length - 1; i >= 0; i--) {
      const chave = loja.key(i);

      if (
        chave.startsWith("ifoundPerfil") ||
        chave === "abaAberta"
      ) continue;

      if (dadosDaConta(loja.getItem(chave))) {
        loja.removeItem(chave);
      }
    }
  }

  location.href = SAIR_PARA;
}

/* ---------- Dados do perfil ----------
   O que a pessoa editar fica salvo no navegador, separado por conta.
   Quando o back-end existir, troque lerPerfil/salvarPerfil por fetch na API. */
const conta = lerConta();
const CHAVE = "ifoundPerfil:" + (conta ? conta.id : "visitante");
const PADRAO = {
  nome: conta ? conta.nome : "Aluno(a)",
  usuario: conta && conta.usuario ? "@" + conta.usuario.replace(/^@+/, "") : "@aluno(a)",
  email: conta ? conta.email : "",
  telefone: "",
  foto: "", anuncios: 0, favoritos: 0
};

function lerPerfil(){
  try{ return {...PADRAO, ...JSON.parse(localStorage.getItem(CHAVE) || "{}")}; }
  catch(e){ return {...PADRAO}; }
}
function salvarPerfil(p){
  try{
    localStorage.setItem(CHAVE, JSON.stringify({nome:p.nome, usuario:p.usuario, email:p.email, telefone:p.telefone, foto:p.foto}));
    return true;
  }catch(e){ return false; }
}

/* Mostra a foto num elemento (ou o desenho padrão, se não tiver foto) */
function pintarFoto(el, foto){
  if(!el) return;
  el.classList.toggle("com-foto", !!foto);
  el.style.backgroundImage = foto ? `url("${foto}")` : "";
}
/* Nome e foto no canto do topo */
function mostrarTopo(p){
  const n = document.querySelector("#topoNome");
  if(n) n.textContent = p.nome;
  pintarFoto(document.querySelector("#topoAvatar"), p.foto);
}

/* Corta a imagem no quadrado e reduz para 256px (cabe no armazenamento).
   Devolve uma promessa com a imagem em texto (data URL). */
function reduzirFoto(arq){
  return new Promise((ok, falha) => {
    if(!arq || !arq.type.startsWith("image/")){ falha(new Error("Escolha um arquivo de imagem.")); return; }
    const img = new Image();
    const url = URL.createObjectURL(arq);
    img.onload = () => {
      const lado = Math.min(img.width, img.height), T = 256;
      const c = document.createElement("canvas");
      c.width = c.height = T;
      c.getContext("2d").drawImage(img, (img.width - lado) / 2, (img.height - lado) / 2, lado, lado, 0, 0, T, T);
      URL.revokeObjectURL(url);
      ok(c.toDataURL("image/jpeg", .85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); falha(new Error("Não consegui abrir essa imagem.")); };
    img.src = url;
  });
}
async function carregarPerfilSupabase() {
  const { data: { user }, error: erroAuth } =
    await clienteSupabase.auth.getUser();

  if (erroAuth || !user) {
    return {
      ok: false,
      mensagem: "Entre na sua conta para acessar o perfil."
    };
  }

  const { data, error } = await clienteSupabase
    .from("perfis")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return {
      ok: false,
      mensagem: "Não foi possível carregar seu perfil."
    };
  }

  return {
    ok: true,
    perfil: {
      id: data.id,
      nome: data.nome,
      usuario: data.usuario ? "@" + data.usuario.replace(/^@+/, "") : "@aluno(a)",
      email: data.email,
      telefone: data.telefone || "",
      foto: data.foto_url || "",
      anuncios: 0,
      favoritos: 0
    }
  };
}
async function salvarPerfilSupabase(perfil) {
  const { data: { user }, error: erroAuth } =
    await clienteSupabase.auth.getUser();

  if (erroAuth || !user) {
    return {
      ok: false,
      mensagem: "Você precisa entrar na sua conta."
    };
  }

  const dados = {
    nome: perfil.nome,
    email: user.email,
    usuario: perfil.usuario.replace(/^@+/, ""),
    telefone: perfil.telefone || "",
    foto_url: perfil.foto||""
  };

  const { error } = await clienteSupabase
    .from("perfis")
    .update(dados)
    .eq("id", user.id);

  if (error) {
    console.error("Erro ao salvar perfil:", error);

    return {
      ok: false,
      mensagem: "Não foi possível salvar o perfil."
    };
  }

  return { ok: true };
}