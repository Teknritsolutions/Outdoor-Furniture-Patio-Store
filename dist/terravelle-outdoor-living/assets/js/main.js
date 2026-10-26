/* Shared static-site interactions and deployment configuration. */
window.TERRAVELLE_CONFIG = {
    endpoints: { contact: "", booking: "", bulk: "", newsletter: "" },
    mapEmbedUrl: "",
    socials: { Instagram: "", Facebook: "", LinkedIn: "" },
};

(() => {
    const trigger = document.querySelector(".home-trigger");
    const dropdown = document.querySelector("#home-menu");
    const menu = document.querySelector("#primary-nav");
    const menuToggle = document.querySelector(".menu-toggle");
    const compactNavigation = window.matchMedia("(max-width: 1199px)");
    const updateMenuHeight = () => {
        const bottom = document.querySelector(".site-header").getBoundingClientRect().bottom;
        menu.style.setProperty("--nav-top", `${Math.max(0, bottom)}px`);
    };
    const setMenu = (open) => {
        updateMenuHeight();
        menu.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
        if (!open) setDropdown(false);
    };
    window.addEventListener("resize", updateMenuHeight);
    window.addEventListener("scroll", updateMenuHeight, { passive: true });
    compactNavigation.addEventListener("change", () => setMenu(false));
    const setDropdown = (open) => {
        dropdown.hidden = !open;
        trigger.setAttribute("aria-expanded", String(open));
    };
    let openedByHover = false;
    trigger.addEventListener("click", () => {
        setDropdown(openedByHover || dropdown.hidden);
        openedByHover = false;
    });
    const homeGroup = document.querySelector(".home-dropdown");
    homeGroup.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "mouse" && !compactNavigation.matches) {
            openedByHover = dropdown.hidden;
            setDropdown(true);
        }
    });
    homeGroup.addEventListener("pointerleave", (event) => {
        openedByHover = false;
        if (event.pointerType === "mouse" && !compactNavigation.matches && !homeGroup.contains(document.activeElement))
            setDropdown(false);
    });
    trigger.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setDropdown(true);
            dropdown.querySelector("a").focus();
        }
    });
    dropdown.addEventListener("keydown", (event) => {
        const links = [...dropdown.querySelectorAll("a")];
        const index = links.indexOf(document.activeElement);
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            const next =
                event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? links.length - 1
                      : (index + (event.key === "ArrowDown" ? 1 : -1) + links.length) %
                        links.length;
            links[next].focus();
        }
    });
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".home-dropdown")) setDropdown(false);
    });
    document.querySelector(".home-dropdown").addEventListener("focusout", (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setDropdown(false);
    });
    menuToggle.addEventListener("click", () => {
        setMenu(!menu.classList.contains("open"));
    });
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        if (!dropdown.hidden) {
            setDropdown(false);
            trigger.focus();
        } else if (menu.classList.contains("open")) {
            setMenu(false);
            menuToggle.focus();
        }
    });
    const themeButton = document.querySelector(".theme-toggle");
    const updateThemeLabel = () => {
        const dark = document.documentElement.dataset.theme === "dark";
        themeButton.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} mode`);
        const icons = new URL("../icons/lucide.svg", document.querySelector('script[src$="/main.js"]').src);
        themeButton.innerHTML = `<svg class="icon" aria-hidden="true"><use href="${icons.href}#${dark ? "sun" : "moon"}"></use></svg>`;
    };
    themeButton.addEventListener("click", () => {
        const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = theme;
        try {
            localStorage.setItem("terravelle-theme", theme);
        } catch {}
        updateThemeLabel();
    });
    window.addEventListener("terravelle-theme-change", updateThemeLabel);
    updateThemeLabel();
    const directionButton = document.querySelector(".direction-toggle");
    const updateDirectionLabel = () => {
        const rtl = document.documentElement.dir === "rtl";
        directionButton.querySelector("span").textContent = rtl ? "LTR" : "RTL";
        directionButton.setAttribute("aria-pressed", String(rtl));
        directionButton.setAttribute(
            "aria-label",
            `Switch to ${rtl ? "left-to-right" : "right-to-left"} layout`,
        );
    };
    directionButton.addEventListener("click", () => {
        const rtl = document.documentElement.dir !== "rtl";
        document.documentElement.dir = rtl ? "rtl" : "ltr";
        const pageUrl = new URL(location.href);
        if (rtl) pageUrl.searchParams.set("dir", "rtl");
        else pageUrl.searchParams.delete("dir");
        history.replaceState(null, "", pageUrl);
        document.querySelectorAll("a[href]").forEach((anchor) => {
            const url = new URL(anchor.getAttribute("href"), location.href);
            if (url.origin !== location.origin || !url.pathname.endsWith(".html")) return;
            if (rtl) url.searchParams.set("dir", "rtl");
            else url.searchParams.delete("dir");
            anchor.href = url.href;
        });
        updateDirectionLabel();
    });
    updateDirectionLabel();
    document.querySelector(".back-top").addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        });
    });
    document.querySelectorAll(".social-demo").forEach((button) => {
        button.addEventListener("click", () => {
            const network = button.getAttribute("aria-label").split(" ")[0];
            const url = window.TERRAVELLE_CONFIG.socials[network];
            if (url) window.open(url, "_blank", "noopener,noreferrer");
            else
                document.querySelector("#social-status").textContent =
                    `${network} profile is not configured in this demo.`;
        });
    });
    const map = document.querySelector("#showroom-map");
    if (map && window.TERRAVELLE_CONFIG.mapEmbedUrl) {
        const iframe = document.createElement("iframe");
        iframe.title = "Terravelle showroom location";
        iframe.loading = "lazy";
        iframe.referrerPolicy = "no-referrer";
        iframe.src = window.TERRAVELLE_CONFIG.mapEmbedUrl;
        map.append(iframe);
    }
    if (new URLSearchParams(location.search).get("dir") === "rtl") {
        document.querySelectorAll("a[href]").forEach((anchor) => {
            const href = anchor.getAttribute("href");
            if (!href.includes(".html") || href.includes("://")) return;
            const url = new URL(href, location.href);
            url.searchParams.set("dir", "rtl");
            anchor.href = url.href;
        });
    }
})();

/* Branded dropdown menus retain native values and form validation. */
(() => {
    document.querySelectorAll("select").forEach((select) => {
        const wrapper = document.createElement("div");
        wrapper.className = "branded-select";
        select.before(wrapper);
        wrapper.append(select);
        select.classList.add("native-select");
        select.tabIndex = -1;
        select.setAttribute("aria-hidden", "true");
        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "select-trigger";
        trigger.setAttribute("aria-haspopup", "listbox");
        trigger.setAttribute("aria-expanded", "false");
        const label = document.querySelector(`label[for="${select.id}"]`);
        if (label) {
            label.id ||= `${select.id}-label`;
            trigger.id = `${select.id}-trigger`;
            label.htmlFor = trigger.id;
        }
        const list = document.createElement("div");
        list.id = `${select.id}-options`;
        list.className = "select-options";
        list.setAttribute("role", "listbox");
        list.setAttribute("aria-label", label?.textContent || "Options");
        list.hidden = true;
        trigger.setAttribute("aria-controls", list.id);
        const options = [...select.options].map((option, index) => {
            const item = document.createElement("div");
            item.setAttribute("role", "option");
            item.tabIndex = -1;
            item.textContent = option.textContent;
            item.addEventListener("click", () => choose(index));
            item.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    choose(index);
                } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
                    event.preventDefault();
                    const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1
                        : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
                    options[next].focus();
                } else if (event.key === "Escape") {
                    close();
                    trigger.focus();
                }
            });
            list.append(item);
            return item;
        });
        function sync() {
            trigger.textContent = select.options[select.selectedIndex]?.textContent || "Choose an option";
            trigger.setAttribute("aria-label", `${label?.textContent || "Select"}: ${trigger.textContent}`);
            options.forEach((item, index) => item.setAttribute("aria-selected", String(index === select.selectedIndex)));
        }
        function close() {
            list.hidden = true;
            trigger.setAttribute("aria-expanded", "false");
        }
        function choose(index) {
            select.selectedIndex = index;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            sync();
            close();
            trigger.focus();
        }
        function open(keyboard = false) {
            list.hidden = false;
            trigger.setAttribute("aria-expanded", "true");
            if (keyboard) options[Math.max(0, select.selectedIndex)].focus();
        }
        trigger.addEventListener("click", () => list.hidden ? open() : close());
        trigger.addEventListener("keydown", event => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                open(true);
            } else if (event.key === "Escape") close();
        });
        wrapper.addEventListener("focusout", event => {
            if (!wrapper.contains(event.relatedTarget)) close();
        });
        document.addEventListener("click", event => {
            if (!wrapper.contains(event.target)) close();
        });
        select.addEventListener("change", sync);
        select.addEventListener("invalid", () => trigger.focus());
        select.form?.addEventListener("reset", () => setTimeout(sync, 0));
        wrapper.append(trigger, list);
        sync();
    });
})();
