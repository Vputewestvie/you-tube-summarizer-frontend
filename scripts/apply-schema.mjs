import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://zswoexmjehaaiozvyzeu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzd29leG1qZWhhYWlvenZ5emV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDQ3MTI2MywiZXhwIjoyMTAwMDQ3MjYzfQ.FKidPPJCvJN5_RiF2lBexzgpauZE6FKnW0MvdnXgvmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const schema = readFileSync('supabase-schema.sql', 'utf8');

async function executeSQL(query) {
  const { data, error } = await supabase.rpc('exec_sql', { query_text: query });
  if (error) {
    // Try alternative approach - direct SQL via REST
    const { data: d2, error: e2 } = await supabase.from('_exec_sql').select('*').limit(1);
    if (e2) console.log('Note:', e2.message);
  }
  return { data, error };
}

async function main() {
  console.log('Applying schema...');
  
  // Split by semicolons and execute each statement
  const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);
  
  for (const stmt of statements) {
    const fullStmt = stmt + ';';
    try {
      const { error } = await supabase.rpc('exec_sql', { query_text: fullStmt });
      if (error) {
        console.log(`Error: ${fullStmt.substring(0, 60)}...`);
        console.log(`  ${error.message}`);
      } else {
        console.log(`OK: ${fullStmt.substring(0, 60)}...`);
      }
    } catch (err) {
      console.log(`Exception: ${fullStmt.substring(0, 60)}...`);
      console.log(`  ${err.message}`);
    }
  }
  
  console.log('Done!');
}

main();