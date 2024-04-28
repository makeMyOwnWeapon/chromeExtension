document.getElementById('activate').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: 'turnOn'}, function(response) {
            if (response.result === "already active") {
                alert("Already activated!");
            }
        });
    });
});

document.getElementById('deactivate').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: 'turnOff'});
    });
});
