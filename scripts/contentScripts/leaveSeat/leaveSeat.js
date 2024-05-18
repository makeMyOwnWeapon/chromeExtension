import { createAndPopupModalWithHTML } from '../modal/modal.js'; 
import { LoaAxios, HOST } from '../network/LoaAxios.js';
import { formatDate } from '../network/TimeFomater.js';
import { ANALYSIS_TYPE, setAnalysisType } from '../workbook/controller/analysis.js';
import { analyticsContext, initializeStatusCount } from '../workbook/controller/webcam.js';
import { workbookContext } from '../workbook/workbook.js'

const leaveSeatSound = new Audio(chrome.runtime.getURL('sounds/leave-out.mp3'));

export async function showLeaveSeatModal() {
    let modal = document.getElementById("analysis-info-modal");
    
    if (modal) {
        return;
    }
    const video = workbookContext.videoElement;
    video.pause();
    modal = createAndPopupModalWithHTML({
        headerHTML : `
        <div class="modal-header">
            <p>자리이탈이 감지되었습니다.</p>
        </div>
        `,
        bodyHTML : `
        <div class="modal-body">
            <button id="dismissButton">재개하기</button>
        </div>
        `
    });
    modal.id = "analysis-info-modal";
    await leaveSeatSound.play();
    const dismissButton = document.getElementById('dismissButton');
    dismissButton.onclick = function() {
        analyticsContext.endedAt = formatDate(new Date());
        LoaAxios.post(
            `${HOST}/api/analytics/save`,
            { "startedAt": analyticsContext.startedAt,
                "endedAt": analyticsContext.endedAt,
                "lectureHistories": workbookContext.lectureHistoryId,
                "analysisType": 1 },
            (response) => {
                console.log(response);
            }
        )
        analyticsContext.startedAt = null;
        analyticsContext.endedAt = null;
        modal.remove();
        video.play();
        initializeStatusCount(0);
        setAnalysisType(ANALYSIS_TYPE.DEFAULT);
    };
}
