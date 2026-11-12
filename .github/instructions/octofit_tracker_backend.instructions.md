---
applyTo: "octofit-tracker/backend/**"
---

# Instruções para o backend do OctoFit

- Use Express, TypeScript, Mongoose e funções de serviço explícitas.
- Mantenha as rotas sob `/api/` e retorne respostas 4xx intencionais para entradas inválidas.
- Mantenha a validação de modelos nos esquemas Mongoose e as regras de negócio nos serviços.
- Use a configuração compartilhada do banco de dados em vez de lógica de conexão codificada diretamente.
- Insira dados de demonstração estáveis com operações upsert; nunca limpe coleções que possam conter dados da aplicação e reconcilie a associação anterior de uma pessoa de demonstração à equipe ao mover esse registro.
- Mantenha em português do Brasil os títulos, motivos e mensagens de erro visíveis às pessoas usuárias; preserve códigos de domínio como `run`, `endurance` e `strength`.
