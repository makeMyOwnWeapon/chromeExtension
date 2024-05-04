import { toggleNavbarVisibility } from '../navbar/navbar.js';
import { loadDefaultElementsForWorkbook } from '../workbook/workbook.js';

const handler = {
    set(target, key, value) {
      target[key] = value;
      if (value) {
        loadDefaultElementsForWorkbook();
      }
      return true;
    }  
};

const LOA = new Proxy({isActive: false}, handler);

export function addLearningAssistantIcon() {
    if (!LOA.isActive) {
        const sideBar = document.querySelector('.css-zl1inp').parentNode;
        const li = document.createElement('li');
        li.className = 'css-zl1inp';
        li.id = 'learningAssistantIcon';
        li.innerHTML = `
            <button class="mantine-UnstyledButton-root mantine-Button-root mantine-syxma7" type="button">
                <div class="mantine-1yjkc96 mantine-Button-inner">
                    <span class="mantine-1vgkxjh mantine-Button-label">
                        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FrsQP1%2FbtsGY1xO42N%2FHguDHJehMxoHTt2PoSter1%2Fimg.png">
                        <p class="mantine-Text-root mantine-qjo01i">학습 보조</p>
                    </span>
                </div>
            </button>
        `;
        const emptySpaceBetweenHelpIcon = document.getElementsByClassName('css-1gfm3uk')[0];
        sideBar.insertBefore(li, emptySpaceBetweenHelpIcon);
        li.querySelector('button').addEventListener('click', function() {
            toggleNavbarVisibility();
        });
        LOA.isActive = true;
    }
}

export function removeLearningAssistantIcon() {
    const iconElement = document.getElementById('learningAssistantIcon');
    if (iconElement) {
        iconElement.remove(); // ID를 사용하여 아이콘 요소 제거
        LOA.isActive = false;  // 상태를 비활성화로 설정
    }
}