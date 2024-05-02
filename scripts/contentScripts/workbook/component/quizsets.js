import { initializerRegisterQueue } from "../workbook";
import { QuizSet, QuizSetView } from "./quizset";


export function addQuizsetsAndRender(subLectureURL) {
    Quizsets(subLectureURL);
}

function Quizsets(subLectureURL) {
    'use strict';

    (function initialize() {
        fetchQuizsets(subLectureURL);
    })();

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

    function fetchQuizsets(subLectureURL) {
        chrome.storage.local.get('authToken', function(data) {
            if (!data.authToken) {
                console.error("Doesn't have authToken");
                return;
            }
            const token = data.authToken;
            const encodedUrl = encodeURIComponent(subLectureURL);
            const options = {
                method: 'GET', // 데이터 전송 방식 지정
                headers: {
                    'Authorization': `Bearer ${token}`, // 컨텐츠 타입 지정
                }
            }
            chrome.runtime.sendMessage({
                type: 'fetch',
                url: `http://localhost:3000/api/quizsets?subLectureUrl=${encodedUrl}`,
                options: options
            }, (response) => {     
                renderQuizsetViews(response);
                addQuizFetcher();
            });
        });
    }

    function addQuizFetcher() {
        const quizsets = document.getElementsByClassName('quizset');
        for(let quizset of quizsets) {
            const quizsetId = quizset.id.split("-")[1];
            quizset.addEventListener('click', QuizSet(quizsetId));
          }
    }
};