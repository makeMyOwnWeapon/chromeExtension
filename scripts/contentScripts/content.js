import '../../scss/main.scss';
import { addLearningAssistantIcon, removeLearningAssistantIcon } from './icon/icon.js';
// import { connect, disconnect } from './connection/connection.js'
// import {turnOnLogging, turnOffLogging} from './subtitle/logging.js';
// import { showWakeUpModal } from './alarm/wakeupmodal.js';


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.command === 'turnOn') {
        addLearningAssistantIcon();
        // connect();
        // showWakeUpModal();
        // turnOnLogging();
        sendResponse({result: "success"});

    } else if (request.command === 'turnOff') {
        removeLearningAssistantIcon();
        // disconnect();
        // turnOffLogging();
        sendResponse({result: "success"});
    }
});