import { HOST, LoaAxios } from "../../network/LoaAxios";
import { workbookContext } from "../workbook";
import { SubtitleContentsRequest, loadSubtitles } from "../../subtitle/subtitle";
import { showQuizCreateLoadingModal } from "../../modal/reportcreateloadingmodal";

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
        return "오늘";
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
    const timeRatio = parseInt((popuptime / totalTime) * 100);
    const minutes = Math.floor(popuptime / 60);
    const seconds = popuptime % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    return `
        <i class="bi bi-caret-down-fill position-absolute start-${timeRatio}" data-popup-time="${popuptime}">
            <span class="popup-time">${timeString}</span>
        </i>`;
}

export function QuizSetView(
    quizsetId,
    quizSetTitle,
    quizSetAuthor,
    recommendationCount,
    createAt
) {
    const elementId = `quizset-${quizsetId}`;
    return `
        <div class="list-group-item quizset" id="${elementId}">
            <div class="quizset-title-container">
                <h2 class="quizset-title">${quizSetTitle}</h2>
                <div class="recommendation-box"><i class="bi bi-hand-thumbs-up" id="recommendation-btn"></i> <span id="recommendation-count">${recommendationCount}</span></div>
            </div>
            <p class="author-nickname">
                ${quizSetAuthor} <span class="create-at">${formatDate(createAt)}</span>
            </p>
        </div>
        `;
}

export function renderPopupTimeCarrot() {
    if (!workbookContext.curQuizzes.length) {
        return;
    }
    const popuptimesView = document.getElementById("popuptimes-view");
    popuptimesView.innerHTML = workbookContext.curQuizzes
        .map((quiz) => {
            return PopuptimeCarrotView(quiz.popupTime);
        })
        .join("\n");

    // 모든 <i> 요소에 클릭 이벤트 리스너 추가
    const caretElements = popuptimesView.querySelectorAll(".bi-caret-down-fill");
    caretElements.forEach((caretElement) => {
        caretElement.addEventListener("click", () => {
            const popupTime = parseInt(caretElement.getAttribute("data-popup-time"));
            workbookContext.videoElement.currentTime = popupTime - 1;
            workbookContext.videoElement.play();
        });
    });
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
        document.getElementById("analysis-start-btn").style.display='';
    };

    // For Debugging
    function printQuizPopupTime() {
        console.log(
            workbookContext.curQuizzes.map((quiz) => {
                const time = quiz.popupTime;
                return `${parseInt(time / 60)}:${time % 60}`;
            })
        );
    }

    function fetchQuizzes(quizsetId) {
        LoaAxios.get(
            `${HOST}/api/quizsets/${quizsetId}/quizzes`,
            (response) => {
                workbookContext.curQuizzes = response;
                workbookContext.curQuizzes.forEach((quiz) => {
                    quiz.isPopuped = false;
                    quiz.isSended = false;
                });
                renderPopupTimeCarrot();
            }
        );
    }
    return onclickHandler;
}

export function AIQuizSetController() {
    let quizRequestTimes = [];

    const onclickHandler = async (event) => {
        if (!popupAIQuizInfo()) {
            return;
        }
        const closeModalHandler = showQuizCreateLoadingModal();
        await select(closeModalHandler);
    };

    function calculateRequestTimes(durationInSeconds) {
        let quizRequestTimes = [];
        const durationInMinutes = durationInSeconds / 60; // 3000 / 60 = 50

        let numberOfQuizzes;
        if (durationInMinutes < 5) {
            return [];
        } else if (durationInMinutes <= 10) {
            numberOfQuizzes = 1;
        } else if (durationInMinutes <= 60) {
            numberOfQuizzes = 3;
        } else {
            numberOfQuizzes = Math.min(Math.ceil(durationInMinutes / 20), 5); // 3 ~ 5개로 책정
        }
        const interval = durationInSeconds / (numberOfQuizzes + 1);
        for (let i = 1; i <= numberOfQuizzes; i++) {
            quizRequestTimes.push(Math.round(interval * i));
        }
        return quizRequestTimes;
    }

    async function select(callback) {
        const video = workbookContext.videoElement;
        quizRequestTimes = calculateRequestTimes(parseInt(video.duration));
        if (quizRequestTimes.length === 0) {
            return;
        }
        await loadSubtitles();
        await fetchAllQuiz();
        callback();
    }

    function popupAIQuizInfo() {
        return confirm(
            "AI 문제집을 생성하시겠습니까? (강의 시간이 5분 이내라면 생성되지 않습니다)"
        );
    }

    function getSubtitleContents(prevReqTime, reqTime) {
        const subtitleRequest = new SubtitleContentsRequest();
        return subtitleRequest.getRangeSubtitleContents(prevReqTime, reqTime);
    }

    function hasAllProperties(response) {
        return (
            response.instruction &&
            response.commentary &&
            response.choices.length > 0 &&
            response.popupTime > 0
        );
    }

    async function fetchAllQuiz() {
        for (let i = 0; i < quizRequestTimes.length; i++) {
            await fetchQuiz(i);
        }
    }

    function fetchQuiz(i) {
        return new Promise((resolve, reject) => {
            const reqTime = quizRequestTimes[i];
            const prevReqTime = i ? quizRequestTimes[i - 1] : 0;
            LoaAxios.post(
                `${HOST}/api/quizsets/llm`,
                {
                    subLectureId: workbookContext.subLectureId,
                    script: getSubtitleContents(prevReqTime, reqTime),
                    popupTime: reqTime,
                },
                (response) => {
                    if (hasAllProperties(response)) {
                        workbookContext.curQuizzes.push(response);
                        workbookContext.curQuizzes.forEach((quiz) => {
                            quiz.isPopuped = false;
                            quiz.isSended = false;
                        });
                        resolve();
                    } else {
                        reject('invalid response');
                    }
                }
            );
        });
    }

    return onclickHandler;
}
