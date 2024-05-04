import { QuizSetController, QuizSetView, renderPopupTimeCarrot, markQuizset } from "./quizset";
import { workbookContext } from "../workbook";
import { LoaAxios } from "../../network/LoaAxios";

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
    if (!quizsets)
        return;

    const quizsetViews = quizsets.map((quizsetDto) => {
        return QuizSetView(
            quizsetDto.quizSetId,
            quizsetDto.quizSetTitle,
            quizsetDto.quizSetAuthor,
            quizsetDto.recommendationCount,
            quizsetDto.createdAt
        )
    })
    const quizsetsList = document.getElementById("quizsets-container");
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
            `http://localhost:3000/api/quizsets?subLectureUrl=${encodedUrl}`,
            (response) => {
                renderQuizsetViews(response);
                addQuizFetcher();
            }
        );
    }

    function addQuizFetcher() {
        const quizsets = document.getElementsByClassName('quizset');
        for(let quizset of quizsets) {
            const quizsetId = quizset.id.split("-")[1];
            quizset.addEventListener('click', QuizSetController(quizsetId));
        }
    }
};