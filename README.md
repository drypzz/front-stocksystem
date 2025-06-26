# 🛒 StockSystem - Gestão e Vendas com PIX

> Uma aplicação full-stack que simula um sistema de gestão de ponta-a-ponta, com controle de estoque, criação de pedidos e um fluxo de pagamento completo integrado com PIX via Mercado Pago.

<p align="center">
  <a href="https://stksystem.vercel.app" target="_blank">
    <img alt="Deploy na Vercel" src="https://img.shields.io/badge/Ver%20Demo-stksystem.vercel.app-%23000000?style=for-the-badge&logo=vercel">
  </a>
</p>

[![Status](https://img.shields.io/badge/status-ativo-brightgreen.svg?style=for-the-badge)]()
[![Tecnologia](https://img.shields.io/badge/React-Class%20Components-61DAFB?style=for-the-badge&logo=react)]()

<p align="center">
  <img src="https://github.com/drypzz/front-stocksystem/blob/master/layout/screenshot.png" alt="Layout do StockSystem" width="750"/>
</p>

---

## 🎯 Sobre o Projeto

O **StockSystem** é uma aplicação full-stack projetada para ser um protótipo funcional de um sistema de gestão e vendas. A interface, construída com **React**, é unificada, permitindo que o próprio gestor controle o estoque e, ao mesmo tempo, simule e execute todo o fluxo de um cliente, desde a montagem do carrinho até a finalização do pagamento.

O back-end, desenvolvido em **Node.js**, gerencia toda a lógica de negócio, autenticação e, crucialmente, a integração com a API do **Mercado Pago** para processamento de pagamentos via **PIX**.

Este projeto é um case prático de integração de tecnologias modernas para criar uma experiência de gestão e venda digital robusta e completa.

---

## ✨ Funcionalidades Principais

* **🗃️ Gestão de Estoque:**
    * CRUD completo de Produtos e Categorias para total controle do inventário.

* **🛒 Fluxo de Pedidos:**
    * **Carrinho de Compras:** Adição e remoção de produtos com um controle de quantidade interativo.
    * **Validação de Estoque:** O sistema valida em tempo real a quantidade de itens no carrinho, desabilitando a finalização da compra e sinalizando visualmente os produtos com estoque insuficiente.
    * **Criação de Pedidos:** Geração de pedidos formais a partir dos itens do carrinho.

* **💳 Pagamentos e Histórico:**
    * **Pagamento com PIX:** Integração ponta-a-ponta com o Mercado Pago para gerar cobranças PIX.
    * **Histórico de Pedidos:** Visualização de todos os pedidos feitos, com status detalhado. O histórico trata de forma inteligente os pedidos que contêm produtos que foram deletados posteriormente, exibindo um alerta de inconsistência.
    * **Cancelamento de Pedidos:** Permite o cancelamento de pedidos pendentes, com a ação refletindo no back-end e no gateway de pagamento.

* **🖥️ Interface:**
    * **Design Responsivo:** Layout adaptável para uma experiência consistente em desktops, tablets e celulares.
    * **Feedback ao Usuário:** Componentes de *skeleton screen* para carregamentos suaves, e um sistema de notificações (`toast`) para feedback de ações.

---

## 🛠️ Tecnologias

Este projeto é dividido em duas partes principais:

### **Front-end (Este Repositório)**

* **[React.js](https://reactjs.org/) (Componentes de Classe):** Biblioteca principal para a construção da interface, utilizando a arquitetura de classes.
* **[React Router Dom](https://reactrouter.com/):** Para gerenciamento de rotas de navegação (SPA).
* **[Context API](https://reactjs.org/docs/context.html):** Utilizada para o gerenciamento de estado global do carrinho de compras.
* **[Axios](https://axios-http.com/):** Cliente HTTP para realizar as requisições à API de forma segura.
* **[CSS Modules](https://github.com/css-modules/css-modules):** Para estilização encapsulada e componentizada, evitando conflitos de classes.
* **[Vercel](https://vercel.com/):** Plataforma de hospedagem para deploy contínuo do front-end.

### **Back-end ([Ver Repositório](https://github.com/drypzz/api-StockSystem))**

* **[Node.js](https://nodejs.org/):** Ambiente de execução para o servidor.
* **[Express.js](https://expressjs.com/):** Framework para a construção da API RESTful.
* **[Sequelize](https://sequelize.org/):** ORM para interagir com o banco de dados de forma segura e produtiva.
* **[Supabase](https://supabase.io/):** Utilizado como provedor de infraestrutura, incluindo o banco de dados **PostgreSQL**.
* **[Mercado Pago SDK](https://www.mercadopago.com.br/developers):** Para integração com o gateway de pagamento e geração de cobranças PIX.
* **[JSON Web Tokens (JWT)](https://jwt.io/):** Para gerenciamento de sessões e autenticação de rotas.

---

## 🌱 Como Começar

Para executar este projeto localmente, siga os passos abaixo.

### Pré-requisitos

* [Node.js](https://nodejs.org/en/) (versão 16 ou superior) e [npm](https://www.npmjs.com/) instalados.
* Uma conta no [Supabase](https://supabase.io/) para o banco de dados e uma conta no [Mercado Pago](https://www.mercadopago.com.br/developers) para obter as credenciais de pagamento.

### Instalação

1.  **Clone os repositórios:**
    ```bash
    git clone [https://github.com/drypzz/front-stocksystem.git](https://github.com/drypzz/front-stocksystem.git)
    ```

2.  **Instale as dependências de ambos os projetos:**
    ```bash
    cd ../front-stocksystem && npm install
    ```

### Configuração de Ambiente

1.  **Back-end:** Crie um arquivo `.env` na raiz do projeto `api-StockSystem` e preencha com as suas credenciais:
    ```env
    API_PORT=3001
    DATABASE_URL=sua_string_de_conexao_do_supabase
    MERCADO_PAGO_ACCESS_TOKEN=seu_token_de_acesso_do_mercado_pago
    JWT_SECRET=seu_segredo_jwt_aleatorio
    BACKEND_URL=http://localhost:3001
    ```

### Execução

1.  **Inicie a aplicação React (Front-end):**
    ```bash
    # Em um novo terminal, no diretório front-stocksystem
    npm start
    ```
    A aplicação será iniciada em `http://localhost:3000`.

---

## 🔗 Links Importantes

-   **Aplicação Online:** [https://stksystem.vercel.app](https://stksystem.vercel.app)
-   **Repositório do Back-end:** [https://github.com/drypzz/api-StockSystem](https://github.com/drypzz/api-StockSystem)

> by drypzz
