import React from 'react';
import renderer from 'react-test-renderer';
import FilterSection from './filter-section';
import {reports} from "../test-helper";
import SelectControl from "../../select-control/select-control";
import CurrentReportToggle from '../../dataset-data/current-report-toggle/current-report-toggle';
import * as styles from './filter-section.module.scss';
import ComboSelect from '../combo-select/combo-select';

jest.useFakeTimers();

describe('Filter Section', () => {
  const selectedFileMock = jest.fn();
  let component;
  let instance;
  let currentReportToggle;
  let yearSelectControl;
  let reportSelectControl;

  const toggleCurrentReport = (value) => {
    currentReportToggle.props.onChange(value);
  };

  const selectFirstYear = () => {
    yearSelectControl.props.changeHandler(yearSelectControl.props.options[1]);
  }

  const selectSecondReportType = () => {
    reportSelectControl.props.changeHandler(reportSelectControl.props.options[1]);
  }

  const reportsMinusXls = reports.slice(0, 3);
  const reportsOnlyXls = reports.slice(-2);

  beforeEach(() => {
    component = renderer.create(
      <FilterSection reports={reports} setSelectedFile={selectedFileMock} />
    );
    instance = component.root;
    jest.runAllTimers();
    currentReportToggle = instance.findByType(CurrentReportToggle);
    reportSelectControl = instance.findAllByType(SelectControl)[0];
    yearSelectControl = instance.findAllByType(SelectControl)[1];
  });

  it('shows a Report dropdown if the reports array contains more than one filetype', () => {
    expect(reportSelectControl.type).toBe(SelectControl);
  });

  it(`changes the list of available published files depending on the option selected
            from the dropdown`, () => {
    renderer.act(selectSecondReportType);
    expect(reportSelectControl.props.selectedOption.value).toStrictEqual(reportsOnlyXls);
  });

  it('displays filter section with title', () => {
    const filterHeader = instance.findByProps({'data-testid': 'filterHeader'});
    expect(filterHeader.type).toBe('h3');
    expect(filterHeader.children[0]).toBe('Select Report Date:');
  });

  it('displays the year label', () => {
    const yearLabel = instance.findByProps({'data-testid': 'yearLabel'});
    expect(yearLabel.children[0]).toContain('Year');
  });

  it('displays the SelectControl for the year dropdown', () => {
    expect(yearSelectControl.type).toBe(SelectControl);
  });

  it('sets the selected year when a selection is made', () => {
    renderer.act(selectFirstYear);

    expect(yearSelectControl.props.selectedOption.value).toBe(2020)
  });

  it('reveals the month selector when the year selector is engaged', () => {
    let monthSelector = instance.findAllByProps({'data-testid': 'month-wrapper'})

    expect(monthSelector.length).toBe(0);

    renderer.act(selectFirstYear);

    monthSelector = instance.findByProps({'data-testid': 'month-wrapper'})

    expect(monthSelector.findByType(SelectControl).props.label).toBeDefined();
  });

  it('shows only months available in reports filtered by year', () => {
    renderer.act(selectFirstYear);

    const monthSelector = instance.findByProps({'data-testid': 'month-wrapper'});
    const monthSelect = monthSelector.findByType(SelectControl);

    expect(monthSelect.props.options.length).toBe(3)
  });

  it('updates the selectedReport and informs the toggle control', () => {
    renderer.act(selectFirstYear);

    const monthSelector = instance.findByProps({'data-testid': 'month-wrapper'});
    const monthSelect = monthSelector.findByType(SelectControl);

    renderer.act(() => {
      toggleCurrentReport();
      monthSelect.props.changeHandler(monthSelect.props.options[1])
    });

    expect(selectedFileMock).toHaveBeenCalledWith(reports[1]);
    const toggle = instance.findByType(CurrentReportToggle);

    // notifies toggle contol of the user selected report
    expect(toggle.props.filteredByDateSelection).toStrictEqual([reports[1]]);

    renderer.act(() => {
      monthSelect.props.changeHandler(monthSelect.props.options[0])
    })

    expect(selectedFileMock).toHaveBeenCalledWith(null);

    // notifies toggle contol the user no longer has a valid date filtered report
    expect(toggle.props.filteredByDateSelection).toStrictEqual([]);
  });

  it(`renders a toggle control for current or previous report selection with a
  reports prop`, () => {
    expect(currentReportToggle.props.reports.value).toStrictEqual(reportsMinusXls);
  });

  it(`reveals the filter dropdowns when the current report is deselected through the
  toggle changeHandler`, () => {
    // collapsed at initial render
    expect(instance.findByProps({ 'data-testid': 'filterCollapsible' }).props.className)
      .toContain(styles.hiddenFilters);
    renderer.act(toggleCurrentReport);
    expect(instance.findByProps({ 'data-testid': 'filterCollapsible' }).props.className)
      .not.toContain(styles.hiddenFilters);
  });

  it(`hides the filter dropdowns when a current report is selected through the
  toggle changeHandler`, () => {
    // first make the filters visible
    renderer.act(toggleCurrentReport);
    expect(instance.findByProps({ 'data-testid': 'filterCollapsible' }).props.className)
      .not.toContain(styles.hiddenFilters);

    renderer.act(() => {
      toggleCurrentReport(reports[0]);
    });
    expect(instance.findByProps({ 'data-testid': 'filterCollapsible' }).props.className)
      .toContain(styles.hiddenFilters);
  });

  it(`uses the ComboSelect component for year selection when more than ten year options are
  available`, () => {
    const manyYearOptions = [];
    // make a long set of mock report configs from a sample reports mock object
    for (let year = 2020; year > 2009; year--) {
      const annualReportConfig = {};
      Object.assign(annualReportConfig, reports[0]);
      annualReportConfig.report_date = new Date(year, 5, 6);
      manyYearOptions.push(annualReportConfig);
    }
    const comboCaseComponent = renderer.create(
      <FilterSection reports={manyYearOptions} setSelectedFile={selectedFileMock} />
    );
    const comboCaseInstance = comboCaseComponent.root;
    jest.runAllTimers();
    expect(comboCaseInstance.findByType(ComboSelect)).toBeDefined();
  });

});
