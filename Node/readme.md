# Sistema de Gerenciamento de Usuários

Este é um sistema de gerenciamento de usuários que consiste em duas partes principais:
- Autenticação de usuários usando Python (Flask)
- Operações CRUD (Create, Read, Update, Delete) usando Node.js (Express)

## Funcionalidades

- Registro de usuários
- Login e logout
- Listagem, adição, atualização e exclusão de usuários

## Pré-requisitos

- Python (3.x) instalado
- Node.js instalado
- MongoDB configurado e acessível

## Instalação e Configuração

1. Clone o repositório:

git clone https://github.com/vbtatagiba/P1-Banco-de-dados-n-relacional.git

2. Instale as dependências do projeto Node.js:

cd sistema-gerenciamento-usuarios
npm install


3. Configuração do banco de dados:
   - Configure as variáveis de ambiente necessárias para o MongoDB.

## Uso

1. Inicie o servidor da API de autenticação (Python):

cd auth-api
python app.py


2. Inicie o servidor da API CRUD (Node.js):

cd node-api
npm start


3. Acesse a aplicação em seu navegador ou cliente HTTP.

## Estrutura do Projeto

- `auth-api/`: Contém o código da API de autenticação em Python.
- `node-api/`: Contém o código da API CRUD em Node.js.
- `frontend/`: Contém o código do frontend da aplicação (HTML, CSS, JavaScript).

## Contribuindo

- Sinta-se à vontade para contribuir com melhorias ou correções de bugs através de pull requests.
- Antes de enviar uma solicitação de pull, certifique-se de que o código está de acordo com os padrões de estilo e qualidade.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).