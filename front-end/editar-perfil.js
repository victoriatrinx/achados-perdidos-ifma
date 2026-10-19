window.__editarJs = true;

/* Precisa do comum.js carregado antes (aba, filtros, avisos e dados do perfil). */
let perfil = lerPerfil();
let fotoNova = perfil.foto;          /* só vai para o perfil quando clicar em Salvar */

const VAZIOS = ["Aluno(a)", "@aluno(a)"];   /* textos de quem ainda não entrou */
const campos = {
  nome: $("#campoNome"), usuario: $("#campoUsuario"),
  email: $("#campoEmail"), telefone: $("#campoTelefone")
};
const erro = $("#erroEditar");

function mascaraTelefone(v){
  const d = v.replace(/\D/g, "").slice(0, 11);
  if(!d) return "";
  if(d.length <= 2) return "(" + d;
  if(d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if(d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}

/* Preenche a tela com o que já existe */
campos.nome.value = VAZIOS.includes(perfil.nome) ? "" : perfil.nome;
campos.usuario.value = VAZIOS.includes(perfil.usuario) ? "" : perfil.usuario;
campos.email.value = perfil.email || "";
campos.telefone.value = mascaraTelefone(perfil.telefone || "");
$("#nomeExibido").textContent = VAZIOS.includes(perfil.nome) ? "Usuário anônimo" : perfil.nome;
pintarFoto($("#fotoEditar"), fotoNova);
mostrarTopo(perfil);

campos.telefone.addEventListener("input", () => { campos.telefone.value = mascaraTelefone(campos.telefone.value); });

/* Foto: mostra na hora, mas só guarda ao salvar */
$("#btnCamera").addEventListener("click", () => $("#arquivoFoto").click());
$("#arquivoFoto").addEventListener("change", e => {
  const arq = e.target.files[0];
  e.target.value = "";
  if(!arq) return;
  reduzirFoto(arq).then(foto => {
    fotoNova = foto;
    pintarFoto($("#fotoEditar"), fotoNova);
  }).catch(err => avisar(err.message));
});

function mostrarErro(msg, campo){
  Object.values(campos).forEach(c => c.removeAttribute("aria-invalid"));
  erro.textContent = msg;
  erro.hidden = false;
  if(campo){ campo.setAttribute("aria-invalid", "true"); campo.focus(); }
}

/* Salvar */
$("#formEditar").addEventListener("submit", e => {
  e.preventDefault();
  const nome = campos.nome.value.trim().replace(/\s+/g, " ");
  const usuario = campos.usuario.value.trim().replace(/^@+/, "");
  const email = campos.email.value.trim();
  const telefone = campos.telefone.value.replace(/\D/g, "");

  if(nome.length < 2) return mostrarErro("Digite seu nome completo (pelo menos 2 letras).", campos.nome);
  if(!/^[a-z0-9._]{3,24}$/i.test(usuario))
    return mostrarErro("O usuário deve ter de 3 a 24 caracteres: letras, números, ponto ou _ (sem espaços).", campos.usuario);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return mostrarErro("Digite um e-mail válido.", campos.email);
  if(telefone && telefone.length < 10) return mostrarErro("O telefone precisa ter DDD + número, ou deixe em branco.", campos.telefone);

  erro.hidden = true;
  perfil = {...perfil, nome, usuario: "@" + usuario, email, telefone, foto: fotoNova};
  if(!salvarPerfil(perfil)) return mostrarErro("Não foi possível salvar neste navegador.");

  mostrarTopo(perfil);
  $("#nomeExibido").textContent = nome;
  $("#formEditar").querySelector(".ep-salvar").disabled = true;
  avisar("Perfil atualizado.");
  setTimeout(() => { location.href = "perfil.html"; }, 900);
});