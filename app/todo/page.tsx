"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { createNoteServer, deleteNoteServer } from "./serverside";
