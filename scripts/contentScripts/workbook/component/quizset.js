import { handlerRegisterQueue } from "../workbook"

export function QuizSet(quizsetId, title, nickname, recommendations, createAt) {
    const elementId = `quizset-${quizsetId}`;
    const onclickHandler = () => {
        // TODO: 팝업 시각 조회 및 프로그레스바에 표시
        console.log("onClick QuizSet");
    };
    handlerRegisterQueue.push({ elementId, type: 'click', handler: onclickHandler});
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