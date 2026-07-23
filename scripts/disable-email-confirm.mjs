import { Client } from 'pg';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const client = new Client({
  connectionString: 'postgres://postgres.zswoexmjehaaiozvyzeu:QF8de4tw9V4nUGn8@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true'
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to Supabase DB');

    // Create function to auto-confirm emails
    await client.query(`
      CREATE OR REPLACE FUNCTION public.auto_confirm_email()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE auth.users SET email_confirmed_at = NOW() WHERE id = NEW.id AND email_confirmed_at IS NULL;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
    console.log('OK: Created auto_confirm_email function');

    // Drop existing trigger if it exists
    await client.query('DROP TRIGGER IF EXISTS on_auth_user_email_confirm ON auth.users;');
    console.log('OK: Dropped old trigger (if existed)');

    // Create trigger to auto-confirm emails on signup
    await client.query(`
      CREATE TRIGGER on_auth_user_email_confirm
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.auto_confirm_email();
    `);
    console.log('OK: Created auto-confirm email trigger');

    console.log('\nDone! Email confirmation is now disabled.');
    console.log('Users will be automatically confirmed upon registration.');

    await client.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();