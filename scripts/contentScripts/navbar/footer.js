export function createNavbarFooter() {
    const footer = document.createElement('div');
    footer.style.width = '100%';
    footer.style.backgroundColor = '#f1f1f1';
    footer.style.padding = '10px 0';
    footer.style.position = 'absolute';
    footer.style.bottom = '0';
    footer.style.textAlign = 'center';
    footer.innerHTML = '<p>Copyright © 2024 Learn on Air</p>';
    return footer;
}
