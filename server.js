const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const Y = require('yjs');
const { setupWSConnection } = require('y-websocket/bin/utils');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Create a Yjs document and bind it to a single room
const docMap = new Map();

function getDoc(name) {
  let doc = docMap.get(name);
  if (!doc) {
    doc = new Y.Doc();
    docMap.set(name, doc);
  }
  return doc;
}

wss.on('connection', (conn, req) => {
  const url = req.url || '';
  const params = new URLSearchParams(url.substring(1));
  const roomName = params.get('room') || 'default';
  const doc = getDoc(roomName);
  setupWSConnection(conn, req, { doc });
});

app.use(express.static('collaborative-markdown-editor/public'));

// Simple text summarization: pick top sentences by word frequency
function summarize(text) {
  const sentences = text.split(/[.!?]\s+/);
  const wordFreq = {};
  sentences.forEach((s) => {
    s.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .forEach((word) => {
        if (word.length > 3) {
          wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
      });
  });
  const sentenceScores = sentences.map((s) => {
    let score = 0;
    s.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .forEach((word) => {
        if (wordFreq[word]) {
          score += wordFreq[word];
        }
      });
    return score;
  });
  const topIndexes = sentenceScores
    .map((score, idx) => ({ score, idx }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.idx);
  topIndexes.sort((a, b) => a - b);
  return topIndexes.map((i) => sentences[i]).join('. ');
}

app.get('/summary', (req, res) => {
  const roomName = req.query.room || 'default';
  const doc = getDoc(roomName);
  const ytext = doc.getText('content');
  const text = ytext.toString();
  const summary = summarize(text);
  res.json({ summary });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
