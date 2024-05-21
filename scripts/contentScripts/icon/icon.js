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
const LOA = new Proxy({ isActive: false }, handler);

function addFadeOut(element) {
    element.classList.add('fade');
    element.addEventListener('transitionend', function handleTransitionEnd() {
        if (getComputedStyle(element).opacity === '0') {
            element.classList.add('hidden');
            element.removeEventListener('transitionend', handleTransitionEnd);
        }
    });
}

export function addLearningAssistantIcon() {
    if (!LOA.isActive) {
        const icon = document.createElement('img');
        icon.src = 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FBVZ1P%2FbtsHujJOGgh%2FRbPh8Ec0BVWWpsP1sf7VUk%2Fimg.png';
        icon.id = 'learningAssistantIcon';
        icon.className = 'learningAssistantIcon';

        const label = document.createElement('div');
        label.id = 'learningAssistantLabel';
        label.innerText = 'LOA';
        label.className = 'learningAssistantLabel';

        document.body.appendChild(icon);
        document.body.appendChild(label);

        icon.addEventListener('click', function() {
            addFadeOut(icon);
            addFadeOut(label);
            toggleNavbarVisibility();
        });

        icon.onmousedown = function(event) {
            if (event.button === 2) return;

            event.preventDefault();
            let shiftX = event.clientX - icon.getBoundingClientRect().left;
            let shiftY = event.clientY - icon.getBoundingClientRect().top;

            icon.src = 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FmFV94%2FbtsHtH5L7cw%2FWe4wvySmHAUv8m4ANiWesk%2Fimg.png';

            function moveAt(pageX, pageY) {
                let newX = pageX - shiftX;
                let newY = pageY - shiftY;
                let windowWidth = document.documentElement.clientWidth;
                let windowHeight = document.documentElement.clientHeight;

                if (newX < 0) newX = 0;
                if (newY < 0) newY = 0;
                if (newX + icon.offsetWidth > windowWidth) newX = windowWidth - icon.offsetWidth;
                if (newY + icon.offsetHeight > windowHeight) newY = windowHeight - icon.offsetHeight;

                icon.style.left = newX + 'px';
                icon.style.top = newY + 'px';
                label.style.left = newX + 'px';
                label.style.top = (newY + icon.offsetHeight) + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            function resetIcon() {
                document.removeEventListener('mousemove', onMouseMove);
                icon.onmouseup = null;
                icon.onmouseleave = null;
                icon.oncontextmenu = null;
                icon.src = 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FBVZ1P%2FbtsHujJOGgh%2FRbPh8Ec0BVWWpsP1sf7VUk%2Fimg.png';
            }

            icon.onmouseup = resetIcon;
            icon.onmouseleave = resetIcon;
            icon.oncontextmenu = resetIcon;
        };

        LOA.isActive = true;
    }
}

export function removeLearningAssistantIcon() {
    const iconElement = document.getElementById('learningAssistantIcon');
    const labelElement = document.getElementById('learningAssistantLabel');
    if (iconElement) {
        iconElement.remove();
        if (labelElement) labelElement.remove();
        LOA.isActive = false;
        chrome.storage.local.set({ iconDisabled: true });
    }
}
