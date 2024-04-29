document.getElementById('linkAccount').addEventListener('click', function() {
    var authCode = document.getElementById('authCode').value;
    var url = `http://localhost:3000/api/auth/extension`;
    fetch(url, {
        headers: {
            'Authorization': authCode
        }
    })
    .then(response => {
        if (response.status === 200) {
            document.getElementById('controlButtons').style.display = 'block';
        } else if (response.status === 204) {
            chrome.tabs.update({url: 'http://localhost:3000/main'});
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('activate').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: 'turnOn'}, function(response) {
            if (response && response.result === "already active") {
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
