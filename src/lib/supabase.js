const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    'https://wqxayssroncjzvcmvqob.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxeGF5c3Nyb25janp2Y212cW9iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxOTg1NTc4MSwiZXhwIjoyMDM1NDMxNzgxfQ.ZLeiRscSlZHlH0A5D2z4OPHykMDRFGnkn2xKalXaFb4',
)

module.exports = { supabase }