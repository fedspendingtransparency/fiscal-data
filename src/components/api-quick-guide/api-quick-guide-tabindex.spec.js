import ReactTestUtils from 'react-dom/test-utils';
import ReactDom from 'react-dom';
import ApiQuickGuide from './api-quick-guide';
import { selectedTable } from './test-helpers/test-helpers';
import React from 'react';

describe('API Quick Guide Tab Index', () => {
  const config = {
    apis: [
      {
        tableName: 'table1',
        endpoint: 'sample/url/table_1',
        fields: [
          {
            "columnName": "reporting_date",
            "definition": "Reporting date for the data",
            "prettyName": "Calendar Date",
            "dataType": "DATE",
            "isRequired": "yes"
          },
          {
            "columnName": "reporting_date",
            "definition": "Reporting date for the data",
            "prettyName": "Calendar Date",
            "dataType": "DATE",
            "isRequired": "yes"
          },
        ]
      }
    ]
  };

  jest.spyOn(document, 'getElementById').mockReturnValueOnce({ scrollHeight: 100 });
  it('ensures buttons and links are tabIndex: -1 when collapsed and tabIndex: 0 when expanded',
    async () => {
      jest.useFakeTimers();
      const container = document.createElement("div");
      document.body.appendChild(container);
      ReactTestUtils.act(() => {
        ReactDom.render(
          <ApiQuickGuide config={config} selectedTable={selectedTable} />, container);
        jest.runAllTimers();
      });
      const collapse = document.querySelector('#api-quick-guide-expandable');
      let nodeList = collapse.querySelectorAll('button, a');
      let nodeArray = Array.prototype.slice.call(nodeList);
      // initially collapsed, all tabIndices are -1
      expect(nodeArray.every(rs => rs.tabIndex === -1)).toBeTruthy();

      const collapseButton = container.querySelector('#api-quick-guide-collapse-button');
      ReactTestUtils.act(() => {
        collapseButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        jest.runAllTimers();
        nodeList = collapse.querySelectorAll('button, a');
      });
      nodeArray = Array.prototype.slice.call(nodeList);
      // expanded after click, all tabIndices are 0
      expect(nodeArray.every(rs => rs.tabIndex === 0)).toBeTruthy();

      ReactTestUtils.act(() => {
        collapseButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        jest.runAllTimers();
        nodeList = collapse.querySelectorAll('button, a');
      });
      nodeArray = Array.prototype.slice.call(nodeList);
      // collapsed after second click, all tabIndices are -1
      expect(nodeArray.every(node => node.tabIndex === -1)).toBeTruthy();

      ReactTestUtils.act(() => {
        ReactDom.unmountComponentAtNode(container)
      })
    }
  );
})
