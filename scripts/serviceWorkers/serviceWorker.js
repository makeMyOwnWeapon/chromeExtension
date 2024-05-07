chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'REST') {
        fetch(request.url, request.options)
            .then(resp => resp.json())
            .then(data => {
                // json 데이터 추출 
                sendResponse(data);
            })
            .catch(error => {
                sendResponse(error);
            });
    }
    return true;
});
