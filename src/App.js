import React, { useEffect, useState } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const App = () => {
  const initialState = { name: "", description: "" };

  const [todos, setTodos] = useState([]);
  const [formState, setFormState] = useState(initialState);

  useEffect(() => {
    fetchTodos();
    return () => {};
  }, [todos]);

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log("error fetching toods");
    }
  }

  const setInput = (key, value) => {
    setFormState({ ...formState, [key]: value });
  };

  const addTodo = async () => {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      // setTodos([todo, ...todos]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
    } catch (err) {
      console.log("error creating todo:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Amplify Todos</h2>
      <input
        placeholder="Name"
        style={styles.input}
        value={formState.name}
        onChange={(e) => setInput("name", e.target.value)}
      />
      <input
        placeholder="Description"
        style={styles.input}
        value={formState.description}
        onChange={(e) => setInput("description", e.target.value)}
      />
      <button style={styles.button} onClick={addTodo}>
        Create Todo
      </button>
      {todos.map((todo, index) => (
        <div key={todo.id ? todo.id : index} style={styles.todo}>
          <p style={styles.todoName}>{todo.name}</p>
          <p style={styles.todoDescription}>{todo.description}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },

  todo: { marginBottom: 15 },

  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },

  todoName: { fontSize: 20, fontWeight: "bold" },

  todoDescription: { marginBottom: 0 },

  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
};

export default App;
