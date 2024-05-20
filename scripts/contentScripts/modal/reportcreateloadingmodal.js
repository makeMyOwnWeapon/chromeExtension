import { REPORT_PROCESSING_HOST } from '../network/LoaAxios.js';

export function showQuizCreateLoadingModal() {
    const videoContainer = document.querySelector('.shaka-video-container');
    const modal = document.createElement('div');
    modal.classList.add('overlay');
    modal.innerHTML = `
            <iframe id="iframeContent" class = "close" src="about:blank" style="width:100%; height:100%;"></iframe>        `
    videoContainer.appendChild(modal);

    function setIframeUrl(url) {
        const iframe = document.getElementById('iframeContent');
        if (iframe) {
            iframe.src = url;
        }
    }
    setIframeUrl(`${REPORT_PROCESSING_HOST}/aiquizcreate`);


    const dismissButton = modal.querySelector('.close');
    dismissButton.onclick = function() {
        modal.remove();
    };

    function closeModal() {
        modal.remove();
    }

    return closeModal;
}
