//método de conexão com o banco de dados mysql
async function connect(){
    const mysql = require('mysql2/promise');
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'usbw',
        database: 'rh',
        port: 3308
    })
    console.log('Conectou no MySQL');
    global.connection = connection;
    return connection;
}
//garante que a conexão inicializará automaticamente
connect();

//retorna todos os cargos
async function getCargos(req, res) {
    try {
        const conn = await connect();
        const [rows] = await conn.query('SELECT * FROM cargo');
        res.status(200).json(rows);  
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao consultar o banco de dados');  
    }
}

//retorna todos os setores
async function getSetores(req, res) {
    try {
        const conn = await connect();
        const [rows] = await conn.query('SELECT * FROM setor');
        res.status(200).json(rows);  
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao consultar o banco de dados'); 
    }
}

//retorna todos os funcionarios
async function getFuncionarios(req, res) {
    try {
        const conn = await connect();
        const [rows] = await conn.query('SELECT * FROM funcionario');
        res.status(200).json(rows);  
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao consultar o banco de dados');  
    }
}

async function getSetorNome(req, res) {
    try {
        const conn = await connect();  
        const nome = req.query.nome;  

        if (!nome) {
            return res.status(400).send('Nome do setor é obrigatório');  
        }

        const [rows] = await conn.query('SELECT * FROM setor WHERE nome = ?', [nome]);  
        if (rows.length === 0) {
            return res.status(404).send('Setor não encontrado');  
        }

        res.status(200).json(rows[0]);  
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao consultar o banco de dados');  
    }
}

//Funcionário com o parâmetro nome passado por :id;
async function getFuncionarioNome(req, res) {
    try {
        const conn = await connect();  
        const nome = req.params.nome;  

        const [rows] = await conn.query('SELECT * FROM funcionario WHERE nome = ?', [nome]); 
        if (rows.length === 0) {
            return res.status(404).send('Funcionário não encontrado');  
        }

        res.status(200).json(rows[0]);  
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao consultar o banco de dados');  
    }
}

// Retorna todos os funcionários de um cargo passado como parâmetro na URL
async function getFuncionariosPorCargo(req, res) {
    try {
        const conn = await connect();  
        const cargo = req.params.cargo;  

        if (!cargo) {
            return res.status(400).send('Cargo é obrigatório');  
        }

        const [rows] = await conn.query('SELECT * FROM funcionario WHERE cod_cargo = (SELECT cod_cargo FROM cargo WHERE nome = ?)', [cargo]);
        
        if (rows.length === 0) {
            return res.status(404).send('Nenhum funcionário encontrado para o cargo especificado');  
        }

        res.status(200).json(rows);  
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao consultar o banco de dados');  
    }
}

// Retorna todos os cargos que não possuem funcionários
async function getCargosSemFuncionarios(req, res) {
    try {
        const conn = await connect();
        const [rows] = await conn.query(`
            SELECT * FROM cargo 
            WHERE cod_cargo NOT IN (SELECT cod_cargo FROM funcionario)
        `);
        res.status(200).json(rows);  
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error.message);  
        res.status(500).send('Erro ao consultar o banco de dados');  
    }
}

// Insere um novo funcionário
async function inserirFuncionario(req, res) {
    const { nome, data_admissao, cod_cargo, cod_setor } = req.body;  
    try {
        const conn = await connect();
        const result = await conn.query(
            'INSERT INTO funcionario (nome, data_admissao, cod_cargo, cod_setor) VALUES (?, ?, ?, ?)',
            [nome, data_admissao, cod_cargo, cod_setor]  
        );
        res.status(201).json({ id: result[0].insertId, message: 'Funcionário inserido com sucesso' });  
    } catch (error) {
        console.error('Erro ao inserir funcionário:', error.message);
        res.status(500).send('Erro ao inserir funcionário');  
    }
}

// Atualiza os dados de um funcionário
async function atualizarFuncionario(req, res) {
    try {
        const conn = await connect();
        const id = req.params.id;  
        const { nome, data_admissao, cod_cargo, cod_setor } = req.body;  
        const [result] = await conn.query(
            'UPDATE funcionario SET nome = ?, data_admissao = ?, cod_cargo = ?, cod_setor = ? WHERE cod_funcionario = ?',
            [nome, data_admissao, cod_cargo, cod_setor, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send('Funcionário não encontrado');  
        }

        res.status(200).send('Funcionário atualizado com sucesso');  
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar funcionário');  
    }
}

// Exclui um funcionário pelo ID
async function deleteFuncionario(req, res) {
    try {
        const conn = await connect();
        const id = req.params.id;  
        const [result] = await conn.query(
            'DELETE FROM funcionario WHERE cod_funcionario = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send('Funcionário não encontrado');  
        }

        res.status(200).send('Funcionário excluído com sucesso');  
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao excluir funcionário');  
    }
}






module.exports = {getCargos, getSetores, getFuncionarios, getSetorNome, 
    getFuncionarioNome, getFuncionariosPorCargo, getCargosSemFuncionarios, inserirFuncionario, atualizarFuncionario, deleteFuncionario};