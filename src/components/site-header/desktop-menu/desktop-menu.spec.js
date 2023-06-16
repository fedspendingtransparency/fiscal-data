import {StaticQuery, useStaticQuery} from "gatsby";
import {mockUseStaticGlossaryData} from "../../glossary/test-helper";
import {act, fireEvent, render, waitFor, within} from "@testing-library/react";
import React from "react";
import * as styles from "../site-header.module.scss";
import DesktopMenu from "./desktop-menu";

jest.useFakeTimers();

describe('Desktop Menu', () => {
  const glossaryClickHandler = jest.fn();
  const clickHandler = jest.fn();
  const setActiveDropdown = jest.fn();


  beforeEach(() => {
    StaticQuery.mockImplementation(({ render }) => render({ mockUseStaticGlossaryData }));
    useStaticQuery.mockImplementation(() => {
      return {
        ...mockUseStaticGlossaryData
      };
    });
  });

  it('contains one link to the dataset search', () => {
    const setActiveDropdown = jest.fn();
    let activeDropdown = null;
    setActiveDropdown.mockImplementation((value) => {
      activeDropdown = value;
    })

    const { getByRole } = render(
      <DesktopMenu
        glossaryClickHandler={glossaryClickHandler}
        clickHandler={clickHandler}
        setActiveDropdown={setActiveDropdown}
      />
    );

    const datasetButton = getByRole('button', {name: 'Dataset Search'});

    expect(datasetButton).toBeInTheDocument();

    fireEvent.mouseEnter(datasetButton);
    expect(setActiveDropdown).toHaveBeenCalledWith('Dataset Search');
  });

  it('contains one link to the about us page', () => {
    const { getAllByTestId } = render(
      <DesktopMenu
        glossaryClickHandler={glossaryClickHandler}
        clickHandler={clickHandler}
        setActiveDropdown={setActiveDropdown}
      />
    );
    expect(getAllByTestId('about').length).toEqual(1);
  });

  it('displays the topics button', () => {
    const { getByRole } = render(
      <DesktopMenu
        glossaryClickHandler={glossaryClickHandler}
        clickHandler={clickHandler}
        setActiveDropdown={setActiveDropdown}
      />
    );
    expect(getByRole('button', {name: 'Topics'})).toBeInTheDocument();
  });

  it('displays the topics drop down when mousing over topics button', () => {
    const { getByRole } = render(
      <DesktopMenu
        glossaryClickHandler={glossaryClickHandler}
        clickHandler={clickHandler}
        setActiveDropdown={setActiveDropdown}
      />
    );
    act(() => {
      fireEvent.mouseEnter(getByRole('button', {name: 'Topics'}))
      jest.runAllTimers();
    })
    expect(getByRole('link', {name: 'Overview'})).toBeInTheDocument();
    expect(getByRole('link', {name: 'Debt'})).toBeInTheDocument();
    expect(getByRole('link', {name: 'Deficit'})).toBeInTheDocument();
    expect(getByRole('link', {name: 'Spending'})).toBeInTheDocument();
    expect(getByRole('link', {name: 'Revenue'})).toBeInTheDocument();
  });

  it('displays the tools drop down when mousing over tool button', () => {
    const { getByRole } = render(
      <DesktopMenu
        glossaryClickHandler={glossaryClickHandler}
        clickHandler={clickHandler}
        setActiveDropdown={setActiveDropdown}
      />
    );
    act(() => {
      fireEvent.mouseEnter(getByRole('button', {name: 'Tools'}));
      jest.runAllTimers();
    })
    expect(getByRole('link', {name: 'Currency Exchange Rates Converter'})).toBeInTheDocument();
  });

  it('displays the resources drop down when mousing over resources button', () => {
    const { getByRole } = render(
      <DesktopMenu
        glossaryClickHandler={glossaryClickHandler}
        clickHandler={clickHandler}
        setActiveDropdown={setActiveDropdown}
      />
    );
    act(() => {
      fireEvent.mouseEnter(getByRole('button', {name: 'Resources'}));
      jest.runAllTimers();
    })
    expect(getByRole('button', {name: 'Glossary'})).toBeInTheDocument();
    expect(getByRole('link', {name: 'API Documentation'})).toBeInTheDocument();
    expect(getByRole('link', {name: 'Release Calendar'})).toBeInTheDocument();
  });

  it('expects that all of the header links are not active/highlighted by default', () => {
    const { container } = render(
      <DesktopMenu
        glossaryClickHandler={glossaryClickHandler}
        clickHandler={clickHandler}
        setActiveDropdown={setActiveDropdown}
      />
    );

    expect(container
      .getElementsByClassName(`${styles.activeLink}`).length
    ).toBe(0);
  });

  it('collapses the dropdown when tab is not focused on or within dropdown', async () => {
    let activeDropdown = 'Topics';
    setActiveDropdown.mockImplementation((value) => {
      activeDropdown = value;
    })

    const {getByText, queryByTestId, getByRole } = render(
      <DesktopMenu
        glossaryClickHandler={glossaryClickHandler}
        clickHandler={clickHandler}
        setActiveDropdown={setActiveDropdown}
      />
    );

    getByRole('button', {name: 'Topics'}).focus();
    await waitFor(() => {
      expect(queryByTestId('dropdownContent')).toBeTruthy();
    });

    getByText('Overview').focus();
    await waitFor(() => {
      expect(queryByTestId('dropdownContent')).toBeTruthy();
    });

    act(() => {
      getByRole('button', {name: 'Dataset Search'}).focus();
      jest.runAllTimers();
    })
    await waitFor(() => {
      expect(setActiveDropdown).toHaveBeenCalledWith(null);
    });
  });
})
