import io from 'socket.io-client';
import { showWakeUpModal } from '../alarm/wakeupmodal';
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

    socket.on('wakeup', (message) => {
        showWakeUpModal();
    });

    socket.on('historyget', (message) => {
        setLectureHistoryId(message.lectureHistoryId);
    });

    return socket;
}

function disconnect(callback, startBtn, endBtn) {
    socket.emit('requestTime');

    alert('소켓 연결이 해제되었습니다!');
    socket.close();
    
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
        callback(startBtn, endBtn);
    });
}

export { connect, disconnect };
