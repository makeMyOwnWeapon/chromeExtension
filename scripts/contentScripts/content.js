import '../../scss/main.scss';
import { addLearningAssistantIcon, removeLearningAssistantIcon } from './icon/icon.js';
"use strict"

window.onload = function() {
    setTimeout(function() {

        // 모든 'css-zl1inp' 클래스를 가진 'li' 요소를 찾습니다.
        const listItems = document.querySelectorAll('li.css-zl1inp');

        // 다섯 번째 'li' 요소가 존재하는지 확인합니다.
        if (listItems.length >= 5) {
            const fifthListItem = listItems[4];

            // 다섯 번째 'li' 요소 내부에서 버튼을 찾습니다.
            const button = fifthListItem.querySelector('.mantine-UnstyledButton-root.mantine-Button-root.mantine-syxma7');

            // 버튼이 존재하면 클릭 이벤트를 트리거합니다.
            if (button) {
                button.click();
                setTimeout(function() {button.click()}, 0);
                
            } else {
                console.error('해당 요소에 버튼이 없습니다');
            }
        } else {
            console.error('5개의 버튼이 없습니다');
        }

        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.command === 'turnOn') {
                chrome.storage.local.set({ iconDisabled: false }, function() {
                    addLearningAssistantIcon();
                    sendResponse({ result: "success" });
                });
            } else if (request.command === 'turnOff') {
                removeLearningAssistantIcon();
                disconnectObserver();
                sendResponse({ result: "success" });
            }
        });

        chrome.storage.local.get(['authToken', 'iconDisabled'], function (data) {
            if (data.authToken && !data.iconDisabled) {
                addLearningAssistantIcon();
            }
        });
    }, 1000);
};
