import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#app";

export default function () {
  const env = useRuntimeConfig();

  const supabaseUrl: string = env.public.SUPABASE_URL;
  const supabaseKey: string = env.public.SUPABASE_KEY;

  return createClient(supabaseUrl, supabaseKey);
}
