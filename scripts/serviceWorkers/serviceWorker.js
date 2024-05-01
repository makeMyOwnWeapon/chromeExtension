import io from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to the server!');
});

socket.on('message', (data) => {
  console.log('Message received:', data);
});

socket.on('connect', () => {
    console.log('Connected to the server!');
    socket.emit('message', 'Hello from Chrome Extension!');
  });
  