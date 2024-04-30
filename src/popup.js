document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get('authToken', function(data) {
        if (data.authToken) {
            document.getElementById('controlButtons').style.display = 'block';
        }
    });

    document.getElementById('linkAccount').addEventListener('click', function() {
        var authCode = document.getElementById('authCode').value;
        var url = `http://localhost:3000/api/auth/extension`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authCode
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            chrome.storage.local.set({'authToken': data.token}, () => {
                document.getElementById('controlButtons').style.display = 'block';
                document.getElementById('authMessage').style.display = 'none';
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('authMessage').style.display = 'block';
            document.getElementById('authMessage').textContent = 'Network or server error.';
        });
    });
    
    document.getElementById('showToken').addEventListener('click', function() {  //임시 코드
        chrome.storage.local.get('authToken', function(data) {
            if (data.authToken) {
                alert("Stored Token: " + data.authToken);
            } else {
                alert("No token found.");
            }
        });
    });

    document.getElementById('imNew').addEventListener('click', function() {
        chrome.tabs.update({url: 'http://localhost:3002/main'});
    });

    document.getElementById('activate').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {command: 'turnOn'}, function(response) {
                if (response && response.result === "already active") {
                    document.getElementById('statusMessage').style.display = 'block';
                    document.getElementById('statusMessage').textContent = 'Already activated!';
                }
            });
        });
    });

    document.getElementById('deactivate').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {command: 'turnOff'});
        });
    });
});

document.getElementById('nsactivate').addEventListener('click', function() {   //임시 코드
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: 'turnOn'}, function(response) {
        });
    });
});

document.getElementById('nsdeactivate').addEventListener('click', function() {  //임시 코드
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: 'turnOff'});
    });
});

