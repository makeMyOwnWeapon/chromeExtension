export function createAndPopupModalWithHTML({headerHTML = '', bodyHTML = '', footerHTML = ''}) {
    const videoContainer = document.querySelector('.shaka-video-container');
    const modal = document.createElement('div');
    modal.classList.add('overlay');
    modal.appendChild(modalContentTemplate(headerHTML, bodyHTML, footerHTML));
    videoContainer.parentNode.appendChild(modal);
    return modal;
}

export function createAndPopupModalWithElement({headerElement = undefined, bodyElement = undefined, footerElement = undefined}) {
    const videoContainer = document.querySelector('.shaka-video-container');
    const modal = document.createElement('div');
    
    const header = createElementWithClass('div', 'modal-header');
    header.appendChild(headerElement);
    const body = createElementWithClass('div', 'modal-body');
    body.appendChild(bodyElement);
    const footer = createElementWithClass('div', 'modal-footer');
    footer.appendChild(footerElement);

    modal.classList.add('overlay');
    try {
        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);
    } catch (ignore) {}

    videoContainer.parentNode.appendChild(modal);
    return modal;
}

function modalContentTemplate(headerHTML = '', bodyHTML = '', footerHTML = '') {
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.innerHTML = `
        <div class="modal-header">
            ${headerHTML}
        </div>
        <div class="modal-body">
            ${bodyHTML}
        </div>
        <div class="modal-footer">
            ${footerHTML}
        </div>
    `
    return modalContent;
}

function createElementWithClass(type, className) {
    const element = document.createElement(type);
    element.className = className;
    return element;
}