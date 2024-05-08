// Função para fechar o alerta de sucesso
function closeAlert() {
    var alert = document.getElementById("cadastrado");
    alert.style.display = "none";
}

// Adiciona um listener para o botão de cadastrar
document.getElementById("cadastrarBtn").addEventListener("click", function() {
    document.getElementById("cadastroForm").submit();
});

// Função para exibir a confirmação de exclusão de funcionário
function exibirConfirmacao(id) {
    var confirmacao = document.getElementById("confirmacao-exclusao");
    confirmacao.style.display = "block";

    var btnSim = confirmacao.querySelector("button:first-of-type");
    btnSim.onclick = function() {
        excluirFuncionario(id);
    };

    var btnCancelar = confirmacao.querySelector("button:last-of-type");
    btnCancelar.onclick = function() {
        confirmacao.style.display = "none";
    };
}

// Função para excluir um funcionário
function excluirFuncionario(id) {
    fetch(`/deletar/${id}`, {
        method: 'POST'
    })
    .then(response => {
        if (response.ok) {
            window.location.reload();
        } else {
            throw new Error('Erro ao excluir funcionário');
        }
    })
    .catch(error => {
        alert(error.message);
    });
}

function atualizarFuncionario(id) {
    var primeiroNome = document.getElementById("primeiro_nome").value;
    var sobrenome = document.getElementById("sobrenome").value;
    var idSetor = document.getElementById("id_setor").value;
    var idCargo = document.getElementById("id_cargo").value;

    fetch(`/editar/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            primeiro_nome: primeiroNome,
            sobrenome: sobrenome,
            id_setor: idSetor,
            id_cargo: idCargo
        })
    })
    .then(response => {
        if (response.ok) {
            window.location.reload();
        } else {
            throw new Error('Erro ao atualizar funcionário');
        }
    })
    .catch(error => {
        alert(error.message);
    });
}
