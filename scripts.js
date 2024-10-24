// Selecionando os elementos do DOM
const addTaskButton = document.getElementById("addTaskButton");
const taskNameInput = document.getElementById("taskName");
const taskLabelInput = document.getElementById("taskLabel");
const taskList = document.getElementById("taskList");
const completedTasksCount = document.getElementById("completedTasksCount");

// Contador de tarefas concluídas
let completedTasks = 0;

// Carregar tarefas salvas do localStorage
window.onload = () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => addTaskToList(task.name, task.label, task.date, task.completed));
    updateCompletedTaskCount();
};

// Adicionar nova tarefa ao clicar no botão "+"
addTaskButton.addEventListener("click", () => {
    const taskName = taskNameInput.value.trim();
    const taskLabel = taskLabelInput.value.trim();

    if (taskName === "" || taskLabel === "") {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Pegando apenas a data, sem o horário
    const currentDate = new Date().toLocaleDateString(); 

    const task = {
        name: taskName,
        label: taskLabel,
        date: currentDate, // Usando apenas a data
        completed: false
    };

    addTaskToList(task.name, task.label, task.date, task.completed);
    saveTask(task);
    clearInputs();
});


// Adiciona tarefa à lista
function addTaskToList(name, label, date, completed) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");

    taskItem.innerHTML = `
        <div>
            <strong class="${completed ? 'completed' : ''}">${name}</strong> <br>
            <span class="task-label">${label}</span> <span class="task-label-date">Criado em: ${date}</span>
        </div>
        <button class="${completed ? 'completed' : ''}">${completed ? '✔' : 'Concluir'}</button>
    `;

    // Evento para marcar a tarefa como concluída
    taskItem.querySelector("button").addEventListener("click", () => {
        const taskNameElement = taskItem.querySelector("strong");
        taskNameElement.classList.toggle("completed"); // Aplica o risco apenas ao nome da tarefa

        const button = taskItem.querySelector("button");
        if (taskNameElement.classList.contains("completed")) {
            button.classList.add("completed");
            button.textContent = "✔";
            completedTasks++;
        } else {
            button.classList.remove("completed");
            button.textContent = "Concluir";
            completedTasks--;
        }

        updateCompletedTaskCount();
        updateTaskInStorage(name, taskNameElement.classList.contains("completed"));
    });

    taskList.appendChild(taskItem);
}

// Atualiza o contador de tarefas concluídas
function updateCompletedTaskCount() {
    completedTasksCount.textContent = `${completedTasks} tarefa(s) concluída(s)`;
}

// Limpa os campos de entrada após adicionar uma tarefa
function clearInputs() {
    taskNameInput.value = "";
    taskLabelInput.value = "";
}

// Salva tarefa no localStorage
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Atualiza a tarefa no localStorage quando marcada como concluída
function updateTaskInStorage(name, completed) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskIndex = tasks.findIndex(task => task.name === name);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}
