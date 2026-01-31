# Pet Manager - Mato Grosso (IOMAT)

## Informações do Candidato

- **Nome:** Jean Lucas Solano Fortes
- **Vaga:** Desenvolvedor Front-End
- **Data:** Janeiro de 2026

## Tecnologias Utilizadas

- React + TypeScript
- Tailwind CSS
- Axios / RxJS (BehaviorSubject no health)
- Zustand
- Docker
- Vitest (testes unitários)

## Arquitetura

- **Lazy Loading** nas rotas ([src/routes/index.tsx](src/routes/index.tsx)): páginas carregadas sob demanda para melhor performance.
- **Pattern Facade** ([src/facades/](src/facades/) + services + state): camada de abstração que une chamadas à API (services) e estado reativo (state), facilitando testes e manutenção.
- **Separação em camadas:** `@core` (interceptors, configs), `api/services` (acesso à API), `facades`, `components` (UI reutilizável), `views` (páginas). Essa organização garante escalabilidade e legibilidade do registro público de pets.

## Como Executar

1. Clone o repositório.
2. Certifique-se de ter o Docker instalado.
3. (Opcional) Copie `.env.example` para `.env` na raiz e ajuste `VITE_API_BASE_URL` para Produção ou Homologação conforme o ambiente.
4. Suba o projeto com Docker:
   - **Opção A – a partir da raiz do repositório:**
     ```bash
     docker-compose -f docker/docker-compose.yml up --build
     ```
   - **Opção B – a partir da pasta docker:**
     ```bash
     cd docker
     docker-compose up --build
     ```
   Para apenas buildar sem subir: na raiz use `docker-compose -f docker/docker-compose.yml build`; dentro de `docker/` use `docker-compose build`.
5. Acesse em: **http://localhost:3000**

## O que foi implementado

- Autenticação completa com Refresh Token (login e interceptor para 401).
- Tela inicial para logar.
- Listagem de pets em grid com busca e paginação (10 itens por página).
- Detalhes do pet com exibição completa e integração com dados do tutor.
- Formulário de pet: cadastro/edição com upload de foto.
- CRUD de tutores (cadastro e edição).
- Tela de gerenciamento de vínculos: associar e remover pets ao tutor.
- Upload de foto de perfil do tutor.
- Health check (endpoint /health e componente de verificação de disponibilidade).
- Testes unitários para Facades e Componentes (Vitest).
- Dockerfile multi-stage (builder + nginx) e Docker Compose.
