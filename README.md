# InFile - Backend para Sistema de Filas

Este é o backend do aplicativo **InFile** criado para gerenciar filas on-line para hospitais, clínicas e estabelecimentos físicos com o objetivo de acabar com as lotações.

A API foi projetada em **Node.js (Express)**, utilizando o **Prisma ORM**. Ela já está estruturada e pronta para ser **Hospedada na Vercel**.

## 🚀 Como fazer o Deploy na Vercel (Passo a Passo)

1. Envie esta pasta `infile-backend` para o seu **GitHub** (crie um repositório).
2. Acesse sua conta na [Vercel](https://vercel.com/) e cique em **Add New Project**.
3. Selecione o repositório do GitHub.
4. Antes de clicar em *Deploy*, vá até **Environment Variables** (Variáveis de Ambiente):
   - Adicione uma variável chamada `DATABASE_URL` contendo o link do seu banco de dados na web.
     *Dica:* Sugiro usar o **Vercel Postgres** (pode ser criado lá mesmo na Vercel em *Storage* > *Postgres*) ou o banco do [Supabase](https://supabase.com).
5. O `vercel.json` e o comando `prisma generate` no package.json já garantem que o backend e os provedores de banco funcionem no ambiente Serverless da Vercel.
6. Clique em **Deploy**. Quando terminar, sua API estará online!

---

## 💻 Como Rodar e Testar Localmente (no seu Computador)

Caso queira testar a API no seu PC antes de enviar para a Vercel, você precisará do **Node.js** instalado:

1. Abra o terminal na pasta raiz (`infile-backend`).
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo chamado `.env` e coloque seu banco de dados, configurando local (ou online):
   ```env
   DATABASE_URL="postgres://usuario:senha@localhost:5432/nomedobanco"
   ```
4. Gere e conecte o Prisma com seu banco de dados:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Inicie o servidor:
   ```bash
   npm run dev
   ```
6. O Servidor estará rodando em `http://localhost:3001`!

---

## 🔗 Resumo dos Endpoints da sua API

- **GET** `/api/status` - Verifica se o backend está online.
- **POST** `/api/places` - Cria um novo estabelecimento/hospital (Envia: `{ "name": "Hospital InFile", "category": "Saúde" }`).
- **GET** `/api/places` - Lista todos os estabelecimentos.
- **POST** `/api/queues` - Cria uma nova Fila para um lugar (Envia: `{ "placeId": "id-do-lugar", "name": "Triagem" }`).
- **GET** `/api/queues/:id` - Informações de uma Fila, **incluindo** as pessoas que estão nela (tickets).
- **POST** `/api/tickets` - Cria a senha/entrada na fila (Envia: `{ "queueId": "id-da-fila", "customerName": "Maria", "customerPhone": "1199999999" }`).
- **PATCH** `/api/tickets/:id/status` - Altera a pessoa na fila (Envia: `{ "status": "CALLED" }`). Status aceitos: `WAITING` (Aguardando), `CALLED` (Chamada), `COMPLETED` (Atendido), `CANCELLED` (Desistiu/Cancelado).

Sucesso com o InFile! Qualquer ajuste, é só avisar!
