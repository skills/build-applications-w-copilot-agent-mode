## Etapa 2: Implemente a camada de dados do MongoDB

Continue na branch `build-octofit-app` e delimite cada solicitação ao Copilot pelos testes desta camada.

### 📖 Teoria: invariantes dos modelos e dados representativos

Os esquemas Mongoose devem expressar as regras das quais o restante da aplicação depende, em vez de apenas espelhar JSON arbitrário. Relacionamentos e validações de atividades, equipes, entradas do placar e sugestões de treino tornam previsível o comportamento posterior da API. Testes focados nos modelos e dados representativos revelam erros no esquema antes que se tornem problemas de HTTP ou da interface.

### ⌨️ Atividade: implemente a camada de dados do MongoDB

1. Leia os testes de contrato dos dados e os esqueletos existentes dos modelos em `octofit-tracker/backend`.

1. Peça ao Copilot um plano delimitado para a camada de dados.

   > ![Static Badge](https://img.shields.io/badge/Prompt-text?style=for-the-badge&logo=github-copilot&logoColor=white&labelColor=purple&color=purple)
   >
   > ```text
   > Explique por que os testes da camada de dados falham e proponha mudanças limitadas aos modelos Mongoose e aos dados de demonstração. Preserve os contratos e não edite arquivos da API ou do React.
   > ```

1. Implemente os esquemas e registros de demonstração em mudanças pequenas, executando os testes de dados após cada capacidade. Use chaves de fixture estáveis e operações upsert para que novas execuções do seed preservem registros não relacionados do MongoDB.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > npm run test:data --prefix octofit-tracker/backend
   > ```

1. Carregue os registros representativos no MongoDB do Codespace e execute o comando duas vezes para confirmar que ele é idempotente.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > npm run seed --prefix octofit-tracker/backend
   > npm run seed --prefix octofit-tracker/backend
   > ```

1. Revise as regras de validação e os relacionamentos realistas no diff; depois, faça commit e publique sua branch.

<details>
<summary>Está com dificuldades? 🤷</summary><br/>

- Use os modelos Mongoose, não scripts diretos do MongoDB.
- Insira dados para as quatro capacidades e mantenha idempotentes as execuções repetidas do seed.
- Investigue a primeira asserção que falha, em vez de regenerar todos os modelos.

</details>
