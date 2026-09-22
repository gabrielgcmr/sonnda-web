<!-- README.md -->
# Sonnda Web

Frontend em React e TypeScript, organizado por funcionalidades. Usa Vite e Bun.

## Desenvolvimento

```sh
bun install
bun run web
```

A configuração existente em `src/lib/env.ts` lê `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY` e, opcionalmente, `VITE_API_URL`.
Em desenvolvimento, o Vite encaminha as chamadas da API conforme `vite.config.ts`.

```sh
bun run lint
bun run test
bun run build
```

## Arquitetura

```text
src/
├── app/                  # Composição da aplicação
│   ├── layouts/          # AppLayout e AuthLayout
│   ├── providers/        # Composição dos providers
│   ├── router/           # Rotas, caminhos e guards
│   └── styles/           # Tema e estilos globais
├── features/
│   ├── auth/             # Sessão, perfil, cadastro e onboarding
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types.ts
│   └── patient/          # Carregamento, busca e listagem de pacientes
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── utils/
│       └── types.ts
├── pages/                # Uma pasta por página; composição e navegação
├── components/
│   ├── common/           # Componentes da aplicação, como AppHeader
│   └── ui/               # Elementos genéricos, como Avatar
├── services/api/         # Cliente HTTP e contrato comum de erros
├── lib/                  # Configuração de bibliotecas e ambiente
├── utils/                # Funções puras de uso geral
└── main.tsx
```

### Onde colocar código novo

- Tipos, endpoints, hooks e regras de uma funcionalidade ficam na própria feature.
  `listPatients()` pertence a `features/patient/api`; o transporte HTTP pertence a
  `services/api`. Erros específicos do onboarding pertencem a `features/auth`.
- Páginas compõem componentes de features e coordenam a navegação. Formulários
  recebem callbacks para comunicar sucesso; não importam páginas ou o roteador.
- `app/providers` reúne os providers. A implementação e o estado de autenticação
  pertencem a `features/auth/context`.
- Componentes de `ui` não conhecem autenticação, pacientes ou serviços. Componentes
  de `common` podem representar conceitos da aplicação e são compostos por páginas
  e layouts. Os estilos específicos ficam ao lado dos componentes.
- `utils` recebe apenas funções sem dependência de um domínio, como formatação de
  datas, CPF e iniciais. A busca de pacientes permanece na feature de pacientes.
- Prefira composição pelas páginas para coordenar features. Features não importam
  `app`, `pages` ou `components/common`. Infraestrutura não importa features ou UI.
- Os caminhos de navegação ficam em `app/router/routes.ts`; páginas podem importar
  essas constantes. Guards cuidam de navegação, e a API continua responsável por
  autorizar o acesso aos dados.
- Não criar pastas vazias para funcionalidades futuras. Uma camada `domain` só
  deve surgir quando houver regras puras compartilhadas entre features. Um store
  global exige uma necessidade concreta de estado compartilhado.

O ESLint verifica as principais restrições de dependência. Testes ficam em `tests/`
e cobrem filtros, formatação, onboarding, erros de perfil, guards e composição dos
layouts. Os testes usam dados locais e não acessam contas reais.

### Fluxos preservados

- URLs: `/`, `/login`, `/register`, `/confirm-email`, `/onboarding` e `/app`.
- Sessão e autenticação continuam usando o cliente configurado em `lib`.
- Perfil usa `/v1/me`; pacientes usam `/v1/patients`.
- A página inicial autenticada continua sendo a lista de pacientes, com o header
  separado do conteúdo. A rota da API atualmente retorna até 100 pacientes.
