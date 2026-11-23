import 'dotenv/config';
import { createApp } from './app.js';
import { ensureBootstrapAdmin } from './lib/bootstrapAdmin.js';
import { assertJwtSecretConfigured } from './lib/jwt.js';
import { pool } from './db/pool.js';
assertJwtSecretConfigured();
const app = createApp();
const PORT = Number(process.env.PORT) || 4000;
async function start() {
  await ensureBootstrapAdmin();
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Hotel API listening on http://0.0.0.0:${PORT} (version=${process.env.APP_VERSION || 'v1.0.0'})`,
    );
  });
  const shutdown = (signal) => {
    console.log(`[shutdown] Received ${signal}, draining active requests...`);
    server.close(async () => {
      try {
        await pool.end();
      } catch (_) {
        // ignore pool close errors on shutdown
      }
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 15000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
