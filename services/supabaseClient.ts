import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ywtnlpegjnfbfdhoqhfn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3dG5scGVnam5mYmZkaG9xaGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwODk3NjMsImV4cCI6MjA3MzY2NTc2M30.ACgqoYhEh6I4CWDammJfN2w825yxXdp1ViHPsjDyi9g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    redirectTo: 'https://medginius.netlify.app/',
  },
});
