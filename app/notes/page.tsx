"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
  createNoteServer,
  deleteNoteServer,
  updateNoteServer,
} from "./serverside";

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function Page() {
  const [notes, setNotes] = useState<Note[] | null>(null);

  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from("notes").select();
      setNotes(data);
    };
    getData();
  }, [supabase]);

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await createNoteServer(title, content);
    setNotes((prev) => [...(prev ?? []), ...(data ?? [])]);
    setTitle("");
    setContent("");
    // if (error) console.error(error);
    // else if (data) setNotes((prev) => [...(prev ?? []), ...data]);
    // setTitle("");
    setContent("");
  };

  const updateNote = async (
    id: number,
    newTitle: string,
    newContent: string
  ) => {
    const data = await updateNoteServer(id, newTitle, newContent);
    if (data?.length) {
      setNotes((prev) => prev?.map((t) => (t.id === id ? data[0] : t)) ?? null);
    }
  };

  const deleteNote = async (id: number) => {
    await deleteNoteServer(id);
    setNotes((prev) => prev?.filter((note) => note.id !== id) ?? null);
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notes</h1>
      <form onSubmit={addNote} className="flex flex-col gap-3 mb-8">
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
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        >
          Add Note
        </button>
      </form>
      <div className="space-y-4">
        {notes?.map((note) => (
          <div
            key={note.id}
            className="border p-4 rounded flex justify-between items-start"
          >
            <div>
              <h2 className="font-semibold">{note.title}</h2>
              <p className="text-gray-700">{note.content}</p>
            </div>
            <button
              onClick={() => deleteNote(note.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
            <button
              onClick={async () => {
                const newTitle = prompt("Enter new title:", note.title);
                const newContent = prompt("Enter new content:", note.content);
                if (newTitle !== null && newContent !== null)
                  await updateNote(note.id, newTitle, newContent);
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
