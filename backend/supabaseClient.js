// backend/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Use environment variables for safety
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Private, don't expose

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
