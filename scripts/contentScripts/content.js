import { getRandomColor } from './randomColor.js'; // 경로는 실제 파일 위치에 따라 다를 수 있습니다.


window.onload = function() {
  // 랜덤 색상 생성 함수
// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

  console.log('====== content.js start ======');

// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "toggleElement") {
      // 요소 토글 로직
      console.log("수신완료!!");
      document.querySelector('.mantine-Tabs-tabsList.mantine-knbi38').style.backgroundColor = getRandomColor();
    }
  }
);

  // setTimeout(function() {
  //   const curriculm = document.querySelector('[title="커리큘럼"]'); // 특정 속성을 기반으로 선택
  //   curriculm.click();
  //   const small_lecture = document.querySelector('li[aria-current="true"][data-testid="sectionUnit"]').textContent;
  //   console.log("소강의 : " + small_lecture);

  //   const big_lecture = document.querySelector('.css-1pqj6dl').innerText;
  //   console.log("대강의 : " + big_lecture);
  //   console.log('======');

  //   // background.js 와 연결
  //   console.log("send Message to Background Worker From content");
  //   chrome.runtime.sendMessage({greeting: "hello", small_lecture : small_lecture}, function(response){
      
  //   console.log(response.farewell);


      
  //   });

  // }, 3000);








};