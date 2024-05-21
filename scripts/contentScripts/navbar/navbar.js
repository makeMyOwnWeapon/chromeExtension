import { createNavbarHeader } from './header.js';
import { createNavbarFooter } from './footer.js';
import { displayWorkbookContent } from '../workbook/workbook.js';

let observer;

export function toggleNavbarVisibility() {
    const loaIcon = document.querySelector("#learningAssistantIcon");
    const navbar = document.getElementById('learningAssistantNavbar');
    if (navbar) {
        if (navbar.style.zIndex === '1000') {
            navbar.style.zIndex = '-1';
        } else {
            navbar.style.zIndex = '1000';
            navbar.style.left = loaIcon.style.left;
            navbar.style.top = loaIcon.style.top;
        }
    } else {
        createDraggableNavbar();
        const navbar = document.getElementById('learningAssistantNavbar');
        navbar.style.left = loaIcon.style.left;
        navbar.style.top = loaIcon.style.top;
    }
}

function createDraggableNavbar() {
    const navbar = document.createElement('div');
    navbar.id = 'learningAssistantNavbar';
    const header = createNavbarHeader();
    navbar.appendChild(header);

    const contentDiv = document.createElement('div');
    contentDiv.id = 'navbarContent';
    navbar.appendChild(contentDiv);

    const footer = createNavbarFooter();
    footer.style.position = 'static';
    navbar.appendChild(footer);

    navbar.onmousedown = function(event) {
        if (event.button === 2) return;
    
        event.preventDefault();
        let shiftX = event.clientX - navbar.getBoundingClientRect().left;
        let shiftY = event.clientY - navbar.getBoundingClientRect().top;
        
        function moveAt(pageX, pageY) {
            let newX = pageX - shiftX;
            let newY = pageY - shiftY;

            navbar.style.left = newX + 'px';
            navbar.style.top = newY + 'px';
        }
    
        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }
    
        document.addEventListener('mousemove', onMouseMove);
    
        navbar.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            navbar.onmouseup = null;
            navbar.onmouseleave = null;
        };
    
        navbar.onmouseleave = function() {
            document.removeEventListener('mousemove', onMouseMove);
            navbar.onmouseup = null;
            navbar.onmouseleave = null;
        };
    
        navbar.oncontextmenu = function() {
            document.removeEventListener('mousemove', onMouseMove);
            navbar.onmouseup = null;
            navbar.onmouseleave = null;
            navbar.oncontextmenu = null;
        };
    };
    
    observeTextChange();
    document.body.appendChild(navbar);
    displayWorkbookContent();
}


function observeTextChange() {
    const targetNode = document.querySelector('.css-1vtpfoe');
    if (!targetNode) return;

    const config = { childList: true, characterData: true, subtree: true };

    observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                window.location.reload();
            }
        }
    });

    observer.observe(targetNode, config);
}

export function disconnectObserver() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    else {
        console.log('disconnectObersever Error')
    }
}