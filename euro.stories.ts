import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./Rich-table";
import "./Alert";
import "./Logo";
const data = [
  { name: "Germany", population: 83783942, gdp: 4200000000000 },
  { name: "United Kingdom", population: 67886011, gdp: 2970000000000 },
  { name: "France", population: 65273511, gdp: 2820000000000 },
  { name: "Italy", population: 60244639, gdp: 2000000000000 },
  { name: "Spain", population: 46754778, gdp: 1400000000000 },
  { name: "Netherlands", population: 17134872, gdp: 900000000000 },
  { name: "Sweden", population: 10099265, gdp: 600000000000 },
  { name: "Poland", population: 38386000, gdp: 650000000000 },
  { name: "Belgium", population: 11589623, gdp: 500000000000 },
  { name: "Norway", population: 5421241, gdp: 400000000000 },
  { name: "Austria", population: 8917205, gdp: 450000000000 },
  { name: "Denmark", population: 5818553, gdp: 300000000000 },
  { name: "Finland", population: 5530719, gdp: 300000000000 },
  { name: "Ireland", population: 4937786, gdp: 500000000000 },
  { name: "Czech Republic", population: 10708981, gdp: 300000000000 },
  { name: "Romania", population: 19237691, gdp: 250000000000 },
  { name: "Hungary", population: 9660351, gdp: 150000000000 },
  { name: "Portugal", population: 10196709, gdp: 300000000000 },
  { name: "Slovakia", population: 5456362, gdp: 100000000000 },
  { name: "Croatia", population: 4105267, gdp: 100000000000 },
  { name: "Slovenia", population: 2078654, gdp: 60000000000 },
  { name: "Bulgaria", population: 6948445, gdp: 100000000000 },
];

const RichTableStories: Meta = {
  title: "Countries/Euro Rich Table",
  component: "nef-rich-table",
};

export const EuroRichTable: StoryObj = {
  render: () => html`
    <nef-logo variant="full" width="150px" height="auto"></nef-logo>
    </br>
    <nef-rich-table
      .data=${data}
      .columns=${[
        {
          name: "name",
          label: "Country",
          sortable: true,
          filterable: true,
          type: "text",
        },
        {
          name: "population",
          label: "Population",
          sortable: false,
          filterable: true,
          type: "number",
        },
        {
          name: "gdp",
          label: "GDP (in USD)",
          sortable: true,
          filterable: true,
          type: "number",
        },
      ]}
      .hasPagination=${true}
      .isFilterable=${true}
      @column-sorted=${async () => {
        try {
          const response = await fetch("/api/test");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const responseData = await response.json();
          console.log(responseData);
        } catch (error) {
          const alert = document.createElement("nef-alert");
          alert.setAttribute("variant", "error");
          alert.setAttribute("dismissible", "true");
          alert.innerHTML = `<nef-typography variant='body-sm' slot='title'>Failed to fetch data: ${error.message}</nef-typography>`;
          document.body.appendChild(alert);
        }
      }}
    >
      <nef-button slot="header-before">Before Header</nef-button>
      <div slot="header-after">After Header Slot</div>
    </nef-rich-table>
  `,
};

export default RichTableStories;
