import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from '#app';

const env = useRuntimeConfig()

const supabaseUrl: string = env.public.SUPABASE_URL;
const supabaseKey: string = env.public.SUPABASE_KEY;
const supabaseRoleKey: string = env.public.SUPABASE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseRoleKey);
