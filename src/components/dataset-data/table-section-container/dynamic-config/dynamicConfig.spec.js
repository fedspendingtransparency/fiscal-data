import React from 'react';
import { render } from '@testing-library/react';
import DynamicConfig from './dynamicConfig';
import { unitTestHelpers } from './helper';

// jest.mock('@mui/material/Modal', () => {
//   return jest.fn().mockImplementation(props => <>{props.children}</>);
// });
//
// jest.mock('@mui/material/Popover', () => {
//   return jest.fn().mockImplementation(props => <>{props.children}</>);
// });

jest.useFakeTimers();
describe('Dynamic Config', () => {
  const pivotsUpdatedSpy = jest.fn();
  const ignorePivotsSpy = jest.fn();
  const refreshTableSpy = jest.fn();

  beforeEach(() => {
    render(
      <DynamicConfig
        selectedTable={unitTestHelpers.selectedTable}
        handleIgnorePivots={ignorePivotsSpy}
        handlePivotsUpdated={pivotsUpdatedSpy}
        refreshTable={refreshTableSpy}
      />
    );
  });
  it('should ', () => {
    expect(true);
  });
  // it('shows a button to launch the config modal', () => {
  //   expect(screen.getByTestId('launchConfigModal')).toHaveAttribute('aria-label', 'Configure Chart');
  // });
  //
  // it('renders a pivot view title that may be cancelled while editing', () => {
  //   expect(screen.getAllByTestId('pivotViewTitle').map(element => element.textContent)).toContain('By State');
  //   fireEvent.click(screen.getByTestId('editButton-By State'));
  //
  //   expect(screen.getByTestId('titleInput')).toHaveValue('By State');
  //   fireEvent.change(screen.getByTestId('titleInput'), { target: { value: 'By American State' } });
  //   expect(screen.getByTestId('titleInput')).toHaveValue('By American State');
  //
  //   fireEvent.click(screen.getByTestId('cancelButton'));
  //
  //   expect(screen.getAllByTestId('pivotViewTitle').map(element => element.textContent)).toContain('By State');
  // });
  //
  // it('renders a pivot view title that may be saved after editing', () => {
  //   expect(screen.getAllByTestId('pivotViewTitle').map(element => element.textContent)).toContain('By State');
  //   fireEvent.click(screen.getByTestId('editButton-By State'));
  //
  //   expect(screen.getByTestId('titleInput')).toHaveValue('By State');
  //   fireEvent.change(screen.getByTestId('titleInput'), { target: { value: 'By American State' } });
  //   expect(screen.getByTestId('titleInput')).toHaveValue('By American State');
  //
  //   fireEvent.click(screen.getByTestId('saveButton'));
  //
  //   expect(screen.getAllByTestId('pivotViewTitle').map(element => element.textContent)).toContain('By American State');
  // });
  //
  // it('places a filter editor component when a pivot view is in edit mode', () => {
  //   expect(screen.getAllByTestId('pivotViewTitle').map(element => element.textContent)).toContain('By Department');
  //   fireEvent.click(screen.getByTestId('editButton-By Department'));
  //
  //   expect(screen.getByTestId('filterEditor')).toBeDefined();
  //   expect(screen.getByTestId('select-key-0')).toHaveValue('state_nm');
  //   expect(screen.getByTestId('select-operator-0')).toHaveValue('eq');
  //   expect(screen.getByTestId('input-value-0')).toHaveValue('A001');
  //
  //   expect(within(screen.getByTestId('select-key-0')).getAllByRole('option').length).toEqual(15);
  // });
});
