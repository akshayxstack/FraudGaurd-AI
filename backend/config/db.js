import dns from "node:dns";
import mongoose from "mongoose";
import { config } from "./index.js";

// The default system DNS resolver has been unreliable when resolving MongoDB Atlas's 
// SRV records (_mongodb._tcp.*), causing intermittent ECONNREFUSED errors during 
// connection attempts. Explicitly setting reliable public DNS servers (Google and 
// Cloudflare) before any connection attempt prevents this issue project-wide, 
// without requiring any system-level DNS configuration changes.
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4', '1.0.0.1']);

/**
 * Validates the MongoDB Connection URI and prints diagnostic details.
 */
const validateAndLogURI = (uri) => {
  if (!uri) {
    throw new Error("MONGODB_URI is not defined.");
  }

  // Check for spaces
  if (uri.trim() !== uri) {
    console.warn("[Database] Warning: MONGODB_URI contains leading or trailing whitespace. It will be trimmed.");
    uri = uri.trim();
  }

  // Check for wrapped quotes
  if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    console.warn("[Database] Warning: MONGODB_URI is wrapped in quotation marks. Stripping them.");
    uri = uri.slice(1, -1);
  }

  if (!uri.startsWith("mongodb+srv://") && !uri.startsWith("mongodb://")) {
    throw new Error("MONGODB_URI must start with 'mongodb+srv://' or 'mongodb://'");
  }

  const hasCredentials = uri.includes(":") && uri.includes("@");
  if (!hasCredentials) {
    console.warn("[Database] Warning: MONGODB_URI does not seem to contain username/password credentials.");
  }

  // Extract host & database name
  try {
    const afterProtocol = uri.split("://")[1];
    const credentialsAndHost = afterProtocol.split("?")[0];
    const [creds, hostAndDb] = credentialsAndHost.includes("@") 
      ? credentialsAndHost.split("@")
      : ["", credentialsAndHost];
      
    const host = hostAndDb.includes("/") ? hostAndDb.split("/")[0] : hostAndDb;
    const dbName = hostAndDb.includes("/") ? hostAndDb.split("/")[1] : "";
    const queryParams = uri.includes("?") ? uri.split("?")[1] : "";

    console.log(`[Database] Target Host: ${host}`);
    console.log(`[Database] Target DB  : ${dbName || "(default: test)"}`);

    if (!queryParams.includes("retryWrites=true")) {
      console.warn("[Database] Recommendation: Append 'retryWrites=true' to the MONGODB_URI query parameters.");
    }
    if (!queryParams.includes("w=majority")) {
      console.warn("[Database] Recommendation: Append 'w=majority' to the MONGODB_URI query parameters.");
    }

    return { host, dbName, validatedUri: uri };
  } catch (err) {
    throw new Error(`Malformed MONGODB_URI: ${err.message}`);
  }
};

/**
 * Connects to MongoDB using the URI defined in environment variables.
 * Exits the process if the connection fails.
 */
export const connectDB = async () => {
  try {
    const uri = config.MONGODB_URI;
    const { host, dbName, validatedUri } = validateAndLogURI(uri);

    console.log(`[Database] Attempting connection to MongoDB...`);
    
    // Set standard connection options
    const options = {
      serverSelectionTimeoutMS: 5000, // Fail fast after 5 seconds instead of 30 seconds
      connectTimeoutMS: 10000,
    };

    const conn = await mongoose.connect(validatedUri, options);
    
    console.log(`[Database] Connected successfully!`);
    console.log(`  Host   : ${conn.connection.host}`);
    console.log(`  Port   : ${conn.connection.port || "default"}`);
    console.log(`  Name   : ${conn.connection.name}`);
    console.log(`  State  : Connected (${mongoose.STATES[conn.connection.readyState]})`);
  } catch (error) {
    console.error(`[Database] Connection failed: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};
