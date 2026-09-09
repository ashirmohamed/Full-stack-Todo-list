import { useEffect, useState } from 'react';

const emptyTodo = { title: '', description: '', priority: 'MEDIUM', dueDate: '' };

function TodoForm({ todo, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(emptyTodo);

  useEffect(() => {
    setForm(todo ? {
      title: todo.title || '',
      description: todo.description || '',
      priority: todo.priority || 'MEDIUM',
      dueDate: todo.dueDate || '',
    } : emptyTodo);
  }, [todo]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({ ...form, completed: todo?.completed ?? false });
    if (!todo) setForm(emptyTodo);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div><p className="eyebrow">{todo ? 'Refine task' : 'Plan something'}</p><h2>{todo ? 'Edit todo' : 'Add a new todo'}</h2></div>
        {todo && <button className="icon-button" type="button" onClick={onCancel} aria-label="Close edit form">&times;</button>}
      </div>
      <label>Title <span className="required">*</span><input name="title" value={form.title} onChange={handleChange} placeholder="What needs doing?" required maxLength="120" autoFocus /></label>
      <label>Description<textarea name="description" value={form.description} onChange={handleChange} placeholder="Add a little context..." rows="3" maxLength="500" /></label>
      <div className="form-row">
        <label>Priority<select name="priority" value={form.priority} onChange={handleChange}><option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option></select></label>
        <label>Due date<input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} /></label>
      </div>
      <div className="form-actions">
        {todo && <button className="button button-quiet" type="button" onClick={onCancel}>Cancel</button>}
        <button className="button button-accent" type="submit" disabled={submitting}>{submitting ? 'Saving...' : todo ? 'Save changes' : 'Add todo'}</button>
      </div>
    </form>
  );
}

export default TodoForm;
