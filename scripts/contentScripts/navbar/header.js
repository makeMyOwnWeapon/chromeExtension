export function createNavbarHeader() {
  const header = document.createElement("div");
  header.id = "navbarHeader";
  header.classList.add("navbar-header"); // Add class name
  header.innerHTML = `
            <div class="close-button" style="cursor: pointer;">
                &#10005; <!-- HTML entity for the letter 'X' -->
            </div>
            <div class="header-content">
                <img src="https://velog.velcdn.com/images/byk0316/post/610f9bb7-4ab7-4be9-b24c-14d22ef4ebd3/image.png" class="header-image">
                <p class="header-text">Let's LOA!</p>
            </div>
            <br>
            `;

  const closeButton = header.querySelector(".close-button");
  closeButton.onclick = function () {
    document.getElementById("learningAssistantNavbar").style.zIndex = "-1";
  };

  return header;
}
