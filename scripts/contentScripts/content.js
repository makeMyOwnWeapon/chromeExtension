import '../../scss/main.scss';
import { addLearningAssistantIcon, removeLearningAssistantIcon } from './icon/icon.js';
// import {turnOnLogging, turnOffLogging} from './subtitle/logging.js';
// import { showWakeUpModal } from './alarm/wakeupmodal.js';


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.command === 'turnOn') {
        addLearningAssistantIcon();
        // turnOnLogging();
        sendResponse({result: "success"});

    } else if (request.command === 'turnOff') {
        removeLearningAssistantIcon();
        // turnOffLogging();
        sendResponse({result: "success"});
    }
});