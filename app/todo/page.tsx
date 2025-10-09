"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
  createTodoServer,
  deleteTodoServer,
  toggleTodoCompleteServer,
  updateTodoServer,
} from "./serverside";

export default function TodoPage() {
  type Todo = {
    id: number;
    title: string;
    content: string;
    iscompleted: boolean;
  };

  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("id", { ascending: false });
      if (error) console.error("Fetch failed:", error.message);
      setTodos(data);
    };
    fetchTodos();
  }, [supabase]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await createTodoServer(title, content);
    setTodos((prev) => [...(prev ?? []), ...(data ?? [])]);
    setTitle("");
    setContent("");
  };

  const updateTodo = async (
    id: number,
    newTitle: string,
    newContent: string
  ) => {
    const data = await updateTodoServer(id, newTitle, newContent);
    if (data?.length) {
      setTodos((prev) => prev?.map((t) => (t.id === id ? data[0] : t)) ?? null);
    }
  };

  const deleteTodo = async (id: number) => {
    await deleteTodoServer(id);
    setTodos((prev) => prev?.filter((todo) => todo.id !== id) ?? null);
  };

  const toggleTodo = async (id: number, iscompleted: boolean) => {
    await toggleTodoCompleteServer(id, iscompleted);
    setTodos(
      (prev) =>
        prev?.map((todo) =>
          todo.id === id ? { ...todo, iscompleted: !iscompleted } : todo
        ) ?? null
    );
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">TODO List</h1>
      <form onSubmit={addTodo} className="flex flex-col gap-3 mb-8">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="p-2 border rounded"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white rounded p-2 hover:bg-green-700"
        >
          Add Todo
        </button>
      </form>
      <div className="space-y-4">
        {todos?.map((todo) => (
          <div
            key={todo.id}
            className={`border p-4 rounded flex justify-between items-start ${
              todo.iscompleted ? "bg-green-50" : ""
            }`}
          >
            <div className="flex gap-2 items-start">
              <input
                type="checkbox"
                checked={todo.iscompleted}
                onChange={() => toggleTodo(todo.id, todo.iscompleted)}
                className="mt-1 accent-green-600"
              />
              <div>
                <h2
                  className={`font-semibold ${
                    todo.iscompleted ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.title}
                </h2>
                <p className="text-gray-700">{todo.content}</p>
              </div>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
            <button
              onClick={async () => {
                const newTitle = prompt("Enter new title:", todo.title);
                const newContent = prompt("Enter new content:", todo.content);
                if (newTitle !== null && newContent !== null)
                  await updateTodo(todo.id, newTitle, newContent);
              }}
              className="text-blue-600"
            >
              Update
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
