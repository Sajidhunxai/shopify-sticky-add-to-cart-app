import styles from "../../../styles/dashboard.module.css";
import { colorFromEvent } from "../../fields/color";
import type { RewardsPanelProps } from "../../types";

export function RewardsPanel({
  config,
  updateConfig,
  updateRewardTier,
}: RewardsPanelProps) {
  return (
    <s-stack gap="base">
      <s-stack direction="inline" gap="base">
        <s-badge tone={config.rewardEnabled ? "success" : "neutral"}>
          {config.rewardEnabled ? "Active" : "Disabled"}
        </s-badge>
        <s-switch
          label={
            config.rewardEnabled
              ? "Disable tiered rewards"
              : "Enable tiered rewards"
          }
          checked={config.rewardEnabled}
          onChange={(e: Event) =>
            updateConfig(
              "rewardEnabled",
              (e.currentTarget as HTMLInputElement).checked,
            )
          }
        />
      </s-stack>

      <s-switch
        label="Show rewards on empty cart"
        checked={config.rewardShowOnEmpty}
        onChange={(e: Event) =>
          updateConfig(
            "rewardShowOnEmpty",
            (e.currentTarget as HTMLInputElement).checked,
          )
        }
      />

      <s-heading>Colors</s-heading>
      <s-grid gridTemplateColumns="1fr 1fr" gap="base">
        <s-color-field
          label="Background"
          value={config.rewardBg}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("rewardBg", value);
          }}
        />
        <s-color-field
          label="Progress / foreground"
          value={config.rewardFg}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("rewardFg", value);
          }}
        />
        <s-color-field
          label="Reward tier icon"
          value={config.rewardIconColor}
          onChange={(e: Event) => {
            const value = colorFromEvent(e);
            if (value) updateConfig("rewardIconColor", value);
          }}
        />
      </s-grid>

      <s-text-field
        label="Text after completing full rewards bar"
        value={config.rewardCompleteText}
        onChange={(e: Event) =>
          updateConfig(
            "rewardCompleteText",
            (e.currentTarget as HTMLInputElement).value,
          )
        }
      />

      <s-select
        label="Rewards calculation"
        value={config.rewardCalcMode}
        onChange={(e: Event) =>
          updateConfig(
            "rewardCalcMode",
            (e.currentTarget as HTMLSelectElement).value as
              "total" | "quantity",
          )
        }
      >
        <s-option value="total">Cart total ($)</s-option>
        <s-option value="quantity">Cart quantity (#)</s-option>
      </s-select>

      <s-heading>Tiers</s-heading>
      {config.rewardTiers.map((tier, index) => (
        <div key={`tier-${index}`} className={styles.tierCard}>
          <s-stack direction="inline" gap="base">
            <strong>Tier {index + 1}</strong>
            <s-switch
              label="Enabled"
              checked={tier.enabled}
              onChange={(e: Event) =>
                updateRewardTier(index, {
                  enabled: (e.currentTarget as HTMLInputElement).checked,
                })
              }
            />
          </s-stack>
          <s-number-field
            label={
              config.rewardCalcMode === "quantity"
                ? "Minimum quantity"
                : "Minimum amount"
            }
            value={String(tier.minAmount)}
            min={1}
            onChange={(e: Event) =>
              updateRewardTier(index, {
                minAmount: Number((e.currentTarget as HTMLInputElement).value),
              })
            }
          />
          <s-text-field
            label="Reward description"
            value={tier.description}
            onChange={(e: Event) =>
              updateRewardTier(index, {
                description: (e.currentTarget as HTMLInputElement).value,
              })
            }
          />
          <s-text-field
            label="Title before achieving (use [AMOUNT])"
            value={tier.titleBefore}
            onChange={(e: Event) =>
              updateRewardTier(index, {
                titleBefore: (e.currentTarget as HTMLInputElement).value,
              })
            }
          />
        </div>
      ))}
    </s-stack>
  );
}
