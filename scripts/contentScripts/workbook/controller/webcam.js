import { HOST, LoaAxios } from "../../network/LoaAxios";

function captureAndSendImages(video) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const capture = () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      LoaAxios.postFile(
          `${HOST}/api/video`,
          canvas.toDataURL('image/jpeg'), 
          (response) => console.log(response.result)
      );
  };
  setTimeout(capture, 2000); // 2초 뒤 영상을 백엔드로 전송
  // setInterval(capture, 1000); // 1초마다 영상을 백엔드로 전송
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