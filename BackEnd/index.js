const express = require('express')
const cors = require('cors');
const { query } = require('./db'); // Importa a função de query feita no db.js
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Permite que o front-end (em outra porta/domínio) acesse a API
app.use(cors());
// Permite que a API entenda requisições com corpo JSON
app.use(express.json());

// Rota GET (Listar tarefas e Ordenar)
app.get('/tasks', async (req, res) => {
    try {
        // Por padrão, ordena por due_date (mais próxima primeiro)
        const sql = 'SELECT * FROM tasks ORDER BY due_date ASC, status ASC';
        const tasks = await query(sql);
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar tarefas.' });
    }
});

// Rota POST (Criar tarefa)
app.post('/tasks', async (req, res) => {
    const { title, due_date } = req.body; // Campos requeridos
    
    // Validação básica
    if (!title || !due_date) {
        return res.status(400).json({ message: 'Título e data de conclusão são obrigatórios.' });
    }

    try {
        const sql = 'INSERT INTO tasks (title, due_date) VALUES (?, ?)';
        const result = await query(sql, [title, due_date]);

        // Retorna o ID da nova tarefa
        res.status(201).json({ id: result.insertId, title, due_date, status: false, creation_date: new Date() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar tarefa.' });
    }
});

// Rota PUT (Marcar como concluída)
app.put('/tasks/:id/done', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Opcionalmente, permite enviar true/false para setar o status

    try {
        // Usa o valor do body, ou inverte o status atual se não for enviado (toggle)
        let sql;
        let params;
        
        // Se o status for enviado no body, usa esse valor (PUT/tasks/1/done {status: true})
        if (typeof status === 'boolean') {
             sql = 'UPDATE tasks SET status = ? WHERE id = ?';
             params = [status, id];
        } else {
            // Caso contrário, faz o toggle (Marca como concluída/Não concluída)
             sql = 'UPDATE tasks SET status = NOT status WHERE id = ?';
             params = [id];
        }

        const result = await query(sql, params);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada.' });
        }

        res.status(200).json({ message: 'Status da tarefa atualizado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar status da tarefa.' });
    }
});

// Rota DELETE (Remover tarefa)
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'DELETE FROM tasks WHERE id = ?';
        const result = await query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada.' });
        }

        res.status(200).json({ message: 'Tarefa removida com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao remover tarefa.' });
    }
});

// Rota PUT /tasks/:id (Editar tarefa)
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, due_date } = req.body; 

    // Validação básica: deve ter ao menos um campo para atualizar
    if (!title && !due_date) {
        return res.status(400).json({ message: 'Pelo menos um campo (title ou due_date) deve ser fornecido para atualização.' });
    }

    try {
        const fields = [];
        const params = [];

        if (title) {
            fields.push('title = ?');
            params.push(title);
        }
        if (due_date) {
            fields.push('due_date = ?');
            params.push(due_date);
        }

        const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
        params.push(id);

        const result = await query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada.' });
        }

        res.status(200).json({ message: 'Tarefa editada com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao editar tarefa.' });
    }
});


// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});