import { REPORT_PROCESSING_HOST } from '../network/LoaAxios.js';

export function showCreateLoadingModal() {

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
    setIframeUrl(`${REPORT_PROCESSING_HOST}/aicreate`);


    const dismissButton = modal.querySelector('.close'); // 변경된 부분
    dismissButton.onclick = function() {
        modal.remove();
    };

    function closeModal() {
        modal.remove();
    }
    setTimeout(closeModal, 2000); // 모달이 2초 후에 자동으로 닫히도록 변경
}

//통신 안되면 quizset.js의 popupAIQuizInfo을 alert로 변경하면 실행됨.