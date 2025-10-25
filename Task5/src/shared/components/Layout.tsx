import { Link } from "react-router-dom";

export function Layout() {
    return (
      <div className="layout">
        <h1>Task Tracker</h1>
        <nav>
          <Link to="/">
            <button type="button" className={location.pathname === '/' ? 'active' : ''}>Task List</button>
          </Link>
          <Link to="/create-task">
            <button type="button" className={location.pathname === '/create-task' ? 'active' : ''}>Create Task</button>
          </Link>
        </nav>
      </div>
    )
  }