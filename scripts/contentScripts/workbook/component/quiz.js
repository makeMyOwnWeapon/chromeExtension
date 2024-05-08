import { workbookContext } from "../workbook";

function QuizView(instruction) {
    return `
        <div class="modal-content center">
            <div class="modal-header">
                <h1 class="modal-title">${instruction}</h1>
            </div>
            <div class="modal-body" id="choices-container">
            </div>
            <div class="modal-footer">
                <button type="button" id="submit-btn" class="submit-btn">정답 확인</button>
            </div>
        </div>
        `
}

function createQuizModal() {
    const videoContainer = document.querySelector('.shaka-video-container');
    const quizModal = document.createElement('div');
    quizModal.id = 'quiz-modal';
    quizModal.classList.add('overlay');
    videoContainer.parentNode.appendChild(quizModal);
    return quizModal;
}

/**
 * 현재 풀고 있는 퀴즈 객체를 반환한다.
 * @returns 퀴즈 객체 (API 문서 참고)
 */
function getCurrentQuiz() {
    return workbookContext.solvedQuizzes.at(workbookContext.solvedQuizzes.length - 1);
}

/**
 * 선택지가 정답인지를 확인한다.
 * @param {*: number} choiceId 선택지 id
 * @returns 정답여부
 */
function isAnswer(choiceId) {
    const curQuiz = getCurrentQuiz();
    for (const choice of curQuiz.choice) {
        if (choice.id === choiceId && choice.isAnswer) {
            return true;
        }
    }
    return false ;
}

/**
 * 선택지들 중에서 사용자가 선택한 선택지는 selected 클래스를 가지고 있다.
 * 사용자가 선택한 선택지를 서버에 전송하고 결과를 화면에 보여준다. 
 * 
 * @param {[HTMLElement]} choices 문제에 속하는 선택지들
 * @param {HTMLElement} quizModal 현재 떠있는 문제 모달창
 * @param {HTMLElement} video 현재 보고 있는 강의 영상
 */
function sendQuizResultAndRender(choices, quizModal, video) {
    // TODO: 문제 결과 저장 로직 추가 (+정답 결과 보여주기)
}

export function popupQuiz(quizIdx) {
    const quizzes = workbookContext.curQuizzes;
    const quiz = quizzes[quizIdx];
    workbookContext.solvedQuizzes.push(quizzes.splice(quizIdx, 1)[0]);
    const quizModal = createQuizModal();

    quizModal.innerHTML = QuizView(quiz.instruction);
    const choicesContainer = document.getElementById('choices-container');
    if (quiz.choice.length === 1) {
        const inputField = document.createElement('input');
        inputField.type = "text";
        inputField.placeholder = "정답을 입력해주세요";
        inputField.className = "input-answer";
        choicesContainer.appendChild(inputField);
    } else {
        for (const choice of quiz.choice) {
            const choiceBtn = document.createElement('button');
            choiceBtn.type = "button";
            choiceBtn.id = `choice-${choice.choiceId}`
            choiceBtn.className = "btn";
            choiceBtn.innerText = choice.content;
            choiceBtn.addEventListener('click', () => {
                choiceBtn.classList.contains("selected") ? choiceBtn.classList.remove("selected") : choiceBtn.classList.add("selected");
            })
            choicesContainer.appendChild(choiceBtn);
        }
    }

    const video = workbookContext.videoElement;
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', () => {
        const quizModal = document.getElementById('quiz-modal');
        sendQuizResultAndRender(choicesContainer.childNodes, quizModal, video);
        // quizModal.remove();
        // video.play();
    })
}

export function popupQuizEventHandler() {
    const video = workbookContext.videoElement;
    const quizzes = workbookContext.curQuizzes;
    const currentTime = video.currentTime;
    for (let i = 0; i < quizzes.length; i++) {
        const parsedTime = parseInt(currentTime);
        if (parsedTime === quizzes[i].popupTime) {
            popupQuiz(i);
            video.pause();
        }
    }
}