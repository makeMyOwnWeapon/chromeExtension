export function createNavbarFooter() {
  const footer = document.createElement("div");
  footer.className = "loa-navbar-footer"
  footer.innerHTML =
    '<p>Copyright © 2024 Learn On-Air</p>';
  return footer;
}
