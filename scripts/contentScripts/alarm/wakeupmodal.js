import { createAndPopupModalWithHTML } from '../modal/modal.js'; 
import { LoaAxios, HOST } from '../network/LoaAxios.js';
import { formatDate } from '../network/TimeFomater.js';
import { analyticsContext } from '../workbook/controller/webcam.js';
import { playSound, stopSound } from './sound.js';
import { workbookContext } from '../workbook/workbook.js'

export function showWakeUpModal() {
    let modal = document.getElementById("analysis-info-modal");
    
    if (modal) {
        return;
    }
    const video = workbookContext.videoElement;
    video.pause();
    modal = createAndPopupModalWithHTML({
        headerHTML : `
        <div class="modal-header">
            <p>졸음이 감지되었습니다.</p>
        </div>
        `,
        bodyHTML : `
        <div class="modal-body">
            <button id="dismissButton" style="background-color: #4CAF50; color: white; padding: 10px 20px; margin: 8px 0; border: none; border-radius: 4px; cursor: pointer; transition: transform 0.1s, width 0.3s ease-in-out; width: auto;">알람 끄기</button>
        </div>
        `
    });
    modal.id = "analysis-info-modal";
    const dismissButton = document.getElementById('dismissButton');
    dismissButton.onclick = function() {
        analyticsContext.endedAt = formatDate(new Date());
        LoaAxios.post(
            `${HOST}/api/analytics/save`,
            { "startedAt": analyticsContext.startedAt,
                "endedAt": analyticsContext.endedAt,
                "lectureHistories": workbookContext.lectureHistoryId,
                "analysisType": 0 },
            (response) => {
                console.log(response);
            }
        )
        analyticsContext.startedAt = null;
        analyticsContext.endedAt = null;
        modal.remove();
        stopSound();
        video.play();
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

    playSound();
}

document.addEventListener('DOMContentLoaded', function() {
    showWakeUpModal();
});

