import { Client } from 'pg';

// Disable TLS verification for local script
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const client = new Client({
  connectionString: 'postgres://postgres.zswoexmjehaaiozvyzeu:QF8de4tw9V4nUGn8@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true'
});

const functions = [
  `CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, credits)
  VALUES (NEW.id, NEW.email, 5);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`,

  `CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`,

  `CREATE OR REPLACE FUNCTION public.decrement_credits(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.users
  SET credits = credits - 1
  WHERE id = user_id AND credits > 0;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`
];

async function main() {
  try {
    await client.connect();
    console.log('Connected to Supabase DB');

    for (const sql of functions) {
      try {
        await client.query(sql);
        console.log('OK: ' + sql.split('\n')[0] + '...');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('SKIP: ' + sql.split('\n')[0] + '...');
        } else {
          console.log('ERR: ' + sql.split('\n')[0]);
          console.log('  -> ' + err.message.substring(0, 150));
        }
      }
    }

    console.log('All functions applied!');
    await client.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();