import { showCreateModal } from "../modal/quizcreatemodal";
import { REPORT_PROCESSING_HOST } from "../network/LoaAxios";

export function createNavbarFooter() {
  const footer = document.createElement("div");
  footer.className = "loa-navbar-footer";
  footer.innerHTML = `
      <a id="createQuizsetsBtn" class="btn create-quizset-btn" href='${REPORT_PROCESSING_HOST}/create' target='_blank'>
      문제집 만들기
      </a>
  `;

  const createQuizsetsBtn = footer.querySelector("#createQuizsetsBtn");
  async function stepstart() {
    await showCreateModal();
  }

  if (createQuizsetsBtn) {
    createQuizsetsBtn.addEventListener("click", async (event) => {
      event.preventDefault(); // 기본 동작(페이지 이동)을 막습니다
      await stepstart();
      document.querySelector("#navbar-close-button").click();
    });
  }

  return footer;
}