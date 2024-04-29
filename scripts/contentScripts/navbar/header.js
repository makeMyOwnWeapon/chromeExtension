export function createNavbarHeader() {
    const header = document.createElement('div');
    header.id = 'navbarHeader';
    header.style.padding = '20px';
    header.innerHTML = `
        <div style="position: absolute; top: 1px; right: 3px; cursor: pointer;">
            &#10005; <!-- HTML entity for the letter 'X' -->
        </div>
        <p>Let's LOA!</p>
        <br>
        <button id="summaryButton">Summary</button>
        <button id="workbookButton">Workbook</button>
    `;

    const closeButton = header.querySelector('div');
    closeButton.onclick = function() {
        document.getElementById('learningAssistantNavbar').style.zIndex = '-1';
    };

    return header;
}