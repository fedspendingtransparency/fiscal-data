import {act, fireEvent, render, waitFor} from "@testing-library/react";
import React from "react";
import MenuDropdown from "./menu-dropdown";

jest.useFakeTimers();

describe('Menu Dropdown', () => {

  const mockTopicsContent = {
    title: 'Topics',
    children: [
      {
        header: 'AMERICA\'S FINANCE GUIDE',
        analyticsAction: 'Topics Click',
        children: [
          {
            to: '/americas-finance-guide/',
            title: 'Overview',
          }
        ]
      }
    ],
  };
  const setActiveDropdown = jest.fn();
  let activeDropdown = 'Topics';
  setActiveDropdown.mockImplementation((value) => {
    activeDropdown = value;
  })

  const mockToolsContent = {
      title: 'Tools',
      children: [
        {
          to: '/currency-exchange-rates-converter/',
          title: 'Currency Exchange Rates Converter'
        }
      ]
    };

  it('collapses the dropdown when mouse is not over tab or menu', async () => {
    const { queryByTestId, getByRole } = render(
      <MenuDropdown
        content={mockTopicsContent}
        setActiveDropdown={setActiveDropdown}
        activeDropdown={activeDropdown}
      />
    );
    const topicsButton = getByRole('button', {name: 'Topics'})
    let dropdownContent;

    fireEvent.mouseEnter(topicsButton);
    await waitFor(() => {
      dropdownContent = queryByTestId('dropdownContent');
      expect(dropdownContent).toBeTruthy();
    });

    fireEvent.mouseLeave(dropdownContent);
    await waitFor(() => {
      expect(setActiveDropdown).toHaveBeenCalledWith(null);
    });
  });

  it('renders the subheader and children for dropdown content', () => {
    const {getByText, getByRole } = render(
      <MenuDropdown
        content={mockTopicsContent}
        setActiveDropdown={setActiveDropdown}
        activeDropdown={activeDropdown}
      />
    );
    const topicsButton = getByRole('button', {name: 'Topics'})

    act(() => {
      fireEvent.mouseEnter(topicsButton);
      jest.runAllTimers();
    })
    expect(getByText('AMERICA\'S FINANCE GUIDE')).toBeInTheDocument();
    expect(getByRole('link', {name: 'Overview'})).toBeInTheDocument();
  });

  it('renders the children for dropdown content', () => {
    const {getByRole } = render(
      <MenuDropdown
        content={mockToolsContent}
        setActiveDropdown={setActiveDropdown}
        activeDropdown={activeDropdown}
      />
    );
    const toolsButton = getByRole('button', {name: 'Tools'})

    act(() => {
      fireEvent.mouseEnter(toolsButton);
      jest.runAllTimers();
    })
    expect(getByRole('link', {name: 'Currency Exchange Rates Converter'})).toBeInTheDocument();
  });
})
