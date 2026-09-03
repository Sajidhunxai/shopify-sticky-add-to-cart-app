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
    cartEmpty: bar.dataset.i18nCartEmpty || "Your cart is empty",
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

  const cartUrl = () => `${root}cart.js`;
  const addUrl = () => `${root}cart/add.js`;
  const money = (cents) => {
    try {
      if (window.Shopify?.formatMoney) {
        return window.Shopify.formatMoney(cents);
      }
    } catch (_) {
      /* fall through */
    }
    const amount = (Number(cents) || 0) / 100;
    return `$${amount.toFixed(2)}`;
  };

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
    // On desktop, only hide when most of the form is still on screen.
    bar.classList.toggle("is-hidden-near-form", hidden);
  };

  const scrollThreshold = () => {
    const mobile = Number(bar.dataset.showAfterScroll || 80);
    const desktop = Number(bar.dataset.showAfterScrollDesktop ?? 0);
    return isDesktop() ? desktop : mobile;
  };

  const updateVisibilityFromScroll = () => {
    setVisible(window.scrollY >= scrollThreshold());
  };

  window.addEventListener("scroll", updateVisibilityFromScroll, { passive: true });
  window.addEventListener("resize", updateVisibilityFromScroll, { passive: true });
  updateVisibilityFromScroll();

  if (hideNearForm) {
    const form = document.querySelector(formSelector);
    if (form && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          // Desktop: require more of the form in view before hiding the bar,
          // so the sticky CTA appears earlier while scrolling.
          const ratio = entry?.intersectionRatio || 0;
          const hideAt = isDesktop() ? 0.55 : 0.35;
          setHiddenNearForm(Boolean(entry?.isIntersecting && ratio >= hideAt));
        },
        { threshold: [0, 0.25, 0.35, 0.55, 0.75, 1], rootMargin: "0px 0px -10% 0px" },
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

  /* —— Cart slider —— */
  const slider = document.querySelector("[data-satc-slider]");
  const sliderItems = slider?.querySelector("[data-satc-slider-items]");
  const sliderTotal = slider?.querySelector("[data-satc-slider-total]");

  const openSlider = async () => {
    if (!slider) return;
    slider.hidden = false;
    requestAnimationFrame(() => slider.classList.add("is-open"));
    await refreshSlider();
  };

  const closeSlider = () => {
    if (!slider) return;
    slider.classList.remove("is-open");
    setTimeout(() => {
      slider.hidden = true;
    }, 280);
  };

  const refreshSlider = async () => {
    if (!sliderItems) return;
    try {
      const res = await fetch(cartUrl(), { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("cart fetch failed");
      const cart = await res.json();
      if (!cart.items?.length) {
        sliderItems.innerHTML = `<p class="satc-slider__empty">${i18n.cartEmpty}</p>`;
      } else {
        sliderItems.innerHTML = cart.items
          .map(
            (item) => `
          <div class="satc-slider__item">
            <img src="${item.image || ""}" alt="" width="56" height="56" loading="lazy">
            <div>
              <p class="satc-slider__item-title">${item.product_title || item.title || ""}</p>
              <p class="satc-slider__item-meta">Qty ${item.quantity}</p>
            </div>
            <div class="satc-slider__item-price">${money(item.final_line_price ?? item.line_price)}</div>
          </div>`,
          )
          .join("");
      }
      if (sliderTotal) {
        sliderTotal.textContent = money(cart.total_price);
      }
    } catch (error) {
      console.error("[Sticky ATC] slider", error);
    }
  };

  slider?.querySelectorAll("[data-satc-slider-close]").forEach((el) => {
    el.addEventListener("click", closeSlider);
  });

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

  button?.addEventListener("click", async () => {
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

      if (displayMode === "slider") {
        await openSlider();
      } else if (afterAdd === "cart") {
        window.location.href = `${root}cart`;
        return;
      } else if (afterAdd === "drawer") {
        document.dispatchEvent(new CustomEvent("theme:cart:open"));
        document.documentElement.dispatchEvent(
          new CustomEvent("cart:refresh", { bubbles: true }),
        );
        if (displayMode === "bar") {
          // also try opening our slider if theme drawer isn't present
        }
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
