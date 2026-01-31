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

### Desktop
<img width="1907" height="1037" alt="image" src="https://github.com/user-attachments/assets/a6790251-acbf-43bb-a980-afd6c507e971" />

### Mobile
<img width="417" height="886" alt="image" src="https://github.com/user-attachments/assets/5b79b1d2-6057-433e-a24e-98620191cfec" />

- Listagem de pets em grid com busca e paginação (10 itens por página).

### Desktop
<img width="1550" height="953" alt="image" src="https://github.com/user-attachments/assets/2db75dd9-eafc-41e3-bc88-65b13f4b2a6f" />

### Mobile
<img width="413" height="889" alt="image" src="https://github.com/user-attachments/assets/83a0355b-e098-4937-9d54-cee2f8c58936" />

- Detalhes do pet com exibição completa e integração com dados do tutor. ( OBS: para acessar essa tela é só clicar na imagem do pet)

### Desktop
<img width="1355" height="715" alt="image" src="https://github.com/user-attachments/assets/52c45ed5-bdae-42ff-965e-ab07d6026853" />

### Mobile
<img width="417" height="887" alt="image" src="https://github.com/user-attachments/assets/d90c68cd-9f0a-4eb1-8334-14b39097f91f" />

- Formulário de pet: cadastro/edição com upload de foto.

### Desktop
<img width="1249" height="943" alt="image" src="https://github.com/user-attachments/assets/b0713584-ec97-48f4-9c9d-1e6e5851cf96" />

### Mobile
<img width="418" height="883" alt="image" src="https://github.com/user-attachments/assets/a2a82b1a-0b44-4ce3-ab61-733764af6a23" />

- Tela de listagem dos tutores

### Desktop
<img width="1343" height="941" alt="image" src="https://github.com/user-attachments/assets/6b1a014a-8be3-494b-b354-506b81e5ef1f" />

### Mobile
<img width="416" height="888" alt="image" src="https://github.com/user-attachments/assets/f9326bc4-7f2e-4689-a136-84f2231f9153" />

- CRUD de tutores (cadastro e edição) com  Upload de foto de perfil do tutor.
  
### Desktop
<img width="1258" height="945" alt="image" src="https://github.com/user-attachments/assets/6b7b8ba0-c796-4426-a32a-24cdce3dd60a" />


### Mobile
<img width="418" height="885" alt="image" src="https://github.com/user-attachments/assets/ca410a3a-aa13-4133-8bcc-ef2f03be9b8f" />
<img width="417" height="884" alt="image" src="https://github.com/user-attachments/assets/d6e8c796-c9e8-43b2-9a40-100de878fff5" />


- Tela de gerenciamento de vínculos: associar e remover pets ao tutor .
  
### Desktop
<img width="452" height="635" alt="image" src="https://github.com/user-attachments/assets/b78ed4fb-3e9c-4af2-a6a4-959b47b4c0d2" />
<img width="1215" height="871" alt="image" src="https://github.com/user-attachments/assets/5cc5e859-9023-42ec-bd88-632253b96990" />
<img width="1258" height="951" alt="image" src="https://github.com/user-attachments/assets/325a235f-a421-431a-9b18-9ace0742632a" />


### Mobile
<img width="397" height="862" alt="image" src="https://github.com/user-attachments/assets/b67b0ee3-9e98-44e7-b064-9baa95807301" />

- Health check (endpoint /health e componente de verificação de disponibilidade).
- Testes unitários para Facades e Componentes (Vitest).
- Dockerfile multi-stage (builder + nginx) e Docker Compose.
