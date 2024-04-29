import {addLearningAssistantIcon, removeLearningAssistantIcon} from './icon/icon.js';
import '../../scss/main.scss';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command === 'turnOn') {
        addLearningAssistantIcon();
        sendResponse({result: "success"});

    } else if (request.command === 'turnOff') {
        removeLearningAssistantIcon();
        sendResponse({result: "success"});
    }
});