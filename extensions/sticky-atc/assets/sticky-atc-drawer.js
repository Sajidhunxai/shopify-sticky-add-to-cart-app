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
  const recWithItems = slider?.dataset.recWithItems !== "false";
  const recHideInCart = slider?.dataset.recHideCart !== "false";
  const recSource = slider?.dataset.recSource || "collection";
  const recAnim = slider?.dataset.recAnim || "stagger";
  const rewardAnim = slider?.dataset.rewardAnim || "smooth";
  const rewardLayout = slider?.dataset.rewardLayout || "stacked";
  const rewardFill = slider?.dataset.rewardStyle || "gradient";
  const rewardMsgPos = slider?.dataset.rewardMsgPos || "below";
  const rewardShowIcons = slider?.dataset.rewardShowIcons !== "false";
  const rewardIconStyle = slider?.dataset.rewardIconStyle || "filled";
  const rewardIconPos = slider?.dataset.rewardIconPos || "outside-top";
  if (rewardRoot) {
    rewardRoot.classList.add(
      `satc-slider__rewards--layout-${rewardLayout}`,
      `satc-slider__rewards--fill-${rewardFill}`,
      `satc-slider__rewards--msg-${rewardMsgPos}`,
      `satc-slider__rewards--icon-${rewardIconPos}`,
      `satc-slider__rewards--icon-style-${rewardIconStyle}`,
    );
    if (!rewardShowIcons) {
      rewardRoot.classList.add("satc-slider__rewards--icons-off");
    }
    rewardRoot.style.setProperty(
      "--satc-tier-count",
      String(Math.max(1, activeTiers.length || 4)),
    );
  }
  const ICONS = {
    truck: `<svg class="satc-slider__reward-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 7h11v8H3V7zm12 2h3.2L21 12.5V15h-6V9zM6.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`,
    gift: `<svg class="satc-slider__reward-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3c2.2 0 3.5 1.5 3.5 3.2 0 .5-.1 1-.3 1.4H18l1 12H5L6 7.6h2.8c-.2-.4-.3-.9-.3-1.4C8.5 4.5 9.8 3 12 3zm0 1.6c-1.1 0-1.8.7-1.8 1.6S10.9 7.8 12 7.8s1.8-.7 1.8-1.6S13.1 4.6 12 4.6z"/></svg>`,
    percent: `<svg class="satc-slider__reward-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.5 2.1 21.9 11.5 12.5 20.9 3.1 11.5 12.5 2.1zm-1.4 5.4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm4.4 4.4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.2 15.3l5.6-5.6 1.1 1.1-5.6 5.6-1.1-1.1z"/></svg>`,
    star: `<svg class="satc-slider__reward-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 2.8 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8l5-.7L12 2.8z"/></svg>`,
    check: `<svg class="satc-slider__reward-icon" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M6.2 11.4 2.8 8l1.2-1.2 2.2 2.2 5-5L12.4 5.2z"/></svg>`,
    heart: `<svg class="satc-slider__reward-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-6.7-4.2-9.2-8.1C1.1 10.2 2 7 5 6.2c1.8-.5 3.5.3 4.5 1.6C10.5 6.5 12.2 5.7 14 6.2c3 .8 3.9 4 2.2 6.7C18.7 16.8 12 21 12 21z"/></svg>`,
    lock: `<svg class="satc-slider__reward-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 10V8a5 5 0 0 1 10 0v2h1.5A1.5 1.5 0 0 1 20 11.5v8A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5v-8A1.5 1.5 0 0 1 5.5 10H7zm2 0h6V8a3 3 0 0 0-6 0v2z"/></svg>`,
  };
  const resolveTierIconKey = (tier) => {
    const icon = String(tier.icon || "auto");
    if (icon === "custom") return "custom";
    if (icon && icon !== "auto" && ICONS[icon]) return icon;
    const type = tier.rewardType || "custom";
    if (type === "shipping") return "truck";
    if (type === "discount") return "percent";
    if (type === "product") return "gift";
    return "star";
  };
  const rewardTypeIcon = (tier, reached) => {
    if (!rewardShowIcons) return "";
    if (reached) return ICONS.check;
    const key = resolveTierIconKey(tier);
    if (key === "custom" && tier.iconUrl) {
      return `<img class="satc-slider__reward-icon-img" src="${escapeHtml(tier.iconUrl)}" alt="" width="16" height="16" loading="lazy">`;
    }
    return ICONS[key] || ICONS.star;
  };
  let recSeed = [];
  try {
    const seedEl = slider?.querySelector("[data-satc-rec-seed]");
    recSeed = JSON.parse(seedEl?.textContent || "[]");
  } catch (_) {
    recSeed = [];
  }
  if (!Array.isArray(recSeed)) recSeed = [];

  let recProductsCfg = [];
  try {
    const cfgEl = slider?.querySelector("[data-satc-rec-products-cfg]");
    recProductsCfg = JSON.parse(cfgEl?.textContent || "[]");
  } catch (_) {
    recProductsCfg = [];
  }
  if (!Array.isArray(recProductsCfg)) recProductsCfg = [];

  let featureTemplates = {};
  try {
    const tplEl = slider?.querySelector("[data-satc-feature-templates]");
    featureTemplates = JSON.parse(tplEl?.textContent || "{}") || {};
  } catch (_) {
    featureTemplates = {};
  }
  let globalCustomCss = "";
  try {
    const cssEl = slider?.querySelector("[data-satc-custom-css]");
    globalCustomCss = JSON.parse(cssEl?.textContent || '""') || "";
  } catch (_) {
    globalCustomCss = "";
  }

  const sanitizeHtml = (html) =>
    String(html || "")
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
      .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
      .replace(/javascript\s*:/gi, "");

  const getFeatureTpl = (key) => {
    const row = featureTemplates?.[key];
    if (!row || !row.enabled) return null;
    return row;
  };

  const renderMustache = (tpl, data) =>
    String(tpl || "")
      .replace(/\{\{\{(\w+)\}\}\}/g, (_, key) =>
        data[key] == null ? "" : String(data[key]),
      )
      .replace(/\{\{(\w+)\}\}/g, (_, key) =>
        escapeHtml(data[key] == null ? "" : String(data[key])),
      );

  const wrapFeature = (key, innerHtml, extraHtml = "") => {
    const safeExtra = sanitizeHtml(extraHtml);
    return `<div data-satc-feature="${escapeHtml(key)}">${innerHtml || ""}${safeExtra}</div>`;
  };

  const applyFeatureCss = () => {
    const styleEl = slider?.querySelector("[data-satc-custom-style]");
    if (!styleEl) return;
    const chunks = [];
    if (globalCustomCss) chunks.push(String(globalCustomCss));
    Object.keys(featureTemplates || {}).forEach((key) => {
      const row = featureTemplates[key];
      if (!row?.enabled || !row.css) return;
      chunks.push(`[data-satc-feature="${key}"]{\n${row.css}\n}`);
    });
    styleEl.textContent = chunks.join("\n\n");
  };
  applyFeatureCss();

  const applyFeatureJs = () => {
    Object.keys(featureTemplates || {}).forEach((key) => {
      const row = featureTemplates[key];
      if (!row?.enabled || !row.js) return;
      const rootEl =
        slider?.querySelector(`[data-satc-feature="${key}"]`) || slider;
      try {
        // Merchant-authored storefront snippet (same class of control as theme JS).
        const run = new Function("root", "featureKey", "slider", String(row.js));
        run(rootEl, key, slider);
      } catch (err) {
        console.error("[Sticky ATC] custom js", key, err);
      }
    });
  };

  const fetchCollectionProducts = async () => {
    const handle = encodeURIComponent(recCollection || "all");
    const url = `${root}collections/${handle}/products.json?limit=${Math.max(recMax, 8)}`;
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("collection fetch failed");
      const data = await res.json();
      const products = Array.isArray(data.products) ? data.products : [];
      return products.map((p) => {
        const variant =
          (p.variants || []).find((v) => v.available) || p.variants?.[0];
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
      .map((p) => ({
        id: p.id,
        title: p.title || "Product",
        url: p.url || "#",
        image: p.image || "",
        price: Number(p.price) || 0,
        variantId: p.variantId,
        available: p.available !== false,
      }));

  const filterOutCartProducts = (products, cartItems) => {
    if (!recHideInCart || !cartItems?.length) return products;
    const inCart = new Set(
      cartItems.flatMap((item) =>
        [String(item.variant_id || ""), String(item.product_id || "")].filter(
          Boolean,
        ),
      ),
    );
    return products.filter(
      (p) =>
        !inCart.has(String(p.variantId || "")) &&
        !inCart.has(String(p.id || "")),
    );
  };

  const productsFromAdminCfg = () =>
    (recProductsCfg || [])
      .filter((p) => p && (p.variantId || p.handle))
      .map((p) => ({
        id: p.id || p.handle,
        title: p.title || p.handle || "Product",
        url: p.url || `/products/${p.handle}`,
        image: p.image || "",
        price: Number(p.price) || 0,
        variantId: p.variantId,
        available: p.available !== false,
      }))
      .filter((p) => p.variantId);

  const loadRecProducts = async (cartItems) => {
    if (!recEnabled) return [];
    let products = normalizeSeedProducts(recSeed);
    if (products.length < 1 && recSource === "products") {
      products = productsFromAdminCfg();
    }
    if (products.length < 1 && recSource !== "products") {
      products = await fetchCollectionProducts();
    }
    products = filterOutCartProducts(products, cartItems || []);
    return products.slice(0, recMax);
  };

  const renderRecCardDefault = (p, index) => `
            <div class="satc-slider__rec" data-satc-rec style="--satc-rec-i:${index}">
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
            </div>`;

  const renderRecCard = (p, index) => {
    const cardTpl = getFeatureTpl("recommendationCard");
    if (cardTpl?.template && (cardTpl.replaceDefault || cardTpl.template)) {
      const html = sanitizeHtml(
        renderMustache(cardTpl.template, {
          title: p.title,
          price: money(p.price),
          url: p.url,
          image: p.image || "",
          variant_id: p.variantId,
          add_text: recAddText,
          available: p.available ? "true" : "false",
        }),
      );
      return `<div data-satc-feature="recommendationCard" data-satc-rec style="--satc-rec-i:${index}">${html}${sanitizeHtml(cardTpl.html || "")}</div>`;
    }
    const built = renderRecCardDefault(p, index);
    if (cardTpl?.html) {
      return `${built}${wrapFeature("recommendationCard", "", cardTpl.html)}`;
    }
    return built;
  };

  const renderRecSkeletonCard = (index) => {
    const skelTpl = getFeatureTpl("recommendationSkeleton");
    if (skelTpl?.template) {
      return `<div data-satc-feature="recommendationSkeleton" style="--satc-rec-i:${index}">${sanitizeHtml(
        renderMustache(skelTpl.template, { index: String(index + 1) }),
      )}${sanitizeHtml(skelTpl.html || "")}</div>`;
    }
    return `<div class="satc-slider__rec satc-slider__rec--skeleton" aria-hidden="true" style="--satc-rec-i:${index}">
      <span class="satc-slider__rec-placeholder"></span>
      <div class="satc-slider__rec-info">
        <span class="satc-skel-line"></span>
        <span class="satc-skel-line satc-skel-line--sm"></span>
      </div>
      <span class="satc-skel-btn"></span>
    </div>`;
  };

  const renderRecSkeleton = (count = Math.min(recMax, 3)) => {
    const cards = Array.from({ length: Math.max(1, count) }, (_, i) =>
      renderRecSkeletonCard(i),
    ).join("");
    return `
      <div class="satc-slider__recs satc-slider__recs--skeleton" data-satc-recs data-satc-feature="recommendationSkeleton">
        <h3 class="satc-slider__recs-title">${escapeHtml(recHeader)}</h3>
        <div class="satc-slider__recs-list">${cards}</div>
      </div>`;
  };

  const renderRecCards = (products) => {
    if (!products.length) return "";
    const cardsHtml = products.map((p, index) => renderRecCard(p, index)).join("");
    const blockTpl = getFeatureTpl("recommendations");
    if (blockTpl?.template && (blockTpl.replaceDefault || blockTpl.template)) {
      return wrapFeature(
        "recommendations",
        sanitizeHtml(
          renderMustache(blockTpl.template, {
            header: recHeader,
            cards_html: cardsHtml,
          }),
        ),
        blockTpl.html || "",
      );
    }
    const built = `
      <div class="satc-slider__recs satc-slider__recs--anim-${escapeHtml(recAnim)}" data-satc-recs>
        <h3 class="satc-slider__recs-title">${escapeHtml(recHeader)}</h3>
        <div class="satc-slider__recs-list">
          ${cardsHtml}
        </div>
      </div>`;
    if (blockTpl?.html) {
      return wrapFeature("recommendations", built, blockTpl.html);
    }
    return wrapFeature("recommendations", built);
  };

  const bindRecAdds = (rootEl) => {
    rootEl?.querySelectorAll("[data-satc-rec-add]").forEach((btn) => {
      btn.addEventListener("click", () =>
        addRecToCart(btn.getAttribute("data-variant-id"), btn),
      );
    });
  };

  const renderEmptyCart = async () => {
    const products = await loadRecProducts([]);
    const shopBtn = recShopOn
      ? `<a class="satc-slider__empty-shop" href="${escapeHtml(recShopUrl)}">${escapeHtml(recShopText)}</a>`
      : "";
    const recsHtml = recEnabled ? renderRecCards(products) : "";
    const emptyTpl = getFeatureTpl("emptyCart");
    if (emptyTpl?.template && (emptyTpl.replaceDefault || emptyTpl.template)) {
      return wrapFeature(
        "emptyCart",
        sanitizeHtml(
          renderMustache(emptyTpl.template, {
            empty_title: i18n.cartEmpty,
            empty_text: recEmptyText,
            shop_button: shopBtn,
            recs_html: recsHtml,
          }),
        ),
        emptyTpl.html || "",
      );
    }
    const built = `
      <div class="satc-slider__empty-state">
        <p class="satc-slider__empty">${escapeHtml(i18n.cartEmpty)}</p>
        <p class="satc-slider__empty-sub">${escapeHtml(recEmptyText)}</p>
        ${shopBtn}
      </div>
      ${recsHtml}`;
    if (emptyTpl?.html) {
      return wrapFeature("emptyCart", built, emptyTpl.html);
    }
    return built;
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
        const priceLabel = money(item.final_line_price ?? item.line_price);
        const itemTpl = getFeatureTpl("cartItem");
        if (itemTpl?.template && (itemTpl.replaceDefault || itemTpl.template)) {
          return wrapFeature(
            "cartItem",
            sanitizeHtml(
              renderMustache(itemTpl.template, {
                title: item.product_title || item.title || "",
                quantity: qty,
                price: priceLabel,
                image: item.image || "",
                line_key: key,
                qty_controls: qtyControls,
                remove_button: removeBtn,
              }),
            ),
            itemTpl.html || "",
          );
        }
        const built = `
          <div class="satc-slider__item" data-satc-line data-line-key="${escapeHtml(key)}">
            <img src="${escapeHtml(item.image || "")}" alt="" width="56" height="56" loading="lazy">
            <div class="satc-slider__item-main">
              <p class="satc-slider__item-title">${escapeHtml(item.product_title || item.title || "")}</p>
              ${qtyControls}
            </div>
            <div class="satc-slider__item-side">
              ${removeBtn}
              <div class="satc-slider__item-price">${priceLabel}</div>
            </div>
          </div>`;
        if (itemTpl?.html) {
          return wrapFeature("cartItem", built, itemTpl.html);
        }
        return built;
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
    if (rewardRoot) {
      rewardRoot.style.setProperty(
        "--satc-tier-count",
        String(Math.max(1, activeTiers.length)),
      );
    }
    if (rewardBarEl) {
      const prev = Number(rewardBarEl.dataset.pct || 0);
      rewardBarEl.style.width = `${pct}%`;
      rewardBarEl.dataset.pct = String(pct);
      if (rewardAnim !== "none" && pct > prev) {
        rewardBarEl.classList.remove("is-ticking");
        void rewardBarEl.offsetWidth;
        rewardBarEl.classList.add("is-ticking");
      }
    }

    const nextIndex = activeTiers.findIndex(
      (t) => progressValue < (Number(t.minAmount) || 0),
    );

    const tiersHtml = activeTiers
      .map((tier, index) => {
        const goal = Number(tier.minAmount) || 0;
        const reached = progressValue >= goal;
        const isCurrent = !reached && index === nextIndex;
        const label = escapeHtml(tier.description || "Reward");
        let labelHtml = label;
        if (tier.rewardType === "product" && reached) {
          const href =
            tier.productUrl ||
            (tier.productHandle
              ? `${root}products/${encodeURIComponent(String(tier.productHandle).replace(/^\/+|\/+$/g, ""))}`
              : "");
          if (href) {
            labelHtml = `<a href="${escapeHtml(href)}">${escapeHtml(tier.productTitle || tier.description || "Product")}</a>`;
          }
        }
        const goalLabel =
          rewardMode === "quantity"
            ? `${Math.round(goal)}`
            : money(Math.round(goal * 100));
        const type = tier.rewardType || "custom";
        const iconInner = rewardTypeIcon(tier, reached);
        return `<div class="satc-slider__reward-milestone${reached ? " is-reached" : ""}${isCurrent ? " is-current" : ""}" data-reward-type="${escapeHtml(type)}" data-reward-icon="${escapeHtml(String(tier.icon || "auto"))}" style="--satc-tier-i:${index}">
            <span class="satc-slider__reward-dot" aria-hidden="true">${iconInner}</span>
            <span class="satc-slider__reward-label">${labelHtml}</span>
            <span class="satc-slider__reward-goal">${escapeHtml(goalLabel)}</span>
          </div>`;
      })
      .join("");

    let message = rewardDoneText;
    const next = nextIndex >= 0 ? activeTiers[nextIndex] : undefined;
    if (next) {
      const remainingRaw = Math.max(
        0,
        (Number(next.minAmount) || 0) - progressValue,
      );
      const remainingLabel =
        rewardMode === "quantity"
          ? `${Math.ceil(remainingRaw)}`
          : money(Math.round(remainingRaw * 100));
      message = String(next.titleBefore || "You're [AMOUNT] away!")
        .replace(/\[AMOUNT\]/gi, remainingLabel)
        .replace(/\{\{\s*amount_remaining\s*\}\}/gi, remainingLabel);
    }

    const rewardsTpl = getFeatureTpl("rewards");
    const rewardsCustomHtml = String(rewardsTpl?.template || "").trim();
    if (
      rewardsTpl &&
      rewardsCustomHtml &&
      (rewardsTpl.replaceDefault || rewardsCustomHtml)
    ) {
      rewardRoot.setAttribute("data-satc-feature", "rewards");
      rewardRoot.innerHTML =
        sanitizeHtml(
          renderMustache(rewardsCustomHtml, {
            message,
            progress_pct: pct,
            tiers_html: tiersHtml,
          }),
        ) + sanitizeHtml(rewardsTpl.html || "");
      // Re-bind progress fill if custom markup kept the data attribute.
      const customBar = rewardRoot.querySelector("[data-satc-reward-bar]");
      if (customBar instanceof HTMLElement) {
        customBar.style.width = `${pct}%`;
      }
      if (!next) rewardRoot.classList.add("is-complete");
      else rewardRoot.classList.remove("is-complete");
      return;
    }

    if (rewardMilestonesEl) {
      rewardMilestonesEl.innerHTML = tiersHtml;
    }

    if (rewardTextEl) {
      if (!next) {
        rewardTextEl.innerHTML = `<span class="satc-slider__rewards-done">${escapeHtml(rewardDoneText)}</span>`;
        rewardRoot?.classList.add("is-complete");
      } else {
        rewardRoot?.classList.remove("is-complete");
        const remainingLabelMatch = message.match(/\$[\d,.]+|\d+/);
        const remainingLabel = remainingLabelMatch
          ? remainingLabelMatch[0]
          : "";
        rewardTextEl.innerHTML = escapeHtml(message).replace(
          escapeHtml(remainingLabel),
          remainingLabel
            ? `<strong>${escapeHtml(remainingLabel)}</strong>`
            : escapeHtml(remainingLabel),
        );
      }
    }

    rewardRoot.setAttribute("data-satc-feature", "rewards");
    if (rewardsTpl?.html && !rewardRoot.querySelector("[data-satc-reward-extra]")) {
      const extra = document.createElement("div");
      extra.setAttribute("data-satc-reward-extra", "");
      extra.innerHTML = sanitizeHtml(rewardsTpl.html);
      rewardRoot.appendChild(extra);
    }
  };

  const applyStaticFeatureTemplates = (cart) => {
    const qty = cart?.item_count ?? cart?.items?.length ?? 0;
    const headerTpl = getFeatureTpl("header");
    const headerEl = slider?.querySelector(".satc-slider__header");
    if (headerEl && headerTpl?.template) {
      headerEl.setAttribute("data-satc-feature", "header");
      if (headerTpl.replaceDefault || headerTpl.template) {
        headerEl.innerHTML =
          sanitizeHtml(
            renderMustache(headerTpl.template, {
              title: formatTitle(qty),
              cart_quantity: qty,
            }),
          ) + sanitizeHtml(headerTpl.html || "");
      }
    } else if (headerEl) {
      headerEl.setAttribute("data-satc-feature", "header");
    }

    const annTpl = getFeatureTpl("announcement");
    const annEl = slider?.querySelector("[data-satc-announcement]");
    if (annEl) {
      annEl.setAttribute("data-satc-feature", "announcement");
      if (annTpl?.template && (annTpl.replaceDefault || annTpl.template)) {
        const text = annEl.dataset.annText || "";
        const timer = annEl.dataset.annTimer || "";
        annEl.innerHTML =
          sanitizeHtml(
            renderMustache(annTpl.template, { text, timer }),
          ) + sanitizeHtml(annTpl.html || "");
      } else if (annTpl?.html && !annEl.querySelector("[data-satc-ann-extra]")) {
        const extra = document.createElement("div");
        extra.setAttribute("data-satc-ann-extra", "");
        extra.innerHTML = sanitizeHtml(annTpl.html);
        annEl.appendChild(extra);
      }
    }

    const discTpl = getFeatureTpl("discount");
    const discEl = slider?.querySelector("[data-satc-discount]");
    if (discEl) {
      if (discTpl?.template && (discTpl.replaceDefault || discTpl.template)) {
        const wrap = document.createElement("div");
        wrap.setAttribute("data-satc-feature", "discount");
        wrap.innerHTML =
          sanitizeHtml(
            renderMustache(discTpl.template, {
              placeholder: discEl.querySelector("input")?.placeholder || "",
              button_text:
                discEl.querySelector("button")?.textContent || "Apply",
            }),
          ) + sanitizeHtml(discTpl.html || "");
        discEl.replaceWith(wrap);
      } else {
        discEl.setAttribute("data-satc-feature", "discount");
      }
    }

    const trustTpl = getFeatureTpl("trust");
    const trustEl = slider?.querySelector(".satc-slider__trust");
    if (trustEl) {
      trustEl.setAttribute("data-satc-feature", "trust");
      if (trustTpl?.template && (trustTpl.replaceDefault || trustTpl.template)) {
        trustEl.innerHTML =
          sanitizeHtml(
            renderMustache(trustTpl.template, {
              text: trustEl.textContent || "",
            }),
          ) + sanitizeHtml(trustTpl.html || "");
      }
    }

    const footerTpl = getFeatureTpl("footer");
    const footerEl = slider?.querySelector(".satc-slider__footer");
    if (footerEl) {
      footerEl.setAttribute("data-satc-feature", "footer");
      if (
        footerTpl?.template &&
        (footerTpl.replaceDefault || footerTpl.template) &&
        !footerEl.dataset.satcCustomFooter
      ) {
        const subtotal = sliderTotal?.textContent || "";
        const checkoutText =
          slider?.querySelector("[data-satc-slider-checkout]")?.textContent ||
          "Checkout";
        footerEl.dataset.satcCustomFooter = "1";
        footerEl.innerHTML =
          sanitizeHtml(
            renderMustache(footerTpl.template, {
              subtotal_label: "Subtotal",
              subtotal,
              checkout_text: checkoutText,
              discount_html: "",
              trust_html: "",
            }),
          ) + sanitizeHtml(footerTpl.html || "");
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
        if (recEnabled) {
          sliderItems.innerHTML = `
            <div class="satc-slider__empty-state">
              <p class="satc-slider__empty">${escapeHtml(i18n.cartEmpty)}</p>
              <p class="satc-slider__empty-sub">${escapeHtml(recEmptyText)}</p>
            </div>
            ${renderRecSkeleton()}`;
        }
        sliderItems.innerHTML = await renderEmptyCart();
        bindRecAdds(sliderItems);
      } else {
        const linesHtml = renderCartLines(cart.items);
        if (recEnabled && recWithItems) {
          sliderItems.innerHTML = `${linesHtml}${renderRecSkeleton()}`;
          bindLineControls();
          const recHtml = renderRecCards(await loadRecProducts(cart.items));
          sliderItems.innerHTML = `${linesHtml}${recHtml}`;
          bindLineControls();
          bindRecAdds(sliderItems);
        } else {
          sliderItems.innerHTML = linesHtml;
          bindLineControls();
        }
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
      applyStaticFeatureTemplates(cart);
      applyFeatureCss();
      applyFeatureJs();
      startAnnouncementTimer();
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
    const backdrop = slider.querySelector("[data-satc-backdrop]");
    if (
      backdrop &&
      slider.dataset.backdropBlur !== "false" &&
      !backdrop.classList.contains("satc-slider__backdrop--blur")
    ) {
      backdrop.classList.add("satc-slider__backdrop--blur");
    }
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
