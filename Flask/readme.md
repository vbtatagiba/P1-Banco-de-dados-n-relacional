# Documentação do Código Flask de Cadastro de Funcionários

## Resumo

Este código implementa um aplicativo web Flask para o cadastro e gerenciamento de funcionários. Ele utiliza um banco de dados MySQL para armazenar informações sobre os funcionários, seus cargos e os setores aos quais pertencem. O aplicativo permite adicionar, editar e excluir funcionários, bem como verificar a conexão com o banco de dados.

## Requisitos

- Python 3.x
- Flask
- mysql-connector-python

## Estrutura do Banco de Dados

O banco de dados utilizado possui três tabelas:

### Tabela `setor`

Armazena os setores da empresa.

Campos:
- id: Identificador único do setor (chave primária).
- nome: Nome do setor.

### Tabela `cargos`

Armazena os cargos dos funcionários, associados a um setor.

Campos:
- id: Identificador único do cargo (chave primária).
- nome: Nome do cargo.
- id_setor: Identificador do setor ao qual o cargo pertence (chave estrangeira referenciando setor.id).

### Tabela `funcionarios`

Armazena os dados dos funcionários.

Campos:
- id: Identificador único do funcionário (chave primária).
- primeiro_nome: Primeiro nome do funcionário.
- sobrenome: Sobrenome do funcionário.
- data_admissao: Data de admissão do funcionário.
- status_funcionario: Status do funcionário (ativo/inativo).
- id_setor: Identificador do setor ao qual o funcionário pertence (chave estrangeira referenciando setor.id).
- id_cargo: Identificador do cargo do funcionário (chave estrangeira referenciando cargos.id).

## Funcionalidades

### Cadastro de Funcionários

- Os funcionários podem ser cadastrados fornecendo seus nomes, sobrenomes, setores e cargos.
- Os campos de nome, sobrenome, setor e cargo são obrigatórios.

### Exclusão de Funcionários

- Funcionários podem ser excluídos do banco de dados.

### Verificação de Conexão com o Banco de Dados

- Uma rota está disponível para verificar se a conexão com o banco de dados foi estabelecida com sucesso.

## Funcionamento

- O aplicativo é inicializado utilizando o Flask.
- Um banco de dados MySQL é criado, se ainda não existir, com as tabelas necessárias.
- Os setores e cargos iniciais são adicionados ao banco de dados, se ainda não existirem.
- Os funcionários cadastrados são recuperados do banco de dados e formatados para exibição na página principal.
- Os usuários podem interagir com o aplicativo para adicionar, editar ou excluir funcionários.
- As operações no banco de dados são realizadas utilizando o conector MySQL.
- As mensagens de erro ou sucesso são exibidas utilizando o recurso de flash do Flask.

## Como Executar

Certifique-se de ter instalado o Python 3.x, Flask e mysql-connector-python.
Execute o arquivo Python (app.py).
Abra um navegador da web e acesse o endereço http://localhost:5000 para utilizar o aplicativo.