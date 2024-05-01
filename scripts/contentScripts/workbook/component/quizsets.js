import { QuizSet } from "./quizset";

export function Quizsets(subLectureURL) {
    'use strict'
    let quizsets = [];
    (function initialize() {
        const data = fetchQuizzes(subLectureURL);
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

    function fetchQuizzes(subLectureURL) {
        // TODO: GET /api/quizsets?subLectureURL=subLectureURL
        // TODO: 쿠키를 스토리지로부터 가져오기.
        const token = 'FETCH FROM STORAGE';
        const encodedUrl = encodeURIComponent(subLectureURL);
        fetch(`http://localhost:3000/api/quizsets?subLectureURL=${encodedUrl}`, {
            method: 'GET', // 데이터 전송 방식 지정
            headers: {
                'Authorization': `Bearer ${token}`, // 컨텐츠 타입 지정
            }
        })
        .then(response => {
            // 응답을 받았을 때의 처리
            if (response.ok) {
                console.log(response.data);
                return response.json();
            }
        })

        return [
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
        ];
    }

    return `
        <div class="list-group quizsets">
            ${quizsets.join('\n')}
        </div>
        `;
};