import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b898e3c0/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all public reflections (newest first)
app.get("/make-server-b898e3c0/reflections", async (c) => {
  try {
    const allReflections = await kv.getByPrefix("public_reflection:");
    
    // Sort by timestamp, newest first
    const sorted = allReflections.sort((a, b) => {
      const timestampA = JSON.parse(a).timestamp || 0;
      const timestampB = JSON.parse(b).timestamp || 0;
      return timestampB - timestampA;
    });
    
    return c.json({ reflections: sorted.map(r => JSON.parse(r)) });
  } catch (error) {
    console.log("Error fetching reflections:", error);
    return c.json({ error: "Failed to fetch reflections" }, 500);
  }
});

// Post a new public reflection
app.post("/make-server-b898e3c0/reflections", async (c) => {
  try {
    const body = await c.req.json();
    const { prompt, answer, color } = body;
    
    if (!prompt || !answer) {
      return c.json({ error: "Prompt and answer are required" }, 400);
    }
    
    const id = crypto.randomUUID();
    const reflection = {
      id,
      prompt,
      answer,
      color: color || "#FFD6E0",
      timestamp: Date.now(),
      date: new Date().toISOString(),
      likes: 0,
    };
    
    await kv.set(`public_reflection:${id}`, JSON.stringify(reflection));
    
    return c.json({ success: true, reflection });
  } catch (error) {
    console.log("Error posting reflection:", error);
    return c.json({ error: "Failed to post reflection" }, 500);
  }
});

// Like a reflection
app.post("/make-server-b898e3c0/reflections/:id/like", async (c) => {
  try {
    const id = c.req.param("id");
    const reflectionData = await kv.get(`public_reflection:${id}`);
    
    if (!reflectionData) {
      return c.json({ error: "Reflection not found" }, 404);
    }
    
    const reflection = JSON.parse(reflectionData);
    reflection.likes = (reflection.likes || 0) + 1;
    
    await kv.set(`public_reflection:${id}`, JSON.stringify(reflection));
    
    return c.json({ success: true, likes: reflection.likes });
  } catch (error) {
    console.log("Error liking reflection:", error);
    return c.json({ error: "Failed to like reflection" }, 500);
  }
});

// Unlike a reflection
app.post("/make-server-b898e3c0/reflections/:id/unlike", async (c) => {
  try {
    const id = c.req.param("id");
    const reflectionData = await kv.get(`public_reflection:${id}`);
    
    if (!reflectionData) {
      return c.json({ error: "Reflection not found" }, 404);
    }
    
    const reflection = JSON.parse(reflectionData);
    reflection.likes = Math.max(0, (reflection.likes || 0) - 1);
    
    await kv.set(`public_reflection:${id}`, JSON.stringify(reflection));
    
    return c.json({ success: true, likes: reflection.likes });
  } catch (error) {
    console.log("Error unliking reflection:", error);
    return c.json({ error: "Failed to unlike reflection" }, 500);
  }
});

Deno.serve(app.fetch);