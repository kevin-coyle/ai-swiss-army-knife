import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./Rich-table";

const PresidentsTableStories: Meta = {
  title: "Core/PresidentsTable",
  component: "nef-rich-table",
  args: {
    data: [
      { name: "Joe Biden", age_when_elected: 78 },
      { name: "Donald Trump", age_when_elected: 70 },
      { name: "Barack Obama", age_when_elected: 47 },
      { name: "George W. Bush", age_when_elected: 54 },
      { name: "Bill Clinton", age_when_elected: 46 },
      { name: "George H. W. Bush", age_when_elected: 64 },
      { name: "Ronald Reagan", age_when_elected: 69 },
      { name: "Jimmy Carter", age_when_elected: 52 },
      { name: "Gerald Ford", age_when_elected: 61 },
      { name: "Richard Nixon", age_when_elected: 47 },
      { name: "Lyndon B. Johnson", age_when_elected: 55 },
      { name: "John F. Kennedy", age_when_elected: 43 },
      { name: "Dwight D. Eisenhower", age_when_elected: 62 },
      { name: "Harry S. Truman", age_when_elected: 60 },
      { name: "Franklin D. Roosevelt", age_when_elected: 51 },
      { name: "Herbert Hoover", age_when_elected: 54 },
      { name: "Calvin Coolidge", age_when_elected: 51 },
      { name: "Warren G. Harding", age_when_elected: 55 },
      { name: "Woodrow Wilson", age_when_elected: 56 },
      { name: "William Howard Taft", age_when_elected: 51 },
    ],
    columns: [
      { name: "name", label: "President Name", sortable: true },
      {
        name: "age_when_elected",
        label: "Age When Elected",
        sortable: true,
        type: "number",
      },
    ],
    hasPagination: true,
  },
};

export const BasicUse: StoryObj = {
  render: (props) => html`
    <nef-rich-table
      .data=${props.data}
      .columns=${props.columns}
      .hasPagination=${props.hasPagination}
    >
      <nef-button slot="header-before">Before Header</nef-button>
      <div slot="header-after">After Header Slot</div>
    </nef-rich-table>
  `,
};

export default PresidentsTableStories;
