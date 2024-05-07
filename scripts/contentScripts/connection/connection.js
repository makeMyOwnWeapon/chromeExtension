import io from 'socket.io-client';
import { showWakeUpModal } from '../alarm/wakeupmodal';
import { workbookContext } from '../workbook/workbook';

const SERVER_URL = 'http://localhost:4000';
let socket;

function connect() {
    socket = io(SERVER_URL, {
        autoConnect: true
    });

    socket.on('connect', () => {
        alert('소켓 연결이 되었습니다!');
        chrome.storage.local.get('authToken', function(data) {
            const authToken = data.authToken;
            // lectureHistoryId를 임시 값으로 설정, 예를 들어 12345
            const lectureHistoryId = 12345;  // 이 값을 진짜 lecture history id로 교체하세요
            socket.emit('sendData', { 
                socketId: socket.id, 
                token: authToken, 
                subLectureId: workbookContext.subLectureId || "default",
                lectureHistoryId: lectureHistoryId  // 임시값 추가
            });
        });
    });

    socket.on('wakeup', (message) => {
        showWakeUpModal();
    });

    return socket;
}

export { connect };

function disconnect(){
    socket.close();
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
} 

export { disconnect };
