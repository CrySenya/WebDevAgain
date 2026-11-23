let name = "Lucky";
let description = "Gwapo";

console.log(name + " is " + description)

const sidebarToggle = document.querySelector(".sidebar-toggle");
const sidebar = document.querySelector(".sidebar");

sidebarToggle.addEventListener("click", () => {
    const isOpen = sidebarToggle.getAttribute("aria-expanded") === "true";

    sidebarToggle.setAttribute("aria-expanded", String(!isOpen));
    sidebarToggle.setAttribute("aria-label", isOpen ? "Open sidebar" : "Close sidebar");
    sidebar.setAttribute("aria-hidden", String(isOpen));
    sidebar.classList.toggle("is-open", !isOpen);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebarToggle.getAttribute("aria-expanded") === "true") {
        sidebarToggle.click();
        sidebarToggle.focus();
    }
});