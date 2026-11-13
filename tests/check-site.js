const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const raiz = path.join(__dirname, "..", "site");
let falhas = 0;

function ok(msg) { console.log("OK     " + msg); }
function falha(msg) { console.error("FALHA  " + msg); falhas += 1; }

// 1. Arquivos obrigatórios
const obrigatorios = ["index.html", "css/style.css", "js/app.js", "data/ecopontos.json"];
obrigatorios.forEach(function (arq) {
  if (fs.existsSync(path.join(raiz, arq))) { ok("arquivo presente: " + arq); }
  else { falha("arquivo ausente: " + arq); }
});
if (falhas > 0) { process.exit(1); }

// 2. JSON de Ecopontos
try {
  const dados = JSON.parse(fs.readFileSync(path.join(raiz, "data/ecopontos.json"), "utf8"));
  if (!Array.isArray(dados) || dados.length < 3) { falha("ecopontos.json deve ser uma lista com pelo menos 3 itens"); }
  else { ok("ecopontos.json válido com " + dados.length + " itens"); }
  dados.forEach(function (e, i) {
    ["nome", "endereco", "lat", "lon", "tipos"].forEach(function (campo) {
      if (e[campo] === undefined) { falha("ecoponto " + i + " sem o campo " + campo); }
    });
  });
} catch (erro) {
  falha("ecopontos.json inválido: " + erro.message);
}

// 3. Sintaxe do JavaScript
try {
  execSync('node --check "' + path.join(raiz, "js/app.js") + '"', { stdio: "pipe" });
  ok("sintaxe do app.js válida");
} catch (erro) {
  falha("erro de sintaxe no app.js");
}

// 4. Estrutura do HTML
const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
if (html.indexOf('lang="pt-BR"') !== -1) { ok("idioma pt-BR declarado"); } else { falha("index.html sem lang=pt-BR"); }
if (html.indexOf('name="viewport"') !== -1) { ok("meta viewport presente"); } else { falha("index.html sem meta viewport"); }
if (/<title>[^<]+<\/title>/.test(html)) { ok("title presente"); } else { falha("index.html sem title"); }

// 5. Consistência entre app.js e index.html
const js = fs.readFileSync(path.join(raiz, "js/app.js"), "utf8");
const regex = /getElementById\("([^"]+)"\)/g;
const ids = new Set();
let m;
while ((m = regex.exec(js)) !== null) { ids.add(m[1]); }
ids.forEach(function (id) {
  if (html.indexOf('id="' + id + '"') !== -1) { ok("id usado no JS existe no HTML: " + id); }
  else { falha("id usado no JS não existe no HTML: " + id); }
});

if (falhas > 0) {
  console.error("\n" + falhas + " verificação(ões) falharam.");
  process.exit(1);
}
console.log("\nTodas as verificações passaram.");
