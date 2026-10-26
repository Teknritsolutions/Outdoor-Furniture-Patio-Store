/* Native dialog provides focus containment and Escape behavior. */
(() => {
    const dialog = document.querySelector("#lightbox");
    if (!dialog) return;
    const cards = [...document.querySelectorAll(".gallery-card")];
    let visible = window.TERRAVELLE_GALLERY;
    let index = 0;
    let opener;
    function show() {
        const item = visible[index];
        const image = document.querySelector("#lightbox-image");
        image.removeAttribute("srcset");
        image.src = `../assets/images/${item.image}`;
        image.alt = `${item.category} outdoor space: ${item.title}`;
        document.querySelector("#lightbox-caption").textContent =
            `${item.title} · ${item.category} · ${index + 1} of ${visible.length}`;
    }
    function move(direction) {
        index = (index + direction + visible.length) % visible.length;
        show();
    }
    document.querySelectorAll("[data-gallery-category]").forEach((button) =>
        button.addEventListener("click", () => {
            const category = button.dataset.galleryCategory;
            visible = window.TERRAVELLE_GALLERY.filter(
                (item) => category === "All" || item.category === category,
            );
            cards.forEach((card) => {
                card.hidden = category !== "All" && card.dataset.category !== category;
            });
            document.querySelectorAll("[data-gallery-category]").forEach((b) => {
                b.classList.toggle("active", b === button);
                b.setAttribute("aria-pressed", String(b === button));
            });
            document.querySelector("#gallery-count").textContent = `${visible.length} spaces`;
            document.querySelector(".gallery-grid").scrollIntoView({
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
                block: "start",
            });
        }),
    );
    cards.forEach((card) =>
        card.addEventListener("click", () => {
            opener = card;
            index = visible.findIndex((item) => item.id === Number(card.dataset.galleryId));
            show();
            dialog.showModal();
            document.body.style.overflow = "hidden";
        }),
    );
    document.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
    document.querySelector(".lightbox-prev").addEventListener("click", () => move(-1));
    document.querySelector(".lightbox-next").addEventListener("click", () => move(1));
    dialog.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
        }
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
        }
    });
    dialog.addEventListener("click", (event) => {
        const rect = dialog.getBoundingClientRect();
        if (
            event.target === dialog &&
            (event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom)
        )
            dialog.close();
    });
    dialog.addEventListener("close", () => {
        document.body.style.overflow = "";
        opener?.focus();
    });
})();
