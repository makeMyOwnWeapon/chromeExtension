import { createAndPopupModalWithHTML } from "../../modal/modal";
import { LoaAxios, HOST } from "../../network/LoaAxios";
import { URLParser } from "../../network/URLParser";
import { workbookContext } from "../workbook";
//import { connect, disconnect } from "../../connection/connection";

function startAnalysis(/*analysisStartBtn*/) {
    workbookContext.isAnalyzing = true;
    // removeInfoModalIfExist();
    // analysisStartBtn.innerHTML = '<span role="status">학습중</span>'
}
  
function endAnalysis(/*analysisStartBtn, analysisEndBtn*/) {
    workbookContext.isAnalyzing = false; 
    // analysisStartBtn.innerHTML = '<span> 학습 시작 </span>'
    // analysisStartBtn.disabled = false;
    // analysisEndBtn.innerHTML = '<span> 학습 종료 </span>'
    // analysisEndBtn.disabled = false;
    // removeInfoModalIfExist();
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
            subLectureUrl: decodeURIComponent(URLParser.parseWithoutTab(document.location.href)),	
            startedAt: new Date()
        };

        console.log("POST 요청 보내기 전:", `${HOST}/api/lecture/sub-lecture/history`, postData);  // 요청 내용을 콘솔에 출력

        // AJAX POST 요청을 시작합니다.
        LoaAxios.post(
            `${HOST}/api/lecture/sub-lecture/history`,
            postData,	
            (response) => {	
                console.log("POST 요청 응답:", response);  // 응답을 콘솔에 출력
                if (!response.lectureHistoryId) {	
                    analysisStartBtn.innerHTML = '<span role="status">재시도</span>'	
                    analysisStartBtn.disabled = false;	
                    return;	
                }
                startAnalysis();	
                removeInfoModalIfExist();	
                analysisStartBtn.innerHTML = '<span role="status">학습중</span>'	
                workbookContext.lectureHistoryId = response.lectureHistoryId;	
            }	
        );
    })

    const analysisEndBtn = document.getElementById("analysis-end-btn");
    analysisEndBtn.addEventListener('click', () => {
        showReportModal();
        if (!isAnalyzing()) {
            console.log('학습 종료 error!');
            return;
        }
        analysisEndBtn.disabled = true;
        analysisEndBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">학습 종료중</span>
        `;

        const patchData = {
            endedAt: new Date()
        };

        const lectureHistoryId = workbookContext.lectureHistoryId;
        console.log("PATCH 요청 보내기 전:", `${HOST}/api/lecture/sub-lecture/history/${lectureHistoryId}`, patchData);  // 요청 내용을 콘솔에 출력

        // AJAX PATCH 요청을 시작합니다.
        LoaAxios.patch(	
            `${HOST}/api/lecture/sub-lecture/history/${lectureHistoryId}`,	
            patchData,	
            (response) => {	
                console.log("PATCH 요청 응답:", response);  // 응답을 콘솔에 출력
                if (response.lectureHistoryId !== lectureHistoryId) {	
                    analysisEndBtn.innerHTML = '<span> 종료 실패 </span>'	
                    return;	
                }	
                endAnalysis();            	
                analysisStartBtn.innerHTML = '<span> 학습 시작 </span>'	
                analysisStartBtn.disabled = false;	
                analysisEndBtn.innerHTML = '<span> 학습 종료 </span>'	
                analysisEndBtn.disabled = false;	
                removeInfoModalIfExist();	
            }	
        );
    })
}
