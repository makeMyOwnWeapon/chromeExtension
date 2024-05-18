import { createAndPopupModalWithHTML } from '../modal/modal.js';
import { LoaAxios, HOST } from '../network/LoaAxios.js';
import { formatDate } from '../utils/TimeFomater.js';
import { analyticsContext, initializeStatusCount } from '../workbook/controller/webcam.js';
import { workbookContext } from '../workbook/workbook.js'
import { ANALYSIS_TYPE, setAnalysisType } from '../workbook/controller/analysis.js';

export function showWakeUpModal() {
    let modal = document.getElementById("analysis-info-modal");
    
    if (modal) {
        return;
    }
    const video = workbookContext.videoElement;
    video.pause();
    modal = createAndPopupModalWithHTML({
        headerHTML: `
        <div class="modal-header header-text">
            <p>졸음이 감지되었습니다!!!</p>
        </div>
        `,
        bodyHTML: `
        <div class="modal-body">
            <video autoplay loop class='wakeup-video'>
                <source src='${chrome.runtime.getURL('videos/wakeup.mp4')}' type="video/mp4"></source>
            </video>
        </div>
        `,
        footerHTML: `
        <div class="modal-footer">
            <button id="dismissButton">알람 끄기</button>
        </div>
        `
    });
    modal.id = "analysis-info-modal";
    const dismissButton = document.getElementById('dismissButton');
    dismissButton.onclick = function () {
        analyticsContext.endedAt = formatDate(new Date());
        LoaAxios.post(
            `${HOST}/api/analytics/save`,
            {
                "startedAt": analyticsContext.startedAt,
                "endedAt": analyticsContext.endedAt,
                "lectureHistories": workbookContext.lectureHistoryId,
                "analysisType": 0
            },
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
