import { HOST, LoaAxios } from "../network/LoaAxios";
import { URLParser } from "../network/URLParser";
import { popupQuizEventHandler } from "./component/quiz";
import { addQuizsetsAndRender } from "./component/quizsets";
import {
  isAnalyzing,
  refreshAnalysisBtn,
  addAnalysisInfoModalIfNotAnalyzing,
  addAnalysisInfoModalIfAnalysisDone,
} from "./controller/analysis";

export const workbookContext = {
  curQuizzes: [],
  //solvedQuizzes: [],
  videoElement: null,
  isAnalyzing: false,
  selectedQuizsetId: null,
  subLectureId: null,
  lectureHistoryId: null,
};

export function loadDefaultElementsForWorkbook() {
  loadVideoElement();
  loadCurSubLectureId();
}

function loadVideoElement() {
  workbookContext.videoElement = document.getElementsByTagName("video")[0];
  workbookContext.videoElement.pause();
  workbookContext.videoElement.addEventListener(
    "play",
    addAnalysisInfoModalIfNotAnalyzing
  );
  workbookContext.videoElement.addEventListener(
    "ended",
    addAnalysisInfoModalIfAnalysisDone
  );
  workbookContext.videoElement.addEventListener(
    "timeupdate",
    popupQuizEventHandler
  );
}

function loadCurSubLectureId() {
  const url = encodeURIComponent(
    URLParser.parseWithoutTab(document.location.href)
  );
  const title = document.querySelector(".css-1vtpfoe").innerText;
  const mainLectureTitle = encodeURIComponent(
    URLParser.getParam(document.location.href, "courseSlug")
  );
  LoaAxios.get(`${HOST}/api/lecture/sub-lecture?url=${url}`, (response) => {
    if (response.subLectureId) {
      workbookContext.subLectureId = response.subLectureId;
      return;
    }
    LoaAxios.post(
      `${HOST}/api/lecture/main-lecture/${mainLectureTitle}/sub-lecture`,
      {
        url: URLParser.parseWithoutTab(document.location.href),
        title: title,
        duration: parseInt(workbookContext.videoElement.duration),
      },
      (response) => {
        if (!response.subLectureId) {
          console.error("Doesn't make Lecture!");
        }
        workbookContext.subLectureId = response.subLectureId;
      }
    );
  });
}

function updateWorkbookContent(content) {
  const navbarContent = document.getElementById("navbarContent");
  if (!navbarContent) {
    console.error("Navbar content element not found");
    return;
  }
  navbarContent.innerHTML = content;
}

function makeWorkbookHTML_TOBE() {
  return `
    <style>
    .analysis-btn {
        color: #000000;
    }
    </style>
    <div style="width: 100%">
        <div class="list-group quizsets" id="quizsets-container">
        </div>
        <div>
            <a class="btn create-quizsets-btn" style="color: #000000;" href='http://127.0.0.1:3002/create' target='_blank'>
                문제집 만들기
            </a>
        </div>
        <div id="congratulations-message" style="display: none; font-size: 24px; color: #000000; font-weight: bold; text-align: center;">
            <br />
            <br />
            수고하셨습니다!
            <br />
            <br />
        </div>
        <div id='popuptime-preview'>
            <div id="popuptimes-view" class="position-relative m-4"></div>
            <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%; background-color: #91a8ff;"></div>
            </div>
        </div>
        <div>
        <button class="btn analysis-btn" id="analysis-start-btn" ${
          isAnalyzing() ? "disabled" : ""
        }>
            <span> ${isAnalyzing() ? "학습중" : "학습 시작"} </span>
        </button>
        <button class="btn analysis-btn" id="analysis-end-btn">
            <span> 학습 종료 </span>
        </button>
        <div>
        <video autoplay style="width: 100%;" id="web-cam" hidden></video>
    </div>
    `;
}

export function displayWorkbookContent() {
  updateWorkbookContent(makeWorkbookHTML_TOBE());
  addQuizsetsAndRender(URLParser.parseWithoutTab(document.location.href));
  refreshAnalysisBtn();
}
