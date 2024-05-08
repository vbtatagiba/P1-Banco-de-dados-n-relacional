from flask import Flask, render_template, request, redirect, url_for, flash
from datetime import datetime
import mysql.connector

app = Flask(__name__)
app.secret_key = 'secret_key_1234567890'

# Função para conectar ao banco de dados MySQL
def conectar_bd():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='12345678',
        database='funcionario'
    )

# Função para criar o banco de dados e suas tabelas se elas não existirem
def criar_banco_de_dados():
    conn = conectar_bd()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS setor (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cargos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            id_setor INT,
            FOREIGN KEY (id_setor) REFERENCES setor(id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS funcionarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            primeiro_nome VARCHAR(255) NOT NULL,
            sobrenome VARCHAR(255) NOT NULL,
            data_admissao DATE NOT NULL,
            status_funcionario BOOLEAN NOT NULL DEFAULT true,
            id_setor INT,
            id_cargo INT,
            FOREIGN KEY (id_setor) REFERENCES setor(id),
            FOREIGN KEY (id_cargo) REFERENCES cargos(id)
        )
    ''')

    conn.commit()
    conn.close()

# Função para adicionar um novo setor ao banco de dados
def adicionar_setor(conn, cursor, nome_setor):
    cursor.execute("SELECT id FROM setor WHERE nome=%s", (nome_setor,))
    setor = cursor.fetchone()
    if setor is None:
        cursor.execute("INSERT INTO setor (nome) VALUES (%s)", (nome_setor,))
        conn.commit()
        return cursor.lastrowid
    else:
        return setor[0]

# Função para adicionar um novo cargo ao banco de dados
def adicionar_cargo(conn, cursor, nome_cargo, id_setor):
    cursor.execute("SELECT id FROM cargos WHERE nome=%s AND id_setor=%s", (nome_cargo, id_setor))
    cargo = cursor.fetchone()
    if cargo is None:
        cursor.execute("INSERT INTO cargos (nome, id_setor) VALUES (%s, %s)", (nome_cargo, id_setor))
        conn.commit()

# Filtro personalizado para converter string em data no formato desejado
@app.template_filter('string_to_date')
def string_to_date(value, format='%d/%m/%Y'):
    return datetime.strptime(value, format).strftime("%d/%m/%Y") if value else None

# Rota principal para a página de cadastro de funcionários
@app.route('/')
def cadastro_funcionarios():
    criar_banco_de_dados()

    conn = conectar_bd()
    cursor = conn.cursor()

    # Adicionando setores e cargos iniciais (se ainda não existirem)
    setores = ['TI', 'Recursos Humanos', 'Vendas']
    for setor in setores:
        adicionar_setor(conn, cursor, setor)

    cargos = [
        {'nome': 'Garoto de Programa', 'setor': 'Tudo Incluso'},
        {'nome': 'Quem faz o PIX', 'setor': 'Recursos Humanos'},
        {'nome': 'Vendedor', 'setor': 'Vendas'}
    ]
    for cargo in cargos:
        setor_id = adicionar_setor(conn, cursor, cargo['setor'])
        adicionar_cargo(conn, cursor, cargo['nome'], setor_id)

    # Consulta para obter os setores, cargos e funcionários cadastrados
    cursor.execute("SELECT id, nome FROM setor")
    setores = cursor.fetchall()

    cursor.execute("SELECT id, nome FROM cargos")
    cargos = cursor.fetchall()

    cursor.execute("""
        SELECT funcionarios.id, primeiro_nome, sobrenome, data_admissao, status_funcionario, setor.nome, cargos.nome
        FROM funcionarios
        JOIN setor ON funcionarios.id_setor = setor.id
        JOIN cargos ON funcionarios.id_cargo = cargos.id
    """)
    funcionarios = cursor.fetchall()

    # Formatando os dados dos funcionários para exibição na página
    funcionarios_formatados = []
    for funcionario in funcionarios:
        funcionarios_formatados.append(
            (funcionario[0], funcionario[1], funcionario[2], funcionario[3].strftime("%d/%m/%Y"), 'Ativo' if funcionario[4] else 'Inativo', funcionario[5], funcionario[6])
        )

    conn.close()

    return render_template('index.html', setores=setores, cargos=cargos, funcionarios=funcionarios_formatados)

# Rota para adicionar um novo funcionário
@app.route('/index', methods=['POST'])
def adicionar_funcionario():
    try:
        # Obtendo os dados do formulário
        primeiro_nome = request.form.get('primeiro_nome')
        sobrenome = request.form.get('sobrenome')
        id_setor = request.form.get('id_setor')
        id_cargo = request.form.get('id_cargo')

        # Validando os dados do formulário
        if not primeiro_nome or not sobrenome or not id_setor or not id_cargo:
            raise ValueError('Todos os campos são obrigatórios.')

        # Conectando ao banco de dados
        conn = conectar_bd()
        cursor = conn.cursor()

        # Obtendo a data atual para a data de admissão do funcionário
        data_atual = datetime.now()
        data_admissao = data_atual.strftime('%Y-%m-%d')

        # Inserindo o novo funcionário no banco de dados
        cursor.execute("INSERT INTO funcionarios (primeiro_nome, sobrenome, data_admissao, status_funcionario, id_setor, id_cargo) VALUES (%s, %s, %s, %s, %s, %s)",
                       (primeiro_nome, sobrenome, data_admissao, True, id_setor, id_cargo))

        conn.commit()
        conn.close()

        # Redirecionando de volta para a página principal com uma mensagem flash
        flash('Funcionário cadastrado com sucesso!')
    except Exception as e:
        flash(f'Erro ao cadastrar funcionário: {str(e)}')

    return redirect(url_for('cadastro_funcionarios'))

# Rota para deletar um funcionário
@app.route('/deletar/<int:funcionario_id>', methods=['POST'])
def deletar_funcionario(funcionario_id):
    try:
        conn = conectar_bd()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM funcionarios WHERE id=%s", (funcionario_id,))
        conn.commit()
        conn.close()

        flash('Funcionário deletado com sucesso!')
    except Exception as e:
        flash(f'Erro ao deletar funcionário: {str(e)}')

    return redirect(url_for('cadastro_funcionarios'))

# Rota para editar um funcionário 
@app.route('/editar/<int:funcionario_id>', methods=['GET', 'POST'])
def editar_funcionario(funcionario_id):
    try:
        if request.method == 'GET':
            conn = conectar_bd()
            cursor = conn.cursor()

            cursor.execute("SELECT primeiro_nome, sobrenome, id_setor, id_cargo FROM funcionarios WHERE id=%s", (funcionario_id,))
            funcionario = cursor.fetchone()

            cursor.execute("SELECT id, nome FROM setor")
            setores = cursor.fetchall()

            cursor.execute("SELECT id, nome FROM cargos")
            cargos = cursor.fetchall()

            conn.close()

            return render_template('formulario_edicao.html', funcionario=funcionario, setores=setores, cargos=cargos)
        elif request.method == 'POST':
            conn = conectar_bd()
            cursor = conn.cursor()

            # Obter os dados do formulário
            novo_nome = request.form.get('primeiro_nome')
            novo_sobrenome = request.form.get('sobrenome')
            novo_id_setor = request.form.get('id_setor')
            novo_id_cargo = request.form.get('id_cargo')

            # Validando os dados do formulário
            if not novo_nome or not novo_sobrenome or not novo_id_setor or not novo_id_cargo:
                raise ValueError('Todos os campos são obrigatórios.')

            cursor.execute("UPDATE funcionarios SET primeiro_nome=%s, sobrenome=%s, id_setor=%s, id_cargo=%s WHERE id=%s",
                           (novo_nome, novo_sobrenome, novo_id_setor, novo_id_cargo, funcionario_id))
            conn.commit()
            conn.close()

            flash('Funcionário atualizado com sucesso!')
    except Exception as e:
        flash(f'Erro ao atualizar funcionário: {str(e)}')

    return redirect(url_for('cadastro_funcionarios'))

# Rota para verificar se a conexão com o banco de dados foi estabelecida
@app.route('/verificar-conexao')
def verificar_conexao():
    try:
        conn = conectar_bd()
        conn.close()
        return 'Conexão com o banco de dados estabelecida com sucesso!'
    except Exception as e:
        return f'Erro ao conectar-se ao banco de dados: {str(e)}'

if __name__ == '__main__':
    app.run(debug=True)
