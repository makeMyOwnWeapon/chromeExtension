console.log("hi I`m service Worker");

chrome.runtime.onInstalled.addListener(() => {
    console.log("chrome.runtime.onInstalled!!");

    //receiving a message
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
            if (request.greeting === "hello")
                sendResponse({ farewell: "goodbye" });



            console.log("서버로 보낼 소강의 : " + request.small_lecture);

            const sendData = JSON.stringify({
                test1: request.small_lecture // 서버로 전송할 데이터
            })

            sendDataToServer(sendData);





        }
    );

});

// 서비스 워커 활성화 시 이벤트 리스너
// self.addEventListener('activate', event => {
//     // 서비스 워커 활성화 시 로컬 서버로 데이터 전송
//     sendDataToServer();
// });

function sendDataToServer(data) {
    // 여기서는 예시로 서버 URL을 'http://localhost:3000/data'로 가정합니다.
    // 실제 사용 시 해당 부분을 자신의 서버 주소로 교체해주세요.
    fetch('http://localhost:8080/messages', {
        method: 'POST', // 데이터 전송 방식 지정
        headers: {
            'Content-Type': 'application/json', // 컨텐츠 타입 지정
        },
        body: data
    })
        .then(response => {
            // 응답을 받았을 때의 처리
            if (response.ok) {
                console.log('ok');
                return response.json();
            }
            console.log('ok2');
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            console.log('Data successfully sent to the server:', data);
        })
        .catch(error => {
            // 에러 처리
            console.error('Error sending data:', error);
        });
}
