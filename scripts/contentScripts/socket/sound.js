let audio;

export function playSound() {
    audio = new Audio(chrome.runtime.getURL('sounds/alarm.mp3'));
    audio.play().then(() => {
        console.log("alarm on");
    }).catch(error => {
        console.error('Error playing sound:', error.message);
    });
}

export function stopSound() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        console.log("alarm off");
    }
}