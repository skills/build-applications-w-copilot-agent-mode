## Etapa 3: Implemente e teste a camada de lógica do Express

Continue na branch `build-octofit-app` e delimite cada solicitação ao Copilot pelos testes desta camada.

### 📖 Teoria: APIs expressam comportamento, não apenas rotas

A camada de lógica é responsável pela validação das requisições, regras de negócio, códigos de status e respostas de erro. Os testes de contrato com Supertest tornam essas decisões observáveis sem exigir um navegador e impedem que um endpoint passe apenas porque sua rota existe no código. Implemente uma capacidade de cada vez e use a saída dos testes para orientar as mudanças do Copilot.

### ⌨️ Atividade: implemente e teste a camada de lógica do Express

1. Inspecione os esqueletos das rotas e dos serviços, assim como os testes de contrato da API.

   O contrato de criação de atividade recebe `userId` e `teamId` de registros existentes. Os testes de contrato já criam fixtures válidas de equipe e pessoa antes de enviar uma atividade; implemente usando-as em vez de editá-las ou inventar uma resolução de nomes.

1. Peça ao Copilot para começar com um comportamento da API que esteja falhando.

   > ![Static Badge](https://img.shields.io/badge/Prompt-text?style=for-the-badge&logo=github-copilot&logoColor=white&labelColor=purple&color=purple)
   >
   > ```text
   > Comece pelo primeiro teste de contrato da API que falha. Explique o comportamento esperado, implemente somente esse comportamento e indique qual teste executar em seguida.
   > ```

1. Repita o ciclo de teste, mudança e revisão para atividades, equipes, placar e sugestões de treino.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > npm run test:api --prefix octofit-tracker/backend
   > ```

1. Em um terminal dedicado, inicie o backend na porta 8000 e deixe-o em execução.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > npm run dev --prefix octofit-tracker/backend
   > ```

1. Em outro terminal, verifique uma requisição bem-sucedida e uma falha de validação.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > curl http://localhost:8000/api/activities
   > curl -i -X POST http://localhost:8000/api/activities -H "Content-Type: application/json" -d "{}"
   > ```

1. Faça commit e publique a API testada.

<details>
<summary>Está com dificuldades? 🤷</summary><br/>

- Mantenha as rotas sob `/api/`.
- Retorne respostas 4xx intencionais para entradas inválidas, em vez de resultados que aparentam sucesso.
- Mantenha o comportamento de Codespaces e localhost em um único helper de configuração.

</details>
