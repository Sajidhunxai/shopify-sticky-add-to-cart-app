(() => {
  const bar = document.querySelector("[data-satc-bar]");
  if (!bar) return;

  const button = bar.querySelector("[data-satc-button]");
  const priceEl = bar.querySelector("[data-satc-price]");
  const formSelector =
    'form[action*="/cart/add"], form[action$="/cart/add"], product-form form, [data-product-form]';
  const afterAdd = bar.dataset.afterAdd || "stay";
  const hideNearForm = bar.dataset.hideNearForm === "true";
  const productId = bar.dataset.productId;

  const getVariantId = () => {
    const checked = document.querySelector(
      'form[action*="/cart/add"] [name="id"]:checked, form[action*="/cart/add"] select[name="id"]',
    );
    if (checked && "value" in checked && checked.value) return checked.value;

    const hidden = document.querySelector(
      'form[action*="/cart/add"] input[name="id"]',
    );
    if (hidden && hidden.value) return hidden.value;

    return bar.dataset.variantId || "";
  };

  const syncPriceFromForm = () => {
    if (!priceEl) return;
    const priceSource =
      document.querySelector("[data-product-price], .price__regular .price-item--regular, .product__price, .price .money") ||
      null;
    if (priceSource && priceSource.textContent) {
      priceEl.textContent = priceSource.textContent.trim();
    }
  };

  const setVisible = (visible) => {
    bar.classList.toggle("is-visible", visible);
  };

  const setHiddenNearForm = (hidden) => {
    bar.classList.toggle("is-hidden-near-form", hidden);
  };

  // Show after a short scroll so it feels intentional.
  const showAfterScroll = Number(bar.dataset.showAfterScroll || 180);
  const onScroll = () => {
    if (window.scrollY > showAfterScroll) {
      setVisible(true);
      window.removeEventListener("scroll", onScroll);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  if (window.scrollY > showAfterScroll) onScroll();

  if (hideNearForm) {
    const form = document.querySelector(formSelector);
    if (form && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setHiddenNearForm(Boolean(entry && entry.isIntersecting));
        },
        { threshold: 0.35 },
      );
      observer.observe(form);
    }
  }

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest(formSelector)) {
      syncPriceFromForm();
    }
  });

  button?.addEventListener("click", async () => {
    const variantId = getVariantId();
    if (!variantId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    button.disabled = true;
    const original = button.textContent;
    button.textContent = "Adding…";

    try {
      const response = await fetch(
        window.Shopify?.routes?.root
          ? `${window.Shopify.routes.root}cart/add.js`
          : "/cart/add.js",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            items: [{ id: Number(variantId), quantity: 1 }],
          }),
        },
      );

      if (!response.ok) throw new Error("Add to cart failed");

      document.dispatchEvent(
        new CustomEvent("satc:added", {
          detail: { productId, variantId },
        }),
      );

      if (afterAdd === "cart") {
        window.location.href = window.Shopify?.routes?.root
          ? `${window.Shopify.routes.root}cart`
          : "/cart";
        return;
      }

      if (afterAdd === "drawer") {
        document.dispatchEvent(new CustomEvent("theme:cart:open"));
        document.documentElement.dispatchEvent(
          new CustomEvent("cart:refresh", { bubbles: true }),
        );
      }

      button.textContent = "Added ✓";
      setTimeout(() => {
        button.textContent = original;
        button.disabled = false;
      }, 1200);
    } catch (error) {
      console.error("[Sticky ATC]", error);
      button.textContent = "Try again";
      button.disabled = false;
      setTimeout(() => {
        button.textContent = original;
      }, 1500);
    }
  });
})();
