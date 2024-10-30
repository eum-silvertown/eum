const express = require('express');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // 모든 출처 허용
  },
});

io.on('connection', socket => {
  console.log(`클라이언트 연결됨: ${socket.id}`);

  // 왼쪽 캔버스에서 오른쪽 캔버스로 전송
  socket.on('left_to_right', data => {
    console.log('서버에서 left_to_right 이벤트 발생, 데이터:', data);
    io.emit('left_to_right', data); // 클라이언트로 데이터 전송
  });
  // 왼쪽 캔버스에서 오른쪽 캔버스로 전송
  socket.on('left_to_right_move', data => {
    console.log('서버에서 left_to_right_move 이벤트 발생, 데이터:', data);
    io.emit('left_to_right_move', data); // 클라이언트로 데이터 전송
  });

  // 오른쪽 캔버스에서 왼쪽 캔버스로 전송
  socket.on('right_to_left', data => {
    console.log('서버에서 right_to_left 이벤트 발생, 데이터:', data);
    io.emit('right_to_left', data); // 클라이언트로 데이터 전송
  });

  socket.on('disconnect', () => {
    console.log(`클라이언트 연결 종료: ${socket.id}`);
  });
});

server.listen(8080, () => {
  console.log('Socket.io 서버가 8080에서 실행 중입니다.');
});

io.engine.on('connection_error', err => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});
