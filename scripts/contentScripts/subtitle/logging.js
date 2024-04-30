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
    const currentText = subtitleElement.textContent.trim();
    const roundedTime = Math.round(videoPlayer.currentTime);

    if (currentText !== lastSubtitle) {
        lastSubtitle = currentText;
        console.log(currentText, videoPlayer.currentTime);

        if (currentText !== "") {
            // 이미 저장된 자막을 확인하기 위해 모든 데이터를 검색
            chrome.storage.local.get(null, function(items) {
                let isDuplicate = false;
                // 저장된 각 자막의 내용을 검사하여 중복 여부 판단
                Object.values(items).forEach(savedText => {
                    if (savedText === currentText) {
                        isDuplicate = true;
                    }
                });
                // 중복이 아니라면 저장
                if (!isDuplicate) {
                    chrome.storage.local.set({[roundedTime]: currentText});
                }
            });
        }
    }
    
    // 매 300초마다 저장된 자막 로그를 시간순으로 출력하고 데이터를 삭제
    if (roundedTime % 300 === 0) {
        console.log('매 300초마다 로그:', roundedTime);
        chrome.storage.local.get(null, function(items) {
            const keysSorted = Object.keys(items).map(Number).sort((a, b) => a - b);
            const sortedItems = {};
            keysSorted.forEach(key => {
                sortedItems[key] = items[key];
            });
            console.log(sortedItems); // 정렬된 모든 자막 로그 출력
            chrome.storage.local.clear(); // 저장된 자막 데이터 삭제
        });
    }
}

