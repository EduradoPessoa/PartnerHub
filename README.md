<div align="center">
  <h1>PartnerHub</h1>
  <p>Portal de Parceiros Comerciais para gestão de oportunidades, timesheet, comissões e políticas.</p>
</div>

## Visão Geral

- O PartnerHub centraliza o acompanhamento de oportunidades e clientes, o pipeline de vendas, registro de horas (timesheet), cálculo e controle de comissões e políticas institucionais.
- O projeto é focado em uma experiência moderna e responsiva, utilizando React, Vite, TypeScript e Tailwind CSS.
- Nesta versão, quaisquer interações com funcionalidades de IA foram removidas do aplicativo e serão retomadas em uma fase futura.

## Principais Funcionalidades

- Dashboard personalizado por perfil.
- Pipeline de vendas com estágios e indicadores.
- Listagem de oportunidades e clientes com edição, exclusão e detalhes.
- Agenda de projetos.
- Timesheet para registro de horas da equipe.
- Cálculo e controle de comissões.
- Área administrativa com visão global e contas a pagar.
- Políticas institucionais.
- Perfil do usuário com atualização de dados.

## Arquitetura e Tecnologias

- Framework: `React 18` com `TypeScript`
- Bundler/Dev server: `Vite`
- UI/estilos: `Tailwind CSS`, `lucide-react`
- Gráficos: `recharts`
- Roteamento: `react-router-dom`
- Dados locais: serviços de mock em `services/mockData.ts`

## Estrutura do Projeto

- `App.tsx`: Composição da aplicação, rotas e layout principal (`Sidebar` retrátil e cabeçalho móvel).
- `components/`: Páginas e componentes funcionais, como `Dashboard`, `AdminDashboard`, `OpportunityList`, `PipelineBoard`, `AccountsPayable`, `SalesHistory`, `ProjectCalendar`, `Timesheet`, `Profile`, `Login`.
- `services/mockData.ts`: Carregamento e persistência local simulada de usuários, oportunidades, timesheet e comissões.
- `types.ts`: Tipos e enums usados pela aplicação.
- `public/api/index.php`: Endpoint estático de exemplo.
- `index.tsx`, `index.html`, `index.css`: Bootstrap da aplicação e estilos globais.

## Requisitos

- Node.js 18+ (recomendado)

## Instalação e Execução

- Instalar dependências: `npm install`
- Desenvolvimento: `npm run dev`
- Build de produção: `npm run build`
- Preview do build: `npm run preview`

## Deploy na Vercel

- Importar o repositório no painel da Vercel.
- Framework: selecione `Vite` (auto-detectado).
- Build Command: `npm run build`
- Output Directory: `dist`
- Variáveis de ambiente: não são necessárias nesta versão.
- Como a aplicação usa `HashRouter`, não são necessárias regras de rewrite adicionais.

## Configuração

- Não são necessárias variáveis de ambiente para a execução das funcionalidades desta versão.
- Dependências relacionadas a IA permaneceram no `package.json`, mas não são utilizadas no aplicativo. As integrações com IA serão reintroduzidas em uma fase futura.

## Convenções e Estilo

- Componentes funcionais com `React` e `TypeScript`.
- Estilização com `Tailwind CSS` e ícones `lucide-react`.
- Navegação com `react-router-dom`.
- Persistência local simulada via `localStorage` por meio de `services/mockData.ts`.

## Desenvolvimento

- Lint/Typecheck: utilize seu ambiente com suporte a TypeScript para validação. Caso haja scripts adicionais de lint, podem ser adicionados conforme necessidade futura.
- Padrões de código: mantenha componentes pequenos e reutilizáveis; evite acoplamento entre camadas de UI e serviços.

## Roadmap

- Reintrodução das funcionalidades de IA (assistente de propostas, geração de conteúdo): próxima fase.
- Integração com backend real para dados de oportunidades, comissões e timesheets.
- Relatórios avançados e exportação.
- Gestão de notificações e automações.

## Licença

- Este projeto não especifica uma licença pública. Caso necessário, adicione uma licença adequada ao seu contexto organizacional.
