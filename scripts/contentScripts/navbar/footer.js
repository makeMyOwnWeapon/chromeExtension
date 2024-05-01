export function createNavbarFooter() {
    const footer = document.createElement('div');
    footer.style.width = '100%';
    footer.style.backgroundColor = '#d0d0d0';
    footer.style.padding = '10px 0';
    footer.style.position = 'absolute';
    footer.style.bottom = '0';
    footer.style.textAlign = 'center';
    footer.innerHTML = '<p style = "color: #000000;">Copyright © 2024 Learn On-Air</p>';
    return footer;
}
