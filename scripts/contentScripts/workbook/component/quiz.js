import { workbookContext } from "../workbook";
import { LoaAxios, HOST } from "../../network/LoaAxios";

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
        `;
}

function createQuizModal() {
  const videoContainer = document.querySelector(".shaka-video-container");
  const quizModal = document.createElement("div");
  quizModal.id = "quiz-modal";
  quizModal.classList.add("overlay");
  videoContainer.parentNode.appendChild(quizModal);
  return quizModal;
}

/**
 * 현재 풀고 있는 퀴즈 객체를 반환한다.
 * @returns 퀴즈 객체 (API 문서 참고)
 */
function getCurrentQuiz() {
  return workbookContext.solvedQuizzes.at(
    workbookContext.solvedQuizzes.length - 1
  );
}

/**
 * 선택지가 정답인지를 확인한다.
 * @param {*: number} choiceId 선택지 id
 * @returns 정답여부
 */
function isAnswer(choiceId) {
  const curQuiz = getCurrentQuiz();
  for (const choice of curQuiz.choice) {
    if (choice.choiceId === choiceId && choice.isAnswer) {
      return true;
    }
  }
  return false;
}

/**
 * 선택지들 중에서 사용자가 선택한 선택지는 selected 클래스를 가지고 있다.
 * 사용자가 선택한 선택지를 서버에 전송하고 결과를 화면에 보여준다.
 *
 * @param {[HTMLElement]} choices 문제에 속하는 선택지들
 * @param {HTMLElement} quizModal 현재 떠있는 문제 모달창
 * @param {HTMLElement} video 현재 보고 있는 강의 영상
 */
function sendQuizResultAndRender(choices, quizModal, video, solvedDuration) {
  // TODO: 문제 결과 저장 로직 추가 (+정답 결과 보여주기)
  const selectedChoiceId = getSelectedChoiceId(choices);
  if (selectedChoiceId === null) {
    alert("답안을 선택해주세요."); // 선택한 답안이 없는 경우 알림
    return;
  }
  const isCorrect = isAnswer(selectedChoiceId); // 선택한 답안이 정답인지 확인
  const result = saveQuizResult(selectedChoiceId, isCorrect, solvedDuration); // 서버에 퀴즈 결과 저장

  // 일정 시간 후 모달 닫기
  setTimeout(() => {
    quizModal.remove();
    video.play();
  }, 1500);
}

// 선택한 선택지의 id를 반환하는 함수
function getSelectedChoiceId(choices) {
  for (const choice of choices) {
    if (choice.classList && choice.classList.contains("selected")) {
      return parseInt(choice.id.split("-")[1]);
    }
  }
  return null; // 선택한 선택지가 없는 경우 null 반환
}

// 퀴즈 결과를 서버에 저장하는 함수 (예시)
async function saveQuizResult(choiceId, isCorrect, solvedDuration) {
  // 서버에 선택한 선택지의 id와 정답 여부를 전송하여 저장
  LoaAxios.post(
    `${HOST}/api/quizsets/quizResults`,
    {
      choiceId,
      isCorrect,
      solvedDuration,
      lectureHistoriesId: workbookContext.lectureHistoryId,
    },
    (response) => {
      if (!response) {
        console.error("Doesn't make quizResult!");
      }
    }
  );
}

export function popupQuiz(quizIdx) {
  // 팝업창이 띄워진 시점의 시간
  const popupTime = new Date().getTime();
  const quizzes = workbookContext.curQuizzes;

  const quiz = quizzes[quizIdx];

  workbookContext.solvedQuizzes.push(quizzes.splice(quizIdx, 1)[0]);

  const quizModal = createQuizModal();

  quizModal.innerHTML = QuizView(quiz.instruction);
  const choicesContainer = document.getElementById("choices-container");
  if (quiz.choices.length === 1) {
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.placeholder = "정답을 입력해주세요";
    inputField.className = "input-answer";
    choicesContainer.appendChild(inputField);
  } else {
    for (const choice of quiz.choices) {
      const choiceBtn = document.createElement("button");
      choiceBtn.type = "button";
      choiceBtn.id = `choice-${choice.choiceId}`;
      choiceBtn.className = "btn";
      choiceBtn.innerText = choice.content;
      choiceBtn.addEventListener("click", () => {
        choiceBtn.classList.contains("selected")
          ? choiceBtn.classList.remove("selected")
          : choiceBtn.classList.add("selected");
      });
      choicesContainer.appendChild(choiceBtn);
    }
  }

  const video = workbookContext.videoElement;

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", () => {
    const quizModal = document.getElementById("quiz-modal");
    // 버튼이 클릭된 시점의 시간
    const clickTime = new Date().getTime();
    // 시간 차이 계산하여 solvedDuration으로 설정
    const solvedDuration = Math.floor((clickTime - popupTime) / 1000);
    const selectedChoiceId = getSelectedChoiceId(choicesContainer.childNodes);
    if (selectedChoiceId === null) {
      alert("답안을 선택해주세요.");
      return;
    }
    const isCorrect = isAnswer(selectedChoiceId);
    sendQuizResultAndRender(
      choicesContainer.childNodes,
      quizModal,
      video,
      solvedDuration,
      selectedChoiceId, // 선택한 답안의 ID도 함께 전달
      isCorrect // 정답 여부도 함께 전달
    );
    // 선택한 답안이 정답이면 버튼 색상을 파란색으로, 아니면 빨간색으로 변경
    const selectedButton = document.getElementById(
      `choice-${selectedChoiceId}`
    );
    if (isCorrect) {
      selectedButton.style.backgroundColor = "blue";
    } else {
      selectedButton.style.backgroundColor = "red";
    }
  });
}

export function popupQuizEventHandler() {
  const video = workbookContext.videoElement;
  const quizzes = workbookContext.curQuizzes;
  const currentTime = video.currentTime;
  for (let i = 0; i < quizzes.length; i++) {
    const parsedTime = parseInt(currentTime);
    if (parsedTime === quizzes[i].popupTime) {
      popupQuiz(i);
      video.pause();
    }
  }
}
