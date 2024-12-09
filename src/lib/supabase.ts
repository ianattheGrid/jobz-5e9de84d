import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lfwwhyjtbkfibxzefvkn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmd3doeWp0YmtmaWJ4emVmdmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIxMjc2MDAsImV4cCI6MjAxNzcwMzYwMH0.vxJxjqC4hnXFYxZIQZ6FXkxvqmQxL8sAw1eLKXXJvsc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);