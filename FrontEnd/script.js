// Este script gerencia as chamadas fetch para a API.

const API_URL = 'http://localhost:3000/tasks'; 


const taskTitleInput = document.getElementById('task-title');
const taskDateInput = document.getElementById('task-due-date');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksList = document.getElementById('tasks-list');
const sortBtn = document.getElementById('sort-btn');

// --- Funções de Manipulação da API (CRUD) --- //

//1. GET: Lista todas as tarefas (ordenadas pela API)
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar tarefas.');
        
        const tasks = await response.json();
        renderTasks(tasks); // Atualiza o DOM
    } catch (error) {
        console.error('Erro ao listar:', error);
        alert('Erro ao carregar a lista de tarefas. Verifique se a API Node.js está rodando na porta 3000.');
    }
}

// POST: Cria uma nova tarefa
async function createTask() {
    const title = taskTitleInput.value.trim();
    const due_date = taskDateInput.value;

    if (!title || !due_date) {
        alert('Por favor, preencha o título e a data de conclusão.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, due_date })
        });

        if (!response.ok) throw new Error('Falha ao criar tarefa.');

        // Se a criação for bem-sucedida, recarrega a lista
        taskTitleInput.value = '';
        taskDateInput.value = '';
        fetchTasks(); 
    } catch (error) {
        console.error('Erro ao criar:', error);
        alert('Erro ao adicionar a tarefa.');
    }
}


//3. PUT: Marca/desmarca uma tarefa como concluída
async function toggleDone(id, isDone) {
    try {
        // O endpoint PUT /tasks/:id/done faz o toggle no Back-end
        const response = await fetch(`${API_URL}/${id}/done`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: !isDone }) 
        });

        if (!response.ok) throw new Error('Falha ao atualizar status.');

        fetchTasks(); // Recarrega a lista para refletir a mudança
    } catch (error) {
        console.error('Erro ao concluir:', error);
        alert('Erro ao atualizar o status da tarefa.');
    }
}

// 5. PUT: Edita o título e/ou a data de conclusão de uma tarefa
async function updateTask(id, newTitle, newDueDate) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: newTitle,
                due_date: newDueDate
            })
        });

        if (!response.ok) throw new Error('Falha ao editar a tarefa.');

        fetchTasks(); 
    } catch (error) {
        console.error('Erro ao editar:', error);
        alert('Erro ao editar a tarefa. Verifique se a API está rodando.');
    }
}


//4. DELETE: Remove uma tarefa
async function deleteTask(id) {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Falha ao excluir tarefa.');

        fetchTasks(); // Recarrega a lista
    } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('Erro ao remover a tarefa.');
    }
}

 //Funções de Renderização e Eventos
function renderTasks(tasks) {
    tasksList.innerHTML = ''; // Limpa a lista atual

    if (tasks.length === 0) {
        tasksList.innerHTML = '<li class="list-group-item text-center text-muted no-tasks">Nenhuma tarefa cadastrada. 🎉</li>';
        return;
    }

    tasks.forEach(task => {
        const listItem = document.createElement('li');

        
        const date = new Date(task.due_date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric' });
     
        
        // Usa classes Bootstrap list-group-item e classes customizadas
        listItem.className = `list-group-item task-item ${task.status ? 'done' : ''} d-flex justify-content-between align-items-center`;
        
        // Adicionando data-attributes para a edição
        listItem.dataset.id = task.id;
        listItem.dataset.title = task.title;
        listItem.dataset.dueDate = task.due_date.split('T')[0]; 

        listItem.innerHTML = `
            <span class="task-title-due">
                ${task.status ? '✅' : '⏳'} ${task.title} (Prazo: ${date})
            </span>
            <div class="task-actions">
                <button class="action-btn edit-btn btn-info" data-id="${task.id}">
                    ✏️ Editar
                </button>
                <button class="action-btn done-btn" data-id="${task.id}" data-status="${task.status}">
                    ${task.status ? 'Reabrir' : 'Concluir'}
                </button>
                <button class="action-btn delete-btn" data-id="${task.id}">Excluir</button>
            </div>
        `;
        tasksList.appendChild(listItem);
    });
}

// Manipulador de eventos principal
tasksList.addEventListener('click', (e) => {
    const target = e.target;
    const id = target.dataset.id;
    const isDone = target.dataset.status === '1' || target.dataset.status === 'true'; // status é booleano (0/1 no MySQL)

    if (!id) return;

    if (target.classList.contains('done-btn')) {
        toggleDone(id, isDone);
    } else if (target.classList.contains('delete-btn')) {
        deleteTask(id);
    } else if (target.classList.contains('edit-btn')) {
        // Lógica de Edição (PUT /tasks/:id)
        const listItem = target.closest('.task-item'); // Encontra o LI pai
        const currentTitle = listItem.dataset.title;
        const currentDueDate = listItem.dataset.dueDate; // Formato YYYY-MM-DD

        // 1. Captura o novo título
        const newTitle = prompt('Editar Título:', currentTitle);
        
        if (newTitle === null || newTitle.trim() === '') {
            if (newTitle !== null) alert('O título não pode ser vazio.');
            return;
        }

        // 2. Captura a nova data 
        const newDueDate = prompt('Editar Data Prevista (AAAA-MM-DD):', currentDueDate);

        if (newDueDate === null || newDueDate.trim() === '') {
            if (newDueDate !== null) alert('A data não pode ser vazia.');
            return;
        }

        // 3. Chama a função de atualização
        updateTask(id, newTitle.trim(), newDueDate.trim());
    }
});

// Evento para adicionar tarefa
addTaskBtn.addEventListener('click', createTask);

// O requisito de ordenação é atendido pela API que sempre retorna ordenado por data.
// O botão 'Ordenar' apenas recarrega para reforçar a ordenação.
sortBtn.addEventListener('click', () => {
    fetchTasks();
    alert('Lista reordenada por data de conclusão (mais próxima primeiro).');
});

// Carrega as tarefas ao iniciar a página
document.addEventListener('DOMContentLoaded', fetchTasks);