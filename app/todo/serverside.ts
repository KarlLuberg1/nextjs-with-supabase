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

export async function createTodoServer(title: string, content: string) {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from("todos")
    .insert([{ title, content }])
    .select("*");

  if (error) throw new Error(`Create failed: ${error.message}`);
  return data;
}

export async function updateTodoServer(
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

export async function deleteTodoServer(id: number) {
  const supabase = getServerClient();
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

export async function toggleTodoCompleteServer(id: number, current: boolean) {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("todos")
    .update({ iscompleted: !current })
    .eq("id", id)
    .select("*");

  if (error) throw new Error(`Update failed: ${error.message}`);
  return data;
}
