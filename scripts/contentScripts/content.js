import '../../scss/main.scss';
import { addLearningAssistantIcon, removeLearningAssistantIcon } from './icon/icon.js';
"use strict"

window.onload = function() {
    setTimeout(function() {
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
