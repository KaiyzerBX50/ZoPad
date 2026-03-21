import type { Context } from "hono";

const NOTES_FILE = "/home/workspace/Space/postits/notes.json";

export default async (c: Context) => {
  try {
    const { readFileSync, writeFileSync, existsSync, mkdirSync } = await import("node:fs");
    const { dirname } = await import("node:path");
    const method = c.req.method;

    const readNotes = () => {
      if (!existsSync(NOTES_FILE)) return [];
      try { return JSON.parse(readFileSync(NOTES_FILE, "utf-8")); } catch { return []; }
    };

    const writeNotes = (notes: any[]) => {
      const dir = dirname(NOTES_FILE);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
    };

    if (method === "GET") {
      return c.json(readNotes());
    }

    if (method === "POST") {
      const body = await c.req.json();
      const notes = readNotes();
      const card = {
        id: body.id || Date.now().toString(),
        title: body.title || "",
        content: body.content || "",
        color: body.color || "yellow",
        createdAt: body.createdAt || new Date().toLocaleDateString(),
      };
      notes.unshift(card);
      writeNotes(notes);
      return c.json(card, 201);
    }

    if (method === "PUT") {
      const body = await c.req.json();
      if (!body.id) return c.json({ error: "id required" }, 400);
      const notes = readNotes();
      const idx = notes.findIndex((n: any) => n.id === body.id);
      if (idx === -1) return c.json({ error: "not found" }, 404);
      notes[idx] = { ...notes[idx], ...body };
      writeNotes(notes);
      return c.json(notes[idx]);
    }

    if (method === "DELETE") {
      const url = new URL(c.req.url);
      const id = url.searchParams.get("id");
      if (!id) return c.json({ error: "id required" }, 400);
      let notes = readNotes();
      const len = notes.length;
      notes = notes.filter((n: any) => n.id !== id);
      if (notes.length === len) return c.json({ error: "not found" }, 404);
      writeNotes(notes);
      return c.json({ ok: true });
    }

    return c.json({ error: "method not allowed" }, 405);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
};
