import { env } from "../env.js";

const SERVER_URL = {
    local: 'http://localhost:3000/api/auth/extension',
    prod: 'https://api.learn-on-air.site/api/auth/extension'
}[env]

document.addEventListener('DOMContentLoaded', function() {
    function updateLinkButton(isConnected) {
        var linkButton = document.getElementById('linkAccount');
        linkButton.textContent = isConnected ? "연결 해제" : "계정 연결";
    }

    function toggleNewAccountButton(display) {
        document.getElementById('imNew').style.display = display ? 'block' : 'none';
    }

    function toggleAuthCodeInput(display) {
        document.getElementById('authCode').style.display = display ? '' : 'none';
    }

    chrome.storage.local.get('authToken', function(data) {
        if (data.authToken) {
            document.getElementById('controlButtons').style.display = 'block';
            updateLinkButton(true);
            toggleNewAccountButton(false);
            toggleAuthCodeInput(false);
        }
    });

    document.getElementById('linkAccount').addEventListener('click', function() {
        var authCode = document.getElementById('authCode').value;
        var url = SERVER_URL;

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
                    toggleAuthCodeInput(false);
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
                toggleAuthCodeInput(true);
            });
        }
    });

    document.getElementById('imNew').addEventListener('click', function() {
        chrome.tabs.update({url: 'https://www.learn-on-air.site/introduce'});
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