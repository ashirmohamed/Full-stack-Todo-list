function Navbar({ onNewTodo, onLogout, user }) {
  return (
    <header className="topbar">
      <a className="brand" href="/" aria-label="Todo Manager home">
        <span className="brand-mark">T</span>
        <span>Todo Manager</span>
      </a>
      <div className="nav-actions">
        <span className="nav-user">Hi, {user?.name}</span>
        <button className="button button-quiet button-small" type="button" onClick={onLogout}>Sign out</button>
        <button className="button button-dark button-small" type="button" onClick={onNewTodo}><span aria-hidden="true">+</span> New task</button>
      </div>
    </header>
  );
}

export default Navbar;
