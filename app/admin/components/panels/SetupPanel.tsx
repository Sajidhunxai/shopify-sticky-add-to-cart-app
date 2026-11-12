import { Form } from "react-router";
import type { SetupPanelProps } from "../../types";

export function SetupPanel({ busy, shop, t }: SetupPanelProps) {
  return (
    <s-stack gap="base">
      <s-paragraph>
        {t("setup.store")} <strong>{shop}</strong>
      </s-paragraph>
      <s-stack direction="inline" gap="base">
        <s-button
          href={`https://${shop}/admin/themes/current/editor`}
          target="_blank"
          variant="secondary"
        >
          {t("setup.openThemeEditor")}
        </s-button>
        <Form method="post">
          <input type="hidden" name="intent" value="sync" />
          <s-button
            type="submit"
            variant="tertiary"
            {...(busy ? { loading: true } : {})}
          >
            {t("plan.sync")}
          </s-button>
        </Form>
        <s-button href="/app/additional" variant="tertiary">
          {t("app.navSetup")}
        </s-button>
      </s-stack>
      <s-heading>{t("setup.checklistHeading")}</s-heading>
      <s-unordered-list>
        <s-list-item>{t("setup.check1")}</s-list-item>
        <s-list-item>{t("setup.check2")}</s-list-item>
        <s-list-item>{t("setup.check3")}</s-list-item>
        <s-list-item>{t("setup.check4")}</s-list-item>
        <s-list-item>{t("setup.check5")}</s-list-item>
        <s-list-item>{t("setup.check6")}</s-list-item>
        <s-list-item>{t("setup.check7")}</s-list-item>
        <s-list-item>{t("setup.check8")}</s-list-item>
      </s-unordered-list>
    </s-stack>
  );
}
