import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from '#app';

const env = useRuntimeConfig()

const supabaseUrl: string = env.public.SUPABASE_URL;
const supabaseKey: string = env.public.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
