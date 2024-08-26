import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./Alert"; // Import the Alert component

const AlertStories: Meta = {
  title: "Core/Alert",
  component: "nef-alert",
  args: {
    variant: "info",
    dismissible: false,
  },
};

export const New: StoryObj = {
  render: ({ ...props }) => html`
    <nef-alert>
      <nef-typography variant="body-sm" slot="title">
        <span>Hello</span>
      </nef-typography>
    </nef-alert>
  `,
};

export default AlertStories;
