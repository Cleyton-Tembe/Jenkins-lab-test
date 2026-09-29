# Incremento 00 - Base

Estado inicial da aplicacao: posts, perfil (so separador Posts) e a funcao GetDbUserId. Ainda nao ha sugestoes de utilizadores, follow, nem posts gostados.

Incremento anterior: nenhum (ponto de partida)

## Conteudo

- Aplicacao sem as 5 funcionalidades marcadas com `// criar teste`
- `src/actions/user-action.test.ts` (testes de GetDbUserId)
- Jenkinsfile com os stages Checkout, Instalar dependencias, Prisma Generate, Qualidade (Lint + Typecheck), Testes (`Teste: GetDbUserId`), Cobertura, Build e CD

## Stages de teste no Jenkinsfile

- `Teste: GetDbUserId` -> `src/actions/user-action.test.ts`

## Correr localmente

```
npm ci
npx prisma generate
npm run lint
npm run typecheck
npx vitest run --coverage
```
