import { createAndPopupModalWithHTML } from "../../modal/modal";
import { LoaAxios, HOST } from "../../network/LoaAxios";
import { workbookContext } from "../workbook";
import { analyticsContext, getWebcamAndAddCaptureEvent, stopWebcam } from "./webcam";

function startAnalysis() {
    workbookContext.isAnalyzing = true;
    const quizsetsContainer = document.getElementById('quizsets-container');
    if (quizsetsContainer) {
        quizsetsContainer.style.display = 'none';
    }
}
  
function endAnalysis() {
    workbookContext.isAnalyzing = false;
}

function removeInfoModalIfExist() {
    const modal = document.getElementById('analysis-info-modal');
    if (modal) {
        modal.remove();
    }
}


export function addAnalysisInfoModalIfNotAnalyzing() {
    if (isAnalyzing()) {
        return;
    }
    workbookContext.videoElement.pause();
    const modal = createAndPopupModalWithHTML({
        bodyHTML: `
            <div class="modal-body">
                학습 보조 아이콘-Workbook을 통해 학습 시작 버튼을 눌러주세요
            </div>
        `
        });
    modal.id = "analysis-info-modal";
}

export function addAnalysisInfoModalIfAnalysisDone() {
    if (!isAnalyzing()) {
        return;
    }
    const modal = createAndPopupModalWithHTML({
        bodyHTML: `
            <div class="modal-body">
            학습 보조 아이콘에서 학습 종료 버튼을 누르면 결과가 저장됩니다!
            </div>
        `
        });
    modal.id = "analysis-info-modal";
}

export function isAnalyzing() {
    return workbookContext.isAnalyzing;
}

export function refreshAnalysisBtn() {
    const analysisStartBtn = document.getElementById("analysis-start-btn");
    analysisStartBtn.addEventListener('click', () => {
        if (isAnalyzing()) {
            return;
        }
        analysisStartBtn.disabled = true;
        analysisStartBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span role="status">요청중</span>
        `;

        const postData = {
            subLectureId : workbookContext.subLectureId
        };

        LoaAxios.post(
            `${HOST}/api/lecture/sub-lecture/history`,
            postData,
            async (response) => {	
                if (!response.lectureHistoryId) {	
                    analysisStartBtn.innerHTML = '<span role="status">재시도</span>'	
                    analysisStartBtn.disabled = false;	
                    return;	
                }
                startAnalysis();
                removeInfoModalIfExist();
                const temp = await getWebcamAndAddCaptureEvent();
                analyticsContext.videoIntervalId = temp;
                analysisStartBtn.innerHTML = '<span role="status">학습중</span>'	
                workbookContext.lectureHistoryId = response.lectureHistoryId;	
            }	
        );
    })

    const analysisEndBtn = document.getElementById("analysis-end-btn");
    analysisEndBtn.addEventListener('click', () => {
        showReportModal();
        if (!isAnalyzing()) {
            return;
        }
        analysisEndBtn.disabled = true;
        analysisEndBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">학습 종료중</span>
        `;

        const patchData = {
            lectureHistoryId : workbookContext.lectureHistoryId
        };

        LoaAxios.patch(	
            `${HOST}/api/lecture/sub-lecture/history/`, patchData,
            (response) => {	
                if (response.lectureHistoryId !== workbookContext.lectureHistoryId) {	
                    analysisEndBtn.innerHTML = '<span> 종료 실패 </span>'	
                    return;
                }
                endAnalysis();
                clearInterval(analyticsContext.videoIntervalId);
                stopWebcam();
                analysisStartBtn.innerHTML = '<span> 학습 시작 </span>'	
                analysisStartBtn.disabled = false;	
                analysisEndBtn.innerHTML = '<span> 학습 종료 </span>'	
                analysisEndBtn.disabled = false;	
                removeInfoModalIfExist();	
            }	
        );
    })
}
