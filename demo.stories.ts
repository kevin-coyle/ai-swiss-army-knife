import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const SneezioStories: Meta = {
  title: "Marketing/Sneezio",
};

export const MarketingPage: StoryObj = {
  render: () => html`
    <nef-typography variant="h1">Introducing Sneezio</nef-typography>
    <nef-typography variant="body">Your ultimate solution to managing sneezes and allergies.</nef-typography>
    <nef-button size="lg" variant="primary">Learn More</nef-button>

    <nef-box padding="20px" margin="20px 0">
      <nef-typography variant="h2">Features</nef-typography>
      <ul>
        <li><nef-typography variant="body">Real-time sneeze tracking.</nef-typography></li>
        <li><nef-typography variant="body">Personalized health insights.</nef-typography></li>
        <li><nef-typography variant="body">Integration with healthcare systems.</nef-typography></li>
      </ul>
    </nef-box>

    <nef-box padding="20px" margin="20px 0">
      <nef-typography variant="h2">Testimonials</nef-typography>
      <nef-alert variant="success" dismissible="true">
        <nef-typography variant="body-sm" slot="title"><span>User Success Story!</span></nef-typography>
        <span>Sneezio has transformed how I manage my allergies. - Alex P.</span>
      </nef-alert>
      <nef-alert variant="info" dismissible="true">
        <nef-typography variant="body-sm" slot="title"><span>Reliability at its best!</span></nef-typography>
        <span>Sneezio provides the most accurate results I've experienced. - Jamie L.</span>
      </nef-alert>
    </nef-box>

    <nef-drawer open="false" heading="Get Sneezio Now!">
      <div slot="content">
        <nef-typography variant="body-sm">Sign up today for a healthier tomorrow!</nef-typography>
        <nef-button slot="footer" variant="success">Sign Up</nef-button>
      </div>
    </nef-drawer>
    <nef-button @click="${() => toggleDrawer()}">Open Drawer</nef-button>
  `,
};

const toggleDrawer = () => {
  const drawer = document.querySelector("nef-drawer");
  if (drawer) {
    drawer.open = !drawer.open; // Toggle drawer state
  }
};

export default SneezioStories;
