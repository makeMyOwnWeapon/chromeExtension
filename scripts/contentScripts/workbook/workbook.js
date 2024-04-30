
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
        console.log('currentTime', currentTime);
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

function makeWorkbookHTML() {
    return `
    <div style="width: 100%">
        <div class="list-group">
            <button class="list-group-item" aria-current="true">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">AI가 생성한 문제</h5>
            </div>
            <p class="mb-1">LOA AI</p>
            </button>
            <button class="list-group-item active" aria-current="true">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">소단원 중심의 문제</h5>
                <small><i class="bi bi-hand-thumbs-up-fill"></i> 15</small>
            </div>
            <p class="mb-1">의도한 짜장면</p>
            </button>
            <button class="list-group-item ">
            <div>
                <h5 class="mb-1">뽀모도로 학습법에 기반한 문제</h5>
                <small><i class="bi bi-hand-thumbs-up-fill"></i> 3</small>
            </div>
            <p class="mb-1">성실한 단무지</p>
            </button>
        </div>
        <div>
            <button class="btn btn-primary d-inline-flex align-items-center center" type="button">
            문제집 만들기
            </button>
        </div>
        <div>
            <div class="position-relative m-4" style="margin-bottom: 30px;">
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
    updateWorkbookContent(makeWorkbookHTML(), [initializeEventForPopupQuiz]);
}