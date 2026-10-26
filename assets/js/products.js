/* Catalog filters, query-driven product details, and individual care guidance. */
(() => {
    const products = window.TERRAVELLE_PRODUCTS;
    const params = new URLSearchParams(location.search);
    const formatPrice = (price) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(price);
    const catalog = document.querySelector("#product-catalog");
    if (catalog) {
        let category = params.get("category") || "All";
        if (!products.some((p) => p.category === category)) category = "All";
        const search = document.querySelector("#product-search");
        const sort = document.querySelector("#product-sort");
        const cards = [...catalog.children];
        function render() {
            let list = products.filter(
                (p) =>
                    (category === "All" || p.category === category) &&
                    p.name.toLowerCase().includes(search.value.trim().toLowerCase()),
            );
            if (sort.value === "price-asc") list.sort((a, b) => a.price - b.price);
            if (sort.value === "price-desc") list.sort((a, b) => b.price - a.price);
            if (sort.value === "name") list.sort((a, b) => a.name.localeCompare(b.name));
            cards.forEach((card, index) => {
                card.hidden = !list.includes(products[index]);
            });
            list.forEach((p) => catalog.append(cards[products.indexOf(p)]));
            document.querySelector("#result-count").textContent =
                `${list.length} ${list.length === 1 ? "product" : "products"}${category !== "All" ? ` · ${category}` : ""}`;
            document.querySelector("#empty-products").hidden = list.length > 0;
            document.querySelectorAll("[data-category]").forEach((button) => {
                const active = button.dataset.category === category;
                button.classList.toggle("active", active);
                button.setAttribute("aria-pressed", String(active));
            });
        }
        document.querySelectorAll("[data-category]").forEach((button) =>
            button.addEventListener("click", () => {
                category = button.dataset.category;
                const url = new URL(location.href);
                if (category === "All") url.searchParams.delete("category");
                else url.searchParams.set("category", category);
                history.pushState(null, "", url);
                render();
                catalog.scrollIntoView({
                    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
                    block: "start",
                });
            }),
        );
        window.addEventListener("popstate", () => {
            const requestedCategory = new URLSearchParams(location.search).get("category");
            category = products.some((p) => p.category === requestedCategory)
                ? requestedCategory
                : "All";
            render();
        });
        search.addEventListener("input", render);
        sort.addEventListener("change", render);
        render();
    }
    const overview = document.querySelector("#product-overview");
    if (!overview) return;
    const requested = params.get("id");
    const p = products.find((item) => item.id === requested) || products[0];
    const main = `../assets/images/products/details/${p.id}-main.webp`;
    const alternate = `../assets/images/products/details/${p.id}-detail.webp`;
    overview.innerHTML = `<div class="detail-gallery"><img id="detail-image" src="${main}" alt="${p.name}, full view" width="1200" height="900" fetchpriority="high"><div class="detail-thumbs"><button data-image="${main}" data-alt="${p.name}, full view" aria-label="Show full product view" aria-pressed="true"><img src="${main}" alt="" width="100" height="80"></button><button data-image="${alternate}" data-alt="Construction detail of ${p.name}" aria-label="Show construction detail" aria-pressed="false"><img src="${alternate}" alt="" width="100" height="80"></button></div></div><div class="detail-copy"><p class="eyebrow">${p.category}</p><h1>${p.name}</h1><p class="price">${formatPrice(p.price)}</p><p>${p.description}</p><p>Crafted in ${p.material.toLowerCase()} with a ${p.finish.toLowerCase()}. A thoughtful addition to your outdoor setting.</p><p class="demo-label">Demonstration product · Illustrative USD price</p>${requested && requested !== p.id ? '<p role="status">That product was not found. Showing our Solana chair instead.</p>' : ""}<div class="actions"><a class="button" href="contact.html?product=${p.id}#main">Enquire About This Piece</a><a class="button button-outline" href="contact.html#booking">Visit Our Showroom</a></div></div>`;
    document.querySelector("#detail-crumb").textContent = p.name;
    document.title = `${p.name} | Terravelle Outdoor Living`;
    document.querySelector('meta[name="description"]').content =
        `${p.name}: ${p.description} View dimensions, materials, and care guidance.`;
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector("#specifications").innerHTML = [
        ["Material", p.material],
        ["Dimensions", p.dimensions],
        ["Finish", p.finish],
        ["Category", p.category],
    ]
        .map(([title, value]) => `<div><dt>${title}</dt><dd>${value}</dd></div>`)
        .join("");
    const care = p.material.includes("Teak")
        ? "Clean with mild soap and water. Allow to dry fully before covering. Natural teak may develop a silver patina; a suitable teak protector can help preserve the original tone."
        : p.material.includes("rattan")
          ? "Dust the weave with a soft brush and wipe with mild soap and water. Avoid harsh chemicals, and dry before covering."
          : p.material.includes("Cotton")
            ? "Keep fabric dry when not in use. Follow the textile care label, avoid prolonged wet storage, and inspect suspension points before every use."
            : p.material.includes("iron")
              ? "Inspect protective coatings regularly. Treat small rust spots promptly with suitable primer and paint. Store in a dry area or use breathable covers."
              : p.category === "Outdoor Lighting"
                ? "Follow the manufacturer’s electrical and weather-resistance instructions. Disconnect power before cleaning and avoid immersing electrical components."
                : p.category === "Planters"
                  ? "Clean gently and ensure appropriate drainage. Check frost suitability before leaving outdoors in freezing conditions."
                  : "Wash gently with mild soap and a soft cloth. Avoid abrasive cleaners and inspect protective finishes regularly. Dry thoroughly before storing or covering.";
    document.querySelector("#product-care").innerHTML =
        `<div class="care-copy"><h3>Caring for ${p.material.toLowerCase()}</h3><p>${care}</p><p>Product-specific instructions from your actual supplier take priority. Dimensions and specifications shown are demo data.</p></div><aside class="care-guide"><svg class="icon" aria-hidden="true"><use href="../assets/icons/lucide.svg#leaf"></use></svg><h3>Know your materials</h3><p>Explore textures, finishes, and simple care routines for beautiful outdoor living.</p><a class="button" href="materials-guide.html">Explore the materials guide<svg class="icon" aria-hidden="true"><use href="../assets/icons/lucide.svg#arrow-up-right"></use></svg></a></aside>`;
    const related = products
        .filter((item) => item.id !== p.id && item.category === p.category)
        .concat(products.filter((item) => item.category !== p.category))
        .slice(0, 3);
    document.querySelector("#related-products").innerHTML = related
        .map(
            (item) =>
                `<article class="product-card"><img src="../assets/images/products/related/${item.id}.webp" alt="${item.name} in an outdoor setting" width="1200" height="900" loading="lazy"><div class="product-body"><p class="eyebrow">${item.category}</p><h3>${item.name}</h3><p class="price">${formatPrice(item.price)}</p><p>${item.description}</p><a class="button button-outline" href="product-details.html?id=${item.id}">View Details</a></div></article>`,
        )
        .join("");
    const img = document.querySelector("#detail-image");
    document.querySelectorAll("[data-image]").forEach((button) =>
        button.addEventListener("click", () => {
            img.src = button.dataset.image;
            img.alt = button.dataset.alt;
            document
                .querySelectorAll("[data-image]")
                .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        }),
    );
})();
