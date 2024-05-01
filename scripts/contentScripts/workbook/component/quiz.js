import { workbookContext } from "../workbook";

function Quiz() {
    return `
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title">문제 1</h1>
            </div>
            <div class="modal-body">
                <button type="button" class="btn">가상 메모리는 진짜 가상일뿐이다. 하드웨어와 관련이 없다.</button>
                <button type="button" class="btn">가상화 기술에는 가상 메모리밖에 없다.</button>
                <button type="button" class="btn">CPU 가상화를 이루기 위해서 시분할 기법을 사용한다.</button>
            </div>
            <div class="modal-footer">
                <button type="button" id="submit-btn" class="submit-btn">제출</button>
            </div>
        </div>
        `
}

export function popupQuiz() {
    const video = workbookContext.videoElement;
    const quizModal = document.getElementById('quiz-modal');
    quizModal.innerHTML = Quiz();
    video.pause();
    quizModal.hidden = false;

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', () => {
        const popupQuiz = document.getElementById('quiz-modal');
        popupQuiz.innerHTML = '';
        quizModal.hidden = true;
        video.play();
    })
}