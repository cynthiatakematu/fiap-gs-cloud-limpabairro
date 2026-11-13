# LimpaBairro

CitizenTech de gestão comunitária e preditiva de resíduos. Global Solution FIAP 2026, Cloud Solutions & Scalable Infrastructure.

## O problema e a proposta

Em São Paulo, o descarte clandestino de entulho, móveis e lixo domiciliar entope bueiros, agrava enchentes, atrai pragas e cria pontos crônicos de sujeira, principalmente na periferia. Quem mora perto, como a Maria (48 anos), convive com o entulho na calçada e não sabe como pedir a remoção de forma rápida.

O LimpaBairro propõe uma plataforma em que o cidadão registra o descarte com foto e localização e descobre o Ecoponto mais próximo, enquanto a gestão pública acompanha indicadores como o tempo de atendimento e a reincidência dos pontos.

O foco desta entrega é demonstrar o fluxo de desenvolvimento e entrega automatizados (GitHub, CI/CD e nuvem). Por isso a aplicação é um protótipo web de três blocos: reporte de descarte, lista de Ecopontos ordenada por distância e resumo do painel de gestão. Os Ecopontos e os indicadores são dados ilustrativos. Na solução completa, viriam do GeoSampa e do Portal 156.

## Integrantes

- Bruno Avelino Tomin | RM 565037 | Turma 2TSCPV
- Cynthia Emiko de Souza Takematu | RM 564100 | Turma 2TSCPV

Trabalho em dupla.

## Origem do projeto

Projeto criado do zero pela dupla, a partir da ideação do LimpaBairro feita na disciplina. Não reutiliza o projeto de Queimadas do INPE.

## Tecnologias

- HTML, CSS e JavaScript puro (sem framework)
- Node.js 20 para os testes automatizados
- GitHub: Projects, Issues, Pull Requests e Actions
- Azure Static Web Apps (plano gratuito) para hospedagem

Como executar localmente: entre na pasta `site` e rode `python3 -m http.server 8123`, depois abra http://localhost:8123 (o servidor local é necessário porque a página carrega o arquivo de Ecopontos). Para rodar os testes: `npm test` na raiz do repositório.

## Estrutura do repositório

- `site/`: aplicação (index.html, css, js e data/ecopontos.json)
- `tests/check-site.js`: testes do site
- `.github/workflows/`: workflows ci.yml e deploy.yml
- `docs/evidencias/`: capturas de tela das evidências

## Como o GitHub foi utilizado

- Project (quadro): https://github.com/users/cynthiatakematu/projects/1, com colunas Todo, In Progress e Done.
- Issues: história de usuário [#4](https://github.com/cynthiatakematu/fiap-gs-cloud-limpabairro/issues/4) e tarefas [#5](https://github.com/cynthiatakematu/fiap-gs-cloud-limpabairro/issues/5), [#6](https://github.com/cynthiatakematu/fiap-gs-cloud-limpabairro/issues/6) e [#7](https://github.com/cynthiatakematu/fiap-gs-cloud-limpabairro/issues/7), todas com responsável e status.
- Branches: `main`, `feature/pagina-limpabairro`, `feature/selo-versao`, `docs/readme-evidencias` e `docs/quadro-final`.
- Commits com mensagens descritivas, citando a Issue relacionada.
- Pull Requests: [#8](https://github.com/cynthiatakematu/fiap-gs-cloud-limpabairro/pull/8) (site e CI/CD), [#9](https://github.com/cynthiatakematu/fiap-gs-cloud-limpabairro/pull/9) (selo de versão 1.1), [#10](https://github.com/cynthiatakematu/fiap-gs-cloud-limpabairro/pull/10) (README e evidências) e [#11](https://github.com/cynthiatakematu/fiap-gs-cloud-limpabairro/pull/11) (quadro final), todos com checks de CI aprovados antes do merge.

## Workflows do GitHub Actions

**CI** (`.github/workflows/ci.yml`)
- Gatilhos: push na `main` e em branches `feature/**`, e Pull Requests para a `main`.
- Etapas: baixar o código, configurar o Node.js 20 e rodar `npm test`.
- O teste verifica os arquivos obrigatórios, a validade do JSON de Ecopontos, a sintaxe do JavaScript, o idioma e o viewport do HTML e se todo `id` usado pelo JavaScript existe no HTML.

**Deploy** (`.github/workflows/deploy.yml`)
- Gatilhos: push na `main` e execução manual (workflow_dispatch).
- Job `testar`: repete os testes antes de publicar.
- Job `publicar`: depende do `testar` e publica a pasta `site` no Azure Static Web Apps com a action oficial `Azure/static-web-apps-deploy`.
- O token de deploy fica no secret `AZURE_STATIC_WEB_APPS_API_TOKEN` do GitHub Actions. Nenhuma credencial está no código ou neste README.

## Nuvem e aplicação publicada

- Provedor: Microsoft Azure, serviço Static Web Apps (plano Free), região East US 2.
- Aplicação publicada: https://thankful-cliff-0dad7700f.5.azurestaticapps.net

## Evidências

Todas as capturas estão em `docs/evidencias/`.

**GitHub Projects e Issues**

![Issue da história de usuário](docs/evidencias/02-issue-historia-4.png)
![Tarefa movida para In Progress](docs/evidencias/03-issue-tarefa-5-in-progress.png)
![Quadro final](docs/evidencias/17-quadro-final.png)

**Repositório, branches, commits e Pull Requests**

![Estrutura do repositório na main](docs/evidencias/04-repositorio-main.png)
![Branches](docs/evidencias/05-branches.png)
![Histórico de commits](docs/evidencias/06-commits-main.png)
![PR 8 com checks aprovados](docs/evidencias/07-pr-8-checks-aprovados.png)
![PR 8 mergeado](docs/evidencias/08-pr-8-merged.png)

**GitHub Actions e nuvem**

![CI executado com sucesso](docs/evidencias/09-ci-executado.png)
![Secret configurado (valor oculto)](docs/evidencias/10-secret-configurado.png)
![Primeiro deploy com sucesso](docs/evidencias/11-deploy-1-sucesso.png)
![Aplicação publicada na Azure](docs/evidencias/12-site-publicado-v1.png)
![Site publicado: Ecopontos e painel de gestão](docs/evidencias/12b-site-publicado-v1-ecopontos-painel.png)

**Nova alteração e atualização automática do ambiente**

![PR 9 com checks aprovados](docs/evidencias/13-pr-9-checks-aprovados.png)
![PR 9 mergeado](docs/evidencias/14-pr-9-merged.png)
![Segundo deploy com sucesso](docs/evidencias/15-deploy-2-sucesso.png)
![Site atualizado com o selo Versão 1.1](docs/evidencias/16-site-atualizado-v1-1.png)

A alteração da Versão 1.1 foi feita na branch `feature/selo-versao`, integrada por Pull Request e publicada automaticamente pelo workflow de deploy, como mostram as capturas 13 a 16.
