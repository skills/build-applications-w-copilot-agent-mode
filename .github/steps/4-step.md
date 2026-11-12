## Etapa 4: Construa e teste a camada de apresentação React

Continue na branch `build-octofit-app` e delimite cada solicitação ao Copilot pelos testes desta camada.

### 📖 Teoria: estados da interface fazem parte do contrato

A camada de apresentação deve mostrar os estados de carregamento, vazio, sucesso e erro, mantendo a construção das URLs da API fora dos componentes individuais. O React Router oferece telas navegáveis para cada capacidade, e os testes de componentes comprovam que os dados da API se transformam em conteúdo acessível e significativo na interface. Testar esses estados torna mais confiável a interface gerada pelo Copilot.

### ⌨️ Atividade: construa e teste a camada de apresentação React

1. Inspecione o cliente compartilhado da API, os esqueletos das rotas e os testes de componentes.

1. Peça ao Copilot a menor mudança de interface a partir de um teste que falha.

   > ![Static Badge](https://img.shields.io/badge/Prompt-text?style=for-the-badge&logo=github-copilot&logoColor=white&labelColor=purple&color=purple)
   >
   > ```text
   > Use o teste de frontend que falha para implementar a menor mudança de interface possível. Reutilize o cliente compartilhado da API e preserve os estados de carregamento, vazio e erro. Mantenha todos os textos visíveis em português do Brasil.
   > ```

1. Repita o processo para atividades, equipes, placar e sugestões de treino. Cada rota precisa dos estados de carregamento, vazio, sucesso e erro; as sugestões de treino devem chamar `/api/workouts/suggestions/:userEmail` para uma pessoa seed como `mona@example.com`.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > npm test --prefix octofit-tracker/frontend
   > ```

1. Compile o aplicativo Vite e inspecione-o manualmente na porta 3000.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > npm run build --prefix octofit-tracker/frontend
   > npm run dev --prefix octofit-tracker/frontend -- --host 0.0.0.0
   > ```

1. Faça commit e publique a camada de apresentação.

<details>
<summary>Está com dificuldades? 🤷</summary><br/>

- Mantenha o cliente compartilhado da API em caminhos relativos `/api` (com substituição opcional por `import.meta.env.VITE_API_BASE_URL`). O proxy Vite encaminha as requisições para a porta 8000.
- Mantenha a lógica de requisições fora dos componentes repetidos: cada componente de rota importa `getJson` de `src/api/client.ts` e nunca chama `fetch` diretamente.
- Confira os nomes acessíveis e as mensagens semânticas de status/erro quando os testes falharem.

</details>
