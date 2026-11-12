---
applyTo: "**/*"
---

# Instruções de configuração do projeto OctoFit

Preserve estas restrições em todas as camadas:

- Use MongoDB na porta 27017, a API Express na porta 8000 e o Vite na porta 3000.
- Encaminhe as portas 3000 e 8000 como públicas e mantenha a porta 27017 privada.
- Não encaminhe nem torne públicas outras portas.
- Use o pacote oficial `mongodb-org` e o cliente oficial `mongosh` quando precisar interagir diretamente com o serviço.
- Mantenha separadas as responsabilidades de apresentação, lógica e dados.
- Prefira mudanças pequenas, guiadas por testes, em vez de regenerações amplas.
- Use os modelos Mongoose e o código da aplicação para estruturar e popular o banco; não crie dados por scripts diretos do MongoDB.
- Não introduza autenticação neste exercício; deixe-a como um desafio futuro.
- Escreva em português do Brasil todo texto visível para as pessoas usuárias.
- Execute comandos a partir da raiz do repositório, informando caminhos explícitos; não mude de diretório.
