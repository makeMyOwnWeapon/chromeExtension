import { workbookContext } from "../workbook";

function startAnalysis(someArgs) {
    workbookContext.isAnalyzing = true;
}
  
function endAnalysis(someArgs) {
    workbookContext.isAnalyzing = false; 
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
            startAnalysis(someArgs);
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
            endAnalysis(someArgs);            
            analysisEndBtn.innerHTML = '<span role="status">기록 완료</span>'
            analysisStartBtn.remove();
        }, 2000);
    })
}