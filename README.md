# Energy Bill Tracker

Este projeto é um serviço desenvolvido em NestJS para o upload, download, extração e armazenamento de faturas em PDF. Ele processa os arquivos, extrai informações relevantes e armazena os dados no banco de dados.

## Visão Geral

O Energy Bill Tracker é uma aplicação que permite aos usuários fazer upload, analisar e visualizar suas contas de energia. Ele extrai dados importantes das contas e fornece insights úteis sobre o consumo de energia.

## Tecnologias Utilizadas

- Frontend: Next.js
- Backend: NestJS
- Banco de Dados: PostgreSQL
- TypeORM: Prisma
- Containerização: Docker
- PDF Parsing: pdf-parse
- Multer

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- Node.js (versão 14 ou superior)
- npm
- Docker e Docker Compose

## Configuração do Projeto

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/energy-bill-tracker.git
   cd energy-bill-tracker
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env` em ambas as pastas `apps/api` e `apps/dashboard`.
   - Preencha as variáveis de ambiente necessárias em cada arquivo `.env`.

4. Inicie o banco de dados PostgreSQL usando Docker:
   ```
   docker-compose up -d
   ```

5. Execute as migrações do banco de dados:
   ```
   cd apps/api
   npx prisma migrate dev
   ```

## Executando a Aplicação

1. Inicie o servidor de desenvolvimento para o backend (API):
   ```
   cd apps/api
   npm start
   ```

2. Em outro terminal, inicie o servidor de desenvolvimento para o frontend (Dashboard):
   ```
   cd apps/dashboard
   npm run dev
   ```

3. Acesse a aplicação em seu navegador:
   - API: http://localhost:3000
   - Frontend: http://localhost:3001

## Estrutura do Projeto

- `apps/api`: Código do backend NestJS
- `apps/dashboard`: Código do frontend Next.js
- `prisma`: Esquemas e migrações do Prisma

## Funcionalidades Principais

- Upload de contas de energia em PDF
- Extração automática de dados das contas
- Armazenamento e visualização de dados extraídos
- Download de contas de energia
- Visualização de gráficos e estatísticas de consumo
- Gerenciamento de múltiplos clientes e contas

## Upload e Download de PDFs

### Armazenamento de Arquivos
Os arquivos PDF das contas de energia são armazenados localmente no servidor, em um diretório específico definido nas configurações do projeto. O caminho para este diretório é especificado no arquivo de ambiente (.env) da API.

### Download de PDFs
Para baixar um PDF armazenado, a aplicação fornece um endpoint específico na API. O usuário pode solicitar o download através da interface do usuário no frontend, que faz uma requisição para este endpoint. O servidor então recupera o arquivo do diretório local e o envia como resposta, permitindo que o usuário faça o download.

## Rodando Testes

Para executar os testes do projeto, siga estas etapas:

1. Navegue até o diretório da API:
   ```
   cd apps/api
   ```

2. Execute os testes unitários:
   ```
   npm test
   ```

3. Para executar os testes de integração:
   ```
   npm test:e2e
   ```