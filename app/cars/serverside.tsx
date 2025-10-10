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

export async function createCarServer(make: string, model: string) {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from("cars")
    .insert([{ make, model }])
    .select("*");

  if (error) {
    console.error("Create failed:", error.message);
    throw new Error(`Create failed: ${error.message}`);
  }

  return data;
}

export async function updateCarServer(id: number, make: string, model: string) {
  const supabase = getServerClient();
  const { data } = await supabase
    .from("cars")
    .update({ make, model })
    .eq("id", id)
    .select("*");
  return data;
}

export async function deleteCarServer(id: number) {
  const supabase = getServerClient();

  const { error } = await supabase.from("cars").delete().eq("id", id);

  if (error) {
    console.error("Delete failed:", error.message);
    throw new Error(`Delete failed: ${error.message}`);
  }
}
