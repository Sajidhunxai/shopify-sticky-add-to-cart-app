import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_BAR_CONFIG,
  barConfigFromFormData,
  parseBarConfig,
  validateBarConfig,
} from "./bar-config";
import { serializeBarConfigToFormData } from "../admin/serialize-config";

describe("parseBarConfig", () => {
  it("returns defaults for empty input", () => {
    const config = parseBarConfig(null);
    assert.equal(config.enabled, DEFAULT_BAR_CONFIG.enabled);
    assert.equal(config.rewardEnabled, true);
    assert.equal(config.rewardTiers.length, 4);
  });

  it("migrates legacy freeShipping into rewardTiers", () => {
    const config = parseBarConfig(
      JSON.stringify({
        freeShippingEnabled: true,
        freeShippingThreshold: 75,
        freeShippingText: "You're {{amount_remaining}} away!",
        freeShippingReachedText: "Unlocked!",
      }),
    );
    assert.equal(config.rewardEnabled, true);
    assert.equal(config.rewardCompleteText, "Unlocked!");
    assert.equal(config.rewardTiers[0].minAmount, 75);
    assert.match(config.rewardTiers[0].titleBefore, /\[AMOUNT\]/);
  });
});

describe("serialize ↔ barConfigFromFormData round-trip", () => {
  it("preserves defaults through FormData", () => {
    const original = {
      ...DEFAULT_BAR_CONFIG,
      rewardTiers: DEFAULT_BAR_CONFIG.rewardTiers.map((t) => ({ ...t })),
    };
    const fd = serializeBarConfigToFormData(original);
    const parsed = barConfigFromFormData(fd);
    assert.equal(parsed.enabled, original.enabled);
    assert.equal(parsed.displayMode, original.displayMode);
    assert.equal(parsed.rewardEnabled, original.rewardEnabled);
    assert.equal(parsed.drawerBackdropBlur, original.drawerBackdropBlur);
    assert.equal(parsed.drawerShowOnProduct, original.drawerShowOnProduct);
    assert.equal(parsed.cartLineQtyEnabled, original.cartLineQtyEnabled);
    assert.equal(parsed.recommendationsEnabled, original.recommendationsEnabled);
    assert.equal(
      parsed.recommendationsShowWithItems,
      original.recommendationsShowWithItems,
    );
    assert.equal(parsed.recommendationsSource, original.recommendationsSource);
    assert.equal(parsed.drawerAnimation, original.drawerAnimation);
    assert.equal(parsed.recommendationsAnimation, original.recommendationsAnimation);
    assert.equal(parsed.rewardAnimation, original.rewardAnimation);
    assert.deepEqual(parsed.rewardTiers, original.rewardTiers);
    assert.deepEqual(
      parsed.recommendationsProducts,
      original.recommendationsProducts,
    );
    assert.equal(parsed.customCss, original.customCss);
    assert.equal(
      parsed.featureTemplates.recommendations.enabled,
      original.featureTemplates.recommendations.enabled,
    );
  });
});

describe("validateBarConfig", () => {
  it("accepts DEFAULT_BAR_CONFIG", () => {
    assert.deepEqual(validateBarConfig(DEFAULT_BAR_CONFIG), []);
  });
});
