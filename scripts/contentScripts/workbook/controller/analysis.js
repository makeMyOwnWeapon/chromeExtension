import { createAndPopupModalWithHTML } from "../../modal/modal";
import { LoaAxios, HOST } from "../../network/LoaAxios";
import { URLParser } from "../../network/URLParser";
import { workbookContext } from "../workbook";
import { connect, disconnect } from "../../connection/connection";

function startAnalysis() {
    workbookContext.isAnalyzing = true;
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
                학습 보조 아이콘-Workbook을 통해 분석 시작 버튼을 눌러주세요
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
            학습 보조 아이콘에서 분석 종료 버튼을 누르면 결과가 저장됩니다!
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
        connect();
        analysisStartBtn.disabled = true;
        analysisStartBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">분석 요청중</span>
        `
        LoaAxios.post(
            `${HOST}/api/lecture/sub-lecture/history`,
            {
                subLectureUrl: decodeURIComponent(URLParser.parseWithoutTab(document.location.href)),
                startedAt: new Date()
            },
            (response) => {
                if (!response.lectureHistoryId) {
                    analysisStartBtn.innerHTML = '<span role="status">재시도</span>'
                    analysisStartBtn.disabled = false;
                    return;
                }
                startAnalysis();
                removeInfoModalIfExist();
                analysisStartBtn.innerHTML = '<span role="status">분석중</span>'
                workbookContext.curLectureHistoryId = response.lectureHistoryId;
            }
        );
    })

    const analysisEndBtn = document.getElementById("analysis-end-btn");
    analysisEndBtn.addEventListener('click', () => {
        if (!isAnalyzing()) {
            return;
        }
        disconnect();
        analysisEndBtn.disabled = true;
        analysisEndBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">분석 종료중</span>
        `
        const lectureHistoryId = workbookContext.curLectureHistoryId;
        LoaAxios.patch(
            `${HOST}/api/lecture/sub-lecture/history/${lectureHistoryId}`,
            {
                endedAt: new Date()
            },
            (response) => {
                if (response.lectureHistoryId !== lectureHistoryId) {
                    analysisEndBtn.innerHTML = '<span> 분석 실패 </span>'
                    return;
                }
                endAnalysis();            
                analysisStartBtn.innerHTML = '<span> 분석 시작 </span>'
                analysisStartBtn.disabled = false;
                analysisEndBtn.innerHTML = '<span> 분석 종료 </span>'
                analysisEndBtn.disabled = false;
                removeInfoModalIfExist();
            }
        );
    })
}