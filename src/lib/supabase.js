import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://stpltzihpiwmjtbflpbv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0cGx0emlocGl3bWp0YmZscGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3OTQxMzksImV4cCI6MjA5MTM3MDEzOX0.-gHgoYZ-p8KPBQgmEuctq150mc3AuZdUjkl3pBIY3DA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
