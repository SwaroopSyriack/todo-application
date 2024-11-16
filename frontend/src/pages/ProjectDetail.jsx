import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "../styles/ProjectDetail.css";

function ProjectDetail() {
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    getProjectDetails();
    getTodos();
  }, []);

  const getProjectDetails = () => {
    api
      .get(`/api/projects/${id}/`)
      .then((res) => setProject(res.data))
      .catch((err) => alert(err));
  };

  const getTodos = () => {
    api
      .get("/api/todo/", { params: { project: id } })
      .then((res) => setTodos(res.data))
      .catch((err) => alert(err));
  };

  const createTodo = (e) => {
    e.preventDefault();
    api
      .post("/api/todo/", { project: id, ...newTodo })
      .then((res) => {
        if (res.status === 201) {
          alert("Todo created!");
          setNewTodo({ title: "", description: "" });
          getTodos();
        } else {
          alert("Failed to create todo.");
        }
      })
      .catch((err) => alert(err));
  };

  const deleteTodo = (todoId) => {
    api
      .delete(`/api/todo/${todoId}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Todo deleted!");
          getTodos();
        } else {
          alert("Failed to delete todo.");
        }
      })
      .catch((err) => alert(err));
  };

  const toggleTodoCompletion = (todo) => {
    api
      .patch(`/api/todo/${todo.id}/`, { is_completed: !todo.is_completed })
      .then(() => getTodos())
      .catch((err) => alert(err));
  };

  const startEditingTodo = (todo) => {
    setEditingTodo(todo);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
  };

  const saveEditedTodo = (e) => {
    e.preventDefault();
    api
      .patch(`/api/todo/${editingTodo.id}/`, {
        title: editingTodo.title,
        description: editingTodo.description,
      })
      .then(() => {
        alert("Todo updated!");
        setEditingTodo(null);
        getTodos();
      })
      .catch((err) => alert(err));
  };

  if (!project) return <div>Loading...</div>;

  const completedTodos = todos.filter((todo) => todo.is_completed);
  const pendingTodos = todos.filter((todo) => !todo.is_completed);

  return (
    <div className="project-detail-container">
      <h1>{project.title}</h1>

      <h2>Todos</h2>

      <h3>Pending</h3>
      <ul className="todo-list">
        {pendingTodos.map((todo) => (
          <li key={todo.id} className="todo-item">
            {editingTodo?.id === todo.id ? (
              <form onSubmit={saveEditedTodo} className="edit-form">
                <input
                  type="text"
                  value={editingTodo.title}
                  onChange={(e) =>
                    setEditingTodo({ ...editingTodo, title: e.target.value })
                  }
                  required
                />
                <textarea
                  value={editingTodo.description}
                  onChange={(e) =>
                    setEditingTodo({
                      ...editingTodo,
                      description: e.target.value,
                    })
                  }
                />
                <button type="submit">Save</button>
                <button onClick={cancelEditing} type="button">
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <input
                  type="checkbox"
                  checked={todo.is_completed}
                  onChange={() => toggleTodoCompletion(todo)}
                />
                <strong>{todo.title}</strong>
                <p>{todo.description}</p>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                <button onClick={() => startEditingTodo(todo)}>Edit</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <h3>Completed</h3>
      <ul className="todo-list">
        {completedTodos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <div>
              <input
                type="checkbox"
                checked={todo.is_completed}
                onChange={() => toggleTodoCompletion(todo)}
              />
              <strong>{todo.title}</strong>
              <p>{todo.description}</p>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <h2>Add a Todo</h2>
      <form onSubmit={createTodo} className="todo-form">
        <label htmlFor="todo-title">Title:</label>
        <input
          type="text"
          id="todo-title"
          name="title"
          required
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          value={newTodo.title}
        />
        <label htmlFor="todo-description">Description:</label>
        <textarea
          id="todo-description"
          name="description"
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
          value={newTodo.description}
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}

export default ProjectDetail;
