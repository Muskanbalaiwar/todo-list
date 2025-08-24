import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { createTodo, deleteTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";

const client = generateClient();

function App() {
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const todoData = await client.graphql({ query: listTodos });
      setTodos(todoData.data.listTodos.items);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  }

  async function addTodo() {
    if (!name) return;
    try {
      const todo = { name, description };
      const result = await client.graphql({
        query: createTodo,
        variables: { input: todo },
      });
      setTodos([...todos, result.data.createTodo]);
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Error creating todo:", err);
    }
  }

  async function removeTodo(id) {
    try {
      await client.graphql({
        query: deleteTodo,
        variables: { input: { id } },
      });
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  }

  return (
    <div className="container">
      <h1 className="title">My Todo App ✅</h1>

      <div className="form">
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter todo name"
        />
        <input
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
        <button className="btn" onClick={addTodo}>
          ➕ Add Todo
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li className="todo-item" key={todo.id}>
            <div>
              <strong>{todo.name}</strong>
              <p>{todo.description}</p>
            </div>
            <button className="btn-delete" onClick={() => removeTodo(todo.id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
