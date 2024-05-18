import { QuizSetController, QuizSetView, renderPopupTimeCarrot, markQuizset, AIQuizSetController } from "./quizset";
import { workbookContext } from "../workbook";
import { LoaAxios, HOST } from "../../network/LoaAxios";
import { URLParser } from "../../network/URLParser";

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
    addAIQuizSetCreateBtnIfNotExistIn(quizsets);
    if (!quizsets.length) {
        quizsetsList.innerHTML = `
            <p>문제집이 없어요!</p>
            <p>아래 버튼을 통해 생성해보세요</p>
            `
        return;
    }
    const quizsetViews = quizsets
        .sort((quizset1, quizset2) => {
            if (quizset1.quizSetAuthor === 'LOA AI') {
                return -1;
            }
            if (quizset2.quizSetAuthor === 'LOA AI') {
                return 1;
            }
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

function addAIQuizSetCreateBtnIfNotExistIn(quizsets) {
    for (let index = 0; index < quizsets.length; index++) {
        const quizset = quizsets[index];
        if (quizset.quizSetAuthor === 'LOA AI') {
            return;
        }    
    }
    const navFooter = document.querySelector(".loa-navbar-footer");
    const aiQuizsetCreateBtn = document.createElement("button");
    aiQuizsetCreateBtn.className = "btn create-quizset-btn ai-based";
    aiQuizsetCreateBtn.id = "ai-based-create-quizset-btn";
    aiQuizsetCreateBtn.innerText = "AI 문제집 자동 생성";
    aiQuizsetCreateBtn.addEventListener('click', async () => {
        await AIQuizSetController()();
        addQuizsetsAndRender(URLParser.parseWithoutTab(document.location.href));
    })
    navFooter.prepend(aiQuizsetCreateBtn);
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