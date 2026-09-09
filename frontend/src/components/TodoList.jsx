import TodoItem from './TodoItem';

function TodoList({ todos, onToggle, onEdit, onDelete, busyId }) {
  if (!todos.length) return <div className="empty-state"><div className="empty-icon">&#10003;</div><h3>No todos here yet</h3><p>Try changing your filters or add a new task to get moving.</p></div>;
  return <div className="todo-list">{todos.map((todo) => <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} busy={busyId === todo.id} />)}</div>;
}

export default TodoList;
