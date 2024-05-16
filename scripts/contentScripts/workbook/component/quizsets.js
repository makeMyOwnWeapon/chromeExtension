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
                    <img class="loa-logo" src="https://velog.velcdn.com/images/byk0316/post/610f9bb7-4ab7-4be9-b24c-14d22ef4ebd3/image.png">
                </div>
                <p class="author-nickname">LOA AI</p>
            </button>
            `
        return;
    }


    const quizsetViews = quizsets
        .sort((quizset1, quizset2) => {
            return quizset2.recommendationCount - quizset1.recommendationCount
        })
        .slice(0, 3)
        .map((quizsetDto) => {
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
                addRecommendationSender();
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

    function addRecommendationSender() {
        const recoBtn = document.getElementById('recommendation-btn');
        if (!recoBtn) {
            return;
        }
        const recoCount = document.getElementById('recommendation-count');
        const quizset = recoBtn.closest('.quizset');
        recoBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (recoBtn.className === "bi bi-hand-thumbs-up-fill") {
                return;
            }
            LoaAxios.post(`${HOST}/api/quizsets/recommendation`,
                {
                    numOfRecommendation : parseInt(recoCount.innerText),
                    quizSetId: parseInt(quizset.id.split('-')[1])
                },
                (response) => {
                    recoCount.innerText = parseInt(response);
                    recoBtn.className = "bi bi-hand-thumbs-up-fill";
                },
                false
            )
        })
    }
};