import { showCreateModal } from "../modal/quizcreatemodal";

export function createNavbarFooter() {
  const footer = document.createElement("div");
  footer.className = "loa-navbar-footer";
  footer.innerHTML = `
      <a id="createQuizsetsBtn" class="btn create-quizset-btn" href='#'>
      문제집 만들기
      </a>
  `;

  const createQuizsetsBtn = footer.querySelector("#createQuizsetsBtn");
  async function stepstart() {
    await showCreateModal();
  }

  if (createQuizsetsBtn) {
    createQuizsetsBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      if (createQuizsetsBtn.classList.contains("creating")) {
        return;
      }
      createQuizsetsBtn.classList.add("creating");
      await stepstart();
      document.querySelector("#navbar-close-button").click();
    });
  }

  return footer;
}