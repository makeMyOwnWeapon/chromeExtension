export function createNavbarFooter() {
    const footer = document.createElement('div');
    footer.style.width = '100%';
    footer.style.padding = '10px 0';
    footer.style.position = 'absolute';
    footer.style.bottom = '0';
    footer.style.textAlign = 'center';
    footer.style.borderRadius = '1px';
    footer.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
    footer.innerHTML = '<p style="color: #000000;">Copyright © 2024 Learn On-Air</p>';
    return footer;
}
