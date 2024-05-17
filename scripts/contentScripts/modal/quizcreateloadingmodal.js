import { REPORT_PROCESSING_HOST } from '../network/LoaAxios.js';

export function showCreateLoadingModal() {
    const videoContainer = document.querySelector('.shaka-video-container');
    if (!videoContainer) {
        console.error('videoContainer is null. Cannot append loading modal.');
        return;
    }

    const modal = document.createElement('div');
    modal.classList.add('overlay');
    modal.innerHTML = `
        <iframe id="iframeContent" class="close" src="about:blank" style="width:100%; height:100%;"></iframe>
        <button class="close" style="position: absolute; top: 10px; right: 10px;">Close</button>
    `;

    videoContainer.appendChild(modal);

    function setIframeUrl(url) {
        const iframe = document.getElementById('iframeContent');
        if (iframe) {
            iframe.src = url;
        } else {
            console.error('iframeContent element is null. Cannot set iframe URL.');
        }
    }
    setIframeUrl(`${REPORT_PROCESSING_HOST}/aicreate`);

    const dismissButton = modal.querySelector('.close');
    if (dismissButton) {
        dismissButton.onclick = function() {
            modal.remove();
        };
    } else {
        console.error('dismissButton is null. Cannot set onclick handler.');
    }

    function closeModal() {
        modal.remove();
    }
    setTimeout(closeModal, 2000); // 모달이 2초 후에 자동으로 닫히도록 변경
}
