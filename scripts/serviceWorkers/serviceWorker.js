chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "LOG_TO_CONSOLE") {
        console.log("Received in background:", request.message);
        if (request.token) {
            console.log("Token received in background:", request.token);

            const socket = new WebSocket('ws://localhost:55555');

            socket.onopen = function (event) {
                console.log('Connection established');
                socket.send(JSON.stringify({ token: request.token }));
            };

            socket.onerror = function (error) {
                console.error('WebSocket Error:', error);
            };

            socket.onclose = function (event) {
                console.log('Socket closed:', event);
            };
        }
        sendResponse({ status: "Message and token logged successfully" });
    }

    if (request.type === 'fetch') {
        fetch(request.url, request.options)
            .then(resp => resp.json())
            .then(data => {
                // json 데이터 추출 
                sendResponse(data);
            });
    }
    return true;
});
