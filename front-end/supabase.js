// Configuração da conexão com o Supabase
const SUPABASE_URL = 'https://skyoxwjcnzrheizyjkbp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UmIuGWvX0k214_rG3wlSZA_FjoRkxXu';

const clienteSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);