const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.text());
app.use(bodyParser.json());

//conexão com o banco de dados
const rhac1 = require('./BancoDeDados/AC1');

//configurar o CORS
const cors = require('cors');
app.use(cors());

//retornando todos os cargos
app.get('/cargos', rhac1.getCargos);

//retornando todos os setores
app.get('/setores', rhac1.getSetores);

//retornando todos os funcionários
app.get('/funcionarios', rhac1.getFuncionarios);

// retornar o setor com o nome passado por query string
app.get('/setor', rhac1.getSetorNome);  

// retornar funcionário pelo nome
app.get('/funcionario/nome/:nome', rhac1.getFuncionarioNome);  

// retornar todos os funcionários do cargo passado como parâmetro na URL
app.get('/funcionarios/cargo/:cargo', rhac1.getFuncionariosPorCargo);  

// retornar todos os cargos que não possuem funcionários
app.get('/cargos/sem-funcionarios', rhac1.getCargosSemFuncionarios);

// inserir um novo funcionário
app.post('/funcionarios', rhac1.inserirFuncionario);

// atualizar um funcionário
app.put('/funcionarios/:id', rhac1.atualizarFuncionario);

// excluir um funcionário
app.delete('/funcionarios/:id', rhac1.deleteFuncionario);


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});