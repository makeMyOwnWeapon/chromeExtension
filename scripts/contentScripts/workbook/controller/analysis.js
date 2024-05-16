import { createAndPopupModalWithHTML } from "../../modal/modal";
import { LoaAxios, HOST } from "../../network/LoaAxios";
import { formatDate } from "../../network/TimeFomater";
import { showReportModal } from "../../report/reportmodal";
import { pauseLectureVideo, playLectureVideo, workbookContext } from "../workbook";
import { analyticsContext, getWebcamAndAddCaptureEvent, stopWebcam, toggleWebcam } from "./webcam";

export const ANALYSIS_TYPE = {
    PRE_SLEEP: 0,
    SLEEP: 1,
    PRE_LEAVE_SEAT: 2,
    LEAVE_SEAT: 3,
    DEFAULT: 99
}

function startAnalysis() {
    workbookContext.isAnalyzing = true;
    const quizsetsContainer = document.getElementById('quizsets-container');

    if (quizsetsContainer) {
        quizsetsContainer.style.display = 'none';
        toggleWebcam(true);
        addAnalysisBoard();
    }
}

function endAnalysis() {
    workbookContext.isAnalyzing = false;

    const analysisEndBtn = document.getElementById("analysis-end-btn");
    const analysisStartBtn = document.getElementById("analysis-start-btn");
    const popupTimesView = document.getElementById("popuptime-preview");
    const congratulationsMessage = document.getElementById("congratulations-message");

    if (analysisEndBtn) {
        toggleWebcam(false);
        removeAnalysisBoard();
        analysisEndBtn.style.display = 'none';
        popupTimesView.style.display = 'none';
        analysisStartBtn.style.display = 'none';
        congratulationsMessage.style.display = 'block';
    }
    showReportModal();
}


function removeInfoModalIfExist() {
    const modal = document.getElementById('analysis-info-modal');
    if (modal) {
        modal.remove();
    }
}

function addAnalysisBoard() {
    const analysisBoard = document.createElement("div");
    analysisBoard.id = "analysis-board";
    analysisBoard.innerHTML = "<span id='analysis-status-icon'>🟢</span> <span id='analysis-status-text'>상태 감지중</span>";
    workbookContext.videoElement.parentNode.prepend(analysisBoard);
}

function removeAnalysisBoard() {
    const analysisBoard = document.querySelector('#analysis-board');
    analysisBoard.remove();
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
    const startedAt = formatDate(new Date());
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
            startedAt: startedAt,
            subLectureId: workbookContext.subLectureId
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
                analysisStartBtn.innerHTML = '<span role="status"><i class="bi bi-record-circle record"></i>학습중</span>'
                workbookContext.lectureHistoryId = response.lectureHistoryId;
                playLectureVideo();
            }
        );
    });

    const analysisEndBtn = document.getElementById("analysis-end-btn");
    analysisEndBtn.addEventListener('click', () => {
        if (!isAnalyzing()) {
            return;
        }
        analysisEndBtn.disabled = true;
        analysisEndBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">학습 종료중</span>
        `;

        const endedAt = formatDate(new Date());

        const patchData = {
            lectureHistoryId: workbookContext.lectureHistoryId,
            endedAt: endedAt
        };

        LoaAxios.patch(
            `${HOST}/api/lecture/sub-lecture/history/`, patchData,
            (response) => {
                if (response.lectureHistoryId !== workbookContext.lectureHistoryId) {
                    analysisEndBtn.innerHTML = '<span> 종료 실패 </span>'
                    return;
                }
                endAnalysis();
                pauseLectureVideo();
                clearInterval(analyticsContext.videoIntervalId);
                stopWebcam();
                analysisStartBtn.innerHTML = '<span> 학습 시작 </span>'
                analysisStartBtn.disabled = false;
                analysisEndBtn.innerHTML = '<span> 학습 종료 </span>'
                analysisEndBtn.disabled = false;
                removeInfoModalIfExist();
            }
        );
    });
}

export function setAnalysisType(analysisType) {
    const statusIcon = document.getElementById('analysis-status-icon');
    const statusText = document.getElementById('analysis-status-text');
    const webCam = document.getElementById('web-cam');
    switch (analysisType) {
        case ANALYSIS_TYPE.PRE_SLEEP:
            statusIcon.innerText = "🥱"
            statusText.innerText = "졸음 경보";
            webCam.className = 'pre-sleep';
            break;
        case ANALYSIS_TYPE.SLEEP:
            statusIcon.innerText = "😴"
            statusText.innerText = "졸음 감지";
            webCam.className = 'sleep';
            break;
        case ANALYSIS_TYPE.PRE_LEAVE_SEAT:
            statusIcon.innerText = "🫨"
            statusText.innerText = "자리 이탈 경보";
            webCam.className = 'pre-leave-seat';
            break;
        case ANALYSIS_TYPE.LEAVE_SEAT:
            statusIcon.innerText = "🫥"
            statusText.innerText = "자리 이탈";
            webCam.className = 'leave-seat';
            break;
        default:
            statusIcon.innerText = "🟢"
            statusText.innerText = "상태 감지중";
            webCam.className = 'default';
            break;
    }
}