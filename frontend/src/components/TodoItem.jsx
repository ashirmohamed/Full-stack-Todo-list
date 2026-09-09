function TodoItem({ todo, onToggle, onEdit, onDelete, busy }) {
  const dueDate = todo.dueDate
    ? new Date(`${todo.dueDate}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : null;

  return (
    <article className={`todo-item ${todo.completed ? 'is-complete' : ''}`}>
      <button className="check-button" type="button" onClick={() => onToggle(todo.id)} disabled={busy} aria-label={todo.completed ? 'Mark as pending' : 'Mark as completed'}>{todo.completed ? '✓' : ''}</button>
      <div className="todo-content">
        <div className="todo-title-row"><h3>{todo.title}</h3><span className={`priority priority-${(todo.priority || 'MEDIUM').toLowerCase()}`}>{todo.priority || 'MEDIUM'}</span></div>
        {todo.description && <p>{todo.description}</p>}
        <div className="todo-meta"><span>{todo.completed ? 'Completed' : 'In progress'}</span>{dueDate && <span className="due-date">Due {dueDate}</span>}</div>
      </div>
      <div className="todo-actions">
        <button className="icon-button" type="button" onClick={() => onEdit(todo)} aria-label={`Edit ${todo.title}`} title="Edit">&#9998;</button>
        <button className="icon-button danger" type="button" onClick={() => onDelete(todo.id)} aria-label={`Delete ${todo.title}`} title="Delete">&#128465;</button>
      </div>
    </article>
  );
}

export default TodoItem;
