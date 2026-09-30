# Incremento 01 - GetRandomUsers

Server action que devolve ate 3 utilizadores sugeridos (exclui o proprio e quem ja segue).

Incremento anterior: `00-base`

## O que este incremento acrescenta

- `GetRandomUsers()` em `src/actions/user-action.ts`
- `src/actions/user-action.get-random-users.test.ts`
- Jenkinsfile: novo stage `Teste: GetRandomUsers`

## Stages de teste no Jenkinsfile

- `Teste: GetDbUserId` -> `src/actions/user-action.test.ts`
- `Teste: GetRandomUsers` -> `src/actions/user-action.get-random-users.test.ts`

## Correr localmente

```
npm ci
npx prisma generate
npm run lint
npm run typecheck
npx vitest run --coverage
```
