import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const MonarchsStories: Meta = {
  title: "Core/MonarchsTable",
  component: "nef-table",
};

export const MonarchsTable: StoryObj = {
  render: () => html`
    <nef-table size="md">
      <nef-table-row slot="header">
        <nef-table-header align="left">Monarch</nef-table-header>
        <nef-table-header align="center">Reign Start</nef-table-header>
        <nef-table-header align="center">Reign End</nef-table-header>
      </nef-table-row>
      <nef-table-row>
        <nef-table-cell>Queen Elizabeth II</nef-table-cell>
        <nef-table-cell align="center">1952</nef-table-cell>
        <nef-table-cell align="center">2022</nef-table-cell>
      </nef-table-row>
      <nef-table-row>
        <nef-table-cell>King George VI</nef-table-cell>
        <nef-table-cell align="center">1936</nef-table-cell>
        <nef-table-cell align="center">1952</nef-table-cell>
      </nef-table-row>
      <nef-table-row>
        <nef-table-cell>King Edward VIII</nef-table-cell>
        <nef-table-cell align="center">1936</nef-table-cell>
        <nef-table-cell align="center">1936</nef-table-cell>
      </nef-table-row>
      <nef-table-row>
        <nef-table-cell>King George V</nef-table-cell>
        <nef-table-cell align="center">1910</nef-table-cell>
        <nef-table-cell align="center">1936</nef-table-cell>
      </nef-table-row>
      <nef-table-row>
        <nef-table-cell>King Edward VII</nef-table-cell>
        <nef-table-cell align="center">1901</nef-table-cell>
        <nef-table-cell align="center">1910</nef-table-cell>
      </nef-table-row>
      <nef-table-row>
        <nef-table-cell>Queen Victoria</nef-table-cell>
        <nef-table-cell align="center">1837</nef-table-cell>
        <nef-table-cell align="center">1901</nef-table-cell>
      </nef-table-row>
      <nef-table-row>
        <nef-table-cell>King William IV</nef-table-cell>
        <nef-table-cell align="center">1830</nef-table-cell>
        <nef-table-cell align="center">1837</nef-table-cell>
      </nef-table-row>
      <nef-table-row>
        <nef-table-cell>King George IV</nef-table-cell>
        <nef-table-cell align="center">1820</nef-table-cell>
        <nef-table-cell align="center">1830</nef-table-cell>
      </nef-table-row>
      <nef-table-row>
        <nef-table-cell>King George III</nef-table-cell>
        <nef-table-cell align="center">1760</nef-table-cell>
        <nef-table-cell align="center">1820</nef-table-cell>
      </nef-table-row>
      <nef-table-row>
        <nef-table-cell>King George II</nef-table-cell>
        <nef-table-cell align="center">1727</nef-table-cell>
        <nef-table-cell align="center">1760</nef-table-cell>
      </nef-table-row>
    </nef-table>
  `,
};

export default MonarchsStories;
