import { addQuizsetsAndRender } from "./component/quizsets";

export const workbookContext = {
    totalTime: 0,
    curQuizzes : [],
    solved : [],
    lastSolvedIndex : 0,
    videoElement: null,
};

function loadDefaultElements() {
    loadVideoElement();
}

function loadVideoElement() {
    workbookContext.videoElement = document.getElementsByTagName('video')[0];
}

function updateWorkbookContent(content) {
    const navbarContent = document.getElementById('navbarContent');
    if (!navbarContent) {
        console.error('Navbar content element not found');
        return;
    }
    navbarContent.innerHTML = content;

    while (initializerRegisterQueue.size()) {
        const init = initializerRegisterQueue.dequeue();
        init();
    }
    while (handlerRegisterQueue.size()) {
        const job = handlerRegisterQueue.dequeue();
        const targetEl = document.getElementById(job.elementId)
        targetEl.addEventListener(job.type, job.handler);
    }
}

function makeWorkbookHTML_TOBE() {
    return `
    <div style="width: 100%">
        <div class="list-group quizsets" id="quizsets-container">
        </div>
        <div>
            <a class="btn create-quizsets-btn" href='http://127.0.0.1:3002/create' target='_blank'>
                문제집 만들기
            </a>
        </div>
        <div id='popuptime-preview'>
            <div id="popuptimes-view" class="position-relative m-4"></div>
            <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%; background-color: lightgray"></div>
            </div>
        </div>
    </div>
    `;
}

export function displayWorkbookContent() {
    loadDefaultElements()
    updateWorkbookContent(makeWorkbookHTML_TOBE());
    addQuizsetsAndRender(document.location.href);
}