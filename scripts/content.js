window.onload = function() {
  console.log('======');
  const curriculm = document.querySelector('[title="커리큘럼"]'); // 특정 속성을 기반으로 선택
  curriculm.click();

  setTimeout(function() {
    const small_lecture = document.querySelector('li[aria-current="true"][data-testid="sectionUnit"]').textContent;
    console.log("소강의 : " + small_lecture);

    const big_lecture = document.querySelector('.css-1pqj6dl').innerText;
    console.log("대강의 : " + big_lecture);
    console.log('======');

    // background.js 와 연결
    console.log("send Message to Background Worker From content");
    chrome.runtime.sendMessage({greeting: "hello", small_lecture : small_lecture}, function(response){
      
    console.log(response.farewell);


      
    });

  }, 3000);








};
