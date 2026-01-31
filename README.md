# jeanlucassolanofortes017503

## Como Executar

1. Clone o repositório.
2. **Variáveis de ambiente (Produção / Homologação):**  
   Copie `.env.example` para `.env` na raiz do projeto e ajuste `VITE_API_BASE_URL` conforme o ambiente (homologação ou produção). Em Vite não é usada pasta `environments/`; a configuração de URLs para Produção e Hml é feita via esses arquivos `.env`.
3. Certifique-se de ter o Docker instalado.
4. Na raiz do repositório, execute:  
   `docker-compose -f docker/docker-compose.yml up --build`  
   Ou, a partir da pasta `docker/`:  
   `docker-compose up --build`
5. Acesse em: http://localhost:3000