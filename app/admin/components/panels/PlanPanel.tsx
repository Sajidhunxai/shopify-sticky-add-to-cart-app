import { Form } from "react-router";
import styles from "../../../styles/dashboard.module.css";
import type { PlanPanelProps } from "../../types";

export function PlanPanel({ isPro, hideBranding, busy, t }: PlanPanelProps) {
  return (
    <s-stack gap="base">
      <div className={styles.planCard}>
        <s-stack direction="inline" gap="small-200">
          <s-badge tone={isPro ? "success" : "info"}>
            {isPro ? t("plan.pro") : t("plan.free")}
          </s-badge>
          <s-badge tone={hideBranding ? "success" : "caution"}>
            {hideBranding ? t("plan.brandingHidden") : t("plan.brandingVisible")}
          </s-badge>
        </s-stack>
        <p className={styles.planPrice}>
          {isPro ? "$6.99" : "$0"}
          <span>{t("plan.perMonth")}</span>
        </p>
        <p>
          {isPro
            ? t("plan.proDesc")
            : t("plan.freeDesc")}
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
            {t("plan.downgrade")}
          </s-button>
        </Form>
      ) : (
        <Form method="post">
          <input type="hidden" name="intent" value="upgrade" />
          <s-button type="submit" {...(busy ? { loading: true } : {})}>
            {t("plan.upgradeCta")}
          </s-button>
        </Form>
      )}
    </s-stack>
  );
}
