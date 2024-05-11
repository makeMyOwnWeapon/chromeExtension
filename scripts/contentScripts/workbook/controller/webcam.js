import { IMAGE_PROCESSING_HOST, LoaAxios } from "../../network/LoaAxios";

function captureAndSendImages(video) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const capture = () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      LoaAxios.postFile(
          `${IMAGE_PROCESSING_HOST}/api/image-process/image`,
          canvas.toDataURL('image/jpeg'), 
          (response) => console.log(response) // { "isExist": true, "isEyeClosed": flase }
      );
  };
  setTimeout(capture, 2000); // 2초 뒤 영상을 백엔드로 전송
//   setInterval(capture, 3000); // 1초마다 영상을 백엔드로 전송
}

export function getWebcamAndAddCaptureEvent() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        // 스트림 사용, 예를 들어 비디오 태그에 연결
        const video = document.querySelector('#web-cam');
        video.hidden = false;
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
            video.play();
        };
        captureAndSendImages(video);
    })
    .catch(function(err) {
        console.log("getUserMedia Error: " + err);
    });   
}