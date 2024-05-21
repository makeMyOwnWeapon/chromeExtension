import { showWakeUpModal } from "../../alarm/wakeupmodal";
import { showLeaveSeatModal } from "../../leaveSeat/leaveSeat";
import { IMAGE_PROCESSING_HOST, LoaAxios } from "../../network/LoaAxios";
import { formatDate } from "../../utils/TimeFomater";
import { ANALYSIS_TYPE, setAnalysisType } from "./analysis";

export const analyticsContext = {
  startedAt: null,
  endedAt: null,
  sleepCount: 0,
  existCount: 0,
  videoIntervalId: null
};

function captureAndSendImages(video) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const capture = () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    if(!document.querySelector("#quiz-modal") && !document.querySelector("#analysis-info-modal")) {
      LoaAxios.postFile(
        `${IMAGE_PROCESSING_HOST}/api/image-process/image`,
        canvas.toDataURL('image/jpeg'), 
        (response) => {
              if(response.isExist && response.isEyeClosed){
                analyticsContext.sleepCount += 1;
              }
              else if(!response.isExist){
                analyticsContext.existCount += 1;
              }
              else{
                initializeStatusCount(0);
              }
              if(analyticsContext.sleepCount >= 6){
                analyticsContext.startedAt = formatDate(new Date());
                showWakeUpModal();
                setAnalysisType(ANALYSIS_TYPE.SLEEP);
              }
              else if (analyticsContext.sleepCount >= 4) {
                setAnalysisType(ANALYSIS_TYPE.PRE_SLEEP);
              }
              else if(analyticsContext.existCount >= 6){
                analyticsContext.startedAt = formatDate(new Date());
                showLeaveSeatModal();
                setAnalysisType(ANALYSIS_TYPE.LEAVE_SEAT);
              }
              else if(analyticsContext.existCount >= 4){
                setAnalysisType(ANALYSIS_TYPE.PRE_LEAVE_SEAT);
              } else {
                setAnalysisType(ANALYSIS_TYPE.DEFAULT);
              }
        }
      );
    };
  };

  const intervalId = setInterval(capture, 1000);
  return intervalId;
}

export async function getWebcamAndAddCaptureEvent() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.querySelector('#web-cam');
    video.hidden = false;
    video.srcObject = stream;
    video.onloadedmetadata = function (e) {
      video.play();
    };
    return captureAndSendImages(video);
  } catch (err) {
    console.error("getUserMedia Error: " + err);
  }   
}

export function stopWebcam() {
    const video = document.querySelector('#web-cam');
    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
    }
}

export function toggleWebcam(state) {
  const webcam = document.getElementById("web-cam");
  webcam.style.display = state ? "block" : "none";
}

export function initializeStatusCount(value) {
  analyticsContext.sleepCount = value;
  analyticsContext.existCount = value;
}