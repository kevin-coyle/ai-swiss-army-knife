import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { data, expandedData, longData } from "./data";

import ".";
import "../Button";

const RichTableStories: Meta = {
  title: "Core/RichTable",
  component: "nef-rich-table",
  args: {
    columns: [
      { name: "name", label: "Name", sortable: true, filterable: true, type: "text" },
      { name: "age", label: "Age", sortable: true, filterable: true, type: "number" },
      { name: "email", label: "Email", sortable: true, filterable: true, type: "text", align: "start" },
    ],
    sortConfig: { key: "", direction: "" },
    selectedRows: [],
    hasPagination: false,
    infiniteScroll: false,
    resizableColumns: false,
    isRowSelectEnabled: false, // Added property for row selection
    isRowSelectAllEnabled: true,
    useRadiosForSelection: false, // Default value
    isFilterable: false, // Default value for new property
    isColumnSelectorEnabled: false, // Default value for new property
    isEditableTableEnabled: false, // Default value for new property
  },
  argTypes: {
    columns: {
      control: {
        type: "object",
      },
    },
    sortConfig: {
      control: {
        type: "object",
      },
    },
    selectedRows: {
      control: {
        type: "object",
      },
    },
    hasPagination: {
      control: {
        type: "boolean",
      },
    },
    infiniteScroll: {
      control: {
        type: "boolean",
      },
    },
    resizableColumns: {
      control: {
        type: "boolean",
      },
    },
    isRowSelectEnabled: {
      control: {
        type: "boolean",
      },
    },
    useRadiosForSelection: {
      control: {
        type: "boolean",
      },
    },
    isFilterable: {
      control: {
        type: "boolean",
      },
    },
    isColumnSelectorEnabled: {
      control: {
        type: "boolean",
      },
    },
    isEditableTableEnabled: {
      control: {
        type: "boolean",
      },
    },
  },
};

export const BasicUse: StoryObj = {
  render: (props) => html`
    <nef-rich-table
      .data=${data}
      .columns=${props.columns}
      .hasPagination=${props.hasPagination}
      .infiniteScroll=${props.infiniteScroll}
      .resizableColumns=${props.resizableColumns}
      .isRowSelectEnabled=${props.isRowSelectEnabled} // Pass the new property
      .useRadiosForSelection=${props.useRadiosForSelection} // Pass the new property
      .isColumnSelectorEnabled=${props.isColumnSelectorEnabled} // Pass the new property
      .isEditableTableEnabled=${props.isEditableTableEnabled} // Pass the new property
    >
      <nef-button slot="header-before">Before Header</nef-button>
      <div slot="header-after">After Header Slot</div>
    </nef-rich-table>
  `,
};

export const EditableRows: StoryObj = {
  render: (props) => html`
    <nef-rich-table
      .data=${data}
      .columns=${props.columns}
      .hasPagination=${props.hasPagination}
      .infiniteScroll=${props.infiniteScroll}
      .resizableColumns=${props.resizableColumns}
      .isRowSelectEnabled=${false}
      .isEditableTableEnabled=${true} // Enable editing
      .isColumnSelectorEnabled=${props.isColumnSelectorEnabled} // Pass the new property
    >
      <nef-button slot="header-before">Before Header</nef-button>
      <div slot="header-after">After Header Slot</div>
    </nef-rich-table>
  `,
};

export const SelectableRows: StoryObj = {
  render: (props) => html`
    <nef-rich-table
      .data=${data}
      .columns=${props.columns}
      .selectedRows=${props.selectedRows}
      .hasPagination=${props.hasPagination}
      .infiniteScroll=${props.infiniteScroll}
      .resizableColumns=${props.resizableColumns}
      .isRowSelectEnabled=${true}
      .isRowSelectAllEnabled=${true}
      .useRadiosForSelection=${false} // Pass the new property
      .isColumnSelectorEnabled=${props.isColumnSelectorEnabled} // Pass the new property
    >
      <nef-button slot="header-before">Before Header</nef-button>
      <div slot="header-after">After Header Slot</div>
    </nef-rich-table>
  `,
};

export const SelectableRowsWithRadios: StoryObj = {
  render: (props) => html`
    <nef-rich-table
      .data=${data}
      .columns=${props.columns}
      .selectedRows=${props.selectedRows}
      .hasPagination=${props.hasPagination}
      .infiniteScroll=${props.infiniteScroll}
      .resizableColumns=${props.resizableColumns}
      .isRowSelectEnabled=${true}
      .isRowSelectAllEnabled=${true}
      .useRadiosForSelection=${true}
      .isColumnSelectorEnabled=${props.isColumnSelectorEnabled}
    >
      <nef-button slot="header-before">Before Header</nef-button>
      <div slot="header-after">After Header Slot</div>
    </nef-rich-table>
  `,
};

export const ExpandableRows: StoryObj = {
  args: {
    data: expandedData,
  },
  render: (props) => html`
    <nef-rich-table
      .data=${props.data}
      .columns=${props.columns}
      .hasPagination=${props.hasPagination}
      .infiniteScroll=${props.infiniteScroll}
      .resizableColumns=${props.resizableColumns}
      .isRowSelectEnabled=${false}
      .isColumnSelectorEnabled=${props.isColumnSelectorEnabled}
      @row-selected=${(e) => console.log("Selected rows:", e.detail)}
    >
      <nef-button slot="header-before">Before Header</nef-button>
      <div slot="header-after">After Header Slot</div>
    </nef-rich-table>
  `,
};

export const WithPagination: StoryObj = {
  args: {
    hasPagination: true,
  },
  render: (props) => html`
    <nef-rich-table
      .data=${data}
      .columns=${props.columns}
      .hasPagination=${props.hasPagination}
      .infiniteScroll=${props.infiniteScroll}
      .resizableColumns=${props.resizableColumns}
      .isRowSelectEnabled=${false}
      .isColumnSelectorEnabled=${props.isColumnSelectorEnabled}
    >
      <nef-button slot="header-before">Before Header</nef-button>
      <div slot="header-after">After Header Slot</div>
    </nef-rich-table>
  `,
};

export const LongData: StoryObj = {
  args: {
    hasPagination: true,
  },
  render: (props) => html`
    <nef-rich-table
      .data=${longData}
      .columns=${props.columns}
      .hasPagination=${props.hasPagination}
      .infiniteScroll=${props.infiniteScroll}
      .resizableColumns=${props.resizableColumns}
      .isRowSelectEnabled=${false}
      .isColumnSelectorEnabled=${props.isColumnSelectorEnabled}
    >
      <nef-button slot="header-before">Before Header</nef-button>
      <div slot="header-after">After Header Slot</div>
    </nef-rich-table>
  `,
};

export const RowClickCallback: StoryObj = {
  render: (props) => html`
    <nef-rich-table
      .data=${data}
      .columns=${props.columns}
      .rowClickCallback=${(row) => alert('Row clicked: ' + JSON.stringify(row))}
      .hasPagination=${props.hasPagination}
      .infiniteScroll=${props.infiniteScroll}
      .resizableColumns=${props.resizableColumns}
      .isRowSelectEnabled=${false}
      .isColumnSelectorEnabled=${props.isColumnSelectorEnabled}
    >
      <nef-button slot="header-before">Before Header</nef-button>
      <div slot="header-after">After Header Slot</div>
    </nef-rich-table>
  `,
};

export const ContextMenu: StoryObj = {
  render: (props) => html`
    <nef-rich-table
      .data=${data}
      .columns=${props.columns}
      .isBodyContextMenuEnabled=${true}
      .hasPagination=${props.hasPagination}
      .infiniteScroll=${props.infiniteScroll}
      .resizableColumns=${props.resizableColumns}
      .isRowSelectEnabled=${false}
      .isColumnSelectorEnabled=${props.isColumnSelectorEnabled}
      @row-selected=${(e) => console.log("Selected rows:", e.detail)}
    >
      <nef-button slot="header-before">Before Header</nef-button>
      <div slot="header-after">After Header Slot</div>
    </nef-rich-table>
  `,
};

export const InfiniteScroll: StoryObj = {
  args: {
    infiniteScroll: true,
    hasPagination: false,
    data: longData,
  },
  render: (props) => html`
    <nef-rich-table
      .data=${props.data}
      .columns=${props.columns}
      .hasPagination=${props.hasPagination}
      .infiniteScroll=${props.infiniteScroll}
      .resizableColumns=${props.resizableColumns}
      .isRowSelectEnabled=${false}
      .isColumnSelectorEnabled=${props.isColumnSelectorEnabled}
    >
      <nef-button slot="header-before">Before Header</nef-button>
      <div slot="header-after">After Header Slot</div>
    </nef-rich-table>
  `,
};

export const FilterableRows: StoryObj = {
  render: (props) => html`
    <nef-rich-table
      .data=${data}
      .columns=${props.columns}
      .hasPagination=${props.hasPagination}
      .infiniteScroll=${props.infiniteScroll}
      .resizableColumns=${props.resizableColumns}
      .isRowSelectEnabled=${false}
      .isFilterable=${true}
      .isColumnSelectorEnabled=${props.isColumnSelectorEnabled}
    >
      <nef-button slot="header-before">Before Header</nef-button>
      <div slot="header-after">After Header Slot</div>
    </nef-rich-table>
  `,
};

export default RichTableStories;
