const WebSocket = require('ws');

/** @type {Set<import('ws')>} */
const clients = new Set();

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  // 새 클라이언트 연결 시 저장
  clients.add(ws);
  console.log('New client connected');

  ws.on('message', (data) => {
    console.log(data);
    // 받은 메시지를 다른 모든 클라이언트에게 브로드캐스트
    const message = data.toString();
    clients.forEach((client) => {
      // if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      // }
    });
  });

  ws.on('close', () => {
    // 클라이언트 연결 종료 시 제거
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on port 8080');