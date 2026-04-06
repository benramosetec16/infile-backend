const app = require('../src/app');

// Vercel serverless functions load this file and receive the exported app.
// For local development, we start the server manually here:
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`[Local] Servidor InFile rodando na porta ${PORT}`);
  });
}

module.exports = app;
