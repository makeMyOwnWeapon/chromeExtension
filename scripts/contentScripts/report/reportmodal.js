import { REPORT_PROCESSING_HOST } from '../network/LoaAxios.js';
import { workbookContext } from '../workbook/workbook.js';

export function showReportModal() {

    const videoContainer = document.querySelector('.shaka-video-container');
    const modal = document.createElement('div');
    modal.classList.add('overlay');
    modal.innerHTML = `
            <iframe id="iframeContent" src="about:blank" style="width:100%; height:90%;"></iframe>
            <button id="dismissButton" style="background-color: #4CAF50; color: white; padding: 10px 20px; margin: 8px 0; border: none; border-radius: 4px; cursor: pointer; transition: transform 0.1s, width 0.3s ease-in-out; width: auto;">알람 끄기</button>
        `
    videoContainer.parentNode.appendChild(modal);

    function setIframeUrl(url) {
        const iframe = document.getElementById('iframeContent');
        if (iframe) {
            iframe.src = url;
        }
    }
    const subLectureId = workbookContext.subLectureId;
    const lectureHistoryId = workbookContext.lectureHistoryId;
    setIframeUrl(`${REPORT_PROCESSING_HOST}/reportstudentforextension/${Number(lectureHistoryId)}`);


    const dismissButton = document.getElementById('dismissButton');
    dismissButton.onclick = function() {
        modal.remove();
    };
    dismissButton.onmouseover = function() {
        this.style.backgroundColor = '#45a049';
    };
    dismissButton.onmousedown = function() {
        this.style.transform = 'translate(2px, 2px)';
    };
    dismissButton.onmouseup = function() {
        this.style.transform = 'translate(0, 0)';
    };

}
