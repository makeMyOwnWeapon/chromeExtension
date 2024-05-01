document.addEventListener('DOMContentLoaded', function() {
    function updateLinkButton(isConnected) {
        var linkButton = document.getElementById('linkAccount');
        linkButton.textContent = isConnected ? "연결 끊기" : "계정 연결";
    }

    function toggleNewAccountButton(display) {
        document.getElementById('imNew').style.display = display ? 'block' : 'none';
    }

    chrome.storage.local.get('authToken', function(data) {
        if (data.authToken) {
            document.getElementById('controlButtons').style.display = 'block';
            updateLinkButton(true);
            toggleNewAccountButton(false);
        }
    });

    document.getElementById('linkAccount').addEventListener('click', function() {
        var authCode = document.getElementById('authCode').value;
        var url = `http://localhost:3000/api/auth/extension`;

        if (this.textContent === "계정 연결") {
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
                    updateLinkButton(true);
                    toggleNewAccountButton(false);
                });
            })
            .catch(error => {
                document.getElementById('authMessage').style.display = 'block';
                document.getElementById('authMessage').textContent = '인증 실패! 다시 시도해주세요.';
            });
        } else {
            chrome.storage.local.remove('authToken', () => {
                document.getElementById('controlButtons').style.display = 'none';
                updateLinkButton(false);
                toggleNewAccountButton(true);
            });
        }
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

document.getElementById('logButton').addEventListener('click', function() {
    chrome.storage.local.get('authToken', function(data) {
        if (data.authToken) {

            chrome.runtime.sendMessage({ 
                type: "LOG_TO_CONSOLE", 
                message: "WebSocket connection attempted from popup with token.",
                token: data.authToken
            }, function(response) {
                console.log("Response from background:", response);
            });
        } else {
            console.log('No auth token found in Chrome storage.');
        }
    });
});

