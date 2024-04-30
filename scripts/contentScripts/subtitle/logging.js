let subtitleElement = null;
let videoPlayer = null;
let lastSubtitle = "";

export function turnOnLogging() {
    subtitleElement = document.querySelector('#subtitle-ui');
    videoPlayer = document.querySelector('video');
    videoPlayer.addEventListener('timeupdate', handleTimeUpdate);
}

export function turnOffLogging() {
    if (videoPlayer) {
        videoPlayer.removeEventListener('timeupdate', handleTimeUpdate);
    }
    subtitleElement = null;
    videoPlayer = null;
    lastSubtitle = "";
    chrome.storage.local.clear(); // 모든 저장 데이터 삭제
}

function handleTimeUpdate() {
    const currentText = subtitleElement.textContent;
    const roundedTime = Math.round(videoPlayer.currentTime);
    if (currentText !== lastSubtitle) {
        lastSubtitle = currentText;
        console.log(currentText, videoPlayer.currentTime);

        if (currentText.trim() !== "") {
            chrome.storage.local.set({[roundedTime]: currentText});
        }
    }
    
    if (roundedTime % 300 === 0) {
        console.log('매 300초마다 로그:', roundedTime);
        chrome.storage.local.get(null, function(items) {
            console.log(items); // 저장된 모든 자막 로그 출력
            chrome.storage.local.clear(); // 저장된 자막 데이터 삭제
        });
    }
}

