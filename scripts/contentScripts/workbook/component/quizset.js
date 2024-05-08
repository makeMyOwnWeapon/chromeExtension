import { HOST, LoaAxios } from "../../network/LoaAxios";
import { workbookContext } from "../workbook";

function formatDate(dateString) {
    const date = new Date(dateString);
    const currentDate = new Date();

    const diffInMilliseconds = currentDate - date;
    const diffInSeconds = diffInMilliseconds / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;
    const diffInWeeks = diffInDays / 7;
    const diffInMonths = diffInDays / 30;

    if (diffInDays < 1) {
        return '오늘';
    } else if (diffInDays < 7) {
        return `${Math.floor(diffInDays)}일 전`;
    } else if (diffInWeeks < 4) {
        return `${Math.floor(diffInWeeks)}주 전`;
    } else {
        return `${Math.floor(diffInMonths)}개월 전`;
    }
}

function PopuptimeCarrotView(popuptime) {
    const totalTime = workbookContext.videoElement.duration;
    const timeRatio = parseInt(popuptime / totalTime * 100);
    return `<i class="bi bi-caret-down-fill position-absolute start-${timeRatio}"></i>`
}

export function QuizSetView(quizsetId, quizSetTitle, quizSetAuthor, recommendationCount, createAt) {
    const elementId = `quizset-${quizsetId}`;
    return `
        <button class="list-group-item quizset" id="${elementId}">
            <div class="quizset-title-container">
                <h2 class="quizset-title">${quizSetTitle}</h2>
                <span><i class="bi bi-hand-thumbs-up-fill" id="recommendation-btn"></i> ${recommendationCount}</span>
            </div>
            <p class="author-nickname">${quizSetAuthor} <span class="create-at">${formatDate(createAt)}</span></p>
        </button>
        `
};

export function renderPopupTimeCarrot() {
    if (!workbookContext.curQuizzes.length) {
        return;
    }
    const popuptimesView = document.getElementById('popuptimes-view');
    popuptimesView.innerHTML = workbookContext.curQuizzes.map(quiz => {
        return PopuptimeCarrotView(quiz.popupTime);
    }).join('\n');
}

export function sweepQuizset(quizsetId) {
    const prevSelectedQuizset = document.getElementById(`quizset-${quizsetId}`);
    if (prevSelectedQuizset) {
        prevSelectedQuizset.classList.remove("selected");
    }
}

export function markQuizset(quizsetId) {
    workbookContext.selectedQuizsetId = quizsetId;
    const selectedQuizset = document.getElementById(`quizset-${quizsetId}`);
    if (selectedQuizset) {
        selectedQuizset.classList.add("selected");
    }
}

export function QuizSetController(quizsetId) {
    const onclickHandler = () => {
        fetchQuizzes(quizsetId);
        sweepQuizset(workbookContext.selectedQuizsetId);
        markQuizset(quizsetId);
    };

    function fetchQuizzes(quizsetId) {
        LoaAxios.get(
            `${HOST}/api/quizsets/${quizsetId}/quizzes?commentary=true&answer=true`,
            (response) => {
                workbookContext.curQuizzes = response;
                renderPopupTimeCarrot();
            }
        );
    }
    return onclickHandler;
};

export function AIQuizSetController() {
    const totalMinutes = workbookContext.videoElement.duration / 60;
    const popupTimes = [];

    const onclickHandler = (event) => {
        const quizsetBtn = event.target.closest('.quizset');
        if (quizsetBtn.classList.contains("selected")) {
            quizsetBtn.classList.remove("selected");
        } else {
            // TODO: 강의 스크립트를 모아, 문제를 만들어내는 이벤트 등록
            if (popupAIQuizInfo()) {
                console.log("ai ok");
                const video = workbookContext.videoElement;
                turnOnSubtitle(video);
                video.addEventListener('timeupdate', () => {})
            } else {
                console.log("ai no");
                quizsetBtn.classList.add("selected");
            }
            quizsetBtn.classList.add("selected");
        }
    };


    function popupAIQuizInfo() {
        return confirm("AI must turn on subtitle, total time must be larger than 5 minute");
    }

    function turnOnSubtitle(video) {
        
    }

    function fetchQuiz() {
        LoaAxios.get(
            '',
            (response) => {
                workbookContext.curQuizzes = response;
            }
        )
    }
    return onclickHandler;
}