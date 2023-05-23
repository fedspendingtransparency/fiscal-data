import {fireEvent, render} from "@testing-library/react";
import MobileMenuDropdown from "./mobile-menu-dropdown";
import React from "react";
import Analytics from "../../../../utils/analytics/analytics";

const testSections = [
  {
    sectionHeader: 'AMERICA\'S FINANCE GUIDE',
    analyticsAction: 'Topics Click',
    children: [
      {
        to: '/americas-finance-guide/',
        name: 'Overview'
      },
      {
        to: '/americas-finance-guide/government-revenue/',
        name: 'Revenue'
      },
      {
        to: '/americas-finance-guide/federal-spending/',
        name: 'Spending'
      },
    ]
  },
  {
    sectionHeader: 'ANOTHER SECTION',
    analyticsAction: 'Topics Click',
    children: [
      {
        to: '/americas-finance-guide/',
        name: 'Test Section'
      },
      {
        to: '/americas-finance-guide/government-revenue/',
        name: 'A Second Test Section'
      },
      {
        to: '/',
        name: 'Glossary'
      }
    ]
  }
]

describe('Mobile Menu Dropdown', () => {
  it('contains provided header', () => {
    const { getByText } = render(<MobileMenuDropdown header={'Header'} sections={testSections} />);
    expect(getByText('Header')).toBeDefined();
  });

  it('dropdown is closed by default', () => {
    const { getByText, getByRole } = render(<MobileMenuDropdown header={'Header'} sections={testSections} />);
    expect(getByText('Header')).not.toHaveClass('headerExpanded');
    expect(getByRole('img', {hidden: true})).toHaveClass('fa-caret-right');
  });

  it('dropdown is open by default when defaultOpen is true', () => {
    const { getByText, getByRole } = render(<MobileMenuDropdown header={'Header'} sections={testSections} defaultOpen />);
    expect(getByText('Header')).toHaveClass('headerExpanded');
    expect(getByRole('img', {hidden: true})).toHaveClass('fa-caret-down');
  });

  it('opens dropdown on click', () => {
    const { getByText } = render(<MobileMenuDropdown header={'Header'} sections={testSections} />);
    const header =getByText('Header');
    expect(getByText('Header')).not.toHaveClass('headerExpanded');
    fireEvent.click(header);
    expect(getByText('Header')).toHaveClass('headerExpanded');
  });

  it('opens/closes dropdown on enter key press', () => {
    const { getByText } = render(<MobileMenuDropdown header={'Header'} sections={testSections} />);
    const header =getByText('Header');
    expect(getByText('Header')).not.toHaveClass('headerExpanded');
    fireEvent.keyPress(header, {key: 'Enter', code: 'Enter', charCode: 13})
    expect(getByText('Header')).toHaveClass('headerExpanded');
    fireEvent.keyPress(header, {key: 'Enter', code: 'Enter', charCode: 13})
    expect(getByText('Header')).not.toHaveClass('headerExpanded');
  });

  it('renders all section headers', () => {
    const { getByText } = render(<MobileMenuDropdown header={'Header'} sections={testSections} defaultOpen />);
    expect(getByText('AMERICA\'S FINANCE GUIDE')).toBeInTheDocument();
    expect(getByText('ANOTHER SECTION')).toBeInTheDocument();
  });

  it('renders all section links', () => {
    const { getByText } = render(<MobileMenuDropdown header={'Header'} sections={testSections} defaultOpen />);
    expect(getByText('AMERICA\'S FINANCE GUIDE')).toBeInTheDocument();
    expect(getByText('Overview')).toBeInTheDocument();
    expect(getByText('Revenue')).toBeInTheDocument();
    expect(getByText('Spending')).toBeInTheDocument();
    expect(getByText('Test Section')).toBeInTheDocument();
    expect(getByText('A Second Test Section')).toBeInTheDocument();
    expect(getByText('Glossary')).toBeInTheDocument();
  });

  it('calls the appropriate analytics event when links are clicked on', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByText } = render(<MobileMenuDropdown header={'Header'} sections={testSections} defaultOpen />);

    const spendingButton = getByText('Spending');
    spendingButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Topics Click`,
      label: 'Spending'
    });
    spy.mockClear();
  });

  it('sets open state for glossary and closed state for menu when glossary selected', () => {
    const setGlossaryOpenMock = jest.fn();
    const setActiveStateMock = jest.fn();
    const { getByText } = render(<MobileMenuDropdown header={'Header'} 
                                                     sections={testSections} 
                                                     defaultOpen 
                                                     setActiveState={setActiveStateMock}
                                                     setOpenGlossary={setGlossaryOpenMock}/>);

    getByText('Glossary').click();

    expect(setGlossaryOpenMock).toHaveBeenCalledWith(true);
    expect(setActiveStateMock).toHaveBeenCalledWith(false);
  });
})
