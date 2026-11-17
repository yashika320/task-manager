let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

let currentFilter = 'all';
const count = document.getElementById('count');
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const priority = document.getElementById('priority');
const dueDate = document.getElementById('due-date');
const list = document.getElementById('task-list');

function render() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  list.innerHTML = '';

  const visible = tasks.filter(t =>
    currentFilter === 'all' ? true :
    currentFilter === 'completed' ? t.completed : !t.completed
  );

  visible.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('done');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = task.completed;
    check.addEventListener('change', () => {
      task.completed = !task.completed;
      render();
    });

    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = task.text + (task.dueDate ? ' (Due: ' + task.dueDate + ')' : '');

    const badge = document.createElement('span');
    badge.className = 'badge ' + task.priority;
    badge.textContent = task.priority;

    const editBtn = document.createElement('button');
    editBtn.className = 'small';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      const newText = prompt('Edit your Task:', task.text);
      if (newText && newText.trim()) {
        task.text = newText.trim();
        render();
      }
    });

    const delBtn = document.createElement('button');
    delBtn.className = 'small delete';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      render();
    });

    li.append(check, text, badge, editBtn, delBtn);
    list.appendChild(li);
  });

  const pending = tasks.filter(t => !t.completed).length;
  count.textContent = pending + ' pending / ' + tasks.length + ' total';
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text: text, priority: priority.value, dueDate: dueDate.value, completed: false });
  form.reset();
  render();
});

document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

render();