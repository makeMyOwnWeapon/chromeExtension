chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'REST') {
        fetch(request.url, request.options)
            .then(resp => resp.json())
            .then(data => {
                sendResponse(data);
            })
            .catch(error => {
                sendResponse(error);
            });
    }
    else if (request.type === "REST_FILE") {
        const base64Data = request.base64Data;
        const parts = base64Data.split(';base64,');
        const imageData = parts[1];
        const blob = base64ToBlob(imageData, 'image/jpeg');
        const formData = new FormData();
        formData.append('file', blob, 'temp.jpeg');
        fetch(request.url, {method: 'POST', body: formData})
            .then(resp => resp.json())
            .then(data => sendResponse(data))
            .catch(error => sendResponse(error));
    }
    else if (request.type === 'TEXT') {
        fetch(request.url, request.options)
            .then(resp => resp.text())
            .then(data => {
                sendResponse(data)
            })
            .catch(error => {
                sendResponse(error);
            });
    }
    return true;
});

function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    
    return new Blob([byteArray], {type: mimeType});
  }

chrome.webRequest.onCompleted.addListener(
    function(details) {
      if (details.type === "xmlhttprequest") {
        fetch(details.url)
          .then(response => response.json())
          .then(data => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id, { jsonResponse: data });
            });
          })
          .catch(error => console.error('Error fetching JSON:', error));
      }
    },
    { urls: ["https://www.inflearn.com/subtitles/*/json"] }
);
  