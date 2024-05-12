import { createNavbarHeader } from './header.js';
import { createNavbarFooter } from './footer.js';
import { displaySummaryContent } from '../summary/summary.js';
import { displayWorkbookContent } from '../workbook/workbook.js';

export function toggleNavbarVisibility() {
    const navbar = document.getElementById('learningAssistantNavbar');
    if (navbar) {
        if (navbar.style.zIndex === '1000') {
            navbar.style.zIndex = '-1';
        } else {
            navbar.style.zIndex = '1000';
        }
    } else {
        createDraggableNavbar();
    }
}

function createDraggableNavbar() {
    const navbar = document.createElement('div');
    navbar.id = 'learningAssistantNavbar';
    navbar.className = 'css-nllztk';
    navbar.style.width = '300px';
    navbar.style.position = 'fixed';
    navbar.style.top = '100px';
    navbar.style.right = '10px';
    navbar.style.backgroundColor = '#f4f4f9';
    navbar.style.border = '1px solid #ccc';
    navbar.style.zIndex = '1000';
    navbar.style.textAlign = 'center';
    navbar.style.display = 'flex';
    navbar.style.flexDirection = 'column';
    navbar.style.borderRadius = '8px';
    navbar.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    navbar.style.zIndex = '1000';

    const header = createNavbarHeader();
    navbar.appendChild(header);

    const contentDiv = document.createElement('div');
    contentDiv.id = 'navbarContent';
    contentDiv.style.padding = '10px 20px 20px 20px';
    contentDiv.style.height = '100%';
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
            let windowWidth = document.documentElement.clientWidth;
            let windowHeight = document.documentElement.clientHeight;
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + navbar.offsetWidth > windowWidth) newX = windowWidth - navbar.offsetWidth;
            if (newY + navbar.offsetHeight > windowHeight) newY = windowHeight - navbar.offsetHeight;
            
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
    
    
    document.body.appendChild(navbar);

    setupButtonHandlers();
}

function setupButtonHandlers() {
    const summaryButton = document.getElementById('summaryButton');
    const workbookButton = document.getElementById('workbookButton');
    // const openIconButton = document.getElementById('openIcon');
    // const closeIconButton = document.getElementById('closeIcon');
    //if (summaryButton && workbookButton && openIconButton && closeIconButton) {
    if (summaryButton && workbookButton) {
        summaryButton.onclick = displaySummaryContent;
        workbookButton.onclick = displayWorkbookContent;
        // openIconButton.onclick = displaySummaryContent;
        // closeIconButton.onclick = displaySummaryContent;
    } else {
        console.error('One or more elements are missing');
    }

}
