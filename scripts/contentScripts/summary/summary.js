function updateSummaryContent(content) {
    const navbarContent = document.getElementById('navbarContent');
    if (navbarContent) {
        navbarContent.innerHTML = content;
    } else {
        console.error('Navbar content element not found');
    }
}

export function displaySummaryContent() {
    updateSummaryContent('<p>SummaryPage</p>');
}