import { workbookContext } from "../workbook";

function startAnalysis(someArgs) {
    workbookContext.isAnalyzing = true;
}
  
function endAnalysis(someArgs) {
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
    const videoContainer = document.querySelector('.shaka-video-container');
    const modal = document.createElement('div');
    modal.classList.add("overlay");
    modal.id = "analysis-info-modal";
    modal.innerHTML = `
        <div class="modal-content center">
            <div class="modal-body">
                학습 보조 아이콘-Workbook을 통해 분석 시작 버튼을 눌러주세요
            </div>
        </div>
    `
    videoContainer.parentNode.appendChild(modal);
}

export function addAnalysisInfoModalIfAnalysisDone() {
    if (!isAnalyzing()) {
        return;
    }
    const videoContainer = document.querySelector('.shaka-video-container');
    const modal = document.createElement('div');
    modal.classList.add("overlay");
    modal.id = "analysis-info-modal";
    modal.innerHTML = `
        <div class="modal-content center">
            <div class="modal-body">
                학습 보조 아이콘에서 분석 종료 버튼을 누르면 결과가 저장됩니다!
            </div>
        </div>
    `
    videoContainer.parentNode.appendChild(modal);
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
            <span role="status">분석 요청중</span>
        `
        setTimeout(() => {
            startAnalysis('');
            removeInfoModalIfExist();
            analysisStartBtn.innerHTML = '<span role="status">분석중</span>'
        }, 2000);
    })

    const analysisEndBtn = document.getElementById("analysis-end-btn");
    analysisEndBtn.addEventListener('click', () => {
        if (!isAnalyzing()) {
            return;
        }
        analysisEndBtn.disabled = true;
        analysisEndBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status">분석 종료중</span>
        `
        setTimeout(() => {
            endAnalysis('');            
            analysisEndBtn.innerHTML = '<span role="status">기록 완료</span>'
            analysisStartBtn.innerHTML = '<span> 분석 시작 </span>'
            analysisStartBtn.disabled = false;
            analysisEndBtn.innerHTML = '<span> 분석 종료 </span>'
            analysisEndBtn.disabled = false;
            removeInfoModalIfExist();
        }, 2000);
    })
}