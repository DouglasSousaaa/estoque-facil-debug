# Estoque Fácil — projeto corrigido

Aplicação de gerenciamento de estoque desenvolvida com React 18, Vite, React Router DOM 6 e JSON Server 0.17.

## Requisitos
- Node.js instalado.
- npm.

## Como executar

Abra dois terminais na pasta do projeto.

**Terminal 1 — API**
```bash
npm install
npm run server
```
API: `http://localhost:3001/products`

**Terminal 2 — aplicação**
```bash
npm run dev
```
Acesse o endereço informado pelo Vite (normalmente `http://localhost:5173`).

## Testes automatizados
```bash
npm test
```
Os testes da camada de serviço verificam as URLs, métodos HTTP, corpo das requisições e tratamento de erros.

## Build de produção
```bash
npm run build
```

## Funcionalidades
- Listagem: GET `/products`.
- Cadastro: POST `/products`.
- Edição: GET `/products/:id` e PUT `/products/:id`.
- Exclusão: DELETE `/products/:id`, com confirmação.
- Validação de campos e tratamento de falhas de API.

## Documentação da entrega
- `RELATORIO-DEPURACAO.md`: problemas encontrados, diagnóstico, correções e validações.
- `EVIDENCIAS/COMO-GERAR-EVIDENCIAS.md`: roteiro para capturar evidências reais da aplicação e da aba Network.

> As capturas de tela reais devem ser feitas após executar o projeto localmente. Não foram adicionadas imagens simuladas.
