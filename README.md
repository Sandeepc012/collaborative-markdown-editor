# Real-Time Collaborative Markdown Editor with AI Summarization

This project is a lightweight web application that allows multiple users to collaboratively edit a Markdown document in their browsers. Changes are synchronised in real time using CRDT technology. The server also provides a simple AI‑like summarisation endpoint that extracts the most important sentences from the shared document.

## Features

- Concurrent editing of a shared document using Yjs and WebSocket transport.
- Real‑time updates across all connected clients with conflict‑free merging.
- Simple text summarisation endpoint based on word frequency that returns a concise abstract of the current document.
- Minimal client interface with editable content area, summary display, and on‑demand summarisation.

## Tech Stack

- **Node.js / Express** for HTTP and static file serving.
- **Yjs** and **y‑websocket** for CRDT‑based shared document state and WebSocket communication.
- **WebSockets** via the `ws` package for low‑latency synchronisation.
- **Vanilla JavaScript** on the client to integrate Yjs, manage the DOM and request summaries.

## Running the Project

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Open `http://localhost:3000` in multiple browser windows or devices. Edits in one window will appear in all others.

4. Click **Summarize** to request a summary of the current document. The summary is computed on the server and returned as JSON.

## Deployment

The application can run on any Node.js hosting platform. When deploying behind a proxy or load balancer, ensure that WebSocket connections are routed to the Node.js process.
