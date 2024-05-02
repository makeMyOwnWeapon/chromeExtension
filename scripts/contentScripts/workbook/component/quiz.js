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

export function popupQuiz() {
    const video = workbookContext.videoElement;
    const quizzes = workbookContext.curQuizzes;
    const curQuizIdx = workbookContext.lastSolvedIndex;
    const quiz = quizzes[curQuizIdx];
    const quizModal = createQuizModal();

    quizModal.innerHTML = QuizView(quiz.instruction);
    const choicesContainer = document.getElementById('choices-container');
    for (const choice of quiz.choice) {
        const choiceBtn = document.createElement('button');
        choiceBtn.type = "button";
        choiceBtn.id = `choice-${choice.choiceId}`
        choiceBtn.className = "btn";
        choiceBtn.innerText = choice.content;
        choicesContainer.appendChild(choiceBtn);
    }
    video.pause();

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', () => {
        const quizModal = document.getElementById('quiz-modal');
        quizModal.remove();
        video.play();
        workbookContext.lastSolvedIndex += 1;
    })
}