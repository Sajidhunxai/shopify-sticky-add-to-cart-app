import { Form } from "react-router";
import type { SetupPanelProps } from "../../types";

export function SetupPanel({ busy, shop }: SetupPanelProps) {
  return (
    <s-stack gap="base">
      <s-paragraph>
        Store: <strong>{shop}</strong>
      </s-paragraph>
      <s-stack direction="inline" gap="base">
        <s-button
          href={`https://${shop}/admin/themes/current/editor`}
          target="_blank"
          variant="secondary"
        >
          Open Theme Editor
        </s-button>
        <Form method="post">
          <input type="hidden" name="intent" value="sync" />
          <s-button
            type="submit"
            variant="tertiary"
            {...(busy ? { loading: true } : {})}
          >
            Sync storefront
          </s-button>
        </Form>
        <s-button href="/app/additional" variant="tertiary">
          Setup help
        </s-button>
      </s-stack>
      <s-heading>Settings → storefront checklist</s-heading>
      <s-unordered-list>
        <s-list-item>Enable the App embed once in Theme Editor</s-list-item>
        <s-list-item>
          Set Display style → Cart drawer (for drawer + cart icon intercept)
        </s-list-item>
        <s-list-item>
          Configure Design / Header / Tiered rewards / Recommendations here
        </s-list-item>
        <s-list-item>
          Under Pages &amp; devices, set sticky bar and Cart drawer — show on
          flags separately
        </s-list-item>
        <s-list-item>Click Save settings (syncs metafield to storefront)</s-list-item>
        <s-list-item>
          After the first Save, admin settings fully override Theme Editor
          color/text defaults for this embed
        </s-list-item>
        <s-list-item>Hard-refresh the storefront, then open the cart drawer</s-list-item>
        <s-list-item>
          To replace the theme cart drawer: theme Cart type → Page. Full steps
          under Setup help.
        </s-list-item>
      </s-unordered-list>
    </s-stack>
  );
}
