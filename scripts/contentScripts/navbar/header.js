export function createNavbarHeader() {
    const header = document.createElement('div');
    header.id = 'navbarHeader';
    header.style.padding = '20px';
    header.innerHTML = `
        <div id="closeButton" style="position: absolute; top: 1px; right: 3px; cursor: pointer;">
            &#10005; <!-- HTML entity for the letter 'X' -->
        </div>
        <p>Let's LOA!</p>
        <br>
        <button id="summaryButton">Summary</button>
        <button id="workbookButton">Workbook</button>
    `;

    const closeButton = header.querySelector('#closeButton');
    closeButton.addEventListener('click', () => {
        header.style.zIndex = '-1'; // 'X' 클릭 시 z-index를 -1로 설정
    });

    return header;
}
