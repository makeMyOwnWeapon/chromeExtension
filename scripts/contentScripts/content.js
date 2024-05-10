import '../../scss/main.scss';
import { addLearningAssistantIcon, removeLearningAssistantIcon } from './icon/icon.js';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.command === 'turnOn') {
        addLearningAssistantIcon();

        sendResponse({result: "success"});

    } else if (request.command === 'turnOff') {
        removeLearningAssistantIcon();
        sendResponse({result: "success"});
    }
});