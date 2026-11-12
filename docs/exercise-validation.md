# Validação para mantenedores

Execute estas verificações antes de publicar ou depois de alterar o conteúdo do exercício, a automação, o devcontainer ou o scaffold inicial.

```bash
node .github/scripts/validate-exercise.mjs
node --test tests/exercise-validation.test.mjs
npm ci --prefix octofit-tracker/backend
npm ci --prefix octofit-tracker/frontend
npm run build --prefix octofit-tracker/backend
npm run build --prefix octofit-tracker/frontend
```

Os testes da aplicação inicial devem falhar até que a pessoa participante implemente cada capacidade. Use as verificações do script de avaliação e os casos negativos para validar os contratos do exercício.

A avaliação executa diretamente os testes de contrato, `tsc` e `vite build` por meio de `grade-step.mjs`, em vez de scripts npm que podem ser alterados pela pessoa participante. Ela não é executada se um arquivo de contrato protegido (testes de contrato, `tsconfig.json` ou `vite.config.ts` do frontend) tiver sido modificado. Depois de alterar intencionalmente um desses arquivos, atualize os hashes:

```bash
node .github/scripts/grade-step.mjs print-contract-hashes
```

Copie a saída para `protectedContracts` em `.github/scripts/grade-step.mjs`.

Essas proteções evitam alterações acidentais ou geradas por IA, como o modo agent editando um teste ou script npm para fazê-lo passar. Elas não são uma defesa contra adulteração deliberada. As pessoas participantes são proprietárias da cópia do repositório, incluindo o avaliador e os workflows das etapas; portanto, a avaliação é um feedback formativo que libera a etapa seguinte, não uma avaliação protegida. O job de mantenedor `validate-exercise.yml` é executado somente no repositório de template.

## Lista de verificação para redefinição e publicação

1. Confirme que o repositório está configurado como template e que `0-start-exercise.yml` possui o gatilho automático `push`.
2. Confirme que todos os workflows numerados usam a mesma referência `skills/exercise-toolkit@v0.9.3`. O workflow inicial do toolkit desativa todos os workflows numerados; a Etapa 0 ativa a Etapa 1.
3. Crie um repositório novo a partir do template e confirme que a issue do exercício aparece sem iniciar um workflow manualmente.
4. Faça cada etapa avaliada falhar uma vez de propósito e confirme que o comentário de feedback identificado é substituído, e não duplicado.
5. Para redefinir uma cópia de teste descartável, exclua a issue do exercício e recrie o repositório a partir do template. Não ative manualmente workflows de etapas posteriores no template publicado.
6. Feche uma pull request sem mesclá-la e confirme que o exercício continua aberto; em seguida, mescle uma pull request aprovada e confirme que a revisão final é publicada.
