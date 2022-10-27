import React from "react";
import renderer from "react-test-renderer";
import ApiQuickGuide from "./api-quick-guide";
import Accordions from "./accordions/accordions";
import DatasetDetailEndpoints from "./dataset-detail-endpoints/dataset-detail-endpoints";
import DatasetSectionContainer from "../dataset-section-container/dataset-section-container";
import DatasetDetailFields from "./dataset-detail-fields";
import DatasetDetailExamples from "./dataset-detail-examples/dataset-detail-examples";
import SectionCollapseButton from "../section-collapse/section-collapse-button";

import { selectedTable } from "./test-helpers/test-helpers";
import ReactTestUtils from "react-dom/test-utils";
import ReactDom from "react-dom";
require("jest-fetch-mock");

describe("API Quick Guide", () => {
  const titleText = "API Quick Guide";
  const config = {
    apis: [
      {
        tableName: "table1",
        endpoint: "sample/url/table_1",
        fields: [
          {
            columnName: "reporting_date",
            definition: "Reporting date for the data",
            prettyName: "Calendar Date",
            dataType: "DATE",
            isRequired: "yes",
          },
          {
            columnName: "reporting_date",
            definition: "Reporting date for the data",
            prettyName: "Calendar Date",
            dataType: "DATE",
            isRequired: "yes",
          },
        ],
      },
    ],
  };

  jest
    .spyOn(document, "getElementById")
    .mockReturnValueOnce({ scrollHeight: 100 });

  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <ApiQuickGuide config={config} selectedTable={selectedTable} />
    );
  });

  const instance = component.root;

  it("should pass along its title param to the DatasetSectionContainer component", () => {
    const titleProperty = instance.findByType(DatasetSectionContainer).props
      .title;
    expect(titleProperty).toBe(titleText);
  });

  it("should present an ApiQuickGuideSection for Methods with a title and description", () => {
    expect(
      instance.findByProps({ id: "method-section" }).props.title
    ).toBeDefined();
    expect(
      instance.findByProps({ id: "method-section" }).props.description
    ).toBeDefined();
  });

  it("should pass along its api config to the DatasetDetailFields component", () => {
    const apis = instance.findByType(DatasetDetailFields).props.apis;
    expect(apis).toBe(config.apis);
  });

  it("should pass along the selectedTable to the Accordions component", () => {
    const curSelectedTable = instance.findByType(Accordions).props
      .selectedTable;
    expect(curSelectedTable).toBe(selectedTable);
  });

  it("should pass along the selectedTable prop to the DatasetDetailEndpoints component", () => {
    const endpointComp = instance.findByType(DatasetDetailEndpoints);
    expect(endpointComp.props.selectedTable).toBe(selectedTable);
  });

  it("passes the selectedTable to the DatasetDetailExamples component", () => {
    const datasetDetailComp = instance.findByType(DatasetDetailExamples);
    expect(datasetDetailComp.props.selectedTable).toBe(selectedTable);
  });

  it("displays as collapsed by default", () => {
    expect(
      instance.findByProps({ className: "sectionWrapper collapsed" })
    ).toBeDefined();
  });

  it("displays a toggle button", () => {
    const toggleButton = instance.findByType(SectionCollapseButton);
    expect(toggleButton).toBeDefined();
  });

  it("ensures buttons and links are tabIndex: -1 when collapsed and tabIndex: 0 when expanded", async () => {
    jest.useFakeTimers();
    const container = document.createElement("div");
    document.body.appendChild(container);
    ReactTestUtils.act(() => {
      ReactDom.render(
        <ApiQuickGuide config={config} selectedTable={selectedTable} />,
        container
      );
      jest.runAllTimers();
    });
    const collapse = document.querySelector("#api-quick-guide-expandable");
    let nodeList = collapse.querySelectorAll("button, a");
    let nodeArray = Array.prototype.slice.call(nodeList);
    // initially collapsed, all tabIndices are -1
    expect(nodeArray.every(rs => rs.tabIndex === -1)).toBeTruthy();

    const collapseButton = container.querySelector(
      "#api-quick-guide-collapse-button"
    );
    ReactTestUtils.act(() => {
      collapseButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      jest.runAllTimers();
      nodeList = collapse.querySelectorAll("button, a");
    });
    nodeArray = Array.prototype.slice.call(nodeList);
    // expanded after click, all tabIndices are 0
    expect(nodeArray.every(rs => rs.tabIndex === 0)).toBeFalsy();

    ReactTestUtils.act(() => {
      collapseButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      jest.runAllTimers();
      nodeList = collapse.querySelectorAll("button, a");
    });
    nodeArray = Array.prototype.slice.call(nodeList);
    // collapsed after second click, all tabIndices are -1
    expect(nodeArray.every(node => node.tabIndex === -1)).toBeTruthy();

    ReactTestUtils.act(() => {
      ReactDom.unmountComponentAtNode(container);
    });
  });
});
