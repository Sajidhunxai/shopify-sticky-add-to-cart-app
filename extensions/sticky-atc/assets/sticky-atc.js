/**
 * Sticky ATC — bar entry (visibility, add to cart, quantity, quick buy).
 * Cart drawer / rewards / recommendations live in sticky-atc-drawer.js and are
 * loaded by snippets/satc-slider.liquid only when display_mode is "slider".
 */
(() => {
  const bar = document.querySelector("[data-satc-bar]");
  if (!bar) return;

  const button = bar.querySelector("[data-satc-button]");
  const priceEl = bar.querySelector("[data-satc-price]");
  const qtyInput = bar.querySelector("[data-satc-qty-input]");
  const qtyMinus = bar.querySelector("[data-satc-qty-minus]");
  const qtyPlus = bar.querySelector("[data-satc-qty-plus]");
  const displayMode = bar.dataset.displayMode || "bar";
  const i18n = {
    adding: bar.dataset.i18nAdding || "Adding…",
    added: bar.dataset.i18nAdded || "Added ✓",
    tryAgain: bar.dataset.i18nTryAgain || "Try again",
  };
  const formSelector =
    'form[action*="/cart/add"], form[action$="/cart/add"], product-form form, [data-product-form]';
  const afterAdd = bar.dataset.afterAdd || "stay";
  const hideNearForm = bar.dataset.hideNearForm === "true";
  const productId = bar.dataset.productId;
  const isDesktop = () => window.matchMedia("(min-width: 750px)").matches;
  const root =
    window.Shopify?.routes?.root ||
    (document.querySelector('meta[name="shopify-routes-root"]')?.content ?? "/");
  const addUrl = () => `${root}cart/add.js`;

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
      document.querySelector(
        "[data-product-price], .price__regular .price-item--regular, .product__price, .price .money",
      ) || null;
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

  const scrollThreshold = () => {
    const mobile = Number(bar.dataset.showAfterScroll || 80);
    const desktop = Number(bar.dataset.showAfterScrollDesktop ?? 0);
    return isDesktop() ? desktop : mobile;
  };

  /* —— Visibility —— */
  const updateVisibilityFromScroll = () => {
    setVisible(window.scrollY >= scrollThreshold());
  };

  window.addEventListener("scroll", updateVisibilityFromScroll, {
    passive: true,
  });
  window.addEventListener("resize", updateVisibilityFromScroll, {
    passive: true,
  });
  updateVisibilityFromScroll();

  if (hideNearForm) {
    const form = document.querySelector(formSelector);
    if (form && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const ratio = entry?.intersectionRatio || 0;
          const hideAt = isDesktop() ? 0.55 : 0.35;
          setHiddenNearForm(Boolean(entry?.isIntersecting && ratio >= hideAt));
        },
        {
          threshold: [0, 0.25, 0.35, 0.55, 0.75, 1],
          rootMargin: "0px 0px -10% 0px",
        },
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

  /* —— Quick Buy expand/collapse —— */
  const quickToggle = bar.querySelector("[data-satc-quick-toggle]");
  const quickPanel = bar.querySelector("[data-satc-quick-panel]");
  if (displayMode === "quickbuy" && quickToggle && quickPanel) {
    quickToggle.addEventListener("click", () => {
      const open = !bar.classList.contains("is-expanded");
      bar.classList.toggle("is-expanded", open);
      quickToggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) quickPanel.removeAttribute("hidden");
      else quickPanel.setAttribute("hidden", "");
    });
  }

  if (!button) return;

  /* —— Quantity —— */
  const getQuantity = () => {
    const n = Number(qtyInput?.value || 1);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
  };

  qtyMinus?.addEventListener("click", () => {
    if (!qtyInput) return;
    qtyInput.value = String(Math.max(1, getQuantity() - 1));
  });

  qtyPlus?.addEventListener("click", () => {
    if (!qtyInput) return;
    qtyInput.value = String(getQuantity() + 1);
  });

  /* —— Add to cart —— */
  const openDrawerAfterAdd = async () => {
    // Drawer script (sticky-atc-drawer.js) is only present in slider mode.
    const hasDrawer =
      document.querySelector("[data-satc-slider]") &&
      typeof window.SatcDrawer?.open === "function";
    if (hasDrawer) {
      await window.SatcDrawer.open();
    } else if (afterAdd === "drawer") {
      document.dispatchEvent(new CustomEvent("theme:cart:open"));
      document.documentElement.dispatchEvent(
        new CustomEvent("cart:refresh", { bubbles: true }),
      );
    }
  };

  button.addEventListener("click", async () => {
    const variantId = getVariantId();
    if (!variantId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    button.disabled = true;
    const original = button.textContent;
    button.textContent = i18n.adding;

    try {
      const response = await fetch(addUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          items: [{ id: Number(variantId), quantity: getQuantity() }],
        }),
      });

      if (!response.ok) throw new Error("Add to cart failed");

      document.dispatchEvent(
        new CustomEvent("satc:added", {
          detail: { productId, variantId },
        }),
      );

      if (displayMode === "slider" || afterAdd === "drawer") {
        await openDrawerAfterAdd();
      } else if (afterAdd === "cart") {
        window.location.href = `${root}cart`;
        return;
      }

      button.textContent = i18n.added;
      setTimeout(() => {
        button.textContent = original;
        button.disabled = false;
        if (displayMode === "quickbuy") {
          bar.classList.remove("is-expanded");
          quickToggle?.setAttribute("aria-expanded", "false");
          quickPanel?.setAttribute("hidden", "");
        }
      }, 1200);
    } catch (error) {
      console.error("[Sticky ATC]", error);
      button.textContent = i18n.tryAgain;
      button.disabled = false;
      setTimeout(() => {
        button.textContent = original;
      }, 1500);
    }
  });
})();
