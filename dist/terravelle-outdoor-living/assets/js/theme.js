/* Loaded before CSS to avoid a theme flash. */
(() => {
    let saved;
    try {
        saved = localStorage.getItem("terravelle-theme");
    } catch {}
    const dark = window.matchMedia("(prefers-color-scheme: dark)");
    document.documentElement.dataset.theme = saved || (dark.matches ? "dark" : "light");
    if (new URLSearchParams(location.search).get("dir") === "rtl") {
        document.documentElement.dir = "rtl";
    }
    dark.addEventListener("change", (event) => {
        try {
            if (localStorage.getItem("terravelle-theme")) return;
        } catch {}
        document.documentElement.dataset.theme = event.matches ? "dark" : "light";
        window.dispatchEvent(new Event("terravelle-theme-change"));
    });
})();
