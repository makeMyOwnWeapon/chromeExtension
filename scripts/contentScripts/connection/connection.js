import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:4000';

function connect() {
    const socket = io(SERVER_URL, {
        autoConnect: true
    });

    socket.on('connect', () => {
        console.log('Connected to the server');
    });

    socket.on('message', (message) => {
        console.log('Message from server:', message);
    });

    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    return socket;
}

export { connect };
