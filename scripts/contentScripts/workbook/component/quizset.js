import { HOST, LoaAxios } from "../../network/LoaAxios";
import { workbookContext } from "../workbook";
import { getDataFromLocalStorage, setDataLocalStorage } from "../../storage/storage";

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
    let quizRequestTimes = [];
    const safeLoadingSeconds = 60;

    const onclickHandler = (event) => {
        const quizsetBtn = event.target.closest('.quizset');
        if (quizsetBtn.classList.contains("selected")) {
            quizsetBtn.classList.remove("selected");
            deselect();
        } else {
            if (!popupAIQuizInfo()) {
                return;
            }
            quizsetBtn.classList.add(select() ? "selected" : "");
        }
    };

    function calculateRequestTimes(durationInSeconds) {
        let quizRequestTimes = [];
        const durationInMinutes = durationInSeconds / 60; // 3000 / 60 = 50

        let numberOfQuizzes;
        if (durationInMinutes < 5) {
            return []
        } else if (durationInMinutes <= 10) {
            numberOfQuizzes = 1;
        } else if (durationInMinutes <= 60) {
            numberOfQuizzes = 3;
        } else {
            numberOfQuizzes = Math.min(Math.max(Math.floor(durationInMinutes / 20), 3), 5);
        }
        const interval = durationInSeconds / (numberOfQuizzes + 1);
        for (let i = 1; i <= numberOfQuizzes; i++) {
            quizRequestTimes.push(Math.round(interval * i));
        }
        return quizRequestTimes;
    }

    function select() {
        const video = workbookContext.videoElement;
        addScriptFetcher(video);
        quizRequestTimes = calculateRequestTimes(parseInt(video.duration));
        console.log("quizRequestTimes", quizRequestTimes);
        if (quizRequestTimes.length > 0) {
            video.addEventListener('timeupdate', fetchQuiz);
            return true;
        }
        return false;
    }

    function deselect() {
        if (confirm("AI 문제집 생성이 종료됩니다.")) {
            const video = workbookContext.videoElement;
            video.removeEventListener('timeupdate', fetchQuiz);
            getKoreanTextTrack(video).removeEventListener('cuechange', fetchScript);
        }
    }

    function popupAIQuizInfo() {
        return confirm("AI 문제집을 생성하시겠습니까? (강의 시간이 5분 이내라면 생성되지 않습니다)");
    }

    function getKoreanTextTrack(video) {
        for (let i = 0; i < video.textTracks.length; i++) {
            const track = video.textTracks[i];
            if (track.language === 'ko') {
                return track;
            }
        }
    }

    function addScriptFetcher(video) {
        const track = getKoreanTextTrack(video);
        track.mode = 'hidden';
        track.addEventListener('cuechange', fetchScript);   
    }

    async function fetchScript(textTrackEvent) {
        const textTrack = textTrackEvent.target;
        let activeCue = textTrack.activeCues[0]; // 첫 번째 활성화된 큐
        if (activeCue) {
            const startTime = parseInt(activeCue.startTime, 10);
            const subtitleText = activeCue.text;
            const subtitles = await getDataFromLocalStorage('subtitles') ?? {}; // 'subtitles' 데이터 가져오기
            for (let i = 0; i < quizRequestTimes.length; i++) {
                if (quizRequestTimes[i] < startTime) {
                    continue;
                }
                if (!subtitles[quizRequestTimes[i]]) {
                    subtitles[quizRequestTimes[i]] = []; // 해당 키가 없으면 빈 배열로 초기화
                }
                if (subtitles[quizRequestTimes[i]].join().length > 500) {
                    continue;
                }
                subtitles[quizRequestTimes[i]].push(subtitleText); // 자막 텍스트 추가
            }
            setDataLocalStorage('subtitles', subtitles, () => console.log("save subtitles")); // 변경된 자막 데이터 저장
        }
    }

    async function getLectureScript(popuptime) {
        const subtitles = await getDataFromLocalStorage('subtitles');
        return subtitles[popuptime].join();
    }

    function hasAllProperties(response) {
        return response.instruction && response.commentary && response.choices.length > 0 && response.popupTime > 0;
    }

    async function fetchQuiz() {
        if (quizRequestTimes.length === 0) {
            return;
        }
        const video = workbookContext.videoElement;
        const currentTime = parseInt(video.currentTime);
        for (const [index, time] of quizRequestTimes.entries()) {
            if (time === currentTime) {
                quizRequestTimes.splice(index, 1);
                LoaAxios.post(
                    `${HOST}/api/quizsets/llm`,
                    {   
                        subLectureId: workbookContext.subLectureId,
                        script: await getLectureScript(time),
                        popupTime: time + safeLoadingSeconds,
                    },
                    (response) => {
                        if (hasAllProperties(response)) {
                            workbookContext.curQuizzes.push(response);
                        }
                    }
                )
            }
        }
    }
    return onclickHandler;
}