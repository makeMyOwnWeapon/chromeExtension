import { Quizsets } from "./component/quizsets";

// [ {targetElementId: handler} ... ]
export const handlerRegisterQueue = [];

function updateWorkbookContent(content, afterCreateInitializers) {
    const navbarContent = document.getElementById('navbarContent');
    if (navbarContent) {
        navbarContent.innerHTML = content;
    } else {
        console.error('Navbar content element not found');
    }
    afterCreateInitializers.forEach(init => {
        init();
    });
    handlerRegisterQueue.forEach(job => {
        const targetEl = document.getElementById(job.elementId)
        targetEl.addEventListener(job.type, job.handler);
    });
    handlerRegisterQueue.length = 0;
}

function removePopup() {
    const popupQuiz = document.getElementById('popup-quiz');
    popupQuiz.remove();
}

function initializeEventForPopupCloseBtnWith(handler) {
    const popupQuizCloseBtn = document.getElementById('popup-quiz-close-btn')
    popupQuizCloseBtn.addEventListener('click', () => {
        removePopup();
        handler();
    })
}

function closeBtnHandler() {
    const video = document.getElementsByTagName('video')[0];
    video.play();
}

function popupQuizWith(handler) {
    popupQuiz()
    initializeEventForPopupCloseBtnWith(handler);
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
                popupQuizWith(closeBtnHandler);
            }
        }
    });
}

function popupQuiz() {
    /**
     * TODO: 유튜브로 올린 영상 처리
     * - 유튜브 영상이면 iframe을 담겨있음.
     */
    const videoPlayer = document.querySelector('.shaka-video-container');
    const quiz = document.createElement('div');
    quiz.id = 'popup-quiz';
    quiz.classList.add('overlay');
    quiz.innerHTML = `
        <div class="modal-content>
            <div class="modal-header">
                <h1 class="modal-title">문제 1</h1>
                <button type="button" id='popup-quiz-close-btn' class="btn-close">x</button>
            </div>
            <div class="modal-body">
                <button type="button" class="btn">가상 메모리는 진짜 가상일뿐이다. 하드웨어와 관련이 없다.</button>
                <button type="button" class="btn">가상화 기술에는 가상 메모리밖에 없다.</button>
                <button type="button" class="btn">CPU 가상화를 이루기 위해서 시분할 기법을 사용한다.</button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn">제출</button>
            </div>
        </div>
    `;
    videoPlayer.parentNode.prepend(quiz);
}

function makeWorkbookHTML_TOBE() {
    const subLectureName = ''
    const mainLectureName = ''
    const subLectureURL = ''

    return `
    <div style="width: 100%">
        ${ Quizsets(subLectureName, mainLectureName, subLectureURL) }
        <div>
            <button class="btn btn-primary d-inline-flex align-items-center center" type="button">
            문제집 만들기
            </button>
        </div>
        <div id='popuptime-preview'>
            <div id="popuptimes-view" class="position-relative m-4">
                <i class="bi bi-caret-down-fill position-absolute start-20"></i>
                <i class="bi bi-caret-down-fill position-absolute start-60"></i>
                <i class="bi bi-caret-down-fill position-absolute start-80"></i>
            </div>
            <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar" style="width: 100%"></div>
            </div>
        </div>
    </div>
    `;
}

export function displayWorkbookContent() {
    updateWorkbookContent(makeWorkbookHTML_TOBE(), [initializeEventForPopupQuiz]);
}