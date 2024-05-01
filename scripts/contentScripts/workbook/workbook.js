import { Quizsets } from "./component/quizsets";
import { Queue } from "../utils/Queue";
import { popupQuiz } from "./component/quiz";

// [ {targetElementId: handler} ... ]
export const handlerRegisterQueue = new Queue();
export const initializerRegisterQueue = new Queue();
export const workbookContext = {
    totalTime: 0,
    popupQuizzes : [],
    solved : [],
    lastSolvedIndex : 0,
    videoElement: null,
};


initializerRegisterQueue.enqueue(initializeEventForPopupQuiz);

function loadDefaultElements() {
    loadVideoElement();
    loadQuizModal();
}

function loadVideoElement() {
    workbookContext.videoElement = document.getElementsByTagName('video')[0];
}

function loadQuizModal() {
    /**
     * TODO: 유튜브로 올린 영상 처리
     * - 유튜브 영상이면 iframe을 담겨있음.
     */
    const videoContainer = document.querySelector('.shaka-video-container');
    const quiz = document.createElement('div');
    quiz.id = 'quiz-modal';
    quiz.classList.add('overlay');
    quiz.hidden = true;
    videoContainer.parentNode.prepend(quiz);
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
        console.log("job.elementId", job.elementId);
    }
}

const popupTimes = [2, 4, 6]
const solved = Array(popupTimes.length).fill(false);
let lastSolvedIndex = 0

function initializeEventForPopupQuiz() {
    const video = document.getElementsByTagName('video')[0];
    video.addEventListener('timeupdate', () => {
        const currentTime = video.currentTime;
        for (let i = lastSolvedIndex; i < popupTimes.length; i++) {
            const parsedTime = parseInt(currentTime);
            if (parsedTime < popupTimes[i])
                return
            if (solved[i])
                continue;
            if (parsedTime === popupTimes[i]) {
                solved[i] = true;
                lastSolvedIndex += 1;
                video.pause();
                popupQuiz();
            }
        }
    });
}

function makeWorkbookHTML_TOBE() {
    const subLectureURL = document.location.href;
    return `
    <div style="width: 100%">
        ${ Quizsets(subLectureURL) }
        <div>
            <a class="btn center" href='http://127.0.0.1:3002/create' target='_blank'>
                문제집 만들기
            </a>
        </div>
        <div id='popuptime-preview'>
            <div id="popuptimes-view" class="position-relative m-4"></div>
            <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: 100%"></div>
            </div>
        </div>
    </div>
    `;
}

export function displayWorkbookContent() {
    loadDefaultElements()
    updateWorkbookContent(makeWorkbookHTML_TOBE());
}