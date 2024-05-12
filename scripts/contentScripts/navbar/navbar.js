import { createNavbarHeader } from './header.js';
import { createNavbarFooter } from './footer.js';
//import { displaySummaryContent } from '../summary/summary.js';
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
    navbar.draggable="true"
    navbar.id = 'learningAssistantNavbar';
    
    navbar.addEventListener("drag", (event) => {
        event.target.opacity = 1;
        console.log(event);
        console.log("dragging");
      });
      
      navbar.addEventListener("dragstart", (event) => {
        // 드래그한 요소에 대한 참조 저장
        dragged = event.target;
        event.preventDefault();
        // 반투명하게 만들기
        // event.target.classList.add("dragging");
      });
      
      navbar.addEventListener("dragend", (event) => {
        // 투명도 초기화
        event.target.classList.remove("dragging");
        console.log("dragend");
      });
      
      /* 드롭 대상에서 발생하는 이벤트 */
      navbar.addEventListener(
        "dragover",
        (event) => {
          // 드롭을 허용하기 위해 기본 동작 취소
          event.preventDefault();
        },
        false,
      );
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

    document.body.appendChild(navbar);
    displayWorkbookContent();
};
    
    // setupButtonHandlers();
// }

// function setupButtonHandlers() {
//     const summaryButton = document.getElementById('summaryButton');
//     const workbookButton = document.getElementById('workbookButton');
//     // const openIconButton = document.getElementById('openIcon');
//     // const closeIconButton = document.getElementById('closeIcon');
//     //if (summaryButton && workbookButton && openIconButton && closeIconButton) {
//     if (summaryButton && workbookButton) {
//         summaryButton.onclick = displaySummaryContent;
//         workbookButton.onclick = displayWorkbookContent;
//         // openIconButton.onclick = displaySummaryContent;
//         // closeIconButton.onclick = displaySummaryContent;
//     } else {
//         console.error('One or more elements are missing');
//     }

// }
    // navbar.onmousedown = function(event) {
    //     if (event.button === 2) return;
    
        // event.preventDefault();
        // let shiftX = event.clientX - navbar.getBoundingClientRect().left;
        // let shiftY = event.clientY - navbar.getBoundingClientRect().top;
        
        // function moveAt(pageX, pageY) {
        //     navbar.style.left = pageX - shiftX + 'px';
        //     navbar.style.top = pageY - shiftY + 'px';
        // }
    
        // function onMouseMove(event) {
        //     moveAt(event.pageX, event.pageY);
        // }
    
    
        // navbar.onmouseup = function() {
        //     document.removeEventListener('mousemove', onMouseMove);
        //     navbar.onmouseup = null;
        // };
    