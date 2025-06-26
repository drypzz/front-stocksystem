# 🛒 StockSystem - E-commerce Completo

> Uma aplicação full-stack que simula um sistema de e-commerce, com gerenciamento de produtos, carrinho de compras e um fluxo de pagamento ponta-a-ponta integrado com PIX via Mercado Pago.

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

## 📖 Tabela de Conteúdos

* [Sobre o Projeto](#-sobre-o-projeto)
* [Funcionalidades](#-funcionalidades)
* [Tecnologias e Arquitetura](#-tecnologias-e-arquitetura)
* [Como Começar](#-como-começar)
* [Links Importantes](#-links-importantes)
* [Desenvolvedor](#-desenvolvedor)

---

## 🎯 Sobre o Projeto

O **StockSystem** é uma aplicação full-stack que vai além de um simples gerenciamento de estoque. Ele foi projetado para ser um protótipo funcional de e-commerce, demonstrando um fluxo completo desde a visualização de produtos até a finalização do pagamento.

O front-end, construído com **React em Componentes de Classe**, oferece uma interface de usuário intuitiva para clientes e administradores. O back-end, desenvolvido em **Node.js** e hospedado no **Supabase**, gerencia toda a lógica de negócio, autenticação e, crucialmente, a integração com a API do **Mercado Pago** para processamento de pagamentos via **PIX**, incluindo a geração de QR Codes dinâmicos com a logo da marca.

Este projeto é um case prático de integração de tecnologias modernas para criar uma experiência de compra digital robusta e completa.

---

## ✨ Funcionalidades

### 🛒 Fluxo de E-commerce (Cliente)

* ✅ **Autenticação de Usuários:** Sistema de cadastro e login.
* ✅ **Navegação na Loja:** Visualização de produtos disponíveis.
* ✅ **Carrinho de Compras:** Adicionar, remover e atualizar a quantidade de produtos (com validação de estoque em tempo real).
* ✅ **Criação de Pedidos:** Finalizar a compra e gerar um pedido formal no sistema.
* ✅ **Histórico de Pedidos:** Visualizar todos os pedidos feitos, com status e detalhes.
* ✅ **Validação de Dados:** O histórico trata de forma inteligente os pedidos que contêm produtos que foram deletados posteriormente.
* ✅ **Pagamento com PIX:** Integração completa com o Mercado Pago para gerar cobranças PIX.
* ✅ **QR Code Personalizado:** Geração de um QR Code de pagamento que inclui a logo da loja no centro.
* ✅ **Cancelamento de Pedidos:** O usuário pode cancelar pedidos pendentes, com a ação refletindo no back-end e no gateway de pagamento.

### 🗃️ Gerenciamento (Admin)

* ✅ **CRUD de Produtos:** Criar, ler, atualizar e deletar produtos no sistema.
* ✅ **CRUD de Categorias:** Organizar produtos em diferentes categorias.

---

## 🛠️ Tecnologias e Arquitetura

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
* **[Sequelize](https://sequelize.org/):** ORM (Object-Relational Mapper) para interagir com o banco de dados de forma segura e produtiva.
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
    # Clone o repositório do Front-end
    git clone [https://github.com/drypzz/front-stocksystem.git](https://github.com/drypzz/front-stocksystem.git)
    ```

2.  **Instale as dependências de ambos os projetos:**
    ```bash
    cd ../front-stocksystem && npm install
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

---

## 💻 Desenvolvedor

Este projeto foi desenvolvido por:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/drypzz">
        <img src="https://avatars.githubusercontent.com/u/79218936?v=4" width="100px;" alt="Foto de Gustavo"/>
        <br />
        <sub><b>Gustavo (@drypzz)</b></sub>
      </a>
    </td>
  </tr>
</table>