export function createNavbarHeader() {
  const header = document.createElement("div");
  header.id = "navbarHeader";
  header.style.padding = "20px";
  header.innerHTML = `
          <div style="position: absolute; top: 1px; right: 3px; cursor: pointer;">
              &#10005; <!-- HTML entity for the letter 'X' -->
          </div>
          <div style="display: flex; align-items: center;">
              <img src="https://velog.velcdn.com/images/byk0316/post/610f9bb7-4ab7-4be9-b24c-14d22ef4ebd3/image.png" style="height: 40px; margin-right: 10px;">
              <p style="font-size: 24px; color: #000000; font-weight: bold; margin: 100;">Let's LOA!</p>
          </div>
          <br>
          `;
  // <button id="summaryButton" style="background-color: #4CAF50; color: white; padding: 10px 20px; margin: 8px 0; border: none; border-radius: 4px; cursor: pointer; transition: transform 0.1s;">요약</button>
  // <button id="workbookButton" style="background-color: #4CAF50; color: white; padding: 10px 20px; margin: 8px 0; border: none; border-radius: 4px; cursor: pointer; transition: transform 0.1s;">문제집</button>
  //<button id="openIcon" style="background-color: #4CAF50; color: white; padding: 10px 20px; margin: 8px 0; border: none; border-radius: 4px; cursor: pointer; transition: transform 0.1s;">아이콘 생성</button>
  //<button id="closeIcon" style="background-color: #4CAF50; color: white; padding: 10px 20px; margin: 8px 0; border: none; border-radius: 4px; cursor: pointer; transition: transform 0.1s;">아이콘 제거</button>
  // header.querySelectorAll('button').forEach(button => {
  //     button.onmouseenter = () => button.style.backgroundColor = '#45a049';
  //     button.onmouseleave = () => button.style.backgroundColor = '#4CAF50';
  //     button.onmousedown = () => button.style.transform = 'translate(2px, 2px)';
  //     button.onmouseup = () => button.style.transform = 'translate(0, 0)';
  // });

  const closeButton = header.querySelector("div");
  closeButton.onclick = function () {
    document.getElementById("learningAssistantNavbar").style.zIndex = "-1";
  };

  return header;
}
