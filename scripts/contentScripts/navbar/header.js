export function createNavbarHeader() {
    const header = document.createElement('div');
    header.id = 'navbarHeader';
    header.style.padding = '20px';
    header.innerHTML = `
        <div style="position: absolute; top: 1px; right: 3px; cursor: pointer;">
            &#10005; <!-- HTML entity for the letter 'X' -->
        </div>
        <p style="font-size: 24px; color: #4CAF50; padding: 13px 0; font-weight: bold;">Let's LOA!</p>
        <br>
        <button id="summaryButton" style="background-color: #4CAF50; color: white; padding: 10px 20px; margin: 8px 0; border: none; border-radius: 4px; cursor: pointer; transition: transform 0.1s;">Summary</button>
        <button id="workbookButton" style="background-color: #4CAF50; color: white; padding: 10px 20px; margin: 8px 0; border: none; border-radius: 4px; cursor: pointer; transition: transform 0.1s;">Workbook</button>
    `;

    header.querySelectorAll('button').forEach(button => {
        button.onmouseenter = () => button.style.backgroundColor = '#45a049';
        button.onmouseleave = () => button.style.backgroundColor = '#4CAF50';
        button.onmousedown = () => button.style.transform = 'translate(2px, 2px)';
        button.onmouseup = () => button.style.transform = 'translate(0, 0)';
    });

    const closeButton = header.querySelector('div');
    closeButton.onclick = function() {
        document.getElementById('learningAssistantNavbar').style.zIndex = '-1';
    };

    return header;
}
