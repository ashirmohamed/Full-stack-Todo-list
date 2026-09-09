function FilterBar({ status, onStatusChange, priority, onPriorityChange, search, onSearchChange }) {
  return (
    <div className="filter-bar">
      <div className="search-wrap"><span aria-hidden="true">&#8981;</span><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search todos..." aria-label="Search todos" /></div>
      <div className="filter-group" aria-label="Todo status filter">{['all', 'pending', 'completed'].map((option) => <button key={option} className={status === option ? 'filter-active' : ''} type="button" onClick={() => onStatusChange(option)}>{option[0].toUpperCase() + option.slice(1)}</button>)}</div>
      <select className="priority-filter" value={priority} onChange={(event) => onPriorityChange(event.target.value)} aria-label="Filter by priority"><option value="all">All priorities</option><option value="LOW">Low priority</option><option value="MEDIUM">Medium priority</option><option value="HIGH">High priority</option></select>
    </div>
  );
}

export default FilterBar;
