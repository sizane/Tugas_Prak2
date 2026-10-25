import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { getDb } from './index.ts';
import { users } from './schema.ts';
import { hashPassword } from '../utils/password.ts';

async function main() {
  const db = await getDb();
  const rows = await db.select({ id: users.id }).from(users);
  for (const u of rows) {
    await db.update(users).set({ passwordHash: hashPassword('Password123') }).where(eq(users.id, u.id));
  }
  console.log(`Selesai: ${rows.length} akun`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });