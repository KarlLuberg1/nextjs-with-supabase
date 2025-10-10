"use server";

import { createServerClient } from "@supabase/ssr";

function getServerClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}

export async function createNoteServer(title: string, content: string) {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from("notes")
    .insert([{ title, content }])
    .select("*");

  if (error) {
    console.error("Create failed:", error.message);
    throw new Error(`Create failed: ${error.message}`);
  }

  return data;
}

export async function updateNoteServer(
  id: number,
  title: string,
  content: string
) {
  const supabase = getServerClient();
  const { data } = await supabase
    .from("todos")
    .update({ title, content })
    .eq("id", id)
    .select("*");
  return data;
}

export async function deleteNoteServer(id: number) {
  const supabase = getServerClient();

  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    console.error("Delete failed:", error.message);
    throw new Error(`Delete failed: ${error.message}`);
  }
}
