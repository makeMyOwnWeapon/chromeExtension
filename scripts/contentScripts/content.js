import '../../scss/main.scss';
import { addLearningAssistantIcon, removeLearningAssistantIcon } from './icon/icon.js';
import { toggleNavbarVisibility } from './navbar/navbar.js';

chrome.storage.local.get('authToken', function(data) {
    if (data.authToken) {
        var icon = document.createElement('img');
        icon.src = 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FrsQP1%2FbtsGY1xO42N%2FHguDHJehMxoHTt2PoSter1%2Fimg.png';
        icon.style.position = 'fixed';
        icon.style.top = '10px';
        icon.style.right = '10px';
        icon.style.width = '100px';
        icon.style.height = '100px';
        icon.style.zIndex = '1000';
        
        document.body.appendChild(icon);

        icon.addEventListener('click', function() {
            toggleNavbarVisibility();
        });
    } else {
        console.log('인증 토큰이 없어 아이콘을 표시할 수 없습니다.');
    }
    icon.onmousedown = function(event) {
        if (event.button === 2) return;
    
        event.preventDefault();
        let shiftX = event.clientX - icon.getBoundingClientRect().left;
        let shiftY = event.clientY - icon.getBoundingClientRect().top;
        
        function moveAt(pageX, pageY) {
            let newX = pageX - shiftX;
            let newY = pageY - shiftY;
            let windowWidth = document.documentElement.clientWidth;
            let windowHeight = document.documentElement.clientHeight;
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + icon.offsetWidth > windowWidth) newX = windowWidth - navbar.offsetWidth;
            if (newY + icon.offsetHeight > windowHeight) newY = windowHeight - navbar.offsetHeight;
            
            icon.style.left = newX + 'px';
            icon.style.top = newY + 'px';
        }
    
        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }
    
        document.addEventListener('mousemove', onMouseMove);
    
        icon.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            icon.onmouseup = null;
            icon.onmouseleave = null;
        };
    
        icon.onmouseleave = function() {
            document.removeEventListener('mousemove', onMouseMove);
            icon.onmouseup = null;
            icon.onmouseleave = null;
        };
    
        icon.oncontextmenu = function() {
            document.removeEventListener('mousemove', onMouseMove);
            icon.onmouseup = null;
            icon.onmouseleave = null;
            icon.oncontextmenu = null;
        };
    }
});

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if (request.command === 'turnOn') {
//         addLearningAssistantIcon();
//         sendResponse({result: "success"});

//     } else if (request.command === 'turnOff') {
//         removeLearningAssistantIcon();
//         sendResponse({result: "success"});
//     }
// });