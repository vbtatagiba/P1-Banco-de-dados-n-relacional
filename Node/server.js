const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const path = require('path');

const app = express();
const PORT = 3000;
const MONGODB_URI = 'mongodb+srv://vbtatagiba77:mu104510@cluster.examcas.mongodb.net/';

app.use(bodyParser.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar rotas de usuário
app.use('/users', userRoutes);

// Configurar middleware para lidar com erros de rota
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor está rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });
