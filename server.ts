import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT ?? 3000);

  // API routes
  app.get("/api/status", (req, res) => {
    res.json({ 
      status: "online", 
      version: "4.1.0-pro",
      system: "CyberSafari OS",
      uptime: process.uptime()
    });
  });

  app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.argv.includes("--production")) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
