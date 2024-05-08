import { QuizSetController, QuizSetView, renderPopupTimeCarrot, markQuizset, AIQuizSetController } from "./quizset";
import { workbookContext } from "../workbook";
import { LoaAxios, HOST } from "../../network/LoaAxios";

export function addQuizsetsAndRender(subLectureURL) {
    QuizsetsController(subLectureURL);
    markQuizsetIfPrevSeleceted();
}

function markQuizsetIfPrevSeleceted() {
    markQuizset(workbookContext.selectedQuizsetId);
    if (workbookContext.curQuizzes) {
        renderPopupTimeCarrot();
    }
}

function renderQuizsetViews(quizsets) {
    const quizsetsList = document.getElementById("quizsets-container");
    if (!quizsets.length) {
        quizsetsList.innerHTML = `
            <button class="list-group-item quizset ai-based" id="ai-based-quizset">
                <div class="quizset-title-container">
                    <h2 class="quizset-title">AI를 활용한 문제집</h2>
                    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FrsQP1%2FbtsGY1xO42N%2FHguDHJehMxoHTt2PoSter1%2Fimg.png">
                </div>
                <p class="author-nickname">LOA AI</p>
            </button>
            `
        return;
    }

    const quizsetViews = quizsets.map((quizsetDto) => {
        return QuizSetView(
            quizsetDto.quizSetId,
            quizsetDto.quizSetTitle,
            quizsetDto.quizSetAuthor,
            quizsetDto.recommendationCount,
            quizsetDto.createdAt
        )
    })
    quizsetsList.innerHTML = quizsetViews.join("\n");
}

function QuizsetsController(subLectureURL) {
    'use strict';

    (function initialize() {
        fetchQuizsets(subLectureURL);
    })();

    function fetchQuizsets(subLectureURL) {
        const encodedUrl = encodeURIComponent(subLectureURL);
        LoaAxios.get(
            `${HOST}/api/quizsets?subLectureUrl=${encodedUrl}`,
            (response) => {
                renderQuizsetViews(response);
                addQuizFetcher();
            }
        );
    }

    function addQuizFetcher() {
        const quizsets = document.getElementsByClassName('quizset');
        for(let quizset of quizsets) {
            if (quizset.classList.contains("ai-based")) {
                quizset.addEventListener('click', AIQuizSetController());
                continue;
            }
            const quizsetId = quizset.id.split("-")[1];
            quizset.addEventListener('click', QuizSetController(quizsetId));
        }
    }
};