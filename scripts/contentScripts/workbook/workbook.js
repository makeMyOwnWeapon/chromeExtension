function updateWorkbookContent(content) {
    const navbarContent = document.getElementById('navbarContent');
    if (navbarContent) {
        navbarContent.innerHTML = content;
    } else {
        console.error('Navbar content element not found');
    }
}

export function displayWorkbookContent() {
    updateWorkbookContent('<p>WorkbookPage</p>');
}