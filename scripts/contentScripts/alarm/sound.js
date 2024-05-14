let audio = new Audio(chrome.runtime.getURL('sounds/alarm.mp3'));

export function playSound() {
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