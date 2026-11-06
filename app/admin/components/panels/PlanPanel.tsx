import { Form } from "react-router";
import styles from "../../../styles/dashboard.module.css";
import type { PlanPanelProps } from "../../types";

export function PlanPanel({ isPro, hideBranding, busy }: PlanPanelProps) {
  return (
    <s-stack gap="base">
      <div className={styles.planCard}>
        <s-stack direction="inline" gap="small-200">
          <s-badge tone={isPro ? "success" : "info"}>
            {isPro ? "Pro" : "Free"}
          </s-badge>
          <s-badge tone={hideBranding ? "success" : "caution"}>
            {hideBranding ? "Branding hidden" : "Branding visible"}
          </s-badge>
        </s-stack>
        <p className={styles.planPrice}>
          {isPro ? "$6.99" : "$0"}
          <span>/mo</span>
        </p>
        <p>
          {isPro
            ? "Pro removes the “Powered by Sticky ATC” label and keeps full style controls."
            : "Free includes the sticky bar with a small branding label. Upgrade to remove branding."}
        </p>
      </div>
      {isPro ? (
        <Form method="post">
          <input type="hidden" name="intent" value="downgrade" />
          <s-button
            type="submit"
            variant="secondary"
            {...(busy ? { loading: true } : {})}
          >
            Switch to Free
          </s-button>
        </Form>
      ) : (
        <Form method="post">
          <input type="hidden" name="intent" value="upgrade" />
          <s-button type="submit" {...(busy ? { loading: true } : {})}>
            Upgrade to Pro — $6.99/mo
          </s-button>
        </Form>
      )}
    </s-stack>
  );
}
