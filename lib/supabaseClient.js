
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://brjbilyasclkitolznob.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyamJpbHlhc2Nsa2l0b2x6bm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTU0OTUsImV4cCI6MjA2NTk5MTQ5NX0.AxI98NnlgI-5HwVfa_u_aAhBoxDHPWM4zGe2eoIugww'

export const supabase = createClient(supabaseUrl, supabaseKey)