# 📚 TaskFlow Manager: Gerenciador de Tarefas CRUD

## 📝 Visão Geral do Projeto

O **TaskFlow Manager** é uma aplicação web completa, desenvolvida para gerenciar tarefas (CRUD: Criar, Ler, Atualizar, Deletar). Ele utiliza uma arquitetura moderna com um **Back-end** API RESTful (Node.js/Express) e um **Front-end** dinâmico (HTML/CSS/JavaScript), garantindo a persistência dos dados no **MySQL**. A interface é estilizada com Bootstrap e uma paleta de cores predominante em roxo.

-----

## 1\. ⚙️ Pré-requisitos (O que você precisa ter)

Para configurar e rodar o projeto, os seguintes softwares são indispensáveis:

  * **Node.js:** Ambiente de execução (versão 18+ recomendada).
  * **npm:** Gerenciador de pacotes do Node (vem instalado com o Node.js).
  * **MySQL Server:** Um servidor MySQL ativo (pode ser um serviço local via XAMPP, WAMP ou MySQL Workbench).

-----

## 2\. 🛠️ Configuração Inicial

### 2.1. Configuração do Banco de Dados

1.  **Criação do Schema:** No seu cliente MySQL (Workbench, PHPMyAdmin, etc.), execute o comando para criar o banco de dados que o Back-end espera:
    ```sql
    CREATE DATABASE taskflow_db;
    ```
2.  **Credenciais de Acesso:** O projeto assume que você está usando o usuário padrão `root` e que o banco de dados está em `localhost`.

### 2.2. Configuração do Back-end (API)

1.  **Navegue para a Pasta:** Abra o terminal e vá para a pasta **`/backend`**.

2.  **Instale as Dependências:**

    ```bash
    npm install
    ```

3.  **Ajuste as Credenciais:** Abra o arquivo **`backend/db.js`** e localize o objeto `dbConfig`.

      * Substitua `'SUA_SENHA_AQUI'` pela **senha real do seu usuário `root`** do MySQL.

    <!-- end list -->

    ```javascript
    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: 'SUA_SENHA_AQUI', // <--- Substitua esta linha!
        database: 'taskflow_db', 
        // ... (outras configurações)
    };
    ```

-----

## 3\. 🚀 Como Rodar a Aplicação

É necessário iniciar o Back-end e o Front-end em dois processos separados.

### Passo 1: Iniciar o Back-end (API)

Este processo mantém o servidor rodando e escutando requisições na porta **3000**.

1.  **Terminal 1:** Na pasta **`/backend`**, execute o servidor Node.js:
    ```bash
    node index.js
    ```
2.  **Verificação:** Se a conexão for bem-sucedida, você verá as mensagens:
      * `Conectado ao MySQL e Pool criado!`
      * `Tabela tasks verificada/criada.` (Isso garante que a tabela `tasks` foi criada)
      * `API TaskFlow rodando em http://localhost:3000`
3.  **Mantenha este terminal aberto\!**

### Passo 2: Iniciar o Front-end (Interface Web)

Usaremos o `live-server` para rodar a interface em um servidor local e evitar problemas de CORS.

1.  **Instale o Live Server** (se ainda não tiver):
    ```bash
    npm install -g live-server
    ```
2.  **Terminal 2:** Abra um novo terminal e navegue para a pasta **`/frontend`**.
3.  **Execute o Front-end:**
    ```bash
    live-server
    ```
4.  O aplicativo abrirá automaticamente no navegador (Ex: `http://127.0.0.1:8080/index.html`).

-----

## 4\. 📝 Funcionalidades da Aplicação

Após a inicialização, você pode interagir com o sistema através da interface roxa:

| Ação na Interface | Endpoint Chamado | Resultado Esperado |
| :--- | :--- | :--- |
| **Adicionar** | `POST /tasks` | Insere a tarefa no BD e recarrega a lista. |
| **[Ao carregar]** | `GET /tasks` | Exibe a lista completa, ordenada por data. |
| **Concluir / Reabrir** | `PUT /tasks/:id/done` | Alterna o status (muda estilo e botão). |
| **✏️ Editar** | `PUT /tasks/:id` | Abre `prompt()` para alteração de título/data e salva no BD. |
| **Excluir** | `DELETE /tasks/:id` | Remove a tarefa após confirmação do usuário. |

-----
