/**
 * server.js
 *
 * Entry point — imports the configured Express app and starts the HTTP listener.
 * All application configuration lives in app.js; nothing else belongs here.
 */

import "dotenv/config";
import app from "./app.js";
import { config } from "./config/index.js";
import { connectDB } from "./config/db.js";

// ── Process-level error guards ────────────────────────────────────────────────
// Catch synchronous exceptions that escape all try/catch blocks.
process.on("uncaughtException", (err) => {
  console.error("[Server] Uncaught Exception — shutting down:", err.message);
  console.error(err.stack);
  process.exit(1);
});

// Catch unhandled Promise rejections (e.g. a missing await, a rejected Promise
// with no .catch()). Node.js 15+ terminates on unhandled rejections by default;
// logging before exit gives us a clear record of what went wrong.
process.on("unhandledRejection", (reason) => {
  console.error("[Server] Unhandled Promise Rejection — shutting down:", reason);
  process.exit(1);
});

// Helper to mask MongoDB URI password
const maskURI = (uri) => {
  if (!uri) return "undefined";
  try {
    return uri.replace(/:([^:@]+)@/, ":******@");
  } catch (err) {
    return "malformed/unmaskable URI";
  }
};

// ── Start server ──────────────────────────────────────────────────────────────
const startServer = async () => {
  const { PORT, NODE_ENV, FASTAPI_URL } = config;

  console.log("=== Startup Diagnostics ===");
  console.log(`Node version       : ${process.version}`);
  console.log(`Working directory  : ${process.cwd()}`);
  console.log(`Dotenv loaded      : [Config] Environment loaded`);
  console.log(`Loaded Mongo URI   : ${maskURI(config.MONGODB_URI)}`);
  console.log("===========================");

  // Connect to MongoDB first
  await connectDB();
  app.listen(PORT, () => {
    console.log("─────────────────────────────────────────");
    console.log("  FraudGuard AI — Backend");
    console.log("─────────────────────────────────────────");
    console.log(`  Status   : Running`);
    console.log(`  Port     : ${PORT}`);
    console.log(`  Env      : ${NODE_ENV}`);
    console.log(`  ML URL   : ${FASTAPI_URL}`);
    console.log("─────────────────────────────────────────");
  });
};

startServer();
