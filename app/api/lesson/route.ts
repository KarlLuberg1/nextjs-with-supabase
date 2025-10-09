import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createAdminClient();
  return NextResponse.json({ message: "GET successful!" });
}

export async function POST() {
  const supabase = createAdminClient();
  return NextResponse.json({ message: "POST successful!" });
}

export async function PUT() {
  const supabase = createAdminClient();
  return NextResponse.json({ message: "PUT successful!" });
}

export async function DELETE() {
  const supabase = createAdminClient();
  return NextResponse.json({ message: "DELETE successful!" });
}


