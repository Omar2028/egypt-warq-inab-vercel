import { createApp } from "../server/_core/index";

// Vercel invokes this Express application as a Node.js serverless function.
const app = createApp({ serveStaticFiles: false });

export default app;
