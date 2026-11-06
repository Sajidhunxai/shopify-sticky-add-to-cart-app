/**
 * Sticky ATC — cart drawer (cart lines, rewards, recommendations,
 * announcement timer, discount, theme cart-icon intercept).
 * Loaded by snippets/satc-slider.liquid only when display_mode is "slider".
 * Public API: window.SatcDrawer.{ open, close, refresh }.
 */
(() => {
  const slider = document.querySelector("[data-satc-slider]");
  if (!slider) return;
  if (slider.dataset.satcDrawerInit === "true") return;
  slider.dataset.satcDrawerInit = "true";

  const i18n = {
    adding: slider.dataset.i18nAdding || "Adding…",
    added: slider.dataset.i18nAdded || "Added ✓",
    tryAgain: slider.dataset.i18nTryAgain || "Try again",
    cartEmpty: slider.dataset.i18nCartEmpty || "Your cart is empty",
  };
  const isDesktop = () => window.matchMedia("(min-width: 750px)").matches;
  const root =
    window.Shopify?.routes?.root ||
    (document.querySelector('meta[name="shopify-routes-root"]')?.content ?? "/");

  const cartUrl = () => `${root}cart.js`;
  const addUrl = () => `${root}cart/add.js`;
  const changeUrl = () => `${root}cart/change.js`;
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

  /* —— Cart slider —— */
  const sliderItems = slider?.querySelector("[data-satc-slider-items]");
  const sliderTotal = slider?.querySelector("[data-satc-slider-total]");

  const titleEl = slider?.querySelector("[data-satc-drawer-title]");
  const titleTemplate =
    slider?.dataset.drawerTitle || titleEl?.textContent || "Your cart";
  const rewardRoot = slider?.querySelector("[data-satc-rewards]");
  const rewardEnabled = slider?.dataset.rewardEnabled === "true";
  const rewardShowEmpty = slider?.dataset.rewardEmpty !== "false";
  const rewardMode = slider?.dataset.rewardMode === "quantity" ? "quantity" : "total";
  const rewardDoneText =
    slider?.dataset.rewardDone || "Free shipping unlocked!";
  let rewardTiers = [];
  try {
    const tiersEl = slider?.querySelector("[data-satc-reward-tiers]");
    rewardTiers = JSON.parse(
      tiersEl?.textContent || slider?.dataset.rewardTiers || "[]",
    );
  } catch (_) {
    rewardTiers = [];
  }
  if (!Array.isArray(rewardTiers) || !rewardTiers.length) {
    // Fallback: legacy single free-shipping threshold
    if (slider?.dataset.shipEnabled === "true") {
      rewardTiers = [
        {
          enabled: true,
          minAmount: Number(slider.dataset.shipThreshold || 100),
          description: "Free Shipping",
          titleBefore:
            slider.dataset.shipText ||
            "You're [AMOUNT] away from free shipping!",
        },
      ];
    }
  }
  const activeTiers = rewardTiers
    .filter((t) => t && t.enabled !== false)
    .slice()
    .sort((a, b) => (Number(a.minAmount) || 0) - (Number(b.minAmount) || 0));
  const rewardMilestonesEl = slider?.querySelector(
    "[data-satc-reward-milestones]",
  );
  const rewardBarEl = slider?.querySelector("[data-satc-reward-bar]");
  const rewardTextEl = slider?.querySelector("[data-satc-reward-text]");

  const formatTitle = (qty) =>
    String(titleTemplate).replace(/\{\{\s*cart_quantity\s*\}\}/gi, String(qty));

  const escapeHtml = (str) =>
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const recEnabled = slider?.dataset.recEnabled === "true";
  const recEmptyText =
    slider?.dataset.recEmpty || "Add your favorite items to your cart.";
  const recHeader = slider?.dataset.recHeader || "You may also like";
  const recMax = Math.min(8, Math.max(1, Number(slider?.dataset.recMax || 3)));
  const recAddText = slider?.dataset.recAdd || "Add";
  const recShopOn = slider?.dataset.recShopOn === "true";
  const recShopText = slider?.dataset.recShopText || "Shop now";
  const recShopUrl = slider?.dataset.recShopUrl || "/collections/all";
  const recCollection = slider?.dataset.recCollection || "all";
  let recSeed = [];
  try {
    const seedEl = slider?.querySelector("[data-satc-rec-seed]");
    recSeed = JSON.parse(seedEl?.textContent || "[]");
  } catch (_) {
    recSeed = [];
  }
  if (!Array.isArray(recSeed)) recSeed = [];

  const fetchCollectionProducts = async () => {
    const handle = encodeURIComponent(recCollection || "all");
    const url = `${root}collections/${handle}/products.json?limit=${recMax}`;
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("collection fetch failed");
      const data = await res.json();
      const products = Array.isArray(data.products) ? data.products : [];
      return products.slice(0, recMax).map((p) => {
        const variant = (p.variants || []).find((v) => v.available) || p.variants?.[0];
        const img =
          p.images?.[0]?.src ||
          p.image?.src ||
          (typeof p.images?.[0] === "string" ? p.images[0] : "") ||
          "";
        return {
          id: p.id,
          title: p.title,
          url: p.url || `/products/${p.handle}`,
          image: img,
          price: Math.round(Number(variant?.price || p.price || 0) * 100),
          variantId: variant?.id,
          available: variant ? variant.available !== false : true,
        };
      });
    } catch (_) {
      return [];
    }
  };

  const normalizeSeedProducts = (list) =>
    (list || [])
      .filter((p) => p && p.variantId)
      .slice(0, recMax)
      .map((p) => ({
        id: p.id,
        title: p.title || "Product",
        url: p.url || "#",
        image: p.image || "",
        price: Number(p.price) || 0,
        variantId: p.variantId,
        available: p.available !== false,
      }));

  const renderRecCards = (products) => {
    if (!products.length) return "";
    return `
      <div class="satc-slider__recs" data-satc-recs>
        <h3 class="satc-slider__recs-title">${escapeHtml(recHeader)}</h3>
        <div class="satc-slider__recs-list">
          ${products
            .map(
              (p) => `
            <div class="satc-slider__rec" data-satc-rec>
              <a class="satc-slider__rec-media" href="${escapeHtml(p.url)}">
                ${
                  p.image
                    ? `<img src="${escapeHtml(p.image)}" alt="" width="72" height="72" loading="lazy">`
                    : `<span class="satc-slider__rec-placeholder"></span>`
                }
              </a>
              <div class="satc-slider__rec-info">
                <a class="satc-slider__rec-name" href="${escapeHtml(p.url)}">${escapeHtml(p.title)}</a>
                <p class="satc-slider__rec-price">${money(p.price)}</p>
              </div>
              <button
                type="button"
                class="satc-slider__rec-add"
                data-satc-rec-add
                data-variant-id="${escapeHtml(p.variantId)}"
                ${p.available ? "" : "disabled"}
              >${escapeHtml(recAddText)}</button>
            </div>`,
            )
            .join("")}
        </div>
      </div>`;
  };

  const renderEmptyCart = async () => {
    let products = normalizeSeedProducts(recSeed);
    if (recEnabled && products.length < 1) {
      products = await fetchCollectionProducts();
    } else if (recEnabled) {
      products = products.slice(0, recMax);
    } else {
      products = [];
    }

    const shopBtn =
      recShopOn
        ? `<a class="satc-slider__empty-shop" href="${escapeHtml(recShopUrl)}">${escapeHtml(recShopText)}</a>`
        : "";

    return `
      <div class="satc-slider__empty-state">
        <p class="satc-slider__empty">${escapeHtml(i18n.cartEmpty)}</p>
        <p class="satc-slider__empty-sub">${escapeHtml(recEmptyText)}</p>
        ${shopBtn}
      </div>
      ${recEnabled ? renderRecCards(products) : ""}`;
  };

  const lineQtyEnabled = slider?.dataset.lineQty !== "false";
  const lineRemoveEnabled = slider?.dataset.lineRemove !== "false";

  const changeLineQty = async (lineKey, quantity) => {
    if (!lineKey) return;
    try {
      const res = await fetch(changeUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ id: lineKey, quantity: Math.max(0, Number(quantity) || 0) }),
      });
      if (!res.ok) throw new Error("cart change failed");
      await refreshSlider();
    } catch (err) {
      console.error("[Sticky ATC] cart change", err);
    }
  };

  const bindLineControls = () => {
    sliderItems?.querySelectorAll("[data-satc-line-minus]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-line-key");
        const qty = Number(btn.getAttribute("data-qty") || 1);
        changeLineQty(key, qty - 1);
      });
    });
    sliderItems?.querySelectorAll("[data-satc-line-plus]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-line-key");
        const qty = Number(btn.getAttribute("data-qty") || 1);
        changeLineQty(key, qty + 1);
      });
    });
    sliderItems?.querySelectorAll("[data-satc-line-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-line-key");
        changeLineQty(key, 0);
      });
    });
  };

  const renderCartLines = (items) =>
    items
      .map((item) => {
        const key = item.key || String(item.id);
        const qty = Number(item.quantity) || 1;
        const qtyControls = lineQtyEnabled
          ? `<div class="satc-slider__line-qty" data-satc-line-qty>
              <button type="button" class="satc-slider__line-qty-btn" data-satc-line-minus data-line-key="${escapeHtml(key)}" data-qty="${qty}" aria-label="Decrease">−</button>
              <span class="satc-slider__line-qty-val">${qty}</span>
              <button type="button" class="satc-slider__line-qty-btn" data-satc-line-plus data-line-key="${escapeHtml(key)}" data-qty="${qty}" aria-label="Increase">+</button>
            </div>`
          : `<p class="satc-slider__item-meta">Qty ${qty}</p>`;
        const removeBtn = lineRemoveEnabled
          ? `<button type="button" class="satc-slider__line-remove" data-satc-line-remove data-line-key="${escapeHtml(key)}" aria-label="Remove">×</button>`
          : "";
        return `
          <div class="satc-slider__item" data-satc-line data-line-key="${escapeHtml(key)}">
            <img src="${escapeHtml(item.image || "")}" alt="" width="56" height="56" loading="lazy">
            <div class="satc-slider__item-main">
              <p class="satc-slider__item-title">${escapeHtml(item.product_title || item.title || "")}</p>
              ${qtyControls}
            </div>
            <div class="satc-slider__item-side">
              ${removeBtn}
              <div class="satc-slider__item-price">${money(item.final_line_price ?? item.line_price)}</div>
            </div>
          </div>`;
      })
      .join("");

  const addRecToCart = async (variantId, btn) => {
    if (!variantId) return;
    const label = btn?.textContent || recAddText;
    if (btn) {
      btn.disabled = true;
      btn.textContent = i18n.adding;
    }
    try {
      const res = await fetch(addUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ id: Number(variantId), quantity: 1 }),
      });
      if (!res.ok) throw new Error("add failed");
      if (btn) btn.textContent = i18n.added;
      await refreshSlider();
      openSlider();
    } catch (err) {
      console.error("[Sticky ATC] rec add", err);
      if (btn) {
        btn.textContent = i18n.tryAgain;
        btn.disabled = false;
      }
      return;
    }
    if (btn) {
      setTimeout(() => {
        btn.textContent = label;
        btn.disabled = false;
      }, 900);
    }
  };

  /** Equal segments per tier (UpCart-style), fill within current segment. */
  const rewardProgressPct = (value, tiers) => {
    if (!tiers.length) return 0;
    const goals = tiers.map((t) => Number(t.minAmount) || 0);
    const last = goals[goals.length - 1];
    if (value >= last) return 100;
    let prev = 0;
    for (let i = 0; i < goals.length; i++) {
      const goal = goals[i];
      const segStart = (i / goals.length) * 100;
      const segEnd = ((i + 1) / goals.length) * 100;
      if (value <= goal) {
        const within = (value - prev) / Math.max(goal - prev, 0.0001);
        return Math.min(100, segStart + within * (segEnd - segStart));
      }
      prev = goal;
    }
    return 100;
  };

  const updateRewards = (cart) => {
    if (!rewardRoot || (!rewardEnabled && slider?.dataset.shipEnabled !== "true")) {
      return;
    }
    const itemCount = cart.item_count ?? cart.items?.length ?? 0;
    const totalCents = cart.total_price || 0;
    const progressValue =
      rewardMode === "quantity" ? itemCount : totalCents / 100;

    if (!rewardShowEmpty && itemCount === 0) {
      rewardRoot.hidden = true;
      return;
    }
    rewardRoot.hidden = false;

    if (!activeTiers.length) {
      rewardRoot.hidden = true;
      return;
    }

    const pct = Math.round(rewardProgressPct(progressValue, activeTiers));
    if (rewardBarEl) rewardBarEl.style.width = `${pct}%`;

    if (rewardMilestonesEl) {
      rewardMilestonesEl.innerHTML = activeTiers
        .map((tier) => {
          const goal = Number(tier.minAmount) || 0;
          const reached = progressValue >= goal;
          return `<div class="satc-slider__reward-milestone${reached ? " is-reached" : ""}">
            <span class="satc-slider__reward-dot" aria-hidden="true"></span>
            <span class="satc-slider__reward-label">${escapeHtml(tier.description || "Reward")}</span>
          </div>`;
        })
        .join("");
    }

    if (rewardTextEl) {
      const next = activeTiers.find(
        (t) => progressValue < (Number(t.minAmount) || 0),
      );
      if (!next) {
        rewardTextEl.textContent = rewardDoneText;
      } else {
        const remainingRaw = Math.max(
          0,
          (Number(next.minAmount) || 0) - progressValue,
        );
        const remainingLabel =
          rewardMode === "quantity"
            ? `${Math.ceil(remainingRaw)}`
            : money(Math.round(remainingRaw * 100));
        rewardTextEl.textContent = String(
          next.titleBefore || "You're [AMOUNT] away!",
        )
          .replace(/\[AMOUNT\]/gi, remainingLabel)
          .replace(/\{\{\s*amount_remaining\s*\}\}/gi, remainingLabel);
      }
    }
  };

  const refreshSlider = async () => {
    if (!sliderItems) return;
    try {
      const res = await fetch(cartUrl(), {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("cart fetch failed");
      const cart = await res.json();
      const itemCount = cart.item_count ?? cart.items?.length ?? 0;
      if (titleEl) titleEl.textContent = formatTitle(itemCount);

      if (!cart.items?.length) {
        sliderItems.innerHTML = await renderEmptyCart();
        sliderItems
          .querySelectorAll("[data-satc-rec-add]")
          .forEach((btn) => {
            btn.addEventListener("click", () =>
              addRecToCart(btn.getAttribute("data-variant-id"), btn),
            );
          });
      } else {
        sliderItems.innerHTML = renderCartLines(cart.items);
        bindLineControls();
      }
      if (sliderTotal) {
        sliderTotal.textContent = money(cart.total_price);
      }
      const checkoutEl = slider?.querySelector("[data-satc-slider-checkout]");
      if (checkoutEl) {
        const base = String(slider?.dataset.checkoutText || "Checkout").trim();
        checkoutEl.textContent = cart.items?.length
          ? `${base} — ${money(cart.total_price)}`
          : base;
      }
      const footer = slider?.querySelector(".satc-slider__footer");
      if (footer) {
        footer.classList.toggle("is-empty", !cart.items?.length);
      }
      updateRewards(cart);
    } catch (error) {
      console.error("[Sticky ATC] slider", error);
    }
  };

  slider?.querySelector("[data-satc-discount]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) return;
    const input = form.querySelector('input[name="discount"]');
    const code = String(input && "value" in input ? input.value : "")
      .trim()
      .toUpperCase();
    if (!code) return;
    window.location.href = `${root}discount/${encodeURIComponent(code)}`;
  });

  let annTimerId = null;
  const startAnnouncementTimer = () => {
    if (annTimerId) {
      clearInterval(annTimerId);
      annTimerId = null;
    }
    const ann = slider?.querySelector("[data-satc-announcement]");
    const label = ann?.querySelector("[data-satc-announcement-label]");
    if (!ann || !label) return;

    const template = ann.dataset.annText || label.textContent || "";
    const timerRaw = ann.dataset.annTimer || "15:00";
    const parts = timerRaw.split(":");
    let total =
      Number(parts[0] || 0) * 60 + Number(parts[1] || 0);
    if (!Number.isFinite(total) || total <= 0) total = 15 * 60;

    const tick = () => {
      const m = Math.floor(Math.max(0, total) / 60);
      const s = Math.max(0, total) % 60;
      const clock = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      label.textContent = String(template)
        .replace(/\{timer\}/gi, clock)
        .replace(/\{\{\s*timer\s*\}\}/gi, clock);
      if (total <= 0) {
        clearInterval(annTimerId);
        annTimerId = null;
        return;
      }
      total -= 1;
    };

    tick();
    annTimerId = setInterval(tick, 1000);
  };

  const drawerAllowedOnDevice = () => {
    if (!slider) return false;
    const deskOk = slider.dataset.drawerDesktop !== "false";
    const mobOk = slider.dataset.drawerMobile !== "false";
    return isDesktop() ? deskOk : mobOk;
  };

  const openSlider = async () => {
    if (!slider) return;
    if (!drawerAllowedOnDevice()) return;
    slider.hidden = false;
    requestAnimationFrame(() => slider.classList.add("is-open"));
    startAnnouncementTimer();
    await refreshSlider();
  };

  const closeSlider = () => {
    if (!slider) return;
    slider.classList.remove("is-open");
    setTimeout(() => {
      slider.hidden = true;
    }, 280);
  };

  slider?.querySelectorAll("[data-satc-slider-close]").forEach((el) => {
    el.addEventListener("click", closeSlider);
  });

  /* Open Sticky ATC drawer from theme cart icon (all pages). */
  if (slider) {
    const cartIconSelector = [
      "#cart-icon-bubble",
      "a#cart-icon-bubble",
      ".header__icon--cart",
      "a.header__icon--cart",
      ".header__icon--cart a",
      "[data-cart-icon]",
      "cart-icon-bubble",
      'a[href="/cart"]',
      'a[href$="/cart"]',
      'a[href*="/cart?"]',
    ].join(", ");

    const isCartIconClick = (target) => {
      if (!(target instanceof Element)) return false;
      const link = target.closest(cartIconSelector);
      if (!link) return false;
      if (
        link.closest(
          "[data-satc-slider], cart-drawer, .drawer, #CartDrawer, .satc-slider__panel",
        )
      ) {
        return false;
      }
      // Ignore "Checkout" / cart form buttons on /cart page
      if (link.closest('form[action*="/cart"]')) return false;
      const href = (link.getAttribute("href") || "").split("?")[0];
      if (
        href &&
        !/\/cart\/?$/.test(href) &&
        link.id !== "cart-icon-bubble" &&
        !link.classList.contains("header__icon--cart")
      ) {
        return false;
      }
      return true;
    };

    document.addEventListener(
      "click",
      (event) => {
        if (!isCartIconClick(event.target)) return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        openSlider();
      },
      true,
    );
  }

  window.SatcDrawer = {
    open: openSlider,
    close: closeSlider,
    refresh: refreshSlider,
  };
})();
