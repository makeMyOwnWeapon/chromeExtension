import { handlerRegisterQueue, workbookContext } from "../workbook"

export function QuizSet(quizsetId, title, nickname, recommendations, createAt) {
    const elementId = `quizset-${quizsetId}`;
    let popupQuizzes = [];
    let totalTime = workbookContext.videoElement.duration;
    const onclickHandler = () => {
        fetchQuizzes(quizsetId, showPopTimes);
    };

    function showPopTimes() {
        const popuptimesView = document.getElementById('popuptimes-view');
        popuptimesView.innerHTML = popupQuizzes.map(quiz => {
            return PopuptimeCarrot(quiz.popupTime);
        }).join('\n');
    }

    function fetchQuizzes(quizsetId, callback) {
        // fetch(`http://localhost:3000/api/quizsets${quizsetId}/quizzes?commentary=true&answer=true`, {
        //     method: 'GET', // 데이터 전송 방식 지정
        //     headers: {
        //         'Authorization': `Bearer ${token}`, // 컨텐츠 타입 지정
        //     }
        // })
        // .then(response => {
        //     // 응답을 받았을 때의 처리
        //     if (response.ok) {
        //         console.log(response.data);
        //         popupQuizzes = response.json();
        //     }
        // })
        // .catch(ignore => {
        // })
        
        // Dummy Data
        if (!popupQuizzes.length) {
            popupQuizzes = [
                {
                    quizId: 1,
                    instruction: "문제 1",
                    commentary: "IDK, Too",
                    popupTime : 1 * quizsetId,
                    choices: [
                        {
                            choiceId: 1,
                            content: "가상 메모리는 진짜 가상일뿐이다. 하드웨어와 관련이 없다",
                            isAnswer: false,
                        },
                        {
                            choiceId: 2,
                            content: "가상화 기술에는 가상 메모리밖에 없다.",
                            isAnswer: false,
                        },
                        {
                            choiceId: 3,
                            content: "CPU 가상화를 이루기 위해서 시분할 기법을 사용한다.",
                            isAnswer: true,
                        }
                    ]
                },
                {
                    quizId: 2,
                    instruction: "문제 2",
                    commentary: "IDK, Too",
                    popupTime : 500 * quizsetId,
                    choices: [
                        {
                            choiceId: 1,
                            content: "가상 메모리는 진짜 가상일뿐이다. 하드웨어와 관련이 없다",
                            isAnswer: false,
                        },
                        {
                            choiceId: 2,
                            content: "가상화 기술에는 가상 메모리밖에 없다.",
                            isAnswer: false,
                        },
                        {
                            choiceId: 3,
                            content: "CPU 가상화를 이루기 위해서 시분할 기법을 사용한다.",
                            isAnswer: true,
                        }
                    ]
                },
                {
                    quizId: 3,
                    instruction: "문제 3",
                    commentary: "IDK, Too",
                    popupTime : 600 * quizsetId,
                    choices: [
                        {
                            choiceId: 1,
                            content: "가상 메모리는 진짜 가상일뿐이다. 하드웨어와 관련이 없다",
                            isAnswer: false,
                        },
                        {
                            choiceId: 2,
                            content: "가상화 기술에는 가상 메모리밖에 없다.",
                            isAnswer: false,
                        },
                        {
                            choiceId: 3,
                            content: "CPU 가상화를 이루기 위해서 시분할 기법을 사용한다.",
                            isAnswer: true,
                        }
                    ]
                },
            ]
        }
        callback();
    }

    function PopuptimeCarrot(popuptime) {
        const timeRatio = parseInt(popuptime / totalTime * 100);
        return `<i class="bi bi-caret-down-fill position-absolute start-${timeRatio}"></i>`
    }

    handlerRegisterQueue.enqueue({ elementId, type: 'click', handler: onclickHandler});
    return `
        <button class="list-group-item quizset" id="${elementId}">
        <div>
            <h5 class="mb-1">${title}</h5>
            <small><i class="bi bi-hand-thumbs-up-fill"></i> ${recommendations}</small>
        </div>
        <p class="mb-1">${nickname} <span>${createAt}</span></p>
        </button>
        `
};