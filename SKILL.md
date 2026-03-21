---
name: zopad
description: "ZoPad — Private sticky notes for Zo Space. Server-side storage keeps each user's notes isolated. Supports create, edit, delete, export, and SMS/chat note creation."
compatibility: "Created for Zo Computer"
metadata:
  author: dagawdnyc.zo.computer
  version: "1.0.0"
---

# ZoPad — Private Sticky Notes

A personal sticky notes app for Zo Space. Notes are stored server-side in each user's own workspace — no data crosses between users.

## Install

1. **Deploy the API route** (`/api/stickies`):
   - In Zo, ask: *"Create the /api/stickies route from the zopad skill"*
   - Or manually create the route using the code in `routes/api-stickies.ts`

2. **Deploy the page route** (`/stickies`):
   - In Zo, ask: *"Create the /stickies page from the zopad skill"*
   - Or manually create the route using the code in `routes/page-stickies.tsx`

3. **Upload the Pegasus logo** (optional):
   - Upload `assets/pegasus.png` to `/images/pegasus.png` in your space assets

## How It Works

- Notes are stored in `/home/workspace/Space/postits/notes.json` on each user's server
- The file is created automatically on first use — starts empty (`[]`)
- **No hardcoded data** — every install starts with a clean slate
- Each user's Zo Computer is isolated, so notes are private by design

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stickies` | List all notes |
| `POST` | `/api/stickies` | Create a note (`{title, content, color}`) |
| `PUT` | `/api/stickies` | Update a note (`{id, title?, content?, color?}`) |
| `DELETE` | `/api/stickies?id=<id>` | Delete a note |

### Colors
`yellow`, `cyan`, `teal`, `green`, `blue`, `ocean`, `electric`, `purple`

## SMS / Chat Integration

Add this rule in Zo to create stickies via text or chat:

> **Condition:** User asks to create a sticky, note, post-it, or ZoPad entry
> **Instruction:** Create it by running: `curl -s -X POST http://localhost:3099/api/stickies -H "Content-Type: application/json" -H "Accept: application/json" -d '{"title":"<title>","content":"<content>","color":"<color>"}'`. Use "yellow" as default color unless specified. Infer a short title and use the rest as content.

## Privacy

- Each Zo Computer is a separate server — notes never leave your machine
- No shared database, no cross-user access
- The data file lives in your workspace and is only accessible to your Zo instance
