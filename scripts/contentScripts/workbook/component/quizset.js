import { workbookContext } from "../workbook";
import { popupQuiz } from "./quiz";

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

export function QuizSet(quizsetId) {
    let totalTime = workbookContext.videoElement.duration;

    const onclickHandler = () => {
        fetchQuizzes(quizsetId);
    };

    function renderPopupTimeCarrot() {
        const popuptimesView = document.getElementById('popuptimes-view');
        popuptimesView.innerHTML = workbookContext.curQuizzes.map(quiz => {
            return PopuptimeCarrot(quiz.popupTime);
        }).join('\n');
    }

    function fetchQuizzes(quizsetId) {
        chrome.storage.local.get('authToken', function(data) {
            if (!data.authToken) {
                console.error("Doesn't have authToken");
                return;
            }
            const token = data.authToken;
            const options = {
                method: 'GET', // 데이터 전송 방식 지정
                headers: {
                    'Authorization': `Bearer ${token}`, // 컨텐츠 타입 지정
                }
            }
            chrome.runtime.sendMessage({
                type: 'fetch',
                url: `http://localhost:3000/api/quizsets/${quizsetId}/quizzes?commentary=true&answer=true`,
                options: options
            }, (response) => {             
                workbookContext.curQuizzes = response;
                renderPopupTimeCarrot();
                initializeEventForPopupQuiz();
            });
        });
    }

    function PopuptimeCarrot(popuptime) {
        const timeRatio = parseInt(popuptime / totalTime * 100);
        return `<i class="bi bi-caret-down-fill position-absolute start-${timeRatio}"></i>`
    }

    function initializeEventForPopupQuiz() {
        const video = workbookContext.videoElement;
        const quizzes = workbookContext.curQuizzes;
        const popupTimes = quizzes.map((quiz) => { return quiz.popupTime;})
            .sort((t1, t2) => t1 - t2);
        const solved = Array(popupTimes.length).fill(false);
        workbookContext.lastSolvedIndex = 0;
        video.addEventListener('timeupdate', () => {
            const currentTime = video.currentTime;
            for (let i = workbookContext.lastSolvedIndex; i < quizzes.length; i++) {
                const parsedTime = parseInt(currentTime);
                if (parsedTime < popupTimes[i])
                    return
                if (solved[i])
                    continue;
                if (parsedTime === popupTimes[i]) {
                    solved[i] = true;
                    popupQuiz();
                    video.pause();
                }
            }
        });
    }

    function recommendHandler() {
        return () => {
            console.log("recommend!");
        }
    }

    function addRecommendListener() {
        const recommendBtn = document.getElementById('recommend-btn');
        recommendBtn.addEventListener('click', recommendHandler);
    }

    return onclickHandler;
};