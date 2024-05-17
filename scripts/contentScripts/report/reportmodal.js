import { REPORT_PROCESSING_HOST } from '../network/LoaAxios.js';
import { workbookContext } from '../workbook/workbook.js';

export function showReportModal() {
    const videoContainer = document.querySelector('.shaka-video-container');
    const modal = document.createElement('div');
    modal.classList.add('overlay');
    modal.innerHTML = `
        <iframe id="iframeContent" src="about:blank" style="width:100%; height:90%;"></iframe>
        <button id="dismissButton" style="color: black; background-color: #ACE1F4; position: fixed; top: 88%; right: 50%; z-index: 1000; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; transition: transform 0.1s, width 0.3s ease-in-out;">레포트 닫기</button>
    `;
    videoContainer.parentNode.appendChild(modal);

    function setIframeUrl(url) {
        const iframe = document.getElementById('iframeContent');
        if (iframe) {
            iframe.src = url;
        }
    }

    const lectureHistoryId = workbookContext.lectureHistoryId;
    setIframeUrl(`${REPORT_PROCESSING_HOST}/reportstudentforextension/${Number(lectureHistoryId)}`);

    const dismissButton = document.getElementById('dismissButton');
    dismissButton.onclick = function() {
        modal.remove();
    };

    dismissButton.onmouseover = function() {
        this.style.backgroundColor = '#68B2FD';
    };

    dismissButton.onmouseout = function() {
        this.style.backgroundColor = '#ACE1F4';
    };

    dismissButton.onmousedown = function() {
        this.style.backgroundColor = '#3CCFFB';
        this.style.color = 'white';
        this.style.transform = 'translate(2px, 2px)';
    };

    dismissButton.onmouseup = function() {
        this.style.backgroundColor = '#ABE0F3';
        this.style.transform = 'translate(0, 0)';
    };
}
