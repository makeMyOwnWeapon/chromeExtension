import io from 'socket.io-client';
import { workbookContext, setLectureHistoryId } from '../workbook/workbook';

const SERVER_URL = 'http://localhost:4000';
let socket;

function connect(callback, btn) {
    socket = io(SERVER_URL, {
        autoConnect: true
    });

    socket.on('connect', () => {
        alert('소켓 연결이 되었습니다!');
        callback(btn);
        chrome.storage.local.get('authToken', function(data) {
            const authToken = data.authToken;
            socket.emit('sendData', { 
                socketId: socket.id, 
                token: authToken, 
                subLectureId: workbookContext.subLectureId || "default",
            });
        });
    });

    socket.on('historyget', (message) => {
        setLectureHistoryId(message.lectureHistoryId);
    });

    return socket;
}

function disconnect(callback, startBtn, endBtn) {
    chrome.storage.local.get('authToken', function(data) {
        const authToken = data.authToken;
        const koreaTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

        socket.emit('disconnectRequest', { token: authToken, time: koreaTime });

        socket.close();
        alert('소켓 연결이 해제되었습니다!');
    });

    socket.on('disconnect', () => {
        callback(startBtn, endBtn);
    });
}

export { connect, disconnect };