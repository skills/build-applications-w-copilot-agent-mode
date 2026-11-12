## Etapa 1: Leia a arquitetura e estabeleça uma linha de base dos testes

Boas-vindas, @{{ login }}! Você vai ampliar o OctoFit Tracker para um programa de atividades físicas escolar. Comece lendo os contratos e reproduzindo as falhas atuais.

### 📖 Teoria: contratos antes da geração de código

O modo agent funciona melhor quando recebe limites explícitos e critérios de aceitação executáveis. O documento de arquitetura explica a responsabilidade de React, Express e MongoDB, enquanto as suítes de testes com falha mostram o que ainda precisa ser implementado. Leia ambos antes de editar para pedir ao Copilot um plano delimitado, em vez de solicitar que gere uma aplicação inteira.

### ⌨️ Atividade: leia a arquitetura e estabeleça uma linha de base dos testes

1. Abra o botão abaixo em uma nova aba e crie um Codespace para sua cópia do exercício usando a configuração padrão.

   [![Abrir no GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/{{full_repo_name}}?quickstart=1)

1. No Codespace, crie e publique uma branch de trabalho chamada `build-octofit-app`.

1. Antes de executar os testes de integração, verifique se o MongoDB está em execução.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > ps aux | grep mongod
   > ```

1. Instale as dependências das duas camadas e registre a linha de base dos testes que devem falhar.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > npm ci --prefix octofit-tracker/backend
   > npm ci --prefix octofit-tracker/frontend
   > npm test --prefix octofit-tracker/backend
   > npm test --prefix octofit-tracker/frontend
   > ```

1. Peça ao Copilot para inspecionar o projeto antes de editar.

   > ![Static Badge](https://img.shields.io/badge/Prompt-text?style=for-the-badge&logo=github-copilot&logoColor=white&labelColor=purple&color=purple)
   >
   > ```text
   > Leia docs/architecture.md e resuma os limites entre as camadas, os testes que falham atualmente e a menor ordem segura de implementação. Não edite arquivos.
   > ```

1. Registre suas decisões de implementação e o plano de testes em `docs/architecture.md`; depois, faça commit e publique sua branch.

<details>
<summary>Está com dificuldades? 🤷</summary><br/>

- Use `--prefix` para executar todos os comandos a partir da raiz do repositório, sem mudar de diretório.
- Encaminhe somente as portas 3000 e 8000 como públicas; mantenha a porta 27017 privada.
- Se o MongoDB não estiver em execução, siga as instruções de configuração do Codespaces antes de continuar.

</details>
