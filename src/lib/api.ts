import { createClient } from "@supabase/supabase-js";
import { VITE_SUPABASE_URL, VITE_SUPABASE_SERVICE_ROLE } from "./constants";

export const supabase = createClient(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_SERVICE_ROLE
);
