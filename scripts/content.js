window.onload = function() {
  console.log('======');
  const curriculm = document.querySelector('[title="커리큘럼"]'); // 특정 속성을 기반으로 선택
  curriculm.click();

  setTimeout(function() {
    const small_lecture = document.querySelector('li[aria-current="true"][data-testid="sectionUnit"]');
    console.dir(small_lecture);
    console.log("소강의 : " + small_lecture.textContent);

    const big_lecture = document.querySelector('.css-1pqj6dl');
    console.dir(big_lecture);
    console.log("대강의 : " + big_lecture.innerText);
    console.log('======');

  }, 3000);
};
