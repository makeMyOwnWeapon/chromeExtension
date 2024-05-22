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
        <div class="modal-header sleep-modal-header header-text">
        <img src="https://velog.velcdn.com/images/byk0316/post/5f89557b-72ba-4821-9552-41a3401d8f73/image.png" alt="loa img" class="header-image">
            <p>졸음이 감지되었습니다!!!</p>
        </div>
        `,
        bodyHTML: `
        <div class="modal-body sleep-modal-body">
            <video autoplay loop class='wakeup-video'>
                <source src='${chrome.runtime.getURL('videos/wakeup_subtitle.mp4')}' type="video/mp4"></source>
            </video>
        </div>
        `,
        footerHTML: `
        <div class="modal-footer sleep-modal-footer">
            <button id="dismissButton">
                <i class="bi bi-caret-right-fill"></i> 재개하기
            </button>
        </div>
        `
    });
    modal.id = "analysis-info-modal";
    modal.classList.add('analysis-sleep');
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
