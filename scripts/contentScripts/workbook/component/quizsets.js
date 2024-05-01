import { QuizSet } from "./quizset";

export function Quizsets(subLectureTitle, mainLectureTitle, subLectureURL) {
    'use strict'
    let quizsets = [];
    (function initialize() {
        const data = fetchQuizzes(subLectureTitle, mainLectureTitle, subLectureURL);
        quizsets = convertJsonToQuizsetElement(data);
    })();

    function convertJsonToQuizsetElement(quizsets) {
        return quizsets.map((quizsetDto) => {
            return QuizSet(
                quizsetDto.quizsetId,
                quizsetDto.title,
                quizsetDto.nickname,
                quizsetDto.recommendations,
                quizsetDto.createdAt
            )
        })
    }

    function fetchQuizzes(subLectureTitle, mainLectureTitle, subLectureURL) {
        // TODO: GET /api/quizsets?subLectureURL=subLectureURL&mainLectureTitle=mainLectureTitle&subLectureTitle=subLectureTitle
        const response = [
            {
                quizsetId: 1,
                title: 'AI가 생성한 문제',
                nickname: 'LOA AI',
                recommendations: 0,
                createdAt: '2024-04-30'
            },
            {
                quizsetId: 2,
                title: '소단원 중심의 문제',
                nickname: '의도한 짜장면',
                recommendations: 15,
                createdAt: '2024-04-30'
            },
            {
                quizsetId: 3,
                title: '뽀모도로 학습법에 기반한 문제',
                nickname: '성실한 단무지',
                recommendations: 3,
                createdAt: '2024-04-30'
            }
        ]
        return response;
    }

    return `
        <div class="list-group quizsets">
            ${quizsets.join('\n')}
        </div>
        `;
};