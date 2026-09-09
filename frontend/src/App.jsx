import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterBar from './components/FilterBar';
import LoginPage from './components/LoginPage';
import { createTodo, deleteTodo, getTodos, toggleComplete, updateTodo } from './services/todoService';

function getErrorMessage(error) {
  if (!error.response) return 'The backend is unavailable. Make sure Spring Boot is running on port 8080.';
  return error.response.data?.error || 'Something went wrong. Please try again.';
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('todoUser'));
    } catch {
      return null;
    }
  });
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [search, setSearch] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const handleLogin = (loggedInUser) => {
    sessionStorage.setItem('todoUser', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('todoUser');
    setUser(null);
    setTodos([]);
  };

  useEffect(() => {
    if (!user) return;
    const loadTodos = async () => {
      try {
        setLoading(true);
        setError('');
        setTodos(await getTodos());
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };
    loadTodos();
  }, [user]);

  if (!user) return <LoginPage onLogin={handleLogin} />;

  const filteredTodos = useMemo(() => {
    const query = search.trim().toLowerCase();
    return todos.filter((todo) => {
      const matchesStatus = status === 'all' || (status === 'completed' ? todo.completed : !todo.completed);
      const matchesPriority = priority === 'all' || todo.priority === priority;
      const matchesSearch = !query || todo.title.toLowerCase().includes(query) || (todo.description || '').toLowerCase().includes(query);
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [todos, status, priority, search]);

  const stats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter((todo) => todo.completed).length,
    pending: todos.filter((todo) => !todo.completed).length,
  }), [todos]);

  const handleSubmit = async (todoData) => {
    try {
      setSubmitting(true);
      setError('');
      if (editingTodo) {
        const updatedTodo = await updateTodo(editingTodo.id, todoData);
        setTodos((current) => current.map((todo) => todo.id === updatedTodo.id ? updatedTodo : todo));
        setEditingTodo(null);
        setFormOpen(false);
      } else {
        const newTodo = await createTodo(todoData);
        setTodos((current) => [newTodo, ...current]);
        setFormOpen(false);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    const previousTodos = todos;
    setError('');
    setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    try {
      setBusyId(id);
      const updatedTodo = await toggleComplete(id);
      setTodos((current) => current.map((todo) => todo.id === id ? updatedTodo : todo));
    } catch (requestError) {
      setTodos(previousTodos);
      setError(getErrorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    const todo = todos.find((item) => item.id === id);
    if (!todo || !window.confirm(`Delete "${todo.title}"?`)) return;
    const previousTodos = todos;
    setError('');
    setTodos((current) => current.filter((item) => item.id !== id));
    try {
      setBusyId(id);
      await deleteTodo(id);
    } catch (requestError) {
      setTodos(previousTodos);
      setError(getErrorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  };

  const openNewTodo = () => {
    setEditingTodo(null);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEditTodo = (todo) => {
    setEditingTodo(todo);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      <Navbar onNewTodo={openNewTodo} onLogout={handleLogout} user={user} />
      <main className="page-content">
        <section className="hero"><div><p className="eyebrow">Your daily workspace</p><h1>Make space for<br /><em>what matters.</em></h1><p className="hero-copy">A clear view of the things you want to get done.</p></div><div className="hero-mark" aria-hidden="true">01<span>/</span>04</div></section>
        {error && <div className="alert" role="alert"><span>!</span>{error}<button type="button" onClick={() => setError('')} aria-label="Dismiss error">&times;</button></div>}
        <section className="dashboard-grid">
          <aside className="sidebar">
            {formOpen ? <TodoForm todo={editingTodo} onSubmit={handleSubmit} onCancel={() => { setEditingTodo(null); setFormOpen(false); }} submitting={submitting} /> : <button className="new-todo-prompt" type="button" onClick={openNewTodo}><span className="prompt-plus">+</span><span><strong>Add a todo</strong><small>Clear your next step</small></span><span className="prompt-arrow">&#8594;</span></button>}
            <div className="stats-panel"><p className="eyebrow">At a glance</p><div className="stat-line"><span>All todos</span><strong>{stats.total}</strong></div><div className="stat-line"><span>Completed</span><strong className="stat-green">{stats.completed}</strong></div><div className="stat-line"><span>Pending</span><strong>{stats.pending}</strong></div></div>
          </aside>
          <section className="todo-section">
            <div className="section-heading"><div><p className="eyebrow">The list</p><h2>All your todos</h2></div><span className="result-count">{filteredTodos.length} {filteredTodos.length === 1 ? 'task' : 'tasks'}</span></div>
            <FilterBar status={status} onStatusChange={setStatus} priority={priority} onPriorityChange={setPriority} search={search} onSearchChange={setSearch} />
            {loading ? <div className="loading-state"><span className="spinner" />Loading your todos...</div> : <TodoList todos={filteredTodos} onToggle={handleToggle} onEdit={openEditTodo} onDelete={handleDelete} busyId={busyId} />}
          </section>
        </section>
      </main>
      <footer>Todo Manager <span>/</span> Stay intentional.</footer>
    </div>
  );
}

export default App;
