## Etapa 5: Verifique o sistema e mescle uma pull request revisada

Continue na branch `build-octofit-app` e delimite cada solicitação ao Copilot pelos testes desta etapa.

### 📖 Teoria: evidências de integração antes da mesclagem

Passar nos testes isolados é necessário, mas não suficiente para uma aplicação multicamadas. A verificação final deve comprovar que os contratos de dados, API e interface estão alinhados; em seguida, use uma pull request para revisar a mudança completa como um sistema. O Copilot pode resumir e revisar o diff, mas você continua responsável por conferir as evidências e resolver problemas antes da mesclagem.

### ⌨️ Atividade: verifique o sistema e mescle uma pull request revisada

1. Execute a suíte completa de verificações e as compilações de produção das duas camadas.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > npm run test:data --prefix octofit-tracker/backend
   > npm run test:api --prefix octofit-tracker/backend
   > npm test --prefix octofit-tracker/frontend
   > npm run build --prefix octofit-tracker/backend
   > npm run build --prefix octofit-tracker/frontend
   > ```

1. Confirme se o MongoDB está em execução; depois, inicie a API em um terminal dedicado e deixe-a em execução.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > ps aux | grep mongod
   > npm run seed --prefix octofit-tracker/backend
   > npm run dev --prefix octofit-tracker/backend
   > ```

1. Em outro terminal, inicie o frontend e deixe-o em execução.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > npm run dev --prefix octofit-tracker/frontend -- --host 0.0.0.0
   > ```

1. Abra a porta encaminhada 3000, verifique as quatro jornadas de uso e acione pelo menos um caminho de erro visível.

1. Abra uma pull request de `build-octofit-app` para `main`, inclua evidências dos testes e use o resumo ou a revisão de código do Copilot para inspecionar o diff multicamadas.

1. Resolva os apontamentos válidos, execute novamente as verificações e mescle a pull request.

<details>
<summary>Está com dificuldades? 🤷</summary><br/>

- Não mescle uma pull request fechada ou com falhas.
- Confirme que URLs específicas do ambiente usam o nome do Codespace somente quando ele estiver disponível.
- Confira a execução do Actions para localizar a primeira camada com falha e reproduza-a localmente.
- Se a verificação final falhar após a mesclagem, corrija a questão em `build-octofit-app`, execute novamente os testes acima e mescle uma nova pull request para `main`. A avaliação final considera somente pull requests mescladas.

</details>
