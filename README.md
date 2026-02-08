# productGraphAPI

API para gerenciamento de produtos com estrutura organizada em **controllers, models, routes, middlewares e utils**. O projeto também inclui configuração de upload/imagens via **Cloudinary** (`cloudinaryConfig.js`).

---

## ✨ Stack

- Node.js
- Express
- MongoDB
- Estrutura MVC (ver `controllers/`, `models/`, `routes/`)
- Upload/armazenamento de imagens com Cloudinary (`cloudinaryConfig.js`)
 
---

## 📁 Estrutura de pastas

A estrutura do repositório está organizada assim: :contentReference[oaicite:6]{index=6}

- `controllers/` — regras de negócio e handlers das rotas
- `database/` — conexão e configuração do banco
- `middleware/` — autenticação, validações, tratamento de erros etc.
- `models/` — schemas/models das entidades (ex.: Product, Category…)
- `routes/` — definição das rotas/endpoints
- `utils/` — helpers/serviços reutilizáveis
- `index.js` — ponto de entrada do servidor
- `.env` — dados sensiveis
- `cloudinaryConfig.js` — configuração do Cloudinary

---

## ✅ Requisitos

- Node.js (recomendado: versão LTS)
- MongoDB 
- Conta no Cloudinary (se houver upload de imagens)

---

## 🚀 Como rodar o projeto

### 1) Clonar o repositório

```bash
git clone https://github.com/giuseppinhu/productGraphAPI.git
cd productGraphAPI
```

### 2) Instalar dependências
```bash
npm install 
```

### 3) Configurar variáveis de ambiente 

Crie um arquivo .env na raiz do projeto (ou use .env.example) com algo neste formato:

```bash
// MONGOOSE
MONGO_URL=URLDOSEUSERVIDOR

// CLOUDINARY
CLOUDINARY_CLOUD_NAME=NAMECLOUDINARY
CLOUDINARY_API_KEY=APIKEY
CLOUDINARY_API_SECRET=APISECRETE

// JWT
JWT_SECRET=WORDSECRET
```
### 4) Iniciar
```bash
npm run dev
```

## 🔌 Endpoints (exemplos)

API para gerenciamento de produtos, usuários, vendas e dados de dashboard. A autenticação é feita via COOKIE usando um token.

IMPORTANTE:
As rotas protegidas exigem que o front envie cookies.
Exemplo:
fetch -> credentials: "include"
axios -> withCredentials: true

BASE URL:  
```bash  
http://localhost:<PORT>
```

---
### 🔓 AUTENTICAÇÃO

A API utiliza cookie chamado "token".

### 🍪 Cookie exemplo: 
```bash
token=SEUTOKENAQUI; Path=/; Secure; HttpOnly; Expires=Sun, 10 Jan 2026 19:52:54 GMT;
```
- Tipos de proteção:
- AdminAuth -> precisa estar logado e ser admin
- UserLogged -> precisa apenas estar logado

---
### 🪛 DOCUMENTAÇÃO DAS ROTAS
> Em desenvolvimento a documentação com todas as rotas e seus parametros.

--- 

👨‍💻 Desenvolvido por Giuseppe


