    
    console.log("popup.js start");
    // popup.js
    document.getElementById('toggleButton').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "toggleElement"});
        });
    });