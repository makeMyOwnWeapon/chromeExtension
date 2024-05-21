export function createNavbarHeader() {
  const header = document.createElement("div");
  header.id = "navbarHeader";
  header.classList.add("navbar-header");
  header.innerHTML = `
            <div class="close-button" style="cursor: pointer;">
                &#10005; <!-- HTML entity for the letter 'X' -->
            </div>
            <div class="header-content">
                <img src="https://velog.velcdn.com/images/byk0316/post/5f89557b-72ba-4821-9552-41a3401d8f73/image.png" class="header-image">
                <p class="header-text">LEARN ON-AIR</p>
            </div>
            <br>
            `;

  const closeButton = header.querySelector(".close-button");
  closeButton.onclick = function () {
    document.getElementById("learningAssistantNavbar").style.zIndex = "-1";
  };

  return header;
}
