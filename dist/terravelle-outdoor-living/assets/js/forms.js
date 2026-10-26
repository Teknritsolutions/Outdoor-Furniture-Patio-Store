/* Honest demo states; configure production endpoints in main.js. */
(() => {
    const dateInput = document.querySelector('input[type="date"]');
    const localToday = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    };
    if (dateInput) {
        dateInput.min = localToday();
        dateInput.addEventListener("input", () =>
            dateInput.setCustomValidity(
                dateInput.value && dateInput.value < localToday()
                    ? "Please choose today or a future date."
                    : "",
            ),
        );
    }
    const product = new URLSearchParams(location.search).get("product");
    if (product && document.querySelector("#subject")) {
        const item = window.TERRAVELLE_PRODUCTS.find((p) => p.id === product);
        if (item) document.querySelector("#subject").value = `Enquiry about ${item.name}`;
    }
    document.querySelectorAll(".demo-form").forEach((form) => {
        form.querySelectorAll('input[type="text"],textarea').forEach((input) =>
            input.addEventListener("input", () => {
                input.setCustomValidity(
                    input.required && !input.value.trim() ? "Please enter a value." : "",
                );
            }),
        );
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (dateInput && form.contains(dateInput)) dateInput.min = localToday();
            if (!form.reportValidity()) return;
            const status = form.querySelector(".form-status");
            const endpoint = window.TERRAVELLE_CONFIG.endpoints[form.dataset.form];
            status.classList.remove("error");
            if (!endpoint) {
                status.textContent =
                    "Your details pass validation. Demo only: nothing has been sent, subscribed, or booked. Connect a service endpoint to process this request.";
                return;
            }
            const button = form.querySelector('button[type="submit"]');
            button.disabled = true;
            status.textContent = "Sending your request…";
            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(Object.fromEntries(new FormData(form))),
                });
                if (!response.ok) throw new Error("Request failed");
                status.textContent =
                    "Your request was received by the configured service. A showroom visit is confirmed only when the team confirms availability.";
                form.reset();
            } catch {
                status.classList.add("error");
                status.textContent =
                    "Your request could not be processed. Please try again or use the configured showroom contact details.";
            } finally {
                button.disabled = false;
            }
        });
    });
})();
