import { REPORT_PROCESSING_HOST } from "../network/LoaAxios";

export function createNavbarFooter() {
  const footer = document.createElement("div");
  footer.className = "loa-navbar-footer";
  footer.innerHTML = `
    <a class="btn create-quizsets-btn" style="color: #000000;" href='${REPORT_PROCESSING_HOST}/create' target='_blank'>
        문제집 만들기
    </a>
  `;
  return footer;
}