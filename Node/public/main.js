// JavaScript code to handle CRUD operations
const addUserForm = document.getElementById('addUserForm');
const usersBody = document.getElementById('usersBody');
const successModal = document.getElementById('successModal');
const errorModal = document.getElementById('errorModal');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const closeModalButtons = document.querySelectorAll('.close');

// Function to render user data in the table
function renderUsers(users) {
    usersBody.innerHTML = '';
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="editUser('${user._id}', '${user.name}', '${user.email}')">Editar</button>
                <button onclick="deleteUser('${user._id}')">Excluir</button>
            </td>
        `;
        usersBody.appendChild(tr);
    });
}


// Function to fetch users from the server
async function getUsers() {
    try {
        const response = await fetch('/users');
        const users = await response.json();
        renderUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Function to display success message modal
function showSuccessModal(message) {
    successMessage.innerText = message;
    successModal.style.display = 'block';
}

// Function to display error message modal
function showErrorModal(message) {
    errorMessage.innerText = message;
    errorModal.style.display = 'block';
}

// Event listener for close buttons on modals
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        successModal.style.display = 'none';
        errorModal.style.display = 'none';
    });
});

// Function to handle adding a new user
async function addUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        if (response.ok) {
            const newUser = await response.json();
            getUsers(); // Refresh the user list
            showSuccessModal('Usuário adicionado com sucesso!');
        } else {
            showErrorModal('Erro ao adicionar usuário.');
        }
    } catch (error) {
        console.error('Error adding user:', error);
        showErrorModal('Erro ao adicionar usuário.');
    }
}
// Função para editar usuário
async function editUser(id, name, email) {
  const newName = prompt('Digite o novo nome:', name);
  const newEmail = prompt('Digite o novo e-mail:', email);
  const newPassword = prompt('Digite a nova senha (deixe em branco para manter a mesma senha):');
  
  if (newName !== null && newEmail !== null) {
      try {
          const userData = { name: newName, email: newEmail };
          if (newPassword !== null && newPassword.trim() !== '') {
              userData.password = newPassword;
          }
          
          const response = await fetch(`/users/${id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(userData)
          });
          if (response.ok) {
              getUsers();
              showSuccessModal('Usuário atualizado com sucesso!');
          } else {
              showErrorModal('Erro ao atualizar usuário.');
          }
      } catch (error) {
          console.error('Error updating user:', error);
          showErrorModal('Erro ao atualizar usuário.');
      }
  }
}


// Função para excluir usuário
async function deleteUser(id) {
  if (confirm('Tem certeza de que deseja excluir este usuário?')) {
      try {
          const response = await fetch(`/users/${id}`, {
              method: 'DELETE'
          });
          if (response.ok) {
              getUsers();
              showSuccessModal('Usuário excluído com sucesso!');
          } else {
              showErrorModal('Erro ao excluir usuário.');
          }
      } catch (error) {
          console.error('Error deleting user:', error);
          showErrorModal('Erro ao excluir usuário.');
      }
  }
}


// Fetch users when the page loads
getUsers();
