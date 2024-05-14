import { showWakeUpModal } from "../../alarm/wakeupmodal";
import { showLeaveSeatModal } from "../../leaveSeat/leaveSeat";
import { IMAGE_PROCESSING_HOST, LoaAxios } from "../../network/LoaAxios";
import { formatDate } from "../../network/TimeFomater";

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
    if(!document.querySelector("#quiz-modal")) {
      LoaAxios.postFile(
        `${IMAGE_PROCESSING_HOST}/api/image-process/image`,
        canvas.toDataURL('image/jpeg'), 
        (response) => {
              if(response.isExist && response.isEyeClosed){
                analyticsContext.sleepCount = analyticsContext.sleepCount + 1;
              }
              else if(!response.isExist){
                analyticsContext.existCount = analyticsContext.existCount +1;
              }
              else{
                analyticsContext.sleepCount = 0;
                analyticsContext.existCount = 0;
              }
              if(analyticsContext.sleepCount == 5){
                  analyticsContext.startedAt = formatDate(new Date());
                  showWakeUpModal();
              }
              else if(analyticsContext.existCount == 5){
                  analyticsContext.startedAt = formatDate(new Date());
                  showLeaveSeatModal();
              }
        }
      );
    };
  };

  const intervalId = setInterval(capture, 1000);
//   setTimeout(capture, 2000); // 2초 뒤 영상을 백엔드로 전송
  return intervalId;
}


export function getWebcamAndAddCaptureEvent() {
  return navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        // 스트림 사용, 예를 들어 비디오 태그에 연결
        const video = document.querySelector('#web-cam');
        video.hidden = false;
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
            video.play();
        };
        return captureAndSendImages(video)
    })
    .catch(function(err) {
        console.log("getUserMedia Error: " + err);
    });   
}

export function stopWebcam() {
    const video = document.querySelector('#web-cam');
    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
    }
}

